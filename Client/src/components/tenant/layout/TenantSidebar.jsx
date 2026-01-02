import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const TenantSidebar = ({ mobileOpen, setMobileOpen, setIsSidebarHovered }) => {
    const location = useLocation();
    const [isHovered, setIsHovered] = useState(false);

    // In desktop mode, sidebar is collapsed by default and expands on hover
    const isCollapsed = !isHovered;

    const handleMouseEnter = () => {
        setIsHovered(true);
        if (setIsSidebarHovered) setIsSidebarHovered(true);
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
        if (setIsSidebarHovered) setIsSidebarHovered(false);
    };

    // Helper to check active state
    const isActive = (path) => location.pathname === path || location.pathname.startsWith(`${path}/`);

    const NavItem = ({ to, icon, children }) => (
        <Link
            to={to}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${isActive(to)
                ? 'bg-[var(--ui-action-primary)] text-white shadow-md'
                : 'text-[var(--ui-text-secondary)] hover:bg-[var(--ui-bg-muted)] hover:text-[var(--ui-text-primary)]'
                } ${isCollapsed ? 'justify-center px-2' : ''}`}
            onClick={() => setMobileOpen(false)}
            title={isCollapsed ? children : ''}
        >
            <div className={isCollapsed ? "w-6 h-6" : ""}>{icon}</div>
            {!isCollapsed && <span className="whitespace-nowrap opacity-100 transition-opacity duration-300 delay-100">{children}</span>}
        </Link>
    );

    // Icons
    const DashboardIcon = () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>;
    const PaymentsIcon = () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
    const MessagesIcon = () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>;
    const MaintenanceIcon = () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;
    const LeaseIcon = () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>;
    const DocumentIcon = () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>;
    const HeartIcon = () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>;
    const UserIcon = () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>;
    const BriefcaseIcon = () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>;

    const content = (
        <div className="flex flex-col h-full bg-[var(--ui-bg-surface)] border-r border-[var(--ui-border-default)]">
            {/* Navigation */}
            <div className="flex-1 overflow-y-auto py-6 px-3 custom-scrollbar">
                <NavItem to="/tenant/dashboard" icon={<DashboardIcon />}>Dashboard</NavItem>
                <NavItem to="/tenant/payments" icon={<PaymentsIcon />}>Payments</NavItem>
                <NavItem to="/tenant/messages" icon={<MessagesIcon />}>Messages</NavItem>
                <NavItem to="/tenant/maintenance" icon={<MaintenanceIcon />}>Maintenance</NavItem>
                <NavItem to="/tenant/lease" icon={<LeaseIcon />}>My Lease</NavItem>
                <NavItem to="/tenant/documents" icon={<DocumentIcon />}>Documents</NavItem>
                <NavItem to="/tenant/saved" icon={<HeartIcon />}>Saved Properties</NavItem>
                <NavItem to="/tenant/applications" icon={<BriefcaseIcon />}>Applications</NavItem>

                <div className="border-t border-[var(--ui-border-default)] my-4 mx-2"></div>

                <NavItem to="/tenant/profile" icon={<UserIcon />}>My Profile</NavItem>
            </div>

            {/* Platform Signals */}
            {!isCollapsed && (
                <div className="p-4 border-t border-[var(--ui-border-default)] whitespace-nowrap">
                    <div className="flex items-center justify-between text-xs text-[var(--ui-text-muted)]">
                        <span>v1.0.0</span>
                        <span className="px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700 font-medium">Production</span>
                    </div>
                </div>
            )}
        </div>
    );

    return (
        <>
            {/* Desktop Sidebar */}
            <div
                className={`hidden lg:block fixed inset-y-0 left-0 z-30 transition-[width] duration-300 ease-in-out shadow-2xl ${isCollapsed ? 'w-20' : 'w-64'}`}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            >
                {content}
            </div>

            {/* Mobile Sidebar (Drawer) */}
            <div className={`lg:hidden fixed inset-0 z-40 transition-opacity duration-300 ${mobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
                {/* Backdrop */}
                <div
                    className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                    onClick={() => setMobileOpen(false)}
                />

                {/* Drawer */}
                <div className={`absolute inset-y-0 left-0 w-64 bg-[var(--ui-bg-surface)] transform transition-transform duration-300 shadow-2xl ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                    {content}
                </div>
            </div>
        </>
    );
};

export default TenantSidebar;
