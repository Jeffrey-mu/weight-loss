import { createContext, useState, useEffect } from 'react';
import request from '../utils/request';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkLoggedIn = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const res = await request.get('/auth/me');
          setUser(res.data);
        } catch (err) {
          localStorage.removeItem('token');
        }
      }
      setLoading(false);
    };
    checkLoggedIn();
  }, []);

  const login = async (account, password) => {
    const res = await request.post('/auth/login', { account, password });
    localStorage.setItem('token', res.data.token);
    const userRes = await request.get('/auth/me');
    setUser(userRes.data);
  };

  const register = async (email, phone, password, nickname) => {
    const res = await request.post('/auth/register', { email, phone, password, nickname });
    localStorage.setItem('token', res.data.token);
    const userRes = await request.get('/auth/me');
    setUser(userRes.data);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
