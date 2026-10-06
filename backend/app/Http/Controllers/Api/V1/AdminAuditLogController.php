<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\AuditLogResource;
use App\Models\AuditLog;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AdminAuditLogController extends Controller
{
    /**
     * Listagem paginada de logs de auditoria do sistema para administradores.
     */
    public function index(Request $request): JsonResponse
    {
        $query = AuditLog::query()->with(['user:id,name,email']);

        // Filtro por ação
        if ($action = $request->query('action')) {
            $query->where('action', strtoupper($action));
        }

        // Filtro por tipo de entidade
        if ($entityType = $request->query('entity_type')) {
            $query->where('entity_type', $entityType);
        }

        // Filtro por usuário
        if ($userId = $request->query('user_id')) {
            $query->where('user_id', $userId);
        }

        // Filtro por período
        if ($dateFrom = $request->query('date_from')) {
            $query->whereDate('created_at', '>=', $dateFrom);
        }

        if ($dateTo = $request->query('date_to')) {
            $query->whereDate('created_at', '<=', $dateTo);
        }

        // Filtro textual
        if ($search = $request->query('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('action', 'like', "%{$search}%")
                    ->orWhere('entity_type', 'like', "%{$search}%")
                    ->orWhere('ip_address', 'like', "%{$search}%");
            });
        }

        $logs = $query->orderBy('created_at', 'desc')->paginate(20);

        return response()->json([
            'success' => true,
            'data' => AuditLogResource::collection($logs),
            'meta' => [
                'current_page' => $logs->currentPage(),
                'last_page' => $logs->lastPage(),
                'per_page' => $logs->perPage(),
                'total' => $logs->total(),
            ],
            'message' => null,
        ]);
    }
}
