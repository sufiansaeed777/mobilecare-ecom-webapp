// src/pages/TradeInLandingPage.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
    FaExchangeAlt, // Main icon for Trade-in
    FaMobileAlt,
    FaTabletAlt,
    FaLaptop,
    FaGamepad,
    FaClock,
    FaArrowRight,
    FaRecycle,      // Eco-Friendly
    FaWallet,       // Save Money
    FaShippingFast, // Convenient
    FaClipboardList, // Step 1: Tell us
    FaTags,          // Added for step 2
    FaShoppingCart,  // Added for step 3
    FaCheckCircle    // Added for step 5
} from 'react-icons/fa';
// --- Device Categories Data for Trade-In ---
const tradeInDeviceCategories = [
    { id: 'phones', title: 'TRADE IN PHONE', icon: FaMobileAlt, path: '/trade-in/phones', description: 'Upgrade to the latest smartphone and get credit for your old one.' },
    { id: 'tablets', title: 'TRADE IN TABLET', icon: FaTabletAlt, path: '/trade-in/tablets', description: 'Trade in your old tablet for a discount on a new model.' },
    { id: 'laptops', title: 'TRADE IN LAPTOP', icon: FaLaptop, path: '/trade-in/laptops', description: 'Get value from your current laptop towards a new, powerful machine.' },
    { id: 'watches', title: 'TRADE IN WATCH', icon: FaClock, path: '/trade-in/watches', description: 'Swap your old smartwatch for the newest wearable technology.' },
    { id: 'consoles', title: 'TRADE IN CONSOLE', icon: FaGamepad, path: '/trade-in/consoles', description: 'Upgrade your gaming setup by trading in your old console.' },
];

// --- "Why Trade-In?" Highlights Data ---
const whyTradeInHighlights = [
    { icon: FaWallet, title: 'Save On Your Next Device', description: 'Reduce the cost of your new purchase by applying your trade-in credit.' },
    { icon: FaShippingFast, title: 'Simple & Convenient', description: 'Our easy process and free shipping make trading in your device a breeze.' },
    { icon: FaRecycle, title: 'Eco-Friendly Choice', description: 'Give your old device a new life and contribute to reducing e-waste.' },
];

// --- "How It Works" Steps for Trade-In ---
const tradeInProcessSteps = [
    { number: 1, title: 'Describe Your Old Device', description: 'Select its category and provide details about its model, condition, and specifications.', icon: FaClipboardList },
    { number: 2, title: 'Get Your Trade-In Estimate', description: 'Receive an instant preliminary quote for your device based on the information provided.', icon: FaTags },
    { number: 3, title: 'Choose Your New Device', description: 'Browse our wide selection of new and certified pre-owned products to upgrade to.', icon: FaShoppingCart },
    { number: 4, title: 'Send Us Your Old Device', description: 'Use our free shipping label or drop it off. We\'ll inspect it upon arrival.', icon: FaShippingFast },
    { number: 5, title: 'Complete Your Upgrade', description: 'Apply your trade-in credit and enjoy your new device!', icon: FaCheckCircle },
];


function TradeInLandingPage() {
    const [hoveredCategory, setHoveredCategory] = useState(null);

    return (
        <div style={pageStyle}>
            {/* Hero Section */}
            <section style={heroSectionStyle}>
                <div style={heroContentStyle}>
                    <FaExchangeAlt style={heroIconStyle} />
                    <h1 style={heroTitleStyle}>Trade In & Upgrade Your Tech</h1>
                    <p style={heroSubtitleStyle}>
                        Get great value for your old devices and save on your next purchase. It's smart, simple, and sustainable!
                    </p>
                    <Link to="#trade-in-categories-section" style={heroButtonStyle}>
                        Start Your Trade-In <FaArrowRight style={{ marginLeft: '8px' }}/>
                    </Link>
                </div>
            </section>

            {/* "Why Trade-In?" Highlights Section */}
            <section style={highlightsSectionStyle}>
                 <div style={sectionHeaderStyle}>
                    <h2 style={sectionTitleStyle}>The Benefits of Trading In</h2>
                    <div style={accentLineStyle}></div>
                </div>
                <div style={highlightsContainerStyle}>
                    {whyTradeInHighlights.map((highlight, index) => (
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
                    <h2 style={sectionTitleStyle}>Trade-In Made Easy: 5 Steps</h2>
                    <div style={accentLineStyle}></div>
                </div>
                <div style={processStepsContainerStyle}>
                    {tradeInProcessSteps.map((step) => (
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

            {/* Device Categories for Trade-In Section */}
            <section id="trade-in-categories-section" style={categoriesSectionStyle}>
                <div style={sectionHeaderStyle}>
                    <h2 style={sectionTitleStyle}>What Device Will You Trade In?</h2>
                    <div style={accentLineStyle}></div>
                    <p style={sectionSubtitleStyle}>Select the type of device to get started with your trade-in estimate.</p>
                </div>
                <div style={categoriesGridStyle}>
                    {tradeInDeviceCategories.map((category) => (
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
                            aria-label={`Trade in your ${category.title.replace('TRADE IN ', '')}`}
                        >
                            <div style={categoryIconContainerStyle}>
                                <category.icon style={categoryIconStyle} />
                            </div>
                            <div style={categoryTextContainerStyle}>
                                <h3 style={categoryNameStyle}>{category.title}</h3>
                                <p style={categoryDescriptionStyle}>{category.description}</p>
                            </div>
                            <div style={categoryLinkStyle}>
                                <span>Get Estimate</span>
                                <FaArrowRight style={arrowIconStyle} />
                            </div>
                        </Link>
                    ))}
                </div>
            </section>
        </div>
    );
}

// --- Styles (largely reused and adapted from SellCategoriesPage, BuyCategoriesPage and Home) ---
const pageStyle = { fontFamily: "'Poppins', sans-serif", color: '#1E3A8A', backgroundColor: '#f9fafb', };

// Hero Section
const heroSectionStyle = { backgroundColor: '#e0e7ff', padding: '6rem 2rem', textAlign: 'center', color: '#1E3A8A', borderBottom: '1px solid #c0cfff', };
const heroIconStyle = { fontSize: '4.8rem', marginBottom: '1.5rem', color: '#1E3A8A', };
const heroContentStyle = { maxWidth: '850px', margin: '0 auto', };
const heroTitleStyle = { fontSize: '3.5rem', fontWeight: 'bold', marginBottom: '1.5rem', lineHeight: 1.25, };
const heroSubtitleStyle = { fontSize: '1.3rem', lineHeight: 1.7, marginBottom: '2.5rem', color: '#3B5998', };
const heroButtonStyle = { display: 'inline-flex', alignItems: 'center', padding: '0.9rem 2.2rem', backgroundColor: '#1E3A8A', color: '#fff', textDecoration: 'none', borderRadius: '8px', fontWeight: '600', fontSize: '1.1rem', transition: 'all 0.3s ease', boxShadow: '0 4px 12px rgba(30, 58, 138, 0.2)', };

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

// How It Works Section (5 steps)
const howItWorksSectionStyle = { padding: '4.5rem 2rem', backgroundColor: '#f9fafb', };
const processStepsContainerStyle = { maxWidth: '1300px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem' }; // Adjusted for 5 steps
const processStepStyle = { backgroundColor: '#fff', padding: '2rem 1.5rem', borderRadius: '16px', boxShadow: '0 10px 25px rgba(30, 58, 138, 0.08)', border: '1px solid #e8eefc', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' };
const stepIconContainerStyle = { position: 'relative', marginBottom: '1.5rem' };
const stepIconStyle = { fontSize: '2.2rem', color: '#1E3A8A', padding: '1.1rem', backgroundColor: '#e0e7ff', borderRadius: '50%' };
const stepNumberStyle = { position: 'absolute', top: '-10px', right: '-10px', width: '30px', height: '30px', borderRadius: '50%', backgroundColor: '#1E3A8A', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem', fontWeight: 'bold', border: '3px solid #fff', boxShadow: '0 2px 5px rgba(0,0,0,0.15)' };
const stepContentStyle = { marginTop: '0.5rem' };
const stepTitleStyle = { fontSize: '1.15rem', fontWeight: '600', color: '#1E3A8A', marginBottom: '0.6rem' };
const stepDescriptionStyle = { fontSize: '0.85rem', color: '#495057', lineHeight: 1.55 };

// Categories Section
const categoriesSectionStyle = { padding: '4.5rem 2rem', backgroundColor: '#fff', borderTop: '1px solid #e8eefc' };
const categoriesGridStyle = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))', gap: '2.5rem', maxWidth: '1300px', margin: '0 auto', };
const categoryCardStyle = { backgroundColor: '#fff', padding: '2.5rem 2rem', borderRadius: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', border: '1px solid #d0daeb', transition: 'transform 0.3s ease-out, box-shadow 0.3s ease-out', textDecoration: 'none', color: '#1E3A8A', minHeight: '340px', justifyContent: 'space-between', };
const categoryIconContainerStyle = { width: '80px', height: '80px', borderRadius: '50%', backgroundColor: '#e0e7ff', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem', border: '3px solid #fff', boxShadow: '0 4px 10px rgba(30, 58, 138, 0.1)', };
const categoryIconStyle = { fontSize: '2.8rem', color: '#1E3A8A', };
const categoryTextContainerStyle = { flexGrow: 1, width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' };
const categoryNameStyle = { fontSize: '1.4rem', fontWeight: '600', color: '#1E3A8A', marginBottom: '0.75rem', };
const categoryDescriptionStyle = { fontSize: '0.9rem', color: '#3B5998', lineHeight: 1.6, marginBottom: '1rem', };
const categoryLinkStyle = { display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', color: '#fff', backgroundColor: '#1E3A8A', fontWeight: '600', padding: '0.8rem 1.8rem', borderRadius: '8px', transition: 'all 0.3s ease', textDecoration: 'none', border: '2px solid #1E3A8A', marginTop: 'auto', width: '90%' };
const arrowIconStyle = { fontSize: '1rem', transition: 'transform 0.2s ease-in-out', };

export default TradeInLandingPage;