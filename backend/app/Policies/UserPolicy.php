<?php

namespace App\Policies;

use App\Models\User;

class UserPolicy
{
    /**
     * Determina se o usuário pode visualizar lista de usuários.
     */
    public function viewAny(User $user): bool
    {
        return $user->isAdmin();
    }

    /**
     * Determina se o usuário pode visualizar os dados de outro usuário.
     */
    public function view(User $user, User $model): bool
    {
        return $user->isAdmin() || $user->id === $model->id;
    }

    /**
     * Determina se o usuário pode gerenciar/atualizar outro usuário.
     */
    public function update(User $user, User $model): bool
    {
        return $user->isAdmin() || $user->id === $model->id;
    }

    /**
     * Determina se o usuário pode alterar status de outro usuário.
     */
    public function updateStatus(User $user, User $model): bool
    {
        return $user->isAdmin() && $user->id !== $model->id;
    }

    /**
     * Determina se o usuário pode excluir outro usuário.
     */
    public function delete(User $user, User $model): bool
    {
        return $user->isAdmin() && $user->id !== $model->id;
    }
}
