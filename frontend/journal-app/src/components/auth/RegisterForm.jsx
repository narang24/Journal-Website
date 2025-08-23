import React, { useState } from 'react';
import { Eye, EyeOff, User, Mail, Lock, Shield, ArrowRight, Loader, Check, X } from 'lucide-react';
import apiService from '../../services/apiService';

const RegisterForm = ({ onSwitchToLogin, onSwitchToEmailVerification }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'publisher',
    bio: '',
    expertise: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
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
    if (password.length < 6) return { strength: 25, label: 'Weak', color: 'bg-red-500' };
    if (password.length < 8) return { strength: 50, label: 'Fair', color: 'bg-yellow-500' };
    if (password.length < 12 && /[A-Z]/.test(password) && /[0-9]/.test(password)) 
      return { strength: 75, label: 'Good', color: 'bg-blue-500' };
    if (password.length >= 12 && /[A-Z]/.test(password) && /[0-9]/.test(password) && /[!@#$%^&*]/.test(password))
      return { strength: 100, label: 'Strong', color: 'bg-green-500' };
    return { strength: 60, label: 'Good', color: 'bg-blue-500' };
  };

  const validateForm = () => {
    const errors = [];

    // Full name validation
    if (!formData.fullName.trim()) {
      errors.push({ field: 'fullName', message: 'Full name is required' });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      errors.push({ field: 'email', message: 'Email is required' });
    } else if (!emailRegex.test(formData.email)) {
      errors.push({ field: 'email', message: 'Please enter a valid email address' });
    }

    // Password validation
    if (!formData.password) {
      errors.push({ field: 'password', message: 'Password is required' });
    } else {
      if (formData.password.length < 8) {
        errors.push({ field: 'password', message: 'Password must be at least 8 characters long' });
      }
      if (!/(?=.*[a-z])/.test(formData.password)) {
        errors.push({ field: 'password', message: 'Password must contain at least one lowercase letter' });
      }
      if (!/(?=.*[A-Z])/.test(formData.password)) {
        errors.push({ field: 'password', message: 'Password must contain at least one uppercase letter' });
      }
      if (!/(?=.*\d)/.test(formData.password)) {
        errors.push({ field: 'password', message: 'Password must contain at least one number' });
      }
    }

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
    setValidationErrors([]);

    // Client-side validation
    const clientErrors = validateForm();
    if (clientErrors.length > 0) {
      setValidationErrors(clientErrors);
      setLoading(false);
      return;
    }

    try {
      const response = await apiService.register(formData);
      // Registration successful, show email verification
      onSwitchToEmailVerification(formData.email);
    } catch (err) {
      if (err.message.includes('validation errors') && err.errors) {
        // Server validation errors
        setValidationErrors(err.errors);
      } else if (err.message.includes('verify your email') || err.message.includes('verification')) {
        onSwitchToEmailVerification(formData.email);
      } else {
        setError(err.message || 'Registration failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const getFieldError = (fieldName) => {
    return validationErrors.find(error => error.field === fieldName);
  };

  const hasFieldError = (fieldName) => {
    return validationErrors.some(error => error.field === fieldName);
  };

  const passwordStrength = getPasswordStrength(formData.password);

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-6 sm:p-8 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-400/20 to-blue-400/20 rounded-full -translate-y-16 translate-x-16"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-indigo-400/20 to-purple-400/20 rounded-full translate-y-12 -translate-x-12"></div>
        
        <div className="relative z-10">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-r from-green-600 to-blue-600 rounded-2xl mb-3 shadow-lg">
              <div className="w-7 h-7 bg-white rounded-lg flex items-center justify-center">
                <div className="w-3 h-3 bg-gradient-to-r from-green-600 to-blue-600 rounded"></div>
              </div>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">Create Account</h1>
            <p className="text-gray-600 text-sm">Join our community of researchers</p>
          </div>

          {/* Error Messages */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
              {error}
            </div>
          )}

          {validationErrors.length > 0 && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
              <p className="font-semibold mb-1">Please fix the following errors:</p>
              <div className="space-y-1 max-h-24 overflow-y-auto">
                {validationErrors.map((error, index) => (
                  <div key={index} className="flex items-start">
                    <span className="text-red-500 mr-2">•</span>
                    <span className="text-xs leading-tight">{error.message}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Full Name and Email in Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Full Name */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-700 w-5 h-5" />
                  <input
                    type="text"
                    name="fullName"
                    placeholder="Enter your full name"
                    value={formData.fullName}
                    onChange={handleChange}
                    className={`w-full pl-11 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm text-sm ${
                      hasFieldError('fullName') ? 'border-red-300 bg-red-50' : 'border-gray-200'
                    }`}
                    required
                  />
                </div>
                {getFieldError('fullName') && (
                  <p className="text-xs text-red-600">{getFieldError('fullName').message}</p>
                )}
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-700 w-5 h-5" />
                  <input
                    type="email"
                    name="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full pl-11 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm text-sm ${
                      hasFieldError('email') ? 'border-red-300 bg-red-50' : 'border-gray-200'
                    }`}
                    required
                  />
                </div>
                {getFieldError('email') && (
                  <p className="text-xs text-red-600">{getFieldError('email').message}</p>
                )}
              </div>
            </div>

            {/* Role Selection */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Role</label>
              <div className="relative">
                <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-700 w-5 h-5" />
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm text-sm appearance-none"
                >
                  <option value="publisher">Publisher</option>
                  <option value="reviewer">Reviewer</option>
                </select>
              </div>
            </div>

            {/* Password Fields in Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Password */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-700 w-5 h-5" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    placeholder="Create a password"
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

              {/* Confirm Password */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-700 w-5 h-5" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    placeholder="Confirm your password"
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
              </div>
            </div>

            {/* Password Strength and Match Indicators - Combined */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              {/* Password Strength Indicator */}
              {formData.password && (
                <div className="flex-1 space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500">Password strength</span>
                    <span className={`text-xs font-medium ${
                      passwordStrength.strength >= 75 ? 'text-green-600' :
                      passwordStrength.strength >= 50 ? 'text-blue-600' :
                      passwordStrength.strength >= 25 ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {passwordStrength.label}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div 
                      className={`h-1.5 rounded-full transition-all duration-300 ${passwordStrength.color}`}
                      style={{ width: `${passwordStrength.strength}%` }}
                    ></div>
                  </div>
                </div>
              )}

              {/* Password Match Indicator */}
              {formData.confirmPassword && (
                <div className="flex items-center text-xs sm:ml-4">
                  {formData.password === formData.confirmPassword ? (
                    <>
                      <Check className="w-3 h-3 text-green-600 mr-1" />
                      <span className="text-green-600">Passwords match</span>
                    </>
                  ) : (
                    <>
                      <X className="w-3 h-3 text-red-600 mr-1" />
                      <span className="text-red-600">Passwords don't match</span>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Optional Fields - Side by Side */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Bio */}
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">Bio (Optional)</label>
                <textarea
                  name="bio"
                  placeholder="Tell us about yourself"
                  value={formData.bio}
                  onChange={handleChange}
                  rows="2"
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm text-sm resize-none"
                />
              </div>

              {/* Expertise */}
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">Areas of Expertise (Optional)</label>
                <input
                  type="text"
                  name="expertise"
                  placeholder="e.g., Machine Learning, Data Science"
                  value={formData.expertise}
                  onChange={handleChange}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm text-sm"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-green-600 to-blue-600 text-white py-2.5 rounded-xl font-semibold hover:from-green-700 hover:to-blue-700 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:transform-none shadow-lg text-sm flex items-center justify-center"
            >
              {loading ? (
                <Loader className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  Create Account
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </button>
          </form>

          {/* Switch to Login */}
          <div className="text-center mt-4">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <button
                onClick={onSwitchToLogin}
                className="text-green-600 hover:text-green-700 font-semibold transition-colors"
              >
                Sign in
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;