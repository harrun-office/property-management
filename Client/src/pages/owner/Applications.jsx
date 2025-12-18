import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ownerAPI } from '../../services/api';

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
      <div className="min-h-screen bg-porcelain flex items-center justify-center">
        <p className="text-architectural text-lg">Loading applications...</p>
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

        {error && (
          <div className="mb-6 p-4 bg-error/20 border border-red-400 text-error rounded-lg">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Applications List */}
          <div className="lg:col-span-2">
            <div className="bg-stone-100 rounded-xl shadow-md p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-charcoal">All Applications</h2>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500"
                >
                  <option value="">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>

              {filteredApplications.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No applications found</p>
              ) : (
                <div className="space-y-4">
                  {filteredApplications.map((application) => (
                    <div
                      key={application.id}
                      className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                        selectedApplication?.id === application.id
                          ? 'border-slate-700 bg-slate-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => handleViewDetails(application.id)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold text-charcoal">
                              {application.applicant?.name || 'Unknown Applicant'}
                            </h3>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              application.status === 'pending' ? 'bg-warning/20 text-yellow-800' :
                              application.status === 'approved' ? 'bg-eucalyptus-100 text-green-800' :
                              'bg-error/20 text-red-800'
                            }`}>
                              {application.status}
                            </span>
                          </div>
                          <p className="text-sm text-architectural mb-1">
                            Property: {application.property?.title || `Property #${application.propertyId}`}
                          </p>
                          <p className="text-xs text-gray-500">
                            Applied: {new Date(application.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Application Details */}
          <div className="lg:col-span-1">
            {selectedApplication ? (
              <div className="bg-stone-100 rounded-xl shadow-md p-6 sticky top-4">
                <h2 className="text-xl font-semibold text-charcoal mb-4">Application Details</h2>
                
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-charcoal mb-2">Applicant Information</h3>
                    <div className="bg-porcelain p-3 rounded-lg space-y-1">
                      <p className="text-sm"><span className="font-medium">Name:</span> {selectedApplication.applicant?.name || 'N/A'}</p>
                      <p className="text-sm"><span className="font-medium">Email:</span> {selectedApplication.applicant?.email || 'N/A'}</p>
                      <p className="text-sm"><span className="font-medium">Phone:</span> {selectedApplication.applicant?.phone || 'N/A'}</p>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-charcoal mb-2">Property</h3>
                    <div className="bg-porcelain p-3 rounded-lg">
                      <p className="text-sm font-medium">{selectedApplication.property?.title}</p>
                      <p className="text-xs text-architectural">{selectedApplication.property?.address}</p>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-charcoal mb-2">Status</h3>
                    <select
                      value={selectedApplication.status}
                      onChange={(e) => handleStatusChange(selectedApplication.id, e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500"
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
                          <div key={index} className="bg-porcelain p-3 rounded-lg">
                            <p className="text-sm text-gray-700">{note.note}</p>
                            <p className="text-xs text-gray-500 mt-1">
                              {new Date(note.addedAt).toLocaleDateString()}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div>
                    <h3 className="font-semibold text-charcoal mb-2">Add Note</h3>
                    <textarea
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      placeholder="Add a note about this application..."
                      rows={3}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 mb-2"
                    />
                    <button
                      onClick={handleAddNote}
                      className="w-full px-4 py-2 bg-obsidian-500 text-white rounded-lg hover:bg-slate-800"
                    >
                      Add Note
                    </button>
                  </div>

                  <div className="flex space-x-2 pt-4 border-t">
                    <button
                      onClick={() => handleStatusChange(selectedApplication.id, 'approved')}
                      className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleStatusChange(selectedApplication.id, 'rejected')}
                      className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-stone-100 rounded-xl shadow-md p-6 text-center">
                <p className="text-gray-500">Select an application to view details</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Applications;

