const app = require('./config/server');
const authRoutes = require('./routes/auth.routes');
const invitationRoutes = require('./routes/invitations.routes');
const publicRoutes = require('./routes/public.routes');
const adminRoutes = require('./routes/admin.routes');
const propertyManagerRoutes = require('./routes/propertyManager.routes');
const vendorRoutes = require('./routes/vendor.routes');
const ownerRoutes = require('./routes/owner.routes');
const tenantRoutes = require('./routes/tenant.routes');

const port = 3000;

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/invitations', invitationRoutes);
app.use('/api', publicRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/property-manager', propertyManagerRoutes);
app.use('/api/vendor', vendorRoutes);
app.use('/api/owner', ownerRoutes);
app.use('/api/tenant', tenantRoutes);

// Start server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
