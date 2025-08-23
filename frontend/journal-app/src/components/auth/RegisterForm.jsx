import React, { useState } from 'react';
import { Eye, EyeOff, PenTool, User, Mail, Lock, Shield } from 'lucide-react';
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
      if (!/(?=.*[!@#$%^&*(),.?":{}|<>])/.test(formData.password)) {
        errors.push({ field: 'password', message: 'Password must contain at least one special character (!@#$%^&*(),.?":{}|<>)' });
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

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-green-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <PenTool className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-800">Join Our Community</h2>
          <p className="text-gray-600 mt-2">Create your journal account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {validationErrors.length > 0 && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              <p className="font-semibold mb-2">Please fix the following validation errors:</p>
              <div className="space-y-1 max-h-40 overflow-y-auto">
                {validationErrors.map((error, index) => (
                  <div key={index} className="flex items-start">
                    <span className="text-red-500 mr-2">•</span>
                    <span className="text-sm leading-relaxed">{error.message}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                name="fullName"
                placeholder="Full Name"
                value={formData.fullName}
                onChange={handleChange}
                className={`w-full pl-12 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 ${
                  hasFieldError('fullName') ? 'border-red-300 bg-red-50' : 'border-gray-300'
                }`}
                required
              />
              {getFieldError('fullName') && (
                <p className="mt-1 text-xs text-red-600">{getFieldError('fullName').message}</p>
              )}
            </div>

            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="email"
                name="email"
                placeholder="Email address"
                value={formData.email}
                onChange={handleChange}
                className={`w-full pl-12 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 ${
                  hasFieldError('email') ? 'border-red-300 bg-red-50' : 'border-gray-300'
                }`}
                required
              />
              {getFieldError('email') && (
                <p className="mt-1 text-xs text-red-600">{getFieldError('email').message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full pl-12 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 ${
                  hasFieldError('password') ? 'border-red-300 bg-red-50' : 'border-gray-300'
                }`}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`w-full pl-12 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 ${
                  hasFieldError('confirmPassword') ? 'border-red-300 bg-red-50' : 'border-gray-300'
                }`}
                required
              />
            </div>
          </div>

          {/* Password Requirements Help Text */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="text-sm font-medium text-blue-800 mb-2">Password Requirements:</h4>
            <ul className="text-xs text-blue-700 space-y-1">
              <li className="flex items-center">
                <span className="mr-2">{formData.password.length >= 8 ? '✅' : '❌'}</span>
                At least 8 characters long
              </li>
              <li className="flex items-center">
                <span className="mr-2">{/(?=.*[a-z])/.test(formData.password) ? '✅' : '❌'}</span>
                One lowercase letter (a-z)
              </li>
              <li className="flex items-center">
                <span className="mr-2">{/(?=.*[A-Z])/.test(formData.password) ? '✅' : '❌'}</span>
                One uppercase letter (A-Z)
              </li>
              <li className="flex items-center">
                <span className="mr-2">{/(?=.*\d)/.test(formData.password) ? '✅' : '❌'}</span>
                One number (0-9)
              </li>
              <li className="flex items-center">
                <span className="mr-2">{/(?=.*[!@#$%^&*(),.?":{}|<>])/.test(formData.password) ? '✅' : '❌'}</span>
                One special character (!@#$%^&*(),.?":{}|&lt;&gt;)
              </li>
            </ul>
          </div>

          <div className="relative">
            <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
            >
              <option value="publisher">Publisher</option>
              <option value="reviewer">Reviewer</option>
            </select>
          </div>

          <div>
            <textarea
              name="bio"
              placeholder="Tell us about yourself (optional)"
              value={formData.bio}
              onChange={handleChange}
              rows="3"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 resize-none"
            />
          </div>

          <div>
            <input
              type="text"
              name="expertise"
              placeholder="Areas of expertise (comma separated, optional)"
              value={formData.expertise}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-green-600 to-blue-600 text-white py-3 rounded-lg font-semibold hover:from-green-700 hover:to-blue-700 transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:transform-none"
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Already have an account?{' '}
            <button
              onClick={onSwitchToLogin}
              className="text-green-600 hover:text-green-700 font-semibold"
            >
              Sign in
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;