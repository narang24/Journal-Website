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

// Modern Enhanced Layout wrapper for auth pages
const AuthLayout = ({ children }) => (
  <div className="min-h-screen relative overflow-hidden">
    {/* Rich Modern Gradient Background */}
    <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-slate-100 to-blue-150"></div>
    
    {/* Geometric Pattern Background */}
    <div className="absolute inset-0 opacity-15">
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="grid" width="100" height="100" patternUnits="userSpaceOnUse">
            <path d="M 100 0 L 0 0 0 100" fill="none" stroke="#3B82F6" strokeWidth="1"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>
    </div>
    
    {/* Large Decorative Elements */}
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Main decorative circle - top right */}
      <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full bg-gradient-to-br from-blue-300/25 to-indigo-400/30 blur-3xl"></div>
      
      {/* Secondary circle - bottom left */}
      <div className="absolute -bottom-32 -left-32 w-[400px] h-[400px] rounded-full bg-gradient-to-tr from-slate-300/20 to-gray-400/25 blur-2xl"></div>
      
      {/* Accent circle - center */}
      <div className="absolute top-1/3 left-1/4 w-[200px] h-[200px] rounded-full bg-gradient-to-br from-indigo-200/25 to-blue-300/30 blur-xl"></div>
      
      {/* Additional depth circle */}
      <div className="absolute bottom-1/4 right-1/3 w-[300px] h-[300px] rounded-full bg-gradient-to-tl from-purple-200/20 to-blue-200/25 blur-2xl"></div>
    </div>
    
    {/* Modern Card-like Background Elements */}
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Floating card elements */}
      <div className="absolute top-20 left-10 w-32 h-20 bg-white/50 backdrop-blur-sm rounded-2xl transform rotate-12 shadow-lg"></div>
      <div className="absolute bottom-32 right-16 w-24 h-32 bg-blue-50/70 backdrop-blur-sm rounded-2xl transform -rotate-6 shadow-lg"></div>
      <div className="absolute top-1/2 left-8 w-16 h-16 bg-indigo-50/60 backdrop-blur-sm rounded-xl transform rotate-45 shadow-md"></div>
      <div className="absolute bottom-20 left-1/3 w-20 h-12 bg-slate-50/80 backdrop-blur-sm rounded-2xl transform -rotate-12 shadow-md"></div>
    </div>
    
    {/* Subtle Mesh Gradient Overlay */}
    <div 
      className="absolute inset-0 opacity-35"
      style={{
        background: `
          radial-gradient(circle at 20% 50%, rgba(59, 130, 246, 0.12) 0%, transparent 50%),
          radial-gradient(circle at 80% 20%, rgba(99, 102, 241, 0.12) 0%, transparent 50%),
          radial-gradient(circle at 40% 80%, rgba(147, 197, 253, 0.12) 0%, transparent 50%)
        `
      }}
    ></div>
    
    {/* Content */}
    <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
      <div className="w-full">
        {children}
      </div>
    </div>
    
    {/* Enhanced atmospheric effects */}
    <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white/40 to-transparent pointer-events-none"></div>
    <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-white/30 to-transparent pointer-events-none"></div>
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