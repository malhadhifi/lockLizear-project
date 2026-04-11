// ===== مكون قائمة المستخدمين (اليمين) =====
import { useState } from "react";

const StatusBadge = ({ status }) => {
  const statusConfig = {
    active: { class: "badge-active", icon: "circle-fill", text: "نشط" },
    suspend: {
      class: "badge-suspend",
      icon: "pause-circle-fill",
      text: "موقوف",
    },
    expired: { class: "badge-expired", icon: "x-circle-fill", text: "منتهي" },
  };
  const config = statusConfig[status] || statusConfig.active;
  return (
    <span className={`badge rounded-pill px-2 py-1 ${config.class}`}>
      <i className={`bi bi-${config.icon} me-1`} style={{ fontSize: "8px" }} />
      {config.text}
    </span>
  );
};

const UserSelector = ({ users, selectedUserId, onUserSelect }) => {
  const [search, setSearch] = useState("");

  // ===== فلترة حسب البحث =====
  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="h-100 d-flex flex-column">
      {/* ===== شريط البحث ===== */}
      <div className="p-3 border-bottom">
        <h6 className="fw-bold mb-3 d-flex align-items-center">
          <i className="bi bi-people-fill me-2 text-primary" />
          اختر مستخدماً
        </h6>
        <div className="drm-search">
          <i className="bi bi-search" />
          <input
            type="text"
            className="form-control"
            placeholder="ابحث بالاسم أو البريد..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* ===== قائمة المستخدمين ===== */}
      <div className="flex-grow-1 overflow-auto p-2">
        {filteredUsers.length === 0 ? (
          <div className="text-center p-5">
            <i
              className="bi bi-people"
              style={{ fontSize: "40px", color: "#d1d5db" }}
            />
            <p className="text-muted mb-0 mt-2">لا توجد نتائج</p>
            <small className="text-muted">جرب تعديل البحث</small>
          </div>
        ) : (
          filteredUsers.map((user) => (
            <div
              key={user.id}
              className={`p-3 rounded-3 mb-2`}
              style={{
                border:
                  selectedUserId === user.id
                    ? "2px solid var(--primary)"
                    : "1px solid #e9ecef",
                background: selectedUserId === user.id ? "#eef2ff" : "#fff",
                cursor: "pointer",
                transition: "all 0.2s",
              }}
              onClick={() => onUserSelect(user)}
              onMouseOver={(e) => {
                if (selectedUserId !== user.id)
                  e.currentTarget.style.background = "#f8f9fa";
              }}
              onMouseOut={(e) => {
                if (selectedUserId !== user.id)
                  e.currentTarget.style.background = "#fff";
              }}
            >
              {/* اسم المستخدم + حالة */}
              <div className="d-flex align-items-start justify-content-between mb-1">
                <div
                  className="fw-semibold text-truncate"
                  style={{ fontSize: "14px" }}
                >
                  {user.name}
                </div>
                <StatusBadge status={user.status} />
              </div>

              {/* البريد الإلكتروني */}
              <div
                className="text-muted mb-2 text-truncate"
                style={{ fontSize: "12px" }}
              >
                {user.email}
              </div>

              {/* عدد الأجهزة */}
              <div
                className="text-muted d-flex align-items-center"
                style={{ fontSize: "12px" }}
              >
                <i className="bi bi-laptop me-1" />
                <span className="fw-semibold me-1">{user.devices}</span>
                <span>/ {user.maxDevices} جهاز</span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* ===== ترقيم الصفحات ===== */}
      <div className="p-3 border-top">
        <div
          className="text-muted d-flex justify-content-between align-items-center"
          style={{ fontSize: "12px" }}
        >
          <span>الصفحة 1 من {Math.ceil(users.length / 10)}</span>
          <div className="d-flex gap-1">
            <button className="btn btn-sm btn-outline-drm">السابق</button>
            <button className="btn btn-sm btn-outline-drm">التالي</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserSelector;
