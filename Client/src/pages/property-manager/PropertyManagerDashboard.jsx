import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { propertyManagerAPI } from '../../services/api';

function PropertyManagerDashboard() {
  const [properties, setProperties] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [reports, setReports] = useState(null);
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
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {/* Stats Grid */}
        {reports && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
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
              <p className="text-3xl font-bold text-emerald-600">{reports.completedTasks}</p>
            </div>
            <div className="bg-white rounded-2xl shadow-md p-6">
              <h3 className="text-sm font-medium text-gray-600 mb-2">Pending</h3>
              <p className="text-3xl font-bold text-yellow-600">{reports.pendingTasks}</p>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
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
                    task.status === 'completed' ? 'bg-emerald-100 text-emerald-700' :
                    task.status === 'in_progress' ? 'bg-blue-100 text-blue-700' :
                    'bg-yellow-100 text-yellow-700'
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
              className="px-4 py-2 bg-slate-700 text-white rounded-xl hover:bg-slate-800 transition-colors"
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
                    vendor.status === 'active' ? 'bg-emerald-100 text-emerald-700' :
                    'bg-yellow-100 text-yellow-700'
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

