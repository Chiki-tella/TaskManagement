import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    // Try to fetch current user or tasks to see if we're authenticated
    checkSession();
  }, []);

  const checkSession = async () => {
    try {
      // Fetch the authenticated user's profile
      const res = await fetch('/api/users/me');
      if (res.ok) {
        const data = await res.json();
        setIsAuthenticated(true);
        setUserProfile(data);
      } else {
        setIsAuthenticated(false);
      }
    } catch (e) {
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    const formData = new URLSearchParams();
    formData.append('username', email);
    formData.append('password', password);

    const res = await fetch('/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData,
      redirect: 'manual' // so we don't auto-follow redirect to "/"
    });

    // Spring Security formLogin usually returns 302 to '/' on success
    if (res.type === 'opaqueredirect' || res.status === 302 || res.ok) {
      // Let's verify by checking session
      const verify = await fetch('/api/users/me');
      if (verify.ok) {
        const data = await verify.json();
        setIsAuthenticated(true);
        setUserProfile(data);
        return true;
      }
    }
    return false;
  };

  const register = async (name, email, password) => {
    const res = await fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
    });
    return res.ok;
  };

  const logout = async () => {
    await fetch('/api/logout', { method: 'POST' }); // Spring Security default logout
    setIsAuthenticated(false);
    setUserProfile(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, loading, login, register, logout, userProfile, checkSession }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
