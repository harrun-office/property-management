import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ownerAPI } from '../../services/api';
import PropertyCard from '../../components/PropertyCard';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Skeleton from '../../components/ui/Skeleton';
import ErrorDisplay from '../../components/ui/ErrorDisplay';
import EmptyState from '../../components/ui/EmptyState';
import Modal from '../../components/ui/Modal';

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
      console.log('🔍 Loading properties with filters:', filters);
      const data = await ownerAPI.getProperties(filters);
      console.log('📊 Properties received:', data);
      console.log('📊 Properties count:', data?.length || 0);
      console.log('📊 Properties array:', Array.isArray(data) ? 'Yes' : 'No');

      // Force temporary display for debugging
      if (data && data.length > 0) {
        console.log('🏠 First property:', {
          id: data[0].id,
          title: data[0].title,
          status: data[0].status
        });
      }

      setProperties(data || []);
    } catch (err) {
      console.error('❌ Error loading properties:', err);
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

  const handleStatusChange = async (propertyId, newStatus, property) => {
    // If changing to inactive and property has a tenant, show confirmation
    if (newStatus === 'inactive' && property?.tenant) {
      const confirmed = window.confirm(
        `⚠️ This property has a current tenant (${property.tenant.name}).\n\n` +
        `Setting it to "Inactive" will:\n` +
        `• Terminate the current tenancy\n` +
        `• Remove the tenant from this property\n` +
        `• Allow the tenant to search for other properties\n\n` +
        `Are you sure you want to continue?`
      );

      if (!confirmed) return;
    }

    try {
      await ownerAPI.updatePropertyStatus(propertyId, newStatus);
      loadProperties();
      if (newStatus === 'inactive' && property?.tenant) {
        alert('Property set to inactive. The tenant has been removed and can now search for other properties.');
      }
    } catch (err) {
      alert('Error updating property status: ' + err.message);
    }
  };

  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const handleDelete = async (id) => {
    setDeleteConfirm(id);
  };

  const confirmDelete = async () => {
    if (!deleteConfirm) return;
    try {
      await ownerAPI.deleteProperty(deleteConfirm);
      setDeleteConfirm(null);
      loadProperties();
    } catch (err) {
      alert(err.message);
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
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-charcoal mb-2">My Properties</h1>
            <p className="text-architectural">Manage all your property listings</p>
          </div>
          <Link to="/owner/properties/new">
            <Button variant="primary" icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            }>
              Post New Property
            </Button>
          </Link>
        </div>

        {/* Filters */}
        <Card variant="elevated" padding="lg" className="mb-8">
          <Card.Title className="mb-4 flex items-center justify-between">
            <span>Filters</span>
            {(filters.status || filters.propertyType || filters.search) && (
              <button
                onClick={() => setFilters({ status: '', propertyType: '', search: '' })}
                className="text-sm text-blue-600 hover:text-blue-800 underline"
              >
                Clear all filters
              </button>
            )}
          </Card.Title>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-charcoal mb-1">Status</label>
              <select
                name="status"
                value={filters.status}
                onChange={handleFilterChange}
                className="w-full p-3 border border-stone-300 rounded-lg bg-porcelain focus:ring-2 focus:ring-obsidian-500 focus:border-obsidian-500 transition-colors"
              >
                <option value="">All Status</option>
                <option value="active">Active (Listed for rent)</option>
                <option value="inactive">Inactive (Not available)</option>
                <option value="maintenance">Maintenance (Under repair)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-charcoal mb-1">Property Type</label>
              <select
                name="propertyType"
                value={filters.propertyType}
                onChange={handleFilterChange}
                className="w-full p-3 border border-stone-300 rounded-lg bg-porcelain focus:ring-2 focus:ring-obsidian-500 focus:border-obsidian-500 transition-colors"
              >
                <option value="">All Types</option>
                <option value="apartment">Apartment</option>
                <option value="house">House</option>
                <option value="condo">Condo</option>
                <option value="townhouse">Townhouse</option>
              </select>
            </div>
            <Input
              label="Search"
              name="search"
              value={filters.search}
              onChange={handleFilterChange}
              placeholder="Search by title or address..."
            />
          </div>
        </Card>

        {/* Active Filters Display */}
        {(filters.status || filters.propertyType || filters.search) && (
          <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center justify-between">
              <div className="text-sm text-blue-800">
                <strong>Active Filters:</strong>
                {filters.status && <span className="ml-2">Status: {filters.status === 'active' ? 'Active (Listed)' : filters.status === 'inactive' ? 'Inactive' : filters.status === 'maintenance' ? 'Maintenance' : filters.status}</span>}
                {filters.propertyType && <span className="ml-2">Type: {filters.propertyType}</span>}
                {filters.search && <span className="ml-2">Search: "{filters.search}"</span>}
              </div>
              <button
                onClick={() => setFilters({ status: '', propertyType: '', search: '' })}
                className="text-sm text-blue-600 hover:text-blue-800 underline hover:no-underline"
              >
                Clear all filters
              </button>
            </div>
          </div>
        )}

        {error && <ErrorDisplay message={error} onRetry={loadProperties} className="mb-6" />}

        {/* Debug Info */}
        {!loading && (
          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <h3 className="font-semibold text-yellow-800 mb-2">🔍 Debug Info:</h3>
            <div className="text-sm text-yellow-700 space-y-1">
              <div>Loading: {loading ? 'Yes' : 'No'}</div>
              <div>Error: {error || 'None'}</div>
              <div>Properties in state: {properties?.length || 0}</div>
              <div>Filters: {JSON.stringify(filters)}</div>
              {properties && properties.length > 0 && (
                <div>First property: {properties[0].title} (ID: {properties[0].id}, Status: {properties[0].status})</div>
              )}
            </div>
          </div>
        )}

        {properties.length === 0 && !loading && (
          <EmptyState
            title={filters.status || filters.propertyType || filters.search ? "No properties match your filters" : "No properties yet"}
            description={
              filters.status || filters.propertyType || filters.search
                ? "Try adjusting your filters to see more properties, or clear all filters to view everything."
                : "You haven't posted any properties yet. Get started by posting your first property."
            }
            action={
              filters.status || filters.propertyType || filters.search ? (
                <Button variant="primary" onClick={() => setFilters({ status: '', propertyType: '', search: '' })}>
                  Clear Filters
                </Button>
              ) : (
                <Link to="/owner/properties/new">
                  <Button variant="primary">Post Your First Property</Button>
                </Link>
              )
            }
            icon={
              <svg className="w-16 h-16 text-architectural" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            }
          />
        )}

        {properties.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((property) => (
              <Card key={property.id} variant="elevated" padding="none" className="overflow-hidden">
                <PropertyCard property={property} noLink={true} />
                <Card.Body className="p-4 border-t border-stone-200 space-y-3">
                  {/* Tenant Information for Rented Properties */}
                  {property.tenant && (
                    <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                      <h4 className="font-semibold text-charcoal mb-2 flex items-center gap-2">
                        <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        Current Tenant
                      </h4>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div><span className="font-medium">Name:</span> {property.tenant.name}</div>
                        <div><span className="font-medium">Email:</span> {property.tenant.email}</div>
                        <div><span className="font-medium">Phone:</span> {property.tenant.phone || 'N/A'}</div>
                        <div><span className="font-medium">Lease:</span> {new Date(property.tenant.leaseStartDate).toLocaleDateString()} - {new Date(property.tenant.leaseEndDate).toLocaleDateString()}</div>
                      </div>
                    </div>
                  )}

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
                      onChange={(e) => handleStatusChange(property.id, e.target.value, property)}
                      className="px-3 py-1.5 text-sm border border-stone-300 rounded-lg bg-porcelain focus:ring-2 focus:ring-obsidian-500 focus:border-obsidian-500 transition-colors"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                      <option value="maintenance">Maintenance</option>
                    </select>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Link to={`/owner/properties/${property.id}/edit`} className="flex-1">
                      <Button variant="primary" size="sm" fullWidth>Edit</Button>
                    </Link>
                    <Button
                      variant="danger"
                      size="sm"
                      fullWidth
                      onClick={() => handleDelete(property.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            ))}
          </div>
        )}

        {/* Delete Confirmation Modal */}
        <Modal
          isOpen={!!deleteConfirm}
          onClose={() => setDeleteConfirm(null)}
          title="Delete Property"
          size="md"
        >
          <p className="text-charcoal mb-6">
            Are you sure you want to delete this property? This action cannot be undone.
          </p>
          <div className="flex gap-3 justify-end">
            <Button variant="secondary" onClick={() => setDeleteConfirm(null)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={confirmDelete}>
              Delete
            </Button>
          </div>
        </Modal>
      </div>
    </div>
  );
}

export default MyProperties;

