import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Dashboard from './components/dashboard/Dashboard';
import LoginForm from './components/auth/LoginForm';
import RegisterForm from './components/auth/RegisterForm';
import EmailVerificationForm from './components/auth/EmailVerificationForm';
import ForgotPasswordForm from './components/auth/ForgotPasswordForm';
import ResetPasswordForm from './components/auth/ResetPasswordForm';

// Main App Component
const App = () => {
  const [currentView, setCurrentView] = useState('login');
  const [resetToken, setResetToken] = useState('');
  const [verificationEmail, setVerificationEmail] = useState('');

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    if (token) {
      setResetToken(token);
      setCurrentView('reset');
    }
  }, []);

  const handleSwitchToEmailVerification = (email) => {
    setVerificationEmail(email);
    setCurrentView('emailVerification');
  };

  return (
    <AuthProvider>
      <AuthContent 
        currentView={currentView} 
        setCurrentView={setCurrentView}
        resetToken={resetToken}
        verificationEmail={verificationEmail}
        onSwitchToEmailVerification={handleSwitchToEmailVerification}
      />
    </AuthProvider>
  );
};

const AuthContent = ({ currentView, setCurrentView, resetToken, verificationEmail, onSwitchToEmailVerification }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (user) {
    return <Dashboard />;
  }

  const renderCurrentView = () => {
    switch (currentView) {
      case 'register':
        return (
          <RegisterForm 
            onSwitchToLogin={() => setCurrentView('login')}
            onSwitchToEmailVerification={onSwitchToEmailVerification}
          />
        );
      case 'forgot':
        return (
          <ForgotPasswordForm 
            onBackToLogin={() => setCurrentView('login')} 
          />
        );
      case 'reset':
        return (
          <ResetPasswordForm 
            token={resetToken}
            onBackToLogin={() => setCurrentView('login')} 
          />
        );
      case 'emailVerification':
        return (
          <EmailVerificationForm
            email={verificationEmail}
            onResendVerification={() => {}}
            onBackToLogin={() => setCurrentView('login')}
          />
        );
      default:
        return (
          <LoginForm 
            onSwitchToRegister={() => setCurrentView('register')}
            onSwitchToForgotPassword={() => setCurrentView('forgot')}
            onSwitchToEmailVerification={onSwitchToEmailVerification}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
      {renderCurrentView()}
    </div>
  );
};

export default App;