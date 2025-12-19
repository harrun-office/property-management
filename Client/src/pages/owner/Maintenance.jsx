import { useState, useEffect } from 'react';
import { ownerAPI } from '../../services/api';

function Maintenance() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await ownerAPI.getMaintenance();
      setRequests(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await ownerAPI.updateMaintenance(id, { status: newStatus });
      loadRequests();
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-porcelain flex items-center justify-center">
        <p className="text-architectural text-lg">Loading maintenance requests...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-porcelain py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-charcoal mb-2">Maintenance Requests</h1>
          <p className="text-architectural">Manage property maintenance issues</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-error/20 border border-error text-error rounded-lg">
            {error}
          </div>
        )}

        {requests.length === 0 ? (
          <div className="bg-stone-100 rounded-xl shadow-md p-12 text-center">
            <p className="text-gray-500 text-lg">No maintenance requests yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {requests.map((request) => (
              <div key={request.id} className="bg-stone-100 rounded-xl shadow-md p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-charcoal mb-1">
                      {request.property?.title || `Property #${request.propertyId}`}
                    </h3>
                    <p className="text-sm text-architectural mb-2">{request.description}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span>Tenant: {request.tenant?.name || 'N/A'}</span>
                      <span>Priority: 
                        <span className={`ml-1 px-2 py-1 rounded-full text-xs ${
                          request.priority === 'urgent' ? 'bg-error/20 text-error' :
                          request.priority === 'high' ? 'bg-warning/20 text-warning' :
                          request.priority === 'medium' ? 'bg-brass/20 text-brass' :
                          'bg-obsidian/20 text-obsidian-500'
                        }`}>
                          {request.priority}
                        </span>
                      </span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <select
                      value={request.status}
                      onChange={(e) => handleStatusChange(request.id, e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500"
                    >
                      <option value="open">Open</option>
                      <option value="in_progress">In Progress</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>
                <p className="text-xs text-gray-500">
                  Submitted: {new Date(request.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Maintenance;

