import { useEffect, useMemo, useState } from 'react';

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
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center px-4">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-xl border border-stone-200">
        <div className="px-6 py-4 border-b border-stone-200 flex items-center justify-between">
          <h3 className="text-xl font-semibold text-charcoal">{title}</h3>
          <button onClick={onClose} className="text-architectural hover:text-error">✕</button>
        </div>

        <div className="px-6 py-4 space-y-3">
          <input
            type="text"
            placeholder="Search properties..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg bg-porcelain focus:ring-2 focus:ring-obsidian focus:border-obsidian"
          />

          <div className="max-h-72 overflow-y-auto space-y-2 pr-1">
            {filtered.length === 0 ? (
              <p className="text-sm text-architectural">No properties found.</p>
            ) : (
              filtered.map((p) => (
                <label key={p.id} className="flex items-start space-x-3 p-2 rounded-lg hover:bg-stone-100">
                  <input
                    type="checkbox"
                    checked={selected.includes(p.id)}
                    onChange={() => toggleSelect(p.id)}
                    className="mt-1"
                  />
                  <div>
                    <p className="font-semibold text-charcoal">{p.title || 'Untitled Property'}</p>
                    <p className="text-sm text-architectural">{p.address || p.city || ''}</p>
                  </div>
                </label>
              ))
            )}
          </div>
        </div>

        <div className="px-6 py-4 border-t border-stone-200 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 rounded-lg border border-stone-300 text-charcoal hover:bg-stone-100">
            Cancel
          </button>
          <button
            onClick={() => onSave(selected)}
            className="px-4 py-2 rounded-lg bg-obsidian text-porcelain hover:bg-obsidian-light font-semibold"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

export default PropertyAssignmentModal;

