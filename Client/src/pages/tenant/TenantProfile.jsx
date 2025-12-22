import { useState, useEffect } from 'react';
import { tenantAPI, authAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

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
      <div className="min-h-screen bg-porcelain flex items-center justify-center">
        <p className="text-charcoal text-lg">Loading profile...</p>
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

        {error && (
          <div className="mb-6 p-4 bg-error/20 border border-error text-error rounded-lg">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-eucalyptus/20 border border-eucalyptus text-eucalyptus rounded-lg">
            {success}
          </div>
        )}

        {/* Profile Information */}
        <div className="bg-stone-100 rounded-xl shadow-md p-6 border border-stone-200 mb-6">
          <h2 className="text-2xl font-bold text-charcoal mb-4">Profile Information</h2>
          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-charcoal mb-1">Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg bg-porcelain focus:ring-2 focus:ring-obsidian focus:border-obsidian"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-charcoal mb-1">Email</label>
              <input
                type="email"
                value={profile?.email || ''}
                disabled
                className="w-full px-3 py-2 border rounded-lg bg-stone-200 text-architectural cursor-not-allowed"
              />
              <p className="text-xs text-architectural mt-1">Email cannot be changed</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-charcoal mb-1">Mobile Number</label>
              <input
                type="tel"
                value={formData.mobileNumber}
                onChange={(e) => setFormData({ ...formData, mobileNumber: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg bg-porcelain focus:ring-2 focus:ring-obsidian focus:border-obsidian"
                placeholder="Optional"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-charcoal mb-1">Role</label>
              <input
                type="text"
                value={profile?.role || ''}
                disabled
                className="w-full px-3 py-2 border rounded-lg bg-stone-200 text-architectural cursor-not-allowed capitalize"
              />
            </div>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2 bg-obsidian text-porcelain rounded-lg hover:bg-obsidian-light transition-colors disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        </div>

        {/* Change Password */}
        <div className="bg-stone-100 rounded-xl shadow-md p-6 border border-stone-200">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-charcoal">Change Password</h2>
            <button
              onClick={() => {
                setShowPasswordForm(!showPasswordForm);
                setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
                setError('');
              }}
              className="px-4 py-2 bg-stone-300 text-charcoal rounded-lg hover:bg-stone-400 transition-colors"
            >
              {showPasswordForm ? 'Cancel' : 'Change Password'}
            </button>
          </div>
          {showPasswordForm && (
            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-charcoal mb-1">Current Password</label>
                <input
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg bg-porcelain focus:ring-2 focus:ring-obsidian focus:border-obsidian"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-charcoal mb-1">New Password</label>
                <input
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg bg-porcelain focus:ring-2 focus:ring-obsidian focus:border-obsidian"
                  placeholder="Minimum 6 characters"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-charcoal mb-1">Confirm New Password</label>
                <input
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg bg-porcelain focus:ring-2 focus:ring-obsidian focus:border-obsidian"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-2 bg-obsidian text-porcelain rounded-lg hover:bg-obsidian-light transition-colors disabled:opacity-50"
              >
                {saving ? 'Changing...' : 'Change Password'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default TenantProfile;

