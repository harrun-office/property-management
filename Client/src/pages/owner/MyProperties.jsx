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
          <Card.Title className="mb-4">Filters</Card.Title>
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

        {error && <ErrorDisplay message={error} onRetry={loadProperties} className="mb-6" />}

        {properties.length === 0 && !loading && (
          <EmptyState
            title="No properties yet"
            description="You haven't posted any properties yet. Get started by posting your first property."
            action={
              <Link to="/owner/properties/new">
                <Button variant="primary">Post Your First Property</Button>
              </Link>
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
                      className="px-3 py-1.5 text-sm border border-stone-300 rounded-lg bg-porcelain focus:ring-2 focus:ring-obsidian-500 focus:border-obsidian-500 transition-colors"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                      <option value="rented">Rented</option>
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

