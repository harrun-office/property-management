import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ownerAPI } from '../../services/api';

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
          <Link to={`/owner/subscriptions/${id}`} className="text-obsidian hover:text-brass transition-colors mb-4 inline-block">
            ← Back to Subscription
          </Link>
          <h1 className="text-4xl font-bold text-charcoal mb-2">Payment Management</h1>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-error/20 border border-error text-error rounded-lg">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-eucalyptus/20 border border-eucalyptus text-eucalyptus rounded-lg">
            {success}
          </div>
        )}

        {/* Payment Method */}
        <div className="bg-stone-100 rounded-xl shadow-md p-6 border border-stone-200 mb-6">
          <h2 className="text-xl font-bold text-charcoal mb-4">Payment Method</h2>
          <select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg bg-porcelain focus:ring-2 focus:ring-obsidian focus:border-obsidian"
          >
            <option value="credit_card">Credit Card</option>
            <option value="debit_card">Debit Card</option>
            <option value="bank_transfer">Bank Transfer</option>
          </select>
        </div>

        {/* Pending Payments */}
        {pendingPayments.length > 0 && (
          <div className="bg-stone-100 rounded-xl shadow-md p-6 border border-stone-200 mb-6">
            <h2 className="text-xl font-bold text-charcoal mb-4">Pending Payments</h2>
            <div className="space-y-3">
              {pendingPayments.map((payment) => (
                <div key={payment.id} className="bg-porcelain p-4 rounded-lg border border-stone-200">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-semibold text-charcoal">${payment.amount}</p>
                      <p className="text-sm text-architectural">
                        Due: {new Date(payment.dueDate).toLocaleDateString()}
                      </p>
                    </div>
                    <button
                      onClick={() => handlePay(payment.id)}
                      className="px-4 py-2 bg-obsidian text-porcelain rounded-lg hover:bg-obsidian-light transition-colors"
                    >
                      Pay Now
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Payment History */}
        <div className="bg-stone-100 rounded-xl shadow-md p-6 border border-stone-200">
          <h2 className="text-xl font-bold text-charcoal mb-4">Payment History</h2>
          {loading ? (
            <p className="text-architectural">Loading payments...</p>
          ) : paidPayments.length === 0 ? (
            <p className="text-architectural">No payment history</p>
          ) : (
            <div className="space-y-3">
              {paidPayments.map((payment) => (
                <div key={payment.id} className="bg-porcelain p-4 rounded-lg border border-stone-200">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-semibold text-charcoal">${payment.amount}</p>
                      <p className="text-sm text-architectural">
                        Paid: {new Date(payment.paidDate).toLocaleDateString()}
                      </p>
                      <p className="text-xs text-architectural">Method: {payment.paymentMethod}</p>
                    </div>
                    <span className="px-3 py-1 bg-eucalyptus/20 text-eucalyptus rounded-full text-xs font-semibold">
                      Paid
                    </span>
                  </div>
                  {payment.receiptUrl && (
                    <button
                      onClick={() => alert('Receipt download feature coming soon')}
                      className="mt-2 text-sm text-obsidian hover:text-brass transition-colors"
                    >
                      Download Receipt
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default SubscriptionPayment;

