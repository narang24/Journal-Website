import React, { useState, useEffect } from 'react';
import { Mail, ArrowLeft } from 'lucide-react';
import apiService from '../../services/apiService';

const EmailVerificationForm = ({ email, onResendVerification, onBackToLogin }) => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleResendVerification = async () => {
    if (!email) return;
    
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const response = await apiService.resendVerification(email);
      setMessage(response.message);
    } catch (err) {
      setError(err.message || 'Failed to resend verification email');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Check URL for verification token
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    
    if (token) {
      const verifyEmail = async () => {
        try {
          const response = await apiService.verifyEmail(token);
          setMessage(response.message);
          // Clear the URL parameter
          window.history.replaceState({}, document.title, window.location.pathname);
        } catch (error) {
          setError(error.message || 'Email verification failed');
        }
      };
      
      verifyEmail();
    }
  }, []);

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Mail className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-800">Verify Your Email</h2>
          <p className="text-gray-600 mt-2">Check your inbox for a verification link</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm mb-6">
            {error}
          </div>
        )}

        {message && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm mb-6">
            {message}
          </div>
        )}

        <div className="text-center space-y-4">
          {email && (
            <p className="text-gray-600">
              We sent a verification link to: <strong>{email}</strong>
            </p>
          )}
          
          <div className="space-y-3">
            {email && (
              <button
                onClick={handleResendVerification}
                disabled={loading}
                className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 rounded-lg font-semibold hover:from-yellow-600 hover:to-orange-600 transition-all duration-200 disabled:opacity-50"
              >
                {loading ? 'Sending...' : 'Resend Verification Email'}
              </button>
            )}
            
            <button
              onClick={onBackToLogin}
              className="w-full flex items-center justify-center text-gray-600 hover:text-gray-700 font-semibold"
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

export default EmailVerificationForm;