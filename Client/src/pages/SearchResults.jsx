import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { propertiesAPI } from '../services/api';
import PropertyCard from '../components/PropertyCard';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Skeleton from '../components/ui/Skeleton';
import ErrorDisplay from '../components/ui/ErrorDisplay';
import EmptyState from '../components/ui/EmptyState';

function SearchResults() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('search') || '';
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (query) {
      performSearch(query);
    } else {
      setLoading(false);
    }
  }, [query]);

  const performSearch = async (searchTerm) => {
    setLoading(true);
    setError('');
    try {
      const rawData = await propertiesAPI.search?.(searchTerm) || await propertiesAPI.getAll({ search: searchTerm });
      const data = (rawData && rawData.properties) ? rawData.properties : rawData;
      setProperties(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || 'Search failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-porcelain py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-charcoal mb-2">
          Search Results
          {query && <span className="text-architectural text-2xl"> for "{query}"</span>}
        </h1>
        <p className="text-architectural mb-8">
          {properties.length} {properties.length === 1 ? 'property' : 'properties'} found
        </p>

        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Skeleton.Card key={i} />
            ))}
          </div>
        )}

        {error && <ErrorDisplay message={error} onRetry={() => performSearch(query)} className="mb-6" />}

        {!loading && !error && properties.length === 0 && (
          <EmptyState
            title="No properties found"
            description="Try adjusting your search terms or browse all properties."
            action={
              <Link to="/properties">
                <Button variant="primary">Browse All Properties</Button>
              </Link>
            }
            icon={
              <svg className="w-16 h-16 text-architectural" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            }
          />
        )}

        {!loading && !error && properties.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default SearchResults;

