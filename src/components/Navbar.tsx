import React, { useState } from 'react';
import { 
  Sprout, 
  Home, 
  LayoutDashboard, 
  ScanSearch, 
  FlaskConical, 
  Wheat, 
  CalendarClock, 
  History, 
  BarChart3, 
  ShieldAlert, 
  BookOpen, 
  User, 
  LogOut, 
  Menu, 
  X,
  ChevronDown
} from 'lucide-react';
import { ActiveTab } from '../types';
import { useAuth } from '../context/AuthContext';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  onOpenDocs: () => void;
  onOpenAuthModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenDocs,
  onOpenAuthModal
}) => {
  const { user, logout, switchRole } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const navItems: { id: ActiveTab; label: string; icon: React.ReactNode; adminOnly?: boolean }[] = [
    { id: 'landing', label: 'Overview', icon: <Home className="w-4 h-4" /> },
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'leaf_disease', label: 'Leaf Scan', icon: <ScanSearch className="w-4 h-4" /> },
    { id: 'soil_analysis', label: 'Soil Health', icon: <FlaskConical className="w-4 h-4" /> },
    { id: 'crop_recommend', label: 'Crop Match', icon: <Wheat className="w-4 h-4" /> },
    { id: 'fertilizer_planner', label: 'Fertilizer & IPM', icon: <CalendarClock className="w-4 h-4" /> },
    { id: 'history', label: 'History', icon: <History className="w-4 h-4" /> },
    { id: 'analytics', label: 'Analytics', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'admin', label: 'Admin Portal', icon: <ShieldAlert className="w-4 h-4" />, adminOnly: true }
  ];

  const handleNavClick = (tab: ActiveTab) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-emerald-100 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo and Brand Title */}
          <div 
            onClick={() => handleNavClick('landing')}
            className="flex items-center space-x-3 cursor-pointer group select-none"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-green-500 flex items-center justify-center text-white shadow-md shadow-emerald-600/20 group-hover:scale-105 transition-transform">
              <Sprout className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-xl text-slate-900 tracking-tight font-heading">
                  Agri<span className="text-emerald-600">Smart</span> <span className="text-slate-800">AI</span>
                </span>
                <span className="hidden sm:inline-block bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Final Year Project
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium">Smart AI for Sustainable Agriculture</p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navItems.map(item => {
              if (item.adminOnly && user?.role !== 'admin') return null;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive 
                      ? 'bg-emerald-50 text-emerald-700 font-semibold shadow-xs ring-1 ring-emerald-200' 
                      : 'text-slate-600 hover:text-emerald-600 hover:bg-slate-50'
                  }`}
                >
                  <span className={isActive ? 'text-emerald-600' : 'text-slate-400'}>{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Controls: Docs, Role Pill, User Profile */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            
            {/* College Project Presentation Docs Trigger */}
            <button
              onClick={onOpenDocs}
              className="flex items-center space-x-1 px-2.5 py-1.5 text-xs font-semibold text-emerald-800 bg-emerald-100/80 hover:bg-emerald-200 rounded-lg transition-colors border border-emerald-300/60"
              title="Project Architecture, Datasets, and Model Methodology"
            >
              <BookOpen className="w-3.5 h-3.5 text-emerald-700" />
              <span className="hidden sm:inline">Project Docs</span>
            </button>

            {/* Quick Role Switcher (Convenient for academic evaluation) */}
            <div className="hidden md:flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-xs">
              <button
                onClick={() => switchRole('farmer')}
                className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                  user?.role === 'farmer' 
                    ? 'bg-white text-emerald-700 shadow-xs font-semibold' 
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Farmer
              </button>
              <button
                onClick={() => switchRole('admin')}
                className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                  user?.role === 'admin' 
                    ? 'bg-white text-purple-700 shadow-xs font-semibold' 
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Admin
              </button>
            </div>

            {/* User Profile / Auth State */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center space-x-2 pl-2 pr-3 py-1.5 rounded-lg border border-slate-200 hover:border-slate-300 bg-white text-slate-700 text-sm font-medium transition-all shadow-xs"
                >
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                    user.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-emerald-100 text-emerald-700'
                  }`}>
                    {user.name.charAt(0)}
                  </div>
                  <span className="hidden xl:inline text-xs font-medium text-slate-800 max-w-[120px] truncate">
                    {user.name}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {profileDropdownOpen && (
                  <div 
                    className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in slide-in-from-top-2"
                    onMouseLeave={() => setProfileDropdownOpen(false)}
                  >
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="text-sm font-bold text-slate-900 truncate">{user.name}</p>
                      <p className="text-xs text-slate-500 truncate">{user.email}</p>
                      <div className="mt-1 flex items-center space-x-1.5">
                        <span className={`inline-block px-2 py-0.5 text-[10px] font-bold rounded-full ${
                          user.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-emerald-100 text-emerald-700'
                        }`}>
                          {user.role === 'admin' ? 'Administrator' : 'Verified Farmer'}
                        </span>
                        <span className="text-[11px] text-slate-500 truncate">{user.location}</span>
                      </div>
                    </div>

                    <div className="px-2 py-1">
                      <button
                        onClick={() => {
                          handleNavClick(user.role === 'admin' ? 'admin' : 'dashboard');
                          setProfileDropdownOpen(false);
                        }}
                        className="w-full text-left px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 rounded-lg flex items-center space-x-2"
                      >
                        <User className="w-4 h-4 text-slate-400" />
                        <span>View Farm Profile</span>
                      </button>

                      <button
                        onClick={() => {
                          switchRole(user.role === 'admin' ? 'farmer' : 'admin');
                          setProfileDropdownOpen(false);
                        }}
                        className="w-full text-left px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 rounded-lg flex items-center space-x-2"
                      >
                        <ShieldAlert className="w-4 h-4 text-slate-400" />
                        <span>Switch to {user.role === 'admin' ? 'Farmer Mode' : 'Admin Mode'}</span>
                      </button>
                    </div>

                    <div className="border-t border-slate-100 pt-1 px-2">
                      <button
                        onClick={() => {
                          logout();
                          setProfileDropdownOpen(false);
                        }}
                        className="w-full text-left px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50 rounded-lg flex items-center space-x-2"
                      >
                        <LogOut className="w-4 h-4 text-red-500" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={onOpenAuthModal}
                className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow-xs transition-colors"
              >
                Sign In
              </button>
            )}

            {/* Mobile Menu Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-4 space-y-1 shadow-lg">
          {navItems.map(item => {
            if (item.adminOnly && user?.role !== 'admin') return null;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium ${
                  isActive 
                    ? 'bg-emerald-50 text-emerald-700 font-semibold' 
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span className={isActive ? 'text-emerald-600' : 'text-slate-400'}>{item.icon}</span>
                <span>{item.label}</span>
              </button>
            );
          })}
          
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs text-slate-500 font-medium">Evaluation Mode:</span>
            <div className="flex space-x-1">
              <button
                onClick={() => switchRole('farmer')}
                className={`px-3 py-1 text-xs rounded-md ${user?.role === 'farmer' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600'}`}
              >
                Farmer
              </button>
              <button
                onClick={() => switchRole('admin')}
                className={`px-3 py-1 text-xs rounded-md ${user?.role === 'admin' ? 'bg-purple-600 text-white' : 'bg-slate-100 text-slate-600'}`}
              >
                Admin
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
