<?php

use Illuminate\Support\Facades\Route;
use Modules\Library\Http\Controllers\PublicationController;
use Modules\Library\Http\Controllers\DocumentController;


/*
|--------------------------------------------------------------------------
| API Routes for Library Module
|--------------------------------------------------------------------------
*/

Route::middleware(['auth:publisher_api', 'ability:panel-access'])->group(function () {

    Route::prefix('publications')->group(function () {
        // 1. جلب المنشورات مع الفلاتر والبحث (لشاشة الإدارة العامة)
        Route::get('/', [PublicationController::class, 'index']);

        // 2. إضافة منشور جديد
        Route::post('/', [PublicationController::class, 'store']);

        // 3. تعديل منشور موجود (الوصف وقيد التاريخ فقط)
        Route::put('/{publication}', [PublicationController::class, 'update']);

        // 4. تنفيذ إجراءات جماعية (حذف أو إيقاف مجموعة منشورات)
        Route::post('/bulk-action', [PublicationController::class, 'bulkAction']);
        // جلب الملفات التابعة لمنشور محدد (توضع خارج الـ prefix الخاص بـ documents)


        Route::get('publications/{publication_id}/documents', [PublicationController::class, 'getDocuments']);
    });





    Route::prefix('documents')->group(function () {
        // جلب كل الملفات مع الفلاتر
        Route::get('/', [DocumentController::class, 'index']);

        // تغيير حالة ملفات (deleted, suspend, active)
        Route::post('/action', [DocumentController::class, 'executeAction']);

        // جلب تفاصيل ملف واحد
        Route::get('/{id}', [DocumentController::class, 'show']);

        // تعديل وصف أو تاريخ الانتهاء لملف
        Route::put('/{id}', [DocumentController::class, 'update']);
    });
});
