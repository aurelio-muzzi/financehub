<?php

namespace App\Http\Requests\Category;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class CategoryRequest extends FormRequest
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
        $typeRules = ['required', 'string', Rule::in(['INCOME', 'EXPENSE'])];
        if ($this->isMethod('PATCH') || $this->isMethod('PUT')) {
            $typeRules = ['sometimes', 'string', Rule::in(['INCOME', 'EXPENSE'])];
        }

        return [
            'name' => [
                $this->isMethod('POST') ? 'required' : 'sometimes',
                'string',
                'max:100',
            ],
            'type' => $typeRules,
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
            'name.required' => 'O nome da categoria é obrigatório.',
            'name.max' => 'O nome da categoria não pode exceder 100 caracteres.',
            'type.required' => 'O tipo da categoria é obrigatório.',
            'type.in' => 'O tipo deve ser INCOME (Receita) ou EXPENSE (Despesa).',
        ];
    }
}
