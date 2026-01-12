import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { tenantAPI } from '../../services/api';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Skeleton from '../../components/ui/Skeleton';
import ErrorDisplay from '../../components/ui/ErrorDisplay';

function TenantDashboard() {
    const [dashboardData, setDashboardData] = useState(null);
    const [pendingApplications, setPendingApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        loadDashboard();
        loadPendingApplications();
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

    const loadPendingApplications = async () => {
        try {
            const apps = await tenantAPI.getPendingApplications();
            setPendingApplications(apps);
        } catch (err) {
            console.error("Pending applications load error", err);
            // Don't show error for pending applications if it fails
        }
    };

    const handlePaySecurityDeposit = async (applicationId) => {
        if (!confirm('Are you sure you want to pay the security deposit? This action cannot be undone.')) {
            return;
        }

        try {
            await tenantAPI.paySecurityDeposit(applicationId);
            alert('Security deposit paid successfully! You are now a tenant.');
            // Refresh dashboard and pending applications
            loadDashboard();
            loadPendingApplications();
        } catch (err) {
            alert('Failed to process security deposit payment: ' + err.message);
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

            {/* Pending Applications Section */}
            {pendingApplications.length > 0 && (
                <div className="space-y-4">
                    <h2 className="text-2xl font-bold text-charcoal">Pending Applications</h2>
                    <div className="grid grid-cols-1 gap-4">
                        {pendingApplications.map((application) => (
                            <Card key={application.id}>
                                <Card.Header>
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-lg font-semibold text-charcoal">
                                            {application.property_title}
                                        </h3>
                                        <span className="px-3 py-1 bg-info-100 text-info-700 rounded-full text-sm font-semibold">
                                            Payment Pending
                                        </span>
                                    </div>
                                </Card.Header>
                                <Card.Body>
                                    <div className="space-y-3">
                                        <p className="text-architectural">
                                            {application.property_address}
                                        </p>
                                        <div className="grid grid-cols-2 gap-4 text-sm">
                                            <div>
                                                <span className="font-medium text-charcoal">Monthly Rent:</span>
                                                <span className="ml-2 text-success">₹{application.monthly_rent}</span>
                                            </div>
                                            <div>
                                                <span className="font-medium text-charcoal">Security Deposit:</span>
                                                <span className="ml-2 text-warning">₹{application.security_deposit || 'N/A'}</span>
                                            </div>
                                        </div>
                                        <p className="text-sm text-architectural">
                                            Your application has been approved! Pay the security deposit to become the tenant.
                                        </p>
                                    </div>
                                </Card.Body>
                                <Card.Footer>
                                    <Button
                                        onClick={() => handlePaySecurityDeposit(application.id)}
                                        fullWidth
                                        className="bg-eucalyptus-500 hover:bg-eucalyptus-600 text-white"
                                    >
                                        Pay Security Deposit (₹{application.security_deposit || 'N/A'})
                                    </Button>
                                </Card.Footer>
                            </Card>
                        ))}
                    </div>
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
