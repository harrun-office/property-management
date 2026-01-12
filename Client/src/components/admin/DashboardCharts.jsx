import React, { useState, useEffect } from 'react';
import {
    LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area
} from 'recharts';
import Card from '../ui/Card';
import { adminAPI } from '../../services/api';

const ChartCard = ({ title, children, action }) => (
    <Card variant="default" className="h-full">
        <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-[var(--ui-text-primary)]">{title}</h3>
            {action}
        </div>
        <div className="h-64 w-full">
            {children}
        </div>
    </Card>
);

export const UserGrowthChart = ({ data }) => {
    const [chartData, setChartData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                // For now, show a message that real data will be available once system has usage history
                // In a real implementation, this would fetch user growth data from the API
                setChartData([]);
                setError('User growth data will be available once the system has been in use for several months.');
            } catch (err) {
                setError('Failed to load user growth data');
                console.error('Error fetching user growth data:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return (
            <ChartCard title="User Growth">
                <div className="flex items-center justify-center h-full">
                    <div className="text-[var(--ui-text-muted)]">Loading...</div>
                </div>
            </ChartCard>
        );
    }

    if (error || chartData.length === 0) {
        return (
            <ChartCard title="User Growth">
                <div className="flex items-center justify-center h-full">
                    <div className="text-center text-[var(--ui-text-muted)]">
                        <div className="text-sm mb-2">📊</div>
                        <div className="text-xs">
                            {error || 'No user growth data available yet'}
                        </div>
                    </div>
                </div>
            </ChartCard>
        );
    }

    return (
        <ChartCard title="User Growth">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                    <defs>
                        <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="var(--ui-action-primary)" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="var(--ui-action-primary)" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--ui-border-default)" />
                    <XAxis
                        dataKey="name"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: 'var(--ui-text-muted)', fontSize: 12 }}
                    />
                    <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: 'var(--ui-text-muted)', fontSize: 12 }}
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: 'var(--ui-bg-surface)',
                            borderRadius: '8px',
                            border: '1px solid var(--ui-border-default)',
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                        }}
                    />
                    <Area
                        type="monotone"
                        dataKey="users"
                        stroke="var(--ui-action-primary)"
                        strokeWidth={3}
                        fillOpacity={1}
                        fill="url(#colorUsers)"
                    />
                </AreaChart>
            </ResponsiveContainer>
        </ChartCard>
    );
};

export const TaskCompletionChart = ({ data }) => {
    const [chartData, setChartData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                // For now, we'll fetch vendor performance data and transform it
                // In a full implementation, we'd have a dedicated endpoint for task completion metrics
                const vendorsData = await adminAPI.getVendorsPerformance();

                // Transform the data into chart format
                // This is a simplified transformation - real implementation would aggregate by day/week
                const transformedData = vendorsData.map((vendor, index) => ({
                    name: vendor.name.substring(0, 3), // Short name for display
                    completed: vendor.completedTasks || 0,
                    pending: vendor.pendingTasks || 0
                }));

                setChartData(transformedData);
            } catch (err) {
                setError('Failed to load task performance data');
                console.error('Error fetching task performance data:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return (
            <ChartCard title="Task Performance">
                <div className="flex items-center justify-center h-full">
                    <div className="text-[var(--ui-text-muted)]">Loading...</div>
                </div>
            </ChartCard>
        );
    }

    if (error || chartData.length === 0) {
        return (
            <ChartCard title="Task Performance">
                <div className="flex items-center justify-center h-full">
                    <div className="text-center text-[var(--ui-text-muted)]">
                        <div className="text-sm mb-2">📈</div>
                        <div className="text-xs">
                            {error || 'No task performance data available'}
                        </div>
                    </div>
                </div>
            </ChartCard>
        );
    }

    return (
        <ChartCard title="Task Performance">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--ui-border-default)" />
                    <XAxis
                        dataKey="name"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: 'var(--ui-text-muted)', fontSize: 12 }}
                    />
                    <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: 'var(--ui-text-muted)', fontSize: 12 }}
                    />
                    <Tooltip
                        cursor={{ fill: 'var(--ui-bg-muted)' }}
                        contentStyle={{
                            backgroundColor: 'var(--ui-bg-surface)',
                            borderRadius: '8px',
                            border: '1px solid var(--ui-border-default)'
                        }}
                    />
                    <Bar
                        dataKey="completed"
                        name="Completed"
                        fill="var(--ui-success)"
                        radius={[4, 4, 0, 0]}
                    />
                    <Bar
                        dataKey="pending"
                        name="Pending"
                        fill="var(--ui-warning)"
                        radius={[4, 4, 0, 0]}
                    />
                </BarChart>
            </ResponsiveContainer>
        </ChartCard>
    );
};

export const RevenueChart = ({ data }) => {
    const [chartData, setChartData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [timeRange, setTimeRange] = useState('This Month');

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                // Revenue data would come from a dedicated analytics endpoint
                // For now, show placeholder until revenue tracking is implemented
                setChartData([]);
                setError('Revenue tracking will be available once payment processing is implemented.');
            } catch (err) {
                setError('Failed to load revenue data');
                console.error('Error fetching revenue data:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [timeRange]);

    if (loading) {
        return (
            <ChartCard
                title="Revenue Trend"
                action={
                    <select
                        className="text-xs border rounded p-1 bg-[var(--ui-bg-surface)] text-[var(--ui-text-secondary)]"
                        value={timeRange}
                        onChange={(e) => setTimeRange(e.target.value)}
                    >
                        <option>This Month</option>
                        <option>Last Month</option>
                    </select>
                }
            >
                <div className="flex items-center justify-center h-full">
                    <div className="text-[var(--ui-text-muted)]">Loading...</div>
                </div>
            </ChartCard>
        );
    }

    if (error || chartData.length === 0) {
        return (
            <ChartCard
                title="Revenue Trend"
                action={
                    <select
                        className="text-xs border rounded p-1 bg-[var(--ui-bg-surface)] text-[var(--ui-text-secondary)]"
                        value={timeRange}
                        onChange={(e) => setTimeRange(e.target.value)}
                    >
                        <option>This Month</option>
                        <option>Last Month</option>
                    </select>
                }
            >
                <div className="flex items-center justify-center h-full">
                    <div className="text-center text-[var(--ui-text-muted)]">
                        <div className="text-sm mb-2">💰</div>
                        <div className="text-xs">
                            {error || 'Revenue data will be available once payment processing is active'}
                        </div>
                    </div>
                </div>
            </ChartCard>
        );
    }

    return (
        <ChartCard
            title="Revenue Trend"
            action={
                <select
                    className="text-xs border rounded p-1 bg-[var(--ui-bg-surface)] text-[var(--ui-text-secondary)]"
                    value={timeRange}
                    onChange={(e) => setTimeRange(e.target.value)}
                >
                    <option>This Month</option>
                    <option>Last Month</option>
                </select>
            }
        >
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--ui-border-default)" />
                    <XAxis
                        dataKey="name"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: 'var(--ui-text-muted)', fontSize: 12 }}
                    />
                    <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: 'var(--ui-text-muted)', fontSize: 12 }}
                        unit="₹"
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: 'var(--ui-bg-surface)',
                            borderRadius: '8px',
                            border: '1px solid var(--ui-border-default)'
                        }}
                    />
                    <Line
                        type="monotone"
                        dataKey="value"
                        stroke="var(--ui-info)"
                        strokeWidth={3}
                        dot={{ r: 4, fill: 'var(--ui-info)', strokeWidth: 2, stroke: 'var(--ui-bg-surface)' }}
                    />
                </LineChart>
            </ResponsiveContainer>
        </ChartCard>
    );
};
