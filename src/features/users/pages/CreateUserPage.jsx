// src/features/users/pages/CreateUserPage.jsx
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

const CreateUserPage = () => {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    name:'', email:'', password:'', maxDevices:3,
    expiry:'', status:'active', offlineAccess:true
  })

  // ضع هذا الـ import في أعلى الملف:
  // import { useState } from 'react'

  const submit = (e) => {
    e.preventDefault()
    toast.success('User created successfully!')
    navigate('/users')
  }

  return (
    <div>
      <div className="d-flex align-items-center gap-3 mb-4">
        <button className="btn btn-outline-drm btn-sm" onClick={() => navigate('/users')}>
          <i className="bi bi-arrow-left me-1" />Back
        </button>
        <div>
          <h4 className="fw-bold mb-0">Create New User</h4>
          <p className="text-muted mb-0" style={{ fontSize:13 }}>Add a new DRM user</p>
        </div>
      </div>

      <div className="row g-4">
        <div className="col-lg-8">
          <div className="drm-card">
            <div className="card-header"><h5>User Information</h5></div>
            <div className="card-body">
              <form onSubmit={submit}>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="drm-label">Full Name *</label>
                    <input className="form-control drm-input" placeholder="Ahmed Ali" required />
                  </div>
                  <div className="col-md-6">
                    <label className="drm-label">Email Address *</label>
                    <input type="email" className="form-control drm-input" placeholder="ahmed@email.com" required />
                  </div>
                  <div className="col-md-6">
                    <label className="drm-label">Password *</label>
                    <input type="password" className="form-control drm-input" placeholder="••••••••" required />
                  </div>
                  <div className="col-md-6">
                    <label className="drm-label">Status</label>
                    <select className="form-select drm-input">
                      <option value="active">Active</option>
                      <option value="suspended">Suspended</option>
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label className="drm-label">Max Devices</label>
                    <input type="number" className="form-control drm-input" defaultValue={3} min={1} max={10} />
                  </div>
                  <div className="col-md-6">
                    <label className="drm-label">Account Expiry Date</label>
                    <input type="date" className="form-control drm-input" />
                  </div>
                  <div className="col-12">
                    <div className="form-check form-switch">
                      <input className="form-check-input" type="checkbox" id="offline" defaultChecked />
                      <label className="form-check-label" htmlFor="offline">Enable Offline Access</label>
                    </div>
                  </div>
                  <div className="col-12 pt-2">
                    <button type="submit" className="btn btn-primary-drm me-2">
                      <i className="bi bi-check-lg me-2" />Create User
                    </button>
                    <button type="button" className="btn btn-outline-drm"
                      onClick={() => navigate('/users')}>Cancel</button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
export default CreateUserPage
