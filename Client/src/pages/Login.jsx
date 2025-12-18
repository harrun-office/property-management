import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';

function Login() {
  const [role, setRole] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  // Map display names to role values
  const roleMap = {
    'admin': 'super_admin',
    'property_manager': 'property_manager',
    'property_owner': 'property_owner',
    'tenant': 'tenant',
    'vendor': 'vendor'
  };

  const getRoleDisplayName = (roleValue) => {
    const roleEntries = Object.entries(roleMap);
    const entry = roleEntries.find(([_, value]) => value === roleValue);
    return entry ? entry[0].replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()) : roleValue;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!role) {
      setError('Please select a role');
      setLoading(false);
      return;
    }

    try {
      const response = await authAPI.login(email, password);
      
      // Check if user's role matches selected role
      const expectedRole = roleMap[role];
      if (response.user.role !== expectedRole) {
        setError(`Invalid role. Please select ${getRoleDisplayName(response.user.role)} or use the correct credentials.`);
        setLoading(false);
        return;
      }

      login(response.user, response.token);
      
      // Redirect based on role
      if (response.user.role === 'super_admin') {
        navigate('/admin/dashboard');
      } else if (response.user.role === 'property_manager') {
        navigate('/property-manager/dashboard');
      } else if (response.user.role === 'vendor') {
        navigate('/vendor/dashboard');
      } else if (response.user.role === 'tenant') {
        navigate('/');
      } else if (response.user.role === 'property_owner') {
        navigate('/');
      } else {
        navigate('/');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-porcelain px-4">
      <div className="max-w-md w-full bg-stone-100 rounded-2xl shadow-lg p-8 border border-stone-200">
        <h2 className="text-3xl font-bold text-center mb-6 text-obsidian-500">Login</h2>
        
        {error && (
          <div className="mb-4 p-3 bg-error/10 border border-error text-error rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-charcoal mb-1">
              Role
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              required
              className="w-full p-3 border border-stone-300 rounded-xl focus:ring-2 focus:ring-obsidian-500 focus:border-obsidian-500 bg-porcelain"
            >
              <option value="">Select your role</option>
              <option value="admin">Admin</option>
              <option value="property_manager">Property Manager</option>
              <option value="property_owner">Property Owner</option>
              <option value="tenant">Tenant</option>
              <option value="vendor">Vendor</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-charcoal mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-3 border border-stone-300 rounded-xl focus:ring-2 focus:ring-obsidian-500 focus:border-obsidian-500 bg-porcelain"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-charcoal mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-3 border border-stone-300 rounded-xl focus:ring-2 focus:ring-obsidian-500 focus:border-obsidian-500 bg-porcelain"
              placeholder="Enter your password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-obsidian-500 text-porcelain rounded-xl font-semibold hover:bg-obsidian-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="mt-6 text-center text-architectural text-sm">
          Don't have an account?{' '}
          <Link to="/register" className="text-obsidian-500 font-semibold hover:text-brass-500 transition-colors">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
