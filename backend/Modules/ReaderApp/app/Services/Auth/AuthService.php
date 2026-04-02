<?php

namespace Modules\ReaderApp\Services\Auth;

use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Notification;
use Modules\CustomerManagement\Models\CustomerDevice;
use Modules\ReaderApp\Models\Reader;
use Exception;
use Modules\ReaderApp\Notifications\SendOtpNotification;

class AuthService
{
    protected $deviceService;

    public function __construct(DeviceManagementService $deviceService)
    {
        $this->deviceService = $deviceService;
    }

    /**
     * 1. مرحلة التسجيل (لا يتم الحفظ في الداتا بيز هنا)
     */
    public function registerReader(array $data, string $ipAddress)
    {
        // تشفير كلمة المرور قبل وضعها في الكاش لأسباب أمنية
        $data['password'] = Hash::make($data['password']);

        // توليد الرمز وتخزين كل البيانات في الكاش
        $this->cacheDataAndSendOtp($data, $ipAddress);

        // نرجع رسالة نجاح مبدئية
        return [
            'success' => true,
            'message' => 'OTP sent successfully to your email.'
        ];
    }

    /**
     * دالة مساعدة لتوليد الـ OTP وتخزين "البيانات كاملة" في الكاش
     */
    protected function cacheDataAndSendOtp(array $userData, string $ipAddress)
    {
        $email = $userData['email'];
        $otpCode = rand(1000, 99999);
        $cacheKey = 'otp_register_' . $email;

        // نقوم بتخزين الرمز + بيانات المستخدم + رقم الـ IP في مصفوفة واحدة
        $cachePayload = [
            'otp_code'   => $otpCode,
            'user_data'  => $userData,
            'ip_address' => $ipAddress
        ];

        Cache::put($cacheKey, $cachePayload, now()->addMinutes(2));

        Notification::route('mail', $email)->notify(new SendOtpNotification($otpCode));
        \Log::info("OTP for {$email} is: {$otpCode}");

        return $otpCode;
    }

    /**
     * 2. إعادة إرسال الرمز (نجلب البيانات القديمة من الكاش ونحدث الرمز فقط)
     */
    public function resendOtp(string $email)
    {
        $cacheKey = 'otp_register_' . $email;
        $cachedPayload = Cache::get($cacheKey);

        if (!$cachedPayload) {
            throw new Exception('expired', 4024); // الكاش انتهى، يجب عليه التسجيل من جديد
        }

        // نعيد استخدام البيانات المخزنة مسبقاً مع توليد رمز جديد
        return $this->cacheDataAndSendOtp($cachedPayload['user_data'], $cachedPayload['ip_address']);
    }

    /**
     * 3. مرحلة التحقق (هنا يتم الحفظ الفعلي في الداتا بيز)
     */
    public function verifyOtpAndLogin(array $data)
    {
        $email = $data['email'];
        $enteredOtp = $data['otp_code'];
        $cacheKey = 'otp_register_' . $email;

        // أ. جلب البيانات من الكاش
        $cachedPayload = Cache::get($cacheKey);

        if (!$cachedPayload) {
            throw new Exception('expired', 4024);
        }

        // ب. التحقق من صحة الرمز
        if ($cachedPayload['otp_code'] != $enteredOtp) {
            throw new Exception('invalid', 4023);
        }

        // ج. الرمز صحيح! الآن نقوم بإنشاء الحساب في قاعدة البيانات
        $userData = $cachedPayload['user_data'];
        $ipAddress = $cachedPayload['ip_address'];
        $hardwareId = $data['hardware_id'] ?? $userData['device_info']['hardware_id'];

        $reader = DB::transaction(function () use ($userData, $ipAddress) {
            // حفظ العميل (لاحظ أن كلمة المرور مشفرة مسبقاً في دالة registerReader)
            $reader = Reader::create([
                'name'              => $userData['name'],
                'email'             => $userData['email'],
                'phone'             => $userData['phone'] ?? null,
                'password'          => $userData['password'],
                'email_verified_at' => now(), // تم التحقق مباشرة
            ]);

            // حفظ الجهاز
            $this->deviceService->syncDevice($reader, $userData['device_info'], $ipAddress);

            return $reader;
        });

        // د. مسح الكاش بعد النجاح
        Cache::forget($cacheKey);

        // هـ. تسجيل الدخول وإرجاع التوكن
        return $this->generateAuthResponse($reader, $hardwareId);
    }

    // ... (باقي الدوال login و logout و generateAuthResponse تبقى كما هي بدون تعديل) ...

    public function login(array $data, string $ipAddress)
    {
        $reader = Reader::where('email', $data['email'])->first();

        if (!$reader || !Hash::check($data['password'], $reader->password)) {
            throw new Exception('invalid_credentials', 4001);
        }

        // 🌟 استخراج الـ ID من المصفوفة المرسلة
        $hardwareId = $data['device_info']['hardware_id'];

        // 1. فحص المستخدم: هل حساب هذا الطالب مربوط بجهاز آخر ولم يسجل خروج؟
        $userDevice = CustomerDevice::where('reader_id', $reader->id)->first();
        if ($userDevice && $userDevice->hardware_id !== $hardwareId) {
            throw new Exception('account_linked_to_another_device', 2002);
        }

        // // 2. فحص الجهاز: هل الجهاز نفسه مربوط بطالب آخر ولم يسجل خروج؟
        // $device = CustomerDevice::where('hardware_id', $hardwareId)->first();
        // if ($device && $device->reader_id !== null && $device->reader_id !== $reader->id) {
        //     throw new Exception('device_linked_to_another_account', 2003);
        // }

        // 3. المزامنة والتحديث الآمن
        $this->deviceService->syncDevice($reader, $data['device_info'], $ipAddress);

        return $this->generateAuthResponse($reader, $hardwareId);
    }

    protected function generateAuthResponse(Reader $reader, string $hardwareId)
    {
        $token = $reader->createToken($hardwareId)->plainTextToken;

        return [
            'token' => $token,
            'reader' => [
                'id' => $reader->id,
                'name' => $reader->name,
                'email' => $reader->email,
                'phone' => $reader->phone,
            ]
        ];
    }


    /**
     * تسجيل الخروج: فك ارتباط الجهاز وحذف التوكن
     */
    public function logout(Reader $reader, string $hardwareId)
    {
        // 1. البحث عن الجهاز المربوط بهذا الطالب
        $device = CustomerDevice::where('hardware_id', $hardwareId)
            ->where('reader_id', $reader->id)
            ->first();

        // 2. إذا وجدنا الجهاز، نقوم بفك ارتباطه بالطالب (نجعله null)
        if ($device) {
            $device->update([
                'reader_id' => null,
                'updated_at' => now()
            ]);
        }

        // 3. حذف توكن الوصول الحالي (Sanctum) لكي لا يمكن استخدامه مجدداً
        $reader->currentAccessToken()->delete();

        return true;
    }
}
