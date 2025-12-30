import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

function Login() {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();



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
      setLoading(false);
      return;
    }

    setLoading(true);

    try {
      const response = await authAPI.login(email, password);

      // Role is now inferred from backend response


      login(response.user, response.token);

      // Redirect based on role
      if (response.user.role === 'super_admin') {
        navigate('/admin/dashboard');
      } else if (response.user.role === 'property_manager') {
        navigate('/property-manager/dashboard');
      } else if (response.user.role === 'vendor') {
        navigate('/vendor/dashboard');
      } else if (response.user.role === 'tenant') {
        navigate('/tenant/dashboard');
      } else if (response.user.role === 'property_owner') {
        navigate('/owner/dashboard');
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
    <div className="min-h-screen flex items-center justify-center bg-porcelain px-4 py-6">
      <div className="max-w-md w-full">
        <Card variant="elevated" padding="md">
          <Card.Header>
            <h2 className="text-3xl font-bold text-center text-charcoal mb-2">Login</h2>
            <Card.Description className="text-center">
              Sign in to your account to continue
            </Card.Description>
          </Card.Header>

          {error && (
            <Card variant="outlined" padding="md" className="mb-4 border-error bg-error/5">
              <p className="text-error font-medium">{error}</p>
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
              />

              <Input
                label="Password"
                type="password"
                value={password}
                onChange={(e) => handleChange('password', e.target.value)}
                onBlur={(e) => handleBlur('password', e.target.value)}
                error={errors.password && touched.password ? errors.password : ''}
                placeholder="Enter your password"
                required
              />

              <Button
                type="submit"
                variant="primary"
                fullWidth
                loading={loading}
                disabled={loading}
              >
                {loading ? 'Logging in...' : 'Login'}
              </Button>
            </form>
          </Card.Body>

          <Card.Footer>
            <p className="text-center text-architectural text-sm">
              Don't have an account?{' '}
              <Link to="/register" className="text-obsidian-500 font-semibold hover:text-brass-500 transition-colors">
                Register here
              </Link>
            </p>
          </Card.Footer>
        </Card>
      </div>
    </div>
  );
}

export default Login;
