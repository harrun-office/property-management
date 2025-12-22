import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ownerAPI } from '../../services/api';

function OwnerDashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadDashboard();
    loadSubscriptions();
  }, []);

  const loadDashboard = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await ownerAPI.getDashboard();
      setDashboardData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadSubscriptions = async () => {
    try {
      const data = await ownerAPI.getMySubscriptions();
      setSubscriptions(data);
    } catch (err) {
      // Silently fail for subscriptions
      console.error('Failed to load subscriptions:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-porcelain flex items-center justify-center">
        <p className="text-architectural text-lg">Loading dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-porcelain flex items-center justify-center">
        <div className="text-center">
          <p className="text-error text-lg mb-4">{error}</p>
          <button
            onClick={loadDashboard}
            className="px-4 py-2 bg-obsidian-500 text-porcelain rounded-lg hover:bg-obsidian-600 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const { metrics, recentActivity, topProperties } = dashboardData || {};

  return (
    <div className="min-h-screen bg-porcelain py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-charcoal mb-2">Dashboard</h1>
          <p className="text-architectural">Welcome back! Here's an overview of your properties.</p>
        </div>

        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-stone-100 rounded-xl shadow-md p-6 border border-stone-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-architectural text-sm mb-1">Total Properties</p>
                <p className="text-3xl font-bold text-charcoal">{metrics?.totalProperties || 0}</p>
                <p className="text-xs text-stone-600 mt-1">
                  {metrics?.activeProperties || 0} active, {metrics?.vacantProperties || 0} vacant
                </p>
              </div>
              <div className="w-12 h-12 bg-obsidian-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-obsidian-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-stone-100 rounded-xl shadow-md p-6 border border-stone-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-architectural text-sm mb-1">Monthly Income</p>
                <p className="text-3xl font-bold text-brass-500">${(metrics?.monthlyIncome || 0).toLocaleString()}</p>
                <p className="text-xs text-eucalyptus-500 mt-1">Current month</p>
              </div>
              <div className="w-12 h-12 bg-brass-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-brass-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-stone-100 rounded-xl shadow-md p-6 border border-stone-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-architectural text-sm mb-1">Occupancy Rate</p>
                <p className="text-3xl font-bold text-charcoal">{metrics?.occupancyRate || 0}%</p>
                <p className="text-xs text-stone-600 mt-1">Properties occupied</p>
              </div>
              <div className="w-12 h-12 bg-eucalyptus-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-eucalyptus-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-stone-100 rounded-xl shadow-md p-6 border border-stone-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-architectural text-sm mb-1">Pending Applications</p>
                <p className="text-3xl font-bold text-charcoal">{metrics?.pendingApplications || 0}</p>
                <Link to="/owner/applications" className="text-xs text-brass-500 mt-1 hover:text-brass-600 transition-colors">
                  Review now →
                </Link>
              </div>
              <div className="w-12 h-12 bg-warning/20 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-warning" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-stone-100 rounded-xl shadow-md p-6 border border-stone-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-architectural text-sm mb-1">Upcoming Rent Due</p>
                <p className="text-3xl font-bold text-charcoal">{metrics?.upcomingRentDue || 0}</p>
                <p className="text-xs text-stone-600 mt-1">Next 30 days</p>
              </div>
              <div className="w-12 h-12 bg-brass-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-brass-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-stone-100 rounded-xl shadow-md p-6 border border-stone-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-architectural text-sm mb-1">Maintenance Requests</p>
                <p className="text-3xl font-bold text-charcoal">{metrics?.openMaintenanceRequests || 0}</p>
                <Link to="/owner/maintenance" className="text-xs text-obsidian-500 mt-1 hover:text-brass-500 transition-colors">
                  View all →
                </Link>
              </div>
              <div className="w-12 h-12 bg-error/20 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-error" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-stone-100 rounded-xl shadow-md p-6 border border-stone-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-architectural text-sm mb-1">Active Subscriptions</p>
                <p className="text-3xl font-bold text-charcoal">
                  {subscriptions.filter(s => s.status === 'active').length}
                </p>
                <Link to="/owner/subscriptions" className="text-xs text-obsidian-500 mt-1 hover:text-brass-500 transition-colors">
                  Manage →
                </Link>
              </div>
              <div className="w-12 h-12 bg-obsidian-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-obsidian-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Subscription Summary */}
        {subscriptions.filter(s => s.status === 'active').length > 0 && (
          <div className="bg-stone-100 rounded-xl shadow-md p-6 border border-stone-200 mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-charcoal">Active Subscriptions</h2>
              <Link to="/owner/subscriptions" className="text-obsidian hover:text-brass transition-colors text-sm font-medium">
                View All →
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {subscriptions.filter(s => s.status === 'active').slice(0, 3).map((subscription) => (
                <div key={subscription.id} className="bg-porcelain p-4 rounded-lg border border-stone-200">
                  <p className="font-semibold text-charcoal mb-1">{subscription.manager?.name || 'Manager'}</p>
                  <p className="text-sm text-architectural mb-2">{subscription.property?.title || 'Property'}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-architectural">${subscription.monthlyFee}/mo</span>
                    {subscription.nextPayment && (
                      <span className="text-xs text-architectural">
                        Due {new Date(subscription.nextPayment.dueDate).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="bg-stone-100 rounded-xl shadow-md p-6 mb-8 border border-stone-200">
          <h2 className="text-2xl font-bold text-charcoal mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
            <Link
              to="/owner/properties/new"
              className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-stone-300 rounded-lg hover:border-obsidian-500 hover:bg-stone-200 transition-colors"
            >
              <svg className="w-8 h-8 text-architectural mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <span className="text-sm font-medium text-charcoal">Post Property</span>
            </Link>
            <Link
              to="/owner/properties"
              className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-stone-300 rounded-lg hover:border-obsidian-500 hover:bg-stone-200 transition-colors"
            >
              <svg className="w-8 h-8 text-architectural mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              <span className="text-sm font-medium text-charcoal">My Properties</span>
            </Link>
            <Link
              to="/owner/applications"
              className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-stone-300 rounded-lg hover:border-obsidian-500 hover:bg-stone-200 transition-colors"
            >
              <svg className="w-8 h-8 text-architectural mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span className="text-sm font-medium text-charcoal">Applications</span>
            </Link>
            <Link
              to="/owner/payments"
              className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-stone-300 rounded-lg hover:border-obsidian-500 hover:bg-stone-200 transition-colors"
            >
              <svg className="w-8 h-8 text-architectural mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-sm font-medium text-charcoal">Payments</span>
            </Link>
            <Link
              to="/owner/messages"
              className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-stone-300 rounded-lg hover:border-obsidian-500 hover:bg-stone-200 transition-colors"
            >
              <svg className="w-8 h-8 text-architectural mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <span className="text-sm font-medium text-charcoal">Messages</span>
            </Link>
            <Link
              to="/owner/managers"
              className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-stone-300 rounded-lg hover:border-obsidian-500 hover:bg-stone-200 transition-colors"
            >
              <svg className="w-8 h-8 text-architectural mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span className="text-sm font-medium text-charcoal">Hire Manager</span>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Activity */}
          <div className="bg-stone-100 rounded-xl shadow-md p-6 border border-stone-200">
            <h2 className="text-2xl font-bold text-charcoal mb-4">Recent Activity</h2>
            {recentActivity && recentActivity.length > 0 ? (
              <div className="space-y-3">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-start p-3 bg-porcelain rounded-lg">
                    <div className="flex-shrink-0 w-2 h-2 bg-obsidian-500 rounded-full mt-2 mr-3"></div>
                    <div className="flex-1">
                      <p className="text-sm text-charcoal">{activity.message}</p>
                      <p className="text-xs text-stone-600 mt-1">
                        {new Date(activity.timestamp).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-architectural text-sm">No recent activity</p>
            )}
          </div>

          {/* Top Properties */}
          <div className="bg-stone-100 rounded-xl shadow-md p-6 border border-stone-200">
            <h2 className="text-2xl font-bold text-charcoal mb-4">Top Properties</h2>
            {topProperties && topProperties.length > 0 ? (
              <div className="space-y-3">
                {topProperties.map((property) => (
                  <Link
                    key={property.id}
                    to={`/owner/properties`}
                    className="flex items-center justify-between p-3 bg-porcelain rounded-lg hover:bg-stone-200 transition-colors"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-charcoal">{property.title}</p>
                      <p className="text-sm text-architectural">{property.address}</p>
                      <div className="flex items-center gap-4 mt-1">
                        <span className="text-xs text-stone-600">{property.views} views</span>
                        <span className="text-xs text-stone-600">{property.inquiries} inquiries</span>
                        <span className="text-xs text-stone-600">{property.applications} applications</span>
                      </div>
                    </div>
                    <div className="ml-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        property.status === 'active' ? 'bg-eucalyptus-100 text-eucalyptus-700' :
                        property.status === 'rented' ? 'bg-obsidian-100 text-obsidian-700' :
                        'bg-stone-200 text-stone-700'
                      }`}>
                        {property.status}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-architectural text-sm mb-4">No properties yet</p>
                <Link
                  to="/owner/properties/new"
                  className="inline-block px-4 py-2 bg-obsidian-500 text-porcelain rounded-lg hover:bg-obsidian-600 transition-colors"
                >
                  Post Your First Property
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default OwnerDashboard;

