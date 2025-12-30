import React, { useState, useEffect } from 'react';
import Card from '../../components/ui/Card';
import Skeleton from '../../components/ui/Skeleton';

const RevenueHiring = () => {
    // Placeholder - in real app, fetch from API
    // We add 'status' to demonstrate the governance requirement
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Mock fetch
        setLoading(false);
    }, []);

    return (
        <div className="max-w-7xl mx-auto space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-[var(--ui-text-primary)]">Hire Revenue</h1>
                <p className="text-[var(--ui-text-secondary)]">Read-only log of income-generating hires.</p>
            </div>

            {/* Governance: Explanatory Block */}
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-md">
                <div className="flex">
                    <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <div className="ml-3">
                        <p className="text-sm text-blue-700">
                            Revenue is generated <strong>only</strong> from successful hire transactions.
                            There are no subscriptions or recurring fees.
                        </p>
                    </div>
                </div>
            </div>

            <Card variant="default" padding="none" className="overflow-hidden">
                <div className="px-6 py-4 border-b border-[var(--ui-border-default)]">
                    <h3 className="font-semibold text-[var(--ui-text-primary)]">Recent Hire Transactions</h3>
                </div>
                <table className="w-full text-left border-collapse">
                    <thead className="bg-[var(--ui-bg-muted)] text-[var(--ui-text-secondary)] text-xs uppercase font-semibold border-b border-[var(--ui-border-default)]">
                        <tr>
                            <th className="px-6 py-4">Date</th>
                            <th className="px-6 py-4">Transaction ID</th>
                            <th className="px-6 py-4">Hired Pro</th>
                            <th className="px-6 py-4">Hired By</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4 text-right">Amount</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--ui-border-default)]">
                        {loading && (
                            <tr><td colSpan="6" className="p-4"><Skeleton variant="text" /></td></tr>
                        )}
                        {!loading && transactions.length === 0 && (
                            <tr><td colSpan="6" className="p-8 text-center text-[var(--ui-text-muted)]">No recent hire transactions found.</td></tr>
                        )}
                        {/* Example Row (Static for Demo) */}
                        {/*
                        <tr className="hover:bg-[var(--ui-bg-subtle)]">
                            <td className="px-6 py-4 text-sm text-[var(--ui-text-primary)]">Oct 24, 2023</td>
                            <td className="px-6 py-4 text-sm font-mono text-[var(--ui-text-secondary)]">tx_123456</td>
                            <td className="px-6 py-4 text-sm font-medium">Acme Plumbing</td>
                            <td className="px-6 py-4 text-sm text-[var(--ui-text-secondary)]">John Doe</td>
                            <td className="px-6 py-4">
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                    Successful
                                </span>
                            </td>
                            <td className="px-6 py-4 text-sm font-bold text-right text-success">+$50.00</td>
                        </tr>
                        */}
                    </tbody>
                </table>
            </Card>
        </div>
    );
};

export default RevenueHiring;
