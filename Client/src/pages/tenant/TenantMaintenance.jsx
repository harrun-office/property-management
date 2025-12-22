import { useState, useEffect } from 'react';
import { tenantAPI } from '../../services/api';

function TenantMaintenance() {
  const [requests, setRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');
  const [formData, setFormData] = useState({
    propertyId: '',
    title: '',
    description: '',
    priority: 'medium',
    photos: []
  });
  const [noteText, setNoteText] = useState('');

  useEffect(() => {
    loadRequests();
  }, [statusFilter]);

  const loadRequests = async () => {
    setLoading(true);
    setError('');
    try {
      const params = statusFilter !== 'all' ? { status: statusFilter } : {};
      const data = await tenantAPI.getMaintenance(params);
      setRequests(data);
    } catch (err) {
      setError(err.message || 'Failed to load maintenance requests');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRequest = async (e) => {
    e.preventDefault();
    if (!formData.propertyId || !formData.title || !formData.description) {
      setError('Please fill in all required fields');
      return;
    }

    setSubmitting(true);
    setError('');
    try {
      await tenantAPI.createMaintenance(formData);
      setFormData({ propertyId: '', title: '', description: '', priority: 'medium', photos: [] });
      setShowCreateForm(false);
      await loadRequests();
      alert('Maintenance request submitted successfully!');
    } catch (err) {
      setError(err.message || 'Failed to create maintenance request');
    } finally {
      setSubmitting(false);
    }
  };

  const handleAddNote = async () => {
    if (!noteText.trim() || !selectedRequest) return;

    try {
      await tenantAPI.updateMaintenance(selectedRequest.id, { note: noteText });
      setNoteText('');
      await loadRequests();
      if (selectedRequest) {
        const updated = await tenantAPI.getMaintenanceById(selectedRequest.id);
        setSelectedRequest(updated);
      }
    } catch (err) {
      setError(err.message || 'Failed to add note');
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      open: 'bg-architectural/20 text-architectural',
      in_progress: 'bg-warning/20 text-warning',
      completed: 'bg-eucalyptus/20 text-eucalyptus',
      cancelled: 'bg-error/20 text-error'
    };
    return styles[status] || 'bg-stone-200 text-charcoal';
  };

  const getPriorityBadge = (priority) => {
    const styles = {
      low: 'bg-eucalyptus/20 text-eucalyptus',
      medium: 'bg-warning/20 text-warning',
      high: 'bg-error/20 text-error'
    };
    return styles[priority] || 'bg-stone-200 text-charcoal';
  };

  return (
    <div className="min-h-screen bg-porcelain py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-charcoal mb-2">Maintenance Requests</h1>
            <p className="text-architectural">Submit and track maintenance requests for your property</p>
          </div>
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="px-6 py-2 bg-obsidian text-porcelain rounded-lg hover:bg-obsidian-light transition-colors font-semibold"
          >
            {showCreateForm ? 'Cancel' : '+ New Request'}
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-error/20 border border-error text-error rounded-lg">
            {error}
          </div>
        )}

        {/* Create Form */}
        {showCreateForm && (
          <div className="bg-stone-100 rounded-xl shadow-md p-6 border border-stone-200 mb-6">
            <h2 className="text-2xl font-bold text-charcoal mb-4">Create Maintenance Request</h2>
            <form onSubmit={handleCreateRequest} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-charcoal mb-1">
                  Property ID <span className="text-error">*</span>
                </label>
                <input
                  type="number"
                  value={formData.propertyId}
                  onChange={(e) => setFormData({ ...formData, propertyId: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg bg-porcelain focus:ring-2 focus:ring-obsidian focus:border-obsidian"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-charcoal mb-1">
                  Title <span className="text-error">*</span>
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg bg-porcelain focus:ring-2 focus:ring-obsidian focus:border-obsidian"
                  placeholder="e.g., Leaky faucet in kitchen"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-charcoal mb-1">
                  Description <span className="text-error">*</span>
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                  className="w-full px-3 py-2 border rounded-lg bg-porcelain focus:ring-2 focus:ring-obsidian focus:border-obsidian"
                  placeholder="Describe the issue in detail..."
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-charcoal mb-1">Priority</label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg bg-porcelain focus:ring-2 focus:ring-obsidian focus:border-obsidian"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-2 bg-obsidian text-porcelain rounded-lg hover:bg-obsidian-light transition-colors disabled:opacity-50"
              >
                {submitting ? 'Submitting...' : 'Submit Request'}
              </button>
            </form>
          </div>
        )}

        {/* Filters */}
        <div className="mb-6">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border rounded-lg bg-porcelain focus:ring-2 focus:ring-obsidian focus:border-obsidian"
          >
            <option value="all">All Statuses</option>
            <option value="open">Open</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        {/* Requests List */}
        <div className="bg-stone-100 rounded-xl shadow-md overflow-hidden border border-stone-200">
          {loading ? (
            <div className="p-8 text-center text-architectural">Loading requests...</div>
          ) : requests.length === 0 ? (
            <div className="p-8 text-center text-architectural">No maintenance requests found</div>
          ) : (
            <div className="divide-y divide-stone-200">
              {requests.map((request) => (
                <div
                  key={request.id}
                  className="p-6 hover:bg-stone-50 transition-colors cursor-pointer"
                  onClick={() => setSelectedRequest(request)}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-charcoal">{request.title}</h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadge(request.status)}`}>
                          {request.status.replace('_', ' ')}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getPriorityBadge(request.priority)}`}>
                          {request.priority}
                        </span>
                      </div>
                      <p className="text-sm text-architectural mb-2">{request.description}</p>
                      <div className="flex flex-wrap gap-4 text-xs text-architectural">
                        <span>{request.property?.title || 'Property'}</span>
                        <span>Created: {new Date(request.createdAt).toLocaleDateString()}</span>
                        {request.notes && request.notes.length > 0 && (
                          <span>{request.notes.length} note(s)</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Request Details Modal */}
        {selectedRequest && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setSelectedRequest(null)}>
            <div className="bg-porcelain rounded-xl shadow-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6" onClick={(e) => e.stopPropagation()}>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-charcoal">{selectedRequest.title}</h2>
                <button
                  onClick={() => setSelectedRequest(null)}
                  className="text-architectural hover:text-charcoal"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <p className="text-architectural text-sm">Status</p>
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadge(selectedRequest.status)}`}>
                    {selectedRequest.status.replace('_', ' ')}
                  </span>
                </div>
                <div>
                  <p className="text-architectural text-sm">Priority</p>
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getPriorityBadge(selectedRequest.priority)}`}>
                    {selectedRequest.priority}
                  </span>
                </div>
                <div>
                  <p className="text-architectural text-sm">Description</p>
                  <p className="text-charcoal">{selectedRequest.description}</p>
                </div>
                <div>
                  <p className="text-architectural text-sm">Property</p>
                  <p className="text-charcoal font-semibold">{selectedRequest.property?.title || 'N/A'}</p>
                  <p className="text-sm text-architectural">{selectedRequest.property?.address}</p>
                </div>
                <div>
                  <p className="text-architectural text-sm">Created</p>
                  <p className="text-charcoal">{new Date(selectedRequest.createdAt).toLocaleString()}</p>
                </div>
                {selectedRequest.notes && selectedRequest.notes.length > 0 && (
                  <div>
                    <p className="text-architectural text-sm mb-2">Notes</p>
                    <div className="space-y-2">
                      {selectedRequest.notes.map((note, idx) => (
                        <div key={idx} className="bg-stone-100 p-3 rounded-lg">
                          <p className="text-sm text-charcoal">{note.note}</p>
                          <p className="text-xs text-architectural mt-1">
                            {new Date(note.addedAt).toLocaleString()}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                <div className="border-t border-stone-200 pt-4">
                  <p className="text-architectural text-sm mb-2">Add Note</p>
                  <div className="flex gap-2">
                    <textarea
                      value={noteText}
                      onChange={(e) => setNoteText(e.target.value)}
                      placeholder="Add a note or update..."
                      rows={3}
                      className="flex-1 px-3 py-2 border rounded-lg bg-porcelain focus:ring-2 focus:ring-obsidian focus:border-obsidian"
                    />
                    <button
                      onClick={handleAddNote}
                      disabled={!noteText.trim()}
                      className="px-4 py-2 bg-obsidian text-porcelain rounded-lg hover:bg-obsidian-light transition-colors disabled:opacity-50"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default TenantMaintenance;

