import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, BookOpen, User, LogOut } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const SubmissionHeader = ({ steps, onBackToDashboard }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  
  // Find current step based on path
  const currentStepIndex = steps.findIndex(step => 
    location.pathname.includes(step.path.split('/').pop())
  );
  const currentStep = currentStepIndex >= 0 ? currentStepIndex + 1 : 1;

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <div className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
      {/* Top Bar */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <BookOpen className="w-5 h-5" />
                <span className="font-semibold">Journal Platform</span>
              </div>
              <span className="text-blue-200">|</span>
              <span className="text-sm">New Manuscript Submission</span>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm">
                <User className="w-4 h-4" />
                <span>{user?.fullName || 'User'}</span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-1 px-3 py-1 text-sm hover:bg-white/10 rounded transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={onBackToDashboard}
            className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-medium">Back to Dashboard</span>
          </button>
          
          <div className="text-sm text-gray-600">
            Step {currentStep} of {steps.length}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="flex items-center justify-between">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isActive = currentStep === index + 1;
            const isCompleted = currentStep > index + 1;
            
            return (
              <React.Fragment key={step.id}>
                <div className="flex flex-col items-center flex-1">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${
                      isCompleted
                        ? 'bg-green-500 text-white'
                        : isActive
                        ? 'bg-blue-600 text-white shadow-lg scale-110'
                        : 'bg-gray-200 text-gray-500'
                    }`}
                  >
                    {isCompleted ? (
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <Icon className="w-5 h-5" />
                    )}
                  </div>
                  <div className={`mt-2 text-center hidden sm:block transition-colors ${
                    isActive ? 'text-blue-600 font-semibold' : 'text-gray-600'
                  }`}>
                    <div className="text-xs font-medium">{step.title}</div>
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div className="flex-1 h-1 mx-2 relative" style={{ maxWidth: '100px' }}>
                    <div className="absolute inset-0 bg-gray-200 rounded"></div>
                    <div 
                      className={`absolute inset-0 rounded transition-all duration-500 ${
                        currentStep > index + 1 ? 'bg-green-500' : 'bg-gray-200'
                      }`}
                      style={{
                        width: currentStep > index + 1 ? '100%' : '0%'
                      }}
                    ></div>
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* Current Step Info */}
        <div className="mt-4 text-center">
          <h2 className="text-xl font-bold text-gray-900">
            {steps[currentStep - 1]?.title}
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            {steps[currentStep - 1]?.description}
          </p>
        </div>
      </div>
    </div>
  );
};

export default SubmissionHeader;