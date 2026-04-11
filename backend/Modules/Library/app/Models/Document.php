<?php

namespace Modules\Library\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Modules\CustomerManagement\Models\CustomerLicense;
use Modules\PublisherWorkspace\Models\Publisher;

class Document extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'document_uuid',      // المعرف القادم من C#
        'title',
        'type',
        'description',
        'size',
        'file_hash',
        'original_filename',
        'status',
        'access_scope',
        'publisher_id',
        'publication_id',
    ];

    protected $casts = [
        'published_at' => 'datetime',
        'size' => 'integer',
    ];

    protected function serializeDate(\DateTimeInterface $date)
    {
        return $date->format('Y-m-d H:i:s');
    }
    // --- العلاقات ---

    public function publisher()
    {
        return $this->belongsTo(Publisher::class, 'publisher_id');
    }

    public function publication()
    {
        return $this->belongsTo(Publication::class, 'publication_id');
    }

    // علاقة المستند بصندوق المفاتيح (علاقة 1 إلى 1)
    public function key()
    {
        return $this->hasOne(DocumentKey::class, 'document_id');
    }

    // علاقة المستند بقيود الحماية (علاقة 1 إلى 1)
    public function securityControls()
    {
        return $this->hasOne(DocumentSecurityControl::class, 'document_id');
    }

    public function customerlicense()
    {
        return $this->belongsToMany(CustomerLicense::class, 'license_documents')
            // 🚀 يجب إضافة هذا السطر هنا أيضاً لكي يتعرف الـ Resource على نوع الوصول والتواريخ!
            ->withPivot([
                'access_mode',
                'valid_from',
                'valid_until',
                'status'
            ]);
    }
    // ==========================================
    // 💡 1. دالة التحقق من الانتهاء (تُستخدم مع الـ Foreach)
    // ==========================================
    public function isExpired(): bool
    {

        // إذا كانت هناك قيود أمنية، وكان النوع "تاريخ ثابت"، والتاريخ قد مر
        if ($this->securityControls) {
            if ($this->securityControls->expiry_mode === 'fixed_date' &&
                $this->securityControls->expiry_date &&
                now()->isAfter($this->securityControls->expiry_date)) {
                return true;
            }
        }

        return false;
    }

    // ==========================================
    // 💡 2. نطاق استعلام (Query Scope) لفلترة الداتابيز مباشرة
    // ==========================================
    public function scopeNotExpired($query)
    {
        return $query->where('status', '!=', 'expired')
            ->where(function ($q) {
                // يجب ألا يحتوي على قيد تاريخ ثابت انتهت صلاحيته
                $q->whereDoesntHave('securityControls', function ($subQuery) {
                    $subQuery->where('expiry_mode', 'fixed_date')
                             ->where('expiry_date', '<=', now());
                });
            });
    }


}
