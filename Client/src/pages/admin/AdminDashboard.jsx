import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { adminAPI, propertiesAPI } from '../../services/api';
import ActivityFeed from '../../components/ActivityFeed';

function AdminDashboard() {
  const [analytics, setAnalytics] = useState(null);
  const [propertyManagers, setPropertyManagers] = useState([]);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError('');
    try {
      const [analyticsData, managersData, propertiesData] = await Promise.all([
        adminAPI.getAnalytics(),
        adminAPI.getPropertyManagers(),
        propertiesAPI.getAll().catch(() => [])
      ]);
      setAnalytics(analyticsData);
      setPropertyManagers(managersData);
      setProperties(propertiesData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Calculate additional statistics
  const calculateStats = () => {
    if (!analytics || !properties) return null;
    
    const propertyOwners = analytics.totalUsers - analytics.propertyManagers - analytics.vendors - (analytics.tenants || 0) - 1; // -1 for super admin
    const tenants = analytics.tenants || 0;
    const activeProperties = properties.filter(p => p.status === 'active').length;
    const inactiveProperties = properties.length - activeProperties;
    const occupiedProperties = properties.filter(p => p.tenantId).length;
    const vacantProperties = properties.length - occupiedProperties;
    const recentRegistrations = 0; // Will be calculated from user data if available
    
    return {
      propertyOwners: Math.max(0, propertyOwners),
      tenants,
      activeProperties,
      inactiveProperties,
      occupiedProperties,
      vacantProperties,
      recentRegistrations
    };
  };

  const additionalStats = calculateStats();

  if (loading) {
    return (
      <div className="min-h-screen bg-porcelain flex items-center justify-center">
        <p className="text-architectural">Loading dashboard...</p>
      </div>
    );
  }

  // Icon components
  const StatIcon = ({ children, bgColor = 'bg-obsidian/10', textColor = 'text-obsidian' }) => (
    <div className={`p-3 rounded-lg ${bgColor} ${textColor} mb-3 inline-block`}>
      {children}
    </div>
  );

  const UsersIcon = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  );

  const PropertiesIcon = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
  );

  const RevenueIcon = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );

  const ApplicationsIcon = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  );

  return (
    <div className="min-h-screen bg-porcelain py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-charcoal mb-2">Super Admin Dashboard</h1>
          <p className="text-architectural">Comprehensive system overview and management</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-error/20 border border-error text-error rounded-lg">
            {error}
          </div>
        )}

        {/* Stats Grid - User Statistics */}
        {analytics && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-charcoal mb-4">User Statistics</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Link to="/admin/users" className="bg-stone-100 rounded-2xl shadow-md p-6 hover:shadow-lg transition-all border border-stone-200 cursor-pointer">
                <StatIcon bgColor="bg-obsidian/10" textColor="text-obsidian">
                  <UsersIcon />
                </StatIcon>
                <h3 className="text-sm font-medium text-architectural mb-2">Total Users</h3>
                <p className="text-3xl font-bold text-charcoal">{analytics.totalUsers}</p>
                <p className="text-xs text-architectural mt-2">All registered users</p>
              </Link>
              <Link to="/admin/users?role=property_owner" className="bg-stone-100 rounded-2xl shadow-md p-6 hover:shadow-lg transition-all border border-stone-200 cursor-pointer">
                <StatIcon bgColor="bg-brass/10" textColor="text-brass">
                  <UsersIcon />
                </StatIcon>
                <h3 className="text-sm font-medium text-architectural mb-2">Property Owners</h3>
                <p className="text-3xl font-bold text-charcoal">{additionalStats?.propertyOwners || 0}</p>
                <p className="text-xs text-architectural mt-2">Active property owners</p>
              </Link>
              <Link to="/admin/users?role=tenant" className="bg-stone-100 rounded-2xl shadow-md p-6 hover:shadow-lg transition-all border border-stone-200 cursor-pointer">
                <StatIcon bgColor="bg-eucalyptus/10" textColor="text-eucalyptus">
                  <UsersIcon />
                </StatIcon>
                <h3 className="text-sm font-medium text-architectural mb-2">Tenants</h3>
                <p className="text-3xl font-bold text-charcoal">{additionalStats?.tenants || 0}</p>
                <p className="text-xs text-architectural mt-2">Registered tenants</p>
              </Link>
              <div className="bg-stone-100 rounded-2xl shadow-md p-6 border border-stone-200">
                <StatIcon bgColor="bg-obsidian/10" textColor="text-obsidian">
                  <UsersIcon />
                </StatIcon>
                <h3 className="text-sm font-medium text-architectural mb-2">Property Managers</h3>
                <p className="text-3xl font-bold text-charcoal">{analytics.propertyManagers}</p>
                <p className="text-xs text-architectural mt-2">Active managers</p>
              </div>
              <div className="bg-stone-100 rounded-2xl shadow-md p-6 border border-stone-200">
                <StatIcon bgColor="bg-obsidian/10" textColor="text-obsidian">
                  <UsersIcon />
                </StatIcon>
                <h3 className="text-sm font-medium text-architectural mb-2">Vendors</h3>
                <p className="text-3xl font-bold text-charcoal">{analytics.vendors}</p>
                <p className="text-xs text-architectural mt-2">Service providers</p>
              </div>
            </div>
          </div>
        )}

        {/* Stats Grid - Property Statistics */}
        {analytics && additionalStats && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-charcoal mb-4">Property Statistics</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Link to="/admin/properties" className="bg-stone-100 rounded-2xl shadow-md p-6 hover:shadow-lg transition-all border border-stone-200 cursor-pointer">
                <StatIcon bgColor="bg-obsidian/10" textColor="text-obsidian">
                  <PropertiesIcon />
                </StatIcon>
                <h3 className="text-sm font-medium text-architectural mb-2">Total Properties</h3>
                <p className="text-3xl font-bold text-charcoal">{analytics.totalProperties}</p>
                <p className="text-xs text-architectural mt-2">All properties</p>
              </Link>
              <Link to="/admin/properties?status=active" className="bg-stone-100 rounded-2xl shadow-md p-6 hover:shadow-lg transition-all border border-stone-200 cursor-pointer">
                <StatIcon bgColor="bg-eucalyptus/10" textColor="text-eucalyptus">
                  <PropertiesIcon />
                </StatIcon>
                <h3 className="text-sm font-medium text-architectural mb-2">Active Properties</h3>
                <p className="text-3xl font-bold text-eucalyptus">{additionalStats.activeProperties}</p>
                <p className="text-xs text-architectural mt-2">Currently active</p>
              </Link>
              <Link to="/admin/properties?status=occupied" className="bg-stone-100 rounded-2xl shadow-md p-6 hover:shadow-lg transition-all border border-stone-200 cursor-pointer">
                <StatIcon bgColor="bg-brass/10" textColor="text-brass">
                  <PropertiesIcon />
                </StatIcon>
                <h3 className="text-sm font-medium text-architectural mb-2">Occupied</h3>
                <p className="text-3xl font-bold text-brass">{additionalStats.occupiedProperties}</p>
                <p className="text-xs text-architectural mt-2">With tenants</p>
              </Link>
              <Link to="/admin/properties?status=vacant" className="bg-stone-100 rounded-2xl shadow-md p-6 hover:shadow-lg transition-all border border-stone-200 cursor-pointer">
                <StatIcon bgColor="bg-warning/10" textColor="text-warning">
                  <PropertiesIcon />
                </StatIcon>
                <h3 className="text-sm font-medium text-architectural mb-2">Vacant</h3>
                <p className="text-3xl font-bold text-warning">{additionalStats.vacantProperties}</p>
                <p className="text-xs text-architectural mt-2">Available for rent</p>
              </Link>
            </div>
          </div>
        )}

        {/* Stats Grid - Task Statistics */}
        {analytics && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-charcoal mb-4">Task Statistics</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-stone-100 rounded-2xl shadow-md p-6 border border-stone-200">
                <StatIcon bgColor="bg-obsidian/10" textColor="text-obsidian">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </StatIcon>
                <h3 className="text-sm font-medium text-architectural mb-2">Total Tasks</h3>
                <p className="text-3xl font-bold text-charcoal">{analytics.totalTasks}</p>
                <p className="text-xs text-architectural mt-2">All tasks</p>
              </div>
              <div className="bg-stone-100 rounded-2xl shadow-md p-6 border border-stone-200">
                <StatIcon bgColor="bg-eucalyptus/10" textColor="text-eucalyptus">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </StatIcon>
                <h3 className="text-sm font-medium text-architectural mb-2">Completed</h3>
                <p className="text-3xl font-bold text-eucalyptus">{analytics.completedTasks}</p>
                <p className="text-xs text-architectural mt-2">Finished tasks</p>
              </div>
              <div className="bg-stone-100 rounded-2xl shadow-md p-6 border border-stone-200">
                <StatIcon bgColor="bg-warning/10" textColor="text-warning">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </StatIcon>
                <h3 className="text-sm font-medium text-architectural mb-2">Pending</h3>
                <p className="text-3xl font-bold text-warning">{analytics.pendingTasks}</p>
                <p className="text-xs text-architectural mt-2">Awaiting action</p>
              </div>
              <div className="bg-stone-100 rounded-2xl shadow-md p-6 border border-stone-200">
                <StatIcon bgColor="bg-obsidian/10" textColor="text-obsidian">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </StatIcon>
                <h3 className="text-sm font-medium text-architectural mb-2">In Progress</h3>
                <p className="text-3xl font-bold text-obsidian">{analytics.inProgressTasks}</p>
                <p className="text-xs text-architectural mt-2">Currently active</p>
              </div>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-charcoal mb-4">Quick Actions</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Link
              to="/admin/users"
              className="bg-stone-100 rounded-2xl shadow-md p-6 hover:shadow-lg transition-all border border-stone-200"
            >
              <h3 className="text-xl font-semibold mb-2 text-charcoal">Manage All Users</h3>
              <p className="text-architectural">View and manage all users across all roles</p>
            </Link>
            <Link
              to="/admin/properties"
              className="bg-stone-100 rounded-2xl shadow-md p-6 hover:shadow-lg transition-all border border-stone-200"
            >
              <h3 className="text-xl font-semibold mb-2 text-charcoal">View All Properties</h3>
              <p className="text-architectural">Browse and manage all properties in the system</p>
            </Link>
            <Link
              to="/admin/financial"
              className="bg-stone-100 rounded-2xl shadow-md p-6 hover:shadow-lg transition-all border border-stone-200"
            >
              <h3 className="text-xl font-semibold mb-2 text-charcoal">Financial Overview</h3>
              <p className="text-architectural">View revenue, payments, and financial analytics</p>
            </Link>
            <Link
              to="/admin/applications"
              className="bg-stone-100 rounded-2xl shadow-md p-6 hover:shadow-lg transition-all border border-stone-200"
            >
              <h3 className="text-xl font-semibold mb-2 text-charcoal">Applications Management</h3>
              <p className="text-architectural">Review and manage tenant applications</p>
            </Link>
            <Link
              to="/admin/property-managers"
              className="bg-stone-100 rounded-2xl shadow-md p-6 hover:shadow-lg transition-all border border-stone-200"
            >
              <h3 className="text-xl font-semibold mb-2 text-charcoal">Manage Property Managers</h3>
              <p className="text-architectural">Create, assign, and manage property managers</p>
            </Link>
            <Link
              to="/admin/analytics"
              className="bg-stone-100 rounded-2xl shadow-md p-6 hover:shadow-lg transition-all border border-stone-200"
            >
              <h3 className="text-xl font-semibold mb-2 text-charcoal">System Analytics</h3>
              <p className="text-architectural">View detailed analytics and insights</p>
            </Link>
            <Link
              to="/admin/settings"
              className="bg-stone-100 rounded-2xl shadow-md p-6 hover:shadow-lg transition-all border border-stone-200"
            >
              <h3 className="text-xl font-semibold mb-2 text-charcoal">System Settings</h3>
              <p className="text-architectural">Configure global settings and permissions</p>
            </Link>
          </div>
        </div>

        {/* Charts Section */}
        {analytics && (
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {/* User Growth Chart */}
            <div className="bg-stone-100 rounded-2xl shadow-md p-6 border border-stone-200">
              <h3 className="text-xl font-bold text-charcoal mb-4">User Growth (Last 6 Months)</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={[
                  { month: 'Jan', users: 120 },
                  { month: 'Feb', users: 145 },
                  { month: 'Mar', users: 168 },
                  { month: 'Apr', users: 192 },
                  { month: 'May', users: 210 },
                  { month: 'Jun', users: analytics.totalUsers }
                ]}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#D6CFC4" />
                  <XAxis dataKey="month" stroke="#6B7875" />
                  <YAxis stroke="#6B7875" />
                  <Tooltip contentStyle={{ backgroundColor: '#FFFEFB', border: '1px solid #D6CFC4', borderRadius: '8px' }} />
                  <Legend />
                  <Line type="monotone" dataKey="users" stroke="#2D5F5F" strokeWidth={2} name="Total Users" />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Property Status Distribution */}
            <div className="bg-stone-100 rounded-2xl shadow-md p-6 border border-stone-200">
              <h3 className="text-xl font-bold text-charcoal mb-4">Property Status Distribution</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={[
                      { name: 'Active', value: additionalStats?.activeProperties || 0 },
                      { name: 'Inactive', value: additionalStats?.inactiveProperties || 0 },
                      { name: 'Occupied', value: additionalStats?.occupiedProperties || 0 },
                      { name: 'Vacant', value: additionalStats?.vacantProperties || 0 }
                    ]}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    <Cell fill="#2D5F5F" />
                    <Cell fill="#6B7875" />
                    <Cell fill="#E8B86D" />
                    <Cell fill="#F5C98A" />
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#FFFEFB', border: '1px solid #D6CFC4', borderRadius: '8px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Task Status Distribution */}
            <div className="bg-stone-100 rounded-2xl shadow-md p-6 border border-stone-200">
              <h3 className="text-xl font-bold text-charcoal mb-4">Task Status Overview</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={[
                  { status: 'Completed', count: analytics.completedTasks },
                  { status: 'Pending', count: analytics.pendingTasks },
                  { status: 'In Progress', count: analytics.inProgressTasks }
                ]}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#D6CFC4" />
                  <XAxis dataKey="status" stroke="#6B7875" />
                  <YAxis stroke="#6B7875" />
                  <Tooltip contentStyle={{ backgroundColor: '#FFFEFB', border: '1px solid #D6CFC4', borderRadius: '8px' }} />
                  <Bar dataKey="count" fill="#2D5F5F" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* User Role Distribution */}
            <div className="bg-stone-100 rounded-2xl shadow-md p-6 border border-stone-200">
              <h3 className="text-xl font-bold text-charcoal mb-4">User Role Distribution</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={[
                  { role: 'Owners', count: additionalStats?.propertyOwners || 0 },
                  { role: 'Tenants', count: additionalStats?.tenants || 0 },
                  { role: 'Managers', count: analytics.propertyManagers },
                  { role: 'Vendors', count: analytics.vendors }
                ]}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#D6CFC4" />
                  <XAxis dataKey="role" stroke="#6B7875" />
                  <YAxis stroke="#6B7875" />
                  <Tooltip contentStyle={{ backgroundColor: '#FFFEFB', border: '1px solid #D6CFC4', borderRadius: '8px' }} />
                  <Bar dataKey="count" fill="#5FB896" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Activity Feed and Property Managers */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <ActivityFeed limit={5} />
          
          {/* Property Managers List */}
          <div className="bg-stone-100 rounded-2xl shadow-md p-6 border border-stone-200">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-charcoal">Recent Property Managers</h2>
            <Link
              to="/admin/property-managers"
              className="px-4 py-2 bg-obsidian text-porcelain rounded-xl hover:bg-obsidian-light transition-colors font-semibold"
            >
              Manage All
            </Link>
          </div>
          {propertyManagers.length === 0 ? (
            <p className="text-architectural">No property managers yet. Create one to get started.</p>
          ) : (
            <div className="space-y-4">
              {propertyManagers.slice(0, 5).map((manager) => (
                <div key={manager.id} className="flex items-center justify-between p-4 bg-porcelain border border-stone-200 rounded-lg hover:shadow-md transition-shadow">
                  <div>
                    <h3 className="font-semibold text-charcoal">{manager.name}</h3>
                    <p className="text-sm text-architectural">{manager.email}</p>
                    <p className="text-sm text-architectural">
                      {manager.assignedProperties?.length || 0} properties assigned
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    manager.status === 'active' ? 'bg-eucalyptus/20 text-eucalyptus' :
                    manager.status === 'suspended' ? 'bg-error/20 text-error' :
                    'bg-warning/20 text-warning'
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
    </div>
  );
}

export default AdminDashboard;

