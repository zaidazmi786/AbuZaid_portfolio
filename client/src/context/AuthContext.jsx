import { createContext, useContext, useEffect, useState } from 'react';
import api from '../api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  // Page reload par saved token verify karo
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      return;
    }
    api
      .get('/auth/me')
      .then((res) => setIsAdmin(res.data.role === 'admin'))
      .catch(() => {
        localStorage.removeItem('token');
        setIsAdmin(false);
      })
      .finally(() => setLoading(false));
  }, []);

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    localStorage.setItem('token', res.data.token);
    setIsAdmin(res.data.user.role === 'admin');
  };

  const logout = () => {
    localStorage.removeItem('token');
    setIsAdmin(false);
  };

  return (
    <AuthContext.Provider value={{ isAdmin, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
