<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('transactions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('account_id')->constrained('accounts')->cascadeOnDelete();
            $table->foreignId('category_id')->nullable()->constrained('categories')->nullOnDelete();
            $table->foreignId('destination_account_id')->nullable()->constrained('accounts')->nullOnDelete();
            $table->string('type', 20); // INCOME, EXPENSE, TRANSFER
            $table->decimal('amount', 15, 2);
            $table->date('date');
            $table->string('description', 255);
            $table->text('notes')->nullable();
            $table->string('payment_method', 50)->nullable(); // PIX, CREDIT_CARD, DEBIT_CARD, BOLETO, CASH, TRANSFER, OTHER
            $table->string('status', 30)->default('COMPLETED'); // COMPLETED, PENDING, CANCELLED
            $table->boolean('is_recurring')->default(false);
            $table->timestamps();
            $table->softDeletes();

            $table->index(['user_id', 'date']);
            $table->index(['account_id', 'date']);
            $table->index(['user_id', 'type']);
            $table->index(['user_id', 'status']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('transactions');
    }
};
