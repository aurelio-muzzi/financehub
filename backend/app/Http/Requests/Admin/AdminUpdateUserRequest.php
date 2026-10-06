<?php

namespace App\Http\Requests\Admin;

use App\Models\User;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class AdminUpdateUserRequest extends FormRequest
{
    public function authorize(): bool
    {
        /** @var User|null $user */
        $user = $this->user();

        return $user !== null && $user->isAdmin();
    }

    /**
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'role_id' => ['required', 'exists:roles,id'],
            'status' => ['required', 'in:ACTIVE,INACTIVE'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'role_id.required' => 'O perfil de acesso (Role) é obrigatório.',
            'role_id.exists' => 'O perfil de acesso selecionado não existe.',
            'status.required' => 'O status do usuário é obrigatório.',
            'status.in' => 'O status deve ser ACTIVE ou INACTIVE.',
        ];
    }
}
