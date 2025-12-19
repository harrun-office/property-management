import { useState, useEffect } from 'react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { adminAPI, propertiesAPI } from '../../services/api';

function SystemAnalytics() {
  const [analytics, setAnalytics] = useState(null);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    setLoading(true);
    setError('');
    try {
      const [analyticsData, propertiesData] = await Promise.all([
        adminAPI.getAnalytics(),
        propertiesAPI.getAll().catch(() => [])
      ]);
      setAnalytics(analyticsData);
      setProperties(propertiesData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-porcelain flex items-center justify-center">
        <p className="text-architectural">Loading analytics...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-porcelain flex items-center justify-center">
        <div className="text-center">
          <p className="text-error mb-4">{error}</p>
          <button
            onClick={loadAnalytics}
            className="px-4 py-2 bg-obsidian text-porcelain rounded-xl hover:bg-obsidian-light transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const completionRate = analytics.totalTasks > 0 
    ? Math.round((analytics.completedTasks / analytics.totalTasks) * 100) 
    : 0;

  const propertyStatusData = [
    { name: 'Active', value: properties.filter(p => p.status === 'active').length },
    { name: 'Inactive', value: properties.filter(p => p.status === 'inactive').length },
    { name: 'Occupied', value: properties.filter(p => p.tenantId).length },
    { name: 'Vacant', value: properties.filter(p => !p.tenantId && p.status === 'active').length }
  ];

  return (
    <div className="min-h-screen bg-porcelain py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-charcoal mb-2">System Analytics</h1>
          <p className="text-architectural">Comprehensive system-wide statistics and metrics</p>
        </div>

        {analytics && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              <div className="bg-stone-100 rounded-2xl shadow-md p-6 border border-stone-200">
                <h3 className="text-sm font-medium text-architectural mb-2">Total Users</h3>
                <p className="text-4xl font-bold text-charcoal">{analytics.totalUsers}</p>
                <p className="text-sm text-architectural mt-2">
                  {analytics.propertyManagers} Property Managers, {analytics.vendors} Vendors
                </p>
              </div>

              <div className="bg-stone-100 rounded-2xl shadow-md p-6 border border-stone-200">
                <h3 className="text-sm font-medium text-architectural mb-2">Total Properties</h3>
                <p className="text-4xl font-bold text-charcoal">{analytics.totalProperties}</p>
                <p className="text-sm text-architectural mt-2">
                  {properties.filter(p => p.status === 'active').length} Active
                </p>
              </div>

              <div className="bg-stone-100 rounded-2xl shadow-md p-6 border border-stone-200">
                <h3 className="text-sm font-medium text-architectural mb-2">Total Tasks</h3>
                <p className="text-4xl font-bold text-charcoal">{analytics.totalTasks}</p>
                <p className="text-sm text-architectural mt-2">
                  {analytics.completedTasks} Completed, {analytics.pendingTasks} Pending
                </p>
              </div>

              <div className="bg-stone-100 rounded-2xl shadow-md p-6 border border-stone-200">
                <h3 className="text-sm font-medium text-architectural mb-2">Task Completion Rate</h3>
                <p className="text-4xl font-bold text-eucalyptus">
                  {completionRate}%
                </p>
              </div>

              <div className="bg-stone-100 rounded-2xl shadow-md p-6 border border-stone-200">
                <h3 className="text-sm font-medium text-architectural mb-2">Pending Tasks</h3>
                <p className="text-4xl font-bold text-warning">{analytics.pendingTasks}</p>
              </div>

              <div className="bg-stone-100 rounded-2xl shadow-md p-6 border border-stone-200">
                <h3 className="text-sm font-medium text-architectural mb-2">In Progress Tasks</h3>
                <p className="text-4xl font-bold text-obsidian">{analytics.inProgressTasks}</p>
              </div>
            </div>

            {/* Charts */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-stone-100 rounded-2xl shadow-md p-6 border border-stone-200">
                <h3 className="text-xl font-bold text-charcoal mb-4">Task Status Distribution</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'Completed', value: analytics.completedTasks },
                        { name: 'Pending', value: analytics.pendingTasks },
                        { name: 'In Progress', value: analytics.inProgressTasks }
                      ]}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      <Cell fill="#5FB896" />
                      <Cell fill="#F5C98A" />
                      <Cell fill="#2D5F5F" />
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: '#FFFEFB', border: '1px solid #D6CFC4', borderRadius: '8px' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-stone-100 rounded-2xl shadow-md p-6 border border-stone-200">
                <h3 className="text-xl font-bold text-charcoal mb-4">Property Status Distribution</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={propertyStatusData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#D6CFC4" />
                    <XAxis dataKey="name" stroke="#6B7875" />
                    <YAxis stroke="#6B7875" />
                    <Tooltip contentStyle={{ backgroundColor: '#FFFEFB', border: '1px solid #D6CFC4', borderRadius: '8px' }} />
                    <Bar dataKey="value" fill="#2D5F5F" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default SystemAnalytics;

