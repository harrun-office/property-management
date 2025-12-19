import { Link } from 'react-router-dom';

function PropertyCard({ property, noLink = false }) {
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(price);
  };

  const content = (
    <div className="bg-stone-100 rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 border border-stone-200">
        <div className="relative h-48 overflow-hidden">
          <img
            src={property.images && property.images.length > 0 ? property.images[0] : 'https://images.unsplash.com/photo-1560185008-b033106af5d6'}
            alt={property.title}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="p-6">
          <h3 className="text-xl font-semibold text-charcoal mb-2 line-clamp-1">
            {property.title}
          </h3>
          <p className="text-brass text-2xl font-bold mb-3">
            {formatPrice(property.price)}
          </p>
          <p className="text-architectural text-sm mb-4 line-clamp-2">
            {property.description}
          </p>
          <div className="flex items-center justify-between text-sm text-stone-600">
            <div className="flex items-center space-x-4">
              <span className="flex items-center">
                <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                {property.bedrooms} Beds
              </span>
              <span className="flex items-center">
                <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {property.bathrooms} Baths
              </span>
            </div>
            <span className="text-stone-500 capitalize">
              {property.propertyType}
            </span>
          </div>
          <p className="text-stone-600 text-sm mt-3 truncate">
            {property.address}
          </p>
        </div>
      </div>
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

