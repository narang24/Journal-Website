import React, { useState } from 'react';
import { 
  X, 
  FileText, 
  Upload, 
  CheckCircle, 
  User, 
  Tag, 
  AlertTriangle,
  ChevronRight,
  ChevronLeft,
  Plus,
  Trash2,
  Globe
} from 'lucide-react';

const ManuscriptSubmissionWizard = ({ onClose, onSubmit }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form data state
  const [formData, setFormData] = useState({
    // Step 1: Start - Checklist
    checklist: {
      submissionChecklist: false,
      copyrightNotice: false,
      privacyStatement: false
    },
    // Step 2: Upload Submission
    manuscriptFile: null,
    // Step 3: Enter Metadata
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
    // Step 4: Upload Supplementary Files
    supplementaryFiles: []
  });

  const steps = [
    { number: 1, title: 'START', name: 'Submission Checklist' },
    { number: 2, title: 'UPLOAD SUBMISSION', name: 'Upload File' },
    { number: 3, title: 'ENTER METADATA', name: 'Author & Manuscript Details' },
    { number: 4, title: 'UPLOAD SUPPLEMENTARY FILES', name: 'Additional Files' },
    { number: 5, title: 'CONFIRMATION', name: 'Review & Submit' }
  ];

  // Handle input changes
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

  // Validation functions
  const validateStep1 = () => {
    const newErrors = {};
    const { submissionChecklist, copyrightNotice, privacyStatement } = formData.checklist;
    
    if (!submissionChecklist || !copyrightNotice || !privacyStatement) {
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
    const { firstName, lastName, email, affiliation, country, title, abstract } = formData.metadata;
    
    if (!firstName.trim()) newErrors.firstName = 'First name is required';
    if (!lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!affiliation.trim()) newErrors.affiliation = 'Affiliation is required';
    if (!country) newErrors.country = 'Country is required';
    if (!title.trim()) newErrors.title = 'Manuscript title is required';
    if (!abstract.trim()) newErrors.abstract = 'Abstract is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Navigation handlers
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
        isValid = true; // Supplementary files are optional
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
        return <Step1Content formData={formData} handleChecklistChange={handleChecklistChange} errors={errors} />;
      case 2:
        return <Step2Content formData={formData} handleFileUpload={handleFileUpload} errors={errors} />;
      case 3:
        return <Step3Content formData={formData} handleMetadataChange={handleMetadataChange} errors={errors} />;
      case 4:
        return <Step4Content formData={formData} handleSupplementaryFileUpload={handleSupplementaryFileUpload} removeSupplementaryFile={removeSupplementaryFile} />;
      case 5:
        return <Step5Content formData={formData} />;
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-2xl w-full max-w-5xl my-8">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-12 h-12 bg-blue-600 rounded-xl">
              <FileText className="w-7 h-7 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">New Submission</h2>
              <p className="text-sm text-gray-600">Step {currentStep} of 5: {steps[currentStep - 1].title}</p>
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
        <div className="px-6 pt-6">
          <div className="flex items-center justify-between mb-2">
            {steps.map((step, index) => (
              <React.Fragment key={step.number}>
                <div className="flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-all ${
                    currentStep === step.number 
                      ? 'bg-blue-600 text-white scale-110' 
                      : currentStep > step.number
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-200 text-gray-500'
                  }`}>
                    {currentStep > step.number ? <CheckCircle className="w-5 h-5" /> : step.number}
                  </div>
                  <span className={`text-xs mt-2 font-medium ${
                    currentStep === step.number ? 'text-blue-600' : 'text-gray-500'
                  }`}>
                    {step.title}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div className={`flex-1 h-1 mx-2 rounded transition-all ${
                    currentStep > step.number ? 'bg-green-500' : 'bg-gray-200'
                  }`} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 min-h-[400px] max-h-[60vh] overflow-y-auto">
          {renderStepContent()}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
          <button
            onClick={handleBack}
            disabled={currentStep === 1}
            className="flex items-center px-6 py-2.5 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Previous
          </button>
          
          <div className="text-sm text-gray-600">
            Step {currentStep} of 5
          </div>

          {currentStep < 5 ? (
            <button
              onClick={handleNext}
              className="flex items-center px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Next
              <ChevronRight className="w-4 h-4 ml-2" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex items-center px-6 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Submitting...
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Submit Manuscript
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// Step 1: Submission Checklist
const Step1Content = ({ formData, handleChecklistChange, errors }) => (
  <div className="space-y-6">
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
      <h3 className="text-lg font-semibold text-gray-900 mb-2">Before You Begin</h3>
      <p className="text-sm text-gray-700">
        Please ensure you have reviewed and agree to the following items before proceeding with your submission.
      </p>
    </div>

    {errors.checklist && (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center">
        <AlertTriangle className="w-5 h-5 mr-2" />
        {errors.checklist}
      </div>
    )}

    <div className="space-y-4">
      <div className="flex items-start space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
        <input
          type="checkbox"
          id="submissionChecklist"
          checked={formData.checklist.submissionChecklist}
          onChange={() => handleChecklistChange('submissionChecklist')}
          className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500 mt-1"
        />
        <label htmlFor="submissionChecklist" className="flex-1 cursor-pointer">
          <span className="font-medium text-gray-900 block mb-1">Submission Checklist</span>
          <span className="text-sm text-gray-600">
            I confirm that this submission follows all the author guidelines, including formatting requirements, citation style, and ethical standards. The manuscript has been thoroughly proofread and is ready for review.
          </span>
        </label>
      </div>

      <div className="flex items-start space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
        <input
          type="checkbox"
          id="copyrightNotice"
          checked={formData.checklist.copyrightNotice}
          onChange={() => handleChecklistChange('copyrightNotice')}
          className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500 mt-1"
        />
        <label htmlFor="copyrightNotice" className="flex-1 cursor-pointer">
          <span className="font-medium text-gray-900 block mb-1">Copyright Notice</span>
          <span className="text-sm text-gray-600">
            I understand and agree to the copyright terms. Authors retain copyright and grant the journal right of first publication with the work simultaneously licensed under a Creative Commons Attribution License.
          </span>
        </label>
      </div>

      <div className="flex items-start space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
        <input
          type="checkbox"
          id="privacyStatement"
          checked={formData.checklist.privacyStatement}
          onChange={() => handleChecklistChange('privacyStatement')}
          className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500 mt-1"
        />
        <label htmlFor="privacyStatement" className="flex-1 cursor-pointer">
          <span className="font-medium text-gray-900 block mb-1">Privacy Statement</span>
          <span className="text-sm text-gray-600">
            I acknowledge that the names and email addresses entered in this journal site will be used exclusively for the stated purposes of this journal and will not be made available for any other purpose or to any other party.
          </span>
        </label>
      </div>
    </div>

    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-6">
      <p className="text-sm text-gray-700">
        <strong>Note:</strong> All items must be checked before you can proceed to the next step.
      </p>
    </div>
  </div>
);

// Step 2: Upload Submission
const Step2Content = ({ formData, handleFileUpload, errors }) => (
  <div className="space-y-6">
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
      <h3 className="text-lg font-semibold text-gray-900 mb-2">Upload Your Manuscript</h3>
      <p className="text-sm text-gray-700">
        Please upload the main manuscript file. Supported formats: PDF, DOC, DOCX.
      </p>
    </div>

    {errors.manuscriptFile && (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center">
        <AlertTriangle className="w-5 h-5 mr-2" />
        {errors.manuscriptFile}
      </div>
    )}

    <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:border-blue-400 transition-colors">
      <Upload className="w-16 h-16 text-gray-400 mx-auto mb-4" />
      
      {formData.manuscriptFile ? (
        <div className="space-y-3">
          <div className="flex items-center justify-center space-x-2 text-green-600">
            <CheckCircle className="w-5 h-5" />
            <span className="font-medium">File uploaded successfully!</span>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4 inline-block">
            <div className="flex items-center space-x-3">
              <FileText className="w-8 h-8 text-blue-600" />
              <div className="text-left">
                <p className="font-medium text-gray-900">{formData.manuscriptFile.name}</p>
                <p className="text-sm text-gray-500">
                  {(formData.manuscriptFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>
          </div>
          <label className="cursor-pointer inline-block">
            <span className="text-blue-600 hover:text-blue-700 font-medium text-sm">
              Upload a different file
            </span>
            <input
              type="file"
              onChange={handleFileUpload}
              accept=".pdf,.doc,.docx"
              className="hidden"
            />
          </label>
        </div>
      ) : (
        <div className="space-y-3">
          <p className="text-gray-600 mb-2">
            Drag and drop your file here, or{' '}
            <label className="text-blue-600 hover:text-blue-700 font-medium cursor-pointer">
              browse
              <input
                type="file"
                onChange={handleFileUpload}
                accept=".pdf,.doc,.docx"
                className="hidden"
              />
            </label>
          </p>
          <p className="text-sm text-gray-500">Maximum file size: 25 MB</p>
          <p className="text-sm text-gray-500">Supported formats: PDF, DOC, DOCX</p>
        </div>
      )}
    </div>

    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
      <p className="text-sm text-gray-700">
        <strong>Important:</strong> Please ensure your manuscript is properly formatted and anonymized if required for blind review.
      </p>
    </div>
  </div>
);

// Step 3: Enter Metadata
const Step3Content = ({ formData, handleMetadataChange, errors }) => (
  <div className="space-y-6">
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
      <h3 className="text-lg font-semibold text-gray-900 mb-2">Author & Manuscript Details</h3>
      <p className="text-sm text-gray-700">
        Please provide complete information about the authors and manuscript.
      </p>
    </div>

    {/* Authors Section */}
    <div>
      <h4 className="text-md font-semibold text-gray-900 mb-4">Author Information</h4>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            First Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            placeholder="Enter first name"
            value={formData.metadata.firstName}
            onChange={(e) => handleMetadataChange('firstName', e.target.value)}
            className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.firstName ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.firstName && (
            <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Middle Name</label>
          <input
            type="text"
            placeholder="Enter middle name"
            value={formData.metadata.middleName}
            onChange={(e) => handleMetadataChange('middleName', e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Last Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            placeholder="Enter last name"
            value={formData.metadata.lastName}
            onChange={(e) => handleMetadataChange('lastName', e.target.value)}
            className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.lastName ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.lastName && (
            <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            placeholder="author@example.com"
            value={formData.metadata.email}
            onChange={(e) => handleMetadataChange('email', e.target.value)}
            className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.email ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">ORCID iD</label>
          <input
            type="text"
            placeholder="http://orcid.org/0000-0002-1825-0097"
            value={formData.metadata.orcidId}
            onChange={(e) => handleMetadataChange('orcidId', e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <p className="mt-1 text-xs text-gray-500">ORCID iDs can only be assigned by the ORCID Registry</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">URL</label>
          <input
            type="url"
            placeholder="https://example.com"
            value={formData.metadata.url}
            onChange={(e) => handleMetadataChange('url', e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Country <span className="text-red-500">*</span>
          </label>
          <select
            value={formData.metadata.country}
            onChange={(e) => handleMetadataChange('country', e.target.value)}
            className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.country ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="">Select a country</option>
            <option value="US">United States</option>
            <option value="UK">United Kingdom</option>
            <option value="IN">India</option>
            <option value="CA">Canada</option>
            <option value="AU">Australia</option>
            <option value="DE">Germany</option>
            <option value="FR">France</option>
            <option value="JP">Japan</option>
            <option value="CN">China</option>
          </select>
          {errors.country && (
            <p className="mt-1 text-sm text-red-600">{errors.country}</p>
          )}
        </div>
      </div>

      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Affiliation <span className="text-red-500">*</span>
        </label>
        <textarea
          placeholder='Your institution, e.g. "Simon Fraser University"'
          value={formData.metadata.affiliation}
          onChange={(e) => handleMetadataChange('affiliation', e.target.value)}
          rows="2"
          className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none ${
            errors.affiliation ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {errors.affiliation && (
          <p className="mt-1 text-sm text-red-600">{errors.affiliation}</p>
        )}
      </div>

      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Bio Statement (Department and rank)
        </label>
        <textarea
          placeholder="E.g., Department of Computer Science, Assistant Professor"
          value={formData.metadata.bioStatement}
          onChange={(e) => handleMetadataChange('bioStatement', e.target.value)}
          rows="3"
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
        />
      </div>
    </div>

    {/* Title and Abstract Section */}
    <div className="border-t border-gray-200 pt-6">
      <h4 className="text-md font-semibold text-gray-900 mb-4">Title and Abstract</h4>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Title <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          placeholder="Enter manuscript title"
          value={formData.metadata.title}
          onChange={(e) => handleMetadataChange('title', e.target.value)}
          className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
            errors.title ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {errors.title && (
          <p className="mt-1 text-sm text-red-600">{errors.title}</p>
        )}
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Abstract <span className="text-red-500">*</span>
        </label>
        <textarea
          placeholder="Enter manuscript abstract"
          value={formData.metadata.abstract}
          onChange={(e) => handleMetadataChange('abstract', e.target.value)}
          rows="6"
          className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none ${
            errors.abstract ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {errors.abstract && (
          <p className="mt-1 text-sm text-red-600">{errors.abstract}</p>
        )}
      </div>
    </div>

    {/* Indexing Section */}
    <div className="border-t border-gray-200 pt-6">
      <h4 className="text-md font-semibold text-gray-900 mb-4">Indexing</h4>
      <p className="text-sm text-gray-600 mb-4">Provide terms for indexing the submission; separate terms with a semi-colon (term1; term2; term3).</p>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Keywords</label>
        <input
          type="text"
          placeholder="keyword1; keyword2; keyword3"
          value={formData.metadata.keywords}
          onChange={(e) => handleMetadataChange('keywords', e.target.value)}
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
        <select
          value={formData.metadata.language}
          onChange={(e) => handleMetadataChange('language', e.target.value)}
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="en">English</option>
          <option value="fr">French</option>
          <option value="es">Spanish</option>
          <option value="de">German</option>
          <option value="zh">Chinese</option>
        </select>
        <p className="mt-1 text-xs text-gray-500">English=en; French=fr; Spanish=es.</p>
      </div>
    </div>

    {/* Contributors and Supporting Agencies */}
    <div className="border-t border-gray-200 pt-6">
      <h4 className="text-md font-semibold text-gray-900 mb-4">Contributors and Supporting Agencies</h4>
      <p className="text-sm text-gray-600 mb-4">
        Identify agencies (a person, an organization, or a service) that made contributions to the content or provided funding or support for the work presented in this submission. Separate them with a semi-colon (e.g. John Doe, Metro University; Master University, Department of Computer Science).
      </p>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Agencies</label>
        <input
          type="text"
          placeholder="Agency 1; Agency 2; Agency 3"
          value={formData.metadata.agencies}
          onChange={(e) => handleMetadataChange('agencies', e.target.value)}
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
    </div>

    {/* References */}
    <div className="border-t border-gray-200 pt-6">
      <h4 className="text-md font-semibold text-gray-900 mb-4">References</h4>
      <p className="text-sm text-gray-600 mb-4">
        Provide a formatted list of references for works cited in this submission. Please separate individual references with a blank line.
      </p>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">References</label>
        <textarea
          placeholder="Enter references here, separated by blank lines"
          value={formData.metadata.references}
          onChange={(e) => handleMetadataChange('references', e.target.value)}
          rows="6"
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
        />
      </div>
    </div>
  </div>
);

// Step 4: Upload Supplementary Files
const Step4Content = ({ formData, handleSupplementaryFileUpload, removeSupplementaryFile }) => (
  <div className="space-y-6">
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
      <h3 className="text-lg font-semibold text-gray-900 mb-2">Upload Supplementary Files (Optional)</h3>
      <p className="text-sm text-gray-700">
        This optional step allows Supplementary Files to be added to a submission. The files, which can be in any format, might include (a) research instruments, (b) data sets, which comply with the terms of the study's research ethics review, (c) sources that otherwise would be unavailable to readers, (d) figures and tables that cannot be integrated into the text itself, or other materials that add to the contribution of the work.
      </p>
    </div>

    {formData.supplementaryFiles.length > 0 && (
      <div className="space-y-3">
        <h4 className="font-medium text-gray-900">Uploaded Files:</h4>
        <div className="space-y-2">
          {formData.supplementaryFiles.map((file) => (
            <div key={file.id} className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-lg">
              <div className="flex items-center space-x-3">
                <FileText className="w-8 h-8 text-blue-600" />
                <div>
                  <p className="font-medium text-gray-900">{file.name}</p>
                  <p className="text-sm text-gray-500">
                    {(file.file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
              <button
                onClick={() => removeSupplementaryFile(file.id)}
                className="text-red-600 hover:text-red-700 p-2 rounded-lg hover:bg-red-50 transition-colors"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>
      </div>
    )}

    <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:border-blue-400 transition-colors">
      <Upload className="w-16 h-16 text-gray-400 mx-auto mb-4" />
      <p className="text-gray-600 mb-2">
        Drag and drop your file here, or{' '}
        <label className="text-blue-600 hover:text-blue-700 font-medium cursor-pointer">
          browse
          <input
            type="file"
            onChange={handleSupplementaryFileUpload}
            className="hidden"
          />
        </label>
      </p>
      <p className="text-sm text-gray-500">Any file format is accepted</p>
    </div>

    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
      <p className="text-sm text-gray-700">
        <strong>Note:</strong> Supplementary files are optional. You can skip this step if you don't have any additional files to upload.
      </p>
    </div>

    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
      <p className="text-sm text-gray-600 italic">
        No supplementary files have been added to this submission.
      </p>
    </div>
  </div>
);

// Step 5: Confirmation
const Step5Content = ({ formData }) => (
  <div className="space-y-6">
    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
      <h3 className="text-lg font-semibold text-gray-900 mb-2">Review Your Submission</h3>
      <p className="text-sm text-gray-700">
        Please review all the information below before submitting. You can go back to any step to make changes.
      </p>
    </div>

    {/* Checklist Confirmation */}
    <div className="bg-white border border-gray-200 rounded-lg p-5">
      <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
        <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
        Submission Checklist
      </h4>
      <div className="space-y-2 text-sm text-gray-700">
        <div className="flex items-center space-x-2">
          <CheckCircle className="w-4 h-4 text-green-500" />
          <span>Submission checklist confirmed</span>
        </div>
        <div className="flex items-center space-x-2">
          <CheckCircle className="w-4 h-4 text-green-500" />
          <span>Copyright notice accepted</span>
        </div>
        <div className="flex items-center space-x-2">
          <CheckCircle className="w-4 h-4 text-green-500" />
          <span>Privacy statement acknowledged</span>
        </div>
      </div>
    </div>

    {/* Manuscript File */}
    <div className="bg-white border border-gray-200 rounded-lg p-5">
      <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
        <FileText className="w-5 h-5 text-blue-500 mr-2" />
        Manuscript File
      </h4>
      {formData.manuscriptFile ? (
        <div className="flex items-center space-x-3 bg-gray-50 p-3 rounded-lg">
          <FileText className="w-8 h-8 text-blue-600" />
          <div>
            <p className="font-medium text-gray-900">{formData.manuscriptFile.name}</p>
            <p className="text-sm text-gray-500">
              {(formData.manuscriptFile.size / 1024 / 1024).toFixed(2)} MB
            </p>
          </div>
        </div>
      ) : (
        <p className="text-sm text-gray-500">No file uploaded</p>
      )}
    </div>

    {/* Author Information */}
    <div className="bg-white border border-gray-200 rounded-lg p-5">
      <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
        <User className="w-5 h-5 text-purple-500 mr-2" />
        Author Information
      </h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
        <div>
          <span className="text-gray-600">Name:</span>
          <p className="font-medium text-gray-900">
            {formData.metadata.firstName} {formData.metadata.middleName} {formData.metadata.lastName}
          </p>
        </div>
        <div>
          <span className="text-gray-600">Email:</span>
          <p className="font-medium text-gray-900">{formData.metadata.email}</p>
        </div>
        <div>
          <span className="text-gray-600">Affiliation:</span>
          <p className="font-medium text-gray-900">{formData.metadata.affiliation}</p>
        </div>
        <div>
          <span className="text-gray-600">Country:</span>
          <p className="font-medium text-gray-900">{formData.metadata.country}</p>
        </div>
      </div>
    </div>

    {/* Manuscript Details */}
    <div className="bg-white border border-gray-200 rounded-lg p-5">
      <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
        <FileText className="w-5 h-5 text-indigo-500 mr-2" />
        Manuscript Details
      </h4>
      <div className="space-y-3 text-sm">
        <div>
          <span className="text-gray-600 block mb-1">Title:</span>
          <p className="font-medium text-gray-900">{formData.metadata.title}</p>
        </div>
        <div>
          <span className="text-gray-600 block mb-1">Abstract:</span>
          <p className="text-gray-700 line-clamp-4">{formData.metadata.abstract}</p>
        </div>
        {formData.metadata.keywords && (
          <div>
            <span className="text-gray-600 block mb-1">Keywords:</span>
            <p className="text-gray-700">{formData.metadata.keywords}</p>
          </div>
        )}
      </div>
    </div>

    {/* Supplementary Files */}
    {formData.supplementaryFiles.length > 0 && (
      <div className="bg-white border border-gray-200 rounded-lg p-5">
        <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
          <Upload className="w-5 h-5 text-orange-500 mr-2" />
          Supplementary Files ({formData.supplementaryFiles.length})
        </h4>
        <div className="space-y-2">
          {formData.supplementaryFiles.map((file) => (
            <div key={file.id} className="flex items-center space-x-3 bg-gray-50 p-3 rounded-lg">
              <FileText className="w-6 h-6 text-blue-600" />
              <p className="text-sm font-medium text-gray-900">{file.name}</p>
            </div>
          ))}
        </div>
      </div>
    )}

    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
      <p className="text-sm text-gray-700">
        <strong>Ready to submit?</strong> Click the "Submit Manuscript" button below to complete your submission. You will receive a confirmation email once your submission is received.
      </p>
    </div>
  </div>
);

export default ManuscriptSubmissionWizard;