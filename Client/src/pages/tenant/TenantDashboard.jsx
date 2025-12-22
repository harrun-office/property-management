import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { tenantAPI, propertiesAPI } from '../../services/api';
import PropertyCard from '../../components/PropertyCard';

function TenantDashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const [recentProperties, setRecentProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    setError('');
    try {
      const dashboard = await tenantAPI.getDashboard();
      setDashboardData(dashboard);
      
      // Only load properties if tenant doesn't have an active property
      if (!dashboard.currentProperty) {
        try {
          const properties = await propertiesAPI.getAll({ limit: 6 });
          setRecentProperties(properties);
        } catch (err) {
          console.error('Failed to load properties:', err);
          setRecentProperties([]);
        }
      } else {
        setRecentProperties([]);
      }
    } catch (err) {
      setError(err.message || 'Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-porcelain flex items-center justify-center">
        <p className="text-charcoal text-lg">Loading dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-porcelain flex items-center justify-center">
        <div className="text-center">
          <p className="text-error text-lg mb-4">{error}</p>
          <button
            onClick={loadDashboardData}
            className="px-4 py-2 bg-obsidian text-porcelain rounded-lg hover:bg-obsidian-light transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const { metrics, currentProperty, upcomingPayments, recentMessages, activeMaintenance } = dashboardData || {};

  return (
    <div className="min-h-screen bg-porcelain py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-charcoal mb-2">Tenant Dashboard</h1>
          <p className="text-architectural">Welcome back! Here's your property management overview.</p>
        </div>

        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-stone-100 rounded-xl shadow-md p-6 border border-stone-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-architectural text-sm mb-1">Upcoming Rent</p>
                <p className="text-3xl font-bold text-charcoal">
                  ${metrics?.upcomingRent ? metrics.upcomingRent.toLocaleString() : '0'}
                </p>
                {metrics?.nextDueDate && (
                  <p className="text-xs text-stone-600 mt-1">
                    Due {new Date(metrics.nextDueDate).toLocaleDateString()}
                  </p>
                )}
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
                <p className="text-architectural text-sm mb-1">Unread Messages</p>
                <p className="text-3xl font-bold text-charcoal">{metrics?.unreadMessages || 0}</p>
                <p className="text-xs text-stone-600 mt-1">New messages</p>
              </div>
              <div className="w-12 h-12 bg-obsidian-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-obsidian-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-stone-100 rounded-xl shadow-md p-6 border border-stone-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-architectural text-sm mb-1">Pending Maintenance</p>
                <p className="text-3xl font-bold text-charcoal">{metrics?.pendingMaintenance || 0}</p>
                <p className="text-xs text-stone-600 mt-1">Active requests</p>
              </div>
              <div className="w-12 h-12 bg-warning-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-warning-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-stone-100 rounded-xl shadow-md p-6 border border-stone-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-architectural text-sm mb-1">Total Paid</p>
                <p className="text-3xl font-bold text-eucalyptus">
                  ${metrics?.totalPaid ? metrics.totalPaid.toLocaleString() : '0'}
                </p>
                <p className="text-xs text-stone-600 mt-1">All time</p>
              </div>
              <div className="w-12 h-12 bg-eucalyptus-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-eucalyptus-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Current Property Card */}
        {currentProperty && (
          <div className="bg-stone-100 rounded-xl shadow-md p-6 border border-stone-200 mb-8">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-2xl font-bold text-charcoal mb-2">Current Property</h2>
                <h3 className="text-xl font-semibold text-obsidian">{currentProperty.title}</h3>
                <p className="text-architectural mt-1">{currentProperty.address}</p>
                <p className="text-charcoal font-semibold mt-2">${currentProperty.monthlyRent}/month</p>
              </div>
              <Link
                to="/tenant/lease"
                className="px-4 py-2 bg-obsidian text-porcelain rounded-lg hover:bg-obsidian-light transition-colors"
              >
                View Lease
              </Link>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Upcoming Payments */}
          <div className="bg-stone-100 rounded-xl shadow-md p-6 border border-stone-200">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-charcoal">Upcoming Payments</h2>
              <Link to="/tenant/payments" className="text-obsidian hover:text-brass transition-colors text-sm font-medium">
                View All →
              </Link>
            </div>
            {upcomingPayments && upcomingPayments.length > 0 ? (
              <div className="space-y-3">
                {upcomingPayments.map((payment) => (
                  <div key={payment.id} className="bg-porcelain p-4 rounded-lg border border-stone-200">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-semibold text-charcoal">${payment.amount.toLocaleString()}</p>
                        <p className="text-sm text-architectural">
                          Due {new Date(payment.dueDate).toLocaleDateString()}
                        </p>
                      </div>
                      <span className="px-3 py-1 bg-warning/20 text-warning rounded-full text-xs font-semibold">
                        {payment.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-architectural text-center py-4">No upcoming payments</p>
            )}
          </div>

          {/* Recent Messages */}
          <div className="bg-stone-100 rounded-xl shadow-md p-6 border border-stone-200">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-charcoal">Recent Messages</h2>
              <Link to="/tenant/messages" className="text-obsidian hover:text-brass transition-colors text-sm font-medium">
                View All →
              </Link>
            </div>
            {recentMessages && recentMessages.length > 0 ? (
              <div className="space-y-3">
                {recentMessages.map((message) => (
                  <div key={message.id} className="bg-porcelain p-4 rounded-lg border border-stone-200">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <p className="font-semibold text-charcoal">{message.sender?.name || 'Unknown'}</p>
                        <p className="text-sm text-architectural truncate">{message.message}</p>
                        <p className="text-xs text-architectural mt-1">
                          {new Date(message.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      {!message.read && (
                        <span className="w-2 h-2 bg-obsidian rounded-full"></span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-architectural text-center py-4">No messages</p>
            )}
          </div>
        </div>

        {/* Active Maintenance Requests */}
        <div className="bg-stone-100 rounded-xl shadow-md p-6 border border-stone-200 mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-charcoal">Active Maintenance Requests</h2>
            <Link to="/tenant/maintenance" className="text-obsidian hover:text-brass transition-colors text-sm font-medium">
              View All →
            </Link>
          </div>
          {activeMaintenance && activeMaintenance.length > 0 ? (
            <div className="space-y-3">
              {activeMaintenance.map((request) => (
                <div key={request.id} className="bg-porcelain p-4 rounded-lg border border-stone-200">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <p className="font-semibold text-charcoal">{request.title}</p>
                      <p className="text-sm text-architectural mt-1">{request.description}</p>
                      <p className="text-xs text-architectural mt-2">
                        {new Date(request.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      request.status === 'in_progress' ? 'bg-warning/20 text-warning' :
                      request.status === 'completed' ? 'bg-eucalyptus/20 text-eucalyptus' :
                      'bg-architectural/20 text-architectural'
                    }`}>
                      {request.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-architectural text-center py-4">No active maintenance requests</p>
          )}
        </div>

        {/* Recent Properties - Only show if tenant doesn't have an active property */}
        {!currentProperty && (
          <section className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-charcoal">Browse Properties</h2>
              <Link to="/properties" className="text-obsidian hover:text-brass transition-colors font-medium">
                View All →
              </Link>
            </div>
            {recentProperties.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recentProperties.map((property) => (
                  <PropertyCard key={property.id} property={property} />
                ))}
              </div>
            ) : (
              <div className="bg-stone-100 p-8 rounded-xl text-center border border-stone-200">
                <p className="text-architectural">No properties found. Start browsing!</p>
                <Link to="/properties" className="mt-4 inline-block px-6 py-2 bg-obsidian text-porcelain rounded-lg hover:bg-obsidian-light transition-colors">
                  Browse Properties
                </Link>
              </div>
            )}
          </section>
        )}

        {/* Quick Actions */}
        <section>
          <h2 className="text-2xl font-bold text-charcoal mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link to="/tenant/payments" className="bg-stone-100 p-6 rounded-xl border border-stone-200 hover:border-brass transition-colors">
              <h3 className="font-semibold text-charcoal mb-2">Payments</h3>
              <p className="text-sm text-architectural">View payment history</p>
            </Link>
            <Link to="/tenant/messages" className="bg-stone-100 p-6 rounded-xl border border-stone-200 hover:border-brass transition-colors">
              <h3 className="font-semibold text-charcoal mb-2">Messages</h3>
              <p className="text-sm text-architectural">Contact property owner</p>
            </Link>
            <Link to="/tenant/maintenance" className="bg-stone-100 p-6 rounded-xl border border-stone-200 hover:border-brass transition-colors">
              <h3 className="font-semibold text-charcoal mb-2">Maintenance</h3>
              <p className="text-sm text-architectural">Request repairs</p>
            </Link>
            <Link to="/tenant/lease" className="bg-stone-100 p-6 rounded-xl border border-stone-200 hover:border-brass transition-colors">
              <h3 className="font-semibold text-charcoal mb-2">Lease</h3>
              <p className="text-sm text-architectural">View lease details</p>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}

export default TenantDashboard;
