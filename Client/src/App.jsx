import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

// Public pages
import Landing from './pages/Landing';
import BrowseProperties from './pages/BrowseProperties';
import PropertyDetails from './pages/PropertyDetails';
import Login from './pages/Login';
import Register from './pages/Register';
import InvitationAccept from './pages/InvitationAccept';
import ForTenants from './pages/ForTenants';
import ForOwners from './pages/ForOwners';
import Features from './pages/Features';
import HowItWorks from './pages/HowItWorks';
import About from './pages/About';
import SearchResults from './pages/SearchResults';
import Notifications from './pages/Notifications';
import HelpCenter from './pages/HelpCenter';

// Super Admin pages
import AdminDashboard from './pages/admin/AdminDashboard';
import PropertyActivity from './pages/admin/PropertyActivity';

// Property Manager pages
import PropertyManagerDashboard from './pages/property-manager/PropertyManagerDashboard';
import ManageProperties from './pages/property-manager/ManageProperties';
import ManageVendors from './pages/property-manager/ManageVendors';
import TaskManagement from './pages/property-manager/TaskManagement';
import Reports from './pages/property-manager/Reports';
import ManagerSubscriptions from './pages/property-manager/MySubscriptions';
import Onboarding from './pages/property-manager/Onboarding';
import Revenue from './pages/property-manager/Revenue';

// Vendor pages
import VendorDashboard from './pages/vendor/VendorDashboard';
import MyTasks from './pages/vendor/MyTasks';
import MyProfile from './pages/vendor/MyProfile';
import PropertyAccess from './pages/vendor/PropertyAccess';

// Tenant pages
import TenantDashboard from './pages/tenant/TenantDashboard';
import SavedProperties from './pages/tenant/SavedProperties';
import TenantApplications from './pages/tenant/TenantApplications';
import TenantPayments from './pages/tenant/TenantPayments';
import TenantMessages from './pages/tenant/TenantMessages';
import TenantMaintenance from './pages/tenant/TenantMaintenance';
import TenantLease from './pages/tenant/TenantLease';
import TenantDocuments from './pages/tenant/TenantDocuments';
import TenantProfile from './pages/tenant/TenantProfile';

// Property Owner pages
import OwnerDashboard from './pages/owner/OwnerDashboard';
import MyProperties from './pages/owner/MyProperties';
import PostProperty from './pages/owner/PostProperty';
import EditProperty from './pages/owner/EditProperty';
import Applications from './pages/owner/Applications';
import ManagerMarketplace from './pages/owner/ManagerMarketplace';
import MySubscriptions from './pages/owner/MySubscriptions';
import SubscriptionDetails from './pages/owner/SubscriptionDetails';
import SubscriptionPayment from './pages/owner/SubscriptionPayment';
import ServiceAgreement from './pages/owner/ServiceAgreement';
import Tenants from './pages/owner/Tenants';
import Messages from './pages/owner/Messages';
import Payments from './pages/owner/Payments';
import OwnerReports from './pages/owner/Reports';
import Analytics from './pages/owner/Analytics';
import Maintenance from './pages/owner/Maintenance';
import Settings from './pages/owner/Settings';

function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-[var(--ui-bg-page)] text-[var(--ui-text-primary)] flex flex-col">
        <Navbar />
        <main className="flex-grow">
            <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Landing />} />
            <Route path="/properties" element={<BrowseProperties />} />
            <Route path="/properties/:id" element={<PropertyDetails />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/invitation/accept/:token" element={<InvitationAccept />} />
            <Route path="/for-tenants" element={<ForTenants />} />
            <Route path="/for-owners" element={<ForOwners />} />
            <Route path="/features" element={<Features />} />
            <Route path="/how-it-works" element={<HowItWorks />} />
            <Route path="/about" element={<About />} />
            <Route path="/search" element={<SearchResults />} />
            <Route path="/help" element={<HelpCenter />} />

            {/* Super Admin Routes */}
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute requireSuperAdmin>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/property-activity"
              element={
                <ProtectedRoute requireSuperAdmin>
                  <PropertyActivity />
                </ProtectedRoute>
              }
            />

            {/* Property Manager Routes */}
            <Route
              path="/property-manager/dashboard"
              element={
                <ProtectedRoute requirePropertyManager>
                  <PropertyManagerDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/property-manager/properties"
              element={
                <ProtectedRoute requirePropertyManager>
                  <ManageProperties />
                </ProtectedRoute>
              }
            />
            <Route
              path="/property-manager/vendors"
              element={
                <ProtectedRoute requirePropertyManager>
                  <ManageVendors />
                </ProtectedRoute>
              }
            />
            <Route
              path="/property-manager/tasks"
              element={
                <ProtectedRoute requirePropertyManager>
                  <TaskManagement />
                </ProtectedRoute>
              }
            />
            <Route
              path="/property-manager/reports"
              element={
                <ProtectedRoute requirePropertyManager>
                  <Reports />
                </ProtectedRoute>
              }
            />
            <Route
              path="/property-manager/subscriptions"
              element={
                <ProtectedRoute requirePropertyManager>
                  <ManagerSubscriptions />
                </ProtectedRoute>
              }
            />
            <Route
              path="/property-manager/subscriptions/:id"
              element={
                <ProtectedRoute requirePropertyManager>
                  <Onboarding />
                </ProtectedRoute>
              }
            />
            <Route
              path="/property-manager/onboarding/:id"
              element={
                <ProtectedRoute requirePropertyManager>
                  <Onboarding />
                </ProtectedRoute>
              }
            />
            <Route
              path="/property-manager/revenue"
              element={
                <ProtectedRoute requirePropertyManager>
                  <Revenue />
                </ProtectedRoute>
              }
            />

            {/* Vendor Routes */}
            <Route
              path="/vendor/dashboard"
              element={
                <ProtectedRoute requireVendor>
                  <VendorDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/vendor/tasks"
              element={
                <ProtectedRoute requireVendor>
                  <MyTasks />
                </ProtectedRoute>
              }
            />
            <Route
              path="/vendor/properties"
              element={
                <ProtectedRoute requireVendor>
                  <PropertyAccess />
                </ProtectedRoute>
              }
            />
            <Route
              path="/vendor/profile"
              element={
                <ProtectedRoute requireVendor>
                  <MyProfile />
                </ProtectedRoute>
              }
            />

            {/* Tenant Routes */}
            <Route
              path="/tenant/dashboard"
              element={
                <ProtectedRoute>
                  <TenantDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/tenant/payments"
              element={
                <ProtectedRoute>
                  <TenantPayments />
                </ProtectedRoute>
              }
            />
            <Route
              path="/tenant/messages"
              element={
                <ProtectedRoute>
                  <TenantMessages />
                </ProtectedRoute>
              }
            />
            <Route
              path="/tenant/maintenance"
              element={
                <ProtectedRoute>
                  <TenantMaintenance />
                </ProtectedRoute>
              }
            />
            <Route
              path="/tenant/lease"
              element={
                <ProtectedRoute>
                  <TenantLease />
                </ProtectedRoute>
              }
            />
            <Route
              path="/tenant/documents"
              element={
                <ProtectedRoute>
                  <TenantDocuments />
                </ProtectedRoute>
              }
            />
            <Route
              path="/tenant/profile"
              element={
                <ProtectedRoute>
                  <TenantProfile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/tenant/saved"
              element={
                <ProtectedRoute>
                  <SavedProperties />
                </ProtectedRoute>
              }
            />
            <Route
              path="/tenant/applications"
              element={
                <ProtectedRoute>
                  <TenantApplications />
                </ProtectedRoute>
              }
            />

            {/* Notifications (All authenticated users) */}
            <Route
              path="/notifications"
              element={
                <ProtectedRoute>
                  <Notifications />
                </ProtectedRoute>
              }
            />

            {/* Property Owner Routes */}
            <Route
              path="/owner/dashboard"
              element={
                <ProtectedRoute requirePropertyOwner>
                  <OwnerDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/owner/properties"
              element={
                <ProtectedRoute requirePropertyOwner>
                  <MyProperties />
                </ProtectedRoute>
              }
            />
            <Route
              path="/owner/properties/new"
              element={
                <ProtectedRoute requirePropertyOwner>
                  <PostProperty />
                </ProtectedRoute>
              }
            />
            <Route
              path="/owner/properties/:id/edit"
              element={
                <ProtectedRoute requirePropertyOwner>
                  <EditProperty />
                </ProtectedRoute>
              }
            />
            <Route
              path="/owner/applications"
              element={
                <ProtectedRoute requirePropertyOwner>
                  <Applications />
                </ProtectedRoute>
              }
            />
            <Route
              path="/owner/tenants"
              element={
                <ProtectedRoute requirePropertyOwner>
                  <Tenants />
                </ProtectedRoute>
              }
            />
            <Route
              path="/owner/messages"
              element={
                <ProtectedRoute requirePropertyOwner>
                  <Messages />
                </ProtectedRoute>
              }
            />
            <Route
              path="/owner/payments"
              element={
                <ProtectedRoute requirePropertyOwner>
                  <Payments />
                </ProtectedRoute>
              }
            />
            <Route
              path="/owner/managers"
              element={
                <ProtectedRoute requirePropertyOwner>
                  <ManagerMarketplace />
                </ProtectedRoute>
              }
            />
            <Route
              path="/owner/subscriptions"
              element={
                <ProtectedRoute requirePropertyOwner>
                  <MySubscriptions />
                </ProtectedRoute>
              }
            />
            <Route
              path="/owner/subscriptions/:id"
              element={
                <ProtectedRoute requirePropertyOwner>
                  <SubscriptionDetails />
                </ProtectedRoute>
              }
            />
            <Route
              path="/owner/subscriptions/:id/payment"
              element={
                <ProtectedRoute requirePropertyOwner>
                  <SubscriptionPayment />
                </ProtectedRoute>
              }
            />
            <Route
              path="/owner/subscriptions/:id/agreement"
              element={
                <ProtectedRoute requirePropertyOwner>
                  <ServiceAgreement />
                </ProtectedRoute>
              }
            />
            <Route
              path="/owner/reports"
              element={
                <ProtectedRoute requirePropertyOwner>
                  <OwnerReports />
                </ProtectedRoute>
              }
            />
            <Route
              path="/owner/analytics"
              element={
                <ProtectedRoute requirePropertyOwner>
                  <Analytics />
                </ProtectedRoute>
              }
            />
            <Route
              path="/owner/maintenance"
              element={
                <ProtectedRoute requirePropertyOwner>
                  <Maintenance />
                </ProtectedRoute>
              }
            />
            <Route
              path="/owner/settings"
              element={
                <ProtectedRoute requirePropertyOwner>
                  <Settings />
                </ProtectedRoute>
              }
            />
            </Routes>
          </main>
          <Footer />
        </div>
    </AuthProvider>
  );
}

export default App;
