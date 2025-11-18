// src/pages/SellCategoriesPage.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
    FaMobileAlt,
    FaTabletAlt,
    FaLaptop,
    FaGamepad,
    FaClock,
    FaTags, // Main icon for selling
    FaArrowRight,
    FaMoneyBillWave, // For Get Best Value
    FaShippingFast,  // For Easy Process/Shipping
    FaUserShield,    // For Secure Data Wiping
    FaCheckCircle,   // For "How it Works" steps or highlights
    FaQuoteLeft,     // For testimonial/CTA
    FaQuestionCircle // For FAQ hint or help
} from 'react-icons/fa';

// --- Device Categories Data for Selling ---
const sellDeviceCategories = [
    { id: 'phones', title: 'SELL YOUR PHONE', icon: FaMobileAlt, path: '/sell/phones', description: 'Get top value for your smartphone, any condition considered.' },
    { id: 'tablets', title: 'SELL YOUR TABLET', icon: FaTabletAlt, path: '/sell/tablets', description: 'Turn your unused tablet into cash. Quick and easy process.' },
    { id: 'laptops', title: 'SELL YOUR LAPTOP', icon: FaLaptop, path: '/sell/laptops', description: 'Competitive offers for laptops, from ultrabooks to gaming rigs.' },
    { id: 'watches', title: 'SELL YOUR WATCH', icon: FaClock, path: '/sell/watches', description: 'Sell your smartwatch or fitness tracker and upgrade to the latest tech.' },
    { id: 'consoles', title: 'SELL YOUR CONSOLE', icon: FaGamepad, path: '/sell/consoles', description: 'Get cash for your gaming console, from retro to current generation.' },
];

// --- "Why Sell To Us?" Highlights Data ---
const whySellToUsHighlights = [
    { icon: FaMoneyBillWave, title: 'Best Market Value', description: 'We offer fair and competitive prices based on current market rates for your devices.' },
    { icon: FaShippingFast, title: 'Fast & Simple Process', description: 'Our streamlined online process makes selling your device straightforward and lightning-fast.' },
    { icon: FaUserShield, title: 'Secure & Trustworthy', description: 'Your data is securely wiped, and our transparent process ensures a trustworthy transaction.' },
    { icon: FaCheckCircle, title: 'Instant Estimates', description: 'Get a quick online estimate for your device in just a few clicks before committing.'}
];

// --- "How It Works" Steps for Selling ---
const sellProcessSteps = [
    { number: 1, title: 'Describe Your Device', description: 'Select your device and tell us about its model, specifications, and condition.', icon: FaMobileAlt },
    { number: 2, title: 'Get Your Free Quote', description: 'Receive an instant, no-obligation estimate based on the details you provide.', icon: FaTags },
    { number: 3, title: 'Send It To Us (Free!)', description: 'Use our pre-paid shipping label or arrange a convenient drop-off at our location.', icon: FaShippingFast },
    { number: 4, title: 'Get Paid Quickly', description: 'Once we verify your device, you\'ll receive your payment promptly via your chosen method.', icon: FaMoneyBillWave },
];


function SellCategoriesPage() {
    const [hoveredCategory, setHoveredCategory] = useState(null);

    return (
        <div style={pageStyle}>
            {/* Hero Section */}
            <section style={heroSectionStyle}>
                <div style={heroContentStyle}>
                    <FaTags style={heroIconStyle} />
                    <h1 style={heroTitleStyle}>Turn Your Tech Into Cash</h1>
                    <p style={heroSubtitleStyle}>
                        Selling your old phones, tablets, laptops, and more is simple, secure, and rewarding. Get an instant quote today!
                    </p>
                     <Link to="#sell-categories-section" style={heroButtonStyle}>
                        Get Started Now <FaArrowRight style={{ marginLeft: '8px' }}/>
                    </Link>
                </div>
            </section>

            {/* "Why Sell To Us?" Highlights Section */}
            <section style={highlightsSectionStyle}>
                 <div style={sectionHeaderStyle}>
                    <h2 style={sectionTitleStyle}>The Smart Way to Sell</h2>
                    <div style={accentLineStyle}></div>
                </div>
                <div style={highlightsContainerStyle}>
                    {whySellToUsHighlights.map((highlight, index) => (
                        <div key={index} style={highlightCardStyle}>
                            <div style={highlightIconWrapperStyle}>
                                <highlight.icon style={highlightIconStyle} />
                            </div>
                            <h3 style={highlightTitleStyle}>{highlight.title}</h3>
                            <p style={highlightDescriptionStyle}>{highlight.description}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* "How It Works" Section */}
            <section style={howItWorksSectionStyle}>
                <div style={sectionHeaderStyle}>
                    <h2 style={sectionTitleStyle}>Sell in 4 Easy Steps</h2>
                    <div style={accentLineStyle}></div>
                </div>
                <div style={processStepsContainerStyle}>
                    {sellProcessSteps.map((step) => (
                        <div key={step.number} style={processStepStyle}>
                            <div style={stepIconContainerStyle}>
                                <step.icon style={stepIconStyle} />
                                <span style={stepNumberStyle}>{step.number}</span>
                            </div>
                            <div style={stepContentStyle}>
                                <h3 style={stepTitleStyle}>{step.title}</h3>
                                <p style={stepDescriptionStyle}>{step.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Device Categories for Selling Section */}
            <section id="sell-categories-section" style={categoriesSectionStyle}>
                <div style={sectionHeaderStyle}>
                    <h2 style={sectionTitleStyle}>What Device Are You Selling?</h2>
                    <div style={accentLineStyle}></div>
                    <p style={sectionSubtitleStyle}>Select your device type below to begin the valuation process.</p>
                </div>
                <div style={categoriesGridStyle}>
                    {sellDeviceCategories.map((category) => (
                        <Link
                            key={category.id}
                            to={category.path}
                            style={{
                                ...categoryCardStyle,
                                transform: hoveredCategory === category.id ? 'scale(1.03) translateY(-5px)' : 'scale(1) translateY(0px)',
                                boxShadow: hoveredCategory === category.id
                                    ? '0 20px 40px rgba(30, 58, 138, 0.2)'
                                    : '0 10px 25px rgba(30, 58, 138, 0.1)',
                            }}
                            onMouseEnter={() => setHoveredCategory(category.id)}
                            onMouseLeave={() => setHoveredCategory(null)}
                            aria-label={`Get a quote for your ${category.title.replace('SELL YOUR ', '')}`}
                        >
                            <div style={categoryIconContainerStyle}>
                                <category.icon style={categoryIconStyle} />
                            </div>
                            <div style={categoryTextContainerStyle}>
                                <h3 style={categoryNameStyle}>{category.title}</h3>
                                <p style={categoryDescriptionStyle}>{category.description}</p>
                                <span style={valuationHintStyle}><FaCheckCircle style={{marginRight: '5px'}} /> Quick & Easy Valuation</span>
                            </div>
                            <div style={categoryLinkStyle}>
                                <span>Start Your Quote</span>
                                <FaArrowRight style={arrowIconStyle} />
                            </div>
                        </Link>
                    ))}
                </div>
            </section>

            {/* Simple FAQ / Call to Action */}
            <section style={faqCtaSectionStyle}>
                <div style={faqCtaContainerStyle}>
                    <FaQuestionCircle style={faqCtaIconStyle} />
                    <h2 style={faqCtaTitleStyle}>Questions About Selling?</h2>
                    <p style={faqCtaDescriptionStyle}>
                        Our dedicated team is here to help you every step of the way. If you have questions about your device, the selling process, or payment, please don't hesitate to get in touch.
                    </p>
                    <Link to="/contact" style={faqCtaButtonStyle}>
                        Contact Support
                    </Link>
                </div>
            </section>
        </div>
    );
}

// --- Styles ---
const pageStyle = { fontFamily: "'Poppins', sans-serif", color: '#1E3A8A', backgroundColor: '#f9fafb', }; // Slightly off-white page bg

// Hero Section - Light Theme
const heroSectionStyle = {
    backgroundColor: '#e0e7ff', // A very light, welcoming blue
    padding: '6rem 2rem', // Increased padding
    textAlign: 'center',
    color: '#1E3A8A', // Dark text
    borderBottom: '1px solid #c0cfff',
};
const heroIconStyle = { fontSize: '4.8rem', marginBottom: '1.5rem', color: '#1E3A8A', };
const heroContentStyle = { maxWidth: '850px', margin: '0 auto', };
const heroTitleStyle = { fontSize: '3.5rem', fontWeight: 'bold', marginBottom: '1.5rem', lineHeight: 1.25, };
const heroSubtitleStyle = { fontSize: '1.3rem', lineHeight: 1.7, marginBottom: '2.5rem', color: '#3B5998', };
const heroButtonStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '0.9rem 2.2rem',
    backgroundColor: '#1E3A8A',
    color: '#fff',
    textDecoration: 'none',
    borderRadius: '8px',
    fontWeight: '600',
    fontSize: '1.1rem',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 12px rgba(30, 58, 138, 0.2)',
};
heroButtonStyle[':hover'] = { backgroundColor: '#162b65', transform: 'translateY(-2px)' };


// Section Common
const sectionHeaderStyle = { textAlign: 'center', marginBottom: '3.5rem', };
const sectionTitleStyle = { fontSize: '2.8rem', fontWeight: '700', color: '#1E3A8A', marginBottom: '1rem', };
const accentLineStyle = { width: '100px', height: '4px', backgroundColor: '#1E3A8A', margin: '0 auto 1.5rem', borderRadius: '2px', };
const sectionSubtitleStyle = { fontSize: '1.1rem', color: '#495057', maxWidth: '650px', margin: '0 auto', lineHeight: 1.6 };

// Highlights Section
const highlightsSectionStyle = { padding: "4rem 2rem", backgroundColor: "#fff", };
const highlightsContainerStyle = { maxWidth: "1200px", margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "2rem", };
const highlightCardStyle = { backgroundColor: "#fdfdff", padding: "2.5rem", borderRadius: "16px", textAlign: "center", boxShadow: "0 12px 30px rgba(30, 58, 138, 0.09)", border: '1px solid #e8eefc', display: 'flex', flexDirection: 'column', alignItems: 'center', };
const highlightIconWrapperStyle = { backgroundColor: '#e0e7ff', borderRadius: '50%', width: '70px', height: '70px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem', };
const highlightIconStyle = { fontSize: "2.2rem", color: "#1E3A8A", };
const highlightTitleStyle = { fontSize: "1.35rem", fontWeight: "600", color: "#1E3A8A", marginBottom: "0.75rem", };
const highlightDescriptionStyle = { fontSize: "0.9rem", color: "#3B5998", lineHeight: 1.65, };

// How It Works Section
const howItWorksSectionStyle = { padding: '4.5rem 2rem', backgroundColor: '#f9fafb', };
const processStepsContainerStyle = { maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' };
const processStepStyle = { backgroundColor: '#fff', padding: '2.5rem 2rem', borderRadius: '16px', boxShadow: '0 10px 25px rgba(30, 58, 138, 0.08)', border: '1px solid #e8eefc', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' };
const stepIconContainerStyle = { position: 'relative', marginBottom: '1.5rem' };
const stepIconStyle = { fontSize: '2.5rem', color: '#1E3A8A', padding: '1.2rem', backgroundColor: '#e0e7ff', borderRadius: '50%' };
const stepNumberStyle = { position: 'absolute', top: '-12px', right: '-12px', width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#1E3A8A', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', fontWeight: 'bold', border: '3px solid #fff', boxShadow: '0 2px 5px rgba(0,0,0,0.15)' };
const stepContentStyle = { marginTop: '0.5rem' };
const stepTitleStyle = { fontSize: '1.25rem', fontWeight: '600', color: '#1E3A8A', marginBottom: '0.6rem' };
const stepDescriptionStyle = { fontSize: '0.9rem', color: '#495057', lineHeight: 1.6 };

// Categories Section
const categoriesSectionStyle = { padding: '4.5rem 2rem', backgroundColor: '#fff', borderTop: '1px solid #e8eefc' };
const categoriesGridStyle = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))', gap: '2.5rem', maxWidth: '1300px', margin: '0 auto', };
const categoryCardStyle = { backgroundColor: '#fff', padding: '2.5rem 2rem', borderRadius: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', border: '1px solid #d0daeb', transition: 'transform 0.3s ease-out, box-shadow 0.3s ease-out', textDecoration: 'none', color: '#1E3A8A', minHeight: '370px', justifyContent: 'space-between', };
const categoryIconContainerStyle = { width: '80px', height: '80px', borderRadius: '50%', backgroundColor: '#e0e7ff', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem', border: '3px solid #fff', boxShadow: '0 4px 10px rgba(30, 58, 138, 0.1)', };
const categoryIconStyle = { fontSize: '2.8rem', color: '#1E3A8A', };
const categoryTextContainerStyle = { flexGrow: 1, width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' };
const categoryNameStyle = { fontSize: '1.4rem', fontWeight: '600', color: '#1E3A8A', marginBottom: '0.6rem', };
const categoryDescriptionStyle = { fontSize: '0.9rem', color: '#3B5998', lineHeight: 1.6, marginBottom: '1rem', };
const valuationHintStyle = { fontSize: '0.8rem', color: '#198754', fontWeight: '500', display: 'flex', alignItems: 'center', marginBottom: '1rem', backgroundColor: '#d1e7dd', padding: '0.3rem 0.7rem', borderRadius: '6px' };
const categoryLinkStyle = { display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', color: '#fff', backgroundColor: '#1E3A8A', fontWeight: '600', padding: '0.8rem 1.8rem', borderRadius: '8px', transition: 'all 0.3s ease', textDecoration: 'none', border: '2px solid #1E3A8A', marginTop: 'auto', width: '90%' };
const arrowIconStyle = { fontSize: '1rem', transition: 'transform 0.2s ease-in-out', };

// FAQ CTA Section
const faqCtaSectionStyle = { padding: "4.5rem 2rem", backgroundColor: "#e0e7ff", color: '#1E3A8A', textAlign: 'center' };
const faqCtaContainerStyle = { maxWidth: "800px", margin: "0 auto", };
const faqCtaIconStyle = { fontSize: '3.5rem', color: '#1E3A8A', marginBottom: '1rem' };
const faqCtaTitleStyle = { fontSize: "2.3rem", fontWeight: "bold", marginBottom: "1rem", };
const faqCtaDescriptionStyle = { fontSize: "1.1rem", marginBottom: "2rem", maxWidth: "700px", margin: "0 auto 2.5rem", opacity: 0.9, lineHeight: 1.7, color: '#3B5998' };
const faqCtaButtonStyle = {
    backgroundColor: "#1E3A8A",
    color: "#fff",
    border: "2px solid #1E3A8A",
    padding: "0.9rem 2.2rem",
    fontSize: "1.05rem",
    fontWeight: "600",
    borderRadius: "8px",
    transition: "all 0.3s ease",
    textDecoration: "none",
    boxShadow: '0 4px 12px rgba(30, 58, 138, 0.15)',
};

export default SellCategoriesPage;