<?php

namespace Modules\Library\Services;

use Carbon\Carbon;
use Illuminate\Support\Facades\Log;
use Modules\Library\Models\Document;

class DocumentService
{
    /**
     * جلب قائمة المستندات مع فلاتر + ترتيب + تصفح
     */
    public function getDocuments(array $filters)
    {
        $query = Document::with('securityControls')
            ->withCount(['customerlicense', 'publication']);

        // 1. فلتر البحث
        if (!empty($filters['search'])) {
            $query->where(function ($q) use ($filters) {
                $q->where('title', 'like', '%' . $filters['search'] . '%')
                  ->orWhere('description', 'like', '%' . $filters['search'] . '%');
            });
        }

        // 2. فلتر العرض
        $now = Carbon::now();
        switch ($filters['show'] ?? 'all') {
            case 'suspended':
                $query->where('status', 'suspended');
                break;
            case 'expired':
                $query->whereHas('securityControls', function ($q) use ($now) {
                    $q->where('expiry_mode', 'fixed_date')
                      ->where('expiry_date', '<', $now);
                });
                break;
            case 'not_yet_expired':
                $query->whereHas('securityControls', function ($q) use ($now) {
                    $q->where('expiry_mode', 'fixed_date')
                      ->where('expiry_date', '>=', $now);
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
            // 'all' => لا فلترة
        }

        // 3. الترتيب
        $sortBy = $filters['sort_by'] ?? 'id';
        $sortColumn = match ($sortBy) {
            'title'     => 'title',
            'published' => 'published_at',
            default     => 'id',
        };
        $sortDirection = $sortBy === 'title' ? 'asc' : 'desc';
        $query->orderBy($sortColumn, $sortDirection);

        $perPage = (int) ($filters['per_page'] ?? $filters['show_at_least'] ?? 25);
        return $query->paginate($perPage);
    }

    /**
     * تنفيذ إجراء على مستند / مستندات (Suspend / Activate / Delete)
     */
    public function executeAction(array $ids, string $action): bool
    {
        $query = Document::whereIn('id', $ids);
        switch ($action) {
            case 'deleted':
                $query->delete();
                break;
            case 'suspended':
                $query->update(['status' => 'suspended']);
                break;
            case 'active':
            case 'activate':
                $query->update(['status' => 'valid']);
                break;
        }
        return true;
    }

    /**
     * جلب تفاصيل مستند واحد مع إعدادات الحماية والناشر
     */
    public function getDocumentDetails(int $id): Document
    {
        return Document::with(['securityControls', 'publisher'])->findOrFail($id);
    }

    /**
     * تعديل بيانات المستند + إعدادات DRM كاملة
     */
    public function updateDocument(int $id, array $data): bool
    {
        $document = Document::with('securityControls')->findOrFail($id);

        // --- حقول جدول documents ---
        if (array_key_exists('note', $data)) {
            $document->description = $data['note'];
        }
        if (array_key_exists('status', $data) && in_array($data['status'], ['valid', 'suspended'])) {
            $document->status = $data['status'];
        }
        $document->save();

        // --- حقول جدول document_security_controls ---
        $drmFields = [
            'expiry_mode', 'expiry_date', 'expiry_days',
            'verify_mode', 'verify_frequency_days',
            'grace_period_days', 'max_views_allowed',
        ];

        $drmData = array_intersect_key($data, array_flip($drmFields));

        if (!empty($drmData)) {
            $controls = $document->securityControls;
            if ($controls) {
                $controls->fill($drmData);
                // ضبط expiry_mode تلقائياً إذا تم تحديد expiry_date
                if (array_key_exists('expiry_date', $drmData) && !array_key_exists('expiry_mode', $drmData)) {
                    $controls->expiry_mode = 'fixed_date';
                }
                $controls->save();
            }
        }

        return true;
    }

    /**
     * قائمة العملاء (CustomerLicense) المصرح لهم بالوصول لمستند معين
     */
    public function getDocumentAccessList(int $id): array
    {
        $document = Document::findOrFail($id);

        return $document->customerlicense()
            ->select([
                'customer_licenses.id',
                'customer_licenses.name',
                'customer_licenses.email',
                'customer_licenses.company',
                'customer_licenses.status',
            ])
            ->withPivot(['access_mode', 'valid_from', 'valid_until', 'views_override', 'status'])
            ->get()
            ->map(function ($license) {
                return [
                    'id'           => $license->id,
                    'name'         => $license->name,
                    'email'        => $license->email,
                    'company'      => $license->company ?? '—',
                    'status'       => $license->status,
                    'access_mode'  => $license->pivot->access_mode,
                    'valid_from'   => $license->pivot->valid_from
                        ? Carbon::parse($license->pivot->valid_from)->format('Y-m-d')
                        : null,
                    'valid_until'  => $license->pivot->valid_until
                        ? Carbon::parse($license->pivot->valid_until)->format('Y-m-d')
                        : null,
                    'views_override' => $license->pivot->views_override,
                ];
            })
            ->toArray();
    }

    /**
     * تصدير قائمة المستندات بصيغة CSV
     */
    public function exportDocuments(array $filters): string
    {
        // نفس منطق الفلترة لكن بدون تصفح (paginate)
        $query = Document::with('securityControls')
            ->withCount(['customerlicense', 'publication']);

        if (!empty($filters['search'])) {
            $query->where(function ($q) use ($filters) {
                $q->where('title', 'like', '%' . $filters['search'] . '%')
                  ->orWhere('description', 'like', '%' . $filters['search'] . '%');
            });
        }

        if (!empty($filters['show']) && $filters['show'] !== 'all') {
            $now = Carbon::now();
            switch ($filters['show']) {
                case 'suspended':
                    $query->where('status', 'suspended');
                    break;
                case 'expired':
                    $query->whereHas('securityControls', fn($q) =>
                        $q->where('expiry_mode', 'fixed_date')->where('expiry_date', '<', $now));
                    break;
                case 'valid':
                    $query->where('status', 'valid');
                    break;
            }
        }

        $documents = $query->orderBy('id', 'desc')->get();

        // بناء CSV
        $rows = [];
        $rows[] = implode(',', [
            'ID', 'Title', 'Status', 'Published', 'Customers', 'Publications',
            'Expiry Mode', 'Expiry Date', 'Verify Mode', 'Max Views',
        ]);

        foreach ($documents as $doc) {
            $sc = $doc->securityControls;
            $rows[] = implode(',', [
                $doc->id,
                '"' . str_replace('"', '""', $doc->title) . '"',
                $doc->status,
                $doc->published_at ? Carbon::parse($doc->published_at)->format('Y-m-d') : '',
                $doc->customerlicense_count ?? 0,
                $doc->publication_count ?? 0,
                $sc?->expiry_mode ?? '',
                $sc?->expiry_date ? Carbon::parse($sc->expiry_date)->format('Y-m-d') : '',
                $sc?->verify_mode ?? '',
                $sc?->max_views_allowed ?? '',
            ]);
        }

        return implode("\n", $rows);
    }
}
