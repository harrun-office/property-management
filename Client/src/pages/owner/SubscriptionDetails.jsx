import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ownerAPI } from '../../services/api';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Skeleton from '../../components/ui/Skeleton';
import ErrorDisplay from '../../components/ui/ErrorDisplay';
import EmptyState from '../../components/ui/EmptyState';

function SubscriptionDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [subscription, setSubscription] = useState(null);
  const [payments, setPayments] = useState([]);
  const [agreement, setAgreement] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (id) {
      loadSubscriptionDetails();
    }
  }, [id]);

  const loadSubscriptionDetails = async () => {
    setLoading(true);
    setError('');
    try {
      const [subs, pays, agree] = await Promise.all([
        ownerAPI.getMySubscriptions().then(data => data.find(s => s.id === parseInt(id))),
        ownerAPI.getSubscriptionPayments(id),
        ownerAPI.getServiceAgreement(id)
      ]);
      setSubscription(subs);
      setPayments(pays);
      setAgreement(agree);
    } catch (err) {
      setError(err.message || 'Failed to load subscription details');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async () => {
    if (!window.confirm('Are you sure you want to cancel this subscription? This action cannot be undone.')) {
      return;
    }

    try {
      await ownerAPI.cancelSubscription(id);
      alert('Subscription cancelled successfully');
      navigate('/owner/subscriptions');
    } catch (err) {
      setError(err.message || 'Failed to cancel subscription');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-porcelain py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <Skeleton variant="text" width="30%" className="mb-4" />
            <Skeleton variant="title" width="40%" className="mb-2" />
            <Skeleton variant="text" width="60%" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {[1, 2].map((i) => (
              <Skeleton.Card key={i} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error && !subscription) {
    return (
      <div className="min-h-screen bg-porcelain py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <ErrorDisplay
            message={error}
            action={
              <Link to="/owner/subscriptions">
                <Button variant="primary">Back to Subscriptions</Button>
              </Link>
            }
          />
        </div>
      </div>
    );
  }

  if (!subscription) {
    return (
      <div className="min-h-screen bg-porcelain py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <EmptyState
            title="Subscription not found"
            description="The subscription you're looking for doesn't exist."
            action={
              <Link to="/owner/subscriptions">
                <Button variant="primary">Back to Subscriptions</Button>
              </Link>
            }
            icon={
              <svg className="w-16 h-16 text-architectural" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            }
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-porcelain py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Link to="/owner/subscriptions" className="mb-4 inline-block">
            <Button variant="ghost" icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            }>
              Back to Subscriptions
            </Button>
          </Link>
          <h1 className="text-4xl font-bold text-charcoal mb-2">Subscription Details</h1>
        </div>

        {error && <ErrorDisplay message={error} className="mb-6" />}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Subscription Info */}
          <Card variant="elevated" padding="lg">
            <Card.Title className="text-2xl mb-4">Subscription Information</Card.Title>
            <div className="space-y-4">
              <div>
                <p className="text-architectural text-sm">Manager</p>
                <p className="font-semibold text-charcoal">{subscription.manager?.name || 'N/A'}</p>
                <p className="text-sm text-architectural">{subscription.manager?.email}</p>
              </div>
              <div>
                <p className="text-architectural text-sm">Property</p>
                <p className="font-semibold text-charcoal">{subscription.property?.title || 'N/A'}</p>
                <p className="text-sm text-architectural">{subscription.property?.address}</p>
              </div>
              <div>
                <p className="text-architectural text-sm">Plan</p>
                <p className="font-semibold text-charcoal">{subscription.plan?.name || 'N/A'}</p>
                <p className="text-sm text-architectural">{subscription.plan?.description}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-architectural text-sm">Monthly Fee</p>
                  <p className="font-semibold text-charcoal">₹{subscription.monthlyFee}/month</p>
                </div>
                <div>
                  <p className="text-architectural text-sm">Status</p>
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                    subscription.status === 'active' ? 'bg-eucalyptus/20 text-eucalyptus' :
                    subscription.status === 'cancelled' ? 'bg-error/20 text-error' :
                    'bg-warning/20 text-warning'
                  }`}>
                    {subscription.status}
                  </span>
                </div>
              </div>
              <div>
                <p className="text-architectural text-sm">Started</p>
                <p className="text-charcoal">{new Date(subscription.startDate).toLocaleDateString()}</p>
              </div>
              {subscription.nextPayment && (
                <div>
                  <p className="text-architectural text-sm">Next Payment</p>
                  <p className="font-semibold text-charcoal">
                    ₹{subscription.nextPayment.amount} on {new Date(subscription.nextPayment.dueDate).toLocaleDateString()}
                  </p>
                </div>
              )}
            </div>
          </Card>

          {/* Payment History */}
          <Card variant="elevated" padding="lg">
            <Card.Title className="text-2xl mb-4">Payment History</Card.Title>
            {payments.length === 0 ? (
              <p className="text-architectural">No payments yet</p>
            ) : (
              <div className="space-y-3 mb-4">
                {payments.map((payment) => (
                  <Card key={payment.id} variant="filled" padding="sm">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-semibold text-charcoal">₹{payment.amount}</p>
                        <p className="text-xs text-architectural">
                          {payment.paidDate ? new Date(payment.paidDate).toLocaleDateString() : 'Pending'}
                        </p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        payment.status === 'paid' ? 'bg-eucalyptus-100 text-eucalyptus-700' :
                        payment.status === 'pending' ? 'bg-warning-100 text-warning-700' :
                        'bg-error-100 text-error-700'
                      }`}>
                        {payment.status}
                      </span>
                    </div>
                  </Card>
                ))}
              </div>
            )}
            <Link to={`/owner/subscriptions/${id}/payment`}>
              <Button variant="primary" fullWidth>Manage Payments</Button>
            </Link>
          </Card>
        </div>

        {/* Service Agreement */}
        {agreement && (
          <Card variant="elevated" padding="lg" className="mt-6">
            <div className="flex justify-between items-center mb-4">
              <Card.Title className="text-2xl">Service Agreement</Card.Title>
              <Link to={`/owner/subscriptions/${id}/agreement`}>
                <Button variant="secondary" size="sm">View Full Agreement</Button>
              </Link>
            </div>
            <Card variant="filled" padding="md">
              <p className="text-charcoal text-sm whitespace-pre-line">{agreement.terms}</p>
            </Card>
          </Card>
        )}

        {/* Actions */}
        {subscription.status === 'active' && (
          <div className="mt-6">
            <Button variant="danger" onClick={handleCancel}>
              Cancel Subscription
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export default SubscriptionDetails;

