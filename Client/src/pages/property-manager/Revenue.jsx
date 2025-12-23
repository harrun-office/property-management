import { useState, useEffect } from 'react';
import { propertyManagerAPI } from '../../services/api';
import Card from '../../components/ui/Card';
import MetricCard from '../../components/ui/MetricCard';
import Input from '../../components/ui/Input';
import Skeleton from '../../components/ui/Skeleton';
import ErrorDisplay from '../../components/ui/ErrorDisplay';
import EmptyState from '../../components/ui/EmptyState';

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

        {error && <ErrorDisplay message={error} onRetry={loadRevenue} className="mb-6" />}

        {/* Filters */}
        <Card variant="elevated" padding="lg" className="mb-6">
          <Card.Title className="mb-4">Date Range</Card.Title>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              type="date"
              label="Start Date"
              value={filters.startDate}
              onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
            />
            <Input
              type="date"
              label="End Date"
              value={filters.endDate}
              onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
            />
          </div>
        </Card>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Skeleton.MetricCard key={i} />
            ))}
          </div>
        ) : revenue ? (
          <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <MetricCard
                title="Total Revenue"
                value={`$${revenue.totalRevenue.toLocaleString()}`}
                variant="success"
                icon={
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                }
              />
              <MetricCard
                title="Payments Received"
                value={revenue.paymentCount.toString()}
                variant="default"
                icon={
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                }
              />
              <MetricCard
                title="Average per Payment"
                value={`$${revenue.paymentCount > 0 ? Math.round(revenue.totalRevenue / revenue.paymentCount) : 0}`}
                variant="default"
                icon={
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                }
              />
            </div>

            {/* Monthly Revenue */}
            {revenue.monthlyRevenue && Object.keys(revenue.monthlyRevenue).length > 0 && (
              <Card variant="elevated" padding="lg">
                <Card.Title className="text-2xl mb-4">Monthly Revenue</Card.Title>
                <div className="space-y-2">
                  {Object.entries(revenue.monthlyRevenue)
                    .sort((a, b) => b[0].localeCompare(a[0]))
                    .map(([month, amount]) => (
                      <Card key={month} variant="filled" padding="sm">
                        <div className="flex justify-between items-center">
                          <span className="font-semibold text-charcoal">{month}</span>
                          <span className="text-lg font-bold text-eucalyptus-700">${amount.toLocaleString()}</span>
                        </div>
                      </Card>
                    ))}
                </div>
              </Card>
            )}

            {/* Payment History */}
            <Card variant="elevated" padding="lg">
              <Card.Title className="text-2xl mb-4">Payment History</Card.Title>
              {revenue.payments && revenue.payments.length > 0 ? (
                <div className="space-y-3">
                  {revenue.payments.map((payment) => (
                    <Card key={payment.id} variant="filled" padding="md">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-semibold text-charcoal">${payment.amount.toLocaleString()}</p>
                          <p className="text-sm text-architectural">
                            {payment.paidDate ? new Date(payment.paidDate).toLocaleDateString() : 'Pending'}
                          </p>
                        </div>
                        <span className="px-3 py-1 bg-eucalyptus-100 text-eucalyptus-700 rounded-full text-xs font-semibold">
                          Paid
                        </span>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <EmptyState
                  title="No payments yet"
                  description="Your payment history will appear here once payments are received."
                  icon={
                    <svg className="w-16 h-16 text-architectural" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2zM10 8.5a1.5 1.5 0 103 0 1.5 1.5 0 00-3 0z" />
                    </svg>
                  }
                />
              )}
            </Card>
          </div>
        ) : (
          <EmptyState
            title="No revenue data available"
            description="Revenue data will appear here once you start receiving payments."
            icon={
              <svg className="w-16 h-16 text-architectural" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
          />
        )}
      </div>
    </div>
  );
}

export default Revenue;

