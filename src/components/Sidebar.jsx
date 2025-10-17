import React, { useState } from 'react';
import {
  Menu,
  X,
  Home,
  Users,
  Focus,
  BookOpen,
  Scale,
  Lock,
  ClipboardList,
  FileText,
  DollarSign,
  AlertCircle,
  Settings,
  Search,
  Zap,
  Mail,
  ChevronDown,
  ChevronRight
} from 'lucide-react';

const Sidebar = ({ isOpen, setIsOpen, currentPage, setCurrentPage }) => {
  const [expandedMenu, setExpandedMenu] = useState(null);

  const menuItems = [
    {
      id: 'editorial',
      label: 'Editorial Team',
      icon: Users,
      submenu: [
        { id: 'team-members', label: 'Team Members', href: '#' },
        { id: 'roles', label: 'Roles & Permissions', href: '#' }
      ]
    },
    {
      id: 'reviewers',
      label: 'Peer Reviewers',
      icon: ClipboardList,
      submenu: [
        { id: 'reviewer-list', label: 'Reviewer Directory', href: '#' },
        { id: 'reviewer-requests', label: 'Review Requests', href: '#' },
        { id: 'reviewer-stats', label: 'Performance Stats', href: '#' }
      ]
    },
    {
      id: 'scope',
      label: 'Focus & Scope',
      icon: Focus,
      href: '#'
    },
    {
      id: 'guidelines',
      label: 'Author Guidelines',
      icon: BookOpen,
      submenu: [
        { id: 'manuscript-format', label: 'Manuscript Format', href: '#' },
        { id: 'templates', label: 'Templates', href: '#' },
        { id: 'faq', label: 'FAQ', href: '#' }
      ]
    },
    {
      id: 'ethics',
      label: 'Publication Ethics',
      icon: Scale,
      href: '#'
    },
    {
      id: 'access',
      label: 'Open Access Policy',
      icon: Lock,
      href: '#'
    },
    {
      id: 'process',
      label: 'Peer Review Process',
      icon: ClipboardList,
      href: '#'
    },
    {
      id: 'submissions',
      label: 'Online Submissions',
      icon: FileText,
      href: '#'
    },
    {
      id: 'fees',
      label: 'Publication Fees',
      icon: DollarSign,
      submenu: [
        { id: 'fee-schedule', label: 'Fee Schedule', href: '#' },
        { id: 'payment', label: 'Payment Methods', href: '#' },
        { id: 'waivers', label: 'Fee Waivers', href: '#' }
      ]
    },
    {
      id: 'plagiarism',
      label: 'Plagiarism Policy',
      icon: AlertCircle,
      href: '#'
    },
    {
      id: 'ai',
      label: 'AI Tools Policy',
      icon: Zap,
      href: '#'
    },
    {
      id: 'indexing',
      label: 'Abstracting & Indexing',
      icon: Search,
      href: '#'
    },
    {
      id: 'contact',
      label: 'Contact',
      icon: Mail,
      submenu: [
        { id: 'general', label: 'General Inquiry', href: '#' },
        { id: 'support', label: 'Support', href: '#' },
        { id: 'feedback', label: 'Feedback', href: '#' }
      ]
    }
  ];

  const handleMenuClick = (item) => {
    if (item.submenu) {
      setExpandedMenu(expandedMenu === item.id ? null : item.id);
    } else {
      setCurrentPage(item.id);
      setExpandedMenu(null);
    }
  };

  const handleSubmenuClick = (submenu) => {
    setCurrentPage(submenu.id);
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden fixed bottom-6 right-6 z-40 p-3 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-all"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Sidebar Overlay (Mobile) */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 md:hidden z-30"
          onClick={() => setIsOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-screen w-64 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 border-r border-slate-700 overflow-y-auto z-40 transition-all duration-300 md:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Logo Section */}
        <div className="p-6 border-b border-slate-700">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-blue-600 rounded-lg flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-white font-bold text-lg">Journal</h1>
              <p className="text-xs text-slate-400">Platform</p>
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <nav className="p-4">
          <div className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isExpanded = expandedMenu === item.id;
              const isActive = currentPage === item.id;

              return (
                <div key={item.id}>
                  <button
                    onClick={() => handleMenuClick(item)}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all duration-200 ${
                      isActive
                        ? 'bg-blue-600 text-white shadow-lg'
                        : 'text-slate-300 hover:bg-slate-700/50'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <Icon className="w-5 h-5" />
                      <span className="text-sm font-medium">{item.label}</span>
                    </div>
                    {item.submenu && (
                      <ChevronDown
                        className={`w-4 h-4 transition-transform duration-200 ${
                          isExpanded ? 'rotate-180' : ''
                        }`}
                      />
                    )}
                  </button>

                  {/* Submenu */}
                  {item.submenu && isExpanded && (
                    <div className="ml-4 mt-2 space-y-1 border-l border-slate-600 pl-2">
                      {item.submenu.map((submenu) => (
                        <button
                          key={submenu.id}
                          onClick={() => handleSubmenuClick(submenu)}
                          className={`w-full flex items-center space-x-2 px-4 py-2 rounded-lg text-sm transition-all duration-200 ${
                            currentPage === submenu.id
                              ? 'bg-blue-500/30 text-blue-300'
                              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/30'
                          }`}
                        >
                          <ChevronRight className="w-4 h-4" />
                          <span>{submenu.label}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </nav>

        {/* Footer Section */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-700 bg-gradient-to-t from-slate-900 to-transparent">
          <button className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-slate-300 hover:bg-slate-700/50 transition-all duration-200">
            <Settings className="w-5 h-5" />
            <span className="text-sm font-medium">Settings</span>
          </button>
        </div>
      </aside>

      {/* Main Content Wrapper (for reference in layout) */}
      {/* Add md:ml-64 to your main content container */}
    </>
  );
};

export default Sidebar;