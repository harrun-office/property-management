import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const validateField = (name, value) => {
    let error = '';

    switch (name) {
      case 'email':
        if (!value.trim()) {
          error = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) {
          error = 'Please enter a valid email address';
        }
        break;
      case 'password':
        if (!value) {
          error = 'Password is required';
        } else if (value.length < 1) {
          error = 'Password cannot be empty';
        }
        break;
      default:
        break;
    }

    return error;
  };

  const handleChange = (field, value) => {
    if (field === 'email') {
      setEmail(value);
    } else if (field === 'password') {
      setPassword(value);
    }

    // Validate on change if field has been touched
    if (touched[field]) {
      const error = validateField(field, value);
      setErrors({
        ...errors,
        [field]: error
      });
    }
  };

  const handleBlur = (field, value) => {
    setTouched({
      ...touched,
      [field]: true
    });

    const error = validateField(field, value);
    setErrors({
      ...errors,
      [field]: error
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Mark all fields as touched
    setTouched({ email: true, password: true });

    // Validate all fields
    const newErrors = {
      email: validateField('email', email),
      password: validateField('password', password)
    };

    setErrors(newErrors);

    // Check if there are any errors
    if (Object.values(newErrors).some(err => err)) {
      setError('Please fix the errors in the form');
      return;
    }

    setLoading(true);

    try {
      const response = await authAPI.login(email, password);

      login(response.user, response.token);

      const params = new URLSearchParams(location.search);
      const returnTo = params.get('returnTo');
      if (returnTo) {
        navigate(returnTo, { replace: true });
      } else {
        // Redirect based on role
        if (response.user.role === 'super_admin') {
          navigate('/admin/dashboard');
        } else if (response.user.role === 'property_manager') {
          navigate('/property-manager/dashboard');
        } else if (response.user.role === 'vendor') {
          navigate('/vendor/dashboard');
        } else if (response.user.role === 'tenant') {
          if (response.user.hasActiveTenancy) {
            navigate('/tenant/dashboard');
          } else {
            navigate('/');
          }
        } else if (response.user.role === 'property_owner') {
          navigate('/owner/dashboard');
        } else {
          navigate('/');
        }
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center bg-porcelain px-4 relative">
      <div className="max-w-md w-full">
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
            <h2 className="text-2xl font-bold text-center text-charcoal mb-1">Login</h2>
            <Card.Description className="text-center text-sm">
              Sign in to your account
            </Card.Description>
          </Card.Header>

          {error && (
            <Card variant="outlined" padding="sm" className="mb-3 border-error bg-error/5">
              <p className="text-error font-medium text-sm">{error}</p>
            </Card>
          )}

          <Card.Body>
            <form onSubmit={handleSubmit} className="space-y-3">
              <Input
                label="Email"
                type="email"
                value={email}
                onChange={(e) => handleChange('email', e.target.value)}
                onBlur={(e) => handleBlur('email', e.target.value)}
                error={errors.email && touched.email ? errors.email : ''}
                placeholder="Enter your email"
                required
                className="py-2 text-sm"
              />

              <Input
                label="Password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => handleChange('password', e.target.value)}
                onBlur={(e) => handleBlur('password', e.target.value)}
                error={errors.password && touched.password ? errors.password : ''}
                placeholder="Enter your password"
                required
                className="py-2 text-sm"
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

              <Button
                type="submit"
                variant="primary"
                fullWidth
                loading={loading}
                disabled={loading}
                className="py-2 text-sm mt-2"
              >
                {loading ? 'Logging in...' : 'Login'}
              </Button>
            </form>
          </Card.Body>

          <Card.Footer className="pt-2">
            <p className="text-center text-architectural text-xs">
              Don't have an account?{' '}
              <Link to="/register" className="text-obsidian-500 font-semibold hover:text-brass-500 transition-colors">
                Register here
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

export default Login;
