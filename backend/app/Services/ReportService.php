<?php

namespace App\Services;

use App\Models\Transaction;
use App\Models\User;
use Barryvdh\DomPDF\Facade\Pdf;
use Barryvdh\DomPDF\PDF as DomPDF;
use Illuminate\Support\Facades\DB;

class ReportService
{
    /**
     * Retorna o relatório financeiro analítico agrupado por categoria no período.
     *
     * @return array<string, mixed>
     */
    public function getAnalyticsReport(User $user, string $startDate, string $endDate): array
    {
        $transactions = Transaction::query()
            ->forUser($user->id)
            ->where('status', 'COMPLETED')
            ->forPeriod($startDate, $endDate)
            ->with(['category', 'account'])
            ->orderBy('date', 'desc')
            ->get();

        $incomeTotal = (float) $transactions->where('type', 'INCOME')->sum('amount');
        $expenseTotal = (float) $transactions->where('type', 'EXPENSE')->sum('amount');

        // Agrupamento de receitas por categoria
        $incomesByCategory = Transaction::query()
            ->select('category_id', DB::raw('SUM(amount) as total_amount'), DB::raw('COUNT(*) as total_count'))
            ->forUser($user->id)
            ->ofType('INCOME')
            ->where('status', 'COMPLETED')
            ->forPeriod($startDate, $endDate)
            ->groupBy('category_id')
            ->with('category')
            ->get()
            ->map(function ($row) use ($incomeTotal) {
                $amount = (float) $row->total_amount;

                return [
                    'category_id' => $row->category_id,
                    'name' => $row->category->name ?? 'Receitas Diversas',
                    'color' => $row->category->color ?? '#10b981',
                    'amount' => round($amount, 2),
                    'count' => (int) $row->total_count,
                    'percentage' => $incomeTotal > 0 ? round(($amount / $incomeTotal) * 100, 1) : 0,
                ];
            });

        // Agrupamento de despesas por categoria
        $expensesByCategory = Transaction::query()
            ->select('category_id', DB::raw('SUM(amount) as total_amount'), DB::raw('COUNT(*) as total_count'))
            ->forUser($user->id)
            ->ofType('EXPENSE')
            ->where('status', 'COMPLETED')
            ->forPeriod($startDate, $endDate)
            ->groupBy('category_id')
            ->with('category')
            ->get()
            ->map(function ($row) use ($expenseTotal) {
                $amount = (float) $row->total_amount;

                return [
                    'category_id' => $row->category_id,
                    'name' => $row->category->name ?? 'Despesas Diversas',
                    'color' => $row->category->color ?? '#ef4444',
                    'amount' => round($amount, 2),
                    'count' => (int) $row->total_count,
                    'percentage' => $expenseTotal > 0 ? round(($amount / $expenseTotal) * 100, 1) : 0,
                ];
            });

        return [
            'period' => [
                'start_date' => $startDate,
                'end_date' => $endDate,
            ],
            'summary' => [
                'total_income' => number_format($incomeTotal, 2, '.', ''),
                'total_expense' => number_format($expenseTotal, 2, '.', ''),
                'net_balance' => number_format($incomeTotal - $expenseTotal, 2, '.', ''),
                'total_count' => $transactions->count(),
            ],
            'incomes_by_category' => $incomesByCategory,
            'expenses_by_category' => $expensesByCategory,
        ];
    }

    /**
     * Retorna o conteúdo formatado em CSV para download do extrato.
     */
    public function generateCsv(User $user, string $startDate, string $endDate): string
    {
        $transactions = Transaction::query()
            ->forUser($user->id)
            ->forPeriod($startDate, $endDate)
            ->with(['account', 'category', 'destinationAccount'])
            ->orderBy('date', 'desc')
            ->get();

        $output = fopen('php://temp', 'r+');

        // BOM UTF-8 para Excel abrir sem problemas de acentuação
        fwrite($output, "\xEF\xBB\xBF");

        // Cabeçalho CSV
        fputcsv($output, [
            'ID',
            'Data',
            'Tipo',
            'Descrição',
            'Categoria',
            'Conta de Origem',
            'Conta de Destino',
            'Forma de Pagamento',
            'Status',
            'Valor (R$)',
        ], ';');

        foreach ($transactions as $tx) {
            $categoryName = $tx->category->name ?? ($tx->type === 'TRANSFER' ? 'Transferência' : 'Geral');
            $destAccount = $tx->destinationAccount->name ?? '';

            fputcsv($output, [
                $tx->id,
                $tx->date->format('d/m/Y'),
                $tx->type,
                $tx->description,
                $categoryName,
                $tx->account->name,
                $destAccount,
                $tx->payment_method ?? '',
                $tx->status,
                number_format((float) $tx->amount, 2, ',', ''),
            ], ';');
        }

        rewind($output);
        $csvContent = stream_get_contents($output);
        fclose($output);

        return $csvContent ?: '';
    }

    /**
     * Gera o PDF formatado do relatório via DomPDF.
     */
    public function generatePdf(User $user, string $startDate, string $endDate): DomPDF
    {
        $transactions = Transaction::query()
            ->forUser($user->id)
            ->forPeriod($startDate, $endDate)
            ->with(['account', 'category', 'destinationAccount'])
            ->orderBy('date', 'desc')
            ->get();

        $totalIncome = (float) $transactions->where('type', 'INCOME')->where('status', 'COMPLETED')->sum('amount');
        $totalExpense = (float) $transactions->where('type', 'EXPENSE')->where('status', 'COMPLETED')->sum('amount');
        $netBalance = $totalIncome - $totalExpense;

        return Pdf::loadView('reports.statement_pdf', [
            'user' => $user,
            'startDate' => $startDate,
            'endDate' => $endDate,
            'transactions' => $transactions,
            'totalIncome' => $totalIncome,
            'totalExpense' => $totalExpense,
            'netBalance' => $netBalance,
        ]);
    }
}
