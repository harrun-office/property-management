import React from 'react';
import { Outlet } from 'react-router-dom';
import RoleBasedNavbar from '../RoleBasedNavbar';
import Footer from '../Footer';

const MainLayout = () => {
    return (
        <div className="min-h-screen bg-[var(--ui-bg-page)] text-[var(--ui-text-primary)] flex flex-col">
            <RoleBasedNavbar />
            <main className="flex-grow">
                <Outlet />
            </main>
            <Footer />
        </div>
    );
};

export default MainLayout;
