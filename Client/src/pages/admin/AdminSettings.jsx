import React from 'react';
import Card from '../../components/ui/Card';

const AdminSettings = () => {
    return (
        <div className="max-w-7xl mx-auto space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-[var(--ui-text-primary)]">Platform Settings</h1>
                <p className="text-[var(--ui-text-secondary)]">Configure global platform parameters</p>
            </div>

            <Card className="p-12 text-center text-[var(--ui-text-muted)] border-dashed">
                <div className="mb-4 text-4xl">⚙️</div>
                <h3 className="text-lg font-medium text-[var(--ui-text-primary)]">Settings Panel</h3>
                <p>Global configuration options coming soon.</p>
            </Card>
        </div>
    );
};

export default AdminSettings;
