import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function RoleBasedNavbar() {
  const { isAuthenticated, user, logout, isSuperAdmin, isPropertyManager, isVendor, isPropertyOwner } = useAuth();

  return (
    <nav className="flex items-center justify-between px-4 md:px-10 py-5 bg-obsidian-500 shadow-lg">
      <Link to="/" className="text-2xl font-bold text-porcelain hover:text-brass-500 transition-colors">PropManage</Link>
      <div className="flex items-center space-x-4 md:space-x-6 text-porcelain font-medium text-sm md:text-base">
        {isAuthenticated ? (
          <>
            {isSuperAdmin && (
              <>
                <Link to="/admin/dashboard" className="hover:text-brass-500 transition-colors">Dashboard</Link>
                <Link to="/admin/property-managers" className="hover:text-brass-500 transition-colors">Property Managers</Link>
                <Link to="/admin/audit-logs" className="hover:text-brass-500 transition-colors hidden lg:inline">Audit Logs</Link>
                <Link to="/admin/analytics" className="hover:text-brass-500 transition-colors hidden lg:inline">Analytics</Link>
                <Link to="/admin/settings" className="hover:text-brass-500 transition-colors hidden lg:inline">Settings</Link>
              </>
            )}
            {isPropertyManager && (
              <>
                <Link to="/property-manager/dashboard" className="hover:text-brass-500 transition-colors">Dashboard</Link>
                <Link to="/property-manager/properties" className="hover:text-brass-500 transition-colors">Properties</Link>
                <Link to="/property-manager/vendors" className="hover:text-brass-500 transition-colors">Vendors</Link>
                <Link to="/property-manager/tasks" className="hover:text-brass-500 transition-colors">Tasks</Link>
                <Link to="/property-manager/reports" className="hover:text-brass-500 transition-colors hidden lg:inline">Reports</Link>
              </>
            )}
            {isVendor && (
              <>
                <Link to="/vendor/dashboard" className="hover:text-brass-500 transition-colors">Dashboard</Link>
                <Link to="/vendor/tasks" className="hover:text-brass-500 transition-colors">My Tasks</Link>
                <Link to="/vendor/properties" className="hover:text-brass-500 transition-colors">Properties</Link>
                <Link to="/vendor/profile" className="hover:text-brass-500 transition-colors">Profile</Link>
              </>
            )}
            {isPropertyOwner && (
              <>
                <Link to="/owner/dashboard" className="hover:text-brass-500 transition-colors">Dashboard</Link>
                <Link to="/owner/properties" className="hover:text-brass-500 transition-colors">Properties</Link>
                <Link to="/owner/applications" className="hover:text-brass-500 transition-colors">Applications</Link>
                <Link to="/owner/payments" className="hover:text-brass-500 transition-colors hidden lg:inline">Payments</Link>
                <Link to="/owner/messages" className="hover:text-brass-500 transition-colors hidden lg:inline">Messages</Link>
              </>
            )}
            <span className="text-stone-200 hidden md:inline">Hello, {user?.name}</span>
            <button
              onClick={logout}
              className="px-4 py-2 bg-error text-porcelain rounded-xl hover:bg-error/90 transition-colors text-sm md:text-base"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/properties" className="hover:text-brass-500 transition-colors">Properties</Link>
            <Link to="/for-tenants" className="hover:text-brass-500 transition-colors hidden md:inline">For Tenants</Link>
            <Link to="/for-owners" className="hover:text-brass-500 transition-colors hidden md:inline">For Owners</Link>
            <Link to="/features" className="hover:text-brass-500 transition-colors hidden lg:inline">Features</Link>
            <Link to="/how-it-works" className="hover:text-brass-500 transition-colors hidden lg:inline">How It Works</Link>
            <Link to="/about" className="hover:text-brass-500 transition-colors hidden lg:inline">About</Link>
            <Link to="/register" className="hover:text-brass-500 transition-colors">Register</Link>
            <Link to="/login" className="hover:text-brass-500 transition-colors">Login</Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default RoleBasedNavbar;

