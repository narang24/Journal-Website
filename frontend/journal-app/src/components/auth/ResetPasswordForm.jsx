import React, { useState } from 'react';
import { Lock, Eye, EyeOff, ArrowLeft, CheckCircle, Check, X } from 'lucide-react';
import apiService from '../../services/apiService';

const ResetPasswordForm = ({ token, onBackToLogin, onPasswordResetSuccess }) => {
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [validationErrors, setValidationErrors] = useState([]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
    setValidationErrors([]);
  };

  const getPasswordStrength = (password) => {
    if (password.length === 0) return { strength: 0, label: '', color: '' };
    if (password.length < 8) return { strength: 25, label: 'Too Short', color: 'bg-red-500' };
    
    let score = 0;
    if (password.length >= 8) score += 25;
    if (/[A-Z]/.test(password)) score += 25;
    if (/[a-z]/.test(password)) score += 25;
    if (/[0-9]/.test(password)) score += 15;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score += 10;
    
    if (score >= 90) return { strength: 100, label: 'Very Strong', color: 'bg-green-500' };
    if (score >= 70) return { strength: 75, label: 'Strong', color: 'bg-green-400' };
    if (score >= 50) return { strength: 50, label: 'Good', color: 'bg-yellow-500' };
    if (score >= 25) return { strength: 25, label: 'Fair', color: 'bg-orange-500' };
    return { strength: 0, label: 'Weak', color: 'bg-red-500' };
  };

  const validatePassword = (password) => {
    const errors = [];

    if (!password) {
      errors.push({ field: 'password', message: 'Password is required' });
      return errors;
    }

    if (password.length < 8) {
      errors.push({ field: 'password', message: 'Password must be at least 8 characters long' });
    }

    if (!/(?=.*[a-z])/.test(password)) {
      errors.push({ field: 'password', message: 'Password must contain at least one lowercase letter (a-z)' });
    }

    if (!/(?=.*[A-Z])/.test(password)) {
      errors.push({ field: 'password', message: 'Password must contain at least one uppercase letter (A-Z)' });
    }

    if (!/(?=.*\d)/.test(password)) {
      errors.push({ field: 'password', message: 'Password must contain at least one number (0-9)' });
    }

    // Optional but recommended
    if (!/(?=.*[!@#$%^&*(),.?":{}|<>])/.test(password)) {
      errors.push({ field: 'password', message: 'Password should contain at least one special character (!@#$%^&* etc.)' });
    }

    return errors;
  };

  const validateForm = () => {
    const errors = [];

    // Password validation
    const passwordErrors = validatePassword(formData.password);
    errors.push(...passwordErrors);

    // Confirm password validation
    if (!formData.confirmPassword) {
      errors.push({ field: 'confirmPassword', message: 'Please confirm your password' });
    } else if (formData.password !== formData.confirmPassword) {
      errors.push({ field: 'confirmPassword', message: 'Passwords do not match' });
    }

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');
    setValidationErrors([]);

    // Client-side validation
    const clientErrors = validateForm();
    if (clientErrors.length > 0) {
      setValidationErrors(clientErrors);
      setLoading(false);
      return;
    }

    try {
      const response = await apiService.resetPassword(token, formData.password, formData.confirmPassword);
      setMessage(response.message);
      
      // Auto-redirect to login after 3 seconds
      setTimeout(() => {
        if (onPasswordResetSuccess) {
          onPasswordResetSuccess();
        } else if (onBackToLogin) {
          onBackToLogin();
        }
      }, 3000);
      
    } catch (err) {
      if (err.message.includes('validation errors') && err.errors) {
        setValidationErrors(err.errors);
      } else {
        setError(err.message || 'Failed to reset password. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleBackToLogin = () => {
    if (onPasswordResetSuccess) {
      onPasswordResetSuccess();
    } else if (onBackToLogin) {
      onBackToLogin();
    }
  };

  const getFieldError = (fieldName) => {
    return validationErrors.find(error => error.field === fieldName);
  };

  const hasFieldError = (fieldName) => {
    return validationErrors.some(error => error.field === fieldName);
  };

  // Get password requirements with their status
  const getPasswordRequirements = () => {
    const password = formData.password;
    return [
      { label: 'At least 8 characters', met: password.length >= 8 },
      { label: 'One uppercase letter (A-Z)', met: /[A-Z]/.test(password) },
      { label: 'One lowercase letter (a-z)', met: /[a-z]/.test(password) },
      { label: 'One number (0-9)', met: /\d/.test(password) },
      { label: 'One special character (!@#$%^&* etc.)', met: /[!@#$%^&*(),.?":{}|<>]/.test(password), optional: true }
    ];
  };

  // Calculate password strength
  const currentPasswordStrength = getPasswordStrength(formData.password);

  if (message) {
    return (
      <div className="w-full max-w-lg mx-auto">
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-6 sm:p-8 relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-400/20 to-emerald-400/20 rounded-full -translate-y-16 translate-x-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-teal-400/20 to-green-400/20 rounded-full translate-y-12 -translate-x-12"></div>
          
          <div className="relative z-10 text-center space-y-6">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl shadow-lg animate-pulse">
              <CheckCircle className="w-10 h-10 text-white" />
            </div>
            
            <div>
              <h1 className="text-2xl font-bold text-green-800 mb-2">Password Reset Successful!</h1>
              <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded-xl text-sm mb-4">
                <p className="font-semibold mb-2">{message}</p>
                <p>You will be redirected to the login page in 3 seconds...</p>
              </div>
            </div>

            <button
              onClick={handleBackToLogin}
              className="inline-flex items-center px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-all duration-200 transform hover:scale-[1.02] shadow-lg font-semibold text-sm"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Continue to Sign In
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-lg mx-auto">
      <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-6 sm:p-8 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-400/20 to-teal-400/20 rounded-full -translate-y-16 translate-x-16"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-emerald-400/20 to-green-400/20 rounded-full translate-y-12 -translate-x-12"></div>
        
        <div className="relative z-10">
          {/* Reset Password Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-600 to-teal-600 rounded-2xl mb-4 shadow-lg">
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                <Lock className="w-5 h-5 text-green-600" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">New Password</h2>
            <p className="text-gray-600 text-sm">Create your new secure password</p>
          </div>

          {/* General Error Message */}
          {error && (
            <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
              {error}
            </div>
          )}

          {/* Validation Errors */}
          {validationErrors.length > 0 && (
            <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
              <p className="font-semibold mb-2">Please fix the following issues:</p>
              <div className="space-y-1 max-h-32 overflow-y-auto">
                {validationErrors.map((validationError, index) => (
                  <div key={index} className="flex items-start text-xs">
                    <span className="text-red-500 mr-2 flex-shrink-0">•</span>
                    <span className="leading-tight">{validationError.message}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              {/* Password Field */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">New Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-700 w-5 h-5" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    placeholder="Create a new password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`w-full pl-11 pr-12 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm text-sm ${
                      hasFieldError('password') ? 'border-red-300 bg-red-50' : 'border-gray-200'
                    }`}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Password Requirements */}
              {formData.password && (
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-sm font-medium text-gray-700 mb-2">Password Requirements:</p>
                  <div className="space-y-1">
                    {getPasswordRequirements().map((req, index) => (
                      <div key={index} className="flex items-center text-xs">
                        {req.met ? (
                          <Check className="w-3 h-3 text-green-500 mr-2 flex-shrink-0" />
                        ) : (
                          <X className="w-3 h-3 text-red-500 mr-2 flex-shrink-0" />
                        )}
                        <span className={`${req.met ? 'text-green-700' : 'text-red-700'} ${req.optional ? 'opacity-75' : ''}`}>
                          {req.label} {req.optional && '(recommended)'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Confirm Password Field */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-700 w-5 h-5" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    placeholder="Confirm your new password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={`w-full pl-11 pr-12 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm text-sm ${
                      hasFieldError('confirmPassword') ? 'border-red-300 bg-red-50' : 'border-gray-200'
                    }`}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                
                {/* Password Match Indicator */}
                {formData.confirmPassword && (
                  <div className="flex items-center text-sm mt-1">
                    {formData.password === formData.confirmPassword ? (
                      <>
                        <Check className="w-4 h-4 text-green-500 mr-2" />
                        <span className="text-green-600">Passwords match</span>
                      </>
                    ) : (
                      <>
                        <X className="w-4 h-4 text-red-500 mr-2" />
                        <span className="text-red-600">Passwords don't match</span>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-green-600 to-teal-600 text-white py-3 rounded-xl font-semibold hover:from-green-700 hover:to-teal-700 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:transform-none shadow-lg text-sm"
            >
              {loading ? 'Resetting Password...' : 'Reset Password'}
            </button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center">
            <div className="flex-1 border-t border-gray-200"></div>
            <span className="px-4 text-sm text-gray-500">or</span>
            <div className="flex-1 border-t border-gray-200"></div>
          </div>

          {/* Back to Login */}
          <div className="text-center">
            <button
              onClick={handleBackToLogin}
              className="inline-flex items-center text-gray-600 hover:text-gray-700 font-semibold text-sm transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Sign In
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordForm;