import { useState, useEffect } from 'react';
import { adminAPI } from '../../services/api';

function SystemAnalytics() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await adminAPI.getAnalytics();
      setAnalytics(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Loading analytics...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={loadAnalytics}
            className="px-4 py-2 bg-slate-700 text-white rounded-xl"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">System Analytics</h1>
          <p className="text-gray-600">Comprehensive system-wide statistics and metrics</p>
        </div>

        {analytics && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl shadow-md p-6">
              <h3 className="text-sm font-medium text-gray-600 mb-2">Total Users</h3>
              <p className="text-4xl font-bold text-slate-700">{analytics.totalUsers}</p>
              <p className="text-sm text-gray-500 mt-2">
                {analytics.propertyManagers} Property Managers, {analytics.vendors} Vendors
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-md p-6">
              <h3 className="text-sm font-medium text-gray-600 mb-2">Total Properties</h3>
              <p className="text-4xl font-bold text-slate-700">{analytics.totalProperties}</p>
              <p className="text-sm text-gray-500 mt-2">
                {analytics.activeProperties} Active
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-md p-6">
              <h3 className="text-sm font-medium text-gray-600 mb-2">Total Tasks</h3>
              <p className="text-4xl font-bold text-slate-700">{analytics.totalTasks}</p>
              <p className="text-sm text-gray-500 mt-2">
                {analytics.completedTasks} Completed, {analytics.pendingTasks} Pending
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-md p-6">
              <h3 className="text-sm font-medium text-gray-600 mb-2">Task Completion Rate</h3>
              <p className="text-4xl font-bold text-emerald-600">
                {analytics.totalTasks > 0 
                  ? Math.round((analytics.completedTasks / analytics.totalTasks) * 100) 
                  : 0}%
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-md p-6">
              <h3 className="text-sm font-medium text-gray-600 mb-2">Pending Tasks</h3>
              <p className="text-4xl font-bold text-yellow-600">{analytics.pendingTasks}</p>
            </div>

            <div className="bg-white rounded-2xl shadow-md p-6">
              <h3 className="text-sm font-medium text-gray-600 mb-2">In Progress Tasks</h3>
              <p className="text-4xl font-bold text-blue-600">{analytics.inProgressTasks}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default SystemAnalytics;

