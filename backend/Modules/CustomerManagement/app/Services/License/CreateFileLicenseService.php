<?php

namespace Modules\CustomerManagement\Services\License;

use Exception;
use Modules\CustomerManagement\Models\CustomerLicense;
use Modules\ReaderApp\Services\License\LicensePayloadBuilderService;

class CreateFileLicenseService
{
    protected $containerSecret;
    protected $serverPrivateKey;
    protected $sslConfig;
    protected $payloadBuilder;

    public function __construct(LicensePayloadBuilderService $payloadBuilder)
    {
        $this->containerSecret = config('saasadmin.app_container_key');

        $this->sslConfig = [
            "config" => "C:/xampp/php/extras/ssl/openssl.cnf",
            "digest_alg" => "sha256",
        ];

        $keyPath = config('saasadmin.server_private_key_path');
        if (!file_exists($keyPath)) {
            throw new Exception("Server Key Not Found: " . $keyPath);
        }
        $this->serverPrivateKey = file_get_contents($keyPath);

        $this->payloadBuilder = $payloadBuilder;
    }

    /**
     * جعلنا $readerId و $voucherID يقبلان null كقيمة افتراضية
     */
    public function createLicenseFile(CustomerLicense $license)
    {
        $fullPayloadResource = $this->payloadBuilder->buildPayload($license->id, 1, 1);
        $fullLicenseData = $fullPayloadResource->resolve();

        // 2. بناء الهيكل (Payload)
        $payload = [
            'Type' => 'IndividualCustomer',
            'Status' => $license->status === 'active' ? 'Active' : 'suspend',

            'MetaInfo' => [
                'LicenseId' => (string) $license->id,
                'UserRef' => (string) $license->publisher_id,
                'IssueTimestamp' => time(),
            ],

            'CustomerIdentity' => [
                'Name' => $license->name,
                'ContactEmail' => $license->email,
            ],

            'ServerEndpoints' => [
                'ServerUrl' => config('saasadmin.endpoints.server_url'),
                'ApiPort' => (int) config('saasadmin.endpoints.api_port'),
                'AuthEndpoint' => config('saasadmin.endpoints.auth_endpoint'),
            ],

            'FullLicenseData' => $fullLicenseData
        ];

        // 3. الترتيب العميق للمصفوفة (خطوة حاسمة جداً)
        $payload = $this->recursiveKsort($payload);

        // 4. التوقيع الرقمي (نمرر المصفوفة المرتبة)
        $payload['AdminDigitalSignature'] = $this->signPayload($payload);

        // 5. التشفير والتحزيم النهائي
        // استخدام هذه الـ Flags يمنع PHP من تشويه الحروف العربية والروابط
        $finalJson = json_encode($payload, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);

        $encryptedContainer = $this->encryptOuterLayer($finalJson);

        $binaryFile = $this->packBinaryFile($encryptedContainer['data'], $encryptedContainer['salt'], $encryptedContainer['iv']);

        return [
            'binary_file' => $binaryFile,
        ];
    }

    /**
     * توقيع البيانات بعد تحويلها لـ JSON نظيف
     */
    private function signPayload($payloadArray)
    {
        // لاحظ: لا نقوم بعمل ksort هنا لأننا رتبناها مسبقاً بشكل عميق
        // نستخدم نفس الـ Flags المستخدمة في التصدير النهائي
        $dataToSign = json_encode($payloadArray, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);

        openssl_sign($dataToSign, $signature, $this->serverPrivateKey, OPENSSL_ALGO_SHA256);
        return base64_encode($signature);
    }

    /**
     * دالة مساعدة لترتيب المصفوفة بشكل أبجدي وعميق (لكل المستويات)
     */
    private function recursiveKsort(array $array)
    {
        foreach ($array as &$value) {
            if (is_array($value)) {
                $value = $this->recursiveKsort($value); // ترتيب المصفوفات الداخلية
            }
        }
        ksort($array); // ترتيب المستوى الحالي
        return $array;
    }

    private function encryptOuterLayer($jsonData)
    {
        $salt = random_bytes(32);
        $iv = random_bytes(16);

        $key = hash_pbkdf2('sha256', $this->containerSecret, $salt, 10000, 32, true);
        $encrypted = openssl_encrypt($jsonData, 'aes-256-cbc', $key, OPENSSL_RAW_DATA, $iv);

        return [
            'salt' => $salt,
            'iv' => $iv,
            'data' => $encrypted
        ];
    }

    private function packBinaryFile($encryptedData, $salt, $iv)
    {
        $binary = "";
        $binary .= "LZPK";
        $binary .= pack('n', 3);
        $binary .= pack('n', 2);
        $binary .= $salt;
        $binary .= $iv;
        $binary .= pack('N', strlen($encryptedData));
        $binary .= $encryptedData;

        return $binary;
    }
}
