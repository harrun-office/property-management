import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { propertiesAPI } from '../../services/api';

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
      pending: 'bg-warning/20 text-warning',
      approved: 'bg-eucalyptus/20 text-eucalyptus',
      rejected: 'bg-error/20 text-error',
      withdrawn: 'bg-architectural/20 text-architectural'
    };
    return styles[status] || 'bg-stone-200 text-charcoal';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-porcelain flex items-center justify-center">
        <p className="text-charcoal text-lg">Loading applications...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-porcelain py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-charcoal mb-2">My Applications</h1>
            <p className="text-architectural">Track the status of your property applications</p>
          </div>
          <Link to="/properties" className="px-6 py-2 bg-obsidian text-porcelain rounded-lg hover:bg-obsidian-light transition-colors">
            Browse Properties
          </Link>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-error/20 border border-error text-error rounded-lg">
            {error}
          </div>
        )}

        {applications.length === 0 ? (
          <div className="bg-stone-100 p-12 rounded-xl text-center border border-stone-200">
            <svg className="w-16 h-16 mx-auto text-architectural mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="text-xl font-semibold text-charcoal mb-2">No applications yet</h3>
            <p className="text-architectural mb-6">Start applying to properties you're interested in!</p>
            <Link to="/properties" className="inline-block px-6 py-2 bg-obsidian text-porcelain rounded-lg hover:bg-obsidian-light transition-colors">
              Browse Properties
            </Link>
          </div>
        ) : (
          <div className="bg-stone-100 rounded-xl border border-stone-200 overflow-hidden">
            <div className="divide-y divide-stone-200">
              {applications.map((app) => (
                <div key={app.id} className="p-6 hover:bg-stone-200 transition-colors">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <Link to={`/properties/${app.property?.id}`} className="text-xl font-semibold text-obsidian hover:text-brass transition-colors">
                            {app.property?.title || 'Property'}
                          </Link>
                          <p className="text-sm text-architectural mt-1">{app.property?.address}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(app.status)}`}>
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
                        <div className="mt-4 p-3 bg-porcelain rounded-lg border border-stone-200">
                          <p className="text-sm text-charcoal"><span className="font-medium">Your message:</span> {app.message}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default TenantApplications;

