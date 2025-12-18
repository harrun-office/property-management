import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ownerAPI } from '../../services/api';

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
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const availableAmenities = [
    'Air Conditioning', 'Heating', 'Dishwasher', 'Washer/Dryer', 'Parking',
    'Balcony', 'Gym', 'Pool', 'Elevator', 'Doorman', 'Pet Friendly',
    'Furnished', 'Hardwood Floors', 'Fireplace', 'Storage'
  ];

  const availableUtilities = [
    'Electricity', 'Water', 'Gas', 'Internet', 'Cable TV', 'Trash', 'Sewer'
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
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
      setFormData({
        ...formData,
        images: [...formData.images, imageUrl.trim()]
      });
      setImageUrl('');
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
        <h1 className="text-3xl font-bold text-charcoal mb-8">Post a New Property</h1>

        {error && (
          <div className="mb-6 p-4 bg-error/10 border border-red-400 text-error rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-stone-100 rounded-2xl shadow-lg p-8 space-y-6">
          {/* Basic Information */}
          <div className="border-b pb-6">
            <h2 className="text-xl font-semibold text-charcoal mb-4">Basic Information</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-charcoal mb-1">Title *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="w-full p-3 border border-stone-300 rounded-xl focus:ring-2 focus:ring-slate-500"
                  placeholder="e.g., Modern 3 Bedroom Apartment"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-charcoal mb-1">Description *</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  rows={4}
                  className="w-full p-3 border border-stone-300 rounded-xl focus:ring-2 focus:ring-slate-500"
                  placeholder="Describe your property..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-1">Price ($) *</label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    required
                    min="0"
                    className="w-full p-3 border border-stone-300 rounded-xl focus:ring-2 focus:ring-slate-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-1">Property Type *</label>
                  <select
                    name="propertyType"
                    value={formData.propertyType}
                    onChange={handleChange}
                    required
                    className="w-full p-3 border border-stone-300 rounded-xl focus:ring-2 focus:ring-slate-500"
                  >
                    <option value="apartment">Apartment</option>
                    <option value="house">House</option>
                    <option value="condo">Condo</option>
                    <option value="townhouse">Townhouse</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-charcoal mb-1">Address *</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                  className="w-full p-3 border border-stone-300 rounded-xl focus:ring-2 focus:ring-slate-500"
                  placeholder="123 Main Street, City, State"
                />
              </div>
            </div>
          </div>

          {/* Property Details */}
          <div className="border-b pb-6">
            <h2 className="text-xl font-semibold text-charcoal mb-4">Property Details</h2>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-charcoal mb-1">Bedrooms *</label>
                <input
                  type="number"
                  name="bedrooms"
                  value={formData.bedrooms}
                  onChange={handleChange}
                  required
                  min="1"
                  className="w-full p-3 border border-stone-300 rounded-xl focus:ring-2 focus:ring-slate-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-charcoal mb-1">Bathrooms *</label>
                <input
                  type="number"
                  name="bathrooms"
                  value={formData.bathrooms}
                  onChange={handleChange}
                  required
                  min="1"
                  step="0.5"
                  className="w-full p-3 border border-stone-300 rounded-xl focus:ring-2 focus:ring-slate-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-charcoal mb-1">Area (sq ft) *</label>
                <input
                  type="number"
                  name="area"
                  value={formData.area}
                  onChange={handleChange}
                  required
                  min="0"
                  className="w-full p-3 border border-stone-300 rounded-xl focus:ring-2 focus:ring-slate-500"
                />
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
                  min="1800"
                  max={new Date().getFullYear()}
                  className="w-full p-3 border border-stone-300 rounded-xl focus:ring-2 focus:ring-slate-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-charcoal mb-1">Parking Spaces</label>
                <input
                  type="number"
                  name="parking"
                  value={formData.parking}
                  onChange={handleChange}
                  min="0"
                  className="w-full p-3 border border-stone-300 rounded-xl focus:ring-2 focus:ring-slate-500"
                />
              </div>
            </div>
          </div>

          {/* Amenities */}
          <div className="border-b pb-6">
            <h2 className="text-xl font-semibold text-charcoal mb-4">Amenities</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {availableAmenities.map((amenity) => (
                <label key={amenity} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.amenities.includes(amenity)}
                    onChange={() => handleAmenityToggle(amenity)}
                    className="w-4 h-4 text-slate-700 border-stone-300 rounded focus:ring-slate-500"
                  />
                  <span className="text-sm text-charcoal">{amenity}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Utilities */}
          <div className="border-b pb-6">
            <h2 className="text-xl font-semibold text-charcoal mb-4">Utilities Included</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {availableUtilities.map((utility) => (
                <label key={utility} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.utilities.includes(utility)}
                    onChange={() => handleUtilityToggle(utility)}
                    className="w-4 h-4 text-slate-700 border-stone-300 rounded focus:ring-slate-500"
                  />
                  <span className="text-sm text-charcoal">{utility}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Rental Information */}
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
                  min="0"
                  className="w-full p-3 border border-stone-300 rounded-xl focus:ring-2 focus:ring-slate-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-charcoal mb-1">Security Deposit ($)</label>
                <input
                  type="number"
                  name="securityDeposit"
                  value={formData.securityDeposit}
                  onChange={handleChange}
                  min="0"
                  className="w-full p-3 border border-stone-300 rounded-xl focus:ring-2 focus:ring-slate-500"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block text-sm font-medium text-charcoal mb-1">Lease Terms</label>
                <select
                  name="leaseTerms"
                  value={formData.leaseTerms}
                  onChange={handleChange}
                  className="w-full p-3 border border-stone-300 rounded-xl focus:ring-2 focus:ring-slate-500"
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
                  className="w-full p-3 border border-stone-300 rounded-xl focus:ring-2 focus:ring-slate-500"
                />
              </div>
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-charcoal mb-1">Pet Policy</label>
              <select
                name="petPolicy"
                value={formData.petPolicy}
                onChange={handleChange}
                className="w-full p-3 border border-stone-300 rounded-xl focus:ring-2 focus:ring-slate-500"
              >
                <option value="not_allowed">Not Allowed</option>
                <option value="cats_only">Cats Only</option>
                <option value="dogs_only">Dogs Only</option>
                <option value="pets_allowed">Pets Allowed</option>
              </select>
            </div>
          </div>

          {/* Images */}
          <div className="border-b pb-6">
            <h2 className="text-xl font-semibold text-charcoal mb-4">Property Images</h2>
            <div className="flex gap-2 mb-2">
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://example.com/image.jpg"
                className="flex-1 p-3 border border-stone-300 rounded-xl focus:ring-2 focus:ring-slate-500"
              />
              <button
                type="button"
                onClick={handleAddImage}
                className="px-4 py-3 bg-obsidian-500 text-white rounded-xl hover:bg-obsidian-600"
              >
                Add
              </button>
            </div>
            {formData.images.length > 0 && (
              <div className="space-y-2">
                {formData.images.map((url, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-gray-100 rounded-lg">
                    <span className="text-sm text-charcoal truncate flex-1">{url}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      className="ml-2 text-red-600 hover:text-red-800"
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
              className="flex-1 py-3 bg-obsidian-500 text-white rounded-xl font-semibold hover:bg-obsidian-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Posting...' : 'Post Property'}
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

export default PostProperty;

