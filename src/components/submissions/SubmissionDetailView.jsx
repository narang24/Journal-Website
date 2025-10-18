import React, { useState } from 'react';
import { 
  CheckCircle, 
  FileText, 
  Calendar, 
  User, 
  Mail,
  Edit,
  Eye,
  Download,
  Upload,
  ArrowLeft,
  AlertCircle,
  Clock,
  ChevronRight
} from 'lucide-react';

const SubmissionDetailView = ({ submissionData, onBack, onNavigateToStage }) => {
  // Mock submission data - in real app, this would come from props or API
  const [submission] = useState(submissionData || {
    id: 1574,
    status: 'Awaiting assignment',
    submittedDate: 'October 18, 2025 - 08:22 PM',
    section: 'Articles',
    title: 'Advanced Machine Learning Applications in Healthcare Systems',
    authors: [
      {
        firstName: 'Noob',
        lastName: 'Gamer',
        email: 'officialnoobgaming710@gmail.com',
        isPrincipal: true
      }
    ],
    abstract: 'This paper explores advanced machine learning techniques and their applications in modern healthcare systems, focusing on diagnostic accuracy and patient outcome prediction.',
    keywords: ['Machine Learning', 'Healthcare', 'AI', 'Medical Diagnostics'],
    manuscriptFile: {
      name: 'manuscript_v1.pdf',
      size: '2.5 MB',
      uploadDate: 'October 18, 2025'
    },
    supplementaryFiles: []
  });

  const stages = [
    { id: 1, name: 'Summary', icon: FileText, active: true },
    { id: 2, name: 'Review', icon: Eye, active: false },
    { id: 3, name: 'Editing', icon: Edit, active: false }
  ];

  const StatusBadge = ({ status }) => {
    const statusColors = {
      'Awaiting assignment': 'bg-yellow-100 text-yellow-800 border-yellow-300',
      'Under Review': 'bg-blue-100 text-blue-800 border-blue-300',
      'Accepted': 'bg-green-100 text-green-800 border-green-300',
      'Revision Required': 'bg-orange-100 text-orange-800 border-orange-300'
    };

    return (
      <span className={`px-3 py-1 rounded-full text-sm font-medium border ${statusColors[status] || 'bg-gray-100 text-gray-800 border-gray-300'}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Success Banner */}
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl shadow-lg p-6 mb-6 text-white">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                <CheckCircle className="w-7 h-7" />
              </div>
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-2">Submission Complete!</h2>
              <p className="text-green-50">
                Thank you for your submission to the International Journal of Engineering, Science and Information Technology (IJESTY). 
                Your manuscript has been successfully submitted and is now awaiting editor assignment.
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 mb-6">
          <div className="flex items-center border-b border-gray-200 overflow-x-auto">
            {stages.map((stage, index) => {
              const Icon = stage.icon;
              return (
                <button
                  key={stage.id}
                  onClick={() => onNavigateToStage?.(stage.id)}
                  className={`flex items-center space-x-2 px-6 py-4 font-medium text-sm whitespace-nowrap transition-colors ${
                    stage.active
                      ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{stage.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Main Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Submission Header */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center space-x-3 mb-2">
                    <h1 className="text-2xl font-bold text-gray-900">#{submission.id} Summary</h1>
                    <StatusBadge status={submission.status} />
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>{submission.submittedDate}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <FileText className="w-4 h-4" />
                      <span>{submission.section}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                {/* Authors */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-3">Authors</h3>
                  <div className="space-y-3">
                    {submission.authors.map((author, index) => (
                      <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                        <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-blue-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2">
                            <p className="font-medium text-gray-900">
                              {author.firstName} {author.lastName}
                            </p>
                            {author.isPrincipal && (
                              <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-medium rounded">
                                Principal Contact
                              </span>
                            )}
                          </div>
                          <div className="flex items-center space-x-1 text-sm text-gray-600">
                            <Mail className="w-3 h-3" />
                            <span className="truncate">{author.email}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Title and Abstract */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-2">Title</h3>
                  <p className="text-gray-900">{submission.title}</p>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-2">Abstract</h3>
                  <p className="text-gray-700 text-sm leading-relaxed">{submission.abstract}</p>
                </div>

                {/* Keywords */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-2">Keywords</h3>
                  <div className="flex flex-wrap gap-2">
                    {submission.keywords.map((keyword, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-blue-50 text-blue-700 text-sm rounded-full"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Manuscript File */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Manuscript File</h3>
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <FileText className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{submission.manuscriptFile.name}</p>
                    <p className="text-sm text-gray-600">
                      {submission.manuscriptFile.size} • Uploaded {submission.manuscriptFile.uploadDate}
                    </p>
                  </div>
                </div>
                <button className="p-2 hover:bg-white rounded-lg transition-colors">
                  <Download className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>

            {/* Supplementary Files */}
            {submission.supplementaryFiles.length > 0 && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Supplementary Files</h3>
                <div className="space-y-2">
                  {submission.supplementaryFiles.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        <FileText className="w-5 h-5 text-gray-400" />
                        <span className="text-sm text-gray-700">{file.name}</span>
                      </div>
                      <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                        Download
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Actions & Status */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full flex items-center justify-between px-4 py-3 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg transition-colors group">
                  <div className="flex items-center space-x-3">
                    <Eye className="w-5 h-5" />
                    <span className="font-medium">View Full Submission</span>
                  </div>
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>

                <button className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-lg transition-colors group">
                  <div className="flex items-center space-x-3">
                    <Download className="w-5 h-5" />
                    <span className="font-medium">Download PDF</span>
                  </div>
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>

                <button className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-lg transition-colors group">
                  <div className="flex items-center space-x-3">
                    <Upload className="w-5 h-5" />
                    <span className="font-medium">Upload Revision</span>
                  </div>
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>

            {/* Status Timeline */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Submission Timeline</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">Submitted</p>
                    <p className="text-sm text-gray-600">{submission.submittedDate}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                    <Clock className="w-5 h-5 text-yellow-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">Awaiting Assignment</p>
                    <p className="text-sm text-gray-600">Current stage</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 opacity-50">
                  <div className="flex-shrink-0 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                    <Eye className="w-5 h-5 text-gray-400" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">Under Review</p>
                    <p className="text-sm text-gray-600">Pending</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Help & Support */}
            <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-2xl border border-indigo-100 p-6">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                    <AlertCircle className="w-5 h-5 text-indigo-600" />
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Need Help?</h4>
                  <p className="text-sm text-gray-600 mb-3">
                    Our editorial team is here to assist you with any questions.
                  </p>
                  <button className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">
                    Contact Support →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-200">
          <button
            onClick={onBack}
            className="flex items-center space-x-2 px-6 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors font-medium"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Dashboard</span>
          </button>

          <div className="flex items-center space-x-3">
            <button className="px-6 py-3 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors font-medium">
              Print Summary
            </button>
            <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 rounded-lg transition-all shadow-lg font-medium">
              Submit Another Manuscript
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubmissionDetailView;