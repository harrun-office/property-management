import { useState } from 'react';
import Modal from '../ui/Modal';
import Input from '../ui/Input';
import Button from '../ui/Button';

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
    <Modal
      isOpen={!!vendor}
      onClose={onClose}
      title="Edit Vendor"
      size="lg"
      footer={
        <div className="flex justify-end gap-3">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" type="submit" form="edit-vendor-form">
            Save
          </Button>
        </div>
      }
    >
      <form id="edit-vendor-form" onSubmit={handleSubmit} className="space-y-5">
        <div className="grid md:grid-cols-2 gap-5">
          <Input
            label="Name"
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            error={errors.name}
            required
          />
          <Input
            label="Email"
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            error={errors.email}
            required
          />
          <Input
            label="Mobile Number"
            type="tel"
            value={form.mobileNumber}
            onChange={(e) => setForm({ ...form, mobileNumber: e.target.value })}
            error={errors.mobileNumber}
          />
          <Input
            label="Company Name"
            type="text"
            value={form.companyName}
            onChange={(e) => setForm({ ...form, companyName: e.target.value })}
            error={errors.companyName}
            required
          />
          <Input
            label="Company Phone"
            type="tel"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />
          <Input
            label="New Password (optional)"
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            error={errors.password}
            placeholder="Leave blank to keep current password"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-charcoal mb-2">
            Service Types <span className="text-error-500">*</span>
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {serviceTypes.map((type) => (
              <label key={type} className="flex items-center space-x-2 cursor-pointer p-2 rounded-lg hover:bg-stone-100 transition-colors">
                <input
                  type="checkbox"
                  checked={form.serviceTypes.includes(type)}
                  onChange={() => toggleServiceType(type)}
                  className="rounded w-4 h-4 text-obsidian-500 focus:ring-obsidian-500"
                />
                <span className="text-sm text-charcoal">{type}</span>
              </label>
            ))}
          </div>
          {errors.serviceTypes && <p className="text-error-500 text-sm mt-1">{errors.serviceTypes}</p>}
        </div>
      </form>
    </Modal>
  );
}

export default EditVendorModal;

