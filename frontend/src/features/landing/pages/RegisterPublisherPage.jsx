import { useState, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { registerPublisher } from '../../../services/publisherAuthService'
import toast from 'react-hot-toast'

const INITIAL_FORM = {
  name: '',
  email: '',
  password: '',
  password_confirmation: '',
  company: '',
  phone: '',
  country: '',
}

export default function RegisterPublisherPage() {
  const navigate = useNavigate()
  const [form, setForm]       = useState(INITIAL_FORM)
  const [loading, setLoading] = useState(false)
  const [showPw, setShowPw]   = useState(false)
  const [errors, setErrors]   = useState({})

  // useCallback يمنع إعادة رسم الدالة في كل render — كان هذا سبب مشكلة الحقول
  const handle = useCallback((e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    setErrors(prev => prev[name] ? { ...prev, [name]: null } : prev)
  }, [])

  const validate = () => {
    const e = {}
    if (!form.name.trim())                              e.name = 'الاسم مطلوب'
    if (!form.email.trim())                             e.email = 'البريد الإلكتروني مطلوب'
    if (form.password.length < 8)                      e.password = 'كلمة المرور 8 أحرف على الأقل'
    if (form.password !== form.password_confirmation)  e.password_confirmation = 'كلمتا المرور غير متطابقتين'
    if (!form.company.trim())                          e.company = 'اسم الشركة مطلوب'
    return e
  }

  const submit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setLoading(true)
    try {
      const res = await registerPublisher(form)
      if (res?.code === 1050 || res?.success) {
        toast.success('🎉 تم إنشاء حسابك! تحقق من بريدك لتحميل ملف الرخصة.')
        setTimeout(() => navigate('/login'), 2200)
      } else {
        toast.error('حدث خطأ غير متوقع، حاول مجدداً.')
      }
    } catch (err) {
      const serverErrors = err.response?.data?.errors
      if (serverErrors) {
        const mapped = {}
        Object.entries(serverErrors).forEach(([k, v]) => { mapped[k] = Array.isArray(v) ? v[0] : v })
        setErrors(mapped)
        toast.error('يرجى تصحيح الأخطاء أدناه.')
      } else {
        toast.error(err.response?.data?.message || 'فشل الاتصال بالخادم.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-card" style={{ maxWidth: 520, width: '100%' }}>

      {/* الرأس */}
      <div className="auth-header">
        <div className="auth-logo">🚀</div>
        <h4 className="text-white fw-bold mb-1">إنشاء حساب ناشر</h4>
        <p className="text-white-50 mb-0" style={{ fontSize: 13 }}>
          سيُرسَل ملف الرخصة <strong>.lzpk</strong> على بريدك فور التسجيل
        </p>
      </div>

      {/* المحتوى */}
      <div className="auth-body">
        <h5 className="fw-bold mb-1" style={{ color: '#1a1d2e' }}>بيانات الحساب</h5>
        <p className="text-muted mb-4" style={{ fontSize: 13 }}>الحقول المعلمة بـ <span className="text-danger">*</span> مطلوبة</p>

        <form onSubmit={submit} noValidate>

          {/* صف 1: الاسم + الشركة */}
          <div className="row g-3 mb-3">
            <div className="col-6">
              <label className="drm-label">الاسم <span className="text-danger">*</span></label>
              <input
                type="text" name="name" value={form.name} onChange={handle}
                className={`form-control drm-input${errors.name ? ' is-invalid' : ''}`}
                placeholder="أحمد محمد"
              />
              {errors.name && <div className="invalid-feedback">{errors.name}</div>}
            </div>
            <div className="col-6">
              <label className="drm-label">الشركة <span className="text-danger">*</span></label>
              <input
                type="text" name="company" value={form.company} onChange={handle}
                className={`form-control drm-input${errors.company ? ' is-invalid' : ''}`}
                placeholder="دار النور"
              />
              {errors.company && <div className="invalid-feedback">{errors.company}</div>}
            </div>
          </div>

          {/* البريد */}
          <div className="mb-3">
            <label className="drm-label">البريد الإلكتروني <span className="text-danger">*</span></label>
            <input
              type="email" name="email" value={form.email} onChange={handle}
              className={`form-control drm-input${errors.email ? ' is-invalid' : ''}`}
              placeholder="publisher@example.com"
            />
            {errors.email && <div className="invalid-feedback">{errors.email}</div>}
          </div>

          {/* كلمة المرور */}
          <div className="mb-3">
            <label className="drm-label">كلمة المرور <span className="text-danger">*</span></label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPw ? 'text' : 'password'}
                name="password" value={form.password} onChange={handle}
                className={`form-control drm-input${errors.password ? ' is-invalid' : ''}`}
                placeholder="8 أحرف على الأقل"
                style={{ paddingLeft: 44 }}
              />
              <button
                type="button"
                onClick={() => setShowPw(p => !p)}
                style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#8b8fa8', padding: 0, lineHeight: 1 }}
              >
                <i className={`bi ${showPw ? 'bi-eye-slash' : 'bi-eye'}`} style={{ fontSize: 16 }} />
              </button>
            </div>
            {errors.password && <div className="text-danger mt-1" style={{ fontSize: 12 }}>{errors.password}</div>}
          </div>

          {/* تأكيد كلمة المرور */}
          <div className="mb-3">
            <label className="drm-label">تأكيد كلمة المرور <span className="text-danger">*</span></label>
            <input
              type="password" name="password_confirmation" value={form.password_confirmation} onChange={handle}
              className={`form-control drm-input${errors.password_confirmation ? ' is-invalid' : ''}`}
              placeholder="أعد كتابة كلمة المرور"
            />
            {errors.password_confirmation && <div className="invalid-feedback">{errors.password_confirmation}</div>}
          </div>

          {/* صف 2: الهاتف + الدولة */}
          <div className="row g-3 mb-3">
            <div className="col-6">
              <label className="drm-label">رقم الهاتف</label>
              <input
                type="text" name="phone" value={form.phone} onChange={handle}
                className="form-control drm-input"
                placeholder="+966 5X XXX XXXX"
              />
            </div>
            <div className="col-6">
              <label className="drm-label">الدولة</label>
              <input
                type="text" name="country" value={form.country} onChange={handle}
                className="form-control drm-input"
                placeholder="Saudi Arabia"
              />
            </div>
          </div>

          {/* ملاحظة */}
          <div className="mb-4 p-3 rounded-3" style={{ background: '#e8f0ff', border: '1px solid #c3d4fd' }}>
            <p className="mb-0" style={{ fontSize: 12, color: '#3451d1' }}>
              <i className="bi bi-info-circle me-1" />
              بعد التسجيل ستستلم ملف <strong>license.lzpk</strong> على بريدك — ضروري لتفعيل تطبيق التشفير.
            </p>
          </div>

          {/* زر */}
          <button type="submit" className="btn btn-primary-drm w-100" disabled={loading}>
            {loading
              ? <><span className="spinner-border spinner-border-sm me-2" />جاري إنشاء الحساب...</>
              : <><i className="bi bi-rocket me-2" />إنشاء الحساب مجاناً</>}
          </button>

          <p className="text-center mt-3 mb-0" style={{ fontSize: 13, color: '#6b7280' }}>
            لديك حساب بالفعل؟{' '}
            <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 600 }}>تسجيل الدخول</Link>
          </p>
        </form>
      </div>
    </div>
  )
}
