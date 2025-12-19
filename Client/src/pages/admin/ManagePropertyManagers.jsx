import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminAPI, propertiesAPI } from '../../services/api';

function ManagePropertyManagers() {
  const navigate = useNavigate();
  const [managers, setManagers] = useState([]);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    assignedProperties: []
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError('');
    try {
      const [managersData, propertiesData] = await Promise.all([
        adminAPI.getPropertyManagers(),
        propertiesAPI.getAll()
      ]);
      setManagers(managersData);
      setProperties(propertiesData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const validateField = (name, value) => {
    let error = '';
    
    switch (name) {
      case 'name':
        if (!value.trim()) {
          error = 'Name is required';
        } else if (value.trim().length < 2) {
          error = 'Name must be at least 2 characters';
        } else if (!/^[a-zA-Z\s'-]+$/.test(value.trim())) {
          error = 'Name can only contain letters, spaces, hyphens, and apostrophes';
        }
        break;
      case 'email':
        if (!value.trim()) {
          error = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) {
          error = 'Please enter a valid email address';
        }
        break;
      default:
        break;
    }
    
    return error;
  };

  const handleFieldChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Validate on change if field has been touched
    if (touched[name]) {
      const error = validateField(name, value);
      setErrors({
        ...errors,
        [name]: error
      });
    }
  };

  const handleFieldBlur = (name, value) => {
    setTouched({
      ...touched,
      [name]: true
    });
    
    const error = validateField(name, value);
    setErrors({
      ...errors,
      [name]: error
    });
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setError('');
    
    // Mark all fields as touched
    setTouched({ name: true, email: true });
    
    // Validate all fields
    const newErrors = {
      name: validateField('name', formData.name),
      email: validateField('email', formData.email)
    };
    
    setErrors(newErrors);
    
    // Check if there are any errors
    if (Object.values(newErrors).some(err => err)) {
      setError('Please fix the errors in the form');
      return;
    }

    try {
      await adminAPI.createPropertyManager(formData);
      setShowCreateForm(false);
      setFormData({ email: '', name: '', assignedProperties: [] });
      setErrors({});
      setTouched({});
      loadData();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSuspend = async (id) => {
    if (!window.confirm('Are you sure you want to suspend this property manager?')) {
      return;
    }

    try {
      await adminAPI.suspendPropertyManager(id);
      loadData();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleAssignProperties = async (managerId, propertyIds) => {
    try {
      await adminAPI.assignProperties(managerId, propertyIds);
      loadData();
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Manage Property Managers</h1>
            <p className="text-gray-600">Create and manage property managers</p>
          </div>
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="px-6 py-3 bg-slate-700 text-white rounded-xl font-semibold hover:bg-slate-800 transition-colors"
          >
            {showCreateForm ? 'Cancel' : '+ Create Property Manager'}
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-error/20 border border-error text-error rounded-lg">
            {error}
          </div>
        )}

        {showCreateForm && (
          <div className="bg-white rounded-2xl shadow-md p-6 mb-8">
            <h2 className="text-2xl font-bold mb-4 text-gray-900">Create Property Manager</h2>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-charcoal mb-1">Name <span className="text-error">*</span></label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleFieldChange('name', e.target.value)}
                  onBlur={(e) => handleFieldBlur('name', e.target.value)}
                  required
                  className={`w-full p-3 border rounded-xl focus:ring-2 focus:ring-obsidian focus:border-obsidian bg-porcelain ${
                    errors.name ? 'border-error' : 'border-stone-300'
                  }`}
                />
                {errors.name && touched.name && (
                  <p className="mt-1 text-sm text-error">{errors.name}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-charcoal mb-1">Email <span className="text-error">*</span></label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleFieldChange('email', e.target.value)}
                  onBlur={(e) => handleFieldBlur('email', e.target.value)}
                  required
                  className={`w-full p-3 border rounded-xl focus:ring-2 focus:ring-obsidian focus:border-obsidian bg-porcelain ${
                    errors.email ? 'border-error' : 'border-stone-300'
                  }`}
                />
                {errors.email && touched.email && (
                  <p className="mt-1 text-sm text-error">{errors.email}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Assign Properties</label>
                <div className="space-y-2 max-h-40 overflow-y-auto border border-gray-300 rounded-xl p-3">
                  {properties.map((property) => (
                    <label key={property.id} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={formData.assignedProperties.includes(property.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFormData({
                              ...formData,
                              assignedProperties: [...formData.assignedProperties, property.id]
                            });
                          } else {
                            setFormData({
                              ...formData,
                              assignedProperties: formData.assignedProperties.filter(id => id !== property.id)
                            });
                          }
                        }}
                      />
                      <span className="text-sm text-gray-700">{property.title}</span>
                    </label>
                  ))}
                </div>
              </div>
              <button
                type="submit"
                className="px-6 py-3 bg-slate-700 text-white rounded-xl font-semibold hover:bg-slate-800 transition-colors"
              >
                Create & Send Invitation
              </button>
            </form>
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-md overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Properties</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {managers.map((manager) => (
                <tr key={manager.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900">{manager.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-600">{manager.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      manager.status === 'active' ? 'bg-eucalyptus/20 text-eucalyptus' :
                      manager.status === 'suspended' ? 'bg-error/20 text-error' :
                      'bg-warning/20 text-warning'
                    }`}>
                      {manager.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                    {manager.assignedProperties?.length || 0}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => {
                          const selectedProperties = prompt('Enter property IDs (comma-separated):', manager.assignedProperties?.join(',') || '');
                          if (selectedProperties) {
                            const propertyIds = selectedProperties.split(',').map(id => parseInt(id.trim())).filter(id => !isNaN(id));
                            handleAssignProperties(manager.id, propertyIds);
                          }
                        }}
                        className="px-3 py-1 text-sm bg-obsidian text-porcelain rounded-lg hover:bg-obsidian-600 transition-colors"
                      >
                        Assign Properties
                      </button>
                      {manager.status === 'active' && (
                        <button
                          onClick={() => handleSuspend(manager.id)}
                          className="px-3 py-1 text-sm bg-error text-porcelain rounded-lg hover:opacity-90 transition-colors"
                        >
                          Suspend
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default ManagePropertyManagers;

