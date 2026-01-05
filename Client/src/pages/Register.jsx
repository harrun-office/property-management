import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobileNumber: '',
    password: '',
    confirmPassword: '',
    role: 'tenant'
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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
    <div className="flex-1 flex items-center justify-center bg-porcelain px-4 relative">
      <div className="max-w-2xl w-full"> {/* Widened slightly for grid */}
        <div className="flex justify-center mb-6">
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

            <span className="block transition-all duration-300 bg-gradient-to-r from-[var(--ui-text-primary)] to-[var(--ui-text-primary)] bg-clip-text group-hover:bg-gradient-to-r group-hover:from-[var(--brand-accent)] group-hover:to-[var(--brand-secondary)] group-hover:bg-clip-text font-bold tracking-tight relative">
              PropManage
              {/* Text morphing underline */}
              <span className="absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-[var(--brand-accent)] to-[var(--brand-secondary)] transition-all duration-500 w-0 group-hover:w-full"></span>
            </span>
          </Link>
        </div>
        <Card variant="elevated" padding="md">
          <Card.Header className="pb-2">
            <h2 className="text-xl font-bold text-center text-charcoal mb-1">Create Account</h2>
            <Card.Description className="text-center text-xs">
              Join us today! <Link to="/how-it-works" className="text-obsidian-500 font-semibold hover:text-brass-500 transition-colors">How it works</Link>
            </Card.Description>
          </Card.Header>

          {error && (
            <Card variant="outlined" padding="sm" className="mb-2 border-error bg-error/5">
              <div className="flex items-start">
                <svg className="w-4 h-4 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <span className="text-error font-medium text-xs">{error}</span>
              </div>
            </Card>
          )}

          <Card.Body>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="Full Name"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={errors.name && touched.name ? errors.name : ''}
                  placeholder="Full Name"
                  required
                  className="py-1.5 text-sm"
                />

                <Input
                  label="Email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={errors.email && touched.email ? errors.email : ''}
                  placeholder="Email Address"
                  required
                  className="py-1.5 text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="Mobile Number"
                  type="tel"
                  name="mobileNumber"
                  value={formData.mobileNumber}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={errors.mobileNumber && touched.mobileNumber ? errors.mobileNumber : ''}
                  placeholder="+1234567890"
                  required
                  className="py-1.5 text-sm"
                />

                <div className="flex flex-col justify-end">
                  <label className="block text-xs font-medium text-charcoal mb-1">
                    Role <span className="text-error-500">*</span>
                  </label>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-1.5 text-sm border border-[var(--ui-border-default)] rounded-lg focus:ring-2 focus:ring-[var(--ui-focus)] focus:border-[var(--ui-action-primary)] bg-[var(--ui-bg-surface)] text-[var(--ui-text-primary)] transition-all h-[38px]" /* Match input height roughly */
                  >
                    <option value="tenant">Tenant</option>
                    <option value="property_owner">Property Owner</option>
                  </select>
                </div>
              </div>


              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={errors.password && touched.password ? errors.password : ''}
                  placeholder="Password"
                  required
                  className="py-1.5 text-sm"
                  icon={
                    showPassword ? (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )
                  }
                  iconPosition="right"
                  onIconClick={() => setShowPassword(!showPassword)}
                />

                <Input
                  label="Confirm"
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={errors.confirmPassword && touched.confirmPassword ? errors.confirmPassword : ''}
                  placeholder="Confirm"
                  required
                  className="py-1.5 text-sm"
                  icon={
                    showConfirmPassword ? (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )
                  }
                  iconPosition="right"
                  onIconClick={() => setShowConfirmPassword(!showConfirmPassword)}
                />
              </div>

              <Button
                type="submit"
                variant="primary"
                fullWidth
                loading={loading}
                disabled={loading}
                className="py-2 text-sm mt-3"
              >
                {loading ? 'Registering...' : 'Register'}
              </Button>
            </form>
          </Card.Body>

          <Card.Footer className="pt-2">
            <p className="text-center text-architectural text-xs">
              Already have an account?{' '}
              <Link to="/login" className="text-obsidian-500 font-semibold hover:text-brass-500 transition-colors">
                Login here
              </Link>
            </p>
          </Card.Footer>
        </Card>

        <div className="text-center mt-8">
          <Link
            to="/"
            className="group inline-flex items-center p-1 pr-5 rounded-full bg-white border border-[var(--ui-border-default)] shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_16px_rgba(0,0,0,0.08)] hover:border-[var(--brand-primary)]/20 transition-all duration-300"
          >
            <div className="w-8 h-8 rounded-full bg-[var(--ui-bg-surface-secondary)] text-[var(--ui-text-secondary)] flex items-center justify-center group-hover:bg-[var(--brand-accent)] group-hover:text-white transition-all duration-300">
              <svg
                className="w-4 h-4 transform group-hover:-translate-x-0.5 transition-transform duration-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </div>
            <span className="ml-3 text-sm font-semibold text-[var(--ui-text-secondary)] group-hover:text-[var(--ui-text-primary)] transition-colors duration-300">Return to Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Register;

