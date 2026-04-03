import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { loginSuccess } from '../store/authSlice'
import toast from 'react-hot-toast'
import api from '../../../lib/axios'

const LoginPage = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [form, setForm] = useState({ email: '', password: '' })
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const response = await api.post('/publisher/login', { 
        email: form.email, 
        password: form.password 
      })
      
      // Axios interceptor returns the data directly
      const resData = response;
      
      if (resData?.token) {
        sessionStorage.setItem('auth_token', resData.token)
        sessionStorage.setItem('admin_user', JSON.stringify(resData.publisher))
        
        dispatch(loginSuccess({
          token: resData.token,
          user: resData.publisher
        }))
        
        toast.success(resData?.message || 'تم تسجيل الدخول بنجاح')
        
        setTimeout(() => {
          navigate('/publications')
        }, 100)
      } else {
        toast.error('حدث خطأ غير متوقع، لم يتم استلام التوكن')
      }
    } catch (error) {
      console.error('Login error:', error)
      const errRes = error.response?.data || error.response;
      toast.error(errRes?.message || 'البريد الإلكتروني أو كلمة المرور غير صحيحة')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-card">
      {/* الرأس */}
      <div className="auth-header">
        <div className="auth-logo">🔐</div>
        <h4 className="text-white fw-bold mb-1">لوحة تحكم DRM</h4>
        <p className="text-white-50 mb-0" style={{ fontSize: '13px' }}>
          نظام حماية المحتوى الذكي
        </p>
      </div>

      {/* المحتوى */}
      <div className="auth-body">
        <h5 className="fw-bold mb-1" style={{ color: '#1a1d2e' }}>تسجيل الدخول</h5>
        <p className="text-muted mb-4" style={{ fontSize: '13px' }}>
          أدخل بيانات الاعتماد الخاصة بك للوصول إلى لوحة التحكم
        </p>

        <form onSubmit={submit}>
          {/* البريد الإلكتروني */}
          <div className="mb-3">
            <label className="drm-label">البريد الإلكتروني</label>
            <div className="input-group">
              <span className="input-group-text"
                style={{ borderRadius: '0 10px 10px 0', background: '#f8f9fa' }}>
                <i className="bi bi-envelope text-muted" />
              </span>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handle}
                className="form-control drm-input"
                style={{ borderRadius: '10px 0 0 10px', borderRight: 'none' }}
                placeholder="admin@drm.com"
                required
              />
            </div>
          </div>

          {/* كلمة المرور */}
          <div className="mb-3">
            <label className="drm-label">كلمة المرور</label>
            <div className="input-group">
              <span className="input-group-text"
                style={{ borderRadius: '0 10px 10px 0', background: '#f8f9fa' }}>
                <i className="bi bi-lock text-muted" />
              </span>
              <input
                type={showPw ? 'text' : 'password'}
                name="password"
                value={form.password}
                onChange={handle}
                className="form-control drm-input"
                style={{ borderRadius: '0', borderRight: 'none' }}
                placeholder="••••••••"
                required
              />
              <button type="button"
                className="input-group-text"
                style={{ borderRadius: '10px 0 0 10px', background: '#f8f9fa', cursor: 'pointer' }}
                onClick={() => setShowPw(!showPw)}>
                <i className={`bi ${showPw ? 'bi-eye-slash' : 'bi-eye'} text-muted`} />
              </button>
            </div>
          </div>

          {/* تذكرني */}
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div className="form-check">
              <input className="form-check-input" type="checkbox" id="remember" />
              <label className="form-check-label" htmlFor="remember"
                style={{ fontSize: '13px' }}>تذكرني</label>
            </div>
            <a href="#" style={{ fontSize: '13px', color: 'var(--primary)' }}>
              نسيت كلمة المرور؟
            </a>
          </div>

          {/* زر الدخول */}
          <button type="submit" className="btn btn-primary-drm w-100" disabled={loading}>
            {loading ? (
              <><span className="spinner-border spinner-border-sm me-2" />جاري تسجيل الدخول...</>
            ) : (
              <><i className="bi bi-box-arrow-in-right me-2" />تسجيل الدخول</>
            )}
          </button>
        </form>

        <div className="mt-4 p-3 rounded-3" style={{ background: '#f8f9fa' }}>
          <p className="mb-1" style={{ fontSize: '11px', color: '#6b7280' }}>
            <i className="bi bi-info-circle me-1" />
            <strong>بيانات الدخول للناشر (تم ربطها بالـ API):</strong>
          </p>
          <p className="mb-0" style={{ fontSize: '11px', color: '#6b7280' }}>
            البريد: golden_TlPz@test.com &nbsp;|&nbsp; الباسورد: 12345678
          </p>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
