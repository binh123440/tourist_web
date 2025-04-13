// src/context/AuthContext.js
import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Kiểm tra xem đã đăng nhập hay chưa khi tải trang
  useEffect(() => {
    const checkLoggedIn = async () => {
      if (localStorage.getItem('token')) {
        try {
          const res = await axios.get('http://localhost:5000/api/auth/me', {
            headers: {
              'x-auth-token': localStorage.getItem('token')
            }
          });
          setUser(res.data);
          setIsAuthenticated(true);
        } catch (err) {
          localStorage.removeItem('token');
          setUser(null);
          setIsAuthenticated(false);
        }
      }
      setLoading(false);
    };

    checkLoggedIn();
  }, []);

  // Đăng nhập
  const login = async (username, password) => {
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', {
        username,
        password
      });

      if (res.data.token) {
        localStorage.setItem('token', res.data.token);
        setIsAuthenticated(true);
        
        // Lấy thông tin người dùng
        const userRes = await axios.get('http://localhost:5000/api/auth/me', {
          headers: {
            'x-auth-token': res.data.token
          }
        });
        setUser(userRes.data);
        return true;
      }
    } catch (err) {
      console.error('Login error:', err.response?.data || err.message);
      return false;
    }
  };

  // Đăng xuất
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{
      isAuthenticated,
      user,
      loading,
      login,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);