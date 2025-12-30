import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { tenantAPI } from '../../services/api';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import MetricCard from '../../components/ui/MetricCard';
import Skeleton from '../../components/ui/Skeleton';
import ErrorDisplay from '../../components/ui/ErrorDisplay';

function TenantDashboard() {
    const { user } = useAuth();
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        loadDashboard();
    }, []);

    const loadDashboard = async () => {
        setLoading(true);
        setError('');
        try {
            const data = await tenantAPI.getDashboard();
            setDashboardData(data);
        } catch (err) {
            console.error("Dashboard load error:", err);
            // Fallback data if API fails or doesn't exist yet
            setDashboardData({
                currentProperty: null,
                stats: {
                    rentDue: 0,
                    pendingRequests: 0,
                    unreadMessages: 0
                },
                recentActivity: []
            });
            // Only set error if it's critical, otherwise show empty state/fallback
            if (err.message && !err.message.includes('404')) {
                setError(err.message);
            }
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-porcelain py-8 px-4">
                <div className="max-w-7xl mx-auto">
                    <div className="mb-8">
                        <Skeleton variant="title" width="40%" className="mb-2" />
                        <Skeleton variant="text" width="60%" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        {[1, 2, 3].map((i) => (
                            <Skeleton.MetricCard key={i} />
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-porcelain py-8 px-4">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-4xl font-bold text-charcoal mb-2">Welcome back, {user?.name?.split(' ')[0]}!</h1>
                        <p className="text-architectural">Here's what's happening with your rental.</p>
                    </div>
                    <Link to="/tenant/payments">
                        <Button variant="primary">Make Payment</Button>
                    </Link>
                </div>

                {error && <ErrorDisplay message={error} onRetry={loadDashboard} className="mb-6" />}

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <MetricCard
                        title="Next Rent Due"
                        value={dashboardData?.stats?.rentDue ? `$${dashboardData.stats.rentDue}` : '$0'}
                        variant={dashboardData?.stats?.rentDue > 0 ? "warning" : "success"}
                        icon={
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        }
                    />
                    <MetricCard
                        title="Active Requests"
                        value={dashboardData?.stats?.pendingRequests || '0'}
                        variant="default"
                        icon={
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                            </svg>
                        }
                        onClick={() => window.location.href = '/tenant/maintenance'}
                    />
                    <MetricCard
                        title="Unread Messages"
                        value={dashboardData?.stats?.unreadMessages || '0'}
                        variant="default"
                        icon={
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                            </svg>
                        }
                        onClick={() => window.location.href = '/tenant/messages'}
                    />
                </div>

                {/* Current Property / Empty State */}
                {dashboardData?.currentProperty ? (
                    <Card variant="elevated" padding="lg" className="mb-8">
                        <Card.Header className="flex justify-between items-center mb-4">
                            <Card.Title>Current Residence</Card.Title>
                            <span className="bg-eucalyptus-100 text-eucalyptus-700 px-3 py-1 rounded-full text-xs font-semibold">Lease Active</span>
                        </Card.Header>
                        <Card.Body>
                            <div className="flex items-start gap-4">
                                {dashboardData.currentProperty.images?.[0] ? (
                                    <img
                                        src={dashboardData.currentProperty.images[0]}
                                        alt="Property"
                                        className="w-24 h-24 object-cover rounded-lg"
                                    />
                                ) : (
                                    <div className="w-24 h-24 bg-stone-100 rounded-lg flex items-center justify-center text-stone-400">
                                        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                        </svg>
                                    </div>
                                )}
                                <div>
                                    <h3 className="text-xl font-bold text-charcoal">{dashboardData.currentProperty.title}</h3>
                                    <p className="text-architectural mb-2">{dashboardData.currentProperty.address}</p>
                                    <Link to="/tenant/lease" className="text-obsidian hover:text-brass font-medium text-sm">View Lease Details →</Link>
                                </div>
                            </div>
                        </Card.Body>
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        <Card variant="outlined" padding="lg" className="border-dashed border-2">
                            <div className="text-center py-8">
                                <h3 className="text-lg font-semibold text-charcoal mb-2">No Active Lease</h3>
                                <p className="text-architectural mb-6">You don't have an active lease yet.</p>
                                <Link to="/properties">
                                    <Button variant="primary">Browse Properties</Button>
                                </Link>
                            </div>
                        </Card>
                        <Card variant="filled" padding="lg">
                            <div className="text-center py-8">
                                <h3 className="text-lg font-semibold text-charcoal mb-2">Complete Your Profile</h3>
                                <p className="text-architectural mb-6">Increase your chances of getting approved.</p>
                                <Link to="/tenant/profile">
                                    <Button variant="outline">Edit Profile</Button>
                                </Link>
                            </div>
                        </Card>
                    </div>
                )}
            </div>
        </div>
    );
}

export default TenantDashboard;
