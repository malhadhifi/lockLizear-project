// ===== تبويب صلاحيات المنشورات =====
const PublicationsTab = ({ publicationAccess, onUpdate, onSave }) => {
  const togglePublication = (pubId) => {
    const updated = publicationAccess.map(pub =>
      pub.id === pubId 
        ? { ...pub, granted: !pub.granted }
        : pub
    )
    onUpdate(updated)
  }
  
  return (
    <div>
      <div className="drm-card">
        <div className="card-header">
          <h5>
            <i className="bi bi-collection-fill me-2 text-success" />
            صلاحيات المنشورات
          </h5>
          <span className="badge rounded-pill px-3 py-2" style={{ background: '#e6f9ed', color: '#1a8a3c' }}>
            {publicationAccess.filter(p => p.granted).length} / {publicationAccess.length} مفعّل
          </span>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table className="drm-table">
            <thead>
              <tr>
                <th style={{ width: '40px' }}></th>
                <th>اسم المنشور</th>
                <th style={{ width: '120px' }}>عدد الفيديوهات</th>
                <th style={{ width: '140px' }}>الحالة</th>
              </tr>
            </thead>
            <tbody>
              {publicationAccess.length === 0 ? (
                <tr>
                  <td colSpan={4}>
                    <div className="empty-state">
                      <i className="bi bi-collection" />
                      <h5>لا توجد منشورات</h5>
                      <p>لم يتم إضافة منشورات بعد</p>
                    </div>
                  </td>
                </tr>
              ) : publicationAccess.map((pub) => (
                <tr key={pub.id}>
                  <td>
                    <input
                      className="form-check-input"
                      type="checkbox"
                      checked={pub.granted}
                      onChange={() => togglePublication(pub.id)}
                    />
                  </td>
                  <td>
                    <div className="d-flex align-items-center gap-2">
                      <i className="bi bi-collection-fill" style={{ fontSize: '18px', color: '#7c3aed' }} />
                      <span style={{ fontWeight: 600, fontSize: '13px' }}>{pub.title}</span>
                    </div>
                  </td>
                  <td>
                    <span className="badge rounded-pill px-2 py-1" style={{ background: '#f0e8ff', color: '#7c3aed' }}>
                      {pub.videos} فيديو
                    </span>
                  </td>
                  <td>
                    {pub.granted ? (
                      <span className="badge rounded-pill px-3 py-1 badge-active">
                        <i className="bi bi-check-circle me-1" style={{ fontSize: '10px' }} />
                        مفعّل
                      </span>
                    ) : (
                      <span className="text-muted" style={{ fontSize: '12px' }}>غير مفعّل</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="mt-4 d-flex gap-2">
        <button className="btn btn-primary-drm" onClick={onSave}>
          <i className="bi bi-check-circle me-2" />
          حفظ صلاحيات المنشورات ({publicationAccess.filter(p => p.granted).length} مفعّل)
        </button>
        <button className="btn btn-outline-drm">إلغاء التغييرات</button>
      </div>
    </div>
  )
}

export default PublicationsTab
