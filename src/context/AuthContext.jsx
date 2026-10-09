import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';
import { connectSocket, disconnectSocket } from '../services/socket';
import { CURRENT_USER } from '../data/studentsData';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check persistent authentication on load
  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        try {
          const res = await authAPI.getMe();
          if (res.success && res.user) {
            setUser(res.user);
            connectSocket(storedToken);
          } else {
            // Token invalid or expired
            localStorage.removeItem('token');
            setToken(null);
            setUser(CURRENT_USER); // Safe demo fallback
          }
        } catch (err) {
          // If server offline or token expired, keep session graceful
          setUser(CURRENT_USER);
        }
      } else {
        // Default to demo user for exploration
        setUser(CURRENT_USER);
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (email, password) => {
    setError(null);
    try {
      const res = await authAPI.login({ email, password });
      if (res.success && res.token) {
        localStorage.setItem('token', res.token);
        setToken(res.token);
        setUser(res.user);
        connectSocket(res.token);
        return { success: true, user: res.user };
      }
      return { success: false, message: res.message || 'Login failed' };
    } catch (err) {
      const msg = err.data?.message || err.message || 'Login failed';
      setError(msg);
      return { success: false, message: msg };
    }
  };

  const register = async (userData) => {
    setError(null);
    try {
      const res = await authAPI.register(userData);
      if (res.success && res.token) {
        localStorage.setItem('token', res.token);
        setToken(res.token);
        setUser(res.user);
        connectSocket(res.token);
        return { success: true, user: res.user };
      }
      return { success: false, message: res.message || 'Registration failed' };
    } catch (err) {
      const msg = err.data?.message || err.message || 'Registration failed';
      setError(msg);
      return { success: false, message: msg };
    }
  };

  const logout = async () => {
    try {
      await authAPI.logout().catch(() => {});
    } finally {
      localStorage.removeItem('token');
      setToken(null);
      setUser(null);
      disconnectSocket();
    }
  };

  const updateProfile = async (profileData) => {
    try {
      const res = await authAPI.updateProfile(profileData);
      if (res.success && res.user) {
        setUser(res.user);
        return { success: true, user: res.user };
      }
      return { success: false, message: res.message };
    } catch (err) {
      // In local offline fallback, update state directly
      setUser(prev => ({ ...prev, ...profileData }));
      return { success: true, user: { ...user, ...profileData } };
    }
  };

  const forgotPassword = async (email) => {
    return await authAPI.forgotPassword(email);
  };

  const resetPassword = async (resetToken, newPassword) => {
    return await authAPI.resetPassword(resetToken, newPassword);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        loading,
        error,
        login,
        register,
        logout,
        updateProfile,
        forgotPassword,
        resetPassword,
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
