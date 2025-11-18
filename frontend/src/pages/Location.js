// src/pages/Location.js
import React from 'react';
import { FaMapMarkerAlt, FaPhoneAlt, FaClock, FaExternalLinkAlt, FaInfoCircle, FaEnvelope, FaDirections } from 'react-icons/fa';
import { Link } from 'react-router-dom';

function Location() {
  // Google Maps embed URL - Updated with your provided link
  const googleMapsEmbedUrl =
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d159385.68798337603!2d-0.2029667054687177!3d51.37730080000001!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4171ca18e4378fc3%3A0x11dd870f636ee8b2!2sMobile%20care!5e0!3m2!1sen!2suk!4v1749008570661!5m2!1sen!2suk"; // <<< UPDATED EMBED URL

  // URL for "Open in Google Maps" link - Updated with your provided link
  const googleMapsDirectUrl = "https://maps.app.goo.gl/KJdKXaRCXBhPKrmV6"; // <<< UPDATED DIRECTIONS URL

  return (
    <div className="location-page" style={pageStyle}>
      {/* Hero Section with Map */}
      <section style={heroSectionStyle}>
        <div style={heroOverlayStyle}>
          <h1 style={heroTitleStyle}>Visit mobile care</h1>
          <p style={heroSubtitleStyle}>Your Expert in Device Care and Repair</p>
          <a
            href={googleMapsDirectUrl} // This now uses the direct link you provided
            target="_blank"
            rel="noopener noreferrer"
            style={directionsButtonStyle}
            onMouseOver={(e) => {
              e.target.style.backgroundColor = '#fff';
              e.target.style.color = '#1E3A8A';
            }}
            onMouseOut={(e) => {
              e.target.style.backgroundColor = '#1E3A8A';
              e.target.style.color = '#fff';
            }}
          >
            <FaDirections style={{marginRight: '8px'}} /> Get Directions
          </a>
        </div>
        <div style={mapWrapperStyle}>
          <iframe
            title="mobile care - Location"
            width="100%"
            height="100%"
            frameBorder="0"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            src={googleMapsEmbedUrl} // This now uses the direct embed link you provided
          ></iframe>
        </div>
      </section>

      {/* Info Cards Section */}
      <section style={cardsSectionStyle}>
        <div style={cardsContainerStyle}>
          {/* Hours Card */}
          <div style={cardStyle}>
            <div style={cardIconContainerStyle}>
              <FaClock style={cardIconStyle} />
            </div>
            <h3 style={cardTitleStyle}>Opening Hours</h3>
            <div style={cardContentStyle}>
              <div style={timeItemStyle}>
                <span style={dayStyle}>Monday & Saturday</span>
                <span style={timeStyle}>9:00 AM - 7:00 PM</span>
              </div>
              <div style={timeItemStyle}>
                <span style={dayStyle}>Sunday</span>
                <span style={timeStyle}>10:00 AM - 5:00 PM</span>
              </div>
              <div style={timeItemStyle}>
                <span style={dayStyle}>Tuesday - Friday</span>
                <span style={timeStyle}>9:00 AM - 7:00 PM</span>
              </div>
            </div>
          </div>

          {/* Contact Card */}
          <div style={cardStyle}>
            <div style={cardIconContainerStyle}>
              <FaPhoneAlt style={cardIconStyle} />
            </div>
            <h3 style={cardTitleStyle}>Contact Us</h3>
            <div style={cardContentStyle}>
              <div style={contactItemStyle}>
                <FaPhoneAlt style={contactIconStyle} />
                <a href="tel:01689825549" style={contactLinkStyle}>
                  01689 825549
                </a>
              </div>
              <div style={contactItemStyle}>
                <FaPhoneAlt style={contactIconStyle} />
                <a href="tel:07778381835" style={contactLinkStyle}>
                  07778381835
                </a>
              </div>
              <div style={contactItemStyle}>
                <FaEnvelope style={contactIconStyle} />
                <a href="mailto:ask.mobilecare@outlook.com" style={contactLinkStyle}>
                  ask.mobilecare@outlook.com
                </a>
              </div>
            </div>
          </div>

          {/* Store Info Card */}
          <div style={cardStyle}>
            <div style={cardIconContainerStyle}>
              <FaInfoCircle style={cardIconStyle} />
            </div>
            <h3 style={cardTitleStyle}>Store Information</h3>
            <div style={cardContentStyle}>
              <p style={infoTextStyle}>
                mobile care provides expert repair services with 20+ years of experience. We specialize in micro soldering, glass-only repairs, and use state-of-the-art equipment.
              </p>
              <Link to="/contact" style={contactButtonStyle}>
                Send a Message
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Services Highlight Section */}
      <section style={servicesSectionStyle}>
        <h2 style={servicesTitleStyle}>Our Services</h2>
        <div style={servicesItemsStyle}>
          <div style={serviceItemStyle}>
            <h3 style={serviceSubtitleStyle}>Walk-ins Welcome</h3>
            <p style={serviceTextStyle}>
              No appointment necessary, but calling ahead is advised to ensure availability.
            </p>
          </div>
          <div style={serviceItemStyle}>
            <h3 style={serviceSubtitleStyle}>Mail-in Repairs</h3>
            <p style={serviceTextStyle}>
              Can't visit our store? We offer secure mail-in repair services for your convenience.
            </p>
          </div>
          <div style={serviceItemStyle}>
            <h3 style={serviceSubtitleStyle}>Specialized Equipment</h3>
            <p style={serviceTextStyle}>
              Thousands invested in screen refurbishing equipment and microsoldering lab for precision repairs.
            </p>
          </div>
        </div>
      </section>

      {/* Getting Here Section */}
      <section style={transportSectionStyle}>
        <h2 style={transportTitleStyle}>Getting Here</h2>
        <div style={transportItemsStyle}>
          <div style={transportItemStyle}>
            <h3 style={transportSubtitleStyle}>By Public Transport</h3>
            <p style={transportTextStyle}>
              Accessible by various bus routes and local transport options. Check local schedules for the most convenient route.
            </p>
          </div>
          <div style={transportItemStyle}>
            <h3 style={transportSubtitleStyle}>By Car</h3>
            <p style={transportTextStyle}>
              Parking available nearby. Please check for any parking restrictions or fees in the area.
            </p>
          </div>
          <div style={transportItemStyle}>
            <h3 style={transportSubtitleStyle}>Mail-in Service</h3>
            <p style={transportTextStyle}>
              Can't make it to our location? We offer secure mail-in repair services across the UK.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

// --- Styled Components ---
const pageStyle = {
  fontFamily: "'Poppins', sans-serif",
  color: '#1E3A8A',
  backgroundColor: '#fff',
};

// (The rest of your styles remain the same)
// ...
const heroSectionStyle = {
  position: 'relative',
  width: '100%',
  height: '500px',
  marginBottom: '3rem',
};

const heroOverlayStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  zIndex: 2,
  textAlign: 'center',
  backgroundColor: 'rgba(255, 255, 255, 0.95)',
  padding: '2rem',
  borderRadius: '8px',
  boxShadow: '0 4px 20px rgba(30, 58, 138, 0.15)',
  maxWidth: '90%',
  width: '500px',
  border: '1px solid #1E3A8A',
};

const heroTitleStyle = {
  fontSize: '2.5rem',
  fontWeight: 'bold',
  color: '#1E3A8A',
  marginBottom: '1rem',
};

const heroSubtitleStyle = {
  fontSize: '1.1rem',
  color: '#1E3A8A',
  marginBottom: '1.5rem',
};

const directionsButtonStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: '#1E3A8A',
  color: '#fff',
  fontWeight: '500',
  fontSize: '1rem',
  padding: '0.75rem 1.5rem',
  borderRadius: '4px',
  textDecoration: 'none',
  border: '2px solid #1E3A8A',
  transition: 'all 0.3s ease',
};

const mapWrapperStyle = {
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  zIndex: 1,
};

const cardsSectionStyle = {
  padding: '0 2rem 3rem 2rem',
  maxWidth: '1200px',
  margin: '0 auto',
};

const cardsContainerStyle = {
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'center',
  gap: '2rem',
};

const cardStyle = {
  flex: '1 1 300px',
  maxWidth: '350px',
  backgroundColor: '#fff',
  borderRadius: '8px',
  overflow: 'hidden',
  boxShadow: '0 4px 10px rgba(30, 58, 138, 0.1)',
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: '2rem',
  border: '1px solid #e8f0fe',
};

const cardIconContainerStyle = {
  width: '70px',
  height: '70px',
  borderRadius: '50%',
  backgroundColor: '#e8f0fe',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: '1.5rem',
};

const cardIconStyle = {
  fontSize: '32px',
  color: '#1E3A8A',
};

const cardTitleStyle = {
  fontSize: '1.5rem',
  fontWeight: '600',
  color: '#1E3A8A',
  marginBottom: '1.5rem',
  textAlign: 'center',
};

const cardContentStyle = {
  width: '100%',
};

const timeItemStyle = {
  marginBottom: '0.8rem',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
};

const dayStyle = {
  fontWeight: '600',
  color: '#1E3A8A',
  marginBottom: '5px',
};

const timeStyle = {
  color: '#1E3A8A',
};

const contactItemStyle = {
  display: 'flex',
  alignItems: 'center',
  marginBottom: '1rem',
  justifyContent: 'center',
};

const contactIconStyle = {
  color: '#1E3A8A',
  marginRight: '10px',
  fontSize: '18px',
};

const contactLinkStyle = {
  color: '#1E3A8A',
  textDecoration: 'none',
  fontWeight: '500',
  transition: 'color 0.2s ease',
};

const infoTextStyle = {
  textAlign: 'center',
  marginBottom: '1.5rem',
  lineHeight: '1.6',
  color: '#1E3A8A',
};

const contactButtonStyle = {
  display: 'block',
  width: '100%',
  padding: '0.75rem',
  backgroundColor: '#1E3A8A',
  color: '#fff',
  textAlign: 'center',
  borderRadius: '4px',
  textDecoration: 'none',
  fontWeight: '500',
  transition: 'background-color 0.3s ease',
  border: '2px solid #1E3A8A',
};

const servicesSectionStyle = {
  backgroundColor: '#e8f0fe',
  padding: '3rem 2rem',
  marginTop: '2rem',
};

const servicesTitleStyle = {
  fontSize: '2rem',
  fontWeight: 'bold',
  color: '#1E3A8A',
  marginBottom: '2rem',
  textAlign: 'center',
};

const servicesItemsStyle = {
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'center',
  gap: '2rem',
  maxWidth: '1200px',
  margin: '0 auto',
};

const serviceItemStyle = {
  flex: '1 1 300px',
  backgroundColor: '#fff',
  padding: '1.5rem',
  borderRadius: '8px',
  boxShadow: '0 2px 6px rgba(30, 58, 138, 0.1)',
  border: '1px solid #c2d7f8',
};

const serviceSubtitleStyle = {
  fontSize: '1.2rem',
  fontWeight: '600',
  color: '#1E3A8A',
  marginBottom: '0.75rem',
};

const serviceTextStyle = {
  color: '#1E3A8A',
  lineHeight: '1.6',
};

const transportSectionStyle = {
  backgroundColor: '#fff',
  padding: '3rem 2rem',
  marginTop: '2rem',
};

const transportTitleStyle = {
  fontSize: '2rem',
  fontWeight: 'bold',
  color: '#1E3A8A',
  marginBottom: '2rem',
  textAlign: 'center',
};

const transportItemsStyle = {
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'center',
  gap: '2rem',
  maxWidth: '1200px',
  margin: '0 auto',
};

const transportItemStyle = {
  flex: '1 1 300px',
  backgroundColor: '#e8f0fe',
  padding: '1.5rem',
  borderRadius: '8px',
  boxShadow: '0 2px 6px rgba(30, 58, 138, 0.1)',
  border: '1px solid #c2d7f8',
};

const transportSubtitleStyle = {
  fontSize: '1.2rem',
  fontWeight: '600',
  color: '#1E3A8A',
  marginBottom: '0.75rem',
};

const transportTextStyle = {
  color: '#1E3A8A',
  lineHeight: '1.6',
};

export default Location;