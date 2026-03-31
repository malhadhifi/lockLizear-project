<?php

namespace Modules\PublisherWorkspace\Http\Controllers\Writer;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Modules\PublisherWorkspace\Services\WriterActivationService;
use App\Traits\ApiResponseTrait;

class WriterActivationController extends Controller
{
    use ApiResponseTrait;

    protected $activationService;

    public function __construct(WriterActivationService $activationService)
    {
        $this->activationService = $activationService;
    }

    public function activate(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'publisher_id' => 'required|integer',
                'license_key' => 'required|string',
                'hardware_id' => 'required|string',
                'device_name' => 'nullable|string',
                'os_version' => 'nullable|string',
                'app_version' => 'nullable|string',
            ]);

            if ($validator->fails()) {
                return $this->sendResponse(false, 4020, $validator->errors(), 422);
            }

            $result = $this->activationService->activateDevice($request->all(), $request->ip());

            $payloadData = [
                'token' => $result['token'],
                'device_id' => $result['device_id'],
                'publisher' => [
                    'name' => $result['publisher']->name,
                    'company' => $result['publisher']->company
                ]
            ];

            return $this->sendResponse(true, 1060, $payloadData, 200);

        } catch (\Exception $e) {
            // 👈 هنا التعديل الجوهري: نقرأ كود الخطأ
            $code = $e->getCode();

            // إذا كان الخطأ قادماً من السيرفيس بأكوادنا المخصصة (أكبر من أو يساوي 2000)
            if (is_numeric($code) && $code >= 2000 && $code < 5000) {
                // نمرر الكود المخصص، ونضع 400 ككود HTTP عام لرفض العملية
                return $this->sendResponse(false, $code, null, 400);
            }

            // أما إذا كان خطأ برمجي بحت (قاعدة البيانات مثلاً)، نرجع 5000
            return $this->sendResponse(false, 5000, null, 500);
        }
    }

    public function ping(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'hardware_id' => 'required|string'
            ]);

            if ($validator->fails()) {
                return $this->sendResponse(false, 4020, $validator->errors(), 422);
            }

            $this->activationService->pingDevice($request->user(), $request->hardware_id, $request->ip());

            return $this->sendResponse(true, 1061, null, 200);

        } catch (\Exception $e) {
            // 👈 نفس المعالجة هنا
            $code = $e->getCode();
            if (is_numeric($code) && $code >= 2000 && $code < 5000) {
                return $this->sendResponse(false, $code, null, 400);
            }
            return $this->sendResponse(false, 5000, null, 500);
        }
    }

    public function deactivate(Request $request)
    {
        try {
            $request->user()->currentAccessToken()->delete();
            return $this->sendResponse(true, 1062, null, 200);

        } catch (\Exception $e) {
            return $this->sendResponse(false, 5000, null, 500);
        }
    }
}
