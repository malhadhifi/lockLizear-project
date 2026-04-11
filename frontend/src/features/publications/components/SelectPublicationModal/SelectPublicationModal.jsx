import React, { useState, useEffect } from "react";
import styles from "./SelectPublicationModal.module.css";
import { useSelectPublications } from "../../hooks/usePublications";

export default function SelectPublicationModal({
  isOpen,
  onClose,
  onSelect,
  selectedItems = [],
}) {
const [searchInput, setSearchInput] = useState("");
const [filterText, setFilterText] = useState("");
const [sortBy, setSortBy] = useState("date");
const [limit, setLimit] = useState(25);
const [checkedIds, setCheckedIds] = useState([]);

// ✅ الجراحة الدقيقة (استلام الكائن، ثم استخراج المصفوفة بأمان):
const { data: publicationsData, isLoading } = useSelectPublications({
  
  limit:limit,
  sort:sortBy
});
const publications = Array.isArray(publicationsData)
  ? publicationsData
  : [];

// مزامنة التحديد
useEffect(() => {
  if (isOpen) {
    setCheckedIds(selectedItems.map((item) => item.id));
  }
}, [isOpen, selectedItems]); // المشكلة هنا في كلمة selectedItems
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      setFilterText(searchInput);
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [searchInput]);

  const filteredPubs = publications.filter((pub) => {
    if (!filterText) return true;
    const term = filterText.toLowerCase();
    return (
      pub.name?.toLowerCase().includes(term) ||
      pub.id?.toString().includes(term) ||
      pub.description?.toLowerCase().includes(term)
    );
  });

  const handleToggle = (id) => {
    setCheckedIds((prev) =>
      prev.includes(id) ? prev.filter((pubId) => pubId !== id) : [...prev, id],
    );
  };
  const handleCheckAll = () => setCheckedIds(filteredPubs.map((p) => p.id));
  const handleUncheckAll = () => setCheckedIds([]);
  const handleInvert = () => {
    const currentIds = filteredPubs.map((p) => p.id);
    setCheckedIds((prev) => currentIds.filter((id) => !prev.includes(id)));
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      {/* 🚀 السطر السحري: dir="ltr" يجبر النافذة على ترتيب اليسار لليمين حتى لو الموقع عربي */}
      <div
        className={styles.modal}
        dir="ltr"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className={styles.header}>
          <span>Select Publication</span>
          <i className="bi bi-people-fill" />
        </div>

        {/* Filter Section */}
        <div className={styles.filterSection}>
          {/* 1. صف البحث (ممتد للآخر) */}
          <div
            style={{ display: "flex", alignItems: "center", marginBottom: 15 }}
          >
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

          {/* 2. صف الفرز وعرض العدد (مفصولين للأطراف) */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 25,
            }}
          >
            <div>
              <span className={styles.label}>Sort by</span>
              <select
                className={styles.selectInput}
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="date">date</option>
                <option value="name">name</option>
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
                onChange={(e) => setLimit(Number(e.target.value))}
              >
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
            </div>
          </div>

          {/* 3. صف الأزرار (All والروابط يساراً، وزر OK يميناً) */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
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
              disabled={checkedIds.length === 0}
              onClick={() => {
                const selected = publications.filter((p) =>
                  checkedIds.includes(p.id),
                );
                onSelect(selected);
              }}
            >
              OK
            </button>
          </div>
        </div>

        {/* Table Section */}
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                {/* تحديد مساحات دقيقة للأعمدة لتطابق الصورة */}
                <th style={{ width: "5%" }}></th>
                <th style={{ width: "10%" }}>ID</th>
                <th style={{ width: "25%" }}>Name</th>
                <th style={{ width: "30%" }}>Description</th>
                <th style={{ width: "10%", textAlign: "center" }}>Obey</th>
                <th style={{ width: "10%", textAlign: "center" }}>Customers</th>
                <th style={{ width: "10%", textAlign: "center" }}>Documents</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td
                    colSpan={7}
                    style={{
                      padding: 40,
                      textAlign: "center",
                      color: "#009cad",
                    }}
                  >
                    جاري جلب المنشورات...
                  </td>
                </tr>
              ) : filteredPubs.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    style={{ padding: 40, textAlign: "center", color: "#888" }}
                  >
                    لا توجد بيانات مطابقة للبحث
                  </td>
                </tr>
              ) : (
                filteredPubs.map((pub) => (
                  <tr key={pub.id}>
                    <td>
                      <input
                        type="checkbox"
                        checked={checkedIds.includes(pub.id)}
                        onChange={() => handleToggle(pub.id)}
                      />
                    </td>
                    <td>{pub.id}</td>
                    {/* title attribute لإظهار النص الكامل عند تمرير الماوس إذا كان طويلاً */}
                    <td title={pub.name}>{pub.name}</td>
                    <td
                      title={pub.description || pub.desc}
                      style={{ color: "#888" }}
                    >
                      {pub.description || pub.desc || "-"}
                    </td>
                    <td style={{ textAlign: "center" }}>
                      {pub.obey ? "yes" : "no"}
                    </td>
                    <td style={{ textAlign: "center" }}>
                      <span className={styles.viewLink}>
                        <i
                          className="bi bi-people-fill"
                          style={{ fontSize: 11 }}
                        />{" "}
                        view
                      </span>
                    </td>
                    <td style={{ textAlign: "center" }}>
                      <span className={styles.viewLink}>
                        <i
                          className="bi bi-file-earmark-text"
                          style={{ fontSize: 11 }}
                        />{" "}
                        view
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
