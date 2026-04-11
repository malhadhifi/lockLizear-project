import { useState } from "react";
import toast from "react-hot-toast";
// استيراد خطاف المستندات لدعم الذاكرة المؤقتة (Caching) بدلاً من axios المباشر
import { useDocuments } from "../../documents/hooks/useDocuments";

const DocumentSelector = ({
  isOpen,
  onClose,
  existingDocIds = [],
  onDocumentsAdded,
}) => {
  const [filter, setFilter] = useState("");
  const [selected, setSelected] = useState([]);
  // جلب المستندات بحد 50 استجابة لطلب المستخدم ومع تفعيل البحث من السيرفر
  const { data: docData, isLoading } = useDocuments({
    limit: 50,
    search: filter,
  });
  const documents = Array.isArray(docData?.items)
    ? docData.items
    : Array.isArray(docData?.data?.items)
      ? docData.data.items
      : Array.isArray(docData)
        ? docData
        : [];

  if (!isOpen) return null;

  const available = documents.filter((d) => !existingDocIds.includes(d.id));
  // المستندات قد يكون لها title بدلاً من name في الباك إند!
  const filtered = available.filter((d) => {
    const docName = d.name || d.title || "";
    return !filter || docName.toLowerCase().includes(filter.toLowerCase());
  });

  const toggleSelect = (id) =>
    setSelected((s) =>
      s.includes(id) ? s.filter((x) => x !== id) : [...s, id],
    );
  const toggleAll = () =>
    setSelected(
      selected.length === filtered.length ? [] : filtered.map((d) => d.id),
    );

  const handleAdd = () => {
    if (!selected.length) return;
    const addedDocs = documents.filter((d) => selected.includes(d.id));
    onDocumentsAdded(addedDocs);
    toast.success(`تم إضافة ${selected.length} مستند`);
    setSelected([]);
    onClose();
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "rgba(0,0,0,0.5)",
        zIndex: 2000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 550,
          maxHeight: "80vh",
          display: "flex",
          flexDirection: "column",
          background: "#fff",
          border: "1px solid #999",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* عنوان أزرق */}
        <div
          style={{
            background: `linear-gradient(135deg, #009cad, #007a87)`,
            color: "#fff",
            padding: "10px 16px",
            fontWeight: 700,
            fontSize: 14,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <span>إضافة مستندات للمنشور</span>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              color: "#fff",
              fontSize: 16,
              cursor: "pointer",
            }}
          >
            ✕
          </button>
        </div>

        {/* بحث */}
        <div
          style={{
            padding: "10px 16px",
            background: "#f0f0f0",
            borderBottom: "1px solid #ccc",
          }}
        >
          <div className="d-flex align-items-center gap-1">
            <label style={{ fontWeight: 600, fontSize: 13 }}>فلتر:</label>
            <input
              type="text"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              placeholder="البحث في المستندات..."
              style={{
                border: "1px solid #999",
                borderRadius: 3,
                padding: "4px 8px",
                flex: 1,
                fontSize: 13,
              }}
            />
          </div>
        </div>

        {/* الجدول */}
        <div style={{ overflow: "auto", flex: 1 }}>
          <table
            style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}
          >
            <thead>
              <tr
                style={{
                  background: "#e8e8e8",
                  borderBottom: "2px solid #999",
                }}
              >
                <th style={thStyle}>
                  <input
                    type="checkbox"
                    checked={
                      selected.length === filtered.length && filtered.length > 0
                    }
                    onChange={toggleAll}
                  />
                </th>
                <th style={thStyle}>ID</th>
                <th style={thStyle}>اسم المستند</th>
                <th style={thStyle}>الحالة</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td
                    colSpan={4}
                    style={{
                      textAlign: "center",
                      padding: 20,
                      color: "#009cad",
                    }}
                  >
                    جارٍ جلب المستندات...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    style={{ textAlign: "center", padding: 20, color: "#888" }}
                  >
                    لا توجد مستندات متاحة
                  </td>
                </tr>
              ) : (
                filtered.map((d, idx) => (
                  <tr
                    key={d.id}
                    style={{
                      background: selected.includes(d.id)
                        ? "#e3f2fd"
                        : idx % 2 === 0
                          ? "#fff"
                          : "#f5f5f5",
                      borderBottom: "1px solid #ddd",
                      cursor: "pointer",
                    }}
                    onClick={() => toggleSelect(d.id)}
                  >
                    <td style={tdStyle}>
                      <input
                        type="checkbox"
                        checked={selected.includes(d.id)}
                        onChange={() => {}}
                      />
                    </td>
                    <td style={tdStyle}>{d.id}</td>
                    <td style={{ ...tdStyle, fontWeight: 600 }}>
                      {d.name || d.title}
                    </td>
                    <td style={tdStyle}>
                      <span
                        style={{
                          color: d.status === "suspend" ? "#e65100" : "#2e7d32",
                          fontWeight: 600,
                        }}
                      >
                        {d.status || "صالح"}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div
          style={{
            padding: "10px 16px",
            background: "#f0f0f0",
            borderTop: "1px solid #ccc",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontSize: 13,
          }}
        >
          <span style={{ color: "#555" }}>{selected.length} مستند محدد</span>
          <div className="d-flex gap-2">
            <button
              onClick={onClose}
              style={{
                background: "#f0f0f0",
                color: "#333",
                border: "1px solid #999",
                borderRadius: 3,
                padding: "6px 16px",
                cursor: "pointer",
              }}
            >
              إلغاء
            </button>
            <button
              onClick={handleAdd}
              disabled={!selected.length}
              style={{
                background: "#009cad",
                color: "#fff",
                border: "none",
                borderRadius: 3,
                padding: "6px 16px",
                fontWeight: 600,
                cursor: "pointer",
                opacity: !selected.length ? 0.5 : 1,
              }}
            >
              إضافة المحددين
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const thStyle = {
  padding: "8px 12px",
  textAlign: "right",
  fontWeight: 700,
  fontSize: 12,
  color: "#333",
  whiteSpace: "nowrap",
};
const tdStyle = {
  padding: "8px 12px",
  textAlign: "right",
  fontSize: 13,
  verticalAlign: "middle",
};

export default DocumentSelector;
