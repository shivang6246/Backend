import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { useToast } from './hooks/useToast';
import { ToastContainer } from './components/ui/Toast';
import { Sidebar } from './components/layout/Sidebar';
import { Topbar } from './components/layout/Topbar';
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';
import { Dashboard } from './pages/Dashboard.tsx';
import { Products } from './pages/Products.tsx';
import { Cart } from './pages/Cart.tsx';
import { Orders } from './pages/Orders.tsx';
import { Categories } from './pages/Categories.tsx';
import { ApiDocs } from './pages/ApiDocs.tsx';
import './App.css';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/" />;
};

const AppLayout: React.FC<{ children: React.ReactNode; title: string }> = ({ children, title }) => {
  return (
    <div className="app">
      <Sidebar />
      <div className="main">
        <Topbar title={title} />
        {children}
      </div>
    </div>
  );
};

function AppContent() {
  const { toasts, showToast, removeToast } = useToast();
  const { isAuthenticated } = useAuth();

  return (
    <>
      <Routes>
        <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" /> : <LoginPage onToast={showToast} />} />
        <Route path="/register" element={isAuthenticated ? <Navigate to="/dashboard" /> : <RegisterPage onToast={showToast} />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <AppLayout title="Dashboard">
                <Dashboard onToast={showToast} />
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/products"
          element={
            <ProtectedRoute>
              <AppLayout title="Products">
                <Products onToast={showToast} />
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/cart"
          element={
            <ProtectedRoute>
              <AppLayout title="Shopping Cart">
                <Cart onToast={showToast} />
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/orders"
          element={
            <ProtectedRoute>
              <AppLayout title="Orders">
                <Orders onToast={showToast} />
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/categories"
          element={
            <ProtectedRoute>
              <AppLayout title="Categories">
                <Categories onToast={showToast} />
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/api"
          element={
            <ProtectedRoute>
              <AppLayout title="API Explorer">
                <ApiDocs />
              </AppLayout>
            </ProtectedRoute>
          }
        />
      </Routes>
      <ToastContainer toasts={toasts} onClose={removeToast} />
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
