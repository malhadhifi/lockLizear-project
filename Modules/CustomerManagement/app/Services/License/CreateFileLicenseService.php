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
        $this->containerSecret = config('saasadmin.');

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
        // 1. جلب بيانات الرخصة الكاملة (يمرر null بشكل طبيعي إذا لم يتم إرسالها)
        $fullPayloadResource = $this->payloadBuilder->buildPayload($license->id, 1, 1);

        $fullLicenseData = $fullPayloadResource->resolve();

        // 2. بناء الهيكل (Payload)
        $payload = [
            'Type' => 'IndividualCustomer',
            'Status' => $license->status === 'active' ? 'Active' : 'Suspended',

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

            // حقن البيانات المفصلة للرخصة
            'FullLicenseData' => $fullLicenseData
        ];

        // 3. التوقيع الرقمي
        $payload['AdminDigitalSignature'] = $this->signPayload($payload);

        // 4. التشفير والتحزيم النهائي
        $finalJson = json_encode($payload);
        $encryptedContainer = $this->encryptOuterLayer($finalJson);

        $binaryFile = $this->packBinaryFile($encryptedContainer['data'], $encryptedContainer['salt'], $encryptedContainer['iv']);

        return [
            'binary_file' => $binaryFile,
        ];
    }

    private function signPayload($payloadArray)
    {
        ksort($payloadArray);
        $dataToSign = json_encode($payloadArray);
        openssl_sign($dataToSign, $signature, $this->serverPrivateKey, OPENSSL_ALGO_SHA256);
        return base64_encode($signature);
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
