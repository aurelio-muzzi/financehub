<?php

namespace Database\Seeders;

use App\Models\Account;
use App\Models\Category;
use App\Models\User;
use App\Services\TransactionService;
use Carbon\Carbon;
use Illuminate\Database\Seeder;

class TransactionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $demoUser = User::where('email', 'demo@financehub.test')->first();

        if (! $demoUser) {
            return;
        }

        $transactionService = app(TransactionService::class);

        $bankAccount = Account::where('user_id', $demoUser->id)->where('type', 'BANK')->first();
        $walletAccount = Account::where('user_id', $demoUser->id)->where('type', 'DIGITAL_WALLET')->first();
        $investmentAccount = Account::where('user_id', $demoUser->id)->where('type', 'INVESTMENT')->first();

        if (! $bankAccount) {
            return;
        }

        $salaryCat = Category::where('name', 'Salário')->first();
        $freelanceCat = Category::where('name', 'Investimentos / Rendimentos')->first();
        $foodCat = Category::where('name', 'Alimentação')->first();
        $housingCat = Category::where('name', 'Moradia')->first();
        $transpCat = Category::where('name', 'Transporte')->first();
        $leisureCat = Category::where('name', 'Lazer')->first();

        $now = Carbon::now();

        $transactions = [
            // Mês anterior - Receitas
            [
                'account_id' => $bankAccount->id,
                'category_id' => $salaryCat?->id,
                'type' => 'INCOME',
                'amount' => 7500.00,
                'date' => $now->copy()->subMonth()->startOfMonth()->addDays(4)->format('Y-m-d'),
                'description' => 'Salário Mensal Tech Corp',
                'payment_method' => 'TRANSFER',
                'status' => 'COMPLETED',
            ],
            [
                'account_id' => $bankAccount->id,
                'category_id' => $freelanceCat?->id,
                'type' => 'INCOME',
                'amount' => 1800.00,
                'date' => $now->copy()->subMonth()->startOfMonth()->addDays(14)->format('Y-m-d'),
                'description' => 'Projeto Freelance Website',
                'payment_method' => 'PIX',
                'status' => 'COMPLETED',
            ],
            // Mês anterior - Despesas
            [
                'account_id' => $bankAccount->id,
                'category_id' => $housingCat?->id,
                'type' => 'EXPENSE',
                'amount' => 2200.00,
                'date' => $now->copy()->subMonth()->startOfMonth()->addDays(9)->format('Y-m-d'),
                'description' => 'Aluguel do Apartamento',
                'payment_method' => 'BOLETO',
                'status' => 'COMPLETED',
            ],
            [
                'account_id' => $bankAccount->id,
                'category_id' => $foodCat?->id,
                'type' => 'EXPENSE',
                'amount' => 650.40,
                'date' => $now->copy()->subMonth()->startOfMonth()->addDays(12)->format('Y-m-d'),
                'description' => 'Compras Supermercado Mensal',
                'payment_method' => 'DEBIT_CARD',
                'status' => 'COMPLETED',
            ],
            // Mês atual - Receitas
            [
                'account_id' => $bankAccount->id,
                'category_id' => $salaryCat?->id,
                'type' => 'INCOME',
                'amount' => 7500.00,
                'date' => $now->copy()->startOfMonth()->addDays(4)->format('Y-m-d'),
                'description' => 'Salário Mensal Tech Corp',
                'payment_method' => 'TRANSFER',
                'status' => 'COMPLETED',
            ],
            // Mês atual - Despesas
            [
                'account_id' => $bankAccount->id,
                'category_id' => $housingCat?->id,
                'type' => 'EXPENSE',
                'amount' => 2200.00,
                'date' => $now->copy()->startOfMonth()->addDays(9)->format('Y-m-d'),
                'description' => 'Aluguel do Apartamento',
                'payment_method' => 'BOLETO',
                'status' => 'COMPLETED',
            ],
            [
                'account_id' => $bankAccount->id,
                'category_id' => $foodCat?->id,
                'type' => 'EXPENSE',
                'amount' => 432.80,
                'date' => $now->copy()->startOfMonth()->addDays(11)->format('Y-m-d'),
                'description' => 'Supermercado Pão de Açúcar',
                'payment_method' => 'DEBIT_CARD',
                'status' => 'COMPLETED',
            ],
            [
                'account_id' => $bankAccount->id,
                'category_id' => $transpCat?->id,
                'type' => 'EXPENSE',
                'amount' => 240.00,
                'date' => $now->copy()->startOfMonth()->addDays(15)->format('Y-m-d'),
                'description' => 'Combustível Posto Shell',
                'payment_method' => 'PIX',
                'status' => 'COMPLETED',
            ],
            [
                'account_id' => $bankAccount->id,
                'category_id' => $leisureCat?->id,
                'type' => 'EXPENSE',
                'amount' => 180.50,
                'date' => $now->copy()->startOfMonth()->addDays(18)->format('Y-m-d'),
                'description' => 'Jantar Restaurante Outback',
                'payment_method' => 'CREDIT_CARD',
                'status' => 'COMPLETED',
            ],
        ];

        // Transferência se houver investimento
        if ($investmentAccount) {
            $transactions[] = [
                'account_id' => $bankAccount->id,
                'destination_account_id' => $investmentAccount->id,
                'type' => 'TRANSFER',
                'amount' => 1500.00,
                'date' => $now->copy()->startOfMonth()->addDays(6)->format('Y-m-d'),
                'description' => 'Aporte Mensal Renda Fixa',
                'payment_method' => 'TRANSFER',
                'status' => 'COMPLETED',
            ];
        }

        // Transferência para Carteira Digital
        if ($walletAccount) {
            $transactions[] = [
                'account_id' => $bankAccount->id,
                'destination_account_id' => $walletAccount->id,
                'type' => 'TRANSFER',
                'amount' => 300.00,
                'date' => $now->copy()->startOfMonth()->addDays(8)->format('Y-m-d'),
                'description' => 'Recarga Carteira Digital',
                'payment_method' => 'PIX',
                'status' => 'COMPLETED',
            ];
        }

        foreach ($transactions as $txData) {
            $transactionService->create($demoUser, $txData);
        }
    }
}
