import { useState, useEffect } from 'react';
import { adminAPI } from '../../services/api';

function SystemSettings() {
  const [settings, setSettings] = useState({
    enable2FA: false,
    sessionTimeout: 24,
    passwordMinLength: 8,
    invitationExpiryDays: 7,
    enableEmailNotifications: true,
    enableSMSNotifications: false,
    maintenanceMode: false,
    allowPublicRegistration: true,
    maxPropertiesPerOwner: 50,
    maxApplicationsPerTenant: 10
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Load settings from API
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      // In production, fetch from API
      // const data = await adminAPI.getSettings();
      // setSettings(data);
    } catch (err) {
      console.error('Failed to load settings:', err);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    setMessage('');
    try {
      // In production, save to API
      // await adminAPI.updateSettings(settings);
      setTimeout(() => {
        setMessage('Settings saved successfully!');
        setLoading(false);
      }, 500);
    } catch (err) {
      setMessage('Failed to save settings. Please try again.');
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setSettings({ ...settings, [field]: value });
    setMessage('');
  };

  return (
    <div className="min-h-screen bg-porcelain py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-charcoal mb-2">System Settings</h1>
          <p className="text-architectural">Configure global system settings and permissions</p>
        </div>

        {message && (
          <div className={`mb-6 p-4 rounded-lg ${
            message.includes('success') 
              ? 'bg-eucalyptus/20 border border-eucalyptus text-eucalyptus' 
              : 'bg-error/20 border border-error text-error'
          }`}>
            {message}
          </div>
        )}

        <div className="space-y-6">
          {/* Security Settings */}
          <div className="bg-stone-100 rounded-2xl shadow-md p-8 border border-stone-200">
            <h2 className="text-2xl font-bold text-charcoal mb-6">Security Settings</h2>
            <div className="space-y-6">
              <div>
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.enable2FA}
                    onChange={(e) => handleChange('enable2FA', e.target.checked)}
                    className="w-5 h-5 text-obsidian rounded focus:ring-2 focus:ring-obsidian"
                  />
                  <span className="text-charcoal font-medium">Enable Two-Factor Authentication (Recommended)</span>
                </label>
                <p className="text-sm text-architectural mt-1 ml-8">Require 2FA for all admin accounts</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-charcoal mb-2">
                  Session Timeout (hours)
                </label>
                <input
                  type="number"
                  value={settings.sessionTimeout}
                  onChange={(e) => handleChange('sessionTimeout', parseInt(e.target.value))}
                  className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-obsidian focus:border-obsidian bg-porcelain text-charcoal"
                  min="1"
                  max="168"
                />
                <p className="text-sm text-architectural mt-1">User sessions will expire after this duration</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-charcoal mb-2">
                  Minimum Password Length
                </label>
                <input
                  type="number"
                  value={settings.passwordMinLength}
                  onChange={(e) => handleChange('passwordMinLength', parseInt(e.target.value))}
                  className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-obsidian focus:border-obsidian bg-porcelain text-charcoal"
                  min="6"
                  max="32"
                />
                <p className="text-sm text-architectural mt-1">Minimum characters required for user passwords</p>
              </div>
            </div>
          </div>

          {/* Notification Settings */}
          <div className="bg-stone-100 rounded-2xl shadow-md p-8 border border-stone-200">
            <h2 className="text-2xl font-bold text-charcoal mb-6">Notification Settings</h2>
            <div className="space-y-6">
              <div>
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.enableEmailNotifications}
                    onChange={(e) => handleChange('enableEmailNotifications', e.target.checked)}
                    className="w-5 h-5 text-obsidian rounded focus:ring-2 focus:ring-obsidian"
                  />
                  <span className="text-charcoal font-medium">Enable Email Notifications</span>
                </label>
              </div>

              <div>
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.enableSMSNotifications}
                    onChange={(e) => handleChange('enableSMSNotifications', e.target.checked)}
                    className="w-5 h-5 text-obsidian rounded focus:ring-2 focus:ring-obsidian"
                  />
                  <span className="text-charcoal font-medium">Enable SMS Notifications</span>
                </label>
              </div>
            </div>
          </div>

          {/* System Configuration */}
          <div className="bg-stone-100 rounded-2xl shadow-md p-8 border border-stone-200">
            <h2 className="text-2xl font-bold text-charcoal mb-6">System Configuration</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-charcoal mb-2">
                  Invitation Expiry (days)
                </label>
                <input
                  type="number"
                  value={settings.invitationExpiryDays}
                  onChange={(e) => handleChange('invitationExpiryDays', parseInt(e.target.value))}
                  className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-obsidian focus:border-obsidian bg-porcelain text-charcoal"
                  min="1"
                  max="30"
                />
                <p className="text-sm text-architectural mt-1">Number of days before invitations expire</p>
              </div>

              <div>
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.allowPublicRegistration}
                    onChange={(e) => handleChange('allowPublicRegistration', e.target.checked)}
                    className="w-5 h-5 text-obsidian rounded focus:ring-2 focus:ring-obsidian"
                  />
                  <span className="text-charcoal font-medium">Allow Public Registration</span>
                </label>
                <p className="text-sm text-architectural mt-1 ml-8">Allow new users to register without invitation</p>
              </div>

              <div>
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.maintenanceMode}
                    onChange={(e) => handleChange('maintenanceMode', e.target.checked)}
                    className="w-5 h-5 text-obsidian rounded focus:ring-2 focus:ring-obsidian"
                  />
                  <span className="text-charcoal font-medium">Maintenance Mode</span>
                </label>
                <p className="text-sm text-architectural mt-1 ml-8">Put the system in maintenance mode (only admins can access)</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-charcoal mb-2">
                  Max Properties Per Owner
                </label>
                <input
                  type="number"
                  value={settings.maxPropertiesPerOwner}
                  onChange={(e) => handleChange('maxPropertiesPerOwner', parseInt(e.target.value))}
                  className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-obsidian focus:border-obsidian bg-porcelain text-charcoal"
                  min="1"
                  max="1000"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-charcoal mb-2">
                  Max Applications Per Tenant
                </label>
                <input
                  type="number"
                  value={settings.maxApplicationsPerTenant}
                  onChange={(e) => handleChange('maxApplicationsPerTenant', parseInt(e.target.value))}
                  className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-obsidian focus:border-obsidian bg-porcelain text-charcoal"
                  min="1"
                  max="100"
                />
              </div>
            </div>
          </div>

          <div className="pt-4">
            <button
              onClick={handleSave}
              disabled={loading}
              className="px-6 py-3 bg-obsidian text-porcelain rounded-xl font-semibold hover:bg-obsidian-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Saving...' : 'Save Settings'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SystemSettings;

