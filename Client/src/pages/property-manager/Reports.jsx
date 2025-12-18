import { useState, useEffect } from 'react';
import { propertyManagerAPI } from '../../services/api';

function Reports() {
  const [reports, setReports] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await propertyManagerAPI.getReports();
      setReports(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Loading reports...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={loadReports}
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
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Reports</h1>
          <p className="text-gray-600">View performance and analytics reports</p>
        </div>

        {reports && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl shadow-md p-6">
              <h3 className="text-sm font-medium text-gray-600 mb-2">Total Properties</h3>
              <p className="text-4xl font-bold text-slate-700">{reports.totalProperties}</p>
            </div>

            <div className="bg-white rounded-2xl shadow-md p-6">
              <h3 className="text-sm font-medium text-gray-600 mb-2">Total Tasks</h3>
              <p className="text-4xl font-bold text-slate-700">{reports.totalTasks}</p>
            </div>

            <div className="bg-white rounded-2xl shadow-md p-6">
              <h3 className="text-sm font-medium text-gray-600 mb-2">Completed Tasks</h3>
              <p className="text-4xl font-bold text-emerald-600">{reports.completedTasks}</p>
              <p className="text-sm text-gray-500 mt-2">
                {reports.totalTasks > 0 
                  ? Math.round((reports.completedTasks / reports.totalTasks) * 100) 
                  : 0}% completion rate
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-md p-6">
              <h3 className="text-sm font-medium text-gray-600 mb-2">Pending Tasks</h3>
              <p className="text-4xl font-bold text-yellow-600">{reports.pendingTasks}</p>
            </div>

            <div className="bg-white rounded-2xl shadow-md p-6">
              <h3 className="text-sm font-medium text-gray-600 mb-2">In Progress Tasks</h3>
              <p className="text-4xl font-bold text-blue-600">{reports.inProgressTasks}</p>
            </div>

            <div className="bg-white rounded-2xl shadow-md p-6">
              <h3 className="text-sm font-medium text-gray-600 mb-2">Tasks by Priority</h3>
              <div className="mt-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">High:</span>
                  <span className="font-semibold text-red-600">{reports.tasksByPriority?.high || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Medium:</span>
                  <span className="font-semibold text-yellow-600">{reports.tasksByPriority?.medium || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Low:</span>
                  <span className="font-semibold text-gray-600">{reports.tasksByPriority?.low || 0}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Reports;

