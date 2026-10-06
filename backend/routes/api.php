<?php

use App\Http\Controllers\Api\V1\AccountController;
use App\Http\Controllers\Api\V1\AuthController;
use App\Http\Controllers\Api\V1\CategoryController;
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
    });
});
