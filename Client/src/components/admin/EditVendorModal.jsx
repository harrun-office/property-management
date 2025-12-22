import { useState } from 'react';

function EditVendorModal({ vendor, serviceTypes = [], onSave, onClose }) {
  const [form, setForm] = useState({
    name: vendor?.name || '',
    email: vendor?.email || '',
    mobileNumber: vendor?.mobileNumber || '',
    companyName: vendor?.companyName || '',
    phone: vendor?.phone || '',
    serviceTypes: vendor?.serviceTypes || [],
    password: ''
  });

  const [errors, setErrors] = useState({});

  const toggleServiceType = (type) => {
    if (form.serviceTypes.includes(type)) {
      setForm({ ...form, serviceTypes: form.serviceTypes.filter((t) => t !== type) });
    } else {
      setForm({ ...form, serviceTypes: [...form.serviceTypes, type] });
    }
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.email.trim()) e.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Invalid email';
    if (!form.companyName.trim()) e.companyName = 'Company name is required';
    if (form.password && form.password.length < 6) e.password = 'Password must be at least 6 characters';
    if (!form.serviceTypes.length) e.serviceTypes = 'Select at least one service type';
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
      companyName: form.companyName,
      phone: form.phone,
      serviceTypes: form.serviceTypes,
      ...(form.password ? { password: form.password } : {})
    });
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center px-4">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-xl border border-stone-200">
        <div className="px-6 py-4 border-b border-stone-200 flex items-center justify-between">
          <h3 className="text-xl font-semibold text-charcoal">Edit Vendor</h3>
          <button onClick={onClose} className="text-architectural hover:text-error">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-4 space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
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
              <label className="block text-sm font-medium text-charcoal mb-1">Company Name</label>
              <input
                type="text"
                value={form.companyName}
                onChange={(e) => setForm({ ...form, companyName: e.target.value })}
                className={`w-full px-3 py-2 border rounded-lg bg-porcelain focus:ring-2 focus:ring-obsidian focus:border-obsidian ${
                  errors.companyName ? 'border-error' : 'border-stone-300'
                }`}
              />
              {errors.companyName && <p className="text-error text-sm mt-1">{errors.companyName}</p>}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-charcoal mb-1">Company Phone</label>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg bg-porcelain focus:ring-2 focus:ring-obsidian focus:border-obsidian border-stone-300"
              />
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
          </div>

          <div>
            <label className="block text-sm font-medium text-charcoal mb-2">Service Types</label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {serviceTypes.map((type) => (
                <label key={type} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={form.serviceTypes.includes(type)}
                    onChange={() => toggleServiceType(type)}
                    className="rounded"
                  />
                  <span className="text-sm text-charcoal">{type}</span>
                </label>
              ))}
            </div>
            {errors.serviceTypes && <p className="text-error text-sm mt-1">{errors.serviceTypes}</p>}
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

export default EditVendorModal;

