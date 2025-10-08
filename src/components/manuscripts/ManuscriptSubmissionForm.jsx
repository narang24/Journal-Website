import React, { useState } from 'react';
import { 
  X, 
  FileText, 
  Upload, 
  CheckCircle, 
  User, 
  Tag, 
  AlertTriangle,
  Plus,
  Trash2,
  UploadCloud
} from 'lucide-react';
import Step1Start from './steps/Step1Start';
import Step2Upload from './steps/Step2Upload';
import Step3Metadata from './steps/Step3Metadata';
import Step4Supplementary from './steps/Step4Supplementary';
import Step5Confirmation from './steps/Step5Confirmation';

// ============================================
// FILE: src/components/manuscripts/ManuscriptSubmissionWizard.jsx
// ============================================
const ManuscriptSubmissionWizard = ({ onClose, onSubmit }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    checklist: {
      submissionChecklist: false,
      copyrightNotice: false,
      privacyStatement: false,
      formatting: false
    },
    manuscriptFile: null,
    metadata: {
      firstName: '',
      middleName: '',
      lastName: '',
      email: '',
      orcidId: '',
      url: '',
      affiliation: '',
      country: '',
      bioStatement: '',
      title: '',
      abstract: '',
      keywords: '',
      language: 'en',
      agencies: '',
      references: ''
    },
    supplementaryFiles: []
  });

  const steps = [
    { number: 1, title: 'START' },
    { number: 2, title: 'UPLOAD SUBMISSION' },
    { number: 3, title: 'ENTER METADATA' },
    { number: 4, title: 'UPLOAD SUPPLEMENTARY FILES' },
    { number: 5, title: 'CONFIRMATION' }
  ];

  // Handlers
  const handleChecklistChange = (field) => {
    setFormData(prev => ({
      ...prev,
      checklist: {
        ...prev.checklist,
        [field]: !prev.checklist[field]
      }
    }));
    if (errors.checklist) {
      setErrors(prev => ({ ...prev, checklist: '' }));
    }
  };

  const handleMetadataChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      metadata: {
        ...prev.metadata,
        [field]: value
      }
    }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        manuscriptFile: file
      }));
      if (errors.manuscriptFile) {
        setErrors(prev => ({ ...prev, manuscriptFile: '' }));
      }
    }
  };

  const handleSupplementaryFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        supplementaryFiles: [...prev.supplementaryFiles, {
          id: Date.now(),
          file: file,
          name: file.name
        }]
      }));
    }
  };

  const removeSupplementaryFile = (id) => {
    setFormData(prev => ({
      ...prev,
      supplementaryFiles: prev.supplementaryFiles.filter(f => f.id !== id)
    }));
  };

  // Validation
  const validateStep1 = () => {
    const newErrors = {};
    const { submissionChecklist, copyrightNotice, privacyStatement, formatting } = formData.checklist;
    
    if (!submissionChecklist || !copyrightNotice || !privacyStatement || !formatting) {
      newErrors.checklist = 'Please confirm all items in the checklist';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors = {};
    
    if (!formData.manuscriptFile) {
      newErrors.manuscriptFile = 'Please upload your manuscript file';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep3 = () => {
    const newErrors = {};
    const { firstName, lastName, email, title, abstract } = formData.metadata;
    
    if (!firstName.trim()) newErrors.firstName = 'First name is required';
    if (!lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!title.trim()) newErrors.title = 'Title is required';
    if (!abstract.trim()) newErrors.abstract = 'Abstract is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Navigation
  const handleNext = () => {
    let isValid = true;
    
    switch (currentStep) {
      case 1:
        isValid = validateStep1();
        break;
      case 2:
        isValid = validateStep2();
        break;
      case 3:
        isValid = validateStep3();
        break;
      case 4:
        isValid = true;
        break;
      default:
        isValid = true;
    }
    
    if (isValid && currentStep < 5) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      console.log('Submitting manuscript:', formData);
      await new Promise(resolve => setTimeout(resolve, 2000));
      alert('Manuscript submitted successfully!');
      onSubmit();
    } catch (error) {
      console.error('Submission error:', error);
      alert('Failed to submit manuscript. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Render step content
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <Step1Start formData={formData} handleChecklistChange={handleChecklistChange} errors={errors} />;
      case 2:
        return <Step2Upload formData={formData} handleFileUpload={handleFileUpload} errors={errors} />;
      case 3:
        return <Step3Metadata formData={formData} handleMetadataChange={handleMetadataChange} errors={errors} />;
      case 4:
        return <Step4Supplementary formData={formData} handleSupplementaryFileUpload={handleSupplementaryFileUpload} removeSupplementaryFile={removeSupplementaryFile} />;
      case 5:
        return <Step5Confirmation formData={formData} />;
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-lg w-full max-w-4xl my-8 shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gray-50">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              Step {currentStep}. {steps[currentStep - 1].title}
            </h2>
            <div className="flex items-center space-x-2 mt-1 text-sm text-gray-600">
              {steps.map((step, index) => (
                <React.Fragment key={step.number}>
                  <span className={currentStep === step.number ? 'font-semibold text-blue-600' : ''}>
                    {index + 1}. {step.title}
                  </span>
                  {index < steps.length - 1 && <span className="text-gray-400">›</span>}
                </React.Fragment>
              ))}
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="px-6 pt-4">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / steps.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-6 max-h-[60vh] overflow-y-auto">
          {renderStepContent()}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 bg-gray-50">
          {currentStep > 1 ? (
            <button
              onClick={handleBack}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded hover:bg-gray-100 transition-colors font-medium text-sm"
            >
              ← Previous
            </button>
          ) : (
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded hover:bg-gray-100 transition-colors font-medium text-sm"
            >
              Cancel
            </button>
          )}

          {currentStep < 5 ? (
            <button
              onClick={handleNext}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors font-medium text-sm"
            >
              Save and continue →
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Submitting...
                </>
              ) : (
                'Finish Submission'
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// ============================================
// DEMO: Usage in Dashboard (Updated)
// ============================================
const DemoApp = () => {
  const [showSubmissionForm, setShowSubmissionForm] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Journal Submission System
          </h1>
          <p className="text-gray-600 mb-8">
            Click the button below to start a new manuscript submission.
          </p>
          
          <button
            onClick={() => setShowSubmissionForm(true)}
            className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-md"
          >
            <Plus className="w-5 h-5 mr-2" />
            New Submission
          </button>

          <div className="mt-8 bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
            <h3 className="font-semibold text-gray-900 mb-2">How to use this system:</h3>
            <ol className="list-decimal list-inside text-sm text-gray-700 space-y-1">
              <li>Complete the submission checklist</li>
              <li>Upload your manuscript file (DOC, DOCX, RTF, or PDF)</li>
              <li>Enter author information and manuscript details</li>
              <li>Optionally add supplementary files</li>
              <li>Review and submit</li>
            </ol>
          </div>
        </div>
      </div>

      {showSubmissionForm && (
        <ManuscriptSubmissionWizard
          onClose={() => setShowSubmissionForm(false)}
          onSubmit={() => {
            setShowSubmissionForm(false);
            alert('Submission successful! Your manuscript has been submitted for review.');
          }}
        />
      )}
    </div>
  );
};

export default DemoApp;