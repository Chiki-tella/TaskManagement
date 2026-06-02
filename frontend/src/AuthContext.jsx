import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Try to fetch current user or tasks to see if we're authenticated
    checkSession();
  }, []);

  const checkSession = async () => {
    try {
      // Just hitting an authenticated endpoint to see if our session cookie is valid
      const res = await fetch('/api/tasks');
      if (res.ok) {
        // We're authenticated! For this simple app, we just set a dummy user object
        // if the API doesn't return the current user details. 
        setUser({ isAuthenticated: true });
      } else {
        setUser(null);
      }
    } catch (e) {
      setUser(null);
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
      const verify = await fetch('/api/tasks');
      if (verify.ok) {
        setUser({ email, isAuthenticated: true });
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
    await fetch('/logout', { method: 'POST' }); // Spring Security default logout
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
