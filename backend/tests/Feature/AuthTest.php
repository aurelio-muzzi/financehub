<?php

namespace Tests\Feature;

use App\Models\Role;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class AuthTest extends TestCase
{
    use RefreshDatabase;

    protected Role $userRole;

    protected Role $adminRole;

    protected function setUp(): void
    {
        parent::setUp();

        $this->userRole = Role::create([
            'name' => 'user',
            'label' => 'Usuário Padrão',
        ]);

        $this->adminRole = Role::create([
            'name' => 'admin',
            'label' => 'Administrador',
        ]);
    }

    public function test_user_can_login_with_valid_credentials(): void
    {
        $user = User::factory()->create([
            'email' => 'joao@example.com',
            'password' => Hash::make('secret123'),
            'role_id' => $this->userRole->id,
            'status' => 'ACTIVE',
        ]);

        $response = $this->postJson('/api/v1/auth/login', [
            'email' => 'joao@example.com',
            'password' => 'secret123',
        ]);

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'message' => 'Login realizado com sucesso.',
            ])
            ->assertJsonPath('data.email', 'joao@example.com')
            ->assertJsonPath('data.role.name', 'user');

        $this->assertAuthenticatedAs($user);
    }

    public function test_user_cannot_login_with_invalid_password(): void
    {
        User::factory()->create([
            'email' => 'joao@example.com',
            'password' => Hash::make('secret123'),
            'role_id' => $this->userRole->id,
        ]);

        $response = $this->postJson('/api/v1/auth/login', [
            'email' => 'joao@example.com',
            'password' => 'wrong-password',
        ]);

        $response->assertStatus(422)
            ->assertJsonStructure(['success', 'message', 'errors']);

        $this->assertGuest();
    }

    public function test_inactive_user_cannot_login(): void
    {
        User::factory()->create([
            'email' => 'inativo@example.com',
            'password' => Hash::make('secret123'),
            'role_id' => $this->userRole->id,
            'status' => 'INACTIVE',
        ]);

        $response = $this->postJson('/api/v1/auth/login', [
            'email' => 'inativo@example.com',
            'password' => 'secret123',
        ]);

        $response->assertStatus(403)
            ->assertJson([
                'success' => false,
                'message' => 'Sua conta está inativa. Entre em contato com o administrador.',
            ]);

        $this->assertGuest();
    }

    public function test_authenticated_user_can_access_me_endpoint(): void
    {
        $user = User::factory()->create([
            'role_id' => $this->userRole->id,
        ]);

        $response = $this->actingAs($user, 'web')->getJson('/api/v1/auth/me');

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'data' => [
                    'id' => $user->id,
                    'email' => $user->email,
                ],
            ]);
    }

    public function test_unauthenticated_user_cannot_access_me_endpoint(): void
    {
        $response = $this->getJson('/api/v1/auth/me');

        $response->assertStatus(401)
            ->assertJson([
                'success' => false,
            ]);
    }

    public function test_authenticated_user_can_logout(): void
    {
        $user = User::factory()->create([
            'role_id' => $this->userRole->id,
        ]);

        $response = $this->actingAs($user, 'web')->postJson('/api/v1/auth/logout');

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'message' => 'Sessão encerrada com sucesso.',
            ]);
    }

    public function test_authenticated_user_can_update_password(): void
    {
        $user = User::factory()->create([
            'password' => Hash::make('old-password123'),
            'role_id' => $this->userRole->id,
        ]);

        $response = $this->actingAs($user, 'web')->putJson('/api/v1/auth/password', [
            'current_password' => 'old-password123',
            'password' => 'new-password123',
            'password_confirmation' => 'new-password123',
        ]);

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'message' => 'Senha alterada com sucesso.',
            ]);

        $this->assertTrue(Hash::check('new-password123', $user->fresh()->password));
    }

    public function test_user_cannot_update_password_with_invalid_current_password(): void
    {
        $user = User::factory()->create([
            'password' => Hash::make('old-password123'),
            'role_id' => $this->userRole->id,
        ]);

        $response = $this->actingAs($user, 'web')->putJson('/api/v1/auth/password', [
            'current_password' => 'incorrect-current-pass',
            'password' => 'new-password123',
            'password_confirmation' => 'new-password123',
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['current_password']);
    }

    public function test_forgot_password_returns_generic_success_message(): void
    {
        $response = $this->postJson('/api/v1/auth/forgot-password', [
            'email' => 'qualquer@example.com',
        ]);

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'message' => 'Se o e-mail informado estiver cadastrado, as instruções para redefinição serão enviadas.',
            ]);
    }
}
