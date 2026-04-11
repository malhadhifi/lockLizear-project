/**
 * ملف: EditPublicationPage.jsx
 * الوظيفة: تعديل تفاصيل وإعدادات المنشور (Edit Publication)
 */

import { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import {
  usePublicationDetails,
  useUpdatePublication,
} from "../hooks/usePublications";
import PublicationAccessList from "../components/PublicationAccessList";
import PublicationDocumentsList from "../components/PublicationDocumentsList";
import toast from "react-hot-toast";

const TEAL = "#009cad";

const EditPublicationPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const { data: pubData, isLoading } = usePublicationDetails(id);
  const updateMutation = useUpdatePublication();

  const publication = pubData;

  const initialTab = location.state?.tab || "details";
  const [activeTab, setActiveTab] = useState(initialTab);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [obeyStartDate, setObeyStartDate] = useState(false);

  useEffect(() => {
    if (publication) {
      setName(publication.name || "");
      setDescription(publication.description || "");
      // 🚀 التعديل هنا: إجبار React على تفعيل الصح فوراً سواء جاءت القيمة true أو 1 أو "1" من قاعدة البيانات
      setObeyStartDate(
        publication.obey === true ||
          publication.obey === 1 ||
          publication.obey === "1" ||
          publication.obey === "true",
      );
    }
  }, [publication]);

  if (isLoading) {
    return (
      <div
        style={{ textAlign: "center", padding: 100, color: TEAL, fontSize: 18 }}
      >
        Loading Publication Details... ⏳
      </div>
    );
  }

  if (!publication) {
    return (
      <div
        style={{
          textAlign: "center",
          padding: 60,
          background: "#fff",
          border: "1px solid #ddd",
          borderRadius: 4,
          margin: 20,
        }}
        dir="ltr"
      >
        <p style={{ color: "#888", fontSize: 16, marginBottom: 20 }}>
          Publication not found
        </p>
        <button
          onClick={() => navigate("/publications")}
          style={{
            background: TEAL,
            color: "#fff",
            border: "none",
            borderRadius: 3,
            padding: "8px 20px",
            cursor: "pointer",
            fontWeight: 600,
          }}
        >
          Back to List
        </button>
      </div>
    );
  }

  const handleSave = () => {
    if (!name.trim()) return;
    updateMutation.mutate({
      id: publication.id,
      name,
      description,
      obey: obeyStartDate,
    });
  };

  const tabs = [
    { key: "details", label: "Edit Publication" },
    { key: "documents", label: `Documents (${publication.docsCount || 0})` },
    {
      key: "customers",
      label: `Customers (${publication.customersCount || 0})`,
    },
  ];

  return (
    <div
      style={{ minHeight: "calc(100vh - 100px)", padding: "0 10px" }}
      dir="ltr"
    >
      <div
        style={{
          background: "#fff",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          borderRadius: 4,
          overflow: "hidden",
          border: `1px solid #ccc`,
        }}
      >
        {/* الترويسة */}
        <div
          style={{
            background: TEAL,
            color: "#fff",
            padding: "10px 16px",
            fontWeight: 700,
            fontSize: 14,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <span>Manage Publication: {publication.name}</span>
          <button
            type="button"
            onClick={() => navigate("/publications")}
            style={{
              background: "rgba(255,255,255,0.2)",
              color: "#fff",
              border: "1px solid rgba(255,255,255,0.4)",
              borderRadius: 3,
              padding: "4px 14px",
              fontSize: 12,
              cursor: "pointer",
            }}
          >
            ← Back
          </button>
        </div>

        {/* شريط التبويبات */}
        <div
          style={{
            display: "flex",
            background: "#f8f8f8",
            borderBottom: "1px solid #ccc",
          }}
        >
          {tabs.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              style={{
                padding: "12px 24px",
                fontSize: 13,
                fontWeight: 700,
                background: activeTab === tab.key ? "#fff" : "transparent",
                border: "none",
                borderRight: "1px solid #ccc",
                borderLeft: "none",
                borderBottom: activeTab === tab.key ? "1px solid #fff" : "none",
                borderTop:
                  activeTab === tab.key
                    ? `3px solid ${TEAL}`
                    : "3px solid transparent",
                color: activeTab === tab.key ? TEAL : "#555",
                cursor: "pointer",
                outline: "none",
                position: "relative",
                top: activeTab === tab.key ? 1 : 0,
              }}
            >
              {tab.label}
            </button>
          ))}
          <div style={{ flex: 1 }}></div>
        </div>

        {/* منطقة عرض المحتوى */}
        <div style={{ background: "#fff", minHeight: 400 }}>
          {/* === التبويبة 1: التفاصيل === */}
          <div
            style={{
              display: activeTab === "details" ? "block" : "none",
              padding: "24px 30px",
            }}
          >
            {/* 🚀 تم تلوين العنوان بلون النظام مع خط جانبي أنيق */}
            <div
              style={{
                background: "#f8fcfc",
                color: TEAL,
                padding: "8px 16px",
                fontWeight: 700,
                fontSize: 13,
                border: "1px solid #e0f0f2",
                borderLeft: `4px solid ${TEAL}`,
                marginBottom: 20,
              }}
            >
              Edit Details
            </div>

            <div style={{ maxWidth: 800 }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  marginBottom: 16,
                }}
              >
                <label
                  style={{
                    width: 180,
                    fontWeight: 700,
                    fontSize: 13,
                    color: "#111",
                    marginTop: 8,
                  }}
                >
                  Name
                </label>
                <div style={{ flex: 1 }}>
                  <input
                    type="text"
                    value={name}
                    readOnly
                    style={{
                      width: "100%",
                      maxWidth: 350,
                      border: "1px solid #ccc",
                      backgroundColor: "#e9ecef",
                      color: "#555",
                      cursor: "not-allowed",
                      borderRadius: 3,
                      padding: "6px 10px",
                      fontSize: 13,
                    }}
                  />
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  marginBottom: 16,
                }}
              >
                <label
                  style={{
                    width: 180,
                    fontWeight: 700,
                    fontSize: 13,
                    color: "#111",
                    marginTop: 8,
                  }}
                >
                  Description
                </label>
                <div style={{ flex: 1 }}>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                    style={{
                      width: "100%",
                      maxWidth: 450,
                      border: "1px solid #ccc",
                      borderRadius: 3,
                      padding: "6px 10px",
                      fontSize: 13,
                      resize: "vertical",
                    }}
                  />
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: 24,
                  paddingLeft: 180,
                }}
              >
                <input
                  type="checkbox"
                  checked={obeyStartDate}
                  onChange={(e) => setObeyStartDate(e.target.checked)}
                  id="obeyEdit"
                  style={{ marginRight: 8 }}
                />
                <label
                  htmlFor="obeyEdit"
                  style={{
                    fontSize: 13,
                    cursor: "pointer",
                    fontWeight: 600,
                    color: "#333",
                  }}
                >
                  Obey customer start date
                </label>
              </div>

              <hr
                style={{
                  border: "none",
                  borderTop: "1px solid #ddd",
                  margin: "20px 0",
                }}
              />

              <div style={{ display: "flex", gap: 12, paddingLeft: 180 }}>
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={!name.trim()}
                  style={{
                    background: TEAL,
                    color: "#fff",
                    border: "none",
                    borderRadius: 2,
                    padding: "8px 30px",
                    fontSize: 13,
                    fontWeight: 700,
                    cursor: "pointer",
                    opacity: !name.trim() ? 0.5 : 1,
                  }}
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => navigate("/publications")}
                  style={{
                    background: "#f0f0f0",
                    color: "#333",
                    border: "1px solid #ccc",
                    borderRadius: 2,
                    padding: "8px 30px",
                    fontSize: 13,
                    cursor: "pointer",
                    fontWeight: 600,
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>

            {/* 🚀 قسم معلومات النظام: تم تلوين العنوان ليتناسق مع الصفحة */}
            <div
              style={{
                marginTop: 40,
                padding: "16px 20px",
                background: "#fdfdfd",
                border: "1px solid #eaeaea",
                borderRadius: 3,
                maxWidth: 800,
              }}
            >
              <h4
                style={{
                  margin: "0 0 12px 0",
                  fontSize: 13,
                  color: TEAL,
                  fontWeight: "bold",
                }}
              >
                System Details:
              </h4>

              <table
                style={{
                  borderCollapse: "collapse",
                  fontSize: 12,
                  color: "#555",
                }}
              >
                <tbody>
                  <tr>
                    <td
                      style={{
                        padding: "2px 30px 2px 0",
                        verticalAlign: "top",
                        color: "#777",
                        width: 140,
                      }}
                    >
                      ID:
                    </td>
                    <td
                      style={{
                        padding: "2px 15px 2px 0",
                        verticalAlign: "top",
                        fontWeight: "bold",
                      }}
                    >
                      {publication.id}
                    </td>
                  </tr>
                  <tr>
                    <td
                      style={{
                        padding: "2px 30px 2px 0",
                        verticalAlign: "top",
                        color: "#777",
                      }}
                    >
                      Status:
                    </td>
                    <td
                      style={{
                        padding: "2px 15px 2px 0",
                        verticalAlign: "top",
                        fontWeight: "bold",
                        color:
                          publication.status === "active"
                            ? "#4caf50"
                            : "#f44336",
                      }}
                    >
                      {publication.status || "—"}
                    </td>
                  </tr>
                  <tr>
                    <td
                      style={{
                        padding: "2px 30px 2px 0",
                        verticalAlign: "top",
                        color: "#777",
                      }}
                    >
                      PDF Files:
                    </td>
                    <td
                      style={{
                        padding: "2px 15px 2px 0",
                        verticalAlign: "top",
                        fontWeight: "bold",
                      }}
                    >
                      {publication.pdfCount || 0}
                    </td>
                  </tr>
                  <tr>
                    <td
                      style={{
                        padding: "2px 30px 2px 0",
                        verticalAlign: "top",
                        color: "#777",
                      }}
                    >
                      Video Files:
                    </td>
                    <td
                      style={{
                        padding: "2px 15px 2px 0",
                        verticalAlign: "top",
                        fontWeight: "bold",
                      }}
                    >
                      {publication.videoCount || 0}
                    </td>
                  </tr>
                  <tr>
                    <td
                      style={{
                        padding: "2px 30px 2px 0",
                        verticalAlign: "top",
                        color: "#777",
                      }}
                    >
                      Created At:
                    </td>
                    <td
                      style={{
                        padding: "2px 15px 2px 0",
                        verticalAlign: "top",
                        fontWeight: "bold",
                      }}
                    >
                      {publication.createdAt || "—"}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* === التبويبة 2: المستندات === */}
          <div
            style={{
              display: activeTab === "documents" ? "block" : "none",
              padding: "20px",
            }}
          >
            <PublicationDocumentsList publicationId={id} />
          </div>

          {/* === التبويبة 3: العملاء === */}
          <div
            style={{
              display: activeTab === "customers" ? "block" : "none",
              padding: "20px",
            }}
          >
            <PublicationAccessList publicationId={id} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditPublicationPage;
