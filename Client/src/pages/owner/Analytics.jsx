import { useState, useEffect } from 'react';
import { ownerAPI } from '../../services/api';

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
      <div className="min-h-screen bg-porcelain flex items-center justify-center">
        <p className="text-architectural text-lg">Loading analytics...</p>
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

        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {financialAnalytics && (
            <div className="bg-stone-100 rounded-xl shadow-md p-6">
              <h2 className="text-2xl font-semibold text-charcoal mb-4">Financial Overview</h2>
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
            </div>
          )}

          {tenantAnalytics && (
            <div className="bg-stone-100 rounded-xl shadow-md p-6">
              <h2 className="text-2xl font-semibold text-charcoal mb-4">Tenant Overview</h2>
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
            </div>
          )}
        </div>

        <div className="bg-stone-100 rounded-xl shadow-md p-6">
          <h2 className="text-2xl font-semibold text-charcoal mb-4">Property Performance</h2>
          {propertyPerformance.length > 0 ? (
            <div className="space-y-4">
              {propertyPerformance.map((property) => (
                <div key={property.propertyId} className="p-4 bg-porcelain rounded-lg">
                  <h3 className="font-semibold text-charcoal mb-2">{property.title}</h3>
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
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No property performance data available</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Analytics;

