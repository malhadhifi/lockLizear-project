<?php

use Illuminate\Support\Facades\Route;
use Modules\Library\App\Http\Controllers\PublicationController;
use Modules\Library\App\Http\Controllers\DocumentController;

/*
|--------------------------------------------------------------------------
| API Routes for Library Module
|--------------------------------------------------------------------------
*/

Route::middleware(['auth:publisher_api', 'ability:panel-access'])->group(function () {

    Route::prefix('library')->group(function () {

        // ==================== Publications ====================
        Route::prefix('publications')->group(function () {

            // جلب المنشورات مع الفلاتر والبحث
            Route::get('/',  [PublicationController::class, 'index']);

            // إضافة منشور جديد
            Route::post('/', [PublicationController::class, 'store']);

            // تعديل منشور موجود
            Route::put('/{publication}', [PublicationController::class, 'update']);

            // إجراءات جماعية - يجب أن يكون قبل /{publication}
            Route::post('/bulk-action', [PublicationController::class, 'bulkAction']);

            // جلب تفاصيل منشور فردي
            Route::get('/{publication}', [PublicationController::class, 'show']);

            // مسارات المستندات
            Route::get('/{publication_id}/documents',                          [PublicationController::class, 'getDocuments']);
            Route::post('/{publication_id}/documents/attach',                  [PublicationController::class, 'attachDocuments']);
            Route::delete('/{publication_id}/documents/{document_id}',         [PublicationController::class, 'detachDocument']);

            // مسارات عملاء المنشور
            Route::get('/{publication_id}/subscribers',                        [PublicationController::class, 'getSubscribers']);
            Route::post('/{publication_id}/subscribers/revoke',                [PublicationController::class, 'revokeSubscriberAccess']);
        });

        // ==================== Documents ====================
        Route::prefix('documents')->group(function () {

            // جلب كل الملفات مع الفلاتر
            Route::get('/',  [DocumentController::class, 'index']);

            // تغيير حالة ملفات (deleted, suspended, active) - يجب أن يكون قبل /{id}
            Route::post('/action', [DocumentController::class, 'executeAction']);

            // جلب تفاصيل ملف واحد
            Route::get('/{id}',  [DocumentController::class, 'show']);

            // تعديل وصف أو تاريخ الانتهاء
            Route::put('/{id}',  [DocumentController::class, 'update']);
        });
    });
});
