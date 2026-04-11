<?php

namespace Modules\ReaderApp\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Modules\CustomerManagement\Models\CustomerDevice;
use Modules\Library\Models\Document;
use Modules\ReaderApp\Http\Requests\PingDeviceRequest;
use Modules\ReaderApp\Http\Requests\SyncLicenseRequest;
use Modules\ReaderApp\Services\License\LicenseSyncService;
use App\Traits\ApiResponseTrait;
use Illuminate\Support\Facades\Log;

class SyncController extends Controller
{
    use ApiResponseTrait;

    protected $syncService;

    public function __construct(LicenseSyncService $syncService)
    {
        $this->syncService = $syncService;
    }

    public function sync(SyncLicenseRequest $request)
    {
        try {
            $reader = $request->user();

            // استدعاء الخدمة المذهلة
            $result = $this->syncService->sync($reader, $request->validated());
              Log::info('البيانات كـ JSON: ' . json_encode( $result, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT));
            return $this->sendResponse(true, $result['code'], $result['data'], 200);

        } catch (\Exception $e) {
            $errorCode = $e->getCode();
            if ($errorCode >= 2000 && $errorCode < 5000) {
                return $this->sendResponse(false, $errorCode, null, 403);
            }
            return $this->sendResponse(false, 5000, null, 500);


        }
    }
    public function syncCatalog(Request $request)
    {
        try {
            $reader = $request->user();

            // نمرر البيانات للخدمة
            $result = $this->syncService->getDeltaSync($request->all());

            return $this->sendResponse(true, 1000, $result, 200);

        } catch (\Exception $e) {
            // $errorCode = $e->getCode();
            // // إذا كان الخطأ خاصاً بالجهاز (2001)
            // if ($errorCode == 2001) {
            //     return $this->sendResponse(false, 2001, null, 403);
            // }
            return $this->sendResponse(false, 5000, null, 500);
        }
    }
    /**
     * رابط التوجيه للتحميل (Proxy Redirect)
     * يقوم باستلام الطلب وتوجيهه للرابط الحقيقي (Mega, Mediafire, etc.)
     */
    public function downloadFile($uuid)
    {
        try {
            // البحث عن الملف بالـ UUID
            $document = Document::where('document_uuid', $uuid)
                ->where('status', 'valid')
                ->first();

            if (!$document) {
                return $this->sendResponse(false, 4041, null, 404); // 4041: ملف غير موجود
            }

            // توجيه المشغل للرابط الخارجي فوراً
            return redirect()->away($document->download_url);

        } catch (\Exception $e) {
            return $this->sendResponse(false, 5000, null, 500);
        }
    }


    public function pingDevice(PingDeviceRequest $request)
    {
        try {
            $reader = $request->user(); // جلب الطالب من التوكن
            $hardwareId = $request->hardware_id;

            // 1. البحث عن الجهاز الخاص بهذا الطالب
            $device = CustomerDevice::where('hardware_id', $hardwareId)
                ->where('reader_id', $reader->id)
                ->first();

            // 2. إذا لم يكن الجهاز موجوداً (أو حذفه الإدمن)
            if (!$device) {
                return $this->sendResponse(false, 2001, null, 403);
                // 2001: الجهاز غير مسجل، اطلب من المستخدم تسجيل الدخول.
            }

            // 3. إذا كان الجهاز محظوراً من قبل الإدارة
            if ($device->status === 'blocked' || $device->status === 'suspend') { // استخدم الحالة الموجودة في داتابيزك
                return $this->sendResponse(false, 2000, null, 403);
                // 2000: تم حظر الجهاز، اطرد المستخدم فوراً (Force Logout).
            }

            // 4. الجهاز سليم ويعمل بشكل طبيعي
            return $this->sendResponse(true, 1000, null, 200);

        } catch (\Exception $e) {
            return $this->sendResponse(false, 5000, null, 500);
        }
    }
}
