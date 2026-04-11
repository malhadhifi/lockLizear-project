import React, { useState, useEffect } from "react";
import styles from "./UserPublicationAccess.module.css";
// 🚀 استدعاء الخطاف المخصص لجلب منشورات العميل
import { useCustomerPublications } from "../../hooks/useUsers";
import toast from "react-hot-toast";

export default function UserPublicationAccess({
  isOpen,
  onClose,
  onSelect,
  customerLicenseId,
}) {
  const [searchInput, setSearchInput] = useState("");
  const [debouncedFilter, setDebouncedFilter] = useState("");
  const [sortBy, setSortBy] = useState("date");
  const [limit, setLimit] = useState(25);
  const [pubFilter, setPubFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  const [checkedIds, setCheckedIds] = useState([]);
  const [withChecked, setWithChecked] = useState("");
  const [validFrom, setValidFrom] = useState("");
  const [validUntil, setValidUntil] = useState("");

  const [viewCustomers, setViewCustomers] = useState(null);
  const [viewDocuments, setViewDocuments] = useState(null);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      setDebouncedFilter(searchInput);
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [searchInput]);

  useEffect(() => {
    if (isOpen) {
      setCheckedIds([]); // تفتح بيضاء ناصعة بدون أي تحديد
      setSearchInput("");
      setDebouncedFilter("");
      setWithChecked("");
      setValidFrom("");
      setValidUntil("");
      setCurrentPage(1);
      setViewCustomers(null);
      setViewDocuments(null);
    }
  }, [isOpen]);

  const { data: pubData, isLoading } = useCustomerPublications(
    customerLicenseId,
    {
      page: currentPage,
      limit: limit,
      search: debouncedFilter,
      sort: sortBy,
      show: pubFilter,
    },
  );

  const responseData = pubData?.data || pubData;
  const publications = Array.isArray(responseData?.items)
    ? responseData.items
    : Array.isArray(responseData?.data)
      ? responseData.data
      : Array.isArray(pubData)
        ? pubData
        : [];

  const totalPages =
    responseData?.last_page ||
    Math.ceil((responseData?.total || publications.length) / limit) ||
    1;

  const currentPageIds = publications.map((p) => Number(p.id));

  // ✅ اقتراح أقدم تاريخ كبداية فقط (بدون فرض حد أقصى للنهاية)
  useEffect(() => {
    if (withChecked === "grant_limited" && checkedIds.length > 0) {
      const selectedPubs = publications.filter((p) =>
        checkedIds.includes(Number(p.id)),
      );

      const pubDates = selectedPubs
        .map((p) => p.created_at || p.published_at || p.date_at)
        .filter((d) => d && d !== "-")
        .map((d) => d.split("T")[0])
        .sort();

      if (pubDates.length > 0 && !validFrom) setValidFrom(pubDates[0]);
    }
  }, [withChecked, checkedIds, publications, validFrom]);

  const handleToggle = (id) => {
    const numericId = Number(id);
    setCheckedIds((prev) =>
      prev.includes(numericId)
        ? prev.filter((pubId) => pubId !== numericId)
        : [...prev, numericId],
    );
  };

  const handleCheckAll = () =>
    setCheckedIds((prev) => Array.from(new Set([...prev, ...currentPageIds])));
  const handleUncheckAll = () => setCheckedIds([]);
  const handleInvert = () => {
    setCheckedIds((prev) => {
      const fromOtherPages = prev.filter((id) => !currentPageIds.includes(id));
      const invertedCurrent = currentPageIds.filter((id) => !prev.includes(id));
      return [...fromOtherPages, ...invertedCurrent];
    });
  };

  // ✅ دالة الاعتماد نظيفة ومباشرة بدون قيود المستندات
  const handleOK = () => {
    if (checkedIds.length === 0 && withChecked !== "revoke") {
      toast.error("Please select at least one publication");
      return;
    }

    if (withChecked === "grant_limited") {
      if (!validUntil) {
        toast.error("Please set an expiration date");
        return;
      }
    }

    onSelect(checkedIds, withChecked, validFrom, validUntil);
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
          <span>Select Publication</span>
          <i className="bi bi-journal-text" />
        </div>

        <div className={styles.filterSection}>
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
                onChange={(e) => {
                  setSearchInput(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Search by name or description..."
              />
            </div>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "flex-start",
              flexWrap: "wrap",
              alignItems: "center",
              gap: 20,
              marginBottom: 25,
            }}
          >
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
                <option value="date">date</option>
                <option value="name">name</option>
                <option value="id">id</option>
              </select>
            </div>

            <div style={{ display: "flex", alignItems: "center" }}>
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

            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginLeft: "auto",
              }}
            >
              <span style={{ fontSize: 13, color: "#666", marginRight: 10 }}>
                Publications
              </span>
              <select
                className={styles.selectInput}
                style={{ width: 120 }}
                value={pubFilter}
                onChange={(e) => {
                  setPubFilter(e.target.value);
                  setCurrentPage(1);
                }}
              >
                <option value="all">All</option>
                <option value="with_access">With Access</option>
                <option value="not_access">Without Access</option>
              </select>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 10,
            }}
          >
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
                <option value="grant_unlimited">Grant Unlimited Access</option>
                <option value="grant_limited">Grant Limited Access</option>
                <option value="revoke">Revoke Access</option>
              </select>

              <button
                className={styles.okBtn}
                onClick={handleOK}
                disabled={!withChecked || checkedIds.length === 0}
                style={{
                  opacity: !withChecked || checkedIds.length === 0 ? 0.5 : 1,
                  cursor:
                    !withChecked || checkedIds.length === 0
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
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
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
            </div>
          )}
        </div>

        <div
          style={{
            padding: "10px 20px",
            textAlign: "center",
            fontSize: 16,
            color: "#555",
            backgroundColor: "#fdfdfd",
            borderBottom: "1px solid #eee",
          }}
        >
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

        {/* Table Section */}
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                {/* 🚀 توزيع المساحات كما طلبته */}
                <th style={{ width: "4%", textAlign: "center" }}></th>
                <th style={{ width: "5%" }}>ID</th>
                <th style={{ width: "18%" }}>Name</th>
                <th style={{ width: "15%", textAlign: "center" }}>Access</th>
                <th style={{ width: "10%", textAlign: "center" }}>Date</th>
                <th style={{ width: "24%" }}>Description</th>
                <th style={{ width: "6%", textAlign: "center" }}>Obey</th>
                <th style={{ width: "9%", textAlign: "center" }}>Customers</th>
                <th style={{ width: "9%", textAlign: "center" }}>Documents</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td
                    colSpan={9}
                    style={{
                      padding: 40,
                      textAlign: "center",
                      color: "#009cad",
                    }}
                  >
                    جاري جلب المنشورات... ⏳
                  </td>
                </tr>
              ) : publications.length === 0 ? (
                <tr>
                  <td
                    colSpan={9}
                    style={{ padding: 40, textAlign: "center", color: "#888" }}
                  >
                    لا توجد بيانات مطابقة للبحث
                  </td>
                </tr>
              ) : (
                publications.map((pub) => {
                  const isChecked = checkedIds.includes(Number(pub.id));
                  return (
                    <tr key={pub.id}>
                      <td style={{ textAlign: "center" }}>
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleToggle(pub.id)}
                        />
                      </td>

                      <td>{pub.id}</td>

                      <td
                        title={pub.name}
                        style={{ color: isChecked ? "#4caf50" : "inherit" }}
                      >
                        {pub.name}
                      </td>

                      {/* 🚀 التعديل: حذفنا whiteSpace: nowrap وقمنا بتقسيم التاريخ لسطرين */}
                      <td style={{ textAlign: "center" }}>
                        <span
                          style={{
                            color: pub.access === "no" ? "#e65100" : "#4caf50",
                            fontWeight: pub.access !== "no" ? "bold" : "normal",
                            display: "inline-block",
                          }}
                        >
                          {pub.access && pub.access.includes(" to ") ? (
                            <div
                              style={{ lineHeight: "1.4", fontSize: "12px" }}
                            >
                              <div>{pub.access.split(" to ")[0]}</div>
                              <div style={{ fontSize: "10px", color: "#888" }}>
                                to
                              </div>
                              <div>{pub.access.split(" to ")[1]}</div>
                            </div>
                          ) : (
                            pub.access || "no"
                          )}
                        </span>
                      </td>

                      <td style={{ textAlign: "center", color: "#666" }}>
                        {pub.date_at ? pub.date_at.split("T")[0] : "-"}
                      </td>

                      <td title={pub.description} style={{ color: "#888" }}>
                        {pub.description || pub.desc || "-"}
                      </td>

                      <td style={{ textAlign: "center" }}>{pub.obey}</td>

                      <td style={{ textAlign: "center" }}>
                        <span
                          className={styles.viewLink}
                          onClick={() => setViewCustomers(pub)}
                        >
                          <i
                            className="bi bi-people-fill"
                            style={{ fontSize: 11 }}
                          />{" "}
                          view
                        </span>
                      </td>

                      <td style={{ textAlign: "center" }}>
                        <span
                          className={styles.viewLink}
                          onClick={() => setViewDocuments(pub)}
                        >
                          <i
                            className="bi bi-file-earmark-text"
                            style={{ fontSize: 11 }}
                          />{" "}
                          view
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
