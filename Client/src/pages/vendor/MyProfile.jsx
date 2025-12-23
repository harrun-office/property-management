import { useState, useEffect } from 'react';
import { vendorAPI } from '../../services/api';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Skeleton from '../../components/ui/Skeleton';
import ErrorDisplay from '../../components/ui/ErrorDisplay';

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
      <div className="min-h-screen bg-porcelain py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <Skeleton variant="title" width="30%" className="mb-2" />
            <Skeleton variant="text" width="50%" />
          </div>
          <Skeleton.Card />
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-porcelain py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <ErrorDisplay
            message={error || 'Profile not found'}
            onRetry={loadProfile}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-porcelain py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-charcoal mb-2">My Profile</h1>
          <p className="text-architectural">View and manage your vendor profile</p>
        </div>

        <Card variant="elevated" padding="lg" className="space-y-6">
          {/* Company Info */}
          <div>
            <Card.Title className="text-2xl mb-4">Company Information</Card.Title>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-architectural mb-1">Company Name</label>
                <p className="text-charcoal font-semibold">{profile.companyName}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-architectural mb-1">Contact Name</label>
                <p className="text-charcoal font-semibold">{profile.contactName}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-architectural mb-1">Email</label>
                <p className="text-architectural">{profile.email}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-architectural mb-1">Phone</label>
                <p className="text-architectural">{profile.phone || 'Not provided'}</p>
              </div>
            </div>
          </div>

          {/* Service Types */}
          <div>
            <Card.Title className="text-2xl mb-4">Service Types</Card.Title>
            <div className="flex flex-wrap gap-2">
              {profile.serviceTypes.map((type, idx) => (
                <span key={idx} className="px-4 py-2 bg-obsidian-100 text-obsidian-700 rounded-lg capitalize font-medium">
                  {type}
                </span>
              ))}
            </div>
          </div>

          {/* Performance Rating */}
          <div>
            <Card.Title className="text-2xl mb-4">Performance Rating</Card.Title>
            <div className="flex items-center gap-4">
              <div className="text-5xl font-bold text-charcoal">{profile.performanceRating || 0}</div>
              <div className="flex-1">
                <div className="w-full bg-stone-200 rounded-full h-6">
                  <div
                    className="bg-eucalyptus-500 h-6 rounded-full flex items-center justify-end pr-2 transition-all duration-300"
                    style={{ width: `${((profile.performanceRating || 0) / 5) * 100}%` }}
                  >
                    <span className="text-white text-xs font-semibold">
                      {Math.round(((profile.performanceRating || 0) / 5) * 100)}%
                    </span>
                  </div>
                </div>
                <p className="text-sm text-architectural mt-2">Based on completed tasks and feedback</p>
              </div>
            </div>
          </div>

          {/* Assigned Properties */}
          <div>
            <Card.Title className="text-2xl mb-4">Assigned Properties</Card.Title>
            <p className="text-architectural">{profile.assignedProperties?.length || 0} properties assigned</p>
          </div>

          {/* Permission Scope */}
          <div>
            <Card.Title className="text-2xl mb-4">Permission Scope</Card.Title>
            <span className="px-4 py-2 bg-obsidian-100 text-obsidian-700 rounded-lg capitalize font-medium">
              {profile.permissionScope}
            </span>
          </div>

          {/* Status */}
          <div>
            <Card.Title className="text-2xl mb-4">Status</Card.Title>
            <span className={`px-4 py-2 rounded-lg font-semibold ${
              profile.status === 'active' ? 'bg-eucalyptus-100 text-eucalyptus-700' :
              profile.status === 'suspended' ? 'bg-error-100 text-error-700' :
              'bg-warning-100 text-warning-700'
            }`}>
              {profile.status}
            </span>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default MyProfile;

