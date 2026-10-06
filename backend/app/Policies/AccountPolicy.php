<?php

namespace App\Policies;

use App\Models\Account;
use App\Models\User;

class AccountPolicy
{
    /**
     * Determina se o usuário pode visualizar contas.
     */
    public function viewAny(User $user): bool
    {
        return true;
    }

    /**
     * Determina se o usuário pode visualizar a conta (isolamento estrito).
     */
    public function view(User $user, Account $account): bool
    {
        return $account->user_id === $user->id || $user->isAdmin();
    }

    /**
     * Determina se o usuário pode criar contas.
     */
    public function create(User $user): bool
    {
        return true;
    }

    /**
     * Determina se o usuário pode atualizar a conta.
     */
    public function update(User $user, Account $account): bool
    {
        return $account->user_id === $user->id || $user->isAdmin();
    }

    /**
     * Determina se o usuário pode excluir a conta.
     */
    public function delete(User $user, Account $account): bool
    {
        return $account->user_id === $user->id || $user->isAdmin();
    }
}
