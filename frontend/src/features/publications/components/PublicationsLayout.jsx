// استيراد Outlet من React Router
import { Outlet, useNavigate } from "react-router-dom";
import { useState } from "react";

const TEAL = "#009cad";

const PublicationsLayout = () => {
  const navigate = useNavigate();
  const [activeSideNav, setActiveSideNav] = useState("manage");

  const sideNavItems = [
    {
      id: "add",
      label: "إضافة (Add)",
      icon: "bi-plus-circle-fill",
      action: () => {
        setActiveSideNav("add");
        navigate("/publications/create");
      },
    },
    {
      id: "manage",
      label: "إدارة (Manage)",
      icon: "bi-collection-fill",
      action: () => {
        setActiveSideNav("manage");
        navigate("/publications");
      },
    },
  ];

  return (
    <div className="page-layout" style={{ display: "flex" }}>
      {/* === القائمة الجانبية الثابتة (لن تختفي أبدًا) === */}
      <div className="page-sidebar" style={{ width: "250px" }}>
        <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
          {sideNavItems.map((item) => (
            <li key={item.id} style={{ borderBottom: "1px solid #ddd" }}>
              <button
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
                }}
              >
                <i className={`bi ${item.icon}`} />
                {item.label}
              </button>
            </li>
          ))}
          <li style={{ borderTop: "1px solid #ddd" }}></li>
        </ul>
      </div>

      {/* === المحتوى المتغير (هنا السحر!) === */}
      <div className="page-content" style={{ flex: 1 }}>
        {/* سيقوم React بوضع PublicationsListPage أو CreatePublicationPage هنا تلقائياً */}
        <Outlet />
      </div>
    </div>
  );
};

export default PublicationsLayout;
