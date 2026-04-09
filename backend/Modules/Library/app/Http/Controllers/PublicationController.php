<?php
namespace Modules\Library\Http\Controllers;

use App\Http\Controllers\Controller;

use Modules\Library\Transformers\DocumentResource;
use Modules\Library\Transformers\PublicationDetailsResource;
use Modules\Library\Transformers\PublicationResource;
use Modules\Library\Http\Requests\Publications\BulkActionRequest;
use Modules\Library\Http\Requests\Publications\IndexPublicationRequest;
use Modules\Library\Http\Requests\Publications\StorePublicationRequest;
use Modules\Library\Http\Requests\Publications\UpdatePublicationRequest;
use Modules\Library\Models\Document;
use Modules\Library\Services\PublicationService;
use Modules\Library\Models\Publication;
use App\Traits\ApiResponseTrait;
use Illuminate\Support\Facades\Log;

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
        Log::error($e->getMessage().$e->getFile().$e->getLine());
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

            // لنفترض أن كود النجاح للتعديل هو 1021
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
            // 1. جلب البيانات المفلترة من الخدمة (Paginator)
            $paginator = $this->publicationService->getPublications($request->validated());

            // 2. تمرير البيانات إلى الـ Resource لتشكيلها
            $responseData = [
                'items' => PublicationResource::collection($paginator),
                'pagination' => [
                    'total' => $paginator->total(),
                    'current_page' => $paginator->currentPage(),
                    'last_page' => $paginator->lastPage(),
                    'per_page' => $paginator->perPage(),
                ]
            ];

            // 3. إرجاع الرد الموحد (كود 1001: تم جلب البيانات بنجاح)
            return $this->sendResponse(true, 1001, $responseData, 200);

        } catch (\Exception $e) {
            return $this->sendResponse(false, 5000, null, 500);
        }
    }


    /**
     * مسار الإجراءات الجماعية (Bulk Actions)
     */
    public function bulkAction(BulkActionRequest $request)
    {
        try {
            // 1. تمرير الـ IDs ونوع الإجراء لطبقة الخدمة
            $this->publicationService->executeBulkAction(
                $request->publication_ids,
                $request->action
            );

            // 2. إرجاع الرد الموحد (الكود 1000: تمت العملية بنجاح)
            return $this->sendResponse(true, 1000, null, 200);

        } catch (\Exception $e) {
            return $this->sendResponse(false, 5000, null, 500);
        }
    }


    public function show($id)
    {
        try {
            $publication = Publication::findOrFail($id);
            $responseData = new PublicationDetailsResource($publication);
            return $this->sendResponse(true, 1001, $responseData, 200);
        } catch (\Exception $e) {
            return $this->sendResponse(false, 5000, null, 404);
        }
    }

    public function getDocuments($publicationId)
    {
        try {
            // جلب كل الملفات التابعة للمنشور مباشرة بدون أي فلاتر
            $documents = Document::with('securityControls')
                ->where('publication_id', $publicationId)
                ->get();

            $responseData = DocumentResource::collection($documents);

            // 1001 => 'تم جلب البيانات بنجاح.'
            return $this->sendResponse(true, 1001, $responseData, 200);

        } catch (\Exception $e) {
            return $this->sendResponse(false, 5000, null, 500);
        }
    }

}

