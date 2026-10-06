<?php

namespace Database\Seeders;

use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call(RoleAndPermissionSeeder::class);

        $adminRole = Role::where('name', 'admin')->firstOrFail();
        $userRole = Role::where('name', 'user')->firstOrFail();

        // Usuário Administrador Padrão
        User::firstOrCreate(
            ['email' => 'admin@financehub.test'],
            [
                'name' => 'Administrador FinanceHub',
                'password' => Hash::make('password123'),
                'role_id' => $adminRole->id,
                'status' => 'ACTIVE',
                'preferences' => [
                    'currency' => 'BRL',
                    'date_format' => 'dd/MM/yyyy',
                    'timezone' => 'America/Manaus',
                ],
            ]
        );

        // Usuário de Demonstração
        User::firstOrCreate(
            ['email' => 'demo@financehub.test'],
            [
                'name' => 'Usuário Demo',
                'password' => Hash::make('password123'),
                'role_id' => $userRole->id,
                'status' => 'ACTIVE',
                'preferences' => [
                    'currency' => 'BRL',
                    'date_format' => 'dd/MM/yyyy',
                    'timezone' => 'America/Manaus',
                ],
            ]
        );
    }
}
