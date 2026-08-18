import { useEffect } from 'react';
import { useAuthStore } from '../lib/store';
import { apiClient } from '../lib/axios';

export const useAuthHydration = () => {
  const token = useAuthStore((state) => state.token);
  const setHydrating = useAuthStore((state) => state.setHydrating);
  const setUser = useAuthStore((state) => state.setUser);
  const logout = useAuthStore((state) => state.logout);

  useEffect(() => {
    const hydrate = async () => {
      if (!token) {
        setHydrating(false);
        return;
      }

      try {
        const response = await apiClient.get('/me');
        setUser(response.data.data);
      } catch (error) {
        // Axios interceptor will handle the 401 logout, but we ensure clear here too
        logout();
      } finally {
        setHydrating(false);
      }
    };

    hydrate();
  }, [token, setHydrating, setUser, logout]);
};
