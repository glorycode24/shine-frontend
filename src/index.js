import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import { OrderProvider } from './context/OrderContext';
import { ReviewProvider } from './context/ReviewContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    {/* Wrapper #1: BrowserRouter MUST be one of the outermost wrappers */}
    <BrowserRouter>
      <AuthProvider> {/* 👈 WRAP WITH AUTH PROVIDER */}
      {/* Wrapper #2: CartProvider is inside BrowserRouter */}
      <CartProvider>
        {/* Your App is the child of both */}
        <OrderProvider>
          <ReviewProvider>
            <AuthProvider>
              <App />
            </AuthProvider>
            </ReviewProvider>
        </OrderProvider>
      </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
