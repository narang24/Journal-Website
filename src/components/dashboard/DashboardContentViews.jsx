import React from 'react';
import { User, Mail, Phone, MapPin, Briefcase, Globe, Edit, Camera } from 'lucide-react';

// Profile View Component
export const ProfileView = ({ user }) => {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Header Banner */}
        <div className="h-32 bg-gradient-to-r from-blue-600 to-indigo-600 relative">
          <button className="absolute top-4 right-4 p-2 bg-white/20 hover:bg-white/30 rounded-lg text-white transition-colors">
            <Camera className="w-4 h-4" />
          </button>
        </div>
        
        {/* Profile Info */}
        <div className="px-8 pb-8">
          <div className="flex items-end -mt-16 mb-6">
            <div className="relative">
              <div className="w-32 h-32 rounded-2xl bg-white border-4 border-white shadow-xl flex items-center justify-center">
                <User className="w-16 h-16 text-gray-400" />
              </div>
              <button className="absolute bottom-2 right-2 p-2 bg-blue-600 rounded-lg text-white hover:bg-blue-700 transition-colors shadow-lg">
                <Camera className="w-3 h-3" />
              </button>
            </div>
            <div className="ml-6 flex-1">
              <h1 className="text-3xl font-bold text-gray-900">{user?.fullName || 'Dr. User'}</h1>
              <p className="text-gray-600 mt-1">{user?.email || 'user@example.com'}</p>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <Edit className="w-4 h-4" />
              Edit Profile
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100">
              <p className="text-sm text-gray-600 mb-1">Total Submissions</p>
              <p className="text-3xl font-bold text-blue-700">24</p>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 border border-green-100">
              <p className="text-sm text-gray-600 mb-1">Published</p>
              <p className="text-3xl font-bold text-green-700">18</p>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-100">
              <p className="text-sm text-gray-600 mb-1">Under Review</p>
              <p className="text-3xl font-bold text-purple-700">6</p>
            </div>
          </div>

          {/* Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-bold text-gray-900 text-lg mb-4">Personal Information</h3>
              
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Mail className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500">Email</p>
                  <p className="text-sm font-medium text-gray-900">{user?.email || 'user@example.com'}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Phone className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500">Phone</p>
                  <p className="text-sm font-medium text-gray-900">+1 (555) 123-4567</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <MapPin className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500">Location</p>
                  <p className="text-sm font-medium text-gray-900">New York, USA</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-bold text-gray-900 text-lg mb-4">Professional Information</h3>
              
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Briefcase className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500">Affiliation</p>
                  <p className="text-sm font-medium text-gray-900">Harvard University</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Globe className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500">ORCID</p>
                  <p className="text-sm font-medium text-gray-900">0000-0002-1234-5678</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <User className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500">Role</p>
                  <p className="text-sm font-medium text-gray-900">Author & Reviewer</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bio Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <h3 className="font-bold text-gray-900 text-lg mb-4">Biography</h3>
        <p className="text-gray-700 leading-relaxed">
          Dr. User is a distinguished researcher in the field of computer science with over 15 years of experience. 
          Their work focuses on artificial intelligence, machine learning, and data science applications in healthcare. 
          They have published over 50 peer-reviewed papers and served as a reviewer for multiple prestigious journals.
        </p>
      </div>

      {/* Research Interests */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <h3 className="font-bold text-gray-900 text-lg mb-4">Research Interests</h3>
        <div className="flex flex-wrap gap-2">
          {['Machine Learning', 'Artificial Intelligence', 'Data Science', 'Healthcare Technology', 'Neural Networks', 'Deep Learning'].map((interest, i) => (
            <span key={i} className="px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">
              {interest}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

// Editorial Team View
export const EditorialTeamView = () => {
  const editors = [
    { name: 'Dr. John Smith', role: 'Editor-in-Chief', affiliation: 'MIT', expertise: 'Computer Science' },
    { name: 'Prof. Sarah Johnson', role: 'Associate Editor', affiliation: 'Stanford', expertise: 'AI & ML' },
    { name: 'Dr. Michael Chen', role: 'Managing Editor', affiliation: 'Berkeley', expertise: 'Data Science' },
    { name: 'Prof. Emily Davis', role: 'Section Editor', affiliation: 'Harvard', expertise: 'Healthcare Tech' }
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Editorial Team</h1>
        <p className="text-gray-600 mb-8">Meet our distinguished editorial board members</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {editors.map((editor, i) => (
            <div key={i} className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center shadow-sm">
                  <User className="w-8 h-8 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900 text-lg">{editor.name}</h3>
                  <p className="text-blue-600 font-medium text-sm mb-2">{editor.role}</p>
                  <div className="space-y-1 text-sm text-gray-600">
                    <p><span className="font-medium">Affiliation:</span> {editor.affiliation}</p>
                    <p><span className="font-medium">Expertise:</span> {editor.expertise}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Peer Reviewers View
export const PeerReviewersView = () => {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Peer Reviewers</h1>
        <p className="text-gray-600 mb-8">Our network of expert peer reviewers</p>

        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-6">
          <h3 className="font-bold text-gray-900 mb-3">Become a Reviewer</h3>
          <p className="text-gray-700 mb-4">
            We are always looking for qualified experts to join our peer review panel. If you are interested in becoming a reviewer, please contact us.
          </p>
          <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
            Apply Now
          </button>
        </div>

        <div className="prose max-w-none">
          <h3 className="text-xl font-bold text-gray-900 mb-3">Reviewer Guidelines</h3>
          <ul className="space-y-2 text-gray-700">
            <li>Reviews should be completed within 2-3 weeks of assignment</li>
            <li>Provide constructive feedback to help improve manuscripts</li>
            <li>Maintain confidentiality of reviewed materials</li>
            <li>Declare any conflicts of interest</li>
            <li>Follow our double-blind review process</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

// Contact View
export const ContactView = () => {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Contact Us</h1>
        <p className="text-gray-600 mb-8">Get in touch with our editorial team</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
            <Mail className="w-8 h-8 text-blue-600 mb-4" />
            <h3 className="font-bold text-gray-900 mb-2">Email</h3>
            <p className="text-gray-700">editor@journal.com</p>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-100">
            <Phone className="w-8 h-8 text-green-600 mb-4" />
            <h3 className="font-bold text-gray-900 mb-2">Phone</h3>
            <p className="text-gray-700">+1 (555) 123-4567</p>
          </div>
        </div>

        <div className="bg-gray-50 rounded-xl p-6">
          <h3 className="font-bold text-gray-900 mb-4">Send us a message</h3>
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
              <input type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input type="email" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
              <textarea rows="4" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"></textarea>
            </div>
            <button type="submit" className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

// Policy Views
export const PolicyView = ({ policyId }) => {
  const policies = {
    scope: {
      title: 'Focus & Scope',
      content: 'This journal focuses on publishing high-quality research in computer science, artificial intelligence, and related fields. We accept original research articles, review papers, and case studies.'
    },
    process: {
      title: 'Peer Review Process',
      content: 'All submissions undergo a rigorous double-blind peer review process. Manuscripts are reviewed by at least two independent experts in the field. The review process typically takes 4-6 weeks.'
    },
    access: {
      title: 'Open Access Policy',
      content: 'This journal follows an open access policy. All published articles are freely available to readers worldwide, promoting the widest possible dissemination of research.'
    },
    ethics: {
      title: 'Publication Ethics',
      content: 'We adhere to the highest standards of publication ethics. Authors must ensure their work is original, properly cited, and free from plagiarism. Any conflicts of interest must be declared.'
    },
    plagiarism: {
      title: 'Plagiarism Policy',
      content: 'All submissions are checked for plagiarism using industry-standard software. Manuscripts with significant similarity to existing work will be rejected. Self-plagiarism is also not acceptable.'
    },
    'ai-tools': {
      title: 'AI Tools Policy',
      content: 'Authors may use AI tools for editing and improving their manuscripts. However, AI-generated content must be properly disclosed. AI tools cannot be listed as authors. Authors remain fully responsible for the content of their submissions.'
    }
  };

  const policy = policies[policyId] || policies.scope;

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{policy.title}</h1>
          <div className="h-1 w-20 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full"></div>
        </div>
        
        <div className="prose max-w-none">
          <p className="text-gray-700 text-lg leading-relaxed">{policy.content}</p>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-200">
          <h3 className="font-bold text-gray-900 mb-4">Related Policies</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Object.entries(policies).filter(([key]) => key !== policyId).slice(0, 3).map(([key, pol]) => (
              <div key={key} className="bg-blue-50 rounded-lg p-4 border border-blue-100 hover:border-blue-300 transition-colors cursor-pointer">
                <h4 className="font-semibold text-blue-900 text-sm">{pol.title}</h4>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};