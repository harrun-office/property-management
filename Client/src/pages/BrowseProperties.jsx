import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { propertiesAPI, tenantAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import PropertyCard from '../components/PropertyCard';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Skeleton from '../components/ui/Skeleton';
import ErrorDisplay from '../components/ui/ErrorDisplay';
import EmptyState from '../components/ui/EmptyState';

function BrowseProperties() {
  const navigate = useNavigate();
  const { isTenant, isAuthenticated } = useAuth();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [savedIds, setSavedIds] = useState(new Set());
  const [filters, setFilters] = useState({
    // Basic Filters
    propertyType: '',
    minPrice: '',
    maxPrice: '',
    bedrooms: '',
    bathrooms: '',
    minArea: '',
    maxArea: '',
    searchLocation: '',
    city: '',
    state: '',
    zipCode: '',
    sortBy: 'price',

    // Advanced Filters
    minMonthlyRent: '',
    maxMonthlyRent: '',
    minSecurityDeposit: '',
    maxSecurityDeposit: '',
    petPolicy: '',
    leaseTerms: '',
    parking: '',
    yearBuilt: '',
    availableDate: '',
    amenities: [],
    utilities: [],
    sortOrder: 'asc'
  });

  const availableAmenities = [
    'Air Conditioning', 'Heating', 'Dishwasher', 'Washer/Dryer', 'Parking',
    'Balcony', 'Gym', 'Pool', 'Elevator', 'Doorman', 'Pet Friendly',
    'Furnished', 'Hardwood Floors', 'Fireplace', 'Storage'
  ];

  const availableUtilities = [
    'Electricity', 'Water', 'Gas', 'Internet', 'Cable TV', 'Trash', 'Sewer'
  ];

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
    loadProperties();
  }, [filters]);

  const loadProperties = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await propertiesAPI.getAll(filters);
      // Handle both array (legacy/mock) and object (paginated) responses
      if (Array.isArray(data)) {
        setProperties(data);
      } else if (data && data.properties && Array.isArray(data.properties)) {
        setProperties(data.properties);
      } else {
        console.error("Unexpected API response format:", data);
        setProperties([]);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadSaved = async () => {
      try {
        if (isAuthenticated && isTenant) {
          const saved = await propertiesAPI.getSavedProperties();
          const ids = new Set(saved.map(p => p.id));
          setSavedIds(ids);
        } else {
          setSavedIds(new Set());
        }
      } catch (e) {
        // Silent failure
      }
    };
    loadSaved();
  }, [isAuthenticated, isTenant]);

  const handleFilterChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === 'checkbox') {
      if (name === 'amenities' || name === 'utilities') {
        setFilters(prev => ({
          ...prev,
          [name]: checked
            ? [...prev[name], value]
            : prev[name].filter(item => item !== value)
        }));
      }
    } else {
      setFilters({
        ...filters,
        [name]: value
      });
    }
  };

  const hasActiveFilters = () => {
    return Object.entries(filters).some(([key, value]) => {
      if (key === 'sortBy' || key === 'sortOrder') return false;
      if (Array.isArray(value)) return value.length > 0;
      return value !== '' && value !== null;
    });
  };

  const getActiveFilterCount = () => {
    return Object.entries(filters).filter(([key, value]) => {
      if (key === 'sortBy' || key === 'sortOrder') return false;
      if (Array.isArray(value)) return value.length > 0;
      return value !== '' && value !== null;
    }).length;
  };

  const clearFilters = () => {
    setFilters({
      propertyType: '',
      minPrice: '',
      maxPrice: '',
      bedrooms: '',
      bathrooms: '',
      minArea: '',
      maxArea: '',
      searchLocation: '',
      city: '',
      state: '',
      zipCode: '',
      sortBy: 'price',
      minMonthlyRent: '',
      maxMonthlyRent: '',
      minSecurityDeposit: '',
      maxSecurityDeposit: '',
      petPolicy: '',
      leaseTerms: '',
      parking: '',
      yearBuilt: '',
      availableDate: '',
      amenities: [],
      utilities: [],
      sortOrder: 'asc'
    });
  };

  return (
    <div className="min-h-screen bg-porcelain py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-charcoal mb-2">Property Listings</h1>
          <p className="text-architectural">Find your perfect property with advanced filters</p>
        </div>

        {/* Location Filter Section */}
        <Card variant="elevated" padding="lg" className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <Card.Title>Location</Card.Title>
            <Button
              variant={showAdvancedFilters ? "secondary" : "primary"}
              size="sm"
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            >
              {showAdvancedFilters ? 'Hide Advanced Filters' : 'Show Advanced Filters'}
            </Button>
          </div>

          {/* Location Search */}
          <div className="mb-4">
            <Input
              label="Search Location"
              type="text"
              name="searchLocation"
              value={filters.searchLocation}
              onChange={handleFilterChange}
              placeholder="Search by address, neighborhood, or landmark..."
              icon={
                filters.searchLocation && (
                  <button
                    onClick={() => setFilters({ ...filters, searchLocation: '' })}
                    className="text-architectural hover:text-charcoal transition-colors"
                    title="Clear search"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )
              }
            />
          </div>

          {/* Structured Location Filters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              label="City"
              type="text"
              name="city"
              value={filters.city}
              onChange={handleFilterChange}
              placeholder="Enter city name"
            />
            <div>
              <label className="block text-sm font-medium text-charcoal mb-1">
                State
              </label>
              <select
                name="state"
                value={filters.state}
                onChange={handleFilterChange}
                className="w-full px-4 py-2.5 border border-stone-300 rounded-lg bg-porcelain focus:ring-2 focus:ring-obsidian-500 focus:border-obsidian-500 transition-colors"
              >
                <option value="">All States</option>
                <option value="AL">Alabama</option>
                <option value="AK">Alaska</option>
                <option value="AZ">Arizona</option>
                <option value="AR">Arkansas</option>
                <option value="CA">California</option>
                <option value="CO">Colorado</option>
                <option value="CT">Connecticut</option>
                <option value="DE">Delaware</option>
                <option value="FL">Florida</option>
                <option value="GA">Georgia</option>
                <option value="HI">Hawaii</option>
                <option value="ID">Idaho</option>
                <option value="IL">Illinois</option>
                <option value="IN">Indiana</option>
                <option value="IA">Iowa</option>
                <option value="KS">Kansas</option>
                <option value="KY">Kentucky</option>
                <option value="LA">Louisiana</option>
                <option value="ME">Maine</option>
                <option value="MD">Maryland</option>
                <option value="MA">Massachusetts</option>
                <option value="MI">Michigan</option>
                <option value="MN">Minnesota</option>
                <option value="MS">Mississippi</option>
                <option value="MO">Missouri</option>
                <option value="MT">Montana</option>
                <option value="NE">Nebraska</option>
                <option value="NV">Nevada</option>
                <option value="NH">New Hampshire</option>
                <option value="NJ">New Jersey</option>
                <option value="NM">New Mexico</option>
                <option value="NY">New York</option>
                <option value="NC">North Carolina</option>
                <option value="ND">North Dakota</option>
                <option value="OH">Ohio</option>
                <option value="OK">Oklahoma</option>
                <option value="OR">Oregon</option>
                <option value="PA">Pennsylvania</option>
                <option value="RI">Rhode Island</option>
                <option value="SC">South Carolina</option>
                <option value="SD">South Dakota</option>
                <option value="TN">Tennessee</option>
                <option value="TX">Texas</option>
                <option value="UT">Utah</option>
                <option value="VT">Vermont</option>
                <option value="VA">Virginia</option>
                <option value="WA">Washington</option>
                <option value="WV">West Virginia</option>
                <option value="WI">Wisconsin</option>
                <option value="WY">Wyoming</option>
                <option value="DC">District of Columbia</option>
              </select>
            </div>
            <Input
              label="Zip Code"
              type="text"
              name="zipCode"
              value={filters.zipCode}
              onChange={handleFilterChange}
              placeholder="Enter zip code"
              pattern="[0-9]{5}"
              maxLength="5"
            />
          </div>
        </Card>

        {/* Basic Filters */}
        <Card variant="elevated" padding="lg" className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <Card.Title>Quick Filters</Card.Title>
            {hasActiveFilters() && (
              <span className="px-3 py-1 bg-eucalyptus-100 text-eucalyptus-700 rounded-full text-sm font-semibold">
                {getActiveFilterCount()} {getActiveFilterCount() === 1 ? 'filter' : 'filters'} active
              </span>
            )}
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-charcoal mb-1">
                Property Type
              </label>
              <select
                name="propertyType"
                value={filters.propertyType}
                onChange={handleFilterChange}
                className="w-full p-2 border border-stone-300 rounded-lg bg-porcelain focus:ring-2 focus:ring-obsidian focus:border-obsidian"
              >
                <option value="">All Types</option>
                <option value="apartment">Apartment</option>
                <option value="house">House</option>
                <option value="condo">Condo</option>
                <option value="townhouse">Townhouse</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-charcoal mb-1">
                Bedrooms
              </label>
              <select
                name="bedrooms"
                value={filters.bedrooms}
                onChange={handleFilterChange}
                className="w-full p-2 border border-stone-300 rounded-lg bg-porcelain focus:ring-2 focus:ring-obsidian focus:border-obsidian"
              >
                <option value="">Any</option>
                <option value="1">1+</option>
                <option value="2">2+</option>
                <option value="3">3+</option>
                <option value="4">4+</option>
                <option value="5">5+</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-charcoal mb-1">
                Bathrooms
              </label>
              <select
                name="bathrooms"
                value={filters.bathrooms}
                onChange={handleFilterChange}
                className="w-full p-2 border border-stone-300 rounded-lg bg-porcelain focus:ring-2 focus:ring-obsidian focus:border-obsidian"
              >
                <option value="">Any</option>
                <option value="1">1+</option>
                <option value="1.5">1.5+</option>
                <option value="2">2+</option>
                <option value="2.5">2.5+</option>
                <option value="3">3+</option>
                <option value="4">4+</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-charcoal mb-1">
                Min Price
              </label>
              <input
                type="number"
                name="minPrice"
                value={filters.minPrice}
                onChange={handleFilterChange}
                placeholder="Min"
                className="w-full p-2 border border-stone-300 rounded-lg bg-porcelain focus:ring-2 focus:ring-obsidian focus:border-obsidian"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-charcoal mb-1">
                Max Price
              </label>
              <input
                type="number"
                name="maxPrice"
                value={filters.maxPrice}
                onChange={handleFilterChange}
                placeholder="Max"
                className="w-full p-2 border border-stone-300 rounded-lg bg-porcelain focus:ring-2 focus:ring-obsidian focus:border-obsidian"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-charcoal mb-1">
                Min Area (sq ft)
              </label>
              <input
                type="number"
                name="minArea"
                value={filters.minArea}
                onChange={handleFilterChange}
                placeholder="Min"
                className="w-full p-2 border border-stone-300 rounded-lg bg-porcelain focus:ring-2 focus:ring-obsidian focus:border-obsidian"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-charcoal mb-1">
                Max Area (sq ft)
              </label>
              <input
                type="number"
                name="maxArea"
                value={filters.maxArea}
                onChange={handleFilterChange}
                placeholder="Max"
                className="w-full p-2 border border-stone-300 rounded-lg bg-porcelain focus:ring-2 focus:ring-obsidian focus:border-obsidian"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-charcoal mb-1">
                Sort By
              </label>
              <select
                name="sortBy"
                value={filters.sortBy}
                onChange={handleFilterChange}
                className="w-full p-2 border border-stone-300 rounded-lg bg-porcelain focus:ring-2 focus:ring-obsidian focus:border-obsidian"
              >
                <option value="price">Price</option>
                <option value="date">Newest</option>
                <option value="area">Area</option>
                <option value="bedrooms">Bedrooms</option>
              </select>
            </div>
          </div>
          <Button
            variant="ghost"
            onClick={clearFilters}
            className="mt-4"
          >
            Clear Filters
          </Button>
        </Card>

        {/* Advanced Filters */}
        {showAdvancedFilters && (
          <Card variant="elevated" padding="lg" className="mb-8">
            <Card.Title className="mb-4">Advanced Filters</Card.Title>

            {/* Rental Details */}
            <div className="mb-6">
              <h3 className="text-lg font-medium text-charcoal mb-3">Rental Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-1">Min Monthly Rent</label>
                  <input
                    type="number"
                    name="minMonthlyRent"
                    value={filters.minMonthlyRent}
                    onChange={handleFilterChange}
                    placeholder="Min"
                    className="w-full p-2 border border-stone-300 rounded-lg bg-porcelain focus:ring-2 focus:ring-obsidian focus:border-obsidian"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-1">Max Monthly Rent</label>
                  <input
                    type="number"
                    name="maxMonthlyRent"
                    value={filters.maxMonthlyRent}
                    onChange={handleFilterChange}
                    placeholder="Max"
                    className="w-full p-2 border border-stone-300 rounded-lg bg-porcelain focus:ring-2 focus:ring-obsidian focus:border-obsidian"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-1">Min Security Deposit</label>
                  <input
                    type="number"
                    name="minSecurityDeposit"
                    value={filters.minSecurityDeposit}
                    onChange={handleFilterChange}
                    placeholder="Min"
                    className="w-full p-2 border border-stone-300 rounded-lg bg-porcelain focus:ring-2 focus:ring-obsidian focus:border-obsidian"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-1">Max Security Deposit</label>
                  <input
                    type="number"
                    name="maxSecurityDeposit"
                    value={filters.maxSecurityDeposit}
                    onChange={handleFilterChange}
                    placeholder="Max"
                    className="w-full p-2 border border-stone-300 rounded-lg bg-porcelain focus:ring-2 focus:ring-obsidian focus:border-obsidian"
                  />
                </div>
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium text-charcoal mb-1">Lease Terms</label>
                <select
                  name="leaseTerms"
                  value={filters.leaseTerms}
                  onChange={handleFilterChange}
                  className="w-full p-2 border border-stone-300 rounded-lg bg-porcelain focus:ring-2 focus:ring-obsidian focus:border-obsidian"
                >
                  <option value="">Any</option>
                  <option value="6 months">6 months</option>
                  <option value="12 months">12 months</option>
                  <option value="18 months">18 months</option>
                  <option value="24 months">24 months</option>
                  <option value="Month-to-month">Month-to-month</option>
                </select>
              </div>
            </div>

            {/* Property Details */}
            <div className="mb-6">
              <h3 className="text-lg font-medium text-charcoal mb-3">Property Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-1">Pet Policy</label>
                  <select
                    name="petPolicy"
                    value={filters.petPolicy}
                    onChange={handleFilterChange}
                    className="w-full p-2 border border-stone-300 rounded-lg bg-porcelain focus:ring-2 focus:ring-obsidian focus:border-obsidian"
                  >
                    <option value="">Any</option>
                    <option value="not_allowed">Not Allowed</option>
                    <option value="cats_only">Cats Only</option>
                    <option value="dogs_only">Dogs Only</option>
                    <option value="pets_allowed">Pets Allowed</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-1">Parking Spaces</label>
                  <select
                    name="parking"
                    value={filters.parking}
                    onChange={handleFilterChange}
                    className="w-full p-2 border border-stone-300 rounded-lg bg-porcelain focus:ring-2 focus:ring-obsidian focus:border-obsidian"
                  >
                    <option value="">Any</option>
                    <option value="0">No Parking</option>
                    <option value="1">1+</option>
                    <option value="2">2+</option>
                    <option value="3">3+</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-1">Year Built (Min)</label>
                  <input
                    type="number"
                    name="yearBuilt"
                    value={filters.yearBuilt}
                    onChange={handleFilterChange}
                    placeholder="e.g., 2000"
                    min="1800"
                    max={new Date().getFullYear()}
                    className="w-full p-2 border border-stone-300 rounded-lg bg-porcelain focus:ring-2 focus:ring-obsidian focus:border-obsidian"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-1">Available From</label>
                  <input
                    type="date"
                    name="availableDate"
                    value={filters.availableDate}
                    onChange={handleFilterChange}
                    className="w-full p-2 border border-stone-300 rounded-lg bg-porcelain focus:ring-2 focus:ring-obsidian focus:border-obsidian"
                  />
                </div>
              </div>
            </div>

            {/* Amenities */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-charcoal mb-2">Amenities</label>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {availableAmenities.map((amenity) => (
                  <label key={amenity} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      name="amenities"
                      value={amenity}
                      checked={filters.amenities.includes(amenity)}
                      onChange={handleFilterChange}
                      className="w-4 h-4 text-obsidian border-stone-300 rounded focus:ring-obsidian"
                    />
                    <span className="text-sm text-charcoal">{amenity}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Utilities */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-charcoal mb-2">Utilities Included</label>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
                {availableUtilities.map((utility) => (
                  <label key={utility} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      name="utilities"
                      value={utility}
                      checked={filters.utilities.includes(utility)}
                      onChange={handleFilterChange}
                      className="w-4 h-4 text-obsidian border-stone-300 rounded focus:ring-obsidian"
                    />
                    <span className="text-sm text-charcoal">{utility}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Sort Order */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-charcoal mb-1">Sort Order</label>
              <select
                name="sortOrder"
                value={filters.sortOrder}
                onChange={handleFilterChange}
                className="w-full p-2 border border-stone-300 rounded-lg bg-porcelain focus:ring-2 focus:ring-obsidian focus:border-obsidian"
              >
                <option value="asc">Low to High</option>
                <option value="desc">High to Low</option>
              </select>
            </div>

            {/* Filter Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-stone-300">
              <div className="text-sm text-architectural">
                {hasActiveFilters() && (
                  <span className="text-eucalyptus font-medium">
                    {properties.length} {properties.length === 1 ? 'property' : 'properties'} match your filters
                  </span>
                )}
              </div>
              <Button
                variant="primary"
                onClick={clearFilters}
              >
                Clear All Filters
              </Button>
            </div>
          </Card>
        )}

        {/* Properties Grid */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Skeleton.Card key={i} />
            ))}
          </div>
        )}

        {error && <ErrorDisplay message={error} onRetry={loadProperties} className="mb-4" />}

        {!loading && !error && properties.length === 0 && (
          <EmptyState
            title="No properties found"
            description="Try adjusting your filters or search terms."
            action={
              hasActiveFilters() && (
                <Button variant="primary" onClick={clearFilters}>
                  Clear Filters
                </Button>
              )
            }
            icon={
              <svg className="w-16 h-16 text-architectural" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            }
          />
        )}

        {!loading && !error && properties.length > 0 && (
          <>
            <div className="mb-4 text-sm text-architectural">
              Showing {properties.length} {properties.length === 1 ? 'property' : 'properties'}
              {hasActiveFilters() && ` matching your filters`}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {properties.map((property) => (
                <PropertyCard key={property.id} property={property} isSaved={savedIds.has(property.id)} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default BrowseProperties;
