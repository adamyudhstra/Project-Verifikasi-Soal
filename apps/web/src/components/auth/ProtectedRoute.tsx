import { Navigate, Outlet } from 'react-router';
import { useAuthStore } from '../../lib/store';

export const ProtectedRoute = () => {
  const token = useAuthStore((state) => state.token);
  const isHydrating = useAuthStore((state) => state.isHydrating);

  if (isHydrating) {
    return <div className="flex items-center justify-center min-h-screen">Loading session...</div>;
  }

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};
