import { Navigate } from 'react-router-dom';
const RoleRoute = ({ allowed = [], role, children }) => (allowed.includes(role) ? children : <Navigate to="/" replace />);
export default RoleRoute;
