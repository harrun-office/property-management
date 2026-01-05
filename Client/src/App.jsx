import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import RoleBasedNavbar from './components/RoleBasedNavbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import ScrollToTop from './components/ScrollToTop';

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

import ManagerLayout from './components/property-manager/layout/ManagerLayout'; // Import Layout

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

import OwnerLayout from './components/owner/layout/OwnerLayout'; // Import Owner Layout

// ... imports remain the same ...

function App() {
  const location = useLocation();
  const hideLayoutRoutes = ['/login', '/register'];
  const isManagerRoute = location.pathname.startsWith('/property-manager');
  const isOwnerRoute = location.pathname.startsWith('/owner'); // Identify owner routes

  // Hide global layout for auth pages, manager pages, AND owner pages
  const showLayout = !hideLayoutRoutes.includes(location.pathname) && !isManagerRoute && !isOwnerRoute;

  return (
    <AuthProvider>
      <div className={`bg-[var(--ui-bg-page)] text-[var(--ui-text-primary)] flex flex-col ${!showLayout ? 'h-screen overflow-hidden' : 'min-h-screen'}`}>
        <ScrollToTop />
        {showLayout && <RoleBasedNavbar />}
        <main className="flex-grow flex flex-col">
          <Routes>
            {/* ... other routes remain the same ... */}

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
              path="/property-manager"
              element={
                <ProtectedRoute requirePropertyManager>
                  <ManagerLayout />
                </ProtectedRoute>
              }
            >
              <Route path="dashboard" element={<PropertyManagerDashboard />} />
              <Route path="properties" element={<ManageProperties />} />
              <Route path="vendors" element={<ManageVendors />} />
              <Route path="tasks" element={<TaskManagement />} />
              <Route path="reports" element={<Reports />} />
              <Route path="subscriptions" element={<ManagerSubscriptions />} />
              <Route path="subscriptions/:id" element={<Onboarding />} />
              <Route path="onboarding/:id" element={<Onboarding />} />
              <Route path="revenue" element={<Revenue />} />
            </Route>

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

            {/* Notifications */}
            <Route
              path="/notifications"
              element={
                <ProtectedRoute>
                  <Notifications />
                </ProtectedRoute>
              }
            />

            {/* Property Owner Routes - Nested under Owner Layout */}
            <Route
              path="/owner"
              element={
                <ProtectedRoute requirePropertyOwner>
                  <OwnerLayout />
                </ProtectedRoute>
              }
            >
              <Route path="dashboard" element={<OwnerDashboard />} />
              <Route path="properties" element={<MyProperties />} />
              <Route path="properties/new" element={<PostProperty />} />
              <Route path="properties/:id/edit" element={<EditProperty />} />
              <Route path="applications" element={<Applications />} />
              <Route path="tenants" element={<Tenants />} />
              <Route path="messages" element={<Messages />} />
              <Route path="payments" element={<Payments />} />
              <Route path="managers" element={<ManagerMarketplace />} />
              <Route path="subscriptions" element={<MySubscriptions />} />
              <Route path="subscriptions/:id" element={<SubscriptionDetails />} />
              <Route path="subscriptions/:id/payment" element={<SubscriptionPayment />} />
              <Route path="subscriptions/:id/agreement" element={<ServiceAgreement />} />
              <Route path="reports" element={<OwnerReports />} />
              <Route path="analytics" element={<Analytics />} />
              <Route path="maintenance" element={<Maintenance />} />
              <Route path="settings" element={<Settings />} />
            </Route>

          </Routes>
        </main>
        {showLayout && <Footer />}
      </div>
    </AuthProvider>
  );
}

export default App;
