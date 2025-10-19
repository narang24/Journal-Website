import React, { useState } from 'react';
import {
  Menu,
  X,
  Home,
  Users,
  BookOpen,
  Scale,
  Mail,
  ChevronDown,
  ChevronRight,
  Upload,
  User,
  FileText,
  ClipboardList,
  Settings
} from 'lucide-react';

const Sidebar = ({ isOpen, setIsOpen, currentPage, setCurrentPage }) => {
  const [expandedMenu, setExpandedMenu] = useState(null);

  // Activity Section - User's active work
  const activityItems = [
    {
      id: 'submissions',
      label: 'My Submissions',
      icon: Upload,
      href: '#'
    },
    {
      id: 'profile',
      label: 'My Profile',
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
      // Close mobile sidebar after selection
      if (window.innerWidth < 768) {
        setIsOpen(false);
      }
    }
  };

  const handleSubmenuClick = (submenu) => {
    setCurrentPage(submenu.id);
    // Close mobile sidebar after selection
    if (window.innerWidth < 768) {
      setIsOpen(false);
    }
  };

  const renderMenuItem = (item) => {
    const Icon = item.icon;
    const isExpanded = expandedMenu === item.id;
    const isActive = currentPage === item.id;

    return (
      <div key={item.id}>
        <button
          onClick={() => handleMenuClick(item)}
          className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-all duration-200 group ${
            isActive
              ? 'bg-[#162660] text-white shadow-md'
              : 'text-slate-300 hover:bg-slate-700/50 hover:text-white'
          }`}
        >
          <div className="flex items-center space-x-2.5">
            <Icon className={`w-4 h-4 transition-transform duration-200 ${isActive ? '' : 'group-hover:scale-110'}`} />
            <span className="text-sm font-medium">{item.label}</span>
          </div>
          {item.submenu && (
            <ChevronDown
              className={`w-3.5 h-3.5 transition-transform duration-200 ${
                isExpanded ? 'rotate-180' : ''
              }`}
            />
          )}
        </button>

        {item.submenu && isExpanded && (
          <div className="ml-3 mt-1.5 space-y-0.5 border-l-2 border-slate-600/50 pl-3">
            {item.submenu.map((submenu) => (
              <button
                key={submenu.id}
                onClick={() => handleSubmenuClick(submenu)}
                className={`w-full flex items-center space-x-2 px-2.5 py-2 rounded-lg text-sm transition-all duration-200 ${
                  currentPage === submenu.id
                    ? 'bg-[#162660]/30 text-[#D0E6FD] font-medium'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/30'
                }`}
              >
                <ChevronRight className="w-3 h-3" />
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
        className="md:hidden fixed bottom-6 right-6 z-50 p-3 bg-[#162660] text-white rounded-full shadow-2xl hover:bg-[#1a2d70] transition-all hover:scale-110 active:scale-95"
      >
        {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Sidebar Overlay (Mobile) */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm md:hidden z-30 transition-opacity"
          onClick={() => setIsOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-screen w-64 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 border-r border-slate-700/50 overflow-y-auto z-40 transition-all duration-300 shadow-2xl md:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{
          scrollbarWidth: 'thin',
          scrollbarColor: '#475569 transparent'
        }}
      >
        {/* Logo Section */}
        <div className="p-5 border-b border-slate-700/50 bg-gradient-to-r from-slate-800 to-slate-900 sticky top-0 z-10">
          <div className="flex items-center space-x-2.5">
            <div className="w-10 h-10 bg-[#162660] rounded-lg flex items-center justify-center shadow-lg transform hover:scale-105 transition-transform">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-white font-semibold text-base tracking-tight">Journal</h1>
              <p className="text-xs text-slate-400 font-medium">Platform</p>
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <nav className="p-3 pb-24">
          {/* ACTIVITY SECTION */}
          <div className="mb-6">
            <div className="px-3 mb-2">
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Activity</h3>
              <div className="h-px bg-gradient-to-r from-slate-600 via-slate-500 to-transparent mt-1.5"></div>
            </div>
            <div className="space-y-1">
              {activityItems.map((item) => renderMenuItem(item))}
            </div>
          </div>

          {/* INFO SECTION */}
          <div>
            <div className="px-3 mb-2">
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Info</h3>
              <div className="h-px bg-gradient-to-r from-slate-600 via-slate-500 to-transparent mt-1.5"></div>
            </div>
            <div className="space-y-1">
              {infoItems.map((item) => renderMenuItem(item))}
            </div>
          </div>
        </nav>

        {/* Footer Section */}
        <div className="absolute bottom-0 left-0 right-0 p-3 border-t border-slate-700/50 bg-gradient-to-t from-slate-900 via-slate-900 to-transparent">
          <button className="w-full flex items-center space-x-2.5 px-3 py-2.5 rounded-lg text-slate-300 hover:bg-slate-700/50 hover:text-white transition-all duration-200 group">
            <Settings className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" />
            <span className="text-sm font-medium">Settings</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;