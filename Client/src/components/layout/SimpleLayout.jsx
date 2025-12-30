import React from 'react';
import { Outlet } from 'react-router-dom';
import { Link } from 'react-router-dom';

const SimpleLayout = () => {
    return (
        <div className="min-h-screen bg-[var(--ui-bg-page)] text-[var(--ui-text-primary)] flex flex-col">
            {/* Logo Header */}
            <div className="flex items-center justify-center py-2">
                <Link
                    to="/"
                    className="flex items-center space-x-4 text-2xl font-black text-[var(--ui-text-primary)] hover:text-[var(--brand-accent)] transition-all duration-300 group hover:scale-105 relative z-10"
                    aria-label="PropManage Home"
                >
                    <div className="relative w-11 h-11">
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
            </div>

            <main className="flex-grow">
                <Outlet />
            </main>
        </div>
    );
};

export default SimpleLayout;
