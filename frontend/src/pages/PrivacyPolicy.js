// src/pages/PrivacyPolicy.js
import React from 'react';

function PrivacyPolicy() {
  const pageContainerStyle = {
    fontFamily: "'Poppins', sans-serif", // Consistent font
    color: '#1E3A8A', // Default text color matching theme
  };

  const headingStyle = {
    color: '#1E3A8A', // Theme primary color
    fontWeight: 'bold',
    marginBottom: '1rem',
    marginTop: '2rem' // Added a bit more top margin for H1
  };

  const subHeadingStyle = { // For H2
    color: '#1E3A8A',
    fontWeight: 'bold',
    marginBottom: '0.75rem',
    marginTop: '1.5rem'
  };
  
  const paragraphStyle = {
    color: '#1E3A8A', // Theme consistent paragraph color
    lineHeight: '1.7', // Consistent line height
    marginBottom: '1rem'
  };
  
  const listItemStyle = {
    color: '#1E3A8A', // Theme consistent list item color
    marginBottom: '0.5rem',
    lineHeight: '1.7'
  };
  
  const strongStyle = {
    // color: '#1E3A8A', // Text color will be inherited from parent, making it bold is enough
    fontWeight: 'bold' // Keeping strong for emphasis
  };
  
  return (
    <div className="privacy-policy-page container py-4" style={pageContainerStyle}>
      <h1 style={{...headingStyle, fontSize: '2.5rem', textAlign: 'center', marginBottom: '2rem'}}>Privacy Policy</h1>
      <p style={paragraphStyle}>
        This Privacy Policy explains how Mobile Care ("we", "us", or "our")
        collects, uses, and discloses your personal information when you use our
        website and services. By accessing or using our website, you agree to the
        practices described in this Privacy Policy.
      </p>
      <p style={{...paragraphStyle, marginBottom: '2rem'}}>
        <strong style={strongStyle}>Last Updated:</strong> June 1, 2025 {/* Placeholder, update as needed */}
      </p>

      <h2 style={subHeadingStyle}>1. Information We Collect</h2>
      <p style={paragraphStyle}>
        We may collect the following types of information:
      </p>
      <ul style={{ paddingLeft: '20px', marginBottom: '1.5rem' }}>
        <li style={listItemStyle}>
          <strong style={strongStyle}>Personal Information:</strong> Your name, email address, phone number,
          and mailing address when you book a repair, submit a complaint, or contact us.
        </li>
        <li style={listItemStyle}>
          <strong style={strongStyle}>Device Information:</strong> Details about your device such as the
          make, model, and repair history when you request services.
        </li>
        <li style={listItemStyle}>
          <strong style={strongStyle}>Payment Information:</strong> Payment details provided during transactions,
          processed securely by our third-party payment partners. We do not store full payment card details.
        </li>
        <li style={listItemStyle}>
          <strong style={strongStyle}>Usage Data:</strong> Information collected through cookies, log files,
          and analytics tools regarding your Browse and interaction with our site (e.g., IP address, browser type, pages visited).
        </li>
      </ul>

      <h2 style={subHeadingStyle}>2. How We Use Your Information</h2>
      <p style={paragraphStyle}>
        We use the collected information for various purposes, including:
      </p>
      <ul style={{ paddingLeft: '20px', marginBottom: '1.5rem' }}>
        <li style={listItemStyle}>To provide, process, and manage your repair bookings and service requests.</li>
        <li style={listItemStyle}>To communicate with you regarding your appointments, service updates, and customer support.</li>
        <li style={listItemStyle}>To process payments for services rendered.</li>
        <li style={listItemStyle}>To improve our website, services, marketing efforts, and overall customer experience.</li>
        <li style={listItemStyle}>To prevent fraud and enhance the security of our services.</li>
        <li style={listItemStyle}>To comply with legal and regulatory obligations.</li>
      </ul>

      <h2 style={subHeadingStyle}>3. Information Sharing and Disclosure</h2>
      <p style={paragraphStyle}>
        We do not sell, trade, or rent your personal information to others. We may share your information only in the following circumstances:
      </p>
      <ul style={{ paddingLeft: '20px', marginBottom: '1.5rem' }}>
        <li style={listItemStyle}>
          <strong style={strongStyle}>Service Providers:</strong> With trusted third-party partners (e.g., payment
          processors, shipping companies, IT support, analytics providers) who assist us in operating our website, conducting our business, or servicing you, so long as those parties agree to keep this information confidential.
        </li>
        <li style={listItemStyle}>
          <strong style={strongStyle}>Business Transfers:</strong> In connection with, or during negotiations of, any merger, sale of company assets, financing, or acquisition of all or a portion of our business to another company.
        </li>
        <li style={listItemStyle}>
          <strong style={strongStyle}>Legal Requirements:</strong> If required to do so by law or in response to valid requests by public authorities (e.g., a court or a government agency), or when we believe in good faith that disclosure is necessary to protect our rights, protect your safety or the safety of others, investigate fraud, or respond to a government request.
        </li>
      </ul>

      <h2 style={subHeadingStyle}>4. Cookies and Tracking Technologies</h2>
      <p style={paragraphStyle}>
        We use cookies and similar tracking technologies (like web beacons and pixels) to track the activity on our service and hold certain information. Cookies are files with a small amount of data which may include an anonymous unique identifier. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, you may not be ableable to use some portions of our Service. You can manage your cookie preferences through your browser settings.
      </p>

      <h2 style={subHeadingStyle}>5. Data Security</h2>
      <p style={paragraphStyle}>
        We implement reasonable administrative, technical, and physical security measures to protect your personal information
        against unauthorized access, alteration, disclosure, or destruction. However, no method
        of transmission over the internet or method of electronic storage is 100% secure, and we cannot guarantee its absolute security.
      </p>

      <h2 style={subHeadingStyle}>6. Data Retention</h2>
      <p style={paragraphStyle}>
        We retain your personal information only for as long as necessary to fulfill the purposes
        for which it was collected, including for the purposes of satisfying any legal, accounting, or reporting requirements, or as required by law.
      </p>

      <h2 style={subHeadingStyle}>7. Your Rights</h2>
      <p style={paragraphStyle}>
        Depending on your location and applicable law, you may have certain rights regarding your personal data,
        such as the right to access, correct, update, or delete your information. You may also have the right to object to or restrict certain processing. To exercise these rights,
        please contact us using the contact details provided below. We will respond to your request within a reasonable timeframe.
      </p>

      <h2 style={subHeadingStyle}>8. Children's Privacy</h2>
      <p style={paragraphStyle}>
        Our website and services are not intended for individuals under the age of 16 (or the equivalent minimum age in the relevant jurisdiction). We do not
        knowingly collect personal information from children under this age. If we become aware that we have collected personal information from a child without verification of parental consent, we take steps to remove that information from our servers.
      </p>

      <h2 style={subHeadingStyle}>9. Changes to This Privacy Policy</h2>
      <p style={paragraphStyle}>
        We may update this Privacy Policy from time to time to reflect changes to our practices or for other operational, legal, or regulatory reasons. Any changes will be posted on this page with an updated revision date,
        and the updated policy will be effective immediately upon posting. We encourage you to review this Privacy Policy periodically.
      </p>

      <h2 style={subHeadingStyle}>10. Contact Us</h2>
      <p style={paragraphStyle}>
        If you have any questions about this Privacy Policy or our privacy practices, please contact us at:
      </p>
      <ul style={{ paddingLeft: '20px', listStyleType: 'none', marginBottom: '1.5rem' }}>
        <li style={listItemStyle}><strong style={strongStyle}>Email:</strong> ask.mobilecare@outlook.com</li>
        <li style={listItemStyle}><strong style={strongStyle}>Phone:</strong> 01689 825549</li>
        <li style={listItemStyle}><strong style={strongStyle}>Address:</strong> 7, Thamesgate Shopping Centre, Gravesend DA11 0AU, Kent, UK</li>
      </ul>
      <p style={{ ...paragraphStyle, fontStyle: 'italic', color: '#555', textAlign: 'center' }}>
        Please note: This Privacy Policy is provided for informational purposes only and does not constitute legal advice. You should consult with a legal professional for advice specific to your situation.
      </p>
    </div>
  );
}

export default PrivacyPolicy;