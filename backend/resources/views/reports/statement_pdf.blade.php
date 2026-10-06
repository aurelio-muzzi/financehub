<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <title>Extrato Financeiro — FinanceHub</title>
    <style>
        body {
            font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
            color: #1e293b;
            margin: 0;
            padding: 24px;
            font-size: 12px;
        }
        .header {
            border-bottom: 2px solid #0f172a;
            padding-bottom: 16px;
            margin-bottom: 24px;
        }
        .brand {
            font-size: 24px;
            font-weight: bold;
            color: #0f172a;
        }
        .brand span {
            color: #2563eb;
        }
        .meta {
            margin-top: 8px;
            color: #64748b;
            font-size: 11px;
        }
        .summary-boxes {
            margin-bottom: 24px;
            width: 100%;
        }
        .summary-box {
            display: inline-block;
            width: 30%;
            background-color: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 6px;
            padding: 12px;
            margin-right: 2%;
            vertical-align: top;
        }
        .summary-box .title {
            font-size: 10px;
            text-transform: uppercase;
            color: #64748b;
            font-weight: 600;
        }
        .summary-box .val {
            font-size: 16px;
            font-weight: bold;
            margin-top: 4px;
        }
        .text-income { color: #10b981; }
        .text-expense { color: #ef4444; }
        .text-net { color: #2563eb; }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 16px;
        }
        th {
            background-color: #f1f5f9;
            color: #475569;
            font-weight: 600;
            text-align: left;
            padding: 8px 10px;
            font-size: 10px;
            text-transform: uppercase;
            border-bottom: 1px solid #cbd5e1;
        }
        td {
            padding: 8px 10px;
            border-bottom: 1px solid #f1f5f9;
            font-size: 11px;
        }
        .text-right { text-align: right; }
        .footer {
            margin-top: 40px;
            padding-top: 12px;
            border-top: 1px solid #e2e8f0;
            text-align: center;
            font-size: 10px;
            color: #94a3b8;
        }
    </style>
</head>
<body>
    <div class="header">
        <div class="brand">Finance<span>Hub</span></div>
        <div class="meta">
            <strong>Relatório de Movimentações Financeiras</strong><br>
            Usuário: {{ $user->name }} ({{ $user->email }})<br>
            Período: {{ \Carbon\Carbon::parse($startDate)->format('d/m/Y') }} até {{ \Carbon\Carbon::parse($endDate)->format('d/m/Y') }}<br>
            Emitido em: {{ \Carbon\Carbon::now()->format('d/m/Y H:i:s') }}
        </div>
    </div>

    <div class="summary-boxes">
        <div class="summary-box">
            <div class="title">Total de Receitas</div>
            <div class="val text-income">R$ {{ number_format($totalIncome, 2, ',', '.') }}</div>
        </div>
        <div class="summary-box">
            <div class="title">Total de Despesas</div>
            <div class="val text-expense">R$ {{ number_format($totalExpense, 2, ',', '.') }}</div>
        </div>
        <div class="summary-box">
            <div class="title">Resultado Líquido</div>
            <div class="val text-net">R$ {{ number_format($netBalance, 2, ',', '.') }}</div>
        </div>
    </div>

    <table>
        <thead>
            <tr>
                <th>Data</th>
                <th>Descrição</th>
                <th>Tipo</th>
                <th>Categoria</th>
                <th>Conta</th>
                <th class="text-right">Valor (R$)</th>
            </tr>
        </thead>
        <tbody>
            @forelse($transactions as $tx)
                <tr>
                    <td>{{ \Carbon\Carbon::parse($tx->date)->format('d/m/Y') }}</td>
                    <td><strong>{{ $tx->description }}</strong></td>
                    <td>
                        @if($tx->type === 'INCOME') Receita
                        @elseif($tx->type === 'EXPENSE') Despesa
                        @else Transferência
                        @endif
                    </td>
                    <td>{{ $tx->category?->name ?? ($tx->type === 'TRANSFER' ? 'Transferência' : 'Geral') }}</td>
                    <td>{{ $tx->account?->name ?? 'Conta' }}</td>
                    <td class="text-right {{ $tx->type === 'INCOME' ? 'text-income' : ($tx->type === 'EXPENSE' ? 'text-expense' : '') }}">
                        {{ $tx->type === 'INCOME' ? '+ ' : ($tx->type === 'EXPENSE' ? '- ' : '') }}
                        {{ number_format((float) $tx->amount, 2, ',', '.') }}
                    </td>
                </tr>
            @empty
                <tr>
                    <td colspan="6" style="text-align: center; padding: 20px; color: #94a3b8;">
                        Nenhuma movimentação registrada no período selecionado.
                    </td>
                </tr>
            @endforelse
        </tbody>
    </table>

    <div class="footer">
        FinanceHub — Relatório emitido para fins de conferência e gestão financeira pessoal/empresarial.
    </div>
</body>
</html>
