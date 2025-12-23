import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Navbar() {
  const { isAuthenticated, user, logout, isOwner } = useAuth();

  return (
    <nav className="flex items-center justify-between px-4 md:px-10 py-5 bg-porcelain shadow-sm">
      <Link to="/" className="text-2xl font-bold text-charcoal">PropManage</Link>
      <div className="flex items-center space-x-4 md:space-x-6 text-charcoal font-medium text-sm md:text-base">
        <Link to="/properties" className="hover:text-obsidian-500 transition-colors">Properties</Link>
        <Link to="/for-tenants" className="hover:text-obsidian-500 transition-colors hidden md:inline">For Tenants</Link>
        <Link to="/for-owners" className="hover:text-obsidian-500 transition-colors hidden md:inline">For Owners</Link>
        <Link to="/features" className="hover:text-obsidian-500 transition-colors hidden lg:inline">Features</Link>
        <Link to="/how-it-works" className="hover:text-obsidian-500 transition-colors hidden lg:inline">How It Works</Link>
        <Link to="/about" className="hover:text-obsidian-500 transition-colors hidden lg:inline">About</Link>
        {isAuthenticated ? (
          <>
            {isOwner && (
              <>
                <Link to="/post-property" className="hover:text-obsidian-500 transition-colors">Post Property</Link>
                <Link to="/my-listings" className="hover:text-obsidian-500 transition-colors">My Listings</Link>
              </>
            )}
            <span className="text-architectural hidden md:inline">Hello, {user?.name}</span>
            <button
              onClick={logout}
              className="px-4 py-2 bg-error-500 text-porcelain rounded-lg hover:bg-error-600 transition-colors text-sm md:text-base"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="hover:text-obsidian-500 transition-colors">Login</Link>
            <Link to="/register" className="px-4 py-2 bg-obsidian-500 text-porcelain rounded-lg hover:bg-obsidian-600 transition-colors text-sm md:text-base">
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
