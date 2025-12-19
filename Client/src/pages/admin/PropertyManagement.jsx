import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { adminAPI } from '../../services/api';

function PropertyManagement() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState({
    status: searchParams.get('status') || '',
    search: ''
  });
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    loadProperties();
  }, [filters]);

  const loadProperties = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await adminAPI.getAllProperties(filters);
      setProperties(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
    if (name === 'status') {
      setSearchParams({ status: value });
    }
  };

  const handleViewDetails = async (propertyId) => {
    try {
      const property = await adminAPI.getPropertyById(propertyId);
      setSelectedProperty(property);
      setShowModal(true);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (propertyId) => {
    if (!window.confirm('Are you sure you want to delete this property? This action cannot be undone.')) return;
    
    try {
      await adminAPI.deleteProperty(propertyId);
      loadProperties();
    } catch (err) {
      setError(err.message);
    }
  };

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-eucalyptus/20 text-eucalyptus';
      case 'inactive':
        return 'bg-architectural/20 text-architectural';
      case 'occupied':
        return 'bg-brass/20 text-brass';
      case 'vacant':
        return 'bg-warning/20 text-warning';
      default:
        return 'bg-stone-200 text-charcoal';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-porcelain flex items-center justify-center">
        <p className="text-architectural">Loading properties...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-porcelain py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-charcoal mb-2">Property Management</h1>
          <p className="text-architectural">View and manage all properties in the system</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-error/20 border border-error text-error rounded-lg">
            {error}
          </div>
        )}

        {/* Filters */}
        <div className="bg-stone-100 rounded-2xl shadow-md p-6 mb-6 border border-stone-200">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-charcoal mb-2">Search</label>
              <input
                type="text"
                name="search"
                value={filters.search}
                onChange={handleFilterChange}
                placeholder="Search by address, title, or city..."
                className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-obsidian focus:border-obsidian bg-porcelain text-charcoal"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-charcoal mb-2">Status</label>
              <select
                name="status"
                value={filters.status}
                onChange={handleFilterChange}
                className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-obsidian focus:border-obsidian bg-porcelain text-charcoal"
              >
                <option value="">All Statuses</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="occupied">Occupied</option>
                <option value="vacant">Vacant</option>
              </select>
            </div>
          </div>
        </div>

        {/* Properties Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <p className="text-architectural text-lg">No properties found</p>
            </div>
          ) : (
            properties.map((property) => (
              <div key={property.id} className="bg-stone-100 rounded-2xl shadow-md border border-stone-200 overflow-hidden hover:shadow-lg transition-shadow">
                {property.images && property.images[0] && (
                  <img
                    src={property.images[0]}
                    alt={property.title}
                    className="w-full h-48 object-cover"
                  />
                )}
                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold text-charcoal line-clamp-1">{property.title}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium flex-shrink-0 ml-2 ${getStatusBadgeColor(property.status)}`}>
                      {property.status || 'active'}
                    </span>
                  </div>
                  <p className="text-architectural text-sm mb-3 line-clamp-2">{property.address}</p>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-2xl font-bold text-obsidian">${property.monthlyRent || property.price || 0}</p>
                      <p className="text-xs text-architectural">per month</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-charcoal font-medium">{property.bedrooms} bed</p>
                      <p className="text-sm text-charcoal font-medium">{property.bathrooms} bath</p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleViewDetails(property.id)}
                      className="flex-1 px-4 py-2 bg-obsidian text-porcelain rounded-lg hover:bg-obsidian-light transition-colors font-semibold text-sm"
                    >
                      View Details
                    </button>
                    <button
                      onClick={() => handleDelete(property.id)}
                      className="px-4 py-2 bg-error text-porcelain rounded-lg hover:bg-error/90 transition-colors font-semibold text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Property Details Modal */}
        {showModal && selectedProperty && (
          <div className="fixed inset-0 bg-charcoal/50 flex items-center justify-center z-50 p-4">
            <div className="bg-porcelain rounded-2xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-stone-200">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-charcoal">Property Details</h2>
                  <button
                    onClick={() => setShowModal(false)}
                    className="text-architectural hover:text-charcoal transition-colors"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-architectural mb-1">Title</label>
                  <p className="text-charcoal font-medium">{selectedProperty.title}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-architectural mb-1">Address</label>
                  <p className="text-charcoal">{selectedProperty.address}</p>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-architectural mb-1">Monthly Rent</label>
                    <p className="text-charcoal font-medium">${selectedProperty.monthlyRent || selectedProperty.price || 0}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-architectural mb-1">Security Deposit</label>
                    <p className="text-charcoal font-medium">${selectedProperty.securityDeposit || 0}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-architectural mb-1">Bedrooms</label>
                    <p className="text-charcoal">{selectedProperty.bedrooms}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-architectural mb-1">Bathrooms</label>
                    <p className="text-charcoal">{selectedProperty.bathrooms}</p>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-architectural mb-1">Description</label>
                  <p className="text-charcoal">{selectedProperty.description}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-architectural mb-1">Status</label>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium inline-block ${getStatusBadgeColor(selectedProperty.status)}`}>
                    {selectedProperty.status || 'active'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default PropertyManagement;

