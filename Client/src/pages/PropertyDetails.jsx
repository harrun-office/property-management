import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import { propertiesAPI, tenantAPI, BASE_URL } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Skeleton from '../components/ui/Skeleton';
import ErrorDisplay from '../components/ui/ErrorDisplay';

function PropertyDetails() {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    loadProperty();
  }, [id]);

  const loadProperty = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await propertiesAPI.getById(id);
      setProperty(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(price);
  };

  const { user, isAuthenticated, isTenant } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [applying, setApplying] = useState(false);
  const [applicationSuccess, setApplicationSuccess] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleApply = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (user.role !== 'tenant') {
      alert('Only tenants can apply for properties. Please register as a tenant.');
      return;
    }

    if (confirm('Are you sure you want to apply for this property?')) {
      setApplying(true);
      try {
        await tenantAPI.createApplication({ propertyId: property.id });
        setApplicationSuccess(true);
        alert('Application submitted successfully!');
      } catch (err) {
        alert(err.message);
      } finally {
        setApplying(false);
      }
    }
  };

  const handleContact = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    // Placeholder for contact functionality
    alert('Contact feature coming soon!');
  };

  const handleSave = async () => {
    if (!user) {
      navigate(`/login?returnTo=${encodeURIComponent(`${location.pathname}?autoSave=1`)}`);
      return;
    }
    if (user.role !== 'tenant') {
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

  useEffect(() => {
    const hydrateSaved = async () => {
      try {
        if (isAuthenticated && isTenant && property?.id) {
          const savedList = await propertiesAPI.getSavedProperties();
          const isAlreadySaved = savedList.some(p => p.id === property.id);
          setSaved(isAlreadySaved);
        }
      } catch (e) {
      }
    };
    hydrateSaved();
  }, [isAuthenticated, isTenant, property]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const autoSave = params.get('autoSave');
    if (autoSave && isAuthenticated && isTenant && property && !saved && !saving) {
      (async () => {
        try {
          setSaving(true);
          await propertiesAPI.saveProperty(property.id);
          setSaved(true);
        } catch (e) {
        } finally {
          setSaving(false);
        }
      })();
    }
  }, [location.search, isAuthenticated, isTenant, property, saved, saving]);

  if (loading) {
    return (
      <div className="min-h-screen bg-porcelain py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <Skeleton variant="text" width="20%" className="mb-4" />
          <Skeleton.Card />
        </div>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="min-h-screen bg-porcelain py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <ErrorDisplay
            message={error || 'Property not found'}
            action={
              <Link to="/properties">
                <Button variant="primary">Go back to listings</Button>
              </Link>
            }
          />
        </div>
      </div>
    );
  }

  const images = property.images && property.images.length > 0
    ? property.images.map(img => img.startsWith('http') ? img : `${BASE_URL}${img}`)
    : ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c'];

  return (
    <div className="min-h-screen bg-porcelain py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <Link to="/properties" className="mb-4 inline-block">
          <Button variant="secondary" className="mb-6" icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          }>
            Back to listings
          </Button>
        </Link>

        <Card variant="elevated" padding="none" className="overflow-hidden">
          {/* Image Gallery */}
          <div className="relative h-96 bg-stone-200">
            <img
              src={images[currentImageIndex]}
              alt={property.title}
              className="w-full h-full object-cover"
            />
            {images.length > 1 && (
              <>
                <Button
                  variant="secondary"
                  size="sm"
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-porcelain/90 hover:bg-porcelain shadow-lg"
                  onClick={() => setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length)}
                  icon={
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  }
                />
                <Button
                  variant="secondary"
                  size="sm"
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-porcelain/90 hover:bg-porcelain shadow-lg"
                  onClick={() => setCurrentImageIndex((prev) => (prev + 1) % images.length)}
                  icon={
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  }
                />
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                  {images.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`w-2 h-2 rounded-full transition-all ${index === currentImageIndex ? 'bg-obsidian' : 'bg-porcelain/50'
                        }`}
                      aria-label={`Go to image ${index + 1}`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Property Details */}
          <Card.Body className="p-8">
            <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-6">
              <div>
                <h1 className="text-3xl font-bold text-charcoal mb-2">{property.title}</h1>
                <p className="text-architectural">{property.address}</p>
              </div>
              <div className="flex flex-col items-end gap-3">
                <p className="text-3xl font-bold text-obsidian-500">{formatPrice(property.price)}</p>
                <div className="flex gap-3">
                  <Button
                    variant="primary"
                    onClick={handleApply}
                    disabled={applying || applicationSuccess}
                  >
                    {applicationSuccess ? 'Applied' : (applying ? 'Applying...' : 'Apply Now')}
                  </Button>
                  <Button
                    variant={saved ? 'success' : 'secondary'}
                    onClick={handleSave}
                    disabled={saving}
                    icon={
                      <svg className="w-5 h-5" fill={saved ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.636l1.318-1.318a4.5 4.5 0 116.364 6.364L12 20.364l-7.682-7.682a4.5 4.5 0 010-6.364z" />
                      </svg>
                    }
                  >
                    {saved ? 'Saved' : (saving ? 'Saving...' : 'Save')}
                  </Button>
                  <Button variant="secondary" onClick={handleContact}>
                    Contact Owner
                  </Button>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-6 mb-6 pb-6 border-b border-stone-300 flex-wrap">
              <div className="flex items-center text-architectural">
                <svg className="w-5 h-5 mr-2 text-obsidian-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                <span>{property.bedrooms} Bedrooms</span>
              </div>
              <div className="flex items-center text-architectural">
                <svg className="w-5 h-5 mr-2 text-obsidian-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>{property.bathrooms} Bathrooms</span>
              </div>
              <div className="flex items-center text-architectural">
                <svg className="w-5 h-5 mr-2 text-obsidian-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                </svg>
                <span>{property.area} sq ft</span>
              </div>
              <div className="flex items-center text-architectural">
                <span className="capitalize">{property.propertyType}</span>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-4 text-charcoal">Description</h2>
              <p className="text-charcoal leading-relaxed whitespace-pre-line">{property.description}</p>
            </div>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
}

export default PropertyDetails;
