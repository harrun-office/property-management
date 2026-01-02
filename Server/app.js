// ===========================================
// PROPERTY MANAGEMENT SYSTEM - MAIN SERVER
// Multi-User Real-Time Application
// ===========================================

const http = require('http');
const app = require('./config/server');
const WebSocketService = require('./services/websocket.service');

// Import routes
const authRoutes = require('./routes/auth.routes');
const invitationRoutes = require('./routes/invitations.routes');
const publicRoutes = require('./routes/public.routes');
const adminRoutes = require('./routes/admin.routes');
const propertyManagerRoutes = require('./routes/propertyManager.routes');
const vendorRoutes = require('./routes/vendor.routes');
const ownerRoutes = require('./routes/owner.routes');
const tenantRoutes = require('./routes/tenant.routes');

const port = process.env.PORT || 5000;
const wsPort = process.env.WEBSOCKET_PORT || 5001;

// Mount API routes
app.use('/api/auth', authRoutes);
app.use('/api/invitations', invitationRoutes);
app.use('/api', publicRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/property-manager', propertyManagerRoutes);
app.use('/api/vendor', vendorRoutes);
app.use('/api/owner', ownerRoutes);
app.use('/api/tenant', tenantRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        version: process.env.APP_VERSION || '2.0.0'
    });
});

// WebSocket info endpoint
app.get('/ws-info', (req, res) => {
    const wsService = req.app.get('wsService');
    const stats = wsService ? wsService.getConnectionStats() : null;

    res.json({
        websocket_enabled: true,
        websocket_port: wsPort,
        connections: stats,
        timestamp: new Date().toISOString()
    });
});

// Start server with WebSocket support
async function startServer() {
    try {
        console.log('🚀 Starting Property Management System...');

        // Initialize database
        const initDB = require('./config/init');
        await initDB();
        console.log('✅ Database initialized');

        // Create HTTP server
        const server = http.createServer(app);

        // Initialize WebSocket service
        console.log('🔌 Initializing WebSocket service...');
        const wsService = new WebSocketService(server);
        app.set('wsService', wsService);
        console.log('✅ WebSocket service initialized');

        // Start HTTP server
        server.listen(port, () => {
            console.log(`🌐 HTTP Server running on port ${port}`);
            console.log(`🔌 WebSocket Server ready on port ${wsPort}`);
            console.log(`📊 Real-time features enabled`);
            console.log(`💻 Health check: http://localhost:${port}/health`);
            console.log(`🔗 WebSocket info: http://localhost:${port}/ws-info`);
            console.log('');
            console.log('📧 Default admin login: admin@property.com / admin123');
            console.log('📚 API Documentation: Check routes for available endpoints');
        });

        // Graceful shutdown handling
        process.on('SIGTERM', () => {
            console.log('🛑 SIGTERM received, shutting down gracefully...');
            server.close(() => {
                console.log('✅ HTTP server closed');
                process.exit(0);
            });
        });

        process.on('SIGINT', () => {
            console.log('🛑 SIGINT received, shutting down gracefully...');
            server.close(() => {
                console.log('✅ HTTP server closed');
                process.exit(0);
            });
        });

    } catch (error) {
        console.error('❌ Failed to start server:', error);
        process.exit(1);
    }
}

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
    console.error('❌ Uncaught Exception:', error);
    process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
    process.exit(1);
});

// Start the server
startServer();
