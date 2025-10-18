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
  ChevronRight,
  Upload,
  User
} from 'lucide-react';

const Sidebar = ({ isOpen, setIsOpen, currentPage, setCurrentPage }) => {
  const [expandedMenu, setExpandedMenu] = useState(null);

  // Activity Section - User's active work
  const activityItems = [
    {
      id: 'submissions',
      label: 'Submissions',
      icon: Upload,
      href: '#'
    },
    {
      id: 'profile',
      label: 'Profile',
      icon: User,
      href: '#'
    }
  ];

  // Info Section - Journal information and policies
  const infoItems = [
    {
      id: 'editorial',
      label: 'Editorial Team',
      icon: Users,
      href: '#'
    },
    {
      id: 'reviewers',
      label: 'Peer Reviewers',
      icon: ClipboardList,
      href: '#'
    },
    {
      id: 'policies',
      label: 'Editorial Policies',
      icon: Scale,
      submenu: [
        { id: 'scope', label: 'Focus & Scope', href: '#' },
        { id: 'process', label: 'Peer Review Process', href: '#' },
        { id: 'access', label: 'Open Access Policy', href: '#' },
        { id: 'ethics', label: 'Publication Ethics', href: '#' },
        { id: 'plagiarism', label: 'Plagiarism Policy', href: '#' },
        { id: 'ai-tools', label: 'AI Tools Policy', href: '#' }
      ]
    },
    {
      id: 'contact',
      label: 'Contact',
      icon: Mail,
      href: '#'
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

  const renderMenuItem = (item) => {
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

        {item.submenu && isExpanded && (
          <div className="ml-4 mt-2 space-y-1 border-l-2 border-slate-600 pl-3">
            {item.submenu.map((submenu) => (
              <button
                key={submenu.id}
                onClick={() => handleSubmenuClick(submenu)}
                className={`w-full flex items-center space-x-2 px-3 py-2 rounded-lg text-sm transition-all duration-200 ${
                  currentPage === submenu.id
                    ? 'bg-blue-500/30 text-blue-300'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/30'
                }`}
              >
                <div className="w-1 h-1 rounded-full bg-current"></div>
                <span className="text-xs">{submenu.label}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    );
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
        <nav className="p-4 pb-20">
          {/* ACTIVITY SECTION */}
          <div className="mb-6">
            <div className="px-4 mb-3">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Activity</h3>
              <div className="h-px bg-gradient-to-r from-slate-600 to-transparent mt-2"></div>
            </div>
            <div className="space-y-1">
              {activityItems.map((item) => renderMenuItem(item))}
            </div>
          </div>

          {/* INFO SECTION */}
          <div>
            <div className="px-4 mb-3">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Info</h3>
              <div className="h-px bg-gradient-to-r from-slate-600 to-transparent mt-2"></div>
            </div>
            <div className="space-y-1">
              {infoItems.map((item) => renderMenuItem(item))}
            </div>
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
    </>
  );
};

export default Sidebar;