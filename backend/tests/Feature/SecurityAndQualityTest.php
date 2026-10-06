<?php

namespace Tests\Feature;

use App\Models\User;
use Database\Seeders\RoleAndPermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SecurityAndQualityTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(RoleAndPermissionSeeder::class);
    }

    public function test_api_responses_include_owasp_security_headers(): void
    {
        $response = $this->getJson('/api/v1/auth/login');

        // Mesmo em falha ou validação, os cabeçalhos de segurança devem estar presentes
        $response->assertHeader('X-Content-Type-Options', 'nosniff');
        $response->assertHeader('X-Frame-Options', 'DENY');
        $response->assertHeader('X-XSS-Protection', '1; mode=block');
        $response->assertHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
        $response->assertHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
    }

    public function test_login_endpoint_throttles_excessive_attempts(): void
    {
        $credentials = [
            'email' => 'hacker@malicious.test',
            'password' => 'wrongpassword',
        ];

        // O throttle na rota pública de login é de 5 tentativas por minuto
        for ($i = 0; $i < 5; $i++) {
            $this->postJson('/api/v1/auth/login', $credentials);
        }

        // A 6ª tentativa deve receber 429 Too Many Requests
        $response = $this->postJson('/api/v1/auth/login', $credentials);
        $response->assertStatus(429);
    }

    public function test_sql_injection_attempt_is_safely_handled(): void
    {
        /** @var User $user */
        $user = User::factory()->create();

        // Tentativa de injeção SQL no parâmetro de busca
        $maliciousPayload = "' OR 1=1; --";

        $response = $this->actingAs($user)
            ->getJson('/api/v1/transactions?search='.urlencode($maliciousPayload));

        $response->assertOk()
            ->assertJsonStructure(['data', 'meta']);
    }
}
