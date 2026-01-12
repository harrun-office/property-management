import { Link, useNavigate } from 'react-router-dom';
import { BASE_URL, propertiesAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';
import Card from './ui/Card';

function PropertyCard({ property, noLink = false, isSaved = false }) {
  const navigate = useNavigate();
  const { user, isAuthenticated, isTenant } = useAuth();
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(!!isSaved);

  const handleSave = async (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (!isAuthenticated) {
      navigate(`/login?returnTo=${encodeURIComponent(`/properties/${property.id}?autoSave=1`)}`);
      return;
    }
    if (!isTenant) {
      alert('Only tenants can save properties to wishlist.');
      return;
    }
    try {
      setSaving(true);
      if (saved) {
        await propertiesAPI.unsaveProperty(property.id);
        setSaved(false);
      } else {
        await propertiesAPI.saveProperty(property.id);
        setSaved(true);
      }
    } catch (err) {
      alert(err.message || 'Failed to save property');
    } finally {
      setSaving(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  const content = (
    <Card variant="elevated" padding="none" hover className="overflow-hidden transition-all duration-300 group">
      <div className="relative h-56 overflow-hidden bg-stone-200">
        <img
          src={property.images && property.images.length > 0
            ? (property.images[0].startsWith('http') ? property.images[0] : `${BASE_URL}${property.images[0]}`)
            : 'https://placehold.co/400x300?text=No+Image'}
          alt={property.title}
          onError={(e) => {
            console.error('Image load error for:', property.title, e.target.src);
            e.target.onerror = null;
            if (e.target.src !== 'https://placehold.co/400x300?text=Fallback') {
              e.target.src = 'https://placehold.co/400x300?text=Fallback';
            }
          }}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-4 left-4 flex items-center gap-2">
          <button
            onClick={handleSave}
            disabled={saving}
            aria-label={saved ? 'Saved to wishlist' : 'Save to wishlist'}
            className={`p-2 rounded-full shadow-md bg-white/90 backdrop-blur-sm hover:bg-white transition-colors ${saving ? 'opacity-70 cursor-not-allowed' : ''}`}
            title={saved ? 'Saved' : 'Save'}
          >
            <svg className={`w-5 h-5 ${saved ? 'text-brass-500' : 'text-architectural'}`} fill={saved ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.636l1.318-1.318a4.5 4.5 0 116.364 6.364L12 20.364l-7.682-7.682a4.5 4.5 0 010-6.364z" />
            </svg>
          </button>
        </div>
        <div className="absolute top-4 right-4">
          <span className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-semibold text-charcoal capitalize shadow-md">
            {property.propertyType}
          </span>
        </div>
      </div>
      <div className="p-6">
        <h3 className="text-xl font-semibold text-charcoal mb-2 line-clamp-1 group-hover:text-obsidian-500 transition-colors">
          {property.title}
        </h3>
        <p className="text-brass-500 text-3xl font-bold mb-3">
          {formatPrice(property.price)}
          {property.priceType === 'monthly' && <span className="text-base text-architectural font-normal">/mo</span>}
        </p>
        <p className="text-architectural text-sm mb-4 line-clamp-2">
          {property.description}
        </p>
        <div className="flex items-center justify-between text-sm mb-3">
          <div className="flex items-center space-x-4">
            <span className="flex items-center text-charcoal">
              <svg className="w-5 h-5 mr-1.5 text-architectural" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              {property.bedrooms} Beds
            </span>
            <span className="flex items-center text-charcoal">
              <svg className="w-5 h-5 mr-1.5 text-architectural" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {property.bathrooms} Baths
            </span>
            {property.area && (
              <span className="flex items-center text-charcoal">
                <svg className="w-5 h-5 mr-1.5 text-architectural" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                </svg>
                {property.area} sqft
              </span>
            )}
          </div>
        </div>
        <p className="text-architectural text-sm truncate flex items-center">
          <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          {property.address}
        </p>
      </div>
    </Card>
  );

  if (noLink) {
    return content;
  }

  return (
    <Link to={`/properties/${property.id}`} className="block">
      {content}
    </Link>
  );
}

export default PropertyCard;

