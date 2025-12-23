import { useState, useEffect } from 'react';
import { tenantAPI } from '../../services/api';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Modal from '../../components/ui/Modal';
import Skeleton from '../../components/ui/Skeleton';
import ErrorDisplay from '../../components/ui/ErrorDisplay';
import EmptyState from '../../components/ui/EmptyState';

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
      in_progress: 'bg-warning-100 text-warning-700',
      completed: 'bg-eucalyptus-100 text-eucalyptus-700',
      cancelled: 'bg-error-100 text-error-700'
    };
    return styles[status] || 'bg-stone-200 text-charcoal';
  };

  const getPriorityBadge = (priority) => {
    const styles = {
      low: 'bg-eucalyptus-100 text-eucalyptus-700',
      medium: 'bg-warning-100 text-warning-700',
      high: 'bg-error-100 text-error-700'
    };
    return styles[priority] || 'bg-stone-200 text-charcoal';
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
            <h1 className="text-4xl font-bold text-charcoal mb-2">Maintenance Requests</h1>
            <p className="text-architectural">Submit and track maintenance requests for your property</p>
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
            {showCreateForm ? 'Cancel' : 'New Request'}
          </Button>
        </div>

        {error && <ErrorDisplay message={error} onRetry={loadRequests} className="mb-6" />}

        {/* Create Form */}
        {showCreateForm && (
          <Card variant="elevated" padding="lg" className="mb-6">
            <Card.Title className="mb-4">Create Maintenance Request</Card.Title>
            <form onSubmit={handleCreateRequest} className="space-y-4">
              <Input
                label="Property ID"
                type="number"
                value={formData.propertyId}
                onChange={(e) => setFormData({ ...formData, propertyId: e.target.value })}
                required
              />
              <Input
                label="Title"
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g., Leaky faucet in kitchen"
                required
              />
              <div>
                <label className="block text-sm font-medium text-charcoal mb-1">
                  Description <span className="text-error-500">*</span>
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-2.5 border border-stone-300 rounded-lg bg-porcelain focus:ring-2 focus:ring-obsidian-500 focus:border-obsidian-500 transition-colors"
                  placeholder="Describe the issue in detail..."
                  required
                />
              </div>
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
              <Button
                type="submit"
                variant="primary"
                fullWidth
                loading={submitting}
              >
                Submit Request
              </Button>
            </form>
          </Card>
        )}

        {/* Filters */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-charcoal mb-1">Filter by Status</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-stone-300 rounded-lg bg-porcelain focus:ring-2 focus:ring-obsidian-500 focus:border-obsidian-500 transition-colors"
          >
            <option value="all">All Statuses</option>
            <option value="open">Open</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        {/* Requests List */}
        <Card variant="elevated" padding="none" className="overflow-hidden">
          {requests.length === 0 ? (
            <Card.Body className="p-8">
              <EmptyState
                title="No maintenance requests found"
                description="You haven't submitted any maintenance requests yet."
                icon={
                  <svg className="w-16 h-16 text-architectural" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                }
              />
            </Card.Body>
          ) : (
            <div className="divide-y divide-stone-200">
              {requests.map((request) => (
                <Card
                  key={request.id}
                  variant="filled"
                  padding="md"
                  hover
                  onClick={() => setSelectedRequest(request)}
                  className="cursor-pointer"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2 flex-wrap">
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
                </Card>
              ))}
            </div>
          )}
        </Card>

        {/* Request Details Modal */}
        <Modal
          isOpen={!!selectedRequest}
          onClose={() => setSelectedRequest(null)}
          title={selectedRequest?.title}
          size="lg"
        >
          {selectedRequest && (
            <div className="space-y-4">
              <div>
                <p className="text-architectural text-sm mb-1">Status</p>
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadge(selectedRequest.status)}`}>
                  {selectedRequest.status.replace('_', ' ')}
                </span>
              </div>
              <div>
                <p className="text-architectural text-sm mb-1">Priority</p>
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getPriorityBadge(selectedRequest.priority)}`}>
                  {selectedRequest.priority}
                </span>
              </div>
              <div>
                <p className="text-architectural text-sm mb-1">Description</p>
                <p className="text-charcoal">{selectedRequest.description}</p>
              </div>
              <div>
                <p className="text-architectural text-sm mb-1">Property</p>
                <p className="text-charcoal font-semibold">{selectedRequest.property?.title || 'N/A'}</p>
                <p className="text-sm text-architectural">{selectedRequest.property?.address}</p>
              </div>
              <div>
                <p className="text-architectural text-sm mb-1">Created</p>
                <p className="text-charcoal">{new Date(selectedRequest.createdAt).toLocaleString()}</p>
              </div>
              {selectedRequest.notes && selectedRequest.notes.length > 0 && (
                <div>
                  <p className="text-architectural text-sm mb-2">Notes</p>
                  <div className="space-y-2">
                    {selectedRequest.notes.map((note, idx) => (
                      <Card key={idx} variant="filled" padding="sm">
                        <p className="text-sm text-charcoal">{note.note}</p>
                        <p className="text-xs text-architectural mt-1">
                          {new Date(note.addedAt).toLocaleString()}
                        </p>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
              <div className="border-t border-stone-200 pt-4">
                <label className="block text-sm font-medium text-charcoal mb-1">Add Note</label>
                <div className="flex gap-2">
                  <textarea
                    value={noteText}
                    onChange={(e) => setNoteText(e.target.value)}
                    placeholder="Add a note or update..."
                    rows={3}
                    className="flex-1 px-3 py-2 border border-stone-300 rounded-lg bg-porcelain focus:ring-2 focus:ring-obsidian-500 focus:border-obsidian-500 transition-colors"
                  />
                  <Button
                    variant="primary"
                    onClick={handleAddNote}
                    disabled={!noteText.trim()}
                  >
                    Add
                  </Button>
                </div>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </div>
  );
}

export default TenantMaintenance;

