import { useState, useEffect, useRef } from 'react';
import { tenantAPI } from '../../services/api';

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

        {error && (
          <div className="mb-6 p-4 bg-error/20 border border-error text-error rounded-lg">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Messages List */}
          <div className="lg:col-span-1">
            <div className="bg-stone-100 rounded-xl shadow-md border border-stone-200">
              <div className="p-4 border-b border-stone-200 flex justify-between items-center">
                <h2 className="text-lg font-bold text-charcoal">Conversations</h2>
                <button
                  onClick={() => {
                    setSelectedThread(null);
                    setNewMessage({ propertyId: '', recipientId: '', subject: '', message: '' });
                  }}
                  className="px-3 py-1 bg-obsidian text-porcelain rounded-lg hover:bg-obsidian-light text-sm"
                >
                  New Message
                </button>
              </div>
              {loading && !selectedThread ? (
                <div className="p-8 text-center text-architectural">Loading messages...</div>
              ) : threads.length === 0 ? (
                <div className="p-8 text-center text-architectural">No messages</div>
              ) : (
                <div className="divide-y divide-stone-200 max-h-[600px] overflow-y-auto">
                  {threads.map((thread) => (
                    <div
                      key={thread.id}
                      onClick={() => setSelectedThread(thread)}
                      className={`p-4 hover:bg-stone-50 cursor-pointer transition-colors ${
                        selectedThread?.id === thread.id ? 'bg-stone-200' : ''
                      }`}
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
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Message Thread or New Message Form */}
          <div className="lg:col-span-2">
            {!selectedThread && (
              <div className="bg-stone-100 rounded-xl shadow-md p-6 border border-stone-200">
                <h2 className="text-2xl font-bold text-charcoal mb-4">New Message</h2>
                <form onSubmit={handleSendMessage} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-charcoal mb-1">Property ID</label>
                    <input
                      type="number"
                      value={newMessage.propertyId}
                      onChange={(e) => setNewMessage({ ...newMessage, propertyId: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg bg-porcelain focus:ring-2 focus:ring-obsidian focus:border-obsidian"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-charcoal mb-1">Recipient ID</label>
                    <input
                      type="number"
                      value={newMessage.recipientId}
                      onChange={(e) => setNewMessage({ ...newMessage, recipientId: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg bg-porcelain focus:ring-2 focus:ring-obsidian focus:border-obsidian"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-charcoal mb-1">Subject</label>
                    <input
                      type="text"
                      value={newMessage.subject}
                      onChange={(e) => setNewMessage({ ...newMessage, subject: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg bg-porcelain focus:ring-2 focus:ring-obsidian focus:border-obsidian"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-charcoal mb-1">Message</label>
                    <textarea
                      value={newMessage.message}
                      onChange={(e) => setNewMessage({ ...newMessage, message: e.target.value })}
                      rows={6}
                      className="w-full px-3 py-2 border rounded-lg bg-porcelain focus:ring-2 focus:ring-obsidian focus:border-obsidian"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={sending}
                    className="px-6 py-2 bg-obsidian text-porcelain rounded-lg hover:bg-obsidian-light transition-colors disabled:opacity-50"
                  >
                    {sending ? 'Sending...' : 'Send Message'}
                  </button>
                </form>
              </div>
            )}

            {selectedThread && (
              <div className="bg-stone-100 rounded-xl shadow-md border border-stone-200 flex flex-col h-[600px]">
                <div className="p-4 border-b border-stone-200 flex justify-between items-center">
                  <div>
                    <h2 className="text-lg font-bold text-charcoal">{selectedThread.property?.title || 'Property'}</h2>
                    <p className="text-sm text-architectural">{selectedThread.subject}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="text-xs text-architectural">
                      <input
                        type="checkbox"
                        checked={autoRefresh}
                        onChange={(e) => setAutoRefresh(e.target.checked)}
                        className="mr-1"
                      />
                      Auto-refresh
                    </label>
                    <button
                      onClick={() => loadThreadMessages(selectedThread.id)}
                      className="px-3 py-1 bg-stone-200 rounded-lg hover:bg-stone-300 text-sm"
                    >
                      Refresh
                    </button>
                  </div>
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {threadMessages.map((msg) => {
                    const isOwn = msg.senderId === JSON.parse(localStorage.getItem('user'))?.id;
                    return (
                      <div
                        key={msg.id}
                        className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`max-w-[70%] p-3 rounded-lg ${
                          isOwn ? 'bg-obsidian text-porcelain' : 'bg-porcelain border border-stone-200'
                        }`}>
                          <p className="text-xs mb-1 opacity-75">{msg.sender?.name || 'Unknown'}</p>
                          <p className={isOwn ? 'text-porcelain' : 'text-charcoal'}>{msg.message}</p>
                          <p className={`text-xs mt-1 ${isOwn ? 'text-porcelain/75' : 'text-architectural'}`}>
                            {new Date(msg.createdAt).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>
                <form onSubmit={handleSendThreadMessage} className="p-4 border-t border-stone-200">
                  <div className="flex gap-2">
                    <textarea
                      value={newMessage.message}
                      onChange={(e) => setNewMessage({ ...newMessage, message: e.target.value })}
                      placeholder="Type your message..."
                      rows={2}
                      className="flex-1 px-3 py-2 border rounded-lg bg-porcelain focus:ring-2 focus:ring-obsidian focus:border-obsidian"
                    />
                    <button
                      type="submit"
                      disabled={sending || !newMessage.message.trim()}
                      className="px-6 py-2 bg-obsidian text-porcelain rounded-lg hover:bg-obsidian-light transition-colors disabled:opacity-50"
                    >
                      Send
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default TenantMessages;

