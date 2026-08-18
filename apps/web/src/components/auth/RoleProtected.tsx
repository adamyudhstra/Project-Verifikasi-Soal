import type { ReactNode } from 'react';
import { useAuthStore } from '../../lib/store';
import type { Role } from '../../types';

interface RoleProtectedProps {
  allowedRoles: Role[];
  children: ReactNode;
  fallback?: ReactNode;
}

export const RoleProtected = ({ allowedRoles, children, fallback = null }: RoleProtectedProps) => {
  const user = useAuthStore((state) => state.user);

  if (!user || !allowedRoles.includes(user.role)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};
