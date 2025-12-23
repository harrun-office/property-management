import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { tenantAPI, propertiesAPI } from '../../services/api';
import PropertyCard from '../../components/PropertyCard';
import MetricCard from '../../components/ui/MetricCard';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Skeleton from '../../components/ui/Skeleton';
import ErrorDisplay from '../../components/ui/ErrorDisplay';

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
      <div className="min-h-screen bg-porcelain py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <Skeleton variant="heading" width="250px" className="mb-4" />
          <Skeleton variant="text" width="350px" className="mb-8" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Skeleton.MetricCard />
            <Skeleton.MetricCard />
            <Skeleton.MetricCard />
            <Skeleton.MetricCard />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-porcelain py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <ErrorDisplay
            title="Failed to load dashboard"
            message={error}
            onRetry={loadDashboardData}
          />
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
          <MetricCard
            title="Upcoming Rent"
            value={`$${metrics?.upcomingRent ? metrics.upcomingRent.toLocaleString() : '0'}`}
            subtitle={metrics?.nextDueDate ? `Due ${new Date(metrics.nextDueDate).toLocaleDateString()}` : 'No upcoming rent'}
            variant="accent"
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
          />
          <MetricCard
            title="Unread Messages"
            value={metrics?.unreadMessages || 0}
            subtitle="New messages"
            variant="primary"
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            }
          />
          <MetricCard
            title="Pending Maintenance"
            value={metrics?.pendingMaintenance || 0}
            subtitle="Active requests"
            variant="accent"
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            }
          />
          <MetricCard
            title="Total Paid"
            value={`$${metrics?.totalPaid ? metrics.totalPaid.toLocaleString() : '0'}`}
            subtitle="All time"
            variant="success"
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
          />
        </div>

        {/* Current Property Card */}
        {currentProperty && (
          <Card variant="elevated" padding="lg" className="mb-8">
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
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Upcoming Payments */}
          <Card variant="elevated" padding="lg">
            <div className="flex justify-between items-center mb-4">
              <Card.Title>Upcoming Payments</Card.Title>
              <Link to="/tenant/payments" className="text-obsidian hover:text-brass transition-colors text-sm font-medium">
                View All →
              </Link>
            </div>
            <Card.Body>
              {upcomingPayments && upcomingPayments.length > 0 ? (
                <div className="space-y-3">
                  {upcomingPayments.map((payment) => (
                    <Card key={payment.id} variant="filled" padding="sm">
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
                    </Card>
                  ))}
                </div>
              ) : (
                <p className="text-architectural text-center py-4">No upcoming payments</p>
              )}
            </Card.Body>
          </Card>

          {/* Recent Messages */}
          <Card variant="elevated" padding="lg">
            <div className="flex justify-between items-center mb-4">
              <Card.Title>Recent Messages</Card.Title>
              <Link to="/tenant/messages" className="text-obsidian hover:text-brass transition-colors text-sm font-medium">
                View All →
              </Link>
            </div>
            <Card.Body>
              {recentMessages && recentMessages.length > 0 ? (
                <div className="space-y-3">
                  {recentMessages.map((message) => (
                    <Card key={message.id} variant="filled" padding="sm" hover>
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
                    </Card>
                  ))}
                </div>
              ) : (
                <p className="text-architectural text-center py-4">No messages</p>
              )}
            </Card.Body>
          </Card>
        </div>

        {/* Active Maintenance Requests */}
        <Card variant="elevated" padding="lg" className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <Card.Title>Active Maintenance Requests</Card.Title>
            <Link to="/tenant/maintenance" className="text-obsidian hover:text-brass transition-colors text-sm font-medium">
              View All →
            </Link>
          </div>
          <Card.Body>
            {activeMaintenance && activeMaintenance.length > 0 ? (
              <div className="space-y-3">
                {activeMaintenance.map((request) => (
                  <Card key={request.id} variant="filled" padding="sm" hover>
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <p className="font-semibold text-charcoal">{request.title}</p>
                        <p className="text-sm text-architectural mt-1">{request.description}</p>
                        <p className="text-xs text-architectural mt-2">
                          {new Date(request.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        request.status === 'in_progress' ? 'bg-warning-100 text-warning-700' :
                        request.status === 'completed' ? 'bg-eucalyptus-100 text-eucalyptus-700' :
                        'bg-architectural/20 text-architectural'
                      }`}>
                        {request.status}
                      </span>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <p className="text-architectural text-center py-4">No active maintenance requests</p>
            )}
          </Card.Body>
        </Card>

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
