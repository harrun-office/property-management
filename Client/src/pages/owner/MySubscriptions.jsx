import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ownerAPI } from '../../services/api';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Skeleton from '../../components/ui/Skeleton';
import ErrorDisplay from '../../components/ui/ErrorDisplay';
import EmptyState from '../../components/ui/EmptyState';

function MySubscriptions() {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    loadSubscriptions();
  }, []);

  const loadSubscriptions = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await ownerAPI.getMySubscriptions();
      setSubscriptions(data);
    } catch (err) {
      setError(err.message || 'Failed to load subscriptions');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this subscription? This action cannot be undone.')) {
      return;
    }

    try {
      await ownerAPI.cancelSubscription(id);
      alert('Subscription cancelled successfully');
      await loadSubscriptions();
    } catch (err) {
      setError(err.message || 'Failed to cancel subscription');
    }
  };

  const filteredSubscriptions = statusFilter === 'all'
    ? subscriptions
    : subscriptions.filter(s => s.status === statusFilter);

  const getStatusBadge = (status) => {
    const styles = {
      active: 'bg-eucalyptus/20 text-eucalyptus',
      cancelled: 'bg-error/20 text-error',
      pending: 'bg-warning/20 text-warning',
      suspended: 'bg-architectural/20 text-architectural'
    };
    return styles[status] || 'bg-stone-200 text-charcoal';
  };

  return (
    <div className="min-h-screen bg-porcelain py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-charcoal mb-2">My Subscriptions</h1>
            <p className="text-architectural">Manage your property manager subscriptions</p>
          </div>
          <Link
            to="/owner/managers"
            className="px-6 py-2 bg-obsidian text-porcelain rounded-lg hover:bg-obsidian-light transition-colors font-semibold"
          >
            + Hire Manager
          </Link>
        </div>

        {error && <ErrorDisplay message={error} className="mb-6" />}

        {/* Filter */}
        <div className="mb-6">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2.5 border border-stone-300 rounded-lg bg-porcelain focus:ring-2 focus:ring-obsidian-500 focus:border-obsidian-500 transition-colors"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="cancelled">Cancelled</option>
            <option value="pending">Pending</option>
            <option value="suspended">Suspended</option>
          </select>
        </div>

        {/* Subscriptions List */}
        {loading ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {[1, 2].map((i) => (
              <Skeleton.Card key={i} />
            ))}
          </div>
        ) : filteredSubscriptions.length === 0 ? (
          <EmptyState
            title="No Subscriptions Found"
            description="You don't have any subscriptions yet."
            action={
              <Link to="/owner/managers">
                <Button variant="primary">Browse Managers</Button>
              </Link>
            }
            icon={
              <svg className="w-16 h-16 text-architectural" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            }
          />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredSubscriptions.map((subscription) => (
              <Card key={subscription.id} variant="elevated" padding="lg">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-charcoal mb-1">
                      {subscription.manager?.name || 'Manager'}
                    </h3>
                    <p className="text-sm text-architectural">{subscription.property?.title || 'Property'}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadge(subscription.status)}`}>
                    {subscription.status}
                  </span>
                </div>
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between">
                    <span className="text-architectural text-sm">Plan:</span>
                    <span className="font-semibold text-charcoal">{subscription.plan?.name || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-architectural text-sm">Monthly Fee:</span>
                    <span className="font-semibold text-charcoal">${subscription.monthlyFee}/month</span>
                  </div>
                  {subscription.nextPayment && (
                    <div className="flex justify-between">
                      <span className="text-architectural text-sm">Next Payment:</span>
                      <span className="font-semibold text-charcoal">
                        {new Date(subscription.nextPayment.dueDate).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-architectural text-sm">Started:</span>
                    <span className="text-charcoal">{new Date(subscription.startDate).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="flex gap-2 pt-4 border-t border-stone-200">
                  <Link
                    to={`/owner/subscriptions/${subscription.id}`}
                    className="flex-1"
                  >
                    <Button variant="secondary" size="sm" fullWidth>
                      View Details
                    </Button>
                  </Link>
                  {subscription.status === 'active' && (
                    <Button
                      variant="danger"
                      size="sm"
                      fullWidth
                      onClick={() => handleCancel(subscription.id)}
                    >
                      Cancel
                    </Button>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default MySubscriptions;

