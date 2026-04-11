/**
 * ملف: PublicationsListPage.jsx
 * الوظيفة: لوحة إدارة المنشورات (Manage Publications)
 */

import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  usePublications,
  usePublicationBulkAction,
} from "../hooks/usePublications";
import toast from "react-hot-toast";

// 🚀 استيراد البطاقة
import PublicationCard from "../components/PublicationCardList";
// 🚀 التعديل الأهم: نربط الصفحة بنفس ملف تصميم العملاء لضمان التطابق 100%
import styles from "./PublicationsListPage.module.css";

export default function PublicationsListPage() {
  const navigate = useNavigate();

  // الحالات الفلاتر
  const [filter, setFilter] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [showAtLeast, setShowAtLeast] = useState(25);
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilter, setShowFilter] = useState("all");

  // حالات التحديد
  const [selected, setSelected] = useState([]);
  const [bulkAction, setBulkAction] = useState("");

  // جلب البيانات
  const {
    data: publicationsResponse,
    isLoading,
    isError,
  } = usePublications({
    limit: showAtLeast,
    search: filter,
  });

  const bulkMutation = usePublicationBulkAction();
  const publications =
    publicationsResponse?.items || publicationsResponse?.data?.items || [];

  // الفلترة والترتيب محلياً (إذا لم يكن من السيرفر)
  const filtered = useMemo(() => {
    let result = [...publications];
    if (showFilter === "obey") result = result.filter((p) => p.obey);
    else if (showFilter === "no-obey") result = result.filter((p) => !p.obey);

    result.sort((a, b) => {
      if (sortBy === "name") return (a.name || "").localeCompare(b.name || "");
      if (sortBy === "id") return a.id - b.id;
      if (sortBy === "date")
        return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
      return 0;
    });
    return result;
  }, [publications, sortBy, showFilter]);

  const totalPages = Math.ceil(filtered.length / showAtLeast) || 1;

  // دوال التحديد
  const toggleSelect = (id) =>
    setSelected((s) =>
      s.includes(id) ? s.filter((x) => x !== id) : [...s, id],
    );
  const checkAll = () => setSelected(filtered.map((p) => p.id));
  const uncheckAll = () => setSelected([]);
  const invertSelection = () =>
    setSelected(
      filtered.map((p) => p.id).filter((id) => !selected.includes(id)),
    );

  // الإجراءات الجماعية
  const handleBulkAction = () => {
    if (!selected.length || !bulkAction) return;
    if (bulkAction === "delete") 
     {
       if (!window.confirm(`هل أنت متأكد من حذف ${selected.length} منشور؟`))
        return;
      bulkMutation.mutate({ publication_ids: selected, action: "delete" });
            toast.success(`تم حذف ${selected.length} منشور بنجاح`);

    }
    else
      {
      bulkMutation.mutate({ publication_ids: selected, action: bulkAction });
    }
    
    setSelected([]);
    setBulkAction("");
  };

  const handleDelete = (id) => {
    if (!window.confirm("هل أنت متأكد من رغبتك في حذف هذا المنشور؟")) return;
    bulkMutation.mutate({ publication_ids: [id], action: "delete" });
  };

  // شاشات التحميل
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
    // 🚀 لاحظ dir="ltr" لتطابق الاتجاه من اليسار لليمين
    <div className={styles.container} dir="ltr">
      {/* الترويسة */}
      <div className={styles.header}>
        <span>Manage Publications</span>
        <i className="bi bi-collection-fill" />
      </div>

      {/* قسم الفلاتر مطابق للعملاء تماماً */}
      <div className={styles.filterSection}>
        {/* صف البحث */}
        <div className={styles.filterRow}>
          <span className={styles.label}>Filter</span>
          <div className={styles.inputWrapper}>
            <i className={`bi bi-search ${styles.searchIcon}`} />
            <input
              type="text"
              className={styles.input}
              value={filter}
              onChange={(e) => {
                setFilter(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
        </div>

        {/* صف الفرز */}
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
            <option value="name">name</option>
            <option value="id">id</option>
            <option value="date">date</option>
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
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
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
            <option value="obey">obey</option>
            <option value="no-obey">no obey</option>
          </select>
        </div>

        {/* أدوات التحديد */}
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

        {/* العمليات الجماعية وزر الموافقة */}
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
                onChange={(e) => setBulkAction(e.target.value)}
              >
                <option value=""></option>
                <option value="delete">delete</option>
                <option value="suspend">suspend</option>
                <option value="active">active</option>
              </select>
            </div>
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

      {/* التقليب (Pagination) مثل العملاء */}
      <div className={styles.pagination}>
        <span
          style={{
            cursor: "pointer",
            margin: "0 10px",
            color: currentPage === 1 ? "#ccc" : "#009cad",
          }}
        >
          &lt;&lt;
        </span>
        {currentPage}
        <span
          style={{
            cursor: "pointer",
            margin: "0 10px",
            color: currentPage >= totalPages ? "#ccc" : "#009cad",
          }}
        >
          &gt;&gt;
        </span>
      </div>

      {/* حاوية البطاقات */}
      <div className={styles.cardsContainer}>
        {filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: 40, color: "#888" }}>
            لا توجد منشورات.
          </div>
        ) : (
          filtered
            .slice((currentPage - 1) * showAtLeast, currentPage * showAtLeast)
            .map((pub) => (
              <PublicationCard
                key={pub.id}
                pub={pub}
                isSelected={selected.includes(pub.id)}
                onToggleSelect={toggleSelect}
                onEdit={(id) => navigate(`/publications/${id}/edit`)}
                onDelete={handleDelete}
                onNavigateTab={(id, tab) =>
                  navigate(`/publications/${id}/edit`, { state: { tab } })
                }
              />
            ))
        )}
      </div>

      {/* التقليب (Pagination) بالأزرار الجميلة */}
      {filtered.length > 0 && (
        <div className={styles.pagination}>
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className={`${styles.pageBtn} ${currentPage === 1 ? styles.disabled : styles.active}`}
          >
            &lt;&lt;
          </button>

          <span className={styles.pageText}>
            [ {currentPage} / {totalPages} ]
          </span>

          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className={`${styles.pageBtn} ${currentPage === totalPages ? styles.disabled : styles.active}`}
          >
            &gt;&gt;
          </button>
        </div>
      )}
    </div>
  );
}
