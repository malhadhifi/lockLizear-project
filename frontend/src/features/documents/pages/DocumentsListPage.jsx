import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useDocuments, useDocumentAction } from "../hooks/useDocuments";

const TEAL = "#009cad";

const borderColor = {
  valid: "#4caf50",
  suspend: "#ff9800",
  expired: "#f44336",
};

const filterInputStyle = {
  border: "1px solid #ccc",
  borderRadius: 3,
  padding: "4px 8px",
  fontSize: 13,
};
const filterSelectStyle = {
  border: "1px solid #ccc",
  borderRadius: 3,
  padding: "4px 8px",
  fontSize: 13,
};
const fieldLabelStyle = {
  fontWeight: 700,
  paddingLeft: 16,
  verticalAlign: "top",
  color: "#111",
  whiteSpace: "nowrap",
};
const fieldValueStyle = { color: "#333", verticalAlign: "top" };

const DocumentsListPage = () => {
  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(25);
  const [searchInput, setSearchInput] = useState("");
  const [sortBy, setSortBy] = useState("title");
  const [showFilter, setShowFilter] = useState("all");

  const [selected, setSelected] = useState([]);
  const [bulkAction, setBulkAction] = useState("");

  const actionMutation = useDocumentAction();

  // جلب المستندات مع تحديد بـ 50 مستند للمحافظة على موارد المتصفح وتفعيل البحث من جانب الخادم (طريقة زميلك)
  const { data, isLoading, isError, error, isFetching } = useDocuments({
    limit: 50,
    search: searchInput,
  });

  const rawDocuments = Array.isArray(data?.items)
    ? data.items
    : Array.isArray(data?.data?.items)
      ? data.data.items
      : Array.isArray(data)
        ? data
        : [];

  const filtered = useMemo(() => {
    let result = [...rawDocuments];

    // تم إيقاف البحث من طرف المتصفح حيث أصبح السيرفر يتولى ذلك لتقليل الضغط (تعديل زميلك)
    // if (searchInput.trim()) {
    //   const s = searchInput.toLowerCase();
    //   result = result.filter(
    //     (d) =>
    //       (d.title || "").toLowerCase().includes(s) ||
    //       d.id?.toString().includes(s),
    //   );
    // }

    if (showFilter === "valid")
      result = result.filter((d) => d.status === "valid");
    if (showFilter === "suspend")
      result = result.filter((d) => d.status === "suspend");
    if (showFilter === "expired")
      result = result.filter((d) => d.status === "expired");

    result.sort((a, b) => {
      if (sortBy === "title")
        return (a.title || "").localeCompare(b.title || "");
      if (sortBy === "id") return a.id - b.id;
      if (sortBy === "published")
        return new Date(b.published || 0) - new Date(a.published || 0);
      return 0;
    });

    return result;
  }, [rawDocuments, searchInput, showFilter, sortBy]);

  const totalPages = Math.ceil(filtered.length / perPage) || 1;
  const documents = filtered.slice(
    (currentPage - 1) * perPage,
    currentPage * perPage,
  );

  const toggleSelect = (id) =>
    setSelected((s) =>
      s.includes(id) ? s.filter((x) => x !== id) : [...s, id],
    );
  const checkAll = () => setSelected(documents.map((d) => d.id));
  const uncheckAll = () => setSelected([]);
  const invertSelection = () =>
    setSelected(
      documents.map((d) => d.id).filter((id) => !selected.includes(id)),
    );

  const handleSingleAction = async (ids, action, successMsg) => {
    if (action === "Delete" && !window.confirm("هل أنت متأكد؟")) return;
    try {
      await actionMutation.mutateAsync({ ids, action });
      toast.success(successMsg);
    } catch {}
  };

  const handleBulkAction = async () => {
    if (!selected.length || !bulkAction) return;
    if (
      bulkAction === "Delete" &&
      !window.confirm(`هل أنت متأكد من حذف ${selected.length} مستند؟`)
    )
      return;
    try {
      await actionMutation.mutateAsync({ ids: selected, action: bulkAction });
      toast.success(`تم تنفيذ ${bulkAction} على ${selected.length} مستند`);
      setSelected([]);
      setBulkAction("");
    } catch {}
  };

  const handleFilterChange = (setter) => (val) => {
    setter(val);
    setCurrentPage(1);
    setSelected([]);
  };

  return (
    <div style={{ width: "100%" }}>
      {/* ترويسة Teal */}
      <div
        style={{
          background: TEAL,
          color: "#fff",
          padding: "10px 16px",
          fontWeight: 700,
          fontSize: 14,
          display: "flex",
          justifyContent: "space-between",
          borderRadius: "2px 2px 0 0",
        }}
      >
        <span>إدارة المستندات المحمية (Manage Documents)</span>
        {isFetching && !isLoading && (
          <span style={{ fontSize: 11, opacity: 0.85 }}>
            ⚡ جاري التحديث...
          </span>
        )}
      </div>

      {/* صندوق الفلاتر */}
      <div
        style={{
          border: `1px solid ${TEAL}`,
          borderTop: "none",
          padding: "16px 20px",
          background: "#fff",
        }}
      >
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
          <label style={{ fontWeight: 600, minWidth: 40 }}>
            تصفية (Filter)
          </label>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              flex: 1,
              maxWidth: 400,
            }}
          >
            <span
              style={{
                color: TEAL,
                fontSize: 16,
                padding: "0 8px",
                border: "1px solid #ccc",
                borderLeft: "none",
                height: 28,
                display: "flex",
                alignItems: "center",
                background: "#fafafa",
              }}
            >
              🔍
            </span>
            <input
              type="text"
              value={searchInput}
              onChange={(e) => {
                setSearchInput(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="بحث بالعنوان..."
              style={{
                ...filterInputStyle,
                borderRight: "none",
                borderTopRightRadius: 0,
                borderBottomRightRadius: 0,
                flex: 1,
                height: 28,
              }}
            />
          </div>
        </div>

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
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <label style={{ fontWeight: 600 }}>فرز حسب (Sort by)</label>
            <select
              value={sortBy}
              onChange={(e) => handleFilterChange(setSortBy)(e.target.value)}
              style={filterSelectStyle}
            >
              <option value="title">الاسم (Name)</option>
              <option value="id">المعرف (ID)</option>
              <option value="published">تاريخ النشر (Published Date)</option>
            </select>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <label style={{ fontWeight: 600 }}>عرض (Show)</label>
            <select
              value={perPage}
              onChange={(e) =>
                handleFilterChange(setPerPage)(Number(e.target.value))
              }
              style={filterSelectStyle}
            >
              <option value={2}>2</option>
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <label style={{ fontWeight: 600 }}>حالة (Status)</label>
            <select
              value={showFilter}
              onChange={(e) =>
                handleFilterChange(setShowFilter)(e.target.value)
              }
              style={filterSelectStyle}
            >
              <option value="all">الكل (All)</option>
              <option value="valid">صالح (Valid)</option>
              <option value="suspend">موقوف (suspend)</option>
              <option value="expired">منتهي (Expired)</option>
            </select>
          </div>
        </div>

        <hr
          style={{
            border: "none",
            borderTop: "1px solid #a3d9df",
            margin: "16px 0",
          }}
        />

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
          <span style={{ fontWeight: 600 }}>الكل (All)</span>
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              checkAll();
            }}
            style={{ color: TEAL }}
          >
            تحديد (Check)
          </a>{" "}
          <span style={{ color: "#ccc" }}>|</span>
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              uncheckAll();
            }}
            style={{ color: TEAL }}
          >
            إلغاء (Uncheck)
          </a>{" "}
          <span style={{ color: "#ccc" }}>|</span>
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              invertSelection();
            }}
            style={{ color: TEAL }}
          >
            عكس (Invert)
          </a>
        </div>

        <div
          className="mobile-bulk-row"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            marginBottom: 8,
            fontSize: 13,
          }}
        >
          <label style={{ fontWeight: 600 }}>
            مع كل المحدد (With all checked)
          </label>
          <select
            value={bulkAction}
            onChange={(e) => setBulkAction(e.target.value)}
            style={{
              ...filterSelectStyle,
              minWidth: 200,
              flex: 1,
              maxWidth: 300,
            }}
          >
            <option value=""></option>
            <option value="Suspend">إيقاف (Suspend)</option>
            <option value="Activate">تفعيل (Activate)</option>
            <option value="Delete">حذف (Delete)</option>
          </select>
          <button
            type="button"
            onClick={handleBulkAction}
            disabled={
              !bulkAction || selected.length === 0 || actionMutation.isPending
            }
            style={{
              background: TEAL,
              color: "#fff",
              border: "none",
              borderRadius: 2,
              padding: "6px 30px",
              fontSize: 13,
              fontWeight: 700,
              cursor: "pointer",
              opacity:
                !bulkAction || selected.length === 0 || actionMutation.isPending
                  ? 0.5
                  : 1,
            }}
          >
            {actionMutation.isPending ? "جاري..." : "موافق (OK)"}
          </button>
        </div>
      </div>

      {/* مؤشر التحميل */}
      {isLoading && (
        <div
          style={{
            textAlign: "center",
            padding: "30px 0",
            color: TEAL,
            fontSize: 14,
            fontWeight: 600,
          }}
        >
          <i
            className="bi bi-arrow-repeat"
            style={{ marginLeft: 8, animation: "spin 1s linear infinite" }}
          />
          جاري تحميل المستندات...
          <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
        </div>
      )}

      {/* رسالة الخطأ */}
      {!isLoading && isError && (
        <div style={{ textAlign: "center", padding: "30px 0" }}>
          <p style={{ color: "#f44336", marginBottom: 12, fontSize: 14 }}>
            &#9888;&#65039; {error?.message || "حدث خطأ في جلب البيانات"}
          </p>
          <button
            onClick={() => window.location.reload()}
            style={{
              background: TEAL,
              color: "#fff",
              border: "none",
              borderRadius: 3,
              padding: "8px 24px",
              cursor: "pointer",
              fontWeight: 600,
              fontSize: 13,
            }}
          >
            إعادة المحاولة (Retry)
          </button>
        </div>
      )}

      {/* عداد النتائج */}
      {!isLoading && !isError && (
        <div
          style={{
            textAlign: "center",
            color: TEAL,
            fontSize: 13,
            fontWeight: 700,
            margin: "20px 0",
          }}
          dir="ltr"
        >
          {">> "}
          <span>[{filtered.length}]</span>
          {" <<"}
        </div>
      )}

      {/* بطاقات المستندات */}
      {!isLoading && !isError && (
        <div>
          {filtered.length === 0 ? (
            <div style={{ textAlign: "center", padding: 40, color: "#888" }}>
              لا توجد مستندات مطابقة (No documents found)
            </div>
          ) : (
            filtered
              .slice((currentPage - 1) * perPage, currentPage * perPage)
              .map((doc) => (
                <div
                  key={doc.id}
                  className="mobile-card"
                  style={{
                    display: "flex",
                    alignItems: "stretch",
                    background: "#f8f8f8",
                    marginBottom: 16,
                    borderRight: `8px solid ${borderColor[doc.status] || "#ccc"}`,
                    borderBottom: "1px solid #eee",
                    borderTop: "1px solid #eee",
                    borderLeft: "1px solid #eee",
                  }}
                >
                  <div
                    style={{
                      padding: "8px 12px",
                      display: "flex",
                      alignItems: "flex-start",
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={selected.includes(doc.id)}
                      onChange={() => toggleSelect(doc.id)}
                    />
                  </div>
                  <div style={{ flex: 1, padding: "10px 16px", fontSize: 13 }}>
                    <div style={{ marginBottom: 8 }}>
                      <a
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          navigate(`/documents/${doc.id}`);
                        }}
                        style={{
                          color: TEAL,
                          fontWeight: 700,
                          fontSize: 14,
                          textDecoration: "none",
                        }}
                      >
                        {doc.title}
                      </a>
                    </div>
                    <table style={{ fontSize: 13, lineHeight: 1.6 }}>
                      <tbody>
                        <tr>
                          <td style={fieldLabelStyle}>المعرف (ID)</td>
                          <td style={fieldValueStyle}>{doc.id}</td>
                        </tr>
                        <tr>
                          <td style={fieldLabelStyle}>
                            تاريخ النشر (Published)
                          </td>
                          <td style={fieldValueStyle}>{doc.published}</td>
                        </tr>
                        <tr>
                          <td style={fieldLabelStyle}>الحالة (Status)</td>
                          <td style={fieldValueStyle}>
                            {doc.status === "valid" && (
                              <span
                                style={{ color: "#4caf50", fontWeight: 600 }}
                              >
                                صالح (Valid)
                              </span>
                            )}
                            {doc.status === "suspend" && (
                              <span
                                style={{ color: "#ff9800", fontWeight: 600 }}
                              >
                                موقوف (suspend)
                              </span>
                            )}
                            {doc.status === "expired" && (
                              <span
                                style={{ color: "#f44336", fontWeight: 600 }}
                              >
                                منتهي (Expired)
                              </span>
                            )}
                          </td>
                        </tr>
                        <tr>
                          <td style={fieldLabelStyle}>العملاء (Customers)</td>
                          <td style={fieldValueStyle}>
                            <a
                              href="#"
                              onClick={(e) => {
                                e.preventDefault();
                                navigate(`/documents/${doc.id}`, {
                                  state: { tab: "access" },
                                });
                              }}
                              style={{ color: TEAL, fontWeight: "bold" }}
                            >
                              {doc.customers_count ?? 0}
                            </a>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div
                    className="mobile-card-actions"
                    style={{
                      display: "flex",
                      gap: 6,
                      padding: "8px 12px",
                      alignItems: "flex-start",
                      background: "#fff",
                    }}
                  >
                    <ActionIcon
                      icon="bi-slash-circle"
                      color="#ff9800"
                      title="إيقاف (Suspend)"
                      onClick={() =>
                        handleSingleAction(
                          [doc.id],
                          "Suspend",
                          "تم إيقاف المستند",
                        )
                      }
                    />
                    <ActionIcon
                      icon="bi-x"
                      color="#f44336"
                      title="حذف (Delete)"
                      bold
                      onClick={() =>
                        handleSingleAction([doc.id], "Delete", "تم حذف المستند")
                      }
                    />
                    <ActionIcon
                      icon="bi-chevron-double-left"
                      color="#fff"
                      bg={TEAL}
                      title="عرض التفاصيل (View Details)"
                      onClick={() => navigate(`/documents/${doc.id}`)}
                    />
                  </div>
                </div>
              ))
          )}
        </div>
      )}

      {/* أزرار Pagination */}
      {!isLoading && filtered.length > 0 && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 10,
            padding: "10px 0",
          }}
        >
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage <= 1}
            title="السابق (Previous)"
            style={{
              background: currentPage <= 1 ? "#eee" : "#fff",
              color: currentPage <= 1 ? "#999" : TEAL,
              border: `1px solid ${currentPage <= 1 ? "#ccc" : TEAL}`,
              borderRadius: 3,
              padding: "2px 12px",
              cursor: currentPage <= 1 ? "not-allowed" : "pointer",
              fontWeight: "bold",
              fontSize: 14,
            }}
          >
            &lt;&lt;
          </button>
          <span style={{ fontSize: 13, fontWeight: 700, color: TEAL }}>
            [ {currentPage} / {totalPages} ]
          </span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage >= totalPages}
            title="التالي (Next)"
            style={{
              background: currentPage >= totalPages ? "#eee" : "#fff",
              color: currentPage >= totalPages ? "#999" : TEAL,
              border: `1px solid ${currentPage >= totalPages ? "#ccc" : TEAL}`,
              borderRadius: 3,
              padding: "2px 12px",
              cursor: currentPage >= totalPages ? "not-allowed" : "pointer",
              fontWeight: "bold",
              fontSize: 14,
            }}
          >
            &gt;&gt;
          </button>
        </div>
      )}
    </div>
  );
};

const ActionIcon = ({
  icon,
  color,
  bg = "transparent",
  bold = false,
  title,
  onClick,
}) => (
  <button
    type="button"
    onClick={onClick}
    title={title}
    style={{
      background: bg,
      color,
      border: bg === "transparent" ? `2px solid ${color}` : "none",
      borderRadius: "50%",
      width: 24,
      height: 24,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      cursor: "pointer",
      fontSize: 14,
      padding: 0,
      fontWeight: bold ? 900 : "normal",
    }}
  >
    <i className={`bi ${icon}`} />
  </button>
);

export default DocumentsListPage;
