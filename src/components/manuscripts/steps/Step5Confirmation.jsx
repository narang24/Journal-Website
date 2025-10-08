import React from 'react'

const Step5Confirmation = ({ formData }) => (
  <div className="space-y-6">
    <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
      <h3 className="font-semibold text-gray-900 mb-2">Review Your Submission</h3>
      <p className="text-sm text-gray-700">
        Please review all the information below. You can go back to previous steps to make any changes before final submission.
      </p>
    </div>

    {/* Author Information */}
    <div className="bg-white border border-gray-200 rounded p-4">
      <h4 className="font-semibold text-gray-900 mb-3 flex items-center text-sm">
        <User className="w-4 h-4 text-blue-600 mr-2" />
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
        {formData.metadata.affiliation && (
          <div className="md:col-span-2">
            <span className="text-gray-600">Affiliation:</span>
            <p className="font-medium text-gray-900">{formData.metadata.affiliation}</p>
          </div>
        )}
        {formData.metadata.country && (
          <div>
            <span className="text-gray-600">Country:</span>
            <p className="font-medium text-gray-900">{formData.metadata.country}</p>
          </div>
        )}
      </div>
    </div>

    {/* Manuscript File */}
    <div className="bg-white border border-gray-200 rounded p-4">
      <h4 className="font-semibold text-gray-900 mb-3 flex items-center text-sm">
        <FileText className="w-4 h-4 text-blue-600 mr-2" />
        Manuscript File
      </h4>
      {formData.manuscriptFile ? (
        <div className="flex items-center space-x-3 bg-gray-50 p-3 rounded">
          <FileText className="w-8 h-8 text-blue-600" />
          <div>
            <p className="font-medium text-gray-900 text-sm">{formData.manuscriptFile.name}</p>
            <p className="text-xs text-gray-500">
              {(formData.manuscriptFile.size / 1024 / 1024).toFixed(2)} MB
            </p>
          </div>
        </div>
      ) : (
        <p className="text-sm text-gray-500">No file uploaded</p>
      )}
    </div>

    {/* Manuscript Details */}
    <div className="bg-white border border-gray-200 rounded p-4">
      <h4 className="font-semibold text-gray-900 mb-3 flex items-center text-sm">
        <FileText className="w-4 h-4 text-indigo-600 mr-2" />
        Manuscript Details
      </h4>
      <div className="space-y-3 text-sm">
        {formData.metadata.title && (
          <div>
            <span className="text-gray-600 block mb-1">Title:</span>
            <p className="font-medium text-gray-900">{formData.metadata.title}</p>
          </div>
        )}
        {formData.metadata.abstract && (
          <div>
            <span className="text-gray-600 block mb-1">Abstract:</span>
            <p className="text-gray-700 line-clamp-4">{formData.metadata.abstract}</p>
          </div>
        )}
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
      <div className="bg-white border border-gray-200 rounded p-4">
        <h4 className="font-semibold text-gray-900 mb-3 flex items-center text-sm">
          <Upload className="w-4 h-4 text-orange-600 mr-2" />
          Supplementary Files ({formData.supplementaryFiles.length})
        </h4>
        <div className="space-y-2">
          {formData.supplementaryFiles.map((file) => (
            <div key={file.id} className="flex items-center space-x-3 bg-gray-50 p-2 rounded">
              <FileText className="w-6 h-6 text-blue-600" />
              <p className="text-sm font-medium text-gray-900">{file.name}</p>
            </div>
          ))}
        </div>
      </div>
    )}

    <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
      <p className="text-sm text-gray-700">
        <strong>Ready to submit?</strong> Click "Finish Submission" to complete your submission. You will receive a confirmation email once processed.
      </p>
    </div>
  </div>
);

export default Step5Confirmation
