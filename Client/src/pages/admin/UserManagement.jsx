import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { adminAPI, propertiesAPI } from '../../services/api';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Skeleton from '../../components/ui/Skeleton';
import EditManagerModal from '../../components/admin/EditManagerModal';
import PropertyAssignmentModal from '../../components/admin/PropertyAssignmentModal';
// import ConfirmationModal from '../../components/ui/ConfirmationModal';

const UserManagement = () => {
    const [managers, setManagers] = useState([]);
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    // UI Logic States
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [editingManager, setEditingManager] = useState(null);
    const [assigningManager, setAssigningManager] = useState(null);

    // Confirmation Modal State
    const [confirmAction, setConfirmAction] = useState(null); // { type: 'suspend'|'activate', item: manager }

    // Form Data State (for create)
    const [formData, setFormData] = useState({ email: '', name: '', password: '', mobileNumber: '' });
    const [formErrors, setFormErrors] = useState({});
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
            const [managersData, propertiesData] = await Promise.all([
                adminAPI.getPropertyManagers(),
                propertiesAPI.getAll().catch(() => [])
            ]);
            setManagers(Array.isArray(managersData) ? managersData : []);
            setProperties(Array.isArray(propertiesData) ? propertiesData : []);
            if (!Array.isArray(managersData)) console.warn('Expected array for managers, got:', managersData);
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

        // Basic validation
        const errors = {};
        if (!formData.email) errors.email = 'Required';
        if (!formData.name) errors.name = 'Required';
        if (!formData.password) errors.password = 'Required';

        // Governance: Enforce property scope (mock validation for now as we assign later)
        // In a real scenario, we might force checking a box "Assign Scope Later" or similar.

        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            return;
        }

        try {
            await adminAPI.createPropertyManager(formData);
            setSuccessMessage('Manager created successfully');
            setShowCreateForm(false);
            setFormData({ email: '', name: '', password: '', mobileNumber: '' });
            loadData();
        } catch (err) {
            setErrorMessage(err.message || 'Failed to create manager');
        }
    };

    const confirmStatusChange = (manager) => {
        setConfirmAction({
            type: manager.status === 'active' ? 'suspend' : 'activate',
            item: manager
        });
    };

    const executeStatusChange = async ({ reason, note } = {}) => {
        if (!confirmAction) return;
        const manager = confirmAction.item;

        try {
            if (confirmAction.type === 'suspend') {
                await adminAPI.suspendPropertyManager(manager.id, { reason, note });
            } else {
                await adminAPI.activatePropertyManager(manager.id);
            }
            setConfirmAction(null);
            loadData();
            setSuccessMessage(`Manager ${confirmAction.type === 'suspend' ? 'suspended' : 'activated'} successfully`);
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

    const filteredManagers = useMemo(() => {
        return managers.filter(m => {
            const matchesSearch = (m.name || '').toLowerCase().includes(search.toLowerCase()) ||
                (m.email || '').toLowerCase().includes(search.toLowerCase());
            const matchesStatus = statusFilter === 'all' ? true : (m.status || 'active') === statusFilter;
            return matchesSearch && matchesStatus;
        });
    }, [managers, search, statusFilter]);

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-[var(--ui-text-primary)]">User Management</h1>
                    <p className="text-[var(--ui-text-secondary)]">Manage property managers and system access</p>
                </div>
                <Button variant="primary" onClick={() => setShowCreateForm(true)}>
                    + Create Manager
                </Button>
            </div>

            {/* Filters */}
            <Card variant="default" padding="sm" className="flex flex-wrap gap-4 items-center">
                <input
                    type="text"
                    placeholder="Search by name or email..."
                    className="px-3 py-2 border rounded-md bg-[var(--ui-bg-input)] text-[var(--ui-text-primary)] w-64"
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
                <div className="ml-auto">
                    <span className="text-xs text-[var(--ui-text-muted)]">Showing {filteredManagers.length} records</span>
                </div>
            </Card>

            {/* Messages */}
            {successMessage && <div className="p-4 bg-eucalyptus/10 text-eucalyptus rounded-lg border border-eucalyptus/20">{successMessage}</div>}
            {errorMessage && <div className="p-4 bg-error/10 text-error rounded-lg border border-error/20">{errorMessage}</div>}

            {/* Create Form Modal */}
            {showCreateForm && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <Card variant="elevated" className="w-full max-w-md">
                        <h2 className="text-xl font-bold mb-4">Create Property Manager</h2>
                        <form onSubmit={handleCreate} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Name</label>
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
                                <label className="block text-sm font-medium mb-1">Mobile</label>
                                <input
                                    className="w-full px-3 py-2 border rounded-md"
                                    value={formData.mobileNumber}
                                    onChange={e => setFormData({ ...formData, mobileNumber: e.target.value })}
                                />
                            </div>
                            <div className="flex justify-end gap-2 mt-6">
                                <Button variant="secondary" onClick={() => setShowCreateForm(false)} type="button">Cancel</Button>
                                <Button variant="primary" type="submit">Create User</Button>
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
                            <th className="px-6 py-4">Name / Email</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4">Properties</th>
                            <th className="px-6 py-4">Created On</th>
                            <th className="px-6 py-4">Last Updated</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--ui-border-default)]">
                        {loading && (
                            <tr><td colSpan="6" className="p-4"><Skeleton variant="text" /></td></tr>
                        )}
                        {!loading && filteredManagers.length === 0 && (
                            <tr><td colSpan="6" className="p-8 text-center text-[var(--ui-text-muted)]">No users found</td></tr>
                        )}
                        {!loading && filteredManagers.map(manager => (
                            <tr key={manager.id} className="hover:bg-[var(--ui-bg-subtle)] transition-colors">
                                <td className="px-6 py-4">
                                    <div className="font-medium text-[var(--ui-text-primary)]">{manager.name}</div>
                                    <div className="text-xs text-[var(--ui-text-secondary)]">{manager.email}</div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${manager.status === 'active' ? 'bg-success/10 text-success' : 'bg-error/10 text-error'
                                        }`}>
                                        {manager.status || 'Active'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-[var(--ui-text-secondary)]">
                                    {manager.assignedProperties?.length || 0}
                                </td>
                                <td className="px-6 py-4 text-sm text-[var(--ui-text-secondary)]">
                                    {formatDate(manager.createdAt)}
                                </td>
                                <td className="px-6 py-4 text-sm text-[var(--ui-text-secondary)]">
                                    {formatDate(manager.updatedAt)}
                                </td>
                                <td className="px-6 py-4 text-right space-x-2">
                                    <button
                                        className="text-[var(--ui-action-primary)] hover:underline text-sm font-medium"
                                        onClick={() => setAssigningManager(manager)}
                                    >
                                        Assign
                                    </button>
                                    <button
                                        className="text-[var(--ui-text-secondary)] hover:text-[var(--ui-text-primary)] text-sm font-medium"
                                        onClick={() => setEditingManager(manager)}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        className={`${manager.status === 'active' ? 'text-error' : 'text-success'} hover:underline text-sm font-medium`}
                                        onClick={() => confirmStatusChange(manager)}
                                    >
                                        {manager.status === 'active' ? 'Suspend' : 'Activate'}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </Card>

            {/* Modals */}
            {editingManager && EditManagerModal && (
                <EditManagerModal
                    manager={editingManager}
                    onClose={() => setEditingManager(null)}
                    onSave={async (payload) => {
                        await adminAPI.updatePropertyManager(editingManager.id, payload);
                        setEditingManager(null);
                        loadData();
                    }}
                />
            )}
            {assigningManager && PropertyAssignmentModal && (
                <PropertyAssignmentModal
                    title="Assign Properties"
                    properties={properties}
                    selectedIds={assigningManager.assignedProperties || []}
                    onClose={() => setAssigningManager(null)}
                    onSave={async (ids) => {
                        await adminAPI.assignProperties(assigningManager.id, ids);
                        setAssigningManager(null);
                        loadData();
                    }}
                />
            )}

            {/* {ConfirmationModal && (
                <ConfirmationModal
                    isOpen={!!confirmAction}
                    onClose={() => setConfirmAction(null)}
                    onConfirm={executeStatusChange}
                    title={confirmAction?.type === 'suspend' ? 'Suspend Manager' : 'Activate Manager'}
                    message={confirmAction?.type === 'suspend'
                        ? `Are you sure you want to suspend access for ${confirmAction.item.name}? They will no longer be able to log in.`
                        : `Are you sure you want to activate access for ${confirmAction.item.name}?`
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

export default UserManagement;
