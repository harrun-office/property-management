import { useState, useEffect } from 'react';
import { propertyManagerAPI } from '../../services/api';

function TaskManagement() {
  const [tasks, setTasks] = useState([]);
  const [properties, setProperties] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    propertyId: '',
    assignedVendorId: '',
    title: '',
    description: '',
    priority: 'medium',
    dueDate: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError('');
    try {
      const [tasksData, propertiesData, vendorsData] = await Promise.all([
        propertyManagerAPI.getTasks(),
        propertyManagerAPI.getProperties(),
        propertyManagerAPI.getVendors()
      ]);
      setTasks(tasksData);
      setProperties(propertiesData);
      setVendors(vendorsData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.propertyId || !formData.assignedVendorId || !formData.title || !formData.description) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      await propertyManagerAPI.createTask(formData);
      setShowCreateForm(false);
      setFormData({
        propertyId: '',
        assignedVendorId: '',
        title: '',
        description: '',
        priority: 'medium',
        dueDate: ''
      });
      loadData();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleUpdate = async (taskId, updates) => {
    try {
      await propertyManagerAPI.updateTask(taskId, updates);
      loadData();
    } catch (err) {
      setError(err.message);
    }
  };

  const getPropertyTitle = (propertyId) => {
    const property = properties.find(p => p.id === propertyId);
    return property ? property.title : `Property #${propertyId}`;
  };

  const getVendorName = (vendorId) => {
    const vendor = vendors.find(v => v.userId === vendorId);
    return vendor ? vendor.companyName : `Vendor #${vendorId}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Loading tasks...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Task Management</h1>
            <p className="text-gray-600">Create and manage tasks for vendors</p>
          </div>
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="px-6 py-3 bg-slate-700 text-white rounded-xl font-semibold hover:bg-slate-800 transition-colors"
          >
            {showCreateForm ? 'Cancel' : '+ Create Task'}
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-error/20 border border-error text-error rounded-lg">
            {error}
          </div>
        )}

        {showCreateForm && (
          <div className="bg-white rounded-2xl shadow-md p-6 mb-8">
            <h2 className="text-2xl font-bold mb-4 text-gray-900">Create Task</h2>
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Property *</label>
                  <select
                    value={formData.propertyId}
                    onChange={(e) => setFormData({ ...formData, propertyId: e.target.value })}
                    required
                    className="w-full p-3 border border-gray-300 rounded-xl"
                  >
                    <option value="">Select Property</option>
                    {properties.map((p) => (
                      <option key={p.id} value={p.id}>{p.title}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Assign to Vendor *</label>
                  <select
                    value={formData.assignedVendorId}
                    onChange={(e) => setFormData({ ...formData, assignedVendorId: e.target.value })}
                    required
                    className="w-full p-3 border border-gray-300 rounded-xl"
                  >
                    <option value="">Select Vendor</option>
                    {vendors.map((v) => (
                      <option key={v.id} value={v.userId}>{v.companyName}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  className="w-full p-3 border border-gray-300 rounded-xl"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                  rows={4}
                  className="w-full p-3 border border-gray-300 rounded-xl"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-xl"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                  <input
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-xl"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="px-6 py-3 bg-slate-700 text-white rounded-xl font-semibold hover:bg-slate-800 transition-colors"
              >
                Create Task
              </button>
            </form>
          </div>
        )}

        <div className="space-y-4">
          {tasks.map((task) => (
            <div key={task.id} className="bg-white rounded-2xl shadow-md p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{task.title}</h3>
                  <p className="text-gray-600 mb-2">{task.description}</p>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span>Property: {getPropertyTitle(task.propertyId)}</span>
                    <span>Vendor: {getVendorName(task.assignedVendorId)}</span>
                    {task.dueDate && (
                      <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    task.priority === 'high' ? 'bg-red-100 text-red-700' :
                    task.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {task.priority}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    task.status === 'completed' ? 'bg-emerald-100 text-emerald-700' :
                    task.status === 'in_progress' ? 'bg-blue-100 text-blue-700' :
                    'bg-yellow-100 text-yellow-700'
                  }`}>
                    {task.status}
                  </span>
                </div>
              </div>
              {task.attachments && task.attachments.length > 0 && (
                <div className="mt-4 pt-4 border-t">
                  <p className="text-sm font-medium text-gray-700 mb-2">Attachments:</p>
                  <div className="flex flex-wrap gap-2">
                    {task.attachments.map((att, idx) => (
                      <a
                        key={idx}
                        href={att.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200"
                      >
                        {att.fileName || att.type}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {tasks.length === 0 && !showCreateForm && (
          <div className="text-center py-12 bg-white rounded-2xl shadow-md">
            <p className="text-gray-600 text-lg mb-4">No tasks yet. Create one to get started.</p>
            <button
              onClick={() => setShowCreateForm(true)}
              className="px-6 py-3 bg-slate-700 text-white rounded-xl font-semibold hover:bg-slate-800"
            >
              Create Your First Task
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default TaskManagement;

