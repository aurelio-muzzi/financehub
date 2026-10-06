<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\AdminUpdateUserRequest;
use App\Http\Resources\AdminUserResource;
use App\Models\Role;
use App\Models\User;
use App\Services\AuditService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class AdminUserController extends Controller
{
    /**
     * Listagem paginada de usuários para o painel administrativo.
     */
    public function index(Request $request): JsonResponse
    {
        $query = User::query()
            ->with(['role'])
            ->withCount(['accounts', 'transactions']);

        // Filtro de busca textual
        if ($search = $request->query('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%");
            });
        }

        // Filtro por papel
        if ($roleId = $request->query('role_id')) {
            $query->where('role_id', $roleId);
        }

        // Filtro por status
        if ($status = $request->query('status')) {
            $query->where('status', $status);
        }

        $users = $query->orderBy('name', 'asc')->paginate(15);

        return response()->json([
            'success' => true,
            'data' => AdminUserResource::collection($users),
            'meta' => [
                'current_page' => $users->currentPage(),
                'last_page' => $users->lastPage(),
                'per_page' => $users->perPage(),
                'total' => $users->total(),
            ],
            'message' => null,
        ]);
    }

    /**
     * Atualização de papel (Role) e status do usuário.
     */
    public function update(AdminUpdateUserRequest $request, User $user): JsonResponse
    {
        /** @var User $currentUser */
        $currentUser = $request->user();

        // Regra de segurança: O administrador não pode inativar a si próprio nem revogar o próprio privilégio de admin
        if ($currentUser->id === $user->id) {
            if ($request->input('status') === 'INACTIVE') {
                throw ValidationException::withMessages([
                    'status' => ['Você não pode desativar sua própria conta de administrador.'],
                ]);
            }

            $adminRole = Role::where('name', 'admin')->first();
            if ($adminRole && (int) $request->input('role_id') !== $adminRole->id) {
                throw ValidationException::withMessages([
                    'role_id' => ['Você não pode remover seu próprio perfil de administrador.'],
                ]);
            }
        }

        $oldValues = [
            'role_id' => $user->role_id,
            'status' => $user->status,
        ];

        $user->update([
            'role_id' => $request->validated('role_id'),
            'status' => $request->validated('status'),
        ]);

        $newValues = [
            'role_id' => $user->role_id,
            'status' => $user->status,
        ];

        AuditService::log(
            action: 'ADMIN_USER_UPDATE',
            entityType: 'User',
            entityId: $user->id,
            oldValues: $oldValues,
            newValues: $newValues,
            userId: $currentUser->id,
            request: $request
        );

        return response()->json([
            'success' => true,
            'data' => new AdminUserResource($user->load(['role'])->loadCount(['accounts', 'transactions'])),
            'message' => 'Usuário atualizado com sucesso.',
        ]);
    }

    /**
     * Listagem dos papéis (Roles) cadastrados no sistema.
     */
    public function roles(): JsonResponse
    {
        $roles = Role::with('permissions')->get();

        return response()->json([
            'success' => true,
            'data' => $roles,
            'message' => null,
        ]);
    }
}
