import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { invitationAPI } from '../services/api';

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
      <div className="min-h-screen flex items-center justify-center bg-porcelain">
        <p className="text-architectural">Validating invitation...</p>
      </div>
    );
  }

  if (error && !invitationData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-porcelain">
        <div className="max-w-md w-full bg-stone-100 rounded-2xl shadow-lg p-8 text-center border border-stone-200">
          <div className="text-error mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold mb-4 text-charcoal">Invalid Invitation</h2>
          <p className="text-architectural mb-6">{error}</p>
          <a href="/login" className="text-obsidian font-semibold hover:text-brass transition-colors">
            Go to Login
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-porcelain px-4">
      <div className="max-w-md w-full bg-stone-100 rounded-2xl shadow-lg p-8 border border-stone-200">
        <h2 className="text-3xl font-bold text-center mb-2 text-obsidian">Accept Invitation</h2>
        <p className="text-center text-architectural mb-6">
          Welcome, {invitationData?.name}! Set your password to complete your account setup.
        </p>
        
        {error && (
          <div className="mb-4 p-3 bg-error/20 border border-error text-error rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-charcoal mb-1">
              Email
            </label>
            <input
              type="email"
              value={invitationData?.email || ''}
              disabled
              className="w-full p-3 border border-stone-300 rounded-xl bg-porcelain-dark text-architectural"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-charcoal mb-1">
              Role
            </label>
            <input
              type="text"
              value={invitationData?.role === 'property_manager' ? 'Property Manager' : invitationData?.role === 'vendor' ? 'Vendor' : invitationData?.role || ''}
              disabled
              className="w-full p-3 border border-stone-300 rounded-xl bg-porcelain-dark text-architectural capitalize"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-charcoal mb-1">
              Password <span className="text-error">*</span>
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => handleChange('password', e.target.value)}
              onBlur={(e) => handleBlur('password', e.target.value)}
              required
              className={`w-full p-3 border rounded-xl focus:ring-2 focus:ring-obsidian focus:border-obsidian bg-porcelain ${
                errors.password ? 'border-error' : 'border-stone-300'
              }`}
              placeholder="Enter your password"
            />
            {errors.password && touched.password && (
              <p className="mt-1 text-sm text-error">{errors.password}</p>
            )}
            {!errors.password && password && (
              <p className="mt-1 text-xs text-architectural">Must contain uppercase, lowercase, and number</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-charcoal mb-1">
              Confirm Password <span className="text-error">*</span>
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => handleChange('confirmPassword', e.target.value)}
              onBlur={(e) => handleBlur('confirmPassword', e.target.value)}
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
            disabled={accepting}
            className="w-full py-3 bg-obsidian text-porcelain rounded-xl font-semibold hover:bg-obsidian-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {accepting ? 'Setting up account...' : 'Accept Invitation & Continue'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default InvitationAccept;

