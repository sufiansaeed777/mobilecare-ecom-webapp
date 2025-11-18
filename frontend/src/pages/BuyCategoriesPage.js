// src/pages/BuyCategoriesPage.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
    FaMobileAlt,
    FaTabletAlt,
    FaLaptop,
    FaGamepad,
    FaClock,
    FaHeadphones,
    FaShoppingCart,
    FaArrowRight,
    FaShieldAlt, // For Quality Guaranteed
    FaComments // For Expert Advice
} from 'react-icons/fa';

// --- Device Categories Data ---
const deviceCategories = [
    { id: 'phones', title: 'PHONES', icon: FaMobileAlt, path: '/buy/phones', description: 'Browse our wide range of certified pre-owned and new smartphones.', itemCount: 25 },
    { id: 'tablets', title: 'TABLETS', icon: FaTabletAlt, path: '/buy/tablets', description: 'Find the perfect tablet for work, play, or anything in between.', itemCount: 15 },
    { id: 'laptops', title: 'LAPTOPS', icon: FaLaptop, path: '/buy/laptops', description: 'Discover powerful laptops for every need and budget.', itemCount: 10 },
    { id: 'watches', title: 'WATCHES', icon: FaClock, path: '/buy/watches', description: 'Explore stylish smartwatches and fitness trackers.', itemCount: 12 },
    { id: 'consoles', title: 'GAMING CONSOLES', icon: FaGamepad, path: '/buy/consoles', description: 'Get your game on with the latest consoles and classics.', itemCount: 8 },
    { id: 'accessories', title: 'ACCESSORIES', icon: FaHeadphones, path: '/buy/accessories', description: 'Shop for chargers, cases, headphones, and more.', itemCount: 30 },
];

// --- Highlights Data ---
const buyHighlights = [
    { icon: FaShoppingCart, title: 'Vast Selection', description: 'Explore certified pre-owned and new devices, all at competitive prices.' },
    { icon: FaShieldAlt, title: 'Assured Quality', description: 'Every device undergoes rigorous testing and is backed by our warranty.' },
    { icon: FaComments, title: 'Guidance & Support', description: 'Our knowledgeable team is ready to assist you in finding the perfect device.' },
];

function BuyCategoriesPage() {
    const [hoveredCategory, setHoveredCategory] = useState(null);

    return (
        <div style={pageStyle}>
            {/* Hero Section */}
            <section style={heroSectionStyle}>
                {/* heroOverlayStyle is removed as background is now light */}
                <div style={heroContentStyle}>
                    <FaShoppingCart style={heroIconStyle} />
                    <h1 style={heroTitleStyle}>Find Your Next Device</h1>
                    <p style={heroSubtitleStyle}>
                        Discover a wide range of high-quality certified pre-owned and new electronics.
                        Reliability and great value, all in one place.
                    </p>
                </div>
            </section>

            {/* Highlights Section */}
            <section style={highlightsSectionStyle}>
                <div style={highlightsContainerStyle}>
                    {buyHighlights.map((highlight, index) => (
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

            {/* Device Categories Section */}
            <section id="categories" style={categoriesSectionStyle}>
                <div style={sectionHeaderStyle}>
                    <h2 style={sectionTitleStyle}>Shop by Category</h2>
                    <div style={accentLineStyle}></div>
                    <p style={sectionSubtitleStyle}>Choose a category to start Browse our collection.</p>
                </div>
                <div style={categoriesGridStyle}>
                    {deviceCategories.map((category) => (
                        <Link
                            key={category.id}
                            to={category.path}
                            style={{
                                ...categoryCardStyle,
                                transform: hoveredCategory === category.id ? 'scale(1.03)' : 'scale(1)',
                                boxShadow: hoveredCategory === category.id
                                    ? '0 18px 35px rgba(30, 58, 138, 0.18)'
                                    : '0 8px 20px rgba(30, 58, 138, 0.09)',
                            }}
                            onMouseEnter={() => setHoveredCategory(category.id)}
                            onMouseLeave={() => setHoveredCategory(null)}
                            aria-label={`Shop for ${category.title}`}
                        >
                            <div style={categoryIconContainerStyle}>
                                <category.icon style={categoryIconStyle} />
                            </div>
                            <div style={categoryTextContainerStyle}>
                                <h3 style={categoryNameStyle}>{category.title}</h3>
                                {category.itemCount !== undefined && (
                                    <p style={itemCountStyle}>{category.itemCount} items available</p>
                                )}
                                <p style={categoryDescriptionStyle}>{category.description}</p>
                            </div>
                            <div style={categoryLinkStyle}>
                                <span>Browse {category.title}</span>
                                <FaArrowRight style={arrowIconStyle} />
                            </div>
                        </Link>
                    ))}
                </div>
            </section>

             {/* CTA Section */}
             <section style={ctaSectionStyle}>
                <div style={ctaContainerStyle}>
                    <h2 style={ctaTitleStyle}>Looking for Something Specific?</h2>
                    <p style={ctaDescriptionStyle}>
                        Our inventory is frequently updated. If you can't find what you need, or have any questions,
                        don't hesitate to reach out to our friendly team.
                    </p>
                    <Link to="/contact" style={ctaPrimaryButtonStyle}>
                        Get In Touch
                    </Link>
                </div>
            </section>
        </div>
    );
}

// --- Enhanced Styles ---
const pageStyle = {
    fontFamily: "'Poppins', sans-serif",
    color: '#1E3A8A',
    backgroundColor: '#f8f9fa',
};

// Hero Section - MODIFIED for light theme
const heroSectionStyle = {
    backgroundColor: '#e0f0ff', // Light, inviting blue accent
    padding: '5rem 2rem',
    textAlign: 'center',
    position: 'relative',
    color: '#1E3A8A', // Dark text on light background
    borderBottom: '1px solid #cce0ff',
};

// heroOverlayStyle is removed

const heroIconStyle = {
    fontSize: '4.5rem',
    marginBottom: '1rem',
    color: '#1E3A8A', // Icon color matches text
};

const heroContentStyle = {
    maxWidth: '800px',
    margin: '0 auto',
    position: 'relative',
    zIndex: 2, // Still relevant if other positioned elements were nearby
};

const heroTitleStyle = {
    fontSize: '3.2rem',
    fontWeight: 'bold',
    marginBottom: '1.5rem',
    lineHeight: 1.2,
    color: '#1E3A8A', // Ensure title color is dark
};

const heroSubtitleStyle = {
    fontSize: '1.25rem',
    lineHeight: 1.7,
    marginBottom: '2rem',
    color: '#3B5998', // Slightly softer dark blue for subtitle
};

// Highlights Section
const highlightsSectionStyle = {
    padding: "4rem 2rem",
    backgroundColor: "#fff", // Kept white for contrast with page bg
};

const highlightsContainerStyle = {
    maxWidth: "1200px",
    margin: "0 auto",
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "2.5rem",
};

const highlightCardStyle = {
    backgroundColor: "#fff",
    padding: "2.5rem 2rem",
    borderRadius: "12px",
    textAlign: "center",
    boxShadow: "0 10px 25px rgba(30, 58, 138, 0.08)", // Softer shadow
    border: '1px solid #e0e7ff',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
};

const highlightIconWrapperStyle = {
    backgroundColor: '#e0f0ff',
    borderRadius: '50%',
    width: '80px',
    height: '80px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '1.5rem',
};

const highlightIconStyle = {
    fontSize: "2.5rem",
    color: "#1E3A8A",
};

const highlightTitleStyle = {
    fontSize: "1.4rem",
    fontWeight: "600",
    color: "#1E3A8A",
    marginBottom: "0.75rem",
};

const highlightDescriptionStyle = {
    fontSize: "0.95rem",
    color: "#3B5998",
    lineHeight: 1.6,
};

// Categories Section
const categoriesSectionStyle = {
    padding: '4rem 2rem',
    backgroundColor: '#f8f9fa', // Match page background or keep slightly different like #f4f6f8 if preferred
};

const sectionHeaderStyle = {
    textAlign: 'center',
    marginBottom: '3.5rem',
};

const sectionTitleStyle = {
    fontSize: '2.8rem',
    fontWeight: 'bold',
    color: '#1E3A8A',
    marginBottom: '1rem',
};

const accentLineStyle = {
    width: '100px',
    height: '5px',
    backgroundColor: '#1E3A8A',
    margin: '0 auto 1.5rem',
    borderRadius: '2px',
};

const sectionSubtitleStyle = {
    fontSize: '1.1rem',
    color: '#495057',
    maxWidth: '600px',
    margin: '0 auto',
};

const categoriesGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '2.5rem',
    maxWidth: '1300px',
    margin: '0 auto',
};

const categoryCardStyle = {
    backgroundColor: '#fff',
    padding: '2rem',
    borderRadius: '16px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    border: '1px solid #dbe4f3',
    transition: 'transform 0.3s ease-out, box-shadow 0.3s ease-out',
    textDecoration: 'none',
    color: '#1E3A8A',
    minHeight: '360px',
    justifyContent: 'flex-start',
};

const categoryIconContainerStyle = {
    width: '90px',
    height: '90px',
    borderRadius: '50%',
    backgroundColor: '#e0f0ff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '1.5rem',
    border: '3px solid #fff',
    boxShadow: '0 4px 10px rgba(30, 58, 138, 0.1)',
};

const categoryIconStyle = {
    fontSize: '3rem',
    color: '#1E3A8A',
};

const categoryTextContainerStyle = {
    flexGrow: 1,
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
};

const categoryNameStyle = {
    fontSize: '1.5rem',
    fontWeight: '600',
    color: '#1E3A8A',
    marginBottom: '0.5rem',
};

const itemCountStyle = {
    fontSize: '0.85rem',
    color: '#555',
    marginBottom: '0.75rem',
    fontWeight: '500',
    backgroundColor: '#e9ecef',
    padding: '0.2rem 0.6rem',
    borderRadius: '10px',
};

const categoryDescriptionStyle = {
    fontSize: '0.9rem',
    color: '#3B5998',
    lineHeight: 1.6,
    marginBottom: '1.5rem',
};

const categoryLinkStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.75rem',
    color: '#fff',
    backgroundColor: '#1E3A8A',
    fontWeight: '600',
    padding: '0.75rem 1.5rem',
    borderRadius: '8px',
    marginTop: 'auto',
    transition: 'all 0.3s ease',
    textDecoration: 'none',
    border: '2px solid #1E3A8A', // Added border to match CTA button style
};
// categoryLinkStyle[':hover'] for JS-based hover or CSS classes

const arrowIconStyle = {
    fontSize: '1rem',
    transition: 'transform 0.2s ease-in-out',
};

// CTA Section Styles - MODIFIED for light theme
const ctaSectionStyle = {
    padding: "5rem 2rem",
    backgroundColor: "#fff", // Changed to white
    color: '#1E3A8A', // Dark text on white background
    borderTop: '1px solid #e0e7ff', // Add separator if needed
};

const ctaContainerStyle = { maxWidth: "800px", margin: "0 auto", textAlign: "center", };

const ctaTitleStyle = {
    fontSize: "2.5rem",
    fontWeight: "bold",
    marginBottom: "1.5rem",
    color: "#1E3A8A", // Ensure dark text
};

const ctaDescriptionStyle = {
    fontSize: "1.15rem",
    marginBottom: "2.5rem",
    maxWidth: "650px",
    margin: "0 auto 2.5rem",
    color: '#3B5998', // Softer dark blue
    lineHeight: 1.7,
};

const ctaPrimaryButtonStyle = { // Inverted style for light background
    backgroundColor: "#1E3A8A",
    color: "#fff",
    border: "2px solid #1E3A8A",
    padding: "1rem 2.5rem",
    fontSize: "1.1rem",
    fontWeight: "600",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "all 0.3s ease",
    textDecoration: "none",
    display: "inline-block",
    boxShadow: '0 4px 10px rgba(30, 58, 138, 0.1)',
};
// ctaPrimaryButtonStyle[':hover'] for JS-based hover or CSS classes

export default BuyCategoriesPage;