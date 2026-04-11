<?php

namespace Modules\CustomerManagement\Http\Controllers;

use App\Http\Controllers\Controller;


use App\Traits\ApiResponseTrait;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Modules\CustomerManagement\Http\Requests\License\IndexLicenseRequest;
use Modules\CustomerManagement\Http\Requests\License\LicenseBulkActionRequest;
use Modules\CustomerManagement\Http\Requests\License\StoreLicenseRequest;
use Modules\CustomerManagement\Http\Requests\License\UpdateCustomerLicenseRequest;
use Modules\CustomerManagement\Services\License\LicenseService;
use Modules\CustomerManagement\Transformers\License\CustomerLicenseDetailsResource;
use Modules\CustomerManagement\Transformers\License\CustomerLicenseResource;

class CustomerLicenseController extends Controller
{
    use ApiResponseTrait;

    protected $licenseService;

    public function __construct(LicenseService $licenseService)
    {
        $this->licenseService = $licenseService;
    }

    /**
     * إنشاء رخصة جديدة (فردية أو جماعية)
     * الرابط: POST /api/customer-management/customer-licenses
     */
    public function store(StoreLicenseRequest $request)
    {
        try {
            // نمرر البيانات المفلترة لطبقة الخدمة
            $this->licenseService->createLicense($request->validated());

            // 1000 => 'تمت العملية بنجاح.'
            return $this->sendResponse(true, 1000, null, 201); // 201 تعني Created

        } catch (\Exception $e) {
            // في بيئة التطوير يمكنك إرجاع $e->getMessage() لمعرفة الخطأ إن وجد
            return $this->sendResponse(false, 5000, $e->getMessage(), 500);
        }
    }

    /**
     * عرض جميع الرخص مع الفلاتر والبحث
     * الرابط: GET /api/customer-management/customer-licenses
     */
    public function index(IndexLicenseRequest $request)
    {
        try {
            $paginator = $this->licenseService->getLicenses($request->validated());

            $responseData = [
                'items' => CustomerLicenseResource::collection($paginator),
                'pagination' => [
                    'total' => $paginator->total(),
                    'current_page' => $paginator->currentPage(),
                    'last_page' => $paginator->lastPage(),
                    'per_page' => $paginator->perPage(),
                ]
            ];

            // 1001 => 'تم جلب البيانات بنجاح.'
            return $this->sendResponse(true, 1001, $responseData, 200);

        } catch (\Exception $e) {
            return $this->sendResponse(false, 5000, null, 500);
        }
    }


    /**
     * الإجراءات الجماعية على الرخص (حذف، إيقاف، تفعيل، منح وصول)
     * الرابط: POST /api/customer-management/customer-licenses/bulk-action
     */
    public function bulkAction(LicenseBulkActionRequest $request)
    {
        try {
            $this->licenseService->handleBulkActions($request->validated());

            // 1000 => 'تمت العملية بنجاح.'
            return $this->sendResponse(true, 1000, null, 200);

        } catch (\Exception $e) {
            return $this->sendResponse(false, 5000, null, 500);
        }
    }


    /**
     * عرض تفاصيل رخصة محددة
     * الرابط: GET /api/customer-management/customer-licenses/{id}
     */
    public function show($id)
    {
        try {
            $license = $this->licenseService->getLicenseDetails($id);
            $responseData = new CustomerLicenseDetailsResource($license);

            // 1001 => 'تم جلب البيانات بنجاح.'
            return $this->sendResponse(true, 1001, $responseData, 200);

        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            // 4004 (أو أي كود تفضله): الرخصة غير موجودة


            return $this->sendResponse(false, 4004, null, 404);
        } catch (\Exception $e) {
            Log::error($e->getMessage() . $e->getLine() . $e->getFile().$e->getCode());
            return $this->sendResponse(false, 5000, null, 500);
        }
    }

    /**
     * تحديث بيانات رخصة محددة
     * الرابط: PUT /api/customer-management/customer-licenses/{id}
     */
    public function update(UpdateCustomerLicenseRequest $request, $id)
    {
        try {
            $this->licenseService->updateLicense($id, $request->validated());

            // 1000 => 'تمت العملية بنجاح.'
            return $this->sendResponse(true, 1000, null, 200);

        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return $this->sendResponse(false, 4004, null, 404);
        } catch (\Exception $e) {
            return $this->sendResponse(false, 5000, null, 500);
        }
    }


    public function download($id)
    {
        try {
            $license = $this->licenseService->getLicenseDetails($id);

            // التأكد من أن الملف موجود فعلاً في السيرفر
            if (!$license->file_path || !Storage::disk('local')->exists($license->file_path)) {
                return $this->sendResponse(false, 4004, "الملف غير موجود، قد تحتاج لإعادة توليده.", 404);
            }
            // إرجاع الملف للتحميل المباشر بالاسم والامتداد الصحيح
            $extension = $license->type === 'group' ? 'xlsx' : 'lzpk';
            $downloadName = "license_{$license->id}.{$extension}";

            return Storage::disk('local')->download($license->file_path, $downloadName);
        } catch (\Exception $e) {
            return $this->sendResponse(false, 5000, null, 500);
        }
    }
}
