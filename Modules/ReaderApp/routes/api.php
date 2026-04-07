<?php

use Illuminate\Support\Facades\Route;

use Modules\ReaderApp\Http\Controllers\LicenseController;
// use Modules\ReaderApp\Http\Controllers\ReaderActivationController;
// use Modules\ReaderApp\Http\Controllers\ReaderAppController;
// use Modules\ReaderApp\Http\Controllers\ReaderSyncController;
// use Modules\ReaderApp\Http\Controllers\ReaderVerificationController;
use Modules\ReaderApp\Http\Controllers\AuthController;

use Modules\ReaderApp\Http\Controllers\SyncController;


// });

/*
|--------------------------------------------------------------------------
| API Routes لـ ReaderApp
|--------------------------------------------------------------------------
*/

// البادئة الأساسية للوحدة: /api/reader
Route::prefix('reader')->group(function () {
    // ==========================================
    // مسارات المصادقة (لا تتطلب تسجيل دخول / توكن)
    // ==========================================
    Route::prefix('auth')->group(function () {

        // 1. تسجيل حساب جديد (يرجع كود 1010)
        Route::post('register', [AuthController::class, 'register']);

        // 2. طلب كود جديد للإيميل (يرجع كود 1011)
        Route::post('resend-otp', [AuthController::class, 'resendOtp']);

        // 3. إدخال الكود للحصول على التوكن والبيانات (يرجع كود 1012)
        Route::post('login', [AuthController::class, 'login']);
        Route::post('verify-otp', [AuthController::class, 'verify']);


    });

});


/*
|--------------------------------------------------------------------------
| مسارات تطبيق القارئ (Reader App API)
|--------------------------------------------------------------------------
| جميع هذه المسارات محمية بطبقة المصادقة (auth:sanctum)
| يجب إرسال الهيدر التالي في كل طلب:
| Authorization: Bearer {Your_Token_Here}
| Accept: application/json
*/

Route::prefix('reader')->middleware('auth:reader_api')->group(function () {

    // 1. رابط تفعيل الرخصة (Activation)
    Route::post('/license/activate', [LicenseController::class, 'activate']);

    // 2. رابط الفحص السريع للملف الفردي (Ping)
    Route::post('/license/sync', [SyncController::class, 'sync']);

    Route::post('/document/ping', [LicenseController::class, 'ping']);

    // 3. رابط المزامنة الشاملة للرخصة (Sync Engine)
    // رابط الفحص العام لحالة الجهاز (بمجرد الاتصال بالإنترنت)
    Route::post('/device/ping', [SyncController::class, 'pingDevice']);

    Route::post('/device/logout', [AuthController::class, 'logout']);




    // 4. رابط مزامنة فهرس الملفات (للبحث والتحميل)
    Route::get('/catalog/sync', [SyncController::class, 'syncCatalog']);

    // 5. رابط التوجيه للتحميل (Proxy) الذي شرحناه سابقاً
    Route::get('/download/{uuid}', [SyncController::class, 'downloadFile']);

});
Route::prefix('reader')->middleware('auth:reader_api')->group(function () {

    // ... المسارات الحالية ...

});
