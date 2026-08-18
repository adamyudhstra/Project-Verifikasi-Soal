import { useAuthStore } from '../lib/store';
import { apiClient } from '../lib/axios';
import { LogOut } from 'lucide-react';
import { useNavigate } from 'react-router';

export const Header = () => {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await apiClient.post('/logout');
    } catch (e) {
      // ignore
    } finally {
      logout();
      navigate('/login');
    }
  };

  return (
    <header className="h-16 flex items-center justify-end px-6 border-b border-gray-200 bg-white">
      <div className="flex items-center gap-4">
        <div className="text-right hidden sm:block">
          <p className="text-sm font-medium text-gray-900">{user?.name}</p>
          <p className="text-xs text-gray-500">{user?.role}</p>
        </div>
        <button
          onClick={handleLogout}
          className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
          title="Logout"
        >
          <LogOut className="h-5 w-5" />
        </button>
      </div>
    </header>
  );
};
