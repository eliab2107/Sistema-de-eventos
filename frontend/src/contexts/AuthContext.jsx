import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('@App:user');
    const storedToken = localStorage.getItem('@App:token');
    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      
    }
  }, []);

  const login = async (email, password) => {
    const response = await api.post('auth/login', { email, password });
    const { user: userData, token } = response.data;

    setUser(userData);
    localStorage.setItem('@App:user', JSON.stringify(userData));
    localStorage.setItem('@App:token', token);
    navigate('/dashboard');
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('@App:user');
    localStorage.removeItem('@App:token');
    navigate('/');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
