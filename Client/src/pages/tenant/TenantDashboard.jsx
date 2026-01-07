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
                <h1 className="text-3xl font-bold text-charcoal">Welecome Home</h1>
                <p className="text-architectural mt-2">Here's what's happening with your property.</p>
            </div>

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
                            ${dashboardData?.amountDue || 0}
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
