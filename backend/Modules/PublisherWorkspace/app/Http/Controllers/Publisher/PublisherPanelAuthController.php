<?php

namespace Modules\PublisherWorkspace\Http\Controllers\Publisher;

use Illuminate\Routing\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use App\Traits\ApiResponseTrait; // 👈 استدعاء الـ Trait
use Modules\PublisherWorkspace\Models\Publisher;

class PublisherPanelAuthController extends Controller
{
    use ApiResponseTrait; // 👈 تفعيل الـ Trait

    // 1. تسجيل الدخول للوحة التحكم (الويب)
    public function login(Request $request)
    {
        try {
            // ملاحظة: من الأفضل مستقبلاً نقل هذه الشروط إلى FormRequest مخصص
            // لكي يتم إرجاع الكود 4020 تلقائياً عند الخطأ
            $request->validate([
                'email' => 'required|email',
                'password' => 'required',
            ]);

            $publisher = Publisher::where('email', $request->email)->first();

            // فحص صحة البيانات
            if (!$publisher || !Hash::check($request->password, $publisher->password)) {
                // 4052 => 'بيانات الدخول غير صحيحة'
                return $this->sendResponse(false, 4052, null, 401);
            }

            // فحص حالة الحساب
            if ($publisher->status !== 'active') {
                // 4053 => 'حسابك غير نشط، يرجى مراجعة الدعم الفني'
                return $this->sendResponse(false, 4053, null, 403);
            }

            // إصدار التوكن المخصص للوحة التحكم فقط
            $token = $publisher->createToken(
                'PanelApp_' . ($request->device_name ?? 'Web'), // وضعنا قيمة افتراضية لتجنب الأخطاء
                ['panel-access'],
                now()->addHours(2) // <--- صلاحية لوحة التحكم
            )->plainTextToken;

            // تجهيز البيانات
            $data = [
                'token' => $token,
                'publisher' => $publisher->only(['id', 'name', 'email', 'company'])
            ];

            // 1051 => 'تم تسجيل الدخول بنجاح'
            return $this->sendResponse(true, 1051, $data, 200);

        } catch (\Illuminate\Validation\ValidationException $e) {
            // نترك لارافيل يعالج خطأ التحقق ليرجع الـ Errors الافتراضية
            // (أو يمكنك تخصيصها لترجع كود 4020)
            throw $e;
        } catch (\Exception $e) {
            // 5000 => خطأ داخلي في الخادم
            return $this->sendResponse(false, 5000, null, 500);
        }
    }

    // 2. تسجيل الخروج من لوحة التحكم
    public function logout(Request $request)
    {
        try {
            // حذف التوكن الحالي الذي يستخدمه المتصفح
            $request->user()->currentAccessToken()->delete();

            // 1052 => 'تم تسجيل الخروج من لوحة التحكم بنجاح'
            return $this->sendResponse(true, 1052, null, 200);

        } catch (\Exception $e) {
            // 5000 => خطأ داخلي في الخادم
            return $this->sendResponse(false, 5000, null, 500);
        }
    }
}
