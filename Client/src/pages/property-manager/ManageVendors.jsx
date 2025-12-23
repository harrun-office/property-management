import { useState, useEffect } from 'react';
import { propertyManagerAPI } from '../../services/api';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Skeleton from '../../components/ui/Skeleton';
import ErrorDisplay from '../../components/ui/ErrorDisplay';
import EmptyState from '../../components/ui/EmptyState';

function ManageVendors() {
  const [vendors, setVendors] = useState([]);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    companyName: '',
    phone: '',
    serviceTypes: [],
    assignedProperties: [],
    permissionScope: 'task-based'
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError('');
    try {
      const [vendorsData, propertiesData] = await Promise.all([
        propertyManagerAPI.getVendors(),
        propertyManagerAPI.getProperties()
      ]);
      setVendors(vendorsData);
      setProperties(propertiesData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.email || !formData.name || !formData.companyName || formData.serviceTypes.length === 0) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      await propertyManagerAPI.createVendor(formData);
      setShowCreateForm(false);
      setFormData({
        email: '',
        name: '',
        companyName: '',
        phone: '',
        serviceTypes: [],
        assignedProperties: [],
        permissionScope: 'task-based'
      });
      loadData();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleAssignProperty = async (vendorId, propertyId, permissionScope) => {
    try {
      await propertyManagerAPI.assignVendorToProperty(vendorId, propertyId, permissionScope);
      loadData();
    } catch (err) {
      setError(err.message);
    }
  };

  const serviceTypes = ['plumbing', 'electrical', 'cleaning', 'maintenance', 'security', 'landscaping'];

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
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-charcoal mb-2">Manage Vendors</h1>
            <p className="text-architectural">Create and manage vendors</p>
          </div>
          <Button
            variant={showCreateForm ? "secondary" : "primary"}
            onClick={() => setShowCreateForm(!showCreateForm)}
            icon={
              showCreateForm ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              )
            }
          >
            {showCreateForm ? 'Cancel' : 'Create Vendor'}
          </Button>
        </div>

        {error && <ErrorDisplay message={error} onRetry={loadData} className="mb-6" />}

        {showCreateForm && (
          <Card variant="elevated" padding="lg" className="mb-8">
            <Card.Title className="mb-4">Create Vendor</Card.Title>
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Contact Name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
                <Input
                  label="Company Name"
                  type="text"
                  value={formData.companyName}
                  onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                  required
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
                <Input
                  label="Phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-charcoal mb-1">Service Types <span className="text-error-500">*</span></label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {serviceTypes.map((type) => (
                    <label key={type} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.serviceTypes.includes(type)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFormData({
                              ...formData,
                              serviceTypes: [...formData.serviceTypes, type]
                            });
                          } else {
                            setFormData({
                              ...formData,
                              serviceTypes: formData.serviceTypes.filter(t => t !== type)
                            });
                          }
                        }}
                        className="w-4 h-4 text-obsidian border-stone-300 rounded focus:ring-obsidian-500"
                      />
                      <span className="text-sm text-charcoal capitalize">{type}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-charcoal mb-1">Permission Scope</label>
                <select
                  value={formData.permissionScope}
                  onChange={(e) => setFormData({ ...formData, permissionScope: e.target.value })}
                  className="w-full px-4 py-2.5 border border-stone-300 rounded-lg bg-porcelain focus:ring-2 focus:ring-obsidian-500 focus:border-obsidian-500 transition-colors"
                >
                  <option value="read-only">Read Only</option>
                  <option value="task-based">Task Based</option>
                  <option value="billing-access">Billing Access</option>
                  <option value="full">Full Access</option>
                </select>
              </div>
              <Button type="submit" variant="primary" fullWidth>
                Create & Send Invitation
              </Button>
            </form>
          </Card>
        )}

        {vendors.length === 0 && !showCreateForm ? (
          <EmptyState
            title="No vendors yet"
            description="Create your first vendor to get started with vendor management."
            action={
              <Button variant="primary" onClick={() => setShowCreateForm(true)}>
                Create Your First Vendor
              </Button>
            }
            icon={
              <svg className="w-16 h-16 text-architectural" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            }
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {vendors.map((vendor) => (
              <Card key={vendor.id} variant="elevated" padding="lg">
                <Card.Title className="text-xl mb-2">{vendor.companyName}</Card.Title>
                <Card.Description className="mb-2">{vendor.contactName}</Card.Description>
                <p className="text-sm text-architectural mb-4">{vendor.email}</p>
                <div className="mb-4">
                  <p className="text-sm font-medium text-charcoal mb-1">Service Types:</p>
                  <div className="flex flex-wrap gap-2">
                    {vendor.serviceTypes.map((type, idx) => (
                      <span key={idx} className="px-2 py-1 bg-obsidian-100 text-obsidian-700 rounded text-xs capitalize font-medium">
                        {type}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="mb-4">
                  <p className="text-sm font-medium text-charcoal mb-1">Assigned Properties:</p>
                  <p className="text-sm text-architectural">{vendor.assignedProperties?.length || 0} properties</p>
                </div>
                <Card.Footer className="flex items-center justify-between pt-4 border-t border-stone-200">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    vendor.status === 'active' ? 'bg-eucalyptus-100 text-eucalyptus-700' :
                    'bg-warning-100 text-warning-700'
                  }`}>
                    {vendor.status}
                  </span>
                  <Button
                    size="sm"
                    variant="primary"
                    onClick={() => {
                      const propertyId = prompt('Enter Property ID to assign:');
                      if (propertyId) {
                        handleAssignProperty(vendor.id, parseInt(propertyId), vendor.permissionScope);
                      }
                    }}
                  >
                    Assign Property
                  </Button>
                </Card.Footer>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ManageVendors;

