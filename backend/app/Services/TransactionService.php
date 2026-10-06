<?php

namespace App\Services;

use App\Models\Account;
use App\Models\Transaction;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class TransactionService
{
    /**
     * Cria uma nova transação e atualiza o saldo das contas se o status for COMPLETED.
     *
     * @param  array<string, mixed>  $data
     */
    public function create(User $user, array $data): Transaction
    {
        return DB::transaction(function () use ($user, $data) {
            $data['user_id'] = $user->id;
            $data['status'] = $data['status'] ?? 'COMPLETED';

            /** @var Transaction $transaction */
            $transaction = Transaction::create($data);

            if ($transaction->status === 'COMPLETED') {
                $this->applyBalanceEffect($transaction);
            }

            return $transaction;
        });
    }

    /**
     * Atualiza uma transação existente recalculando os saldos afetados de forma atômica.
     *
     * @param  array<string, mixed>  $data
     */
    public function update(Transaction $transaction, array $data): Transaction
    {
        return DB::transaction(function () use ($transaction, $data) {
            // Reverter efeito anterior se estava completada
            if ($transaction->status === 'COMPLETED') {
                $this->revertBalanceEffect($transaction);
            }

            $transaction->update($data);
            $transaction->refresh();

            // Aplicar novo efeito se nova versão está completada
            if ($transaction->status === 'COMPLETED') {
                $this->applyBalanceEffect($transaction);
            }

            return $transaction;
        });
    }

    /**
     * Exclui uma transação com estorno do saldo das contas.
     */
    public function delete(Transaction $transaction): bool
    {
        return DB::transaction(function () use ($transaction) {
            if ($transaction->status === 'COMPLETED') {
                $this->revertBalanceEffect($transaction);
            }

            return (bool) $transaction->delete();
        });
    }

    /**
     * Aplica o impacto financeiro da transação nos saldos.
     */
    protected function applyBalanceEffect(Transaction $transaction): void
    {
        $amount = (float) $transaction->amount;

        /** @var Account $account */
        $account = Account::where('id', $transaction->account_id)->lockForUpdate()->firstOrFail();

        if ($transaction->type === 'INCOME') {
            $account->current_balance = round((float) $account->current_balance + $amount, 2);
            $account->save();
        } elseif ($transaction->type === 'EXPENSE') {
            $account->current_balance = round((float) $account->current_balance - $amount, 2);
            $account->save();
        } elseif ($transaction->type === 'TRANSFER' && $transaction->destination_account_id) {
            // Débito na conta de origem
            $account->current_balance = round((float) $account->current_balance - $amount, 2);
            $account->save();

            // Crédito na conta de destino
            /** @var Account $destinationAccount */
            $destinationAccount = Account::where('id', $transaction->destination_account_id)->lockForUpdate()->firstOrFail();
            $destinationAccount->current_balance = round((float) $destinationAccount->current_balance + $amount, 2);
            $destinationAccount->save();
        }
    }

    /**
     * Reverte o impacto financeiro da transação nos saldos (estorno).
     */
    protected function revertBalanceEffect(Transaction $transaction): void
    {
        $amount = (float) $transaction->amount;

        /** @var Account $account */
        $account = Account::where('id', $transaction->account_id)->lockForUpdate()->firstOrFail();

        if ($transaction->type === 'INCOME') {
            $account->current_balance = round((float) $account->current_balance - $amount, 2);
            $account->save();
        } elseif ($transaction->type === 'EXPENSE') {
            $account->current_balance = round((float) $account->current_balance + $amount, 2);
            $account->save();
        } elseif ($transaction->type === 'TRANSFER' && $transaction->destination_account_id) {
            // Estorno de débito na conta de origem
            $account->current_balance = round((float) $account->current_balance + $amount, 2);
            $account->save();

            // Estorno de crédito na conta de destino
            /** @var Account $destinationAccount */
            $destinationAccount = Account::where('id', $transaction->destination_account_id)->lockForUpdate()->firstOrFail();
            $destinationAccount->current_balance = round((float) $destinationAccount->current_balance - $amount, 2);
            $destinationAccount->save();
        }
    }
}
