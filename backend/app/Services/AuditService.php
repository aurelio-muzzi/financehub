<?php

namespace App\Services;

use App\Models\AuditLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AuditService
{
    /**
     * @param  array<string, mixed>|null  $oldValues
     * @param  array<string, mixed>|null  $newValues
     */
    public static function log(
        string $action,
        string $entityType,
        ?int $entityId = null,
        ?array $oldValues = null,
        ?array $newValues = null,
        ?int $userId = null,
        ?Request $request = null
    ): AuditLog {
        $resolvedUserId = $userId ?? Auth::id();

        $ipAddress = null;
        $userAgent = null;

        if ($request) {
            $ipAddress = $request->ip();
            $userAgent = $request->userAgent();
        } elseif (request()) {
            $ipAddress = request()->ip();
            $userAgent = request()->userAgent();
        }

        return AuditLog::create([
            'user_id' => $resolvedUserId,
            'action' => strtoupper($action),
            'entity_type' => $entityType,
            'entity_id' => $entityId,
            'old_values' => $oldValues,
            'new_values' => $newValues,
            'ip_address' => $ipAddress,
            'user_agent' => $userAgent ? substr($userAgent, 0, 500) : null,
            'created_at' => now(),
        ]);
    }
}
