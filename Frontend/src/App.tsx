import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import React, { useEffect, useState, Suspense } from 'react';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { auth } from './firebase/firebase';
import DashboardLayout from './layouts/DashboardLayout';
import ProtectedRoute from './components/ProtectedRoute'; // Import ProtectedRoute
import LoadingSpinner from './components/LoadingSpinner';
import './styles/global.css';

// Lazy Load Pages
const Home = React.lazy(() => import('./pages/Home'));
const Login = React.lazy(() => import('./pages/Login'));
const DSARoadmap = React.lazy(() => import('./pages/DSARoadmap'));
const WebDevRoadmap = React.lazy(() => import('./pages/WebDevRoadmap'));
const AppDevRoadmap = React.lazy(() => import('./pages/AppDevRoadmap'));
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const Profile = React.lazy(() => import('./pages/Profile'));

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (auth) {
      const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
        setUser(currentUser);
        setLoading(false);
      });
      return () => unsubscribe();
    } else {
      setLoading(false);
    }
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <Router>
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />

          {/* Protected Dashboard Routes */}
          <Route element={<DashboardLayout />}>
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute user={user}>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dsa"
              element={
                <ProtectedRoute user={user}>
                  <DSARoadmap />
                </ProtectedRoute>
              }
            />
            <Route
              path="/web-dev"
              element={
                <ProtectedRoute user={user}>
                  <WebDevRoadmap />
                </ProtectedRoute>
              }
            />
            <Route
              path="/app-dev"
              element={
                <ProtectedRoute user={user}>
                  <AppDevRoadmap />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute user={user}>
                  <Profile />
                </ProtectedRoute>
              }
            />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
