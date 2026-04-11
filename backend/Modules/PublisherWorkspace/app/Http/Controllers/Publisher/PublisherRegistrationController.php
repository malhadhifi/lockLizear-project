<?php

namespace Modules\PublisherWorkspace\Http\Controllers\Publisher;

use App\Http\Controllers\Controller;
use App\Traits\ApiResponseTrait;
use Illuminate\Support\Facades\Storage;
use Modules\PublisherWorkspace\Http\Requests\RegisterPublisherRequest;
use Modules\PublisherWorkspace\Actions\CreatePublisherAndLicenseAction;
use Modules\PublisherWorkspace\Models\PublisherLicense;
use Modules\PublisherWorkspace\Transformers\PublisherResource;
use Modules\SaaSAdmin\Models\Package;

class PublisherRegistrationController extends Controller
{
    use ApiResponseTrait;

    public function register(RegisterPublisherRequest $request, CreatePublisherAndLicenseAction $action)
    {
        try {
            // 1. تحديد الباقة الافتراضية، وإذا لم تكن موجودة في السيرفر الحي نقوم بإنشائها تلقائياً
            $package = Package::where('is_default_registration', true)->first();

            if (!$package) {
                $package = Package::create([
                    'name' => 'الباقة المجانية',
                    'base_price' => 0,
                    'duration_days' => 30,
                    'trial_days' => 0,
                    'is_default_registration' => true,
                    'base_max_documents' => 10,
                    'base_max_file_size_mb' => 50,
                    'base_max_total_storage_mb' => 500,
                    'base_batch_size' => 5,
                    'base_devices_allowed' => 3,
                    'is_active' => true,
                    'allowed_extensions' => ['pdf'],
                    'features' => [
                        'can_use_guest_link' => true,
                        'can_use_dynamic_watermark' => false,
                        'allow_custom_splash_screen' => false,
                        'remove_vendor_watermark' => false,
                    ]
                ]);
            }

            // 2. تنفيذ الأكشن
            $result = $action->execute(
                $request->validated(),
                $package->id,
                auth()->id() // سيعطي null لو كان تسجيلاً ذاتياً
            );

            // 3. تجهيز البيانات
            $payloadData = [
                'publisher' => (new PublisherResource($result['publisher']))->resolve(),
            ];

            // 4. الرد الموحد الجديد (1050 => تم التسجيل بنجاح)
            return $this->sendResponse(true, 1050, $payloadData, 201);

        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::error('Registration Error: ' . $e->getMessage() . ' in ' . $e->getFile() . ':' . $e->getLine());
            // التعامل مع أي خطأ برمجي غير متوقع (5000 => خطأ داخلي في الخادم)
            return $this->sendResponse(false, 5000, null, 500);
        }
    }

    /**
     * دالة تحميل الملف (ترجع ملفاً عند النجاح، و JSON موحد عند الفشل)
     */
    public function downloadLicense(PublisherLicense $license)
    {
        // 1. التأكد أن الناشر يملك هذه الرخصة فعلاً
        if ($license->publisher_id !== auth()->id()) {
            // 4050 => 'غير مصرح لك بتحميل هذا الملف.'
            return $this->sendResponse(false, 4050, null, 403);
        }

        // 2. التأكد من وجود الملف فعلياً في السيرفر
        if (!Storage::disk('local')->exists($license->lic_file_path)) {
            // 4051 => 'عفواً، ملف الرخصة غير موجود على الخادم.'
            return $this->sendResponse(false, 4051, null, 404);
        }

        // 3. النجاح: إرجاع الملف للتحميل المباشر
        return Storage::disk('local')->download($license->lic_file_path, "license.lzpk");
    }
}
