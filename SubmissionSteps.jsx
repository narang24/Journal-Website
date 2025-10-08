import React, { useState } from 'react';
import { ChevronRight, FileText, Upload, FileEdit, FolderPlus, CheckCircle } from 'lucide-react';

const SubmissionSteps = () => {
  const [currentStep, setCurrentStep] = useState(1);

  const steps = [
    {
      id: 1,
      title: 'START',
      icon: FileText,
      description: 'Begin your submission process'
    },
    {
      id: 2,
      title: 'UPLOAD SUBMISSION',
      icon: Upload,
      description: 'Upload your manuscript and files'
    },
    {
      id: 3,
      title: 'ENTER METADATA',
      icon: FileEdit,
      description: 'Add title, abstract, and keywords'
    },
    {
      id: 4,
      title: 'UPLOAD SUPPLEMENTARY FILES',
      icon: FolderPlus,
      description: 'Add additional supporting documents'
    },
    {
      id: 5,
      title: 'CONFIRMATION',
      icon: CheckCircle,
      description: 'Review and submit your manuscript'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-3">
            Journal Submission
          </h1>
          <p className="text-gray-600 text-lg">
            Follow these steps to submit your manuscript
          </p>
        </div>

        <div className="mb-12">
          <div className="flex items-center justify-between mb-4">
            {steps.map((step, index) => (
              <React.Fragment key={step.id}>
                <div className="flex flex-col items-center">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg transition-all duration-300 ${
                      currentStep >= step.id
                        ? 'bg-indigo-600 text-white shadow-lg'
                        : 'bg-gray-300 text-gray-600'
                    }`}
                  >
                    {step.id}
                  </div>
                  <div className="text-xs mt-2 text-center font-medium text-gray-700 max-w-[100px]">
                    {step.title}
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`flex-1 h-1 mx-2 transition-all duration-300 ${
                      currentStep > step.id ? 'bg-indigo-600' : 'bg-gray-300'
                    }`}
                  />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.id}
                onClick={() => setCurrentStep(step.id)}
                className={`bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer border-2 ${
                  currentStep === step.id
                    ? 'border-indigo-600 scale-105'
                    : 'border-transparent hover:border-indigo-300'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`p-3 rounded-lg ${
                      currentStep === step.id
                        ? 'bg-indigo-100 text-indigo-600'
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    <Icon size={28} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm font-semibold text-gray-500">
                        Step {step.id}
                      </span>
                    </div>
                    <h3 className="font-bold text-gray-800 mb-2 text-lg">
                      {step.title}
                    </h3>
                    <p className="text-gray-600 text-sm">{step.description}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="bg-white rounded-xl p-8 shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                {steps[currentStep - 1].title}
              </h2>
              <p className="text-gray-600">
                {steps[currentStep - 1].description}
              </p>
            </div>
            <div className="text-sm text-gray-500">
              Step {currentStep} of {steps.length}
            </div>
          </div>

          <div className="border-t pt-6">
            <div className="min-h-[200px] flex items-center justify-center text-gray-400">
              <div className="text-center">
                <p className="text-lg mb-2">Step content will be added here</p>
                <p className="text-sm">
                  This area will contain forms and functionality for each step
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-between mt-8">
            <button
              onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
              disabled={currentStep === 1}
              className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                currentStep === 1
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-300 text-gray-700 hover:bg-gray-400'
              }`}
            >
              Previous
            </button>
            <button
              onClick={() =>
                setCurrentStep(Math.min(steps.length, currentStep + 1))
              }
              disabled={currentStep === steps.length}
              className={`px-6 py-3 rounded-lg font-semibold transition-all flex items-center gap-2 ${
                currentStep === steps.length
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-indigo-600 text-white hover:bg-indigo-700'
              }`}
            >
              {currentStep === steps.length ? 'Completed' : 'Next'}
              {currentStep !== steps.length && <ChevronRight size={20} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubmissionSteps;