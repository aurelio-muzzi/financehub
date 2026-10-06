<?php

namespace App\Http\Resources;

use App\Models\Transaction;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin Transaction
 */
class TransactionResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'user_id' => $this->user_id,
            'account_id' => $this->account_id,
            'account' => new AccountResource($this->whenLoaded('account')),
            'category_id' => $this->category_id,
            'category' => new CategoryResource($this->whenLoaded('category')),
            'destination_account_id' => $this->destination_account_id,
            'destination_account' => new AccountResource($this->whenLoaded('destinationAccount')),
            'type' => $this->type,
            'amount' => number_format((float) $this->amount, 2, '.', ''),
            'date' => $this->date->format('Y-m-d'),
            'description' => $this->description,
            'notes' => $this->notes,
            'payment_method' => $this->payment_method,
            'status' => $this->status,
            'is_recurring' => $this->is_recurring,
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}
