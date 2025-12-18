import { useState, useEffect } from 'react';
import { vendorAPI } from '../../services/api';
import PropertyCard from '../../components/PropertyCard';

function PropertyAccess() {
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
      const data = await vendorAPI.getProperties();
      setProperties(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Loading properties...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Assigned Properties</h1>
          <p className="text-gray-600">Properties you have access to</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {properties.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl shadow-md">
            <p className="text-gray-600 text-lg">No properties assigned yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((property) => {
              const vendorAssignment = property.assignedVendors?.find(v => v.vendorId);
              return (
                <div key={property.id} className="bg-white rounded-2xl shadow-md overflow-hidden">
                  <PropertyCard property={property} noLink={true} />
                  {vendorAssignment && (
                    <div className="p-4 border-t">
                      <p className="text-sm text-gray-600">
                        Permission: <span className="font-semibold capitalize">{vendorAssignment.permissionScope}</span>
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default PropertyAccess;

