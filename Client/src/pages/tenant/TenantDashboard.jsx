import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { propertiesAPI } from '../../services/api';
import PropertyCard from '../../components/PropertyCard';

function TenantDashboard() {
  const [recentProperties, setRecentProperties] = useState([]);
  const [savedProperties, setSavedProperties] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      // Load recent properties, saved properties, and applications
      const [recent, saved, apps] = await Promise.all([
        propertiesAPI.getAll({ limit: 6 }),
        propertiesAPI.getSavedProperties?.() || Promise.resolve([]),
        propertiesAPI.getMyApplications?.() || Promise.resolve([])
      ]);
      setRecentProperties(recent);
      setSavedProperties(saved);
      setApplications(apps);
    } catch (err) {
      console.error('Error loading dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-porcelain flex items-center justify-center">
        <p className="text-charcoal text-lg">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-porcelain py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-charcoal mb-2">Tenant Dashboard</h1>
        <p className="text-architectural mb-8">Welcome back! Here's your property management overview.</p>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-stone-100 p-6 rounded-xl border border-stone-200">
            <h3 className="text-architectural text-sm mb-2">Saved Properties</h3>
            <p className="text-3xl font-bold text-obsidian">{savedProperties.length}</p>
          </div>
          <div className="bg-stone-100 p-6 rounded-xl border border-stone-200">
            <h3 className="text-architectural text-sm mb-2">Active Applications</h3>
            <p className="text-3xl font-bold text-eucalyptus">{applications.filter(a => a.status === 'pending').length}</p>
          </div>
          <div className="bg-stone-100 p-6 rounded-xl border border-stone-200">
            <h3 className="text-architectural text-sm mb-2">Approved Applications</h3>
            <p className="text-3xl font-bold text-success">{applications.filter(a => a.status === 'approved').length}</p>
          </div>
        </div>

        {/* Recent Properties */}
        <section className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-charcoal">Recent Properties</h2>
            <Link to="/properties" className="text-obsidian hover:text-brass transition-colors font-medium">
              View All →
            </Link>
          </div>
          {recentProperties.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentProperties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          ) : (
            <div className="bg-stone-100 p-8 rounded-xl text-center border border-stone-200">
              <p className="text-architectural">No properties found. Start browsing!</p>
              <Link to="/properties" className="mt-4 inline-block px-6 py-2 bg-obsidian text-porcelain rounded-lg hover:bg-obsidian-light transition-colors">
                Browse Properties
              </Link>
            </div>
          )}
        </section>

        {/* My Applications */}
        <section className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-charcoal">My Applications</h2>
            <Link to="/tenant/applications" className="text-obsidian hover:text-brass transition-colors font-medium">
              View All →
            </Link>
          </div>
          {applications.length > 0 ? (
            <div className="bg-stone-100 rounded-xl border border-stone-200 overflow-hidden">
              <div className="divide-y divide-stone-200">
                {applications.slice(0, 5).map((app) => (
                  <div key={app.id} className="p-4 hover:bg-stone-200 transition-colors">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-charcoal">{app.property?.title || 'Property'}</h3>
                        <p className="text-sm text-architectural mt-1">Applied on {new Date(app.createdAt).toLocaleDateString()}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        app.status === 'approved' ? 'bg-eucalyptus/20 text-eucalyptus' :
                        app.status === 'rejected' ? 'bg-error/20 text-error' :
                        'bg-warning/20 text-warning'
                      }`}>
                        {app.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-stone-100 p-8 rounded-xl text-center border border-stone-200">
              <p className="text-architectural">You haven't applied to any properties yet.</p>
              <Link to="/properties" className="mt-4 inline-block px-6 py-2 bg-obsidian text-porcelain rounded-lg hover:bg-obsidian-light transition-colors">
                Browse Properties
              </Link>
            </div>
          )}
        </section>

        {/* Quick Actions */}
        <section>
          <h2 className="text-2xl font-bold text-charcoal mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link to="/properties" className="bg-stone-100 p-6 rounded-xl border border-stone-200 hover:border-brass transition-colors">
              <h3 className="font-semibold text-charcoal mb-2">Browse Properties</h3>
              <p className="text-sm text-architectural">Find your perfect rental</p>
            </Link>
            <Link to="/tenant/saved" className="bg-stone-100 p-6 rounded-xl border border-stone-200 hover:border-brass transition-colors">
              <h3 className="font-semibold text-charcoal mb-2">Saved Properties</h3>
              <p className="text-sm text-architectural">View your favorites</p>
            </Link>
            <Link to="/tenant/applications" className="bg-stone-100 p-6 rounded-xl border border-stone-200 hover:border-brass transition-colors">
              <h3 className="font-semibold text-charcoal mb-2">My Applications</h3>
              <p className="text-sm text-architectural">Track application status</p>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}

export default TenantDashboard;

