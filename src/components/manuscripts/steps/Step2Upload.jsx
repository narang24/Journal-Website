import React from 'react'
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

const Step2Upload = ({ formData, handleFileUpload, errors }) => (
  <div className="space-y-6">
    <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
      <p className="text-sm text-gray-700">
        Upload the main manuscript file. The file should be in DOC, DOCX, RTF, or PDF format.
      </p>
    </div>

    {errors.manuscriptFile && (
      <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded flex items-center">
        <AlertTriangle className="w-5 h-5 mr-2 flex-shrink-0" />
        <span className="text-sm">{errors.manuscriptFile}</span>
      </div>
    )}

    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors bg-gray-50">
      <UploadCloud className="w-12 h-12 text-gray-400 mx-auto mb-3" />
      
      {formData.manuscriptFile ? (
        <div className="space-y-3">
          <div className="flex items-center justify-center space-x-2 text-green-600">
            <CheckCircle className="w-5 h-5" />
            <span className="font-medium text-sm">File uploaded successfully</span>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-3 inline-block">
            <div className="flex items-center space-x-3">
              <FileText className="w-8 h-8 text-blue-600" />
              <div className="text-left">
                <p className="font-medium text-gray-900 text-sm">{formData.manuscriptFile.name}</p>
                <p className="text-xs text-gray-500">
                  {(formData.manuscriptFile.size / 1024 / 1024).toFixed(2)} MB
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
              accept=".pdf,.doc,.docx,.rtf"
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
                accept=".pdf,.doc,.docx,.rtf"
                className="hidden"
              />
            </label>
          </p>
          <p className="text-xs text-gray-500">Accepted formats: DOC, DOCX, RTF, PDF (Max 20MB)</p>
        </div>
      )}
    </div>
  </div>
);

export default Step2Upload
