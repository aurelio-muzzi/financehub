<?php

namespace Database\Seeders;

use App\Models\Permission;
use App\Models\Role;
use Illuminate\Database\Seeder;

class RoleAndPermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $permissions = [
            ['name' => 'users.view', 'label' => 'Visualizar Usuários'],
            ['name' => 'users.manage', 'label' => 'Gerenciar Usuários'],
            ['name' => 'audit.view', 'label' => 'Visualizar Logs de Auditoria'],
            ['name' => 'categories.manage', 'label' => 'Gerenciar Categorias'],
            ['name' => 'accounts.manage', 'label' => 'Gerenciar Contas Financeiras'],
            ['name' => 'transactions.manage', 'label' => 'Gerenciar Transações'],
            ['name' => 'reports.view', 'label' => 'Visualizar e Exportar Relatórios'],
        ];

        foreach ($permissions as $perm) {
            Permission::firstOrCreate(['name' => $perm['name']], $perm);
        }

        $adminRole = Role::firstOrCreate(
            ['name' => 'admin'],
            ['label' => 'Administrador do Sistema']
        );

        $userRole = Role::firstOrCreate(
            ['name' => 'user'],
            ['label' => 'Usuário Padrão']
        );

        // Associar todas as permissões ao admin
        $allPermissions = Permission::all();
        $adminRole->permissions()->sync($allPermissions->pluck('id'));

        // Associar permissões comuns ao user
        $userPermissions = Permission::whereIn('name', [
            'categories.manage',
            'accounts.manage',
            'transactions.manage',
            'reports.view',
        ])->get();
        $userRole->permissions()->sync($userPermissions->pluck('id'));
    }
}
