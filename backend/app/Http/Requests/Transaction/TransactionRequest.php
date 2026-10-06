<?php

namespace App\Http\Requests\Transaction;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class TransactionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, list<mixed>>
     */
    public function rules(): array
    {
        $userId = (int) $this->user()?->id;
        $isPost = $this->isMethod('POST');

        return [
            'account_id' => [
                $isPost ? 'required' : 'sometimes',
                'integer',
                Rule::exists('accounts', 'id')->where(function ($query) use ($userId) {
                    $query->where('user_id', $userId)->whereNull('deleted_at');
                }),
            ],
            'category_id' => [
                'nullable',
                'integer',
                Rule::exists('categories', 'id')->where(function ($query) use ($userId) {
                    $query->where(function ($q) use ($userId) {
                        $q->where('user_id', $userId)->orWhereNull('user_id');
                    })->whereNull('deleted_at');
                }),
            ],
            'destination_account_id' => [
                'nullable',
                'required_if:type,TRANSFER',
                'different:account_id',
                'integer',
                Rule::exists('accounts', 'id')->where(function ($query) use ($userId) {
                    $query->where('user_id', $userId)->whereNull('deleted_at');
                }),
            ],
            'type' => [
                $isPost ? 'required' : 'sometimes',
                'string',
                Rule::in(['INCOME', 'EXPENSE', 'TRANSFER']),
            ],
            'amount' => [
                $isPost ? 'required' : 'sometimes',
                'numeric',
                'gt:0',
            ],
            'date' => [
                $isPost ? 'required' : 'sometimes',
                'date',
            ],
            'description' => [
                $isPost ? 'required' : 'sometimes',
                'string',
                'max:255',
            ],
            'notes' => [
                'nullable',
                'string',
                'max:1000',
            ],
            'payment_method' => [
                'nullable',
                'string',
                Rule::in(['PIX', 'CREDIT_CARD', 'DEBIT_CARD', 'BOLETO', 'CASH', 'TRANSFER', 'OTHER']),
            ],
            'status' => [
                'nullable',
                'string',
                Rule::in(['COMPLETED', 'PENDING', 'CANCELLED']),
            ],
            'is_recurring' => [
                'nullable',
                'boolean',
            ],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'account_id.required' => 'A conta de origem é obrigatória.',
            'account_id.exists' => 'Conta bancária não encontrada ou não pertence a você.',
            'category_id.exists' => 'Categoria não encontrada ou não disponível.',
            'destination_account_id.required_if' => 'A conta de destino é obrigatória para transferências.',
            'destination_account_id.different' => 'A conta de destino deve ser diferente da conta de origem.',
            'destination_account_id.exists' => 'Conta de destino não encontrada ou não pertence a você.',
            'type.required' => 'O tipo de transação é obrigatório.',
            'type.in' => 'Tipo de transação inválido (INCOME, EXPENSE ou TRANSFER).',
            'amount.required' => 'O valor da transação é obrigatório.',
            'amount.gt' => 'O valor da transação deve ser maior que zero.',
            'date.required' => 'A data da transação é obrigatória.',
            'description.required' => 'A descrição da transação é obrigatória.',
        ];
    }
}
