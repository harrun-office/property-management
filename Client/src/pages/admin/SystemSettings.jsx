import { useState } from 'react';

function SystemSettings() {
  const [settings, setSettings] = useState({
    enable2FA: false,
    sessionTimeout: 24,
    passwordMinLength: 6,
    invitationExpiryDays: 7
  });

  const handleSave = () => {
    // In a real app, this would call an API
    alert('Settings saved successfully!');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">System Settings</h1>
          <p className="text-gray-600">Configure global system settings and permissions</p>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-8 space-y-6">
          <div>
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={settings.enable2FA}
                onChange={(e) => setSettings({ ...settings, enable2FA: e.target.checked })}
                className="w-5 h-5 text-slate-700 rounded"
              />
              <span className="text-gray-700 font-medium">Enable Two-Factor Authentication (Recommended)</span>
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Session Timeout (hours)
            </label>
            <input
              type="number"
              value={settings.sessionTimeout}
              onChange={(e) => setSettings({ ...settings, sessionTimeout: parseInt(e.target.value) })}
              className="w-full p-3 border border-gray-300 rounded-xl"
              min="1"
              max="168"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Minimum Password Length
            </label>
            <input
              type="number"
              value={settings.passwordMinLength}
              onChange={(e) => setSettings({ ...settings, passwordMinLength: parseInt(e.target.value) })}
              className="w-full p-3 border border-gray-300 rounded-xl"
              min="6"
              max="32"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Invitation Expiry (days)
            </label>
            <input
              type="number"
              value={settings.invitationExpiryDays}
              onChange={(e) => setSettings({ ...settings, invitationExpiryDays: parseInt(e.target.value) })}
              className="w-full p-3 border border-gray-300 rounded-xl"
              min="1"
              max="30"
            />
          </div>

          <div className="pt-4 border-t">
            <button
              onClick={handleSave}
              className="px-6 py-3 bg-slate-700 text-white rounded-xl font-semibold hover:bg-slate-800 transition-colors"
            >
              Save Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SystemSettings;

