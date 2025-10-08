import React from 'react'

const Step4Supplementary = ({ formData, handleSupplementaryFileUpload, removeSupplementaryFile }) => (
  <div className="space-y-6">
    <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
      <p className="text-sm text-gray-700 mb-2">
        This optional step allows Supplementary Files to be added to a submission. The files, which can be in any format, might include:
      </p>
      <ul className="list-disc list-inside text-sm text-gray-700 space-y-1 ml-2">
        <li>Research instruments</li>
        <li>Data sets, which comply with the terms of the study's research ethics review</li>
        <li>Sources that otherwise would be unavailable to readers</li>
        <li>Figures and tables that cannot be integrated into the text itself</li>
        <li>Other materials that add to the contribution of the work</li>
      </ul>
    </div>

    {formData.supplementaryFiles.length > 0 ? (
      <div className="space-y-3">
        <div className="bg-white border border-gray-200 rounded">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-2 text-left font-medium text-gray-700">ID</th>
                <th className="px-4 py-2 text-left font-medium text-gray-700">Title</th>
                <th className="px-4 py-2 text-left font-medium text-gray-700">Original File Name</th>
                <th className="px-4 py-2 text-left font-medium text-gray-700">Date Uploaded</th>
                <th className="px-4 py-2 text-left font-medium text-gray-700">Action</th>
              </tr>
            </thead>
            <tbody>
              {formData.supplementaryFiles.map((file, index) => (
                <tr key={file.id} className="border-b border-gray-200">
                  <td className="px-4 py-3">{index + 1}</td>
                  <td className="px-4 py-3">{file.name}</td>
                  <td className="px-4 py-3">{file.name}</td>
                  <td className="px-4 py-3">{new Date().toLocaleDateString()}</td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => removeSupplementaryFile(file.id)}
                      className="text-red-600 hover:text-red-700 text-sm underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    ) : (
      <div className="bg-gray-50 border border-gray-200 rounded p-4 text-center">
        <p className="text-sm text-gray-600 italic">
          No supplementary files have been added to this submission.
        </p>
      </div>
    )}

    <div>
      <h4 className="text-sm font-medium text-gray-900 mb-3">Upload supplementary file</h4>
      <div className="flex items-center space-x-3">
        <label className="cursor-pointer">
          <span className="inline-block px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 text-sm rounded transition-colors">
            Choose File
          </span>
          <input
            type="file"
            onChange={handleSupplementaryFileUpload}
            className="hidden"
          />
        </label>
        <span className="text-sm text-gray-500">No file chosen</span>
      </div>
    </div>

    <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded">
      <p className="text-sm text-gray-700">
        <strong>Note:</strong> This step is optional. You can skip it by clicking "Save and continue" below.
      </p>
    </div>
  </div>
);

export default Step4Supplementary
