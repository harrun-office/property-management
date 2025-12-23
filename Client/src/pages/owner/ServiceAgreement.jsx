import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ownerAPI } from '../../services/api';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Skeleton from '../../components/ui/Skeleton';
import ErrorDisplay from '../../components/ui/ErrorDisplay';
import EmptyState from '../../components/ui/EmptyState';

function ServiceAgreement() {
  const { id } = useParams();
  const [agreement, setAgreement] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (id) {
      loadAgreement();
    }
  }, [id]);

  const loadAgreement = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await ownerAPI.getServiceAgreement(id);
      setAgreement(data);
    } catch (err) {
      setError(err.message || 'Failed to load service agreement');
    } finally {
      setLoading(false);
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
          <Skeleton.Card />
        </div>
      </div>
    );
  }

  if (error || !agreement) {
    return (
      <div className="min-h-screen bg-porcelain py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <ErrorDisplay
            message={error || 'Agreement not found'}
            action={
              <Link to={`/owner/subscriptions/${id}`}>
                <Button variant="primary">Back to Subscription</Button>
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
          <Link to={`/owner/subscriptions/${id}`} className="mb-4 inline-block">
            <Button variant="ghost" icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            }>
              Back to Subscription
            </Button>
          </Link>
          <h1 className="text-4xl font-bold text-charcoal mb-2">Service Agreement</h1>
        </div>

        <Card variant="elevated" padding="lg">
          <Card.Title className="text-2xl mb-4">Property Management Service Agreement</Card.Title>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <p className="text-architectural text-sm mb-1">Manager</p>
              <p className="font-semibold text-charcoal">{agreement.manager?.name || 'N/A'}</p>
              <p className="text-sm text-architectural">{agreement.manager?.email}</p>
            </div>
            <div>
              <p className="text-architectural text-sm mb-1">Property</p>
              <p className="font-semibold text-charcoal">{agreement.property?.title || 'N/A'}</p>
              <p className="text-sm text-architectural">{agreement.property?.address}</p>
            </div>
          </div>

          <Card variant="filled" padding="lg" className="mb-6">
            <Card.Title className="mb-3">Services Included</Card.Title>
            <ul className="list-disc list-inside space-y-2 text-charcoal">
              {agreement.services && agreement.services.map((service, idx) => (
                <li key={idx} className="capitalize">{service.replace(/_/g, ' ')}</li>
              ))}
            </ul>
          </Card>

          <Card variant="filled" padding="lg" className="mb-6">
            <Card.Title className="mb-3">Terms and Conditions</Card.Title>
            <p className="text-charcoal whitespace-pre-line">{agreement.terms}</p>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <p className="text-architectural text-sm mb-1">Signed by Owner</p>
              <p className="font-semibold text-charcoal">
                {agreement.signedByOwner ? '✓ Signed' : 'Not signed'}
              </p>
              {agreement.signedDate && (
                <p className="text-xs text-architectural">
                  {new Date(agreement.signedDate).toLocaleDateString()}
                </p>
              )}
            </div>
            <div>
              <p className="text-architectural text-sm mb-1">Signed by Manager</p>
              <p className="font-semibold text-charcoal">
                {agreement.signedByManager ? '✓ Signed' : 'Pending'}
              </p>
            </div>
          </div>

          <Button
            variant="primary"
            onClick={() => alert('PDF download feature coming soon')}
          >
            Download PDF
          </Button>
        </Card>
      </div>
    </div>
  );
}

export default ServiceAgreement;

