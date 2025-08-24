import React from 'react';
import { Edit, Eye, CheckSquare } from 'lucide-react';

const ManuscriptCard = ({ manuscript, role }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-800';
      case 'under_review':
        return 'bg-yellow-100 text-yellow-800';
      case 'pending_review':
        return 'bg-blue-100 text-blue-800';
      case 'assigned':
        return 'bg-purple-100 text-purple-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'published':
        return 'Published';
      case 'under_review':
        return 'Under Review';
      case 'pending_review':
        return 'Pending Review';
      case 'assigned':
        return 'Review Assigned';
      case 'rejected':
        return 'Rejected';
      default:
        return status;
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-semibold text-gray-800 line-clamp-2">{manuscript.title}</h3>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(manuscript.status)}`}>
          {getStatusText(manuscript.status)}
        </span>
      </div>
      
      <p className="text-gray-600 mb-4 line-clamp-3">{manuscript.abstract}</p>
      
      <div className="space-y-2 mb-4">
        <div className="flex flex-wrap gap-1">
          <span className="text-sm text-gray-500">Authors:</span>
          {manuscript.authors.map((author, index) => (
            <span key={index} className="text-sm text-gray-700">
              {author}{index < manuscript.authors.length - 1 ? ', ' : ''}
            </span>
          ))}
        </div>
        
        <div className="flex flex-wrap gap-1">
          {manuscript.keywords.map((keyword, index) => (
            <span key={index} className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs">
              {keyword}
            </span>
          ))}
        </div>
      </div>
      
      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-500">
          Submitted: {new Date(manuscript.submittedDate).toLocaleDateString()}
        </span>
        <div className="flex space-x-2">
          {role === 'publisher' ? (
            <>
              <button className="flex items-center text-blue-600 hover:text-blue-700 text-sm">
                <Edit className="w-4 h-4 mr-1" />
                Edit
              </button>
              <button className="flex items-center text-gray-600 hover:text-gray-700 text-sm">
                <Eye className="w-4 h-4 mr-1" />
                View
              </button>
            </>
          ) : (
            <>
              <button className="flex items-center text-blue-600 hover:text-blue-700 text-sm">
                <Eye className="w-4 h-4 mr-1" />
                Review
              </button>
              <button className="flex items-center text-green-600 hover:text-green-700 text-sm">
                <CheckSquare className="w-4 h-4 mr-1" />
                Accept
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManuscriptCard;