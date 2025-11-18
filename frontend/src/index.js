// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { CartProvider } from './context/CartContext';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import ErrorBoundary from './components/ErrorBoundary';

// Initialize Stripe with your publishable key
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <ErrorBoundary>
      <CartProvider>
        <Elements stripe={stripePromise}>
          <App />
        </Elements>
      </CartProvider>
    </ErrorBoundary>
  </BrowserRouter>
);
