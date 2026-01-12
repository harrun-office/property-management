import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ownerAPI } from '../../services/api';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Skeleton from '../../components/ui/Skeleton';
import ErrorDisplay from '../../components/ui/ErrorDisplay';
import EmptyState from '../../components/ui/EmptyState';

function SubscriptionPayment() {
  const { id } = useParams();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('credit_card');

  useEffect(() => {
    if (id) {
      loadPayments();
    }
  }, [id]);

  const loadPayments = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await ownerAPI.getSubscriptionPayments(id);
      setPayments(data);
    } catch (err) {
      setError(err.message || 'Failed to load payments');
    } finally {
      setLoading(false);
    }
  };

  const handlePay = async (paymentId) => {
    try {
      await ownerAPI.paySubscription(id, { paymentMethod });
      setSuccess('Payment processed successfully!');
      setTimeout(() => setSuccess(''), 3000);
      await loadPayments();
    } catch (err) {
      setError(err.message || 'Failed to process payment');
    }
  };

  const pendingPayments = payments.filter(p => p.status === 'pending');
  const paidPayments = payments.filter(p => p.status === 'paid');

  return (
    <div className="min-h-screen bg-porcelain py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Link to={`/owner/subscriptions/${id}`} className="mb-4 inline-block">
            <Button variant="ghost" icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            }>
              Back to Subscription
            </Button>
          </Link>
          <h1 className="text-4xl font-bold text-charcoal mb-2">Payment Management</h1>
        </div>

        {error && <ErrorDisplay message={error} className="mb-6" />}
        {success && (
          <div className="mb-6 p-4 bg-eucalyptus-100 border border-eucalyptus-500 text-eucalyptus-700 rounded-lg">
            {success}
          </div>
        )}

        {/* Payment Method */}
        <Card variant="elevated" padding="lg" className="mb-6">
          <Card.Title className="mb-4">Payment Method</Card.Title>
          <select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            className="w-full px-4 py-2.5 border border-stone-300 rounded-lg bg-porcelain focus:ring-2 focus:ring-obsidian-500 focus:border-obsidian-500 transition-colors"
          >
            <option value="credit_card">Credit Card</option>
            <option value="debit_card">Debit Card</option>
            <option value="bank_transfer">Bank Transfer</option>
          </select>
        </Card>

        {/* Pending Payments */}
        {pendingPayments.length > 0 && (
          <Card variant="elevated" padding="lg" className="mb-6">
            <Card.Title className="mb-4">Pending Payments</Card.Title>
            <div className="space-y-3">
              {pendingPayments.map((payment) => (
                <Card key={payment.id} variant="filled" padding="md">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-semibold text-charcoal">₹{payment.amount}</p>
                      <p className="text-sm text-architectural">
                        Due: {new Date(payment.dueDate).toLocaleDateString()}
                      </p>
                    </div>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handlePay(payment.id)}
                    >
                      Pay Now
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </Card>
        )}

        {/* Payment History */}
        <Card variant="elevated" padding="lg">
          <Card.Title className="mb-4">Payment History</Card.Title>
          {loading ? (
            <Skeleton variant="text" width="100%" />
          ) : paidPayments.length === 0 ? (
            <EmptyState
              title="No payment history"
              description="Your payment history will appear here once you make payments."
              icon={
                <svg className="w-16 h-16 text-architectural" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2zM10 8.5a1.5 1.5 0 103 0 1.5 1.5 0 00-3 0z" />
                </svg>
              }
            />
          ) : (
            <div className="space-y-3">
              {paidPayments.map((payment) => (
                <Card key={payment.id} variant="filled" padding="md">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-semibold text-charcoal">₹{payment.amount}</p>
                      <p className="text-sm text-architectural">
                        Paid: {new Date(payment.paidDate).toLocaleDateString()}
                      </p>
                      <p className="text-xs text-architectural">Method: {payment.paymentMethod}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 bg-eucalyptus-100 text-eucalyptus-700 rounded-full text-xs font-semibold">
                        Paid
                      </span>
                      {payment.receiptUrl && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => alert('Receipt download feature coming soon')}
                        >
                          Download Receipt
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}

export default SubscriptionPayment;

