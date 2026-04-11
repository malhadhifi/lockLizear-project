import React from "react";
import styles from "../../pages/UserDetailPage.module.css";

export default function CustomerLicensesInfo({
  form,
  handleChange,
  handleDownloadLicense,
  isDownloading,
  onOpenDeviceModal,
}) {
  return (
    <>
      <div className={styles.sectionHeaderStyle}>Licenses Information</div>

      <div className={styles.formWrapper}>
        <div className={"form-row " + styles.rowStyle}>
          <div className={"form-label-col " + styles.labelColStyle}>
            Licenses
          </div>
          <div className={"form-input-col " + styles.inputColStyle}>
            <input
              type="number"
              name="licenses"
              value={form.licenses}
              onChange={handleChange}
              min={1}
              className={styles.inputStyle}
              style={{ width: 60 }}
            />
          </div>
        </div>

        <div className={"form-row " + styles.rowStyle}>
          <div className={"form-label-col " + styles.labelColStyle}>
            License
          </div>
          <div
            className={styles.inputColStyle}
            style={{ display: "flex", flexDirection: "column", gap: 6 }}
          >
            <a
              href="#"
              onClick={handleDownloadLicense}
              className={styles.actionLinkStyle}
              style={{
                opacity: isDownloading ? 0.5 : 1,
                pointerEvents: isDownloading ? "none" : "auto",
              }}
            >
              <i
                className={`bi ${isDownloading ? "bi-hourglass-split" : "bi-download"}`}
                style={{ marginRight: 6 }}
              />
              {isDownloading ? "Downloading..." : "Save to file"}
            </a>

            <a
              href="#"
              className={styles.actionLinkStyle}
              onClick={(e) => e.preventDefault()}
            >
              <i className="bi bi-envelope" style={{ marginRight: 6 }} /> Send
              email
            </a>

            <div className={styles.checkboxRow} style={{ marginTop: 4 }}>
              <input
                type="checkbox"
                name="resendLicenseEmail"
                checked={form.resendLicenseEmail}
                onChange={handleChange}
                id="resendLic"
              />
              <label
                htmlFor="resendLic"
                className={styles.checkboxLabel}
                style={{ cursor: "pointer" }}
              >
                Resend license email
              </label>
            </div>
          </div>
        </div>

        <div className={"form-row " + styles.rowStyle}>
          <div className={"form-label-col " + styles.labelColStyle}>Device</div>
          <div
            className={styles.inputColStyle}
            style={{ display: "flex", alignItems: "center" }}
          >
            <a
              href="#"
              className={styles.actionLinkStyle}
              onClick={(e) => {
                e.preventDefault();
                onOpenDeviceModal();
              }}
            >
              <i className="bi bi-phone" style={{ marginRight: 6 }} /> Suspend
              or Activate
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
