<?php

use Illuminate\Support\Facades\Route;
use Modules\CustomerManagement\Http\Controllers\CustomerLicenseController;
use Modules\CustomerManagement\Http\Controllers\LicenseDocumentsController;
use Modules\CustomerManagement\Http\Controllers\LicensePublicationController;

Route::prefix('customer-licenses')->middleware([
    'auth:publisher_api',
    'ability:panel-access',
])->
group(function () {

    // ====================================================================
    // 1. إدارة الرخص الأساسية (Customer Licenses CRUD & Bulk Actions)
    // ====================================================================

    // جلب كل الرخص مع الفلاتر والبحث
    Route::get('/', [CustomerLicenseController::class, 'index']);

    // إنشاء رخصة جديدة (فردية أو جماعية)
    Route::post('/', [CustomerLicenseController::class, 'store']);

    // الإجراءات الجماعية على الرخص (إيقاف، تفعيل، حذف، منح وصول عام)
    Route::post('/bulk-action', [CustomerLicenseController::class, 'bulkAction']);

    // عرض تفاصيل رخصة محددة
    Route::get('/{id}', [CustomerLicenseController::class, 'show']);

    // تحديث بيانات رخصة (مع دعم تحديث صلاحيات المنشورات والملفات المدمجة)
    Route::put('/{id}', [CustomerLicenseController::class, 'update']);


    // ====================================================================
    // 2. إدارة المنشورات التابعة لرخصة محددة (Nested Publications)
    // ====================================================================

    // جلب المنشورات المتاحة للرخصة مع حالة الوصول
    Route::get('/{customer_license_id}/publications', [LicensePublicationController::class, 'index']);

    // تعديل صلاحيات وصول الرخصة لمنشورات محددة (روابط النوافذ المنبثقة)
    Route::post('/{customer_license_id}/publications/bulk-access', [LicensePublicationController::class, 'updateAccess']);


    // ====================================================================
    // 3. إدارة الملفات المباشرة التابعة لرخصة محددة (Nested Documents)
    // ====================================================================

    // جلب الملفات المباشرة المتاحة للرخصة مع حالة الوصول
    Route::get('/{customer_license_id}/documents', [LicenseDocumentsController::class, 'index']);

    // تعديل صلاحيات وصول الرخصة لملفات محددة (روابط النوافذ المنبثقة)
    Route::post('/{customer_license_id}/documents/bulk-access', [LicenseDocumentsController::class, 'updateAccess']);

});


