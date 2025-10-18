// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

const manuscriptService = {
  async request(endpoint, options = {}) {
    const token = localStorage.getItem('token');
    const config = {
      headers: {
        ...(token && { Authorization: `Bearer ${token}` })
      },
      ...options
    };

    // Don't set Content-Type for FormData - browser will set it automatically with boundary
    if (!(options.body instanceof FormData)) {
      config.headers['Content-Type'] = 'application/json';
    }

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Request failed');
      }

      return data;
    } catch (error) {
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error('Unable to connect to server. Please check if the backend is running.');
      }
      throw error;
    }
  },

  // Get validation requirements
  async getValidationRequirements() {
    const response = await this.request('/manuscripts/validation-requirements');
    return response;
  },

  // Validate manuscript without submitting
  async validateManuscript(manuscriptData, file) {
    const formData = new FormData();
    
    // Add file
    if (file) {
      formData.append('manuscriptFile', file);
    }
    
    // Add manuscript data as JSON string
    formData.append('data', JSON.stringify(manuscriptData));

    const response = await this.request('/manuscripts/validate', {
      method: 'POST',
      body: formData
    });

    return response;
  },

  // Submit manuscript
  async submitManuscript(manuscriptData, file, supplementaryFiles = []) {
    const formData = new FormData();
    
    // Add main manuscript file
    if (file) {
      formData.append('manuscriptFile', file);
    }
    
    // Add supplementary files
    supplementaryFiles.forEach((suppFile, index) => {
      formData.append(`supplementaryFile_${index}`, suppFile);
    });
    
    // Add manuscript data
    formData.append('data', JSON.stringify(manuscriptData));

    const response = await this.request('/manuscripts', {
      method: 'POST',
      body: formData
    });

    return response;
  },

  // Get user's manuscripts
  async getManuscripts(status = null) {
    const endpoint = status 
      ? `/manuscripts?status=${status}`
      : '/manuscripts';
    
    const response = await this.request(endpoint);
    return response;
  },

  // Get manuscript by ID
  async getManuscript(id) {
    const response = await this.request(`/manuscripts/${id}`);
    return response;
  },

  // Update manuscript
  async updateManuscript(id, manuscriptData, file = null) {
    const formData = new FormData();
    
    if (file) {
      formData.append('manuscriptFile', file);
    }
    
    formData.append('data', JSON.stringify(manuscriptData));

    const response = await this.request(`/manuscripts/${id}`, {
      method: 'PUT',
      body: formData
    });

    return response;
  },

  // Delete manuscript
  async deleteManuscript(id) {
    const response = await this.request(`/manuscripts/${id}`, {
      method: 'DELETE'
    });

    return response;
  },

  // Client-side validation helpers
  validateTitle(title) {
    const errors = [];
    
    if (!title || title.trim().length === 0) {
      errors.push('Title is required');
    } else {
      const wordCount = title.trim().split(/\s+/).length;
      if (wordCount > 20) {
        errors.push(`Title exceeds 20 words (current: ${wordCount} words)`);
      }
    }
    
    return errors;
  },

  // UPDATED: Abstract validation - REMOVED minimum word count
  validateAbstract(abstract) {
    const errors = [];
    
    if (!abstract || abstract.trim().length === 0) {
      errors.push('Abstract is required');
    } else {
      const wordCount = abstract.trim().split(/\s+/).length;
      if (wordCount > 300) {
        errors.push(`Abstract cannot exceed 300 words (current: ${wordCount} words)`);
      }
    }
    
    return errors;
  },

  validateAuthors(authors) {
    const errors = [];
    
    if (!authors || authors.length === 0) {
      errors.push('At least one author is required');
    } else {
      authors.forEach((author, index) => {
        if (!author.firstName || !author.lastName || !author.email) {
          errors.push(`Author ${index + 1} must have first name, last name, and email`);
        }
        
        // Validate email format
        if (author.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(author.email)) {
          errors.push(`Author ${index + 1} has invalid email format`);
        }
      });
      
      const hasPrincipal = authors.some(author => author.isPrincipal);
      if (!hasPrincipal) {
        errors.push('Principal contact must be designated');
      }
    }
    
    return errors;
  },

  // UPDATED: References validation - REMOVED minimum count requirement
  validateReferences(references) {
    const errors = [];
    
    // References are now optional - no minimum requirement
    // This method can be kept for backward compatibility or other checks
    
    return errors;
  },

  validateFile(file) {
    const errors = [];
    
    if (!file) {
      errors.push('Manuscript file is required');
      return errors;
    }
    
    // Check file type
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/rtf',
      'text/rtf'
    ];
    
    if (!allowedTypes.includes(file.type)) {
      errors.push('File must be in DOC, DOCX, PDF, or RTF format');
    }
    
    // Check file size (20MB)
    const maxSize = 20 * 1024 * 1024;
    if (file.size > maxSize) {
      errors.push(`File size must not exceed 20MB (current: ${(file.size / (1024 * 1024)).toFixed(2)}MB)`);
    }
    
    return errors;
  },

  validateChecklist(checklist) {
    const errors = [];
    
    const requiredChecks = [
      'originalWork',
      'correctFormat',
      'referencesValid',
      'properFormatting',
      'followsGuidelines',
      'blindReviewReady'
    ];
    
    for (const check of requiredChecks) {
      if (!checklist[check]) {
        errors.push(`Required checklist item not confirmed: ${check.replace(/([A-Z])/g, ' $1').toLowerCase()}`);
      }
    }
    
    return errors;
  },

  // Comprehensive validation
  validateManuscriptData(manuscriptData, file) {
    const allErrors = {
      title: this.validateTitle(manuscriptData.title),
      abstract: this.validateAbstract(manuscriptData.abstract),
      authors: this.validateAuthors(manuscriptData.authors),
      references: this.validateReferences(manuscriptData.references),
      file: this.validateFile(file),
      checklist: this.validateChecklist(manuscriptData.validationChecklist),
      copyright: []
    };
    
    if (!manuscriptData.copyrightAgreed) {
      allErrors.copyright.push('Copyright notice must be acknowledged');
    }
    
    // Flatten errors
    const flatErrors = [];
    Object.entries(allErrors).forEach(([field, errors]) => {
      errors.forEach(message => {
        flatErrors.push({ field, message });
      });
    });
    
    return {
      isValid: flatErrors.length === 0,
      errors: flatErrors,
      errorsByField: allErrors
    };
  }
};

export default manuscriptService;