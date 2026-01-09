import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user from localStorage on mount
  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');

    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = (userData, authToken) => {
    setUser(userData);
    setToken(authToken);
    localStorage.setItem('token', authToken);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  const value = {
    user,
    token,
    login,
    logout,
    isAuthenticated: !!user,
    isSuperAdmin: user?.role?.trim().toLowerCase() === 'super_admin',
    isPropertyManager: user?.role?.trim().toLowerCase() === 'property_manager',
    isVendor: user?.role?.trim().toLowerCase() === 'vendor',
    isTenant: user?.role?.trim().toLowerCase() === 'tenant',
    isPropertyOwner: user?.role?.trim().toLowerCase() === 'property_owner',
    hasRole: (role) => user?.role === role,
    hasPermission: (permission) => {
      if (!user) return false;
      if (user.role === 'super_admin') return true;
      return user.permissions?.[permission] === true;
    },
    loading
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
