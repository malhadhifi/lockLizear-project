// ===== تبويب الخصائص (Properties Tab) =====
import { useState } from "react";

const PropertiesTab = ({ properties, onUpdate, onSave }) => {
  // ===== Local State للـ IP Tags =====
  const [ipInput, setIpInput] = useState("");
  const [countryInput, setCountryInput] = useState("");

  // ===== Countries List =====
  const countries = [
    "اليمن",
    "السعودية",
    "الإمارات",
    "قطر",
    "الكويت",
    "عمان",
    "مصر",
    "الأردن",
    "لبنان",
    "العراق",
    "السودان",
  ];

  // ===== إضافة IP جديد =====
  const addIp = () => {
    if (ipInput.trim() && !properties.ipRestrictions.includes(ipInput.trim())) {
      const newIps = [...properties.ipRestrictions, ipInput.trim()];
      onUpdate({ ipRestrictions: newIps });
      setIpInput("");
    }
  };

  // ===== حذف IP =====
  const removeIp = (ip) => {
    const newIps = properties.ipRestrictions.filter((i) => i !== ip);
    onUpdate({ ipRestrictions: newIps });
  };

  // ===== إضافة دولة =====
  const addCountry = () => {
    if (
      countryInput.trim() &&
      !properties.countryRestrictions.includes(countryInput.trim())
    ) {
      const newCountries = [
        ...properties.countryRestrictions,
        countryInput.trim(),
      ];
      onUpdate({ countryRestrictions: newCountries });
      setCountryInput("");
    }
  };

  // ===== حذف دولة =====
  const removeCountry = (country) => {
    const newCountries = properties.countryRestrictions.filter(
      (c) => c !== country,
    );
    onUpdate({ countryRestrictions: newCountries });
  };

  return (
    <div>
      {/* ===== الحالة ===== */}
      <div className="mb-4">
        <label className="drm-label">الحالة</label>
        <select
          className="form-select drm-input"
          style={{ width: "250px" }}
          value={properties.status}
          onChange={(e) => onUpdate({ status: e.target.value })}
        >
          <option value="active">● نشط</option>
          <option value="suspend">⏸ موقوف</option>
          <option value="expired">✕ منتهي</option>
        </select>
      </div>

      {/* ===== أجهزة قصوى + تاريخ الانتهاء ===== */}
      <div className="row g-3 mb-4">
        <div className="col-md-6">
          <label className="drm-label">الحد الأقصى للأجهزة</label>
          <input
            type="number"
            className="form-control drm-input"
            min="1"
            max="10"
            value={properties.maxDevices}
            onChange={(e) => onUpdate({ maxDevices: parseInt(e.target.value) })}
          />
        </div>
        <div className="col-md-6">
          <label className="drm-label">تاريخ الانتهاء</label>
          <input
            type="date"
            className="form-control drm-input"
            value={properties.expiryDate}
            onChange={(e) => onUpdate({ expiryDate: e.target.value })}
          />
        </div>
      </div>

      {/* ===== إعدادات الأوفلاين ===== */}
      <div className="drm-card mb-4">
        <div className="card-header">
          <h5>
            <i className="bi bi-wifi-off me-2 text-primary" />
            إعدادات الوصول بدون اتصال
          </h5>
        </div>
        <div className="card-body">
          <div className="form-check form-switch mb-3">
            <input
              className="form-check-input"
              type="checkbox"
              id="offlineAccess"
              checked={properties.offlineAccess}
              onChange={(e) => onUpdate({ offlineAccess: e.target.checked })}
            />
            <label
              className="form-check-label fw-semibold"
              htmlFor="offlineAccess"
            >
              السماح بالوصول دون اتصال
            </label>
          </div>

          {properties.offlineAccess && (
            <div className="row g-3 mt-1">
              <div className="col-md-6">
                <label className="drm-label">التحقق كل (يوم)</label>
                <input
                  type="number"
                  className="form-control drm-input"
                  min="1"
                  max="90"
                  value={properties.offlineCheckinDays}
                  onChange={(e) =>
                    onUpdate({ offlineCheckinDays: parseInt(e.target.value) })
                  }
                />
              </div>
            </div>
          )}

          <div className="form-check form-switch mt-3">
            <input
              className="form-check-input"
              type="checkbox"
              id="multipleSessions"
              checked={properties.multipleSessions}
              onChange={(e) => onUpdate({ multipleSessions: e.target.checked })}
            />
            <label className="form-check-label" htmlFor="multipleSessions">
              السماح بجلسات متعددة في نفس الوقت
            </label>
          </div>
        </div>
      </div>

      {/* ===== قيود IP ===== */}
      <div className="drm-card mb-4">
        <div className="card-header">
          <h5>
            <i className="bi bi-shield-lock me-2 text-danger" />
            قيود عنوان IP
          </h5>
        </div>
        <div className="card-body">
          <div className="d-flex gap-2 mb-3">
            <input
              type="text"
              className="form-control drm-input"
              placeholder="192.168.1.100"
              value={ipInput}
              onChange={(e) => setIpInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addIp()}
            />
            <button
              className="btn btn-outline-drm"
              type="button"
              onClick={addIp}
            >
              <i className="bi bi-plus-lg me-1" />
              إضافة
            </button>
          </div>

          {/* قائمة IP الحالية */}
          <div className="d-flex flex-wrap gap-2">
            {properties.ipRestrictions.map((ip, index) => (
              <span
                key={index}
                className="badge rounded-pill px-3 py-2 d-flex align-items-center gap-2"
                style={{
                  background: "#e8f0ff",
                  color: "var(--primary)",
                  fontSize: "13px",
                }}
              >
                {ip}
                <i
                  className="bi bi-x-lg"
                  style={{ cursor: "pointer", fontSize: "10px" }}
                  onClick={() => removeIp(ip)}
                />
              </span>
            ))}
            {properties.ipRestrictions.length === 0 && (
              <span className="text-muted" style={{ fontSize: "13px" }}>
                لا توجد قيود IP حالياً
              </span>
            )}
          </div>
        </div>
      </div>

      {/* ===== قيود الدول ===== */}
      <div className="drm-card mb-4">
        <div className="card-header">
          <h5>
            <i className="bi bi-globe me-2 text-warning" />
            قيود الدول (ممنوعة)
          </h5>
        </div>
        <div className="card-body">
          <div className="d-flex gap-2 mb-3">
            <select
              className="form-select drm-input"
              value={countryInput}
              onChange={(e) => setCountryInput(e.target.value)}
            >
              <option value="">اختر دولة...</option>
              {countries.map((country) => (
                <option key={country} value={country}>
                  {country}
                </option>
              ))}
            </select>
            <button
              className="btn btn-outline-drm"
              type="button"
              onClick={addCountry}
            >
              <i className="bi bi-plus-lg me-1" />
              إضافة
            </button>
          </div>

          {/* قائمة الدول الحالية */}
          <div className="d-flex flex-wrap gap-2">
            {properties.countryRestrictions.map((country, index) => (
              <span
                key={index}
                className="badge rounded-pill px-3 py-2 d-flex align-items-center gap-2"
                style={{
                  background: "#fff3e8",
                  color: "#d4600a",
                  fontSize: "13px",
                }}
              >
                {country}
                <i
                  className="bi bi-x-lg"
                  style={{ cursor: "pointer", fontSize: "10px" }}
                  onClick={() => removeCountry(country)}
                />
              </span>
            ))}
            {properties.countryRestrictions.length === 0 && (
              <span className="text-muted" style={{ fontSize: "13px" }}>
                لا توجد قيود دول حالياً
              </span>
            )}
          </div>
        </div>
      </div>

      {/* ===== زر الحفظ ===== */}
      <div className="d-flex gap-2">
        <button className="btn btn-primary-drm flex-grow-1" onClick={onSave}>
          <i className="bi bi-check-circle-fill me-2" />
          حفظ الخصائص
        </button>
        <button className="btn btn-outline-drm">إلغاء</button>
      </div>
    </div>
  );
};

export default PropertiesTab;
