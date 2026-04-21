import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth, Login, Register, ForgotPassword, ResetPassword } from './features/auth';
import { ChatProvider, useChat, ChatModal, Messages } from './features/messaging';
import { Home } from './features/home';
import { OwnerDashboard, TenantDashboard } from './features/dashboard';
import { PropertyDetails } from './features/properties';
import MainLayout from './shared/components/MainLayout';
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
        </Routes>
      </MainLayout>

      {/* Global persistent chat widget - survives page navigation */}
      {/* Hide when on the full /messages page to prevent UI overlap */}
      {chat && !isDedicatedMessagesPage && (
        <ChatModal
          isOpen={true}
          onClose={closeChat}
          contextType={chat.contextType}
          contextId={chat.contextId}
          title={chat.title}
          subtitle={chat.subtitle}
          receiverId={chat.receiverId}
        />
      )}
    </>
  );
}

function App() {
  return (
    <GoogleOAuthProvider clientId="782896589415-p7jjq4mkbjmulsp2aol6okvt80dckpk4.apps.googleusercontent.com">
      <ChatProvider>
        <AppInner />
      </ChatProvider>
    </GoogleOAuthProvider>
  );
}

export default App;
