<?php

namespace Modules\Library\Services;

use Carbon\Carbon;
use Modules\Library\Models\Document;

class DocumentService
{
    // ───────────────────────────────────────────────────────────────────────────
    // 1. جلب قائمة المستندات
    // ───────────────────────────────────────────────────────────────────────────
    public function getDocuments(array $filters)
    {
        $query = Document::with('securityControls')
            ->withCount(['customerlicense', 'publication']);

        if (!empty($filters['search'])) {
            $query->where(function ($q) use ($filters) {
                $q->where('title', 'like', '%' . $filters['search'] . '%')
                    ->orWhere('description', 'like', '%' . $filters['search'] . '%');
            });
        }

        $now = Carbon::now();
        switch ($filters['show'] ?? 'all') {
            case 'suspended':
                $query->where('status', 'suspended');
                break;
            case 'expired':
                $query->whereHas('securityControls', function ($q) use ($now) {
                    $q->where('expiry_mode', 'fixed_date')->where('expiry_date', '<', $now);
                });
                break;
            case 'not_yet_expired':
                $query->whereHas('securityControls', function ($q) use ($now) {
                    $q->where('expiry_mode', 'fixed_date')->where('expiry_date', '>=', $now);
                });
                break;
            case 'expired_on':
                if (!empty($filters['expired_on_date'])) {
                    $query->whereHas('securityControls', function ($q) use ($filters) {
                        $q->where('expiry_mode', 'fixed_date')
                          ->whereDate('expiry_date', $filters['expired_on_date']);
                    });
                }
                break;
            case 'valid':
                $query->where('status', 'valid');
                break;
        }

        $sortBy = $filters['sort_by'] ?? 'id';
        $sortColumn = match ($sortBy) {
            'title'     => 'title',
            'published' => 'published_at',
            default     => 'id',
        };
        $query->orderBy($sortColumn, $sortBy === 'title' ? 'asc' : 'desc');

        $perPage = (int) ($filters['per_page'] ?? $filters['show_at_least'] ?? 25);
        return $query->paginate($perPage);
    }

    // ───────────────────────────────────────────────────────────────────────────
    // 2. تنفيذ إجراء جماعي
    // ───────────────────────────────────────────────────────────────────────────
    public function executeAction(array $ids, string $action): bool
    {
        $query = Document::whereIn('id', $ids);
        switch (strtolower($action)) {
            case 'deleted': case 'delete':   $query->delete(); break;
            case 'suspended': case 'suspend': $query->update(['status' => 'suspended']); break;
            case 'active': case 'activate':   $query->update(['status' => 'valid']); break;
        }
        return true;
    }

    // ───────────────────────────────────────────────────────────────────────────
    // 3. تفاصيل مستند واحد
    // ───────────────────────────────────────────────────────────────────────────
    public function getDocumentDetails(int $id): Document
    {
        return Document::with(['securityControls', 'publisher'])->findOrFail($id);
    }

    // ───────────────────────────────────────────────────────────────────────────
    // 4. تحديث بيانات المستند (وصف + إعدادات DRM كاملة)
    // ───────────────────────────────────────────────────────────────────────────
    public function updateDocument(int $id, array $data): bool
    {
        $document = Document::with('securityControls')->findOrFail($id);

        if (array_key_exists('note', $data)) {
            $document->description = $data['note'];
            $document->save();
        }

        $securityFields = [
            'expiry_date', 'expiry_mode', 'expiry_days',
            'verify_mode', 'verify_frequency_days',
            'grace_period_days', 'max_views_allowed',
            'print_mode', 'max_prints_allowed', 'log_views', 'log_prints',
        ];
        $hasSecurityUpdate = collect($securityFields)->some(fn($f) => array_key_exists($f, $data));

        if ($hasSecurityUpdate) {
            $controls = $document->securityControls
                ?? $document->securityControls()->create(['document_id' => $document->id]);

            foreach ($securityFields as $field) {
                if (array_key_exists($field, $data)) {
                    $value = $data[$field];
                    // تطبيع القيم: الفرنت إند يرسل 'none' لكن قاعدة البيانات تستخدم 'never'
                    if ($field === 'expiry_mode' && $value === 'none') $value = 'never';
                    if ($field === 'verify_mode' && $value === 'none') $value = 'never';
                    $controls->$field = $value;
                }
            }
            if (array_key_exists('expiry_date', $data) && !array_key_exists('expiry_mode', $data)) {
                $controls->expiry_mode = 'fixed_date';
            }
            $controls->save();
        }

        return true;
    }

    // ───────────────────────────────────────────────────────────────────────────
    // 5. قائمة العملاء المصرح لهم بالوصول لمستند معين
    // ───────────────────────────────────────────────────────────────────────────
    public function getDocumentAccessList(int $id): array
    {
        $document = Document::findOrFail($id);
        $licenses = $document->customerlicense()
            ->withPivot(['access_mode', 'valid_from', 'valid_until', 'views_override', 'status'])
            ->get();

        return $licenses->map(function ($license) {
            return [
                'id'             => $license->id,
                'name'           => $license->name,
                'email'          => $license->email,
                'company'        => $license->company,
                'status'         => $license->pivot->status ?? $license->status,
                'access_mode'    => $license->pivot->access_mode,
                'valid_from'     => $license->pivot->valid_from
                    ? Carbon::parse($license->pivot->valid_from)->format('Y-m-d') : null,
                'expires_at'     => $license->pivot->valid_until
                    ? Carbon::parse($license->pivot->valid_until)->format('Y-m-d') : null,
                'views_override' => $license->pivot->views_override,
            ];
        })->toArray();
    }

    // ───────────────────────────────────────────────────────────────────────────
    // 6. تصدير CSV
    // ───────────────────────────────────────────────────────────────────────────
    public function exportDocuments(array $filters): string
    {
        $filters['per_page'] = 10000;
        $documents = $this->getDocuments($filters)->items();

        $rows   = [];
        $rows[] = implode(',', ['ID', 'Title', 'Status', 'Published', 'Expiry Mode', 'Expiry Date', 'Customers', 'Publications']);

        foreach ($documents as $doc) {
            $ctrl   = $doc->securityControls;
            $expiry = 'never';
            if ($ctrl) {
                if ($ctrl->expiry_mode === 'fixed_date' && $ctrl->expiry_date) {
                    $expiry = Carbon::parse($ctrl->expiry_date)->format('Y-m-d');
                } elseif ($ctrl->expiry_mode === 'days_from_first_use') {
                    $expiry = $ctrl->expiry_days . ' days';
                }
            }
            $rows[] = implode(',', [
                $doc->id,
                '"' . str_replace('"', '""', $doc->title) . '"',
                $doc->status,
                $doc->published_at ? Carbon::parse($doc->published_at)->format('Y-m-d') : '',
                $ctrl?->expiry_mode ?? 'none',
                $expiry,
                $doc->customerlicense_count ?? 0,
                $doc->publication_count     ?? 0,
            ]);
        }

        return implode("\n", $rows);
    }
}
