import { Navigate } from 'react-router-dom';
const PrivateRoute = ({ isAuthenticated, children }) => (isAuthenticated ? children : <Navigate to="/login" replace />);
export default PrivateRoute;
