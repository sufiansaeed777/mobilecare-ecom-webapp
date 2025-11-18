// src/App.js
import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';

// Buy Device Pages
import BuyCategoriesPage from './pages/BuyCategoriesPage';
import BuyDeviceListPage from './pages/BuyDeviceListPage';

import SellCategoriesPage from './pages/SellCategoriesPage';
import SellDeviceFormPage from './pages/SellDeviceFormPage';

import TradeInLandingPage from './pages/TradeInLandingPage';
import TradeInDeviceFormPage from './pages/TradeInDeviceFormPage';

// Pages
import Home from './pages/Home';
import Contact from './pages/Contact';
import Booking from './pages/Booking';
import Complain from './pages/Complain';
import PrivacyPolicy from './pages/PrivacyPolicy';
import Terms from './pages/Terms';
import Warranty from './pages/Warranty';
import About from './pages/About';
import PhoneSelection from './pages/PhoneSelection';
import TabletSelection from './pages/TabletSelection';
import PhoneModels from './pages/PhoneModels';
import TabletModel from './pages/TabletModel';
import WatchSelection from './pages/WatchSelection';
import WatchModels from './pages/WatchModels';
import Location from './pages/Location';
import Payment from './pages/Payment';
import ConsoleModels from './pages/ConsoleModels';
import ConsoleSelection from './pages/ConsoleSelection';
import LaptopSelection from './pages/LaptopSelection';
import Cart from './pages/Cart';
import SpecialOffers from './pages/SpecialOffers';
// Admin Pages
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminDevices from './pages/admin/AdminDevices';
import AdminRepairs from './pages/admin/AdminRepairs';
import AdminProducts from './pages/admin/AdminProducts';

import './index.css';

// Admin route guard component
const AdminRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('adminToken') !== null;
  
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }
  
  return children;
};

function App() {
  const location = useLocation();




  return (
    <div className="app-container d-flex flex-column min-vh-100">
      <ScrollToTop />
      <Navbar />

      <div className="flex-fill">
        <Routes>
          {/* Main Site Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/booking" element={<Booking />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/about" element={<About />} />
          <Route path="/warranty" element={<Warranty />} />
          <Route path="/phone" element={<PhoneSelection />} />
          <Route path="/tablet" element={<TabletSelection />} />
          <Route path="/phone/:brand" element={<PhoneModels />} />
          <Route path="/tablet/:brand" element={<TabletModel />} />
          <Route path="/watch" element={<WatchSelection />} />
          <Route path="/watch/:brand" element={<WatchModels />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/laptop" element={<LaptopSelection />} />
          <Route path="/console/:brand" element={<ConsoleModels />} />
          <Route path="/console" element={<ConsoleSelection />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/location" element={<Location />} />
          <Route path="/complain" element={<Complain />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/special-offers" element={<SpecialOffers />} />
          {/* Buy/Sell/Trade Routes */}
          <Route path="/buy" element={<BuyCategoriesPage />} />
          <Route path="/buy/:category" element={<BuyDeviceListPage />} />
          <Route path="/sell" element={<SellCategoriesPage />} />
          <Route path="/sell/:category" element={<SellDeviceFormPage />} />
          <Route path="/trade-in" element={<TradeInLandingPage />} />
          <Route path="/trade-in/:category" element={<TradeInDeviceFormPage />} />
          
          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          } />
          <Route path="/admin/devices" element={
            <AdminRoute>
              <AdminDevices />
            </AdminRoute>
          } />
          <Route path="/admin/repairs" element={
            <AdminRoute>
              <AdminRepairs />
            </AdminRoute>
          } />
          <Route path="/admin/products" element={
            <AdminRoute>
              <AdminProducts />
            </AdminRoute>
          } />
        </Routes>
      </div>

      <Footer />
    </div>
  );
}

export default App;