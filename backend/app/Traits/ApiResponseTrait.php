<?php

// namespace App\Traits;

// trait ApiResponseTrait
// {
//     public function sendResponse(bool $success, string $action, string $message, $data = null, int $code = 200)
//     {
//         return response()->json([
//             'success' => $success,
//             'error_code' => $action,
//             'message' => $message,
//             'data' => $data
//         ], $code);
//     }
// } -->

namespace App\Traits;

trait ApiResponseTrait
{
    /**
     * إرسال رد API موحد
     *
     * @param bool  $success حالة النجاح (true / false)
     * @param int   $code رقم الكود المرجعي (مثال: 2000)
     * @param mixed $data البيانات المرفقة (مصفوفة أو null)
     * @param int   $httpCode كود الـ HTTP (الافتراضي 200)
     * @param array $replacements متغيرات لدمجها في الرسالة إن وجدت
     */
    public function sendResponse(bool $success, int $code, $data = null, int $httpCode = 200, array $replacements = [])
    {
        // 1. جلب الرسالة العربية من ملف api_codes بناءً على الرقم
        // (تأكد من تغيير readerapp إلى اسم وحدتك إذا لزم الأمر)
        $message = config('api_codes.' . $code, $replacements);

        // إذا نسينا كتابة الرقم في الملف، نعرض رسالة افتراضية
        if ($message === 'readerapp::api_codes.' . $code) {
            $message = 'رسالة غير معرفة للكود: ' . $code;
        }

        // 2. إرجاع الهيكل الرباعي الثابت
        return response()->json([
            'success' => $success,
            'code'    => $code,
            'message' => $message,
            'data'    => $data
        ], $httpCode);
    }
}
