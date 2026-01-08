import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { propertiesAPI, tenantAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import PropertyCard from '../../components/PropertyCard';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Skeleton from '../../components/ui/Skeleton';
import ErrorDisplay from '../../components/ui/ErrorDisplay';
import EmptyState from '../../components/ui/EmptyState';

function SavedProperties() {
  const navigate = useNavigate();
  const { isTenant } = useAuth();
  const [savedProperties, setSavedProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Check if tenant has active property and redirect
  useEffect(() => {
    if (isTenant) {
      tenantAPI.getDashboard()
        .then(data => {
          if (data.currentProperty) {
            navigate('/tenant/dashboard', { replace: true });
          }
        })
        .catch(() => {
          // If error, allow access (might be network issue)
        });
    }
  }, [isTenant, navigate]);

  useEffect(() => {
    loadSavedProperties();
  }, []);

  const loadSavedProperties = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await propertiesAPI.getSavedProperties?.() || [];
      setSavedProperties(data);
    } catch (err) {
      setError(err.message || 'Failed to load saved properties');
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (propertyId) => {
    try {
      await propertiesAPI.unsaveProperty?.(propertyId);
      setSavedProperties(savedProperties.filter(p => p.id !== propertyId));
    } catch (err) {
      setError(err.message || 'Failed to remove property');
    }
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
    <div className="min-h-full bg-porcelain py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-charcoal mb-2">Saved Properties</h1>
            <p className="text-architectural">Your favorite properties</p>
          </div>
          <Link to="/properties">
            <Button variant="primary">Browse More</Button>
          </Link>
        </div>

        {error && <ErrorDisplay message={error} onRetry={loadSavedProperties} className="mb-6" />}

        {savedProperties.length === 0 ? (
          <EmptyState
            title="No saved properties yet"
            description="Start browsing and save properties you're interested in!"
            action={
              <Link to="/properties">
                <Button variant="primary">Browse Properties</Button>
              </Link>
            }
            icon={
              <svg className="w-16 h-16 text-architectural" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            }
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedProperties.map((property) => (
              <div key={property.id} className="relative">
                <PropertyCard property={property} />
                <Button
                  variant="danger"
                  size="sm"
                  className="absolute top-4 right-4"
                  onClick={() => handleRemove(property.id)}
                  aria-label="Remove from saved"
                  icon={
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  }
                >
                  Remove
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default SavedProperties;

