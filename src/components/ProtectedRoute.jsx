import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAppContext } from '../utils/AppContext.jsx'

const ProtectedRoute = () => {
  const { token } = useAppContext()
  const location = useLocation()

  if (!token) {
    return <Navigate to="/" replace state={{ from: location }} />
  }

  return <Outlet />
}

export default ProtectedRoute
