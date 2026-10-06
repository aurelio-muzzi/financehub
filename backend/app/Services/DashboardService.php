<?php

namespace App\Services;

use App\Models\Account;
use App\Models\Transaction;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\DB;

class DashboardService
{
    /**
     * Retorna métricas financeiras consolidadas e comparação com o mês anterior.
     *
     * @return array<string, mixed>
     */
    public function getMetrics(User $user): array
    {
        $now = Carbon::now();
        $startOfMonth = $now->copy()->startOfMonth()->format('Y-m-d');
        $endOfMonth = $now->copy()->endOfMonth()->format('Y-m-d');

        $startOfPrevMonth = $now->copy()->subMonth()->startOfMonth()->format('Y-m-d');
        $endOfPrevMonth = $now->copy()->subMonth()->endOfMonth()->format('Y-m-d');

        // Saldo consolidado das contas ativas
        $totalBalance = (float) Account::query()
            ->forUser($user->id)
            ->active()
            ->sum('current_balance');

        // Receitas e Despesas do mês atual
        $monthlyIncome = (float) Transaction::query()
            ->forUser($user->id)
            ->ofType('INCOME')
            ->ofStatus('COMPLETED')
            ->forPeriod($startOfMonth, $endOfMonth)
            ->sum('amount');

        $monthlyExpense = (float) Transaction::query()
            ->forUser($user->id)
            ->ofType('EXPENSE')
            ->ofStatus('COMPLETED')
            ->forPeriod($startOfMonth, $endOfMonth)
            ->sum('amount');

        $monthlyNet = $monthlyIncome - $monthlyExpense;
        $savingsRate = $monthlyIncome > 0 ? round(($monthlyNet / $monthlyIncome) * 100, 1) : 0.0;

        // Mês anterior para cálculo de variação %
        $prevIncome = (float) Transaction::query()
            ->forUser($user->id)
            ->ofType('INCOME')
            ->ofStatus('COMPLETED')
            ->forPeriod($startOfPrevMonth, $endOfPrevMonth)
            ->sum('amount');

        $prevExpense = (float) Transaction::query()
            ->forUser($user->id)
            ->ofType('EXPENSE')
            ->ofStatus('COMPLETED')
            ->forPeriod($startOfPrevMonth, $endOfPrevMonth)
            ->sum('amount');

        $incomeChangePercent = $prevIncome > 0
            ? round((($monthlyIncome - $prevIncome) / $prevIncome) * 100, 1)
            : 0.0;

        $expenseChangePercent = $prevExpense > 0
            ? round((($monthlyExpense - $prevExpense) / $prevExpense) * 100, 1)
            : 0.0;

        return [
            'total_balance' => number_format($totalBalance, 2, '.', ''),
            'monthly_income' => number_format($monthlyIncome, 2, '.', ''),
            'monthly_expense' => number_format($monthlyExpense, 2, '.', ''),
            'monthly_net' => number_format($monthlyNet, 2, '.', ''),
            'savings_rate' => $savingsRate,
            'prev_income' => number_format($prevIncome, 2, '.', ''),
            'prev_expense' => number_format($prevExpense, 2, '.', ''),
            'income_change_percent' => $incomeChangePercent,
            'expense_change_percent' => $expenseChangePercent,
        ];
    }

    /**
     * Retorna a evolução de fluxo de caixa dos últimos 6 meses.
     *
     * @return list<array<string, mixed>>
     */
    public function getCashFlowHistory(User $user, int $months = 6): array
    {
        $data = [];
        $now = Carbon::now();

        for ($i = $months - 1; $i >= 0; $i--) {
            $monthDate = $now->copy()->subMonths($i);
            $start = $monthDate->copy()->startOfMonth()->format('Y-m-d');
            $end = $monthDate->copy()->endOfMonth()->format('Y-m-d');

            $income = (float) Transaction::query()
                ->forUser($user->id)
                ->ofType('INCOME')
                ->ofStatus('COMPLETED')
                ->forPeriod($start, $end)
                ->sum('amount');

            $expense = (float) Transaction::query()
                ->forUser($user->id)
                ->ofType('EXPENSE')
                ->ofStatus('COMPLETED')
                ->forPeriod($start, $end)
                ->sum('amount');

            $data[] = [
                'period' => $monthDate->translatedFormat('M/y'),
                'year_month' => $monthDate->format('Y-m'),
                'income' => round($income, 2),
                'expense' => round($expense, 2),
                'net' => round($income - $expense, 2),
            ];
        }

        return $data;
    }

    /**
     * Retorna a distribuição de despesas por categoria no período.
     *
     * @return list<array<string, mixed>>
     */
    public function getExpensesByCategory(User $user, ?string $startDate = null, ?string $endDate = null): array
    {
        $now = Carbon::now();
        $startDate = $startDate ?? $now->copy()->startOfMonth()->format('Y-m-d');
        $endDate = $endDate ?? $now->copy()->endOfMonth()->format('Y-m-d');

        $query = Transaction::query()
            ->select('category_id', DB::raw('SUM(amount) as total_amount'))
            ->forUser($user->id)
            ->ofType('EXPENSE')
            ->ofStatus('COMPLETED')
            ->forPeriod($startDate, $endDate)
            ->groupBy('category_id')
            ->with('category');

        $results = $query->get();
        $totalExpenses = (float) $results->sum('total_amount');

        $categoryDistribution = [];

        foreach ($results as $item) {
            $amount = (float) $item->total_amount;
            $percentage = $totalExpenses > 0 ? round(($amount / $totalExpenses) * 100, 1) : 0.0;

            $categoryDistribution[] = [
                'category_id' => $item->category_id,
                'name' => $item->category->name ?? 'Geral / Outros',
                'color' => $item->category->color ?? '#64748b',
                'amount' => round($amount, 2),
                'percentage' => $percentage,
            ];
        }

        usort($categoryDistribution, fn ($a, $b) => $b['amount'] <=> $a['amount']);

        return $categoryDistribution;
    }

    /**
     * Retorna as transações mais recentes para o resumo rápido.
     *
     * @return Collection<int, Transaction>
     */
    public function getRecentTransactions(User $user, int $limit = 5)
    {
        return Transaction::query()
            ->forUser($user->id)
            ->with(['account', 'category', 'destinationAccount'])
            ->orderBy('date', 'desc')
            ->orderBy('id', 'desc')
            ->limit($limit)
            ->get();
    }
}
