import axios from 'axios'

const api = axios.create({
  baseURL: 'http://16.170.53.110:8080/api',
  timeout: 30000,
  headers: { 
    'Content-Type': 'application/json',
    'Accept': 'application/json' 
  },
})

api.interceptors.request.use((config) => {
  const token = sessionStorage.getItem('auth_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  (res) => res,
  (error) => {
    const isLoginRequest = error.config?.url?.includes('/login')
    if (error.response?.status === 401 && !isLoginRequest) {
      sessionStorage.removeItem('auth_token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api
