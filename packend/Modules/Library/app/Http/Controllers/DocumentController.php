<?php
namespace Modules\Library\Http\Controllers;
use App\Http\Controllers\Controller;
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

    public function index(IndexDocumentRequest $request)
    {
        try {
            $paginator = $this->documentService->getDocuments($request->validated());

            $responseData = [
                'items' => DocumentResource::collection($paginator),
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
     * جلب تفاصيل ملف واحد
     * الرابط: GET /api/library/documents/{id}
     */
    public function show($id)
    {
        try {
            // جلب البيانات من الخدمة
            $document = $this->documentService->getDocumentDetails($id);

            // تشكيل البيانات باستخدام الـ Resource
            $responseData = new DocumentDetailsResource($document);

            // 1001 => 'تم جلب البيانات بنجاح.'
            return $this->sendResponse(true, 1001, $responseData, 200);

        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            // كود 4001: الملف غير موجود في النظام (حسب ملف الـ config الخاص بك)
            return $this->sendResponse(false, 4001, null, 404);
        } catch (\Exception $e) {
            return $this->sendResponse(false, 5000, null, 500);
        }
    }

    /**
     * تغيير حالة المستندات (حذف أو إيقاف أو تفعيل)
     * الرابط: POST /api/library/documents/action
     */
    public function executeAction(DocumentActionRequest $request)
    {
        try {
            $this->documentService->executeAction(
                $request->document_ids,
                $request->action
            );

            // 1000 => 'تمت العملية بنجاح.'
            return $this->sendResponse(true, 1000, null, 200);

        } catch (\Exception $e) {
            return $this->sendResponse(false, 5000, null, 500);
        }
    }

    /**
     * تعديل بيانات ملف محدد
     * الرابط: PUT /api/library/documents/{id}
     */
    /**
     * تعديل بيانات ملف محدد (الوصف وتاريخ الانتهاء فقط)
     * الرابط: PUT /api/library/documents/{id}
     */
    public function update(UpdateDocumentRequest $request, $id)
    {
        try {
            $this->documentService->updateDocument($id, $request->validated());

            // 1000 => 'تمت العملية بنجاح.'
            return $this->sendResponse(true, 1000, null, 200);

        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return $this->sendResponse(false, 4001, null, 404);
        } catch (\Exception $e) {
            return $this->sendResponse(false, 5000, null, 500);
        }
    }
}
?>
