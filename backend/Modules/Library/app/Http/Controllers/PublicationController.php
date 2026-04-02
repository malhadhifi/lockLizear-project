<?php
namespace Modules\Library\App\Http\Controllers;

use App\Http\Controllers\Controller;
use Modules\Library\App\Transformers\DocumentResource;
use Modules\Library\App\Transformers\PublicationResource;
use Modules\Library\App\Http\Requests\Publications\BulkActionRequest;
use Modules\Library\App\Http\Requests\Publications\IndexPublicationRequest;
use Modules\Library\App\Http\Requests\Publications\StorePublicationRequest;
use Modules\Library\App\Http\Requests\Publications\UpdatePublicationRequest;
use Modules\Library\App\Models\Document;
use Modules\Library\App\Services\PublicationService;
use Modules\Library\App\Models\Publication;
use App\Traits\ApiResponseTrait;
use Illuminate\Http\Request;

class PublicationController extends Controller
{
    use ApiResponseTrait;

    protected $publicationService;

    public function __construct(PublicationService $publicationService)
    {
        $this->publicationService = $publicationService;
    }

    /**
     * إضافة منشور جديد
     */
    public function store(StorePublicationRequest $request)
    {
        try {
            $publication = $this->publicationService->createPublication($request->validated());
            return $this->sendResponse(true, 1001, $publication, 201);
        } catch (\Exception $e) {
            return $this->sendResponse(false, 5000, null, 500);
        }
    }

    /**
     * تعديل منشور موجود
     */
    public function update(UpdatePublicationRequest $request, Publication $publication)
    {
        try {
            $updatedPublication = $this->publicationService->updatePublication($publication, $request->validated());
            return $this->sendResponse(true, 1021, $updatedPublication, 200);
        } catch (\Exception $e) {
            return $this->sendResponse(false, 5000, null, 500);
        }
    }

    /**
     * عرض المنشورات مع الفلترة
     */
    public function index(IndexPublicationRequest $request)
    {
        try {
            $paginator = $this->publicationService->getPublications($request->validated());

            $responseData = [
                'items' => PublicationResource::collection($paginator),
                'pagination' => [
                    'total'        => $paginator->total(),
                    'current_page' => $paginator->currentPage(),
                    'last_page'    => $paginator->lastPage(),
                    'per_page'     => $paginator->perPage(),
                ]
            ];

            return $this->sendResponse(true, 1001, $responseData, 200);
        } catch (\Exception $e) {
            return $this->sendResponse(false, 5000, null, 500);
        }
    }

    /**
     * الإجراءات الجماعية
     */
    public function bulkAction(BulkActionRequest $request)
    {
        try {
            $this->publicationService->executeBulkAction(
                $request->publication_ids,
                $request->action
            );
            return $this->sendResponse(true, 1000, null, 200);
        } catch (\Exception $e) {
            return $this->sendResponse(false, 5000, null, 500);
        }
    }

    /**
     * جلب الملفات التابعة لمنشور محدد
     */
    public function getDocuments($publicationId)
    {
        try {
            $documents = Document::with('securityControls')
                ->where('publication_id', $publicationId)
                ->get();

            $responseData = DocumentResource::collection($documents);
            return $this->sendResponse(true, 1001, $responseData, 200);
        } catch (\Exception $e) {
            return $this->sendResponse(false, 5000, null, 500);
        }
    }

    /**
     * عرض تفاصيل منشور فردي
     */
    public function show($id)
    {
        try {
            $publication  = Publication::findOrFail($id);
            $responseData = new PublicationResource($publication);
            return $this->sendResponse(true, 1001, $responseData, 200);
        } catch (\Exception $e) {
            return $this->sendResponse(false, 5000, null, 404);
        }
    }

    /**
     * إرفاق مستندات متعددة بالمنشور
     */
    public function attachDocuments(Request $request, $id)
    {
        try {
            $request->validate(['document_ids' => 'required|array']);
            Document::whereIn('id', $request->document_ids)
                ->update(['publication_id' => $id]);
            return $this->sendResponse(true, 1000, null, 200);
        } catch (\Exception $e) {
            return $this->sendResponse(false, 5000, null, 500);
        }
    }

    /**
     * إزالة مستند معين من المنشور
     */
    public function detachDocument($id, $document_id)
    {
        try {
            $document = Document::where('id', $document_id)
                ->where('publication_id', $id)
                ->firstOrFail();
            $document->update(['publication_id' => null]);
            return $this->sendResponse(true, 1000, null, 200);
        } catch (\Exception $e) {
            return $this->sendResponse(false, 5000, null, 404);
        }
    }

    /**
     * جلب العملاء المشتركين في المنشور
     */
    public function getSubscribers($id)
    {
        try {
            $publication  = Publication::with('customerlicense')->findOrFail($id);
            $responseData = $publication->customerlicense->map(function ($license) {
                return [
                    'id'         => $license->id,
                    'name'       => $license->name,
                    'company'    => $license->company,
                    'email'      => $license->email,
                    'status'     => $license->status === 'active' ? 'registered' : 'suspended',
                    'registered' => $license->created_at ? $license->created_at->format('Y-m-d') : null,
                    'expires'    => $license->valid_until ? $license->valid_until->format('Y-m-d') : '—',
                ];
            });
            return $this->sendResponse(true, 1001, $responseData, 200);
        } catch (\Exception $e) {
            return $this->sendResponse(false, 5000, null, 500);
        }
    }

    /**
     * إلغاء وصول مجموعة عملاء من هذا المنشور
     */
    public function revokeSubscriberAccess(Request $request, $id)
    {
        try {
            $request->validate(['customer_ids' => 'required|array']);
            $publication = Publication::findOrFail($id);
            $publication->customerlicense()->detach($request->customer_ids);
            return $this->sendResponse(true, 1000, null, 200);
        } catch (\Exception $e) {
            return $this->sendResponse(false, 5000, null, 500);
        }
    }
}
