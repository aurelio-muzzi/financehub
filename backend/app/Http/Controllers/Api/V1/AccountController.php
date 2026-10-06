<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Account\AccountRequest;
use App\Http\Resources\AccountResource;
use App\Models\Account;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class AccountController extends Controller
{
    /**
     * Listagem de contas financeiras do usuário autenticado.
     */
    public function index(Request $request): JsonResponse
    {
        /** @var User $user */
        $user = $request->user();

        $query = Account::forUser($user->id);

        if ($request->filled('type')) {
            $query->where('type', $request->string('type')->toString());
        }

        if ($request->has('is_active')) {
            $query->where('is_active', $request->boolean('is_active'));
        }

        if ($request->filled('search')) {
            $search = $request->string('search')->toString();
            $query->where('name', 'like', "%{$search}%");
        }

        $accounts = $query->orderBy('name')->get();

        return response()->json([
            'success' => true,
            'data' => AccountResource::collection($accounts),
            'message' => null,
        ]);
    }

    /**
     * Criação de nova conta financeira.
     */
    public function store(AccountRequest $request): JsonResponse
    {
        /** @var User $user */
        $user = $request->user();

        $data = $request->validated();
        $data['user_id'] = $user->id;

        // Se o saldo inicial for informado, inicializa também o current_balance com esse valor
        $initialBalance = $data['initial_balance'] ?? 0.00;
        $data['initial_balance'] = $initialBalance;
        $data['current_balance'] = $initialBalance;

        $account = Account::create($data);

        return response()->json([
            'success' => true,
            'data' => new AccountResource($account),
            'message' => 'Conta financeira criada com sucesso.',
        ], 201);
    }

    /**
     * Detalhes de uma conta financeira específica.
     */
    public function show(Account $account): JsonResponse
    {
        Gate::authorize('view', $account);

        return response()->json([
            'success' => true,
            'data' => new AccountResource($account),
            'message' => null,
        ]);
    }

    /**
     * Atualização de dados da conta financeira.
     */
    public function update(AccountRequest $request, Account $account): JsonResponse
    {
        Gate::authorize('update', $account);

        $account->update($request->validated());

        return response()->json([
            'success' => true,
            'data' => new AccountResource($account),
            'message' => 'Conta financeira atualizada com sucesso.',
        ]);
    }

    /**
     * Exclusão (soft delete) da conta financeira.
     */
    public function destroy(Account $account): JsonResponse
    {
        Gate::authorize('delete', $account);

        $account->delete();

        return response()->json([
            'success' => true,
            'data' => null,
            'message' => 'Conta financeira excluída com sucesso.',
        ]);
    }

    /**
     * Consulta consolidada do saldo da conta.
     */
    public function balance(Account $account): JsonResponse
    {
        Gate::authorize('view', $account);

        return response()->json([
            'success' => true,
            'data' => [
                'account_id' => $account->id,
                'name' => $account->name,
                'current_balance' => (string) $account->current_balance,
            ],
            'message' => null,
        ]);
    }
}
