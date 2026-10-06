<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Category\CategoryRequest;
use App\Http\Resources\CategoryResource;
use App\Models\Category;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class CategoryController extends Controller
{
    /**
     * Listagem de categorias acessíveis pelo usuário (próprias + sistema).
     */
    public function index(Request $request): JsonResponse
    {
        /** @var User $user */
        $user = $request->user();

        $query = Category::forUser($user->id);

        if ($request->filled('type')) {
            $query->ofType($request->string('type')->toString());
        }

        if ($request->has('is_active')) {
            $query->where('is_active', $request->boolean('is_active'));
        }

        if ($request->filled('search')) {
            $search = $request->string('search')->toString();
            $query->where('name', 'like', "%{$search}%");
        }

        $categories = $query->orderBy('name')->get();

        return response()->json([
            'success' => true,
            'data' => CategoryResource::collection($categories),
            'message' => null,
        ]);
    }

    /**
     * Criação de nova categoria associada ao usuário.
     */
    public function store(CategoryRequest $request): JsonResponse
    {
        /** @var User $user */
        $user = $request->user();

        $data = $request->validated();
        $data['user_id'] = $user->id;

        $category = Category::create($data);

        return response()->json([
            'success' => true,
            'data' => new CategoryResource($category),
            'message' => 'Categoria criada com sucesso.',
        ], 201);
    }

    /**
     * Detalhes de uma categoria.
     */
    public function show(Category $category): JsonResponse
    {
        Gate::authorize('view', $category);

        return response()->json([
            'success' => true,
            'data' => new CategoryResource($category),
            'message' => null,
        ]);
    }

    /**
     * Atualização de categoria existente.
     */
    public function update(CategoryRequest $request, Category $category): JsonResponse
    {
        Gate::authorize('update', $category);

        $category->update($request->validated());

        return response()->json([
            'success' => true,
            'data' => new CategoryResource($category),
            'message' => 'Categoria atualizada com sucesso.',
        ]);
    }

    /**
     * Exclusão (soft delete) da categoria.
     */
    public function destroy(Category $category): JsonResponse
    {
        Gate::authorize('delete', $category);

        $category->delete();

        return response()->json([
            'success' => true,
            'data' => null,
            'message' => 'Categoria excluída com sucesso.',
        ]);
    }
}
