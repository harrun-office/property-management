import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { propertiesAPI, tenantAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import PropertyCard from '../../components/PropertyCard';

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
      <div className="min-h-screen bg-porcelain flex items-center justify-center">
        <p className="text-charcoal text-lg">Loading saved properties...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-porcelain py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-charcoal mb-2">Saved Properties</h1>
            <p className="text-architectural">Your favorite properties</p>
          </div>
          <Link to="/properties" className="px-6 py-2 bg-obsidian text-porcelain rounded-lg hover:bg-obsidian-light transition-colors">
            Browse More
          </Link>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-error/20 border border-error text-error rounded-lg">
            {error}
          </div>
        )}

        {savedProperties.length === 0 ? (
          <div className="bg-stone-100 p-12 rounded-xl text-center border border-stone-200">
            <svg className="w-16 h-16 mx-auto text-architectural mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            <h3 className="text-xl font-semibold text-charcoal mb-2">No saved properties yet</h3>
            <p className="text-architectural mb-6">Start browsing and save properties you're interested in!</p>
            <Link to="/properties" className="inline-block px-6 py-2 bg-obsidian text-porcelain rounded-lg hover:bg-obsidian-light transition-colors">
              Browse Properties
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedProperties.map((property) => (
              <div key={property.id} className="relative">
                <PropertyCard property={property} />
                <button
                  onClick={() => handleRemove(property.id)}
                  className="absolute top-4 right-4 p-2 bg-obsidian/80 text-porcelain rounded-full hover:bg-error transition-colors"
                  aria-label="Remove from saved"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default SavedProperties;

