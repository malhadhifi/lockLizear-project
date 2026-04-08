import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { registerPublisher } from '../../../services/publisherAuthService'
import toast from 'react-hot-toast'

const INITIAL = {
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
  const [form, setForm]       = useState(INITIAL)
  const [loading, setLoading] = useState(false)
  const [showPw, setShowPw]   = useState(false)
  const [errors, setErrors]   = useState({})

  const handle = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: null })
  }

  // تحقق أمامي بسيط
  const validate = () => {
    const e = {}
    if (!form.name.trim())    e.name    = 'الاسم مطلوب'
    if (!form.email.trim())   e.email   = 'البريد الإلكتروني مطلوب'
    if (form.password.length < 8) e.password = 'كلمة المرور 8 أحرف على الأقل'
    if (form.password !== form.password_confirmation) e.password_confirmation = 'كلمة المرور غير متطابقة'
    if (!form.company.trim()) e.company = 'اسم الشركة مطلوب'
    return e
  }

  const submit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }

    setLoading(true)
    try {
      const res = await registerPublisher(form)
      // code 1050 = تم التسجيل بنجاح
      if (res?.code === 1050 || res?.success) {
        toast.success('🎉 تم إنشاء حسابك! تحقق من بريدك لتحميل ملف الرخصة.')
        setTimeout(() => navigate('/login'), 2000)
      } else {
        toast.error('حدث خطأ غير متوقع، حاول مجدداً.')
      }
    } catch (error) {
      const serverErrors = error.response?.data?.errors
      if (serverErrors) {
        // عرض أخطاء الـ validation من الباك إند
        const mapped = {}
        Object.entries(serverErrors).forEach(([k, v]) => { mapped[k] = Array.isArray(v) ? v[0] : v })
        setErrors(mapped)
        toast.error('يرجى تصحيح الأخطاء أدناه.')
      } else {
        toast.error(error.response?.data?.message || 'فشل الاتصال بالخادم.')
      }
    } finally {
      setLoading(false)
    }
  }

  // مكوّن حقل نموذج موحد
  const Field = ({ name, label, type = 'text', placeholder, required = false, icon }) => (
    <div className="mb-3">
      <label className="drm-label">
        {label} {required && <span className="text-danger">*</span>}
      </label>
      <div className="input-group">
        {icon && (
          <span className="input-group-text" style={{ borderRadius: '0 10px 10px 0', background: '#f8f9fa' }}>
            <i className={`bi ${icon} text-muted`} />
          </span>
        )}
        <input
          type={type}
          name={name}
          value={form[name]}
          onChange={handle}
          placeholder={placeholder}
          required={required}
          className={`form-control drm-input ${errors[name] ? 'is-invalid' : ''}`}
          style={{ borderRadius: icon ? '10px 0 0 10px' : '10px', borderRight: icon ? 'none' : undefined }}
        />
        {errors[name] && <div className="invalid-feedback">{errors[name]}</div>}
      </div>
    </div>
  )

  return (
    <div className="auth-card" style={{ maxWidth: 520 }}>

      {/* الرأس */}
      <div className="auth-header">
        <div className="auth-logo">🚀</div>
        <h4 className="text-white fw-bold mb-1">إنشاء حساب ناشر</h4>
        <p className="text-white-50 mb-0" style={{ fontSize: '13px' }}>
          ابدأ حمايةَ مستنداتك الآن — مجاناً
        </p>
      </div>

      {/* المحتوى */}
      <div className="auth-body">
        <h5 className="fw-bold mb-1" style={{ color: '#1a1d2e' }}>بيانات الحساب</h5>
        <p className="text-muted mb-4" style={{ fontSize: '13px' }}>
          سيُرسَل ملف الرخصة <strong>.lzpk</strong> على بريدك فور التسجيل
        </p>

        <form onSubmit={submit} noValidate>

          {/* صف: الاسم + الشركة */}
          <div className="row g-3 mb-0">
            <div className="col-md-6">
              <Field name="name"    label="الاسم الكامل"   icon="bi-person"   placeholder="أحمد محمد"          required />
            </div>
            <div className="col-md-6">
              <Field name="company" label="الشركة / المؤسسة" icon="bi-building" placeholder="دار النور للنشر" required />
            </div>
          </div>

          {/* البريد */}
          <Field name="email" label="البريد الإلكتروني" type="email" icon="bi-envelope" placeholder="publisher@example.com" required />

          {/* كلمة المرور */}
          <div className="mb-3">
            <label className="drm-label">كلمة المرور <span className="text-danger">*</span></label>
            <div className="input-group">
              <span className="input-group-text" style={{ borderRadius: '0 10px 10px 0', background: '#f8f9fa' }}>
                <i className="bi bi-lock text-muted" />
              </span>
              <input
                type={showPw ? 'text' : 'password'}
                name="password"
                value={form.password}
                onChange={handle}
                placeholder="8 أحرف على الأقل"
                className={`form-control drm-input ${errors.password ? 'is-invalid' : ''}`}
                style={{ borderRadius: '0', borderRight: 'none' }}
              />
              <button type="button"
                className="input-group-text"
                style={{ borderRadius: '10px 0 0 10px', background: '#f8f9fa', cursor: 'pointer' }}
                onClick={() => setShowPw(!showPw)}>
                <i className={`bi ${showPw ? 'bi-eye-slash' : 'bi-eye'} text-muted`} />
              </button>
              {errors.password && <div className="invalid-feedback d-block">{errors.password}</div>}
            </div>
          </div>

          {/* تأكيد كلمة المرور */}
          <Field name="password_confirmation" label="تأكيد كلمة المرور" type="password" icon="bi-lock-fill"
            placeholder="أعد كتابة كلمة المرور" required />

          {/* صف: الهاتف + الدولة (اختياريان) */}
          <div className="row g-3 mb-0">
            <div className="col-md-6">
              <Field name="phone"   label="رقم الهاتف" icon="bi-telephone" placeholder="+966 5X XXX XXXX" />
            </div>
            <div className="col-md-6">
              <Field name="country" label="الدولة"     icon="bi-globe"     placeholder="Saudi Arabia" />
            </div>
          </div>

          {/* ملاحظة الرخصة */}
          <div className="p-3 rounded-3 mb-4 mt-2" style={{ background: '#e8f0ff', border: '1px solid #c3d4fd' }}>
            <p className="mb-0" style={{ fontSize: '12px', color: '#3451d1' }}>
              <i className="bi bi-info-circle me-1" />
              بعد التسجيل ستستلم ملف <strong>license.lzpk</strong> على بريدك.
              هذا الملف ضروري لتفعيل تطبيق التشفير على جهازك.
            </p>
          </div>

          {/* زر التسجيل */}
          <button type="submit" className="btn btn-primary-drm w-100" disabled={loading}>
            {loading ? (
              <><span className="spinner-border spinner-border-sm me-2" />جاري إنشاء الحساب...</>
            ) : (
              <><i className="bi bi-rocket me-2" />إنشاء الحساب مجاناً</>
            )}
          </button>

          {/* رابط تسجيل الدخول */}
          <p className="text-center mt-3 mb-0" style={{ fontSize: '13px', color: '#6b7280' }}>
            لديك حساب بالفعل؟{' '}
            <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 600 }}>تسجيل الدخول</Link>
          </p>
        </form>
      </div>
    </div>
  )
}
