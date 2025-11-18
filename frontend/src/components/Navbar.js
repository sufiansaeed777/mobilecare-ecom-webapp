import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FaSearch, FaShoppingCart, FaBars, FaTimes } from 'react-icons/fa';
import { useCart } from '../context/CartContext';
import CartModal from './CartModal';
import MobileMenuAnimation from './MobileMenuAnimation';
import SparklingStars from './SparklingStars';
import gsap from 'gsap';

// ----- IMPORT YOUR SEARCHABLE DATA -----
import { allSearchableItems } from '../data/searchData';
// -----------------------------------------

function Navbar() {
  const { cartItems } = useCart();
  const [cartOpen, setCartOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [cartPulse, setCartPulse] = useState(false);
  const [menuSeed, setMenuSeed] = useState(0);

  // --- Search State ---
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchContainerRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  // ---------------------

  // Ref for the mobile menu container
  const mobileMenuRef = useRef(null);

  // Check if we're on an admin page
  const isAdminPage = location.pathname.startsWith('/admin');

  // ==================================================================
  // ALL HOOKS MUST BE CALLED BEFORE ANY CONDITIONAL RETURNS
  // ==================================================================

  // Effect for cart pulse animation
  useEffect(() => {
    const handleCartPulse = () => {
      setCartPulse(true);
      setTimeout(() => setCartPulse(false), 400);
    };
    window.addEventListener('cartPulse', handleCartPulse);
    return () => window.removeEventListener('cartPulse', handleCartPulse);
  }, []);

  // Update menuSeed when the mobile menu opens
  useEffect(() => {
    if (isMobileMenuOpen) {
      setMenuSeed(prev => prev + 1);
    }
  }, [isMobileMenuOpen]);

  // Filter suggestions based on search query
  useEffect(() => {
    if (searchQuery.trim().length > 0) {
      const lowerQuery = searchQuery.toLowerCase();
      if (allSearchableItems && allSearchableItems.length > 0) {
        const filtered = allSearchableItems
          .filter(item => item.name.toLowerCase().includes(lowerQuery))
          .slice(0, 10);
        setSuggestions(filtered);
        setShowSuggestions(filtered.length > 0);
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [searchQuery]);

  // Close suggestions when clicking outside the search container
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // GSAP Animation for the hamburger menu list items
  useEffect(() => {
    if (isMobileMenuOpen && mobileMenuRef.current) {
      gsap.fromTo(
        mobileMenuRef.current.querySelectorAll('li'),
        { x: 50, opacity: 0, rotation: 5 },
        { x: 0, opacity: 1, rotation: 0, duration: 0.5, stagger: 0.1, ease: 'back.out(1.7)' }
      );
    }
  }, [isMobileMenuOpen]);

  // Close mobile menu on route change
  useEffect(() => {
    if (isMobileMenuOpen) {
        closeMobileMenu(false);
    }
  }, [location]);

  // ==================================================================
  // CONDITIONAL RETURN IS NOW SAFE
  // ==================================================================

  // Hide navbar on admin pages
  if (isAdminPage) {
    return null;
  }

  // Handlers for toggling cart and mobile menu
  const handleCartClick = () => { setCartOpen(true); };
  const toggleMobileMenu = () => {
    if (isMobileMenuOpen) {
      setIsClosing(true);
      setTimeout(() => { setIsMobileMenuOpen(false); setIsClosing(false); }, 300);
    } else {
      setIsMobileMenuOpen(true);
    }
  };

  const closeMobileMenu = (animated = true) => {
    if (!isMobileMenuOpen) return;
    if (animated) {
      setIsClosing(true);
      setTimeout(() => { setIsMobileMenuOpen(false); setIsClosing(false); }, 300);
    } else {
      setIsMobileMenuOpen(false);
      setIsClosing(false);
    }
  };

  // --- Search Handlers ---
  const handleSearchInputChange = (event) => {
    setSearchQuery(event.target.value);
  };
  const handleSearchSubmit = (event) => {
    event.preventDefault();
    const trimmedQuery = searchQuery.trim();
    if (trimmedQuery) {
      navigate(`/search?q=${encodeURIComponent(trimmedQuery)}`);
      setSearchQuery('');
      setSuggestions([]);
      setShowSuggestions(false);
      if (searchContainerRef.current) {
        const input = searchContainerRef.current.querySelector('input');
        if (input) input.blur();
      }
    }
  };
  const handleSuggestionClick = (suggestion) => {
    navigate(suggestion.url || `/search?q=${encodeURIComponent(suggestion.name)}`);
    setSearchQuery('');
    setSuggestions([]);
    setShowSuggestions(false);
    if (searchContainerRef.current) {
      const input = searchContainerRef.current.querySelector('input');
      if (input) input.blur();
    }
  };

  // Close suggestions on Escape key
  const handleKeyDown = (event) => {
    if (event.key === 'Escape') {
      setShowSuggestions(false);
      if (searchContainerRef.current) {
        const input = searchContainerRef.current.querySelector('input');
        if (input) input.blur();
      }
    }
  };

  // Show suggestions on focus if applicable
  const handleFocus = () => {
    if (searchQuery.trim().length > 0 && suggestions.length > 0) {
      setShowSuggestions(true);
    }
  };
  // ---------------------

  // Mobile menu transform calculation for open/close
  let mobileMenuTransform = 'translateX(100%)';
  if (isMobileMenuOpen && !isClosing) mobileMenuTransform = 'translateX(0)';
  else if (isClosing) mobileMenuTransform = 'translateX(100%)';

  return (
    <>
      <style>
        {`
          /* NAVBAR BASE STYLES - WHITE AND BLUE THEME */
          .navbar {
  background-color: #FFFFFF;
  color: #1E3A8A;
  padding: 0.75rem 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 1rem;
  position: sticky;
  top: 0;
  left: 0;  /* Add this */
  right: 0; /* Add this */
  z-index: 50;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  border-bottom: 1px solid #e5e7eb;
  font-family: 'Poppins', sans-serif;
  width: 100%;
  max-width: 100vw; /* Add this to prevent overflow */
  box-sizing: border-box;
}
          
          /* Fix for initial load cut-off */
          body {
            margin: 0;
            padding: 0;
          }
          
          .nav-section {
            display: flex;
            align-items: center;
            gap: 1rem;
          }
          .nav-section.left {
            flex: 1;
            justify-content: flex-start;
          }
          .nav-section.center {
            flex: 2;
            justify-content: center;
          }
          .nav-section.right {
            flex: 1;
            justify-content: flex-end;
          }
          .nav-brand {
            display: flex;
            flex-direction: row;
            align-items: center;
            gap: 0.75rem;
            flex-shrink: 0;
          }
          .brand-link {
            color: #1E3A8A;
            text-decoration: none;
            transition: all 0.3s ease;
            font-size: 1.25rem;
            font-weight: 600;
            margin-bottom: 0;
            display: inline-block;
            font-family: 'Poppins', sans-serif;
          }
          .brand-link:hover {
            color: #2E4A9A;
          }
          .tagline {
            margin: 0;
            font-size: 0.8rem;
            color: #6b7280;
            line-height: 1.2;
            font-family: 'Poppins', sans-serif;
            white-space: nowrap;
          }
          .nav-controls {
            display: flex;
            align-items: center;
            gap: 1rem;
            flex-wrap: nowrap;
          }
          .nav-search {
            display: inline-flex;
            align-items: center;
            margin: 0 auto;
            background-color: #f3f4f6;
            border-radius: 25px;
            transition: all 0.3s ease;
            border: 1px solid #e5e7eb;
            position: relative;
            width: 100%;
            max-width: 400px;
          }
          .nav-search:focus-within {
            background-color: #fff;
            border-color: #93c5fd; 
            box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.25); 
          }
          .search-input {
            width: 100%;
            padding: 0.5rem 1rem;
            background: transparent;
            border: none;
            color: #1f2937; 
            font-size: 0.9rem;
            outline: none;
            margin: 0;
            font-family: 'Poppins', sans-serif;
          }
          .search-input::placeholder {
            color: #9ca3af; 
            font-family: 'Poppins', sans-serif;
          }
          .search-button {
            padding: 0.5rem 1rem;
            background: transparent;
            color: #1E3A8A;
            border: none;
            cursor: pointer;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            flex-shrink: 0;
          }
          .search-button:hover {
            color: #2E4A9A;
          }
          .desktop-menu-links {
            display: none;
            gap: 1.5rem;
            list-style: none;
            margin: 0;
            padding: 0;
            align-items: center;
            font-family: 'Poppins', sans-serif;
          }
          .desktop-menu-links a {
            color: #1E3A8A;
            text-decoration: none;
            transition: all 0.3s ease;
            padding: 0.4rem 0.8rem;
            border-radius: 0.25rem;
            font-weight: 500;
            white-space: nowrap;
          }
          .desktop-menu-links a:hover {
            color: #FFFFFF;
            background-color: #1E3A8A;
          }
          .cart-container {
            position: relative;
            display: flex;
            align-items: center;
          }
          .cart-icon-button {
            background: none;
            border: none;
            color: #1E3A8A;
            cursor: pointer;
            position: relative;
            display: flex;
            align-items: center;
            padding: 5px;
            border-radius: 50%;
            transition: background-color 0.2s ease;
          }
          .cart-icon-button:hover {
            background-color: #f3f4f6;
          }
          .cart-badge {
            position: absolute;
            top: -4px;
            right: -4px;
            background: #ef4444; 
            color: #fff;
            border-radius: 50%;
            font-size: 0.7rem;
            padding: 1px 5px;
            line-height: 1;
            font-weight: bold;
            border: 1px solid #FFFFFF;
            font-family: 'Poppins', sans-serif;
          }
          @keyframes cartPulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.2); }
            100% { transform: scale(1); }
          }
          @keyframes badgePop {
            0% { transform: scale(1); }
            50% { transform: scale(1.4); }
            100% { transform: scale(1); }
          }
          .cart-pulse .cart-icon-svg {
            animation: cartPulse 0.4s ease;
          }
          .cart-pulse .cart-badge {
            animation: badgePop 0.4s ease;
          }
          .mobile-menu-icon {
            color: #1E3A8A !important;
            background: none;
            border: none;
            cursor: pointer;
            display: none;
            padding: 5px;
            border-radius: 50%;
            transition: background-color 0.2s ease;
          }
          .mobile-menu-icon:hover {
            background-color: #f3f4f6;
          }
          .mobile-menu-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background-color: rgba(0,0,0,0.3);
            z-index: 1001;
          }
          .mobile-menu {
            position: fixed;
            top: 0;
            right: 0;
            width: 280px;
            height: 100vh;
            background-color: #FFFFFF;
            color: #1E3A8A;
            z-index: 1002;
            padding: 1.5rem;
            transition: transform 0.3s ease;
            transform: translateX(100%);
            box-shadow: -3px 0 10px rgba(0,0,0,0.1);
            font-family: 'Poppins', sans-serif;
            overflow-y: auto;
          }
          .mobile-menu ul {
            list-style: none;
            padding: 0;
            margin: 0;
            display: flex;
            flex-direction: column;
            gap: 1.2rem;
          }
          .mobile-menu ul a {
            color: #1E3A8A;
            text-decoration: none;
            transition: color 0.2s ease;
            font-size: 1.1rem;
            padding: 0.5rem 0;
            display: block;
            font-weight: 500;
            border-bottom: 1px solid #e5e7eb;
          }
          .mobile-menu ul a:hover {
            color: #2E4A9A;
          }
          .search-suggestions {
            position: absolute;
            top: calc(100% + 5px);
            left: 0;
            right: 0;
            background-color: #fff; 
            color: #1f2937; 
            border: 1px solid #e5e7eb; 
            border-radius: 4px;
            border-top-left-radius: 0;
            border-top-right-radius: 0;
            z-index: 999;
            max-height: 300px;
            overflow-y: auto;
            box-shadow: 0 5px 10px rgba(0,0,0,0.1);
            font-family: 'Poppins', sans-serif;
          }
          .search-suggestions ul {
            list-style: none;
            padding: 0;
            margin: 0;
          }
          .suggestion-item {
            padding: 0.8rem 1rem;
            cursor: pointer;
            transition: background-color 0.2s ease;
            font-size: 0.9rem;
            border-bottom: 1px solid #e5e7eb; 
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-family: 'Poppins', sans-serif;
          }
          .suggestion-item:last-child {
            border-bottom: none;
          }
          .suggestion-item:hover,
          .suggestion-item.highlighted {
            background-color: #eff6ff; 
          }
          .suggestion-item .type {
            font-size: 0.75rem;
            color: #6b7280; 
            margin-left: 0.75em;
            font-style: italic;
            flex-shrink: 0;
          }
          
          /* Large Desktop - Above 1440px */
          @media (min-width: 1441px) {
            .navbar {
              padding: 1rem 4rem;
            }
          }
          
          /* Desktop - 1024px to 1440px */
          @media (min-width: 1024px) {
            .desktop-menu-links { display: flex; }
            .mobile-menu-icon { display: none !important; }
            .cart-container.mobile-cart { display: none !important; }
            .cart-container.desktop-cart { display: flex !important; }
            .nav-search { max-width: 400px; }
            .navbar { flex-wrap: nowrap; }
          }
          
          /* Tablet - 768px to 1023px */
          @media (min-width: 768px) and (max-width: 1023px) {
            .navbar { 
              padding: 0.75rem 2rem;
              flex-wrap: wrap; 
            }
            .nav-section.left, .nav-section.right {
              flex: auto;
            }
            .nav-section.center {
              order: 3;
              width: 100%;
              flex: 0 0 100%;
              margin-top: 0.75rem;
            }
            .nav-search {
              max-width: none;
              width: 100%;
            }
            .tagline {
              display: block;
            }
            .desktop-menu-links { display: none; }
            .mobile-menu-icon { display: inline-flex !important; }
            .cart-container.desktop-cart { display: none !important; }
            .cart-container.mobile-cart { display: flex !important; }
          }
          
          /* Mobile Landscape - 640px to 767px */
          @media (min-width: 640px) and (max-width: 767px) {
            .navbar { 
              padding: 0.75rem 1.5rem;
              flex-wrap: wrap; 
            }
            .nav-section.left, .nav-section.right {
              flex: auto;
            }
            .nav-section.center {
              order: 3;
              width: 100%;
              flex: 0 0 100%;
              margin-top: 0.5rem;
            }
            .nav-search {
              max-width: none;
              width: 100%;
            }
            .tagline {
              font-size: 0.75rem;
            }
            .desktop-menu-links { display: none; }
            .mobile-menu-icon { display: inline-flex !important; }
            .cart-container.desktop-cart { display: none !important; }
            .cart-container.mobile-cart { display: flex !important; }
          }
          
          /* Mobile Portrait - 480px to 639px */
          @media (min-width: 480px) and (max-width: 639px) {
            .navbar { 
              padding: 0.75rem 1rem;
              gap: 0.75rem;
            }
            .nav-section.left, .nav-section.right {
              flex: auto;
            }
            .nav-section.center {
              order: 3;
              width: 100%;
              flex: 0 0 100%;
              margin-top: 0.5rem;
            }
            .nav-brand { 
              gap: 0.5rem; 
            }
            .nav-brand img {
              width: 35px !important;
              height: 35px !important;
            }
            .brand-link {
              font-size: 1.1rem;
            }
            .tagline { 
              font-size: 0.7rem;
              display: none;
            }
            .nav-controls { gap: 0.5rem; }
            .nav-search {
              max-width: none;
              width: 100%;
            }
            .search-input { padding: 0.4rem 0.8rem; font-size: 0.85rem; }
            .search-button { padding: 0.4rem 0.8rem; }
            .cart-icon-button svg { width: 18px; height: 18px; }
            .mobile-menu-icon svg { width: 22px; height: 22px; }
            .search-suggestions { left: -1rem; right: -1rem; }
            .desktop-menu-links { display: none; }
            .mobile-menu-icon { display: inline-flex !important; }
            .cart-container.desktop-cart { display: none !important; }
            .cart-container.mobile-cart { display: flex !important; }
            .mobile-menu {
              width: 260px;
            }
          }
          
          /* Small Mobile - Below 480px */
          @media (max-width: 479px) {
            .navbar { 
              padding: 0.6rem 0.75rem;
              gap: 0.5rem;
            }
            .nav-section.left, .nav-section.right {
              flex: auto;
            }
            .nav-section.center {
              order: 3;
              width: 100%;
              flex: 0 0 100%;
              margin-top: 0.5rem;
            }
            .nav-brand { 
              gap: 0.4rem; 
            }
            .nav-brand img {
              width: 32px !important;
              height: 32px !important;
            }
            .brand-link {
              font-size: 1rem;
            }
            .tagline { 
              display: none;
            }
            .nav-controls { gap: 0.4rem; }
            .nav-search {
              max-width: none;
              width: 100%;
              border-radius: 20px;
            }
            .search-input { 
              padding: 0.35rem 0.7rem; 
              font-size: 0.8rem; 
            }
            .search-button { 
              padding: 0.35rem 0.7rem; 
            }
            .search-button svg {
              width: 14px;
              height: 14px;
            }
            .cart-icon-button { 
              padding: 4px; 
            }
            .cart-icon-button svg { 
              width: 16px; 
              height: 16px; 
            }
            .cart-badge {
              font-size: 0.6rem;
              padding: 1px 4px;
            }
            .mobile-menu-icon { 
              padding: 4px;
              display: inline-flex !important; 
            }
            .mobile-menu-icon svg { 
              width: 20px; 
              height: 20px; 
            }
            .search-suggestions { 
              left: -0.75rem; 
              right: -0.75rem; 
              font-size: 0.85rem;
            }
            .suggestion-item {
              padding: 0.6rem 0.8rem;
            }
            .desktop-menu-links { display: none; }
            .cart-container.desktop-cart { display: none !important; }
            .cart-container.mobile-cart { display: flex !important; }
            .mobile-menu {
              width: 240px;
              padding: 1.25rem;
            }
            .mobile-menu ul {
              gap: 1rem;
            }
            .mobile-menu ul a {
              font-size: 1rem;
              padding: 0.4rem 0;
            }
          }
          
          /* Ultra Small Mobile - Below 360px */
          @media (max-width: 359px) {
            .navbar { 
              padding: 0.5rem;
              gap: 0.4rem;
            }
            .nav-brand img {
              width: 28px !important;
              height: 28px !important;
            }
            .brand-link {
              font-size: 0.9rem;
            }
            .search-input { 
              padding: 0.3rem 0.6rem; 
              font-size: 0.75rem; 
            }
            .mobile-menu {
              width: 220px;
              padding: 1rem;
            }
          }
            
        `}
      </style>

      <nav className="navbar">
        {/* Left Section - Brand */}
        <div className="nav-section left">
          <div className="nav-brand">
            <div style={{ width: '40px', height: '40px', flexShrink: 0 }}>
              <img
                src="/images/WebsiteLogo.JPEG"
                alt="Mobile Care logo"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                  background: 'transparent',
                  borderRadius: '50%'
                }}
              />
            </div>
            <div>
              <Link to="/" className="brand-link">Mobile Care</Link>
              <p className="tagline">Your Expert in Device Care and Repair</p>
            </div>
          </div>
        </div>

        {/* Center Section - Search */}
        <div className="nav-section center">
          <div className="nav-search" ref={searchContainerRef} onKeyDown={handleKeyDown}>
            <form onSubmit={handleSearchSubmit} style={{ display: 'contents' }}>
              <input
                type="text"
                className="search-input"
                placeholder="Search devices, repairs..."
                value={searchQuery}
                onChange={handleSearchInputChange}
                onFocus={handleFocus}
                aria-label="Search"
                autoComplete="off"
                aria-haspopup="listbox"
                aria-expanded={showSuggestions && suggestions.length > 0}
              />
              <button type="submit" className="search-button" aria-label="Search">
                <FaSearch />
              </button>
            </form>
            {showSuggestions && suggestions.length > 0 && (
              <div className="search-suggestions" role="listbox">
                <ul>
                  {suggestions.map((item, index) => (
                    <li
                      key={`${item.type}-${item.name}-${index}`}
                      className="suggestion-item"
                      onClick={() => handleSuggestionClick(item)}
                      role="option"
                      aria-selected={false}
                    >
                      <span>{item.name}</span>
                      {item.type && <span className="type">({item.type})</span>}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Right Section - Menu Links, Cart & Mobile Menu */}
        <div className="nav-section right">
          {/* Desktop Menu Links */}
          <ul className="desktop-menu-links">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/about">About Us</Link></li>
            <li><Link to="/location">Our Location</Link></li>
            <li><Link to="/special-offers">Special Offers</Link></li>
            <li><Link to="/contact">Contact Us</Link></li>
          </ul>

          {/* Cart Buttons */}
          <div className="cart-container desktop-cart">
            <button
              className={`cart-icon-button ${cartPulse ? 'cart-pulse' : ''}`}
              onClick={handleCartClick}
              id="cart-icon-desktop"
              aria-label={`Shopping Cart: ${cartItems.length} items`}
            >
              <FaShoppingCart size={20} className="cart-icon-svg" />
              {cartItems.length > 0 && (
                <span className="cart-badge">{cartItems.length}</span>
              )}
            </button>
          </div>
          <div className="cart-container mobile-cart" style={{ display: 'none' }}>
            <button
              className={`cart-icon-button ${cartPulse ? 'cart-pulse' : ''}`}
              onClick={handleCartClick}
              id="cart-icon-mobile"
              aria-label={`Shopping Cart: ${cartItems.length} items`}
            >
              <FaShoppingCart size={20} className="cart-icon-svg" />
              {cartItems.length > 0 && (
                <span className="cart-badge">{cartItems.length}</span>
              )}
            </button>
          </div>

          {/* Mobile Menu Icon */}
          <button className="mobile-menu-icon" onClick={toggleMobileMenu} aria-label="Toggle menu">
            {isMobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>

        {/* Mobile Sidebar Menu */}
        {(isMobileMenuOpen || isClosing) && (
          <>
            <div className="mobile-menu-overlay" onClick={() => closeMobileMenu(true)} />
            <div
              className="mobile-menu"
              ref={mobileMenuRef}
              style={{ transform: mobileMenuTransform }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => closeMobileMenu(true)}
                style={{
                  position: 'absolute',
                  top: '15px',
                  right: '15px',
                  background: 'none',
                  border: 'none',
                  color: '#1E3A8A',
                  fontSize: '1.8rem',
                  cursor: 'pointer',
                  fontFamily: 'Poppins, sans-serif'
                }}
                aria-label="Close menu"
              >
                ×
              </button>
              <div style={{ marginTop: '2.5rem' }}>
                <ul>
                  <li><Link to="/" onClick={() => closeMobileMenu(false)}>Home</Link></li>
                  <li><Link to="/about" onClick={() => closeMobileMenu(false)}>About Us</Link></li>
                  <li><Link to="/location" onClick={() => closeMobileMenu(false)}>Our Location</Link></li>
                  <li><Link to="/special-offers" onClick={() => closeMobileMenu(false)}>Special Offers</Link></li>
                  <li><Link to="/contact" onClick={() => closeMobileMenu(false)}>Contact Us</Link></li>
                </ul>
                {/* SparklingStars animation appears here under the "Contact Us" item */}
                <SparklingStars seed={menuSeed} />
              </div>
            </div>
          </>
        )}

        {/* Cart Modal */}
        {CartModal && <CartModal show={cartOpen} onClose={() => setCartOpen(false)} />}
      </nav>
    </>
  );
}

export default Navbar;