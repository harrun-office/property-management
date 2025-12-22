import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { tenantAPI } from '../../services/api';

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

  useEffect(() => {
    loadPayments();
  }, [filters.status, filters.startDate, filters.endDate]);

  const loadPayments = async () => {
    setLoading(true);
    setError('');
    try {
      const [allPayments, upcoming] = await Promise.all([
        tenantAPI.getPayments(filters),
        tenantAPI.getUpcomingPayments()
      ]);
      setPayments(allPayments);
      setUpcomingPayments(upcoming);
    } catch (err) {
      setError(err.message || 'Failed to load payments');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      paid: 'bg-eucalyptus/20 text-eucalyptus',
      pending: 'bg-warning/20 text-warning',
      overdue: 'bg-error/20 text-error'
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

  return (
    <div className="min-h-screen bg-porcelain py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-charcoal mb-2">Payments</h1>
          <p className="text-architectural">View your payment history and manage upcoming payments</p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-stone-100 rounded-xl shadow-md p-6 border border-stone-200">
            <p className="text-architectural text-sm mb-2">Total Paid</p>
            <p className="text-3xl font-bold text-eucalyptus">${totalPaid.toLocaleString()}</p>
          </div>
          <div className="bg-stone-100 rounded-xl shadow-md p-6 border border-stone-200">
            <p className="text-architectural text-sm mb-2">Pending Amount</p>
            <p className="text-3xl font-bold text-warning">${pendingAmount.toLocaleString()}</p>
          </div>
          <div className="bg-stone-100 rounded-xl shadow-md p-6 border border-stone-200">
            <p className="text-architectural text-sm mb-2">Overdue</p>
            <p className="text-3xl font-bold text-error">{overdueCount}</p>
          </div>
        </div>

        {/* Upcoming Payments */}
        {upcomingPayments.length > 0 && (
          <div className="bg-stone-100 rounded-xl shadow-md p-6 border border-stone-200 mb-8">
            <h2 className="text-2xl font-bold text-charcoal mb-4">Upcoming Payments</h2>
            <div className="space-y-3">
              {upcomingPayments.slice(0, 3).map((payment) => (
                <div key={payment.id} className="bg-porcelain p-4 rounded-lg border border-stone-200">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-semibold text-charcoal">${payment.amount.toLocaleString()}</p>
                      <p className="text-sm text-architectural">
                        {payment.property?.title} - Due {new Date(payment.dueDate).toLocaleDateString()}
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadge(payment.status)}`}>
                      {payment.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="bg-stone-100 rounded-xl shadow-md p-6 border border-stone-200 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              className="px-3 py-2 border rounded-lg bg-porcelain focus:ring-2 focus:ring-obsidian focus:border-obsidian"
            >
              <option value="">All Statuses</option>
              <option value="paid">Paid</option>
              <option value="pending">Pending</option>
              <option value="overdue">Overdue</option>
            </select>
            <input
              type="date"
              placeholder="Start Date"
              value={filters.startDate}
              onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
              className="px-3 py-2 border rounded-lg bg-porcelain focus:ring-2 focus:ring-obsidian focus:border-obsidian"
            />
            <input
              type="date"
              placeholder="End Date"
              value={filters.endDate}
              onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
              className="px-3 py-2 border rounded-lg bg-porcelain focus:ring-2 focus:ring-obsidian focus:border-obsidian"
            />
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-error/20 border border-error text-error rounded-lg">
            {error}
          </div>
        )}

        {/* Payment History */}
        <div className="bg-stone-100 rounded-xl shadow-md overflow-hidden border border-stone-200">
          <div className="p-6 border-b border-stone-200">
            <h2 className="text-2xl font-bold text-charcoal">Payment History</h2>
          </div>
          {loading ? (
            <div className="p-8 text-center text-architectural">Loading payments...</div>
          ) : payments.length === 0 ? (
            <div className="p-8 text-center text-architectural">No payments found</div>
          ) : (
            <div className="divide-y divide-stone-200">
              {payments.map((payment) => {
                const isOverdue = payment.status === 'pending' && new Date(payment.dueDate) < new Date();
                return (
                  <div
                    key={payment.id}
                    className="p-6 hover:bg-stone-50 transition-colors cursor-pointer"
                    onClick={() => setSelectedPayment(payment)}
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
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              // Download receipt functionality
                              alert('Receipt download feature coming soon');
                            }}
                            className="px-4 py-2 bg-obsidian text-porcelain rounded-lg hover:bg-obsidian-light transition-colors text-sm"
                          >
                            Download Receipt
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Payment Details Modal */}
        {selectedPayment && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setSelectedPayment(null)}>
            <div className="bg-porcelain rounded-xl shadow-lg max-w-2xl w-full p-6" onClick={(e) => e.stopPropagation()}>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-charcoal">Payment Details</h2>
                <button
                  onClick={() => setSelectedPayment(null)}
                  className="text-architectural hover:text-charcoal"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <p className="text-architectural text-sm">Amount</p>
                  <p className="text-2xl font-bold text-charcoal">${selectedPayment.amount.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-architectural text-sm">Property</p>
                  <p className="text-charcoal font-semibold">{selectedPayment.property?.title || 'N/A'}</p>
                  <p className="text-sm text-architectural">{selectedPayment.property?.address}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-architectural text-sm">Due Date</p>
                    <p className="text-charcoal">{new Date(selectedPayment.dueDate).toLocaleDateString()}</p>
                  </div>
                  {selectedPayment.paidDate && (
                    <div>
                      <p className="text-architectural text-sm">Paid Date</p>
                      <p className="text-charcoal">{new Date(selectedPayment.paidDate).toLocaleDateString()}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-architectural text-sm">Status</p>
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadge(selectedPayment.status)}`}>
                      {selectedPayment.status}
                    </span>
                  </div>
                  <div>
                    <p className="text-architectural text-sm">Type</p>
                    <p className="text-charcoal">{selectedPayment.type || 'rent'}</p>
                  </div>
                </div>
                {selectedPayment.status === 'paid' && (
                  <button
                    onClick={() => alert('Receipt download feature coming soon')}
                    className="w-full px-4 py-2 bg-obsidian text-porcelain rounded-lg hover:bg-obsidian-light transition-colors"
                  >
                    Download Receipt
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default TenantPayments;

