import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { propertyManagerAPI } from '../../services/api';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Skeleton from '../../components/ui/Skeleton';
import ErrorDisplay from '../../components/ui/ErrorDisplay';
import EmptyState from '../../components/ui/EmptyState';

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
      <div className="min-h-screen bg-porcelain py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <Skeleton variant="text" width="30%" className="mb-4" />
            <Skeleton variant="title" width="50%" className="mb-2" />
            <Skeleton variant="text" width="70%" />
          </div>
          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <Skeleton.Card key={i} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error && !subscription) {
    return (
      <div className="min-h-screen bg-porcelain py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <ErrorDisplay
            message={error}
            action={
              <Link to="/property-manager/subscriptions">
                <Button variant="primary">Back to Subscriptions</Button>
              </Link>
            }
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-porcelain py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Link to="/property-manager/subscriptions" className="mb-4 inline-block">
            <Button variant="ghost" icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            }>
              Back to Subscriptions
            </Button>
          </Link>
          <h1 className="text-4xl font-bold text-charcoal mb-2">Property Onboarding</h1>
        </div>

        {error && <ErrorDisplay message={error} className="mb-6" />}
        {success && (
          <div className="mb-6 p-4 bg-eucalyptus-100 border border-eucalyptus-500 text-eucalyptus-700 rounded-lg">
            {success}
          </div>
        )}

        {subscription && (
          <div className="space-y-6">
            {/* Owner Information */}
            <Card variant="elevated" padding="lg">
              <Card.Title className="text-2xl mb-4">Owner Information</Card.Title>
              <div className="space-y-2">
                <p className="font-semibold text-charcoal">{subscription.owner?.name || 'N/A'}</p>
                <p className="text-architectural">{subscription.owner?.email}</p>
                {subscription.owner?.mobileNumber && (
                  <p className="text-architectural">Phone: {subscription.owner.mobileNumber}</p>
                )}
              </div>
            </Card>

            {/* Property Information */}
            <Card variant="elevated" padding="lg">
              <Card.Title className="text-2xl mb-4">Property Information</Card.Title>
              <div className="space-y-2">
                <p className="font-semibold text-charcoal">{subscription.property?.title || 'N/A'}</p>
                <p className="text-architectural">{subscription.property?.address}</p>
              </div>
            </Card>

            {/* Contact Owner */}
            <Card variant="elevated" padding="lg">
              <Card.Title className="text-2xl mb-4">Contact Owner</Card.Title>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-1.5">Message</label>
                  <textarea
                    value={contactMessage}
                    onChange={(e) => setContactMessage(e.target.value)}
                    placeholder="Enter your message to the owner..."
                    rows={4}
                    className="w-full px-4 py-2.5 border border-stone-300 rounded-lg bg-porcelain text-charcoal placeholder-architectural focus:outline-none focus:ring-2 focus:ring-obsidian-500 focus:border-obsidian-500 transition-all duration-200"
                  />
                </div>
                <Button variant="primary" onClick={handleContactOwner}>
                  Send Message
                </Button>
              </div>
            </Card>

            {/* Upload Property Details */}
            <Card variant="elevated" padding="lg">
              <Card.Title className="text-2xl mb-4">Upload Property Details</Card.Title>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-1.5">Description</label>
                  <textarea
                    value={propertyDetails.description}
                    onChange={(e) => setPropertyDetails({ ...propertyDetails, description: e.target.value })}
                    rows={3}
                    placeholder="Property description..."
                    className="w-full px-4 py-2.5 border border-stone-300 rounded-lg bg-porcelain text-charcoal placeholder-architectural focus:outline-none focus:ring-2 focus:ring-obsidian-500 focus:border-obsidian-500 transition-all duration-200"
                  />
                </div>
                <Input
                  label="Amenities"
                  type="text"
                  value={propertyDetails.amenities}
                  onChange={(e) => setPropertyDetails({ ...propertyDetails, amenities: e.target.value })}
                  placeholder="e.g., Pool, Gym, Parking"
                />
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-1.5">Notes</label>
                  <textarea
                    value={propertyDetails.notes}
                    onChange={(e) => setPropertyDetails({ ...propertyDetails, notes: e.target.value })}
                    rows={3}
                    placeholder="Additional notes..."
                    className="w-full px-4 py-2.5 border border-stone-300 rounded-lg bg-porcelain text-charcoal placeholder-architectural focus:outline-none focus:ring-2 focus:ring-obsidian-500 focus:border-obsidian-500 transition-all duration-200"
                  />
                </div>
                <Button variant="primary" onClick={handleUploadProperty}>
                  Upload Details
                </Button>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}

export default Onboarding;

