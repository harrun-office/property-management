import React from 'react';
import {
    LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area
} from 'recharts';
import Card from '../ui/Card';

const mockUserGrowth = [
    { name: 'Jan', users: 400, active: 240 },
    { name: 'Feb', users: 3000, active: 1398 },
    { name: 'Mar', users: 2000, active: 9800 },
    { name: 'Apr', users: 2780, active: 3908 },
    { name: 'May', users: 1890, active: 4800 },
    { name: 'Jun', users: 2390, active: 3800 },
    { name: 'Jul', users: 3490, active: 4300 },
];

const mockTaskCompletion = [
    { name: 'Mon', completed: 12, pending: 4 },
    { name: 'Tue', completed: 19, pending: 8 },
    { name: 'Wed', completed: 15, pending: 2 },
    { name: 'Thu', completed: 22, pending: 10 },
    { name: 'Fri', completed: 28, pending: 15 },
    { name: 'Sat', completed: 10, pending: 1 },
    { name: 'Sun', completed: 5, pending: 0 },
];

const mockRevenue = [
    { name: 'Week 1', value: 4000 },
    { name: 'Week 2', value: 3000 },
    { name: 'Week 3', value: 2000 },
    { name: 'Week 4', value: 2780 },
];

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

export const UserGrowthChart = ({ data = mockUserGrowth }) => {
    return (
        <ChartCard title="User Growth">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
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

export const TaskCompletionChart = ({ data = mockTaskCompletion }) => {
    return (
        <ChartCard title="Task Performance">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
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

export const RevenueChart = ({ data = mockRevenue }) => {
    return (
        <ChartCard
            title="Revenue Trend"
            action={
                <select className="text-xs border rounded p-1 bg-[var(--ui-bg-surface)] text-[var(--ui-text-secondary)]">
                    <option>This Month</option>
                    <option>Last Month</option>
                </select>
            }
        >
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
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
                        unit="$"
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
