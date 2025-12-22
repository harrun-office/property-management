import { useState } from 'react';

function EditManagerModal({ manager, onSave, onClose }) {
  const [form, setForm] = useState({
    name: manager?.name || '',
    email: manager?.email || '',
    mobileNumber: manager?.mobileNumber || '',
    password: ''
  });

  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.email.trim()) e.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Invalid email';
    if (form.password && form.password.length < 6) e.password = 'Password must be at least 6 characters';
    if (form.mobileNumber && !/^[0-9+\-\s()]+$/.test(form.mobileNumber)) e.mobileNumber = 'Invalid mobile number';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    await onSave({
      name: form.name,
      email: form.email,
      mobileNumber: form.mobileNumber,
      ...(form.password ? { password: form.password } : {})
    });
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center px-4">
      <div className="bg-white w-full max-w-xl rounded-2xl shadow-xl border border-stone-200">
        <div className="px-6 py-4 border-b border-stone-200 flex items-center justify-between">
          <h3 className="text-xl font-semibold text-charcoal">Edit Manager</h3>
          <button onClick={onClose} className="text-architectural hover:text-error">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-charcoal mb-1">Name</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className={`w-full px-3 py-2 border rounded-lg bg-porcelain focus:ring-2 focus:ring-obsidian focus:border-obsidian ${
                errors.name ? 'border-error' : 'border-stone-300'
              }`}
            />
            {errors.name && <p className="text-error text-sm mt-1">{errors.name}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-charcoal mb-1">Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className={`w-full px-3 py-2 border rounded-lg bg-porcelain focus:ring-2 focus:ring-obsidian focus:border-obsidian ${
                errors.email ? 'border-error' : 'border-stone-300'
              }`}
            />
            {errors.email && <p className="text-error text-sm mt-1">{errors.email}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-charcoal mb-1">Mobile Number</label>
            <input
              type="tel"
              value={form.mobileNumber}
              onChange={(e) => setForm({ ...form, mobileNumber: e.target.value })}
              className={`w-full px-3 py-2 border rounded-lg bg-porcelain focus:ring-2 focus:ring-obsidian focus:border-obsidian ${
                errors.mobileNumber ? 'border-error' : 'border-stone-300'
              }`}
            />
            {errors.mobileNumber && <p className="text-error text-sm mt-1">{errors.mobileNumber}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-charcoal mb-1">New Password (optional)</label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className={`w-full px-3 py-2 border rounded-lg bg-porcelain focus:ring-2 focus:ring-obsidian focus:border-obsidian ${
                errors.password ? 'border-error' : 'border-stone-300'
              }`}
              placeholder="Leave blank to keep current password"
            />
            {errors.password && <p className="text-error text-sm mt-1">{errors.password}</p>}
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg border border-stone-300 text-charcoal hover:bg-stone-100">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 rounded-lg bg-obsidian text-porcelain hover:bg-obsidian-light font-semibold">
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditManagerModal;

