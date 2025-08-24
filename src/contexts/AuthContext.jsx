import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiService from '../services/apiService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentRole, setCurrentRole] = useState('publisher');

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await apiService.getCurrentUser();
          setUser(response.user);
          setCurrentRole(response.user.role);
        } catch (error) {
          console.error('Token validation failed:', error);
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = (userData, token) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    setCurrentRole(userData.role);
    // Navigation will be handled automatically by the ProtectedRoute component
  };

  const logout = async () => {
    try {
      await apiService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
      setCurrentRole('publisher');
      // Navigation will be handled automatically by the PublicRoute component
    }
  };

  const switchRole = (newRole) => {
    setCurrentRole(newRole);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, currentRole, switchRole }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};