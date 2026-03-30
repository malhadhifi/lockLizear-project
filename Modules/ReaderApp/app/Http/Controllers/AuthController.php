<?php

namespace Modules\ReaderApp\Http\Controllers;

use App\Http\Controllers\Controller;
use Modules\ReaderApp\Http\Requests\Auth\LogoutReaderRequest;
use Modules\ReaderApp\Http\Requests\Auth\VerifyOtpRequest;
use Modules\ReaderApp\Http\Requests\Auth\RegisterReaderRequest;
use Modules\ReaderApp\Http\Requests\Auth\ResendOtpRequest;
use Modules\ReaderApp\Http\Requests\Auth\LoginReaderRequest; // 🌟 استيراد الريكويست الجديد
use Modules\ReaderApp\Services\Auth\UserContentService;
use Modules\ReaderApp\Services\Auth\AuthService;
use App\Traits\ApiResponseTrait;

class AuthController extends Controller
{
    use ApiResponseTrait;

    protected $authService;
    protected $contentService; // 🌟 تعريف المتغير

    public function __construct(AuthService $authService, UserContentService $contentService)
    {
        $this->authService = $authService;
        $this->contentService = $contentService;
    }

    public function register(RegisterReaderRequest $request)
    {
        try {
            $this->authService->registerReader(
                $request->validated(),
                $request->ip()
            );
            return $this->sendResponse(true, 1010, null, 201);
        } catch (\Exception $e) {
            return $this->sendResponse(false, 5000, null, 500);
        }
    }

    public function resendOtp(ResendOtpRequest $request)
    {
        try {
            $this->authService->resendOtp($request->email);
            return $this->sendResponse(true, 1011, null, 200);
        } catch (\Exception $e) {
            return $this->sendResponse(false, 5000, null, 500);
        }
    }

    public function verify(VerifyOtpRequest $request)
    {
        try {
            $loginData = $this->authService->verifyOtpAndLogin($request->validated());
            return $this->sendResponse(true, 1012, $loginData, 200);
        } catch (\Exception $e) {
            $errorCode = $e->getCode();
            if ($errorCode == 4024 || $errorCode == 4023) {
                return $this->sendResponse(false, $errorCode, null, 400);
            }
            return $this->sendResponse(false, 5000, null, 500);
        }
    }

    // 🌟 دالة تسجيل الدخول المحدثة
    public function login(LoginReaderRequest $request)
    {
        try {
            // 1. تسجيل الدخول وإدارة الجهاز
            $authData = $this->authService->login(
                $request->validated(),
                $request->ip()
            );

            $readerData = $authData['reader']; // قراءة المصفوفة

            // 2. جلب كل المحتوى المرتبط بهذا المستخدم (المصفوفة الكبيرة)
            $contents = $this->contentService->getAllUserContent($readerData['id']);

            // 3. تركيب الاستجابة النهائية
            $finalResponse = [
                'token' => $authData['token'],
                'reader_name' => $readerData['name'],
                'email' => $readerData['email'],
                'licenses_payloads' => $contents
            ];

            return $this->sendResponse(true, 1050, $finalResponse, 200);

        } catch (\Exception $e) {
            $code = $e->getCode();
            return $this->sendResponse(false, is_int($code) && $code > 0 ? $code : 5000, null, 401);
        }
    }


    /**
     * مسار تسجيل الخروج
     */
    public function logout(LogoutReaderRequest $request)
    {
        try {
            // استدعاء دالة تسجيل الخروج وتمرير المستخدم الحالي ورقم جهازه
            $this->authService->logout(
                $request->user(),
                $request->hardware_id
            );

            // إرجاع رد بنجاح تسجيل الخروج (كود 1013 مثلاً)
            return $this->sendResponse(true, 1013, null, 200);

        } catch (\Exception $e) {
            return $this->sendResponse(false, 5000, null, 500);
        }
    }
}
