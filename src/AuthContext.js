import React, { createContext, useState, useEffect } from 'react';
import { logout as apiLogout } from './apis/auth';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [username, setUsername] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUsername = localStorage.getItem('username');
    if (storedToken && storedUsername) {
      setToken(storedToken);
      setUsername(storedUsername);
    }
  }, []);

  const login = (token, username) => {
    localStorage.setItem('token', token);
    localStorage.setItem('username', username);
    setToken(token);
    setUsername(username);
  };

  const logout = async () => {
    try {
      await apiLogout(token);
    } catch (error) {
      console.error(error.message);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('username');
      setToken(null);
      setUsername(null);
    }
  };

  return (
    <AuthContext.Provider value={{ token, username, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};