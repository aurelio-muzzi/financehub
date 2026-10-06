<?php

namespace App\Http\Requests\Profile;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class UpdatePreferencesRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    /**
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'theme' => ['sometimes', 'string', 'in:light,dark,system'],
            'currency' => ['sometimes', 'string', 'in:BRL,USD,EUR'],
            'date_format' => ['sometimes', 'string', 'max:20'],
            'timezone' => ['sometimes', 'string', 'max:50'],
            'notify_overdue' => ['sometimes', 'boolean'],
            'notify_due_soon' => ['sometimes', 'boolean'],
        ];
    }
}
