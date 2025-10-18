import React, { useState } from 'react';
import { ChevronRight, FileText, Upload, FileEdit, FolderPlus, CheckCircle, AlertCircle, Loader } from 'lucide-react';
import manuscriptService from '../services/manuscriptService';

const SubmissionSteps = ({ onSubmitSuccess }) => {
  
  const [showSubmissionForm, setShowSubmissionForm] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [checklist, setChecklist] = useState({
    original: false,
    fileFormat: false,
    references: false,
    formatting: false,
    guidelines: false,
    peerReview: false
  });
  const [copyrightAgreed, setCopyrightAgreed] = useState(false);
  const [comments, setComments] = useState('');
  const [supplementaryFiles, setSupplementaryFiles] = useState([]);
  const [manuscriptFiles, setManuscriptFiles] = useState([]);
  const [title, setTitle] = useState('');
  const [abstract, setAbstract] = useState('');
  const [keywords, setKeywords] = useState('');
  const [language, setLanguage] = useState('en');
  const [agencies, setAgencies] = useState('');
  const [references, setReferences] = useState('');
  const [authors, setAuthors] = useState([
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
  ]);

  // Validation states
  const [validationErrors, setValidationErrors] = useState({});
  const [isValidating, setIsValidating] = useState(false);
  const [validationWarnings, setValidationWarnings] = useState([]);

  const addAuthor = () => {
    const newAuthor = {
      id: Date.now(),
      firstName: '',
      middleName: '',
      lastName: '',
      email: '',
      affiliation: '',
      country: '',
      bioStatement: '',
      isPrincipal: false
    };
    setAuthors([...authors, newAuthor]);
  };

  const deleteAuthor = (id) => {
    if (authors.length > 1) {
      setAuthors(authors.filter(author => author.id !== id));
    }
  };

  const updateAuthor = (id, field, value) => {
    setAuthors(authors.map(author => 
      author.id === id ? { ...author, [field]: value } : author
    ));
  };

  const setPrincipalContact = (id) => {
    setAuthors(authors.map(author => ({
      ...author,
      isPrincipal: author.id === id
    })));
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const newFile = {
        id: Date.now(),
        title: file.name,
        originalFileName: file.name,
        dateUploaded: new Date().toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        }),
        file: file
      };
      setSupplementaryFiles([...supplementaryFiles, newFile]);
      event.target.value = null;
    }
  };

  const deleteSupplementaryFile = (id) => {
    setSupplementaryFiles(supplementaryFiles.filter(file => file.id !== id));
  };

  const handleManuscriptUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Clear previous errors
      const newErrors = { ...validationErrors };
      delete newErrors.manuscriptFile;
      setValidationErrors(newErrors);

      // Validate file immediately
      const fileErrors = manuscriptService.validateFile(file);
      if (fileErrors.length > 0) {
        setValidationErrors({
          ...validationErrors,
          manuscriptFile: fileErrors[0]
        });
        event.target.value = null;
        return;
      }

      const newFile = {
        id: Date.now(),
        originalFileName: file.name,
        type: file.type || 'application/octet-stream',
        fileSize: (file.size / 1024).toFixed(2) + ' KB',
        dateUploaded: new Date().toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        }),
        file: file
      };
      setManuscriptFiles([newFile]);
      event.target.value = null;
    }
  };

  const getAllUploadedFiles = () => {
    return [...manuscriptFiles, ...supplementaryFiles.map(sf => ({
      id: sf.id,
      originalFileName: sf.originalFileName,
      type: sf.file?.type || 'application/octet-stream',
      fileSize: sf.file ? (sf.file.size / 1024).toFixed(2) + ' KB' : 'N/A',
      dateUploaded: sf.dateUploaded
    }))];
  };

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

  const handleChecklistChange = (field) => {
    setChecklist(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  // Validation Functions
  const validateStep1 = () => {
    const errors = {};
    
    if (!Object.values(checklist).every(val => val)) {
      errors.checklist = 'Please confirm all items in the Submission Checklist';
    }
    
    if (!copyrightAgreed) {
      errors.copyright = 'You must agree to the Copyright Notice';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateStep2 = () => {
    const errors = {};
    
    if (manuscriptFiles.length === 0) {
      errors.manuscriptFile = 'Please upload your manuscript file';
    } else {
      const fileErrors = manuscriptService.validateFile(manuscriptFiles[0].file);
      if (fileErrors.length > 0) {
        errors.manuscriptFile = fileErrors[0];
      }
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateStep3 = async () => {
    setIsValidating(true);
    const errors = {};
    const warnings = [];

    try {
      // Validate title
      const titleErrors = manuscriptService.validateTitle(title);
      if (titleErrors.length > 0) {
        errors.title = titleErrors[0];
      }

      // Validate abstract
      const abstractErrors = manuscriptService.validateAbstract(abstract);
      if (abstractErrors.length > 0) {
        errors.abstract = abstractErrors[0];
      }

      // Validate authors
      const authorErrors = manuscriptService.validateAuthors(authors);
      if (authorErrors.length > 0) {
        errors.authors = authorErrors[0];
      }

      // Validate references
      const referencesArray = references.split('\n\n').filter(ref => ref.trim());
      const referenceErrors = manuscriptService.validateReferences(referencesArray);
      if (referenceErrors.length > 0) {
        errors.references = referenceErrors[0];
      }

      // Check for keywords (warning only)
      if (!keywords || keywords.trim().length === 0) {
        warnings.push('Keywords are recommended for better indexing');
      }

      setValidationErrors(errors);
      setValidationWarnings(warnings);
      
      return Object.keys(errors).length === 0;

    } catch (error) {
      console.error('Validation error:', error);
      errors.general = 'An error occurred during validation';
      setValidationErrors(errors);
      return false;
    } finally {
      setIsValidating(false);
    }
  };

  const isStep1Complete = () => {
    return Object.values(checklist).every(val => val) && copyrightAgreed;
  };

  const isStep2Complete = () => {
    return manuscriptFiles.length > 0;
  };

  const isStep3Complete = () => {
    const hasValidAuthor = authors.some(author => 
      author.firstName.trim() !== '' && 
      author.lastName.trim() !== '' && 
      author.email.trim() !== ''
    );
    
    return title.trim() !== '' && abstract.trim() !== '' && hasValidAuthor;
  };

  const validateCurrentStep = async () => {
    setValidationErrors({});
    setValidationWarnings([]);

    if (currentStep === 1) {
      return validateStep1();
    } else if (currentStep === 2) {
      return validateStep2();
    } else if (currentStep === 3) {
      return await validateStep3();
    }
    
    return true;
  };

  const canProceed = () => {
    if (currentStep === 1) {
      return isStep1Complete();
    }
    if (currentStep === 2) {
      return isStep2Complete();
    }
    if (currentStep === 3) {
      return isStep3Complete();
    }
    return true;
  };

  const handleNext = async () => {
    const isValid = await validateCurrentStep();
    
    if (isValid && currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setValidationErrors({});
      setValidationWarnings([]);
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSubmit = async () => {
    try {
      setIsValidating(true);

      // Prepare manuscript data
      const manuscriptData = {
        title,
        abstract,
        authors: authors.map(author => ({
          firstName: author.firstName,
          middleName: author.middleName,
          lastName: author.lastName,
          email: author.email,
          affiliation: author.affiliation,
          country: author.country,
          bioStatement: author.bioStatement,
          isPrincipal: author.isPrincipal
        })),
        keywords: keywords.split(';').map(k => k.trim()).filter(k => k),
        language,
        references: references.split('\n\n').filter(ref => ref.trim()),
        agencies: agencies.split(';').map(a => a.trim()).filter(a => a),
        validationChecklist: {
          originalWork: checklist.original,
          correctFormat: checklist.fileFormat,
          referencesValid: checklist.references,
          properFormatting: checklist.formatting,
          followsGuidelines: checklist.guidelines,
          blindReviewReady: checklist.peerReview
        },
        copyrightAgreed: copyrightAgreed,
        commentsForEditor: comments
      };

      const manuscriptFile = manuscriptFiles[0]?.file;
      const suppFiles = supplementaryFiles.map(sf => sf.file);

      // Submit to backend
      const response = await manuscriptService.submitManuscript(
        manuscriptData,
        manuscriptFile,
        suppFiles
      );

      if (response.success) {
        alert('✅ Manuscript submitted successfully!\n\nYou will receive a confirmation email shortly.');
        // Reset form or redirect
        window.location.href = '/dashboard';
      }

    } catch (error) {
      console.error('Submission error:', error);
      
      if (error.message.includes('validation')) {
        alert('❌ Validation Error\n\n' + error.message);
      } else {
        alert('❌ Submission Failed\n\n' + (error.message || 'An error occurred during submission. Please try again.'));
      }
    } finally {
      setIsValidating(false);
    }
  };

  const renderValidationErrors = () => {
    if (Object.keys(validationErrors).length === 0) return null;

    return (
      <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded">
        <div className="flex items-start">
          <AlertCircle className="w-5 h-5 text-red-500 mr-3 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h4 className="font-semibold text-red-800 mb-2">Please fix the following errors:</h4>
            <ul className="list-disc list-inside space-y-1 text-sm text-red-700">
              {Object.entries(validationErrors).map(([field, error]) => (
                <li key={field}>{error}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    );
  };

  const renderValidationWarnings = () => {
    if (validationWarnings.length === 0) return null;

    return (
      <div className="mb-6 p-4 bg-yellow-50 border-l-4 border-yellow-500 rounded">
        <div className="flex items-start">
          <AlertCircle className="w-5 h-5 text-yellow-500 mr-3 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h4 className="font-semibold text-yellow-800 mb-2">Recommendations:</h4>
            <ul className="list-disc list-inside space-y-1 text-sm text-yellow-700">
              {validationWarnings.map((warning, index) => (
                <li key={index}>{warning}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    );
  };

  const renderStepContent = () => {
    if (currentStep === 1) {
      return (
        <div className="space-y-8">
          {renderValidationErrors()}
          
          {/* Submission Checklist */}
          <div className="border-b pb-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Submission Checklist</h3>
            <p className="text-gray-600 mb-4 text-sm">
              Before submitting your manuscript, please ensure that:
            </p>
            
            <div className="space-y-3">
              <label className="flex items-start gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={checklist.original}
                  onChange={() => handleChecklistChange('original')}
                  className="mt-1 w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
                />
                <span className="text-sm text-gray-700 group-hover:text-gray-900">
                  The manuscript is original, has not been published elsewhere, and is not under consideration by any other journal.
                </span>
              </label>

              <label className="flex items-start gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={checklist.fileFormat}
                  onChange={() => handleChecklistChange('fileFormat')}
                  className="mt-1 w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
                />
                <span className="text-sm text-gray-700 group-hover:text-gray-900">
                  The submission file is prepared in Microsoft Word, OpenOffice, or PDF format.
                </span>
              </label>

              <label className="flex items-start gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={checklist.references}
                  onChange={() => handleChecklistChange('references')}
                  className="mt-1 w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
                />
                <span className="text-sm text-gray-700 group-hover:text-gray-900">
                  All references include valid DOIs or URLs (where available).
                </span>
              </label>

              <label className="flex items-start gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={checklist.formatting}
                  onChange={() => handleChecklistChange('formatting')}
                  className="mt-1 w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
                />
                <span className="text-sm text-gray-700 group-hover:text-gray-900">
                  The text is double-spaced, uses a 12-point Times New Roman font, and includes figures and tables within the text at appropriate locations.
                </span>
              </label>

              <label className="flex items-start gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={checklist.guidelines}
                  onChange={() => handleChecklistChange('guidelines')}
                  className="mt-1 w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
                />
                <span className="text-sm text-gray-700 group-hover:text-gray-900">
                  The manuscript follows the formatting and citation style mentioned in the{' '}
                  <a href="#" className="text-blue-600 hover:underline font-medium">Author Guidelines</a>{' '}
                  section.
                </span>
              </label>

              <label className="flex items-start gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={checklist.peerReview}
                  onChange={() => handleChecklistChange('peerReview')}
                  className="mt-1 w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
                />
                <span className="text-sm text-gray-700 group-hover:text-gray-900">
                  The instructions for{' '}
                  <a href="#" className="text-blue-600 hover:underline font-medium">Anonymous Peer Review</a>{' '}
                  have been followed if submitting to a peer-reviewed section.
                </span>
              </label>
            </div>
          </div>

          {/* Copyright Notice */}
          <div className="border-b pb-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Copyright Notice</h3>

            <div className="space-y-4 text-sm text-gray-700">
              <div>
                <h4 className="font-semibold mb-2">1. License</h4>
                <p className="mb-2">
                  This platform follows the principles of the{' '}
                  <a href="#" className="text-blue-600 hover:underline font-medium">
                    Creative Commons Attribution 4.0 International License (CC BY 4.0)
                  </a>{' '}
                  for demonstration purposes.
                </p>
              </div>

              <div>
                <h4 className="font-semibold mb-2">2. Author Responsibilities</h4>
                <p>
                  Authors confirm that their submission is original, does not infringe on existing copyrights, and has not been submitted elsewhere.
                </p>
              </div>
            </div>

            <label className="flex items-start gap-3 cursor-pointer group mt-4">
              <input
                type="checkbox"
                checked={copyrightAgreed}
                onChange={() => setCopyrightAgreed(!copyrightAgreed)}
                className="mt-1 w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
              />
              <span className="text-sm text-gray-700 group-hover:text-gray-900 font-medium">
                I acknowledge and agree to the terms of this Copyright Notice.
              </span>
            </label>
          </div>

          {/* Comments for Editor */}
          <div>
            <h3 className="text-xl font-bold text-gray-800 mb-4">Comments for the Editor</h3>
            <p className="text-sm text-gray-600 mb-2">Enter text (optional)</p>
            <textarea
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 min-h-[120px]"
              placeholder="Add any comments for the editor here..."
            />
          </div>
        </div>
      );
    }

    if (currentStep === 2) {
      return (
        <div className="space-y-8">
          {renderValidationErrors()}
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-700">
              Upload your manuscript file here. Accepted formats include Microsoft Word (.doc, .docx), PDF (.pdf), and OpenOffice (.odt) files. Maximum file size: 20MB.
            </p>
          </div>

          <div className="border-b pb-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Upload Manuscript</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select manuscript file <span className="text-red-500">*</span>
              </label>
              <input
                type="file"
                onChange={handleManuscriptUpload}
                accept=".doc,.docx,.pdf,.odt"
                className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>

          {manuscriptFiles.length > 0 && (
            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-4">Uploaded Files</h3>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border border-gray-300 px-4 py-2 text-left text-sm font-semibold text-gray-700">ID</th>
                      <th className="border border-gray-300 px-4 py-2 text-left text-sm font-semibold text-gray-700">FILE NAME</th>
                      <th className="border border-gray-300 px-4 py-2 text-left text-sm font-semibold text-gray-700">TYPE</th>
                      <th className="border border-gray-300 px-4 py-2 text-left text-sm font-semibold text-gray-700">SIZE</th>
                      <th className="border border-gray-300 px-4 py-2 text-left text-sm font-semibold text-gray-700">DATE</th>
                    </tr>
                  </thead>
                  <tbody>
                    {manuscriptFiles.map((file, index) => (
                      <tr key={file.id} className="hover:bg-gray-50">
                        <td className="border border-gray-300 px-4 py-2 text-sm">{index + 1}</td>
                        <td className="border border-gray-300 px-4 py-2 text-sm">{file.originalFileName}</td>
                        <td className="border border-gray-300 px-4 py-2 text-sm">{file.type}</td>
                        <td className="border border-gray-300 px-4 py-2 text-sm">{file.fileSize}</td>
                        <td className="border border-gray-300 px-4 py-2 text-sm">{file.dateUploaded}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      );
    }

    if (currentStep === 3) {
      return (
        <div className="space-y-8">
          {renderValidationErrors()}
          {renderValidationWarnings()}
          
          {/* Authors Section */}
          <div className="border-b pb-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Authors</h3>
            
            {authors.map((author, index) => (
              <div key={author.id} className="mb-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-semibold text-gray-700">
                    Author {index + 1}
                  </h4>
                  {authors.length > 1 && (
                    <button
                      onClick={() => deleteAuthor(author.id)}
                      className="text-red-600 hover:text-red-800 text-sm font-medium"
                    >
                      Delete Author
                    </button>
                  )}
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        First Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={author.firstName}
                        onChange={(e) => updateAuthor(author.id, 'firstName', e.target.value)}
                        className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Enter first name"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Middle Name
                      </label>
                      <input
                        type="text"
                        value={author.middleName}
                        onChange={(e) => updateAuthor(author.id, 'middleName', e.target.value)}
                        className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Enter middle name"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Last Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={author.lastName}
                        onChange={(e) => updateAuthor(author.id, 'lastName', e.target.value)}
                        className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Enter last name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        value={author.email}
                        onChange={(e) => updateAuthor(author.id, 'email', e.target.value)}
                        className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Enter email address"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Affiliation
                    </label>
                    <textarea
                      value={author.affiliation}
                      onChange={(e) => updateAuthor(author.id, 'affiliation', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      rows="2"
                      placeholder='Your institution, e.g. "Simon Fraser University"'
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Country
                    </label>
                    <select 
                      value={author.country}
                      onChange={(e) => updateAuthor(author.id, 'country', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
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
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Bio Statement
                    </label>
                    <p className="text-xs text-gray-500 mb-2">(E.g., department and rank)</p>
                    <textarea
                      value={author.bioStatement}
                      onChange={(e) => updateAuthor(author.id, 'bioStatement', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      rows="3"
                      placeholder="E.g., department and rank"
                    />
                  </div>

                  {authors.length > 1 && (
                    <div className="pt-2 border-t">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          checked={author.isPrincipal}
                          onChange={() => setPrincipalContact(author.id)}
                          className="w-4 h-4 text-indigo-600 focus:ring-indigo-500"
                        />
                        <span className="text-sm text-gray-700">
                          Principal contact for editorial correspondence.
                        </span>
                      </label>
                    </div>
                  )}
                </div>
              </div>
            ))}

            <button 
              onClick={addAuthor}
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium"
            >
              Add Author
            </button>
          </div>

          {/* Title and Abstract */}
          <div className="border-b pb-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Title and Abstract</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Enter manuscript title (max 20 words)"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Word count: {title.trim().split(/\s+/).filter(w => w).length} / 20 words
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Abstract <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={abstract}
                  onChange={(e) => setAbstract(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  rows="6"
                  placeholder="Enter abstract (250-300 words)"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Word count: {abstract.trim().split(/\s+/).filter(w => w).length} words (Required: 250-300)
                </p>
              </div>
            </div>
          </div>

          {/* Indexing */}
          <div className="border-b pb-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Indexing</h3>
            <p className="text-sm text-gray-600 mb-4">
              Provide terms for indexing the submission; separate terms with a semi-colon (term1; term2; term3).
            </p>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Keywords
                </label>
                <input
                  type="text"
                  value={keywords}
                  onChange={(e) => setKeywords(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="keyword1; keyword2; keyword3"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Language
                </label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="en">English</option>
                  <option value="fr">French</option>
                  <option value="es">Spanish</option>
                  <option value="de">German</option>
                  <option value="zh">Chinese</option>
                </select>
              </div>
            </div>
          </div>

          {/* Contributors and Supporting Agencies */}
          <div className="border-b pb-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Contributors and Supporting Agencies</h3>
            <p className="text-sm text-gray-600 mb-4">
              Identify agencies that made contributions or provided funding. Separate with semi-colons.
            </p>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Agencies
              </label>
              <input
                type="text"
                value={agencies}
                onChange={(e) => setAgencies(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Agency 1; Agency 2"
              />
            </div>
          </div>

          {/* References */}
          <div>
            <h3 className="text-xl font-bold text-gray-800 mb-4">References</h3>
            <p className="text-sm text-gray-600 mb-4">
              Provide a formatted list of references. Separate individual references with a blank line. Minimum 20 references required.
            </p>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                References <span className="text-red-500">*</span>
              </label>
              <textarea
                value={references}
                onChange={(e) => setReferences(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                rows="8"
                placeholder="Enter references here, separated by blank lines"
              />
              <p className="text-xs text-gray-500 mt-1">
                Reference count: {references.split('\n\n').filter(ref => ref.trim()).length} / 20 minimum
              </p>
            </div>
          </div>
        </div>
      );
    }

    if (currentStep === 4) {
      return (
        <div className="space-y-8">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-700">
              This optional step allows Supplementary Files to be added to a submission. The files can include research instruments, data sets, figures, tables, or other materials.
            </p>
          </div>

          <div className="border-b pb-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Supplementary Files</h3>
            
            {supplementaryFiles.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border border-gray-300 px-4 py-2 text-left text-sm font-semibold text-gray-700">ID</th>
                      <th className="border border-gray-300 px-4 py-2 text-left text-sm font-semibold text-gray-700">TITLE</th>
                      <th className="border border-gray-300 px-4 py-2 text-left text-sm font-semibold text-gray-700">ORIGINAL FILE NAME</th>
                      <th className="border border-gray-300 px-4 py-2 text-left text-sm font-semibold text-gray-700">DATE UPLOADED</th>
                      <th className="border border-gray-300 px-4 py-2 text-left text-sm font-semibold text-gray-700">ACTION</th>
                    </tr>
                  </thead>
                  <tbody>
                    {supplementaryFiles.map((file, index) => (
                      <tr key={file.id} className="hover:bg-gray-50">
                        <td className="border border-gray-300 px-4 py-2 text-sm">{index + 1}</td>
                        <td className="border border-gray-300 px-4 py-2 text-sm">{file.title}</td>
                        <td className="border border-gray-300 px-4 py-2 text-sm">{file.originalFileName}</td>
                        <td className="border border-gray-300 px-4 py-2 text-sm">{file.dateUploaded}</td>
                        <td className="border border-gray-300 px-4 py-2 text-sm">
                          <button
                            onClick={() => deleteSupplementaryFile(file.id)}
                            className="text-red-600 hover:text-red-800 font-medium"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-sm text-gray-600 italic">No supplementary files have been added to this submission.</p>
              </div>
            )}
          </div>

          <div>
            <div className="flex items-start gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload supplementary file
                </label>
                <input
                  type="file"
                  onChange={handleFileUpload}
                  className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (currentStep === 5) {
      const allFiles = getAllUploadedFiles();
      const handleSubmit = async () => {
        setIsSubmitting(true);
        try {
          console.log('Submitting manuscript:', formData);
          await new Promise(resolve => setTimeout(resolve, 2000));
          
          // CREATE SUBMISSION DATA OBJECT
          const submissionData = {
            id: Math.floor(Math.random() * 10000), // Generate random ID
            status: 'Awaiting assignment',
            submittedDate: new Date().toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            }),
            section: 'Articles',
            title: title,
            authors: authors.map(author => ({
              firstName: author.firstName,
              lastName: author.lastName,
              email: author.email,
              isPrincipal: author.isPrincipal
            })),
            abstract: abstract,
            keywords: formData.metadata.keywords ? 
              formData.metadata.keywords.split(';').map(k => k.trim()).filter(k => k) : 
              [],
            manuscriptFile: {
              name: manuscriptFiles[0]?.originalFileName || 'manuscript.pdf',
              size: manuscriptFiles[0]?.fileSize || '0 KB',
              uploadDate: new Date().toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })
            },
            supplementaryFiles: supplementaryFiles.map(file => ({
              name: file.originalFileName,
              size: file.file ? (file.file.size / 1024).toFixed(2) + ' KB' : 'N/A'
            }))
          };
          
          // CALL PARENT COMPONENT'S SUCCESS HANDLER
          if (onSubmitSuccess) {
            onSubmitSuccess(submissionData);
          } else {
            alert('Manuscript submitted successfully!');
          }
        } catch (error) {
          console.error('Submission error:', error);
          alert('Failed to submit manuscript. Please try again.');
        } finally {
          setIsSubmitting(false);
        }
      };
      
      return (
        <div className="space-y-8">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-700">
              To submit your manuscript, click <strong>Finish Submission</strong>. You will receive an acknowledgement by email and will be able to track your submission's progress.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-bold text-gray-800 mb-4">File Summary</h3>
            
            {allFiles.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border border-gray-300 px-4 py-2 text-left text-sm font-semibold text-gray-700">ID</th>
                      <th className="border border-gray-300 px-4 py-2 text-left text-sm font-semibold text-gray-700">ORIGINAL FILE NAME</th>
                      <th className="border border-gray-300 px-4 py-2 text-left text-sm font-semibold text-gray-700">TYPE</th>
                      <th className="border border-gray-300 px-4 py-2 text-left text-sm font-semibold text-gray-700">FILE SIZE</th>
                      <th className="border border-gray-300 px-4 py-2 text-left text-sm font-semibold text-gray-700">DATE UPLOADED</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allFiles.map((file, index) => (
                      <tr key={file.id} className="hover:bg-gray-50">
                        <td className="border border-gray-300 px-4 py-2 text-sm">{index + 1}</td>
                        <td className="border border-gray-300 px-4 py-2 text-sm">{file.originalFileName}</td>
                        <td className="border border-gray-300 px-4 py-2 text-sm">{file.type}</td>
                        <td className="border border-gray-300 px-4 py-2 text-sm">{file.fileSize}</td>
                        <td className="border border-gray-300 px-4 py-2 text-sm">{file.dateUploaded}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-sm text-gray-600 italic">No files have been attached to this submission.</p>
              </div>
            )}
          </div>

          <div className="flex gap-4 pt-6 border-t">
            <button
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-semibold flex items-center gap-2"
              onClick={handleSubmit}
              disabled={isValidating}
            >
              {isValidating ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  Submitting...
                </>
              ) : (
                'Finish Submission'
              )}
            </button>
            <button
              className="bg-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-400 transition-colors font-semibold"
              onClick={() => setCurrentStep(1)}
              disabled={isValidating}
            >
              Cancel
            </button>
          </div>
        </div>
      );
    }

    return null;
  };

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

        {/* Progress Bar */}
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

        {/* Step Cards */}
        <div className="grid grid-cols-5 gap-3 mb-8">
          {steps.map((step) => {
            const Icon = step.icon;
            const isCompleted = currentStep > step.id;
            const isCurrent = currentStep === step.id;
            
            return (
              <div
                key={step.id}
                className={`bg-white rounded-lg p-4 shadow-md border-2 transition-all duration-300 ${
                  isCurrent
                    ? 'border-indigo-600'
                    : isCompleted
                    ? 'border-green-500'
                    : 'border-gray-200'
                } opacity-${isCurrent || isCompleted ? '100' : '60'}`}
              >
                <div className="flex flex-col items-center text-center">
                  <div
                    className={`p-2 rounded-lg mb-2 ${
                      isCurrent
                        ? 'bg-indigo-100 text-indigo-600'
                        : isCompleted
                        ? 'bg-green-100 text-green-600'
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    <Icon size={20} />
                  </div>
                  <div className="mb-1">
                    <span className="text-xs font-semibold text-gray-500">
                      Step {step.id}
                    </span>
                  </div>
                  <h3 className="font-bold text-gray-800 text-sm mb-1">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 text-xs">{step.description}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Main Content Area */}
        <div className="bg-white rounded-xl p-8 shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Step {currentStep}. {steps[currentStep - 1].title}
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
            {renderStepContent()}
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8 pt-6 border-t">
            <button
              onClick={handleBack}
              disabled={currentStep === 1 || isValidating}
              className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                currentStep === 1 || isValidating
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-300 text-gray-700 hover:bg-gray-400'
              }`}
            >
              Previous
            </button>
            {currentStep < steps.length && (
              <button
                onClick={handleNext}
                disabled={!canProceed() || isValidating}
                className={`px-6 py-3 rounded-lg font-semibold transition-all flex items-center gap-2 ${
                  !canProceed() || isValidating
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-indigo-600 text-white hover:bg-indigo-700'
                }`}
              >
                {isValidating ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    Validating...
                  </>
                ) : (
                  <>
                    Save and Continue
                    <ChevronRight size={20} />
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
      {/* Update the Submission Modal section */}
      {showSubmissionForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 overflow-y-auto">
          <div className="min-h-screen flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-y-auto relative">
              <button
                onClick={() => setShowSubmissionForm(false)}
                className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-lg z-10"
              >
                <X className="w-6 h-6 text-gray-600" />
              </button>
              <SubmissionSteps onSubmitSuccess={handleSubmissionSuccess} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubmissionSteps;