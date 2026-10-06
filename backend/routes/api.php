<?php

use App\Http\Controllers\Api\V1\AccountController;
use App\Http\Controllers\Api\V1\AdminAuditLogController;
use App\Http\Controllers\Api\V1\AdminUserController;
use App\Http\Controllers\Api\V1\AuthController;
use App\Http\Controllers\Api\V1\CategoryController;
use App\Http\Controllers\Api\V1\DashboardController;
use App\Http\Controllers\Api\V1\NotificationController;
use App\Http\Controllers\Api\V1\ProfileController;
use App\Http\Controllers\Api\V1\ReportController;
use App\Http\Controllers\Api\V1\TransactionController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function () {
    // Rotas públicas de autenticação (com rate limit estrito)
    Route::prefix('auth')->group(function () {
        Route::post('login', [AuthController::class, 'login'])->middleware('throttle:5,1');
        Route::post('forgot-password', [AuthController::class, 'forgotPassword'])->middleware('throttle:5,1');
        Route::post('reset-password', [AuthController::class, 'resetPassword'])->middleware('throttle:5,1');

        // Rotas autenticadas de sessão
        Route::middleware('auth:sanctum')->group(function () {
            Route::post('logout', [AuthController::class, 'logout']);
            Route::get('me', [AuthController::class, 'me']);
            Route::put('password', [AuthController::class, 'updatePassword']);
        });
    });

    // Recursos autenticados da aplicação
    Route::middleware('auth:sanctum')->group(function () {
        // Categorias
        Route::apiResource('categories', CategoryController::class);

        // Contas Financeiras
        Route::get('accounts/{account}/balance', [AccountController::class, 'balance']);
        Route::apiResource('accounts', AccountController::class);

        // Transações
        Route::get('transactions/summary', [TransactionController::class, 'summary']);
        Route::apiResource('transactions', TransactionController::class);

        // Dashboard & Analytics
        Route::prefix('dashboard')->group(function () {
            Route::get('metrics', [DashboardController::class, 'metrics']);
            Route::get('cash-flow', [DashboardController::class, 'cashFlow']);
            Route::get('expenses-by-category', [DashboardController::class, 'expensesByCategory']);
            Route::get('recent-transactions', [DashboardController::class, 'recentTransactions']);
        });

        // Relatórios e Exportações
        Route::prefix('reports')->group(function () {
            Route::get('analytics', [ReportController::class, 'analytics']);
            Route::get('export/csv', [ReportController::class, 'exportCsv']);
            Route::get('export/pdf', [ReportController::class, 'exportPdf']);
        });

        // Perfil e Preferências
        Route::prefix('profile')->group(function () {
            Route::get('/', [ProfileController::class, 'show']);
            Route::put('/', [ProfileController::class, 'update']);
            Route::put('/preferences', [ProfileController::class, 'updatePreferences']);
        });

        // Notificações e Alertas Inteligentes
        Route::prefix('notifications')->group(function () {
            Route::get('/', [NotificationController::class, 'index']);
            Route::post('{id}/read', [NotificationController::class, 'markAsRead']);
            Route::post('mark-all-read', [NotificationController::class, 'markAllAsRead']);
        });

        // Área Administrativa (RBAC e Auditoria)
        Route::prefix('admin')->middleware('admin')->group(function () {
            Route::get('users', [AdminUserController::class, 'index']);
            Route::put('users/{user}', [AdminUserController::class, 'update']);
            Route::get('roles', [AdminUserController::class, 'roles']);
            Route::get('audit-logs', [AdminAuditLogController::class, 'index']);
        });
    });
});
