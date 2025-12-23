import { useState, useEffect, useMemo } from 'react';
import { adminAPI, propertiesAPI } from '../../services/api';
import EditManagerModal from '../../components/admin/EditManagerModal';
import EditVendorModal from '../../components/admin/EditVendorModal';
import PropertyAssignmentModal from '../../components/admin/PropertyAssignmentModal';
import MetricCard from '../../components/ui/MetricCard';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Skeleton from '../../components/ui/Skeleton';
import ErrorDisplay from '../../components/ui/ErrorDisplay';

const serviceTypesList = ['Plumbing', 'Electrical', 'HVAC', 'Cleaning', 'Landscaping', 'Painting', 'Carpentry', 'Other'];

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('activity'); // activity | manage | create | performance
  const [performanceType, setPerformanceType] = useState('managers'); // managers | vendors
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Data lists
  const [managers, setManagers] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [properties, setProperties] = useState([]);
  const [managersPerformance, setManagersPerformance] = useState([]);
  const [vendorsPerformance, setVendorsPerformance] = useState([]);

  // Activity Monitor data
  const [systemOverview, setSystemOverview] = useState(null);
  const [auditLogs, setAuditLogs] = useState([]);
  const [auditLogsTotal, setAuditLogsTotal] = useState(0);
  const [activityFilters, setActivityFilters] = useState({
    action: '',
    resourceType: '',
    userId: '',
    limit: 50
  });

  // Create forms
  const [showManagerForm, setShowManagerForm] = useState(false);
  const [managerFormData, setManagerFormData] = useState({ email: '', name: '', password: '', mobileNumber: '' });
  const [managerErrors, setManagerErrors] = useState({});

  const [showVendorForm, setShowVendorForm] = useState(false);
  const [vendorFormData, setVendorFormData] = useState({
    email: '',
    name: '',
    password: '',
    mobileNumber: '',
    companyName: '',
    phone: '',
    serviceTypes: []
  });
  const [vendorErrors, setVendorErrors] = useState({});

  // Manage tab state
  const [manageSection, setManageSection] = useState('managers'); // managers | vendors
  const [managerSearch, setManagerSearch] = useState('');
  const [managerStatus, setManagerStatus] = useState('all');
  const [vendorSearch, setVendorSearch] = useState('');
  const [vendorStatus, setVendorStatus] = useState('all');
  const [vendorServiceType, setVendorServiceType] = useState('all');

  // Modals
  const [editingManager, setEditingManager] = useState(null);
  const [editingVendor, setEditingVendor] = useState(null);
  const [assigningManager, setAssigningManager] = useState(null);

  // Effects
  useEffect(() => {
    if (activeTab === 'performance') {
      loadPerformance(performanceType);
    }
  }, [activeTab, performanceType]);

  useEffect(() => {
    if (activeTab === 'manage') {
      loadManageData();
    }
  }, [activeTab]);

  useEffect(() => {
    if (activeTab === 'activity') {
      loadActivityData();
    }
  }, [activeTab, activityFilters.action, activityFilters.resourceType, activityFilters.userId, activityFilters.limit]);

  const loadManageData = async () => {
    setLoading(true);
    setError('');
    try {
      const [managersData, vendorsData, propertiesData] = await Promise.all([
        adminAPI.getPropertyManagers(),
        adminAPI.getVendors(),
        propertiesAPI.getAll().catch(() => [])
      ]);
      setManagers(managersData || []);
      setVendors(vendorsData || []);
      setProperties(propertiesData || []);
    } catch (err) {
      setError(err.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const loadPerformance = async (type) => {
    setLoading(true);
    setError('');
    try {
      if (type === 'managers') {
        const data = await adminAPI.getManagersPerformance();
        setManagersPerformance(data || []);
      } else {
        const data = await adminAPI.getVendorsPerformance();
        setVendorsPerformance(data || []);
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch performance');
    } finally {
      setLoading(false);
    }
  };

  const loadActivityData = async () => {
    setLoading(true);
    setError('');
    try {
      const [overview, logs] = await Promise.all([
        adminAPI.getSystemOverview(),
        adminAPI.getAuditLogs(activityFilters)
      ]);
      setSystemOverview(overview);
      setAuditLogs(logs.logs || []);
      setAuditLogsTotal(logs.total || 0);
    } catch (err) {
      setError(err.message || 'Failed to load activity data');
    } finally {
      setLoading(false);
    }
  };

  const validateManagerForm = () => {
    const errors = {};
    if (!managerFormData.name.trim()) errors.name = 'Name is required';
    if (!managerFormData.email.trim()) errors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(managerFormData.email)) errors.email = 'Invalid email format';
    if (!managerFormData.password) errors.password = 'Password is required';
    else if (managerFormData.password.length < 6) errors.password = 'Password must be at least 6 characters';
    if (managerFormData.mobileNumber && !/^[0-9+\-\s()]+$/.test(managerFormData.mobileNumber)) errors.mobileNumber = 'Invalid mobile number';
    return errors;
  };

  const validateVendorForm = () => {
    const errors = {};
    if (!vendorFormData.name.trim()) errors.name = 'Name is required';
    if (!vendorFormData.email.trim()) errors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(vendorFormData.email)) errors.email = 'Invalid email format';
    if (!vendorFormData.password) errors.password = 'Password is required';
    else if (vendorFormData.password.length < 6) errors.password = 'Password must be at least 6 characters';
    if (!vendorFormData.companyName.trim()) errors.companyName = 'Company name is required';
    if (!vendorFormData.serviceTypes.length) errors.serviceTypes = 'At least one service type is required';
    if (vendorFormData.mobileNumber && !/^[0-9+\-\s()]+$/.test(vendorFormData.mobileNumber)) errors.mobileNumber = 'Invalid mobile number';
    return errors;
  };

  const handleCreateManager = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    const errors = validateManagerForm();
    if (Object.keys(errors).length) {
      setManagerErrors(errors);
      return;
    }
    try {
      await adminAPI.createPropertyManager(managerFormData);
      setSuccess('Property Manager created successfully! They can now login with these credentials.');
      setManagerFormData({ email: '', name: '', password: '', mobileNumber: '' });
      setManagerErrors({});
      setShowManagerForm(false);
      loadManageData();
      setTimeout(() => setSuccess(''), 4000);
    } catch (err) {
      setError(err.message || 'Failed to create manager');
    }
  };

  const handleCreateVendor = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    const errors = validateVendorForm();
    if (Object.keys(errors).length) {
      setVendorErrors(errors);
      return;
    }
    try {
      await adminAPI.createVendor(vendorFormData);
      setSuccess('Vendor created successfully! They can now login with these credentials.');
      setVendorFormData({ email: '', name: '', password: '', mobileNumber: '', companyName: '', phone: '', serviceTypes: [] });
      setVendorErrors({});
      setShowVendorForm(false);
      loadManageData();
      setTimeout(() => setSuccess(''), 4000);
    } catch (err) {
      setError(err.message || 'Failed to create vendor');
    }
  };

  // Manage actions
  const handleUpdateManager = async (id, payload) => {
    await adminAPI.updatePropertyManager(id, payload);
    await loadManageData();
  };

  const handleUpdateVendor = async (id, payload) => {
    await adminAPI.updateVendor(id, payload);
    await loadManageData();
  };

  const handleToggleManagerStatus = async (manager) => {
    if (manager.status === 'active') {
      await adminAPI.suspendPropertyManager(manager.id);
    } else {
      await adminAPI.activatePropertyManager(manager.id);
    }
    await loadManageData();
  };

  const handleToggleVendorStatus = async (vendor) => {
    if (vendor.status === 'active') {
      await adminAPI.suspendVendor(vendor.id);
    } else {
      await adminAPI.activateVendor(vendor.id);
    }
    await loadManageData();
  };

  const handleAssignProperties = async (managerId, propertyIds) => {
    await adminAPI.assignProperties(managerId, propertyIds);
    await loadManageData();
  };

  const filteredManagers = useMemo(() => {
    return managers
      .filter((m) => {
        const matchesSearch = managerSearch
          ? (m.name || '').toLowerCase().includes(managerSearch.toLowerCase()) ||
            (m.email || '').toLowerCase().includes(managerSearch.toLowerCase())
          : true;
        const matchesStatus = managerStatus === 'all' ? true : (m.status || 'active') === managerStatus;
        return matchesSearch && matchesStatus;
      })
      .sort((a, b) => (a.name || '').localeCompare(b.name || ''));
  }, [managers, managerSearch, managerStatus]);

  const filteredVendors = useMemo(() => {
    return vendors
      .filter((v) => {
        const matchesSearch = vendorSearch
          ? (v.name || '').toLowerCase().includes(vendorSearch.toLowerCase()) ||
            (v.email || '').toLowerCase().includes(vendorSearch.toLowerCase()) ||
            (v.companyName || '').toLowerCase().includes(vendorSearch.toLowerCase())
          : true;
        const matchesStatus = vendorStatus === 'all' ? true : (v.status || 'active') === vendorStatus;
        const matchesService =
          vendorServiceType === 'all'
            ? true
            : (v.serviceTypes || []).some((s) => s.toLowerCase() === vendorServiceType.toLowerCase());
        return matchesSearch && matchesStatus && matchesService;
      })
      .sort((a, b) => (a.name || '').localeCompare(b.name || ''));
  }, [vendors, vendorSearch, vendorStatus, vendorServiceType]);

  const renderManageManagers = () => (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex flex-col md:flex-row gap-3">
          <input
            type="text"
            placeholder="Search by name or email"
            value={managerSearch}
            onChange={(e) => setManagerSearch(e.target.value)}
            className="px-3 py-2 border rounded-lg bg-porcelain focus:ring-2 focus:ring-obsidian focus:border-obsidian"
          />
          <select
            value={managerStatus}
            onChange={(e) => setManagerStatus(e.target.value)}
            className="px-3 py-2 border rounded-lg bg-porcelain focus:ring-2 focus:ring-obsidian focus:border-obsidian"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="suspended">Suspended</option>
          </select>
        </div>
        <Button variant="primary" onClick={() => setShowManagerForm(true)}>
          + Create Manager
        </Button>
      </div>

      <div className="bg-stone-100 rounded-2xl shadow-md overflow-hidden border border-stone-200">
        <table className="w-full">
          <thead className="bg-obsidian text-porcelain">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase">Name</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase">Email</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase">Mobile</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase">Status</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase">Properties</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-200 bg-porcelain">
            {filteredManagers.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-4 py-6 text-center text-architectural">No managers found</td>
              </tr>
            ) : (
              filteredManagers.map((m) => (
                <tr key={m.id} className="hover:bg-stone-50">
                  <td className="px-4 py-3 font-medium text-charcoal">{m.name}</td>
                  <td className="px-4 py-3 text-architectural">{m.email}</td>
                  <td className="px-4 py-3 text-architectural">{m.mobileNumber || '-'}</td>
                  <td className="px-4 py-3">
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      (m.status || 'active') === 'active'
                        ? 'bg-eucalyptus/20 text-eucalyptus'
                        : 'bg-error/20 text-error'
                    }`}>
                      {m.status || 'active'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-charcoal">{m.assignedProperties?.length || 0}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-2">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => setEditingManager(m)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => setAssigningManager(m)}
                      >
                        Assign Properties
                      </Button>
                      <Button
                        variant={(m.status || 'active') === 'active' ? 'danger' : 'success'}
                        size="sm"
                        onClick={() => handleToggleManagerStatus(m)}
                      >
                        {(m.status || 'active') === 'active' ? 'Suspend' : 'Activate'}
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderManageVendors = () => (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex flex-col md:flex-row gap-3">
          <input
            type="text"
            placeholder="Search by name, email, or company"
            value={vendorSearch}
            onChange={(e) => setVendorSearch(e.target.value)}
            className="px-3 py-2 border rounded-lg bg-porcelain focus:ring-2 focus:ring-obsidian focus:border-obsidian"
          />
          <select
            value={vendorStatus}
            onChange={(e) => setVendorStatus(e.target.value)}
            className="px-3 py-2 border rounded-lg bg-porcelain focus:ring-2 focus:ring-obsidian focus:border-obsidian"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="suspended">Suspended</option>
          </select>
          <select
            value={vendorServiceType}
            onChange={(e) => setVendorServiceType(e.target.value)}
            className="px-3 py-2 border rounded-lg bg-porcelain focus:ring-2 focus:ring-obsidian focus:border-obsidian"
          >
            <option value="all">All Services</option>
            {serviceTypesList.map((st) => (
              <option key={st} value={st}>{st}</option>
            ))}
          </select>
        </div>
        <Button variant="primary" onClick={() => setShowVendorForm(true)}>
          + Create Vendor
        </Button>
      </div>

      <div className="bg-stone-100 rounded-2xl shadow-md overflow-hidden border border-stone-200">
        <table className="w-full">
          <thead className="bg-obsidian text-porcelain">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase">Name</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase">Company</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase">Email</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase">Mobile</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase">Services</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase">Status</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-200 bg-porcelain">
            {filteredVendors.length === 0 ? (
              <tr>
                <td colSpan="7" className="px-4 py-6 text-center text-architectural">No vendors found</td>
              </tr>
            ) : (
              filteredVendors.map((v) => (
                <tr key={v.id} className="hover:bg-stone-50">
                  <td className="px-4 py-3 font-medium text-charcoal">{v.name}</td>
                  <td className="px-4 py-3 text-architectural">{v.companyName}</td>
                  <td className="px-4 py-3 text-architectural">{v.email}</td>
                  <td className="px-4 py-3 text-architectural">{v.mobileNumber || '-'}</td>
                  <td className="px-4 py-3 text-architectural">{(v.serviceTypes || []).join(', ') || '-'}</td>
                  <td className="px-4 py-3">
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      (v.status || 'active') === 'active'
                        ? 'bg-eucalyptus/20 text-eucalyptus'
                        : 'bg-error/20 text-error'
                    }`}>
                      {v.status || 'active'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-2">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => setEditingVendor(v)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant={(v.status || 'active') === 'active' ? 'danger' : 'success'}
                        size="sm"
                        onClick={() => handleToggleVendorStatus(v)}
                      >
                        {(v.status || 'active') === 'active' ? 'Suspend' : 'Activate'}
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderManageTab = () => (
    <div className="space-y-4">
      <div className="flex space-x-4 border-b border-stone-300">
        <button
          onClick={() => setManageSection('managers')}
          className={`px-4 py-2 font-semibold ${
            manageSection === 'managers' ? 'text-obsidian border-b-2 border-obsidian' : 'text-architectural hover:text-charcoal'
          }`}
        >
          Managers
        </button>
        <button
          onClick={() => setManageSection('vendors')}
          className={`px-4 py-2 font-semibold ${
            manageSection === 'vendors' ? 'text-obsidian border-b-2 border-obsidian' : 'text-architectural hover:text-charcoal'
          }`}
        >
          Vendors
        </button>
      </div>

      {loading ? (
        <div className="py-8 space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton.Card key={i} />
          ))}
        </div>
      ) : (
        <>
          {manageSection === 'managers' ? renderManageManagers() : renderManageVendors()}
        </>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-porcelain py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-charcoal mb-2">Admin Dashboard</h1>
          <p className="text-architectural">Manage vendor and manager credentials and view performance</p>
        </div>

        {error && (
          <Card variant="outlined" padding="md" className="mb-6 border-error bg-error/5">
            <p className="text-error font-medium">{error}</p>
          </Card>
        )}

        {success && (
          <Card variant="outlined" padding="md" className="mb-6 border-eucalyptus-500 bg-eucalyptus/5">
            <p className="text-eucalyptus-600 font-medium">{success}</p>
          </Card>
        )}

        {/* Tabs */}
        <div className="mb-6 flex space-x-4 border-b border-stone-300">
          <button
            onClick={() => setActiveTab('activity')}
            className={`px-6 py-3 font-semibold transition-colors ${
              activeTab === 'activity'
                ? 'text-obsidian border-b-2 border-obsidian'
                : 'text-architectural hover:text-charcoal'
            }`}
          >
            Activity Monitor
          </button>
          <button
            onClick={() => setActiveTab('create')}
            className={`px-6 py-3 font-semibold transition-colors ${
              activeTab === 'create'
                ? 'text-obsidian border-b-2 border-obsidian'
                : 'text-architectural hover:text-charcoal'
            }`}
          >
            Create Credentials
          </button>
          <button
            onClick={() => setActiveTab('manage')}
            className={`px-6 py-3 font-semibold transition-colors ${
              activeTab === 'manage'
                ? 'text-obsidian border-b-2 border-obsidian'
                : 'text-architectural hover:text-charcoal'
            }`}
          >
            Manage
          </button>
          <button
            onClick={() => setActiveTab('performance')}
            className={`px-6 py-3 font-semibold transition-colors ${
              activeTab === 'performance'
                ? 'text-obsidian border-b-2 border-obsidian'
                : 'text-architectural hover:text-charcoal'
            }`}
          >
            Performance
          </button>
        </div>

        {/* Activity Monitor Tab */}
        {activeTab === 'activity' && (
          <div className="space-y-6">
            {/* System Statistics Cards */}
            {loading && !systemOverview ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Skeleton.MetricCard />
                <Skeleton.MetricCard />
                <Skeleton.MetricCard />
                <Skeleton.MetricCard />
              </div>
            ) : systemOverview ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <MetricCard
                  title="Total Users"
                  value={systemOverview.users.total}
                  subtitle={`${systemOverview.users.active} active, ${systemOverview.users.suspended} suspended`}
                  variant="primary"
                  icon={
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  }
                />
                <MetricCard
                  title="Properties"
                  value={systemOverview.properties.total}
                  subtitle={`${systemOverview.properties.available} available, ${systemOverview.properties.rented} rented`}
                  variant="accent"
                  icon={
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                  }
                />
                <MetricCard
                  title="Tasks"
                  value={systemOverview.tasks.total}
                  subtitle={`${systemOverview.tasks.pending} pending, ${systemOverview.tasks.completed} completed`}
                  variant="success"
                  icon={
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                    </svg>
                  }
                />
                <MetricCard
                  title="Applications"
                  value={systemOverview.applications.total}
                  subtitle={`${systemOverview.applications.pending} pending, ${systemOverview.applications.approved} approved`}
                  variant="default"
                  icon={
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  }
                />
              </div>
            ) : null}

            {/* Activity Feed */}
            <Card variant="elevated" padding="lg">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                <h2 className="text-2xl font-bold text-charcoal">Activity Feed</h2>
                <div className="flex flex-wrap gap-2">
                  <select
                    value={activityFilters.action}
                    onChange={(e) => setActivityFilters({ ...activityFilters, action: e.target.value })}
                    className="px-3 py-2 border rounded-lg bg-porcelain focus:ring-2 focus:ring-obsidian focus:border-obsidian text-sm"
                  >
                    <option value="">All Actions</option>
                    <option value="create_property_manager">Create Manager</option>
                    <option value="create_vendor">Create Vendor</option>
                    <option value="create_property">Create Property</option>
                    <option value="create_task">Create Task</option>
                    <option value="update_task_status">Update Task</option>
                    <option value="login">Login</option>
                    <option value="register">Register</option>
                  </select>
                  <select
                    value={activityFilters.resourceType}
                    onChange={(e) => setActivityFilters({ ...activityFilters, resourceType: e.target.value })}
                    className="px-3 py-2 border rounded-lg bg-porcelain focus:ring-2 focus:ring-obsidian focus:border-obsidian text-sm"
                  >
                    <option value="">All Types</option>
                    <option value="user">User</option>
                    <option value="vendor">Vendor</option>
                    <option value="property">Property</option>
                    <option value="task">Task</option>
                    <option value="application">Application</option>
                  </select>
                  <Button variant="primary" size="sm" onClick={loadActivityData}>
                    Refresh
                  </Button>
                </div>
              </div>

              {loading ? (
                <div className="py-8 text-center">
                  <Skeleton variant="text" width="60%" className="mx-auto mb-2" />
                  <Skeleton variant="text" width="40%" className="mx-auto" />
                </div>
              ) : auditLogs.length === 0 ? (
                <div className="py-8 text-center text-architectural">No activity found</div>
              ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {auditLogs.map((log) => (
                    <Card key={log.id} variant="filled" padding="md" hover className="transition-all">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="px-2 py-1 bg-obsidian/10 text-obsidian rounded text-xs font-semibold">
                              {log.action.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                            </span>
                            <span className="px-2 py-1 bg-stone-200 text-charcoal rounded text-xs">
                              {log.resourceType}
                            </span>
                          </div>
                          <p className="text-sm text-charcoal mb-1">
                            <span className="font-semibold">{log.userName}</span> ({log.userRole})
                            {log.details && Object.keys(log.details).length > 0 && (
                              <span className="text-architectural ml-2">
                                {Object.entries(log.details).map(([key, value]) => (
                                  <span key={key} className="ml-1">
                                    {key}: <span className="font-medium">{typeof value === 'object' ? JSON.stringify(value) : value}</span>
                                  </span>
                                ))}
                              </span>
                            )}
                          </p>
                          <div className="flex items-center gap-3 text-xs text-architectural">
                            <span>{new Date(log.timestamp).toLocaleString()}</span>
                            {log.ipAddress && <span>IP: {log.ipAddress}</span>}
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
              {auditLogsTotal > auditLogs.length && (
                <div className="mt-4 text-center text-sm text-architectural">
                  Showing {auditLogs.length} of {auditLogsTotal} activities
                </div>
              )}
            </Card>

            {/* Additional Statistics */}
            {systemOverview && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card variant="elevated" padding="lg">
                  <Card.Title>Users by Role</Card.Title>
                  <Card.Body>
                    <div className="space-y-2">
                      {Object.entries(systemOverview.users.byRole).map(([role, count]) => (
                        <div key={role} className="flex items-center justify-between">
                          <span className="text-sm text-architectural capitalize">{role.replace(/_/g, ' ')}</span>
                          <span className="text-sm font-semibold text-charcoal">{count}</span>
                        </div>
                      ))}
                    </div>
                  </Card.Body>
                </Card>
                <Card variant="elevated" padding="lg">
                  <Card.Title>Recent Activity Summary</Card.Title>
                  <Card.Body>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-architectural">Last 24 Hours</span>
                        <span className="text-sm font-semibold text-charcoal">{systemOverview.activity.last24Hours}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-architectural">Last 7 Days</span>
                        <span className="text-sm font-semibold text-charcoal">{systemOverview.activity.last7Days}</span>
                      </div>
                      {Object.keys(systemOverview.activity.byType).length > 0 && (
                        <div className="mt-4 pt-4 border-t border-stone-300">
                          <h4 className="text-sm font-semibold text-charcoal mb-2">Activity by Type</h4>
                          {Object.entries(systemOverview.activity.byType).slice(0, 5).map(([action, count]) => (
                            <div key={action} className="flex items-center justify-between text-xs">
                              <span className="text-architectural">{action.replace(/_/g, ' ')}</span>
                              <span className="font-semibold text-charcoal">{count}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </Card.Body>
                </Card>
              </div>
            )}
          </div>
        )}

        {/* Create Credentials Tab */}
        {activeTab === 'create' && (
          <div className="space-y-6">
            {/* Create Manager Section */}
            <Card variant="elevated" padding="lg">
              <div className="flex justify-between items-center mb-4">
                <Card.Title>Create Manager Credentials</Card.Title>
                <Button
                  variant={showManagerForm ? 'secondary' : 'primary'}
                  onClick={() => {
                    setShowManagerForm(!showManagerForm);
                    setShowVendorForm(false);
                  }}
                >
                  {showManagerForm ? 'Cancel' : '+ Create Manager'}
                </Button>
              </div>

              {showManagerForm && (
                <form onSubmit={handleCreateManager} className="mt-4 space-y-4">
                  <Input
                    label="Name"
                    type="text"
                    value={managerFormData.name}
                    onChange={(e) => setManagerFormData({ ...managerFormData, name: e.target.value })}
                    error={managerErrors.name}
                    required
                  />
                  <Input
                    label="Email"
                    type="email"
                    value={managerFormData.email}
                    onChange={(e) => setManagerFormData({ ...managerFormData, email: e.target.value })}
                    error={managerErrors.email}
                    required
                  />
                  <Input
                    label="Password"
                    type="password"
                    value={managerFormData.password}
                    onChange={(e) => setManagerFormData({ ...managerFormData, password: e.target.value })}
                    error={managerErrors.password}
                    placeholder="Minimum 6 characters"
                    required
                  />
                  <Input
                    label="Mobile Number"
                    type="tel"
                    value={managerFormData.mobileNumber}
                    onChange={(e) => setManagerFormData({ ...managerFormData, mobileNumber: e.target.value })}
                    error={managerErrors.mobileNumber}
                    placeholder="Optional"
                  />
                  <Button type="submit" variant="primary">
                    Create Manager
                  </Button>
                </form>
              )}
            </Card>

            {/* Create Vendor Section */}
            <Card variant="elevated" padding="lg">
              <div className="flex justify-between items-center mb-4">
                <Card.Title>Create Vendor Credentials</Card.Title>
                <Button
                  variant={showVendorForm ? 'secondary' : 'primary'}
                  onClick={() => {
                    setShowVendorForm(!showVendorForm);
                    setShowManagerForm(false);
                  }}
                >
                  {showVendorForm ? 'Cancel' : '+ Create Vendor'}
                </Button>
              </div>

              {showVendorForm && (
                <form onSubmit={handleCreateVendor} className="mt-4 space-y-4">
                  <Input
                    label="Name"
                    type="text"
                    value={vendorFormData.name}
                    onChange={(e) => setVendorFormData({ ...vendorFormData, name: e.target.value })}
                    error={vendorErrors.name}
                    required
                  />
                  <Input
                    label="Email"
                    type="email"
                    value={vendorFormData.email}
                    onChange={(e) => setVendorFormData({ ...vendorFormData, email: e.target.value })}
                    error={vendorErrors.email}
                    required
                  />
                  <Input
                    label="Password"
                    type="password"
                    value={vendorFormData.password}
                    onChange={(e) => setVendorFormData({ ...vendorFormData, password: e.target.value })}
                    error={vendorErrors.password}
                    placeholder="Minimum 6 characters"
                    required
                  />
                  <Input
                    label="Company Name"
                    type="text"
                    value={vendorFormData.companyName}
                    onChange={(e) => setVendorFormData({ ...vendorFormData, companyName: e.target.value })}
                    error={vendorErrors.companyName}
                    required
                  />
                  <Input
                    label="Mobile Number"
                    type="tel"
                    value={vendorFormData.mobileNumber}
                    onChange={(e) => setVendorFormData({ ...vendorFormData, mobileNumber: e.target.value })}
                    error={vendorErrors.mobileNumber}
                    placeholder="Optional"
                  />
                  <Input
                    label="Phone (Company)"
                    type="tel"
                    value={vendorFormData.phone}
                    onChange={(e) => setVendorFormData({ ...vendorFormData, phone: e.target.value })}
                    placeholder="Optional"
                  />
                  <div>
                    <label className="block text-sm font-medium text-charcoal mb-2">
                      Service Types <span className="text-error">*</span>
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {serviceTypesList.map((type) => (
                        <label key={type} className="flex items-center space-x-2 cursor-pointer p-2 rounded-lg hover:bg-stone-100 transition-colors">
                          <input
                            type="checkbox"
                            checked={vendorFormData.serviceTypes.includes(type)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setVendorFormData({
                                  ...vendorFormData,
                                  serviceTypes: [...vendorFormData.serviceTypes, type]
                                });
                              } else {
                                setVendorFormData({
                                  ...vendorFormData,
                                  serviceTypes: vendorFormData.serviceTypes.filter(t => t !== type)
                                });
                              }
                            }}
                            className="rounded w-4 h-4 text-obsidian-500 focus:ring-obsidian-500"
                          />
                          <span className="text-sm text-charcoal">{type}</span>
                        </label>
                      ))}
                    </div>
                    {vendorErrors.serviceTypes && (
                      <p className="mt-1 text-sm text-error">{vendorErrors.serviceTypes}</p>
                    )}
                  </div>
                  <Button type="submit" variant="primary">
                    Create Vendor
                  </Button>
                </form>
              )}
            </Card>
          </div>
        )}

        {/* Manage Tab */}
        {activeTab === 'manage' && renderManageTab()}

        {/* Performance Tab */}
        {activeTab === 'performance' && (
          <div>
            <div className="mb-6 flex space-x-4 border-b border-stone-300">
              <button
                onClick={() => setPerformanceType('managers')}
                className={`px-6 py-3 font-semibold transition-colors ${
                  performanceType === 'managers'
                    ? 'text-obsidian border-b-2 border-obsidian'
                    : 'text-architectural hover:text-charcoal'
                }`}
              >
                Managers Performance
              </button>
              <button
                onClick={() => setPerformanceType('vendors')}
                className={`px-6 py-3 font-semibold transition-colors ${
                  performanceType === 'vendors'
                    ? 'text-obsidian border-b-2 border-obsidian'
                    : 'text-architectural hover:text-charcoal'
                }`}
              >
                Vendors Performance
              </button>
            </div>

            {loading ? (
              <div className="py-12">
                <Skeleton.Card />
                <Skeleton.Card />
                <Skeleton.Card />
              </div>
            ) : (
              <div className="bg-stone-100 rounded-2xl shadow-md overflow-hidden border border-stone-200">
                <table className="w-full">
                  <thead className="bg-obsidian text-porcelain">
                    <tr>
                      {performanceType === 'managers' ? (
                        <>
                          <th className="px-6 py-3 text-left text-xs font-medium uppercase">Name</th>
                          <th className="px-6 py-3 text-left text-xs font-medium uppercase">Email</th>
                          <th className="px-6 py-3 text-left text-xs font-medium uppercase">Status</th>
                          <th className="px-6 py-3 text-left text-xs font-medium uppercase">Tasks Assigned</th>
                          <th className="px-6 py-3 text-left text-xs font-medium uppercase">Tasks Completed</th>
                          <th className="px-6 py-3 text-left text-xs font-medium uppercase">Completion Rate</th>
                          <th className="px-6 py-3 text-left text-xs font-medium uppercase">Properties Managed</th>
                        </>
                      ) : (
                        <>
                          <th className="px-6 py-3 text-left text-xs font-medium uppercase">Name</th>
                          <th className="px-6 py-3 text-left text-xs font-medium uppercase">Company</th>
                          <th className="px-6 py-3 text-left text-xs font-medium uppercase">Email</th>
                          <th className="px-6 py-3 text-left text-xs font-medium uppercase">Status</th>
                          <th className="px-6 py-3 text-left text-xs font-medium uppercase">Tasks Assigned</th>
                          <th className="px-6 py-3 text-left text-xs font-medium uppercase">Tasks Completed</th>
                          <th className="px-6 py-3 text-left text-xs font-medium uppercase">Completion Rate</th>
                          <th className="px-6 py-3 text-left text-xs font-medium uppercase">Rating</th>
                        </>
                      )}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-200 bg-porcelain">
                    {performanceType === 'managers' ? (
                      managersPerformance.length === 0 ? (
                        <tr>
                          <td colSpan="7" className="px-6 py-8 text-center text-architectural">
                            No managers found
                          </td>
                        </tr>
                      ) : (
                        managersPerformance.map((manager) => (
                          <tr key={manager.id} className="hover:bg-stone-50">
                            <td className="px-6 py-4 whitespace-nowrap font-medium text-charcoal">{manager.name}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-architectural">{manager.email}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    manager.status === 'active' ? 'bg-eucalyptus/20 text-eucalyptus' :
                    manager.status === 'suspended' ? 'bg-error/20 text-error' :
                    'bg-warning/20 text-warning'
                  }`}>
                    {manager.status}
                  </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-charcoal">{manager.tasksAssigned}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-charcoal">{manager.tasksCompleted}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-charcoal">{manager.completionRate}%</td>
                            <td className="px-6 py-4 whitespace-nowrap text-charcoal">{manager.propertiesManaged}</td>
                          </tr>
                        ))
                      )
                    ) : (
                      vendorsPerformance.length === 0 ? (
                        <tr>
                          <td colSpan="8" className="px-6 py-8 text-center text-architectural">
                            No vendors found
                          </td>
                        </tr>
                      ) : (
                        vendorsPerformance.map((vendor) => (
                          <tr key={vendor.id} className="hover:bg-stone-50">
                            <td className="px-6 py-4 whitespace-nowrap font-medium text-charcoal">{vendor.name}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-architectural">{vendor.companyName}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-architectural">{vendor.email}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                vendor.status === 'active' ? 'bg-eucalyptus/20 text-eucalyptus' :
                                vendor.status === 'suspended' ? 'bg-error/20 text-error' :
                                'bg-warning/20 text-warning'
                              }`}>
                                {vendor.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-charcoal">{vendor.tasksAssigned}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-charcoal">{vendor.tasksCompleted}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-charcoal">{vendor.completionRate}%</td>
                            <td className="px-6 py-4 whitespace-nowrap text-charcoal">{vendor.performanceRating}/5</td>
                          </tr>
                        ))
                      )
                    )}
                  </tbody>
                </table>
            </div>
          )}
          </div>
        )}
      </div>

      {/* Modals */}
      {editingManager && (
        <EditManagerModal
          manager={editingManager}
          onClose={() => setEditingManager(null)}
          onSave={async (payload) => {
            await handleUpdateManager(editingManager.id, payload);
            setEditingManager(null);
          }}
        />
      )}

      {editingVendor && (
        <EditVendorModal
          vendor={editingVendor}
          serviceTypes={serviceTypesList}
          onClose={() => setEditingVendor(null)}
          onSave={async (payload) => {
            await handleUpdateVendor(editingVendor.id, payload);
            setEditingVendor(null);
          }}
        />
      )}

      {assigningManager && (
        <PropertyAssignmentModal
          title="Assign Properties"
          properties={properties}
          selectedIds={assigningManager.assignedProperties || []}
          onClose={() => setAssigningManager(null)}
          onSave={async (ids) => {
            await handleAssignProperties(assigningManager.id, ids);
            setAssigningManager(null);
          }}
        />
      )}
    </div>
  );
}

export default AdminDashboard;
