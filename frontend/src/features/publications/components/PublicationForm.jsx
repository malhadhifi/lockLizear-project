import { useState, useEffect } from 'react'

const PublicationForm = ({ initialData, onSubmit, onCancel, isEditing }) => {
  const [form, setForm] = useState({
    name: '',
    description: '',
    obeyStartDate: false,
  })

  useEffect(() => {
    if (initialData) {
      setForm({
        name: initialData.name || '',
        description: initialData.description || '',
        obeyStartDate: initialData.obeyStartDate || false,
      })
    }
  }, [initialData])

  const handleChange = (field, value) => {
    setForm(f => ({ ...f, [field]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.name.trim()) return
    onSubmit(form)
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="drm-card">
        <div className="card-header">
          <h5>
            <i className="bi bi-collection-fill me-2 text-primary" />
            {isEditing ? 'تعديل المنشور' : 'إضافة منشور جديد'}
          </h5>
        </div>
        <div className="card-body">
          {/* اسم المنشور */}
          <div className="mb-4">
            <label className="drm-label">
              اسم المنشور <span style={{ color: '#e63946' }}>*</span>
            </label>
            <input
              type="text"
              className="form-control drm-input"
              placeholder="أدخل اسم المنشور (الحد الأقصى 64 حرفاً)"
              maxLength={64}
              value={form.name}
              onChange={e => handleChange('name', e.target.value)}
              required
            />
            <small className="text-muted" style={{ fontSize: 11 }}>
              {form.name.length}/64 حرفاً
            </small>
          </div>

          {/* الوصف */}
          <div className="mb-4">
            <label className="drm-label">الوصف</label>
            <textarea
              className="form-control drm-input"
              placeholder="أدخل وصفاً للمنشور..."
              rows={4}
              value={form.description}
              onChange={e => handleChange('description', e.target.value)}
              style={{ resize: 'vertical' }}
            />
          </div>

          {/* Obey Customer Start Date */}
          <div className="mb-4">
            <div className="d-flex align-items-center gap-3 p-3 rounded-3"
              style={{ background: '#f8f9fa', border: '1px solid var(--border-color)' }}>
              <div className="form-check form-switch m-0">
                <input
                  type="checkbox"
                  className="form-check-input"
                  role="switch"
                  id="obeyStartDate"
                  checked={form.obeyStartDate}
                  onChange={e => handleChange('obeyStartDate', e.target.checked)}
                  style={{ width: 44, height: 22 }}
                />
              </div>
              <div>
                <label className="drm-label mb-0" htmlFor="obeyStartDate" style={{ cursor: 'pointer' }}>
                  الالتزام بتاريخ بدء العميل
                </label>
                <small className="d-block text-muted" style={{ fontSize: 11 }}>
                  عند التفعيل، لن يتمكن العميل من الوصول إلا بعد تاريخ بدايته المحدد
                </small>
              </div>
            </div>
          </div>
        </div>

        {/* أزرار */}
        <div className="card-body border-top d-flex justify-content-end gap-2">
          <button type="button" className="btn btn-outline-drm" onClick={onCancel}>
            <i className="bi bi-x-lg me-2" />إلغاء
          </button>
          <button type="submit" className="btn btn-primary-drm" disabled={!form.name.trim()}>
            <i className={`bi ${isEditing ? 'bi-check-lg' : 'bi-plus-lg'} me-2`} />
            {isEditing ? 'حفظ التعديلات' : 'إضافة المنشور'}
          </button>
        </div>
      </div>
    </form>
  )
}

export default PublicationForm
