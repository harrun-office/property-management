import { useEffect, useMemo, useState } from 'react';
import Modal from '../ui/Modal';
import Input from '../ui/Input';
import Button from '../ui/Button';
import Card from '../ui/Card';

function PropertyAssignmentModal({ title, properties = [], selectedIds = [], onSave, onClose }) {
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(selectedIds);

  useEffect(() => {
    setSelected(selectedIds || []);
  }, [selectedIds]);

  const filtered = useMemo(() => {
    return properties.filter((p) => {
      if (!search.trim()) return true;
      const term = search.toLowerCase();
      return (
        (p.title || '').toLowerCase().includes(term) ||
        (p.address || '').toLowerCase().includes(term) ||
        (p.city || '').toLowerCase().includes(term)
      );
    });
  }, [properties, search]);

  const toggleSelect = (id) => {
    if (selected.includes(id)) {
      setSelected(selected.filter((x) => x !== id));
    } else {
      setSelected([...selected, id]);
    }
  };

  return (
    <Modal
      isOpen={!!title}
      onClose={onClose}
      title={title}
      size="lg"
      footer={
        <div className="flex justify-end gap-3">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={() => onSave(selected)}>
            Save ({selected.length} selected)
          </Button>
        </div>
      }
    >
      <div className="space-y-4">
        <Input
          type="text"
          placeholder="Search properties..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          }
        />

        <div className="max-h-72 overflow-y-auto space-y-2 pr-1">
          {filtered.length === 0 ? (
            <p className="text-sm text-architectural text-center py-4">No properties found.</p>
          ) : (
            filtered.map((p) => (
              <label key={p.id} className="block cursor-pointer">
                <Card variant="filled" padding="sm" hover className={selected.includes(p.id) ? 'border-2 border-obsidian-500 bg-obsidian-50' : ''}>
                  <div className="flex items-start space-x-3">
                    <input
                      type="checkbox"
                      checked={selected.includes(p.id)}
                      onChange={() => toggleSelect(p.id)}
                      className="mt-1 w-4 h-4 text-obsidian-500 focus:ring-obsidian-500 rounded"
                    />
                    <div className="flex-1">
                      <p className="font-semibold text-charcoal">{p.title || 'Untitled Property'}</p>
                      <p className="text-sm text-architectural">{p.address || p.city || ''}</p>
                    </div>
                  </div>
                </Card>
              </label>
            ))
          )}
        </div>
      </div>
    </Modal>
  );
}

export default PropertyAssignmentModal;

