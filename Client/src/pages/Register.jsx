import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';

function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobileNumber: '',
    password: '',
    confirmPassword: '',
    role: 'tenant'
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const validateField = (name, value) => {
    let error = '';
    
    switch (name) {
      case 'name':
        if (!value.trim()) {
          error = 'Full name is required';
        } else if (value.trim().length < 2) {
          error = 'Name must be at least 2 characters';
        } else if (!/^[a-zA-Z\s'-]+$/.test(value.trim())) {
          error = 'Name can only contain letters, spaces, hyphens, and apostrophes';
        }
        break;
      case 'email':
        if (!value.trim()) {
          error = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) {
          error = 'Please enter a valid email address';
        }
        break;
      case 'mobileNumber':
        if (!value.trim()) {
          error = 'Mobile number is required';
        } else {
          // Remove all non-digit characters for validation
          const digitsOnly = value.replace(/\D/g, '');
          if (digitsOnly.length < 10) {
            error = 'Mobile number must contain at least 10 digits';
          } else if (digitsOnly.length > 15) {
            error = 'Mobile number is too long (max 15 digits)';
          }
        }
        break;
      case 'password':
        if (!value) {
          error = 'Password is required';
        } else if (value.length < 6) {
          error = 'Password must be at least 6 characters';
        } else if (value.length > 50) {
          error = 'Password must be less than 50 characters';
        } else if (!/(?=.*[a-z])/.test(value)) {
          error = 'Password must contain at least one lowercase letter';
        } else if (!/(?=.*[A-Z])/.test(value)) {
          error = 'Password must contain at least one uppercase letter';
        } else if (!/(?=.*\d)/.test(value)) {
          error = 'Password must contain at least one number';
        }
        break;
      case 'confirmPassword':
        if (!value) {
          error = 'Please confirm your password';
        } else if (value !== formData.password) {
          error = 'Passwords do not match';
        }
        break;
      default:
        break;
    }
    
    return error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear top error when user starts typing
    if (error) {
      setError('');
    }
    
    // Validate on change if field has been touched
    if (touched[name]) {
      const error = validateField(name, value);
      setErrors({
        ...errors,
        [name]: error
      });
    }
    
    // Special handling for confirmPassword - validate against current password
    if (name === 'password' && touched.confirmPassword && formData.confirmPassword) {
      const confirmError = validateField('confirmPassword', formData.confirmPassword);
      setErrors({
        ...errors,
        confirmPassword: confirmError
      });
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched({
      ...touched,
      [name]: true
    });
    
    const error = validateField(name, value);
    setErrors({
      ...errors,
      [name]: error
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Mark all fields as touched
    const allTouched = Object.keys(formData).reduce((acc, key) => {
      acc[key] = true;
      return acc;
    }, {});
    setTouched(allTouched);
    
    // Validate all fields
    const newErrors = {};
    Object.keys(formData).forEach(key => {
      if (key !== 'role') {
        const error = validateField(key, formData[key]);
        if (error) {
          newErrors[key] = error;
        }
      }
    });
    
    setErrors(newErrors);
    
    // Check if there are any errors
    if (Object.keys(newErrors).length > 0) {
      // Only show generic error if there are validation errors
      const errorFields = Object.keys(newErrors).join(', ');
      setError(`Please fix the following fields: ${errorFields.replace(/([A-Z])/g, ' $1').toLowerCase()}`);
      // Scroll to first error field
      const firstErrorField = Object.keys(newErrors)[0];
      const element = document.querySelector(`[name="${firstErrorField}"]`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        element.focus();
      }
      return;
    }

    setLoading(true);

    try {
      const response = await authAPI.register(
        formData.email,
        formData.password,
        formData.name,
        formData.role,
        formData.mobileNumber
      );
      login(response.user, response.token);
      navigate('/');
    } catch (err) {
      // Extract error message from API response
      const errorMessage = err.message || 'Registration failed. Please try again.';
      setError(errorMessage);
      // Scroll to top to show error
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-porcelain px-4 py-8">
      <div className="max-w-md w-full bg-stone-100 rounded-2xl shadow-lg p-8 border border-stone-200">
        <h2 className="text-3xl font-bold text-center mb-2 text-obsidian">Create Your Free Account</h2>
        <p className="text-center text-architectural mb-6 text-sm">
          Not sure which role to choose? <Link to="/how-it-works" className="text-obsidian font-semibold hover:text-brass transition-colors">See how it works</Link>
        </p>
        
        {error && (
          <div className="mb-4 p-3 bg-error/10 border border-error text-error rounded-lg text-sm">
            <div className="flex items-start">
              <svg className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <span>{error}</span>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-charcoal mb-1">
              Full Name <span className="text-error">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              onBlur={handleBlur}
              required
              className={`w-full p-3 border rounded-xl focus:ring-2 focus:ring-obsidian focus:border-obsidian bg-porcelain ${
                errors.name ? 'border-error' : 'border-stone-300'
              }`}
              placeholder="Enter your full name"
            />
            {errors.name && touched.name && (
              <p className="mt-1 text-sm text-error">{errors.name}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-charcoal mb-1">
              Email <span className="text-error">*</span>
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              onBlur={handleBlur}
              required
              className={`w-full p-3 border rounded-xl focus:ring-2 focus:ring-obsidian focus:border-obsidian bg-porcelain ${
                errors.email ? 'border-error' : 'border-stone-300'
              }`}
              placeholder="Enter your email"
            />
            {errors.email && touched.email && (
              <p className="mt-1 text-sm text-error">{errors.email}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-charcoal mb-1">
              Mobile Number <span className="text-error">*</span>
            </label>
            <input
              type="tel"
              name="mobileNumber"
              value={formData.mobileNumber}
              onChange={handleChange}
              onBlur={handleBlur}
              required
              className={`w-full p-3 border rounded-xl focus:ring-2 focus:ring-obsidian focus:border-obsidian bg-porcelain ${
                errors.mobileNumber ? 'border-error' : 'border-stone-300'
              }`}
              placeholder="e.g., +1234567890 or 123-456-7890"
            />
            {errors.mobileNumber && touched.mobileNumber && (
              <p className="mt-1 text-sm text-error">{errors.mobileNumber}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-charcoal mb-1">
              Role <span className="text-error">*</span> <span className="text-architectural text-xs">(Choose based on what you want to do)</span>
            </label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
              className="w-full p-3 border border-stone-300 rounded-xl focus:ring-2 focus:ring-obsidian focus:border-obsidian bg-porcelain"
            >
              <option value="tenant">Tenant - Looking for a property to rent</option>
              <option value="property_owner">Property Owner - Want to list and manage properties</option>
            </select>
            <p className="mt-2 text-xs text-eucalyptus">
              {formData.role === 'tenant' && '✓ Search properties, contact owners, save favorites'}
              {formData.role === 'property_owner' && '✓ List properties, manage tenants, track income (no commission fees!)'}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-charcoal mb-1">
              Password <span className="text-error">*</span>
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              onBlur={handleBlur}
              required
              className={`w-full p-3 border rounded-xl focus:ring-2 focus:ring-obsidian focus:border-obsidian bg-porcelain ${
                errors.password ? 'border-error' : 'border-stone-300'
              }`}
              placeholder="Enter your password"
            />
            {errors.password && touched.password && (
              <p className="mt-1 text-sm text-error">{errors.password}</p>
            )}
            {!errors.password && formData.password && (
              <p className="mt-1 text-xs text-architectural">Must contain uppercase, lowercase, and number</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-charcoal mb-1">
              Confirm Password <span className="text-error">*</span>
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              onBlur={handleBlur}
              required
              className={`w-full p-3 border rounded-xl focus:ring-2 focus:ring-obsidian focus:border-obsidian bg-porcelain ${
                errors.confirmPassword ? 'border-error' : 'border-stone-300'
              }`}
              placeholder="Confirm your password"
            />
            {errors.confirmPassword && touched.confirmPassword && (
              <p className="mt-1 text-sm text-error">{errors.confirmPassword}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-obsidian text-porcelain rounded-xl font-semibold hover:bg-obsidian-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>

        <p className="mt-6 text-center text-architectural">
          Already have an account?{' '}
          <Link to="/login" className="text-obsidian font-semibold hover:text-brass transition-colors">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;

