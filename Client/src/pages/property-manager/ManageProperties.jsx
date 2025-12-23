import { useState, useEffect } from 'react';
import { propertyManagerAPI } from '../../services/api';
import PropertyCard from '../../components/PropertyCard';
import Card from '../../components/ui/Card';
import Skeleton from '../../components/ui/Skeleton';
import ErrorDisplay from '../../components/ui/ErrorDisplay';
import EmptyState from '../../components/ui/EmptyState';

function ManageProperties() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadProperties();
  }, []);

  const loadProperties = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await propertyManagerAPI.getProperties();
      setProperties(data);
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
            <Skeleton variant="title" width="40%" className="mb-2" />
            <Skeleton variant="text" width="60%" />
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
          <h1 className="text-4xl font-bold text-charcoal mb-2">Manage Properties</h1>
          <p className="text-architectural">View and manage your assigned properties</p>
        </div>

        {error && <ErrorDisplay message={error} onRetry={loadProperties} className="mb-6" />}

        {properties.length === 0 ? (
          <EmptyState
            title="No properties assigned"
            description="You don't have any properties assigned to manage yet."
            icon={
              <svg className="w-16 h-16 text-architectural" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            }
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((property) => (
              <Card key={property.id} variant="elevated" padding="none" className="overflow-hidden">
                <PropertyCard property={property} noLink={true} />
                <Card.Body className="p-4 border-t border-stone-200">
                  <Card.Title className="text-lg mb-2">Assigned Vendors</Card.Title>
                  {property.assignedVendors && property.assignedVendors.length > 0 ? (
                    <ul className="space-y-1">
                      {property.assignedVendors.map((v, idx) => (
                        <li key={idx} className="text-sm text-architectural">
                          Vendor #{v.vendorId} - {v.permissionScope}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-architectural">No vendors assigned</p>
                  )}
                </Card.Body>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ManageProperties;

