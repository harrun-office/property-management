import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ownerAPI } from '../../services/api';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Modal from '../../components/ui/Modal';
import Skeleton from '../../components/ui/Skeleton';
import ErrorDisplay from '../../components/ui/ErrorDisplay';
import EmptyState from '../../components/ui/EmptyState';

function ManagerMarketplace() {
  const [managers, setManagers] = useState([]);
  const [selectedManager, setSelectedManager] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    rating: '',
    priceRange: '',
    search: ''
  });
  const [showSubscribeModal, setShowSubscribeModal] = useState(false);
  const [subscribeData, setSubscribeData] = useState({
    propertyId: '',
    planId: '',
    paymentMethod: 'credit_card'
  });

  useEffect(() => {
    loadManagers();
  }, [filters.rating, filters.priceRange, filters.search]);

  const loadManagers = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await ownerAPI.getAvailableManagers(filters);
      setManagers(data);
    } catch (err) {
      setError(err.message || 'Failed to load managers');
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = async () => {
    if (!subscribeData.propertyId || !subscribeData.planId) {
      setError('Please select a property and plan');
      return;
    }

    try {
      await ownerAPI.subscribeToManager({
        managerId: selectedManager.id,
        propertyId: parseInt(subscribeData.propertyId),
        planId: parseInt(subscribeData.planId),
        paymentMethod: subscribeData.paymentMethod
      });
      alert('Subscription created successfully!');
      setShowSubscribeModal(false);
      setSelectedManager(null);
      setSubscribeData({ propertyId: '', planId: '', paymentMethod: 'credit_card' });
      // Redirect to subscriptions page
      window.location.href = '/owner/subscriptions';
    } catch (err) {
      setError(err.message || 'Failed to create subscription');
    }
  };

  return (
    <div className="min-h-screen bg-porcelain py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-charcoal mb-2">Manager Marketplace</h1>
          <p className="text-architectural">Browse and hire professional property managers</p>
        </div>

        {error && <ErrorDisplay message={error} className="mb-6" />}

        {/* Filters */}
        <Card variant="elevated" padding="lg" className="mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              type="text"
              placeholder="Search managers..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            />
            <div>
              <select
                value={filters.rating}
                onChange={(e) => setFilters({ ...filters, rating: e.target.value })}
                className="w-full px-4 py-2.5 border border-stone-300 rounded-lg focus:ring-2 focus:ring-obsidian-500 focus:border-obsidian-500 bg-porcelain transition-colors"
              >
                <option value="">All Ratings</option>
                <option value="4.5">4.5+ Stars</option>
                <option value="4.0">4.0+ Stars</option>
                <option value="3.5">3.5+ Stars</option>
              </select>
            </div>
            <div>
              <select
                value={filters.priceRange}
                onChange={(e) => setFilters({ ...filters, priceRange: e.target.value })}
                className="w-full px-4 py-2.5 border border-stone-300 rounded-lg focus:ring-2 focus:ring-obsidian-500 focus:border-obsidian-500 bg-porcelain transition-colors"
              >
                <option value="">All Prices</option>
                <option value="0-50">$0 - $50/month</option>
                <option value="50-100">$50 - $100/month</option>
                <option value="100-150">$100 - $150/month</option>
                <option value="150-999">$150+/month</option>
              </select>
            </div>
          </div>
        </Card>

        {/* Managers Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Skeleton.Card key={i} />
            ))}
          </div>
        ) : managers.length === 0 ? (
          <EmptyState
            title="No managers found"
            description="Try adjusting your filters to find more managers."
            icon={
              <svg className="w-16 h-16 text-architectural" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            }
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {managers.map((manager) => (
              <Card key={manager.id} variant="elevated" padding="lg" className="hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-brass/30 to-brass/10 flex items-center justify-center text-brass font-bold text-lg">
                      {manager.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-charcoal">{manager.name}</h3>
                      <div className="flex items-center space-x-1">
                        <span className="text-yellow-500">★</span>
                        <span className="text-sm font-medium">{manager.averageRating}</span>
                        <span className="text-xs text-architectural">({manager.totalReviews} reviews)</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="space-y-2 mb-4">
                  <p className="text-sm text-architectural">
                    <span className="font-medium">Experience:</span> {manager.experience} years
                  </p>
                  <p className="text-sm text-architectural">
                    <span className="font-medium">Response Time:</span> {manager.responseTime}
                  </p>
                  <p className="text-sm text-architectural">
                    <span className="font-medium">Properties Managed:</span> {manager.activeSubscriptions}
                  </p>
                  <p className="text-sm text-architectural">
                    <span className="font-medium">Location:</span> {manager.location}
                  </p>
                  {manager.specialties && manager.specialties.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {manager.specialties.map((spec, idx) => (
                        <span key={idx} className="px-2 py-1 bg-obsidian/10 text-obsidian text-xs rounded-full">
                          {spec}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <div className="border-t border-stone-200 pt-4">
                  <p className="text-xs text-architectural mb-2">Starting from:</p>
                  <p className="text-2xl font-bold text-charcoal mb-4">
                    ${manager.availablePlans[0]?.price || 0}/month
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      fullWidth
                      onClick={() => setSelectedManager(manager)}
                    >
                      View Details
                    </Button>
                    <Button
                      variant="primary"
                      size="sm"
                      fullWidth
                      onClick={() => {
                        setSelectedManager(manager);
                        setShowSubscribeModal(true);
                      }}
                    >
                      Subscribe
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Manager Details Modal */}
        {selectedManager && !showSubscribeModal && (
          <Modal
            isOpen={!!selectedManager}
            onClose={() => setSelectedManager(null)}
            title={selectedManager.name}
            size="lg"
          >
              <div className="space-y-4">
                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-yellow-500">★</span>
                    <span className="text-lg font-semibold">{selectedManager.averageRating}</span>
                    <span className="text-sm text-architectural">({selectedManager.totalReviews} reviews)</span>
                  </div>
                  {selectedManager.profile?.bio && (
                    <p className="text-architectural">{selectedManager.profile.bio}</p>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-architectural">Experience</p>
                    <p className="font-semibold">{selectedManager.experience} years</p>
                  </div>
                  <div>
                    <p className="text-sm text-architectural">Response Time</p>
                    <p className="font-semibold">{selectedManager.responseTime}</p>
                  </div>
                  <div>
                    <p className="text-sm text-architectural">Properties Managed</p>
                    <p className="font-semibold">{selectedManager.activeSubscriptions}</p>
                  </div>
                  <div>
                    <p className="text-sm text-architectural">Location</p>
                    <p className="font-semibold">{selectedManager.location}</p>
                  </div>
                </div>
                {selectedManager.availablePlans && selectedManager.availablePlans.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-charcoal mb-2">Available Plans</h3>
                    <div className="space-y-2">
                      {selectedManager.availablePlans.map((plan) => (
                        <div key={plan.id} className="bg-stone-100 p-3 rounded-lg">
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="font-semibold text-charcoal">{plan.name}</p>
                              <p className="text-sm text-architectural">{plan.description}</p>
                            </div>
                            <p className="text-xl font-bold text-obsidian">${plan.price}/mo</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                <Button
                  variant="primary"
                  fullWidth
                  onClick={() => setShowSubscribeModal(true)}
                >
                  Subscribe Now
                </Button>
              </div>
          </Modal>
        )}

        {/* Subscribe Modal */}
        {showSubscribeModal && selectedManager && (
          <Modal
            isOpen={showSubscribeModal}
            onClose={() => setShowSubscribeModal(false)}
            title={`Subscribe to ${selectedManager.name}`}
          >
            <div className="space-y-4">
              <Input
                label="Property ID"
                type="number"
                value={subscribeData.propertyId}
                onChange={(e) => setSubscribeData({ ...subscribeData, propertyId: e.target.value })}
                placeholder="Enter property ID"
              />
              <div>
                <label className="block text-sm font-medium text-charcoal mb-1">Select Plan</label>
                <select
                  value={subscribeData.planId}
                  onChange={(e) => setSubscribeData({ ...subscribeData, planId: e.target.value })}
                  className="w-full px-4 py-2.5 border border-stone-300 rounded-lg focus:ring-2 focus:ring-obsidian-500 focus:border-obsidian-500 bg-porcelain transition-colors"
                >
                  <option value="">Select a plan</option>
                  {selectedManager.availablePlans.map((plan) => (
                    <option key={plan.id} value={plan.id}>
                      {plan.name} - ${plan.price}/month
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-charcoal mb-1">Payment Method</label>
                <select
                  value={subscribeData.paymentMethod}
                  onChange={(e) => setSubscribeData({ ...subscribeData, paymentMethod: e.target.value })}
                  className="w-full px-4 py-2.5 border border-stone-300 rounded-lg focus:ring-2 focus:ring-obsidian-500 focus:border-obsidian-500 bg-porcelain transition-colors"
                >
                  <option value="credit_card">Credit Card</option>
                  <option value="debit_card">Debit Card</option>
                  <option value="bank_transfer">Bank Transfer</option>
                </select>
              </div>
              <div className="flex gap-3">
                <Button
                  variant="secondary"
                  fullWidth
                  onClick={() => setShowSubscribeModal(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  fullWidth
                  onClick={handleSubscribe}
                >
                  Subscribe
                </Button>
              </div>
            </div>
          </Modal>
        )}
      </div>
    </div>
  );
}

export default ManagerMarketplace;

