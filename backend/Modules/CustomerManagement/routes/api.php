<?php

use Illuminate\Support\Facades\Route;
use Modules\CustomerManagement\Http\Controllers\CustomerLicenseController;
use Modules\CustomerManagement\Http\Controllers\LicenseDocumentsController;
use Modules\CustomerManagement\Http\Controllers\LicensePublicationController;
use Modules\CustomerManagement\Http\Controllers\ReaderAuthController;

// ====================================================================
// مسارات تسجيل القارئ (Public - لا تحتاج توكن)
// ====================================================================
Route::prefix('reader')->group(function () {
    Route::post('/register',      [ReaderAuthController::class, 'register']);
    Route::post('/verify-email',  [ReaderAuthController::class, 'verifyEmail']);
    Route::post('/resend-otp',    [ReaderAuthController::class, 'resendOtp']);
});


// ====================================================================
// مسارات لوحة الناشر (محمية)
// ====================================================================
Route::prefix('customer-licenses')->middleware([
    'auth:publisher_api',
    'ability:panel-access',
])->group(function () {

    Route::get('/',              [CustomerLicenseController::class, 'index']);
    Route::post('/',             [CustomerLicenseController::class, 'store']);
    Route::post('/bulk-action',  [CustomerLicenseController::class, 'bulkAction']);
    Route::get('/{id}',          [CustomerLicenseController::class, 'show']);
    Route::get('/{id}/download', [CustomerLicenseController::class, 'download']);
    Route::put('/{id}',          [CustomerLicenseController::class, 'update']);

    Route::get('/{customer_license_id}/publications',              [LicensePublicationController::class, 'index']);
    Route::post('/{customer_license_id}/publications/bulk-access', [LicensePublicationController::class, 'updateAccess']);

    Route::get('/{customer_license_id}/documents',              [LicenseDocumentsController::class, 'index']);
    Route::post('/{customer_license_id}/documents/bulk-access', [LicenseDocumentsController::class, 'updateAccess']);
});
