import React from "react";
import styles from "../../pages/UserDetailPage.module.css";

export default function CustomerManageAccess({
  cust,
  onOpenPubModal,
  onOpenDocModal,
}) {
  return (
    <>
      <div className={styles.sectionHeaderStyle}>Manage Access</div>

      <div
        className={styles.formWrapper}
        style={{ display: "flex", flexDirection: "column", gap: 10 }}
      >
        {/* رابط المنشورات مع العدد */}
        <div>
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              onOpenPubModal();
            }}
            className={styles.actionLinkStyle}
          >
            <i
              className="bi bi-journal-text"
              style={{ marginLeft: 6, marginRight: 6 }}
            />
            Manage Publication Access ({cust?.publications_count || 0})
          </a>
        </div>

        {/* رابط المستندات مع العدد */}
        <div>
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              onOpenDocModal();
            }}
            className={styles.actionLinkStyle}
          >
            <i
              className="bi bi-file-earmark-lock"
              style={{ marginLeft: 6, marginRight: 6 }}
            />
            Manage Document Access ({cust?.documents_count || 0})
          </a>
        </div>
      </div>
    </>
  );
}
