import React, { createContext, useContext, useState, useEffect } from 'react';
import { getProfile } from '../services/api';

interface AuthContextProps {
  user: any;
  setUser: React.Dispatch<React.SetStateAction<any>>;
  setToken: React.Dispatch<React.SetStateAction<any>>;
  logout: React.Dispatch<React.SetStateAction<any>>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextProps>({
  user: null,
  setUser: () => {},
  setToken: () => {},
  logout: () => {},
  loading: true,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));

  useEffect(() => {
    fetchProfile(token);
  }, [token]);

  const fetchProfile = async (token: string | null) => {
    if (!token) {
      setLoading(false);
      return;
    }
    localStorage.setItem('token', token);
    try {
      const response = await getProfile();
      setUser(response.data);
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setToken(null);
  }

  return (
    <AuthContext.Provider value={{ user, setUser, setToken, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
