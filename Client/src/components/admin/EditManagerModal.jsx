import { useState } from 'react';
import Modal from '../ui/Modal';
import Input from '../ui/Input';
import Button from '../ui/Button';

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
    <Modal
      isOpen={!!manager}
      onClose={onClose}
      title="Edit Manager"
      size="md"
      footer={
        <div className="flex justify-end gap-3">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" type="submit" form="edit-manager-form">
            Save
          </Button>
        </div>
      }
    >
      <form id="edit-manager-form" onSubmit={handleSubmit} className="space-y-5">
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
          label="New Password (optional)"
          type="password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          error={errors.password}
          placeholder="Leave blank to keep current password"
        />
      </form>
    </Modal>
  );
}

export default EditManagerModal;

