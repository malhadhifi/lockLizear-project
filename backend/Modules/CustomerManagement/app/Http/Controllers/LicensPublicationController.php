<?php
namespace Modules\CustomerManagement\Http\Controllers;

use App\Http\Controllers\Controller;

use App\Traits\ApiResponseTrait;
use Modules\CustomerManagement\Http\Requests\LicensePublications\LicensePublicationsRequest;
use Modules\CustomerManagement\Http\Requests\LicensePublications\UpdateLicensePublicationsRequest;

use Modules\CustomerManagement\Services\LicensePublications\LicensePublicationService;
use Modules\CustomerManagement\Transformers\LicensePublications\LicensePublicationResource;

class LicensPublicationController extends Controller
{
    use ApiResponseTrait;

    protected $service;

    public function __construct(LicensePublicationService $service)
    {
        $this->service = $service;
    }

    public function index(LicensePublicationsRequest $request, $customerLicenseId)
    {
        try {
            $paginator = $this->service->getCustomerPublications($customerLicenseId, $request->validated());

            $responseData = [
                'items' => LicensePublicationResource::collection($paginator),
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
     * مسار الإجراءات الجماعية لتعديل صلاحيات العميل
     * الرابط سيكون: POST /api/customer-licenses/{id}/publications/bulk-access
     */
    public function updateAccess(UpdateLicensePublicationsRequest $request, $customerLicenseId)
    {
        try {
            // تمرير رقم العميل والبيانات المفلترة إلى الخدمة
            $this->service->updatePublicationsAccess($customerLicenseId, $request->validated());

            // 1000 => 'تمت العملية بنجاح.'
            return $this->sendResponse(true, 1000, null, 200);

        } catch (\Exception $e) {
            // يمكن تمرير رسالة الخطأ $e->getMessage() أثناء بيئة التطوير
            return $this->sendResponse(false, 5000, null, 500);
        }
    }
}
