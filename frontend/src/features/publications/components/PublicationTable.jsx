import { useNavigate } from 'react-router-dom'

const PublicationTable = ({ publications, selected, onToggleSelect, onToggleAll, onDelete }) => {
  const navigate = useNavigate()

  return (
    <div style={{ overflowX: 'auto' }}>
      <table className="drm-table">
        <thead>
          <tr>
            <th style={{ width: 40 }}>
              <input
                type="checkbox"
                className="form-check-input"
                checked={selected.length === publications.length && publications.length > 0}
                onChange={onToggleAll}
              />
            </th>
            <th>ID</th>
            <th>اسم المنشور</th>
            <th>الوصف</th>
            <th>Obey تاريخ البدء</th>
            <th>العملاء</th>
            <th>المستندات</th>
            <th>تاريخ الإضافة</th>
            <th>الإجراءات</th>
          </tr>
        </thead>
        <tbody>
          {publications.length === 0 ? (
            <tr>
              <td colSpan={9}>
                <div className="empty-state">
                  <i className="bi bi-collection" />
                  <h5>لم يتم العثور على منشورات</h5>
                  <p>حاول تعديل البحث أو الفلاتر</p>
                </div>
              </td>
            </tr>
          ) : publications.map(pub => (
            <tr key={pub.id}>
              <td>
                <input
                  type="checkbox"
                  className="form-check-input"
                  checked={selected.includes(pub.id)}
                  onChange={() => onToggleSelect(pub.id)}
                />
              </td>
              <td>
                <span style={{ fontWeight: 700, color: 'var(--primary)', fontSize: 13 }}>
                  #{pub.id}
                </span>
              </td>
              <td>
                <div className="d-flex align-items-center gap-2">
                  <div style={{
                    width: 34, height: 34, borderRadius: 10,
                    background: '#eef2ff', display: 'flex', alignItems: 'center',
                    justifyContent: 'center', flexShrink: 0
                  }}>
                    <i className="bi bi-collection-fill" style={{ color: 'var(--primary)', fontSize: 14 }} />
                  </div>
                  <span style={{ fontWeight: 600, fontSize: 13 }}>{pub.name}</span>
                </div>
              </td>
              <td>
                <span style={{ color: '#6b7280', fontSize: 13, maxWidth: 200, display: 'inline-block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {pub.description}
                </span>
              </td>
              <td>
                {pub.obeyStartDate ? (
                  <span className="badge rounded-pill px-3 py-1 badge-active">
                    <i className="bi bi-check-circle-fill me-1" style={{ fontSize: 9 }} />نعم
                  </span>
                ) : (
                  <span className="badge rounded-pill px-3 py-1 badge-pending">
                    <i className="bi bi-x-circle-fill me-1" style={{ fontSize: 9 }} />لا
                  </span>
                )}
              </td>
              <td>
                <button
                  className="btn btn-sm px-0"
                  style={{ color: 'var(--primary)', fontWeight: 700, fontSize: 13, background: 'none', border: 'none' }}
                  onClick={() => navigate(`/publications/${pub.id}/edit`, { state: { tab: 'customers' } })}
                  title="عرض العملاء"
                >
                  <i className="bi bi-people me-1" style={{ fontSize: 12 }} />
                  {pub.customersCount}
                </button>
              </td>
              <td>
                <button
                  className="btn btn-sm px-0"
                  style={{ color: '#2dc653', fontWeight: 700, fontSize: 13, background: 'none', border: 'none' }}
                  onClick={() => navigate(`/publications/${pub.id}/edit`, { state: { tab: 'documents' } })}
                  title="عرض المستندات"
                >
                  <i className="bi bi-file-earmark-text me-1" style={{ fontSize: 12 }} />
                  {pub.docsCount}
                </button>
              </td>
              <td style={{ color: '#6b7280', fontSize: 12 }}>{pub.createdAt}</td>
              <td>
                <div className="d-flex gap-1">
                  <button
                    className="btn btn-sm"
                    style={{ background: '#e8f0ff', color: '#4361ee', borderRadius: 8, padding: '4px 10px' }}
                    onClick={() => navigate(`/publications/${pub.id}/edit`)}
                    title="تعديل"
                  >
                    <i className="bi bi-pencil" />
                  </button>
                  <button
                    className="btn btn-sm"
                    style={{ background: '#fdecea', color: '#e63946', borderRadius: 8, padding: '4px 10px' }}
                    onClick={() => onDelete(pub.id)}
                    title="حذف"
                  >
                    <i className="bi bi-trash" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default PublicationTable
