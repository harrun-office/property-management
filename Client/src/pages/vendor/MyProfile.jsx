import { useState, useEffect } from 'react';
import { vendorAPI } from '../../services/api';

function MyProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await vendorAPI.getProfile();
      setProfile(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Loading profile...</p>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || 'Profile not found'}</p>
          <button
            onClick={loadProfile}
            className="px-4 py-2 bg-slate-700 text-white rounded-xl"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">My Profile</h1>
          <p className="text-gray-600">View and manage your vendor profile</p>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-8 space-y-6">
          {/* Company Info */}
          <div>
            <h2 className="text-2xl font-bold mb-4 text-gray-900">Company Information</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                <p className="text-gray-900 font-semibold">{profile.companyName}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Contact Name</label>
                <p className="text-gray-900 font-semibold">{profile.contactName}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <p className="text-gray-600">{profile.email}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <p className="text-gray-600">{profile.phone || 'Not provided'}</p>
              </div>
            </div>
          </div>

          {/* Service Types */}
          <div>
            <h2 className="text-2xl font-bold mb-4 text-gray-900">Service Types</h2>
            <div className="flex flex-wrap gap-2">
              {profile.serviceTypes.map((type, idx) => (
                <span key={idx} className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg capitalize">
                  {type}
                </span>
              ))}
            </div>
          </div>

          {/* Performance Rating */}
          <div>
            <h2 className="text-2xl font-bold mb-4 text-gray-900">Performance Rating</h2>
            <div className="flex items-center space-x-4">
              <div className="text-5xl font-bold text-slate-700">{profile.performanceRating || 0}</div>
              <div className="flex-1">
                <div className="w-full bg-gray-200 rounded-full h-6">
                  <div
                    className="bg-emerald-600 h-6 rounded-full flex items-center justify-end pr-2"
                    style={{ width: `${((profile.performanceRating || 0) / 5) * 100}%` }}
                  >
                    <span className="text-white text-xs font-semibold">
                      {Math.round(((profile.performanceRating || 0) / 5) * 100)}%
                    </span>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mt-2">Based on completed tasks and feedback</p>
              </div>
            </div>
          </div>

          {/* Assigned Properties */}
          <div>
            <h2 className="text-2xl font-bold mb-4 text-gray-900">Assigned Properties</h2>
            <p className="text-gray-600">{profile.assignedProperties?.length || 0} properties assigned</p>
          </div>

          {/* Permission Scope */}
          <div>
            <h2 className="text-2xl font-bold mb-4 text-gray-900">Permission Scope</h2>
            <span className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg capitalize">
              {profile.permissionScope}
            </span>
          </div>

          {/* Status */}
          <div>
            <h2 className="text-2xl font-bold mb-4 text-gray-900">Status</h2>
            <span className={`px-4 py-2 rounded-lg font-medium ${
              profile.status === 'active' ? 'bg-emerald-100 text-emerald-700' :
              profile.status === 'suspended' ? 'bg-red-100 text-red-700' :
              'bg-yellow-100 text-yellow-700'
            }`}>
              {profile.status}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MyProfile;

