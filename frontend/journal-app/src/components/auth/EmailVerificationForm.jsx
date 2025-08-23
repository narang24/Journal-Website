import React, { useState, useEffect } from 'react';
import { Mail, ArrowLeft, CheckCircle, XCircle, Loader, RefreshCw } from 'lucide-react';
import apiService from '../../services/apiService';

const EmailVerificationForm = ({ email, onResendVerification, onBackToLogin }) => {
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [verificationStatus, setVerificationStatus] = useState('idle'); // idle, verifying, success, error
  const [resendCooldown, setResendCooldown] = useState(0);

  useEffect(() => {
    // Check URL for verification token
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    
    if (token) {
      handleEmailVerification(token);
    }
  }, []);

  // Cooldown timer for resend button
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const handleEmailVerification = async (token) => {
    setVerifying(true);
    setVerificationStatus('verifying');
    setError('');
    setMessage('');

    try {
      const response = await apiService.verifyEmail(token);
      setMessage(response.message || 'Email verified successfully! You can now login to your account.');
      setVerificationStatus('success');
      
      // Clear the URL parameter
      window.history.replaceState({}, document.title, window.location.pathname);
      
      // Auto-redirect to login after 3 seconds
      setTimeout(() => {
        onBackToLogin();
      }, 3000);
      
    } catch (error) {
      const errorMessage = error.message || 'Email verification failed';
      setError(errorMessage);
      setVerificationStatus('error');
      
      // Clear the URL parameter even on error
      window.history.replaceState({}, document.title, window.location.pathname);
    } finally {
      setVerifying(false);
    }
  };

  const handleResendVerification = async () => {
    if (!email || resendCooldown > 0) return;
    
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const response = await apiService.resendVerification(email);
      setMessage(response.message || 'Verification email sent! Please check your inbox.');
      setResendCooldown(60); // 60 second cooldown
    } catch (err) {
      setError(err.message || 'Failed to resend verification email');
    } finally {
      setLoading(false);
    }
  };

  const renderContent = () => {
    if (verifying) {
      return (
        <div className="text-center space-y-6">
          <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto">
            <Loader className="w-10 h-10 text-white animate-spin" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Verifying Your Email</h3>
            <p className="text-gray-600">Please wait while we verify your email address...</p>
          </div>
          <div className="flex justify-center">
            <div className="animate-pulse flex space-x-2">
              <div className="h-2 w-2 bg-blue-500 rounded-full animate-bounce"></div>
              <div className="h-2 w-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="h-2 w-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
          </div>
        </div>
      );
    }

    if (verificationStatus === 'success') {
      return (
        <div className="text-center space-y-6">
          <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto animate-pulse">
            <CheckCircle className="w-10 h-10 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-green-800 mb-2">Email Verified Successfully!</h3>
            <p className="text-gray-600 mb-4">{message}</p>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-sm text-green-700">
                🎉 Your account is now active! Redirecting to login in 3 seconds...
              </p>
            </div>
          </div>
          <button
            onClick={onBackToLogin}
            className="inline-flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-200 transform hover:scale-105"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Continue to Sign In
          </button>
        </div>
      );
    }

    if (verificationStatus === 'error') {
      return (
        <div className="text-center space-y-6">
          <div className="w-20 h-20 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center mx-auto">
            <XCircle className="w-10 h-10 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-red-800 mb-2">Verification Failed</h3>
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm mb-4">
              {error}
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-700 mb-3">
                Don't worry! This could happen if:
              </p>
              <ul className="text-xs text-blue-600 text-left space-y-1">
                <li>• The verification link has expired</li>
                <li>• The link has already been used</li>
                <li>• There was a network issue</li>
              </ul>
            </div>
          </div>
          {email && (
            <button
              onClick={handleResendVerification}
              disabled={loading || resendCooldown > 0}
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:transform-none"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              {loading ? 'Sending...' : resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Send New Link'}
            </button>
          )}
          <button
            onClick={onBackToLogin}
            className="block w-full text-center text-gray-600 hover:text-gray-700 font-medium"
          >
            <ArrowLeft className="w-4 h-4 mr-2 inline" />
            Back to Sign In
          </button>
        </div>
      );
    }

    // Default state - waiting for verification
    return (
      <div className="text-center space-y-6">
        <div className="w-20 h-20 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center mx-auto">
          <Mail className="w-10 h-10 text-white" />
        </div>
        
        <div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Check Your Email</h3>
          {email ? (
            <p className="text-gray-600 mb-4">
              We sent a verification link to:<br />
              <strong className="text-blue-600">{email}</strong>
            </p>
          ) : (
            <p className="text-gray-600 mb-4">
              We sent a verification link to your email address.
            </p>
          )}
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-left">
            <p className="text-sm text-blue-700 font-medium mb-2">📧 What to do next:</p>
            <ol className="text-xs text-blue-600 space-y-1">
              <li>1. Check your email inbox (and spam folder)</li>
              <li>2. Click the "Verify Email" button in the email</li>
              <li>3. You'll be redirected back here automatically</li>
            </ol>
          </div>
        </div>

        {email && (
          <button
            onClick={handleResendVerification}
            disabled={loading || resendCooldown > 0}
            className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 rounded-lg font-semibold hover:from-yellow-600 hover:to-orange-600 transition-all duration-200 disabled:opacity-50"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <Loader className="w-4 h-4 mr-2 animate-spin" />
                Sending...
              </span>
            ) : resendCooldown > 0 ? (
              `Resend in ${resendCooldown}s`
            ) : (
              <span className="flex items-center justify-center">
                <RefreshCw className="w-4 h-4 mr-2" />
                Resend Verification Email
              </span>
            )}
          </button>
        )}

        <button
          onClick={onBackToLogin}
          className="w-full flex items-center justify-center text-gray-600 hover:text-gray-700 font-medium"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Sign In
        </button>
      </div>
    );
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-2">Verify Your Email</h2>
          {!verifying && verificationStatus === 'idle' && (
            <p className="text-gray-600 text-center">Complete your account setup</p>
          )}
        </div>

        {renderContent()}
      </div>
    </div>
  );
};

export default EmailVerificationForm;