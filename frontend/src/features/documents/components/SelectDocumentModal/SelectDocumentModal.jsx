import React, { useState, useEffect } from "react";
import styles from "./SelectDocumentModal.module.css";
import { useSelectDocuments } from "../../hooks/useDocuments"; // تأكد من مسار الخطاف لديك

export default function SelectDocumentModal({
  isOpen,
  onClose,
  onSelect,
  selectedItems = [],
}) {
  const [searchInput, setSearchInput] = useState("");
  const [filterText, setFilterText] = useState("");
  const [sortBy, setSortBy] = useState("date");
  const [limit, setLimit] = useState(25);
  const [currentPage, setCurrentPage] = useState(1);
  const [checkedIds, setCheckedIds] = useState([]);

  const { data = { items: [], totalPages: 1 }, isLoading } = useSelectDocuments(
    {
      search: filterText,
      sort: sortBy,
      limit,
      page: currentPage,
    },
  );

  const documents = data.items;
  const totalPages = data.totalPages;

  // مزامنة التحديد (تم الحل 🚀)
  useEffect(() => {
    if (isOpen) {
      setCheckedIds(selectedItems.map((item) => item.id));
    }
  }, [isOpen]); // حذفنا selectedItems لكي لا يمسح الصح عند أي تحديث!
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      setFilterText(searchInput);
      setCurrentPage(1);
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [searchInput]);

  const handleToggle = (id) =>
    setCheckedIds((prev) =>
      prev.includes(id) ? prev.filter((docId) => docId !== id) : [...prev, id],
    );

  const handleCheckAll = () =>
    setCheckedIds((prev) => [
      ...new Set([...prev, ...documents.map((d) => d.id)]),
    ]);

  const handleUncheckAll = () =>
    setCheckedIds((prev) =>
      prev.filter((id) => !documents.find((d) => d.id === id)),
    );

  const handleInvert = () => {
    const currentViewIds = documents.map((d) => d.id);
    setCheckedIds((prev) => {
      const outsideView = prev.filter((id) => !currentViewIds.includes(id));
      const invertedInsideView = currentViewIds.filter(
        (id) => !prev.includes(id),
      );
      return [...outsideView, ...invertedInsideView];
    });
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };
  const goToPrevPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      {/* dir="ltr" لضمان التطابق مع التصميم الإنجليزي */}
      <div
        className={styles.modal}
        dir="ltr"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className={styles.header}>
          <span>Select Document</span>
          <i className="bi bi-people-fill" />
        </div>

        {/* Filter Section */}
        <div className={styles.filterSection}>
          <div className={styles.filterRow}>
            <span className={styles.label}>Filter</span>
            <div className={styles.inputWrapper}>
              <i className={`bi bi-search ${styles.searchIcon}`} />
              <input
                type="text"
                className={styles.input}
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
            </div>
          </div>

          <div
            className={styles.filterRow}
            style={{ justifyContent: "space-between" }}
          >
            <div>
              <span className={styles.label}>Sort by</span>
              <select
                className={styles.selectInput}
                value={sortBy}
                onChange={(e) => {
                  setSortBy(e.target.value);
                  setCurrentPage(1);
                }}
              >
                <option value="date">date</option>
                <option value="title">title</option>
                <option value="id">id</option>
              </select>
            </div>
            <div>
              <span style={{ fontSize: 13, color: "#666", marginRight: 10 }}>
                Show at least
              </span>
              <select
                className={styles.selectInput}
                style={{ width: 70 }}
                value={limit}
                onChange={(e) => {
                  setLimit(Number(e.target.value));
                  setCurrentPage(1);
                }}
              >
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
            </div>
          </div>

          <div className={styles.actionRow}>
            <div style={{ fontSize: 13, color: "#666" }}>
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
            <button
              className={styles.okBtn}
              onClick={() => {
                const selectedDocsArray = checkedIds.map((id) => {
                  return (
                    documents.find((d) => d.id === id) ||
                    selectedItems.find((s) => s.id === id) || {
                      id: id,
                      name: `Doc #${id}`,
                    }
                  );
                });
                onSelect(selectedDocsArray);
              }}
            >
              OK
            </button>
          </div>
        </div>

        {/* Pagination (الترقيم بالمنتصف كالصورة) */}
        <div className={styles.pagination}>
          <span
            className={`${styles.pageArrow} ${currentPage === 1 ? styles.disabled : ""}`}
            onClick={goToPrevPage}
          >
            &lt;
          </span>
          [ {currentPage} ]
          <span
            className={`${styles.pageArrow} ${currentPage >= totalPages || totalPages === 0 ? styles.disabled : ""}`}
            onClick={goToNextPage}
          >
            &gt;
          </span>
        </div>

        {/* Document Cards List (تصميم البطاقات) */}
        <div className={styles.listContainer}>
          {isLoading ? (
            <div style={{ padding: 40, textAlign: "center", color: "#009cad" }}>
              جاري التحميل... ⏳
            </div>
          ) : documents.length === 0 ? (
            <div style={{ padding: 40, textAlign: "center", color: "#888" }}>
              لا توجد مستندات
            </div>
          ) : (
            documents.map((doc) => (
              <div key={doc.id} className={styles.card}>
                {/* الشريط الجانبي الملون */}
                <div
                  className={styles.statusBar}
                  style={{
                    backgroundColor:
                      doc.status === "valid" ? "#71a364" : "#e65100",
                  }}
                />

                <div className={styles.cardContent}>
                  <div className={styles.checkboxWrapper}>
                    <input
                      type="checkbox"
                      checked={checkedIds.includes(doc.id)}
                      onChange={() => handleToggle(doc.id)}
                    />
                  </div>

                  <div className={styles.detailsWrapper}>
                    {/* عنوان المستند */}
                    <div className={styles.docTitle}>
                      {doc.title || doc.name}
                    </div>

                    {/* تفاصيل المستند (ID, Type, Published, Status) */}
                    <table className={styles.metaTable}>
                      <tbody>
                        <tr>
                          <td className={styles.metaLabel}>ID:</td>
                          <td>{doc.id}</td>
                        </tr>
                        {/* ✅ الحقل الجديد للنوع (Type) بأحرف صغيرة ولون بارز */}
                        <tr>
                          <td className={styles.metaLabel}>Type:</td>
                          <td
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
                            {doc.type || "n/a"}
                          </td>
                        </tr>
                        <tr>
                          <td className={styles.metaLabel}>Published:</td>
                          <td>{doc.published || doc.created_at || "N/A"}</td>
                        </tr>
                        <tr>
                          <td className={styles.metaLabel}>Status:</td>
                          <td
                            style={{
                              color:
                                doc.status === "valid" ? "#71a364" : "#e65100",
                              fontWeight: "bold",
                            }}
                          >
                            {doc.status}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
