import React from "react";
import styles from "../pages/UsersListPage.module.css";

export default function UserCard({
  user,
  isSelected,
  onToggleSelect,
  onNavigate,
  onResendLicense,
  onDelete,
  onToggleSuspend, // 👈 1. استقبال الدالة الجديدة
}) {
  // تحديد حالة العميل لتلوين الشريط الجانبي للبطاقة
  const isExpired = !!user.ui_status?.expired_on;
  const isSuspended = user.ui_status?.account_status === "suspend";
  const isNotRegistered = user.ui_status?.registration === "not registers";

  // الألوان حسب الأولوية (نفس منطق الكتاب الأصلي)
  let statusColor = "#4caf50"; // أخضر مفعل
  if (isExpired)
    statusColor = "#9e9e9e"; // رمادي منتهي
  else if (isSuspended)
    statusColor = "#f44336"; // أحمر موقوف
  else if (isNotRegistered) statusColor = "#2196f3"; // أزرق غير مسجل

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
            onChange={() => onToggleSelect(user.id)}
          />
          <span className={styles.cardTitle}>{user.name}</span>

          {/* الأيقونات */}
          <div className={styles.cardIcons}>
            <button
              className={`${styles.iconBtn} ${styles.suspend}`}
              title={isSuspended ? "Activate" : "Suspend"}
              style={{ fontSize: 18, fontWeight: "bold" }}
              // 👇 2. ربط الدالة بحدث النقر وتحديد الأكشن المناسب
              onClick={() => {
                const action = isSuspended ? "active" : "suspend";
                // يفضل إضافة رسالة تأكيد، ويمكنك إزالتها إذا لم ترغب بها {
                  onToggleSuspend(user.id, action);
                }
              }
            >
              {isSuspended ? "✓" : "⊘"}
            </button>
            <button
              className={`${styles.iconBtn} ${styles.delete}`}
              title="Delete"
              onClick={() => onDelete(user.id)}
              style={{ fontSize: 16 }}
            >
              ✖
            </button>
            <button
              className={`${styles.iconBtn} ${styles.email}`}
              title="Email"
              onClick={() => onResendLicense(user.id)}
              style={{ fontSize: 18 }}
            >
              ✉
            </button>
            <button
              className={`${styles.iconBtn} ${styles.expand}`}
              onClick={() => onNavigate(user.id)}
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
              {user.company && (
                <tr>
                  <td className={styles.metaLabel}>Company:</td>
                  <td>{user.company}</td>
                </tr>
              )}
              <tr>
                <td className={styles.metaLabel}>Email:</td>
                <td>{user.email}</td>
              </tr>
              <tr>
                <td className={styles.metaLabel}>ID:</td>
                <td>{user.id}</td>
              </tr>

              {/* 🚀 التعديل هنا: عرض الحالة بالتفصيل كما يرسلها Laravel */}
              <tr>
                <td className={styles.metaLabel}>Status:</td>
                <td style={{ lineHeight: "1.6" }}>
                  {/* التسجيل */}
                  {isNotRegistered ? (
                    <span style={{ color: "#2196f3" }}>
                      not registered
                      <br />
                    </span>
                  ) : (
                    <span style={{ color: "#4caf50" }}>
                      {user.ui_status?.registration}
                      <br />
                    </span>
                  )}

                  {/* حالة الحساب */}
                  {isSuspended ? (
                    <span style={{ color: "#ff9800" }}>
                      suspend
                      <br />
                    </span>
                  ) : (
                    <span style={{ color: "#4caf50" }}>
                      enabled
                      <br />
                    </span>
                  )}

                  {/* تواريخ الصلاحية */}
                  {isExpired ? (
                    <span style={{ color: "#f44336", fontWeight: "bold" }}>
                      {user.ui_status?.expired_on}
                    </span>
                  ) : (
                    <>
                      {user.ui_status?.valid_from && (
                        <span style={{ color: "#4caf50", fontWeight: "bold" }}>
                          {user.ui_status?.valid_from}
                          <br />
                        </span>
                      )}
                      {user.ui_status?.valid_until && (
                        <span style={{ color: "#009cad", fontWeight: "bold" }}>
                          {user.ui_status?.valid_until}
                        </span>
                      )}
                    </>
                  )}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
