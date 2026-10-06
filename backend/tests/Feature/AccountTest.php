<?php

namespace Tests\Feature;

use App\Models\Account;
use App\Models\Role;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AccountTest extends TestCase
{
    use RefreshDatabase;

    protected User $user;

    protected User $otherUser;

    protected function setUp(): void
    {
        parent::setUp();

        $role = Role::create(['name' => 'user', 'label' => 'Usuário Padrão']);

        $this->user = User::factory()->create(['role_id' => $role->id]);
        $this->otherUser = User::factory()->create(['role_id' => $role->id]);
    }

    public function test_user_can_list_only_own_accounts(): void
    {
        Account::create([
            'name' => 'Minha Conta Corrente',
            'type' => 'BANK',
            'initial_balance' => 1500.00,
            'current_balance' => 1500.00,
            'user_id' => $this->user->id,
        ]);

        Account::create([
            'name' => 'Conta do Outro Usuário',
            'type' => 'BANK',
            'initial_balance' => 5000.00,
            'current_balance' => 5000.00,
            'user_id' => $this->otherUser->id,
        ]);

        $response = $this->actingAs($this->user, 'web')->getJson('/api/v1/accounts');

        $response->assertStatus(200)
            ->assertJsonPath('success', true);

        $accounts = collect($response->json('data'));
        $this->assertCount(1, $accounts);
        $this->assertEquals('Minha Conta Corrente', $accounts->first()['name']);
    }

    public function test_user_can_create_account_with_initial_balance(): void
    {
        $response = $this->actingAs($this->user, 'web')->postJson('/api/v1/accounts', [
            'name' => 'Carteira Digital XPTO',
            'type' => 'DIGITAL_WALLET',
            'initial_balance' => 750.50,
            'color' => '#3b82f6',
            'icon' => 'Wallet',
        ]);

        $response->assertStatus(201)
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.name', 'Carteira Digital XPTO')
            ->assertJsonPath('data.current_balance', '750.50');

        $this->assertDatabaseHas('accounts', [
            'name' => 'Carteira Digital XPTO',
            'user_id' => $this->user->id,
            'current_balance' => 750.50,
        ]);
    }

    public function test_user_can_view_own_account_details(): void
    {
        $account = Account::create([
            'name' => 'Investimentos Futuros',
            'type' => 'INVESTMENT',
            'initial_balance' => 3000.00,
            'current_balance' => 3000.00,
            'user_id' => $this->user->id,
        ]);

        $response = $this->actingAs($this->user, 'web')->getJson("/api/v1/accounts/{$account->id}");

        $response->assertStatus(200)
            ->assertJsonPath('data.id', $account->id);
    }

    public function test_user_cannot_view_other_user_account(): void
    {
        $otherAccount = Account::create([
            'name' => 'Investimento Alheio',
            'type' => 'INVESTMENT',
            'user_id' => $this->otherUser->id,
        ]);

        $response = $this->actingAs($this->user, 'web')->getJson("/api/v1/accounts/{$otherAccount->id}");

        $response->assertStatus(403);
    }

    public function test_user_can_update_own_account(): void
    {
        $account = Account::create([
            'name' => 'Conta Original',
            'type' => 'BANK',
            'user_id' => $this->user->id,
        ]);

        $response = $this->actingAs($this->user, 'web')->patchJson("/api/v1/accounts/{$account->id}", [
            'name' => 'Conta Renomeada',
        ]);

        $response->assertStatus(200)
            ->assertJsonPath('data.name', 'Conta Renomeada');

        $this->assertEquals('Conta Renomeada', $account->fresh()->name);
    }

    public function test_user_cannot_update_other_user_account(): void
    {
        $otherAccount = Account::create([
            'name' => 'Conta de Outro',
            'type' => 'BANK',
            'user_id' => $this->otherUser->id,
        ]);

        $response = $this->actingAs($this->user, 'web')->patchJson("/api/v1/accounts/{$otherAccount->id}", [
            'name' => 'Tentativa Indevida',
        ]);

        $response->assertStatus(403);
    }

    public function test_user_can_soft_delete_account(): void
    {
        $account = Account::create([
            'name' => 'Conta para Excluir',
            'type' => 'CASH',
            'user_id' => $this->user->id,
        ]);

        $response = $this->actingAs($this->user, 'web')->deleteJson("/api/v1/accounts/{$account->id}");

        $response->assertStatus(200);
        $this->assertSoftDeleted('accounts', ['id' => $account->id]);
    }

    public function test_user_can_consult_account_balance(): void
    {
        $account = Account::create([
            'name' => 'Saldo Ativo',
            'type' => 'BANK',
            'initial_balance' => 1250.75,
            'current_balance' => 1250.75,
            'user_id' => $this->user->id,
        ]);

        $response = $this->actingAs($this->user, 'web')->getJson("/api/v1/accounts/{$account->id}/balance");

        $response->assertStatus(200)
            ->assertJsonPath('data.account_id', $account->id)
            ->assertJsonPath('data.current_balance', '1250.75');
    }

    public function test_account_creation_fails_with_invalid_type(): void
    {
        $response = $this->actingAs($this->user, 'web')->postJson('/api/v1/accounts', [
            'name' => 'Tipo Inválido',
            'type' => 'TIPO_QUE_NAO_EXISTE',
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['type']);
    }
}
