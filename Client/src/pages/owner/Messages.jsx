import { useState, useEffect } from 'react';
import { ownerAPI } from '../../services/api';
import Card from '../../components/ui/Card';
import Skeleton from '../../components/ui/Skeleton';
import ErrorDisplay from '../../components/ui/ErrorDisplay';
import EmptyState from '../../components/ui/EmptyState';

function Messages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadMessages();
  }, []);

  const loadMessages = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await ownerAPI.getMessages();
      setMessages(data);
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
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-charcoal mb-2">Messages</h1>
          <p className="text-architectural">Communicate with tenants and applicants</p>
        </div>

        {error && <ErrorDisplay message={error} onRetry={loadMessages} className="mb-6" />}

        {messages.length === 0 ? (
          <EmptyState
            title="No messages yet"
            description="You don't have any messages at the moment."
            icon={
              <svg className="w-16 h-16 text-architectural" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            }
          />
        ) : (
          <Card variant="elevated" padding="lg">
            <div className="space-y-4">
              {messages.map((message) => (
                <Card
                  key={message.id}
                  variant={!message.read ? "outlined" : "filled"}
                  padding="md"
                  className={!message.read ? 'border-obsidian-300 bg-obsidian-50' : ''}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-semibold text-charcoal">{message.sender?.name || 'Unknown'}</h3>
                      <p className="text-sm text-architectural">{message.property?.title}</p>
                    </div>
                    <span className="text-xs text-architectural">
                      {new Date(message.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-charcoal">{message.message}</p>
                </Card>
              ))}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}

export default Messages;

