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

  const handleCreate = async (e) => {
    e.preventDefault();
    setError('');

    try {
      await adminAPI.createPropertyManager(formData);
      setShowCreateForm(false);
      setFormData({ email: '', name: '', assignedProperties: [] });
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
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {showCreateForm && (
          <div className="bg-white rounded-2xl shadow-md p-6 mb-8">
            <h2 className="text-2xl font-bold mb-4 text-gray-900">Create Property Manager</h2>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="w-full p-3 border border-gray-300 rounded-xl"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  className="w-full p-3 border border-gray-300 rounded-xl"
                />
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
                      manager.status === 'active' ? 'bg-emerald-100 text-emerald-700' :
                      manager.status === 'suspended' ? 'bg-red-100 text-red-700' :
                      'bg-yellow-100 text-yellow-700'
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
                        className="px-3 py-1 text-sm bg-slate-700 text-white rounded-lg hover:bg-slate-800"
                      >
                        Assign Properties
                      </button>
                      {manager.status === 'active' && (
                        <button
                          onClick={() => handleSuspend(manager.id)}
                          className="px-3 py-1 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700"
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

