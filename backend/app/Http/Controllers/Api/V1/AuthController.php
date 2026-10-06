<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\ForgotPasswordRequest;
use App\Http\Requests\Auth\LoginRequest;
use App\Http\Requests\Auth\ResetPasswordRequest;
use App\Http\Requests\Auth\UpdatePasswordRequest;
use App\Http\Resources\UserResource;
use App\Models\User;
use App\Services\AuditService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    /**
     * Autenticação de usuário e início de sessão SPA.
     */
    public function login(LoginRequest $request): JsonResponse
    {
        $credentials = $request->only('email', 'password');

        if (! Auth::attempt($credentials, $request->boolean('remember'))) {
            throw ValidationException::withMessages([
                'email' => ['As credenciais informadas estão incorretas.'],
            ]);
        }

        /** @var User $user */
        $user = Auth::user();

        if ($user->status !== 'ACTIVE') {
            Auth::logout();
            if ($request->hasSession()) {
                $request->session()->invalidate();
                $request->session()->regenerateToken();
            }

            return response()->json([
                'success' => false,
                'message' => 'Sua conta está inativa. Entre em contato com o administrador.',
                'errors' => null,
            ], 403);
        }

        if ($request->hasSession()) {
            $request->session()->regenerate();
        }

        return response()->json([
            'success' => true,
            'data' => new UserResource($user->load('role')),
            'message' => 'Login realizado com sucesso.',
        ]);
    }

    /**
     * Encerramento da sessão autenticada.
     */
    public function logout(Request $request): JsonResponse
    {
        /** @var User|null $user */
        $user = $request->user();

        if ($user) {
            $token = $user->currentAccessToken();
            if ($token !== null && method_exists($token, 'delete')) {
                $token->delete();
            }
        }

        Auth::guard('web')->logout();

        if ($request->hasSession()) {
            $request->session()->invalidate();
            $request->session()->regenerateToken();
        }

        return response()->json([
            'success' => true,
            'data' => null,
            'message' => 'Sessão encerrada com sucesso.',
        ]);
    }

    /**
     * Retorna os dados do usuário autenticado no momento.
     */
    public function me(Request $request): JsonResponse
    {
        /** @var User $user */
        $user = $request->user();

        return response()->json([
            'success' => true,
            'data' => new UserResource($user->load('role')),
            'message' => null,
        ]);
    }

    /**
     * Atualização da senha do usuário autenticado.
     */
    public function updatePassword(UpdatePasswordRequest $request): JsonResponse
    {
        /** @var User $user */
        $user = $request->user();

        $user->update([
            'password' => Hash::make($request->validated('password')),
        ]);

        AuditService::log(
            action: 'PASSWORD_CHANGE',
            entityType: 'User',
            entityId: $user->id,
            oldValues: null,
            newValues: null,
            userId: $user->id,
            request: $request
        );

        return response()->json([
            'success' => true,
            'data' => null,
            'message' => 'Senha alterada com sucesso.',
        ]);
    }

    /**
     * Solicitação de recuperação de senha.
     * Retorna mensagem genérica para não revelar existência de e-mails.
     */
    public function forgotPassword(ForgotPasswordRequest $request): JsonResponse
    {
        Password::sendResetLink($request->only('email'));

        return response()->json([
            'success' => true,
            'data' => null,
            'message' => 'Se o e-mail informado estiver cadastrado, as instruções para redefinição serão enviadas.',
        ]);
    }

    /**
     * Redefinição de senha utilizando token recebido por e-mail.
     */
    public function resetPassword(ResetPasswordRequest $request): JsonResponse
    {
        $status = Password::reset(
            $request->only('email', 'password', 'password_confirmation', 'token'),
            function (User $user, string $password) {
                $user->forceFill([
                    'password' => Hash::make($password),
                ])->save();
            }
        );

        if ($status !== Password::PASSWORD_RESET) {
            throw ValidationException::withMessages([
                'email' => [__($status)],
            ]);
        }

        return response()->json([
            'success' => true,
            'data' => null,
            'message' => 'Senha redefinida com sucesso. Você já pode fazer login.',
        ]);
    }
}
