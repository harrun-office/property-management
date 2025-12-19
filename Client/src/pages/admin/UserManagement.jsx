import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { adminAPI } from '../../services/api';

function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState({
    role: searchParams.get('role') || '',
    status: '',
    search: ''
  });
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    loadUsers();
  }, [filters]);

  const loadUsers = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await adminAPI.getAllUsers(filters);
      setUsers(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
    if (name === 'role') {
      setSearchParams({ role: value });
    }
  };

  const handleSuspend = async (userId) => {
    if (!window.confirm('Are you sure you want to suspend this user?')) return;
    
    try {
      await adminAPI.suspendUser(userId);
      loadUsers();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleActivate = async (userId) => {
    try {
      await adminAPI.activateUser(userId);
      loadUsers();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleViewDetails = async (userId) => {
    try {
      const user = await adminAPI.getUserById(userId);
      setSelectedUser(user);
      setShowModal(true);
    } catch (err) {
      setError(err.message);
    }
  };

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'super_admin':
        return 'bg-obsidian/20 text-obsidian';
      case 'property_manager':
        return 'bg-brass/20 text-brass';
      case 'property_owner':
        return 'bg-eucalyptus/20 text-eucalyptus';
      case 'tenant':
        return 'bg-architectural/20 text-architectural';
      case 'vendor':
        return 'bg-warning/20 text-warning';
      default:
        return 'bg-stone-200 text-charcoal';
    }
  };

  const formatRole = (role) => {
    return role.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-porcelain flex items-center justify-center">
        <p className="text-architectural">Loading users...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-porcelain py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-charcoal mb-2">User Management</h1>
          <p className="text-architectural">Manage all users across the platform</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-error/20 border border-error text-error rounded-lg">
            {error}
          </div>
        )}

        {/* Filters */}
        <div className="bg-stone-100 rounded-2xl shadow-md p-6 mb-6 border border-stone-200">
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-charcoal mb-2">Search</label>
              <input
                type="text"
                name="search"
                value={filters.search}
                onChange={handleFilterChange}
                placeholder="Search by name or email..."
                className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-obsidian focus:border-obsidian bg-porcelain text-charcoal"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-charcoal mb-2">Role</label>
              <select
                name="role"
                value={filters.role}
                onChange={handleFilterChange}
                className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-obsidian focus:border-obsidian bg-porcelain text-charcoal"
              >
                <option value="">All Roles</option>
                <option value="property_owner">Property Owner</option>
                <option value="tenant">Tenant</option>
                <option value="property_manager">Property Manager</option>
                <option value="vendor">Vendor</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-charcoal mb-2">Status</label>
              <select
                name="status"
                value={filters.status}
                onChange={handleFilterChange}
                className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-obsidian focus:border-obsidian bg-porcelain text-charcoal"
              >
                <option value="">All Statuses</option>
                <option value="active">Active</option>
                <option value="suspended">Suspended</option>
                <option value="pending">Pending</option>
              </select>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-stone-100 rounded-2xl shadow-md border border-stone-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-obsidian text-porcelain">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Name</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Email</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Role</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Mobile</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Registered</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-porcelain divide-y divide-stone-200">
                {users.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-8 text-center text-architectural">
                      No users found
                    </td>
                  </tr>
                ) : (
                  users.map((user) => (
                    <tr key={user.id} className="hover:bg-stone-50 transition-colors">
                      <td className="px-6 py-4 text-sm text-charcoal font-medium">{user.name}</td>
                      <td className="px-6 py-4 text-sm text-architectural">{user.email}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getRoleBadgeColor(user.role)}`}>
                          {formatRole(user.role)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-architectural">{user.mobileNumber || 'N/A'}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          user.status === 'active' ? 'bg-eucalyptus/20 text-eucalyptus' :
                          user.status === 'suspended' ? 'bg-error/20 text-error' :
                          'bg-warning/20 text-warning'
                        }`}>
                          {user.status || 'active'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-architectural">
                        {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleViewDetails(user.id)}
                            className="px-3 py-1 text-sm bg-obsidian text-porcelain rounded-lg hover:bg-obsidian-light transition-colors"
                          >
                            View
                          </button>
                          {user.status === 'active' ? (
                            <button
                              onClick={() => handleSuspend(user.id)}
                              className="px-3 py-1 text-sm bg-error text-porcelain rounded-lg hover:bg-error/90 transition-colors"
                            >
                              Suspend
                            </button>
                          ) : (
                            <button
                              onClick={() => handleActivate(user.id)}
                              className="px-3 py-1 text-sm bg-eucalyptus text-porcelain rounded-lg hover:bg-eucalyptus/90 transition-colors"
                            >
                              Activate
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* User Details Modal */}
        {showModal && selectedUser && (
          <div className="fixed inset-0 bg-charcoal/50 flex items-center justify-center z-50 p-4">
            <div className="bg-porcelain rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-stone-200">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-charcoal">User Details</h2>
                  <button
                    onClick={() => setShowModal(false)}
                    className="text-architectural hover:text-charcoal transition-colors"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-architectural mb-1">Name</label>
                  <p className="text-charcoal font-medium">{selectedUser.name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-architectural mb-1">Email</label>
                  <p className="text-charcoal">{selectedUser.email}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-architectural mb-1">Mobile Number</label>
                  <p className="text-charcoal">{selectedUser.mobileNumber || 'N/A'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-architectural mb-1">Role</label>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium inline-block ${getRoleBadgeColor(selectedUser.role)}`}>
                    {formatRole(selectedUser.role)}
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-architectural mb-1">Status</label>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium inline-block ${
                    selectedUser.status === 'active' ? 'bg-eucalyptus/20 text-eucalyptus' :
                    selectedUser.status === 'suspended' ? 'bg-error/20 text-error' :
                    'bg-warning/20 text-warning'
                  }`}>
                    {selectedUser.status || 'active'}
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-architectural mb-1">Registered Date</label>
                  <p className="text-charcoal">
                    {selectedUser.createdAt ? new Date(selectedUser.createdAt).toLocaleString() : 'N/A'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default UserManagement;

