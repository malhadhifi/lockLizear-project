<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up()
    {
        Schema::table('document_security_controls', function (Blueprint $table) {
            // --- 4. إعدادات الطباعة (Printing) ---
            $table->enum('print_mode', ['disabled', 'unlimited', 'limited'])->default('disabled')->after('max_views_allowed');
            $table->unsignedInteger('max_prints_allowed')->nullable()->after('print_mode');

            // --- 5. تسجيل السجلات (Logging) ---
            $table->boolean('log_views')->default(false)->after('max_prints_allowed');
            $table->boolean('log_prints')->default(false)->after('log_views');
        });
    }

    public function down()
    {
        Schema::table('document_security_controls', function (Blueprint $table) {
            $table->dropColumn(['print_mode', 'max_prints_allowed', 'log_views', 'log_prints']);
        });
    }
};
