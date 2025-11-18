// src/components/Footer.jsx
import React from 'react';
import { Link , useLocation} from 'react-router-dom';
// Importing necessary icons from react-icons
import { 
  FaWhatsapp, 
  FaFacebookF, 
  FaTwitter, 
  FaInstagram, 
  FaLinkedinIn,
  FaMapMarkerAlt,
  FaEnvelope,
  FaPhone,
  FaClock,
  FaTools,
  FaMobileAlt,
  FaTabletAlt,
  FaLaptop,
  FaHeadset,
  FaExchangeAlt,
  FaDollarSign,
  FaShoppingCart,
  FaWrench
} from 'react-icons/fa';

function Footer() {
  // ADD THESE 4 LINES AT THE VERY TOP OF THE FUNCTION
  const location = useLocation();
  // Check if we're on an admin page
  const isAdminPage = location.pathname.startsWith('/admin');
  // Don't render footer on admin pages
  if (isAdminPage) {
    return null;
  }
  // WhatsApp number - replace with your actual business phone number with country code
  const whatsappNumber = '447778381835'; // Replace with your actual number
  const whatsappMessage = 'Hello, I need help with my repair.';
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { href: 'https://www.facebook.com/share/12Le9QjSDaK/', icon: FaFacebookF, label: 'Facebook' },
    { href: 'https://twitter.com/yourprofile', icon: FaTwitter, label: 'Twitter' },
    { href: 'https://www.instagram.com/mobilecareuk1', icon: FaInstagram, label: 'Instagram' },
    { href: 'https://linkedin.com/yourprofile', icon: FaLinkedinIn, label: 'LinkedIn' },
  ];

  const footerNavLinks = [
    { to: '/privacy-policy', label: 'Privacy Policy' },
    { to: '/terms', label: 'Terms & Conditions' },
    { to: '/complain', label: 'Complain' },
    { to: '/warranty', label: 'Warranty' },
  ];

  const repairServices = [
    { to: '#screen-repair', label: 'Screen Repair', icon: FaMobileAlt },
    { to: '#battery-replacement', label: 'Battery Replacement', icon: FaTools },
    { to: '#water-damage', label: 'Water Damage', icon: FaWrench },
    { to: '#charging-port', label: 'Charging Port Fix', icon: FaTools },
  ];

  const buySellOptions = [
    { to: '#buy-phones', label: 'Buy Phones', icon: FaShoppingCart },
    { to: '#sell-devices', label: 'Sell Your Device', icon: FaDollarSign },
    { to: '#trade-in', label: 'Trade-In Options', icon: FaExchangeAlt },
    { to: '#accessories', label: 'Accessories', icon: FaHeadset },
  ];

  const businessHours = [
    { day: 'Monday - Friday', hours: '9:00 AM - 7:00 PM' },
    { day: 'Saturday', hours: '9:00 AM - 7:00 PM' },
    { day: 'Sunday', hours: '10:00 AM - 5:00 PM' },
  ];

  // Function to handle smooth scrolling
  const scrollToSection = (e, targetId) => {
    e.preventDefault();
    const targetElement = document.querySelector(targetId);
    if (targetElement) {
      window.scrollTo({
        top: targetElement.offsetTop - 100, // Offset for any fixed headers
        behavior: 'smooth'
      });
    }
  };

  return (
    <>
      {/* WhatsApp Floating Action Button */}
      <a
        href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        className="whatsapp-fab"
      >
        <FaWhatsapp size={30} />
      </a>

      {/* Enhanced Footer */}
      <footer className="footer-container">
        <style jsx="true">{`
          /* Footer Styles */
          .footer-container {
            background-color: #1E3A8A;
            color: #FFFFFF;
            font-family: 'Poppins', sans-serif;
            padding: 0;
            width: 100%;
          }

          .footer-wave {
            width: 100%;
            display: block;
            margin-bottom: -5px;
          }

          .footer-content {
            max-width: 1200px;
            margin: 0 auto;
            padding: 3rem 1.5rem 1.5rem;
          }

          .footer-main {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 2rem;
            margin-bottom: 2rem;
          }

          .footer-column h3 {
            color: #FFFFFF;
            font-size: 1.25rem;
            font-weight: 600;
            margin-bottom: 1.25rem;
            position: relative;
            padding-bottom: 0.75rem;
          }

          .footer-column h3::after {
            content: '';
            position: absolute;
            left: 0;
            bottom: 0;
            height: 3px;
            width: 50px;
            background-color: #FFFFFF;
          }

          .logo-column {
            display: flex;
            flex-direction: column;
          }

          .footer-logo {
            font-size: 1.75rem;
            font-weight: 700;
            margin-bottom: 0.75rem;
            color: #FFFFFF;
          }

          .footer-description {
            font-size: 0.95rem;
            line-height: 1.6;
            margin-bottom: 1.5rem;
            color: #E5E7EB;
          }

          .contact-info-item {
            display: flex;
            align-items: flex-start;
            margin-bottom: 1rem;
            color: #E5E7EB;
          }

          .contact-info-item svg {
            margin-right: 0.75rem;
            margin-top: 0.25rem;
            flex-shrink: 0;
          }

          .contact-info-text {
            font-size: 0.9rem;
          }

          .contact-info-text strong {
            display: block;
            color: #FFFFFF;
            margin-bottom: 0.25rem;
          }

          .footer-link-list {
            list-style: none;
            padding: 0;
            margin: 0;
          }

          .footer-link-list li {
            margin-bottom: 0.75rem;
          }

          .footer-link {
            color: #E5E7EB;
            text-decoration: none;
            font-size: 0.95rem;
            transition: color 0.3s ease, transform 0.3s ease;
            display: inline-block;
            position: relative;
            padding-left: 1rem;
          }

          .footer-link::before {
            content: '›';
            position: absolute;
            left: 0;
            transition: transform 0.3s ease;
          }

          .footer-link:hover {
            color: #FFFFFF;
            transform: translateX(4px);
          }

          .footer-link:hover::before {
            transform: translateX(2px);
          }

          .hours-list {
            list-style: none;
            padding: 0;
            margin: 0;
          }

          .hours-item {
            display: flex;
            justify-content: space-between;
            padding: 0.5rem 0;
            border-bottom: 1px dashed rgba(255, 255, 255, 0.2);
          }

          .hours-item:last-child {
            border-bottom: none;
          }

          .hours-day {
            font-weight: 500;
            color: #FFFFFF;
          }

          .hours-time {
            color: #E5E7EB;
          }

          .social-media-links {
            display: flex;
            gap: 1rem;
            margin-top: 1.5rem;
          }

          .social-link {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 38px;
            height: 38px;
            background-color: rgba(255, 255, 255, 0.1);
            color: #FFFFFF;
            border-radius: 50%;
            transition: all 0.3s ease;
          }

          .social-link:hover {
            background-color: #FFFFFF;
            color: #1E3A8A;
            transform: translateY(-3px);
          }

          .footer-bottom {
            text-align: center;
            padding-top: 2rem;
            margin-top: 2rem;
            border-top: 1px solid rgba(255, 255, 255, 0.1);
          }

          .footer-links-container {
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            margin-bottom: 1.5rem;
          }

          .footer-link-item {
            color: #E5E7EB;
            margin: 5px 12px;
            text-decoration: none;
            font-weight: 500;
            font-size: 0.9rem;
            transition: color 0.3s ease;
          }

          .footer-link-item:hover {
            color: #FFFFFF;
          }

          .admin-footer-link {
            color: rgba(255, 255, 255, 0.5);
            font-size: 0.875rem;
            text-decoration: none;
            transition: color 0.3s ease;
          }

          .admin-footer-link:hover {
            color: rgba(255, 255, 255, 0.8);
          }

          .copyright-container {
            font-size: 0.875rem;
            color: #E5E7EB;
            padding-top: 1rem;
          }

          .whatsapp-fab {
            position: fixed;
            width: 60px;
            height: 60px;
            bottom: 30px;
            right: 30px;
            background-color: #25D366;
            color: #FFFFFF;
            border-radius: 50%;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
            z-index: 1000;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s ease;
          }

          .whatsapp-fab:hover {
            transform: scale(1.08) rotate(10deg);
            box-shadow: 0 6px 16px rgba(0, 0, 0, 0.3);
          }

          .service-link {
            display: flex;
            align-items: center;
            color: #E5E7EB;
            text-decoration: none;
            margin-bottom: 0.75rem;
            font-size: 0.95rem;
            transition: transform 0.3s ease;
            cursor: pointer;
          }

          .service-link:hover {
            color: #FFFFFF;
            transform: translateX(4px);
          }

          .service-link svg {
            margin-right: 0.75rem;
            color: #FFFFFF;
          }

          @media (max-width: 768px) {
            .footer-main {
              grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
              gap: 1.5rem;
            }
            
            .footer-column h3 {
              font-size: 1.1rem;
              margin-bottom: 1rem;
            }
            
            .footer-logo {
              font-size: 1.5rem;
            }
          }
        `}</style>

        {/* Optional: Add a wave divider at the top of the footer */}
        <svg className="footer-wave" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 100" preserveAspectRatio="none">
          <path 
            fill="#1E3A8A" 
            fillOpacity="1" 
            d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,48C1120,43,1280,53,1360,58.7L1440,64L1440,100L1360,100C1280,100,1120,100,960,100C800,100,640,100,480,100C320,100,160,100,80,100L0,100Z"
          ></path>
        </svg>

        <div className="footer-content">
          <div className="footer-main">
            {/* Column 1: Logo and Description */}
            <div className="footer-column logo-column">
              <div className="footer-logo">Mobile Care</div>
              <p className="footer-description">
                Your one-stop shop for mobile phone repairs, buying, selling, and trade-in services. Expert technicians, competitive prices, and quick turnaround times. We repair all major brands and offer the best deals on pre-owned devices.
              </p>
              <div className="social-media-links">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    title={social.label}
                    className="social-link"
                  >
                    <social.icon size={18} />
                  </a>
                ))}
              </div>
            </div>

            {/* Column 2: Quick Links */}
            <div className="footer-column">
              <h3>Quick Links</h3>
              <ul className="footer-link-list">
                <li><Link to="/" className="footer-link">Home</Link></li>
                <li><Link to="/about" className="footer-link">About Us</Link></li>
                <li><Link to="/location" className="footer-link">Our Location</Link></li>
                <li><Link to="/contact" className="footer-link">Contact Us</Link></li>
              </ul>
            </div>

            {/* Column 3: Repair Services (with scroll functionality) */}
            <div className="footer-column">
              <h3>Repair Services</h3>
              <ul className="footer-link-list">
                {repairServices.map((service) => (
                  <li key={service.to}>
                    <a 
                      href={service.to} 
                      className="service-link"
                      onClick={(e) => scrollToSection(e, service.to)}
                    >
                      <service.icon size={14} />
                      {service.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 4: Buy & Sell (with scroll functionality) */}
            <div className="footer-column">
              <h3>Buy & Sell</h3>
              <ul className="footer-link-list">
                {buySellOptions.map((option) => (
                  <li key={option.to}>
                    <a 
                      href={option.to} 
                      className="service-link"
                      onClick={(e) => scrollToSection(e, option.to)}
                    >
                      <option.icon size={14} />
                      {option.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 5: Contact Information */}
            <div className="footer-column">
              <h3>Contact Us</h3>
              <div className="contact-info-item">
                <FaMapMarkerAlt size={18} />
                <div className="contact-info-text">
                  <strong>Our Location</strong>
                  48 The Walnuts, Orpington<br />
                  Kent, BR6 0TW<br />
                  Opposite Premier Inn Hotel
                </div>
              </div>
              <div className="contact-info-item">
                <FaPhone size={18} />
                <div className="contact-info-text">
                  <strong>Phone</strong>
                  01689 825549<br />
                  07778381835
                </div>
              </div>
              <div className="contact-info-item">
                <FaEnvelope size={18} />
                <div className="contact-info-text">
                  <strong>Email</strong>
                  support@mobilecare.org.uk
                </div>
              </div>
            </div>

            {/* Column 6: Business Hours */}
            <div className="footer-column">
              <h3>Business Hours</h3>
              <ul className="hours-list">
                {businessHours.map((timeSlot, index) => (
                  <li key={index} className="hours-item">
                    <span className="hours-day">{timeSlot.day}</span>
                    <span className="hours-time">{timeSlot.hours}</span>
                  </li>
                ))}
              </ul>
              <div className="contact-info-item" style={{ marginTop: '1rem' }}>
                <FaClock size={18} />
                <div className="contact-info-text">
                  Walk-ins welcome, appointments preferred
                </div>
              </div>
            </div>
          </div>

          {/* Footer Bottom: Links and Copyright */}
          <div className="footer-bottom">
            <div className="footer-links-container">
              {footerNavLinks.map((link, index) => (
                <React.Fragment key={link.to}>
                  <Link to={link.to} className="footer-link-item">
                    {link.label}
                  </Link>
                  {index < footerNavLinks.length - 1 && <span className="mx-2 text-gray-500">|</span>}
                </React.Fragment>
              ))}
            </div>
            
            {/* Admin link styled differently */}
            <div style={{ margin: '1rem 0' }}>
              <Link to="/admin/login" className="admin-footer-link">Admin Login</Link>
            </div>
            
            <div className="copyright-container">
              &copy; {currentYear} Mobile Care. All rights reserved.
              <div style={{ marginTop: '0.5rem' }}>
                Web app created by <a href="https://softeefi.co.uk" target="_blank" rel="noopener noreferrer" style={{ color: '#FFFFFF', textDecoration: 'underline' }}>Softeefi</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}

export default Footer;