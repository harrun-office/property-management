import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { propertyManagerAPI } from '../../services/api';

function Onboarding() {
  const { id } = useParams();
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [propertyDetails, setPropertyDetails] = useState({
    description: '',
    amenities: '',
    notes: ''
  });

  useEffect(() => {
    if (id) {
      loadSubscription();
    }
  }, [id]);

  const loadSubscription = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await propertyManagerAPI.getSubscriptionDetails(id);
      setSubscription(data.subscription);
    } catch (err) {
      setError(err.message || 'Failed to load subscription');
    } finally {
      setLoading(false);
    }
  };

  const handleContactOwner = async () => {
    if (!contactMessage.trim()) {
      setError('Please enter a message');
      return;
    }

    try {
      await propertyManagerAPI.initiateContact(id, {
        message: contactMessage,
        contactMethod: 'email'
      });
      setSuccess('Contact message sent successfully!');
      setContactMessage('');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message || 'Failed to send message');
    }
  };

  const handleUploadProperty = async () => {
    try {
      await propertyManagerAPI.uploadPropertyDetails(id, {
        details: propertyDetails,
        documentation: []
      });
      setSuccess('Property details uploaded successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message || 'Failed to upload property details');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-porcelain flex items-center justify-center">
        <p className="text-charcoal text-lg">Loading...</p>
      </div>
    );
  }

  if (error && !subscription) {
    return (
      <div className="min-h-screen bg-porcelain flex items-center justify-center">
        <div className="text-center">
          <p className="text-error text-lg mb-4">{error}</p>
          <Link to="/property-manager/subscriptions" className="text-obsidian hover:text-brass transition-colors">
            Back to Subscriptions
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-porcelain py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Link to="/property-manager/subscriptions" className="text-obsidian hover:text-brass transition-colors mb-4 inline-block">
            ← Back to Subscriptions
          </Link>
          <h1 className="text-4xl font-bold text-charcoal mb-2">Property Onboarding</h1>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-error/20 border border-error text-error rounded-lg">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-eucalyptus/20 border border-eucalyptus text-eucalyptus rounded-lg">
            {success}
          </div>
        )}

        {subscription && (
          <div className="space-y-6">
            {/* Owner Information */}
            <div className="bg-stone-100 rounded-xl shadow-md p-6 border border-stone-200">
              <h2 className="text-2xl font-bold text-charcoal mb-4">Owner Information</h2>
              <div className="space-y-2">
                <p className="font-semibold text-charcoal">{subscription.owner?.name || 'N/A'}</p>
                <p className="text-architectural">{subscription.owner?.email}</p>
                {subscription.owner?.mobileNumber && (
                  <p className="text-architectural">Phone: {subscription.owner.mobileNumber}</p>
                )}
              </div>
            </div>

            {/* Property Information */}
            <div className="bg-stone-100 rounded-xl shadow-md p-6 border border-stone-200">
              <h2 className="text-2xl font-bold text-charcoal mb-4">Property Information</h2>
              <div className="space-y-2">
                <p className="font-semibold text-charcoal">{subscription.property?.title || 'N/A'}</p>
                <p className="text-architectural">{subscription.property?.address}</p>
              </div>
            </div>

            {/* Contact Owner */}
            <div className="bg-stone-100 rounded-xl shadow-md p-6 border border-stone-200">
              <h2 className="text-2xl font-bold text-charcoal mb-4">Contact Owner</h2>
              <div className="space-y-4">
                <textarea
                  value={contactMessage}
                  onChange={(e) => setContactMessage(e.target.value)}
                  placeholder="Enter your message to the owner..."
                  rows={4}
                  className="w-full px-3 py-2 border rounded-lg bg-porcelain focus:ring-2 focus:ring-obsidian focus:border-obsidian"
                />
                <button
                  onClick={handleContactOwner}
                  className="px-6 py-2 bg-obsidian text-porcelain rounded-lg hover:bg-obsidian-light transition-colors"
                >
                  Send Message
                </button>
              </div>
            </div>

            {/* Upload Property Details */}
            <div className="bg-stone-100 rounded-xl shadow-md p-6 border border-stone-200">
              <h2 className="text-2xl font-bold text-charcoal mb-4">Upload Property Details</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-1">Description</label>
                  <textarea
                    value={propertyDetails.description}
                    onChange={(e) => setPropertyDetails({ ...propertyDetails, description: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border rounded-lg bg-porcelain focus:ring-2 focus:ring-obsidian focus:border-obsidian"
                    placeholder="Property description..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-1">Amenities</label>
                  <input
                    type="text"
                    value={propertyDetails.amenities}
                    onChange={(e) => setPropertyDetails({ ...propertyDetails, amenities: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg bg-porcelain focus:ring-2 focus:ring-obsidian focus:border-obsidian"
                    placeholder="e.g., Pool, Gym, Parking"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-1">Notes</label>
                  <textarea
                    value={propertyDetails.notes}
                    onChange={(e) => setPropertyDetails({ ...propertyDetails, notes: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border rounded-lg bg-porcelain focus:ring-2 focus:ring-obsidian focus:border-obsidian"
                    placeholder="Additional notes..."
                  />
                </div>
                <button
                  onClick={handleUploadProperty}
                  className="px-6 py-2 bg-obsidian text-porcelain rounded-lg hover:bg-obsidian-light transition-colors"
                >
                  Upload Details
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Onboarding;

