import React from 'react'

const Step1Start = ({ formData, handleChecklistChange, errors }) => (
  <div className="space-y-6">
    <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
      <p className="text-sm text-gray-700">
        The submission process requires that you check each of the following items before proceeding.
      </p>
    </div>

    {errors.checklist && (
      <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded flex items-center">
        <AlertTriangle className="w-5 h-5 mr-2 flex-shrink-0" />
        <span className="text-sm">{errors.checklist}</span>
      </div>
    )}

    <div className="space-y-4">
      <div className="flex items-start space-x-3">
        <input
          type="checkbox"
          id="submissionChecklist"
          checked={formData.checklist.submissionChecklist}
          onChange={() => handleChecklistChange('submissionChecklist')}
          className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500 mt-0.5 flex-shrink-0"
        />
        <label htmlFor="submissionChecklist" className="text-sm text-gray-700 cursor-pointer">
          The submission has not been previously published, nor is it before another journal for consideration (or an explanation has been provided in Comments to the Editor).
        </label>
      </div>

      <div className="flex items-start space-x-3">
        <input
          type="checkbox"
          id="copyrightNotice"
          checked={formData.checklist.copyrightNotice}
          onChange={() => handleChecklistChange('copyrightNotice')}
          className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500 mt-0.5 flex-shrink-0"
        />
        <label htmlFor="copyrightNotice" className="text-sm text-gray-700 cursor-pointer">
          The submission file is in OpenOffice, Microsoft Word, or RTF document file format.
        </label>
      </div>

      <div className="flex items-start space-x-3">
        <input
          type="checkbox"
          id="privacyStatement"
          checked={formData.checklist.privacyStatement}
          onChange={() => handleChecklistChange('privacyStatement')}
          className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500 mt-0.5 flex-shrink-0"
        />
        <label htmlFor="privacyStatement" className="text-sm text-gray-700 cursor-pointer">
          Where available, URLs for the references have been provided.
        </label>
      </div>

      <div className="flex items-start space-x-3">
        <input
          type="checkbox"
          id="formatting"
          checked={formData.checklist.formatting || false}
          onChange={() => handleChecklistChange('formatting')}
          className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500 mt-0.5 flex-shrink-0"
        />
        <label htmlFor="formatting" className="text-sm text-gray-700 cursor-pointer">
          The text adheres to the stylistic and bibliographic requirements outlined in the Author Guidelines.
        </label>
      </div>
    </div>

    <div className="bg-gray-50 border border-gray-200 rounded p-4 mt-6">
      <h4 className="font-semibold text-gray-900 mb-2 text-sm">Copyright Notice</h4>
      <p className="text-xs text-gray-600 leading-relaxed">
        Authors who publish with this journal agree to retain copyright and grant the journal right of first publication with the work simultaneously licensed under a Creative Commons Attribution License that allows others to share the work with an acknowledgement of the work's authorship and initial publication in this journal.
      </p>
    </div>

    <div className="bg-gray-50 border border-gray-200 rounded p-4">
      <h4 className="font-semibold text-gray-900 mb-2 text-sm">Privacy Statement</h4>
      <p className="text-xs text-gray-600 leading-relaxed">
        The names and email addresses entered in this journal site will be used exclusively for the stated purposes of this journal and will not be made available for any other purpose or to any other party.
      </p>
    </div>
  </div>
);

export default Step1Start
