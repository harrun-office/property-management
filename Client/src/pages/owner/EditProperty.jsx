import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ownerAPI } from '../../services/api';

function EditProperty() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    address: '',
    bedrooms: '',
    bathrooms: '',
    area: '',
    propertyType: 'apartment',
    images: [],
    amenities: [],
    petPolicy: 'not_allowed',
    utilities: [],
    yearBuilt: '',
    parking: '',
    leaseTerms: '12 months',
    monthlyRent: '',
    securityDeposit: '',
    availableDate: ''
  });
  const [imageUrl, setImageUrl] = useState('');
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingProperty, setLoadingProperty] = useState(true);

  const availableAmenities = [
    'Air Conditioning', 'Heating', 'Dishwasher', 'Washer/Dryer', 'Parking',
    'Balcony', 'Gym', 'Pool', 'Elevator', 'Doorman', 'Pet Friendly',
    'Furnished', 'Hardwood Floors', 'Fireplace', 'Storage'
  ];

  const availableUtilities = [
    'Electricity', 'Water', 'Gas', 'Internet', 'Cable TV', 'Trash', 'Sewer'
  ];

  useEffect(() => {
    loadProperty();
  }, [id]);

  const loadProperty = async () => {
    setLoadingProperty(true);
    try {
      const properties = await ownerAPI.getProperties();
      const property = properties.find(p => p.id === parseInt(id));
      if (property) {
        setFormData({
          title: property.title || '',
          description: property.description || '',
          price: property.price || '',
          address: property.address || '',
          bedrooms: property.bedrooms || '',
          bathrooms: property.bathrooms || '',
          area: property.area || '',
          propertyType: property.propertyType || 'apartment',
          images: property.images || [],
          amenities: property.amenities || [],
          petPolicy: property.petPolicy || 'not_allowed',
          utilities: property.utilities || [],
          yearBuilt: property.yearBuilt || '',
          parking: property.parking || '',
          leaseTerms: property.leaseTerms || '12 months',
          monthlyRent: property.monthlyRent || '',
          securityDeposit: property.securityDeposit || '',
          availableDate: property.availableDate || ''
        });
      } else {
        setError('Property not found');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingProperty(false);
    }
  };

  const validateField = (name, value) => {
    let error = '';
    
    switch (name) {
      case 'title':
        if (!value.trim()) {
          error = 'Title is required';
        } else if (value.trim().length < 5) {
          error = 'Title must be at least 5 characters';
        } else if (value.trim().length > 100) {
          error = 'Title must be less than 100 characters';
        }
        break;
      case 'description':
        if (!value.trim()) {
          error = 'Description is required';
        } else if (value.trim().length < 20) {
          error = 'Description must be at least 20 characters';
        } else if (value.trim().length > 2000) {
          error = 'Description must be less than 2000 characters';
        }
        break;
      case 'price':
        if (!value) {
          error = 'Price is required';
        } else if (isNaN(value) || parseFloat(value) < 0) {
          error = 'Price must be a valid positive number';
        } else if (parseFloat(value) > 10000000) {
          error = 'Price seems too high. Please verify.';
        }
        break;
      case 'address':
        if (!value.trim()) {
          error = 'Address is required';
        } else if (value.trim().length < 10) {
          error = 'Please enter a complete address';
        }
        break;
      case 'bedrooms':
        if (!value) {
          error = 'Number of bedrooms is required';
        } else if (isNaN(value) || parseInt(value) < 1) {
          error = 'Bedrooms must be at least 1';
        } else if (parseInt(value) > 20) {
          error = 'Please enter a valid number of bedrooms';
        }
        break;
      case 'bathrooms':
        if (!value) {
          error = 'Number of bathrooms is required';
        } else if (isNaN(value) || parseFloat(value) < 0.5) {
          error = 'Bathrooms must be at least 0.5';
        } else if (parseFloat(value) > 20) {
          error = 'Please enter a valid number of bathrooms';
        }
        break;
      case 'area':
        if (!value) {
          error = 'Area is required';
        } else if (isNaN(value) || parseFloat(value) < 0) {
          error = 'Area must be a valid positive number';
        } else if (parseFloat(value) > 100000) {
          error = 'Area seems too large. Please verify.';
        }
        break;
      case 'yearBuilt':
        if (value && (isNaN(value) || parseInt(value) < 1800 || parseInt(value) > new Date().getFullYear())) {
          error = `Year must be between 1800 and ${new Date().getFullYear()}`;
        }
        break;
      case 'parking':
        if (value && (isNaN(value) || parseInt(value) < 0)) {
          error = 'Parking spaces must be a valid positive number';
        }
        break;
      case 'monthlyRent':
        if (value && (isNaN(value) || parseFloat(value) < 0)) {
          error = 'Monthly rent must be a valid positive number';
        }
        break;
      case 'securityDeposit':
        if (value && (isNaN(value) || parseFloat(value) < 0)) {
          error = 'Security deposit must be a valid positive number';
        }
        break;
      case 'availableDate':
        if (value) {
          const selectedDate = new Date(value);
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          if (selectedDate < today) {
            error = 'Available date cannot be in the past';
          }
        }
        break;
      default:
        break;
    }
    
    return error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Validate on change if field has been touched
    if (touched[name]) {
      const error = validateField(name, value);
      setErrors({
        ...errors,
        [name]: error
      });
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched({
      ...touched,
      [name]: true
    });
    
    const error = validateField(name, value);
    setErrors({
      ...errors,
      [name]: error
    });
  };

  const handleAmenityToggle = (amenity) => {
    setFormData({
      ...formData,
      amenities: formData.amenities.includes(amenity)
        ? formData.amenities.filter(a => a !== amenity)
        : [...formData.amenities, amenity]
    });
  };

  const handleUtilityToggle = (utility) => {
    setFormData({
      ...formData,
      utilities: formData.utilities.includes(utility)
        ? formData.utilities.filter(u => u !== utility)
        : [...formData.utilities, utility]
    });
  };

  const handleAddImage = () => {
    if (imageUrl.trim()) {
      // Validate URL
      try {
        new URL(imageUrl.trim());
        setFormData({
          ...formData,
          images: [...formData.images, imageUrl.trim()]
        });
        setImageUrl('');
      } catch (err) {
        setError('Please enter a valid image URL');
      }
    }
  };

  const handleRemoveImage = (index) => {
    setFormData({
      ...formData,
      images: formData.images.filter((_, i) => i !== index)
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Mark all required fields as touched
    const requiredFields = ['title', 'description', 'price', 'address', 'bedrooms', 'bathrooms', 'area'];
    const allTouched = requiredFields.reduce((acc, field) => {
      acc[field] = true;
      return acc;
    }, {});
    setTouched(allTouched);
    
    // Validate all required fields
    const newErrors = {};
    requiredFields.forEach(field => {
      const error = validateField(field, formData[field]);
      if (error) {
        newErrors[field] = error;
      }
    });
    
    // Validate optional fields if they have values
    ['yearBuilt', 'parking', 'monthlyRent', 'securityDeposit', 'availableDate'].forEach(field => {
      if (formData[field]) {
        const error = validateField(field, formData[field]);
        if (error) {
          newErrors[field] = error;
        }
      }
    });
    
    setErrors(newErrors);
    
    // Check if there are any errors
    if (Object.keys(newErrors).length > 0) {
      setError('Please fix the errors in the form');
      return;
    }
    
    setLoading(true);

    try {
      await ownerAPI.updateProperty(parseInt(id), formData);
      navigate('/owner/properties');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loadingProperty) {
    return (
      <div className="min-h-screen bg-porcelain flex items-center justify-center">
        <p className="text-architectural text-lg">Loading property...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-porcelain py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-charcoal mb-8">Edit Property</h1>

        {error && (
          <div className="mb-6 p-4 bg-error/20 border border-error text-error rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-stone-100 rounded-2xl shadow-lg p-8 space-y-6">
          {/* Same form structure as PostProperty */}
          <div className="border-b pb-6">
            <h2 className="text-xl font-semibold text-charcoal mb-4">Basic Information</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-charcoal mb-1">Title <span className="text-error">*</span></label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                  className={`w-full p-3 border rounded-xl focus:ring-2 focus:ring-obsidian focus:border-obsidian bg-porcelain ${
                    errors.title ? 'border-error' : 'border-stone-300'
                  }`}
                />
                {errors.title && touched.title && (
                  <p className="mt-1 text-sm text-error">{errors.title}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-charcoal mb-1">Description <span className="text-error">*</span></label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                  rows={4}
                  className={`w-full p-3 border rounded-xl focus:ring-2 focus:ring-obsidian focus:border-obsidian bg-porcelain ${
                    errors.description ? 'border-error' : 'border-stone-300'
                  }`}
                />
                {errors.description && touched.description && (
                  <p className="mt-1 text-sm text-error">{errors.description}</p>
                )}
                {!errors.description && formData.description && (
                  <p className="mt-1 text-xs text-architectural">{formData.description.length}/2000 characters</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-1">Price ($) <span className="text-error">*</span></label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    required
                    min="0"
                    step="0.01"
                    className={`w-full p-3 border rounded-xl focus:ring-2 focus:ring-obsidian focus:border-obsidian bg-porcelain ${
                      errors.price ? 'border-error' : 'border-stone-300'
                    }`}
                  />
                  {errors.price && touched.price && (
                    <p className="mt-1 text-sm text-error">{errors.price}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-1">Property Type <span className="text-error">*</span></label>
                  <select
                    name="propertyType"
                    value={formData.propertyType}
                    onChange={handleChange}
                    required
                    className="w-full p-3 border border-stone-300 rounded-xl focus:ring-2 focus:ring-obsidian focus:border-obsidian bg-porcelain"
                  >
                    <option value="apartment">Apartment</option>
                    <option value="house">House</option>
                    <option value="condo">Condo</option>
                    <option value="townhouse">Townhouse</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-charcoal mb-1">Address <span className="text-error">*</span></label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                  className={`w-full p-3 border rounded-xl focus:ring-2 focus:ring-obsidian focus:border-obsidian bg-porcelain ${
                    errors.address ? 'border-error' : 'border-stone-300'
                  }`}
                />
                {errors.address && touched.address && (
                  <p className="mt-1 text-sm text-error">{errors.address}</p>
                )}
              </div>
            </div>
          </div>

          <div className="border-b pb-6">
            <h2 className="text-xl font-semibold text-charcoal mb-4">Property Details</h2>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-charcoal mb-1">Bedrooms <span className="text-error">*</span></label>
                <input
                  type="number"
                  name="bedrooms"
                  value={formData.bedrooms}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                  min="1"
                  className={`w-full p-3 border rounded-xl focus:ring-2 focus:ring-obsidian focus:border-obsidian bg-porcelain ${
                    errors.bedrooms ? 'border-error' : 'border-stone-300'
                  }`}
                />
                {errors.bedrooms && touched.bedrooms && (
                  <p className="mt-1 text-sm text-error">{errors.bedrooms}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-charcoal mb-1">Bathrooms <span className="text-error">*</span></label>
                <input
                  type="number"
                  name="bathrooms"
                  value={formData.bathrooms}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                  min="0.5"
                  step="0.5"
                  className={`w-full p-3 border rounded-xl focus:ring-2 focus:ring-obsidian focus:border-obsidian bg-porcelain ${
                    errors.bathrooms ? 'border-error' : 'border-stone-300'
                  }`}
                />
                {errors.bathrooms && touched.bathrooms && (
                  <p className="mt-1 text-sm text-error">{errors.bathrooms}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-charcoal mb-1">Area (sq ft) <span className="text-error">*</span></label>
                <input
                  type="number"
                  name="area"
                  value={formData.area}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                  min="0"
                  className={`w-full p-3 border rounded-xl focus:ring-2 focus:ring-obsidian focus:border-obsidian bg-porcelain ${
                    errors.area ? 'border-error' : 'border-stone-300'
                  }`}
                />
                {errors.area && touched.area && (
                  <p className="mt-1 text-sm text-error">{errors.area}</p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block text-sm font-medium text-charcoal mb-1">Year Built</label>
                <input
                  type="number"
                  name="yearBuilt"
                  value={formData.yearBuilt}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  min="1800"
                  max={new Date().getFullYear()}
                  className={`w-full p-3 border rounded-xl focus:ring-2 focus:ring-obsidian focus:border-obsidian bg-porcelain ${
                    errors.yearBuilt ? 'border-error' : 'border-stone-300'
                  }`}
                />
                {errors.yearBuilt && touched.yearBuilt && (
                  <p className="mt-1 text-sm text-error">{errors.yearBuilt}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-charcoal mb-1">Parking Spaces</label>
                <input
                  type="number"
                  name="parking"
                  value={formData.parking}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  min="0"
                  className={`w-full p-3 border rounded-xl focus:ring-2 focus:ring-obsidian focus:border-obsidian bg-porcelain ${
                    errors.parking ? 'border-error' : 'border-stone-300'
                  }`}
                />
                {errors.parking && touched.parking && (
                  <p className="mt-1 text-sm text-error">{errors.parking}</p>
                )}
              </div>
            </div>
          </div>

          <div className="border-b pb-6">
            <h2 className="text-xl font-semibold text-charcoal mb-4">Amenities</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {availableAmenities.map((amenity) => (
                <label key={amenity} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.amenities.includes(amenity)}
                    onChange={() => handleAmenityToggle(amenity)}
                    className="w-4 h-4 text-obsidian border-stone-300 rounded focus:ring-obsidian"
                  />
                  <span className="text-sm text-charcoal">{amenity}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="border-b pb-6">
            <h2 className="text-xl font-semibold text-charcoal mb-4">Utilities Included</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {availableUtilities.map((utility) => (
                <label key={utility} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.utilities.includes(utility)}
                    onChange={() => handleUtilityToggle(utility)}
                    className="w-4 h-4 text-obsidian border-stone-300 rounded focus:ring-obsidian"
                  />
                  <span className="text-sm text-charcoal">{utility}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="border-b pb-6">
            <h2 className="text-xl font-semibold text-charcoal mb-4">Rental Information</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-charcoal mb-1">Monthly Rent ($)</label>
                <input
                  type="number"
                  name="monthlyRent"
                  value={formData.monthlyRent}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  min="0"
                  step="0.01"
                  className={`w-full p-3 border rounded-xl focus:ring-2 focus:ring-obsidian focus:border-obsidian bg-porcelain ${
                    errors.monthlyRent ? 'border-error' : 'border-stone-300'
                  }`}
                />
                {errors.monthlyRent && touched.monthlyRent && (
                  <p className="mt-1 text-sm text-error">{errors.monthlyRent}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-charcoal mb-1">Security Deposit ($)</label>
                <input
                  type="number"
                  name="securityDeposit"
                  value={formData.securityDeposit}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  min="0"
                  step="0.01"
                  className={`w-full p-3 border rounded-xl focus:ring-2 focus:ring-obsidian focus:border-obsidian bg-porcelain ${
                    errors.securityDeposit ? 'border-error' : 'border-stone-300'
                  }`}
                />
                {errors.securityDeposit && touched.securityDeposit && (
                  <p className="mt-1 text-sm text-error">{errors.securityDeposit}</p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block text-sm font-medium text-charcoal mb-1">Lease Terms</label>
                <select
                  name="leaseTerms"
                  value={formData.leaseTerms}
                  onChange={handleChange}
                  className="w-full p-3 border border-stone-300 rounded-xl focus:ring-2 focus:ring-obsidian focus:border-obsidian bg-porcelain"
                >
                  <option value="6 months">6 months</option>
                  <option value="12 months">12 months</option>
                  <option value="18 months">18 months</option>
                  <option value="24 months">24 months</option>
                  <option value="Month-to-month">Month-to-month</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-charcoal mb-1">Available Date</label>
                <input
                  type="date"
                  name="availableDate"
                  value={formData.availableDate}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`w-full p-3 border rounded-xl focus:ring-2 focus:ring-obsidian focus:border-obsidian bg-porcelain ${
                    errors.availableDate ? 'border-error' : 'border-stone-300'
                  }`}
                />
                {errors.availableDate && touched.availableDate && (
                  <p className="mt-1 text-sm text-error">{errors.availableDate}</p>
                )}
              </div>
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-charcoal mb-1">Pet Policy</label>
              <select
                name="petPolicy"
                value={formData.petPolicy}
                onChange={handleChange}
                className="w-full p-3 border border-stone-300 rounded-xl focus:ring-2 focus:ring-obsidian focus:border-obsidian bg-porcelain"
              >
                <option value="not_allowed">Not Allowed</option>
                <option value="cats_only">Cats Only</option>
                <option value="dogs_only">Dogs Only</option>
                <option value="pets_allowed">Pets Allowed</option>
              </select>
            </div>
          </div>

          <div className="border-b pb-6">
            <h2 className="text-xl font-semibold text-charcoal mb-4">Property Images</h2>
            <div className="flex gap-2 mb-2">
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://example.com/image.jpg"
                    className="flex-1 p-3 border border-stone-300 rounded-xl focus:ring-2 focus:ring-obsidian focus:border-obsidian bg-porcelain"
              />
              <button
                type="button"
                onClick={handleAddImage}
                className="px-4 py-3 bg-obsidian text-porcelain rounded-xl hover:bg-obsidian-light transition-colors"
              >
                Add
              </button>
            </div>
            {formData.images.length > 0 && (
              <div className="space-y-2">
                {formData.images.map((url, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-porcelain rounded-lg">
                    <span className="text-sm text-charcoal truncate flex-1">{url}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      className="ml-2 text-error hover:opacity-80 transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex space-x-4 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-3 bg-obsidian text-porcelain rounded-xl font-semibold hover:bg-obsidian-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Updating...' : 'Update Property'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/owner/properties')}
              className="px-6 py-3 border border-stone-300 rounded-xl hover:bg-porcelain"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditProperty;

