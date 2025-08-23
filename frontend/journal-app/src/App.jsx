import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Dashboard from './components/dashboard/Dashboard';
import LoginForm from './components/auth/LoginForm';
import RegisterForm from './components/auth/RegisterForm';
import EmailVerificationForm from './components/auth/EmailVerificationForm';
import ForgotPasswordForm from './components/auth/ForgotPasswordForm';
import ResetPasswordForm from './components/auth/ResetPasswordForm';

// Add the LoadingState component
const LoadingState = () => (
  <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
      <p className="text-gray-600">Loading...</p>
    </div>
  </div>
);

// Protected Route Component - Only allows authenticated users
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingState />;
  }

  // If not authenticated, redirect to login
  return user ? children : <Navigate to="/login" replace />;
};

// Public Route Component - Only allows unauthenticated users
const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingState />;
  }

  // If already authenticated, redirect to dashboard
  return user ? <Navigate to="/dashboard" replace /> : children;
};

// Enhanced Auth Forms with Navigation
const EnhancedLoginForm = () => {
  const navigate = useNavigate();
  
  return (
    <LoginForm 
      onSwitchToRegister={() => navigate('/register')}
      onSwitchToForgotPassword={() => navigate('/forgot-password')}
      onSwitchToEmailVerification={(email) => navigate('/verify-email', { state: { email } })}
    />
  );
};

const EnhancedRegisterForm = () => {
  const navigate = useNavigate();
  
  return (
    <RegisterForm 
      onSwitchToLogin={() => navigate('/login')}
      onSwitchToEmailVerification={(email) => navigate('/verify-email', { state: { email } })}
    />
  );
};

const EnhancedForgotPasswordForm = () => {
  const navigate = useNavigate();
  
  return (
    <ForgotPasswordForm 
      onBackToLogin={() => navigate('/login')}
    />
  );
};

const EnhancedResetPasswordForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get token from URL params
  const urlParams = new URLSearchParams(location.search);
  const token = urlParams.get('token') || '';
  
  return (
    <ResetPasswordForm 
      token={token}
      onBackToLogin={() => navigate('/login')}
    />
  );
};

const EnhancedEmailVerificationForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get email from navigation state or URL params
  const email = location.state?.email || '';
  
  return (
    <EmailVerificationForm
      email={email}
      onResendVerification={() => {}}
      onBackToLogin={() => navigate('/login')}
    />
  );
};

// Layout wrapper for auth pages - UPDATED
const AuthLayout = ({ children }) => (
  <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
    {children}
  </div>
);

// Main App Component
const App = () => {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Protected Routes - Only accessible when logged in */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />

          {/* Public Routes - Only accessible when NOT logged in */}
          <Route 
            path="/login" 
            element={
              <PublicRoute>
                <AuthLayout>
                  <EnhancedLoginForm />
                </AuthLayout>
              </PublicRoute>
            } 
          />
          
          <Route 
            path="/register" 
            element={
              <PublicRoute>
                <AuthLayout>
                  <EnhancedRegisterForm />
                </AuthLayout>
              </PublicRoute>
            } 
          />
          
          <Route 
            path="/forgot-password" 
            element={
              <PublicRoute>
                <AuthLayout>
                  <EnhancedForgotPasswordForm />
                </AuthLayout>
              </PublicRoute>
            } 
          />
          
          <Route 
            path="/reset-password" 
            element={
              <PublicRoute>
                <AuthLayout>
                  <EnhancedResetPasswordForm />
                </AuthLayout>
              </PublicRoute>
            } 
          />
          
          <Route 
            path="/verify-email" 
            element={
              <PublicRoute>
                <AuthLayout>
                  <EnhancedEmailVerificationForm />
                </AuthLayout>
              </PublicRoute>
            } 
          />

          {/* Default redirect */}
          <Route 
            path="/" 
            element={<Navigate to="/login" replace />} 
          />

          {/* Catch all other routes and redirect based on auth status */}
          <Route 
            path="*" 
            element={<RedirectBasedOnAuth />} 
          />
        </Routes>
      </AuthProvider>
    </Router>
  );
};

// Component to handle redirects for unknown routes - UPDATED
const RedirectBasedOnAuth = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingState />;
  }

  return user ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />;
};

export default App;