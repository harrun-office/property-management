import { useState, useEffect } from 'react';
import { ownerAPI } from '../../services/api';

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
      <div className="min-h-screen bg-porcelain flex items-center justify-center">
        <p className="text-architectural text-lg">Loading tenants...</p>
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

        {error && (
          <div className="mb-6 p-4 bg-error/20 border border-error text-error rounded-lg">
            {error}
          </div>
        )}

        {tenants.length === 0 ? (
          <div className="bg-stone-100 rounded-xl shadow-md p-12 text-center">
            <p className="text-gray-500 text-lg mb-4">No tenants yet</p>
            <p className="text-gray-400 text-sm">Tenants will appear here once applications are approved</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tenants.map((tenant) => (
              <div key={tenant.id} className="bg-stone-100 rounded-xl shadow-md p-6">
                <h3 className="text-xl font-semibold text-charcoal mb-2">
                  {tenant.tenant?.name || 'Unknown Tenant'}
                </h3>
                <p className="text-sm text-architectural mb-4">{tenant.property?.title}</p>
                <div className="space-y-2 text-sm">
                  <p><span className="font-medium">Email:</span> {tenant.tenant?.email || 'N/A'}</p>
                  <p><span className="font-medium">Monthly Rent:</span> ${tenant.monthlyRent || 0}</p>
                  <p><span className="font-medium">Lease Start:</span> {new Date(tenant.leaseStartDate).toLocaleDateString()}</p>
                  <p><span className="font-medium">Status:</span> 
                    <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
                      tenant.status === 'active' ? 'bg-eucalyptus/20 text-eucalyptus' : 'bg-stone-200 text-charcoal'
                    }`}>
                      {tenant.status}
                    </span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Tenants;

