<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Transaction\TransactionRequest;
use App\Http\Resources\TransactionResource;
use App\Models\Transaction;
use App\Models\User;
use App\Services\TransactionService;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class TransactionController extends Controller
{
    use AuthorizesRequests;

    public function __construct(
        protected TransactionService $transactionService
    ) {}

    /**
     * Listagem paginada de transações com filtros avançados.
     */
    public function index(Request $request): AnonymousResourceCollection
    {
        /** @var User $user */
        $user = $request->user();

        $query = Transaction::query()
            ->with(['account', 'category', 'destinationAccount'])
            ->forUser($user->id);

        if ($request->filled('account_id')) {
            $query->forAccount((int) $request->input('account_id'));
        }

        if ($request->filled('category_id')) {
            $query->forCategory((int) $request->input('category_id'));
        }

        if ($request->filled('type')) {
            $query->ofType((string) $request->input('type'));
        }

        if ($request->filled('status')) {
            $query->ofStatus((string) $request->input('status'));
        }

        if ($request->filled('start_date') && $request->filled('end_date')) {
            $query->forPeriod((string) $request->input('start_date'), (string) $request->input('end_date'));
        } elseif ($request->filled('start_date')) {
            $query->where('date', '>=', (string) $request->input('start_date'));
        } elseif ($request->filled('end_date')) {
            $query->where('date', '<=', (string) $request->input('end_date'));
        }

        if ($request->filled('search')) {
            $search = '%'.(string) $request->input('search').'%';
            $query->where(function ($q) use ($search) {
                $q->where('description', 'like', $search)
                    ->orWhere('notes', 'like', $search);
            });
        }

        $perPage = min((int) $request->input('per_page', 15), 100);

        $transactions = $query->orderBy('date', 'desc')
            ->orderBy('id', 'desc')
            ->paginate($perPage);

        return TransactionResource::collection($transactions);
    }

    /**
     * Resumo consolidado do período filtrado.
     */
    public function summary(Request $request): JsonResponse
    {
        /** @var User $user */
        $user = $request->user();

        $query = Transaction::query()
            ->forUser($user->id)
            ->where('status', 'COMPLETED');

        if ($request->filled('account_id')) {
            $query->forAccount((int) $request->input('account_id'));
        }

        if ($request->filled('category_id')) {
            $query->forCategory((int) $request->input('category_id'));
        }

        if ($request->filled('start_date') && $request->filled('end_date')) {
            $query->forPeriod((string) $request->input('start_date'), (string) $request->input('end_date'));
        } elseif ($request->filled('start_date')) {
            $query->where('date', '>=', (string) $request->input('start_date'));
        } elseif ($request->filled('end_date')) {
            $query->where('date', '<=', (string) $request->input('end_date'));
        }

        $incomeQuery = (clone $query)->where('type', 'INCOME');
        $expenseQuery = (clone $query)->where('type', 'EXPENSE');

        $totalIncome = (float) $incomeQuery->sum('amount');
        $totalExpense = (float) $expenseQuery->sum('amount');
        $netBalance = $totalIncome - $totalExpense;

        return response()->json([
            'data' => [
                'total_income' => number_format($totalIncome, 2, '.', ''),
                'total_expense' => number_format($totalExpense, 2, '.', ''),
                'net_balance' => number_format($netBalance, 2, '.', ''),
                'count' => $query->count(),
            ],
        ]);
    }

    /**
     * Cria uma nova transação.
     */
    public function store(TransactionRequest $request): JsonResponse
    {
        $this->authorize('create', Transaction::class);

        /** @var User $user */
        $user = $request->user();

        $transaction = $this->transactionService->create($user, $request->validated());
        $transaction->load(['account', 'category', 'destinationAccount']);

        return (new TransactionResource($transaction))
            ->response()
            ->setStatusCode(201);
    }

    /**
     * Exibe os detalhes de uma transação.
     */
    public function show(Transaction $transaction): TransactionResource
    {
        $this->authorize('view', $transaction);

        $transaction->load(['account', 'category', 'destinationAccount']);

        return new TransactionResource($transaction);
    }

    /**
     * Atualiza uma transação existente recalculando os saldos.
     */
    public function update(TransactionRequest $request, Transaction $transaction): TransactionResource
    {
        $this->authorize('update', $transaction);

        $updated = $this->transactionService->update($transaction, $request->validated());
        $updated->load(['account', 'category', 'destinationAccount']);

        return new TransactionResource($updated);
    }

    /**
     * Exclui uma transação com estorno no saldo das contas.
     */
    public function destroy(Transaction $transaction): JsonResponse
    {
        $this->authorize('delete', $transaction);

        $this->transactionService->delete($transaction);

        return response()->json(['message' => 'Transação excluída com sucesso.']);
    }
}
