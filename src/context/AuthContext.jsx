import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('estatepulse_token') || '');
  const [loading, setLoading] = useState(true);
  const [demoAccounts, setDemoAccounts] = useState([]);

  // Fetch initial profile if token exists
  useEffect(() => {
    async function loadUser() {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await fetch('/api/auth/me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        if (data.success && data.data) {
          setUser(data.data);
        } else {
          // Token invalid
          localStorage.removeItem('estatepulse_token');
          setToken('');
          setUser(null);
        }
      } catch (err) {
        console.error('Failed to load authenticated user:', err);
      } finally {
        setLoading(false);
      }
    }

    loadUser();
  }, [token]);

  // Load demo users for quick tester bar
  useEffect(() => {
    async function fetchDemoUsers() {
      try {
        const res = await fetch('/api/auth/demo-users');
        const data = await res.json();
        if (data.success) {
          setDemoAccounts(data.data);
        }
      } catch (e) {
        console.warn('Could not fetch demo users', e);
      }
    }
    fetchDemoUsers();
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!data.success) {
        throw new Error(data.message || 'Login failed');
      }

      localStorage.setItem('estatepulse_token', data.data.token);
      setToken(data.data.token);
      setUser(data.data.user);
      return data.data.user;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    setLoading(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });
      const data = await res.json();
      if (!data.success) {
        const err = new Error(data.message || 'Registration failed');
        err.errors = data.errors;
        throw err;
      }

      localStorage.setItem('estatepulse_token', data.data.token);
      setToken(data.data.token);
      setUser(data.data.user);
      return data.data.user;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('estatepulse_token');
    setToken('');
    setUser(null);
  };

  const switchDemoUser = async (email, password) => {
    return await login(email, password);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        demoAccounts,
        login,
        register,
        logout,
        switchDemoUser,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
        isAgent: user?.role === 'agent',
        isCustomer: user?.role === 'customer',
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
