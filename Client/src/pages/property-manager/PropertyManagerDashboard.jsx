import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { propertyManagerAPI } from '../../services/api';
import MetricCard from '../../components/ui/MetricCard';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Skeleton from '../../components/ui/Skeleton';
import ErrorDisplay from '../../components/ui/ErrorDisplay';

function PropertyManagerDashboard() {
  const [properties, setProperties] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [reports, setReports] = useState(null);
  const [subscriptions, setSubscriptions] = useState([]);
  const [revenue, setRevenue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError('');
    try {
      const [propertiesData, vendorsData, tasksData, reportsData] = await Promise.all([
        propertyManagerAPI.getProperties(),
        propertyManagerAPI.getVendors(),
        propertyManagerAPI.getTasks(),
        propertyManagerAPI.getReports()
      ]);
      setProperties(propertiesData);
      setVendors(vendorsData);
      setTasks(tasksData);
      setReports(reportsData);

      // Load subscriptions and revenue separately to avoid blocking dashboard
      try {
        const subscriptionsData = await propertyManagerAPI.getMySubscriptions();
        setSubscriptions(subscriptionsData);
      } catch (err) {
        console.error('Failed to load subscriptions:', err);
        setSubscriptions([]);
      }

      try {
        const revenueData = await propertyManagerAPI.getSubscriptionRevenue();
        setRevenue(revenueData);
      } catch (err) {
        console.error('Failed to load revenue:', err);
        setRevenue(null);
      }
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
          <Skeleton variant="heading" width="300px" className="mb-4" />
          <Skeleton variant="text" width="400px" className="mb-8" />
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6">
            <Skeleton.MetricCard />
            <Skeleton.MetricCard />
            <Skeleton.MetricCard />
            <Skeleton.MetricCard />
            <Skeleton.MetricCard />
            <Skeleton.MetricCard />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-bold text-[var(--ui-text-primary)] mb-1">Property Manager Dashboard</h1>
        <p className="text-[var(--ui-text-secondary)] text-sm">Overview of your properties, vendors, and tasks</p>
      </div>

      {error && (
        <ErrorDisplay
          title="Failed to load dashboard"
          message={error}
          onRetry={loadData}
          className="mb-6"
        />
      )}

      {/* Stats Grid */}
      {reports && (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-8">
          <MetricCard
            title="Properties"
            value={reports.totalProperties}
            variant="primary"
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            }
          />
          <MetricCard
            title="Total Tasks"
            value={reports.totalTasks}
            variant="default"
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            }
          />
          <MetricCard
            title="Completed"
            value={reports.completedTasks}
            variant="success"
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
          />
          <MetricCard
            title="Pending"
            value={reports.pendingTasks}
            variant="accent"
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
          />
          <MetricCard
            title="Active Subscriptions"
            value={subscriptions.filter(s => s.status === 'active').length}
            subtitle={<Link to="/property-manager/subscriptions" className="text-xs hover:underline">View →</Link>}
            variant="primary"
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            }
          />
          <MetricCard
            title="Total Revenue"
            value={`₹${revenue?.totalRevenue ? revenue.totalRevenue.toLocaleString() : '0'}`}
            subtitle={<Link to="/property-manager/revenue" className="text-xs hover:underline">Details →</Link>}
            variant="success"
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
          />
        </div>
      )}

      {/* New Subscriptions Alert */}
      {subscriptions.filter(s => s.status === 'active').length > 0 && (
        <Card variant="outlined" padding="md" className="mb-6 border-obsidian-500 bg-obsidian-50">
          <div className="flex justify-between items-center">
            <div>
              <p className="font-semibold text-obsidian-900">You have {subscriptions.filter(s => s.status === 'active').length} active subscription(s)</p>
              <p className="text-sm text-obsidian-700">Manage your subscriptions and contact owners</p>
            </div>
            <Link to="/property-manager/subscriptions">
              <Button variant="primary" size="sm">View Subscriptions</Button>
            </Link>
          </div>
        </Card>
      )}

      {/* Quick Actions */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <Link to="/property-manager/properties" className="block">
          <Card variant="elevated" padding="lg" hover>
            <Card.Title>Manage Properties</Card.Title>
            <Card.Description>View and manage assigned properties</Card.Description>
          </Card>
        </Link>
        <Link to="/property-manager/vendors" className="block">
          <Card variant="elevated" padding="lg" hover>
            <Card.Title>Manage Vendors</Card.Title>
            <Card.Description>Create and manage vendors</Card.Description>
          </Card>
        </Link>
        <Link to="/property-manager/subscriptions" className="block">
          <Card variant="elevated" padding="lg" hover>
            <Card.Title>My Subscriptions</Card.Title>
            <Card.Description>View subscription assignments</Card.Description>
          </Card>
        </Link>
        <Link to="/property-manager/tasks" className="block">
          <Card variant="elevated" padding="lg" hover>
            <Card.Title>Task Management</Card.Title>
            <Card.Description>Create and track tasks</Card.Description>
          </Card>
        </Link>
      </div>

      {/* Recent Tasks */}
      <Card variant="elevated" padding="lg" className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <Card.Title>Recent Tasks</Card.Title>
          <Link
            to="/property-manager/tasks"
            className="text-obsidian-500 font-semibold hover:text-obsidian-600 hover:underline transition-colors"
          >
            View All →
          </Link>
        </div>
        <Card.Body>
          {tasks.length === 0 ? (
            <p className="text-architectural text-center py-4">No tasks yet. Create one to get started.</p>
          ) : (
            <div className="space-y-3">
              {tasks.slice(0, 5).map((task) => (
                <Card key={task.id} variant="filled" padding="sm" hover>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-charcoal">{task.title}</p>
                      <p className="text-sm text-architectural">Property ID: {task.propertyId}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${task.status === 'completed' ? 'bg-eucalyptus-100 text-eucalyptus-700' :
                      task.status === 'in_progress' ? 'bg-obsidian-100 text-obsidian-700' :
                        'bg-warning-100 text-warning-700'
                      }`}>
                      {task.status}
                    </span>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </Card.Body>
      </Card>

      {/* Vendors List */}
      <Card variant="elevated" padding="lg">
        <div className="flex justify-between items-center mb-6">
          <Card.Title>Vendors</Card.Title>
          <Link to="/property-manager/vendors">
            <Button variant="primary" size="sm">Manage All</Button>
          </Link>
        </div>
        <Card.Body>
          {vendors.length === 0 ? (
            <p className="text-architectural text-center py-4">No vendors yet. Create one to get started.</p>
          ) : (
            <div className="space-y-3">
              {vendors.slice(0, 5).map((vendor) => (
                <Card key={vendor.id} variant="filled" padding="sm" hover>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-charcoal">{vendor.companyName}</p>
                      <p className="text-sm text-architectural">{vendor.contactName}</p>
                      <p className="text-sm text-architectural">{vendor.serviceTypes.join(', ')}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${vendor.status === 'active' ? 'bg-eucalyptus-100 text-eucalyptus-700' :
                      'bg-warning-100 text-warning-700'
                      }`}>
                      {vendor.status}
                    </span>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </Card.Body>
      </Card>
    </div>
  );
}

export default PropertyManagerDashboard;

