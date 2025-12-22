import { useState, useEffect } from 'react';
import { tenantAPI } from '../../services/api';

function TenantLease() {
  const [lease, setLease] = useState(null);
  const [currentProperty, setCurrentProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadLeaseData();
  }, []);

  const loadLeaseData = async () => {
    setLoading(true);
    setError('');
    try {
      const [leaseData, property] = await Promise.all([
        tenantAPI.getLease().catch(() => null),
        tenantAPI.getCurrentProperty().catch(() => null)
      ]);
      setLease(leaseData);
      setCurrentProperty(property);
    } catch (err) {
      setError(err.message || 'Failed to load lease information');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-porcelain flex items-center justify-center">
        <p className="text-charcoal text-lg">Loading lease information...</p>
      </div>
    );
  }

  if (error && !lease && !currentProperty) {
    return (
      <div className="min-h-screen bg-porcelain flex items-center justify-center">
        <div className="text-center">
          <p className="text-error text-lg mb-4">{error}</p>
          <button
            onClick={loadLeaseData}
            className="px-4 py-2 bg-obsidian text-porcelain rounded-lg hover:bg-obsidian-light transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!lease && !currentProperty) {
    return (
      <div className="min-h-screen bg-porcelain py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="bg-stone-100 p-12 rounded-xl text-center border border-stone-200">
            <svg className="w-16 h-16 mx-auto text-architectural mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="text-xl font-semibold text-charcoal mb-2">No Active Lease</h3>
            <p className="text-architectural mb-6">You don't have an active lease at the moment.</p>
            <a href="/properties" className="inline-block px-6 py-2 bg-obsidian text-porcelain rounded-lg hover:bg-obsidian-light transition-colors">
              Browse Properties
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-porcelain py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-charcoal mb-2">Lease Information</h1>
          <p className="text-architectural">View your current lease agreement and property details</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Current Property Card */}
          {currentProperty && (
            <div className="bg-stone-100 rounded-xl shadow-md p-6 border border-stone-200">
              <h2 className="text-2xl font-bold text-charcoal mb-4">Current Property</h2>
              <div className="space-y-4">
                <div>
                  <p className="text-architectural text-sm">Property Name</p>
                  <p className="text-lg font-semibold text-charcoal">{currentProperty.title}</p>
                </div>
                <div>
                  <p className="text-architectural text-sm">Address</p>
                  <p className="text-charcoal">{currentProperty.address}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-architectural text-sm">Bedrooms</p>
                    <p className="text-charcoal font-semibold">{currentProperty.bedrooms}</p>
                  </div>
                  <div>
                    <p className="text-architectural text-sm">Bathrooms</p>
                    <p className="text-charcoal font-semibold">{currentProperty.bathrooms}</p>
                  </div>
                  <div>
                    <p className="text-architectural text-sm">Square Feet</p>
                    <p className="text-charcoal font-semibold">{currentProperty.squareFeet || currentProperty.area}</p>
                  </div>
                  <div>
                    <p className="text-architectural text-sm">Type</p>
                    <p className="text-charcoal font-semibold capitalize">{currentProperty.propertyType}</p>
                  </div>
                </div>
                {currentProperty.amenities && currentProperty.amenities.length > 0 && (
                  <div>
                    <p className="text-architectural text-sm mb-2">Amenities</p>
                    <div className="flex flex-wrap gap-2">
                      {currentProperty.amenities.map((amenity, idx) => (
                        <span key={idx} className="px-3 py-1 bg-porcelain rounded-lg text-sm text-charcoal border border-stone-200">
                          {amenity}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Lease Details */}
          {lease && (
            <div className="bg-stone-100 rounded-xl shadow-md p-6 border border-stone-200">
              <h2 className="text-2xl font-bold text-charcoal mb-4">Lease Agreement</h2>
              <div className="space-y-4">
                <div>
                  <p className="text-architectural text-sm">Monthly Rent</p>
                  <p className="text-2xl font-bold text-charcoal">${lease.monthlyRent.toLocaleString()}/month</p>
                </div>
                <div>
                  <p className="text-architectural text-sm">Security Deposit</p>
                  <p className="text-lg font-semibold text-charcoal">${lease.securityDeposit.toLocaleString()}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-architectural text-sm">Lease Start</p>
                    <p className="text-charcoal font-semibold">{new Date(lease.startDate).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-architectural text-sm">Lease End</p>
                    <p className="text-charcoal font-semibold">{new Date(lease.endDate).toLocaleDateString()}</p>
                  </div>
                </div>
                <div>
                  <p className="text-architectural text-sm">Status</p>
                  <span className="inline-block px-3 py-1 bg-eucalyptus/20 text-eucalyptus rounded-full text-sm font-semibold">
                    {lease.status}
                  </span>
                </div>
                {lease.owner && (
                  <div>
                    <p className="text-architectural text-sm">Property Owner</p>
                    <p className="text-charcoal font-semibold">{lease.owner.name}</p>
                    <p className="text-sm text-architectural">{lease.owner.email}</p>
                  </div>
                )}
                <div>
                  <p className="text-architectural text-sm mb-2">Terms</p>
                  <p className="text-charcoal text-sm">{lease.terms}</p>
                </div>
                <button
                  onClick={() => alert('Lease document download feature coming soon')}
                  className="w-full px-4 py-2 bg-obsidian text-porcelain rounded-lg hover:bg-obsidian-light transition-colors"
                >
                  Download Lease Document
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Important Dates */}
        {lease && (
          <div className="mt-6 bg-stone-100 rounded-xl shadow-md p-6 border border-stone-200">
            <h2 className="text-2xl font-bold text-charcoal mb-4">Important Dates</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-porcelain p-4 rounded-lg border border-stone-200">
                <p className="text-architectural text-sm mb-1">Move-in Date</p>
                <p className="text-lg font-semibold text-charcoal">{new Date(lease.startDate).toLocaleDateString()}</p>
              </div>
              <div className="bg-porcelain p-4 rounded-lg border border-stone-200">
                <p className="text-architectural text-sm mb-1">Lease End Date</p>
                <p className="text-lg font-semibold text-charcoal">{new Date(lease.endDate).toLocaleDateString()}</p>
              </div>
              <div className="bg-porcelain p-4 rounded-lg border border-stone-200">
                <p className="text-architectural text-sm mb-1">Days Remaining</p>
                <p className="text-lg font-semibold text-charcoal">
                  {Math.ceil((new Date(lease.endDate) - new Date()) / (1000 * 60 * 60 * 24))} days
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default TenantLease;

