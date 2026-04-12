import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth, Login, Register } from './features/auth';
import { ChatProvider, useChat, ChatModal, Messages } from './features/messaging';
import { Home } from './features/home';
import { OwnerDashboard, TenantDashboard } from './features/dashboard';
import { MyRequests } from './features/requests';
import { MyTickets } from './features/tickets';
import { PropertyDetails } from './features/properties';
import MainLayout from './shared/components/MainLayout';
import './App.css';

// Protected Route Wrapper Component
const ProtectedRoute = ({ children, requiredRole }) => {
  const { isAuthenticated, user, loading } = useAuth();

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

  if (requiredRole && user.role !== requiredRole) {
    // Redirect if they don't have the right role
    return <Navigate to={user.role === 'OWNER' ? '/owner-dashboard' : '/tenant-dashboard'} replace />;
  }

  return children;
};

// Redirect to dashboard if already logged in
const PublicOnlyRoute = ({ children }) => {
  const { isAuthenticated, user, loading } = useAuth();
  
  if (loading) return null;
  
  if (isAuthenticated) {
    return <Navigate to={user.role === 'OWNER' ? '/owner-dashboard' : '/tenant-dashboard'} replace />;
  }
  
  return children;
};

function AppInner() {
  const { chat, closeChat } = useChat();
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
      {chat && (
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
    <ChatProvider>
      <AppInner />
    </ChatProvider>
  );
}

export default App;
