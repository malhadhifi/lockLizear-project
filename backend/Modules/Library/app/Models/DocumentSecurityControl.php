<?php

namespace Modules\Library\Models;

use Illuminate\Database\Eloquent\Model;

class DocumentSecurityControl extends Model
{
    protected $fillable = [
        'document_id',
        'expiry_mode',
        'expiry_date',
        'expiry_days',
        'verify_mode',
        'verify_frequency_days',
        'grace_period_days',
        'max_views_allowed',
        'print_mode',
        'max_prints_allowed',
        'log_views',
        'log_prints',
    ];

    protected $casts = [
        // تحويلات التواريخ
        'expiry_date' => 'datetime',

        // تحويلات الأرقام
        'expiry_days' => 'integer',
        'verify_frequency_days' => 'integer',
        'grace_period_days' => 'integer',
        'max_views_allowed' => 'integer',
        'max_prints_allowed' => 'integer',
        'log_views' => 'boolean',
        'log_prints' => 'boolean',
    ];

    public function document()
    {
        return $this->belongsTo(Document::class, 'document_id');
    }
}
