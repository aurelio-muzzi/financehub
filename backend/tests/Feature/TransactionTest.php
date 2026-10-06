<?php

namespace Tests\Feature;

use App\Models\Account;
use App\Models\Category;
use App\Models\Role;
use App\Models\Transaction;
use App\Models\User;
use App\Services\TransactionService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TransactionTest extends TestCase
{
    use RefreshDatabase;

    protected User $user;

    protected User $otherUser;

    protected Account $account;

    protected Account $secondaryAccount;

    protected Category $incomeCategory;

    protected Category $expenseCategory;

    protected function setUp(): void
    {
        parent::setUp();

        $role = Role::create(['name' => 'user', 'label' => 'Usuário']);

        $this->user = User::factory()->create(['role_id' => $role->id]);
        $this->otherUser = User::factory()->create(['role_id' => $role->id]);

        $this->account = Account::create([
            'user_id' => $this->user->id,
            'name' => 'Conta Corrente',
            'type' => 'BANK',
            'initial_balance' => '1000.00',
            'current_balance' => '1000.00',
            'is_active' => true,
        ]);

        $this->secondaryAccount = Account::create([
            'user_id' => $this->user->id,
            'name' => 'Poupança',
            'type' => 'INVESTMENT',
            'initial_balance' => '500.00',
            'current_balance' => '500.00',
            'is_active' => true,
        ]);

        $this->incomeCategory = Category::create([
            'user_id' => $this->user->id,
            'name' => 'Salário',
            'type' => 'INCOME',
            'is_active' => true,
        ]);

        $this->expenseCategory = Category::create([
            'user_id' => $this->user->id,
            'name' => 'Supermercado',
            'type' => 'EXPENSE',
            'is_active' => true,
        ]);
    }

    public function test_lists_transactions_belonging_only_to_authenticated_user(): void
    {
        Transaction::create([
            'user_id' => $this->user->id,
            'account_id' => $this->account->id,
            'category_id' => $this->incomeCategory->id,
            'type' => 'INCOME',
            'amount' => '250.00',
            'date' => '2026-10-01',
            'description' => 'Minha Receita',
        ]);

        $otherAccount = Account::create([
            'user_id' => $this->otherUser->id,
            'name' => 'Conta Alheia',
            'type' => 'BANK',
            'initial_balance' => '0.00',
            'current_balance' => '0.00',
            'is_active' => true,
        ]);

        Transaction::create([
            'user_id' => $this->otherUser->id,
            'account_id' => $otherAccount->id,
            'type' => 'INCOME',
            'amount' => '999.00',
            'date' => '2026-10-01',
            'description' => 'Receita de Outro Usuário',
        ]);

        $response = $this->actingAs($this->user)->getJson('/api/v1/transactions');

        $response->assertOk();
        $response->assertJsonCount(1, 'data');
        $response->assertJsonFragment(['description' => 'Minha Receita']);
        $response->assertJsonMissing(['description' => 'Receita de Outro Usuário']);
    }

    public function test_creates_income_transaction_and_increments_account_balance(): void
    {
        $payload = [
            'account_id' => $this->account->id,
            'category_id' => $this->incomeCategory->id,
            'type' => 'INCOME',
            'amount' => 500.00,
            'date' => '2026-10-05',
            'description' => 'Venda de Item',
            'payment_method' => 'PIX',
            'status' => 'COMPLETED',
        ];

        $response = $this->actingAs($this->user)->postJson('/api/v1/transactions', $payload);

        $response->assertCreated();
        $response->assertJsonFragment(['description' => 'Venda de Item', 'amount' => '500.00']);

        $this->account->refresh();
        $this->assertEquals('1500.00', $this->account->current_balance);
    }

    public function test_creates_expense_transaction_and_decrements_account_balance(): void
    {
        $payload = [
            'account_id' => $this->account->id,
            'category_id' => $this->expenseCategory->id,
            'type' => 'EXPENSE',
            'amount' => 300.00,
            'date' => '2026-10-05',
            'description' => 'Compras no Mercado',
            'payment_method' => 'DEBIT_CARD',
            'status' => 'COMPLETED',
        ];

        $response = $this->actingAs($this->user)->postJson('/api/v1/transactions', $payload);

        $response->assertCreated();

        $this->account->refresh();
        $this->assertEquals('700.00', $this->account->current_balance);
    }

    public function test_creates_transfer_debiting_origin_and_crediting_destination(): void
    {
        $payload = [
            'account_id' => $this->account->id,
            'destination_account_id' => $this->secondaryAccount->id,
            'type' => 'TRANSFER',
            'amount' => 400.00,
            'date' => '2026-10-05',
            'description' => 'Transferência para Poupança',
            'payment_method' => 'TRANSFER',
            'status' => 'COMPLETED',
        ];

        $response = $this->actingAs($this->user)->postJson('/api/v1/transactions', $payload);

        $response->assertCreated();

        $this->account->refresh();
        $this->secondaryAccount->refresh();

        $this->assertEquals('600.00', $this->account->current_balance);
        $this->assertEquals('900.00', $this->secondaryAccount->current_balance);
    }

    public function test_rejects_transfer_with_identical_origin_and_destination_account(): void
    {
        $payload = [
            'account_id' => $this->account->id,
            'destination_account_id' => $this->account->id,
            'type' => 'TRANSFER',
            'amount' => 100.00,
            'date' => '2026-10-05',
            'description' => 'Transferência Inválida',
        ];

        $response = $this->actingAs($this->user)->postJson('/api/v1/transactions', $payload);

        $response->assertStatus(422);
        $response->assertJsonValidationErrors(['destination_account_id']);
    }

    public function test_rejects_transaction_referencing_account_belonging_to_another_user(): void
    {
        $otherAccount = Account::create([
            'user_id' => $this->otherUser->id,
            'name' => 'Conta Alheia',
            'type' => 'BANK',
            'initial_balance' => '500.00',
            'current_balance' => '500.00',
            'is_active' => true,
        ]);

        $payload = [
            'account_id' => $otherAccount->id,
            'type' => 'INCOME',
            'amount' => 100.00,
            'date' => '2026-10-05',
            'description' => 'Tentativa Indevida',
        ];

        $response = $this->actingAs($this->user)->postJson('/api/v1/transactions', $payload);

        $response->assertStatus(422);
        $response->assertJsonValidationErrors(['account_id']);
    }

    public function test_updates_transaction_and_recalculates_balance_accurately(): void
    {
        $transaction = app(TransactionService::class)->create($this->user, [
            'account_id' => $this->account->id,
            'type' => 'EXPENSE',
            'amount' => 200.00,
            'date' => '2026-10-05',
            'description' => 'Almoço',
            'status' => 'COMPLETED',
        ]);

        $this->account->refresh();
        $this->assertEquals('800.00', $this->account->current_balance);

        // Atualizar valor de 200 para 250
        $response = $this->actingAs($this->user)->putJson("/api/v1/transactions/{$transaction->id}", [
            'account_id' => $this->account->id,
            'type' => 'EXPENSE',
            'amount' => 250.00,
            'date' => '2026-10-05',
            'description' => 'Almoço e Sobremesa',
            'status' => 'COMPLETED',
        ]);

        $response->assertOk();

        $this->account->refresh();
        $this->assertEquals('750.00', $this->account->current_balance);
    }

    public function test_deletes_transaction_and_reverses_balance_effect(): void
    {
        $transaction = app(TransactionService::class)->create($this->user, [
            'account_id' => $this->account->id,
            'type' => 'EXPENSE',
            'amount' => 150.00,
            'date' => '2026-10-05',
            'description' => 'Farmácia',
            'status' => 'COMPLETED',
        ]);

        $this->account->refresh();
        $this->assertEquals('850.00', $this->account->current_balance);

        $response = $this->actingAs($this->user)->deleteJson("/api/v1/transactions/{$transaction->id}");

        $response->assertOk();

        $this->account->refresh();
        $this->assertEquals('1000.00', $this->account->current_balance);
        $this->assertSoftDeleted('transactions', ['id' => $transaction->id]);
    }

    public function test_returns_period_financial_summary(): void
    {
        $service = app(TransactionService::class);

        $service->create($this->user, [
            'account_id' => $this->account->id,
            'type' => 'INCOME',
            'amount' => 1000.00,
            'date' => '2026-10-01',
            'description' => 'Receita 1',
            'status' => 'COMPLETED',
        ]);

        $service->create($this->user, [
            'account_id' => $this->account->id,
            'type' => 'EXPENSE',
            'amount' => 350.00,
            'date' => '2026-10-02',
            'description' => 'Despesa 1',
            'status' => 'COMPLETED',
        ]);

        $response = $this->actingAs($this->user)->getJson('/api/v1/transactions/summary?start_date=2026-10-01&end_date=2026-10-31');

        $response->assertOk();
        $response->assertJson([
            'data' => [
                'total_income' => '1000.00',
                'total_expense' => '350.00',
                'net_balance' => '650.00',
                'count' => 2,
            ],
        ]);
    }
}
