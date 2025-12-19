import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { vendorAPI } from '../../services/api';

function VendorDashboard() {
  const [properties, setProperties] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError('');
    try {
      const [propertiesData, tasksData, profileData] = await Promise.all([
        vendorAPI.getProperties(),
        vendorAPI.getTasks(),
        vendorAPI.getProfile()
      ]);
      setProperties(propertiesData);
      setTasks(tasksData);
      setProfile(profileData);
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

  const completedTasks = tasks.filter(t => t.status === 'completed').length;
  const pendingTasks = tasks.filter(t => t.status === 'pending').length;
  const inProgressTasks = tasks.filter(t => t.status === 'in_progress').length;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Vendor Dashboard</h1>
          <p className="text-gray-600">Welcome, {profile?.companyName || 'Vendor'}</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-error/20 border border-error text-error rounded-lg">
            {error}
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-md p-6">
            <h3 className="text-sm font-medium text-gray-600 mb-2">Assigned Properties</h3>
            <p className="text-3xl font-bold text-slate-700">{properties.length}</p>
          </div>
          <div className="bg-white rounded-2xl shadow-md p-6">
            <h3 className="text-sm font-medium text-gray-600 mb-2">Total Tasks</h3>
            <p className="text-3xl font-bold text-slate-700">{tasks.length}</p>
          </div>
          <div className="bg-white rounded-2xl shadow-md p-6">
            <h3 className="text-sm font-medium text-gray-600 mb-2">Completed</h3>
            <p className="text-3xl font-bold text-emerald-600">{completedTasks}</p>
          </div>
          <div className="bg-white rounded-2xl shadow-md p-6">
            <h3 className="text-sm font-medium text-gray-600 mb-2">Pending</h3>
            <p className="text-3xl font-bold text-yellow-600">{pendingTasks}</p>
          </div>
        </div>

        {/* Performance Rating */}
        {profile && (
          <div className="bg-white rounded-2xl shadow-md p-6 mb-8">
            <h2 className="text-2xl font-bold mb-4 text-gray-900">Performance Rating</h2>
            <div className="flex items-center space-x-4">
              <div className="text-5xl font-bold text-slate-700">{profile.performanceRating || 0}</div>
              <div className="flex-1">
                <div className="w-full bg-gray-200 rounded-full h-4">
                  <div
                    className="bg-emerald-600 h-4 rounded-full"
                    style={{ width: `${((profile.performanceRating || 0) / 5) * 100}%` }}
                  />
                </div>
                <p className="text-sm text-gray-600 mt-2">Based on completed tasks and feedback</p>
              </div>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Link
            to="/vendor/tasks"
            className="bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition-shadow"
          >
            <h3 className="text-xl font-semibold mb-2 text-slate-700">My Tasks</h3>
            <p className="text-gray-600">View and manage assigned tasks</p>
          </Link>
          <Link
            to="/vendor/properties"
            className="bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition-shadow"
          >
            <h3 className="text-xl font-semibold mb-2 text-slate-700">Assigned Properties</h3>
            <p className="text-gray-600">View properties you're assigned to</p>
          </Link>
        </div>

        {/* Recent Tasks */}
        <div className="bg-white rounded-2xl shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Recent Tasks</h2>
            <Link
              to="/vendor/tasks"
              className="text-slate-700 font-semibold hover:underline"
            >
              View All
            </Link>
          </div>
          {tasks.length === 0 ? (
            <p className="text-gray-600">No tasks assigned yet.</p>
          ) : (
            <div className="space-y-4">
              {tasks.slice(0, 5).map((task) => (
                <div key={task.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <h3 className="font-semibold text-gray-900">{task.title}</h3>
                    <p className="text-sm text-gray-600">{task.description}</p>
                    {task.dueDate && (
                      <p className="text-sm text-gray-500">Due: {new Date(task.dueDate).toLocaleDateString()}</p>
                    )}
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
      </div>
    </div>
  );
}

export default VendorDashboard;

