import React from 'react';
import Card from '../ui/Card';
import Button from '../ui/Button';

const ActionCenter = ({ pendingItems = [], loading = false }) => {
    const items = pendingItems;

    const getSeverityColor = (severity) => {
        switch (severity) {
            case 'critical': return 'bg-error/10 text-error border-error/20';
            case 'high': return 'bg-warning/10 text-warning border-warning/20';
            default: return 'bg-info/10 text-info border-info/20';
        }
    };

    const getIcon = (type) => {
        switch (type) {
            case 'alert':
                return (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                );
            case 'approval':
                return (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                );
            default:
                return (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                );
        }
    };

    return (
        <Card variant="elevated" className="h-full border-l-4 border-l-[var(--ui-action-primary)]">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-[var(--ui-text-primary)] flex items-center gap-2">
                    <span className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-error opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-error"></span>
                    </span>
                    Action Required
                </h3>
                <span className="text-sm font-medium text-[var(--ui-text-muted)]">{items.length} Pending</span>
            </div>

            <div className="space-y-3">
                {items.map((item) => (
                    <div
                        key={item.id}
                        className={`p-3 rounded-lg border flex items-start justify-between group cursor-pointer hover:bg-[var(--ui-bg-muted)] transition-colors ${getSeverityColor(item.severity)}`}
                    >
                        <div className="flex gap-3">
                            <div className="mt-0.5 shrink-0">
                                {getIcon(item.type)}
                            </div>
                            <div>
                                <p className="font-semibold text-sm text-[var(--ui-text-primary)] group-hover:text-[var(--ui-action-primary)] transition-colors">
                                    {item.title}
                                </p>
                                <p className="text-xs text-[var(--ui-text-secondary)] mt-0.5">{item.time}</p>
                            </div>
                        </div>
                        <Button size="sm" variant="secondary" className="text-xs py-1 h-auto">
                            Resolve
                        </Button>
                    </div>
                ))}

                {items.length === 0 && !loading && (
                    <div className="py-8 text-center text-[var(--ui-text-muted)] bg-[var(--ui-bg-subtle)] rounded-lg border border-dashed border-[var(--ui-border-default)]">
                        <p>No pending actions needed</p>
                    </div>
                )}
            </div>
        </Card>
    );
};

export default ActionCenter;
