import { useState, useEffect } from 'react';
import { ownerAPI } from '../../services/api';
import Card from '../../components/ui/Card';
import Skeleton from '../../components/ui/Skeleton';
import ErrorDisplay from '../../components/ui/ErrorDisplay';
import EmptyState from '../../components/ui/EmptyState';

function Tenants() {
  const [tenants, setTenants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadTenants();
  }, []);

  const loadTenants = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await ownerAPI.getTenants();
      setTenants(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-porcelain py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <Skeleton variant="title" width="30%" className="mb-2" />
            <Skeleton variant="text" width="50%" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Skeleton.Card key={i} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-porcelain py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-charcoal mb-2">Tenants</h1>
          <p className="text-architectural">Manage your tenants and leases</p>
        </div>

        {error && <ErrorDisplay message={error} onRetry={loadTenants} className="mb-6" />}

        {tenants.length === 0 ? (
          <EmptyState
            title="No tenants yet"
            description="Tenants will appear here once applications are approved."
            icon={
              <svg className="w-16 h-16 text-architectural" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            }
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tenants.map((tenant) => (
              <Card key={tenant.id} variant="elevated" padding="lg">
                <Card.Title className="text-xl mb-2">
                  {tenant.tenant?.name || 'Unknown Tenant'}
                </Card.Title>
                <Card.Description className="mb-4">{tenant.property?.title}</Card.Description>
                <Card.Body className="space-y-2 text-sm">
                  <p><span className="font-medium text-charcoal">Email:</span> <span className="text-architectural">{tenant.tenant?.email || 'N/A'}</span></p>
                  <p><span className="font-medium text-charcoal">Monthly Rent:</span> <span className="text-architectural">${tenant.monthlyRent || 0}</span></p>
                  <p><span className="font-medium text-charcoal">Lease Start:</span> <span className="text-architectural">{new Date(tenant.leaseStartDate).toLocaleDateString()}</span></p>
                  <p><span className="font-medium text-charcoal">Status:</span> 
                    <span className={`ml-2 px-2 py-1 rounded-full text-xs font-semibold ${
                      tenant.status === 'active' ? 'bg-eucalyptus-100 text-eucalyptus-700' : 'bg-stone-200 text-charcoal'
                    }`}>
                      {tenant.status}
                    </span>
                  </p>
                </Card.Body>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Tenants;

