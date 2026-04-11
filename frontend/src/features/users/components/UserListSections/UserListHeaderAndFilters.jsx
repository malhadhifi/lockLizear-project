// استيراد مكتبة React اللازمة لإنشاء المكونات
import React from "react";
// استيراد ملف الـ CSS المخصص لصفحة قائمة العملاء
import styles from "../../pages/UsersListPage.module.css";

// تعريف ثابت للون الأساسي للموقع (Teal - الأزرق المائل للأخضر)
const TEAL = "#009cad";

// تعريف المكون واجهة فلاتر وشريط البحث أعلى القائمة
// هذا المكون يستقبل مجموعة هائلة من الخصائص والأحداث (props)
// القادمة من الصفحة الرئيسية (UsersListPage) للتحكم بحالة البحث، والفرز، والعمليات الجماعية
export default function UserListHeaderAndFilters({
  filter,
  setFilter, // حالة البحث النصي ودالة تحديثها
  sortBy,
  setSortBy, // حالة الترتيب (الاسم، الشركة، المعرف) ودالة تحديثها
  showAtLeast,
  setShowAtLeast, // حالة عدد السجلات المعروضة بالصفحة
  showFilter,
  setShowFilter, // حالة فلتر ظهور الحسابات (مسجل، موقوف، الخ)
  setCurrentPage, // دالة إرجاع المستخدم للصفحة رقم 1 عند تغيير أي فلتر
  checkAll,
  uncheckAll,
  invertSelection, // دوال للتحكم في تحديد مربعات الاختيار في الجدول
  bulkAction,
  setBulkAction, // حالة الإجراء الجماعي المختار ودالة تحديثه
  setSelectedResource, // دالة لحفظ المورد (منشور/مستند) المختار للإجراء
  setIsPubModalOpen,
  setIsDocModalOpen, // دوال تفتح قوائم اختيار المنشورات أو المستندات
  selectedResource,
  selected, // المورد المحدد حالياً وقائمة العملاء المحددين في الجدول
  handleBulkAction, // الدالة الرئيسية التي تشغل العملية الجماعية عند النقر على (موافق)
}) {
  return (
    <>
      {/* ========================================================= */}
      {/* 1. الترويسة الرئيسية الزرقاء (Customer Accounts Header) */}
      {/* ========================================================= */}
      <div
        style={{
          background: TEAL,
          color: "#fff",
          padding: "10px 16px", // الخلفية الزرقاء والأبيض للنص ومسافات
          fontWeight: 700,
          fontSize: 14, // عرض الخط غامق
          display: "flex",
          justifyContent: "space-between", // وضع النص في جهة والأيقونة في الجهة المقابلة
          borderRadius: "2px 2px 0 0", // تدوير الزوايا العلوية فقط
        }}
      >
        {/* نص عنوان الصفحة الرئيسية */}
        <span>حسابات العملاء (Customer Accounts)</span>
        {/* أيقونة مستخدمين للتعبير البصري */}
        <span>
          <i className="bi bi-people-fill" />
        </span>
      </div>

      {/* ========================================================= */}
      {/* 2. حاوية الفلاتر وأدوات التحكم العلوية (Filters & Tools) */}
      {/* ========================================================= */}
      <div
        style={{
          border: `1px solid ${TEAL}`,
          borderTop: "none",
          padding: "16px 20px",
          background: "#fff",
        }}
      >
        <div style={{ marginBottom: 12 }}>
          {/* ----- شريط البحث النصي (Search / Filter) ----- */}
          <div
            className="mobile-filter-row"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              marginBottom: 16,
              fontSize: 13,
            }}
          >
            {/* التسمية التوضيحية للبحث */}
            <label style={{ fontWeight: 600, minWidth: 40 }}>تصفية</label>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                flex: 1,
                maxWidth: 400,
              }}
            >
              {/* أيقونة المكبر البصري للبحث داخل المربع */}
              <span
                style={{
                  color: TEAL,
                  fontSize: 16,
                  borderLeft: "1px solid #ccc",
                  padding: "0 8px",
                  border: "1px solid #ccc",
                  height: 28,
                  display: "flex",
                  alignItems: "center",
                  background: "#fafafa",
                }}
              >
                🔍
              </span>
              {/* مربع إدخال النص للبحث، عند التغيير يتم تحديث النص والعودة للصفحة 1 */}
              <input
                type="text"
                value={filter}
                onChange={(e) => {
                  setFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className={styles.filterInputStyle}
                style={{
                  borderRight: "none",
                  borderTopRightRadius: 0,
                  borderBottomRightRadius: 0,
                  flex: 1,
                  height: 28,
                }}
              />
            </div>
          </div>

          {/* ----- صف القوائم المنسدلة للفرز والعرض (Sort & Display Counts) ----- */}
          <div
            className="mobile-filter-row"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              marginBottom: 16,
              fontSize: 13,
              flexWrap: "wrap",
            }}
          >
            {/* أ) قائمة فرز حسب (Sort By) */}
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <label style={{ fontWeight: 600 }}>فرز حسب</label>
              {/* اختيار نوع الفرز (اسم، شركة، معرف). عند التغيير نتحدث الحالة ونعود للصفحة الأولى */}
              <select
                value={sortBy}
                onChange={(e) => {
                  setSortBy(e.target.value);
                  setCurrentPage(1);
                }}
                className={styles.filterSelectStyle}
              >
                <option value="name">الاسم</option>
                <option value="company">الشركة</option>
                <option value="id">المعرف</option>
              </select>
            </div>

            {/* ب) قائمة عدد السجلات المعروضة في كل صفحة */}
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <label style={{ fontWeight: 600 }}>عرض على الأقل</label>
              {/* تغيير سعة الجدول لتظهر 2، 10، يدوياً */}
              <select
                value={showAtLeast}
                onChange={(e) => {
                  setShowAtLeast(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className={styles.filterSelectStyle}
              >
                <option value={2}>2</option>
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
            </div>

            {/* ج) قائمة تصفية حالة العميل (Show filter) */}
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <label style={{ fontWeight: 600 }}>عرض</label>
              {/* إظهار الكل، المسجلين فقط، غير المسجلين، المتوقفين، المنتهين */}
              <select
                value={showFilter}
                onChange={(e) => {
                  setShowFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className={styles.filterSelectStyle}
              >
                <option value="all">الكل</option>
                <option value="registered">مسجل</option>
                <option value="not_registered">غير مسجل</option>
                <option value="suspend">موقوف</option>
                <option value="expired">منتهي</option>
              </select>
            </div>
          </div>

          {/* خط أزرق خفيف يفصل منطقة الفلاتر عن منطقة الإجراءات الجماعية */}
          <hr
            style={{
              border: "none",
              borderTop: "1px solid #a3d9df",
              margin: "16px 0",
            }}
          />

          {/* ----- أدوات التحديد السريعة للجدول (Check Helpers) ----- */}
          <div
            className="mobile-check-row"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              marginBottom: 16,
              fontSize: 13,
            }}
          >
            <span style={{ fontWeight: 600 }}>الكل</span>
            {/* زر وهمي لاستدعاء الدالة المسؤولة عن تحديد جميع صفوف الجدول */}
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                checkAll();
              }}
              style={{ color: TEAL }}
            >
              تحديد
            </a>{" "}
            <span style={{ color: "#ccc" }}>|</span>
            {/* زر وهمي لمسح أي تحديدات (إلغاء التحديد للكل) */}
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                uncheckAll();
              }}
              style={{ color: TEAL }}
            >
              إلغاء التحديد
            </a>{" "}
            <span style={{ color: "#ccc" }}>|</span>
            {/* زر عكس التحديد للجدول (المحدد يصبح غير محدد والعكس) */}
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                invertSelection();
              }}
              style={{ color: TEAL }}
            >
              عكس التحديد
            </a>
          </div>

          {/* ----- منطقة الإجراءات الجماعية (Bulk Actions) ----- */}
          <div
            className="mobile-bulk-row"
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: 16,
              marginBottom: 8,
              fontSize: 13,
            }}
          >
            {/* تسمية توضيحية لما سيتم تنفيذه مع العملاء المحددين */}
            <label style={{ fontWeight: 600, marginTop: 6 }}>
              مع كل المحدد
              <br />
              <span style={{ fontSize: 11, color: "#777" }}>
                (With all checked)
              </span>
            </label>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                flex: 1,
                maxWidth: 300,
              }}
            >
              {/* قائمة للإجراء (تجميد، تفعيل، حذف، منح وصول...) */}
              <select
                value={bulkAction}
                onChange={(e) => {
                  setBulkAction(e.target.value);
                  setSelectedResource(null);
                }}
                className={styles.filterSelectStyle}
                style={{ minWidth: 200 }}
              >
                <option value=""></option>
                <option value="suspend">تجميد (Suspend)</option>
                <option value="activate">تفعيل (Activate)</option>
                <option value="delete">حذف (Delete)</option>
                <option value="grant_access_to_publication">
                  منح حق الوصول إلى منشور: (Grant access to publication:)
                </option>
                <option value="grant_access_to_documents">
                  منح حق الوصول إلى مستند: (Grant access to document:)
                </option>
                <option value="resend_license">
                  إعادة إرسال ملف ترخيص العارض (Resend Viewer License File)
                </option>
              </select>

              {/* ----- زر اختيار المنشور، يظهر فقط في حال تم اختيار (منح حق وصول لمنشور) في القائمة السابقة ----- */}
              {bulkAction === "grant_access_to_publication" && (
                <div style={{ marginTop: 6 }}>
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      setIsPubModalOpen(true);
                    }}
                    style={{
                      color: TEAL,
                      textDecoration: "none",
                      fontSize: 13,
                      fontWeight: "bold",
                    }}
                  >
                    <i
                      className="bi bi-journal-text"
                      style={{ marginRight: 4 }}
                    />
                    Select Publication
                  </a>
                  {/* عرض اسم المنشور الذي تم اختياره ليراه المستخدم قبل التنفيذ */}
                  {selectedResource &&
                    bulkAction === "grant_access_to_publication" && (
                      <div
                        style={{ color: "#4CAF50", marginTop: 4, fontSize: 12 }}
                      >
                        Selected:{" "}
                        {Array.isArray(selectedResource)
                          ? selectedResource
                              .map((r) => r.name || r.title)
                              .join(", ")
                          : selectedResource.name}
                      </div>
                    )}
                </div>
              )}

              {/* ----- زر اختيار المستند، يظهر فقط في حال تم اختيار (منح حق وصول لمستند) ----- */}
              {bulkAction === "grant_access_to_documents" && (
                <div style={{ marginTop: 6 }}>
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      setIsDocModalOpen(true);
                    }}
                    style={{
                      color: TEAL,
                      textDecoration: "none",
                      fontSize: 13,
                      fontWeight: "bold",
                    }}
                  >
                    <i
                      className="bi bi-file-earmark-text"
                      style={{ marginRight: 4 }}
                    />
                    Select Document
                  </a>
                  {/* عرض اسم المستند المختار */}
                  {selectedResource &&
                    bulkAction === "grant_access_to_documents" && (
                      <div
                        style={{ color: "#4CAF50", marginTop: 4, fontSize: 12 }}
                      >
                        Selected:{" "}
                        {Array.isArray(selectedResource)
                          ? selectedResource
                              .map((r) => r.title || r.name)
                              .join(", ")
                          : selectedResource.title}
                      </div>
                    )}
                </div>
              )}
            </div>

            {/* ========================================= */}
            {/* 3. زر التنفيذ (موافق - OK) للإجراء الجماعي */}
            {/* ========================================= */}
            <button
              onClick={handleBulkAction}
              // يتم تعطيل الزر إذا لم يختر إجراء أو لم يتم تحديد عميل واحد على الأقل من الجدول
              disabled={!bulkAction || selected.length === 0}
              style={{
                background: TEAL,
                color: "#fff",
                border: "none",
                borderRadius: 2,
                padding: "6px 30px",
                fontSize: 13,
                fontWeight: 700,
                cursor: "pointer",
                opacity: !bulkAction || selected.length === 0 ? 0.5 : 1,
              }}
            >
              موافق (OK)
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
