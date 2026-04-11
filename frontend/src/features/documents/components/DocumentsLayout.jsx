import { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useDocumentExport } from "../hooks/useDocuments";

const TEAL = "#009cad";

const DocumentsLayout = () => {
  const navigate = useNavigate();

  // حالة القائمة الجانبية
  const [activeSideNav, setActiveSideNav] = useState("manage");

  // حالات نافذة التصدير
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportType, setExportType] = useState("all");
  const [exportFormat, setExportFormat] = useState("csv");

  const exportMutation = useDocumentExport();

  const handleExport = async () => {
    try {
      const res = await exportMutation.mutateAsync({
        type: exportType,
        format: exportFormat,
      });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `documents-${Date.now()}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      toast.success("تم تصدير الملف بنجاح");
      setShowExportModal(false);
    } catch {}
  };

  // القائمة الجانبية كما صممتها أنت (زر الإدارة وزر التصدير)
  const sideNavItems = [
    {
      id: "manage",
      label: "إدارة (Manage)",
      icon: "bi-file-earmark-text-fill",
      action: () => {
        setActiveSideNav("manage");
        navigate("/documents");
      },
    },
    {
      id: "export",
      label: "تصدير (Export CSV)",
      icon: "bi-box-arrow-up",
      action: () => setShowExportModal(true),
    },
  ];

  return (
    <div className="page-layout" style={{ display: "flex" }}>
      {/* === القائمة الجانبية === */}
      <div className="page-sidebar">
        <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
          {sideNavItems.map((item) => (
            <li key={item.id} style={{ borderBottom: "1px solid #ddd" }}>
              <button
                type="button"
                onClick={item.action}
                style={{
                  width: "100%",
                  textAlign: "right",
                  padding: "12px 16px",
                  background: activeSideNav === item.id ? TEAL : "#fafafa",
                  color: activeSideNav === item.id ? "#fff" : TEAL,
                  border: "1px solid #ddd",
                  borderBottom: "none",
                  cursor: "pointer",
                  fontWeight: 600,
                  fontSize: 13,
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  opacity:
                    item.id === "export" && exportMutation.isPending ? 0.6 : 1,
                }}
              >
                <i className={`bi ${item.icon}`} />
                {item.id === "export" && exportMutation.isPending
                  ? "جاري..."
                  : item.label}
              </button>
            </li>
          ))}
          <li style={{ borderTop: "1px solid #ddd" }}></li>
        </ul>
      </div>

      {/* === المحتوى (هنا ستظهر صفحة قائمة المستندات) === */}
      <div className="page-content" style={{ flex: 1 }}>
        <Outlet />
      </div>

      {/* === نافذة التصدير المنبثقة === */}
      {showExportModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.45)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
          }}
          onClick={() => setShowExportModal(false)}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: 4,
              width: "100%",
              maxWidth: 440,
              boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                background: TEAL,
                color: "#fff",
                padding: "10px 16px",
                fontWeight: 700,
                fontSize: 14,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                borderRadius: "4px 4px 0 0",
              }}
            >
              <span>
                <i
                  className="bi bi-file-earmark-arrow-down"
                  style={{ marginLeft: 6 }}
                />{" "}
                تصدير المستندات (Export Documents)
              </span>
              <button
                onClick={() => setShowExportModal(false)}
                style={{
                  background: "none",
                  border: "none",
                  color: "#fff",
                  fontSize: 20,
                  cursor: "pointer",
                }}
              >
                ✕
              </button>
            </div>
            <div style={{ padding: 24 }}>
              <p style={{ fontSize: 13, color: "#555", marginBottom: 20 }}>
                من هذا الإعداد يمكنك تصدير سجلات المستندات إلى ملف CSV
              </p>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 16,
                  marginBottom: 16,
                  fontSize: 13,
                }}
              >
                <label style={{ fontWeight: 700, minWidth: 80 }}>
                  Export type:
                </label>
                <select
                  value={exportType}
                  onChange={(e) => setExportType(e.target.value)}
                  style={{
                    border: "1px solid #ccc",
                    borderRadius: 3,
                    padding: "6px 12px",
                    fontSize: 13,
                    flex: 1,
                  }}
                >
                  <option value="all">All</option>
                  <option value="valid">Valid only</option>
                  <option value="suspend">suspend only</option>
                  <option value="expired">Expired only</option>
                </select>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 16,
                  marginBottom: 24,
                  fontSize: 13,
                }}
              >
                <label style={{ fontWeight: 700, minWidth: 80 }}>Format:</label>
                <select
                  value={exportFormat}
                  onChange={(e) => setExportFormat(e.target.value)}
                  style={{
                    border: "1px solid #ccc",
                    borderRadius: 3,
                    padding: "6px 12px",
                    fontSize: 13,
                    flex: 1,
                  }}
                >
                  <option value="csv">CSV</option>
                </select>
              </div>
              <div style={{ textAlign: "left" }}>
                <button
                  onClick={handleExport}
                  disabled={exportMutation.isPending}
                  style={{
                    background: TEAL,
                    color: "#fff",
                    border: "none",
                    borderRadius: 3,
                    padding: "8px 36px",
                    fontSize: 14,
                    fontWeight: 700,
                    cursor: "pointer",
                    opacity: exportMutation.isPending ? 0.6 : 1,
                  }}
                >
                  {exportMutation.isPending ? "جاري التصدير..." : "Export"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentsLayout;
