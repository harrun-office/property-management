import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { tenantAPI } from '../../services/api';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Modal from '../../components/ui/Modal';
import MetricCard from '../../components/ui/MetricCard';
import Skeleton from '../../components/ui/Skeleton';
import ErrorDisplay from '../../components/ui/ErrorDisplay';
import EmptyState from '../../components/ui/EmptyState';

function TenantPayments() {
  const [payments, setPayments] = useState([]);
  const [upcomingPayments, setUpcomingPayments] = useState([]);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    status: '',
    startDate: '',
    endDate: ''
  });

  // Payment processing state
  const [processingPayment, setProcessingPayment] = useState(null);
  const [paymentModal, setPaymentModal] = useState({ isOpen: false, payment: null });
  const [paymentSuccess, setPaymentSuccess] = useState(null);
  const [paymentHistory, setPaymentHistory] = useState([]);

  useEffect(() => {
    loadPayments();
  }, [filters.status, filters.startDate, filters.endDate]);

  const loadPayments = async () => {
    setLoading(true);
    setError('');
    try {
      const [allPayments, upcoming, history] = await Promise.all([
        tenantAPI.getPayments(filters),
        tenantAPI.getUpcomingPayments(),
        tenantAPI.getPaymentHistory()
      ]);
      setPayments(allPayments);
      setUpcomingPayments(upcoming);
      setPaymentHistory(history);
    } catch (err) {
      setError(err.message || 'Failed to load payments');
    } finally {
      setLoading(false);
    }
  };

  // Payment processing functions
  const handlePayNow = async (payment) => {
    setProcessingPayment(payment.id);
    setPaymentModal({ isOpen: true, payment });
  };

  const processPayment = async (paymentData) => {
    try {
      setProcessingPayment(paymentModal.payment.id);

      // Generate bill number and transaction ID
      const billNumber = `BILL-${Date.now()}`;
      const transactionId = `TXN-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

      const paymentPayload = {
        paymentId: paymentModal.payment.id,
        amount: paymentModal.payment.amount,
        paymentMethod: paymentData.method,
        transactionId,
        billNumber
      };

      const result = await tenantAPI.processPayment(paymentPayload);

      // Show success message
      setPaymentSuccess({
        billNumber: result.billNumber,
        transactionId: result.transactionId,
        amount: paymentModal.payment.amount,
        property: paymentModal.payment.property?.title
      });

      // Close modal and reload payments
      setPaymentModal({ isOpen: false, payment: null });
      loadPayments(); // Refresh the payments list

    } catch (error) {
      setError('Payment processing failed. Please try again.');
    } finally {
      setProcessingPayment(null);
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      paid: 'bg-eucalyptus-100 text-eucalyptus-700',
      pending: 'bg-warning-100 text-warning-700',
      overdue: 'bg-error-100 text-error-700'
    };
    return styles[status] || 'bg-stone-200 text-charcoal';
  };

  const totalPaid = payments.filter(p => p.status === 'paid').reduce((sum, p) => sum + (p.amount || 0), 0);
  const pendingAmount = payments.filter(p => p.status === 'pending').reduce((sum, p) => sum + (p.amount || 0), 0);
  const overdueCount = payments.filter(p => {
    if (p.status === 'pending') {
      const dueDate = new Date(p.dueDate);
      return dueDate < new Date();
    }
    return false;
  }).length;

  if (loading) {
    return (
      <div className="min-h-screen bg-porcelain py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <Skeleton variant="title" width="30%" className="mb-2" />
            <Skeleton variant="text" width="50%" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {[1, 2, 3].map((i) => (
              <Skeleton.MetricCard key={i} />
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
          <h1 className="text-4xl font-bold text-charcoal mb-2">Payments</h1>
          <p className="text-architectural">View your payment history and manage upcoming payments</p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <MetricCard
            title="Total Paid"
            value={`$${totalPaid.toLocaleString()}`}
            variant="success"
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
          />
          <MetricCard
            title="Pending Amount"
            value={`$${pendingAmount.toLocaleString()}`}
            variant="default"
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
          />
          <MetricCard
            title="Overdue"
            value={overdueCount.toString()}
            variant="default"
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            }
          />
        </div>

        {/* Upcoming Payments */}
        {upcomingPayments.length > 0 && (
          <Card variant="elevated" padding="lg" className="mb-8">
            <Card.Title className="mb-4">Upcoming Payments</Card.Title>
            <div className="space-y-3">
              {upcomingPayments.slice(0, 3).map((payment) => (
                <Card key={payment.id} variant="filled" padding="md" hover>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-semibold text-charcoal">${payment.amount.toLocaleString()}</p>
                      <p className="text-sm text-architectural">
                        {payment.property?.title} - Due {new Date(payment.dueDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadge(payment.status)}`}>
                        {payment.status}
                      </span>
                      {payment.status === 'pending' && (
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => handlePayNow(payment)}
                          disabled={processingPayment === payment.id}
                        >
                          {processingPayment === payment.id ? 'Processing...' : 'Pay Now'}
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </Card>
        )}

        {/* Filters */}
        <Card variant="elevated" padding="lg" className="mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-charcoal mb-1">Status</label>
              <select
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                className="w-full px-3 py-2 border border-stone-300 rounded-lg bg-porcelain focus:ring-2 focus:ring-obsidian-500 focus:border-obsidian-500 transition-colors"
              >
                <option value="">All Statuses</option>
                <option value="paid">Paid</option>
                <option value="pending">Pending</option>
                <option value="overdue">Overdue</option>
              </select>
            </div>
            <Input
              label="Start Date"
              type="date"
              value={filters.startDate}
              onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
            />
            <Input
              label="End Date"
              type="date"
              value={filters.endDate}
              onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
            />
          </div>
        </Card>

        {error && <ErrorDisplay message={error} onRetry={loadPayments} className="mb-6" />}

        {/* Payment History */}
        <Card variant="elevated" padding="none" className="overflow-hidden">
          <Card.Header className="p-6 border-b border-stone-200">
            <Card.Title>Payment History</Card.Title>
          </Card.Header>
          <Card.Body>
            {payments.length === 0 ? (
              <EmptyState
                title="No payments found"
                description="You don't have any payment records yet."
                icon={
                  <svg className="w-16 h-16 text-architectural" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                }
              />
            ) : (
              <div className="divide-y divide-stone-200">
                {payments.map((payment) => {
                  const isOverdue = payment.status === 'pending' && new Date(payment.dueDate) < new Date();
                  return (
                    <Card
                      key={payment.id}
                      variant="filled"
                      padding="md"
                      hover
                      onClick={() => setSelectedPayment(payment)}
                      className="cursor-pointer"
                    >
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold text-charcoal">
                              ${payment.amount.toLocaleString()}
                            </h3>
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadge(isOverdue ? 'overdue' : payment.status)}`}>
                              {isOverdue ? 'Overdue' : payment.status}
                            </span>
                          </div>
                          <p className="text-sm text-architectural mb-1">
                            {payment.property?.title || 'Property'}
                          </p>
                          <div className="flex flex-wrap gap-4 text-xs text-architectural">
                            <span>Due: {new Date(payment.dueDate).toLocaleDateString()}</span>
                            {payment.paidDate && (
                              <span>Paid: {new Date(payment.paidDate).toLocaleDateString()}</span>
                            )}
                            <span>Type: {payment.type || 'rent'}</span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          {payment.status === 'paid' && (
                            <Button
                              variant="primary"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                alert('Receipt download feature coming soon');
                              }}
                            >
                              Download Receipt
                            </Button>
                          )}
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            )}
          </Card.Body>
        </Card>

        {/* Payment Details Modal */}
        <Modal
          isOpen={!!selectedPayment}
          onClose={() => setSelectedPayment(null)}
          title="Payment Details"
          size="lg"
        >
          {selectedPayment && (
            <div className="space-y-4">
              <div>
                <p className="text-architectural text-sm mb-1">Amount</p>
                <p className="text-2xl font-bold text-charcoal">${selectedPayment.amount.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-architectural text-sm mb-1">Property</p>
                <p className="text-charcoal font-semibold">{selectedPayment.property?.title || 'N/A'}</p>
                <p className="text-sm text-architectural">{selectedPayment.property?.address}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-architectural text-sm mb-1">Due Date</p>
                  <p className="text-charcoal">{new Date(selectedPayment.dueDate).toLocaleDateString()}</p>
                </div>
                {selectedPayment.paidDate && (
                  <div>
                    <p className="text-architectural text-sm mb-1">Paid Date</p>
                    <p className="text-charcoal">{new Date(selectedPayment.paidDate).toLocaleDateString()}</p>
                  </div>
                )}
                <div>
                  <p className="text-architectural text-sm mb-1">Status</p>
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadge(selectedPayment.status)}`}>
                    {selectedPayment.status}
                  </span>
                </div>
                <div>
                  <p className="text-architectural text-sm mb-1">Type</p>
                  <p className="text-charcoal">{selectedPayment.type || 'rent'}</p>
                </div>
              </div>
              {selectedPayment.status === 'paid' && (
                <Button
                  variant="primary"
                  fullWidth
                  onClick={() => alert('Receipt download feature coming soon')}
                >
                  Download Receipt
                </Button>
              )}
            </div>
          )}
        </Modal>

        {/* Payment Processing Modal */}
        <Modal
          isOpen={paymentModal.isOpen}
          onClose={() => setPaymentModal({ isOpen: false, payment: null })}
          title="Complete Payment"
          size="md"
        >
          {paymentModal.payment && (
            <div className="space-y-6">
              {/* Bill Preview */}
              <div className="bg-stone-50 p-4 rounded-lg">
                <h3 className="font-semibold text-charcoal mb-3">Bill Details</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-architectural">Property:</span>
                    <span className="text-charcoal">{paymentModal.payment.property?.title}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-architectural">Amount:</span>
                    <span className="text-charcoal font-semibold">${paymentModal.payment.amount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-architectural">Due Date:</span>
                    <span className="text-charcoal">{new Date(paymentModal.payment.dueDate).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              {/* Payment Method Selection */}
              <div>
                <label className="block text-sm font-medium text-charcoal mb-2">Payment Method</label>
                <select
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg bg-porcelain focus:ring-2 focus:ring-obsidian-500 focus:border-obsidian-500 transition-colors"
                  defaultValue="credit_card"
                >
                  <option value="credit_card">Credit Card</option>
                  <option value="debit_card">Debit Card</option>
                  <option value="bank_transfer">Bank Transfer</option>
                  <option value="digital_wallet">Digital Wallet</option>
                </select>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="secondary"
                  onClick={() => setPaymentModal({ isOpen: false, payment: null })}
                  fullWidth
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  onWidth
                  onClick={() => processPayment({ method: 'credit_card' })}
                  loading={processingPayment === paymentModal.payment.id}
                  fullWidth
                >
                  Pay Now
                </Button>
              </div>
            </div>
          )}
        </Modal>

        {/* Payment Success Modal */}
        <Modal
          isOpen={!!paymentSuccess}
          onClose={() => setPaymentSuccess(null)}
          title="Payment Successful!"
          size="md"
        >
          {paymentSuccess && (
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-eucalyptus-100 rounded-full flex items-center justify-center mx-auto">
                <svg className="w-8 h-8 text-eucalyptus-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"></path>
                </svg>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-charcoal mb-2">Payment Completed Successfully</h3>
                <div className="bg-stone-50 p-4 rounded-lg text-sm space-y-2">
                  <div className="flex justify-between">
                    <span className="text-architectural">Bill Number:</span>
                    <span className="text-charcoal font-mono">{paymentSuccess.billNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-architectural">Transaction ID:</span>
                    <span className="text-charcoal font-mono">{paymentSuccess.transactionId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-architectural">Amount Paid:</span>
                    <span className="text-charcoal font-semibold">${paymentSuccess.amount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-architectural">Property:</span>
                    <span className="text-charcoal">{paymentSuccess.property}</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="secondary"
                  onClick={() => setPaymentSuccess(null)}
                  fullWidth
                >
                  Close
                </Button>
                <Button
                  variant="primary"
                  onClick={() => {
                    // Download receipt functionality can be added later
                    alert('Receipt download feature coming soon');
                    setPaymentSuccess(null);
                  }}
                  fullWidth
                >
                  Download Receipt
                </Button>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </div>
  );
}

export default TenantPayments;

