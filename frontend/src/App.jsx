import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
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

function App() {
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
          
          {/* We will build these properly in the next phases */}
          <Route path="/owner-dashboard" element={
            <ProtectedRoute requiredRole="OWNER">
              <div className="container p-top-5"><h1>Owner Dashboard</h1></div>
            </ProtectedRoute>
          } />
          
          <Route path="/properties/:id" element={
             <div className="container p-top-5">Property Details Coming Soon</div>
          } />
          
          <Route path="/my-requests" element={
            <ProtectedRoute requiredRole="TENANT">
              <div className="container p-top-5"><h1>Tenant Requests</h1></div>
            </ProtectedRoute>
          } />
        </Routes>
      </main>
    </div>
  );
}

export default App;
