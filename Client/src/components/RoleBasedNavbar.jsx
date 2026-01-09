import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { tenantAPI } from '../services/api';

/**
 * Advanced Navigation Component - Fully compliant with modern design system.
 * Uses semantic --ui-* tokens for consistent theming and accessibility.
 * Features sophisticated color treatments with brand accent, secondary, and tertiary colors.
 */

function RoleBasedNavbar() {
  const { isAuthenticated, user, logout, isSuperAdmin, isPropertyManager, isVendor, isPropertyOwner, isTenant } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [notificationMenuOpen, setNotificationMenuOpen] = useState(false);
  const [hasActiveProperty, setHasActiveProperty] = useState(user?.hasActiveTenancy || false);
  const [recentPages, setRecentPages] = useState([]);
  const [smartSuggestion, setSmartSuggestion] = useState(null);
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
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

  // Track recent pages for smart navigation
  useEffect(() => {
    const currentPath = location.pathname;
    setRecentPages(prev => {
      const filtered = prev.filter(page => page.path !== currentPath);
      return [{ path: currentPath, title: getPageTitle(currentPath), timestamp: Date.now() }, ...filtered].slice(0, 3);
    });

    // Set smart suggestions based on current page
    setSmartSuggestion(getSmartSuggestion(currentPath, isAuthenticated, user));
  }, [location.pathname, isAuthenticated, user]);

  // Helper function to get page titles
  const getPageTitle = (path) => {
    const titles = {
      '/': 'Home',
      '/properties': 'Properties',
      '/for-tenants': 'For Tenants',
      '/for-owners': 'For Owners',
      '/features': 'Features',
      '/how-it-works': 'How It Works',
      '/about': 'About',
      '/owner/dashboard': 'Owner Dashboard',
      '/tenant/dashboard': 'Tenant Dashboard',
      '/property-manager/dashboard': 'Manager Dashboard',
      '/vendor/dashboard': 'Vendor Dashboard',
      '/admin/dashboard': 'Admin Dashboard'
    };
    return titles[path] || path.split('/').pop() || 'Page';
  };

  // Smart suggestion logic
  const getSmartSuggestion = (currentPath, isAuth, user) => {
    if (!isAuth) {
      if (currentPath === '/') return { text: 'Explore Properties', path: '/properties', icon: <PropertiesIcon /> };
      if (currentPath === '/about') return { text: 'See How It Works', path: '/how-it-works', icon: <CogIcon /> };
      if (currentPath === '/features') return { text: 'Get Started', path: '/register', icon: <UserGroupIcon /> };
    }

    if (isAuth && user) {
      if (currentPath.includes('/dashboard')) {
        if (user.role === 'property_owner') return { text: 'List New Property', path: '/owner/properties/new', icon: <PlusIcon /> };
        if (user.role === 'tenant') return { text: 'Browse Properties', path: '/properties', icon: <PropertiesIcon /> };
      }
      if (currentPath.includes('/properties') && user.role === 'property_owner') {
        return { text: 'View Applications', path: '/owner/applications', icon: <UserGroupIcon /> };
      }
    }

    return null;
  };

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/search?search=${encodeURIComponent(searchQuery.trim())}`;
      setShowSearchDropdown(false);
    }
  };

  // Handle search input changes with suggestions
  const handleSearchInput = (e) => {
    const value = e.target.value;
    setSearchQuery(value);

    if (value.trim().length > 0) {
      // Generate smart suggestions based on input
      const suggestions = generateSearchSuggestions(value.trim());
      setSearchSuggestions(suggestions);
      setShowSearchDropdown(true);
    } else {
      setSearchSuggestions([]);
      setShowSearchDropdown(false);
    }
  };

  // Generate intelligent search suggestions
  const generateSearchSuggestions = (query) => {
    const popularSearches = [
      'apartment', 'house', 'condo', 'studio', '1 bedroom', '2 bedroom', '3 bedroom',
      'downtown', 'uptown', 'suburb', 'pet friendly', 'parking', 'pool', 'gym'
    ];

    const locations = [
      'New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia',
      'San Antonio', 'San Diego', 'Dallas', 'San Jose', 'Austin', 'Jacksonville'
    ];

    const suggestions = [];

    // Add matching popular searches
    const matchingSearches = popularSearches.filter(search =>
      search.toLowerCase().includes(query.toLowerCase())
    ).slice(0, 3);
    matchingSearches.forEach(search => {
      suggestions.push({
        type: 'popular',
        text: search,
        icon: <SearchIcon />,
        description: 'Popular search'
      });
    });

    // Add matching locations
    const matchingLocations = locations.filter(location =>
      location.toLowerCase().includes(query.toLowerCase())
    ).slice(0, 2);
    matchingLocations.forEach(location => {
      suggestions.push({
        type: 'location',
        text: location,
        icon: <PropertiesIcon />,
        description: 'Location'
      });
    });

    // Add recent searches if available
    const recentSearches = JSON.parse(localStorage.getItem('recentSearches') || '[]');
    const matchingRecent = recentSearches.filter(search =>
      search.toLowerCase().includes(query.toLowerCase())
    ).slice(0, 2);
    matchingRecent.forEach(search => {
      suggestions.push({
        type: 'recent',
        text: search,
        icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>,
        description: 'Recent search'
      });
    });

    return suggestions.slice(0, 6); // Limit to 6 suggestions
  };

  // Handle suggestion click
  const handleSuggestionClick = (suggestion) => {
    setSearchQuery(suggestion.text);
    setShowSearchDropdown(false);
    // Save to recent searches
    const recentSearches = JSON.parse(localStorage.getItem('recentSearches') || '[]');
    const updated = [suggestion.text, ...recentSearches.filter(s => s !== suggestion.text)].slice(0, 5);
    localStorage.setItem('recentSearches', JSON.stringify(updated));
    // Perform search
    window.location.href = `/search?search=${encodeURIComponent(suggestion.text)}`;
  };

  // Helper function to check if link is active
  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  // Ultra-Enhanced NavLink component with advanced visual effects
  const NavLink = ({ to, children, className = '', icon, mobile = false, style = {} }) => {
    const active = isActive(to);
    const baseClasses = mobile
      ? `group relative block py-3 px-4 rounded-xl transition-all duration-300 ease-out transform hover:scale-105 overflow-hidden ${active
        ? 'bg-gradient-to-r from-[var(--brand-accent)]/25 via-[var(--brand-accent)]/15 to-[var(--brand-accent)]/25 text-[var(--brand-accent)] border-l-4 border-[var(--brand-accent)] shadow-md shadow-[var(--brand-accent)]/25 font-semibold'
        : 'text-[var(--ui-text-secondary)] hover:text-[var(--brand-accent)] hover:bg-gradient-to-r hover:from-[var(--ui-bg-muted)] hover:to-[var(--ui-bg-surface)] hover:shadow-sm'
      }`
      : `group relative px-4 py-3 rounded-xl transition-all duration-300 ease-out transform hover:scale-105 overflow-hidden ${active
        ? 'text-[var(--brand-accent)] bg-gradient-to-r from-[var(--brand-accent)]/20 via-[var(--brand-accent)]/10 to-[var(--brand-accent)]/20 shadow-lg shadow-[var(--brand-accent)]/20 border border-[var(--brand-accent)]/30 font-semibold'
        : 'text-[var(--ui-text-secondary)] hover:text-[var(--brand-accent)] hover:bg-gradient-to-r hover:from-[var(--ui-bg-muted)] hover:to-[var(--ui-bg-surface)] hover:shadow-md'
      }`;

    return (
      <Link
        to={to}
        className={`${baseClasses} ${className} focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--ui-bg-surface)]`}
        style={style}
        onClick={() => mobile && setMobileMenuOpen(false)}
        aria-current={active ? 'page' : undefined}
      >
        {/* Ripple effect container */}
        <div className="absolute inset-0 overflow-hidden rounded-xl">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-[var(--brand-accent)]/10 via-transparent to-[var(--brand-accent)]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>

        {/* Floating particles effect */}
        <div className="absolute top-1 right-1 w-1 h-1 bg-[var(--brand-accent)]/60 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:animate-ping"></div>
        <div className="absolute bottom-1 left-1 w-0.5 h-0.5 bg-[var(--brand-secondary)]/50 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 group-hover:animate-pulse"></div>

        <div className="flex items-center space-x-3 relative z-10">
          {icon && (
            <span className={`inline-flex items-center justify-center w-5 h-5 transition-all duration-300 relative ${active ? 'text-[var(--brand-accent)] scale-110' : 'text-[var(--ui-text-muted)] group-hover:text-[var(--brand-accent)] group-hover:scale-110'
              }`}>
              {icon}
              {/* Icon glow effect */}
              <div className="absolute inset-0 bg-[var(--brand-accent)]/20 rounded-full scale-0 group-hover:scale-150 transition-transform duration-300 opacity-0 group-hover:opacity-100 blur-sm"></div>
            </span>
          )}
          <span className={`font-medium transition-all duration-300 relative ${active ? 'text-[var(--brand-accent)] font-bold' : 'group-hover:font-medium'
            }`}>
            {children}
            {/* Text underline effect */}
            <span className={`absolute -bottom-0.5 left-0 h-0.5 bg-gradient-to-r from-[var(--brand-accent)] to-[var(--brand-secondary)] transition-all duration-300 ${active ? 'w-full' : 'w-0 group-hover:w-full'
              }`}></span>
          </span>
        </div>

        {/* Enhanced active indicator with particles */}
        {active && !mobile && (
          <>
            <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-6 h-1 bg-gradient-to-r from-[var(--brand-accent)] to-[var(--brand-accent)]/80 rounded-full shadow-sm animate-pulse"></div>
            <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-6 h-1 bg-[var(--brand-accent)] rounded-full opacity-50 blur-sm"></div>
            {/* Active state particles */}
            <div className="absolute top-0 right-0 w-1 h-1 bg-[var(--brand-accent)] rounded-full animate-ping opacity-75"></div>
            <div className="absolute bottom-0 left-0 w-0.5 h-0.5 bg-[var(--brand-secondary)] rounded-full animate-pulse opacity-60"></div>
          </>
        )}

        {/* Advanced hover glow effect */}
        <div className={`absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${active ? 'bg-gradient-to-r from-[var(--brand-accent)]/5 to-transparent' : 'bg-gradient-to-r from-[var(--ui-bg-muted)] to-transparent'
          }`}></div>

        {/* Morphing background effect */}
        <div className={`absolute inset-0 rounded-xl scale-0 group-hover:scale-110 transition-transform duration-500 opacity-0 group-hover:opacity-100 ${active ? 'bg-[var(--brand-accent)]/5' : 'bg-[var(--ui-bg-muted)]/30'
          } blur-xl`}></div>
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

  const UserGroupIcon = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
  );

  const HomeOwnerIcon = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
    </svg>
  );

  const SparklesIcon = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
    </svg>
  );

  const CogIcon = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );

  const InfoIcon = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );

  return (
    <nav className="bg-gradient-to-r from-[var(--ui-bg-surface)]/98 via-[var(--ui-bg-surface)]/95 to-[var(--ui-bg-surface)]/98 backdrop-blur-xl shadow-soft sticky top-0 z-50 border-b border-[var(--ui-border-default)]/60 transition-all duration-300">
      {/* Enhanced animated background overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-overlay-primary)]/20 via-transparent to-[var(--color-overlay-secondary)]/20 opacity-0 hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
      {/* Subtle animated accent line */}
      <div className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-[var(--brand-accent)] via-[var(--brand-secondary)] to-[var(--brand-tertiary)] transform scale-x-0 hover:scale-x-100 transition-transform duration-700 origin-left"></div>
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Enhanced Main Navigation Bar */}
        <div className="flex items-center justify-between px-6 md:px-10 py-3">
          {/* Ultra-Enhanced Logo with Morphing Effects */}
          <Link
            to="/"
            className="flex items-center space-x-4 text-2xl font-black text-[var(--ui-text-primary)] hover:text-[var(--brand-accent)] transition-all duration-300 group hover:scale-105 relative z-10"
            aria-label="PropManage Home"
          >
            <div className="relative w-9 h-9">
              {/* Base morphing container */}
              <div className="absolute inset-0 bg-gradient-to-br from-[var(--brand-accent)] via-[var(--brand-secondary)] to-[var(--brand-accent-dark)] rounded-2xl flex items-center justify-center shadow-lg transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 overflow-hidden">

                {/* Morphing shape layers */}
                <div className="absolute inset-0 bg-gradient-to-br from-[var(--glow-primary)]/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>
                <div className="absolute inset-1 bg-gradient-to-br from-white/20 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 group-hover:scale-125"></div>

                {/* Dynamic border morphing */}
                <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-white/30 transition-all duration-500 group-hover:scale-110"></div>

                {/* Icon with complex animations */}
                <svg className="w-6 h-6 text-white transition-all duration-300 group-hover:scale-110 relative z-10 drop-shadow-sm group-hover:drop-shadow-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </div>

              {/* Floating particles around logo */}
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-[var(--brand-accent)] rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-ping transition-opacity duration-300"></div>
              <div className="absolute -bottom-1 -left-1 w-1.5 h-1.5 bg-[var(--brand-secondary)] rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-pulse transition-opacity duration-500"></div>
              <div className="absolute top-1/2 -right-2 w-1 h-1 bg-[var(--brand-tertiary)] rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-bounce transition-opacity duration-700"></div>

              {/* Morphing shadow effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-[var(--brand-accent)] to-transparent rounded-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-500 blur-lg scale-150 group-hover:scale-200"></div>
            </div>

            <span className="hidden sm:block transition-all duration-300 bg-gradient-to-r from-[var(--ui-text-primary)] to-[var(--ui-text-primary)] bg-clip-text group-hover:bg-gradient-to-r group-hover:from-[var(--brand-accent)] group-hover:to-[var(--brand-secondary)] group-hover:bg-clip-text font-bold tracking-tight relative">
              PropManage
              {/* Text morphing underline */}
              <span className="absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-[var(--brand-accent)] to-[var(--brand-secondary)] transition-all duration-500 w-0 group-hover:w-full"></span>
            </span>
          </Link>

          {/* Smart Search Bar with AI Suggestions (Desktop) */}
          <div className="hidden md:flex flex-1 max-w-lg mx-6 space-x-4">
            <form onSubmit={handleSearch} className="flex-1">
              <div className="relative group">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={handleSearchInput}
                  placeholder="Search properties, locations, features..."
                  className="w-full px-5 py-2 pl-12 pr-12 rounded-2xl bg-gradient-to-r from-[var(--ui-bg-muted)] to-[var(--ui-bg-surface)] border border-[var(--ui-border-default)]/60 text-[var(--ui-text-primary)] placeholder-[var(--ui-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-accent)]/30 focus:border-[var(--brand-accent)] transition-all duration-300 hover:shadow-md focus:shadow-lg"
                  onFocus={() => searchQuery && setShowSearchDropdown(true)}
                  onBlur={() => setTimeout(() => setShowSearchDropdown(false), 200)}
                />
                <div className="absolute left-4 top-2.5 text-[var(--ui-text-muted)] group-focus-within:text-[var(--brand-accent)] transition-colors duration-200">
                  <SearchIcon />
                </div>
                <button
                  type="submit"
                  className="absolute right-3 top-2 p-1.5 text-[var(--ui-text-muted)] hover:text-[var(--brand-accent)] hover:bg-[var(--brand-accent)]/10 rounded-xl transition-all duration-200 active:scale-95"
                  aria-label="Search"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
                {/* AI-powered search indicator */}
                <div className="absolute right-12 top-2.5 text-[var(--brand-accent)]/60 animate-pulse">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                </div>

                {/* Advanced Search Suggestions Dropdown */}
                {showSearchDropdown && searchSuggestions.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-[var(--ui-bg-surface)] rounded-2xl shadow-2xl border border-[var(--ui-border-default)]/50 overflow-hidden z-50 animate-fade-in">
                    <div className="max-h-80 overflow-y-auto">
                      {searchSuggestions.map((suggestion, index) => (
                        <button
                          key={index}
                          onClick={() => handleSuggestionClick(suggestion)}
                          className="w-full flex items-center space-x-3 px-4 py-3 hover:bg-[var(--ui-bg-muted)] transition-colors duration-150 group"
                        >
                          <div className={`flex items-center justify-center w-8 h-8 rounded-lg ${suggestion.type === 'popular' ? 'bg-[var(--brand-accent)]/10 text-[var(--brand-accent)]' :
                            suggestion.type === 'location' ? 'bg-[var(--ui-success)]/10 text-[var(--ui-success)]' :
                              'bg-[var(--ui-text-muted)]/10 text-[var(--ui-text-muted)]'
                            } group-hover:scale-110 transition-transform duration-200`}>
                            {suggestion.icon}
                          </div>
                          <div className="flex-1 text-left">
                            <div className="font-medium text-[var(--ui-text-primary)] group-hover:text-[var(--brand-accent)] transition-colors">
                              {suggestion.text}
                            </div>
                            <div className="text-xs text-[var(--ui-text-muted)] capitalize">
                              {suggestion.description}
                            </div>
                          </div>
                          <svg className="w-4 h-4 text-[var(--ui-text-muted)] group-hover:text-[var(--brand-accent)] group-hover:translate-x-1 transition-all duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </button>
                      ))}
                    </div>
                    <div className="border-t border-[var(--ui-border-default)]/50 px-4 py-2 bg-[var(--ui-bg-muted)]/50">
                      <div className="flex items-center justify-between text-xs text-[var(--ui-text-muted)]">
                        <span>AI-powered search</span>
                        <span>Press Enter to search</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </form>

            {/* Smart Suggestion */}
            {smartSuggestion && (
              <div className="animate-fade-in" style={{ animationDelay: '0.5s' }}>
                <Link
                  to={smartSuggestion.path}
                  className="group flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-[var(--brand-accent)]/10 to-[var(--brand-secondary)]/10 rounded-xl border border-[var(--brand-accent)]/20 hover:border-[var(--brand-accent)]/40 transition-all duration-300 hover:shadow-md hover:scale-105"
                  title={`Smart suggestion: ${smartSuggestion.text}`}
                >
                  <span className="text-[var(--brand-accent)] group-hover:scale-110 transition-transform duration-200">
                    {smartSuggestion.icon}
                  </span>
                  <span className="text-sm font-medium text-[var(--brand-accent)] group-hover:text-[var(--brand-accent)]/90">
                    {smartSuggestion.text}
                  </span>
                  <svg className="w-3 h-3 text-[var(--brand-accent)] group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-2">
            {/* Search (Mobile) */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-[var(--ui-text-secondary)] hover:text-[var(--brand-accent)] hover:bg-[var(--brand-accent)]/5 rounded-md transition-colors duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--ui-bg-surface)]"
              aria-label="Open navigation menu"
            >
              <SearchIcon />
            </button>

            {/* Notifications */}
            {isAuthenticated && (
              <div className="relative" ref={notificationRef}>
                <button
                  onClick={() => setNotificationMenuOpen(!notificationMenuOpen)}
                  className="relative p-2 text-[var(--ui-text-secondary)] hover:text-[var(--brand-accent)] hover:bg-[var(--ui-bg-muted)] rounded-lg transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--ui-bg-surface)] group hover:scale-110"
                  aria-label="Notifications"
                >
                  <div className="relative">
                    <NotificationIcon />
                    {/* Notification morphing effects */}
                    <div className="absolute inset-0 bg-[var(--brand-accent)]/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 scale-150 group-hover:scale-100"></div>
                  </div>
                  <span className="absolute top-1 right-1 w-2 h-2 bg-gradient-to-br from-[var(--ui-error)] to-[var(--ui-error)]/80 rounded-full shadow-soft animate-pulse transition-all duration-300 group-hover:scale-125 group-hover:shadow-lg">
                    <span className="absolute inset-0 bg-[var(--ui-error)] rounded-full animate-ping opacity-75"></span>
                  </span>
                </button>

                {notificationMenuOpen && (
                  <div className="absolute right-0 mt-2 w-80 bg-[var(--ui-bg-surface)] rounded-xl shadow-xl border border-[var(--ui-border-default)] py-2 overflow-hidden">
                    <div className="px-4 py-3 border-b border-[var(--ui-border-default)]">
                      <p className="text-sm font-semibold text-[var(--ui-text-primary)]">Notifications</p>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      <div className="px-4 py-3 text-sm text-[var(--ui-text-secondary)] hover:bg-[var(--ui-bg-muted)] hover:text-[var(--brand-accent)] transition-colors cursor-pointer">
                        <p className="font-medium">New application received</p>
                        <p className="text-xs text-[var(--ui-text-muted)] mt-1">2 hours ago</p>
                      </div>
                      <div className="px-4 py-3 text-sm text-[var(--ui-text-secondary)] hover:bg-[var(--ui-bg-muted)] hover:text-[var(--brand-accent)] transition-colors cursor-pointer border-t border-[var(--ui-border-default)]">
                        <p className="font-medium">Payment received</p>
                        <p className="text-xs text-[var(--ui-text-muted)] mt-1">1 day ago</p>
                      </div>
                    </div>
                    <Link
                      to="/notifications"
                      className="block px-4 py-2 text-sm text-center text-[var(--brand-accent)] hover:bg-[var(--ui-bg-muted)] transition-colors border-t border-[var(--ui-border-default)]"
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
                className="px-4 py-2.5 bg-[var(--brand-accent)] text-white rounded-lg hover:bg-[var(--brand-accent-dark)] transition-all duration-200 font-medium text-sm flex items-center space-x-2 shadow-sm hover:shadow-md hover:scale-105 active:scale-100"
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
                  className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-[var(--ui-bg-muted)] transition-all duration-300 group hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--ui-bg-surface)]"
                  aria-label="User menu"
                  aria-expanded={userMenuOpen}
                >
                  <div className="relative w-9 h-9">
                    {/* Morphing avatar container */}
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[var(--brand-accent)] to-[var(--brand-accent-dark)] flex items-center justify-center text-white font-bold shadow-soft ring-2 ring-[var(--ui-border-default)] group-hover:ring-[var(--brand-accent)] group-hover:shadow-medium transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 overflow-hidden">
                      {/* Avatar morphing effects */}
                      <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <div className="absolute inset-0 bg-gradient-to-br from-[var(--glow-primary)]/30 to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 group-hover:scale-125"></div>

                      <span className="relative z-10 transition-all duration-300 group-hover:scale-110">
                        {user?.name?.charAt(0).toUpperCase() || 'U'}
                      </span>
                    </div>

                    {/* Status indicator with morphing */}
                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-[var(--ui-success)] rounded-full border-2 border-[var(--ui-bg-surface)] transition-all duration-300 group-hover:scale-125 group-hover:shadow-md">
                      <div className="w-full h-full bg-[var(--ui-success)] rounded-full animate-pulse opacity-75"></div>
                    </div>

                    {/* Floating particles */}
                    <div className="absolute -top-1 -left-1 w-1 h-1 bg-[var(--brand-accent)] rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-ping transition-opacity duration-300"></div>
                  </div>
                  <span className="text-[var(--ui-text-secondary)] hidden lg:inline text-sm font-medium group-hover:text-[var(--brand-accent)] transition-all duration-300">{user?.name}</span>
                  <svg className={`w-4 h-4 text-[var(--ui-text-muted)] group-hover:text-[var(--brand-accent)] transition-all duration-300 ${userMenuOpen ? 'rotate-180 scale-110' : 'group-hover:scale-110'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-[var(--ui-bg-surface)] rounded-xl shadow-xl border border-[var(--ui-border-default)] overflow-hidden z-50 animate-fade-in">
                    {/* User Info Header */}
                    <div className="px-4 py-4 bg-[var(--ui-bg-muted)] border-b border-[var(--ui-border-default)]">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[var(--brand-accent)] to-[var(--brand-accent-dark)] flex items-center justify-center text-white font-bold text-lg shadow-sm">
                          {user?.name?.charAt(0).toUpperCase() || 'U'}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-[var(--ui-text-primary)] truncate">{user?.name}</p>
                          <p className="text-xs text-[var(--ui-text-muted)] mt-0.5 truncate">{user?.email}</p>
                          {user?.role && (
                            <span className="inline-block mt-1.5 px-2 py-0.5 text-xs font-medium bg-[var(--brand-accent)]/10 text-[var(--brand-accent)] rounded-full capitalize">
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
                        className="flex items-center space-x-3 px-4 py-2.5 text-sm font-medium text-[var(--ui-text-secondary)] hover:bg-[var(--ui-bg-muted)] hover:text-[var(--brand-accent)] transition-all duration-150 group"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <svg className="w-4 h-4 text-[var(--ui-text-muted)] group-hover:text-[var(--brand-accent)] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <span>Profile Settings</span>
                      </Link>
                      <div className="my-1 h-px bg-[var(--ui-border-default)]"></div>
                      <button
                        onClick={() => {
                          logout();
                          setUserMenuOpen(false);
                        }}
                        className="w-full flex items-center space-x-3 px-4 py-2.5 text-sm font-medium text-[var(--ui-error)]/90 hover:bg-[var(--ui-error)]/10 hover:text-[var(--ui-error)] transition-all duration-150 group"
                      >
                        <svg className="w-4 h-4 text-[var(--ui-error)]/70 group-hover:text-[var(--ui-error)] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        <span>Logout</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2 relative z-50">
                <Link to="/register" className="px-3 py-2 text-[var(--ui-text-secondary)] hover:text-[var(--brand-accent)] transition-colors text-sm font-medium">
                  Register
                </Link>
                <Link to="/login" className="px-4 py-2 bg-gradient-to-r from-[var(--brand-accent)] to-[var(--brand-accent-dark)] text-white rounded-xl hover:from-[var(--brand-accent-dark)] hover:to-[var(--brand-accent)] transition-all duration-300 text-sm font-semibold shadow-soft hover:shadow-medium hover:scale-105 active:scale-95">
                  Login
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-[var(--ui-text-secondary)] hover:text-[var(--brand-accent)] hover:bg-[var(--ui-bg-muted)] transition-colors p-2 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--ui-bg-surface)]"
            aria-label="Toggle menu"
            aria-expanded={mobileMenuOpen}
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

        {/* Ultra-Enhanced Navigation Bar - Main Links with Staggered Animations */}
        <div className="hidden md:flex items-center justify-center px-6 md:px-12 py-2 border-b border-[var(--ui-border-default)]/30">
          <nav className="flex items-center justify-center space-x-1 text-[var(--ui-text-secondary)] font-medium text-sm" role="navigation" aria-label="Main navigation">
            {isAuthenticated ? (
              <>

                {isPropertyManager && (
                  <>
                    <NavLink to="/property-manager/dashboard" icon={<DashboardIcon />} className="animate-fade-in-up" style={{ animationDelay: '0.1s' }}>Dashboard</NavLink>
                    <NavLink to="/property-manager/properties" icon={<PropertiesIcon />} className="animate-fade-in-up" style={{ animationDelay: '0.15s' }}>Properties</NavLink>
                    <NavLink to="/property-manager/subscriptions" className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>Subscriptions</NavLink>
                    <NavLink to="/property-manager/revenue" className="animate-fade-in-up" style={{ animationDelay: '0.25s' }}>Revenue</NavLink>
                    <NavLink to="/property-manager/vendors" className="animate-fade-in-up" style={{ animationDelay: '0.3s' }}>Vendors</NavLink>
                    <NavLink to="/property-manager/tasks" className="animate-fade-in-up" style={{ animationDelay: '0.35s' }}>Tasks</NavLink>
                    <NavLink to="/property-manager/reports" className="animate-fade-in-up" style={{ animationDelay: '0.4s' }}>Reports</NavLink>
                  </>
                )}
                {isVendor && (
                  <>
                    <NavLink to="/vendor/dashboard" icon={<DashboardIcon />} className="animate-fade-in-up" style={{ animationDelay: '0.1s' }}>Dashboard</NavLink>
                    <NavLink to="/vendor/tasks" className="animate-fade-in-up" style={{ animationDelay: '0.15s' }}>My Tasks</NavLink>
                    <NavLink to="/vendor/properties" icon={<PropertiesIcon />} className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>Properties</NavLink>
                    <NavLink to="/vendor/profile" className="animate-fade-in-up" style={{ animationDelay: '0.25s' }}>Profile</NavLink>
                  </>
                )}
                {isPropertyOwner && (
                  <>
                    <NavLink to="/owner/dashboard" icon={<DashboardIcon />} className="animate-fade-in-up" style={{ animationDelay: '0.1s' }}>Dashboard</NavLink>
                    <NavLink to="/owner/properties" icon={<PropertiesIcon />} className="animate-fade-in-up" style={{ animationDelay: '0.15s' }}>Properties</NavLink>
                    <NavLink to="/owner/managers" className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>Managers</NavLink>
                    <NavLink to="/owner/subscriptions" className="animate-fade-in-up" style={{ animationDelay: '0.25s' }}>Subscriptions</NavLink>
                    <NavLink to="/owner/applications" className="animate-fade-in-up" style={{ animationDelay: '0.3s' }}>Applications</NavLink>
                    <NavLink to="/owner/payments" className="animate-fade-in-up" style={{ animationDelay: '0.35s' }}>Payments</NavLink>
                    <NavLink to="/owner/messages" className="animate-fade-in-up" style={{ animationDelay: '0.4s' }}>Messages</NavLink>
                  </>
                )}
                {/* Tenant Navigation (Guaranteed Render) */}
                {isTenant && (
                  hasActiveProperty ? (
                    <>
                      <NavLink to="/tenant/dashboard" icon={<DashboardIcon />}>Dashboard</NavLink>
                      <NavLink to="/tenant/payments">Payments</NavLink>
                      <NavLink to="/tenant/messages">Messages</NavLink>
                      <NavLink to="/tenant/maintenance">Maintenance</NavLink>
                      <NavLink to="/tenant/lease">Lease</NavLink>
                      <NavLink to="/tenant/documents">Documents</NavLink>
                      <NavLink to="/tenant/profile">Profile</NavLink>
                    </>
                  ) : (
                    <>
                      <NavLink to="/" icon={<HomeIcon />}>Home</NavLink>
                      <NavLink to="/properties" icon={<PropertiesIcon />}>Properties</NavLink>
                      <NavLink to="/tenant/saved">Saved</NavLink>
                      <NavLink to="/tenant/profile">Profile</NavLink>
                      <NavLink to="/tenant/applications">Applications</NavLink>
                    </>
                  )
                )}
              </>
            ) : (
              <>
                <NavLink to="/" icon={<HomeIcon />} className="animate-fade-in-up" style={{ animationDelay: '0.1s' }}>Home</NavLink>
                <NavLink to="/properties" icon={<PropertiesIcon />} className="animate-fade-in-up" style={{ animationDelay: '0.15s' }}>Properties</NavLink>
                {!isTenant && (
                  <NavLink to="/for-tenants" icon={<UserGroupIcon />} className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>For Tenants</NavLink>
                )}
                {!isTenant && (
                  <NavLink to="/for-owners" icon={<HomeOwnerIcon />} className="animate-fade-in-up" style={{ animationDelay: '0.25s' }}>For Owners</NavLink>
                )}
                <NavLink to="/features" icon={<SparklesIcon />} className="animate-fade-in-up" style={{ animationDelay: '0.3s' }}>Features</NavLink>
                <NavLink to="/how-it-works" icon={<CogIcon />} className="animate-fade-in-up" style={{ animationDelay: '0.35s' }}>How It Works</NavLink>
                <NavLink to="/about" icon={<InfoIcon />} className="animate-fade-in-up" style={{ animationDelay: '0.4s' }}>About</NavLink>
              </>
            )}
          </nav>
        </div>
      </div>

      {/* Enhanced Mobile Menu */}
      <div className={`md:hidden border-t border-[var(--ui-border-default)]/60 bg-gradient-to-b from-[var(--ui-bg-surface)]/98 via-[var(--ui-bg-surface)]/95 to-[var(--ui-bg-surface)]/90 backdrop-blur-xl overflow-hidden transition-all duration-500 ease-out ${mobileMenuOpen ? 'max-h-screen opacity-100 shadow-2xl' : 'max-h-0 opacity-0'
        }`}>
        <div className="px-6 py-6 space-y-4 animate-fade-in" style={{ animationDelay: '0.1s', animationFillMode: 'both' }}>
          {/* Enhanced Mobile Search */}
          <form onSubmit={handleSearch} className="mb-6">
            <div className="relative group">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search properties..."
                className="w-full px-5 py-3 pl-12 pr-12 rounded-2xl bg-gradient-to-r from-[var(--ui-bg-muted)] to-[var(--ui-bg-surface)] border border-[var(--ui-border-default)]/60 text-[var(--ui-text-primary)] placeholder-[var(--ui-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-accent)]/30 focus:border-[var(--brand-accent)] transition-all duration-300 hover:shadow-md focus:shadow-lg"
              />
              <div className="absolute left-4 top-3.5 text-[var(--ui-text-muted)] group-focus-within:text-[var(--brand-accent)] transition-colors duration-200">
                <SearchIcon />
              </div>
              <button
                type="submit"
                className="absolute right-3 top-3 p-1.5 text-[var(--ui-text-muted)] hover:text-[var(--brand-accent)] hover:bg-[var(--brand-accent)]/10 rounded-xl transition-all duration-200 active:scale-95"
                aria-label="Search"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
          </form>

          {/* Enhanced Mobile Notifications */}
          {isAuthenticated && (
            <Link
              to="/notifications"
              className="group flex items-center justify-between py-3 px-4 rounded-2xl text-[var(--ui-text-secondary)] hover:bg-gradient-to-r hover:from-[var(--ui-bg-muted)] hover:to-[var(--ui-bg-surface)] hover:text-[var(--brand-accent)] transition-all duration-300 hover:shadow-md hover:scale-105"
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="flex items-center space-x-3">
                <span className="inline-flex items-center justify-center w-8 h-8 bg-[var(--ui-bg-muted)] group-hover:bg-[var(--brand-accent)]/10 rounded-xl transition-colors duration-200">
                  <NotificationIcon />
                </span>
                <span className="font-medium">Notifications</span>
              </span>
              <span className="flex items-center space-x-2">
                <span className="w-2 h-2 bg-[var(--ui-error)] rounded-full animate-pulse shadow-sm shadow-[var(--ui-error)]/50"></span>
                <svg className="w-4 h-4 text-[var(--ui-text-muted)] group-hover:text-[var(--brand-accent)] group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </span>
            </Link>
          )}

          {/* Mobile Post Property Button */}
          {isPropertyOwner && (
            <Link
              to="/owner/properties/new"
              className="block py-2 px-3 bg-[var(--brand-accent)] text-white rounded-lg hover:bg-[var(--brand-accent-dark)] transition-colors text-sm text-center font-semibold mb-2"
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
                hasActiveProperty ? (
                  <>
                    <NavLink to="/tenant/dashboard" mobile icon={<DashboardIcon />}>Dashboard</NavLink>
                    <NavLink to="/tenant/payments" mobile>Payments</NavLink>
                    <NavLink to="/tenant/messages" mobile>Messages</NavLink>
                    <NavLink to="/tenant/maintenance" mobile>Maintenance</NavLink>
                    <NavLink to="/tenant/lease" mobile>Lease</NavLink>
                    <NavLink to="/tenant/documents" mobile>Documents</NavLink>
                    <NavLink to="/tenant/profile" mobile>Profile</NavLink>
                  </>
                ) : (
                  <>
                    <NavLink to="/" mobile icon={<HomeIcon />}>Home</NavLink>
                    <NavLink to="/properties" mobile icon={<PropertiesIcon />}>Properties</NavLink>
                    <NavLink to="/tenant/saved" mobile icon={<PropertiesIcon />}>Saved Properties</NavLink>
                    <NavLink to="/tenant/profile" mobile>Profile</NavLink>
                    <NavLink to="/tenant/applications" mobile>Applications</NavLink>
                  </>
                )
              )}
              <div className="pt-6 mt-6 border-t border-[var(--ui-border-default)]/50">
                {/* Enhanced User Info */}
                <div className="px-4 py-4 mb-4 bg-gradient-to-r from-[var(--ui-bg-muted)] via-[var(--ui-bg-surface)] to-[var(--ui-bg-muted)] rounded-2xl border border-[var(--ui-border-default)]/30 shadow-sm">
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[var(--brand-accent)] via-[var(--brand-secondary)] to-[var(--brand-accent-dark)] flex items-center justify-center text-white font-bold text-lg shadow-lg ring-2 ring-[var(--ui-border-default)]/20">
                        {user?.name?.charAt(0).toUpperCase() || 'U'}
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-[var(--ui-success)] rounded-full border-2 border-[var(--ui-bg-surface)] animate-pulse"></div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-base font-bold text-[var(--ui-text-primary)] truncate">{user?.name}</p>
                      <p className="text-sm text-[var(--ui-text-muted)] truncate mb-1">{user?.email}</p>
                      {user?.role && (
                        <span className="inline-flex items-center px-3 py-1 text-xs font-semibold bg-gradient-to-r from-[var(--brand-accent)]/15 to-[var(--brand-secondary)]/15 text-[var(--brand-accent)] rounded-full border border-[var(--brand-accent)]/20 capitalize">
                          <span className="w-1.5 h-1.5 bg-[var(--brand-accent)] rounded-full mr-2 animate-pulse"></span>
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
                  className="group flex items-center space-x-4 py-4 px-4 rounded-2xl text-[var(--ui-text-secondary)] hover:bg-gradient-to-r hover:from-[var(--ui-bg-muted)] hover:to-[var(--ui-bg-surface)] hover:text-[var(--brand-accent)] transition-all duration-300 hover:shadow-md hover:scale-105 text-sm font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span className="inline-flex items-center justify-center w-10 h-10 bg-[var(--ui-bg-muted)] group-hover:bg-[var(--brand-accent)]/10 rounded-xl transition-all duration-200 group-hover:scale-110">
                    <svg className="w-5 h-5 text-[var(--ui-text-muted)] group-hover:text-[var(--brand-accent)] transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </span>
                  <span>Profile Settings</span>
                  <svg className="w-4 h-4 text-[var(--ui-text-muted)] group-hover:text-[var(--brand-accent)] group-hover:translate-x-1 transition-all duration-200 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full group flex items-center space-x-4 py-4 px-4 rounded-2xl text-[var(--ui-error)]/90 hover:bg-gradient-to-r hover:from-[var(--ui-error)]/10 hover:to-[var(--ui-error)]/5 hover:text-[var(--ui-error)] transition-all duration-300 hover:shadow-md hover:scale-105 text-sm font-medium mt-2 border border-[var(--ui-error)]/20 hover:border-[var(--ui-error)]/30"
                >
                  <span className="inline-flex items-center justify-center w-10 h-10 bg-[var(--ui-error)]/10 group-hover:bg-[var(--ui-error)]/20 rounded-xl transition-all duration-200 group-hover:scale-110">
                    <svg className="w-5 h-5 text-[var(--ui-error)]/70 group-hover:text-[var(--ui-error)] transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                  </span>
                  <span>Logout</span>
                  <svg className="w-4 h-4 text-[var(--ui-error)]/50 group-hover:text-[var(--ui-error)] group-hover:translate-x-1 transition-all duration-200 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </>
          ) : (
            <>
              <NavLink to="/" mobile icon={<HomeIcon />}>Home</NavLink>
              <NavLink to="/properties" mobile icon={<PropertiesIcon />}>Properties</NavLink>
              {!isTenant && <NavLink to="/for-tenants" mobile icon={<UserGroupIcon />}>For Tenants</NavLink>}
              {!isTenant && <NavLink to="/for-owners" mobile icon={<HomeOwnerIcon />}>For Owners</NavLink>}
              <NavLink to="/features" mobile icon={<SparklesIcon />}>Features</NavLink>
              <NavLink to="/how-it-works" mobile icon={<CogIcon />}>How It Works</NavLink>
              <NavLink to="/about" mobile icon={<InfoIcon />}>About</NavLink>
              <div className="pt-6 mt-6 border-t border-[var(--ui-border-default)]/50 space-y-4">
                <Link
                  to="/register"
                  className="group block py-4 px-6 rounded-2xl text-[var(--ui-text-secondary)] hover:bg-gradient-to-r hover:from-[var(--ui-bg-muted)] hover:to-[var(--ui-bg-surface)] hover:text-[var(--brand-accent)] transition-all duration-300 hover:shadow-md hover:scale-105 text-sm text-center font-medium border border-[var(--ui-border-default)]/30 hover:border-[var(--brand-accent)]/30"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span className="flex items-center justify-center space-x-2">
                    <svg className="w-4 h-4 text-[var(--ui-text-muted)] group-hover:text-[var(--brand-accent)] transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                    </svg>
                    <span>Register</span>
                  </span>
                </Link>
                <Link
                  to="/login"
                  className="group block py-4 px-6 bg-gradient-to-r from-[var(--brand-accent)] via-[var(--brand-accent)] to-[var(--brand-accent-dark)] text-white rounded-2xl hover:from-[var(--brand-accent-dark)] hover:to-[var(--brand-accent)] transition-all duration-500 text-sm text-center font-semibold shadow-lg hover:shadow-2xl hover:shadow-[var(--glow-primary)] hover:scale-105 active:scale-95 relative overflow-hidden"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                  <span className="flex items-center justify-center space-x-2 relative z-10">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    <span>Login</span>
                  </span>
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

