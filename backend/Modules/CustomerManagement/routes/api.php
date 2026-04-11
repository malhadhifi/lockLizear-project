<?php

use Illuminate\Support\Facades\Route;
use Modules\CustomerManagement\Http\Controllers\CustomerLicenseController;

// Route::prefix('customer-licenses')->middleware([
//     'auth:publisher_api',

//     'ability:panel-access',
// ])->
// group(function () {

//     // ====================================================================
//     // 1. إدارة الرخص الأساسية (Customer Licenses CRUD & Bulk Actions)
//     // ====================================================================

//     // جلب كل الرخص مع الفلاتر والبحث
//     Route::get('/', [CustomerLicenseController::class, 'index']);

//     // إنشاء رخصة جديدة (فردية أو جماعية)
//     Route::post('/', [CustomerLicenseController::class, 'store']);

//     // الإجراءات الجماعية على الرخص (إيقاف، تفعيل، حذف، منح وصول عام)
//     Route::post('/bulk-action', [CustomerLicenseController::class, 'bulkAction']);

//     // عرض تفاصيل رخصة محددة
//     Route::get('/{id}', [CustomerLicenseController::class, 'show']);

//     // تحديث بيانات رخصة (مع دعم تحديث صلاحيات المنشورات والملفات المدمجة)
//     Route::put('/{id}', [CustomerLicenseController::class, 'update']);


//     // ====================================================================
//     // 2. إدارة المنشورات التابعة لرخصة محددة (Nested Publications)
//     // ====================================================================

//     // جلب المنشورات المتاحة للرخصة مع حالة الوصول
//     Route::get('/{customer_license_id}/publications', [LicensPublicationController::class, 'index']);

//     // تعديل صلاحيات وصول الرخصة لمنشورات محددة (روابط النوافذ المنبثقة)
//     Route::post('/{customer_license_id}/publications/bulk-access', [LicensPublicationController::class, 'updateAccess']);


//     // ====================================================================
//     // 3. إدارة الملفات المباشرة التابعة لرخصة محددة (Nested Documents)
//     // ====================================================================

//     // جلب الملفات المباشرة المتاحة للرخصة مع حالة الوصول
//     Route::get('/{customer_license_id}/documents', [LicensDocumentController::class, 'index']);

//     // تعديل صلاحيات وصول الرخصة لملفات محددة (روابط النوافذ المنبثقة)
//     Route::post('/{customer_license_id}/documents/bulk-access', [LicensDocumentController::class, 'updateAccess']);

// });


use Modules\CustomerManagement\Http\Controllers\LicenseDocumentsController;
use Modules\CustomerManagement\Http\Controllers\LicensePublicationController;
// use Modules\CustomerManagement\Http\Controllers\ReaderAuthController;

// ====================================================================
// مسارات تسجيل القارئ (Public - لا تحتاج توكن)
// ====================================================================
// Route::prefix('reader')->group(function () {
//     Route::post('/register',      [ReaderAuthController::class, 'register']);
//     Route::post('/verify-email',  [ReaderAuthController::class, 'verifyEmail']);
//     Route::post('/resend-otp',    [ReaderAuthController::class, 'resendOtp']);
// });


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
    // 🚀 التعديل هنا: إضافة اسم للمسار
    Route::get('/{id}/download', [CustomerLicenseController::class, 'download'])->name('customer-licenses.download');
    Route::put('/{id}',          [CustomerLicenseController::class, 'update']);

    Route::get('/{customer_license_id}/publications',              [LicensePublicationController::class, 'index']);
    Route::post('/{customer_license_id}/publications/bulk-access', [LicensePublicationController::class, 'updateAccess']);

    Route::get('/{customer_license_id}/documents',              [LicenseDocumentsController::class, 'index']);
    Route::post('/{customer_license_id}/documents/bulk-access', [LicenseDocumentsController::class, 'updateAccess']);
});

