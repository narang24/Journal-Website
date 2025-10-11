import React, { useState } from 'react';
import { ChevronRight, FileText, Upload, FileEdit, FolderPlus, CheckCircle, AlertCircle } from 'lucide-react';

const SubmissionSteps = () => {
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
  const [uploadedFile, setUploadedFile] = useState(null);
  const [fileError, setFileError] = useState('');

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

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const validFormats = ['.doc', '.docx', '.pdf', '.odt'];
      const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
      
      if (!validFormats.includes(fileExtension)) {
        setFileError('Invalid file format. Please upload a Word, PDF, or OpenOffice document.');
        setUploadedFile(null);
        return;
      }

      if (file.size > 10 * 1024 * 1024) {
        setFileError('File size exceeds 10MB limit.');
        setUploadedFile(null);
        return;
      }

      setFileError('');
      setUploadedFile(file);
    }
  };

  const removeFile = () => {
    setUploadedFile(null);
    setFileError('');
  };

  const isStep1Complete = () => {
    return Object.values(checklist).every(val => val) && copyrightAgreed;
  };

  const canProceed = () => {
    if (currentStep === 1) {
      return isStep1Complete();
    }
    if (currentStep === 2) {
      return uploadedFile !== null;
    }
    return true;
  };

  const renderStepContent = () => {
    if (currentStep === 1) {
      return (
        <div className="space-y-8">
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
                <p className="mb-2">
                  In a real-world journal, this license allows others to share, adapt, and distribute the work with appropriate credit to the author(s) and the journal.
                </p>
                <p className="italic text-gray-600">
                  (Note: This clone version is for educational or testing purposes only and does not represent a legally binding license.)
                </p>
              </div>

              <div>
                <h4 className="font-semibold mb-2">2. Author Responsibilities</h4>
                <p>
                  Authors confirm that their submission is original, does not infringe on existing copyrights, and has not been submitted elsewhere. Authors are responsible for obtaining permissions to reproduce any copyrighted materials included in their manuscripts.
                </p>
              </div>

              <div>
                <h4 className="font-semibold mb-2">3. Rights of Authors</h4>
                <p className="mb-2">Authors retain the rights to their work and may:</p>
                <ul className="list-disc ml-6 space-y-1">
                  <li>Reuse the content for academic or educational purposes.</li>
                  <li>Deposit their work in institutional repositories or personal websites with proper acknowledgment.</li>
                  <li>Incorporate the published version in theses, books, or presentations.</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-2">4. Royalties</h4>
                <p>
                  No royalties or financial compensation are provided for publication. The author grants this demo journal a non-exclusive right to display and distribute their work for educational or illustrative purposes.
                </p>
              </div>

              <div>
                <h4 className="font-semibold mb-2">5. Agreement</h4>
                <p>
                  By submitting a manuscript, authors acknowledge and agree to these terms for demonstration or testing use within this platform.
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
                I acknowledge and agree to the terms of this Copyright Notice for demonstration or testing purposes.
              </span>
            </label>
          </div>

          <div className="border-b pb-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Journal's Privacy Statement</h3>
            <p className="text-sm text-gray-700 mb-3">
              All personal information collected (such as author names, emails, and affiliations) will be used only for submission handling, review coordination, and communication related to this demo journal.
            </p>
            <p className="text-sm text-gray-700">
              Data will <span className="font-semibold">not</span> be shared, sold, or used for any unrelated purpose. Information is stored securely and accessible only to authorized personnel involved in managing submissions.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-bold text-gray-800 mb-4">Comments for the Editor</h3>
            <p className="text-sm text-gray-600 mb-2">Enter text (optional)</p>
            <textarea
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 min-h-[120px]"
              placeholder="Add any comments for the editor here..."
            />
            <p className="text-xs text-gray-500 mt-2">* Denotes required field</p>
          </div>
        </div>
      );
    }

    if (currentStep === 2) {
      return (
        <div className="space-y-8">
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
            <h3 className="font-semibold text-gray-800 mb-3">To upload a manuscript to this journal, complete the following steps:</h3>
            <ol className="list-decimal ml-5 space-y-2 text-sm text-gray-700">
              <li>Click <span className="font-semibold">Browse</span> (or Choose File) to open a file selection window.</li>
              <li>Locate the file you wish to submit and select it.</li>
              <li>Click <span className="font-semibold">Open</span> to confirm your selection.</li>
              <li>Click <span className="font-semibold">Upload</span> to transfer the file to the journal's system.</li>
              <li>Once uploaded successfully, click <span className="font-semibold">Save and Continue</span> at the bottom.</li>
            </ol>
            <p className="text-sm text-gray-600 mt-3">
              Encountering difficulties? Contact{' '}
              <a href="#" className="text-blue-600 hover:underline font-medium">Managing Editor</a>{' '}
              for assistance.
            </p>
          </div>

          <div className="border rounded-lg p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Submission File</h3>
            
            {!uploadedFile ? (
              <div className="space-y-4">
                <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <Upload className="mx-auto mb-4 text-gray-400" size={48} />
                  <p className="text-sm text-gray-600 mb-4">No submission file uploaded.</p>
                  <label className="inline-block">
                    <input
                      type="file"
                      onChange={handleFileUpload}
                      accept=".doc,.docx,.pdf,.odt"
                      className="hidden"
                      id="file-upload"
                    />
                    <span className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 cursor-pointer inline-flex items-center gap-2">
                      <Upload size={18} />
                      Choose File
                    </span>
                  </label>
                  <p className="text-xs text-gray-500 mt-3">
                    Accepted formats: DOC, DOCX, PDF, ODT (Max 10MB)
                  </p>
                </div>

                {fileError && (
                  <div className="bg-red-50 border-l-4 border-red-500 p-4 flex items-start gap-3">
                    <AlertCircle className="text-red-500 flex-shrink-0" size={20} />
                    <p className="text-sm text-red-700">{fileError}</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-green-50 border-l-4 border-green-500 p-4 flex items-start gap-3">
                  <CheckCircle className="text-green-500 flex-shrink-0" size={20} />
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-800 mb-1">File uploaded successfully!</p>
                    <p className="text-sm text-gray-700">{uploadedFile.name}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Size: {(uploadedFile.size / 1024).toFixed(2)} KB
                    </p>
                  </div>
                  <button
                    onClick={removeFile}
                    className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200"
                  >
                    Remove
                  </button>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <FileText className="text-blue-600 flex-shrink-0 mt-1" size={24} />
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2">Ensuring a Blind Review</h4>
                      <p className="text-sm text-gray-700 mb-2">
                        If you are submitting to a peer-reviewed section, ensure your manuscript is prepared for blind review:
                      </p>
                      <ul className="list-disc ml-5 text-sm text-gray-700 space-y-1">
                        <li>Remove author names from the manuscript text</li>
                        <li>Replace author references with "[Author]" in citations</li>
                        <li>Remove identifying information from document properties</li>
                        <li>Ensure acknowledgments don't reveal author identity</li>
                      </ul>
                      <a href="#" className="text-blue-600 hover:underline text-sm font-medium mt-2 inline-block">
                        Learn more about blind review preparation →
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="bg-gray-50 rounded-lg p-6">
            <h4 className="font-semibold text-gray-800 mb-3">Submission Guidelines</h4>
            <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-700">
              <div>
                <p className="font-medium mb-2">✓ Accepted File Formats:</p>
                <ul className="ml-4 space-y-1">
                  <li>• Microsoft Word (.doc, .docx)</li>
                  <li>• PDF (.pdf)</li>
                  <li>• OpenOffice (.odt)</li>
                </ul>
              </div>
              <div>
                <p className="font-medium mb-2">✓ File Requirements:</p>
                <ul className="ml-4 space-y-1">
                  <li>• Maximum file size: 10MB</li>
                  <li>• Double-spaced text</li>
                  <li>• 12pt Times New Roman font</li>
                  <li>• Figures/tables included in text</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-[200px] flex items-center justify-center text-gray-400">
        <div className="text-center">
          <p className="text-lg mb-2">Step {currentStep} content will be added here</p>
          <p className="text-sm">
            This area will contain forms and functionality for step {currentStep}
          </p>
        </div>
      </div>
    );
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

          <div className="flex justify-between mt-8 pt-6 border-t">
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
              onClick={() => {
                if (canProceed()) {
                  setCurrentStep(Math.min(steps.length, currentStep + 1));
                }
              }}
              disabled={currentStep === steps.length || !canProceed()}
              className={`px-6 py-3 rounded-lg font-semibold transition-all flex items-center gap-2 ${
                currentStep === steps.length || !canProceed()
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-indigo-600 text-white hover:bg-indigo-700'
              }`}
            >
              {currentStep === steps.length ? 'Completed' : 'Save and Continue'}
              {currentStep !== steps.length && <ChevronRight size={20} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubmissionSteps;