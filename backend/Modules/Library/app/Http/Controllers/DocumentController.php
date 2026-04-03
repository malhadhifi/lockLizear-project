<?php
namespace Modules\Library\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Modules\Library\Transformers\DocumentDetailsResource;
use Modules\Library\Transformers\DocumentResource;
use Modules\Library\Http\Requests\Documents\DocumentActionRequest;
use Modules\Library\Http\Requests\Documents\IndexDocumentRequest;
use Modules\Library\Http\Requests\Documents\UpdateDocumentRequest;
use Modules\Library\Services\DocumentService;
use App\Traits\ApiResponseTrait;

class DocumentController extends Controller
{
    use ApiResponseTrait;

    protected $documentService;

    public function __construct(DocumentService $documentService)
    {
        $this->documentService = $documentService;
    }

    /**
     * جلب قائمة المستندات مع الفلاتر والترتيب
     * GET /api/library/documents
     */
    public function index(IndexDocumentRequest $request)
    {
        try {
            $paginator = $this->documentService->getDocuments($request->validated());

            $responseData = [
                'items' => DocumentResource::collection($paginator),
                'total'        => $paginator->total(),
                'current_page' => $paginator->currentPage(),
                'last_page'    => $paginator->lastPage(),
                'per_page'     => $paginator->perPage(),
            ];

            return $this->sendResponse(true, 1001, $responseData, 200);

        } catch (\Exception $e) {
            \Log::error('DocumentController@index: ' . $e->getMessage());
            return $this->sendResponse(false, 5000, null, 500);
        }
    }

    /**
     * جلب تفاصيل ملف واحد
     * GET /api/library/documents/{id}
     */
    public function show($id)
    {
        try {
            $document     = $this->documentService->getDocumentDetails($id);
            $responseData = new DocumentDetailsResource($document);

            return $this->sendResponse(true, 1001, $responseData, 200);

        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return $this->sendResponse(false, 4001, null, 404);
        } catch (\Exception $e) {
            return $this->sendResponse(false, 5000, null, 500);
        }
    }

    /**
     * تغيير حالة المستندات (حذف أو إيقاف أو تفعيل)
     * POST /api/library/documents/action
     */
    public function executeAction(DocumentActionRequest $request)
    {
        try {
            $this->documentService->executeAction(
                $request->document_ids,
                $request->action
            );

            return $this->sendResponse(true, 1000, null, 200);

        } catch (\Exception $e) {
            return $this->sendResponse(false, 5000, null, 500);
        }
    }

    /**
     * تعديل بيانات ملف محدد (الوصف + تاريخ الانتهاء + حقول DRM)
     * PUT /api/library/documents/{id}
     */
    public function update(UpdateDocumentRequest $request, $id)
    {
        try {
            $this->documentService->updateDocument($id, $request->validated());

            return $this->sendResponse(true, 1000, null, 200);

        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return $this->sendResponse(false, 4001, null, 404);
        } catch (\Exception $e) {
            return $this->sendResponse(false, 5000, null, 500);
        }
    }

    /**
     * قائمة العملاء المصرح لهم بالوصول لمستند معين
     * GET /api/library/documents/{id}/access
     */
    public function accessList($id)
    {
        try {
            $list = $this->documentService->getDocumentAccessList((int) $id);
            return $this->sendResponse(true, 1001, $list, 200);

        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return $this->sendResponse(false, 4001, null, 404);
        } catch (\Exception $e) {
            \Log::error('DocumentController@accessList: ' . $e->getMessage());
            return $this->sendResponse(false, 5000, null, 500);
        }
    }

    /**
     * تصدير قائمة المستندات بصيغة CSV
     * GET /api/library/documents/export
     */
    public function export(Request $request)
    {
        try {
            $csv = $this->documentService->exportDocuments($request->all());

            return response($csv, 200, [
                'Content-Type'        => 'text/csv; charset=UTF-8',
                'Content-Disposition' => 'attachment; filename="documents-' . now()->format('Y-m-d') . '.csv"',
            ]);

        } catch (\Exception $e) {
            \Log::error('DocumentController@export: ' . $e->getMessage());
            return $this->sendResponse(false, 5000, null, 500);
        }
    }
}
