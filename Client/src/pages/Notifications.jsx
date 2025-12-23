import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Skeleton from '../components/ui/Skeleton';
import EmptyState from '../components/ui/EmptyState';

function Notifications() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    setLoading(true);
    // Mock notifications - replace with actual API call
    setTimeout(() => {
      setNotifications([
        {
          id: 1,
          type: 'application',
          title: 'New application received',
          message: 'You have received a new application for your property.',
          time: '2 hours ago',
          read: false
        },
        {
          id: 2,
          type: 'payment',
          title: 'Payment received',
          message: 'Payment of $1,200 has been received.',
          time: '1 day ago',
          read: false
        },
        {
          id: 3,
          type: 'maintenance',
          title: 'Maintenance request',
          message: 'A new maintenance request has been submitted.',
          time: '2 days ago',
          read: true
        }
      ]);
      setLoading(false);
    }, 500);
  };

  const markAsRead = (id) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  if (loading) {
    return (
      <div className="min-h-screen bg-porcelain py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <Skeleton variant="title" width="30%" className="mb-2" />
            <Skeleton variant="text" width="50%" />
          </div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Skeleton.Card key={i} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-porcelain py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-charcoal mb-2">Notifications</h1>
            <p className="text-architectural">
              {unreadCount > 0 ? `${unreadCount} unread ${unreadCount === 1 ? 'notification' : 'notifications'}` : 'All caught up!'}
            </p>
          </div>
          {unreadCount > 0 && (
            <Button variant="ghost" onClick={markAllAsRead}>
              Mark all as read
            </Button>
          )}
        </div>

        {notifications.length === 0 ? (
          <EmptyState
            title="No notifications"
            description="You're all caught up!"
            icon={
              <svg className="w-16 h-16 text-architectural" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            }
          />
        ) : (
          <Card variant="elevated" padding="none" className="overflow-hidden">
            <div className="divide-y divide-stone-200">
              {notifications.map((notification) => (
                <Card
                  key={notification.id}
                  variant={!notification.read ? "filled" : "default"}
                  padding="lg"
                  hover
                  className="cursor-pointer"
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${!notification.read ? 'bg-brass-500' : 'bg-transparent'}`}></div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <Card.Title className="font-semibold">{notification.title}</Card.Title>
                        <span className="text-xs text-architectural">{notification.time}</span>
                      </div>
                      <Card.Description className="text-sm mb-2">{notification.message}</Card.Description>
                      <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                        notification.type === 'application' ? 'bg-eucalyptus-100 text-eucalyptus-700' :
                        notification.type === 'payment' ? 'bg-eucalyptus-100 text-eucalyptus-700' :
                        'bg-warning-100 text-warning-700'
                      }`}>
                        {notification.type}
                      </span>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}

export default Notifications;

