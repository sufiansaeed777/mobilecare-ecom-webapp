// src/pages/Complain.js
import React, { useState } from 'react';

function Complain() {
  // State for each form field
  const [orderNumber, setOrderNumber] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [issueDetails, setIssueDetails] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSuccessMessage('');
    setErrorMessage('');

    // Basic client-side validation example (can be expanded)
    if (!orderNumber.trim() || !name.trim() || !email.trim() || !issueDetails.trim()) {
        setErrorMessage('All fields are required.');
        setIsSubmitting(false);
        return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
        setErrorMessage('Please enter a valid email address.');
        setIsSubmitting(false);
        return;
    }

    try {
      const response = await fetch('/api/complain', { // This endpoint needs to be implemented on your backend
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderNumber,
          name,
          email,
          issueDetails,
        }),
      });

      // Check if the response is successful, otherwise parse as text for potential HTML error pages
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(response.statusText || errorText || 'Server responded with an error');
      }
      
      const data = await response.json();

      if (data.success) { // Assuming your backend responds with { success: true } or { success: false, error: "message" }
        setSuccessMessage('Your complaint has been submitted. We’ll be in touch within 1-2 business days.');
        setOrderNumber('');
        setName('');
        setEmail('');
        setIssueDetails('');
      } else {
        setErrorMessage(`Error: ${data.error || 'Unable to submit complaint. Please try again.'}`);
      }
    } catch (err) {
      console.error('Complaint submission error:', err);
      setErrorMessage('An unexpected error occurred. Please try again later or contact us directly.');
    }

    setIsSubmitting(false);
  };

  // Styles consistent with the theme
  const pageContainerStyle = {
    fontFamily: "'Poppins', sans-serif",
    color: '#1E3A8A',
  };

  const headingStyle = {
    color: '#1E3A8A',
    fontWeight: 'bold',
    marginBottom: '1rem',
    marginTop: '2rem',
    textAlign: 'center',
    fontSize: '2.5rem'
  };

  const paragraphStyle = {
    color: '#1E3A8A',
    lineHeight: '1.7',
    marginBottom: '1rem',
    textAlign: 'center'
  };
  
  const subHeadingStyle = {
    color: '#1E3A8A',
    fontWeight: 'bold',
    marginTop: '2rem', 
    marginBottom: '1rem'
  };

  const listStyle = {
    marginBottom: '0.5rem',
    color: '#1E3A8A',
    lineHeight: '1.7'
  };

  // Button style matching theme's primary button
  const themedButtonStyle = `
    .themed-submit-btn {
      background-color: #1E3A8A;
      color: #fff;
      border: 2px solid #1E3A8A;
      padding: 0.9rem 2rem;
      font-size: 1.1rem;
      font-weight: 600;
      border-radius: 4px;
      cursor: pointer;
      transition: all 0.3s ease;
      text-decoration: none;
      display: inline-block;
      box-shadow: 0 2px 5px rgba(0,0,0,0.2);
    }
    .themed-submit-btn:hover {
      background-color: #fff;
      color: #1E3A8A;
      border-color: #1E3A8A;
    }
    .themed-submit-btn:disabled {
      background-color: #cccccc;
      border-color: #cccccc;
      color: #666666;
      cursor: not-allowed;
    }
  `;

  return (
    <div className="complain-page container py-4" style={pageContainerStyle}>
      <style>{themedButtonStyle}</style>

      <h1 style={headingStyle}>Submit a Complaint</h1>
      <p style={paragraphStyle}>
        We are committed to providing excellent service and value your feedback.
        If you have any concerns or are dissatisfied with our service, please fill out the form below.
        We take all complaints seriously and will address your concern promptly.
      </p>

      {successMessage && <div className="alert alert-success mt-3" role="alert">{successMessage}</div>}
      {errorMessage && <div className="alert alert-danger mt-3" role="alert">{errorMessage}</div>}

      <section className="complain-form-section mt-4">
        <form className="complain-form" onSubmit={handleSubmit} noValidate>
          <div className="mb-3">
            <label htmlFor="orderNumber" className="form-label" style={{fontWeight: '600'}}>Order / Repair ID (if applicable)</label>
            <input
              type="text"
              id="orderNumber"
              className="form-control"
              placeholder="e.g., MC12345"
              value={orderNumber}
              onChange={(e) => setOrderNumber(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <label htmlFor="name" className="form-label" style={{fontWeight: '600'}}>Your Full Name</label>
            <input
              type="text"
              id="name"
              className="form-control"
              placeholder="Enter your full name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <label htmlFor="email" className="form-label" style={{fontWeight: '600'}}>Your Email Address</label>
            <input
              type="email"
              id="email"
              className="form-control"
              placeholder="your.email@example.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <label htmlFor="issueDetails" className="form-label" style={{fontWeight: '600'}}>
              Details of Your Complaint
            </label>
            <textarea
              id="issueDetails"
              className="form-control"
              rows="6"
              placeholder="Please provide as much detail as possible about the issue, including dates, times, individuals involved (if any), and what resolution you are seeking."
              required
              value={issueDetails}
              onChange={(e) => setIssueDetails(e.target.value)}
            ></textarea>
          </div>
          
          <div className="text-center mt-4"> {/* Centering the button */}
            <button
              type="submit"
              className="themed-submit-btn" // Using the new themed class
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Complaint'}
            </button>
          </div>
        </form>
      </section>

      <section className="complain-extra-info mt-5">
        <h2 style={subHeadingStyle}>What Happens Next?</h2>
        <ul style={{ paddingLeft: '20px' }}>
          <li style={listStyle}>Once submitted, you will receive an automated confirmation email (if your email is provided correctly).</li>
          <li style={listStyle}>Our dedicated support team will review your complaint within 1-2 business days.</li>
          <li style={listStyle}>We may contact you by email or phone if further information is required to understand your concern fully.</li>
          <li style={listStyle}>We aim to investigate and respond to your complaint thoroughly and fairly.</li>
          <li style={listStyle}>Our goal is to resolve your issue as quickly and effectively as possible, and we will keep you informed of our progress.</li>
        </ul>
      </section>
    </div>
  );
}

export default Complain;