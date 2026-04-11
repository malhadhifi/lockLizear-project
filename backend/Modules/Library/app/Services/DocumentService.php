<?php
namespace Modules\Library\Services;


use Carbon\Carbon;
use Modules\Library\Models\Document;

class DocumentService
{
    public function getDocuments(array $filters, int $publisherId)
    {
        // نحمل إعدادات الحماية مع الملف لتجنب مشكلة N+1
        $query = Document::with('securityControls')
            ->where("access_scope", "selected_customers")
            ->where("publisher_id", $publisherId);

        // 1. فلتر البحث
        if (!empty($filters['search'])) {
            $query->where(function ($q) use ($filters) {
                $q->where('title', 'like', '%' . $filters['search'] . '%')
                    ->orWhere('description', 'like', '%' . $filters['search'] . '%');
            });
        }

        $now = Carbon::now();
        switch ($filters['show'] ?? 'all') {
            case 'suspend':
                $query->where('status', 'suspend');
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
            case 'suspend': case 'suspend': $query->update(['status' => 'suspend']); break;
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

        // 2. تحديث تاريخ الانتهاء في جدول document_security_controls
        if (array_key_exists('expiry_date', $data)) {
            $controls = $document->securityControls;
            if ($controls) {
                $controls->expiry_date = $data['expiry_date'];

                // لضمان عمل التاريخ، نتأكد أن وضع الانتهاء مضبوط على تاريخ ثابت
                $controls->expiry_mode = 'fixed_date';
                $controls->save();
            }
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
