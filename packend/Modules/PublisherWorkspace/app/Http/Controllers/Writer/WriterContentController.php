<?php

namespace Modules\PublisherWorkspace\Http\Controllers\Writer;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Modules\Library\Models\Publication;
use Modules\PublisherWorkspace\Http\Requests\SyncWriterDocumentsRequest;
use Modules\Library\Services\WriterSyncService;
use App\Traits\ApiResponseTrait;

class WriterContentController extends Controller
{
    use ApiResponseTrait;

    public function sync(SyncWriterDocumentsRequest $request, WriterSyncService $syncService)
    {
        try {
            // تم التحقق بنجاح في الـ FormRequest! نأخذ البيانات النظيفة
            $validatedData = $request->validated();
            $publisherId = $request->user()->id;

            // نمرر البيانات للخدمة في وحدة المكتبة لتقوم بعملها بصمت
            $savedDocsIds = $syncService->syncDocuments($publisherId, $validatedData);

            // 1063 => تمت المزامنة بنجاح
            return $this->sendResponse(true, 1063, $savedDocsIds, 200);

        } catch (\Exception $e) {
            // 5000 => خطأ داخلي
            return $this->sendResponse(false, 5000, null, 500);
        }
    }

    /**
     * جلب قائمة المنشورات الخاصة بالناشر (لعرضها في برنامج C#)
     */
    public function getPublications(Request $request)
    {
        try {
            // 1. جلب رقم الناشر من التوكن
            $publisherId = $request->user()->id;

            // 2. الاستعلام عن المنشورات الخاصة به فقط
            $publications = Publication::where('publisher_id', $publisherId)
                ->select('id', 'name', 'description')
                ->get();

            $responseData = [
                'count' => $publications->count(),
                'items' => $publications
            ];

            // 1001 => تم جلب البيانات بنجاح (الكود العام الموجود مسبقاً في ملفك)
            return $this->sendResponse(true, 1001, $responseData, 200);

        } catch (\Exception $e) {
            return $this->sendResponse(false, 5000, null, 500);
        }
    }
}
