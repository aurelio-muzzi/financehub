<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Role;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CategoryTest extends TestCase
{
    use RefreshDatabase;

    protected User $user;

    protected User $otherUser;

    protected function setUp(): void
    {
        parent::setUp();

        $role = Role::create(['name' => 'user', 'label' => 'Usuário Padrão']);

        $this->user = User::factory()->create(['role_id' => $role->id]);
        $this->otherUser = User::factory()->create(['role_id' => $role->id]);
    }

    public function test_user_can_list_categories_including_system_and_own(): void
    {
        // Categoria do sistema
        Category::create([
            'name' => 'Salário do Sistema',
            'type' => 'INCOME',
            'user_id' => null,
        ]);

        // Categoria própria do usuário
        Category::create([
            'name' => 'Investimentos Próprios',
            'type' => 'INCOME',
            'user_id' => $this->user->id,
        ]);

        // Categoria de outro usuário (não deve aparecer)
        Category::create([
            'name' => 'Outro Usuário Secreto',
            'type' => 'INCOME',
            'user_id' => $this->otherUser->id,
        ]);

        $response = $this->actingAs($this->user, 'web')->getJson('/api/v1/categories');

        $response->assertStatus(200)
            ->assertJsonPath('success', true);

        $names = collect($response->json('data'))->pluck('name');
        $this->assertTrue($names->contains('Salário do Sistema'));
        $this->assertTrue($names->contains('Investimentos Próprios'));
        $this->assertFalse($names->contains('Outro Usuário Secreto'));
    }

    public function test_user_can_filter_categories_by_type(): void
    {
        Category::create(['name' => 'Receita Teste', 'type' => 'INCOME', 'user_id' => $this->user->id]);
        Category::create(['name' => 'Despesa Teste', 'type' => 'EXPENSE', 'user_id' => $this->user->id]);

        $response = $this->actingAs($this->user, 'web')->getJson('/api/v1/categories?type=EXPENSE');

        $response->assertStatus(200);
        $types = collect($response->json('data'))->pluck('type')->unique();
        $this->assertEquals(['EXPENSE'], $types->values()->all());
    }

    public function test_user_can_create_custom_category(): void
    {
        $response = $this->actingAs($this->user, 'web')->postJson('/api/v1/categories', [
            'name' => 'Consultoria Financeira',
            'type' => 'INCOME',
            'color' => '#10b981',
            'icon' => 'TrendingUp',
        ]);

        $response->assertStatus(201)
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.name', 'Consultoria Financeira')
            ->assertJsonPath('data.is_system', false);

        $this->assertDatabaseHas('categories', [
            'name' => 'Consultoria Financeira',
            'user_id' => $this->user->id,
        ]);
    }

    public function test_user_can_update_own_category(): void
    {
        $category = Category::create([
            'name' => 'Nome Antigo',
            'type' => 'EXPENSE',
            'user_id' => $this->user->id,
        ]);

        $response = $this->actingAs($this->user, 'web')->patchJson("/api/v1/categories/{$category->id}", [
            'name' => 'Nome Atualizado',
        ]);

        $response->assertStatus(200)
            ->assertJsonPath('data.name', 'Nome Atualizado');

        $this->assertEquals('Nome Atualizado', $category->fresh()->name);
    }

    public function test_user_cannot_update_system_category(): void
    {
        $systemCategory = Category::create([
            'name' => 'Alimentação do Sistema',
            'type' => 'EXPENSE',
            'user_id' => null,
        ]);

        $response = $this->actingAs($this->user, 'web')->patchJson("/api/v1/categories/{$systemCategory->id}", [
            'name' => 'Tentativa de Hack',
        ]);

        $response->assertStatus(403);
    }

    public function test_user_cannot_update_other_user_category(): void
    {
        $otherCategory = Category::create([
            'name' => 'Categoria Alheia',
            'type' => 'EXPENSE',
            'user_id' => $this->otherUser->id,
        ]);

        $response = $this->actingAs($this->user, 'web')->patchJson("/api/v1/categories/{$otherCategory->id}", [
            'name' => 'Tentativa Inválida',
        ]);

        $response->assertStatus(403);
    }

    public function test_user_can_soft_delete_own_category(): void
    {
        $category = Category::create([
            'name' => 'Para Deletar',
            'type' => 'EXPENSE',
            'user_id' => $this->user->id,
        ]);

        $response = $this->actingAs($this->user, 'web')->deleteJson("/api/v1/categories/{$category->id}");

        $response->assertStatus(200);
        $this->assertSoftDeleted('categories', ['id' => $category->id]);
    }

    public function test_user_cannot_delete_system_category(): void
    {
        $systemCategory = Category::create([
            'name' => 'Sistema Intocável',
            'type' => 'EXPENSE',
            'user_id' => null,
        ]);

        $response = $this->actingAs($this->user, 'web')->deleteJson("/api/v1/categories/{$systemCategory->id}");

        $response->assertStatus(403);
        $this->assertNotSoftDeleted('categories', ['id' => $systemCategory->id]);
    }
}
