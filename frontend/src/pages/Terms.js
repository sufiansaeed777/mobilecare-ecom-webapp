// src/pages/Terms.js
import React from 'react';

function Terms() {
  const pageContainerStyle = {
    fontFamily: "'Poppins', sans-serif",
    color: '#1E3A8A',
  };

  const headingStyle = { // For H1
    color: '#1E3A8A',
    fontWeight: 'bold',
    marginBottom: '2rem', // More margin for main title
    marginTop: '2rem',
    textAlign: 'center',
    fontSize: '2.5rem'
  };
  
  const paragraphStyle = {
    color: '#1E3A8A', 
    lineHeight: '1.7',
    marginBottom: '1rem',
  };
  
  const subheadingStyle = { // For H2
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

  const strongStyle = {
    fontWeight: 'bold'
  };
  
  const emphasisStyle = {
    fontStyle: 'italic',
    color: '#555', // Softer color for disclaimer
    textAlign: 'center',
    marginTop: '2rem'
  };
  
  return (
    <div className="terms-page container py-4" style={pageContainerStyle}>
      <h1 style={headingStyle}>Terms & Conditions</h1>
      <p style={{...paragraphStyle, marginBottom: '2rem'}}>
        Welcome to Mobile Care. By accessing or using our website and services ("Services"), you agree to
        comply with and be bound by the following terms and conditions ("Terms"). If you do not agree with
        these Terms, please do not use our Services.
      </p>
      <p style={{...paragraphStyle, marginBottom: '2rem'}}>
        <strong style={strongStyle}>Last Updated:</strong> June 1, 2025 {/* Placeholder, update as needed */}
      </p>

      <h2 style={subheadingStyle}>1. Acceptance of Terms</h2>
      <p style={paragraphStyle}>
        By using our website and Services, you acknowledge that you have read, understood, and agree to be
        bound by these Terms & Conditions, as well as our Privacy Policy, which is incorporated herein by reference.
      </p>

      <h2 style={subheadingStyle}>2. Services Offered</h2>
      <p style={paragraphStyle}>
        Mobile Care provides repair and maintenance services for mobile phones, tablets,
        laptops, gaming consoles, smartwatches, and other electronic devices ("Devices"). The specific details of each service, including estimated pricing,
        warranty periods, and estimated repair turnaround times, will be communicated to you prior to the commencement of any service. All repairs are subject to parts availability.
      </p>

      <h2 style={subheadingStyle}>3. Booking, Diagnosis, and Payment</h2>
      <p style={paragraphStyle}>
        Appointments for services can be booked through our website, by phone, or in-store. A diagnostic fee may apply if you choose not to proceed with a repair after diagnosis, which will be communicated beforehand. Full payment for services and any parts is required
        upon completion of the service, or as otherwise agreed in writing. Prices quoted are estimates and may be subject to change
        based on the actual extent of damage, parts availability, and complexity of the repair; any significant changes will be communicated for approval before proceeding.
      </p>

      <h2 style={subheadingStyle}>4. Warranty</h2>
      <p style={paragraphStyle}>
        Mobile Care offers a standard 3-month (or as otherwise specified) warranty on parts replaced and labor performed for repairs, commencing from the date of service completion. This warranty covers defects in the replaced parts and the workmanship of the repair.
      </p>
      <p style={paragraphStyle}>
        The warranty does <strong style={strongStyle}>not</strong> cover:
      </p>
      <ul style={{ paddingLeft: '20px', marginBottom: '1rem' }}>
        <li style={listStyle}>Damage caused by misuse, accidental damage (e.g., drops, liquid spills), or neglect after the device has left our premises.</li>
        <li style={listStyle}>Issues unrelated to the original repair.</li>
        <li style={listStyle}>Loss of data (we strongly recommend backing up your device before service).</li>
        <li style={listStyle}>Devices that have been tampered with or repaired by a third party after our service.</li>
        <li style={listStyle}>Pre-existing conditions or faults not disclosed at the time of booking or diagnosis.</li>
        <li style={listStyle}>Software issues, including viruses, malware, or OS-related problems, unless the service was specifically for software repair.</li>
      </ul>
      <p style={paragraphStyle}>
        Warranty claims require proof of service (original receipt). We reserve the right to inspect the device to determine warranty eligibility. Our obligation under this warranty is limited to re-repairing the faulty service or replacing the defective part.
      </p>

      <h2 style={subheadingStyle}>5. Liability</h2>
      <p style={paragraphStyle}>
        Mobile Care takes utmost care when handling your Device. However, our liability for any loss or damage to your Device arising directly from our services is limited to
        the cost of the repair service paid by you or the current market value of the Device in its condition prior to our service, whichever is lower. We are not liable for any indirect, incidental, or consequential damages, including loss of data, profits, or business interruption. It is your responsibility to back up all data on your Device before submitting it for repair.
      </p>

      <h2 style={subheadingStyle}>6. Customer Responsibilities</h2>
      <p style={paragraphStyle}>
        You agree to provide accurate and complete information when booking services and to disclose all known issues with your Device. You are responsible for removing SIM cards, memory cards, and any personal accessories not relevant to the repair. If your device is passcode/pattern locked, you must provide access or disable locks for us to perform diagnostics and repairs; failure to do so may delay service or prevent repair.
      </p>
        
      <h2 style={subheadingStyle}>7. Unclaimed Devices</h2>
      <p style={paragraphStyle}>
        Devices left with Mobile Care and not collected within 60 days after notification of service completion (or notification that the device is unrepairable or requires further instruction) will be considered abandoned. Mobile Care reserves the right to dispose of or recycle abandoned devices to recover costs, without further liability to you.
      </p>

      <h2 style={subheadingStyle}>8. Intellectual Property</h2>
      <p style={paragraphStyle}>
        All content on this website, including text, graphics, images, logos, and software, is the property of
        Mobile Care or its content suppliers and is protected by UK and international copyright laws. You may not reproduce, distribute, modify, or create derivative
        works from any content without our express prior written consent.
      </p>

      <h2 style={subheadingStyle}>9. User Conduct</h2>
      <p style={paragraphStyle}>
        You agree not to use our website or Services for any unlawful purpose or in any way that could damage, disable, overburden, or impair our Services or interfere with any other party's use and enjoyment of our Services.
      </p>

      <h2 style={subheadingStyle}>10. Indemnification</h2>
      <p style={paragraphStyle}>
        You agree to indemnify, defend, and hold harmless Mobile Care, its owners, employees, and agents from and against any and all claims, damages, losses, liabilities,
        costs, or expenses (including reasonable attorneys' fees) arising from your use of our Services, your violation of these Terms, or your infringement of any intellectual property or other right of any person or entity.
      </p>

      <h2 style={subheadingStyle}>11. Governing Law and Jurisdiction</h2>
      <p style={paragraphStyle}>
        These Terms & Conditions shall be governed by and construed in accordance with the laws of England and Wales. Any disputes arising from or relating to these Terms or our Services shall be
        subject to the exclusive jurisdiction of the courts of England and Wales.
      </p>

      <h2 style={subheadingStyle}>12. Changes to Terms & Conditions</h2>
      <p style={paragraphStyle}>
        Mobile Care reserves the right to modify or replace these Terms & Conditions at any time at our sole discretion.
        The most current version will be posted on our website with an updated "Last Updated" date. Your continued use of our Services after any such changes constitutes
        your acceptance of the new Terms. It is your responsibility to review these Terms periodically.
      </p>

      <h2 style={subheadingStyle}>13. Contact Information</h2>
      <p style={paragraphStyle}>
        If you have any questions or concerns about these Terms & Conditions, please contact us at:
      </p>
      <ul style={{ paddingLeft: '20px', listStyleType: 'none', marginBottom: '1.5rem' }}>
        <li style={listStyle}><strong style={strongStyle}>Email:</strong> ask.mobilecare@outlook.com</li>
        <li style={listStyle}><strong style={strongStyle}>Phone:</strong> 01689 825549</li>
        <li style={listStyle}><strong style={strongStyle}>Address:</strong> 7, Thamesgate Shopping Centre, Gravesend DA11 0AU, Kent, UK</li>
      </ul>
      <p style={emphasisStyle}>
        Please note: These Terms & Conditions are provided for informational purposes and do not constitute legal advice. You should consult with a legal professional for advice specific to your situation.
      </p>
    </div>
  );
}

export default Terms;