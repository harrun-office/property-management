import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ownerAPI } from '../../services/api';
import PropertyCard from '../../components/PropertyCard';

function MyProperties() {
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    status: '',
    propertyType: '',
    search: ''
  });

  useEffect(() => {
    loadProperties();
  }, [filters]);

  const loadProperties = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await ownerAPI.getProperties(filters);
      setProperties(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  const handleStatusChange = async (propertyId, newStatus) => {
    try {
      await ownerAPI.updatePropertyStatus(propertyId, newStatus);
      loadProperties();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this property? This action cannot be undone.')) {
      return;
    }

    try {
      await ownerAPI.deleteProperty(id);
      loadProperties();
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-porcelain flex items-center justify-center">
        <p className="text-architectural text-lg">Loading properties...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-porcelain py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-charcoal mb-2">My Properties</h1>
            <p className="text-architectural">Manage all your property listings</p>
          </div>
          <Link
            to="/owner/properties/new"
            className="px-6 py-3 bg-obsidian text-porcelain rounded-xl font-semibold hover:bg-obsidian-600 transition-colors"
          >
            + Post New Property
          </Link>
        </div>

        {/* Filters */}
        <div className="bg-stone-100 rounded-xl shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Filters</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-charcoal mb-1">Status</label>
              <select
                name="status"
                value={filters.status}
                onChange={handleFilterChange}
                className="w-full p-3 border border-stone-300 rounded-xl focus:ring-2 focus:ring-obsidian-500"
              >
                <option value="">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="rented">Rented</option>
                <option value="maintenance">Maintenance</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-charcoal mb-1">Property Type</label>
              <select
                name="propertyType"
                value={filters.propertyType}
                onChange={handleFilterChange}
                className="w-full p-3 border border-stone-300 rounded-xl focus:ring-2 focus:ring-obsidian-500"
              >
                <option value="">All Types</option>
                <option value="apartment">Apartment</option>
                <option value="house">House</option>
                <option value="condo">Condo</option>
                <option value="townhouse">Townhouse</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-charcoal mb-1">Search</label>
              <input
                type="text"
                name="search"
                value={filters.search}
                onChange={handleFilterChange}
                placeholder="Search by title or address..."
                className="w-full p-3 border border-stone-300 rounded-xl focus:ring-2 focus:ring-obsidian-500"
              />
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-error/20 border border-error text-error rounded-lg">
            {error}
          </div>
        )}

        {properties.length === 0 && !loading && (
          <div className="text-center py-12 bg-stone-100 rounded-2xl shadow-md">
            <p className="text-architectural text-lg mb-4">You haven't posted any properties yet.</p>
            <Link
              to="/owner/properties/new"
              className="inline-block px-6 py-3 bg-obsidian text-porcelain rounded-xl font-semibold hover:bg-obsidian-600 transition-colors"
            >
              Post Your First Property
            </Link>
          </div>
        )}

        {properties.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((property) => (
              <div key={property.id} className="bg-stone-100 rounded-2xl shadow-md overflow-hidden">
                <PropertyCard property={property} noLink={true} />
                <div className="p-4 border-t space-y-3">
                  {/* Quick Stats */}
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-4">
                      <span className="text-architectural">
                        <span className="font-semibold">{property.views || 0}</span> views
                      </span>
                      <span className="text-architectural">
                        <span className="font-semibold">{property.inquiries || 0}</span> inquiries
                      </span>
                      <span className="text-architectural">
                        <span className="font-semibold">{property.pendingApplications || 0}</span> pending
                      </span>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div className="flex items-center justify-between">
                    <select
                      value={property.status}
                      onChange={(e) => handleStatusChange(property.id, e.target.value)}
                      className="px-3 py-1 text-sm border border-stone-300 rounded-lg focus:ring-2 focus:ring-obsidian-500"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                      <option value="rented">Rented</option>
                      <option value="maintenance">Maintenance</option>
                    </select>
                  </div>

                  {/* Actions */}
                  <div className="flex space-x-2">
                    <Link
                      to={`/owner/properties/${property.id}/edit`}
                      className="flex-1 px-4 py-2 bg-obsidian text-porcelain rounded-lg hover:bg-obsidian-600 text-center text-sm font-medium transition-colors"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(property.id)}
                      className="flex-1 px-4 py-2 bg-error text-porcelain rounded-lg hover:opacity-90 text-sm font-medium transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default MyProperties;

