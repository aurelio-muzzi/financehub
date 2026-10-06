<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Profile\UpdatePreferencesRequest;
use App\Http\Requests\Profile\UpdateProfileRequest;
use App\Http\Resources\UserResource;
use App\Models\User;
use App\Services\AuditService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProfileController extends Controller
{
    /**
     * Retorna os dados do perfil do usuário autenticado.
     */
    public function show(Request $request): JsonResponse
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
     * Atualiza dados cadastrais (nome e e-mail).
     */
    public function update(UpdateProfileRequest $request): JsonResponse
    {
        /** @var User $user */
        $user = $request->user();

        $oldValues = [
            'name' => $user->name,
            'email' => $user->email,
        ];

        $user->update($request->validated());

        $newValues = [
            'name' => $user->name,
            'email' => $user->email,
        ];

        AuditService::log(
            action: 'PROFILE_UPDATE',
            entityType: 'User',
            entityId: $user->id,
            oldValues: $oldValues,
            newValues: $newValues,
            userId: $user->id,
            request: $request
        );

        return response()->json([
            'success' => true,
            'data' => new UserResource($user->fresh(['role'])),
            'message' => 'Perfil atualizado com sucesso.',
        ]);
    }

    /**
     * Atualiza as preferências do usuário (tema, formato, notificações).
     */
    public function updatePreferences(UpdatePreferencesRequest $request): JsonResponse
    {
        /** @var User $user */
        $user = $request->user();

        $currentPreferences = $user->preferences ?? [];
        $mergedPreferences = array_merge($currentPreferences, $request->validated());

        $oldValues = ['preferences' => $user->preferences];

        $user->update([
            'preferences' => $mergedPreferences,
        ]);

        $newValues = ['preferences' => $mergedPreferences];

        AuditService::log(
            action: 'PREFERENCES_UPDATE',
            entityType: 'User',
            entityId: $user->id,
            oldValues: $oldValues,
            newValues: $newValues,
            userId: $user->id,
            request: $request
        );

        return response()->json([
            'success' => true,
            'data' => new UserResource($user->fresh(['role'])),
            'message' => 'Preferências atualizadas com sucesso.',
        ]);
    }
}
