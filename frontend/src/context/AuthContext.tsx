import React, { createContext, useContext, useState, useEffect } from 'react';
import { getProfile } from '../services/api';

interface AuthContextProps {
  user: any;
  setUser: React.Dispatch<React.SetStateAction<any>>;
  setToken: React.Dispatch<React.SetStateAction<any>>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextProps>({
  user: null,
  setUser: () => {},
  setToken: () => {},
  loading: true,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }
    localStorage.setItem('token', token);
    const fetchProfile = async () => {
      try {
        const response = await getProfile();
        setUser(response.data);
        if (response.data.fullName && response.data.department && response.data.team && response.data.role) {
        }
      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [token]);

  useEffect(() => {
    console.log("User: ", user);
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, setUser, setToken, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
