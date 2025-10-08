import React from 'react'

const Step3Metadata = ({ formData, handleMetadataChange, errors }) => (
  <div className="space-y-8">
    {/* Authors Section */}
    <div>
      <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">Authors</h3>
      
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              First Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Ram"
              value={formData.metadata.firstName}
              onChange={(e) => handleMetadataChange('firstName', e.target.value)}
              className={`w-full px-3 py-2 border rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm ${
                errors.firstName ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.firstName && (
              <p className="mt-1 text-xs text-red-600">{errors.firstName}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Middle Name</label>
            <input
              type="text"
              value={formData.metadata.middleName}
              onChange={(e) => handleMetadataChange('middleName', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Last Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Kumar"
              value={formData.metadata.lastName}
              onChange={(e) => handleMetadataChange('lastName', e.target.value)}
              className={`w-full px-3 py-2 border rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm ${
                errors.lastName ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.lastName && (
              <p className="mt-1 text-xs text-red-600">{errors.lastName}</p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            placeholder="officialnoobgaming710@gmail.com"
            value={formData.metadata.email}
            onChange={(e) => handleMetadataChange('email', e.target.value)}
            className={`w-full px-3 py-2 border rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm ${
              errors.email ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.email && (
            <p className="mt-1 text-xs text-red-600">{errors.email}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">ORCID iD</label>
          <input
            type="text"
            placeholder="http://orcid.org/0000-0002-1825-0097"
            value={formData.metadata.orcidId}
            onChange={(e) => handleMetadataChange('orcidId', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
          />
          <p className="mt-1 text-xs text-gray-500">
            ORCID iDs can only be assigned by the{' '}
            <a href="https://orcid.org" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
              ORCID Registry
            </a>
            . You must conform to their standards for expressing ORCID iDs, and include the full URI (eg. http://orcid.org/0000-0002-1825-0097).
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">URL</label>
          <input
            type="url"
            value={formData.metadata.url}
            onChange={(e) => handleMetadataChange('url', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Affiliation</label>
          <textarea
            placeholder='Your institution, e.g. "Simon Fraser University"'
            value={formData.metadata.affiliation}
            onChange={(e) => handleMetadataChange('affiliation', e.target.value)}
            rows="2"
            className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 resize-none text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
          <select
            value={formData.metadata.country}
            onChange={(e) => handleMetadataChange('country', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
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
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Bio Statement (E.g., department and rank)
          </label>
          <textarea
            value={formData.metadata.bioStatement}
            onChange={(e) => handleMetadataChange('bioStatement', e.target.value)}
            rows="3"
            className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 resize-none text-sm"
          />
        </div>
      </div>
    </div>

    {/* Title and Abstract */}
    <div>
      <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">Title and Abstract</h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.metadata.title}
            onChange={(e) => handleMetadataChange('title', e.target.value)}
            className={`w-full px-3 py-2 border rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm ${
              errors.title ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.title && (
            <p className="mt-1 text-xs text-red-600">{errors.title}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Abstract <span className="text-red-500">*</span>
          </label>
          <textarea
            value={formData.metadata.abstract}
            onChange={(e) => handleMetadataChange('abstract', e.target.value)}
            rows="6"
            className={`w-full px-3 py-2 border rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 resize-none text-sm ${
              errors.abstract ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.abstract && (
            <p className="mt-1 text-xs text-red-600">{errors.abstract}</p>
          )}
        </div>
      </div>
    </div>

    {/* Indexing */}
    <div>
      <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">Indexing</h3>
      <p className="text-sm text-gray-600 mb-4">
        Provide terms for indexing the submission; separate terms with a semi-colon (term1; term2; term3).
      </p>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Keywords</label>
          <input
            type="text"
            value={formData.metadata.keywords}
            onChange={(e) => handleMetadataChange('keywords', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Language</label>
          <select
            value={formData.metadata.language}
            onChange={(e) => handleMetadataChange('language', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
          >
            <option value="en">English</option>
            <option value="fr">French</option>
            <option value="es">Spanish</option>
            <option value="de">German</option>
            <option value="zh">Chinese</option>
          </select>
          <p className="mt-1 text-xs text-gray-500">English=en; French=fr; Spanish=es.</p>
        </div>
      </div>
    </div>

    {/* Contributors */}
    <div>
      <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">Contributors and Supporting Agencies</h3>
      <p className="text-sm text-gray-600 mb-4">
        Identify agencies (a person, an organization, or a service) that made contributions to the content or provided funding or support for the work presented in this submission. Separate them with a semi-colon (e.g. John Doe, Metro University; Master University, Department of Computer Science).
      </p>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Agencies</label>
        <input
          type="text"
          value={formData.metadata.agencies}
          onChange={(e) => handleMetadataChange('agencies', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
        />
      </div>
    </div>

    {/* References */}
    <div>
      <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">References</h3>
      <p className="text-sm text-gray-600 mb-4">
        Provide a formatted list of references for works cited in this submission. Please separate individual references with a blank line.
      </p>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">References</label>
        <textarea
          value={formData.metadata.references}
          onChange={(e) => handleMetadataChange('references', e.target.value)}
          rows="6"
          className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 resize-none text-sm"
        />
      </div>
    </div>
  </div>
);

export default Step3Metadata
