import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth, Login, Register, ForgotPassword, ResetPassword, ProfileSettings } from './features/auth';
import { ChatProvider, useChat, Messages } from './features/messaging';
import { Home, HowItWorks } from './features/home';
import { OwnerDashboard, TenantDashboard } from './features/dashboard';
import { PropertyDetails } from './features/properties';
import { MainLayout, AlertProvider } from './shared';
import { GoogleOAuthProvider } from '@react-oauth/google';


// Protected Route Wrapper Component
const ProtectedRoute = ({ children, requiredRole }) => {
  const { isAuthenticated, activeRole, loading } = useAuth();

  if (loading) {
    return (
      <div className="container p-top-5 flex-center">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Airbnb Style: Check the current ACTIVE mode, not the user's permanent role
  if (requiredRole && activeRole !== requiredRole) {
    // Redirect to the dashboard matching their current active role
    return <Navigate to={activeRole === 'OWNER' ? '/owner-dashboard' : '/tenant-dashboard'} replace />;
  }

  return children;
};

// Redirect to dashboard if already logged in
const PublicOnlyRoute = ({ children }) => {
  const { isAuthenticated, activeRole, loading } = useAuth();
  
  if (loading) return null;
  
  if (isAuthenticated) {
    return <Navigate to={activeRole === 'OWNER' ? '/owner-dashboard' : '/tenant-dashboard'} replace />;
  }
  
  return children;
};

function AppInner() {
  const { activeRole } = useAuth();
  const { chat, closeChat } = useChat();
  const location = useLocation();
  const isDedicatedMessagesPage = location.pathname === '/messages';

  return (
    <>
      <MainLayout>
        <Routes>
          <Route path="/" element={<Home />} />
          
          <Route path="/login" element={
            <PublicOnlyRoute>
              <Login />
            </PublicOnlyRoute>
          } />

          <Route path="/forgot-password" element={
            <PublicOnlyRoute>
              <ForgotPassword />
            </PublicOnlyRoute>
          } />

          <Route path="/reset-password" element={
            <PublicOnlyRoute>
              <ResetPassword />
            </PublicOnlyRoute>
          } />
          
          <Route path="/register" element={
            <PublicOnlyRoute>
              <Register />
            </PublicOnlyRoute>
          } />
          
          <Route path="/owner-dashboard" element={
            <ProtectedRoute requiredRole="OWNER">
              <OwnerDashboard />
            </ProtectedRoute>
          } />
          
          <Route path="/properties/:id" element={
            <PropertyDetails />
          } />
          
          <Route path="/tenant-dashboard" element={
            <ProtectedRoute requiredRole="TENANT">
              <TenantDashboard />
            </ProtectedRoute>
          } />
          
          <Route path="/my-requests" element={
            <ProtectedRoute requiredRole="TENANT">
              <TenantDashboard initialTab="leases" />
            </ProtectedRoute>
          } />

          <Route path="/my-tickets" element={
            <ProtectedRoute requiredRole="TENANT">
              <TenantDashboard initialTab="maintenance" />
            </ProtectedRoute>
          } />

          <Route path="/messages" element={
            <ProtectedRoute>
              <Messages />
            </ProtectedRoute>
          } />

          <Route path="/dashboard" element={
            <ProtectedRoute>
              {activeRole === 'OWNER' ? <Navigate to="/owner-dashboard" replace /> : <Navigate to="/tenant-dashboard" replace />}
            </ProtectedRoute>
          } />

          <Route path="/how-it-works" element={<HowItWorks />} />

          <Route path="/settings" element={
            <ProtectedRoute>
              <ProfileSettings />
            </ProtectedRoute>
          } />
        </Routes>
      </MainLayout>

    </>
  );
}

function App() {
  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID || "VITE_GOOGLE_CLIENT_ID_PLACEHOLDER"}>
      <AlertProvider>
        <ChatProvider>
          <AppInner />
        </ChatProvider>
      </AlertProvider>
    </GoogleOAuthProvider>
  );
}


export default App;
