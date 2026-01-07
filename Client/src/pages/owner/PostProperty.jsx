import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ownerAPI } from '../../services/api';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import ErrorDisplay from '../../components/ui/ErrorDisplay';

function PostProperty() {
  const navigate = useNavigate();
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
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const availableAmenities = [
    'Air Conditioning', 'Heating', 'Dishwasher', 'Washer/Dryer', 'Parking',
    'Balcony', 'Gym', 'Pool', 'Elevator', 'Doorman', 'Pet Friendly',
    'Furnished', 'Hardwood Floors', 'Fireplace', 'Storage'
  ];

  const availableUtilities = [
    'Electricity', 'Water', 'Gas', 'Internet', 'Cable TV', 'Trash', 'Sewer'
  ];

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

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.match(/^image\/(jpeg|png|gif|webp)$/)) {
      setError('Only image files are allowed');
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB');
      return;
    }

    setUploading(true);
    setError('');

    try {
      const response = await ownerAPI.uploadImage(file);
      setFormData({
        ...formData,
        images: [...formData.images, response.url]
      });
    } catch (err) {
      setError(err.message || 'Failed to upload image');
    } finally {
      setUploading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
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

    // Validate images
    if (formData.images.length === 0) {
      newErrors.images = 'At least one property image is required';
    }

    setErrors(newErrors);

    // Check if there are any errors
    if (Object.keys(newErrors).length > 0) {
      setError('Please fix the errors in the form');
      return;
    }

    setLoading(true);

    try {
      await ownerAPI.createProperty(formData);
      navigate('/owner/properties');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-porcelain py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-charcoal mb-2">Post a New Property</h1>
          <p className="text-architectural">Create a new property listing</p>
        </div>

        {error && <ErrorDisplay message={error} className="mb-6" />}

        <Card variant="elevated" padding="lg">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="border-b border-stone-200 pb-6">
              <Card.Title className="text-xl mb-4">Basic Information</Card.Title>
              <div className="space-y-4">
                <Input
                  label="Title"
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                  error={errors.title && touched.title ? errors.title : undefined}
                  placeholder="e.g., Modern 3 Bedroom Apartment"
                />

                <div>
                  <label className="block text-sm font-medium text-charcoal mb-1">
                    Description <span className="text-error-500">*</span>
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    required
                    rows={4}
                    className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-obsidian-500 focus:border-obsidian-500 bg-porcelain transition-colors ${errors.description && touched.description ? 'border-error-500' : 'border-stone-300'
                      }`}
                    placeholder="Describe your property..."
                  />
                  {errors.description && touched.description && (
                    <p className="mt-1 text-sm text-error-500">{errors.description}</p>
                  )}
                  {!errors.description && formData.description && (
                    <p className="mt-1 text-xs text-architectural">{formData.description.length}/2000 characters</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Price ($)"
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    required
                    min="0"
                    step="0.01"
                    error={errors.price && touched.price ? errors.price : undefined}
                  />
                  <div>
                    <label className="block text-sm font-medium text-charcoal mb-1">
                      Property Type <span className="text-error-500">*</span>
                    </label>
                    <select
                      name="propertyType"
                      value={formData.propertyType}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2.5 border border-stone-300 rounded-lg focus:ring-2 focus:ring-obsidian-500 focus:border-obsidian-500 bg-porcelain transition-colors"
                    >
                      <option value="apartment">Apartment</option>
                      <option value="house">House</option>
                      <option value="condo">Condo</option>
                      <option value="townhouse">Townhouse</option>
                    </select>
                  </div>
                </div>

                <Input
                  label="Address"
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                  error={errors.address && touched.address ? errors.address : undefined}
                  placeholder="123 Main Street, City, State"
                />
              </div>
            </div>

            {/* Property Details */}
            <div className="border-b border-stone-200 pb-6">
              <Card.Title className="text-xl mb-4">Property Details</Card.Title>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input
                  label="Bedrooms"
                  type="number"
                  name="bedrooms"
                  value={formData.bedrooms}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                  min="1"
                  error={errors.bedrooms && touched.bedrooms ? errors.bedrooms : undefined}
                />
                <Input
                  label="Bathrooms"
                  type="number"
                  name="bathrooms"
                  value={formData.bathrooms}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                  min="0.5"
                  step="0.5"
                  error={errors.bathrooms && touched.bathrooms ? errors.bathrooms : undefined}
                />
                <Input
                  label="Area (sq ft)"
                  type="number"
                  name="area"
                  value={formData.area}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                  min="0"
                  error={errors.area && touched.area ? errors.area : undefined}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <Input
                  label="Year Built"
                  type="number"
                  name="yearBuilt"
                  value={formData.yearBuilt}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  min="1800"
                  max={new Date().getFullYear()}
                  error={errors.yearBuilt && touched.yearBuilt ? errors.yearBuilt : undefined}
                />
                <Input
                  label="Parking Spaces"
                  type="number"
                  name="parking"
                  value={formData.parking}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  min="0"
                  error={errors.parking && touched.parking ? errors.parking : undefined}
                />
              </div>
            </div>

            {/* Amenities */}
            <div className="border-b border-stone-200 pb-6">
              <Card.Title className="text-xl mb-4">Amenities</Card.Title>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {availableAmenities.map((amenity) => (
                  <label key={amenity} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.amenities.includes(amenity)}
                      onChange={() => handleAmenityToggle(amenity)}
                      className="w-4 h-4 text-obsidian-500 border-stone-300 rounded focus:ring-obsidian-500"
                    />
                    <span className="text-sm text-charcoal">{amenity}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Utilities */}
            <div className="border-b border-stone-200 pb-6">
              <Card.Title className="text-xl mb-4">Utilities Included</Card.Title>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {availableUtilities.map((utility) => (
                  <label key={utility} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.utilities.includes(utility)}
                      onChange={() => handleUtilityToggle(utility)}
                      className="w-4 h-4 text-obsidian-500 border-stone-300 rounded focus:ring-obsidian-500"
                    />
                    <span className="text-sm text-charcoal">{utility}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Rental Information */}
            <div className="border-b border-stone-200 pb-6">
              <Card.Title className="text-xl mb-4">Rental Information</Card.Title>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Monthly Rent ($)"
                  type="number"
                  name="monthlyRent"
                  value={formData.monthlyRent}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  min="0"
                  step="0.01"
                  error={errors.monthlyRent && touched.monthlyRent ? errors.monthlyRent : undefined}
                />
                <Input
                  label="Security Deposit ($)"
                  type="number"
                  name="securityDeposit"
                  value={formData.securityDeposit}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  min="0"
                  step="0.01"
                  error={errors.securityDeposit && touched.securityDeposit ? errors.securityDeposit : undefined}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-1">Lease Terms</label>
                  <select
                    name="leaseTerms"
                    value={formData.leaseTerms}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-stone-300 rounded-lg focus:ring-2 focus:ring-obsidian-500 focus:border-obsidian-500 bg-porcelain transition-colors"
                  >
                    <option value="6 months">6 months</option>
                    <option value="12 months">12 months</option>
                    <option value="18 months">18 months</option>
                    <option value="24 months">24 months</option>
                    <option value="Month-to-month">Month-to-month</option>
                  </select>
                </div>
                <Input
                  label="Available Date"
                  type="date"
                  name="availableDate"
                  value={formData.availableDate}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={errors.availableDate && touched.availableDate ? errors.availableDate : undefined}
                />
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium text-charcoal mb-1">Pet Policy</label>
                <select
                  name="petPolicy"
                  value={formData.petPolicy}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-stone-300 rounded-lg focus:ring-2 focus:ring-obsidian-500 focus:border-obsidian-500 bg-porcelain transition-colors"
                >
                  <option value="not_allowed">Not Allowed</option>
                  <option value="cats_only">Cats Only</option>
                  <option value="dogs_only">Dogs Only</option>
                  <option value="pets_allowed">Pets Allowed</option>
                </select>
              </div>
            </div>

            {/* Images */}
            <div className="border-b border-stone-200 pb-6">
              <Card.Title className="text-xl mb-4">
                Property Images <span className="text-error-500">*</span>
              </Card.Title>
              <div className="space-y-4 mb-4">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept="image/*"
                  className="hidden"
                />

                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => fileInputRef.current?.click()}
                    loading={uploading}
                    icon={
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                      </svg>
                    }
                  >
                    Upload Image
                  </Button>
                  <div className="flex-1 flex gap-2">
                    <input
                      type="url"
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      placeholder="Or enter image URL..."
                      className="flex-1 px-4 py-2.5 border border-stone-300 rounded-lg focus:ring-2 focus:ring-obsidian-500 focus:border-obsidian-500 bg-porcelain transition-colors"
                    />
                    <Button
                      type="button"
                      variant="primary"
                      onClick={handleAddImage}
                      disabled={!imageUrl.trim()}
                    >
                      Add URL
                    </Button>
                  </div>
                </div>
              </div>
              {errors.images && (
                <p className="mt-1 text-sm text-error-500">{errors.images}</p>
              )}
              {formData.images.length > 0 && (
                <div className="space-y-2">
                  {formData.images.map((url, index) => (
                    <Card key={index} variant="filled" padding="sm">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-charcoal truncate flex-1">{url}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveImage(index)}
                        >
                          Remove
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>

            <div className="flex gap-4 pt-4">
              <Button
                type="submit"
                variant="primary"
                fullWidth
                loading={loading}
              >
                Post Property
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => navigate('/owner/properties')}
              >
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}

export default PostProperty;

