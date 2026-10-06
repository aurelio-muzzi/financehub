<?php

namespace Tests\Feature;

use App\Models\Account;
use App\Models\AuditLog;
use App\Models\Role;
use App\Models\Transaction;
use App\Models\User;
use App\Models\UserNotification;
use Database\Seeders\RoleAndPermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SettingsAndAuditTest extends TestCase
{
    use RefreshDatabase;

    protected User $adminUser;

    protected User $regularUser;

    protected Role $adminRole;

    protected Role $userRole;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(RoleAndPermissionSeeder::class);

        $this->adminRole = Role::where('name', 'admin')->firstOrFail();
        $this->userRole = Role::where('name', 'user')->firstOrFail();

        $this->adminUser = User::factory()->create([
            'role_id' => $this->adminRole->id,
            'status' => 'ACTIVE',
            'email' => 'admin@test.local',
        ]);

        $this->regularUser = User::factory()->create([
            'role_id' => $this->userRole->id,
            'status' => 'ACTIVE',
            'email' => 'user@test.local',
        ]);
    }

    public function test_authenticated_user_can_view_profile(): void
    {
        $response = $this->actingAs($this->regularUser)
            ->getJson('/api/v1/profile');

        $response->assertOk()
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.email', 'user@test.local');
    }

    public function test_user_can_update_profile_and_creates_audit_log(): void
    {
        $response = $this->actingAs($this->regularUser)
            ->putJson('/api/v1/profile', [
                'name' => 'Novo Nome Usuario',
                'email' => 'novoemail@test.local',
            ]);

        $response->assertOk()
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.name', 'Novo Nome Usuario')
            ->assertJsonPath('data.email', 'novoemail@test.local');

        $this->assertDatabaseHas('users', [
            'id' => $this->regularUser->id,
            'name' => 'Novo Nome Usuario',
            'email' => 'novoemail@test.local',
        ]);

        $this->assertDatabaseHas('audit_logs', [
            'user_id' => $this->regularUser->id,
            'action' => 'PROFILE_UPDATE',
            'entity_type' => 'User',
            'entity_id' => $this->regularUser->id,
        ]);
    }

    public function test_profile_update_validates_email_uniqueness(): void
    {
        $response = $this->actingAs($this->regularUser)
            ->putJson('/api/v1/profile', [
                'name' => 'Qualquer Nome',
                'email' => $this->adminUser->email,
            ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['email']);
    }

    public function test_user_can_update_preferences(): void
    {
        $response = $this->actingAs($this->regularUser)
            ->putJson('/api/v1/profile/preferences', [
                'theme' => 'dark',
                'currency' => 'USD',
                'notify_overdue' => true,
            ]);

        $response->assertOk()
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.preferences.theme', 'dark')
            ->assertJsonPath('data.preferences.currency', 'USD');

        $this->assertDatabaseHas('audit_logs', [
            'user_id' => $this->regularUser->id,
            'action' => 'PREFERENCES_UPDATE',
        ]);
    }

    public function test_user_receives_smart_alerts_and_can_mark_notifications_as_read(): void
    {
        $account = Account::create([
            'user_id' => $this->regularUser->id,
            'name' => 'Conta Corrente',
            'type' => 'CHECKING',
            'initial_balance' => 500,
            'current_balance' => -100, // Saldo negativo gera alerta
        ]);

        // Transação pendente vencida
        Transaction::create([
            'user_id' => $this->regularUser->id,
            'account_id' => $account->id,
            'type' => 'EXPENSE',
            'amount' => 120.00,
            'date' => now()->subDays(3)->toDateString(),
            'description' => 'Conta de Luz Atrasada',
            'status' => 'PENDING',
        ]);

        $notif = UserNotification::create([
            'user_id' => $this->regularUser->id,
            'type' => 'INFO',
            'title' => 'Bem-vindo ao FinanceHub',
            'message' => 'Seu sistema está pronto para uso.',
        ]);

        $response = $this->actingAs($this->regularUser)
            ->getJson('/api/v1/notifications');

        $response->assertOk()
            ->assertJsonPath('success', true)
            ->assertJsonStructure([
                'data' => [
                    'alerts',
                    'notifications',
                    'unread_count',
                ],
            ]);

        $this->assertGreaterThanOrEqual(2, $response->json('data.unread_count'));

        // Marcar como lida
        $readResponse = $this->actingAs($this->regularUser)
            ->postJson("/api/v1/notifications/{$notif->id}/read");

        $readResponse->assertOk()
            ->assertJsonPath('success', true);

        $this->assertNotNull($notif->fresh()->read_at);
    }

    public function test_non_admin_cannot_access_admin_endpoints(): void
    {
        $response = $this->actingAs($this->regularUser)
            ->getJson('/api/v1/admin/users');

        $response->assertStatus(403);
    }

    public function test_admin_can_list_users_and_filter(): void
    {
        $response = $this->actingAs($this->adminUser)
            ->getJson('/api/v1/admin/users?search=user@test.local');

        $response->assertOk()
            ->assertJsonPath('success', true)
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.email', 'user@test.local');
    }

    public function test_admin_can_update_user_role_and_status(): void
    {
        $response = $this->actingAs($this->adminUser)
            ->putJson("/api/v1/admin/users/{$this->regularUser->id}", [
                'role_id' => $this->adminRole->id,
                'status' => 'INACTIVE',
            ]);

        $response->assertOk()
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.status', 'INACTIVE')
            ->assertJsonPath('data.role.name', 'admin');

        $this->assertDatabaseHas('users', [
            'id' => $this->regularUser->id,
            'status' => 'INACTIVE',
            'role_id' => $this->adminRole->id,
        ]);

        $this->assertDatabaseHas('audit_logs', [
            'user_id' => $this->adminUser->id,
            'action' => 'ADMIN_USER_UPDATE',
            'entity_id' => $this->regularUser->id,
        ]);
    }

    public function test_admin_cannot_deactivate_or_demote_themselves(): void
    {
        $response = $this->actingAs($this->adminUser)
            ->putJson("/api/v1/admin/users/{$this->adminUser->id}", [
                'role_id' => $this->adminRole->id,
                'status' => 'INACTIVE',
            ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['status']);

        $demoteResponse = $this->actingAs($this->adminUser)
            ->putJson("/api/v1/admin/users/{$this->adminUser->id}", [
                'role_id' => $this->userRole->id,
                'status' => 'ACTIVE',
            ]);

        $demoteResponse->assertStatus(422)
            ->assertJsonValidationErrors(['role_id']);
    }

    public function test_admin_can_view_audit_logs(): void
    {
        AuditLog::create([
            'user_id' => $this->regularUser->id,
            'action' => 'TRANSACTION_CREATE',
            'entity_type' => 'Transaction',
            'entity_id' => 10,
            'new_values' => ['amount' => 50.00],
            'ip_address' => '127.0.0.1',
            'created_at' => now(),
        ]);

        $response = $this->actingAs($this->adminUser)
            ->getJson('/api/v1/admin/audit-logs');

        $response->assertOk()
            ->assertJsonPath('success', true)
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.action', 'TRANSACTION_CREATE')
            ->assertJsonPath('data.0.entity_type', 'Transaction');
    }
}
