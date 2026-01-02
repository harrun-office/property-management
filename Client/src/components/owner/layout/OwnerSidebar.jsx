import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';

const OwnerSidebar = ({ mobileOpen, setMobileOpen, setIsSidebarHovered }) => {
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
    const PropertiesIcon = () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>;
    const ApplicationsIcon = () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>;
    const PaymentsIcon = () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
    const MessagesIcon = () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>;
    const ManagersIcon = () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>;
    const SubscriptionsIcon = () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>;
    const ReportsIcon = () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>;
    const MaintenanceIcon = () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;
    const SettingsIcon = () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;

    const content = (
        <div className="flex flex-col h-full bg-[var(--ui-bg-surface)] border-r border-[var(--ui-border-default)]">
            {/* Navigation */}
            <div className="flex-1 overflow-y-auto py-6 px-3 custom-scrollbar">
                <NavItem to="/owner/dashboard" icon={<DashboardIcon />}>Dashboard</NavItem>
                <NavItem to="/owner/properties" icon={<PropertiesIcon />}>My Properties</NavItem>
                <NavItem to="/owner/applications" icon={<ApplicationsIcon />}>Applications</NavItem>
                <NavItem to="/owner/payments" icon={<PaymentsIcon />}>Payments</NavItem>
                <NavItem to="/owner/messages" icon={<MessagesIcon />}>Messages</NavItem>
                <NavItem to="/owner/managers" icon={<ManagersIcon />}>Hire Manager</NavItem>
                <NavItem to="/owner/subscriptions" icon={<SubscriptionsIcon />}>Subscriptions</NavItem>
                <NavItem to="/owner/maintenance" icon={<MaintenanceIcon />}>Maintenance</NavItem>
                <NavItem to="/owner/reports" icon={<ReportsIcon />}>Reports</NavItem>

                <div className="border-t border-[var(--ui-border-default)] my-4 mx-2"></div>

                <NavItem to="/owner/settings" icon={<SettingsIcon />}>Settings</NavItem>
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

export default OwnerSidebar;
