import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { adminAPI } from '../../services/api';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Skeleton from '../../components/ui/Skeleton';
import EditVendorModal from '../../components/admin/EditVendorModal';
// import ConfirmationModal from '../../components/ui/ConfirmationModal';

const VendorManagement = () => {
    const [vendors, setVendors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    const [showCreateForm, setShowCreateForm] = useState(false);
    const [editingVendor, setEditingVendor] = useState(null);
    const [confirmAction, setConfirmAction] = useState(null);

    const [formData, setFormData] = useState({
        email: '', name: '', password: '', mobileNumber: '',
        companyName: '', serviceTypes: []
    });
    const [formErrors, setFormErrors] = useState({});
    const [serviceInput, setServiceInput] = useState('');

    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const [searchParams] = useSearchParams();

    useEffect(() => {
        loadData();
    }, []);

    useEffect(() => {
        if (searchParams.get('action') === 'create') {
            setShowCreateForm(true);
        }
    }, [searchParams]);

    const loadData = async () => {
        setLoading(true);
        try {
            const data = await adminAPI.getVendors();
            setVendors(Array.isArray(data) ? data : []);
            if (!Array.isArray(data)) console.warn('Expected array for vendors, got:', data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        setErrorMessage('');
        setSuccessMessage('');

        const errors = {};
        if (!formData.email) errors.email = 'Required';
        if (!formData.name) errors.name = 'Required';
        if (!formData.password) errors.password = 'Required';
        if (!formData.companyName) errors.companyName = 'Required';
        // Governance: Enforce Service Type
        if (formData.serviceTypes.length === 0) errors.serviceTypes = 'At least one service type is required';

        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            return;
        }

        try {
            await adminAPI.createVendor(formData);
            setSuccessMessage('Vendor created successfully');
            setShowCreateForm(false);
            setFormData({
                email: '', name: '', password: '', mobileNumber: '',
                companyName: '', serviceTypes: []
            });
            loadData();
        } catch (err) {
            setErrorMessage(err.message || 'Failed to create vendor');
        }
    };

    const addServiceType = () => {
        if (serviceInput.trim() && !formData.serviceTypes.includes(serviceInput.trim())) {
            setFormData({
                ...formData,
                serviceTypes: [...formData.serviceTypes, serviceInput.trim()]
            });
            setServiceInput('');
        }
    };

    const removeServiceType = (type) => {
        setFormData({
            ...formData,
            serviceTypes: formData.serviceTypes.filter(t => t !== type)
        });
    };

    const confirmStatusChange = (vendor) => {
        setConfirmAction({
            type: vendor.status === 'active' ? 'suspend' : 'activate',
            item: vendor
        });
    };

    const executeStatusChange = async ({ reason, note } = {}) => {
        if (!confirmAction) return;
        const vendor = confirmAction.item;

        try {
            if (confirmAction.type === 'suspend') {
                await adminAPI.suspendVendor(vendor.id, { reason, note });
            } else {
                await adminAPI.activateVendor(vendor.id);
            }
            setConfirmAction(null);
            loadData();
            setSuccessMessage(`Vendor ${confirmAction.type === 'suspend' ? 'suspended' : 'activated'} successfully`);
        } catch (err) {
            setErrorMessage(err.message || 'Action failed');
        }
    };

    const formatDate = (isoString) => {
        if (!isoString) return 'N/A';
        return new Date(isoString).toLocaleDateString('en-US', {
            year: 'numeric', month: 'short', day: 'numeric'
        });
    };

    const filteredVendors = useMemo(() => {
        return vendors.filter(v => {
            const matchesSearch = (v.name || '').toLowerCase().includes(search.toLowerCase()) ||
                (v.email || '').toLowerCase().includes(search.toLowerCase()) ||
                (v.companyName || '').toLowerCase().includes(search.toLowerCase());
            const matchesStatus = statusFilter === 'all' ? true : (v.status || 'active') === statusFilter;
            return matchesSearch && matchesStatus;
        });
    }, [vendors, search, statusFilter]);

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-[var(--ui-text-primary)]">Vendor Management</h1>
                    <p className="text-[var(--ui-text-secondary)]">Manage vendors and service providers</p>
                </div>
                <Button variant="primary" onClick={() => setShowCreateForm(true)}>
                    + Create Vendor
                </Button>
            </div>

            {/* Filters */}
            <Card variant="default" padding="sm" className="flex flex-wrap gap-4 items-center">
                <input
                    type="text"
                    placeholder="Search by name, email, or company..."
                    className="px-3 py-2 border rounded-md bg-[var(--ui-bg-input)] text-[var(--ui-text-primary)] w-80"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <select
                    className="px-3 py-2 border rounded-md bg-[var(--ui-bg-input)] text-[var(--ui-text-primary)]"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                >
                    <option value="all">All Status</option>
                    <option value="active">Active</option>
                    <option value="suspended">Suspended</option>
                </select>
            </Card>

            {successMessage && <div className="p-4 bg-eucalyptus/10 text-eucalyptus rounded-lg border border-eucalyptus/20">{successMessage}</div>}
            {errorMessage && <div className="p-4 bg-error/10 text-error rounded-lg border border-error/20">{errorMessage}</div>}

            {/* Create Form */}
            {showCreateForm && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <Card variant="elevated" className="w-full max-w-md max-h-[90vh] overflow-y-auto">
                        <h2 className="text-xl font-bold mb-4">Create Vendor</h2>
                        <form onSubmit={handleCreate} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Company Name</label>
                                <input
                                    className="w-full px-3 py-2 border rounded-md"
                                    value={formData.companyName}
                                    onChange={e => setFormData({ ...formData, companyName: e.target.value })}
                                />
                                {formErrors.companyName && <p className="text-error text-xs">{formErrors.companyName}</p>}
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Contact Name</label>
                                    <input
                                        className="w-full px-3 py-2 border rounded-md"
                                        value={formData.name}
                                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    />
                                    {formErrors.name && <p className="text-error text-xs">{formErrors.name}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Email</label>
                                    <input
                                        className="w-full px-3 py-2 border rounded-md"
                                        type="email"
                                        value={formData.email}
                                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                                    />
                                    {formErrors.email && <p className="text-error text-xs">{formErrors.email}</p>}
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Password</label>
                                <input
                                    className="w-full px-3 py-2 border rounded-md"
                                    type="password"
                                    value={formData.password}
                                    onChange={e => setFormData({ ...formData, password: e.target.value })}
                                />
                                {formErrors.password && <p className="text-error text-xs">{formErrors.password}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Service Types</label>
                                <div className="flex gap-2 mb-2">
                                    <input
                                        className="flex-1 px-3 py-2 border rounded-md"
                                        value={serviceInput}
                                        onChange={e => setServiceInput(e.target.value)}
                                        placeholder="e.g. Plumbing"
                                        onKeyPress={e => e.key === 'Enter' && (e.preventDefault(), addServiceType())}
                                    />
                                    <Button type="button" variant="secondary" onClick={addServiceType}>Add</Button>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {formData.serviceTypes.map(type => (
                                        <span key={type} className="px-2 py-1 bg-[var(--ui-bg-muted)] rounded-full text-xs flex items-center gap-1">
                                            {type}
                                            <button type="button" onClick={() => removeServiceType(type)} className="hover:text-error">×</button>
                                        </span>
                                    ))}
                                </div>
                                {formErrors.serviceTypes && <p className="text-error text-xs">{formErrors.serviceTypes}</p>}
                            </div>

                            <div className="flex justify-end gap-2 mt-6">
                                <Button variant="secondary" onClick={() => setShowCreateForm(false)} type="button">Cancel</Button>
                                <Button variant="primary" type="submit">Create Vendor</Button>
                            </div>
                        </form>
                    </Card>
                </div>
            )}

            {/* Table */}
            <Card variant="default" padding="none" className="overflow-hidden overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[800px]">
                    <thead className="bg-[var(--ui-bg-muted)] text-[var(--ui-text-secondary)] text-xs uppercase font-semibold border-b border-[var(--ui-border-default)]">
                        <tr>
                            <th className="px-6 py-4">Company / Contact</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4">Services</th>
                            <th className="px-6 py-4">Created On</th>
                            <th className="px-6 py-4">Last Updated</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--ui-border-default)]">
                        {loading && (
                            <tr><td colSpan="6" className="p-4"><Skeleton variant="text" /></td></tr>
                        )}
                        {!loading && filteredVendors.length === 0 && (
                            <tr><td colSpan="6" className="p-8 text-center text-[var(--ui-text-muted)]">No vendors found</td></tr>
                        )}
                        {!loading && filteredVendors.map(vendor => (
                            <tr key={vendor.id} className="hover:bg-[var(--ui-bg-subtle)] transition-colors">
                                <td className="px-6 py-4">
                                    <div className="font-semibold text-[var(--ui-text-primary)]">{vendor.companyName}</div>
                                    <div className="text-xs text-[var(--ui-text-secondary)]">{vendor.name} • {vendor.email}</div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${vendor.status === 'active' ? 'bg-success/10 text-success' : 'bg-error/10 text-error'
                                        }`}>
                                        {vendor.status || 'Active'}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex flex-wrap gap-1">
                                        {(vendor.serviceTypes || []).slice(0, 3).map(type => (
                                            <span key={type} className="inline-block px-2 py-0.5 bg-[var(--ui-bg-muted)] text-[var(--ui-text-secondary)] text-xs rounded">
                                                {type}
                                            </span>
                                        ))}
                                        {(vendor.serviceTypes || []).length > 3 && (
                                            <span className="text-xs text-[var(--ui-text-muted)]">+{vendor.serviceTypes.length - 3} more</span>
                                        )}
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-sm text-[var(--ui-text-secondary)]">
                                    {formatDate(vendor.createdAt)}
                                </td>
                                <td className="px-6 py-4 text-sm text-[var(--ui-text-secondary)]">
                                    {formatDate(vendor.updatedAt)}
                                </td>
                                <td className="px-6 py-4 text-right space-x-2">
                                    <button
                                        className="text-[var(--ui-text-secondary)] hover:text-[var(--ui-text-primary)] text-sm font-medium"
                                        onClick={() => setEditingVendor(vendor)}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        className={`${vendor.status === 'active' ? 'text-error' : 'text-success'} hover:underline text-sm font-medium`}
                                        onClick={() => confirmStatusChange(vendor)}
                                    >
                                        {vendor.status === 'active' ? 'Suspend' : 'Activate'}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </Card>

            {/* Edit Modal */}
            {editingVendor && EditVendorModal && (
                <EditVendorModal
                    vendor={editingVendor}
                    onClose={() => setEditingVendor(null)}
                    onSave={async (payload) => {
                        await adminAPI.updateVendor(editingVendor.id, payload);
                        setEditingVendor(null);
                        loadData();
                    }}
                />
            )}

            {/* {ConfirmationModal && (
                <ConfirmationModal
                    isOpen={!!confirmAction}
                    onClose={() => setConfirmAction(null)}
                    onConfirm={executeStatusChange}
                    title={confirmAction?.type === 'suspend' ? 'Suspend Vendor' : 'Activate Vendor'}
                    message={confirmAction?.type === 'suspend'
                        ? `Are you sure you want to suspend access for ${confirmAction.item.companyName}?`
                        : `Are you sure you want to activate access for ${confirmAction.item.companyName}?`
                    }
                    confirmLabel={confirmAction?.type === 'suspend' ? 'Suspend Account' : 'Activate Account'}
                    confirmVariant={confirmAction?.type === 'suspend' ? 'danger' : 'success'}
                    requireReason={confirmAction?.type === 'suspend'}
                    reasonOptions={['Policy Violation', 'Non-Payment', 'Owner Request', 'Inactive', 'Other']}
                />
            )} */}
        </div>
    );
};

export default VendorManagement;
