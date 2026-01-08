import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { propertiesAPI } from '../../services/api';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Skeleton from '../../components/ui/Skeleton';
import ErrorDisplay from '../../components/ui/ErrorDisplay';
import EmptyState from '../../components/ui/EmptyState';

function TenantApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await propertiesAPI.getMyApplications?.() || [];
      setApplications(data);
    } catch (err) {
      setError(err.message || 'Failed to load applications');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      pending: 'bg-warning-100 text-warning-700',
      approved: 'bg-eucalyptus-100 text-eucalyptus-700',
      rejected: 'bg-error-100 text-error-700',
      withdrawn: 'bg-architectural/20 text-architectural'
    };
    return styles[status] || 'bg-stone-200 text-charcoal';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-porcelain py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <Skeleton variant="title" width="30%" className="mb-2" />
            <Skeleton variant="text" width="50%" />
          </div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Skeleton.Card key={i} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-porcelain py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-charcoal mb-2">My Applications</h1>
            <p className="text-architectural">Track the status of your property applications</p>
          </div>
          <Link to="/properties">
            <Button variant="primary">Browse Properties</Button>
          </Link>
        </div>

        {error && <ErrorDisplay message={error} onRetry={loadApplications} className="mb-6" />}

        {applications.length === 0 ? (
          <EmptyState
            title="No applications yet"
            description="Start applying to properties you're interested in!"
            action={
              <Link to="/properties">
                <Button variant="primary">Browse Properties</Button>
              </Link>
            }
            icon={
              <svg className="w-16 h-16 text-architectural" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            }
          />
        ) : (
          <div className="space-y-4">
            {applications.map((app) => (
              <Card key={app.id} variant="elevated" padding="lg" hover>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <Link to={`/properties/${app.property?.id}`} className="text-xl font-semibold text-obsidian-500 hover:text-obsidian-700 transition-colors">
                          {app.property?.title || 'Property'}
                        </Link>
                        <p className="text-sm text-architectural mt-1">{app.property?.address}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadge(app.status)}`}>
                        {app.status?.charAt(0).toUpperCase() + app.status?.slice(1)}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 text-sm">
                      <div>
                        <span className="text-architectural">Applied:</span>
                        <p className="text-charcoal font-medium">{new Date(app.createdAt).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <span className="text-architectural">Price:</span>
                        <p className="text-charcoal font-medium">${app.property?.price?.toLocaleString()}/mo</p>
                      </div>
                      <div>
                        <span className="text-architectural">Bedrooms:</span>
                        <p className="text-charcoal font-medium">{app.property?.bedrooms}</p>
                      </div>
                      <div>
                        <span className="text-architectural">Bathrooms:</span>
                        <p className="text-charcoal font-medium">{app.property?.bathrooms}</p>
                      </div>
                    </div>
                    {app.message && (
                      <Card variant="filled" padding="sm" className="mt-4">
                        <p className="text-sm text-charcoal"><span className="font-medium">Your message:</span> {app.message}</p>
                      </Card>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default TenantApplications;

