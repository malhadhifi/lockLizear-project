import React from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import styles from "./UsersLayout.module.css"; // استيراد التنسيقات

const TEAL = "#009cad";

export default function UserSidebar({ activeSideNav }) {
  const navigate = useNavigate();

  const sideNavItems = [
    {
      id: "add",
      label: "إضافة",
      icon: "bi-person-plus-fill",
      action: () => navigate("/users/create"),
    },
    {
      id: "manage",
      label: "إدارة",
      icon: "bi-people-fill",
      action: () => navigate("/users"),
    },
    {
      id: "import",
      label: "استيراد",
      icon: "bi-box-arrow-in-down",
      action: () => toast("استيراد..."),
    },
    {
      id: "export",
      label: "تصدير",
      icon: "bi-box-arrow-up",
      action: () => toast("تصدير..."),
    },
    {
      id: "batch",
      label: "تغييرات مجمعة",
      icon: "bi-gear-wide-connected",
      action: () => toast("تغييرات..."),
    },
  ];

  return (
    <div className={styles.sidebarContainer}>
      <ul className={styles.sidebarList}>
        {sideNavItems.map((item) => (
          <li key={item.id} className={styles.sidebarListItem}>
            <button
              onClick={item.action}
              className={styles.sidebarButton}
              // الألوان تبقى هنا لسهولة تغييرها ديناميكياً
              style={{
                background: activeSideNav === item.id ? TEAL : "#fafafa",
                color: activeSideNav === item.id ? "#fff" : TEAL,
                borderBottomColor: activeSideNav === item.id ? TEAL : "#ddd",
              }}
            >
              <i className={`bi ${item.icon}`} /> {item.label}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
