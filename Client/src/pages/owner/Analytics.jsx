import { useState, useEffect } from 'react';
import { ownerAPI } from '../../services/api';
import Card from '../../components/ui/Card';
import Skeleton from '../../components/ui/Skeleton';
import ErrorDisplay from '../../components/ui/ErrorDisplay';
import EmptyState from '../../components/ui/EmptyState';

function Analytics() {
  const [propertyPerformance, setPropertyPerformance] = useState([]);
  const [financialAnalytics, setFinancialAnalytics] = useState(null);
  const [tenantAnalytics, setTenantAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    setLoading(true);
    setError('');
    try {
      const [property, financial, tenant] = await Promise.all([
        ownerAPI.getPropertyPerformance(),
        ownerAPI.getFinancialAnalytics(),
        ownerAPI.getTenantAnalytics()
      ]);
      setPropertyPerformance(property);
      setFinancialAnalytics(financial);
      setTenantAnalytics(tenant);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-porcelain py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <Skeleton variant="title" width="30%" className="mb-2" />
            <Skeleton variant="text" width="50%" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {[1, 2].map((i) => (
              <Skeleton.Card key={i} />
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
          <h1 className="text-4xl font-bold text-charcoal mb-2">Analytics</h1>
          <p className="text-architectural">Track your property performance and insights</p>
        </div>

        {error && <ErrorDisplay message={error} onRetry={loadAnalytics} className="mb-6" />}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {financialAnalytics && (
            <Card variant="elevated" padding="lg">
              <Card.Title className="text-2xl mb-4">Financial Overview</Card.Title>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-architectural">Total Revenue</span>
                  <span className="font-bold text-charcoal">${(financialAnalytics.totalRevenue || 0).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-architectural">Average Monthly Income</span>
                  <span className="font-bold text-charcoal">${(financialAnalytics.averageMonthlyIncome || 0).toLocaleString()}</span>
                </div>
              </div>
            </Card>
          )}

          {tenantAnalytics && (
            <Card variant="elevated" padding="lg">
              <Card.Title className="text-2xl mb-4">Tenant Overview</Card.Title>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-architectural">Total Tenants</span>
                  <span className="font-bold text-charcoal">{tenantAnalytics.totalTenants || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-architectural">Active Tenants</span>
                  <span className="font-bold text-charcoal">{tenantAnalytics.activeTenants || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-architectural">Approval Rate</span>
                  <span className="font-bold text-charcoal">{tenantAnalytics.applicationApprovalRate || 0}%</span>
                </div>
              </div>
            </Card>
          )}
        </div>

        <Card variant="elevated" padding="lg">
          <Card.Title className="text-2xl mb-4">Property Performance</Card.Title>
          {propertyPerformance.length > 0 ? (
            <div className="space-y-4">
              {propertyPerformance.map((property) => (
                <Card key={property.propertyId} variant="filled" padding="md">
                  <Card.Title className="mb-2">{property.title}</Card.Title>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-architectural">Views:</span>
                      <span className="ml-2 font-medium">{property.views}</span>
                    </div>
                    <div>
                      <span className="text-architectural">Inquiries:</span>
                      <span className="ml-2 font-medium">{property.inquiries}</span>
                    </div>
                    <div>
                      <span className="text-architectural">Conversion:</span>
                      <span className="ml-2 font-medium">{property.conversionRate}%</span>
                    </div>
                    <div>
                      <span className="text-architectural">Revenue:</span>
                      <span className="ml-2 font-medium">${property.totalRevenue.toLocaleString()}</span>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <EmptyState
              title="No property performance data available"
              description="Performance metrics will appear here once you have property data."
              icon={
                <svg className="w-16 h-16 text-architectural" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              }
            />
          )}
        </Card>
      </div>
    </div>
  );
}

export default Analytics;

