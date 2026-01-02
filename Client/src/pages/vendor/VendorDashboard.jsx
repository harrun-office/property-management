import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { vendorAPI } from '../../services/api';
import MetricCard from '../../components/ui/MetricCard';
import Card from '../../components/ui/Card';
import Skeleton from '../../components/ui/Skeleton';
import ErrorDisplay from '../../components/ui/ErrorDisplay';

function VendorDashboard() {
  const [properties, setProperties] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError('');
    try {
      const [propertiesData, tasksData, profileData] = await Promise.all([
        vendorAPI.getProperties(),
        vendorAPI.getTasks(),
        vendorAPI.getProfile()
      ]);
      setProperties(propertiesData);
      setTasks(tasksData);
      setProfile(profileData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto space-y-6">
        <Skeleton variant="heading" width="250px" className="mb-4" />
        <Skeleton variant="text" width="300px" className="mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Skeleton.MetricCard />
          <Skeleton.MetricCard />
          <Skeleton.MetricCard />
          <Skeleton.MetricCard />
        </div>
      </div>
    );
  }

  const completedTasks = tasks.filter(t => t.status === 'completed').length;
  const pendingTasks = tasks.filter(t => t.status === 'pending').length;
  const inProgressTasks = tasks.filter(t => t.status === 'in_progress').length;

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-bold text-[var(--ui-text-primary)] mb-1">Vendor Dashboard</h1>
        <p className="text-[var(--ui-text-secondary)] text-sm">Welcome, {profile?.companyName || 'Vendor'}</p>
      </div>

      {error && (
        <ErrorDisplay
          title="Failed to load dashboard"
          message={error}
          onRetry={loadData}
          className="mb-6"
        />
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <MetricCard
          title="Assigned Properties"
          value={properties.length}
          variant="primary"
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          }
        />
        <MetricCard
          title="Total Tasks"
          value={tasks.length}
          variant="default"
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
          }
        />
        <MetricCard
          title="Completed"
          value={completedTasks}
          variant="success"
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
        <MetricCard
          title="Pending"
          value={pendingTasks}
          variant="accent"
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
      </div>

      {/* Performance Rating */}
      {profile && (
        <Card variant="elevated" padding="lg" className="mb-8">
          <Card.Title>Performance Rating</Card.Title>
          <Card.Body>
            <div className="flex items-center space-x-4">
              <div className="text-5xl font-bold text-[var(--ui-text-primary)]">{profile.performanceRating || 0}</div>
              <div className="flex-1">
                <div className="w-full bg-[var(--ui-bg-muted)] rounded-full h-4">
                  <div
                    className="bg-emerald-500 h-4 rounded-full transition-all duration-300"
                    style={{ width: `${((profile.performanceRating || 0) / 5) * 100}%` }}
                  />
                </div>
                <p className="text-sm text-[var(--ui-text-secondary)] mt-2">Based on completed tasks and feedback</p>
              </div>
            </div>
          </Card.Body>
        </Card>
      )}

      {/* Quick Actions */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <Link to="/vendor/tasks">
          <Card variant="elevated" padding="lg" hover>
            <Card.Title className="text-lg font-semibold mb-2">My Tasks</Card.Title>
            <Card.Description>View and manage assigned tasks</Card.Description>
          </Card>
        </Link>
        <Link to="/vendor/properties">
          <Card variant="elevated" padding="lg" hover>
            <Card.Title className="text-lg font-semibold mb-2">Assigned Properties</Card.Title>
            <Card.Description>View properties you're assigned to</Card.Description>
          </Card>
        </Link>
      </div>

      {/* Recent Tasks */}
      <Card variant="elevated" padding="lg">
        <div className="flex justify-between items-center mb-6">
          <Card.Title className="text-lg font-semibold">Recent Tasks</Card.Title>
          <Link
            to="/vendor/tasks"
            className="text-[var(--brand-primary)] font-medium hover:text-[var(--brand-primary-dark)] hover:underline transition-colors text-sm"
          >
            View All
          </Link>
        </div>
        {tasks.length === 0 ? (
          <p className="text-[var(--ui-text-muted)]">No tasks assigned yet.</p>
        ) : (
          <div className="space-y-3">
            {tasks.slice(0, 5).map((task) => (
              <Card key={task.id} variant="filled" padding="md" hover className="border border-[var(--ui-border-default)]">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="font-medium text-[var(--ui-text-primary)]">{task.title}</h3>
                    <p className="text-sm text-[var(--ui-text-secondary)]">{task.description}</p>
                    {task.dueDate && (
                      <p className="text-xs text-[var(--ui-text-muted)] mt-1">Due: {new Date(task.dueDate).toLocaleDateString()}</p>
                    )}
                  </div>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${task.status === 'completed' ? 'bg-emerald-100 text-emerald-700' :
                    task.status === 'in_progress' ? 'bg-blue-100 text-blue-700' :
                      'bg-amber-100 text-amber-700'
                    }`}>
                    {task.status.replace('_', ' ')}
                  </span>
                </div>
              </Card>
            ))}
          </div>
        )}
      </Card>
    </div>

  );
}

export default VendorDashboard;


