import React, { useState } from 'react';
import Button from './Button';
import Card from './Card';

const ConfirmationModal = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmLabel = 'Confirm',
    confirmVariant = 'primary',
    requireReason = false,
    reasonOptions = []
}) => {
    const [reason, setReason] = useState('');
    const [note, setNote] = useState('');
    const [error, setError] = useState('');

    if (!isOpen) return null;

    const handleSubmit = () => {
        if (requireReason && !reason) {
            setError('Please select a reason');
            return;
        }
        onConfirm({ reason, note });
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
            <Card variant="elevated" className="w-full max-w-md space-y-4">
                <h3 className="text-lg font-bold text-[var(--ui-text-primary)]">{title}</h3>
                <p className="text-[var(--ui-text-secondary)]">{message}</p>

                {requireReason && (
                    <div className="space-y-3 pt-2">
                        <div>
                            <label className="block text-sm font-medium mb-1 text-[var(--ui-text-primary)]">Reason <span className="text-error">*</span></label>
                            <select
                                className="w-full px-3 py-2 border rounded-md bg-[var(--ui-bg-input)] text-[var(--ui-text-primary)]"
                                value={reason}
                                onChange={(e) => {
                                    setReason(e.target.value);
                                    setError('');
                                }}
                            >
                                <option value="">Select a reason...</option>
                                {reasonOptions.map(opt => (
                                    <option key={opt} value={opt}>{opt}</option>
                                ))}
                            </select>
                            {error && <p className="text-error text-xs mt-1">{error}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1 text-[var(--ui-text-primary)]">Internal Note (Optional)</label>
                            <textarea
                                className="w-full px-3 py-2 border rounded-md bg-[var(--ui-bg-input)] text-[var(--ui-text-primary)]"
                                rows={2}
                                value={note}
                                onChange={(e) => setNote(e.target.value)}
                                placeholder="Add context for this action..."
                            />
                        </div>
                    </div>
                )}

                <div className="flex justify-end gap-3 pt-4 border-t border-[var(--ui-border-default)]">
                    <Button variant="secondary" onClick={onClose}>Cancel</Button>
                    <Button variant={confirmVariant} onClick={handleSubmit}>{confirmLabel}</Button>
                </div>
            </Card>
        </div>
    );
};

export default ConfirmationModal;
