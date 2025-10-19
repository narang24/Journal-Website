import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, ChevronRight } from 'lucide-react';

const Step1Start = ({ formData, setFormData, validationErrors, setValidationErrors, steps }) => {
  const navigate = useNavigate();

  const handleChecklistChange = (field) => {
    setFormData(prev => ({
      ...prev,
      checklist: {
        ...prev.checklist,
        [field]: !prev.checklist[field]
      }
    }));
    if (validationErrors.checklist) {
      setValidationErrors(prev => ({ ...prev, checklist: '' }));
    }
  };

  const handleCopyrightChange = () => {
    setFormData(prev => ({
      ...prev,
      copyrightAgreed: !prev.copyrightAgreed
    }));
    if (validationErrors.copyright) {
      setValidationErrors(prev => ({ ...prev, copyright: '' }));
    }
  };

  const handleCommentsChange = (e) => {
    setFormData(prev => ({
      ...prev,
      comments: e.target.value
    }));
  };

  const validateStep = () => {
    const errors = {};
    const { original, fileFormat, references, formatting, guidelines, peerReview } = formData.checklist;
    
    if (!original || !fileFormat || !references || !formatting || !guidelines || !peerReview) {
      errors.checklist = 'Please confirm all items in the checklist';
    }
    
    if (!formData.copyrightAgreed) {
      errors.copyright = 'You must acknowledge the copyright notice';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNext = () => {
    if (validateStep()) {
      navigate('/submit-manuscript/upload');
    }
  };

  const isComplete = () => {
    const { original, fileFormat, references, formatting, guidelines, peerReview } = formData.checklist;
    return original && fileFormat && references && formatting && guidelines && peerReview && formData.copyrightAgreed;
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <div className="space-y-8">
          {/* Validation Errors */}
          {Object.keys(validationErrors).length > 0 && (
            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded flex items-start">
              <AlertTriangle className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-semibold mb-1">Please fix the following errors:</p>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  {Object.entries(validationErrors).map(([field, error]) => (
                    <li key={field}>{error}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}

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
                  checked={formData.checklist.original}
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
                  checked={formData.checklist.fileFormat}
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
                  checked={formData.checklist.references}
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
                  checked={formData.checklist.formatting}
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
                  checked={formData.checklist.guidelines}
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
                  checked={formData.checklist.peerReview}
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
                checked={formData.copyrightAgreed}
                onChange={handleCopyrightChange}
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
              value={formData.comments}
              onChange={handleCommentsChange}
              className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 min-h-[120px]"
              placeholder="Add any comments for the editor here..."
            />
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="mt-8 flex justify-between">
        <button
          onClick={() => navigate('/dashboard')}
          className="px-6 py-3 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
        >
          Cancel
        </button>

        <button
          onClick={handleNext}
          disabled={!isComplete()}
          className={`px-6 py-3 rounded-lg font-semibold transition-all flex items-center gap-2 ${
            isComplete()
              ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 shadow-lg'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          Save and Continue
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default Step1Start;