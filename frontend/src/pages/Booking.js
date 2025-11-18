// src/pages/Booking.js
import React, { useState, useEffect, useCallback } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate, Link } from 'react-router-dom';
import { FaInfoCircle } from 'react-icons/fa';

function Booking() {
  const { cartItems, totalPrice } = useCart();
  const navigate = useNavigate();

  // Redirect if cart is empty
  useEffect(() => {
    if (cartItems.length === 0) {
      alert('Your cart is empty. Please add repairs before booking.');
      navigate('/');
    }
  }, [cartItems, navigate]);

  // Form state management
  const [formData, setFormData] = useState({
    date: '', time: '', name: '', email: '', phone: '',
    street: '', city: '', postcode: '',
  });
  const [loading, setLoading] = useState(false); // Loading state for submission

  // Load/Save form data from/to localStorage
  useEffect(() => {
    const storedForm = localStorage.getItem('bookingForm');
    if (storedForm) {
      try {
          const parsed = JSON.parse(storedForm);
          if (typeof parsed === 'object' && parsed !== null) {
              const relevantData = Object.keys(formData).reduce((acc, key) => {
                  if (parsed.hasOwnProperty(key)) { acc[key] = parsed[key]; }
                  return acc;
              }, {});
              setFormData(prev => ({ ...prev, ...relevantData }));
          } else { localStorage.removeItem('bookingForm'); }
      } catch (error) { console.error("Failed to parse booking form", error); localStorage.removeItem('bookingForm'); }
    }
  }, []); // Run only on mount

  useEffect(() => {
    localStorage.setItem('bookingForm', JSON.stringify(formData));
  }, [formData]);

  // Date/Time constraints
  const todayDate = new Date().toISOString().split('T')[0];
  const isToday = formData.date === todayDate;
  const minTime = isToday ? new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false }) : '';

  // Packaging fee logic
  const packagingFee = 0;
  const newTotal = totalPrice + packagingFee;

  // Input change handler
  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Form submission handler
  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    if (loading) return; // Prevent double submission
    setLoading(true);

    const address = `${formData.street}, ${formData.city}, ${formData.postcode}`;
    const payload = {
      bookingData: { ...formData, address, date: new Date(formData.date).toISOString() },
      cartItems: cartItems.map(item => ({ ...item, cost: Number(item.cost) })),
      totalPrice: Number(totalPrice) + packagingFee,
      packagingFee,
    };
    localStorage.setItem('bookingInfo', JSON.stringify(payload));
    localStorage.removeItem('bookingForm');
    navigate('/payment');
  }, [formData, cartItems, totalPrice, packagingFee, navigate, loading]);

  // Render null or a loading indicator if cart is empty
  if (cartItems.length === 0) {
      return <div style={loadingOverlayStyle}>Redirecting...</div>;
  }

  return (
    <main className="page-container booking-page container py-5">
      <header className="text-center mb-5">
        <h1 className="display-4" style={{ color: '#1E3A8A', fontWeight: 'bold' }}>Book Your Repair</h1>
        <p className="lead text-muted">Confirm your repair items and schedule a convenient time.</p>
      </header>

      {/* Cart Summary Section */}
      <section className="cart-summary mb-5 p-4" style={{...sectionStyle, border: '1px solid #e5e7eb'}}>
         <h2 style={{...sectionHeadingStyle, color: '#1E3A8A'}}>Your Selected Repairs</h2>
         <ul style={{ listStyle: 'none', padding: 0, marginBottom: '1rem' }}>
           {cartItems.map((item, idx) => (
             <li key={item.id || idx} style={{...cartItemStyle, borderBottom: '1px solid #e5e7eb'}}>
               {item.image && (<img src={item.image} alt="" style={cartItemImageStyle} />)}
               <span style={{ flexGrow: 1, color: '#1f2937' }}><strong>{item.name}</strong></span>
               <span style={{ color: '#1E3A8A', fontWeight: '500' }}>£{item.cost.toFixed(2)}</span>
             </li>
           ))}
         </ul>
         <hr style={{ borderColor: '#e5e7eb' }}/>
         <hr style={{ borderColor: '#e5e7eb' }}/>
         <div style={{...totalsStyle, fontWeight: 'bold', fontSize: '1.2rem', color: '#1E3A8A'}}>
            <span>Total Amount Due:</span><span>£{totalPrice.toFixed(2)}</span>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works mb-5 p-4" style={{...sectionStyle, border: '1px solid #e5e7eb'}}>
         <h2 style={{...sectionHeadingStyle, color: '#1E3A8A'}} className="text-center mb-3">How It Works</h2>
         <div style={howItWorksStepsContainer}>
             <div style={{...howItWorksStep, backgroundColor: '#f8fbff', border: '1px solid #e5e7eb'}}><span style={{...stepNumberStyle, backgroundColor: '#1E3A8A'}}>1</span>Fill in your details and preferred date/time below.</div>
             <div style={{...howItWorksStep, backgroundColor: '#f8fbff', border: '1px solid #e5e7eb'}}><span style={{...stepNumberStyle, backgroundColor: '#1E3A8A'}}>2</span>Proceed to our secure payment page.</div>
             <div style={{...howItWorksStep, backgroundColor: '#f8fbff', border: '1px solid #e5e7eb'}}><span style={{...stepNumberStyle, backgroundColor: '#1E3A8A'}}>3</span>Receive booking confirmation via email.</div>
             <div style={{...howItWorksStep, backgroundColor: '#f8fbff', border: '1px solid #e5e7eb'}}><span style={{...stepNumberStyle, backgroundColor: '#1E3A8A'}}>4</span>Bring in or send your device for repair!</div>
        </div>
      </section>

      {/* Booking Form Section */}
      <section className="booking-form-section">
        <h2 style={{...sectionHeadingStyle, color: '#1E3A8A'}} className="mb-3">Schedule Your Appointment</h2>
        <div className="p-4" style={{...sectionStyle, border: '1px solid #e5e7eb'}}>
          <form className="booking-form" onSubmit={handleSubmit}>
            {/* Date/Time Fields */}
            <div className="row mb-3">
              <div className="col-md-6 mb-3 mb-md-0">
                <label htmlFor="date" className="form-label" style={{...labelStyle, color: '#1E3A8A'}}>Preferred Date *</label>
                <input type="date" id="date" name="date" className="form-control" style={{...inputStyle, borderColor: '#e5e7eb'}} required min={todayDate} value={formData.date} onChange={handleChange}/>
              </div>
              <div className="col-md-6">
                <label htmlFor="time" className="form-label" style={{...labelStyle, color: '#1E3A8A'}}>Preferred Time *</label>
                <input type="time" id="time" name="time" className="form-control" style={{...inputStyle, borderColor: '#e5e7eb'}} required min={minTime} value={formData.time} onChange={handleChange}/>
              </div>
            </div>

             {/* Contact Info Fields */}
             <h3 style={{...sectionHeadingStyle, fontSize: '1.2rem', marginTop: '2rem', marginBottom: '1rem', color: '#1E3A8A' }}>Contact Information</h3>
             <div className="mb-3">
               <label htmlFor="name" className="form-label" style={{...labelStyle, color: '#1E3A8A'}}>Full Name *</label>
               <input type="text" id="name" name="name" className="form-control" style={{...inputStyle, borderColor: '#e5e7eb'}} placeholder="John Doe" required value={formData.name} onChange={handleChange}/>
             </div>
             <div className="row mb-3">
                  <div className="col-md-6 mb-3 mb-md-0">
                     <label htmlFor="email" className="form-label" style={{...labelStyle, color: '#1E3A8A'}}>Email *</label>
                     <input type="email" id="email" name="email" className="form-control" style={{...inputStyle, borderColor: '#e5e7eb'}} placeholder="you@example.com" required value={formData.email} onChange={handleChange}/>
                  </div>
                   <div className="col-md-6">
                     <label htmlFor="phone" className="form-label" style={{...labelStyle, color: '#1E3A8A'}}>Phone *</label>
                     <input type="tel" id="phone" name="phone" className="form-control" style={{...inputStyle, borderColor: '#e5e7eb'}} placeholder="e.g., 07123 456789" required value={formData.phone} onChange={handleChange}/>
                  </div>
             </div>

             {/* Address Fields */}
              <h3 style={{...sectionHeadingStyle, fontSize: '1.2rem', marginTop: '2rem', marginBottom: '1rem', color: '#1E3A8A' }}>Address</h3>
             <div className="mb-3">
               <label htmlFor="street" className="form-label" style={{...labelStyle, color: '#1E3A8A'}}>Street Address *</label>
               <input type="text" id="street" name="street" className="form-control" style={{...inputStyle, borderColor: '#e5e7eb'}} placeholder="123 Main Street" required value={formData.street} onChange={handleChange}/>
             </div>
              <div className="row mb-3">
                 <div className="col-md-6 mb-3 mb-md-0">
                     <label htmlFor="city" className="form-label" style={{...labelStyle, color: '#1E3A8A'}}>City *</label>
                     <input type="text" id="city" name="city" className="form-control" style={{...inputStyle, borderColor: '#e5e7eb'}} placeholder="London" required value={formData.city} onChange={handleChange}/>
                 </div>
                 <div className="col-md-6">
                     <label htmlFor="postcode" className="form-label" style={{...labelStyle, color: '#1E3A8A'}}>Postcode *</label>
                     <input type="text" id="postcode" name="postcode" className="form-control" style={{...inputStyle, borderColor: '#e5e7eb'}} placeholder="SW1A 0AA" required value={formData.postcode} onChange={handleChange}/>
                 </div>
             </div>

            {/* Submit Button */}
            <div className="text-center mt-4">
                 <button
                   type="submit"
                   style={{
                       ...submitButtonStyleBase,
                       background: loading ? '#6b7280' : '#1E3A8A',
                       borderColor: loading ? '#6b7280' : '#1E3A8A',
                       cursor: loading ? 'not-allowed' : 'pointer',
                       opacity: loading ? 0.7 : 1,
                   }}
                   disabled={loading}
                 >
                   {loading ? 'Processing...' : 'Proceed to Payment'}
                 </button>
            </div>
          </form>
        </div>
      </section>
    </main>
  );
}

// --- Styles defined outside component ---

// Base style for the main submit button (matching website theme)
const bwButtonStyle = {
    display: 'inline-block', 
    alignItems: 'center', 
    background: '#1E3A8A', // Website theme color
    color: '#fff',
    border: '1px solid #1E3A8A', // Website theme color
    borderRadius: '8px',
    padding: '0.75rem 1.5rem',
    cursor: 'pointer', 
    fontSize: '1rem', 
    textDecoration: 'none', 
    fontWeight: '500',
    transition: 'all 0.2s ease', 
    textAlign: 'center',
};

// Specific styles for this page's submit button
const submitButtonStyleBase = {
    ...bwButtonStyle,
    fontSize: '1.1rem',
    padding: '0.8rem 2rem',
    boxShadow: '0 2px 4px rgba(30, 58, 138, 0.2)', // Website theme shadow
};

// Updated styles for the website theme
const sectionStyle = { 
    borderRadius: '12px',
    backgroundColor: '#fff',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)',
};

const sectionHeadingStyle = { 
    fontSize: '1.4rem', 
    fontWeight: '600', 
    marginBottom: '1rem' 
};

const cartItemStyle = { 
    marginBottom: '1rem', 
    paddingBottom: '1rem', 
    display: 'flex', 
    alignItems: 'center', 
    gap: '1rem' 
};

const cartItemImageStyle = { 
    width: '50px', 
    height: '50px', 
    objectFit: 'cover', 
    borderRadius: '8px',
    flexShrink: 0,
    border: '1px solid #e5e7eb',
};

const totalsStyle = { 
    display: 'flex', 
    justifyContent: 'space-between', 
    marginBottom: '0.5rem', 
    color: '#1f2937',
    fontSize: '1rem' 
};

const feeExplanationStyle = { 
    fontSize: '0.85rem', 
    color: '#4b5563',
    marginTop: '0.75rem', 
    display: 'flex', 
    alignItems: 'center' 
};

const howItWorksStepsContainer = { 
    display: 'flex', 
    flexDirection: 'column', 
    gap: '0.75rem' 
};

const howItWorksStep = { 
    padding: '0.75rem 1rem', 
    borderRadius: '8px',
    color: '#1f2937',
    display: 'flex', 
    alignItems: 'center' 
};

const stepNumberStyle = { 
    display: 'inline-flex', 
    justifyContent: 'center', 
    alignItems: 'center', 
    width: '24px', 
    height: '24px', 
    borderRadius: '50%', 
    color: '#fff', 
    fontWeight: 'bold', 
    marginRight: '10px', 
    flexShrink: 0 
};

const labelStyle = { 
    fontWeight: '500', 
    marginBottom: '0.3rem', 
    display: 'block' 
};

const inputStyle = {
    borderRadius: '8px',
    padding: '0.65rem 0.75rem',
    transition: 'all 0.2s ease',
};

const loadingOverlayStyle = { 
    position: 'fixed', 
    top: 0, 
    left: 0, 
    width: '100%', 
    height: '100%', 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: 'rgba(255, 255, 255, 0.8)', 
    color: '#1E3A8A', // Website theme color
    fontSize: '1.5rem', 
    zIndex: 1100 
};

// Add CSS for focus and hover effects
document.head.insertAdjacentHTML('beforeend', `
<style>
  .booking-page input.form-control:focus {
    border-color: #1E3A8A !important;
    box-shadow: 0 0 0 3px rgba(30, 58, 138, 0.25) !important;
  }
  
  .booking-page button[type="submit"]:hover:not(:disabled) {
    background-color: #1d4ed8 !important;
    border-color: #1d4ed8 !important;
  }
  
  .booking-page .how-it-works-step:hover {
    background-color: #e8f0fe !important;
  }
</style>
`);

export default Booking;