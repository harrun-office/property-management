import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { propertyManagerAPI } from '../../services/api';

function MySubscriptions() {
  const navigate = useNavigate();
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadSubscriptions();
  }, []);

  const loadSubscriptions = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await propertyManagerAPI.getMySubscriptions();
      setSubscriptions(data);
    } catch (err) {
      setError(err.message || 'Failed to load subscriptions');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      active: 'bg-eucalyptus/20 text-eucalyptus',
      cancelled: 'bg-error/20 text-error',
      pending: 'bg-warning/20 text-warning'
    };
    return styles[status] || 'bg-stone-200 text-charcoal';
  };

  return (
    <div className="min-h-screen bg-porcelain py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-charcoal mb-2">My Subscriptions</h1>
          <p className="text-architectural">Manage your assigned property subscriptions</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-error/20 border border-error text-error rounded-lg">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-center py-12 text-architectural">Loading subscriptions...</div>
        ) : subscriptions.length === 0 ? (
          <div className="bg-stone-100 rounded-xl shadow-md p-12 text-center border border-stone-200">
            <p className="text-architectural">No subscriptions assigned yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {subscriptions.map((subscription) => (
              <div key={subscription.id} className="bg-stone-100 rounded-xl shadow-md p-6 border border-stone-200">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-charcoal mb-1">
                      {subscription.property?.title || 'Property'}
                    </h3>
                    <p className="text-sm text-architectural">{subscription.property?.address}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadge(subscription.status)}`}>
                    {subscription.status}
                  </span>
                </div>
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between">
                    <span className="text-architectural text-sm">Owner:</span>
                    <span className="font-semibold text-charcoal">{subscription.owner?.name || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-architectural text-sm">Plan:</span>
                    <span className="font-semibold text-charcoal">{subscription.plan?.name || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-architectural text-sm">Monthly Fee:</span>
                    <span className="font-semibold text-charcoal">${subscription.monthlyFee}/month</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-architectural text-sm">Total Revenue:</span>
                    <span className="font-semibold text-eucalyptus">${subscription.totalRevenue || 0}</span>
                  </div>
                </div>
                <div className="flex space-x-2 pt-4 border-t border-stone-200">
                  <button
                    onClick={() => navigate(`/property-manager/onboarding/${subscription.id}`)}
                    className="flex-1 px-4 py-2 bg-obsidian text-porcelain rounded-lg hover:bg-obsidian-light transition-colors text-sm font-medium"
                  >
                    {subscription.agreement?.signedByManager ? 'View Details' : 'Onboard'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default MySubscriptions;

