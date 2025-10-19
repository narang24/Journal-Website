import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, ChevronRight, ChevronLeft, AlertCircle, Loader } from 'lucide-react';
import manuscriptService from '../../../services/manuscriptService';

const Step3Metadata = ({ 
  formData, 
  setFormData, 
  validationErrors, 
  setValidationErrors,
  validationWarnings,
  setValidationWarnings,
  steps 
}) => {
  const navigate = useNavigate();
  const [isValidating, setIsValidating] = React.useState(false);

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
    setFormData(prev => ({
      ...prev,
      authors: [...prev.authors, newAuthor]
    }));
  };

  const deleteAuthor = (id) => {
    if (formData.authors.length > 1) {
      setFormData(prev => ({
        ...prev,
        authors: prev.authors.filter(author => author.id !== id)
      }));
    }
  };

  const updateAuthor = (id, field, value) => {
    setFormData(prev => ({
      ...prev,
      authors: prev.authors.map(author => 
        author.id === id ? { ...author, [field]: value } : author
      )
    }));
  };

  const setPrincipalContact = (id) => {
    setFormData(prev => ({
      ...prev,
      authors: prev.authors.map(author => ({
        ...author,
        isPrincipal: author.id === id
      }))
    }));
  };

  const handleMetadataChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateStep = async () => {
    setIsValidating(true);
    const errors = {};
    const warnings = [];

    try {
      // Validate title
      const titleErrors = manuscriptService.validateTitle(formData.title);
      if (titleErrors.length > 0) {
        errors.title = titleErrors[0];
      }

      // Validate abstract
      const abstractErrors = manuscriptService.validateAbstract(formData.abstract);
      if (abstractErrors.length > 0) {
        errors.abstract = abstractErrors[0];
      }

      // Validate authors
      const authorErrors = manuscriptService.validateAuthors(formData.authors);
      if (authorErrors.length > 0) {
        errors.authors = authorErrors[0];
      }

      // Validate references
      const referencesArray = formData.references.split('\n\n').filter(ref => ref.trim());
      const referenceErrors = manuscriptService.validateReferences(referencesArray);
      if (referenceErrors.length > 0) {
        errors.references = referenceErrors[0];
      }

      // Check for keywords (warning only)
      if (!formData.keywords || formData.keywords.trim().length === 0) {
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

  const handleNext = async () => {
    const isValid = await validateStep();
    if (isValid) {
      navigate('/submit-manuscript/supplementary');
    }
  };

  const handleBack = () => {
    navigate('/submit-manuscript/upload');
  };

  const isComplete = () => {
    const hasValidAuthor = formData.authors.some(author => 
      author.firstName.trim() !== '' && 
      author.lastName.trim() !== '' && 
      author.email.trim() !== ''
    );
    
    return formData.title.trim() !== '' && 
           formData.abstract.trim() !== '' && 
           hasValidAuthor;
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <div className="space-y-8">
          {/* Validation Errors */}
          {Object.keys(validationErrors).length > 0 && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
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
          )}

          {/* Validation Warnings */}
          {validationWarnings.length > 0 && (
            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded">
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
          )}

          {/* Authors Section */}
          <div className="border-b pb-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Authors</h3>
            
            {formData.authors.map((author, index) => (
              <div key={author.id} className="mb-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-semibold text-gray-700">
                    Author {index + 1}
                  </h4>
                  {formData.authors.length > 1 && (
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

                  {formData.authors.length > 1 && (
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
                  value={formData.title}
                  onChange={(e) => handleMetadataChange('title', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Enter manuscript title (max 20 words)"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Word count: {formData.title.trim().split(/\s+/).filter(w => w).length} / 20 words
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Abstract <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.abstract}
                  onChange={(e) => handleMetadataChange('abstract', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  rows="6"
                  placeholder="Enter abstract (250-300 words)"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Word count: {formData.abstract.trim().split(/\s+/).filter(w => w).length} words (Required: 250-300)
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
                  value={formData.keywords}
                  onChange={(e) => handleMetadataChange('keywords', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="keyword1; keyword2; keyword3"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Language
                </label>
                <select
                  value={formData.language}
                  onChange={(e) => handleMetadataChange('language', e.target.value)}
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
                value={formData.agencies}
                onChange={(e) => handleMetadataChange('agencies', e.target.value)}
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
                value={formData.references}
                onChange={(e) => handleMetadataChange('references', e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                rows="8"
                placeholder="Enter references here, separated by blank lines"
              />
              <p className="text-xs text-gray-500 mt-1">
                Reference count: {formData.references.split('\n\n').filter(ref => ref.trim()).length} / 20 minimum
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="mt-8 flex justify-between">
        <button
          onClick={handleBack}
          className="px-6 py-3 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium flex items-center gap-2"
        >
          <ChevronLeft className="w-5 h-5" />
          Previous
        </button>

        <button
          onClick={handleNext}
          disabled={!isComplete() || isValidating}
          className={`px-6 py-3 rounded-lg font-semibold transition-all flex items-center gap-2 ${
            isComplete() && !isValidating
              ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 shadow-lg'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
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
              <ChevronRight className="w-5 h-5" />
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default Step3Metadata;