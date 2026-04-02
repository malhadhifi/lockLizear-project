import { useNavigate } from 'react-router-dom'

const PublicationCard = ({ publication }) => {
  const navigate = useNavigate()

  return (
    <div className="drm-card h-100" style={{ cursor: 'pointer', transition: 'all 0.2s' }}
      onClick={() => navigate(`/publications/${publication.id}/edit`)}
      onMouseOver={e => e.currentTarget.style.transform = 'translateY(-2px)'}
      onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}>
      <div className="card-body">
        <div className="d-flex align-items-start gap-3">
          <div style={{
            width: 44, height: 44, borderRadius: 12,
            background: '#eef2ff', display: 'flex', alignItems: 'center',
            justifyContent: 'center', flexShrink: 0
          }}>
            <i className="bi bi-collection-fill" style={{ color: 'var(--primary)', fontSize: 20 }} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <h6 className="fw-bold mb-1" style={{ fontSize: 14 }}>{publication.name}</h6>
            <p className="text-muted mb-2" style={{
              fontSize: 12, overflow: 'hidden', textOverflow: 'ellipsis',
              whiteSpace: 'nowrap', maxWidth: '100%'
            }}>
              {publication.description || 'بدون وصف'}
            </p>
            <div className="d-flex gap-3">
              <div className="d-flex align-items-center gap-1">
                <i className="bi bi-people" style={{ fontSize: 12, color: '#4361ee' }} />
                <span style={{ fontSize: 12, fontWeight: 600 }}>{publication.customersCount}</span>
                <span style={{ fontSize: 11, color: '#9ca3af' }}>عميل</span>
              </div>
              <div className="d-flex align-items-center gap-1">
                <i className="bi bi-file-earmark-text" style={{ fontSize: 12, color: '#2dc653' }} />
                <span style={{ fontSize: 12, fontWeight: 600 }}>{publication.docsCount}</span>
                <span style={{ fontSize: 11, color: '#9ca3af' }}>مستند</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="card-body border-top d-flex justify-content-between" style={{ padding: '10px 20px' }}>
        <span style={{ fontSize: 11, color: '#9ca3af' }}>{publication.createdAt}</span>
        {publication.obeyStartDate && (
          <span className="badge rounded-pill px-2 py-1 badge-active" style={{ fontSize: 10 }}>
            Obey Start Date
          </span>
        )}
      </div>
    </div>
  )
}

export default PublicationCard
