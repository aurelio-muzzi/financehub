<?php

namespace App\Http\Requests\Account;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class AccountRequest extends FormRequest
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
        $allowedTypes = ['BANK', 'CASH', 'DIGITAL_WALLET', 'CREDIT_CARD', 'INVESTMENT', 'OTHER'];

        return [
            'name' => [
                $this->isMethod('POST') ? 'required' : 'sometimes',
                'string',
                'max:100',
            ],
            'type' => [
                $this->isMethod('POST') ? 'required' : 'sometimes',
                'string',
                Rule::in($allowedTypes),
            ],
            'initial_balance' => ['sometimes', 'numeric'],
            'color' => ['nullable', 'string', 'max:30'],
            'icon' => ['nullable', 'string', 'max:50'],
            'is_active' => ['nullable', 'boolean'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'name.required' => 'O nome da conta é obrigatório.',
            'name.max' => 'O nome da conta não pode exceder 100 caracteres.',
            'type.required' => 'O tipo de conta é obrigatório.',
            'type.in' => 'Tipo de conta inválido. Opções: BANK, CASH, DIGITAL_WALLET, CREDIT_CARD, INVESTMENT, OTHER.',
            'initial_balance.numeric' => 'O saldo inicial deve ser um valor numérico válido.',
        ];
    }
}
