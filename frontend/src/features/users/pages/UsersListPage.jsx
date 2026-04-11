
/**
 * ملف: UsersListPage.jsx
 * الوظيفة: لوحة إدارة العملاء (Manage Customers)
 * التحديث: ربط الفلاتر والتقسيم بالسيرفر (Server-Side Pagination) لمنع انهيار المتصفح.
 */
import React, { useState, useEffect } from "react";
import { useCustomers, useCustomerBulkAction } from "../hooks/useUsers";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import styles from "./UsersListPage.module.css";

// استدعاء المكونات المفصولة والنوافذ المنبثقة
import UserCard from "../components/UserCard";
import SelectPublicationModal from "../../publications/components/SelectPublicationModal";
import SelectDocumentModal from "../../documents/components/SelectDocumentModal";

export default function UsersListPage() {
  const navigate = useNavigate();

  // --- 1. حالات الفلاتر والتقسيم ---
  const [filterText, setFilterText] = useState("");
  const [debouncedFilter, setDebouncedFilter] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [showAtLeast, setShowAtLeast] = useState(25);
  const [showFilter, setShowFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  // --- 2. حالات العمليات الجماعية والتحديد ---
  const [selected, setSelected] = useState([]);
  const [bulkAction, setBulkAction] = useState("");

  // --- 3. حالات النوافذ (Modals) ---
  const [isPubModalOpen, setIsPubModalOpen] = useState(false);
  const [isDocModalOpen, setIsDocModalOpen] = useState(false);
  // ✅ التعديل هنا: تحويلها لمصفوفة لتخزين عدة عناصر
  const [selectedResources, setSelectedResources] = useState([]);

  // تأخير البحث لعدم إرهاق السيرفر
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedFilter(filterText), 500);
    return () => clearTimeout(timer);
  }, [filterText]);

  // جلب البيانات من الخادم
  const {
    data: usersResponse,
    isLoading,
    isError,
  } = useCustomers({
    page: currentPage,
    limit: showAtLeast,
    search: debouncedFilter,
    sort: sortBy,
    show: showFilter,
  });

  // استخراج المصفوفة وعدد الصفحات
  const responseData = usersResponse?.data || usersResponse;
  const users = Array.isArray(responseData?.data)
    ? responseData.data
    : Array.isArray(responseData?.items)
      ? responseData.items
      : Array.isArray(usersResponse)
        ? usersResponse
        : [];

  const totalPages =
    responseData?.last_page ||
    Math.ceil((responseData?.total || users.length) / showAtLeast) ||
    1;

  const bulkMutation = useCustomerBulkAction();

  // دوال التحديد
  const toggleSelect = (id) =>
    setSelected((s) =>
      s.includes(id) ? s.filter((x) => x !== id) : [...s, id],
    );
  const checkAll = () => setSelected(users.map((u) => u.id));
  const uncheckAll = () => setSelected([]);
  const invertSelection = () =>
    setSelected(users.map((u) => u.id).filter((id) => !selected.includes(id)));

  // دالة تنفيذ العمليات الجماعية في السيرفر
  const executeBulkAction = (ids, action, extraPayload = {}) => {
    bulkMutation.mutate(
      { license_ids: ids, action: action, ...extraPayload },
      {
        onSuccess: () => {
          toast.success(`تم تنفيذ الإجراء بنجاح!`);
          setSelected([]);
          setBulkAction("");
          setSelectedResources([]); // ✅ تصفير المصفوفة بعد النجاح
        },
        onError: () => toast.error("حدث خطأ أثناء التنفيذ!"),
      },
    );
  };

  // معالجة زر OK للعمليات الجماعية
  const handleBulkAction = () => {
    if (!selected.length || !bulkAction) return;

    // إذا كان الإجراء يتطلب تحديد منشور
    if (bulkAction === "grant_access_to_publication") {
      if (selectedResources.length === 0)
        return toast.error("الرجاء اختيار منشور واحد على الأقل");
      return executeBulkAction(selected, bulkAction, {
        // ✅ إرسال مصفوفة من الـ IDs
        publication_ids: selectedResources.map((res) => res.id),
      });
    }

    // إذا كان الإجراء يتطلب تحديد مستند
    if (bulkAction === "grant_access_to_documents") {
      if (selectedResources.length === 0)
        return toast.error("الرجاء اختيار مستند واحد على الأقل");
      return executeBulkAction(selected, bulkAction, {
        // ✅ إرسال مصفوفة من الـ IDs
        document_ids: selectedResources.map((res) => res.id),
      });
    }

    // للإجراءات العادية (تجميد، حذف، تفعيل...)
    executeBulkAction(selected, bulkAction);
  };

  // شاشات التحميل والخطأ
  if (isLoading)
    return (
      <div
        style={{
          padding: 40,
          textAlign: "center",
          color: "#009cad",
          fontWeight: "bold",
        }}
      >
        جاري التحميل... ⏳
      </div>
    );
  if (isError)
    return (
      <div style={{ padding: 40, textAlign: "center", color: "red" }}>
        حدث خطأ أثناء جلب البيانات!
      </div>
    );

  return (
    <div className={styles.container} dir="ltr">
      {" "}
      {/* لضمان تطابق الاتجاه مع التصميم الأصلي */}
      {/* Header */}
      <div className={styles.header}>
        <span>Customer Accounts</span>
        <i className="bi bi-people-fill" />
      </div>
      {/* Filter Section */}
      <div className={styles.filterSection}>
        {/* صف البحث */}
        <div className={styles.filterRow}>
          <span className={styles.label}>Filter</span>
          <div className={styles.inputWrapper}>
            <i className={`bi bi-search ${styles.searchIcon}`} />
            <input
              type="text"
              className={styles.input}
              value={filterText}
              onChange={(e) => {
                setFilterText(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
        </div>

        {/* صف الفرز والعرض */}
        <div className={styles.filterRow}>
          <span className={styles.label}>Sort by</span>
          <select
            className={styles.selectInput}
            value={sortBy}
            onChange={(e) => {
              setSortBy(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="id">id</option>
            <option value="name">name</option>
            <option value="company">company</option>
            <option value="published_at">published_at</option>
          </select>

          <span
            style={{ margin: "0 10px 0 20px", fontSize: 13, color: "#555" }}
          >
            Show at least
          </span>
          <select
            className={styles.selectInput}
            style={{ width: 60 }}
            value={showAtLeast}
            onChange={(e) => {
              setShowAtLeast(Number(e.target.value));
              setCurrentPage(1);
            }}
          >
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>

          <span
            style={{ margin: "0 10px 0 20px", fontSize: 13, color: "#555" }}
          >
            Show
          </span>
          <select
            className={styles.selectInput}
            value={showFilter}
            onChange={(e) => {
              setShowFilter(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="all">all</option>
            <option value="registered">registered</option>
            <option value="not_registered">not registered</option>
            <option value="suspend">suspended</option>
            <option value="expired">expired</option>
          </select>
        </div>

        {/* صف روابط التحديد السريعة */}
        <div className={styles.filterRow} style={{ marginTop: 25 }}>
          <span className={styles.label}>All</span>
          <div style={{ fontSize: 13, color: "#666" }}>
            <span onClick={checkAll} className={styles.link}>
              Check
            </span>{" "}
            &nbsp;|&nbsp;
            <span onClick={uncheckAll} className={styles.link}>
              Uncheck
            </span>{" "}
            &nbsp;|&nbsp;
            <span onClick={invertSelection} className={styles.link}>
              Invert
            </span>
          </div>
        </div>

        {/* --- قسم العمليات الجماعية (With all checked) --- */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
          <div>
            <div style={{ display: "flex", alignItems: "center" }}>
              <span className={styles.label}>With all checked</span>
              <select
                className={styles.selectInput}
                style={{ width: 250 }}
                value={bulkAction}
                onChange={(e) => {
                  setBulkAction(e.target.value);
                  setSelectedResources([]); // ✅ تصفير المصفوفة عند تغيير الإجراء
                }}
              >
                <option value=""></option>
                <option value="suspend">Suspend</option>
                <option value="active">Activate</option>
                <option value="delete">Delete</option>
                <option value="grant_access_to_publication">
                  Grant access to publication
                </option>
                <option value="grant_access_to_documents">
                  Grant access to document
                </option>
                <option value="resend_license">Resend license email</option>
              </select>
            </div>

            {/* الروابط الديناميكية لاختيار المنشور/المستند تظهر هنا بناءً على نوع العملية */}
            {bulkAction === "grant_access_to_publication" && (
              <div className={styles.resourceLinkBox}>
                <span
                  onClick={() => setIsPubModalOpen(true)}
                  className={styles.link}
                >
                  Select Publications
                </span>
                {/* ✅ عرض عدد العناصر المختارة */}
                {selectedResources.length > 0 && (
                  <div
                    style={{
                      color: "#4caf50",
                      marginTop: 4,
                      fontWeight: "bold",
                    }}
                  >
                    Selected: ({selectedResources.length})
                  </div>
                )}
              </div>
            )}

            {bulkAction === "grant_access_to_documents" && (
              <div className={styles.resourceLinkBox}>
                <span
                  onClick={() => setIsDocModalOpen(true)}
                  className={styles.link}
                >
                  Select Documents
                </span>
                {/* ✅ عرض عدد العناصر المختارة */}
                {selectedResources.length > 0 && (
                  <div
                    style={{
                      color: "#4caf50",
                      marginTop: 4,
                      fontWeight: "bold",
                    }}
                  >
                    Selected: ({selectedResources.length})
                  </div>
                )}
              </div>
            )}
          </div>

          <button
            className={styles.okBtn}
            disabled={!bulkAction || selected.length === 0}
            onClick={handleBulkAction}
          >
            OK
          </button>
        </div>
      </div>
      {/* Pagination الترقيم */}
      <div className={styles.pagination}>
        <span
          style={{
            cursor: "pointer",
            margin: "0 10px",
            color: currentPage === 1 ? "#ccc" : "#009cad",
          }}
          onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
        >
          &lt;
        </span>
        [{currentPage}]
        <span
          style={{
            cursor: "pointer",
            margin: "0 10px",
            color: currentPage >= totalPages ? "#ccc" : "#009cad",
          }}
          onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
        >
          &gt;
        </span>
      </div>
      {/* Cards List - استدعاء مكون البطاقة المنفصل */}
      <div className={styles.cardsContainer}>
        {users.length === 0 ? (
          <div style={{ textAlign: "center", padding: 40, color: "#888" }}>
            لا توجد بيانات مطابقة للبحث.
          </div>
        ) : (
          users.map((u) => (
            <UserCard
              key={u.id}
              user={u}
              isSelected={selected.includes(u.id)}
              onToggleSelect={toggleSelect}
              onNavigate={(id) => navigate(`/users/${id}`)}
              onResendLicense={(id) =>
                executeBulkAction([id], "resend_license")
              }
              onDelete={(id) => {
                if (window.confirm("هل أنت متأكد من حذف هذا العميل؟"))
                  executeBulkAction([id], "delete");
              }}
              // 👇 التعديل الجراحي هنا: تمرير دالة التوقيف/التفعيل
              onToggleSuspend={(id, action) => {
                executeBulkAction([id], action); // الأكشن سيكون إما "suspend" أو "active"
              }}
            />
          ))
        )}
      </div>
      {/* --- النوافذ المنبثقة المخفية --- */}
      {isPubModalOpen && (
        <SelectPublicationModal
          isOpen={isPubModalOpen}
          onClose={() => setIsPubModalOpen(false)}
          selectedItems={selectedResources} // ✅ تمرير المصفوفة لكي تتذكر النافذة
          onSelect={(res) => {
            setSelectedResources(res); // ✅ تخزين المصفوفة كاملة
            setIsPubModalOpen(false);
          }}
        />
      )}
      {isDocModalOpen && (
        <SelectDocumentModal
          isOpen={isDocModalOpen}
          onClose={() => setIsDocModalOpen(false)}
          selectedItems={selectedResources} // ✅ تمرير المصفوفة لكي تتذكر النافذة
          onSelect={(res) => {
            setSelectedResources(res); // ✅ تخزين المصفوفة كاملة
            setIsDocModalOpen(false);
          }}
        />
      )}
    </div>
  );
}
