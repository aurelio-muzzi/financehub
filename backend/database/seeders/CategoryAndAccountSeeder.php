<?php

namespace Database\Seeders;

use App\Models\Account;
use App\Models\Category;
use App\Models\User;
use Illuminate\Database\Seeder;

class CategoryAndAccountSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Categorias Globais do Sistema (user_id = null)
        $systemCategories = [
            // Receitas
            ['name' => 'Salário', 'type' => 'INCOME', 'color' => '#10b981', 'icon' => 'Briefcase'],
            ['name' => 'Investimentos & Rendimentos', 'type' => 'INCOME', 'color' => '#3b82f6', 'icon' => 'TrendingUp'],
            ['name' => 'Serviços & Freelance', 'type' => 'INCOME', 'color' => '#06b6d4', 'icon' => 'Laptop'],
            ['name' => 'Outras Receitas', 'type' => 'INCOME', 'color' => '#84cc16', 'icon' => 'PlusCircle'],

            // Despesas
            ['name' => 'Alimentação & Supermercado', 'type' => 'EXPENSE', 'color' => '#ef4444', 'icon' => 'Utensils'],
            ['name' => 'Moradia & Contas de Consumo', 'type' => 'EXPENSE', 'color' => '#f97316', 'icon' => 'Home'],
            ['name' => 'Transporte & Combustível', 'type' => 'EXPENSE', 'color' => '#eab308', 'icon' => 'Car'],
            ['name' => 'Saúde & Farmácia', 'type' => 'EXPENSE', 'color' => '#ec4899', 'icon' => 'HeartPulse'],
            ['name' => 'Lazer & Entretenimento', 'type' => 'EXPENSE', 'color' => '#a855f7', 'icon' => 'Film'],
            ['name' => 'Educação & Cursos', 'type' => 'EXPENSE', 'color' => '#6366f1', 'icon' => 'GraduationCap'],
            ['name' => 'Outras Despesas', 'type' => 'EXPENSE', 'color' => '#64748b', 'icon' => 'Tag'],
        ];

        foreach ($systemCategories as $cat) {
            Category::firstOrCreate(
                ['name' => $cat['name'], 'user_id' => null],
                [
                    'type' => $cat['type'],
                    'color' => $cat['color'],
                    'icon' => $cat['icon'],
                    'is_active' => true,
                ]
            );
        }

        // Criar contas financeiras demonstrativas para o usuário demo
        $demoUser = User::where('email', 'demo@financehub.test')->first();
        if ($demoUser) {
            Account::firstOrCreate(
                ['name' => 'Conta Corrente Banco', 'user_id' => $demoUser->id],
                [
                    'type' => 'BANK',
                    'initial_balance' => 3500.00,
                    'current_balance' => 3500.00,
                    'color' => '#3b82f6',
                    'icon' => 'Landmark',
                    'is_active' => true,
                ]
            );

            Account::firstOrCreate(
                ['name' => 'Carteira Dinheiro Físico', 'user_id' => $demoUser->id],
                [
                    'type' => 'CASH',
                    'initial_balance' => 250.00,
                    'current_balance' => 250.00,
                    'color' => '#10b981',
                    'icon' => 'Banknote',
                    'is_active' => true,
                ]
            );

            Account::firstOrCreate(
                ['name' => 'Reserva de Emergência', 'user_id' => $demoUser->id],
                [
                    'type' => 'INVESTMENT',
                    'initial_balance' => 10000.00,
                    'current_balance' => 10000.00,
                    'color' => '#8b5cf6',
                    'icon' => 'ShieldCheck',
                    'is_active' => true,
                ]
            );
        }
    }
}
