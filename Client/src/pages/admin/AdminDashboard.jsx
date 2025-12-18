import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminAPI } from '../../services/api';

function AdminDashboard() {
  const [analytics, setAnalytics] = useState(null);
  const [propertyManagers, setPropertyManagers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError('');
    try {
      const [analyticsData, managersData] = await Promise.all([
        adminAPI.getAnalytics(),
        adminAPI.getPropertyManagers()
      ]);
      setAnalytics(analyticsData);
      setPropertyManagers(managersData);
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
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Super Admin Dashboard</h1>
          <p className="text-gray-600">System overview and management</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {/* Stats Grid */}
        {analytics && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-2xl shadow-md p-6">
              <h3 className="text-sm font-medium text-gray-600 mb-2">Total Users</h3>
              <p className="text-3xl font-bold text-slate-700">{analytics.totalUsers}</p>
            </div>
            <div className="bg-white rounded-2xl shadow-md p-6">
              <h3 className="text-sm font-medium text-gray-600 mb-2">Property Managers</h3>
              <p className="text-3xl font-bold text-slate-700">{analytics.propertyManagers}</p>
            </div>
            <div className="bg-white rounded-2xl shadow-md p-6">
              <h3 className="text-sm font-medium text-gray-600 mb-2">Vendors</h3>
              <p className="text-3xl font-bold text-slate-700">{analytics.vendors}</p>
            </div>
            <div className="bg-white rounded-2xl shadow-md p-6">
              <h3 className="text-sm font-medium text-gray-600 mb-2">Total Properties</h3>
              <p className="text-3xl font-bold text-slate-700">{analytics.totalProperties}</p>
            </div>
            <div className="bg-white rounded-2xl shadow-md p-6">
              <h3 className="text-sm font-medium text-gray-600 mb-2">Total Tasks</h3>
              <p className="text-3xl font-bold text-slate-700">{analytics.totalTasks}</p>
            </div>
            <div className="bg-white rounded-2xl shadow-md p-6">
              <h3 className="text-sm font-medium text-gray-600 mb-2">Completed Tasks</h3>
              <p className="text-3xl font-bold text-emerald-600">{analytics.completedTasks}</p>
            </div>
            <div className="bg-white rounded-2xl shadow-md p-6">
              <h3 className="text-sm font-medium text-gray-600 mb-2">Pending Tasks</h3>
              <p className="text-3xl font-bold text-yellow-600">{analytics.pendingTasks}</p>
            </div>
            <div className="bg-white rounded-2xl shadow-md p-6">
              <h3 className="text-sm font-medium text-gray-600 mb-2">In Progress</h3>
              <p className="text-3xl font-bold text-blue-600">{analytics.inProgressTasks}</p>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Link
            to="/admin/property-managers"
            className="bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition-shadow"
          >
            <h3 className="text-xl font-semibold mb-2 text-slate-700">Manage Property Managers</h3>
            <p className="text-gray-600">Create, assign, and manage property managers</p>
          </Link>
          <Link
            to="/admin/audit-logs"
            className="bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition-shadow"
          >
            <h3 className="text-xl font-semibold mb-2 text-slate-700">View Audit Logs</h3>
            <p className="text-gray-600">Monitor all system activities and changes</p>
          </Link>
          <Link
            to="/admin/settings"
            className="bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition-shadow"
          >
            <h3 className="text-xl font-semibold mb-2 text-slate-700">System Settings</h3>
            <p className="text-gray-600">Configure global settings and permissions</p>
          </Link>
        </div>

        {/* Property Managers List */}
        <div className="bg-white rounded-2xl shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Property Managers</h2>
            <Link
              to="/admin/property-managers"
              className="px-4 py-2 bg-slate-700 text-white rounded-xl hover:bg-slate-800 transition-colors"
            >
              Manage All
            </Link>
          </div>
          {propertyManagers.length === 0 ? (
            <p className="text-gray-600">No property managers yet. Create one to get started.</p>
          ) : (
            <div className="space-y-4">
              {propertyManagers.slice(0, 5).map((manager) => (
                <div key={manager.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <h3 className="font-semibold text-gray-900">{manager.name}</h3>
                    <p className="text-sm text-gray-600">{manager.email}</p>
                    <p className="text-sm text-gray-500">
                      {manager.assignedProperties?.length || 0} properties assigned
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    manager.status === 'active' ? 'bg-emerald-100 text-emerald-700' :
                    manager.status === 'suspended' ? 'bg-red-100 text-red-700' :
                    'bg-yellow-100 text-yellow-700'
                  }`}>
                    {manager.status}
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

export default AdminDashboard;

