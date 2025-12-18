import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from "./context/CartContext";
import { WishlistProvider } from './context/WishlistContext';
import { RecentlyViewedProvider } from './context/RecentlyViewedContext';
import { SpinProvider, useSpin } from './context/SpinContext';
import SpinWheel from './components/SpinWheel'; 
import Layout from './components/Layout';
import ErrorBoundary from './components/ErrorBoundary';
import HomePage from './pages/HomePage';
import MenuPage from './pages/MenuPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import ProductDetailPage from './pages/ProductDetailPage';
import AddProductPage from './pages/AddProductPage';
import LoginPage from './pages/LoginPage';
import CartPage from './pages/CartPage';
import AdminProductsPage from './pages/AdminProductsPage';
import ProfilePage from './pages/ProfilePage'; 
import ProtectedRoute from './components/ProtectedRoute';
import FeedbackPage from './pages/FeedbackPage';
import AdminFeedbackPage from './pages/AdminFeedbackPage';
import PaymentPage from './pages/PaymentPage';
import PaymentSuccessPage from './pages/PaymentSuccessPage';
import WishlistPage from './pages/WishlistPage';
import AdminAnalyticsPage from './pages/AdminAnalyticsPage';
import AdminCouponsPage from './pages/AdminCouponsPage';
import OrderHistoryPage from './pages/OrderHistoryPage';
import AdminOrdersPage from './pages/AdminOrdersPage';
import GroupOrdersPage from './pages/GroupOrdersPage';
import GroupOrderDetailPage from './pages/GroupOrderDetailPage';
import ReservationsPage from './pages/ReservationsPage';
import AdminReservationsPage from './pages/AdminReservationsPage';
import FoodDiaryPage from './pages/FoodDiaryPage';
import AdminPromotionsPage from './pages/AdminPromotionsPage';
import LoyaltyPage from './pages/LoyaltyPage';
import AdminSpinPage from './pages/AdminSpinPage';

function AppContent() {
  const { showSpin, closeSpin } = useSpin();
  
  return (
    <>
      <Router>
          <Routes>
            {/* Public routes without layout */}
            <Route path="/login" element={<LoginPage />} />
            
            {/* Routes with layout */}
            <Route path="/" element={<Layout />}>
              <Route index element={<HomePage />} />
              <Route path="menu" element={<MenuPage />} />
              <Route path="about" element={<AboutPage />} />
              <Route path="contact" element={<ContactPage />} />
              <Route path="product/:id" element={<ProductDetailPage />} />
              <Route path="product/custom-:id" element={<ProductDetailPage />} />
              
              {/* Protected Feedback Page */}
              <Route path="feedback" element={
                <ProtectedRoute>
                  <FeedbackPage />
                </ProtectedRoute>
              } />
              
              {/* Existing Protected routes */}
              <Route path="cart" element={
                <ProtectedRoute>
                  <CartPage />
                </ProtectedRoute>
              } />
              
              <Route path="wishlist" element={
                <ProtectedRoute>
                  <WishlistPage />
                </ProtectedRoute>
              } />
              
              <Route path="payment" element={
                <ProtectedRoute>
                  <PaymentPage />
                </ProtectedRoute>
              } />
              
              <Route path="payment-success" element={
                <ProtectedRoute>
                  <PaymentSuccessPage />
                </ProtectedRoute>
              } />
              
              <Route path="profile" element={ 
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              } />
              
              <Route path="add-product" element={
                <ProtectedRoute requireAdmin>
                  <AddProductPage />
                </ProtectedRoute>
              } />
              
              <Route path="admin/products" element={
                <ProtectedRoute requireAdmin>
                  <AdminProductsPage />
                </ProtectedRoute>
              } />
              <Route 
                path="/admin/feedback" 
                element={
                  <ProtectedRoute requireAdmin> 
                    <AdminFeedbackPage />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/admin/analytics" 
                element={
                  <ProtectedRoute requireAdmin> 
                    <AdminAnalyticsPage />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/admin/coupons" 
                element={
                  <ProtectedRoute requireAdmin> 
                    <AdminCouponsPage />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/orders" 
                element={
                  <ProtectedRoute> 
                    <OrderHistoryPage />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/admin/orders" 
                element={
                  <ProtectedRoute requireAdmin> 
                    <AdminOrdersPage />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/group-orders" 
                element={
                  <ProtectedRoute> 
                    <GroupOrdersPage />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/group-orders/:id" 
                element={
                  <ProtectedRoute> 
                    <GroupOrderDetailPage />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/reservations" 
                element={
                  <ProtectedRoute> 
                    <ReservationsPage />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/admin/reservations" 
                element={
                  <ProtectedRoute requireAdmin> 
                    <AdminReservationsPage />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/food-diary" 
                element={
                  <ProtectedRoute> 
                    <FoodDiaryPage />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/admin/promotions" 
                element={
                  <ProtectedRoute requireAdmin> 
                    <AdminPromotionsPage />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/loyalty" 
                element={
                  <ProtectedRoute> 
                    <LoyaltyPage />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/admin/spin" 
                element={
                  <ProtectedRoute requireAdmin> 
                    <AdminSpinPage />
                  </ProtectedRoute>
                } 
              />
            </Route>
          </Routes>
      </Router>
      {showSpin && <SpinWheel onClose={closeSpin} />}
    </>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <RecentlyViewedProvider>
              <SpinProvider>
                <AppContent />
              </SpinProvider>
            </RecentlyViewedProvider>
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;