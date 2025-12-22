import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function ProtectedRoute({ children, requireSuperAdmin = false, requirePropertyManager = false, requireVendor = false, requirePropertyOwner = false }) {
  const { isAuthenticated, isSuperAdmin, isPropertyManager, isVendor, isPropertyOwner, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-porcelain flex items-center justify-center">
        <p className="text-architectural">Loading...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requireSuperAdmin && !isSuperAdmin) {
    return (
      <div className="min-h-screen bg-porcelain flex items-center justify-center">
        <div className="text-center">
          <p className="text-error text-lg mb-4">Super Admin access required</p>
          <a href="/" className="text-obsidian-500 hover:text-brass-500 hover:underline transition-colors">Go to home</a>
        </div>
      </div>
    );
  }

  // Strict role-based access: Each role can only access their own routes
  // Super Admin can only access super admin routes
  if (isSuperAdmin && (requirePropertyManager || requireVendor || requirePropertyOwner)) {
    return (
      <div className="min-h-screen bg-porcelain flex items-center justify-center">
        <div className="text-center">
          <p className="text-error text-lg mb-4">Access Denied: Super Admin can only access admin routes</p>
          <a href="/admin/dashboard" className="text-obsidian-500 hover:text-brass-500 hover:underline transition-colors">Go to Admin Dashboard</a>
        </div>
      </div>
    );
  }

  // Property Manager can only access property manager routes
  if (requirePropertyManager && !isPropertyManager) {
    return (
      <div className="min-h-screen bg-porcelain flex items-center justify-center">
        <div className="text-center">
          <p className="text-error text-lg mb-4">Property Manager access required</p>
          <a href="/" className="text-obsidian-500 hover:text-brass-500 hover:underline transition-colors">Go to home</a>
        </div>
      </div>
    );
  }

  // Vendor can only access vendor routes
  if (requireVendor && !isVendor) {
    return (
      <div className="min-h-screen bg-porcelain flex items-center justify-center">
        <div className="text-center">
          <p className="text-error text-lg mb-4">Vendor access required</p>
          <a href="/" className="text-obsidian-500 hover:text-brass-500 hover:underline transition-colors">Go to home</a>
        </div>
      </div>
    );
  }

  // Property Owner can only access property owner routes
  if (requirePropertyOwner && !isPropertyOwner) {
    return (
      <div className="min-h-screen bg-porcelain flex items-center justify-center">
        <div className="text-center">
          <p className="text-error text-lg mb-4">Property Owner access required</p>
          <a href="/" className="text-obsidian-500 hover:text-brass-500 hover:underline transition-colors">Go to home</a>
        </div>
      </div>
    );
  }

  // Prevent access if user has a different role than required
  if (requirePropertyManager && isVendor) {
    return (
      <div className="min-h-screen bg-porcelain flex items-center justify-center">
        <div className="text-center">
          <p className="text-error text-lg mb-4">Access Denied: This route is for Property Managers only</p>
          <a href="/" className="text-obsidian-500 hover:text-brass-500 hover:underline transition-colors">Go to home</a>
        </div>
      </div>
    );
  }

  if (requireVendor && isPropertyManager) {
    return (
      <div className="min-h-screen bg-porcelain flex items-center justify-center">
        <div className="text-center">
          <p className="text-error text-lg mb-4">Access Denied: This route is for Vendors only</p>
          <a href="/" className="text-obsidian-500 hover:text-brass-500 hover:underline transition-colors">Go to home</a>
        </div>
      </div>
    );
  }

  if (requirePropertyOwner && (isPropertyManager || isVendor || isSuperAdmin)) {
    return (
      <div className="min-h-screen bg-porcelain flex items-center justify-center">
        <div className="text-center">
          <p className="text-error text-lg mb-4">Access Denied: This route is for Property Owners only</p>
          <a href="/" className="text-obsidian-500 hover:text-brass-500 hover:underline transition-colors">Go to home</a>
        </div>
      </div>
    );
  }

  return children;
}

export default ProtectedRoute;
