import React from 'react';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Business Context - Textual Only */}
      <div className="bg-[var(--ui-bg-surface)] p-6 rounded-lg border border-[var(--ui-border-default)] shadow-sm">
        <h1 className="text-xl font-bold text-[var(--ui-text-primary)] mb-2">
          Super Admin Overview
        </h1>
        <p className="text-[var(--ui-text-secondary)]">
          This dashboard exists to onboard and control professional access to the platform.
          Revenue is generated <strong>only</strong> when a Property Owner hires a Property Manager or Vendor.
        </p>
      </div>

      {/* Credential Management - PRIMARY */}
      <div>
        <h2 className="text-lg font-semibold text-[var(--ui-text-primary)] mb-4">Credential Management</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Managers Section */}
          <div className="bg-[var(--ui-bg-surface)] rounded-lg border border-[var(--ui-border-default)] p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-bold text-[var(--ui-text-primary)]">Property Managers</h3>
                <p className="text-sm text-[var(--ui-text-muted)]">Manage property manager accounts</p>
              </div>
            </div>
            <div className="space-y-3">
              <Link
                to="/admin/credentials/managers?action=create"
                className="block w-full py-2 px-4 text-center bg-[var(--ui-action-primary)] text-white rounded-md hover:bg-[var(--ui-action-hover)] font-medium transition-colors"
              >
                Create Credentials
              </Link>
              <Link
                to="/admin/credentials/managers"
                className="block w-full py-2 px-4 text-center border border-[var(--ui-border-default)] text-[var(--ui-text-secondary)] rounded-md hover:bg-[var(--ui-bg-muted)] transition-colors"
              >
                View List
              </Link>
            </div>
          </div>

          {/* Vendors Section */}
          <div className="bg-[var(--ui-bg-surface)] rounded-lg border border-[var(--ui-border-default)] p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 rounded-full bg-green-100 text-green-600">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-bold text-[var(--ui-text-primary)]">Vendors</h3>
                <p className="text-sm text-[var(--ui-text-muted)]">Manage vendor accounts</p>
              </div>
            </div>
            <div className="space-y-3">
              <Link
                to="/admin/credentials/vendors?action=create"
                className="block w-full py-2 px-4 text-center bg-[var(--ui-action-primary)] text-white rounded-md hover:bg-[var(--ui-action-hover)] font-medium transition-colors"
              >
                Create Credentials
              </Link>
              <Link
                to="/admin/credentials/vendors"
                className="block w-full py-2 px-4 text-center border border-[var(--ui-border-default)] text-[var(--ui-text-secondary)] rounded-md hover:bg-[var(--ui-bg-muted)] transition-colors"
              >
                View List
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
