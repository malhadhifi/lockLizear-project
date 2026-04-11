import React from "react";
import styles from "../../pages/UserDetailPage.module.css";

export default function CustomerAccountDetails({ form, cust, handleChange }) {
  return (
    <>
      {/* قسم البيانات الأساسية */}
      <div className={styles.formWrapper}>
        <div className={"form-row " + styles.rowStyle}>
          <div className={"form-label-col " + styles.labelColStyle}>Name</div>
          <div className={"form-input-col " + styles.inputColStyle}>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              className={styles.inputStyle}
            />
          </div>
        </div>

        <div className={"form-row " + styles.rowStyle}>
          <div className={"form-label-col " + styles.labelColStyle}>Email</div>
          <div className={"form-input-col " + styles.inputColStyle}>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              className={styles.inputStyle}
            />
          </div>
        </div>

        <div className={"form-row " + styles.rowStyle}>
          <div className={"form-label-col " + styles.labelColStyle}>
            Company
          </div>
          <div className={"form-input-col " + styles.inputColStyle}>
            <input
              type="text"
              name="company"
              value={form.company}
              onChange={handleChange}
              className={styles.inputStyle}
            />
          </div>
        </div>

        <div className={"form-row " + styles.rowStyle}>
          <div className={"form-label-col " + styles.labelColStyle}>Notes</div>
          <div className={"form-input-col " + styles.inputColStyle}>
            <textarea
              name="notes"
              value={form.notes}
              onChange={handleChange}
              className={styles.inputStyle}
              style={{ resize: "vertical", minHeight: 60 }}
            />
          </div>
        </div>
      </div>

      {/* قسم تفاصيل الحساب (الحالة والتواريخ) */}
      <div className={styles.sectionHeaderStyle}>Account Details</div>

      <div className={styles.formWrapper}>
        <div className={"form-row " + styles.rowInfoStyle}>
          <div className={"form-label-col " + styles.labelInfoStyle}>ID</div>
          <div>{cust?.id || "-"}</div>
        </div>

        {/* حقل الحالة (نص صريح فقط بدون أزرار) */}
        <div className={"form-row " + styles.rowInfoStyle}>
          <div className={"form-label-col " + styles.labelInfoStyle}>
            Status
          </div>
          <div style={{ display: "flex", alignItems: "center" }}>
            <span
              style={{
                fontWeight: "bold",
                color: cust?.status === "enabled" ? "#4caf50" : "#f44336",
              }}
            >
              {cust?.status === "enabled" ? "enabled" : "suspended"}
            </span>
          </div>
        </div>

        <div className={"form-row " + styles.rowInfoStyle}>
          <div className={"form-label-col " + styles.labelInfoStyle}>
            Registered
          </div>
          <div style={{ color: "#4caf50" }} dir="ltr">
            {cust?.registered || "-"}
          </div>
        </div>

        <div className={"form-row " + styles.rowStyle}>
          <div className={"form-label-col " + styles.labelColStyle}>
            Start Date
          </div>
          <div className={"form-input-col " + styles.inputColStyle}>
            <input
              type="text"
              disabled
              value={cust?.start_date ? cust.start_date.split(" ")[0] : "-"}
              className={`${styles.inputStyle} ${styles.inputStyleDisabled}`}
              style={{ width: 120 }}
              dir="ltr"
            />
          </div>
        </div>

        {/* حقل تاريخ الانتهاء وتحته مباشرة خيار Never expires */}
        <div className={"form-row " + styles.rowStyle}>
          <div className={"form-label-col " + styles.labelColStyle}>
            Valid until
          </div>
          <div
            className={"form-input-col " + styles.inputColStyle}
            style={{ display: "flex", flexDirection: "column" }}
          >
            {form.neverExpires ? (
              <input
                type="text"
                disabled
                value="Never"
                className={`${styles.inputStyle} ${styles.inputStyleDisabled}`}
                style={{ width: 140 }}
                dir="ltr"
              />
            ) : (
              <input
                type="date"
                name="validUntil"
                value={form.validUntil}
                onChange={handleChange}
                required
                className={styles.inputStyle}
                style={{ width: 140 }}
                dir="ltr"
              />
            )}

            {/* تم إنزال الخيار أسفل الحقل بمسافة أنيقة */}
            <div className={styles.checkboxRow} style={{ marginTop: "8px" }}>
              <input
                type="checkbox"
                name="neverExpires"
                checked={form.neverExpires}
                onChange={handleChange}
                id="neverExp"
              />
              <label
                htmlFor="neverExp"
                className={styles.checkboxLabel}
                style={{
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "5px",
                }}
              >
                Never expires
              </label>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
