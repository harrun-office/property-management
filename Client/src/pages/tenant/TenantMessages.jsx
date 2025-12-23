import { useState, useEffect, useRef } from 'react';
import { tenantAPI } from '../../services/api';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Skeleton from '../../components/ui/Skeleton';
import ErrorDisplay from '../../components/ui/ErrorDisplay';
import EmptyState from '../../components/ui/EmptyState';

function TenantMessages() {
  const [messages, setMessages] = useState([]);
  const [selectedThread, setSelectedThread] = useState(null);
  const [threadMessages, setThreadMessages] = useState([]);
  const [newMessage, setNewMessage] = useState({ propertyId: '', recipientId: '', subject: '', message: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);
  const [autoRefresh, setAutoRefresh] = useState(true);

  useEffect(() => {
    loadMessages();
  }, []);

  useEffect(() => {
    if (selectedThread) {
      loadThreadMessages(selectedThread.id);
    }
  }, [selectedThread]);

  useEffect(() => {
    if (autoRefresh && selectedThread) {
      const interval = setInterval(() => {
        loadThreadMessages(selectedThread.id, false);
      }, 10000); // Refresh every 10 seconds

      return () => clearInterval(interval);
    }
  }, [autoRefresh, selectedThread]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [threadMessages]);

  const loadMessages = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await tenantAPI.getMessages();
      setMessages(data);
    } catch (err) {
      setError(err.message || 'Failed to load messages');
    } finally {
      setLoading(false);
    }
  };

  const loadThreadMessages = async (messageId, showLoading = true) => {
    if (showLoading) setLoading(true);
    try {
      const data = await tenantAPI.getMessageById(messageId);
      setThreadMessages(data);
      // Mark as read
      if (data.length > 0) {
        const unread = data.filter(m => !m.read && m.recipientId === JSON.parse(localStorage.getItem('user'))?.id);
        if (unread.length > 0) {
          await tenantAPI.markMessageRead(messageId);
        }
      }
    } catch (err) {
      setError(err.message || 'Failed to load messages');
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.propertyId || !newMessage.recipientId || !newMessage.message) {
      setError('Please fill in all required fields');
      return;
    }

    setSending(true);
    setError('');
    try {
      await tenantAPI.sendMessage(newMessage);
      setNewMessage({ propertyId: '', recipientId: '', subject: '', message: '' });
      await loadMessages();
      setError('');
      alert('Message sent successfully!');
    } catch (err) {
      setError(err.message || 'Failed to send message');
    } finally {
      setSending(false);
    }
  };

  const handleSendThreadMessage = async (e) => {
    e.preventDefault();
    if (!selectedThread || !newMessage.message.trim()) return;

    setSending(true);
    setError('');
    try {
      await tenantAPI.sendMessage({
        propertyId: selectedThread.propertyId,
        recipientId: selectedThread.senderId === JSON.parse(localStorage.getItem('user'))?.id 
          ? selectedThread.recipientId 
          : selectedThread.senderId,
        subject: selectedThread.subject,
        message: newMessage.message
      });
      setNewMessage({ ...newMessage, message: '' });
      await loadThreadMessages(selectedThread.id, false);
      await loadMessages();
    } catch (err) {
      setError(err.message || 'Failed to send message');
    } finally {
      setSending(false);
    }
  };

  // Group messages by property/thread
  const groupedMessages = messages.reduce((acc, msg) => {
    const key = msg.propertyId;
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(msg);
    return acc;
  }, {});

  const threads = Object.values(groupedMessages).map(thread => {
    const latest = thread.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0];
    const unreadCount = thread.filter(m => !m.read && m.recipientId === JSON.parse(localStorage.getItem('user'))?.id).length;
    return {
      ...latest,
      unreadCount,
      property: latest.property
    };
  }).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  return (
    <div className="min-h-screen bg-porcelain py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-charcoal mb-2">Messages</h1>
          <p className="text-architectural">Communicate with property owners and managers</p>
        </div>

        {error && <ErrorDisplay message={error} onRetry={loadMessages} className="mb-6" />}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Messages List */}
          <div className="lg:col-span-1">
            <Card variant="elevated" padding="none" className="overflow-hidden">
              <Card.Header className="p-4 border-b border-stone-200 flex justify-between items-center">
                <Card.Title className="text-lg">Conversations</Card.Title>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => {
                    setSelectedThread(null);
                    setNewMessage({ propertyId: '', recipientId: '', subject: '', message: '' });
                  }}
                >
                  New Message
                </Button>
              </Card.Header>
              <Card.Body className="p-0">
                {loading && !selectedThread ? (
                  <div className="p-8 text-center">
                    <Skeleton variant="text" width="60%" className="mx-auto" />
                  </div>
                ) : threads.length === 0 ? (
                  <EmptyState
                    title="No messages"
                    description="Start a conversation by sending a new message."
                    icon={
                      <svg className="w-12 h-12 text-architectural" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    }
                  />
                ) : (
                  <div className="divide-y divide-stone-200 max-h-[600px] overflow-y-auto">
                    {threads.map((thread) => (
                      <Card
                        key={thread.id}
                        variant={selectedThread?.id === thread.id ? "filled" : "ghost"}
                        padding="md"
                        hover
                        onClick={() => setSelectedThread(thread)}
                        className={`cursor-pointer ${selectedThread?.id === thread.id ? 'bg-obsidian-50' : ''}`}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex-1">
                            <p className="font-semibold text-charcoal">{thread.property?.title || 'Property'}</p>
                            <p className="text-sm text-architectural truncate">{thread.message}</p>
                          </div>
                          {thread.unreadCount > 0 && (
                            <span className="ml-2 px-2 py-1 bg-obsidian text-porcelain rounded-full text-xs font-semibold">
                              {thread.unreadCount}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-architectural">
                          {new Date(thread.createdAt).toLocaleDateString()}
                        </p>
                      </Card>
                    ))}
                  </div>
                )}
              </Card.Body>
            </Card>
          </div>

          {/* Message Thread or New Message Form */}
          <div className="lg:col-span-2">
            {!selectedThread && (
              <Card variant="elevated" padding="lg">
                <Card.Title className="mb-4">New Message</Card.Title>
                <form onSubmit={handleSendMessage} className="space-y-4">
                  <Input
                    label="Property ID"
                    type="number"
                    value={newMessage.propertyId}
                    onChange={(e) => setNewMessage({ ...newMessage, propertyId: e.target.value })}
                    required
                  />
                  <Input
                    label="Recipient ID"
                    type="number"
                    value={newMessage.recipientId}
                    onChange={(e) => setNewMessage({ ...newMessage, recipientId: e.target.value })}
                    required
                  />
                  <Input
                    label="Subject"
                    type="text"
                    value={newMessage.subject}
                    onChange={(e) => setNewMessage({ ...newMessage, subject: e.target.value })}
                  />
                  <div>
                    <label className="block text-sm font-medium text-charcoal mb-1">Message</label>
                    <textarea
                      value={newMessage.message}
                      onChange={(e) => setNewMessage({ ...newMessage, message: e.target.value })}
                      rows={6}
                      className="w-full px-4 py-2.5 border border-stone-300 rounded-lg bg-porcelain focus:ring-2 focus:ring-obsidian-500 focus:border-obsidian-500 transition-colors"
                      required
                    />
                  </div>
                  <Button
                    type="submit"
                    variant="primary"
                    fullWidth
                    loading={sending}
                  >
                    Send Message
                  </Button>
                </form>
              </Card>
            )}

            {selectedThread && (
              <Card variant="elevated" padding="none" className="flex flex-col h-[600px]">
                <Card.Header className="p-4 border-b border-stone-200 flex justify-between items-center">
                  <div>
                    <Card.Title className="text-lg">{selectedThread.property?.title || 'Property'}</Card.Title>
                    <p className="text-sm text-architectural">{selectedThread.subject}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="text-xs text-architectural flex items-center gap-1 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={autoRefresh}
                        onChange={(e) => setAutoRefresh(e.target.checked)}
                        className="w-4 h-4 text-obsidian border-stone-300 rounded focus:ring-obsidian-500"
                      />
                      Auto-refresh
                    </label>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => loadThreadMessages(selectedThread.id)}
                    >
                      Refresh
                    </Button>
                  </div>
                </Card.Header>
                <Card.Body className="flex-1 overflow-y-auto p-4 space-y-4">
                  {threadMessages.map((msg) => {
                    const isOwn = msg.senderId === JSON.parse(localStorage.getItem('user'))?.id;
                    return (
                      <div
                        key={msg.id}
                        className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                      >
                        <Card
                          variant={isOwn ? "primary" : "filled"}
                          padding="sm"
                          className={`max-w-[70%] ${isOwn ? 'bg-obsidian text-porcelain' : ''}`}
                        >
                          <p className={`text-xs mb-1 ${isOwn ? 'text-porcelain/75' : 'text-architectural'}`}>
                            {msg.sender?.name || 'Unknown'}
                          </p>
                          <p className={isOwn ? 'text-porcelain' : 'text-charcoal'}>{msg.message}</p>
                          <p className={`text-xs mt-1 ${isOwn ? 'text-porcelain/75' : 'text-architectural'}`}>
                            {new Date(msg.createdAt).toLocaleString()}
                          </p>
                        </Card>
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </Card.Body>
                <Card.Footer className="p-4 border-t border-stone-200">
                  <form onSubmit={handleSendThreadMessage} className="flex gap-2">
                    <textarea
                      value={newMessage.message}
                      onChange={(e) => setNewMessage({ ...newMessage, message: e.target.value })}
                      placeholder="Type your message..."
                      rows={2}
                      className="flex-1 px-4 py-2.5 border border-stone-300 rounded-lg bg-porcelain focus:ring-2 focus:ring-obsidian-500 focus:border-obsidian-500 transition-colors"
                    />
                    <Button
                      type="submit"
                      variant="primary"
                      disabled={sending || !newMessage.message.trim()}
                    >
                      Send
                    </Button>
                  </form>
                </Card.Footer>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default TenantMessages;

