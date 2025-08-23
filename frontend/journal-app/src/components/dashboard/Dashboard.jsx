import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  FileText, 
  CheckCircle, 
  Clock, 
  Upload, 
  Users, 
  CheckSquare, 
  Plus, 
  Search, 
  Filter, 
  AlertTriangle 
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import apiService from '../../services/apiService';
import ManuscriptCard from '../manuscripts/ManuscriptCard';
import ManuscriptSubmissionForm from '../manuscripts/ManuscriptSubmissionForm';

const Dashboard = () => {
  const { user, logout, currentRole, switchRole } = useAuth();
  const [manuscripts, setManuscripts] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [showSubmissionForm, setShowSubmissionForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [error, setError] = useState('');

  useEffect(() => {
    const loadDashboardData = async () => {
      setLoading(true);
      setError('');
      try {
        const [manuscriptsResponse, statsResponse] = await Promise.all([
          apiService.getManuscripts(),
          apiService.getUserStats()
        ]);
        
        setManuscripts(manuscriptsResponse.manuscripts || []);
        setStats(statsResponse.stats || {});
      } catch (error) {
        console.error('Failed to load dashboard data:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      loadDashboardData();
    }
  }, [user, currentRole]);

  const handleRoleSwitch = (newRole) => {
    switchRole(newRole);
  };

  const handleManuscriptSubmit = async () => {
    try {
      const [manuscriptsResponse, statsResponse] = await Promise.all([
        apiService.getManuscripts(),
        apiService.getUserStats()
      ]);
      
      setManuscripts(manuscriptsResponse.manuscripts || []);
      setStats(statsResponse.stats || {});
    } catch (error) {
      console.error('Failed to refresh data:', error);
    }
  };

  const filteredManuscripts = manuscripts.filter(manuscript => {
    const matchesSearch = manuscript.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         manuscript.authors.some(author => author.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || manuscript.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <BookOpen className="w-8 h-8 text-blue-600 mr-3" />
              <h1 className="text-xl font-bold text-gray-800">Journal Platform</h1>
            </div>
            
            <div className="flex items-center space-x-6">
              {/* Role Switcher */}
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => handleRoleSwitch('publisher')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    currentRole === 'publisher'
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  Publisher
                </button>
                <button
                  onClick={() => handleRoleSwitch('reviewer')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    currentRole === 'reviewer'
                      ? 'bg-purple-600 text-white'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  Reviewer
                </button>
              </div>

              <div className="flex items-center space-x-3">
                <span className="text-gray-700">Welcome, {user?.fullName}</span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  currentRole === 'reviewer' 
                    ? 'bg-purple-100 text-purple-800' 
                    : 'bg-blue-100 text-blue-800'
                }`}>
                  {currentRole}
                </span>
                <button
                  onClick={logout}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            <div className="flex items-center">
              <AlertTriangle className="w-5 h-5 mr-2" />
              {error}
            </div>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Manuscripts</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalManuscripts || 0}</p>
              </div>
            </div>
          </div>

          {currentRole === 'publisher' ? (
            <>
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Published</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.publishedManuscripts || 0}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-sm">
                <div className="flex items-center">
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <Clock className="w-6 h-6 text-yellow-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Under Review</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.underReview || 0}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-sm">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Upload className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Pending</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.pendingReviews || 0}</p>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <div className="flex items-center">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Users className="w-6 h-6 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Reviews</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalReviews || 0}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-sm">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <CheckSquare className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Completed</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.completedReviews || 0}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-sm">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Clock className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Pending</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.pendingReviews || 0}</p>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-lg shadow-sm">
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <h2 className="text-lg font-semibold text-gray-900">
                {currentRole === 'publisher' ? 'My Manuscripts' : 'Review Assignments'}
              </h2>
              
              {currentRole === 'publisher' && (
                <button
                  onClick={() => setShowSubmissionForm(true)}
                  className="mt-4 sm:mt-0 flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Submit New Manuscript
                </button>
              )}
            </div>

            {/* Search and Filter */}
            <div className="mt-4 flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search manuscripts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Status</option>
                  <option value="published">Published</option>
                  <option value="under_review">Under Review</option>
                  <option value="pending_review">Pending Review</option>
                  {currentRole === 'reviewer' && (
                    <option value="assigned">Assigned</option>
                  )}
                </select>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {filteredManuscripts.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filteredManuscripts.map((manuscript) => (
                  <ManuscriptCard 
                    key={manuscript.id} 
                    manuscript={manuscript} 
                    role={currentRole}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {currentRole === 'publisher' ? 'No manuscripts yet' : 'No reviews assigned'}
                </h3>
                <p className="text-gray-500 mb-4">
                  {currentRole === 'publisher' 
                    ? 'Get started by submitting your first manuscript' 
                    : 'Check back later for new review assignments'
                  }
                </p>
                {currentRole === 'publisher' && (
                  <button
                    onClick={() => setShowSubmissionForm(true)}
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Submit Manuscript
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Manuscript Submission Modal */}
      {showSubmissionForm && (
        <ManuscriptSubmissionForm
          onClose={() => setShowSubmissionForm(false)}
          onSubmit={handleManuscriptSubmit}
        />
      )}
    </div>
  );
};

export default Dashboard;