import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';

function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'tenant'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      const response = await authAPI.register(
        formData.email,
        formData.password,
        formData.name,
        formData.role
      );
      login(response.user, response.token);
      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-porcelain px-4 py-8">
      <div className="max-w-md w-full bg-stone-100 rounded-2xl shadow-lg p-8 border border-stone-200">
        <h2 className="text-3xl font-bold text-center mb-2 text-obsidian-500">Create Your Free Account</h2>
        <p className="text-center text-architectural mb-6 text-sm">
          Not sure which role to choose? <Link to="/how-it-works" className="text-obsidian-500 font-semibold hover:text-brass-500 transition-colors">See how it works</Link>
        </p>
        
        {error && (
          <div className="mb-4 p-3 bg-error/10 border border-error text-error rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-charcoal mb-1">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full p-3 border border-stone-300 rounded-xl focus:ring-2 focus:ring-obsidian-500 focus:border-obsidian-500 bg-porcelain"
              placeholder="Enter your full name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-charcoal mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full p-3 border border-stone-300 rounded-xl focus:ring-2 focus:ring-obsidian-500 focus:border-obsidian-500 bg-porcelain"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-charcoal mb-1">
              Role <span className="text-architectural text-xs">(Choose based on what you want to do)</span>
            </label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
              className="w-full p-3 border border-stone-300 rounded-xl focus:ring-2 focus:ring-obsidian-500 focus:border-obsidian-500 bg-porcelain"
            >
              <option value="tenant">Tenant - Looking for a property to rent</option>
              <option value="property_owner">Property Owner - Want to list and manage properties</option>
              <option value="user">User - Just want to browse properties</option>
            </select>
            <p className="mt-2 text-xs text-eucalyptus-500">
              {formData.role === 'tenant' && '✓ Search properties, contact owners, save favorites'}
              {formData.role === 'property_owner' && '✓ List properties, manage tenants, track income (no commission fees!)'}
              {formData.role === 'user' && '✓ Browse properties without full account features'}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-charcoal mb-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full p-3 border border-stone-300 rounded-xl focus:ring-2 focus:ring-obsidian-500 focus:border-obsidian-500 bg-porcelain"
              placeholder="Enter your password"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-charcoal mb-1">
              Confirm Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              className="w-full p-3 border border-stone-300 rounded-xl focus:ring-2 focus:ring-obsidian-500 focus:border-obsidian-500 bg-porcelain"
              placeholder="Confirm your password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-obsidian-500 text-porcelain rounded-xl font-semibold hover:bg-obsidian-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>

        <p className="mt-6 text-center text-architectural">
          Already have an account?{' '}
          <Link to="/login" className="text-obsidian-500 font-semibold hover:text-brass-500 transition-colors">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;

