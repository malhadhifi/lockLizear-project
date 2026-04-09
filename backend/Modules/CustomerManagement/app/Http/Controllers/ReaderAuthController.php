<?php

namespace Modules\CustomerManagement\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Traits\ApiResponseTrait;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Modules\CustomerManagement\Http\Requests\RegisterReaderRequest;
use Modules\CustomerManagement\Http\Requests\VerifyEmailRequest;
use Modules\CustomerManagement\Models\Reader;
use Modules\CustomerManagement\Notifications\ReaderOtpNotification;

class ReaderAuthController extends Controller
{
    use ApiResponseTrait;

    /**
     * POST /api/reader/register
     * ينشئ حساب القارئ ويُرسل كود OTP للتحقق من الإيميل
     */
    public function register(RegisterReaderRequest $request)
    {
        try {
            // إنشاء الحساب بحالة pending (ينتظر التحقق)
            $reader = Reader::create([
                'name'        => $request->name,
                'email'       => $request->email,
                'password'    => Hash::make($request->password),
                'hardware_id' => $request->hardware_id,
                'device_name' => $request->device_name,
                'device_type' => $request->device_type,
                'os_version'  => $request->os_version,
                'status'      => 'pending',
            ]);

            // توليد وحفظ كود OTP
            $otp = $this->generateAndSaveOtp($reader);

            // إرسال الكود عبر الإيميل
            $reader->notify(new ReaderOtpNotification($otp));

            return $this->sendResponse(true, 2010, [
                'message' => 'تم إنشاء الحساب. تحقق من بريدك الإلكتروني للكود المكون من 6 أرقام.',
                'email'   => $reader->email,
            ], 201);

        } catch (\Exception $e) {
            return $this->sendResponse(false, 5000, ['error' => $e->getMessage()], 500);
        }
    }

    /**
     * POST /api/reader/verify-email
     * يتحقق من كود OTP ويفعّل الحساب
     */
    public function verifyEmail(VerifyEmailRequest $request)
    {
        try {
            $reader = Reader::where('email', $request->email)->firstOrFail();

            // التحقق من الكود وصلاحيته الزمنية
            if ($reader->otp_code !== $request->otp_code) {
                return $this->sendResponse(false, 4020, null, 422);
            }

            if (now()->isAfter($reader->otp_expires_at)) {
                return $this->sendResponse(false, 4021, null, 422);
            }

            // تفعيل الحساب
            $reader->update([
                'status'           => 'active',
                'email_verified_at' => now(),
                'otp_code'         => null,
                'otp_expires_at'   => null,
            ]);

            return $this->sendResponse(true, 2011, [
                'message' => 'تم التحقق من البريد الإلكتروني بنجاح. يمكنك الآن تسجيل الدخول.',
            ], 200);

        } catch (\Exception $e) {
            return $this->sendResponse(false, 5000, ['error' => $e->getMessage()], 500);
        }
    }

    /**
     * POST /api/reader/resend-otp
     * يعيد إرسال كود OTP جديد
     */
    public function resendOtp(Request $request)
    {
        try {
            $request->validate(['email' => 'required|email']);

            $reader = Reader::where('email', $request->email)
                            ->where('status', 'pending')
                            ->firstOrFail();

            $otp = $this->generateAndSaveOtp($reader);
            $reader->notify(new ReaderOtpNotification($otp));

            return $this->sendResponse(true, 2012, [
                'message' => 'تم إرسال كود جديد إلى بريدك الإلكتروني.',
            ], 200);

        } catch (\Exception $e) {
            return $this->sendResponse(false, 5000, ['error' => $e->getMessage()], 500);
        }
    }

    // ───────────────────────────────────────────
    // Helper: توليد وحفظ كود OTP
    // ───────────────────────────────────────────
    private function generateAndSaveOtp(Reader $reader): string
    {
        $otp = str_pad(random_int(0, 999999), 6, '0', STR_PAD_LEFT);

        $reader->update([
            'otp_code'       => $otp,
            'otp_expires_at' => now()->addMinutes(10),
        ]);

        return $otp;
    }
}
