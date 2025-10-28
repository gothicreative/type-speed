import React, { createContext, useState, useContext, useEffect } from 'react';
import { loginUser, registerUser, getUserStats } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    // Check if user is logged in from localStorage
    const storedUser = localStorage.getItem('speedtypeUser');
    const token = localStorage.getItem('token');
    
    if (storedUser && token) {
      const userData = JSON.parse(storedUser);
      setUser(userData);
      fetchUserStats(userData.userId);
    }
    setLoading(false);
  }, []);

  const fetchUserStats = async (userId) => {
    try {
      const data = await getUserStats(userId);
      setStats(data);
    } catch (error) {
      console.error('Error fetching user stats:', error);
    }
  };

  const login = async (credentials) => {
    try {
      const data = await loginUser(credentials);
      const userData = {
        userId: data.userId,
        username: data.username,
        subscription: data.subscription,
      };
      setUser(userData);
      localStorage.setItem('speedtypeUser', JSON.stringify(userData));
      localStorage.setItem('token', data.token);
      await fetchUserStats(data.userId);
      return { success: true };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  const register = async (userData) => {
    try {
      const data = await registerUser(userData);
      localStorage.setItem('token', data.token);
      return { success: true };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  const logout = () => {
    setUser(null);
    setStats(null);
    localStorage.removeItem('speedtypeUser');
    localStorage.removeItem('token');
  };

  const value = {
    user,
    stats,
    loading,
    login,
    register,
    logout,
    fetchUserStats,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};