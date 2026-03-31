<?php

namespace Modules\Library\Services;

use Illuminate\Support\Facades\DB;
use Modules\Library\Models\Document;
use Modules\Library\Models\DocumentKey;
use Modules\Library\Models\DocumentSecurityControl;
use App\Helpers\ApiEnumMapper;

class WriterSyncService
{
    public function syncDocuments(int $publisherId, array $validatedData)
    {
        return DB::transaction(function () use ($publisherId, $validatedData) {

            $insertedDocuments = [];
            $publicationId = $validatedData['publication_id'] ?? null;

            foreach ($validatedData['documents'] as $docData) {

                // أ. حفظ البيانات الأساسية للمستند
                $document = Document::create([
                    'document_uuid' => $docData['document_uuid'],
                    'title' => $docData['title'],
                    'description' => $docData['description'] ?? null,
                    'type' => ApiEnumMapper::documentTypeToString($docData['type']),
                    'size' => $docData['size'],
                    'file_hash' => $docData['file_hash'],
                    'access_scope' => ApiEnumMapper::accessScopeToString($docData['access_scope'] ?? 2),
                    'status' => 'valid',
                    'publisher_id' => $publisherId,
                    'publication_id' => $publicationId,
                ]);

                // ب. حفظ المفتاح المشفر المرتبط بالمستند
                DocumentKey::create([
                    'document_id' => $document->id,
                    'encrypted_key' => $docData['encrypted_key'],
                    'key_version' => 1,
                    'is_active' => true,
                ]);

                // ج. حفظ القيود الأمنية (DRM) المرتبطة بالمستند
                $securityData = $docData['security_controls'];
                DocumentSecurityControl::create([
                    'document_id' => $document->id,
                    'expiry_mode' => ApiEnumMapper::expiryModeToString($securityData['expiry_mode']),
                    'expiry_date' => $securityData['expiry_date'] ?? null,
                    'expiry_days' => $securityData['expiry_days'] ?? null,
                    'verify_mode' => ApiEnumMapper::verifyModeToString($securityData['verify_mode']),
                    'verify_frequency_days' => $securityData['verify_frequency_days'] ?? null,
                    'grace_period_days' => $securityData['grace_period_days'] ?? null,
                ]);

                $insertedDocuments[] = $document->document_uuid;
            }

            return $insertedDocuments;
        });
    }
}
