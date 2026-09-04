import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ allowedRoles }) {
  const { user, isAuthenticated, isLoading } = useAuth();

  // If still checking localStorage on mount, we could return a spinner
  // but for a quick check, usually it's fast enough.
  if (isLoading) {
    return null; // Or a loading spinner
  }

  if (!isAuthenticated) {
    return <Navigate to="/lender/signin" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Role-based redirection if user is authenticated but not authorized
    if (user.role === 'loan_officer') {
      return <Navigate to="/lender/operations" replace />;
    }
    if (user.role === 'branch_manager') {
      return <Navigate to="/lender/command-center" replace />;
    }
    // Fallback if role is completely unknown
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
