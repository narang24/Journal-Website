import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Routes, Route } from 'react-router-dom';
import { 
  BookOpen, 
  FileText, 
  CheckCircle, 
  Clock, 
  Upload, 
  Users, 
  Plus, 
  Search, 
  Filter, 
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Bell,
  ArrowRight,
  BarChart3,
  Activity,
  Calendar,
  Eye,
  Edit,
  User
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import SubmissionDetailView from '../submissions/SubmissionDetailView';
import Sidebar from '../Sidebar';

// Mock API Service
const apiService = {
  getManuscripts: async () => {
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
          description: "This paper explores advanced React patterns and their applications in modern web development scenarios.",
          progress: 65
        },
        {
          id: 2,
          title: "Machine Learning Applications in Healthcare",
          authors: ["Alice Johnson"],
          status: "review_assigned",
          submissionDate: "2024-01-20",
          tags: ["Machine Learning", "Healthcare", "AI"],
          description: "A comprehensive study on ML applications in healthcare diagnostics and treatment optimization.",
          progress: 80
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
        underReview: 15,
        draftArticles: 4
      }
    };
  }
};

// Enhanced Stat Card
const StatCard = ({ title, value, change, changeType, icon: Icon, gradient }) => (
  <div className={`relative overflow-hidden rounded-2xl p-6 ${gradient} shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1`}>
    <div className="absolute top-0 right-0 w-32 h-32 opacity-10">
      <div className="w-full h-full bg-white rounded-full transform translate-x-8 -translate-y-8"></div>
    </div>
    <div className="relative z-10">
      <div className="flex items-center justify-between mb-4">
        <div className="p-3 rounded-xl bg-white/20 backdrop-blur-sm">
          <Icon className="w-6 h-6 text-white" />
        </div>
        {change && (
          <div className={`flex items-center text-white text-sm font-medium px-3 py-1 rounded-full bg-white/20`}>
            {changeType === 'up' ? (
              <TrendingUp className="w-4 h-4 mr-1" />
            ) : (
              <TrendingDown className="w-4 h-4 mr-1" />
            )}
            {change}
          </div>
        )}
      </div>
      <div className="text-white text-4xl font-bold mb-2">{value}</div>
      <div className="text-white/90 text-sm font-medium">{title}</div>
    </div>
  </div>
);

// Alert Card
const AlertCard = ({ alert, onDismiss }) => {
  const alertStyles = {
    urgent: 'bg-red-50 border-red-300 text-red-800',
    warning: 'bg-orange-50 border-orange-300 text-orange-800',
    info: 'bg-blue-50 border-blue-300 text-blue-800'
  };

  const alertIcons = {
    urgent: AlertTriangle,
    warning: Clock,
    info: Bell
  };

  const Icon = alertIcons[alert.type] || Bell;

  return (
    <div className={`p-4 rounded-xl border-2 ${alertStyles[alert.type]} mb-3 hover:shadow-md transition-all`}>
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3">
          <Icon className="w-5 h-5 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-semibold text-sm mb-1">{alert.title}</h4>
            <p className="text-xs opacity-90">{alert.message}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Manuscript Card (Compact)
const ManuscriptCardCompact = ({ manuscript, role }) => {
  const statusColors = {
    pending_review: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    review_assigned: 'bg-blue-100 text-blue-800 border-blue-200',
    revision_required: 'bg-orange-100 text-orange-800 border-orange-200',
    published: 'bg-green-100 text-green-800 border-green-200'
  };

  return (
    <div className="bg-white rounded-xl p-5 border-2 border-gray-100 hover:border-blue-300 hover:shadow-lg transition-all">
      <div className="flex items-start justify-between mb-3">
        <h3 className="font-semibold text-gray-900 text-sm line-clamp-2 flex-1 pr-2">
          {manuscript.title}
        </h3>
        <span className={`px-2 py-1 rounded-lg text-xs font-medium whitespace-nowrap border ${statusColors[manuscript.status]}`}>
          {manuscript.status.replace('_', ' ')}
        </span>
      </div>
      
      <div className="flex items-center text-xs text-gray-500 mb-3">
        <Users className="w-3 h-3 mr-1" />
        <span className="truncate">{manuscript.authors.join(', ')}</span>
      </div>
      
      <div className="mb-3">
        <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
          <span>Progress</span>
          <span className="font-semibold">{manuscript.progress}%</span>
        </div>
        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-300"
            style={{ width: `${manuscript.progress}%` }}
          />
        </div>
      </div>
      
      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
        <span className="text-xs text-gray-500">{manuscript.submissionDate}</span>
        <div className="flex space-x-2">
          {role === 'reviewer' ? (
            <>
              <button className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                <Eye className="w-4 h-4" />
              </button>
              <button className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                <CheckCircle className="w-4 h-4" />
              </button>
            </>
          ) : (
            <>
              <button className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                <Edit className="w-4 h-4" />
              </button>
              <button className="p-1.5 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                <Eye className="w-4 h-4" />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

// Main Dashboard Component
const Dashboard = () => {
  const { user, logout, currentRole, switchRole } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [manuscripts, setManuscripts] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [error, setError] = useState('');
  const [roleState, setRoleState] = useState(currentRole || 'reviewer');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentPage, setCurrentPage] = useState('submissions');
  const [submissionDetailView, setSubmissionDetailView] = useState(null);
  const [alerts, setAlerts] = useState([
    { id: 1, type: 'urgent', title: 'Urgent Revision Required', message: 'Article requires revisions. Deadline in 2 days.' },
    { id: 2, type: 'warning', title: 'Review Deadline', message: 'Review due in 3 days.' }
  ]);

  // Check for submission success from location state
  useEffect(() => {
    if (location.state?.submissionSuccess) {
      // Show success message
      alert('✅ Manuscript submitted successfully!');
      // Clear the state
      navigate(location.pathname, { replace: true, state: {} });
      
      if (location.state?.submissionData) {
        setSubmissionDetailView(location.state.submissionData);
      }
    }
  }, [location, navigate]);

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
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleNewSubmission = () => {
    navigate('/submit-manuscript');
  };

  const handleBackFromDetail = () => {
    setSubmissionDetailView(null);
  };

  const filteredManuscripts = manuscripts.filter(manuscript => {
    const matchesSearch = manuscript.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         manuscript.authors.some(author => author.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || manuscript.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const dismissAlert = (alertId) => {
    setAlerts(alerts.filter(a => a.id !== alertId));
  };

  const renderPageContent = () => {
    switch (currentPage) {
      case 'submissions':
        return (
          <>
            {/* Welcome Section */}
            <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-800 mb-2">My Submissions</h1>
                <p className="text-gray-600">Manage and track your manuscript submissions</p>
              </div>
              
              {roleState === 'publisher' && (
                <button 
                  onClick={handleNewSubmission}
                  className="mt-4 sm:mt-0 flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-xl transition-all transform hover:-translate-y-0.5 font-semibold w-fit"
                >
                  <Upload className="w-5 h-5" />
                  <span>Submit New Manuscript</span>
                </button>
              )}
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {roleState === 'publisher' ? (
                <>
                  <StatCard 
                    title="Draft Articles"
                    value={stats.draftArticles || 0}
                    change="+2"
                    changeType="up"
                    icon={FileText}
                    gradient="bg-gradient-to-br from-blue-500 to-blue-600"
                  />
                  <StatCard 
                    title="Under Review"
                    value={stats.underReview || 0}
                    change="3"
                    changeType="down"
                    icon={Clock}
                    gradient="bg-gradient-to-br from-orange-500 to-orange-600"
                  />
                  <StatCard 
                    title="Published"
                    value={stats.publishedManuscripts || 0}
                    change="+1"
                    changeType="up"
                    icon={CheckCircle}
                    gradient="bg-gradient-to-br from-green-500 to-green-600"
                  />
                  <StatCard 
                    title="Total Submissions"
                    value={stats.totalManuscripts || 0}
                    change="+15"
                    changeType="up"
                    icon={BarChart3}
                    gradient="bg-gradient-to-br from-purple-500 to-purple-600"
                  />
                </>
              ) : (
                <>
                  <StatCard 
                    title="Assigned Reviews"
                    value={stats.pendingReviews || 0}
                    change="5"
                    changeType="down"
                    icon={FileText}
                    gradient="bg-gradient-to-br from-blue-500 to-blue-600"
                  />
                  <StatCard 
                    title="Completed"
                    value={stats.completedReviews || 0}
                    change="+8"
                    changeType="up"
                    icon={CheckCircle}
                    gradient="bg-gradient-to-br from-green-500 to-green-600"
                  />
                  <StatCard 
                    title="In Progress"
                    value="5"
                    change="2"
                    changeType="down"
                    icon={Activity}
                    gradient="bg-gradient-to-br from-orange-500 to-orange-600"
                  />
                  <StatCard 
                    title="Total Reviews"
                    value={stats.totalReviews || 0}
                    change="+12"
                    changeType="up"
                    icon={BarChart3}
                    gradient="bg-gradient-to-br from-purple-500 to-purple-600"
                  />
                </>
              )}
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column - Manuscripts */}
              <div className="lg:col-span-2 space-y-8">
                {/* Manuscripts */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
                  <div className="px-6 py-4 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <h2 className="text-lg font-bold text-gray-900 mb-4 sm:mb-0">
                      {roleState === 'publisher' ? 'My Manuscripts' : 'Review Assignments'}
                    </h2>

                    <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                      <div className="relative flex-1 sm:flex-none">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                          type="text"
                          placeholder="Search..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="w-full sm:w-48 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                        />
                      </div>
                      
                      <div className="relative">
                        <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <select
                          value={statusFilter}
                          onChange={(e) => setStatusFilter(e.target.value)}
                          className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                        >
                          <option value="all">All Status</option>
                          <option value="pending_review">Pending Review</option>
                          <option value="review_assigned">Review Assigned</option>
                          <option value="published">Published</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="p-6">
                    {filteredManuscripts.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {filteredManuscripts.map((manuscript) => (
                          <ManuscriptCardCompact 
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
                            onClick={handleNewSubmission}
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

              {/* Right Column - Alerts & Deadlines */}
              <div className="space-y-6">
                {/* Alerts */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                  <div className="flex items-center space-x-2 mb-4">
                    <AlertTriangle className="w-5 h-5 text-red-600" />
                    <h2 className="text-lg font-bold text-gray-900">Urgent Alerts</h2>
                  </div>
                  {alerts.length > 0 ? (
                    <div>
                      {alerts.map((alert) => (
                        <AlertCard key={alert.id} alert={alert} onDismiss={dismissAlert} />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">No urgent alerts</p>
                    </div>
                  )}
                </div>

                {/* Upcoming Deadlines */}
                <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-lg p-6 text-white">
                  <div className="flex items-center space-x-2 mb-4">
                    <Calendar className="w-5 h-5" />
                    <h3 className="font-bold">Upcoming Deadlines</h3>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between py-2 border-b border-white/20">
                      <span className="text-sm">Review Due</span>
                      <span className="text-sm font-semibold">2 days</span>
                    </div>
                    <div className="flex items-center justify-between py-2 border-b border-white/20">
                      <span className="text-sm">Revision Required</span>
                      <span className="text-sm font-semibold">5 days</span>
                    </div>
                    <div className="flex items-center justify-between py-2">
                      <span className="text-sm">Resubmission</span>
                      <span className="text-sm font-semibold">7 days</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        );
      
      case 'profile':
        return (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">User Profile</h2>
            <p className="text-gray-600">Profile management features will appear here.</p>
          </div>
        );
      
      default:
        return (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {currentPage.charAt(0).toUpperCase() + currentPage.slice(1).replace('-', ' ')}
            </h2>
            <p className="text-gray-600">Content for <strong>{currentPage}</strong> will appear here.</p>
          </div>
        );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  // Show submission detail view if available
  if (submissionDetailView) {
    return (
      <SubmissionDetailView 
        submissionData={submissionDetailView}
        onBack={handleBackFromDetail}
        onNavigateToStage={(stageId) => {
          console.log('Navigate to stage:', stageId);
        }}
      />
    );
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
      {/* Sidebar */}
      <Sidebar 
        isOpen={sidebarOpen} 
        setIsOpen={setSidebarOpen}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden ml-0 md:ml-64">
        {/* Header */}
        <nav className="bg-white/80 backdrop-blur-lg shadow-sm border-b border-white/20 sticky top-0 z-30">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <h2 className="text-lg font-bold text-gray-800">
                {currentPage.charAt(0).toUpperCase() + currentPage.slice(1).replace('-', ' ')}
              </h2>
              
              <div className="flex items-center space-x-4">
                <div className="flex bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => handleRoleSwitch('publisher')}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                      roleState === 'publisher'
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'text-gray-600 hover:text-gray-800'
                    }`}
                  >
                    Publisher
                  </button>
                  <button
                    onClick={() => handleRoleSwitch('reviewer')}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                      roleState === 'reviewer'
                        ? 'bg-purple-600 text-white shadow-md'
                        : 'text-gray-600 hover:text-gray-800'
                    }`}
                  >
                    Reviewer
                  </button>
                </div>

                <button className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                  <Bell className="w-5 h-5" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>

                <div className="flex items-center space-x-3 pl-4 border-l border-gray-200">
                  <div className="text-right hidden sm:block">
                    <p className="text-sm font-semibold text-gray-800">{user?.fullName || 'Dr. User'}</p>
                    <p className="text-xs text-gray-500">{roleState}</p>
                  </div>
                  <button 
                    onClick={handleLogout}
                    className="ml-2 px-3 py-1 text-sm text-gray-600 hover:text-gray-800 font-medium border border-gray-300 rounded-lg hover:bg-gray-100 transition-all"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </div>
        </nav>

        {/* Scrollable Content */}
        <main className="flex-1 overflow-auto">
          <div className="px-4 sm:px-6 lg:px-8 py-8">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                <div className="flex items-center">
                  <AlertTriangle className="w-5 h-5 mr-2" />
                  {error}
                </div>
              </div>
            )}

            {renderPageContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;