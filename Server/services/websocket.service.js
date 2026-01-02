// ===========================================
// WEBSOCKET SERVICE FOR REAL-TIME FEATURES
// Property Management System
// ===========================================

const WebSocket = require('ws');
const jwt = require('jsonwebtoken');
const { createAuditLog } = require('../middleware/auth');

class WebSocketService {
    constructor(server) {
        this.wss = new WebSocket.Server({
            server,
            perMessageDeflate: false,
            maxPayload: 1024 * 1024 // 1MB
        });

        this.clients = new Map(); // sessionId -> {ws, userId, heartbeat}
        this.userConnections = new Map(); // userId -> Set of sessionIds
        this.channelSubscriptions = new Map(); // channel -> Set of sessionIds

        this.messageQueue = []; // For offline message queuing
        this.notificationQueue = []; // For bulk notifications

        this.initialize();
    }

    initialize() {
        this.wss.on('connection', (ws, request) => {
            console.log('🔌 New WebSocket connection attempt');

            // Extract token from query parameters
            const url = new URL(request.url, 'http://localhost');
            const token = url.searchParams.get('token');

            if (!token) {
                ws.close(4001, 'Authentication required');
                return;
            }

            try {
                const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');
                const sessionId = this.generateSessionId();

                // Store client connection
                this.clients.set(sessionId, {
                    ws,
                    userId: decoded.userId,
                    heartbeat: Date.now(),
                    connectedAt: new Date(),
                    subscriptions: new Set()
                });

                // Track user connections
                if (!this.userConnections.has(decoded.userId)) {
                    this.userConnections.set(decoded.userId, new Set());
                }
                this.userConnections.get(decoded.userId).add(sessionId);

                // Update user session in database
                this.updateUserSession(decoded.userId, sessionId, 'connected', request);

                // Send welcome message
                ws.send(JSON.stringify({
                    type: 'connection_established',
                    sessionId,
                    userId: decoded.userId,
                    timestamp: new Date().toISOString()
                }));

                // Setup message handlers
                ws.on('message', (data) => this.handleMessage(sessionId, data));
                ws.on('close', () => this.handleDisconnect(sessionId));
                ws.on('error', (error) => this.handleError(sessionId, error));
                ws.on('pong', () => this.updateHeartbeat(sessionId));

                // Start heartbeat check
                this.startHeartbeat(sessionId);

                console.log(`✅ User ${decoded.userId} connected with session ${sessionId}`);

            } catch (error) {
                console.error('❌ WebSocket authentication failed:', error.message);
                ws.close(4002, 'Invalid token');
            }
        });

        // Heartbeat checker
        setInterval(() => {
            this.checkHeartbeats();
        }, 30000); // 30 seconds

        // Message queue processor
        setInterval(() => {
            this.processMessageQueue();
        }, 5000); // 5 seconds
    }

    generateSessionId() {
        return `ws_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    async updateUserSession(userId, sessionId, status, request) {
        const sql = require('../config/db');
        const ip = request.headers['x-forwarded-for'] ||
                  request.connection.remoteAddress ||
                  request.socket.remoteAddress;

        try {
            if (status === 'connected') {
                await sql.query(`
                    INSERT INTO user_sessions (id, user_id, socket_id, ip_address, user_agent, connection_status)
                    VALUES (?, ?, ?, ?, ?, 'connected')
                    ON DUPLICATE KEY UPDATE
                    connection_status = 'connected',
                    last_ping = NOW()
                `, [sessionId, userId, sessionId, ip, request.headers['user-agent']]);
            } else {
                await sql.query(`
                    UPDATE user_sessions
                    SET connection_status = ?, disconnected_at = NOW()
                    WHERE id = ?
                `, [status, sessionId]);
            }
        } catch (error) {
            console.error('Error updating user session:', error);
        }
    }

    handleMessage(sessionId, data) {
        try {
            const message = JSON.parse(data.toString());
            const client = this.clients.get(sessionId);

            if (!client) return;

            switch (message.type) {
                case 'heartbeat':
                    this.updateHeartbeat(sessionId);
                    client.ws.send(JSON.stringify({ type: 'heartbeat_ack' }));
                    break;

                case 'subscribe':
                    this.handleSubscription(sessionId, message);
                    break;

                case 'unsubscribe':
                    this.handleUnsubscription(sessionId, message);
                    break;

                case 'message':
                    this.handleUserMessage(sessionId, message);
                    break;

                case 'typing':
                    this.handleTypingIndicator(sessionId, message);
                    break;

                case 'read_receipt':
                    this.handleReadReceipt(sessionId, message);
                    break;

                default:
                    console.log(`Unknown message type: ${message.type}`);
            }
        } catch (error) {
            console.error('Error handling message:', error);
        }
    }

    handleSubscription(sessionId, message) {
        const client = this.clients.get(sessionId);
        if (!client) return;

        if (message.channels) {
            message.channels.forEach(channel => {
                client.subscriptions.add(channel);

                // Track channel subscriptions
                if (!this.channelSubscriptions.has(channel)) {
                    this.channelSubscriptions.set(channel, new Set());
                }
                this.channelSubscriptions.get(channel).add(sessionId);
            });
        }

        client.ws.send(JSON.stringify({
            type: 'subscription_success',
            channels: Array.from(client.subscriptions)
        }));

        console.log(`📡 User ${client.userId} subscribed to channels: ${Array.from(client.subscriptions).join(', ')}`);
    }

    handleUnsubscription(sessionId, message) {
        const client = this.clients.get(sessionId);
        if (!client || !client.subscriptions) return;

        if (message.channels) {
            message.channels.forEach(channel => {
                client.subscriptions.delete(channel);

                // Remove from channel subscriptions
                const channelSubs = this.channelSubscriptions.get(channel);
                if (channelSubs) {
                    channelSubs.delete(sessionId);
                    if (channelSubs.size === 0) {
                        this.channelSubscriptions.delete(channel);
                    }
                }
            });
        }

        client.ws.send(JSON.stringify({
            type: 'unsubscription_success',
            channels: Array.from(client.subscriptions)
        }));
    }

    async handleUserMessage(sessionId, message) {
        const client = this.clients.get(sessionId);
        if (!client) return;

        const sql = require('../config/db');

        try {
            const [result] = await sql.query(`
                INSERT INTO messages (sender_id, recipient_id, conversation_id, conversation_type,
                                    message_text, message_type, created_at)
                VALUES (?, ?, ?, ?, ?, ?, NOW())
            `, [
                client.userId,
                message.recipientId,
                message.conversationId || null,
                message.conversationType || 'direct',
                message.text,
                message.messageType || 'text'
            ]);

            const newMessage = {
                id: result.insertId,
                senderId: client.userId,
                recipientId: message.recipientId,
                conversationId: message.conversationId,
                conversationType: message.conversationType,
                text: message.text,
                messageType: message.messageType,
                timestamp: new Date().toISOString(),
                status: 'sent'
            };

            // Broadcast to recipient's connections
            this.broadcastToUser(message.recipientId, {
                type: 'new_message',
                message: newMessage
            });

            // Send confirmation to sender
            client.ws.send(JSON.stringify({
                type: 'message_sent',
                message: newMessage
            }));

            // Audit log
            createAuditLog(client.userId, 'message_sent', 'message', result.insertId, {
                recipientId: message.recipientId,
                conversationType: message.conversationType
            });

        } catch (error) {
            console.error('Error saving message:', error);
            client.ws.send(JSON.stringify({
                type: 'error',
                message: 'Failed to send message'
            }));
        }
    }

    handleTypingIndicator(sessionId, message) {
        const client = this.clients.get(sessionId);
        if (!client) return;

        // Broadcast typing indicator to conversation participants
        if (message.conversationId) {
            this.broadcastToConversation(message.conversationId, {
                type: 'typing_indicator',
                userId: client.userId,
                conversationId: message.conversationId,
                isTyping: message.isTyping
            }, sessionId); // Exclude sender
        } else if (message.recipientId) {
            // Direct message typing
            this.broadcastToUser(message.recipientId, {
                type: 'typing_indicator',
                userId: client.userId,
                isTyping: message.isTyping
            });
        }
    }

    handleReadReceipt(sessionId, message) {
        const client = this.clients.get(sessionId);
        if (!client) return;

        // Update message read status
        const sql = require('../config/db');

        sql.query(`
            UPDATE messages
            SET is_read = TRUE, read_at = NOW(), updated_at = NOW()
            WHERE id = ? AND recipient_id = ?
        `, [message.messageId, client.userId])
        .then(() => {
            // Notify sender that message was read
            sql.query('SELECT sender_id FROM messages WHERE id = ?', [message.messageId])
            .then(([rows]) => {
                if (rows.length > 0) {
                    this.broadcastToUser(rows[0].sender_id, {
                        type: 'message_read',
                        messageId: message.messageId,
                        readBy: client.userId,
                        readAt: new Date().toISOString()
                    });
                }
            })
            .catch(err => console.error('Error updating read receipt:', err));
        })
        .catch(err => console.error('Error updating read receipt:', err));
    }

    broadcastToUser(userId, message, excludeSessionId = null) {
        const userSessions = this.userConnections.get(userId);
        if (!userSessions) {
            // User is offline, queue message
            this.queueMessage(userId, message);
            return;
        }

        let sent = false;
        userSessions.forEach(sessionId => {
            if (sessionId !== excludeSessionId) {
                const client = this.clients.get(sessionId);
                if (client && client.ws.readyState === WebSocket.OPEN) {
                    client.ws.send(JSON.stringify(message));
                    sent = true;
                }
            }
        });

        if (!sent) {
            // All connections are closed, queue message
            this.queueMessage(userId, message);
        }
    }

    broadcastToConversation(conversationId, message, excludeSessionId = null) {
        // Get all participants in the conversation
        const sql = require('../config/db');

        sql.query(`
            SELECT DISTINCT sender_id, recipient_id
            FROM messages
            WHERE conversation_id = ?
        `, [conversationId])
        .then(([rows]) => {
            const participantIds = new Set();

            rows.forEach(row => {
                participantIds.add(row.sender_id);
                if (row.recipient_id) participantIds.add(row.recipient_id);
            });

            participantIds.forEach(userId => {
                this.broadcastToUser(userId, message, excludeSessionId);
            });
        })
        .catch(err => console.error('Error broadcasting to conversation:', err));
    }

    broadcastToChannel(channel, message, excludeSessionId = null) {
        const channelSubs = this.channelSubscriptions.get(channel);
        if (!channelSubs) return;

        channelSubs.forEach(sessionId => {
            if (sessionId !== excludeSessionId) {
                const client = this.clients.get(sessionId);
                if (client && client.ws.readyState === WebSocket.OPEN) {
                    client.ws.send(JSON.stringify(message));
                }
            }
        });
    }

    queueMessage(userId, message) {
        this.messageQueue.push({
            userId,
            message,
            timestamp: Date.now(),
            attempts: 0
        });
    }

    processMessageQueue() {
        const now = Date.now();
        const maxAge = 24 * 60 * 60 * 1000; // 24 hours

        this.messageQueue = this.messageQueue.filter(item => {
            if (now - item.timestamp > maxAge) {
                console.log(`🗑️  Dropping old queued message for user ${item.userId}`);
                return false;
            }

            const userSessions = this.userConnections.get(item.userId);
            if (userSessions && userSessions.size > 0) {
                // User is now online, try to send
                item.attempts++;

                let sent = false;
                userSessions.forEach(sessionId => {
                    const client = this.clients.get(sessionId);
                    if (client && client.ws.readyState === WebSocket.OPEN) {
                        client.ws.send(JSON.stringify(item.message));
                        sent = true;
                    }
                });

                if (sent) {
                    console.log(`📤 Delivered queued message to user ${item.userId}`);
                    return false; // Remove from queue
                }
            }

            return true; // Keep in queue
        });
    }

    updateHeartbeat(sessionId) {
        const client = this.clients.get(sessionId);
        if (client) {
            client.heartbeat = Date.now();
        }
    }

    checkHeartbeats() {
        const now = Date.now();
        const timeout = 60000; // 60 seconds

        this.clients.forEach((client, sessionId) => {
            if (now - client.heartbeat > timeout) {
                console.log(`💔 Heartbeat timeout for session ${sessionId}`);
                client.ws.close(4003, 'Heartbeat timeout');
            }
        });
    }

    startHeartbeat(sessionId) {
        const client = this.clients.get(sessionId);
        if (!client) return;

        client.heartbeatInterval = setInterval(() => {
            if (client.ws.readyState === WebSocket.OPEN) {
                client.ws.ping();
            } else {
                clearInterval(client.heartbeatInterval);
            }
        }, 25000); // 25 seconds
    }

    handleDisconnect(sessionId) {
        const client = this.clients.get(sessionId);
        if (!client) return;

        console.log(`🔌 User ${client.userId} disconnected (session: ${sessionId})`);

        // Update database
        this.updateUserSession(client.userId, sessionId, 'disconnected');

        // Clean up subscriptions
        if (client.subscriptions) {
            client.subscriptions.forEach(channel => {
                const channelSubs = this.channelSubscriptions.get(channel);
                if (channelSubs) {
                    channelSubs.delete(sessionId);
                    if (channelSubs.size === 0) {
                        this.channelSubscriptions.delete(channel);
                    }
                }
            });
        }

        // Clear heartbeat interval
        if (client.heartbeatInterval) {
            clearInterval(client.heartbeatInterval);
        }

        // Remove from user connections
        const userSessions = this.userConnections.get(client.userId);
        if (userSessions) {
            userSessions.delete(sessionId);
            if (userSessions.size === 0) {
                this.userConnections.delete(client.userId);
            }
        }

        // Remove client
        this.clients.delete(sessionId);
    }

    handleError(sessionId, error) {
        console.error(`WebSocket error for session ${sessionId}:`, error);
        this.handleDisconnect(sessionId);
    }

    // Public API methods
    notifyUser(userId, notification) {
        const notificationMessage = {
            type: 'notification',
            ...notification,
            timestamp: new Date().toISOString()
        };

        this.broadcastToUser(userId, notificationMessage);
    }

    notifyChannel(channel, message, excludeUserId = null) {
        this.broadcastToChannel(channel, {
            type: 'channel_notification',
            ...message,
            timestamp: new Date().toISOString()
        });
    }

    // Real-time property updates
    notifyPropertyUpdate(propertyId, updateType, data) {
        const channel = `property_${propertyId}`;
        this.broadcastToChannel(channel, {
            type: 'property_update',
            propertyId,
            updateType,
            data,
            timestamp: new Date().toISOString()
        });
    }

    // Task updates
    notifyTaskUpdate(taskId, updateType, data) {
        const channel = `task_${taskId}`;
        this.broadcastToChannel(channel, {
            type: 'task_update',
            taskId,
            updateType,
            data,
            timestamp: new Date().toISOString()
        });
    }

    // Get online users
    getOnlineUsers() {
        return Array.from(this.userConnections.keys());
    }

    // Get user sessions
    getUserSessions(userId) {
        const sessions = this.userConnections.get(userId);
        return sessions ? Array.from(sessions) : [];
    }

    // Get connection stats
    getConnectionStats() {
        return {
            totalConnections: this.clients.size,
            onlineUsers: this.userConnections.size,
            activeChannels: this.channelSubscriptions.size,
            queuedMessages: this.messageQueue.length
        };
    }
}

module.exports = WebSocketService;
