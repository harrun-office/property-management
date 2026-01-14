import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { tenantAPI, propertiesAPI } from '../../../services/api';
import TenantSidebar from './TenantSidebar';
import RoleBasedNavbar from '../../RoleBasedNavbar';
import Footer from '../../Footer';

function TenantLayout() {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [isSidebarHovered, setIsSidebarHovered] = useState(false);
    const { user, logout } = useAuth();
    const location = useLocation();
    const [hasActiveTenancy, setHasActiveTenancy] = useState(user?.hasActiveTenancy || false);
    const [hasRejectedApplication, setHasRejectedApplication] = useState(false);

    useEffect(() => {
        if (user?.role?.trim().toLowerCase() === 'tenant') {
            // Check for active tenancy
            tenantAPI.getDashboard()
                .then(data => {
                    setHasActiveTenancy(!!data.currentProperty);
                })
                .catch(() => {
                    setHasActiveTenancy(false);
                });

            // Check for rejected applications
            propertiesAPI.getMyApplications?.()
                .then(applications => {
                    const hasRejected = applications.some(app => app.status === 'rejected');
                    setHasRejectedApplication(hasRejected);
                })
                .catch(() => {
                    setHasRejectedApplication(false);
                });
        }
    }, [user]);

    // If tenant has no active property or has rejected applications, show public layout structure (normal tenant login UI style)
    if (user?.role?.trim().toLowerCase() === 'tenant' && (!hasActiveTenancy || hasRejectedApplication)) {
        return (
            <div className="h-full overflow-y-auto bg-[var(--ui-bg-page)] flex flex-col">
                <RoleBasedNavbar />
                <main className="flex-grow">
                    <Outlet />
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div className="flex h-screen overflow-hidden bg-[var(--ui-bg-page)]">
            <TenantSidebar
                isOpen={mobileOpen}
                onClose={() => setMobileOpen(false)}
                isHovered={isSidebarHovered}
                onHoverChange={setIsSidebarHovered}
            />

            {/* Main Wrapper - Dynamic margin based on sidebar hover */}
            <div className={`flex-1 min-w-0 flex flex-col h-full transition-[margin] duration-300 ease-in-out ${isSidebarHovered ? 'lg:ml-64' : 'lg:ml-20'}`}>

                {/* Header */}
                <header className="h-16 bg-[var(--ui-bg-surface)] border-b border-[var(--ui-border-default)] flex items-center justify-between px-6 sticky top-0 z-20 shrink-0">
                    <div className="flex items-center gap-4">
                        {/* Mobile Toggle */}
                        <button
                            onClick={() => setMobileOpen(true)}
                            className="lg:hidden p-2 -ml-2 text-[var(--ui-text-secondary)] hover:text-[var(--ui-text-primary)]"
                        >
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>

                        {/* Title / Role Indicator */}
                        <div className="flex items-center gap-4 group relative cursor-pointer">
                            <div className="relative w-10 h-10">
                                {/* Base morphing container */}
                                <div className="absolute inset-0 bg-gradient-to-br from-[var(--brand-accent)] via-[var(--brand-secondary)] to-[var(--brand-accent-dark)] rounded-xl flex items-center justify-center shadow-lg transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 overflow-hidden">
                                    {/* Icon */}
                                    <svg className="w-6 h-6 text-white transition-all duration-300 group-hover:scale-110 relative z-10 drop-shadow-sm" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                    </svg>
                                </div>
                            </div>
                            <div className="flex flex-col">
                                <span className="font-bold text-lg leading-tight text-[var(--ui-text-primary)] group-hover:text-[var(--brand-accent)] transition-colors duration-300">
                                    PropManage
                                </span>
                                <span className="text-[10px] text-[var(--ui-text-muted)] font-medium uppercase tracking-wider flex items-center gap-1">
                                    Tenant Portal <span className="w-1 h-1 rounded-full bg-[var(--ui-border-default)]"></span> v1.0
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Right Side: Profile & Logout */}
                    <div className="flex items-center gap-4">
                        <div className="hidden md:flex flex-col items-end">
                            <span className="text-sm font-medium text-[var(--ui-text-primary)]">{user?.name || 'Tenant'}</span>
                            <span className="text-xs text-[var(--ui-text-muted)]">{user?.email}</span>
                        </div>
                        <button
                            onClick={logout}
                            className="p-2 text-[var(--ui-text-muted)] hover:text-[var(--ui-error)] hover:bg-[var(--ui-error)]/10 rounded-full transition-colors"
                            title="Logout"
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                        </button>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 min-h-0 overflow-y-auto p-6 scroll-smooth">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default TenantLayout;
