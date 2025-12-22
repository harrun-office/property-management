import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ownerAPI } from '../../services/api';

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
      <div className="min-h-screen bg-porcelain flex items-center justify-center">
        <p className="text-charcoal text-lg">Loading subscription details...</p>
      </div>
    );
  }

  if (error && !subscription) {
    return (
      <div className="min-h-screen bg-porcelain flex items-center justify-center">
        <div className="text-center">
          <p className="text-error text-lg mb-4">{error}</p>
          <Link to="/owner/subscriptions" className="text-obsidian hover:text-brass transition-colors">
            Back to Subscriptions
          </Link>
        </div>
      </div>
    );
  }

  if (!subscription) {
    return (
      <div className="min-h-screen bg-porcelain flex items-center justify-center">
        <div className="text-center">
          <p className="text-charcoal text-lg mb-4">Subscription not found</p>
          <Link to="/owner/subscriptions" className="text-obsidian hover:text-brass transition-colors">
            Back to Subscriptions
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-porcelain py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Link to="/owner/subscriptions" className="text-obsidian hover:text-brass transition-colors mb-4 inline-block">
            ← Back to Subscriptions
          </Link>
          <h1 className="text-4xl font-bold text-charcoal mb-2">Subscription Details</h1>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-error/20 border border-error text-error rounded-lg">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Subscription Info */}
          <div className="bg-stone-100 rounded-xl shadow-md p-6 border border-stone-200">
            <h2 className="text-2xl font-bold text-charcoal mb-4">Subscription Information</h2>
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
                  <p className="font-semibold text-charcoal">${subscription.monthlyFee}/month</p>
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
                    ${subscription.nextPayment.amount} on {new Date(subscription.nextPayment.dueDate).toLocaleDateString()}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Payment History */}
          <div className="bg-stone-100 rounded-xl shadow-md p-6 border border-stone-200">
            <h2 className="text-2xl font-bold text-charcoal mb-4">Payment History</h2>
            {payments.length === 0 ? (
              <p className="text-architectural">No payments yet</p>
            ) : (
              <div className="space-y-3">
                {payments.map((payment) => (
                  <div key={payment.id} className="bg-porcelain p-3 rounded-lg border border-stone-200">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-semibold text-charcoal">${payment.amount}</p>
                        <p className="text-xs text-architectural">
                          {payment.paidDate ? new Date(payment.paidDate).toLocaleDateString() : 'Pending'}
                        </p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        payment.status === 'paid' ? 'bg-eucalyptus/20 text-eucalyptus' :
                        payment.status === 'pending' ? 'bg-warning/20 text-warning' :
                        'bg-error/20 text-error'
                      }`}>
                        {payment.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <Link
              to={`/owner/subscriptions/${id}/payment`}
              className="mt-4 block w-full px-4 py-2 bg-obsidian text-porcelain rounded-lg hover:bg-obsidian-light transition-colors text-center"
            >
              Manage Payments
            </Link>
          </div>
        </div>

        {/* Service Agreement */}
        {agreement && (
          <div className="mt-6 bg-stone-100 rounded-xl shadow-md p-6 border border-stone-200">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-charcoal">Service Agreement</h2>
              <Link
                to={`/owner/subscriptions/${id}/agreement`}
                className="px-4 py-2 bg-stone-300 text-charcoal rounded-lg hover:bg-stone-400 transition-colors text-sm"
              >
                View Full Agreement
              </Link>
            </div>
            <div className="bg-porcelain p-4 rounded-lg border border-stone-200">
              <p className="text-charcoal text-sm whitespace-pre-line">{agreement.terms}</p>
            </div>
          </div>
        )}

        {/* Actions */}
        {subscription.status === 'active' && (
          <div className="mt-6 flex space-x-4">
            <button
              onClick={handleCancel}
              className="px-6 py-2 bg-error/20 text-error rounded-lg hover:bg-error/30 transition-colors font-semibold"
            >
              Cancel Subscription
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default SubscriptionDetails;

