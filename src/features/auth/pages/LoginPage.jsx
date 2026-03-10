import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { loginSuccess } from '../store/authSlice'
import toast from 'react-hot-toast'

const LoginPage = () => {
  const navigate  = useNavigate()
  const dispatch  = useDispatch()
  const [form, setForm]     = useState({ email: '', password: '' })
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      // ===== مؤقتاً بدون Backend =====
      await new Promise(r => setTimeout(r, 1000))
      if (form.email === 'admin@drm.com' && form.password === 'password') {
        dispatch(loginSuccess({
          token: 'mock_token_xyz_2026',
          user:  { name: 'Super Admin', email: form.email, role: 'super_admin' }
        }))
        toast.success('Welcome back, Admin! 👋')
        navigate('/dashboard')
      } else {
        toast.error('Invalid email or password')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-card">
      {/* Header */}
      <div className="auth-header">
        <div className="auth-logo">🔐</div>
        <h4 className="text-white fw-bold mb-1">DRM Admin Panel</h4>
        <p className="text-white-50 mb-0" style={{ fontSize: '13px' }}>
          Smart Content Protection System
        </p>
      </div>

      {/* Body */}
      <div className="auth-body">
        <h5 className="fw-bold mb-1" style={{ color: '#1a1d2e' }}>Sign In</h5>
        <p className="text-muted mb-4" style={{ fontSize: '13px' }}>
          Enter your credentials to access the admin panel
        </p>

        <form onSubmit={submit}>
          {/* Email */}
          <div className="mb-3">
            <label className="drm-label">Email Address</label>
            <div className="input-group">
              <span className="input-group-text"
                style={{ borderRadius: '10px 0 0 10px', background: '#f8f9fa' }}>
                <i className="bi bi-envelope text-muted" />
              </span>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handle}
                className="form-control drm-input"
                style={{ borderRadius: '0 10px 10px 0', borderLeft: 'none' }}
                placeholder="admin@drm.com"
                required
              />
            </div>
          </div>

          {/* Password */}
          <div className="mb-3">
            <label className="drm-label">Password</label>
            <div className="input-group">
              <span className="input-group-text"
                style={{ borderRadius: '10px 0 0 10px', background: '#f8f9fa' }}>
                <i className="bi bi-lock text-muted" />
              </span>
              <input
                type={showPw ? 'text' : 'password'}
                name="password"
                value={form.password}
                onChange={handle}
                className="form-control drm-input"
                style={{ borderRadius: '0', borderLeft: 'none' }}
                placeholder="••••••••"
                required
              />
              <button type="button"
                className="input-group-text"
                style={{ borderRadius: '0 10px 10px 0', background: '#f8f9fa', cursor: 'pointer' }}
                onClick={() => setShowPw(!showPw)}>
                <i className={`bi ${showPw ? 'bi-eye-slash' : 'bi-eye'} text-muted`} />
              </button>
            </div>
          </div>

          {/* Remember */}
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div className="form-check">
              <input className="form-check-input" type="checkbox" id="remember" />
              <label className="form-check-label" htmlFor="remember"
                style={{ fontSize: '13px' }}>Remember me</label>
            </div>
            <a href="#" style={{ fontSize: '13px', color: 'var(--primary)' }}>
              Forgot password?
            </a>
          </div>

          {/* Submit */}
          <button type="submit" className="btn btn-primary-drm w-100" disabled={loading}>
            {loading ? (
              <><span className="spinner-border spinner-border-sm me-2" />Signing in...</>
            ) : (
              <><i className="bi bi-box-arrow-in-right me-2" />Sign In</>
            )}
          </button>
        </form>

        {/* Demo hint */}
        <div className="mt-4 p-3 rounded-3" style={{ background: '#f8f9fa' }}>
          <p className="mb-1" style={{ fontSize: '11px', color: '#6b7280' }}>
            <i className="bi bi-info-circle me-1" />
            <strong>Demo credentials:</strong>
          </p>
          <p className="mb-0" style={{ fontSize: '11px', color: '#6b7280' }}>
            Email: admin@drm.com &nbsp;|&nbsp; Password: password
          </p>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
