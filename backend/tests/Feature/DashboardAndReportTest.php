<?php

namespace Tests\Feature;

use App\Models\Account;
use App\Models\Category;
use App\Models\Role;
use App\Models\Transaction;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class DashboardAndReportTest extends TestCase
{
    use RefreshDatabase;

    protected User $user;

    protected Account $account;

    protected Category $incomeCat;

    protected Category $expenseCat;

    protected function setUp(): void
    {
        parent::setUp();

        $role = Role::create(['name' => 'user', 'label' => 'Usuário']);
        $this->user = User::factory()->create(['role_id' => $role->id]);

        $this->account = Account::create([
            'user_id' => $this->user->id,
            'name' => 'Conta Teste',
            'type' => 'BANK',
            'initial_balance' => '2000.00',
            'current_balance' => '2000.00',
            'is_active' => true,
        ]);

        $this->incomeCat = Category::create([
            'user_id' => $this->user->id,
            'name' => 'Salário',
            'type' => 'INCOME',
            'color' => '#10b981',
            'is_active' => true,
        ]);

        $this->expenseCat = Category::create([
            'user_id' => $this->user->id,
            'name' => 'Alimentação',
            'type' => 'EXPENSE',
            'color' => '#ef4444',
            'is_active' => true,
        ]);

        $now = Carbon::now();

        Transaction::create([
            'user_id' => $this->user->id,
            'account_id' => $this->account->id,
            'category_id' => $this->incomeCat->id,
            'type' => 'INCOME',
            'amount' => '3000.00',
            'date' => $now->format('Y-m-d'),
            'description' => 'Salário Mês',
            'status' => 'COMPLETED',
        ]);

        Transaction::create([
            'user_id' => $this->user->id,
            'account_id' => $this->account->id,
            'category_id' => $this->expenseCat->id,
            'type' => 'EXPENSE',
            'amount' => '500.00',
            'date' => $now->format('Y-m-d'),
            'description' => 'Supermercado',
            'status' => 'COMPLETED',
        ]);
    }

    public function test_returns_dashboard_metrics(): void
    {
        $response = $this->actingAs($this->user)->getJson('/api/v1/dashboard/metrics');

        $response->assertOk();
        $response->assertJsonStructure([
            'data' => [
                'total_balance',
                'monthly_income',
                'monthly_expense',
                'monthly_net',
                'savings_rate',
            ],
        ]);

        $this->assertEquals('3000.00', $response->json('data.monthly_income'));
        $this->assertEquals('500.00', $response->json('data.monthly_expense'));
    }

    public function test_returns_cash_flow_history(): void
    {
        $response = $this->actingAs($this->user)->getJson('/api/v1/dashboard/cash-flow?months=6');

        $response->assertOk();
        $response->assertJsonCount(6, 'data');
        $response->assertJsonStructure([
            'data' => [
                '*' => ['period', 'year_month', 'income', 'expense', 'net'],
            ],
        ]);
    }

    public function test_returns_expenses_by_category(): void
    {
        $response = $this->actingAs($this->user)->getJson('/api/v1/dashboard/expenses-by-category');

        $response->assertOk();
        $response->assertJsonCount(1, 'data');
        $response->assertJsonFragment([
            'name' => 'Alimentação',
            'amount' => 500.00,
            'percentage' => 100.0,
        ]);
    }

    public function test_returns_recent_transactions(): void
    {
        $response = $this->actingAs($this->user)->getJson('/api/v1/dashboard/recent-transactions?limit=5');

        $response->assertOk();
        $response->assertJsonCount(2, 'data');
    }

    public function test_returns_analytics_report_for_period(): void
    {
        $now = Carbon::now();
        $start = $now->copy()->startOfMonth()->format('Y-m-d');
        $end = $now->copy()->endOfMonth()->format('Y-m-d');

        $response = $this->actingAs($this->user)->getJson("/api/v1/reports/analytics?start_date={$start}&end_date={$end}");

        $response->assertOk();
        $response->assertJsonStructure([
            'data' => [
                'period',
                'summary' => ['total_income', 'total_expense', 'net_balance', 'total_count'],
                'incomes_by_category',
                'expenses_by_category',
            ],
        ]);
    }

    public function test_exports_statement_as_csv(): void
    {
        $now = Carbon::now();
        $start = $now->copy()->startOfMonth()->format('Y-m-d');
        $end = $now->copy()->endOfMonth()->format('Y-m-d');

        $response = $this->actingAs($this->user)->get("/api/v1/reports/export/csv?start_date={$start}&end_date={$end}");

        $response->assertOk();
        $response->assertHeader('Content-Type', 'text/csv; charset=UTF-8');
        $this->assertStringContainsString('Salário Mês', $response->getContent() ?: '');
        $this->assertStringContainsString('Supermercado', $response->getContent() ?: '');
    }

    public function test_exports_statement_as_pdf(): void
    {
        $now = Carbon::now();
        $start = $now->copy()->startOfMonth()->format('Y-m-d');
        $end = $now->copy()->endOfMonth()->format('Y-m-d');

        $response = $this->actingAs($this->user)->get("/api/v1/reports/export/pdf?start_date={$start}&end_date={$end}");

        $response->assertOk();
        $response->assertHeader('Content-Type', 'application/pdf');
    }
}
