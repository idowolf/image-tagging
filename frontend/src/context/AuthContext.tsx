import React, { createContext, useContext, useState, useEffect } from 'react';
import { getProfile } from '../routes/user';

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

/**
 * Provides authentication context for the application.
 * @param children - The child components to be wrapped by the AuthProvider.
 */
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));

  /**
   * Fetches the user profile using the provided token.
   * @param token - The authentication token.
   */
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

  /**
   * Logs out the user by removing the token and resetting the user state.
   */
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setToken(null);
  }

  useEffect(() => {
    fetchProfile(token);
  }, [token]);

  return (
    <AuthContext.Provider value={{ user, setUser, setToken, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
