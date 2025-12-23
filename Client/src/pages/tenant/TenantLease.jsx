import { useState, useEffect } from 'react';
import { tenantAPI } from '../../services/api';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Skeleton from '../../components/ui/Skeleton';
import ErrorDisplay from '../../components/ui/ErrorDisplay';
import EmptyState from '../../components/ui/EmptyState';

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
      <div className="min-h-screen bg-porcelain py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <Skeleton variant="title" width="40%" className="mb-2" />
            <Skeleton variant="text" width="60%" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {[1, 2].map((i) => (
              <Skeleton.Card key={i} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error && !lease && !currentProperty) {
    return (
      <div className="min-h-screen bg-porcelain py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <ErrorDisplay
            message={error}
            onRetry={loadLeaseData}
          />
        </div>
      </div>
    );
  }

  if (!lease && !currentProperty) {
    return (
      <div className="min-h-screen bg-porcelain py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <EmptyState
            title="No Active Lease"
            description="You don't have an active lease at the moment."
            action={
              <a href="/properties">
                <Button variant="primary">Browse Properties</Button>
              </a>
            }
            icon={
              <svg className="w-16 h-16 text-architectural" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            }
          />
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
            <Card variant="elevated" padding="lg">
              <Card.Title className="text-2xl mb-4">Current Property</Card.Title>
              <Card.Body className="space-y-4">
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
              </Card.Body>
            </Card>
          )}

          {/* Lease Details */}
          {lease && (
            <Card variant="elevated" padding="lg">
              <Card.Title className="text-2xl mb-4">Lease Agreement</Card.Title>
              <Card.Body className="space-y-4">
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
                <Button
                  variant="primary"
                  fullWidth
                  onClick={() => alert('Lease document download feature coming soon')}
                >
                  Download Lease Document
                </Button>
                </div>
              </Card.Body>
            </Card>
          )}
        </div>

        {/* Important Dates */}
        {lease && (
          <Card variant="elevated" padding="lg" className="mt-6">
            <Card.Title className="text-2xl mb-4">Important Dates</Card.Title>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card variant="filled" padding="md">
                <p className="text-architectural text-sm mb-1">Move-in Date</p>
                <p className="text-lg font-semibold text-charcoal">{new Date(lease.startDate).toLocaleDateString()}</p>
              </Card>
              <Card variant="filled" padding="md">
                <p className="text-architectural text-sm mb-1">Lease End Date</p>
                <p className="text-lg font-semibold text-charcoal">{new Date(lease.endDate).toLocaleDateString()}</p>
              </Card>
              <Card variant="filled" padding="md">
                <p className="text-architectural text-sm mb-1">Days Remaining</p>
                <p className="text-lg font-semibold text-charcoal">
                  {Math.ceil((new Date(lease.endDate) - new Date()) / (1000 * 60 * 60 * 24))} days
                </p>
              </Card>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}

export default TenantLease;

