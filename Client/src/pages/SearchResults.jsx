import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { propertiesAPI } from '../services/api';
import PropertyCard from '../components/PropertyCard';

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
      const data = await propertiesAPI.search?.(searchTerm) || await propertiesAPI.getAll({ search: searchTerm });
      setProperties(data);
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
          <div className="text-center py-12">
            <p className="text-architectural text-lg">Searching...</p>
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-error/20 border border-error text-error rounded-lg">
            {error}
          </div>
        )}

        {!loading && !error && properties.length === 0 && (
          <div className="bg-stone-100 p-12 rounded-xl text-center border border-stone-200">
            <svg className="w-16 h-16 mx-auto text-architectural mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <h3 className="text-xl font-semibold text-charcoal mb-2">No properties found</h3>
            <p className="text-architectural mb-6">Try adjusting your search terms or browse all properties.</p>
            <a href="/properties" className="inline-block px-6 py-2 bg-obsidian text-porcelain rounded-lg hover:bg-obsidian-light transition-colors">
              Browse All Properties
            </a>
          </div>
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

