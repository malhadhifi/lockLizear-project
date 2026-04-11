import React from "react";
// 🚀 نستورد نفس ملف التصميم الخاص بالمستخدمين لضمان التطابق 100%
import styles from "../../users/pages/UsersListPage.module.css";

export default function PublicationCard({
  pub,
  isSelected,
  onToggleSelect,
  onEdit,
  onDelete,
  onNavigateTab,
}) {
  // تحديد اللون الجانبي: أخضر إذا كان يلتزم بالتاريخ، أزرق إذا لم يكن يلتزم
  const statusColor = pub.status=="suspend" ? "#cb4a1eff" : "#3a21f3ff";
  const obyColor = pub.obey ? "#4caf50" : "#0b7cd8d3";

  return (
    <div className={styles.card}>
      {/* الشريط الجانبي الملون */}
      <div
        className={styles.statusLine}
        style={{ backgroundColor: statusColor }}
      />

      <div className={styles.cardContent}>
        {/* رأس البطاقة */}
        <div className={styles.cardHeader}>
          <input
            type="checkbox"
            checked={isSelected}
            onChange={() => onToggleSelect(pub.id)}
          />
          <span className={styles.cardTitle}>{pub.name}</span>

          {/* الأيقونات بنفس تصميم المستخدمين */}
          <div className={styles.cardIcons}>
            <button
              className={`${styles.iconBtn} ${styles.email}`} // استخدمنا كلاس email للون الأزرق مثلاً
              title="تعديل"
              onClick={() => onEdit(pub.id)}
              style={{ fontSize: 16 }}
            >
              ✎
            </button>
            <button
              className={`${styles.iconBtn} ${styles.delete}`}
              title="حذف"
              onClick={() => onDelete(pub.id)}
              style={{ fontSize: 16 }}
            >
              ✖
            </button>
            <button
              className={`${styles.iconBtn} ${styles.expand}`}
              title="التفاصيل"
              onClick={() => onEdit(pub.id)}
              style={{ letterSpacing: "-1px" }}
            >
              &gt;&gt;
            </button>
          </div>
        </div>

        {/* تفاصيل البطاقة */}
        <div className={styles.cardBody}>
          <table className={styles.metaTable}>
            <tbody>
              <tr>
                <td className={styles.metaLabel}>Description:</td>
                <td>{pub.description || "—"}</td>
              </tr>
              <tr>
                <td className={styles.metaLabel}>ID:</td>
                <td>{pub.id}</td>
              </tr>
              <tr>
                <td className={styles.metaLabel}>Obey:</td>
                <td style={{ color: obyColor, fontWeight: "bold" }}>
                  {pub.obey ? "yes" : "no"}
                </td>
              </tr>
              <tr>
                <td className={styles.metaLabel}>Customers:</td>
                <td>
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      onNavigateTab(pub.id, "customers");
                    }}
                    style={{
                      color: "#009cad",
                      fontWeight: "bold",
                      textDecoration: "none",
                    }}
                  >
                    view ({pub.customersCount || 0})
                  </a>
                </td>
              </tr>
              <tr>
                <td className={styles.metaLabel}>Documents:</td>
                <td>
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      onNavigateTab(pub.id, "documents");
                    }}
                    style={{
                      color: "#009cad",
                      fontWeight: "bold",
                      textDecoration: "none",
                    }}
                  >
                    view ({pub.docsCount || 0})
                  </a>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
