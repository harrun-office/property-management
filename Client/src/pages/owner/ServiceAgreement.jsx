import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ownerAPI } from '../../services/api';

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
      <div className="min-h-screen bg-porcelain flex items-center justify-center">
        <p className="text-charcoal text-lg">Loading agreement...</p>
      </div>
    );
  }

  if (error || !agreement) {
    return (
      <div className="min-h-screen bg-porcelain flex items-center justify-center">
        <div className="text-center">
          <p className="text-error text-lg mb-4">{error || 'Agreement not found'}</p>
          <Link to={`/owner/subscriptions/${id}`} className="text-obsidian hover:text-brass transition-colors">
            Back to Subscription
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-porcelain py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Link to={`/owner/subscriptions/${id}`} className="text-obsidian hover:text-brass transition-colors mb-4 inline-block">
            ← Back to Subscription
          </Link>
          <h1 className="text-4xl font-bold text-charcoal mb-2">Service Agreement</h1>
        </div>

        <div className="bg-stone-100 rounded-xl shadow-md p-8 border border-stone-200">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-charcoal mb-4">Property Management Service Agreement</h2>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <p className="text-architectural text-sm">Manager</p>
                <p className="font-semibold text-charcoal">{agreement.manager?.name || 'N/A'}</p>
                <p className="text-sm text-architectural">{agreement.manager?.email}</p>
              </div>
              <div>
                <p className="text-architectural text-sm">Property</p>
                <p className="font-semibold text-charcoal">{agreement.property?.title || 'N/A'}</p>
                <p className="text-sm text-architectural">{agreement.property?.address}</p>
              </div>
            </div>
          </div>

          <div className="bg-porcelain p-6 rounded-lg border border-stone-200 mb-6">
            <h3 className="font-semibold text-charcoal mb-3">Services Included</h3>
            <ul className="list-disc list-inside space-y-2 text-charcoal">
              {agreement.services && agreement.services.map((service, idx) => (
                <li key={idx} className="capitalize">{service.replace(/_/g, ' ')}</li>
              ))}
            </ul>
          </div>

          <div className="bg-porcelain p-6 rounded-lg border border-stone-200 mb-6">
            <h3 className="font-semibold text-charcoal mb-3">Terms and Conditions</h3>
            <p className="text-charcoal whitespace-pre-line">{agreement.terms}</p>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <p className="text-architectural text-sm">Signed by Owner</p>
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
              <p className="text-architectural text-sm">Signed by Manager</p>
              <p className="font-semibold text-charcoal">
                {agreement.signedByManager ? '✓ Signed' : 'Pending'}
              </p>
            </div>
          </div>

          <div className="flex space-x-4">
            <button
              onClick={() => alert('PDF download feature coming soon')}
              className="px-6 py-2 bg-obsidian text-porcelain rounded-lg hover:bg-obsidian-light transition-colors"
            >
              Download PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ServiceAgreement;

