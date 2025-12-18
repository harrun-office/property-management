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

  if (requirePropertyManager && !isPropertyManager && !isSuperAdmin) {
    return (
      <div className="min-h-screen bg-porcelain flex items-center justify-center">
        <div className="text-center">
          <p className="text-error text-lg mb-4">Property Manager access required</p>
          <a href="/" className="text-obsidian-500 hover:text-brass-500 hover:underline transition-colors">Go to home</a>
        </div>
      </div>
    );
  }

  if (requireVendor && !isVendor && !isPropertyManager && !isSuperAdmin) {
    return (
      <div className="min-h-screen bg-porcelain flex items-center justify-center">
        <div className="text-center">
          <p className="text-error text-lg mb-4">Vendor access required</p>
          <a href="/" className="text-obsidian-500 hover:text-brass-500 hover:underline transition-colors">Go to home</a>
        </div>
      </div>
    );
  }

  if (requirePropertyOwner && !isPropertyOwner && !isSuperAdmin) {
    return (
      <div className="min-h-screen bg-porcelain flex items-center justify-center">
        <div className="text-center">
          <p className="text-error text-lg mb-4">Property Owner access required</p>
          <a href="/" className="text-obsidian-500 hover:text-brass-500 hover:underline transition-colors">Go to home</a>
        </div>
      </div>
    );
  }

  return children;
}

export default ProtectedRoute;
