import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { propertyManagerAPI } from '../../services/api';

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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Property Manager Dashboard</h1>
          <p className="text-gray-600">Overview of your properties, vendors, and tasks</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-error/20 border border-error text-error rounded-lg">
            {error}
          </div>
        )}

        {/* Stats Grid */}
        {reports && (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-8">
            <div className="bg-white rounded-2xl shadow-md p-6">
              <h3 className="text-sm font-medium text-gray-600 mb-2">Properties</h3>
              <p className="text-3xl font-bold text-slate-700">{reports.totalProperties}</p>
            </div>
            <div className="bg-white rounded-2xl shadow-md p-6">
              <h3 className="text-sm font-medium text-gray-600 mb-2">Total Tasks</h3>
              <p className="text-3xl font-bold text-slate-700">{reports.totalTasks}</p>
            </div>
            <div className="bg-white rounded-2xl shadow-md p-6">
              <h3 className="text-sm font-medium text-gray-600 mb-2">Completed</h3>
              <p className="text-3xl font-bold text-eucalyptus">{reports.completedTasks}</p>
            </div>
            <div className="bg-white rounded-2xl shadow-md p-6">
              <h3 className="text-sm font-medium text-gray-600 mb-2">Pending</h3>
              <p className="text-3xl font-bold text-warning">{reports.pendingTasks}</p>
            </div>
            <div className="bg-white rounded-2xl shadow-md p-6">
              <h3 className="text-sm font-medium text-gray-600 mb-2">Active Subscriptions</h3>
              <p className="text-3xl font-bold text-slate-700">
                {subscriptions.filter(s => s.status === 'active').length}
              </p>
              <Link to="/property-manager/subscriptions" className="text-xs text-blue-600 mt-1 hover:underline block">
                View →
              </Link>
            </div>
            <div className="bg-white rounded-2xl shadow-md p-6">
              <h3 className="text-sm font-medium text-gray-600 mb-2">Total Revenue</h3>
              <p className="text-3xl font-bold text-eucalyptus">
                ${revenue?.totalRevenue ? revenue.totalRevenue.toLocaleString() : '0'}
              </p>
              <Link to="/property-manager/revenue" className="text-xs text-blue-600 mt-1 hover:underline block">
                Details →
              </Link>
            </div>
          </div>
        )}

        {/* New Subscriptions Alert */}
        {subscriptions.filter(s => s.status === 'active').length > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-semibold text-blue-900">You have {subscriptions.filter(s => s.status === 'active').length} active subscription(s)</p>
                <p className="text-sm text-blue-700">Manage your subscriptions and contact owners</p>
              </div>
              <Link
                to="/property-manager/subscriptions"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
              >
                View Subscriptions
              </Link>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Link
            to="/property-manager/properties"
            className="bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition-shadow"
          >
            <h3 className="text-xl font-semibold mb-2 text-slate-700">Manage Properties</h3>
            <p className="text-gray-600">View and manage assigned properties</p>
          </Link>
          <Link
            to="/property-manager/vendors"
            className="bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition-shadow"
          >
            <h3 className="text-xl font-semibold mb-2 text-slate-700">Manage Vendors</h3>
            <p className="text-gray-600">Create and manage vendors</p>
          </Link>
          <Link
            to="/property-manager/subscriptions"
            className="bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition-shadow"
          >
            <h3 className="text-xl font-semibold mb-2 text-slate-700">My Subscriptions</h3>
            <p className="text-gray-600">View subscription assignments</p>
          </Link>
          <Link
            to="/property-manager/tasks"
            className="bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition-shadow"
          >
            <h3 className="text-xl font-semibold mb-2 text-slate-700">Task Management</h3>
            <p className="text-gray-600">Create and track tasks</p>
          </Link>
        </div>

        {/* Recent Tasks */}
        <div className="bg-white rounded-2xl shadow-md p-6 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Recent Tasks</h2>
            <Link
              to="/property-manager/tasks"
              className="text-slate-700 font-semibold hover:underline"
            >
              View All
            </Link>
          </div>
          {tasks.length === 0 ? (
            <p className="text-gray-600">No tasks yet. Create one to get started.</p>
          ) : (
            <div className="space-y-4">
              {tasks.slice(0, 5).map((task) => (
                <div key={task.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <h3 className="font-semibold text-gray-900">{task.title}</h3>
                    <p className="text-sm text-gray-600">Property ID: {task.propertyId}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    task.status === 'completed' ? 'bg-eucalyptus/20 text-eucalyptus' :
                    task.status === 'in_progress' ? 'bg-obsidian/20 text-obsidian-500' :
                    'bg-warning/20 text-warning'
                  }`}>
                    {task.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Vendors List */}
        <div className="bg-white rounded-2xl shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Vendors</h2>
            <Link
              to="/property-manager/vendors"
              className="px-4 py-2 bg-obsidian text-porcelain rounded-xl hover:bg-obsidian-600 transition-colors"
            >
              Manage All
            </Link>
          </div>
          {vendors.length === 0 ? (
            <p className="text-gray-600">No vendors yet. Create one to get started.</p>
          ) : (
            <div className="space-y-4">
              {vendors.slice(0, 5).map((vendor) => (
                <div key={vendor.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <h3 className="font-semibold text-gray-900">{vendor.companyName}</h3>
                    <p className="text-sm text-gray-600">{vendor.contactName}</p>
                    <p className="text-sm text-gray-500">{vendor.serviceTypes.join(', ')}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    vendor.status === 'active' ? 'bg-eucalyptus/20 text-eucalyptus' :
                    'bg-warning/20 text-warning'
                  }`}>
                    {vendor.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default PropertyManagerDashboard;

