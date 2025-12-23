import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Card from './ui/Card';
import Skeleton from './ui/Skeleton';

function ActivityFeed({ limit = 10 }) {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading activities
    // In production, this would fetch from an API
    const mockActivities = [
      {
        id: 1,
        type: 'user_registered',
        message: 'New user registered: John Doe (Property Owner)',
        timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
        link: '/admin/users'
      },
      {
        id: 2,
        type: 'property_created',
        message: 'New property listed: 123 Main St, Downtown',
        timestamp: new Date(Date.now() - 1000 * 60 * 15), // 15 minutes ago
        link: '/admin/properties'
      },
      {
        id: 3,
        type: 'application_submitted',
        message: 'New application submitted for property at 456 Oak Ave',
        timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
        link: '/admin/applications'
      },
      {
        id: 4,
        type: 'payment_received',
        message: 'Payment received: $1,200 from tenant application',
        timestamp: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
        link: '/admin/financial'
      },
      {
        id: 5,
        type: 'task_completed',
        message: 'Maintenance task completed: HVAC repair at 789 Pine St',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
        link: '/admin/properties'
      }
    ];
    
    setTimeout(() => {
      setActivities(mockActivities.slice(0, limit));
      setLoading(false);
    }, 500);
  }, [limit]);

  const getActivityIcon = (type) => {
    switch (type) {
      case 'user_registered':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
          </svg>
        );
      case 'property_created':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
        );
      case 'application_submitted':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        );
      case 'payment_received':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'task_completed':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      default:
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
    }
  };

  const getActivityColor = (type) => {
    switch (type) {
      case 'user_registered':
        return 'bg-eucalyptus/20 text-eucalyptus';
      case 'property_created':
        return 'bg-brass/20 text-brass';
      case 'application_submitted':
        return 'bg-obsidian/20 text-obsidian';
      case 'payment_received':
        return 'bg-eucalyptus/20 text-eucalyptus';
      case 'task_completed':
        return 'bg-eucalyptus/20 text-eucalyptus';
      default:
        return 'bg-architectural/20 text-architectural';
    }
  };

  const formatTimeAgo = (timestamp) => {
    const seconds = Math.floor((new Date() - timestamp) / 1000);
    if (seconds < 60) return `${seconds} seconds ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    const days = Math.floor(hours / 24);
    return `${days} day${days > 1 ? 's' : ''} ago`;
  };

  if (loading) {
    return (
      <Card variant="elevated" padding="lg">
        <Card.Title className="mb-4">Recent Activity</Card.Title>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton.ListItem key={i} />
          ))}
        </div>
      </Card>
    );
  }

  return (
    <Card variant="elevated" padding="lg">
      <div className="flex justify-between items-center mb-4">
        <Card.Title>Recent Activity</Card.Title>
        <Link
          to="/admin/activity"
          className="text-sm text-obsidian-500 hover:text-obsidian-600 font-medium transition-colors"
        >
          View All →
        </Link>
      </div>
      <Card.Body>
        <div className="space-y-3">
          {activities.length === 0 ? (
            <p className="text-architectural text-center py-8">No recent activity</p>
          ) : (
            activities.map((activity) => (
              <Link
                key={activity.id}
                to={activity.link}
                className="block"
              >
                <Card variant="filled" padding="sm" hover>
                  <div className="flex items-start space-x-3">
                    <div className={`p-2 rounded-lg ${getActivityColor(activity.type)} flex-shrink-0`}>
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-charcoal font-medium">{activity.message}</p>
                      <p className="text-xs text-architectural mt-1">{formatTimeAgo(activity.timestamp)}</p>
                    </div>
                  </div>
                </Card>
              </Link>
            ))
          )}
        </div>
      </Card.Body>
    </Card>
  );
}

export default ActivityFeed;

