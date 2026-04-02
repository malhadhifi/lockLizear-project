<?php

// use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Route;
use Modules\SaaSAdmin\Actions\CreatePublisherAndLicenseAction;

Route::get('/test-real-flow', function (CreatePublisherAndLicenseAction $action) {

    // 1. تجهيز بيانات ناشر جديدة (كأنها قادمة من فورم التسجيل)
    $publisherData = [
        'name' => 'شركة النشر الحديثة',
        'email' => 'malhadhifi@gmail.com', // إيميل عشوائي لكي لا يتكرر
        'domain' => 'modern-publisher.com',
        'status' => 'active',
    ];

    // 2. أرقام افتراضية للباقة والموظف (تأكد أن لديك باقة رقم 1 في الداتابيز)
    $packageId = 1;
    $adminId = 1;

    try {
        // 3. اللحظة الحاسمة: تشغيل المحرك الأساسي!
        // هذا السطر سينشئ الناشر، الرخصة، ملف LZPK، وسيطلق الـ Event الذي يرسل الإيميل
        $result = $action->execute($publisherData, $packageId, $adminId);


       $safe=base64_encode($result['binary_file']);
        // نستدعي الإشعار مباشرة ونعطيه للناشر!
       $result['publisher']->notify(new LicenseGeneratedNotification($safe));

        return response()->json([
            'success' => true,
            'message' => '✅ تمت الدورة بالكامل بنجاح!',
            'publisher_id' => $result['publisher']->id,
            'license_id' => $result['license']->id,
            'note' => 'اذهب الآن وتأكد من قاعدة البيانات، ثم افتح ملف laravel.log لرؤية الإيميل المرفق.'
        ]);

    } catch (\Exception $e) {
        return response()->json([
            'success' => false,
            'error' => 'حدث خطأ: ' . $e->getMessage()
        ]);
    }
});


Route::get('/get-public-key', function () {
    // 1. جلب مسار المفتاح الخاص من الإعدادات
    $keyPath = config('saasadmin.server_private_key_path');

    if (!file_exists($keyPath)) {
        return "ملف المفتاح الخاص غير موجود في المسار المكتوب!";
    }

    // 2. قراءة المفتاح الخاص
    $privateKeyContent = file_get_contents($keyPath);
    $privateKeyResource = openssl_pkey_get_private($privateKeyContent);

    if (!$privateKeyResource) {
        return "فشل في قراءة المفتاح الخاص. تأكد من صيغة الملف.";
    }

    // 3. استخراج تفاصيل المفتاح (والتي تتضمن المفتاح العام تلقائياً)
    $keyDetails = openssl_pkey_get_details($privateKeyResource);
    $publicKey = $keyDetails['key'];

    // 4. إرجاع المفتاح كنص نقي (Text) لكي لا يحذف المتصفح الأسطر
    return response($publicKey)->header('Content-Type', 'text/plain');
});
