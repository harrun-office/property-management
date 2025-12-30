import React from 'react';
import Card from '../../components/ui/Card';

const PlatformActivity = () => {
    return (
        <div className="max-w-7xl mx-auto space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-[var(--ui-text-primary)]">Platform Activity</h1>
                <p className="text-[var(--ui-text-secondary)]">Live monitoring of system-wide events</p>
            </div>

            <Card className="p-12 text-center text-[var(--ui-text-muted)] border-dashed">
                <div className="mb-4 text-4xl">📡</div>
                <h3 className="text-lg font-medium text-[var(--ui-text-primary)]">Live Activity Feed</h3>
                <p>Real-time monitoring dashboard coming soon.</p>
            </Card>
        </div>
    );
};

export default PlatformActivity;
