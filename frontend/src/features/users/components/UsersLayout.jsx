import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import UserSidebar from "./UserSidebar";
import styles from "./UsersLayout.module.css"; // استيراد التنسيقات

export default function UsersLayout() {
  const location = useLocation();
  // تحديد الزر النشط بناءً على الرابط
  const activeSideNav = location.pathname.includes("/create")
    ? "add"
    : "manage";

  return (
    <div className={styles.layoutContainer}>
      {/* القائمة الثابتة (والتي تصبح علوية في الجوال) */}
      <UserSidebar activeSideNav={activeSideNav} />

      {/* هنا سيتم عرض صفحة القائمة أو صفحة الإضافة */}
      <div style={{ flex: 1, minWidth: 0 }}>
        {" "}
        {/* minWidth: 0 مهمة جداً لمرونة العناصر داخل Flex */}
        <Outlet />
      </div>
    </div>
  );
}
