<?php

namespace Modules\CustomerManagement\Http\Controllers;

// use Illuminate\Routing\Controller;
// use Illuminate\Support\Facades\Storage;
// use Modules\CustomerManagement\Actions\ExportVouchersCsvAction;
// use Modules\CustomerManagement\Actions\ProcessCustomerLicenseFileAction;
// use Modules\CustomerManagement\Events\CustomerLicenseCreated;
// use Modules\CustomerManagement\Http\Requests\StoreGroupVoucherRequest;
// use Modules\CustomerManagement\Http\Requests\StoreIndividualLicenseRequest;
// use Modules\CustomerManagement\Models\Voucher;
// use Modules\CustomerManagement\Services\LicenseService;

// class LicenseController extends Controller
// {
//     protected $licenseService;

//     public function __construct(LicenseService $licenseService)
//     {
//         $this->licenseService = $licenseService;
//     }

//     // داخل LicenseController.php

//     public function storeIndividual(StoreIndividualLicenseRequest $request, ProcessCustomerLicenseFileAction $fileAction)
//     {
//         $publisherId = $request->user()->id;

//         // 1. إنشاء الرخصة في الداتا بيز
//         $license = $this->licenseService->createIndividualLicense($publisherId, $request->validated());

//         // 2. توليد الملف المشفر (.lzpk)
//         $actionResult = $fileAction->execute($license);

//         // 3. التحقق من رغبة الناشر في الإرسال عبر الإيميل
//         if ($license->send_via_email) {
//             $fileName = 'license_' . $license->id . '.lzpk';
//             // 🚀 إطلاق الحدث!
//             event(new CustomerLicenseCreated($license, $actionResult['encoded_file'], $fileName));
//         }

//         return response()->json([
//             'success' => true,
//             'message' => 'تم إنشاء الرخصة الفردية بنجاح',
//             'data' => $license
//         ]);
//     }

//     public function storeGroup(StoreGroupVoucherRequest $request, ExportVouchersCsvAction $exportAction)
//     {
//         $publisherId = $request->user()->id;

//         // 1. إنشاء الرخصة والكروت
//         $masterLicense = $this->licenseService->createGroupVouchers($publisherId, $request->validated());
//         $vouchers =Voucher::where('customer_license_id', $masterLicense->id)->get();

//         // 2. توليد محتوى الـ CSV
//         $csvContent = $exportAction->execute($masterLicense, $vouchers);

//         // 3. 🚀 حفظ ملف الـ CSV في السيرفر وتحديث قاعدة البيانات
//         $fileName = 'vouchers_license_' . $masterLicense->id . '_' . now()->format('Y-m-d') . '.csv';
//         $filePath = 'customer_vouchers/' . $fileName;

//        Storage::disk('local')->put($filePath, $csvContent);
//         $masterLicense->update(['file_path' => $filePath]);

//         // 4. إطلاق الحدث للإرسال عبر الإيميل (إذا كان مطلوباً)
//         if ($masterLicense->send_via_email) {
//             dd("mdjdjdjd");
//             event(new CustomerLicenseCreated(
//                 $masterLicense,
//                 base64_encode($csvContent),
//                 $fileName
//             ));
//         }

//         // 5. إرجاع الملف للناشر ليحمله فوراً
//         // return response($csvContent)
//         //     ->header('Content-Type', 'text/csv')
//         //     ->header('Content-Disposition', 'attachment; filename="' . $fileName . '"');

//         return response()->json([
//             'success' => true,
//             'message' => 'تم إنشاء الرخصة الفردية بنجاح',
//             'data' => $masterLicense
//         ]);
//     }
// }


use App\Http\Controllers\Controller;


use App\Traits\ApiResponseTrait;
use Modules\CustomerManagement\Http\Requests\License\IndexLicenseRequest;
use Modules\CustomerManagement\Http\Requests\License\StoreLicenseRequest;
use Modules\CustomerManagement\Services\License\LicenseService;
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
            return $this->sendResponse(false, 5000, null, 500);
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
}
