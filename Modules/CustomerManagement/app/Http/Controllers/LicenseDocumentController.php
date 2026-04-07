<?php
namespace Modules\CustomerManagement\Http\Controllers;

use App\Http\Controllers\Controller;

use App\Traits\ApiResponseTrait;
use Modules\CustomerManagement\Http\Requests\LicenseDocuments\LicenseDocumentRequest;
use Modules\CustomerManagement\Http\Requests\LicenseDocuments\UpdateLicenseDocumentsRequest;
use Modules\CustomerManagement\Services\LicenseDocuments\LicenseDocumentService;
use Modules\CustomerManagement\Transformers\LicenseDocuments\LicenseDocumentResource;

class LicenseDocumentController extends Controller
{

    use ApiResponseTrait;

    protected $service;

    public function __construct(LicenseDocumentService $service)
    {
        $this->service = $service;
    }

    /**
     * جلب الملفات المباشرة لعميل محدد (التي نطاقها selected_customers)
     * الرابط: GET /api/customer-management/customer-licenses/{id}/documents
     */
    public function index(LicenseDocumentRequest $request, $customerLicenseId)
    {
        try {
            $paginator = $this->service->getCustomerDocuments($customerLicenseId, $request->validated());

            $responseData = [
                'items' => LicenseDocumentResource::collection($paginator),
                'pagination' => [
                    'total' => $paginator->total(),
                    'current_page' => $paginator->currentPage(),
                    'last_page' => $paginator->lastPage(),
                    'per_page' => $paginator->perPage(),
                ]
            ];

            return $this->sendResponse(true, 1001, $responseData, 200);

        } catch (\Exception $e) {
            return $this->sendResponse(false, 5000, null, 500);
        }
    }


    /**
     * مسار الإجراءات الجماعية لتعديل صلاحيات العميل على الملفات المباشرة
     * الرابط: POST /api/customer-management/customer-licenses/{id}/documents/bulk-access
     */
    public function updateAccess(UpdateLicenseDocumentsRequest $request, $customerLicenseId)
    {
        try {
            $this->service->updateDocumentsAccess($customerLicenseId, $request->validated());

            // 1000 => 'تمت العملية بنجاح.'
            return $this->sendResponse(true, 1000, null, 200);

        } catch (\Exception $e) {
            return $this->sendResponse(false, 5000, null, 500);
        }
    }
}
?>
