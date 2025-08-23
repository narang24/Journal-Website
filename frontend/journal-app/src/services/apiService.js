// API Configuration
const API_BASE_URL = 'http://localhost:8000/api';

// Real API service that connects to your backend
const apiService = {
  async request(endpoint, options = {}) {
    const token = localStorage.getItem('token');
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` })
      },
      ...options
    };

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
      const data = await response.json();

      if (!response.ok) {
        // Handle different error types from backend
        if (data.action === 'login') {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          throw new Error(data.message || 'Authentication required');
        }
        if (data.action === 'verify') {
          throw new Error(data.message || 'Email verification required');
        }
        if (data.action === 'signup') {
          throw new Error(data.message || 'Please sign up first');
        }
        throw new Error(data.message || 'Something went wrong');
      }

      return data;
    } catch (error) {
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error('Unable to connect to server. Please check if the backend is running.');
      }
      throw error;
    }
  },

  async login(credentials) {
    const response = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials)
    });
    return response;
  },
  
  async register(userData) {
    const response = await this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
    return response;
  },

  async getCurrentUser() {
    const response = await this.request('/auth/me');
    return response;
  },

  async logout() {
    const response = await this.request('/auth/logout', {
      method: 'POST'
    });
    return response;
  },

  async forgotPassword(email) {
    const response = await this.request('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email })
    });
    return response;
  },

  async resetPassword(token, password, confirmPassword) {
    const response = await this.request(`/auth/reset-password/${token}`, {
      method: 'POST',
      body: JSON.stringify({ password, confirmPassword })
    });
    return response;
  },

  async resendVerification(email) {
    const response = await this.request('/auth/resend-verification', {
      method: 'POST',
      body: JSON.stringify({ email })
    });
    return response;
  },

  async verifyEmail(token) {
    const response = await this.request(`/auth/verify-email/${token}`);
    return response;
  },

  // Manuscript endpoints
  async getManuscripts() {
    const response = await this.request('/manuscripts');
    return response;
  },

  async submitManuscript(manuscriptData) {
    const response = await this.request('/manuscripts', {
      method: 'POST',
      body: JSON.stringify(manuscriptData)
    });
    return response;
  },

  // User profile endpoints
  async getUserProfile() {
    const response = await this.request('/user/profile');
    return response;
  },

  async updateUserProfile(profileData) {
    const response = await this.request('/user/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData)
    });
    return response;
  },

  async getUserStats() {
    const response = await this.request('/user/stats');
    return response;
  },

  // Health check
  async healthCheck() {
    const response = await this.request('/health');
    return response;
  }
};

export default apiService;