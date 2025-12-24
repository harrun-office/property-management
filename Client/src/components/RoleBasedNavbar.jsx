import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { tenantAPI } from '../services/api';

/**
 * TODO: DESIGN SYSTEM VIOLATIONS - Extensive violations throughout this component.
 * This is a complex navigation component with many primitive token violations.
 * All instances of:
 * - obsidian-*, stone-*, brass-*, eucalyptus-*, porcelain, charcoal, architectural
 * - bg-obsidian, text-obsidian, bg-brass, text-brass, etc.
 * Must be replaced with semantic --ui-* tokens.
 * 
 * Key areas requiring fixes:
 * - Navbar background (line 149): bg-obsidian/95, border-stone-500/20
 * - Text colors: text-porcelain, text-stone-*, text-charcoal, text-architectural
 * - Interactive states: hover:text-brass, hover:bg-obsidian-light
 * - Borders: border-stone-*, border-brass
 * - Backgrounds: bg-obsidian-*, bg-brass-*, bg-stone-*
 * - Gradients: from-brass-400 to-brass-600, etc.
 * - Status colors: bg-error, text-error
 * 
 * Navbar requires explicit background color (--ui-bg-surface or --ui-bg-inverse)
 */

function RoleBasedNavbar() {
  const { isAuthenticated, user, logout, isSuperAdmin, isPropertyManager, isVendor, isPropertyOwner, isTenant } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [notificationMenuOpen, setNotificationMenuOpen] = useState(false);
  const [hasActiveProperty, setHasActiveProperty] = useState(false);
  const location = useLocation();
  const userMenuRef = useRef(null);
  const notificationRef = useRef(null);

  // Check if tenant has active property
  useEffect(() => {
    if (isTenant && user) {
      tenantAPI.getDashboard()
        .then(data => {
          setHasActiveProperty(!!data.currentProperty);
        })
        .catch(() => {
          setHasActiveProperty(false);
        });
    }
  }, [isTenant, user]);

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
    <nav className="bg-obsidian/95 backdrop-blur-md shadow-lg sticky top-0 z-50 border-b border-stone-500/20">
      <div className="max-w-7xl mx-auto">
        {/* Top Bar - Logo, Search, Actions */}
        <div className="flex items-center justify-between px-4 md:px-10 py-3.5">
          <Link 
            to="/" 
            className="text-2xl font-bold text-porcelain hover:text-brass transition-all duration-200 hover:scale-105 flex items-center space-x-2"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-brass-400 to-brass-600 rounded-lg flex items-center justify-center shadow-md">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </div>
            <span>PropManage</span>
          </Link>
          
          {/* Search Bar (Desktop) - Modern Design */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-xl mx-8">
            <div className="relative w-full group">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search properties, locations..."
                className="w-full px-4 py-2.5 pl-11 pr-11 rounded-xl bg-obsidian-600/50 backdrop-blur-sm border border-stone-500/30 text-porcelain placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-brass-500/50 focus:border-brass-500/50 transition-all duration-200 group-hover:bg-obsidian-600/70"
              />
              <div className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-stone-400 group-focus-within:text-brass-500 transition-colors">
                <SearchIcon />
              </div>
              <button
                type="submit"
                className="absolute right-2.5 top-1/2 transform -translate-y-1/2 p-1.5 text-stone-400 hover:text-brass-500 hover:bg-obsidian-500/50 rounded-lg transition-all duration-200"
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
            
            {/* Post Property Button (for owners) - Enhanced */}
            {isPropertyOwner && (
              <Link
                to="/owner/properties/new"
                className="px-4 py-2.5 bg-gradient-to-r from-brass-500 to-brass-600 text-white rounded-xl hover:from-brass-600 hover:to-brass-700 transition-all duration-200 font-semibold text-sm flex items-center space-x-2 shadow-md hover:shadow-lg hover:scale-105 active:scale-100"
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
                  className="flex items-center space-x-2 px-3 py-2 rounded-xl hover:bg-obsidian-600/50 transition-all duration-200 group"
                  aria-label="User menu"
                  aria-expanded={userMenuOpen}
                >
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-brass-400 to-brass-600 flex items-center justify-center text-white font-bold shadow-lg ring-2 ring-brass-500/30 group-hover:ring-brass-500/50 transition-all">
                    {user?.name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <span className="text-stone-200 hidden lg:inline text-sm font-medium group-hover:text-porcelain transition-colors">{user?.name}</span>
                  <svg className={`w-4 h-4 text-stone-400 group-hover:text-brass-500 transition-all duration-200 ${userMenuOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-obsidian-700/95 backdrop-blur-md rounded-2xl shadow-2xl border border-stone-600/30 overflow-hidden z-50 animate-fade-in">
                    {/* User Info Header */}
                    <div className="px-4 py-4 bg-obsidian-light/30 border-b border-stone-500/30">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-brass/30 to-brass/10 flex items-center justify-center text-brass font-bold text-lg shadow-lg ring-2 ring-brass/20">
                          {user?.name?.charAt(0).toUpperCase() || 'U'}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-porcelain truncate">{user?.name}</p>
                          <p className="text-xs text-stone-300 mt-0.5 truncate">{user?.email}</p>
                          {user?.role && (
                            <span className="inline-block mt-1.5 px-2 py-0.5 text-xs font-medium bg-brass/20 text-brass rounded-full capitalize">
                              {user.role.replace('_', ' ')}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {/* Menu Items */}
                    <div className="py-1.5">
                    <Link
                        to={
                          isSuperAdmin ? "/admin/dashboard" :
                          isPropertyManager ? "/property-manager/dashboard" :
                          isVendor ? "/vendor/profile" :
                          isPropertyOwner ? "/owner/dashboard" :
                          isTenant ? "/tenant/profile" :
                          "/profile"
                        }
                        className="flex items-center space-x-3 px-4 py-2.5 text-sm font-medium text-stone-200 hover:bg-obsidian-light hover:text-brass transition-all duration-150 group"
                      onClick={() => setUserMenuOpen(false)}
                    >
                        <svg className="w-4 h-4 text-stone-400 group-hover:text-brass transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <span>Profile Settings</span>
                    </Link>
                      <div className="my-1 h-px bg-stone-600/50"></div>
                    <button
                      onClick={() => {
                        logout();
                        setUserMenuOpen(false);
                      }}
                        className="w-full flex items-center space-x-3 px-4 py-2.5 text-sm font-medium text-error/90 hover:bg-error/10 hover:text-error transition-all duration-150 group"
                    >
                        <svg className="w-4 h-4 text-error/70 group-hover:text-error transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        <span>Logout</span>
                    </button>
                    </div>
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
                  {isSuperAdmin && (
                    <>
                      <NavLink to="/admin/dashboard" icon={<DashboardIcon />}>Dashboard</NavLink>
                      <NavLink to="/admin/property-activity" icon={<PropertiesIcon />}>Property Activity</NavLink>
                    </>
                  )}
                {isPropertyManager && (
                  <>
                    <NavLink to="/property-manager/dashboard" icon={<DashboardIcon />}>Dashboard</NavLink>
                    <NavLink to="/property-manager/properties" icon={<PropertiesIcon />}>Properties</NavLink>
                    <NavLink to="/property-manager/subscriptions">Subscriptions</NavLink>
                    <NavLink to="/property-manager/revenue">Revenue</NavLink>
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
                    <NavLink to="/owner/managers">Managers</NavLink>
                    <NavLink to="/owner/subscriptions">Subscriptions</NavLink>
                    <NavLink to="/owner/applications">Applications</NavLink>
                    <NavLink to="/owner/payments">Payments</NavLink>
                    <NavLink to="/owner/messages">Messages</NavLink>
                  </>
                )}
                {isTenant && (
                  <>
                    <NavLink to="/tenant/dashboard" icon={<DashboardIcon />}>Dashboard</NavLink>
                    <NavLink to="/tenant/payments">Payments</NavLink>
                    <NavLink to="/tenant/messages">Messages</NavLink>
                    <NavLink to="/tenant/maintenance">Maintenance</NavLink>
                    <NavLink to="/tenant/lease">Lease</NavLink>
                    <NavLink to="/tenant/documents">Documents</NavLink>
                    <NavLink to="/tenant/profile">Profile</NavLink>
                    {!hasActiveProperty && (
                      <NavLink to="/tenant/saved" icon={<PropertiesIcon />}>Saved</NavLink>
                    )}
                    <NavLink to="/tenant/applications">Applications</NavLink>
                  </>
                )}
              </>
            ) : (
              <>
                <NavLink to="/" icon={<HomeIcon />}>Home</NavLink>
                <NavLink to="/properties" icon={<PropertiesIcon />}>Properties</NavLink>
                {!isTenant && <NavLink to="/for-tenants">For Tenants</NavLink>}
                {!isTenant && <NavLink to="/for-owners">For Owners</NavLink>}
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
                 {isSuperAdmin && (
                   <>
                     <NavLink to="/admin/dashboard" mobile icon={<DashboardIcon />}>Dashboard</NavLink>
                  <NavLink to="/admin/property-activity" mobile icon={<PropertiesIcon />}>Property Activity</NavLink>
                   </>
                 )}
              {isPropertyManager && (
                <>
                  <NavLink to="/property-manager/dashboard" mobile icon={<DashboardIcon />}>Dashboard</NavLink>
                  <NavLink to="/property-manager/properties" mobile icon={<PropertiesIcon />}>Properties</NavLink>
                  <NavLink to="/property-manager/subscriptions" mobile>Subscriptions</NavLink>
                  <NavLink to="/property-manager/revenue" mobile>Revenue</NavLink>
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
                  <NavLink to="/owner/managers" mobile>Managers</NavLink>
                  <NavLink to="/owner/subscriptions" mobile>Subscriptions</NavLink>
                  <NavLink to="/owner/applications" mobile>Applications</NavLink>
                  <NavLink to="/owner/payments" mobile>Payments</NavLink>
                  <NavLink to="/owner/messages" mobile>Messages</NavLink>
                </>
              )}
              {isTenant && (
                <>
                  <NavLink to="/tenant/dashboard" mobile icon={<DashboardIcon />}>Dashboard</NavLink>
                  <NavLink to="/tenant/payments" mobile>Payments</NavLink>
                  <NavLink to="/tenant/messages" mobile>Messages</NavLink>
                  <NavLink to="/tenant/maintenance" mobile>Maintenance</NavLink>
                  <NavLink to="/tenant/lease" mobile>Lease</NavLink>
                  <NavLink to="/tenant/documents" mobile>Documents</NavLink>
                  <NavLink to="/tenant/profile" mobile>Profile</NavLink>
                  {!hasActiveProperty && (
                    <NavLink to="/tenant/saved" mobile icon={<PropertiesIcon />}>Saved Properties</NavLink>
                  )}
                  <NavLink to="/tenant/applications" mobile>Applications</NavLink>
                </>
              )}
              <div className="pt-4 mt-4 border-t border-stone-600/50">
                {/* User Info */}
                <div className="px-3 py-3 mb-3 bg-obsidian-light/30 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brass/30 to-brass/10 flex items-center justify-center text-brass font-bold shadow-md ring-2 ring-brass/20">
                      {user?.name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-porcelain truncate">{user?.name}</p>
                      <p className="text-xs text-stone-300 truncate">{user?.email}</p>
                      {user?.role && (
                        <span className="inline-block mt-1 px-2 py-0.5 text-xs font-medium bg-brass/20 text-brass rounded-full capitalize">
                          {user.role.replace('_', ' ')}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Menu Items */}
                 <Link
                  to={
                    isSuperAdmin ? "/admin/dashboard" :
                    isPropertyManager ? "/property-manager/dashboard" :
                    isVendor ? "/vendor/profile" :
                    isPropertyOwner ? "/owner/dashboard" :
                    isTenant ? "/tenant/profile" :
                    "/profile"
                  }
                  className="flex items-center space-x-3 py-2.5 px-3 rounded-lg text-stone-200 hover:bg-obsidian-light hover:text-brass transition-all duration-150 text-sm font-medium"
                   onClick={() => setMobileMenuOpen(false)}
                 >
                  <svg className="w-5 h-5 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span>Profile Settings</span>
                 </Link>
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center space-x-3 py-2.5 px-3 rounded-lg text-error/90 hover:bg-error/10 hover:text-error transition-all duration-150 text-sm font-medium mt-1"
                >
                  <svg className="w-5 h-5 text-error/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  <span>Logout</span>
                </button>
              </div>
            </>
          ) : (
            <>
              <NavLink to="/" mobile icon={<HomeIcon />}>Home</NavLink>
              <NavLink to="/properties" mobile icon={<PropertiesIcon />}>Properties</NavLink>
              {!isTenant && <NavLink to="/for-tenants" mobile>For Tenants</NavLink>}
              {!isTenant && <NavLink to="/for-owners" mobile>For Owners</NavLink>}
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

