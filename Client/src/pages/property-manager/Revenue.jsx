import { useState, useEffect } from 'react';
import { propertyManagerAPI } from '../../services/api';

function Revenue() {
  const [revenue, setRevenue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: ''
  });

  useEffect(() => {
    loadRevenue();
  }, [filters.startDate, filters.endDate]);

  const loadRevenue = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await propertyManagerAPI.getSubscriptionRevenue(filters);
      setRevenue(data);
    } catch (err) {
      setError(err.message || 'Failed to load revenue');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-porcelain py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-charcoal mb-2">Subscription Revenue</h1>
          <p className="text-architectural">Track your subscription earnings and payments</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-error/20 border border-error text-error rounded-lg">
            {error}
          </div>
        )}

        {/* Filters */}
        <div className="bg-stone-100 rounded-xl shadow-md p-6 border border-stone-200 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

        {loading ? (
          <div className="text-center py-12 text-architectural">Loading revenue data...</div>
        ) : revenue ? (
          <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-stone-100 rounded-xl shadow-md p-6 border border-stone-200">
                <p className="text-architectural text-sm mb-2">Total Revenue</p>
                <p className="text-3xl font-bold text-eucalyptus">${revenue.totalRevenue.toLocaleString()}</p>
              </div>
              <div className="bg-stone-100 rounded-xl shadow-md p-6 border border-stone-200">
                <p className="text-architectural text-sm mb-2">Payments Received</p>
                <p className="text-3xl font-bold text-charcoal">{revenue.paymentCount}</p>
              </div>
              <div className="bg-stone-100 rounded-xl shadow-md p-6 border border-stone-200">
                <p className="text-architectural text-sm mb-2">Average per Payment</p>
                <p className="text-3xl font-bold text-charcoal">
                  ${revenue.paymentCount > 0 ? Math.round(revenue.totalRevenue / revenue.paymentCount) : 0}
                </p>
              </div>
            </div>

            {/* Monthly Revenue */}
            {revenue.monthlyRevenue && Object.keys(revenue.monthlyRevenue).length > 0 && (
              <div className="bg-stone-100 rounded-xl shadow-md p-6 border border-stone-200">
                <h2 className="text-2xl font-bold text-charcoal mb-4">Monthly Revenue</h2>
                <div className="space-y-2">
                  {Object.entries(revenue.monthlyRevenue)
                    .sort((a, b) => b[0].localeCompare(a[0]))
                    .map(([month, amount]) => (
                      <div key={month} className="flex justify-between items-center bg-porcelain p-3 rounded-lg border border-stone-200">
                        <span className="font-semibold text-charcoal">{month}</span>
                        <span className="text-lg font-bold text-eucalyptus">${amount.toLocaleString()}</span>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* Payment History */}
            <div className="bg-stone-100 rounded-xl shadow-md p-6 border border-stone-200">
              <h2 className="text-2xl font-bold text-charcoal mb-4">Payment History</h2>
              {revenue.payments && revenue.payments.length > 0 ? (
                <div className="space-y-3">
                  {revenue.payments.map((payment) => (
                    <div key={payment.id} className="bg-porcelain p-4 rounded-lg border border-stone-200">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-semibold text-charcoal">${payment.amount.toLocaleString()}</p>
                          <p className="text-sm text-architectural">
                            {payment.paidDate ? new Date(payment.paidDate).toLocaleDateString() : 'Pending'}
                          </p>
                        </div>
                        <span className="px-3 py-1 bg-eucalyptus/20 text-eucalyptus rounded-full text-xs font-semibold">
                          Paid
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-architectural">No payments yet</p>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center py-12 text-architectural">No revenue data available</div>
        )}
      </div>
    </div>
  );
}

export default Revenue;

