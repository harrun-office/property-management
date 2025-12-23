import { useState, useEffect } from 'react';
import { propertyManagerAPI } from '../../services/api';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Skeleton from '../../components/ui/Skeleton';
import ErrorDisplay from '../../components/ui/ErrorDisplay';
import EmptyState from '../../components/ui/EmptyState';

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
      <div className="min-h-screen bg-porcelain py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <Skeleton variant="title" width="40%" className="mb-2" />
            <Skeleton variant="text" width="60%" />
          </div>
          <div className="space-y-4">
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
            <h1 className="text-4xl font-bold text-charcoal mb-2">Task Management</h1>
            <p className="text-architectural">Create and manage tasks for vendors</p>
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
            {showCreateForm ? 'Cancel' : 'Create Task'}
          </Button>
        </div>

        {error && <ErrorDisplay message={error} onRetry={loadData} className="mb-6" />}

        {showCreateForm && (
          <Card variant="elevated" padding="lg" className="mb-8">
            <Card.Title className="mb-4">Create Task</Card.Title>
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-1">Property <span className="text-error-500">*</span></label>
                  <select
                    value={formData.propertyId}
                    onChange={(e) => setFormData({ ...formData, propertyId: e.target.value })}
                    required
                    className="w-full px-4 py-2.5 border border-stone-300 rounded-lg bg-porcelain focus:ring-2 focus:ring-obsidian-500 focus:border-obsidian-500 transition-colors"
                  >
                    <option value="">Select Property</option>
                    {properties.map((p) => (
                      <option key={p.id} value={p.id}>{p.title}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-1">Assign to Vendor <span className="text-error-500">*</span></label>
                  <select
                    value={formData.assignedVendorId}
                    onChange={(e) => setFormData({ ...formData, assignedVendorId: e.target.value })}
                    required
                    className="w-full px-4 py-2.5 border border-stone-300 rounded-lg bg-porcelain focus:ring-2 focus:ring-obsidian-500 focus:border-obsidian-500 transition-colors"
                  >
                    <option value="">Select Vendor</option>
                    {vendors.map((v) => (
                      <option key={v.id} value={v.userId}>{v.companyName}</option>
                    ))}
                  </select>
                </div>
              </div>
              <Input
                label="Title"
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
              <div>
                <label className="block text-sm font-medium text-charcoal mb-1">Description <span className="text-error-500">*</span></label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                  rows={4}
                  className="w-full px-4 py-2.5 border border-stone-300 rounded-lg bg-porcelain focus:ring-2 focus:ring-obsidian-500 focus:border-obsidian-500 transition-colors"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-1">Priority</label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                    className="w-full px-4 py-2.5 border border-stone-300 rounded-lg bg-porcelain focus:ring-2 focus:ring-obsidian-500 focus:border-obsidian-500 transition-colors"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
                <Input
                  label="Due Date"
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                />
              </div>
              <Button type="submit" variant="primary" fullWidth>
                Create Task
              </Button>
            </form>
          </Card>
        )}

        {tasks.length === 0 && !showCreateForm ? (
          <EmptyState
            title="No tasks yet"
            description="Create your first task to get started with task management."
            action={
              <Button variant="primary" onClick={() => setShowCreateForm(true)}>
                Create Your First Task
              </Button>
            }
            icon={
              <svg className="w-16 h-16 text-architectural" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            }
          />
        ) : (
          <div className="space-y-4">
            {tasks.map((task) => (
              <Card key={task.id} variant="elevated" padding="lg">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <Card.Title className="text-xl mb-2">{task.title}</Card.Title>
                    <Card.Description className="mb-2">{task.description}</Card.Description>
                    <div className="flex items-center gap-4 text-sm text-architectural flex-wrap">
                      <span>Property: {getPropertyTitle(task.propertyId)}</span>
                      <span>Vendor: {getVendorName(task.assignedVendorId)}</span>
                      {task.dueDate && (
                        <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      task.priority === 'high' ? 'bg-error-100 text-error-700' :
                      task.priority === 'medium' ? 'bg-warning-100 text-warning-700' :
                      'bg-stone-200 text-charcoal'
                    }`}>
                      {task.priority}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      task.status === 'completed' ? 'bg-eucalyptus-100 text-eucalyptus-700' :
                      task.status === 'in_progress' ? 'bg-obsidian-100 text-obsidian-700' :
                      'bg-warning-100 text-warning-700'
                    }`}>
                      {task.status}
                    </span>
                  </div>
                </div>
                {task.attachments && task.attachments.length > 0 && (
                  <Card.Footer className="mt-4 pt-4 border-t border-stone-200">
                    <p className="text-sm font-medium text-charcoal mb-2">Attachments:</p>
                    <div className="flex flex-wrap gap-2">
                      {task.attachments.map((att, idx) => (
                        <a
                          key={idx}
                          href={att.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1 bg-stone-100 text-charcoal rounded-lg text-sm hover:bg-stone-200 transition-colors"
                        >
                          {att.fileName || att.type}
                        </a>
                      ))}
                    </div>
                  </Card.Footer>
                )}
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default TaskManagement;

