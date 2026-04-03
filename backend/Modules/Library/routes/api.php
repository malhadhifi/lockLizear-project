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

        // ==================== Publications ====================
        Route::prefix('publications')->group(function () {

            Route::get('/',                                                    [PublicationController::class, 'index']);
            Route::post('/',                                                   [PublicationController::class, 'store']);
            Route::put('/{publication}',                                       [PublicationController::class, 'update']);

            // bulk-action يجب أن يكون قبل /{publication} لتجنب تعارض المسارات
            Route::post('/bulk-action',                                        [PublicationController::class, 'bulkAction']);

            Route::get('/{publication}',                                       [PublicationController::class, 'show']);

            Route::get('/{publication_id}/documents',                          [PublicationController::class, 'getDocuments']);
            Route::post('/{publication_id}/documents/attach',                  [PublicationController::class, 'attachDocuments']);
            Route::delete('/{publication_id}/documents/{document_id}',         [PublicationController::class, 'detachDocument']);

            Route::get('/{publication_id}/subscribers',                        [PublicationController::class, 'getSubscribers']);
            Route::post('/{publication_id}/subscribers/revoke',                [PublicationController::class, 'revokeSubscriberAccess']);
        });

        // ==================== Documents ====================
        Route::prefix('documents')->group(function () {

            Route::get('/',            [DocumentController::class, 'index']);

            // ⚠️ المسارات الثابتة يجب أن تكون قبل /{id} لتجنب تعارض المسارات
            Route::post('/action',     [DocumentController::class, 'executeAction']);
            Route::get('/export',      [DocumentController::class, 'export']);         // تصدير CSV

            Route::get('/{id}',        [DocumentController::class, 'show']);
            Route::put('/{id}',        [DocumentController::class, 'update']);
            Route::get('/{id}/access', [DocumentController::class, 'accessList']);    // قائمة العملاء المصرح لهم
        });
    });
});
