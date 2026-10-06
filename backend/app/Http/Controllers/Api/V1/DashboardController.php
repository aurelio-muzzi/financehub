<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\TransactionResource;
use App\Models\User;
use App\Services\DashboardService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class DashboardController extends Controller
{
    public function __construct(
        protected DashboardService $dashboardService
    ) {}

    /**
     * Métricas principais do dashboard (saldos, receitas, despesas, variações).
     */
    public function metrics(Request $request): JsonResponse
    {
        /** @var User $user */
        $user = $request->user();

        $metrics = $this->dashboardService->getMetrics($user);

        return response()->json(['data' => $metrics]);
    }

    /**
     * Histórico temporal de fluxo de caixa (receitas vs despesas).
     */
    public function cashFlow(Request $request): JsonResponse
    {
        /** @var User $user */
        $user = $request->user();
        $months = min((int) $request->input('months', 6), 12);

        $cashFlow = $this->dashboardService->getCashFlowHistory($user, $months);

        return response()->json(['data' => $cashFlow]);
    }

    /**
     * Distribuição de despesas por categoria no período.
     */
    public function expensesByCategory(Request $request): JsonResponse
    {
        /** @var User $user */
        $user = $request->user();
        $startDate = $request->input('start_date');
        $endDate = $request->input('end_date');

        $distribution = $this->dashboardService->getExpensesByCategory(
            $user,
            is_string($startDate) ? $startDate : null,
            is_string($endDate) ? $endDate : null
        );

        return response()->json(['data' => $distribution]);
    }

    /**
     * Transações recentes para visualização no dashboard.
     */
    public function recentTransactions(Request $request): AnonymousResourceCollection
    {
        /** @var User $user */
        $user = $request->user();
        $limit = min((int) $request->input('limit', 5), 20);

        $recent = $this->dashboardService->getRecentTransactions($user, $limit);

        return TransactionResource::collection($recent);
    }
}
