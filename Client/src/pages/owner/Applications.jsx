import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ownerAPI } from '../../services/api';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Skeleton from '../../components/ui/Skeleton';
import ErrorDisplay from '../../components/ui/ErrorDisplay';
import EmptyState from '../../components/ui/EmptyState';

function Applications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [note, setNote] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await ownerAPI.getApplications();
      setApplications(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (applicationId, newStatus) => {
    try {
      await ownerAPI.updateApplication(applicationId, { status: newStatus });
      loadApplications();
      if (selectedApplication && selectedApplication.id === applicationId) {
        const updated = await ownerAPI.getApplication(applicationId);
        setSelectedApplication(updated);
      }
    } catch (err) {
      alert(err.message);
    }
  };

  const handleViewDetails = async (applicationId) => {
    try {
      const application = await ownerAPI.getApplication(applicationId);
      setSelectedApplication(application);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleAddNote = async () => {
    if (!note.trim() || !selectedApplication) return;
    
    try {
      await ownerAPI.addApplicationNote(selectedApplication.id, note);
      setNote('');
      const updated = await ownerAPI.getApplication(selectedApplication.id);
      setSelectedApplication(updated);
      loadApplications();
    } catch (err) {
      alert(err.message);
    }
  };

  const filteredApplications = statusFilter
    ? applications.filter(a => a.status === statusFilter)
    : applications;

  if (loading) {
    return (
      <div className="min-h-screen bg-porcelain py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <Skeleton variant="title" width="30%" className="mb-2" />
            <Skeleton variant="text" width="50%" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {[1, 2, 3].map((i) => (
                <Skeleton.Card key={i} />
              ))}
            </div>
            <Skeleton.Card />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-porcelain py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-charcoal mb-2">Applications</h1>
          <p className="text-architectural">Review and manage property applications</p>
        </div>

        {error && <ErrorDisplay message={error} onRetry={loadApplications} className="mb-6" />}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Applications List */}
          <div className="lg:col-span-2">
            <Card variant="elevated" padding="lg" className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <Card.Title>All Applications</Card.Title>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 border border-stone-300 rounded-lg bg-porcelain focus:ring-2 focus:ring-obsidian-500 focus:border-obsidian-500 transition-colors"
                >
                  <option value="">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>

              {filteredApplications.length === 0 ? (
                <EmptyState
                  title="No applications found"
                  description="There are no applications matching your filters."
                  icon={
                    <svg className="w-16 h-16 text-architectural" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  }
                />
              ) : (
                <div className="space-y-3">
                  {filteredApplications.map((application) => (
                    <Card
                      key={application.id}
                      variant={selectedApplication?.id === application.id ? "outlined" : "filled"}
                      padding="md"
                      hover
                      onClick={() => handleViewDetails(application.id)}
                      className={`cursor-pointer ${
                        selectedApplication?.id === application.id
                          ? 'border-obsidian-500 bg-obsidian-50'
                          : ''
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold text-charcoal">
                              {application.applicant?.name || 'Unknown Applicant'}
                            </h3>
                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                              application.status === 'pending' ? 'bg-warning-100 text-warning-700' :
                              application.status === 'approved' ? 'bg-eucalyptus-100 text-eucalyptus-700' :
                              'bg-error-100 text-error-700'
                            }`}>
                              {application.status}
                            </span>
                          </div>
                          <p className="text-sm text-architectural mb-1">
                            Property: {application.property?.title || `Property #${application.propertyId}`}
                          </p>
                          <p className="text-xs text-architectural">
                            Applied: {new Date(application.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </Card>
          </div>

          {/* Application Details */}
          <div className="lg:col-span-1">
            {selectedApplication ? (
              <Card variant="elevated" padding="lg" className="sticky top-4">
                <Card.Title className="mb-4">Application Details</Card.Title>
                
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-charcoal mb-2">Applicant Information</h3>
                    <Card variant="filled" padding="sm">
                      <div className="space-y-1">
                        <p className="text-sm"><span className="font-medium">Name:</span> {selectedApplication.applicant?.name || 'N/A'}</p>
                        <p className="text-sm"><span className="font-medium">Email:</span> {selectedApplication.applicant?.email || 'N/A'}</p>
                        <p className="text-sm"><span className="font-medium">Phone:</span> {selectedApplication.applicant?.phone || 'N/A'}</p>
                      </div>
                    </Card>
                  </div>

                  <div>
                    <h3 className="font-semibold text-charcoal mb-2">Property</h3>
                    <Card variant="filled" padding="sm">
                      <p className="text-sm font-medium">{selectedApplication.property?.title}</p>
                      <p className="text-xs text-architectural">{selectedApplication.property?.address}</p>
                    </Card>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-charcoal mb-1">Status</label>
                    <select
                      value={selectedApplication.status}
                      onChange={(e) => handleStatusChange(selectedApplication.id, e.target.value)}
                      className="w-full p-2 border border-stone-300 rounded-lg bg-porcelain focus:ring-2 focus:ring-obsidian-500 focus:border-obsidian-500 transition-colors"
                    >
                      <option value="pending">Pending</option>
                      <option value="approved">Approved</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </div>

                  <div>
                    <h3 className="font-semibold text-charcoal mb-2">Application Date</h3>
                    <p className="text-sm text-architectural">
                      {new Date(selectedApplication.createdAt).toLocaleString()}
                    </p>
                  </div>

                  {selectedApplication.notes && selectedApplication.notes.length > 0 && (
                    <div>
                      <h3 className="font-semibold text-charcoal mb-2">Notes</h3>
                      <div className="space-y-2">
                        {selectedApplication.notes.map((note, index) => (
                          <Card key={index} variant="filled" padding="sm">
                            <p className="text-sm text-charcoal">{note.note}</p>
                            <p className="text-xs text-architectural mt-1">
                              {new Date(note.addedAt).toLocaleDateString()}
                            </p>
                          </Card>
                        ))}
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-charcoal mb-1">Add Note</label>
                    <textarea
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      placeholder="Add a note about this application..."
                      rows={3}
                      className="w-full p-2 border border-stone-300 rounded-lg bg-porcelain focus:ring-2 focus:ring-obsidian-500 focus:border-obsidian-500 transition-colors mb-2"
                    />
                    <Button
                      variant="primary"
                      fullWidth
                      onClick={handleAddNote}
                    >
                      Add Note
                    </Button>
                  </div>

                  <div className="flex gap-2 pt-4 border-t border-stone-200">
                    <Button
                      variant="success"
                      fullWidth
                      onClick={() => handleStatusChange(selectedApplication.id, 'approved')}
                    >
                      Approve
                    </Button>
                    <Button
                      variant="danger"
                      fullWidth
                      onClick={() => handleStatusChange(selectedApplication.id, 'rejected')}
                    >
                      Reject
                    </Button>
                  </div>
                </div>
              </Card>
            ) : (
              <Card variant="elevated" padding="lg" className="text-center">
                <p className="text-architectural">Select an application to view details</p>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Applications;

