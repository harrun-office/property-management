import { useState, useEffect } from 'react';
import { ownerAPI } from '../../services/api';
import Card from '../../components/ui/Card';
import Skeleton from '../../components/ui/Skeleton';
import ErrorDisplay from '../../components/ui/ErrorDisplay';
import EmptyState from '../../components/ui/EmptyState';

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
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-charcoal mb-2">Maintenance Requests</h1>
          <p className="text-architectural">Manage property maintenance issues</p>
        </div>

        {error && <ErrorDisplay message={error} onRetry={loadRequests} className="mb-6" />}

        {requests.length === 0 ? (
          <EmptyState
            title="No maintenance requests yet"
            description="You don't have any maintenance requests at the moment."
            icon={
              <svg className="w-16 h-16 text-architectural" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            }
          />
        ) : (
          <div className="space-y-4">
            {requests.map((request) => (
              <Card key={request.id} variant="elevated" padding="lg">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-charcoal mb-1">
                      {request.property?.title || `Property #${request.propertyId}`}
                    </h3>
                    <p className="text-sm text-architectural mb-2">{request.description}</p>
                    <div className="flex items-center gap-4 text-sm text-architectural">
                      <span>Tenant: {request.tenant?.name || 'N/A'}</span>
                      <span>Priority: 
                        <span className={`ml-1 px-2 py-1 rounded-full text-xs font-semibold ${
                          request.priority === 'urgent' ? 'bg-error-100 text-error-700' :
                          request.priority === 'high' ? 'bg-warning-100 text-warning-700' :
                          request.priority === 'medium' ? 'bg-brass-100 text-brass-700' :
                          'bg-obsidian-100 text-obsidian-700'
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
                      className="px-3 py-2 border border-stone-300 rounded-lg bg-porcelain focus:ring-2 focus:ring-obsidian-500 focus:border-obsidian-500 transition-colors"
                    >
                      <option value="open">Open</option>
                      <option value="in_progress">In Progress</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>
                <p className="text-xs text-architectural">
                  Submitted: {new Date(request.createdAt).toLocaleDateString()}
                </p>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Maintenance;

