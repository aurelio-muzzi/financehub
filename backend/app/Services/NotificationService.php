<?php

namespace App\Services;

use App\Models\Account;
use App\Models\Transaction;
use App\Models\User;
use App\Models\UserNotification;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Collection;

class NotificationService
{
    /**
     * Retorna a lista unificada de notificações e alertas inteligentes de vencimentos/saldos.
     *
     * @return array{
     *     alerts: list<array<string, mixed>>,
     *     notifications: list<array<string, mixed>>,
     *     unread_count: int
     * }
     */
    public function getSummary(User $user): array
    {
        $today = Carbon::today();
        $inSevenDays = Carbon::today()->addDays(7);

        // 1. Alertas de transações vencidas (pendentes com data < hoje)
        $overdueTransactions = Transaction::query()
            ->where('user_id', $user->id)
            ->where('status', 'PENDING')
            ->whereNotNull('date')
            ->where('date', '<', $today)
            ->with(['account:id,name', 'category:id,name'])
            ->orderBy('date', 'asc')
            ->limit(10)
            ->get();

        $alerts = [];

        foreach ($overdueTransactions as $tx) {
            $formattedDate = Carbon::parse($tx->date)->format('d/m/Y');
            $alerts[] = [
                'id' => 'tx-overdue-'.$tx->id,
                'source' => 'transaction',
                'type' => 'DANGER',
                'title' => 'Conta Vencida: '.$tx->description,
                'message' => "Vencida em {$formattedDate} no valor de R$ ".number_format((float) $tx->amount, 2, ',', '.'),
                'date' => Carbon::parse($tx->date)->toDateString(),
                'is_urgent' => true,
                'transaction_id' => $tx->id,
                'account_name' => $tx->account?->name,
                'category_name' => $tx->category?->name,
            ];
        }

        // 2. Alertas de transações a vencer nos próximos 7 dias
        $dueSoonTransactions = Transaction::query()
            ->where('user_id', $user->id)
            ->where('status', 'PENDING')
            ->whereNotNull('date')
            ->whereBetween('date', [$today, $inSevenDays])
            ->with(['account:id,name', 'category:id,name'])
            ->orderBy('date', 'asc')
            ->limit(10)
            ->get();

        foreach ($dueSoonTransactions as $tx) {
            $formattedDate = Carbon::parse($tx->date)->format('d/m/Y');
            $isToday = Carbon::parse($tx->date)->isToday();
            $alerts[] = [
                'id' => 'tx-due-'.$tx->id,
                'source' => 'transaction',
                'type' => $isToday ? 'DANGER' : 'WARNING',
                'title' => ($isToday ? 'Vence Hoje: ' : 'Vence em Breve: ').$tx->description,
                'message' => "Vencimento em {$formattedDate} no valor de R$ ".number_format((float) $tx->amount, 2, ',', '.'),
                'date' => Carbon::parse($tx->date)->toDateString(),
                'is_urgent' => $isToday,
                'transaction_id' => $tx->id,
                'account_name' => $tx->account?->name,
                'category_name' => $tx->category?->name,
            ];
        }

        // 3. Alertas de contas com saldo negativo
        $negativeAccounts = Account::query()
            ->where('user_id', $user->id)
            ->where('current_balance', '<', 0)
            ->get();

        foreach ($negativeAccounts as $account) {
            $alerts[] = [
                'id' => 'acc-neg-'.$account->id,
                'source' => 'account',
                'type' => 'WARNING',
                'title' => "Saldo Negativo: {$account->name}",
                'message' => 'Conta com saldo devedor de R$ '.number_format((float) $account->current_balance, 2, ',', '.'),
                'date' => now()->toDateString(),
                'is_urgent' => true,
                'account_id' => $account->id,
                'account_name' => $account->name,
            ];
        }

        // 4. Notificações persistidas
        /** @var Collection<int, UserNotification> $stored */
        $stored = UserNotification::query()
            ->where('user_id', $user->id)
            ->orderByDesc('created_at')
            ->limit(20)
            ->get();

        $notificationsList = [];
        $unreadCount = count($alerts); // Alertas ativos contam como itens que exigem atenção

        foreach ($stored as $notif) {
            if ($notif->read_at === null) {
                $unreadCount++;
            }

            $notificationsList[] = [
                'id' => $notif->id,
                'source' => 'system',
                'type' => $notif->type,
                'title' => $notif->title,
                'message' => $notif->message,
                'data' => $notif->data,
                'read_at' => $notif->read_at?->toISOString(),
                'created_at' => $notif->created_at->toISOString(),
            ];
        }

        return [
            'alerts' => $alerts,
            'notifications' => $notificationsList,
            'unread_count' => $unreadCount,
        ];
    }

    public function markAsRead(User $user, int $notificationId): bool
    {
        $notification = UserNotification::where('user_id', $user->id)
            ->where('id', $notificationId)
            ->first();

        if ($notification) {
            $notification->markAsRead();

            return true;
        }

        return false;
    }

    public function markAllAsRead(User $user): void
    {
        UserNotification::where('user_id', $user->id)
            ->whereNull('read_at')
            ->update(['read_at' => now()]);
    }

    /**
     * @param  array<string, mixed>|null  $data
     */
    public function notify(User $user, string $type, string $title, string $message, ?array $data = null): UserNotification
    {
        return UserNotification::create([
            'user_id' => $user->id,
            'type' => strtoupper($type),
            'title' => $title,
            'message' => $message,
            'data' => $data,
        ]);
    }
}
