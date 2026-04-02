<?php
namespace Modules\Library\Http\Controllers;

use App\Http\Controllers\Controller;

use Modules\Library\Transformers\DocumentResource;
use Modules\Library\Transformers\PublicationResource;
use Modules\Library\Http\Requests\Publications\BulkActionRequest;
use Modules\Library\Http\Requests\Publications\IndexPublicationRequest;
use Modules\Library\Http\Requests\Publications\StorePublicationRequest;
use Modules\Library\Http\Requests\Publications\UpdatePublicationRequest;
use Modules\Library\Models\Document;
use Modules\Library\Services\PublicationService;
use Modules\Library\Models\Publication;
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

    /**
     * عرض تفاصيل منشور فردي (يستخدم لتعبئة صفحة التعديل)
     */
    public function show($id)
    {
        try {
            $publication = Publication::findOrFail($id);
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
     * جلب العملاء المشتركين (المصرح لهم) في المنشور
     */
    public function getSubscribers($id)
    {
        try {
            // جلب المنشور مع العملاء المرتبطين
            $publication = Publication::with('customerlicense')->findOrFail($id);
            
            // إعادة ترخيص العملاء بشكل يتوافق مع ما يتوقعه الفرنت إند
            $responseData = $publication->customerlicense->map(function($license) {
                return [
                    'id' => $license->id,
                    'name' => $license->name,
                    'company' => $license->company,
                    'email' => $license->email,
                    'status' => $license->status === 'active' ? 'registered' : 'suspended',
                    'registered' => $license->created_at ? $license->created_at->format('Y-m-d') : null,
                    'expires' => $license->valid_until ? $license->valid_until->format('Y-m-d') : '—',
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
            
            // فك ارتباط العملاء المختارين من خلال علاقة Pivot
            $publication->customerlicense()->detach($request->customer_ids);
            
            return $this->sendResponse(true, 1000, null, 200);
        } catch (\Exception $e) {
            return $this->sendResponse(false, 5000, null, 500);
        }
    }

}

