import { useState, useEffect } from 'react';
import { ownerAPI } from '../../services/api';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Skeleton from '../../components/ui/Skeleton';
import ErrorDisplay from '../../components/ui/ErrorDisplay';
import EmptyState from '../../components/ui/EmptyState';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';

function Tenants() {
  const [tenants, setTenants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [endTenancyModal, setEndTenancyModal] = useState({ isOpen: false, tenant: null });
  const [endTenancyForm, setEndTenancyForm] = useState({ reason: '', notes: '' });
  const [endingTenancy, setEndingTenancy] = useState(false);

  useEffect(() => {
    loadTenants();
  }, []);

  const loadTenants = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await ownerAPI.getTenants();
      setTenants(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEndTenancy = (tenant) => {
    setEndTenancyModal({ isOpen: true, tenant });
    setEndTenancyForm({ reason: '', notes: '' });
  };

  const handleEndTenancySubmit = async () => {
    if (!endTenancyForm.reason.trim()) {
      alert('Please provide a reason for ending the tenancy.');
      return;
    }

    setEndingTenancy(true);
    try {
      await ownerAPI.endTenancy(endTenancyModal.tenant.id, endTenancyForm.reason, endTenancyForm.notes);
      alert('Tenancy ended successfully. The property is now available for new tenants.');
      setEndTenancyModal({ isOpen: false, tenant: null });
      loadTenants(); // Refresh the list
    } catch (err) {
      alert('Failed to end tenancy: ' + err.message);
    } finally {
      setEndingTenancy(false);
    }
  };

  const handleEndTenancyFormChange = (e) => {
    setEndTenancyForm({
      ...endTenancyForm,
      [e.target.name]: e.target.value
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-porcelain py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <Skeleton variant="title" width="30%" className="mb-2" />
            <Skeleton variant="text" width="50%" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Skeleton.Card key={i} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-porcelain py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-charcoal mb-2">Tenants</h1>
          <p className="text-architectural">Manage your tenants and leases</p>
        </div>

        {error && <ErrorDisplay message={error} onRetry={loadTenants} className="mb-6" />}

        {tenants.length === 0 ? (
          <EmptyState
            title="No tenants yet"
            description="Tenants will appear here once applications are approved."
            icon={
              <svg className="w-16 h-16 text-architectural" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            }
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tenants.map((tenant) => (
              <Card key={tenant.id} variant="elevated" padding="lg">
                <Card.Title className="text-xl mb-2">
                  {tenant.tenant?.name || 'Unknown Tenant'}
                </Card.Title>
                <Card.Description className="mb-4">{tenant.property?.title}</Card.Description>
                <Card.Body className="space-y-2 text-sm">
                  <p><span className="font-medium text-charcoal">Email:</span> <span className="text-architectural">{tenant.tenant?.email || 'N/A'}</span></p>
                  <p><span className="font-medium text-charcoal">Phone:</span> <span className="text-architectural">{tenant.tenant?.phone || 'N/A'}</span></p>
                  <p><span className="font-medium text-charcoal">Monthly Rent:</span> <span className="text-architectural">₹{tenant.monthlyRent || 0}</span></p>
                  <p><span className="font-medium text-charcoal">Lease Start:</span> <span className="text-architectural">{new Date(tenant.leaseStartDate).toLocaleDateString()}</span></p>
                  <p><span className="font-medium text-charcoal">Status:</span> 
                    <span className={`ml-2 px-2 py-1 rounded-full text-xs font-semibold ${
                      tenant.status === 'active' ? 'bg-eucalyptus-100 text-eucalyptus-700' : 'bg-stone-200 text-charcoal'
                    }`}>
                      {tenant.status}
                    </span>
                  </p>
                </Card.Body>
                <Card.Footer>
                  {tenant.status === 'active' && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEndTenancy(tenant)}
                      className="w-full border-red-300 text-red-600 hover:bg-red-50"
                    >
                      End Tenancy
                    </Button>
                  )}
                </Card.Footer>
              </Card>
            ))}
          </div>
        )}

        {/* End Tenancy Modal */}
        <Modal
          isOpen={endTenancyModal.isOpen}
          onClose={() => setEndTenancyModal({ isOpen: false, tenant: null })}
          title="End Tenancy"
        >
          <div className="space-y-4">
            {endTenancyModal.tenant && (
              <div className="bg-stone-50 p-4 rounded-lg">
                <h3 className="font-semibold text-charcoal mb-2">Tenant Details</h3>
                <p><strong>Name:</strong> {endTenancyModal.tenant.tenant?.name}</p>
                <p><strong>Email:</strong> {endTenancyModal.tenant.tenant?.email}</p>
                <p><strong>Property:</strong> {endTenancyModal.tenant.property?.title}</p>
                <p><strong>Monthly Rent:</strong> ₹{endTenancyModal.tenant.monthlyRent}</p>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-charcoal mb-2">
                Reason for Ending Tenancy *
              </label>
              <select
                name="reason"
                value={endTenancyForm.reason}
                onChange={handleEndTenancyFormChange}
                className="w-full p-2 border border-stone-300 rounded-lg bg-porcelain focus:ring-2 focus:ring-obsidian-500 focus:border-obsidian-500"
                required
              >
                <option value="">Select a reason</option>
                <option value="tenant_violation">Tenant Violation</option>
                <option value="property_sale">Property Sale</option>
                <option value="lease_termination">Lease Termination</option>
                <option value="non_payment">Non-payment of Rent</option>
                <option value="property_renovation">Property Renovation</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-charcoal mb-2">
                Additional Notes (Optional)
              </label>
              <textarea
                name="notes"
                value={endTenancyForm.notes}
                onChange={handleEndTenancyFormChange}
                rows={3}
                className="w-full p-2 border border-stone-300 rounded-lg bg-porcelain focus:ring-2 focus:ring-obsidian-500 focus:border-obsidian-500"
                placeholder="Provide any additional details..."
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                variant="outline"
                onClick={() => setEndTenancyModal({ isOpen: false, tenant: null })}
                className="flex-1"
                disabled={endingTenancy}
              >
                Cancel
              </Button>
              <Button
                onClick={handleEndTenancySubmit}
                className="flex-1 bg-red-600 hover:bg-red-700"
                disabled={endingTenancy}
              >
                {endingTenancy ? 'Ending Tenancy...' : 'End Tenancy'}
              </Button>
            </div>

            <p className="text-xs text-architectural mt-2">
              ⚠️ This action will terminate the tenancy, make the property available for new tenants, and notify the tenant via notification.
            </p>
          </div>
        </Modal>
      </div>
    </div>
  );
}

export default Tenants;

