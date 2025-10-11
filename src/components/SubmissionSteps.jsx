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
  const [supplementaryFiles, setSupplementaryFiles] = useState([]);
  const [manuscriptFiles, setManuscriptFiles] = useState([]);
  const [title, setTitle] = useState('');
  const [abstract, setAbstract] = useState('');
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
      setManuscriptFiles([...manuscriptFiles, newFile]);
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

  const isStep1Complete = () => {
    return Object.values(checklist).every(val => val) && copyrightAgreed;
  };

  const isStep2Complete = () => {
    if (manuscriptFiles.length === 0) {
      return false;
    }
    return true;
  };

  const isStep3Complete = () => {
    // Check if at least one author has required fields filled
    const hasValidAuthor = authors.some(author => 
      author.firstName.trim() !== '' && 
      author.lastName.trim() !== '' && 
      author.email.trim() !== ''
    );
    
    // Check if title and abstract are filled
    if (!title.trim() || !abstract.trim()) {
      return false;
    }
    
    return hasValidAuthor;
  };

  const validateCurrentStep = () => {
    if (currentStep === 1) {
      if (!isStep1Complete()) {
        const missingItems = [];
        if (!Object.values(checklist).every(val => val)) {
          missingItems.push('• Complete all items in the Submission Checklist');
        }
        if (!copyrightAgreed) {
          missingItems.push('• Agree to the Copyright Notice');
        }
        alert('⚠️ Please complete the following required items:\n\n' + missingItems.join('\n'));
        return false;
      }
      return true;
    }
    
    if (currentStep === 2) {
      if (!isStep2Complete()) {
        alert('⚠️ Please upload your manuscript file before proceeding.');
        return false;
      }
      return true;
    }
    
    if (currentStep === 3) {
      if (!isStep3Complete()) {
        let missingFields = [];
        
        // Check author details
        const hasValidAuthor = authors.some(author => 
          author.firstName.trim() !== '' && 
          author.lastName.trim() !== '' && 
          author.email.trim() !== ''
        );
        
        if (!hasValidAuthor) {
          missingFields.push('• At least one author with First Name, Last Name, and Email');
        }
        
        if (!title.trim()) {
          missingFields.push('• Title');
        }
        
        if (!abstract.trim()) {
          missingFields.push('• Abstract');
        }
        
        alert('⚠️ Please fill in all required fields:\n\n' + missingFields.join('\n'));
        return false;
      }
      return true;
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

  const renderStepContent = () => {
    if (currentStep === 1) {
      return (
        <div className="space-y-8">
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

          {/* Privacy Statement */}
          <div className="border-b pb-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Journal's Privacy Statement</h3>
            <p className="text-sm text-gray-700 mb-3">
              All personal information collected (such as author names, emails, and affiliations) will be used only for submission handling, review coordination, and communication related to this demo journal.
            </p>
            <p className="text-sm text-gray-700">
              Data will <span className="font-semibold">not</span> be shared, sold, or used for any unrelated purpose. Information is stored securely and accessible only to authorized personnel involved in managing submissions.
            </p>
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
            <p className="text-xs text-gray-500 mt-2">* Denotes required field</p>
          </div>
        </div>
      );
    }

    if (currentStep === 2) {
      return (
        <div className="space-y-8">
          {/* Upload Instructions */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-700">
              Upload your manuscript file here. Accepted formats include Microsoft Word (.doc, .docx), PDF (.pdf), and OpenOffice (.odt) files.
            </p>
          </div>

          {/* Upload Section */}
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

          {/* Uploaded Files */}
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
                      <p className="text-xs text-gray-500 mb-2">
                        ↑ ↓ Reorder authors to appear in the order they will be listed on publication.
                      </p>
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
                  placeholder="Enter manuscript title"
                />
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
                  placeholder="Enter abstract"
                />
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
                  className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="keyword1; keyword2; keyword3"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Language
                </label>
                <input
                  type="text"
                  defaultValue="en"
                  className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  English=en; French=fr; Spanish=es
                </p>
              </div>
            </div>
          </div>

          {/* Contributors and Supporting Agencies */}
          <div className="border-b pb-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Contributors and Supporting Agencies</h3>
            <p className="text-sm text-gray-600 mb-4">
              Identify agencies (a person, an organization, or a service) that made contributions to the content or provided funding or support for the work presented in this submission. Separate them with a semi-colon (e.g. John Doe, Metro University; Master University, Department of Computer Science).
            </p>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Agencies
              </label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Agency 1; Agency 2"
              />
            </div>
          </div>

          {/* References */}
          <div>
            <h3 className="text-xl font-bold text-gray-800 mb-4">References</h3>
            <p className="text-sm text-gray-600 mb-4">
              Provide a formatted list of references for works cited in this submission. Please separate individual references with a blank line.
            </p>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                References
              </label>
              <textarea
                className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                rows="8"
                placeholder="Enter references here, separated by blank lines"
              />
            </div>
          </div>

          <p className="text-xs text-gray-500 pt-4 border-t">* Denotes required field</p>
        </div>
      );
    }

    if (currentStep === 4) {
      return (
        <div className="space-y-8">
          {/* Description */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-700">
              This optional step allows Supplementary Files to be added to a submission. The files, which can be in any format, might include (a) research instruments, (b) data sets, which comply with the terms of the study's research ethics review, (c) sources that otherwise would be unavailable to readers, (d) figures and tables that cannot be integrated into the text itself, or other materials that add to the contribution of the work.
            </p>
          </div>

          {/* Supplementary Files Table */}
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

          {/* Upload Section */}
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
              <div className="pt-7">
                <a 
                  href="#" 
                  className="text-blue-600 hover:underline text-sm font-medium whitespace-nowrap"
                >
                  ENSURING A BLIND REVIEW
                </a>
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (currentStep === 5) {
      const allFiles = getAllUploadedFiles();
      
      return (
        <div className="space-y-8">
          {/* Confirmation Message */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-700">
              To submit your manuscript, click <strong>Finish Submission</strong>. The principal contact will receive an acknowledgement by email and will be able to view the submission's progress through the editorial process by logging in to the journal web site. Thank you for your interest in publishing with us.
            </p>
          </div>

          {/* File Summary */}
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

          {/* Action Buttons */}
          <div className="flex gap-4 pt-6 border-t">
            <button
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-semibold"
              onClick={() => {
                alert('Submission completed successfully! You will receive a confirmation email shortly.');
              }}
            >
              Finish Submission
            </button>
            <button
              className="bg-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-400 transition-colors font-semibold"
              onClick={() => setCurrentStep(1)}
            >
              Cancel
            </button>
          </div>
        </div>
      );
    }

    if (currentStep === 5) {
      const allFiles = getAllUploadedFiles();
      
      return (
        <div className="space-y-8">
          {/* Confirmation Message */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-700">
              To submit your manuscript to <strong>International Journal of Engineering, Science and Information Technology</strong> click Finish Submission. The submission's principal contact will receive an acknowledgement by email and will be able to view the submission's progress through the editorial process by logging in to the journal web site. Thank you for your interest in publishing with International Journal of Engineering, Science and Information Technology.
            </p>
          </div>

          {/* File Summary */}
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

          {/* Action Buttons */}
          <div className="flex gap-4 pt-6 border-t">
            <button
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-semibold"
              onClick={() => {
                alert('Submission completed successfully!');
              }}
            >
              Finish Submission
            </button>
            <button
              className="bg-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-400 transition-colors font-semibold"
              onClick={() => setCurrentStep(1)}
            >
              Cancel
            </button>
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
                if (currentStep < steps.length && validateCurrentStep()) {
                  setCurrentStep(currentStep + 1);
                }
              }}
              disabled={currentStep === steps.length}
              className={`px-6 py-3 rounded-lg font-semibold transition-all flex items-center gap-2 ${
                currentStep === steps.length
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-indigo-600 text-white hover:bg-indigo-700'
              }`}
            >
              {currentStep === steps.length ? 'Review Submission' : 'Save and Continue'}
              {currentStep !== steps.length && <ChevronRight size={20} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubmissionSteps;