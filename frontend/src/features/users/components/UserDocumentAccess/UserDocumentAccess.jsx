// داخل UserDocumentAccess.jsx
import React, { useState, useEffect } from "react";
import styles from "./UserDocumentAccess.module.css";
import { useCustomerDocuments } from "../../hooks/useUsers";
import toast from "react-hot-toast";

export default function UserDocumentAccess({
  isOpen,
  onClose,
  onSelect,
  // 🚀 يمكنك إزالة initialSelectedIds تماماً من الـ props، لم نعد بحاجتها
  customerLicenseId,
}) {
  const [filterText, setFilterText] = useState("");
  const [debouncedFilter, setDebouncedFilter] = useState("");
  const [sortBy, setSortBy] = useState("title");
  const [showAtLeast, setShowAtLeast] = useState(25);
  const [docFilter, setDocFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  const [selectedIds, setSelectedIds] = useState([]);
  const [withChecked, setWithChecked] = useState("");
  const [validFrom, setValidFrom] = useState("");
  const [validUntil, setValidUntil] = useState("");
  const [errorFiles, setErrorFiles] = useState([]); // لتخزين الملفات المرفوضة
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedFilter(filterText), 500);
    return () => clearTimeout(timer);
  }, [filterText]);

  useEffect(() => {
    if (isOpen) {
      // 🚀 التعديل الذهبي: نجعلها مصفوفة فارغة دائماً عند الفتح!
      setSelectedIds([]);
      setFilterText("");
      setWithChecked("");
      setValidFrom("");
      setValidUntil("");
      setCurrentPage(1);
    }
  }, [isOpen]); // 🚀 أزلنا initialSelectedIds من هنا

  const { data: docData, isLoading } = useCustomerDocuments(customerLicenseId, {
    page: currentPage,
    limit: showAtLeast,
    search: debouncedFilter,
    sort: sortBy,
    show: docFilter,
  });

  const responseData = docData?.data || docData;
  const documents = Array.isArray(responseData?.items)
    ? responseData.items
    : Array.isArray(responseData?.data)
      ? responseData.data
      : Array.isArray(docData)
        ? docData
        : [];

  const totalPages =
    responseData?.last_page ||
    Math.ceil((responseData?.total || documents.length) / showAtLeast) ||
    1;

  const currentPageIds = documents.map((d) => Number(d.id));

  const handleToggle = (id) => {
    const numericId = Number(id);
    setSelectedIds((prev) =>
      prev.includes(numericId)
        ? prev.filter((docId) => docId !== numericId)
        : [...prev, numericId],
    );
  };

  const handleCheckAll = () => {
    setSelectedIds((prev) => Array.from(new Set([...prev, ...currentPageIds])));
  };

  const handleUncheckAll = () => setSelectedIds([]);

  const handleInvert = () => {
    setSelectedIds((prev) => {
      const fromOtherPages = prev.filter((id) => !currentPageIds.includes(id));
      const invertedCurrent = currentPageIds.filter((id) => !prev.includes(id));
      return [...fromOtherPages, ...invertedCurrent];
    });
  };

  useEffect(() => {
    if (withChecked === "grant_limited" && selectedIds.length > 0) {
      const selectedDocs = documents.filter((d) =>
        selectedIds.includes(Number(d.id)),
      );

      // جلب تواريخ النشر وترتيبها لأخذ الأقدم
      const pubDates = selectedDocs
        .map((d) => d.published)
        .filter((d) => d && d !== "-")
        .sort();

      if (pubDates.length > 0 && !validFrom) {
        setValidFrom(pubDates[0]); // وضع أقدم تاريخ نشر كبداية
      }
    }
  }, [withChecked, selectedIds, documents, validFrom]);
const handleOK = () => {
  if (selectedIds.length === 0 && withChecked !== "revoke") {
    toast.error("Please select at least one document");
    return;
  }

  // المنطق الخاص بالوصول المحدود
  if (withChecked === "grant_limited") {
    if (!validUntil) {
      toast.error("Please set an expiration date");
      return;
    }

    const selectedDocs = documents.filter((d) =>
      selectedIds.includes(Number(d.id)),
    );
    const rejected = [];
    const userUntilDate = new Date(validUntil);

    selectedDocs.forEach((doc) => {
      // إذا كان الملف له تاريخ انتهاء ثابت (وليس never أو بالايام)
      if (
        doc.expires &&
        doc.expires !== "never" &&
        !doc.expires.includes("days")
      ) {
        const docExpiryDate = new Date(doc.expires.replace("expired ", ""));

        // 1. هل الملف منتهي الصلاحية أصلاً؟
        if (doc.expires.includes("expired")) {
          rejected.push(`${doc.title} (Already Expired)`);
        }
        // 2. هل التاريخ الذي وضعه المستخدم يتجاوز تاريخ انتهاء الملف؟
        else if (userUntilDate > docExpiryDate) {
          rejected.push(`${doc.title} (Max expiry: ${doc.expires})`);
        }
      }
    });

    if (rejected.length > 0) {
      // إظهار تنبيه يحتوي على قائمة الملفات المخالفة
      const errorMsg =
        "Cannot proceed! These files have stricter expiry dates:\n\n• " +
        rejected.join("\n• ");
      alert(errorMsg); // استخدم alert أو Modal مخصص لعرض القائمة
      return; // توقف هنا ولا تنفذ الأكشن
    }
  }

  // إذا مر الفحص بسلام، نفذ الأكشن
  onSelect(selectedIds, withChecked, validFrom, validUntil);
};
  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div
        className={styles.modal}
        dir="ltr"
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.header}>
          <span>Set Document Access</span>
          <i className="bi bi-file-earmark-lock-fill" />
        </div>

        <div className={styles.filterSection}>
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
                placeholder="Search by name or description..."
              />
            </div>
          </div>

          <div
            className={styles.filterRow}
            style={{
              justifyContent: "flex-start", // 👈 لحل مشكلة الصندوق
              flexWrap: "wrap",
              gap: 20,
            }}
          >
            {/* Sort By */}
            <div style={{ display: "flex", alignItems: "center" }}>
              <span className={styles.label}>Sort by</span>
              <select
                className={styles.selectInput}
                value={sortBy}
                onChange={(e) => {
                  setSortBy(e.target.value);
                  setCurrentPage(1);
                }}
              >
                <option value="title">title</option>
                <option value="published">published</option>
                <option value="id">id</option>
              </select>
            </div>

            {/* Limit */}
            <div style={{ display: "flex", alignItems: "center" }}>
              <span style={{ fontSize: 13, color: "#666", marginRight: 10 }}>
                Show at least
              </span>
              <select
                className={styles.selectInput}
                style={{ width: 70 }}
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
            </div>

            {/* Filter Documents */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginLeft: "auto",
              }}
            >
              <span style={{ fontSize: 13, color: "#666", marginRight: 10 }}>
                Documents
              </span>
              <select
                className={styles.selectInput}
                style={{ width: 120 }}
                value={docFilter}
                onChange={(e) => {
                  setDocFilter(e.target.value);
                  setCurrentPage(1);
                }}
              >
                <option value="all">All</option>
                <option value="pdf">Pdf</option>
                <option value="video">Video</option>
                <option value="with_access">With Access</option>
                <option value="not_access">Without Access</option>
              </select>
            </div>
          </div>

          <div className={styles.actionRow}>
            <div style={{ fontSize: 13, color: "#009cad" }}>
              All &nbsp;&nbsp;&nbsp;
              <span onClick={handleCheckAll} className={styles.link}>
                Check
              </span>{" "}
              &nbsp;|&nbsp;
              <span onClick={handleUncheckAll} className={styles.link}>
                Uncheck
              </span>{" "}
              &nbsp;|&nbsp;
              <span onClick={handleInvert} className={styles.link}>
                Invert
              </span>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 13, color: "#333" }}>
                With all checked
              </span>
              <select
                value={withChecked}
                onChange={(e) => setWithChecked(e.target.value)}
                className={styles.selectInput}
                style={{ width: 180 }}
              >
                <option value=""></option>
                <option value="access">Grant Access</option>
                <option value="grant_unlimited">Grant Unlimited Access</option>
                <option value="grant_limited">Grant Limited Access</option>
                <option value="revoke">Revoke Access</option>
              </select>

              <button
                className={styles.okBtn}
                onClick={handleOK}
                disabled={!withChecked || selectedIds.length === 0}
                style={{
                  opacity: !withChecked || selectedIds.length === 0 ? 0.5 : 1,
                  cursor:
                    !withChecked || selectedIds.length === 0
                      ? "not-allowed"
                      : "pointer",
                }}
              >
                OK
              </button>
            </div>
          </div>

          {withChecked === "grant_limited" && (
            <div
              style={{
                display: "flex",
                gap: 16,
                marginTop: 15,
                padding: "10px 16px",
                background: "#e6f5f7",
                border: `1px solid #009cad`,
                borderRadius: 4,
              }}
            >
              <div
                style={{
                  display: "flex",
                  gap: 6,
                  fontSize: 13,
                  alignItems: "center",
                }}
              >
                <label style={{ fontWeight: 700 }}>From:</label>
                <input
                  type="date"
                  value={validFrom}
                  onChange={(e) => setValidFrom(e.target.value)}
                  className={styles.input}
                  style={{ padding: "4px 8px" }}
                />
              </div>
              <div
                style={{
                  display: "flex",
                  gap: 6,
                  fontSize: 13,
                  alignItems: "center",
                }}
              >
                <label style={{ fontWeight: 700 }}>Until:</label>
                <input
                  type="date"
                  value={validUntil}
                  onChange={(e) => setValidUntil(e.target.value)}
                  className={styles.input}
                  style={{ padding: "4px 8px" }}
                />
              </div>
            </div>
          )}
        </div>

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

        <div className={styles.listContainer}>
          {isLoading ? (
            <div
              style={{
                padding: 40,
                textAlign: "center",
                color: "#009cad",
                fontWeight: "bold",
              }}
            >
              Loading... ⏳
            </div>
          ) : documents.length === 0 ? (
            <div style={{ padding: 40, textAlign: "center", color: "#888" }}>
              No documents found
            </div>
          ) : (
            documents.map((doc) => {
              const isChecked = selectedIds.includes(Number(doc.id));
              const isExpired = doc.expires && doc.expires.includes("expired");

              return (
                <div key={doc.id} className={styles.card}>
                  <div
                    className={styles.statusBar}
                    style={{
                      backgroundColor: isChecked
                        ? "#4caf50"
                        : doc.status === "valid"
                          ? "#71a364"
                          : "#e65100",
                    }}
                  />
                  <div className={styles.cardContent}>
                    <div className={styles.checkboxWrapper}>
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => handleToggle(doc.id)}
                      />
                    </div>
                    <div className={styles.detailsWrapper}>
                      <div
                        className={styles.docTitle}
                        style={{ color: isChecked ? "#4caf50" : "#7b9e84" }}
                      >
                        {doc.title}
                      </div>
                      <table className={styles.metaTable}>
                        <tbody>
                          <tr>
                            <td className={styles.metaLabel}>ID:</td>
                            <td>{doc.id}</td>
                          </tr>
                          <tr>
                            <td className={styles.metaLabel}>Type:</td>
                            <td>
                              <span
                                style={{
                                  textTransform: "lowercase",
                                  color: "#009cad",
                                  fontWeight: "bold",
                                  backgroundColor: "#e6f5f7",
                                  padding: "2px 6px",
                                  borderRadius: "4px",
                                  display: "inline-block",
                                }}
                              >
                                {doc.type}
                              </span>
                            </td>
                          </tr>
                          <tr>
                            <td className={styles.metaLabel}>Published:</td>
                            <td>{doc.published || "-"}</td>
                          </tr>
                          <tr>
                            <td className={styles.metaLabel}>Status:</td>
                            <td
                              style={{
                                color:
                                  doc.status === "valid"
                                    ? "#71a364"
                                    : "#e65100",
                                fontWeight: "bold",
                              }}
                            >
                              {doc.status}
                            </td>
                          </tr>
                          <tr>
                            <td className={styles.metaLabel}>Expires:</td>
                            <td
                              style={{
                                color: isExpired ? "#e65100" : "inherit",
                                fontWeight: isExpired ? "bold" : "normal",
                              }}
                            >
                              {doc.expires}
                            </td>
                          </tr>
                          <tr>
                            {/* 🚀 التعديل لحل مشكلة السطرين */}
                            <td
                              className={styles.metaLabel}
                              style={{ whiteSpace: "nowrap" }}
                            >
                              Direct Access:
                            </td>
                            <td>
                              <span
                                style={{
                                  color:
                                    doc.direct_access === "no"
                                      ? "#e65100"
                                      : "#4caf50",
                                  fontWeight:
                                    doc.direct_access !== "no"
                                      ? "bold"
                                      : "normal",
                                }}
                              >
                                {doc.direct_access}
                              </span>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
