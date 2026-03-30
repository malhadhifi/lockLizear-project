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

    public function registerReader(array $data, string $ipAddress)
    {
        return DB::transaction(function () use ($data, $ipAddress) {
            $reader = Reader::create([
                'name' => $data['name'],
                'email' => $data['email'],
                'phone' => $data['phone'] ?? null,
                'password' => Hash::make($data['password']),
            ]);

            $this->deviceService->syncDevice($reader, $data['device_info'], $ipAddress);
            $this->generateAndCacheOtp($reader->email);

            return $reader;
        });
    }

    public function generateAndCacheOtp(string $email)
    {
        $otpCode = rand(1000, 9999);
        $cacheKey = 'otp_register_' . $email;

        Cache::put($cacheKey, $otpCode, now()->addMinutes(15));
        Notification::route('mail', $email)->notify(new SendOtpNotification($otpCode));

        \Log::info("OTP for {$email} is: {$otpCode}");

        return $otpCode;
    }

    public function resendOtp(string $email)
    {
        return $this->generateAndCacheOtp($email);
    }

    public function verifyOtpAndLogin(array $data)
    {
        $email = $data['email'];
        $enteredOtp = $data['otp_code'];
        $cacheKey = 'otp_register_' . $email;
        // ملاحظة: تأكد أن VerifyOtpRequest يرسل hardware_id بهذا الشكل أو عدله ليصبح device_info
        $hardwareId = $data['hardware_id'] ?? $data['device_info']['hardware_id'];

        if (!Cache::has($cacheKey)) {
            throw new Exception('expired', 4024);
        }

        $cachedOtp = Cache::get($cacheKey);
        if ($cachedOtp != $enteredOtp) {
            throw new Exception('invalid', 4023);
        }

        $reader = Reader::where('email', $email)->first();

        if (is_null($reader->email_verified_at)) {
            $reader->update(['email_verified_at' => now()]);
        }

        Cache::forget($cacheKey);

        return $this->generateAuthResponse($reader, $hardwareId);
    }

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
