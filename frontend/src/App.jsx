import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './features/auth/AuthContext';
import { ChatProvider, useChat } from './features/messaging/ChatContext';
import Navbar from './shared/components/Navbar';
import ChatModal from './features/messaging/ChatModal';
import Home from './features/home/Home';
import Login from './features/auth/Login';
import Register from './features/auth/Register';
import OwnerDashboard from './features/dashboard/OwnerDashboard';
import MyRequests from './features/requests/MyRequests';
import MyTickets from './features/tickets/MyTickets';
import PropertyDetails from './features/properties/PropertyDetails';
import Messages from './features/messaging/Messages';
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
    return <Navigate to={user.role === 'OWNER' ? '/owner-dashboard' : '/'} replace />;
  }

  return children;
};

// Redirect to dashboard if already logged in
const PublicOnlyRoute = ({ children }) => {
  const { isAuthenticated, user, loading } = useAuth();
  
  if (loading) return null;
  
  if (isAuthenticated) {
    return <Navigate to={user.role === 'OWNER' ? '/owner-dashboard' : '/'} replace />;
  }
  
  return children;
};

function AppInner() {
  const { chat, closeChat } = useChat();
  return (
    <div className="app-container">
      <Navbar />
      <main className="main-content">
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
          
          <Route path="/my-requests" element={
            <ProtectedRoute requiredRole="TENANT">
              <MyRequests />
            </ProtectedRoute>
          } />

          <Route path="/my-tickets" element={
            <ProtectedRoute requiredRole="TENANT">
              <MyTickets />
            </ProtectedRoute>
          } />

          <Route path="/messages" element={
            <ProtectedRoute>
              <Messages />
            </ProtectedRoute>
          } />
        </Routes>
      </main>

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
    </div>
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
