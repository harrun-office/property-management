import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { adminAPI } from '../../services/api';

function ApplicationsManagement() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState({
    status: searchParams.get('status') || '',
    search: ''
  });
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    loadApplications();
  }, [filters]);

  const loadApplications = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await adminAPI.getAllApplications(filters);
      setApplications(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
    if (name === 'status') {
      setSearchParams({ status: value });
    }
  };

  const handleViewDetails = async (applicationId) => {
    try {
      const application = await adminAPI.getApplicationById(applicationId);
      setSelectedApplication(application);
      setShowModal(true);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleUpdateStatus = async (applicationId, newStatus) => {
    try {
      await adminAPI.updateApplication(applicationId, { status: newStatus });
      loadApplications();
      setShowModal(false);
    } catch (err) {
      setError(err.message);
    }
  };

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'approved':
        return 'bg-eucalyptus/20 text-eucalyptus';
      case 'rejected':
        return 'bg-error/20 text-error';
      case 'pending':
        return 'bg-warning/20 text-warning';
      case 'under_review':
        return 'bg-obsidian/20 text-obsidian';
      default:
        return 'bg-stone-200 text-charcoal';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-porcelain flex items-center justify-center">
        <p className="text-architectural">Loading applications...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-porcelain py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-charcoal mb-2">Applications Management</h1>
          <p className="text-architectural">Review and manage tenant applications</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-error/20 border border-error text-error rounded-lg">
            {error}
          </div>
        )}

        {/* Filters */}
        <div className="bg-stone-100 rounded-2xl shadow-md p-6 mb-6 border border-stone-200">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-charcoal mb-2">Search</label>
              <input
                type="text"
                name="search"
                value={filters.search}
                onChange={handleFilterChange}
                placeholder="Search by tenant name or property..."
                className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-obsidian focus:border-obsidian bg-porcelain text-charcoal"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-charcoal mb-2">Status</label>
              <select
                name="status"
                value={filters.status}
                onChange={handleFilterChange}
                className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-obsidian focus:border-obsidian bg-porcelain text-charcoal"
              >
                <option value="">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="under_review">Under Review</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>
        </div>

        {/* Applications Table */}
        <div className="bg-stone-100 rounded-2xl shadow-md border border-stone-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-obsidian text-porcelain">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Tenant</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Property</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Applied Date</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-porcelain divide-y divide-stone-200">
                {applications.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-8 text-center text-architectural">
                      No applications found
                    </td>
                  </tr>
                ) : (
                  applications.map((application) => (
                    <tr key={application.id} className="hover:bg-stone-50 transition-colors">
                      <td className="px-6 py-4 text-sm text-charcoal font-medium">
                        {application.tenant?.name || 'N/A'}
                      </td>
                      <td className="px-6 py-4 text-sm text-architectural">
                        {application.property?.title || application.property?.address || 'N/A'}
                      </td>
                      <td className="px-6 py-4 text-sm text-architectural">
                        {application.appliedAt ? new Date(application.appliedAt).toLocaleDateString() : 'N/A'}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadgeColor(application.status)}`}>
                          {application.status || 'pending'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleViewDetails(application.id)}
                          className="px-3 py-1 text-sm bg-obsidian text-porcelain rounded-lg hover:bg-obsidian-light transition-colors"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Application Details Modal */}
        {showModal && selectedApplication && (
          <div className="fixed inset-0 bg-charcoal/50 flex items-center justify-center z-50 p-4">
            <div className="bg-porcelain rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-stone-200">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-charcoal">Application Details</h2>
                  <button
                    onClick={() => setShowModal(false)}
                    className="text-architectural hover:text-charcoal transition-colors"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-architectural mb-1">Tenant</label>
                  <p className="text-charcoal font-medium">{selectedApplication.tenant?.name || 'N/A'}</p>
                  <p className="text-sm text-architectural">{selectedApplication.tenant?.email || ''}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-architectural mb-1">Property</label>
                  <p className="text-charcoal font-medium">{selectedApplication.property?.title || 'N/A'}</p>
                  <p className="text-sm text-architectural">{selectedApplication.property?.address || ''}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-architectural mb-1">Status</label>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium inline-block ${getStatusBadgeColor(selectedApplication.status)}`}>
                    {selectedApplication.status || 'pending'}
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-architectural mb-1">Applied Date</label>
                  <p className="text-charcoal">
                    {selectedApplication.appliedAt ? new Date(selectedApplication.appliedAt).toLocaleString() : 'N/A'}
                  </p>
                </div>
                {selectedApplication.message && (
                  <div>
                    <label className="block text-sm font-medium text-architectural mb-1">Message</label>
                    <p className="text-charcoal">{selectedApplication.message}</p>
                  </div>
                )}
                <div className="pt-4 border-t border-stone-200">
                  <h3 className="text-lg font-semibold text-charcoal mb-3">Update Status</h3>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleUpdateStatus(selectedApplication.id, 'approved')}
                      className="px-4 py-2 bg-eucalyptus text-porcelain rounded-lg hover:bg-eucalyptus/90 transition-colors font-semibold"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleUpdateStatus(selectedApplication.id, 'rejected')}
                      className="px-4 py-2 bg-error text-porcelain rounded-lg hover:bg-error/90 transition-colors font-semibold"
                    >
                      Reject
                    </button>
                    <button
                      onClick={() => handleUpdateStatus(selectedApplication.id, 'under_review')}
                      className="px-4 py-2 bg-obsidian text-porcelain rounded-lg hover:bg-obsidian-light transition-colors font-semibold"
                    >
                      Under Review
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

export default ApplicationsManagement;

