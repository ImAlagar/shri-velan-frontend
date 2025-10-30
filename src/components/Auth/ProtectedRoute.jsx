import { Navigate, useLocation } from 'react-router-dom';
import { authService } from '../../services/authService';

const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const location = useLocation();
  
  if (!authService.isAuthenticated()) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requireAdmin && authService.getRole() !== 'ADMIN') {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default ProtectedRoute;