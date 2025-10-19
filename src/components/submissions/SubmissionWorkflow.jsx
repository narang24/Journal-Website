import React, { useState } from 'react';
import { useNavigate, Routes, Route, Navigate } from 'react-router-dom';
import { ArrowLeft, FileText, Upload, FileEdit, FolderPlus, CheckCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import SubmissionHeader from './SubmissionHeader';
import Step1Start from '../manuscripts/steps/Step1Start';
import Step2Upload from '../manuscripts/steps/Step2Upload';
import Step3Metadata from '../manuscripts/steps/Step3Metadata';
import Step4Supplementary from '../manuscripts/steps/Step4Supplementary';
import Step5Confirmation from '../manuscripts/steps/Step5Confirmation';

const SubmissionWorkflow = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [formData, setFormData] = useState({
    checklist: {
      original: false,
      fileFormat: false,
      references: false,
      formatting: false,
      guidelines: false,
      peerReview: false
    },
    copyrightAgreed: false,
    comments: '',
    manuscriptFiles: [],
    supplementaryFiles: [],
    title: '',
    abstract: '',
    keywords: '',
    language: 'en',
    agencies: '',
    references: '',
    authors: [
      {
        id: 1,
        firstName: '',
        middleName: '',
        lastName: '',
        email: '',
        affiliation: '',
        country: '',
        bioStatement: '',
        isPrincipal: true
      }
    ]
  });

  const [validationErrors, setValidationErrors] = useState({});
  const [validationWarnings, setValidationWarnings] = useState([]);

  const steps = [
    {
      id: 1,
      path: '/submit-manuscript/start',
      title: 'START',
      icon: FileText,
      description: 'Begin your submission process',
      component: Step1Start
    },
    {
      id: 2,
      path: '/submit-manuscript/upload',
      title: 'UPLOAD SUBMISSION',
      icon: Upload,
      description: 'Upload your manuscript and files',
      component: Step2Upload
    },
    {
      id: 3,
      path: '/submit-manuscript/metadata',
      title: 'ENTER METADATA',
      icon: FileEdit,
      description: 'Add title, abstract, and keywords',
      component: Step3Metadata
    },
    {
      id: 4,
      path: '/submit-manuscript/supplementary',
      title: 'UPLOAD SUPPLEMENTARY FILES',
      icon: FolderPlus,
      description: 'Add additional supporting documents',
      component: Step4Supplementary
    },
    {
      id: 5,
      path: '/submit-manuscript/confirmation',
      title: 'CONFIRMATION',
      icon: CheckCircle,
      description: 'Review and submit your manuscript',
      component: Step5Confirmation
    }
  ];

  const handleBackToDashboard = () => {
    navigate('/dashboard');
  };

  const handleSubmitSuccess = (submissionData) => {
    // Navigate to submission detail page or dashboard with success message
    navigate('/dashboard', { 
      state: { 
        submissionSuccess: true,
        submissionData 
      } 
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <SubmissionHeader 
        steps={steps}
        onBackToDashboard={handleBackToDashboard}
        user={user}
      />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Routes>
          {/* Default redirect to first step */}
          <Route path="/" element={<Navigate to="/submit-manuscript/start" replace />} />
          
          {/* Step routes */}
          <Route 
            path="/start" 
            element={
              <Step1Start 
                formData={formData}
                setFormData={setFormData}
                validationErrors={validationErrors}
                setValidationErrors={setValidationErrors}
                steps={steps}
              />
            } 
          />
          
          <Route 
            path="/upload" 
            element={
              <Step2Upload 
                formData={formData}
                setFormData={setFormData}
                validationErrors={validationErrors}
                setValidationErrors={setValidationErrors}
                steps={steps}
              />
            } 
          />
          
          <Route 
            path="/metadata" 
            element={
              <Step3Metadata 
                formData={formData}
                setFormData={setFormData}
                validationErrors={validationErrors}
                setValidationErrors={setValidationErrors}
                validationWarnings={validationWarnings}
                setValidationWarnings={setValidationWarnings}
                steps={steps}
              />
            } 
          />
          
          <Route 
            path="/supplementary" 
            element={
              <Step4Supplementary 
                formData={formData}
                setFormData={setFormData}
                steps={steps}
              />
            } 
          />
          
          <Route 
            path="/confirmation" 
            element={
              <Step5Confirmation 
                formData={formData}
                onSubmitSuccess={handleSubmitSuccess}
                steps={steps}
              />
            } 
          />
        </Routes>
      </div>
    </div>
  );
};

export default SubmissionWorkflow;