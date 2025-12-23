import { useState, useEffect } from 'react';
import { tenantAPI, authAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Skeleton from '../../components/ui/Skeleton';
import ErrorDisplay from '../../components/ui/ErrorDisplay';

function TenantProfile() {
  const { user, login } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    mobileNumber: ''
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPasswordForm, setShowPasswordForm] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await tenantAPI.getProfile();
      setProfile(data);
      setFormData({
        name: data.name || '',
        mobileNumber: data.mobileNumber || ''
      });
    } catch (err) {
      setError(err.message || 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      const updated = await tenantAPI.updateProfile(formData);
      setProfile(updated);
      // Update auth context
      const updatedUser = { ...user, ...updated };
      login(updatedUser, localStorage.getItem('token'));
      setSuccess('Profile updated successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('New passwords do not match');
      return;
    }
    if (passwordData.newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setSaving(true);
    setError('');
    setSuccess('');
    try {
      // Verify current password by attempting login
      await authAPI.login(user.email, passwordData.currentPassword);
      
      // If login successful, update password (this would typically be a separate endpoint)
      // For now, we'll show a message
      setSuccess('Password change feature will be available soon. Please contact support.');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setShowPasswordForm(false);
    } catch (err) {
      setError('Current password is incorrect');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-porcelain py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <Skeleton variant="title" width="40%" className="mb-2" />
            <Skeleton variant="text" width="60%" />
          </div>
          <Skeleton.Card />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-porcelain py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-charcoal mb-2">Profile Settings</h1>
          <p className="text-architectural">Manage your account information and preferences</p>
        </div>

        {error && <ErrorDisplay message={error} className="mb-6" />}

        {success && (
          <div className="mb-6 p-4 bg-eucalyptus-100 border border-eucalyptus-500 text-eucalyptus-700 rounded-lg">
            {success}
          </div>
        )}

        {/* Profile Information */}
        <Card variant="elevated" padding="lg" className="mb-6">
          <Card.Title className="text-2xl mb-4">Profile Information</Card.Title>
          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <Input
              label="Name"
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
            <div>
              <label className="block text-sm font-medium text-charcoal mb-1">Email</label>
              <input
                type="email"
                value={profile?.email || ''}
                disabled
                className="w-full px-4 py-2.5 border border-stone-300 rounded-lg bg-stone-200 text-architectural cursor-not-allowed"
              />
              <p className="text-xs text-architectural mt-1">Email cannot be changed</p>
            </div>
            <Input
              label="Mobile Number"
              type="tel"
              value={formData.mobileNumber}
              onChange={(e) => setFormData({ ...formData, mobileNumber: e.target.value })}
              placeholder="Optional"
            />
            <div>
              <label className="block text-sm font-medium text-charcoal mb-1">Role</label>
              <input
                type="text"
                value={profile?.role || ''}
                disabled
                className="w-full px-4 py-2.5 border border-stone-300 rounded-lg bg-stone-200 text-architectural cursor-not-allowed capitalize"
              />
            </div>
            <Button
              type="submit"
              variant="primary"
              fullWidth
              loading={saving}
            >
              Save Changes
            </Button>
          </form>
        </Card>

        {/* Change Password */}
        <Card variant="elevated" padding="lg">
          <div className="flex justify-between items-center mb-4">
            <Card.Title className="text-2xl">Change Password</Card.Title>
            <Button
              variant={showPasswordForm ? "secondary" : "primary"}
              size="sm"
              onClick={() => {
                setShowPasswordForm(!showPasswordForm);
                setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
                setError('');
              }}
            >
              {showPasswordForm ? 'Cancel' : 'Change Password'}
            </Button>
          </div>
          {showPasswordForm && (
            <form onSubmit={handleChangePassword} className="space-y-4">
              <Input
                label="Current Password"
                type="password"
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                required
              />
              <Input
                label="New Password"
                type="password"
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                placeholder="Minimum 6 characters"
                required
              />
              <Input
                label="Confirm New Password"
                type="password"
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                required
              />
              <Button
                type="submit"
                variant="primary"
                fullWidth
                loading={saving}
              >
                Change Password
              </Button>
            </form>
          )}
        </Card>
      </div>
    </div>
  );
}

export default TenantProfile;

