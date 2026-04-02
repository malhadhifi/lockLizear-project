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

    Route::prefix('library')->group(function () {

        Route::prefix('publications')->group(function () {
    // 1. جلب المنشورات مع الفلاتر والبحث (لشاشة الإدارة العامة)
    Route::get('/', [PublicationController::class, 'index']);

    // 2. إضافة منشور جديد
    Route::post('/', [PublicationController::class, 'store']);

    // 3. تعديل منشور موجود (الوصف وقيد التاريخ فقط)
    Route::put('/{publication}', [PublicationController::class, 'update']);

    // 4. تنفيذ إجراءات جماعية (حذف أو إيقاف مجموعة منشورات)
    Route::post('/bulk-action', [PublicationController::class, 'bulkAction']);
    // 5. جلب تفاصيل منشور فردي (لتعبئة صفحة التعديل)
    Route::get('/{publication}', [PublicationController::class, 'show']);

    // جلب الملفات التابعة لمنشور محدد
    Route::get('/{publication_id}/documents', [PublicationController::class, 'getDocuments']);

    // مسارات ربط وفك المستندات بالمنشور
    Route::post('/{publication_id}/documents/attach', [PublicationController::class, 'attachDocuments']);
    Route::delete('/{publication_id}/documents/{document_id}', [PublicationController::class, 'detachDocument']);

    // مسارات عملاء المنشور المتداخلة
    Route::get('/{publication_id}/subscribers', [PublicationController::class, 'getSubscribers']);
    Route::post('/{publication_id}/subscribers/revoke', [PublicationController::class, 'revokeSubscriberAccess']);
});





Route::prefix('documents')->group(function () {
    // جلب كل الملفات مع الفلاتر
    Route::get('/', [DocumentController::class, 'index']);

    // تغيير حالة ملفات (deleted, suspended, active)
    Route::post('/action', [DocumentController::class, 'executeAction']);

    // جلب تفاصيل ملف واحد
    Route::get('/{id}', [DocumentController::class, 'show']);

    // تعديل وصف أو تاريخ الانتهاء لملف
    Route::put('/{id}', [DocumentController::class, 'update']);
    });
});
});
