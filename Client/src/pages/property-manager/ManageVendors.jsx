import { useState, useEffect } from 'react';
import { propertyManagerAPI } from '../../services/api';

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
      <div className="min-h-screen bg-porcelain flex items-center justify-center">
        <p className="text-architectural">Loading vendors...</p>
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
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="px-6 py-3 bg-obsidian text-porcelain rounded-xl font-semibold hover:bg-obsidian-600 transition-colors"
          >
            {showCreateForm ? 'Cancel' : '+ Create Vendor'}
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-error/20 border border-error text-error rounded-lg">
            {error}
          </div>
        )}

        {showCreateForm && (
          <div className="bg-stone-100 rounded-2xl shadow-md p-6 mb-8">
            <h2 className="text-2xl font-bold mb-4 text-charcoal">Create Vendor</h2>
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Contact Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="w-full p-3 border border-gray-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Company Name *</label>
                  <input
                    type="text"
                    value={formData.companyName}
                    onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                    required
                    className="w-full p-3 border border-gray-300 rounded-xl"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    className="w-full p-3 border border-gray-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-xl"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Service Types *</label>
                <div className="grid grid-cols-3 gap-2">
                  {serviceTypes.map((type) => (
                    <label key={type} className="flex items-center space-x-2">
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
                      />
                      <span className="text-sm text-gray-700 capitalize">{type}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Permission Scope</label>
                <select
                  value={formData.permissionScope}
                  onChange={(e) => setFormData({ ...formData, permissionScope: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-xl"
                >
                  <option value="read-only">Read Only</option>
                  <option value="task-based">Task Based</option>
                  <option value="billing-access">Billing Access</option>
                  <option value="full">Full Access</option>
                </select>
              </div>
              <button
                type="submit"
                className="px-6 py-3 bg-obsidian text-porcelain rounded-xl font-semibold hover:bg-obsidian-600 transition-colors"
              >
                Create & Send Invitation
              </button>
            </form>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {vendors.map((vendor) => (
            <div key={vendor.id} className="bg-stone-100 rounded-2xl shadow-md p-6">
              <h3 className="text-xl font-semibold mb-2 text-charcoal">{vendor.companyName}</h3>
              <p className="text-architectural mb-2">{vendor.contactName}</p>
              <p className="text-sm text-architectural mb-4">{vendor.email}</p>
              <div className="mb-4">
                <p className="text-sm font-medium text-charcoal mb-1">Service Types:</p>
                <div className="flex flex-wrap gap-2">
                  {vendor.serviceTypes.map((type, idx) => (
                    <span key={idx} className="px-2 py-1 bg-obsidian-100 text-obsidian-500 rounded text-xs capitalize">
                      {type}
                    </span>
                  ))}
                </div>
              </div>
              <div className="mb-4">
                <p className="text-sm font-medium text-charcoal mb-1">Assigned Properties:</p>
                <p className="text-sm text-architectural">{vendor.assignedProperties?.length || 0} properties</p>
              </div>
              <div className="flex items-center justify-between">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  vendor.status === 'active' ? 'bg-eucalyptus/20 text-eucalyptus' :
                  'bg-warning/20 text-warning'
                }`}>
                  {vendor.status}
                </span>
                <button
                  onClick={() => {
                    const propertyId = prompt('Enter Property ID to assign:');
                    if (propertyId) {
                      handleAssignProperty(vendor.id, parseInt(propertyId), vendor.permissionScope);
                    }
                  }}
                  className="px-3 py-1 text-sm bg-obsidian text-porcelain rounded-lg hover:bg-obsidian-600 transition-colors"
                >
                  Assign Property
                </button>
              </div>
            </div>
          ))}
        </div>

        {vendors.length === 0 && !showCreateForm && (
          <div className="text-center py-12 bg-stone-100 rounded-2xl shadow-md">
            <p className="text-architectural text-lg mb-4">No vendors yet. Create one to get started.</p>
            <button
              onClick={() => setShowCreateForm(true)}
              className="px-6 py-3 bg-obsidian text-porcelain rounded-xl font-semibold hover:bg-obsidian-600 transition-colors"
            >
              Create Your First Vendor
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ManageVendors;

