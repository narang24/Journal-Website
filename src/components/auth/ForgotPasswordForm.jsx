import React, { useState } from 'react';
import { Mail, ArrowLeft } from 'lucide-react';
import apiService from '../../services/apiService';

const ForgotPasswordForm = ({ onBackToLogin }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const response = await apiService.forgotPassword(email);
      setMessage(response.message);
    } catch (err) {
      setError(err.message || 'Failed to send reset email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto">
      <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-6 sm:p-8 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-400/20 to-red-400/20 rounded-full -translate-y-16 translate-x-16"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-pink-400/20 to-orange-400/20 rounded-full translate-y-12 -translate-x-12"></div>
        
        <div className="relative z-10">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-orange-600 to-red-600 rounded-2xl mb-4 shadow-lg">
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                <Mail className="w-5 h-5 text-orange-600" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Reset Password</h1>
            <p className="text-gray-600 text-sm">Enter your email to receive reset instructions</p>
          </div>

          {/* Error and Success Messages */}
          {error && (
            <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
              {error}
            </div>
          )}

          {message && (
            <div className="mb-6 p-3 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm">
              {message}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-700 w-5 h-5" />
                <input
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm text-sm"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-orange-600 to-red-600 text-white py-3 rounded-xl font-semibold hover:from-orange-700 hover:to-red-700 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:transform-none shadow-lg text-sm"
            >
              {loading ? 'Sending...' : 'Send Reset Email'}
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
              onClick={onBackToLogin}
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

export default ForgotPasswordForm;