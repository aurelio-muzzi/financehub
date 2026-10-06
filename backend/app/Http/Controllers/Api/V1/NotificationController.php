<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Services\NotificationService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    public function __construct(
        protected NotificationService $notificationService
    ) {}

    /**
     * Retorna o resumo consolidado de alertas e notificações do usuário autenticado.
     */
    public function index(Request $request): JsonResponse
    {
        /** @var User $user */
        $user = $request->user();

        $summary = $this->notificationService->getSummary($user);

        return response()->json([
            'success' => true,
            'data' => $summary,
            'message' => null,
        ]);
    }

    /**
     * Marca uma notificação individual como lida.
     */
    public function markAsRead(Request $request, int $id): JsonResponse
    {
        /** @var User $user */
        $user = $request->user();

        $marked = $this->notificationService->markAsRead($user, $id);

        return response()->json([
            'success' => $marked,
            'data' => null,
            'message' => $marked ? 'Notificação marcada como lida.' : 'Notificação não encontrada.',
        ]);
    }

    /**
     * Marca todas as notificações do usuário como lidas.
     */
    public function markAllAsRead(Request $request): JsonResponse
    {
        /** @var User $user */
        $user = $request->user();

        $this->notificationService->markAllAsRead($user);

        return response()->json([
            'success' => true,
            'data' => null,
            'message' => 'Todas as notificações foram marcadas como lidas.',
        ]);
    }
}
