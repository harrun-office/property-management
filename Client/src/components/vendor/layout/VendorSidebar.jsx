import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const VendorSidebar = ({ mobileOpen, setMobileOpen, setIsSidebarHovered }) => {
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
    const TaskIcon = () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>;
    const PropertyIcon = () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>;
    const UserIcon = () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>;

    const content = (
        <div className="flex flex-col h-full bg-[var(--ui-bg-surface)] border-r border-[var(--ui-border-default)]">
            {/* Navigation */}
            <div className="flex-1 overflow-y-auto py-6 px-3 custom-scrollbar">
                <NavItem to="/vendor/dashboard" icon={<DashboardIcon />}>Dashboard</NavItem>
                <NavItem to="/vendor/tasks" icon={<TaskIcon />}>My Tasks</NavItem>
                <NavItem to="/vendor/properties" icon={<PropertyIcon />}>Assigned Properties</NavItem>

                <div className="border-t border-[var(--ui-border-default)] my-4 mx-2"></div>

                <NavItem to="/vendor/profile" icon={<UserIcon />}>My Profile</NavItem>
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

export default VendorSidebar;
