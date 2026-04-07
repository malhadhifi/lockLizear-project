<?php

namespace Modules\ReaderApp\Http\Controllers;

use App\Http\Controllers\Controller;
use Modules\ReaderApp\Http\Requests\ActivateLicenseRequest;
use Modules\ReaderApp\Http\Requests\PingDocumentRequest;
use Modules\ReaderApp\Services\License\DocumentPingService;
use Modules\ReaderApp\Services\License\LicenseActivationService;
use Modules\ReaderApp\Services\License\LicensePayloadBuilderService; // الخدمة الجديدة
use App\Traits\ApiResponseTrait;
use Illuminate\Support\Facades\Log;

class LicenseController extends Controller
{
    use ApiResponseTrait;

    protected $activationService;
    protected $payloadBuilder;
    protected $pingService;
    // حقن الخدمتين معاً
    public function __construct(
        LicenseActivationService $activationService,
        LicensePayloadBuilderService $payloadBuilder,
        DocumentPingService $pingService

    ) {
        $this->activationService = $activationService;
        $this->payloadBuilder = $payloadBuilder;
        $this->pingService = $pingService;
    }

    public function activate(ActivateLicenseRequest $request)
    {
        try {
            $reader = $request->user();

            // 1. إجراء التفعيل (تُرجع مصفوفة بها الكود ورقم الرخصة)
            $activationResult = $this->activationService->activate($reader, $request->validated());
            if ($activationResult['code'] === 1021) {
                return $this->sendResponse(true, 1021, null, 200);
            }
            // 2. استخدام الخدمة الجديدة لجلب التشكيلة المعقدة للبيانات
            $payloadData = $this->payloadBuilder->buildPayload(
                $activationResult['license_id'],
                $reader->id,
                1
            );

            // 3. إرجاع الرد الموحد
            return $this->sendResponse(true, (int)$activationResult['code'], $payloadData, 200);

        } catch (\Exception $e) {
            $errorCode =(int) $e->getCode();
            if ($errorCode >= 2000 && $errorCode < 5000) {
                return $this->sendResponse(false, $errorCode, null, 403);
            }
            return $this->sendResponse(false, 5000, null, 500);
        }
    }


    public function ping(PingDocumentRequest $request)
    {
        try {
            $reader = $request->user();

            // استدعاء الخدمة (ترجع مصفوفة بها الكود، والبيانات إن وجدت)
            $result = $this->pingService->pingDocument($reader, $request->validated());
            Log::error($result['data']);
            return $this->sendResponse(true, $result['code'], $result['data'], 200);

        } catch (\Exception $e) {
            $errorCode = $e->getCode();
                 Log::error('حدث خطأ أثناء تنفيذ العملية: ' . $e->getMessage().$e->getLine().$e->getFile());
            if ($errorCode >= 2000 && $errorCode < 5000) {
                return $this->sendResponse(false, $errorCode, null, 403);
            }
            return $this->sendResponse(false, 5000, null, 500);
        }
    }


}
