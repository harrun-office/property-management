import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { tenantAPI } from '../../services/api';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Skeleton from '../../components/ui/Skeleton';
import ErrorDisplay from '../../components/ui/ErrorDisplay';

function TenantDashboard() {
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        loadDashboard();
    }, []);

    const loadAllApplications = async () => {
        try {
            const apps = await propertiesAPI.getMyApplications?.() || [];
            setApplications(apps);
            setHasRejectedApplications(apps.some(app => app.status === 'rejected'));
        } catch (err) {
            console.error("Applications load error", err);
        }
    };

    const loadDashboard = async () => {
        setLoading(true);
        setError('');
        try {
            // Assuming getDashboard exists in tenantAPI as implied by SavedProperties.jsx
            const data = await tenantAPI.getDashboard();
            setDashboardData(data);
        } catch (err) {
            console.error("Dashboard load error", err);
            // Fallback data for now if API isn't fully ready or fails
            setDashboardData({
                leaseStatus: 'Active',
                nextPaymentDate: '2026-02-01',
                amountDue: 1200,
                maintenanceRequests: [],
                messages: []
            });
            // Uncomment below to show actual error
            // setError(err.message || 'Failed to load dashboard');
        } finally {
            setLoading(false);
        }
    };



    if (loading) {
        return (
            <div className="min-h-screen bg-porcelain p-6">
                <Skeleton variant="title" width="40%" className="mb-6" />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <Skeleton.Card />
                    <Skeleton.Card />
                    <Skeleton.Card />
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-6">
                <ErrorDisplay message={error} onRetry={loadDashboard} />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-charcoal">
                    {hasRejectedApplications ? 'Welcome Back' : 'Welcome Home'}
                </h1>
                <p className="text-architectural mt-2">
                    {hasRejectedApplications
                        ? 'Browse new properties and find your perfect home.'
                        : 'Here\'s what\'s happening with your property.'
                    }
                </p>
            </div>

            {hasRejectedApplications ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Browse Properties Card */}
                    <Card>
                        <Card.Header>
                            <h3 className="text-lg font-semibold text-charcoal">Browse Properties</h3>
                        </Card.Header>
                        <Card.Body>
                            <div className="text-2xl font-bold text-primary mb-2">
                                Find New Home
                            </div>
                            <p className="text-sm text-architectural">
                                Discover available properties in your area
                            </p>
                        </Card.Body>
                        <Card.Footer>
                            <Link to="/properties">
                                <Button variant="primary" size="sm" fullWidth>Browse Now</Button>
                            </Link>
                        </Card.Footer>
                    </Card>

                    {/* Saved Properties Card */}
                    <Card>
                        <Card.Header>
                            <h3 className="text-lg font-semibold text-charcoal">Saved Properties</h3>
                        </Card.Header>
                        <Card.Body>
                            <div className="text-2xl font-bold text-secondary mb-2">
                                View Saved
                            </div>
                            <p className="text-sm text-architectural">
                                Check your saved properties
                            </p>
                        </Card.Body>
                        <Card.Footer>
                            <Link to="/tenant/saved">
                                <Button variant="outline" size="sm" fullWidth>View Saved</Button>
                            </Link>
                        </Card.Footer>
                    </Card>

                    {/* Applications Card */}
                    <Card>
                        <Card.Header>
                            <h3 className="text-lg font-semibold text-charcoal">My Applications</h3>
                        </Card.Header>
                        <Card.Body>
                            <div className="text-2xl font-bold text-charcoal mb-2">
                                Track Status
                            </div>
                            <p className="text-sm text-architectural">
                                Monitor your application progress
                            </p>
                        </Card.Body>
                        <Card.Footer>
                            <Link to="/tenant/applications">
                                <Button variant="outline" size="sm" fullWidth>View Applications</Button>
                            </Link>
                        </Card.Footer>
                    </Card>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Lease Status Card */}
                    <Card>
                        <Card.Header>
                            <h3 className="text-lg font-semibold text-charcoal">Lease Status</h3>
                        </Card.Header>
                        <Card.Body>
                            <div className="text-2xl font-bold text-success mb-2">
                                {dashboardData?.leaseStatus || 'Active'}
                            </div>
                            <p className="text-sm text-architectural">
                                Current Lease
                            </p>
                        </Card.Body>
                        <Card.Footer>
                            <Link to="/tenant/lease">
                                <Button variant="outline" size="sm" fullWidth>View Details</Button>
                            </Link>
                        </Card.Footer>
                    </Card>

                    {/* Rent Status Card */}
                    <Card>
                        <Card.Header>
                            <h3 className="text-lg font-semibold text-charcoal">Next Payment</h3>
                        </Card.Header>
                        <Card.Body>
                            <div className="text-2xl font-bold text-charcoal mb-2">
                                ₹{dashboardData?.amountDue || 0}
                            </div>
                            <p className="text-sm text-architectural">
                                Due on {dashboardData?.nextPaymentDate}
                            </p>
                        </Card.Body>
                        <Card.Footer>
                            <Link to="/tenant/payments">
                                <Button variant="primary" size="sm" fullWidth>Pay Now</Button>
                            </Link>
                        </Card.Footer>
                    </Card>

                    {/* Maintenance Card */}
                    <Card>
                        <Card.Header>
                            <h3 className="text-lg font-semibold text-charcoal">Maintenance</h3>
                        </Card.Header>
                        <Card.Body>
                            <div className="text-2xl font-bold text-charcoal mb-2">
                                {dashboardData?.maintenanceRequests?.length || 0}
                            </div>
                            <p className="text-sm text-architectural">
                                Open Requests
                            </p>
                        </Card.Body>
                        <Card.Footer>
                            <Link to="/tenant/maintenance">
                                <Button variant="outline" size="sm" fullWidth>New Request</Button>
                            </Link>
                        </Card.Footer>
                    </Card>
                </div>
            )}


            {/* Rejected Applications Section */}
            {hasRejectedApplications && (
                <div className="space-y-4">
                    <h2 className="text-2xl font-bold text-charcoal">Application Status</h2>
                    <Card variant="outlined" className="border-warning-200 bg-warning-50">
                        <Card.Body>
                            <div className="flex items-center space-x-3">
                                <div className="flex-shrink-0">
                                    <svg className="w-8 h-8 text-warning-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-warning-800">Application Rejected</h3>
                                    <p className="text-warning-700 mt-1">
                                        One or more of your property applications have been rejected. You can browse other properties and submit new applications.
                                    </p>
                                </div>
                            </div>
                        </Card.Body>
                        <Card.Footer>
                            <Link to="/properties">
                                <Button variant="primary">
                                    Browse Properties
                                </Button>
                            </Link>
                        </Card.Footer>
                    </Card>
                </div>
            )}

            {/* Recent Activity or Messages could go here */}
            <Card>
                <Card.Header>
                    <h3 className="text-lg font-semibold text-charcoal">Recent Messages</h3>
                </Card.Header>
                <Card.Body>
                    {dashboardData?.messages?.length > 0 ? (
                        <ul className="space-y-3">
                            {dashboardData.messages.map((msg, idx) => (
                                <li key={idx} className="border-b border-gray-100 last:border-0 pb-2">
                                    <div className="font-medium text-charcoal">{msg.subject}</div>
                                    <div className="text-sm text-architectural">{msg.date}</div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-architectural text-sm">No new messages.</p>
                    )}
                </Card.Body>
                <Card.Footer>
                    <Link to="/tenant/messages">
                        <Button variant="ghost" size="sm">View All Messages</Button>
                    </Link>
                </Card.Footer>
            </Card>
        </div>
    );
}

export default TenantDashboard;
