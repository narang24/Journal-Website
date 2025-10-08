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
  AlertTriangle,
  TrendingUp,
  Globe,
  Calendar,
  Award,
  Eye,
  ThumbsUp,
  BarChart3,
  PieChart,
  Activity,
  CreditCard,
  MapPin,
  Edit,
  MoreHorizontal,
  X,
  User,
  Tag,
  UploadCloud
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext'; // Import the real useAuth hook
import ManuscriptSubmissionForm from '../manuscripts/ManuscriptSubmissionForm'

// Mock API Service
const apiService = {
  getManuscripts: async () => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    return {
      manuscripts: [
        {
          id: 1,
          title: "Advanced React Patterns in Modern Web Development",
          authors: ["John Doe", "Jane Smith"],
          status: "pending_review",
          submissionDate: "2024-01-15",
          tags: ["React", "Web Development", "JavaScript"],
          description: "This paper explores advanced React patterns and their applications in modern web development scenarios."
        },
        {
          id: 2,
          title: "Machine Learning Applications in Healthcare",
          authors: ["Alice Johnson"],
          status: "review_assigned",
          submissionDate: "2024-01-20",
          tags: ["Machine Learning", "Healthcare", "AI"],
          description: "A comprehensive study on ML applications in healthcare diagnostics and treatment optimization."
        }
      ]
    };
  },
  getUserStats: async () => {
    await new Promise(resolve => setTimeout(resolve, 800));
    return {
      stats: {
        totalManuscripts: 156,
        totalReviews: 89,
        completedReviews: 67,
        pendingReviews: 22,
        publishedManuscripts: 134,
        underReview: 15
      }
    };
  }
};

// Mock Manuscript Card Component
const ManuscriptCard = ({ manuscript, role }) => (
  <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-6 border border-gray-200 hover:shadow-md transition-all duration-300">
    <div className="flex items-start justify-between mb-4">
      <h3 className="font-semibold text-gray-800 text-lg leading-tight pr-4">
        {manuscript.title}
      </h3>
      <span className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
        manuscript.status === 'pending_review' 
          ? 'bg-blue-100 text-blue-800' 
          : manuscript.status === 'review_assigned'
          ? 'bg-purple-100 text-purple-800'
          : 'bg-gray-100 text-gray-800'
      }`}>
        {manuscript.status === 'pending_review' ? 'Pending Review' : 
         manuscript.status === 'review_assigned' ? 'Review Assigned' : 
         manuscript.status}
      </span>
    </div>
    
    <p className="text-gray-600 mb-4 text-sm">
      {manuscript.description}
    </p>
    
    <div className="flex items-center text-sm text-gray-500 mb-4">
      <Users className="w-4 h-4 mr-1" />
      <span>Authors: {manuscript.authors.join(', ')}</span>
    </div>
    
    <div className="flex items-center justify-between">
      <div className="flex flex-wrap gap-2">
        {manuscript.tags.map((tag, index) => (
          <span key={index} className="px-2 py-1 bg-white rounded-full text-xs text-gray-600 border">
            {tag}
          </span>
        ))}
      </div>
      <div className="flex space-x-2 ml-4">
        {role === 'reviewer' ? (
          <>
            <button className="flex items-center px-3 py-1 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
              <Eye className="w-4 h-4 mr-1" />
              Review
            </button>
            <button className="flex items-center px-3 py-1 text-green-600 hover:bg-green-50 rounded-lg transition-colors">
              <CheckCircle className="w-4 h-4 mr-1" />
              Accept
            </button>
          </>
        ) : (
          <>
            <button className="flex items-center px-3 py-1 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
              <Edit className="w-4 h-4 mr-1" />
              Edit
            </button>
            <button className="flex items-center px-3 py-1 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
              <Eye className="w-4 h-4 mr-1" />
              View
            </button>
          </>
        )}
      </div>
    </div>
    
    <div className="mt-4 pt-3 border-t border-gray-200 text-xs text-gray-500">
      Submitted: {manuscript.submissionDate}
    </div>
  </div>
);


const Dashboard = () => {
  const { user, logout, currentRole, switchRole } = useAuth(); // Use the real useAuth hook
  const [manuscripts, setManuscripts] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [showSubmissionForm, setShowSubmissionForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [error, setError] = useState('');
  const [roleState, setRoleState] = useState(currentRole || 'publisher');

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
        setError(error.message || 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [roleState]);

  const handleRoleSwitch = (newRole) => {
    setRoleState(newRole);
    switchRole(newRole);
  };

  const handleLogout = async () => {
    try {
      await logout(); // This will now use the real logout from AuthContext
    } catch (error) {
      console.error('Logout error:', error);
      // Even if there's an error, the logout should clear the auth state
      // and the routing will handle redirecting to login
    }
  };

  const handleManuscriptSubmit = async () => {
    try {
      const [manuscriptsResponse, statsResponse] = await Promise.all([
        apiService.getManuscripts(),
        apiService.getUserStats()
      ]);
      
      setManuscripts(manuscriptsResponse.manuscripts || []);
      setStats(statsResponse.stats || {});
      setShowSubmissionForm(false);
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

  const StatusCard = ({ title, value, change, icon: Icon, gradient, textColor = "text-white" }) => (
    <div className={`relative overflow-hidden rounded-2xl p-6 ${gradient} shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1`}>
      <div className="absolute top-0 right-0 w-32 h-32 opacity-10">
        <div className="w-full h-full bg-white rounded-full transform translate-x-8 -translate-y-8"></div>
      </div>
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className={`p-3 rounded-xl bg-white/20 backdrop-blur-sm`}>
            <Icon className={`w-6 h-6 ${textColor}`} />
          </div>
          {change && (
            <div className={`flex items-center ${textColor} text-sm font-medium`}>
              <TrendingUp className="w-4 h-4 mr-1" />
              {change}%
            </div>
          )}
        </div>
        <div className={`${textColor} text-3xl font-bold mb-1`}>
          {typeof value === 'number' && value > 1000 ? `${(value/1000).toFixed(1)}k` : value}
        </div>
        <div className={`${textColor} opacity-90 text-sm font-medium`}>
          {title}
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <nav className="bg-white/80 backdrop-blur-lg shadow-sm border-b border-white/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl mr-3">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-800">Journal Platform</h1>
            </div>
            
            <div className="flex items-center space-x-6">
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => handleRoleSwitch('publisher')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                    roleState === 'publisher'
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  Publisher
                </button>
                <button
                  onClick={() => handleRoleSwitch('reviewer')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                    roleState === 'reviewer'
                      ? 'bg-purple-600 text-white shadow-md'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  Reviewer
                </button>
              </div>

              <div className="flex items-center space-x-3">
                <span className="text-gray-700 font-medium">Welcome, {user?.fullName || 'User'}</span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  roleState === 'reviewer' 
                    ? 'bg-purple-100 text-purple-800' 
                    : 'bg-blue-100 text-blue-800'
                }`}>
                  {roleState}
                </span>
                <button 
                  onClick={handleLogout}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-all duration-200 font-medium"
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

        {/* Main Stats Cards */}
        <div className="mb-8">
          <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-700 mb-6">
              {roleState === 'publisher' ? 'Manuscript Distribution' : 'Review Distribution'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {roleState === 'publisher' ? (
                <>
                  <StatusCard 
                    title="Total Manuscripts"
                    value={stats.totalManuscripts || 0}
                    change={15}
                    icon={FileText}
                    gradient="bg-gradient-to-r from-blue-500 to-blue-600"
                  />
                  <StatusCard 
                    title="Published"
                    value={stats.publishedManuscripts || 0}
                    change={25}
                    icon={CheckCircle}
                    gradient="bg-gradient-to-r from-green-500 to-green-600"
                  />
                  <StatusCard 
                    title="Under Review"
                    value={stats.underReview || 0}
                    change={10}
                    icon={Clock}
                    gradient="bg-gradient-to-r from-yellow-500 to-yellow-600"
                  />
                  <StatusCard 
                    title="Pending"
                    value={stats.pendingReviews || 0}
                    change={8}
                    icon={Upload}
                    gradient="bg-gradient-to-r from-purple-500 to-purple-600"
                  />
                </>
              ) : (
                <>
                  <StatusCard 
                    title="Total Manuscripts"
                    value={stats.totalManuscripts || 0}
                    change={15}
                    icon={FileText}
                    gradient="bg-gradient-to-r from-blue-500 to-blue-600"
                  />
                  <StatusCard 
                    title="Total Reviews"
                    value={stats.totalReviews || 0}
                    change={25}
                    icon={Users}
                    gradient="bg-gradient-to-r from-purple-500 to-purple-600"
                  />
                  <StatusCard 
                    title="Completed"
                    value={stats.completedReviews || 0}
                    change={30}
                    icon={CheckSquare}
                    gradient="bg-gradient-to-r from-green-500 to-green-600"
                  />
                  <StatusCard 
                    title="Pending"
                    value={stats.pendingReviews || 0}
                    change={5}
                    icon={Clock}
                    gradient="bg-gradient-to-r from-orange-500 to-orange-600"
                  />
                </>
              )}
            </div>
          </div>
        </div>

        {/* Review/Manuscript Management Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <h2 className="text-lg font-semibold text-gray-900">
                {roleState === 'publisher' ? 'My Manuscripts' : 'Review Assignments'}
              </h2>
              
              {roleState === 'publisher' && (
                <button 
                  onClick={() => setShowSubmissionForm(true)}
                  className="mt-4 sm:mt-0 flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Submit New Manuscript
                </button>
              )}
            </div>

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
                  {roleState === 'reviewer' && (
                    <option value="assigned">Assigned</option>
                  )}
                </select>
              </div>
            </div>
          </div>

          <div className="p-6">
            {filteredManuscripts.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filteredManuscripts.map((manuscript) => (
                  <ManuscriptCard 
                    key={manuscript.id} 
                    manuscript={manuscript} 
                    role={roleState}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {roleState === 'publisher' ? 'No manuscripts yet' : 'No reviews assigned'}
                </h3>
                <p className="text-gray-500 mb-4">
                  {roleState === 'publisher' 
                    ? 'Get started by submitting your first manuscript' 
                    : 'Check back later for new review assignments'
                  }
                </p>
                {roleState === 'publisher' && (
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