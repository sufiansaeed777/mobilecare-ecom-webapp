// src/pages/Contact.js
import React, { useState, useEffect, useCallback } from 'react';
import TechRepairAnimation from '../components/TechRepairAnimation';

function Contact() {
  const [isSmallDevice, setIsSmallDevice] = useState(window.innerWidth < 768);
  const [name, setName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitHovered, setIsSubmitHovered] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsSmallDevice(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleSubmit = useCallback(async (e) => {
      e.preventDefault(); 
      if (isSubmitting) return; 
      setIsSubmitting(true);
      setSuccessMsg(''); 
      setErrorMsg('');
      
      if (!name || !userEmail || !message) { 
        setErrorMsg('Please fill out all required fields'); 
        setIsSubmitting(false); 
        return; 
      }
      
      try {
          const response = await fetch('/api/contact', { 
            method: 'POST', 
            headers: { 'Content-Type': 'application/json' }, 
            body: JSON.stringify({ name, email: userEmail, phone, message }), 
          });
          const data = await response.json();
          
          if (response.ok && data.success) { 
            setSuccessMsg('Message sent successfully! We\'ll get back to you soon.'); 
            setName(''); 
            setUserEmail(''); 
            setPhone(''); 
            setMessage(''); 
          } else { 
            setErrorMsg(data.error || `Request failed: ${response.status}`); 
          }
      } catch (err) { 
        console.error('Contact form error:', err); 
        setErrorMsg('Could not send message. Please try again or contact us directly.'); 
      } finally { 
        setIsSubmitting(false); 
      }
  }, [name, userEmail, phone, message, isSubmitting]);

  // --- Style Definitions ---

  // Main page wrapper
  const pageWrapperStyle = {
      display: 'flex',
      flexDirection: isSmallDevice ? 'column' : 'row',
      backgroundColor: '#fff',
      fontFamily: "'Poppins', sans-serif", // Added Poppins font
      minHeight: '100vh',
  };

  // Animation column
  const animationContainerStyle = {
      flexBasis: isSmallDevice ? '0' : '50%',
      display: isSmallDevice ? 'none' : 'block',
      flexShrink: 0,
      position: 'relative',
      overflow: 'hidden',
      backgroundColor: '#1E3A8A', // Dark blue background for animation
  };

  // Content column
  const contentContainerStyle = {
      flexBasis: isSmallDevice ? '100%' : '50%',
      flexShrink: 0,
      padding: '2rem 1.5rem 3rem 1.5rem',
      backgroundColor: '#fff',
      zIndex: 1,
  };

  // Button styles
  const bwButtonStyle = {
      display: 'inline-block', 
      background: '#1E3A8A', // Changed to dark blue
      color: '#fff', 
      border: '1px solid #1E3A8A', // Changed to dark blue
      borderRadius: '4px', 
      padding: '0.75rem 1.5rem', 
      cursor: 'pointer', 
      fontSize: '1rem',
      textDecoration: 'none', 
      fontWeight: '500',
      transition: 'background-color 0.2s ease-in-out, color 0.2s ease-in-out, border-color 0.2s ease-in-out, opacity 0.2s',
      textAlign: 'center',
      fontFamily: "'Poppins', sans-serif",
  };
  
  const bwButtonStyleHover = { 
    background: '#fff', 
    color: '#1E3A8A', // Changed to dark blue
    borderColor: '#1E3A8A', // Changed to dark blue
  };
  
  const submitButtonStyle = {
      ...bwButtonStyle,
      ...(isSubmitHovered && !isSubmitting ? bwButtonStyleHover : {}),
      cursor: isSubmitting ? 'not-allowed' : 'pointer',
      opacity: isSubmitting ? 0.7 : 1,
  };

  // Other styles
  const titleStyle = {
    color: '#1E3A8A', // Changed to dark blue
    fontSize: '2.5rem',
    fontWeight: '600',
    marginBottom: '1rem',
  };

  const sectionTitleStyle = {
    color: '#1E3A8A', // Changed to dark blue
    fontSize: '1.8rem',
    fontWeight: '600',
    marginBottom: '1rem',
    marginTop: '2rem',
  };

  const labelStyle = { 
    fontWeight: 'bold', 
    marginBottom: '0.3rem', 
    display: 'block', 
    color: '#1E3A8A' // Changed to dark blue
  };
  
  const inputStyle = { 
    display: 'block', 
    width: '100%', 
    padding: '.375rem .75rem', 
    fontSize: '1rem', 
    fontWeight: 400, 
    lineHeight: 1.5, 
    color: '#1E3A8A', // Changed to dark blue
    backgroundColor: '#fff', 
    backgroundClip: 'padding-box', 
    border: '1px solid #c2d7f8', 
    appearance: 'none', 
    borderRadius: '.25rem', 
    transition: 'border-color .15s ease-in-out,box-shadow .15s ease-in-out', 
    marginBottom: '1rem',
    fontFamily: "'Poppins', sans-serif",
  };
  
  const textAreaStyle = { 
    ...inputStyle, 
    height: 'auto', 
    minHeight: 'calc(1.5em + .75rem + 2px)',
    resize: 'vertical',
  };
  
  const infoListStyle = { 
    margin: 0, 
    padding: 0, 
    listStyle: 'none' 
  };
  
  const infoRowStyle = { 
    display: 'flex', 
    marginBottom: '0.75rem', 
    lineHeight: '1.5', 
    flexWrap: 'wrap' 
  };
  
  infoRowStyle.dt = { 
    fontWeight: 'bold', 
    width: '100px', 
    flexShrink: 0, 
    color: '#1E3A8A', // Changed to dark blue
    paddingRight: '10px', 
  };
  
  infoRowStyle.dd = { 
    margin: 0, 
    color: '#1E3A8A', // Changed to dark blue
    flexGrow: 1, 
  };
  
  const alertBaseStyle = { 
    padding: '1rem', 
    marginBottom: '1rem', 
    border: '1px solid transparent', 
    borderRadius: '4px', 
    textAlign: 'center', 
    fontWeight: '500',
    fontFamily: "'Poppins', sans-serif",
  };
  
  const alertSuccessStyle = { 
    ...alertBaseStyle, 
    color: '#1E3A8A', // Changed to dark blue
    backgroundColor: '#e8f0fe', 
    borderColor: '#c2d7f8', 
  };
  
  const alertErrorStyle = { 
    ...alertBaseStyle, 
    color: '#dc3545', 
    backgroundColor: '#f8d7da', 
    borderColor: '#f5c6cb', 
  };

  const descriptionStyle = {
    fontSize: '1.1rem',
    color: '#1E3A8A', // Changed to dark blue
    marginBottom: '2rem',
    lineHeight: '1.6',
  };

  return (
    <div style={pageWrapperStyle}>
       {/* Content Area (Left half on Desktop, Full on Mobile) */}
       <div style={contentContainerStyle}>
          <h1 style={titleStyle}>Contact Mobile Care</h1>
          <p style={descriptionStyle}>
              Have a question, need a quote, or want to book a service?
              Use the form below or contact us directly. We're here to help with all your device repair needs.
          </p>

          {successMsg && <div style={alertSuccessStyle}>{successMsg}</div>}
          {errorMsg && <div style={alertErrorStyle}>{errorMsg}</div>}

          <section className="contact-form-section">
            <h2 style={sectionTitleStyle}>Send Us a Message</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="name" style={labelStyle}>Name *</label>
                    <input 
                      type="text" 
                      id="name" 
                      placeholder="Enter your full name" 
                      style={inputStyle} 
                      required 
                      value={name} 
                      onChange={(e) => setName(e.target.value)} 
                    />
                </div>
                
                <div className="mb-3">
                   <label htmlFor="email" style={labelStyle}>Email *</label>
                   <input 
                     type="email" 
                     id="email" 
                     placeholder="Enter your email address" 
                     style={inputStyle} 
                     required 
                     value={userEmail} 
                     onChange={(e) => setUserEmail(e.target.value)} 
                   />
                 </div>
                 
                 <div className="mb-3">
                   <label htmlFor="phone" style={labelStyle}>Phone</label>
                   <input 
                     type="tel" 
                     id="phone" 
                     placeholder="Enter your phone number" 
                     style={inputStyle} 
                     value={phone} 
                     onChange={(e) => setPhone(e.target.value)} 
                   />
                 </div>
                 
                 <div className="mb-3">
                   <label htmlFor="message" style={labelStyle}>Message *</label>
                   <textarea 
                     id="message" 
                     rows="5" 
                     placeholder="Describe your device issue, repair needs, or question in detail..." 
                     style={textAreaStyle} 
                     required 
                     value={message} 
                     onChange={(e) => setMessage(e.target.value)} 
                   />
                 </div>

                <button 
                  type="submit" 
                  style={submitButtonStyle} 
                  disabled={isSubmitting} 
                  onMouseEnter={() => setIsSubmitHovered(true)} 
                  onMouseLeave={() => setIsSubmitHovered(false)}
                >
                    {isSubmitting ? 'Sending Message...' : 'Send Message'}
                </button>
            </form>
          </section>

          <section className="contact-info">
            <h2 style={sectionTitleStyle}>Get In Touch Directly</h2>
            <dl style={infoListStyle}>
                 <div style={infoRowStyle}>
                   <dt style={infoRowStyle.dt}>Phone:</dt>
                   <dd style={infoRowStyle.dd}>
                     <a href="tel:01689825549" style={{color: '#1E3A8A', textDecoration: 'none'}}>01689 825549</a> | 
                     <a href="tel:07778381835" style={{color: '#1E3A8A', textDecoration: 'none', marginLeft: '5px'}}>07778381835</a>
                   </dd>
                 </div>
                 
                 <div style={infoRowStyle}>
                   <dt style={infoRowStyle.dt}>Email:</dt>
                   <dd style={infoRowStyle.dd}>
                     <a href="mailto:ask.mobilecare@outlook.com" style={{color: '#1E3A8A', textDecoration: 'none'}}>
                       ask.mobilecare@outlook.com
                     </a>
                   </dd>
                 </div>
                 
                 <div style={infoRowStyle}>
                   <dt style={infoRowStyle.dt}>Hours:</dt>
                   <dd style={infoRowStyle.dd}>
                     Monday & Saturday: 9:00 AM - 7:00 PM<br/>
                     Sunday: 10:00 AM - 5:00 PM<br/>
                     <em style={{fontSize: '0.9rem', color: '#6B7280'}}>Walk-ins welcome, call ahead advised</em>
                   </dd>
                 </div>
                 
                 <div style={infoRowStyle}>
                   <dt style={infoRowStyle.dt}>Services:</dt>
                   <dd style={infoRowStyle.dd}>
                     Mail-in repairs available<br/>
                     Micro soldering specialists<br/>
                     Glass-only repairs for Apple devices
                   </dd>
                 </div>
            </dl>
          </section>
      </div>
      
      {/* Enhanced Tech Animation (Right half on Desktop) */}
      {!isSmallDevice && (
        <div style={animationContainerStyle}>
          <TechRepairAnimation />
        </div>
      )}
    </div>
  );
}

export default Contact;