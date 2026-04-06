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
            // 1. تحديد الباقة الافتراضية
            $package = Package::where('is_default_registration', true)->firstOrFail();

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
            // التعامل مع أي خطأ برمجي غير متوقع (5000 => خطأ داخلي في الخادم)
            return $this->sendResponse(false, 5000, null, 500);
            // return response()->json(
            //     [
            //         "data" => $e->getMessage(),
            //         "line" => $e->getLine(),
            //     ]
            // );
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
