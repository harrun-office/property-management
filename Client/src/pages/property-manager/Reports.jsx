import { useState, useEffect } from 'react';
import { propertyManagerAPI } from '../../services/api';
import Card from '../../components/ui/Card';
import MetricCard from '../../components/ui/MetricCard';
import Skeleton from '../../components/ui/Skeleton';
import ErrorDisplay from '../../components/ui/ErrorDisplay';

function Reports() {
  const [reports, setReports] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await propertyManagerAPI.getReports();
      setReports(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-porcelain py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <Skeleton variant="title" width="30%" className="mb-2" />
            <Skeleton variant="text" width="50%" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Skeleton.MetricCard key={i} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-porcelain py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <ErrorDisplay message={error} onRetry={loadReports} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-porcelain py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-charcoal mb-2">Reports</h1>
          <p className="text-architectural">View performance and analytics reports</p>
        </div>

        {reports && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <MetricCard
              title="Total Properties"
              value={reports.totalProperties.toString()}
              variant="primary"
              icon={
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              }
            />

            <MetricCard
              title="Total Tasks"
              value={reports.totalTasks.toString()}
              variant="default"
              icon={
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              }
            />

            <MetricCard
              title="Completed Tasks"
              value={reports.completedTasks.toString()}
              subtitle={`${reports.totalTasks > 0 ? Math.round((reports.completedTasks / reports.totalTasks) * 100) : 0}% completion rate`}
              variant="success"
              icon={
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
            />

            <MetricCard
              title="Pending Tasks"
              value={reports.pendingTasks.toString()}
              variant="accent"
              icon={
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
            />

            <MetricCard
              title="In Progress Tasks"
              value={reports.inProgressTasks.toString()}
              variant="default"
              icon={
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              }
            />

            <Card variant="elevated" padding="lg">
              <Card.Title className="mb-4">Tasks by Priority</Card.Title>
              <Card.Body className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-architectural">High:</span>
                  <span className="font-semibold text-error-700">{reports.tasksByPriority?.high || 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-architectural">Medium:</span>
                  <span className="font-semibold text-warning-700">{reports.tasksByPriority?.medium || 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-architectural">Low:</span>
                  <span className="font-semibold text-charcoal">{reports.tasksByPriority?.low || 0}</span>
                </div>
              </Card.Body>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}

export default Reports;

