import React, { useState, useEffect } from 'react';
import { adminAPI } from '../../services/api';
import Card from '../../components/ui/Card';
import Skeleton from '../../components/ui/Skeleton';

const AuditLogs = () => {
    const [logs, setLogs] = useState([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        action: '',
        resourceType: '',
        userId: '',
        limit: 50
    });

    useEffect(() => {
        loadData();
    }, [filters]);

    const loadData = async () => {
        setLoading(true);
        try {
            const data = await adminAPI.getAuditLogs(filters);
            setLogs(data.logs || []);
            setTotal(data.total || 0);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-[var(--ui-text-primary)]">System Audit Logs</h1>
                <p className="text-[var(--ui-text-secondary)]">Track all system activities and security events</p>
            </div>

            {/* Filter Bar */}
            <Card variant="default" padding="sm" className="flex flex-wrap gap-4 items-center">
                <select
                    className="px-3 py-2 border rounded-md bg-[var(--ui-bg-input)] text-[var(--ui-text-primary)]"
                    value={filters.action}
                    onChange={(e) => setFilters(prev => ({ ...prev, action: e.target.value }))}
                >
                    <option value="">All Actions</option>
                    <option value="login">Login</option>
                    <option value="register">Register</option>
                    <option value="create_property">Create Property</option>
                    <option value="create_vendor">Create Vendor</option>
                    <option value="create_manager">Create Manager</option>
                </select>

                <select
                    className="px-3 py-2 border rounded-md bg-[var(--ui-bg-input)] text-[var(--ui-text-primary)]"
                    value={filters.resourceType}
                    onChange={(e) => setFilters(prev => ({ ...prev, resourceType: e.target.value }))}
                >
                    <option value="">All Resources</option>
                    <option value="user">User</option>
                    <option value="property">Property</option>
                    <option value="vendor">Vendor</option>
                    <option value="task">Task</option>
                </select>

                <button
                    onClick={() => setFilters({ action: '', resourceType: '', userId: '', limit: 50 })}
                    className="text-sm text-[var(--ui-action-primary)] hover:underline ml-auto"
                >
                    Clear Filters
                </button>
            </Card>

            {/* Logs Table */}
            <Card variant="default" padding="none" className="overflow-hidden">
                <table className="w-full text-left border-collapse text-sm">
                    <thead className="bg-[var(--ui-bg-muted)] text-[var(--ui-text-secondary)] uppercase font-semibold border-b border-[var(--ui-border-default)]">
                        <tr>
                            <th className="px-6 py-3 w-48">Timestamp</th>
                            <th className="px-6 py-3 w-40">Action</th>
                            <th className="px-6 py-3">User</th>
                            <th className="px-6 py-3">Details</th>
                            <th className="px-6 py-3 w-32">IP Address</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--ui-border-default)]">
                        {loading && (
                            [1, 2, 3, 4, 5].map(i => (
                                <tr key={i}><td colSpan="5" className="p-4"><Skeleton variant="text" /></td></tr>
                            ))
                        )}
                        {!loading && logs.length === 0 && (
                            <tr><td colSpan="5" className="p-8 text-center text-[var(--ui-text-muted)]">No logs found</td></tr>
                        )}
                        {!loading && logs.map(log => (
                            <tr key={log.id} className="hover:bg-[var(--ui-bg-subtle)] transition-colors font-mono text-[var(--ui-text-primary)]">
                                <td className="px-6 py-3 text-[var(--ui-text-secondary)] whitespace-nowrap">
                                    {new Date(log.timestamp).toLocaleString()}
                                </td>
                                <td className="px-6 py-3">
                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-[var(--ui-bg-muted)] text-[var(--ui-text-primary)] border border-[var(--ui-border-default)]">
                                        {log.action}
                                    </span>
                                </td>
                                <td className="px-6 py-3">
                                    <div className="font-medium">{log.userName}</div>
                                    <div className="text-xs text-[var(--ui-text-secondary)]">{log.userRole}</div>
                                </td>
                                <td className="px-6 py-3 text-[var(--ui-text-secondary)] break-all">
                                    {JSON.stringify(log.details)}
                                </td>
                                <td className="px-6 py-3 text-[var(--ui-text-muted)]">
                                    {log.ipAddress || '-'}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className="p-4 border-t border-[var(--ui-border-default)] text-xs text-[var(--ui-text-secondary)] text-center">
                    Showing {logs.length} of {total} records
                </div>
            </Card>
        </div>
    );
};

export default AuditLogs;
