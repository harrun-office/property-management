import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { invitationAPI } from '../services/api';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Skeleton from '../components/ui/Skeleton';
import ErrorDisplay from '../components/ui/ErrorDisplay';

function InvitationAccept() {
  const { token } = useParams();
  const navigate = useNavigate();
  const { login } = useAuth();
  const [invitationData, setInvitationData] = useState(null);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [accepting, setAccepting] = useState(false);

  useEffect(() => {
    validateInvitation();
  }, [token]);

  const validateInvitation = async () => {
    try {
      const data = await invitationAPI.validate(token);
      setInvitationData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const validateField = (name, value) => {
    let error = '';
    
    switch (name) {
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
        } else if (value !== password) {
          error = 'Passwords do not match';
        }
        break;
      default:
        break;
    }
    
    return error;
  };

  const handleChange = (field, value) => {
    if (field === 'password') {
      setPassword(value);
    } else if (field === 'confirmPassword') {
      setConfirmPassword(value);
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
    setTouched({ password: true, confirmPassword: true });
    
    // Validate all fields
    const newErrors = {
      password: validateField('password', password),
      confirmPassword: validateField('confirmPassword', confirmPassword)
    };
    
    setErrors(newErrors);
    
    // Check if there are any errors
    if (Object.values(newErrors).some(err => err)) {
      setError('Please fix the errors in the form');
      return;
    }

    setAccepting(true);

    try {
      const response = await invitationAPI.accept(token, password);
      login(response.user, response.token);
      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setAccepting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-porcelain px-4">
        <div className="max-w-md w-full">
          <Skeleton.Card />
        </div>
      </div>
    );
  }

  if (error && !invitationData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-porcelain px-4">
        <div className="max-w-md w-full">
          <ErrorDisplay
            message={error || 'Invalid Invitation'}
            action={
              <Link to="/login">
                <Button variant="primary">Go to Login</Button>
              </Link>
            }
            icon={
              <svg className="w-16 h-16 text-error-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-porcelain px-4">
      <Card variant="elevated" padding="lg" className="max-w-md w-full">
        <Card.Title className="text-3xl text-center mb-2">Accept Invitation</Card.Title>
        <Card.Description className="text-center mb-6">
          Welcome, {invitationData?.name}! Set your password to complete your account setup.
        </Card.Description>
        
        {error && <ErrorDisplay message={error} className="mb-4" />}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email"
            type="email"
            value={invitationData?.email || ''}
            disabled
            className="bg-stone-100"
          />

          <Input
            label="Role"
            type="text"
            value={invitationData?.role === 'property_manager' ? 'Property Manager' : invitationData?.role === 'vendor' ? 'Vendor' : invitationData?.role || ''}
            disabled
            className="bg-stone-100 capitalize"
          />

          <Input
            label="Password"
            type="password"
            value={password}
            onChange={(e) => handleChange('password', e.target.value)}
            onBlur={(e) => handleBlur('password', e.target.value)}
            required
            error={errors.password && touched.password ? errors.password : undefined}
            helperText={!errors.password && password ? 'Must contain uppercase, lowercase, and number' : undefined}
            placeholder="Enter your password"
          />

          <Input
            label="Confirm Password"
            type="password"
            value={confirmPassword}
            onChange={(e) => handleChange('confirmPassword', e.target.value)}
            onBlur={(e) => handleBlur('confirmPassword', e.target.value)}
            required
            error={errors.confirmPassword && touched.confirmPassword ? errors.confirmPassword : undefined}
            placeholder="Confirm your password"
          />

          <Button
            type="submit"
            variant="primary"
            fullWidth
            disabled={accepting}
            loading={accepting}
          >
            Accept Invitation & Continue
          </Button>
        </form>
      </Card>
    </div>
  );
}

export default InvitationAccept;

