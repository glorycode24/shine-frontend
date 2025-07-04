import './App.css';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import CartPage from './pages/CartPage';
import ProductDetailPage from './pages/ProductDetailPage';
import LoginPage from './pages/LogInPage';      
import RegisterPage from './pages/RegisterPage'; 
import ProtectedRoute from './utils/ProtectedRoute';
import ProfilePage from './pages/ProfilePage';
import CheckoutPage from './pages/CheckOutPage';     // 👈 IMPORT
import OrderHistoryPage from './pages/OrderHistoryPage';
import BuyNowPage from './pages/BuyNowPage';
import TrackOrderPage from './pages/TrackOrderPage';

function App() {
  return (
    // The CartProvider should NOT be in this file anymore
    <div className="App">
      <Navbar />
      <main>
        {/* The Routes component wraps all the individual Route definitions */}
        <Routes>
          <Route path="/login" element={<LoginPage />} />         {/* 👈 ADD */}
          <Route path="/register" element={<RegisterPage />} />
          {/* Route #1: The path "/" must match the Link's "to" attribute */}
          <Route path="/" element={<HomePage />} />

          {/* Route #2: The path "/cart" must match the Link's "to" attribute */}
          <Route path="/cart" element={
            <ProtectedRoute>
            <CartPage />
            </ProtectedRoute>
            } />

            {/* 👇 ADD THE NEW PROTECTED ROUTE FOR THE PROFILE 👇 */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route path="/products/:id" element={<ProductDetailPage />} />
          <Route path="/checkout" element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} />
          <Route path="/order-history" element={<ProtectedRoute><OrderHistoryPage /></ProtectedRoute>} />
          <Route path="/buy-now" element={<ProtectedRoute><BuyNowPage /></ProtectedRoute>} />
          <Route path="/track-order/:orderId" element={<ProtectedRoute><TrackOrderPage /></ProtectedRoute>} />
        </Routes>
      </main>
    </div>
  );
}

export default App;