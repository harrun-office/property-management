import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function RoleBasedNavbar() {
  const { isAuthenticated, user, logout, isSuperAdmin, isPropertyManager, isVendor, isPropertyOwner } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [notificationMenuOpen, setNotificationMenuOpen] = useState(false);
  const location = useLocation();
  const userMenuRef = useRef(null);
  const notificationRef = useRef(null);

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setUserMenuOpen(false);
      }
    };

    if (userMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [userMenuOpen]);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  // Close notification menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setNotificationMenuOpen(false);
      }
    };

    if (notificationMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [notificationMenuOpen]);

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/search?search=${encodeURIComponent(searchQuery.trim())}`;
    }
  };

  // Helper function to check if link is active
  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  // NavLink component with active state
  const NavLink = ({ to, children, className = '', icon, mobile = false }) => {
    const active = isActive(to);
    const baseClasses = mobile 
      ? `block py-2 px-3 rounded-lg transition-all duration-200 ${
          active 
            ? 'bg-brass/20 text-brass border-l-4 border-brass' 
            : 'hover:text-brass hover:bg-obsidian-light'
        }`
      : `relative px-3 py-2 rounded-lg transition-all duration-200 ${
          active 
            ? 'text-brass' 
            : 'hover:text-brass'
        }`;
    
    return (
      <Link to={to} className={`${baseClasses} ${className}`} onClick={() => mobile && setMobileMenuOpen(false)}>
        {icon && <span className="inline-block mr-2">{icon}</span>}
        {children}
        {active && !mobile && (
          <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-brass rounded-full"></span>
        )}
      </Link>
    );
  };

  // Icon components
  const HomeIcon = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
  );

  const DashboardIcon = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  );

  const PropertiesIcon = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
  );

  const SearchIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  );

  const NotificationIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
    </svg>
  );

  const PlusIcon = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
    </svg>
  );

  return (
    <nav className="bg-obsidian shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto">
        {/* Top Bar - Logo, Search, Actions */}
        <div className="flex items-center justify-between px-4 md:px-10 py-3 border-b border-stone-500/30">
          <Link to="/" className="text-2xl font-bold text-porcelain hover:text-brass transition-colors">
            PropManage
          </Link>
          
          {/* Search Bar (Desktop) */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-xl mx-8">
            <div className="relative w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search properties, locations..."
                className="w-full px-4 py-2 pl-10 rounded-lg bg-obsidian-light border border-stone-500/50 text-porcelain placeholder-stone-300 focus:outline-none focus:ring-2 focus:ring-brass focus:border-brass"
              />
              <div className="absolute left-3 top-2.5 text-stone-300">
                <SearchIcon />
              </div>
              <button
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 text-stone-300 hover:text-brass transition-colors"
                aria-label="Search"
              >
                <SearchIcon />
              </button>
            </div>
          </form>
          
          {/* Quick Actions */}
          <div className="hidden md:flex items-center space-x-3">
            {/* Notifications */}
            {isAuthenticated && (
              <div className="relative" ref={notificationRef}>
                <button
                  onClick={() => setNotificationMenuOpen(!notificationMenuOpen)}
                  className="relative p-2 text-porcelain hover:text-brass transition-colors rounded-lg hover:bg-obsidian-light"
                  aria-label="Notifications"
                >
                  <NotificationIcon />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-error rounded-full"></span>
                </button>
                
                {notificationMenuOpen && (
                  <div className="absolute right-0 mt-2 w-80 bg-obsidian-light rounded-xl shadow-xl border border-stone-600/50 py-2 overflow-hidden">
                    <div className="px-4 py-3 border-b border-stone-600/50">
                      <p className="text-sm font-semibold text-porcelain">Notifications</p>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      <div className="px-4 py-3 text-sm text-stone-200 hover:bg-obsidian hover:text-brass transition-colors cursor-pointer">
                        <p className="font-medium">New application received</p>
                        <p className="text-xs text-stone-300 mt-1">2 hours ago</p>
                      </div>
                      <div className="px-4 py-3 text-sm text-stone-200 hover:bg-obsidian hover:text-brass transition-colors cursor-pointer border-t border-stone-600/30">
                        <p className="font-medium">Payment received</p>
                        <p className="text-xs text-stone-300 mt-1">1 day ago</p>
                      </div>
                    </div>
                    <Link
                      to="/notifications"
                      className="block px-4 py-2 text-sm text-center text-brass hover:bg-obsidian transition-colors border-t border-stone-600/50"
                      onClick={() => setNotificationMenuOpen(false)}
                    >
                      View All
                    </Link>
                  </div>
                )}
              </div>
            )}
            
            {/* Post Property Button (for owners) */}
            {isPropertyOwner && (
              <Link
                to="/owner/properties/new"
                className="px-4 py-2 bg-brass text-porcelain rounded-lg hover:bg-brass-light transition-colors font-semibold text-sm flex items-center space-x-2"
              >
                <PlusIcon />
                <span>Post Property</span>
              </Link>
            )}
            
            {/* User Menu Dropdown */}
            {isAuthenticated ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-obsidian-light transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-brass/20 flex items-center justify-center text-brass font-semibold">
                    {user?.name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <span className="text-stone-200 hidden lg:inline text-sm">{user?.name}</span>
                  <svg className="w-4 h-4 text-stone-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-obsidian rounded-xl shadow-xl border border-stone-600/50 py-2 overflow-hidden">
                    <div className="px-4 py-3 border-b border-stone-500/50">
                      <p className="text-sm font-semibold text-porcelain">{user?.name}</p>
                      <p className="text-xs text-stone-200 mt-1">{user?.email}</p>
                    </div>
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-sm font-medium text-white hover:bg-obsidian-light hover:text-brass transition-colors"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      Profile Settings
                    </Link>
                    <button
                      onClick={() => {
                        logout();
                        setUserMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-error hover:bg-error/10 transition-colors"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link to="/register" className="px-3 py-2 hover:text-brass transition-colors text-sm">
                  Register
                </Link>
                <Link to="/login" className="px-4 py-2 bg-brass text-porcelain rounded-lg hover:bg-brass-light transition-colors text-sm font-semibold">
                  Login
                </Link>
              </div>
            )}
          </div>
          
          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-porcelain hover:text-brass transition-colors p-2 rounded-lg hover:bg-obsidian-light"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
        
        {/* Navigation Bar - Main Links */}
        <div className="hidden md:flex items-center justify-between px-4 md:px-10 py-2 border-b border-stone-500/30">
          <div className="flex items-center space-x-1 text-porcelain font-medium text-sm">
            {isAuthenticated ? (
              <>
                {!isSuperAdmin && <NavLink to="/" icon={<HomeIcon />}>Home</NavLink>}
                  {isSuperAdmin && (
                    <>
                      <NavLink to="/admin/dashboard" icon={<DashboardIcon />}>Dashboard</NavLink>
                      <NavLink to="/admin/users">Users</NavLink>
                      <NavLink to="/admin/properties" icon={<PropertiesIcon />}>Properties</NavLink>
                      <NavLink to="/admin/property-managers" icon={<PropertiesIcon />}>Managers</NavLink>
                      <NavLink to="/admin/applications">Applications</NavLink>
                      <NavLink to="/admin/financial">Financial</NavLink>
                      <NavLink to="/admin/analytics">Analytics</NavLink>
                      <NavLink to="/admin/settings">Settings</NavLink>
                    </>
                  )}
                {isPropertyManager && (
                  <>
                    <NavLink to="/property-manager/dashboard" icon={<DashboardIcon />}>Dashboard</NavLink>
                    <NavLink to="/property-manager/properties" icon={<PropertiesIcon />}>Properties</NavLink>
                    <NavLink to="/property-manager/vendors">Vendors</NavLink>
                    <NavLink to="/property-manager/tasks">Tasks</NavLink>
                    <NavLink to="/property-manager/reports">Reports</NavLink>
                  </>
                )}
                {isVendor && (
                  <>
                    <NavLink to="/vendor/dashboard" icon={<DashboardIcon />}>Dashboard</NavLink>
                    <NavLink to="/vendor/tasks">My Tasks</NavLink>
                    <NavLink to="/vendor/properties" icon={<PropertiesIcon />}>Properties</NavLink>
                    <NavLink to="/vendor/profile">Profile</NavLink>
                  </>
                )}
                {isPropertyOwner && (
                  <>
                    <NavLink to="/owner/dashboard" icon={<DashboardIcon />}>Dashboard</NavLink>
                    <NavLink to="/owner/properties" icon={<PropertiesIcon />}>Properties</NavLink>
                    <NavLink to="/owner/applications">Applications</NavLink>
                    <NavLink to="/owner/payments">Payments</NavLink>
                    <NavLink to="/owner/messages">Messages</NavLink>
                  </>
                )}
              </>
            ) : (
              <>
                <NavLink to="/" icon={<HomeIcon />}>Home</NavLink>
                <NavLink to="/properties" icon={<PropertiesIcon />}>Properties</NavLink>
                <NavLink to="/for-tenants">For Tenants</NavLink>
                <NavLink to="/for-owners">For Owners</NavLink>
                <NavLink to="/features">Features</NavLink>
                <NavLink to="/how-it-works">How It Works</NavLink>
                <NavLink to="/about">About</NavLink>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden border-t border-stone-500/30 bg-obsidian overflow-hidden transition-all duration-300 ease-in-out ${
        mobileMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
      }`}>
        <div className="px-4 py-4 space-y-1">
          {/* Mobile Search */}
          <form onSubmit={handleSearch} className="mb-4">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search properties..."
                className="w-full px-4 py-2 pl-10 rounded-lg bg-obsidian-light border border-stone-500/50 text-porcelain placeholder-stone-300 focus:outline-none focus:ring-2 focus:ring-brass"
              />
              <div className="absolute left-3 top-2.5 text-stone-300">
                <SearchIcon />
              </div>
            </div>
          </form>
          
          {/* Mobile Notifications */}
          {isAuthenticated && (
            <Link
              to="/notifications"
              className="block py-2 px-3 rounded-lg text-stone-200 hover:bg-obsidian-light hover:text-brass transition-colors text-sm flex items-center justify-between"
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="flex items-center space-x-2">
                <NotificationIcon />
                <span>Notifications</span>
              </span>
              <span className="w-2 h-2 bg-error rounded-full"></span>
            </Link>
          )}
          
          {/* Mobile Post Property Button */}
          {isPropertyOwner && (
            <Link
              to="/owner/properties/new"
              className="block py-2 px-3 bg-brass text-porcelain rounded-lg hover:bg-brass-light transition-colors text-sm text-center font-semibold mb-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="flex items-center justify-center space-x-2">
                <PlusIcon />
                <span>Post Property</span>
              </span>
            </Link>
          )}
          {isAuthenticated ? (
            <>
              {!isSuperAdmin && <NavLink to="/" mobile icon={<HomeIcon />}>Home</NavLink>}
                 {isSuperAdmin && (
                   <>
                     <NavLink to="/admin/dashboard" mobile icon={<DashboardIcon />}>Dashboard</NavLink>
                     <NavLink to="/admin/users" mobile>Users</NavLink>
                     <NavLink to="/admin/properties" mobile icon={<PropertiesIcon />}>Properties</NavLink>
                     <NavLink to="/admin/property-managers" mobile icon={<PropertiesIcon />}>Property Managers</NavLink>
                     <NavLink to="/admin/applications" mobile>Applications</NavLink>
                     <NavLink to="/admin/financial" mobile>Financial</NavLink>
                     <NavLink to="/admin/analytics" mobile>Analytics</NavLink>
                     <NavLink to="/admin/settings" mobile>Settings</NavLink>
                   </>
                 )}
              {isPropertyManager && (
                <>
                  <NavLink to="/property-manager/dashboard" mobile icon={<DashboardIcon />}>Dashboard</NavLink>
                  <NavLink to="/property-manager/properties" mobile icon={<PropertiesIcon />}>Properties</NavLink>
                  <NavLink to="/property-manager/vendors" mobile>Vendors</NavLink>
                  <NavLink to="/property-manager/tasks" mobile>Tasks</NavLink>
                  <NavLink to="/property-manager/reports" mobile>Reports</NavLink>
                </>
              )}
              {isVendor && (
                <>
                  <NavLink to="/vendor/dashboard" mobile icon={<DashboardIcon />}>Dashboard</NavLink>
                  <NavLink to="/vendor/tasks" mobile>My Tasks</NavLink>
                  <NavLink to="/vendor/properties" mobile icon={<PropertiesIcon />}>Properties</NavLink>
                  <NavLink to="/vendor/profile" mobile>Profile</NavLink>
                </>
              )}
              {isPropertyOwner && (
                <>
                  <NavLink to="/owner/dashboard" mobile icon={<DashboardIcon />}>Dashboard</NavLink>
                  <NavLink to="/owner/properties" mobile icon={<PropertiesIcon />}>Properties</NavLink>
                  <NavLink to="/owner/applications" mobile>Applications</NavLink>
                  <NavLink to="/owner/payments" mobile>Payments</NavLink>
                  <NavLink to="/owner/messages" mobile>Messages</NavLink>
                </>
              )}
              <div className="pt-3 mt-3 border-t border-stone-600/50">
                <div className="px-3 py-2 mb-2">
                  <p className="text-sm font-semibold text-porcelain">{user?.name}</p>
                  <p className="text-xs text-stone-300">{user?.email}</p>
                </div>
                 <Link
                   to="/profile"
                   className="block py-2 px-3 rounded-lg text-white font-medium hover:bg-obsidian-light hover:text-brass transition-colors text-sm"
                   onClick={() => setMobileMenuOpen(false)}
                 >
                   Profile Settings
                 </Link>
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left py-2 px-3 rounded-lg text-error hover:bg-error/10 transition-colors text-sm mt-1"
                >
                  Logout
                </button>
              </div>
            </>
          ) : (
            <>
              <NavLink to="/" mobile icon={<HomeIcon />}>Home</NavLink>
              <NavLink to="/properties" mobile icon={<PropertiesIcon />}>Properties</NavLink>
              <NavLink to="/for-tenants" mobile>For Tenants</NavLink>
              <NavLink to="/for-owners" mobile>For Owners</NavLink>
              <NavLink to="/features" mobile>Features</NavLink>
              <NavLink to="/how-it-works" mobile>How It Works</NavLink>
              <NavLink to="/about" mobile>About</NavLink>
              <div className="pt-3 mt-3 border-t border-stone-600/50 space-y-2">
                <Link
                  to="/register"
                  className="block py-2 px-3 rounded-lg text-stone-200 hover:bg-obsidian-light hover:text-brass transition-colors text-sm text-center"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Register
                </Link>
                <Link
                  to="/login"
                  className="block py-2 px-3 bg-brass text-porcelain rounded-lg hover:bg-brass-light transition-colors text-sm text-center font-semibold"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Login
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default RoleBasedNavbar;

