import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import RoleBasedNavbar from './components/RoleBasedNavbar';
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

// Super Admin pages
import AdminDashboard from './pages/admin/AdminDashboard';
import ManagePropertyManagers from './pages/admin/ManagePropertyManagers';
import AuditLogs from './pages/admin/AuditLogs';
import SystemSettings from './pages/admin/SystemSettings';
import SystemAnalytics from './pages/admin/SystemAnalytics';

// Property Manager pages
import PropertyManagerDashboard from './pages/property-manager/PropertyManagerDashboard';
import ManageProperties from './pages/property-manager/ManageProperties';
import ManageVendors from './pages/property-manager/ManageVendors';
import TaskManagement from './pages/property-manager/TaskManagement';
import Reports from './pages/property-manager/Reports';

// Vendor pages
import VendorDashboard from './pages/vendor/VendorDashboard';
import MyTasks from './pages/vendor/MyTasks';
import MyProfile from './pages/vendor/MyProfile';
import PropertyAccess from './pages/vendor/PropertyAccess';

// Property Owner pages
import OwnerDashboard from './pages/owner/OwnerDashboard';
import MyProperties from './pages/owner/MyProperties';
import PostProperty from './pages/owner/PostProperty';
import EditProperty from './pages/owner/EditProperty';
import Applications from './pages/owner/Applications';
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
      <Router>
        <div className="min-h-screen bg-porcelain">
          <RoleBasedNavbar />
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
              path="/admin/property-managers"
              element={
                <ProtectedRoute requireSuperAdmin>
                  <ManagePropertyManagers />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/audit-logs"
              element={
                <ProtectedRoute requireSuperAdmin>
                  <AuditLogs />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/analytics"
              element={
                <ProtectedRoute requireSuperAdmin>
                  <SystemAnalytics />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/settings"
              element={
                <ProtectedRoute requireSuperAdmin>
                  <SystemSettings />
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
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
