CREATE TABLE Users{
    UsersId INTEGER PRIMARY KEY,
    Name TEXT,
    Email TEXT,
    Token TEXT,
}
-- 🌟 الجدول الجديد: الناشرون
CREATE TABLE LocalPublishers (
    PublisherId INTEGER PRIMARY KEY,
    Name TEXT,          -- اسم الناشر (مثلاً: جامعة العلوم)
    SupportEmail TEXT,  -- إيميل الدعم الفني (لكي يتواصل معه الطالب لو تعطلت رخصته)
    LogoUrl TEXT        -- (اختياري) مسار شعار الناشر لعرضه في الواجهة
);

-- تعديل جدول الرخص ليرتبط بالناشر
CREATE TABLE LocalLicenses (
    LicenseId INTEGER PRIMARY KEY,
    PublisherId INTEGER, -- 👈 هنا الربط العبقري!
    ValidUntil DATETIME NULL,
    ValidUfrom DATETIME NULL,
    AccessMode enum,--(selectedcoustomer,all,Publication)
    ActivatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    DevicesNumber INTEGER,
    state enum,--(suspind,vaild)
    LastServerSync DATETIME , -- (تتبع محلي): يحدثه التطبيق كلما اتصل بالسيرفر بنجاح
    FOREIGN KEY(PublisherId) REFERENCES LocalPublishers(PublisherId)
);

-- 2. جدول المنشورات (الحزم)
CREATE TABLE LocalPublications (
    PublicationId INTEGER PRIMARY KEY,
    LicenseId INTEGER,
    Name TEXT,
    AccessMode enum,
    ValidUntil DATETIME NULL,
    ValidUfrom DATETIME NULL,
    FOREIGN KEY(LicenseId) REFERENCES LocalLicenses(LicenseId)
);

-- 3. جدول الملفات الأساسية
CREATE TABLE LocalDocuments (
    DocumentUUID TEXT PRIMARY KEY,
    LicenseId INTEGER Null,
    PublicationId INTEGER NULL, -- قد يكون Null إذا كان الملف فردياً
    PublisherId INTEGER Null,
    Title TEXT,
    EncryptedKey TEXT, -- المفتاح المشفر لفك تشفير الـ PDF
    LocalFilePath TEXT, -- أين تم تحميل الملف المشفر على كمبيوتر الطالب
    state enum,--(suspind,activate,refoked)
    -- [أ] إعدادات انتهاء الصلاحية
    ExpiryMode enum, -- (never, fixed_date, days_from_first_use)
    ExpiryFixedDate DATETIME NULL,
    ExpiryDays INTEGER NULL,
    FirstOpenedAt DATETIME NULL, -- (تتبع محلي): يسجل التطبيق التاريخ عند أول نقرة لفتح الملف

    -- [ب] إعدادات التحقق من الإنترنت
    VerifyMode enum, -- (never, each_time,only_when_internet, every_x_days, after_x_days_then_never)
    VerifyFrequencyDays INTEGER NULL,//عدد الايام
    VerifyGracePeriodDays INTEGER NULL,//فترة الصلاحيه
    LastServerSync DATETIME , -- (تتبع محلي): يحدثه التطبيق كلما اتصل بالسيرفر بنجاح

    -- [ج] إعدادات الاستخدام ( والمشاهدة)
    MaxViews INTEGER NULL,
    CurrentViews INTEGER DEFAULT 0, -- (تتبع محلي): يزيده التطبيق +1 مع كل فتح
    FileHash TEXT,
    FOREIGN KEY(LicenseId) REFERENCES LocalLicenses(LicenseId),
    FOREIGN KEY(PublicationId) REFERENCES LocalPublications(PublicationId),
    FOREIGN KEY(PublisherId) REFERENCES LocalPublishers(PublisherId)
);



http://localhost:8000/api/writer/activate


 POST /api/reader/auth/register

{
  "license": {
    "id": 1024,
    "type": 1,
    "status": 1,
    "valid_mode": 2,
    "valid_from": "2026-03-30T10:00:00Z",
    "valid_until": "2027-03-30T10:00:00Z",
    "publisher": {
      "id": 5,
      "name": "الناشر الذهبي",
      "email": "golden@test.com"
    }
  },
  "publications": [
    {
      "publication_id": 101,
      "name": "الموسوعة الشاملة 2026",
      "access_mode": 1,
      "valid_from": "2026-03-30T10:00:00Z",
      "valid_until": "2027-03-30T10:00:00Z"
    },
    {
      "publication_id": 102,
      "name": "سلسلة الرياضيات",
      "access_mode": 2,
      "valid_from": null,
      "valid_until": "2026-12-31T23:59:59Z"
    }
  ],
  "documents": [
    {
      "document_uuid": "550e8400-e29b-41d4-a716-446655440000",
      "title": "كتاب البرمجة المتقدمة",
      "type": 1,
      "file_hash": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
      "encrypted_key": "VGhpcyBpcyBhIHNlY3JldCBrZXk=",
      "status": 1,
      "expiry_mode": 2,
      "expiry_date": "2026-12-31",
      "expiry_days": null,
      "verify_mode": 1,
      "verify_frequency_days": 30,
      "grace_period_days": 7,
      "max_views": 100
    },
    {
      "document_uuid": "a1234567-b89c-12d3-a456-426614174999",
      "title": "شرح فيديو للفصل الأول",
      "type": 2,
      "file_hash": "8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92",
      "encrypted_key": "QW5vdGhlciBlbmNyeXB0ZWQga2V5",
      "status": 1,
      "expiry_mode": 3,
      "expiry_date": null,
      "expiry_days": 90,
      "verify_mode": 0,
      "verify_frequency_days": null,
      "grace_period_days": null,
      "max_views": null
    }
  ]
}

