<?php

namespace Modules\CustomerManagement\Exports;

use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithStyles;
use Modules\CustomerManagement\Models\CustomerLicense;

use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class GroupLicenseVouchersExport implements FromCollection, WithHeadings, WithMapping, WithStyles, ShouldAutoSize
{
    protected $license;

    public function __construct(CustomerLicense $license)
    {
        $this->license = $license;
    }

    // 1. جلب الكروت التابعة لهذه الرخصة
    public function collection()
    {
        return $this->license->vouchers()->get();
    }

    // 2. عناوين الأعمدة (الترويسة)
    public function headings(): array
    {
        return [
            'م',
            'رقم الكرت (PIN Code)',
            'حالة الكرت',
            'الجهة (الشركة/المركز)',
            'تاريخ الإصدار',
        ];
    }

    // 3. ربط البيانات بكل صف
    public function map($voucher): array
    {
        static $counter = 0;
        $counter++;

        return [
            $counter,
            $voucher->pin_code,
            $voucher->status === 'available' ? 'متاح للاستخدام' : 'مستخدم/موقوف',
            $this->license->company ?? $this->license->name,
            $voucher->created_at->format('Y-m-d'),
        ];
    }

    // 4. التنسيق الاحترافي (ألوان، خط عريض، توسيط)
    public function styles(Worksheet $sheet)
    {
        // اتجاه الشيت من اليمين لليسار (عربي)
        $sheet->setRightToLeft(true);

        return [
            // تنسيق الصف الأول (العناوين)
            1 => [
                'font' => ['bold' => true, 'color' => ['argb' => 'FFFFFFFF'], 'size' => 12],
                'fill' => [
                    'fillType' => \PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID,
                    'startColor' => ['argb' => 'FF4F81BD'] // لون أزرق احترافي
                ],
                'alignment' => [
                    'horizontal' => \PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_CENTER,
                ],
            ],
            // توسيط كل البيانات
            'A:E' => [
                'alignment' => [
                    'horizontal' => \PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_CENTER,
                ],
            ],
        ];
    }
}
