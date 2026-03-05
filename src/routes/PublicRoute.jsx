import { Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

function PublicRoute({ children }) {
  const { user, isAuthenticated } = useSelector((state) => state.auth)

  if (isAuthenticated && user) {
    return <Navigate to="/dashboard" replace />
  }

  return children
}

export default PublicRoute
