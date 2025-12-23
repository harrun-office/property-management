import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { propertyManagerAPI } from '../../services/api';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Skeleton from '../../components/ui/Skeleton';
import ErrorDisplay from '../../components/ui/ErrorDisplay';
import EmptyState from '../../components/ui/EmptyState';

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
      active: 'bg-eucalyptus-100 text-eucalyptus-700',
      cancelled: 'bg-error-100 text-error-700',
      pending: 'bg-warning-100 text-warning-700'
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

        {error && <ErrorDisplay message={error} onRetry={loadSubscriptions} className="mb-6" />}

        {loading ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {[1, 2].map((i) => (
              <Skeleton.Card key={i} />
            ))}
          </div>
        ) : subscriptions.length === 0 ? (
          <EmptyState
            title="No subscriptions assigned yet"
            description="You don't have any property subscriptions at the moment."
            icon={
              <svg className="w-16 h-16 text-architectural" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            }
          />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {subscriptions.map((subscription) => (
              <Card key={subscription.id} variant="elevated" padding="lg">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <Card.Title className="text-xl mb-1">
                      {subscription.property?.title || 'Property'}
                    </Card.Title>
                    <Card.Description>{subscription.property?.address}</Card.Description>
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
                    <span className="font-semibold text-eucalyptus-700">${subscription.totalRevenue || 0}</span>
                  </div>
                </div>
                <Card.Footer className="pt-4 border-t border-stone-200">
                  <Button
                    variant="primary"
                    fullWidth
                    onClick={() => navigate(`/property-manager/onboarding/${subscription.id}`)}
                  >
                    {subscription.agreement?.signedByManager ? 'View Details' : 'Onboard'}
                  </Button>
                </Card.Footer>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default MySubscriptions;

