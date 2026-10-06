<?php

namespace App\Policies;

use App\Models\Category;
use App\Models\User;

class CategoryPolicy
{
    /**
     * Determina se o usuário pode visualizar categorias.
     */
    public function viewAny(User $user): bool
    {
        return true;
    }

    /**
     * Determina se o usuário pode visualizar uma categoria específica.
     */
    public function view(User $user, Category $category): bool
    {
        return $category->user_id === null || $category->user_id === $user->id || $user->isAdmin();
    }

    /**
     * Determina se o usuário pode criar categorias.
     */
    public function create(User $user): bool
    {
        return true;
    }

    /**
     * Determina se o usuário pode atualizar a categoria.
     */
    public function update(User $user, Category $category): bool
    {
        if ($category->user_id === null) {
            return $user->isAdmin();
        }

        return $category->user_id === $user->id || $user->isAdmin();
    }

    /**
     * Determina se o usuário pode excluir a categoria.
     */
    public function delete(User $user, Category $category): bool
    {
        if ($category->user_id === null) {
            return $user->isAdmin();
        }

        return $category->user_id === $user->id || $user->isAdmin();
    }
}
