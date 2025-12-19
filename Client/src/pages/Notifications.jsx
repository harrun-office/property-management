import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

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
      <div className="min-h-screen bg-porcelain flex items-center justify-center">
        <p className="text-charcoal text-lg">Loading notifications...</p>
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
            <button
              onClick={markAllAsRead}
              className="px-4 py-2 text-obsidian hover:text-brass transition-colors font-medium"
            >
              Mark all as read
            </button>
          )}
        </div>

        {notifications.length === 0 ? (
          <div className="bg-stone-100 p-12 rounded-xl text-center border border-stone-200">
            <svg className="w-16 h-16 mx-auto text-architectural mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <h3 className="text-xl font-semibold text-charcoal mb-2">No notifications</h3>
            <p className="text-architectural">You're all caught up!</p>
          </div>
        ) : (
          <div className="bg-stone-100 rounded-xl border border-stone-200 overflow-hidden">
            <div className="divide-y divide-stone-200">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-6 hover:bg-stone-200 transition-colors cursor-pointer ${!notification.read ? 'bg-porcelain' : ''}`}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${!notification.read ? 'bg-brass' : 'bg-transparent'}`}></div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold text-charcoal">{notification.title}</h3>
                        <span className="text-xs text-architectural">{notification.time}</span>
                      </div>
                      <p className="text-architectural text-sm">{notification.message}</p>
                      <span className={`inline-block mt-2 px-2 py-1 rounded text-xs ${
                        notification.type === 'application' ? 'bg-eucalyptus/20 text-eucalyptus' :
                        notification.type === 'payment' ? 'bg-success/20 text-success' :
                        'bg-warning/20 text-warning'
                      }`}>
                        {notification.type}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Notifications;

