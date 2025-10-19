// src/components/dashboard/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FileText, 
  CheckCircle, 
  Clock, 
  Upload, 
  Search, 
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Bell,
  User,
  Download,
  MoreVertical,
  X,
  ChevronRight,
  Menu,
  Eye
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import Sidebar from '../Sidebar';
import { 
  ProfileView, 
  EditorialTeamView, 
  PeerReviewersView, 
  ContactView, 
  PolicyView 
} from './DashboardContentViews';

// Add Poppins font
const poppinsStyle = `
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap');
  * {
    font-family: 'Poppins', sans-serif;
  }
`;

if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = poppinsStyle;
  document.head.appendChild(style);
}

const apiService = {
  getUserStats: async () => {
    await new Promise(resolve => setTimeout(resolve, 800));
    return {
      stats: {
        totalManuscripts: 156,
        publishedManuscripts: 134,
        underReview: 15,
        draftArticles: 4,
        assignedReviews: 8,
        completedReviews: 45,
        pendingReviews: 3
      }
    };
  }
};

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

const Dashboard = () => {
  const { user, logout, currentRole, switchRole } = useAuth();
  const navigate = useNavigate();
  
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [roleState, setRoleState] = useState('author');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('active');
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [currentView, setCurrentView] = useState('submissions');

  // Author submissions
  const authorSubmissions = {
    active: [
      {
        id: 1574,
        title: 'Advanced Machine Learning Applications in Healthcare Systems',
        authors: ['Noob Gamer', 'Dr. Sarah Johnson'],
        status: 'Awaiting assignment',
        submittedDate: 'Oct 18, 2025',
        section: 'Articles',
        abstract: 'This paper explores advanced machine learning techniques and their applications in modern healthcare systems.',
        keywords: ['Machine Learning', 'Healthcare', 'AI', 'Diagnostics'],
        manuscriptFile: { name: 'manuscript_v1.pdf', size: '2.5 MB' },
        refbacks: 5
      },
      {
        id: 1573,
        title: 'Quantum Computing in Data Analysis: Future Perspectives',
        authors: ['Prof. Emily Chen'],
        status: 'Review assigned',
        submittedDate: 'Oct 15, 2025',
        section: 'Research',
        abstract: 'An in-depth analysis of quantum computing applications in big data processing.',
        keywords: ['Quantum Computing', 'Data Analysis', 'Technology'],
        manuscriptFile: { name: 'quantum_study.pdf', size: '3.1 MB' },
        refbacks: 12
      }
    ],
    archived: [
      {
        id: 1571,
        title: 'Advanced Cryptography Methods for Secure Communications',
        authors: ['Dr. Michael Wong'],
        status: 'Published',
        submittedDate: 'Sep 10, 2025',
        section: 'Articles',
        abstract: 'Novel approaches to encryption and secure data transmission.',
        keywords: ['Cryptography', 'Security', 'Communications'],
        manuscriptFile: { name: 'crypto_final.pdf', size: '2.2 MB' },
        refbacks: 28
      }
    ]
  };

  // Reviewer assignments
  const reviewerAssignments = {
    active: [
      {
        id: 2101,
        title: 'Neural Networks for Climate Prediction Models',
        authors: ['Dr. James Smith'],
        status: 'Under Review',
        assignedDate: 'Oct 20, 2025',
        deadline: 'Nov 5, 2025',
        section: 'Research',
        abstract: 'Investigating the use of neural networks in predicting climate patterns.',
        keywords: ['Neural Networks', 'Climate', 'Prediction'],
        reviewStatus: 'In Progress'
      },
      {
        id: 2102,
        title: 'Blockchain Technology in Supply Chain Management',
        authors: ['Prof. Maria Garcia'],
        status: 'Pending Review',
        assignedDate: 'Oct 22, 2025',
        deadline: 'Nov 8, 2025',
        section: 'Articles',
        abstract: 'Exploring blockchain applications for supply chain transparency.',
        keywords: ['Blockchain', 'Supply Chain', 'Management'],
        reviewStatus: 'Not Started'
      }
    ],
    completed: [
      {
        id: 2099,
        title: 'AI Ethics in Modern Technology',
        authors: ['Dr. Robert Lee'],
        status: 'Review Completed',
        completedDate: 'Oct 12, 2025',
        section: 'Research',
        abstract: 'A comprehensive study on ethical considerations in AI development.',
        keywords: ['AI', 'Ethics', 'Technology'],
        reviewStatus: 'Completed',
        recommendation: 'Accept with Minor Revisions'
      }
    ]
  };

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const statsResponse = await apiService.getUserStats();
        setStats(statsResponse.stats || {});
      } catch (error) {
        console.error('Failed to load dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    loadDashboardData();
  }, [roleState]);

  const handleRoleSwitch = (newRole) => {
    setRoleState(newRole);
    switchRole(newRole);
    setCurrentView('submissions');
    setActiveTab('active');
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

  const getStatusColor = (status) => {
    const colors = {
      'Awaiting assignment': 'bg-yellow-100 text-yellow-800 border-yellow-300',
      'Review assigned': 'bg-blue-100 text-blue-800 border-blue-300',
      'Published': 'bg-green-100 text-green-800 border-green-300',
      'Rejected': 'bg-red-100 text-red-800 border-red-300',
      'Under Review': 'bg-purple-100 text-purple-800 border-purple-300',
      'Pending Review': 'bg-orange-100 text-orange-800 border-orange-300',
      'Review Completed': 'bg-teal-100 text-teal-800 border-teal-300'
    };
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-300';
  };

  const getStatusIcon = (status) => {
    const icons = {
      'Awaiting assignment': Clock,
      'Review assigned': AlertTriangle,
      'Published': CheckCircle,
      'Rejected': X,
      'Under Review': Eye,
      'Pending Review': Clock,
      'Review Completed': CheckCircle
    };
    return icons[status] || AlertTriangle;
  };

  const getCurrentSubmissions = () => {
    if (roleState === 'reviewer') {
      return reviewerAssignments[activeTab] || [];
    }
    return authorSubmissions[activeTab] || [];
  };

  const currentSubmissions = getCurrentSubmissions();
  const filteredSubmissions = currentSubmissions.filter(sub =>
    (statusFilter === 'all' || sub.status === statusFilter) &&
    (sub.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sub.authors.some(author => author.toLowerCase().includes(searchQuery.toLowerCase())))
  );

  // Render content based on currentView
  const renderContent = () => {
    switch (currentView) {
      case 'profile':
        return <ProfileView user={user} />;
      case 'editorial':
        return <EditorialTeamView />;
      case 'reviewers':
        return <PeerReviewersView />;
      case 'contact':
        return <ContactView />;
      case 'scope':
      case 'process':
      case 'access':
      case 'ethics':
      case 'plagiarism':
      case 'ai-tools':
        return <PolicyView policyId={currentView} />;
      case 'submissions':
      default:
        return renderSubmissionsView();
    }
  };

  const AuthorSubmissionCard = ({ submission, onClick }) => {
    const StatusIcon = getStatusIcon(submission.status);

    return (
      <div
        onClick={() => onClick(submission)}
        className="bg-white rounded-xl border-2 border-gray-100 hover:border-blue-300 hover:shadow-xl transition-all p-6 cursor-pointer group"
      >
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-sm font-bold text-gray-900 line-clamp-2 group-hover:text-blue-600 flex-1">
            #{submission.id} - {submission.title}
          </h3>
          <button className="ml-2 p-2 hover:bg-gray-100 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
            <MoreVertical className="w-4 h-4 text-gray-400" />
          </button>
        </div>

        <div className="flex items-center justify-between mb-3">
          <span className={`px-3 py-1.5 rounded-full text-xs font-semibold border inline-flex items-center gap-1.5 ${getStatusColor(submission.status)}`}>
            <StatusIcon className="w-3 h-3" />
            {submission.status}
          </span>
          <span className="text-xs text-gray-500">{submission.submittedDate}</span>
        </div>

        <div className="space-y-2 mb-3">
          <div className="flex items-center text-xs text-gray-600">
            <User className="w-3.5 h-3.5 mr-2" />
            <span className="truncate">{submission.authors.join(', ')}</span>
          </div>
          <p className="text-xs text-gray-600 line-clamp-2">{submission.abstract}</p>
        </div>

        <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-3 text-xs text-gray-500">
            <span>{submission.section}</span>
            <span>•</span>
            <span>{submission.refbacks} Refbacks</span>
          </div>
          <button className="text-blue-600 hover:text-blue-700 font-medium text-xs flex items-center gap-1">
            View Details
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    );
  };

  const ReviewerSubmissionCard = ({ submission, onClick }) => {
    const StatusIcon = getStatusIcon(submission.status);

    return (
      <div
        onClick={() => onClick(submission)}
        className="bg-white rounded-xl border-2 border-gray-100 hover:border-purple-300 hover:shadow-xl transition-all p-6 cursor-pointer group"
      >
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-sm font-bold text-gray-900 line-clamp-2 group-hover:text-purple-600 flex-1">
            #{submission.id} - {submission.title}
          </h3>
          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
            submission.reviewStatus === 'Completed' ? 'bg-green-100 text-green-700' :
            submission.reviewStatus === 'In Progress' ? 'bg-blue-100 text-blue-700' :
            'bg-gray-100 text-gray-700'
          }`}>
            {submission.reviewStatus}
          </span>
        </div>

        <div className="flex items-center justify-between mb-3">
          <span className={`px-3 py-1.5 rounded-full text-xs font-semibold border inline-flex items-center gap-1.5 ${getStatusColor(submission.status)}`}>
            <StatusIcon className="w-3 h-3" />
            {submission.status}
          </span>
          <span className="text-xs text-gray-500">
            {submission.assignedDate || submission.completedDate}
          </span>
        </div>

        <div className="space-y-2 mb-3">
          <div className="flex items-center text-xs text-gray-600">
            <User className="w-3.5 h-3.5 mr-2" />
            <span className="truncate">{submission.authors.join(', ')}</span>
          </div>
          <p className="text-xs text-gray-600 line-clamp-2">{submission.abstract}</p>
          {submission.deadline && (
            <div className="flex items-center text-xs text-orange-600 font-medium">
              <Clock className="w-3.5 h-3.5 mr-1" />
              Deadline: {submission.deadline}
            </div>
          )}
        </div>

        <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
          <span className="text-xs text-gray-500">{submission.section}</span>
          <button className="text-purple-600 hover:text-purple-700 font-medium text-xs flex items-center gap-1">
            {submission.reviewStatus === 'Completed' ? 'View Review' : 'Start Review'}
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    );
  };

  const SubmissionDetailModal = ({ submission, onClose }) => {
    if (!submission) return null;

    const isReviewer = roleState === 'reviewer';

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
          <div className={`${isReviewer ? 'bg-gradient-to-r from-purple-600 to-indigo-600' : 'bg-gradient-to-r from-blue-600 to-indigo-600'} text-white p-6 flex items-center justify-between`}>
            <div>
              <h2 className="text-xl font-bold">Submission #{submission.id}</h2>
              <p className="text-blue-100 text-sm mt-1 line-clamp-1">{submission.title}</p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-lg">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 space-y-6">
            <div className={`${isReviewer ? 'bg-purple-50 border-purple-200' : 'bg-blue-50 border-blue-200'} rounded-xl p-4 border`}>
              <div className="flex justify-between">
                <div>
                  <p className="text-xs text-gray-600 mb-1">Status</p>
                  <span className={`px-3 py-1.5 rounded-full text-xs font-semibold border inline-flex items-center gap-1.5 ${getStatusColor(submission.status)}`}>
                    {React.createElement(getStatusIcon(submission.status), { className: 'w-3 h-3' })}
                    {submission.status}
                  </span>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-600">{isReviewer ? 'Assigned' : 'Submitted'}</p>
                  <p className="font-bold text-gray-900">{submission.assignedDate || submission.submittedDate}</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-xs text-gray-600 mb-1 font-medium">Authors</p>
                <p className="text-sm font-semibold text-gray-900">{submission.authors.join(', ')}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-xs text-gray-600 mb-1 font-medium">Section</p>
                <p className="text-sm font-semibold text-gray-900">{submission.section}</p>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-xs text-gray-600 mb-2 font-medium">Abstract</p>
              <p className="text-sm text-gray-700">{submission.abstract}</p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-xs text-gray-600 mb-2 font-medium">Keywords</p>
              <div className="flex flex-wrap gap-2">
                {submission.keywords.map((keyword, i) => (
                  <span key={i} className="px-2.5 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-medium">
                    {keyword}
                  </span>
                ))}
              </div>
            </div>

            {!isReviewer && submission.refbacks !== undefined && (
              <div className="bg-blue-50 rounded-lg p-4">
                <p className="text-xs text-gray-600 mb-1 font-medium">Refbacks</p>
                <p className="text-2xl font-bold text-blue-700">{submission.refbacks}</p>
                <p className="text-xs text-gray-600 mt-1">References to this article</p>
              </div>
            )}

            {isReviewer && submission.deadline && (
              <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-orange-600" />
                  <div>
                    <p className="text-xs text-gray-600 font-medium">Review Deadline</p>
                    <p className="text-sm font-bold text-orange-700">{submission.deadline}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="border-t border-gray-100 bg-gray-50 p-6 flex gap-3 justify-end rounded-b-2xl">
            <button onClick={onClose} className="px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-100">
              Close
            </button>
            <button className={`px-4 py-2 ${isReviewer ? 'bg-purple-600 hover:bg-purple-700' : 'bg-blue-600 hover:bg-blue-700'} text-white font-medium rounded-lg`}>
              {isReviewer ? 'Submit Review' : 'View Full Details'}
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderSubmissionsView = () => (
    <>
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {roleState === 'reviewer' ? 'Review Assignments' : 'My Submissions'}
          </h1>
          <p className="text-gray-600 mt-1">
            {roleState === 'reviewer' 
              ? 'Manage and complete your assigned manuscript reviews' 
              : 'Manage and track your manuscript submissions'}
          </p>
        </div>
        {roleState === 'author' && (
          <button 
            onClick={handleNewSubmission}
            className="mt-4 sm:mt-0 flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:shadow-lg font-semibold w-fit"
          >
            <Upload className="w-5 h-5" />
            Submit New Manuscript
          </button>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {roleState === 'author' ? (
          <>
            <StatCard 
              title="Draft Articles"
              value={stats.draftArticles || 0}
              change="+2"
              changeType="up"
              icon={FileText}
              gradient="bg-gradient-to-br from-[#162660] to-[#1a2d70]"
            />
            <StatCard 
              title="Under Review"
              value={stats.underReview || 0}
              change="3"
              changeType="down"
              icon={Clock}
              gradient="bg-gradient-to-br from-[#4a7ba7] to-[#5a8ab7]"
            />
            <StatCard 
              title="Published"
              value={stats.publishedManuscripts || 0}
              change="+1"
              changeType="up"
              icon={CheckCircle}
              gradient="bg-gradient-to-br from-[#2d4a7a] to-[#3d5a8a]"
            />
          </>
        ) : (
          <>
            <StatCard 
              title="Assigned Reviews"
              value={stats.assignedReviews || 0}
              change="+2"
              changeType="up"
              icon={Eye}
              gradient="bg-gradient-to-br from-purple-600 to-purple-700"
            />
            <StatCard 
              title="Pending Reviews"
              value={stats.pendingReviews || 0}
              icon={Clock}
              gradient="bg-gradient-to-br from-orange-500 to-orange-600"
            />
            <StatCard 
              title="Completed Reviews"
              value={stats.completedReviews || 0}
              change="+5"
              changeType="up"
              icon={CheckCircle}
              gradient="bg-gradient-to-br from-green-600 to-green-700"
            />
          </>
        )}
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 flex mb-6">
        <button
          onClick={() => setActiveTab('active')}
          className={`flex-1 py-4 px-6 font-bold text-center border-b-4 transition-all ${
            activeTab === 'active'
              ? `${roleState === 'reviewer' ? 'border-purple-600 text-purple-600 bg-purple-50' : 'border-blue-600 text-blue-600 bg-blue-50'}`
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          <div className="flex items-center justify-center gap-2">
            <Clock className="w-5 h-5" />
            Active ({roleState === 'reviewer' ? reviewerAssignments.active.length : authorSubmissions.active.length})
          </div>
        </button>
        <div className="w-px bg-gray-200"></div>
        <button
          onClick={() => setActiveTab(roleState === 'reviewer' ? 'completed' : 'archived')}
          className={`flex-1 py-4 px-6 font-bold text-center border-b-4 transition-all ${
            activeTab === (roleState === 'reviewer' ? 'completed' : 'archived')
              ? `${roleState === 'reviewer' ? 'border-purple-600 text-purple-600 bg-purple-50' : 'border-blue-600 text-blue-600 bg-blue-50'}`
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          <div className="flex items-center justify-center gap-2">
            <CheckCircle className="w-5 h-5" />
            {roleState === 'reviewer' ? 'Completed' : 'Archived'} ({roleState === 'reviewer' ? reviewerAssignments.completed.length : authorSubmissions.archived.length})
          </div>
        </button>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by title or author..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-200 text-sm"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 text-sm"
          >
            <option value="all">All Status</option>
            {roleState === 'author' ? (
              <>
                {activeTab === 'active' && (
                  <>
                    <option value="Awaiting assignment">Awaiting Assignment</option>
                    <option value="Review assigned">Review Assigned</option>
                  </>
                )}
                {activeTab === 'archived' && (
                  <>
                    <option value="Published">Published</option>
                    <option value="Rejected">Rejected</option>
                  </>
                )}
              </>
            ) : (
              <>
                {activeTab === 'active' && (
                  <>
                    <option value="Under Review">Under Review</option>
                    <option value="Pending Review">Pending Review</option>
                  </>
                )}
                {activeTab === 'completed' && (
                  <option value="Review Completed">Review Completed</option>
                )}
              </>
            )}
          </select>
        </div>
      </div>

      {/* Submissions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredSubmissions.length > 0 ? (
          filteredSubmissions.map((submission) => (
            roleState === 'reviewer' ? (
              <ReviewerSubmissionCard
                key={submission.id}
                submission={submission}
                onClick={setSelectedSubmission}
              />
            ) : (
              <AuthorSubmissionCard
                key={submission.id}
                submission={submission}
                onClick={setSelectedSubmission}
              />
            )
          ))
        ) : (
          <div className="col-span-full bg-white rounded-lg border-2 border-dashed border-gray-200 p-12 text-center">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {roleState === 'reviewer' ? 'No reviews found' : 'No submissions found'}
            </h3>
            <p className="text-gray-600">Try adjusting your search or filters</p>
          </div>
        )}
      </div>

      <SubmissionDetailModal submission={selectedSubmission} onClose={() => setSelectedSubmission(null)} />
    </>
  );

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

  return (
    <div className="flex h-screen bg-gradient-to-br from-[#F5F9FC] via-[#E8F2FB] to-[#F0F8FF]">
      <Sidebar 
        isOpen={sidebarOpen} 
        setIsOpen={setSidebarOpen}
        currentPage={currentView}
        setCurrentPage={setCurrentView}
      />

      <div className="flex-1 flex flex-col overflow-hidden ml-0 md:ml-64">
        <nav className="bg-white/80 backdrop-blur-lg shadow-sm border-b border-white/20 sticky top-0 z-30">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="md:hidden p-2 hover:bg-gray-100 rounded-lg"
              >
                <Menu className="w-6 h-6" />
              </button>
              <h2 className="text-lg font-bold text-gray-800">
                {currentView === 'submissions' && roleState === 'reviewer' ? 'Review Assignments' :
                 currentView === 'submissions' ? 'My Submissions' :
                 currentView === 'profile' ? 'My Profile' :
                 currentView === 'editorial' ? 'Editorial Team' :
                 currentView === 'reviewers' ? 'Peer Reviewers' :
                 currentView === 'contact' ? 'Contact' :
                 'Editorial Policies'}
              </h2>
              
              <div className="flex items-center space-x-4">
                <div className="flex bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => handleRoleSwitch('author')}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                      roleState === 'author'
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'text-gray-600 hover:text-gray-800'
                    }`}
                  >
                    Author
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
                    <p className="text-xs text-gray-500 capitalize">{roleState}</p>
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

        <main className="flex-1 overflow-auto">
          <div className="px-4 sm:px-6 lg:px-8 py-8">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;