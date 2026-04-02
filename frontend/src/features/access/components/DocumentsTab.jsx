// ===== تبويب صلاحيات الملفات =====
const DocumentsTab = ({ documentAccess, onUpdate, onSave }) => {
  // ===== تبديل صلاحية ملف =====
  const toggleDocument = (docId) => {
    const updated = documentAccess.map(doc =>
      doc.id === docId 
        ? { ...doc, granted: !doc.granted }
        : doc
    )
    onUpdate(updated)
  }
  
  // ===== تحديث تاريخ انتهاء ملف =====
  const updateDocExpiry = (docId, expiry) => {
    const updated = documentAccess.map(doc =>
      doc.id === docId 
        ? { ...doc, expiry }
        : doc
    )
    onUpdate(updated)
  }
  
  return (
    <div>
      <div className="drm-card">
        <div className="card-header">
          <h5>
            <i className="bi bi-file-earmark-text-fill me-2 text-primary" />
            صلاحيات الملفات
          </h5>
          <span className="badge rounded-pill px-3 py-2" style={{ background: '#e8f0ff', color: 'var(--primary)' }}>
            {documentAccess.filter(d => d.granted).length} / {documentAccess.length} مفعّل
          </span>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table className="drm-table">
            <thead>
              <tr>
                <th style={{ width: '40px' }}></th>
                <th>اسم الملف</th>
                <th style={{ width: '80px' }}>النوع</th>
                <th style={{ width: '160px' }}>انتهاء الصلاحية</th>
              </tr>
            </thead>
            <tbody>
              {documentAccess.length === 0 ? (
                <tr>
                  <td colSpan={4}>
                    <div className="empty-state">
                      <i className="bi bi-file-earmark" />
                      <h5>لا توجد ملفات</h5>
                      <p>لم يتم إضافة ملفات بعد</p>
                    </div>
                  </td>
                </tr>
              ) : documentAccess.map((doc) => (
                <tr key={doc.id}>
                  <td>
                    <input
                      className="form-check-input"
                      type="checkbox"
                      checked={doc.granted}
                      onChange={() => toggleDocument(doc.id)}
                    />
                  </td>
                  <td>
                    <div className="d-flex align-items-center gap-2">
                      <i className={`bi ${doc.type === 'video' ? 'bi-play-circle-fill' : 'bi-file-pdf-fill'}`}
                        style={{ 
                          fontSize: '18px', 
                          color: doc.type === 'video' ? '#4361ee' : '#e63946' 
                        }} />
                      <span style={{ fontWeight: 600, fontSize: '13px' }}>{doc.title}</span>
                    </div>
                  </td>
                  <td>
                    <span className={`badge rounded-pill px-2 py-1 ${
                      doc.type === 'video' 
                        ? 'badge-active' 
                        : 'badge-expired'
                    }`}>
                      {doc.type === 'video' ? 'فيديو' : 'PDF'}
                    </span>
                  </td>
                  <td>
                    {doc.granted ? (
                      <select
                        className="form-select drm-input"
                        style={{ fontSize: '12px', padding: '4px 8px' }}
                        value={doc.expiry || ''}
                        onChange={(e) => updateDocExpiry(doc.id, e.target.value)}
                      >
                        <option value="">نفس الحساب</option>
                        <option value="2026-06-30">2026-06-30</option>
                        <option value="2026-09-30">2026-09-30</option>
                        <option value="2026-12-31">2026-12-31</option>
                      </select>
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
          حفظ صلاحيات الملفات ({documentAccess.filter(d => d.granted).length} مفعّل)
        </button>
        <button className="btn btn-outline-drm">إلغاء التغييرات</button>
      </div>
    </div>
  )
}

export default DocumentsTab
