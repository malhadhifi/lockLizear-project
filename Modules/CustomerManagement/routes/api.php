<?php

use Illuminate\Support\Facades\Route;
use Modules\CustomerManagement\Http\Controllers\CustomerAccountController;
use Modules\CustomerManagement\Http\Controllers\DeviceController;
use Modules\CustomerManagement\Http\Controllers\DocumentCustomersController;
use Modules\CustomerManagement\Http\Controllers\LicenseController;
use Modules\CustomerManagement\Http\Controllers\LicenseDocumentController;
use Modules\CustomerManagement\Http\Controllers\LicensPublicationController;
use Modules\CustomerManagement\Http\Controllers\PublicationAccessController;



Route::prefix("publisher_panel")->group(function () {

    Route::middleware(['auth:publisher_api', 'ability:panel-access'])->group(function () {

        Route::post('/licenses/individual', [LicenseController::class, 'storeIndividual']);

        // رابط الرخص الجماعية (الكروت)
        Route::post('/licenses/vouchers', [LicenseController::class, 'storeGroup']);
    });
});


// publisher_panel/licenses/vouchers
// مجموعة الروابط الخاصة بوصول العملاء للمنشورات
Route::prefix('publications/{publication}')->group(function () {

    // 1. رابط جلب قائمة العملاء (يدعم البحث، الفلترة، والترتيب)
    // نوع الطلب: GET
    Route::get('/access', [PublicationAccessController::class, 'index']);

    // 2. رابط تنفيذ الإجراءات الجماعية (منح/سحب الصلاحيات)
    // نوع الطلب: POST
    Route::post('/access/bulk', [PublicationAccessController::class, 'bulkAction']);

});


Route::prefix('documents/{document}')->group(function () {

    // 1. رابط جلب قائمة العملاء للمستند (يدعم البحث، الفلترة، والترتيب)
    // نوع الطلب: GET
    Route::get('/access', [DocumentCustomersController::class, 'index']);

    // 2. رابط تنفيذ الإجراءات الجماعية للمستند (منح/سحب الصلاحيات)
    // نوع الطلب: POST
    Route::post('/access/bulk', [DocumentCustomersController::class, 'bulkAction']);

});

Route::middleware('api')->group(function () {
    // عرض قائمة العملاء
    Route::get('/customers', [CustomerAccountController::class, 'index']);

    // تنفيذ الإجراءات على العملاء المحددين
    Route::post('/customers/bulk-action', [CustomerAccountController::class, 'bulkAction']);

    // جلب تفاصيل عميل محدد
    Route::get('/customers/{id}', [CustomerAccountController::class, 'show']);

    // تحديث بيانات عميل محدد (بما فيها تقييد الموقع)
    Route::put('/customers/{id}', [CustomerAccountController::class, 'update']);
    // جلب أجهزة العميل (رقم الرخصة هو المتغير)
});


Route::prefix('licenses/{license}/devices')->group(function () {
    // عرض أجهزة هذا العميل
    Route::get('/', [DeviceController::class, 'index']);

    // الإجراء الجماعي لأجهزة هذا العميل (الآيدي في الرابط، وباقي البيانات في الـ Body)
    Route::post('/bulk-action', [DeviceController::class, 'bulkAction']);
});


Route::middleware(['auth:publisher_api', 'ability:panel-access'])->group(function () {
    // ... بقية المسارات

    // رابط تحميل ملف الرخصة للعميل (فردي أو كروت)
    Route::get('/licenses/{license}/download', [LicenseController::class, 'downloadFile']);
});






/*
|--------------------------------------------------------------------------
| API Routes for Customer Management Module
|--------------------------------------------------------------------------
*/

Route::prefix('customer-licenses')->group(function () {

    // 1. جلب كل المنشورات مع توضيح حالة وصول العميل المحدد لها (unlimited, limited, no)
    Route::get('/{customer_license_id}/publications', [LicensPublicationController::class, 'index']);

    // 2. الإجراءات الجماعية لتعديل صلاحيات العميل المحددة (منح وصول، تقييد بتواريخ، أو إلغاء وصول)
    Route::post('/{customer_license_id}/publications/bulk-access', [LicensPublicationController::class, 'updateAccess']);

});

Route::prefix('customer-licenses')->group(function () {
    // ... الروابط السابقة الخاصة بالمنشورات ...

    // جلب الملفات المباشرة للعميل المحدد مع حالة وصوله
    Route::get('/{customer_license_id}/documents', [LicenseDocumentController::class, 'index']);

    // تعديل صلاحيات وصول العميل لملفات محددة (unlimited, limited, baselimited, revoke)
    Route::post('/{customer_license_id}/documents/bulk-access', [LicenseDocumentController::class, 'updateAccess']);
});
