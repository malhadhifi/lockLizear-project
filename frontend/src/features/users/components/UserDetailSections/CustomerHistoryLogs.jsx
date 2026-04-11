import React from "react";
import styles from "../../pages/UserDetailPage.module.css";

export default function CustomerHistoryLogs({
  onOpenViewsModal,
  onOpenPrintsModal,
  onOpenEmailStatusModal,
}) {
  return (
    <>
      <div className={styles.sectionHeaderStyle}>History & Logs</div>

      {/* نفس الحاوية والمسافات المستخدمة في قسم الوصول تماماً */}
      <div
        className={styles.formWrapper}
        style={{
          backgroundColor: "#fdfdfd",
          display: "flex",
          flexDirection: "column",
          gap: 10,
        }}
      >
        {/* رابط مشاهدات الملفات (نفس هيكل الروابط السابقة بالضبط) */}
        <div>
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              onOpenViewsModal();
            }}
            className={styles.actionLinkStyle}
          >
            <i className="bi bi-eye" style={{ marginRight: 6 }} />
            View Document Views
          </a>
        </div>

        {/* رابط طباعة الملفات */}
        <div>
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              onOpenPrintsModal();
            }}
            className={styles.actionLinkStyle}
          >
            <i className="bi bi-printer" style={{ marginRight: 6 }} />
            View Document Prints
          </a>
        </div>

        {/* رابط حالة الإيميلات */}
        <div>
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              onOpenEmailStatusModal();
            }}
            className={styles.actionLinkStyle}
          >
            <i className="bi bi-envelope-open" style={{ marginRight: 6 }} />
            Email Delivery Status
          </a>
        </div>
      </div>
    </>
  );
}
