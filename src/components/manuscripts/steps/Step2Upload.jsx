import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, ChevronRight, ChevronLeft, FileText, CheckCircle, UploadCloud } from 'lucide-react';
import manuscriptService from '../../../services/manuscriptService';

const Step2Upload = ({ formData, setFormData, validationErrors, setValidationErrors, steps }) => {
  const navigate = useNavigate();

  const handleFileUpload = (event) => {
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
      
      setFormData(prev => ({
        ...prev,
        manuscriptFiles: [newFile]
      }));
      event.target.value = null;
    }
  };

  const validateStep = () => {
    const errors = {};
    
    if (formData.manuscriptFiles.length === 0) {
      errors.manuscriptFile = 'Please upload your manuscript file';
    } else {
      const fileErrors = manuscriptService.validateFile(formData.manuscriptFiles[0].file);
      if (fileErrors.length > 0) {
        errors.manuscriptFile = fileErrors[0];
      }
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNext = () => {
    if (validateStep()) {
      navigate('/submit-manuscript/metadata');
    }
  };

  const handleBack = () => {
    navigate('/submit-manuscript/start');
  };

  const isComplete = () => {
    return formData.manuscriptFiles.length > 0;
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <div className="space-y-8">
          {/* Info Banner */}
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
            <p className="text-sm text-gray-700">
              Upload your manuscript file here. Accepted formats include Microsoft Word (.doc, .docx), PDF (.pdf), and OpenOffice (.odt) files. Maximum file size: 20MB.
            </p>
          </div>

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

          {/* Upload Section */}
          <div className="border-b pb-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Upload Manuscript</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select manuscript file <span className="text-red-500">*</span>
              </label>
              
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors bg-gray-50">
                <UploadCloud className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                
                {formData.manuscriptFiles.length > 0 ? (
                  <div className="space-y-3">
                    <div className="flex items-center justify-center space-x-2 text-green-600">
                      <CheckCircle className="w-5 h-5" />
                      <span className="font-medium text-sm">File uploaded successfully</span>
                    </div>
                    <div className="bg-white border border-gray-200 rounded-lg p-3 inline-block">
                      <div className="flex items-center space-x-3">
                        <FileText className="w-8 h-8 text-blue-600" />
                        <div className="text-left">
                          <p className="font-medium text-gray-900 text-sm">{formData.manuscriptFiles[0].originalFileName}</p>
                          <p className="text-xs text-gray-500">
                            {formData.manuscriptFiles[0].fileSize}
                          </p>
                        </div>
                      </div>
                    </div>
                    <label className="cursor-pointer inline-block">
                      <span className="text-blue-600 hover:text-blue-700 font-medium text-sm underline">
                        Choose a different file
                      </span>
                      <input
                        type="file"
                        onChange={handleFileUpload}
                        accept=".pdf,.doc,.docx,.odt"
                        className="hidden"
                      />
                    </label>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <p className="text-gray-600 text-sm">
                      <label className="text-blue-600 hover:text-blue-700 font-medium cursor-pointer underline">
                        Choose File
                        <input
                          type="file"
                          onChange={handleFileUpload}
                          accept=".pdf,.doc,.docx,.odt"
                          className="hidden"
                        />
                      </label>
                    </p>
                    <p className="text-xs text-gray-500">Accepted formats: DOC, DOCX, PDF, ODT (Max 20MB)</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Uploaded Files Table */}
          {formData.manuscriptFiles.length > 0 && (
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
                    {formData.manuscriptFiles.map((file, index) => (
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

export default Step2Upload;