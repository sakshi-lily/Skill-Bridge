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
      const storedUserStr = localStorage.getItem('skillbridge_user');
      let fallbackUser = CURRENT_USER;
      if (storedUserStr) {
        try {
          fallbackUser = JSON.parse(storedUserStr);
        } catch {}
      }

      if (storedToken) {
        try {
          const res = await authAPI.getMe();
          if (res.success && res.user) {
            setUser(res.user);
            localStorage.setItem('skillbridge_user', JSON.stringify(res.user));
            connectSocket(storedToken);
          } else {
            // Token invalid or expired
            setUser(fallbackUser);
          }
        } catch {
          // If server offline or token expired, keep session graceful
          setUser(fallbackUser);
        }
      } else {
        // Default to stored or demo user for exploration
        setUser(fallbackUser);
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
        localStorage.setItem('skillbridge_user', JSON.stringify(res.user));
        setToken(res.token);
        setUser(res.user);
        connectSocket(res.token);
        return { success: true, user: res.user };
      }
      return { success: false, message: res.message || 'Login failed' };
    } catch (err) {
      // Graceful offline fallback if backend server is not running
      if (err.message?.includes('fetch') || err.message?.includes('Network') || err.message?.includes('Failed')) {
        const fallbackUser = {
          ...CURRENT_USER,
          email,
          name: email.split('@')[0],
        };
        setUser(fallbackUser);
        localStorage.setItem('skillbridge_user', JSON.stringify(fallbackUser));
        return { success: true, user: fallbackUser, offline: true };
      }
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
        localStorage.setItem('skillbridge_user', JSON.stringify(res.user));
        setToken(res.token);
        setUser(res.user);
        connectSocket(res.token);
        return { success: true, user: res.user };
      }
      return { success: false, message: res.message || 'Registration failed' };
    } catch (err) {
      // Graceful offline fallback if backend server is not running
      if (err.message?.includes('fetch') || err.message?.includes('Network') || err.message?.includes('Failed')) {
        const fallbackUser = {
          _id: `user-${Date.now()}`,
          id: `user-${Date.now()}`,
          name: userData.name || 'New Student',
          email: userData.email,
          role: userData.role || 'student',
          university: userData.university || 'Stanford University',
          skills: userData.skills || [],
          bio: '',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
        };
        setUser(fallbackUser);
        localStorage.setItem('skillbridge_user', JSON.stringify(fallbackUser));
        return { success: true, user: fallbackUser, offline: true };
      }
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
      localStorage.removeItem('skillbridge_user');
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
        localStorage.setItem('skillbridge_user', JSON.stringify(res.user));
        return { success: true, user: res.user };
      }
      return { success: false, message: res.message };
    } catch {
      // In local offline fallback, update state directly and sync localStorage
      setUser(prev => {
        const updated = { ...(prev || {}), ...profileData };
        localStorage.setItem('skillbridge_user', JSON.stringify(updated));
        return updated;
      });
      return { success: true, user: { ...user, ...profileData } };
    }
  };

  const uploadAvatar = async (formDataOrFile) => {
    try {
      let body = formDataOrFile;
      if (formDataOrFile instanceof File) {
        body = new FormData();
        body.append('avatar', formDataOrFile);
      }
      const res = await authAPI.uploadAvatar(body);
      if (res.success && res.user) {
        setUser(res.user);
        localStorage.setItem('skillbridge_user', JSON.stringify(res.user));
        return { success: true, user: res.user, avatar: res.avatar };
      }
      return { success: false, message: res.message };
    } catch (err) {
      return { success: false, message: err.message };
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
        uploadAvatar,
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
