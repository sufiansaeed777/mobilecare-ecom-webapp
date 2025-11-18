// src/pages/ConsoleSelection.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { SiPlaystation, SiNintendo } from 'react-icons/si';
import { FaXbox, FaWrench, FaArrowRight } from 'react-icons/fa';

// --- Brand Data (Using your original brands + descriptions for theme consistency) ---
const consoleBrands = [
    {
        name: 'PlayStation',
        path: '/console/playstation',
        Icon: SiPlaystation,
        ariaLabel: 'Select Sony PlayStation',
        description: 'PS5 & PS4 repairs for Disc Drive, HDMI, Power & more.',
        modelCount: '2+ models' // Based on your ConsoleModels data
    },
    {
        name: 'Xbox',
        path: '/console/xbox',
        Icon: FaXbox,
        ariaLabel: 'Select Microsoft Xbox',
        description: 'Xbox Series & One repairs for Overheating, Storage & more.',
        modelCount: '2+ models' // Based on your ConsoleModels data
    },
    {
        name: 'Nintendo',
        path: '/console/nintendo',
        Icon: SiNintendo,
        ariaLabel: 'Select Nintendo Console',
        description: 'Nintendo Switch repairs for Joy-Con Drift, Screen & Docking.',
        modelCount: '1+ models' // Based on your ConsoleModels data
    },
];
// --- ---

function ConsoleSelection() {
    const [hoveredBrand, setHoveredBrand] = useState(null);

    return (
        <div style={pageStyle}>
            {/* Hero Section Removed */}

            {/* Brands Grid Section */}
            <section style={brandsSelectionSectionStyle}>
                <div style={contentContainerStyle}>
                    <div style={sectionHeaderStyle}>
                        <h2 style={sectionTitleStyle}>Select Your Gaming Console</h2>
                        <p style={sectionDescriptionStyle}>
                            Choose your console brand to see supported models and repair options.
                        </p>
                    </div>

                    <div style={brandsGridStyle}>
                        {consoleBrands.map((brand) => (
                            <Link
                                key={brand.name}
                                to={brand.path}
                                style={{
                                    ...brandCardStyle,
                                    transform: hoveredBrand === brand.name ? 'translateY(-8px)' : 'translateY(0)',
                                    boxShadow: hoveredBrand === brand.name
                                        ? '0 12px 30px rgba(30, 58, 138, 0.15)'
                                        : '0 4px 15px rgba(30, 58, 138, 0.08)',
                                }}
                                title={`View ${brand.name} Models`}
                                role="button"
                                aria-label={brand.ariaLabel}
                                onMouseEnter={() => setHoveredBrand(brand.name)}
                                onMouseLeave={() => setHoveredBrand(null)}
                            >
                                <div style={brandIconContainerStyle}>
                                    <brand.Icon size={50} style={brandIconStyle} />
                                </div>
                                <div style={brandContentStyle}>
                                    <h3 style={brandNameStyle}>{brand.name}</h3>
                                    <p style={brandDescriptionStyle}>{brand.description}</p>
                                    <div style={brandStatsStyle}>
                                        <span style={modelCountStyle}>{brand.modelCount}</span>
                                    </div>
                                </div>
                                <div style={brandActionStyle}>
                                    <span style={actionTextStyle}>View Models</span>
                                    <FaArrowRight style={arrowIconStyle} />
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Services Highlight Section */}
            <section style={servicesHighlightSectionStyle}>
                <div style={contentContainerStyle}>
                    <div style={highlightHeaderStyle}>
                        <FaWrench style={highlightIconStyle} />
                        <h2 style={highlightTitleStyle}>Pro Console Repairs</h2>
                    </div>
                    <div style={servicesGridStyle}>
                        <div style={serviceCardStyle}>
                            <h4 style={serviceCardTitleStyle}>Disc Drive Fixes</h4>
                            <p style={serviceCardDescriptionStyle}>
                                Not reading discs? We repair or replace faulty console disc drives.
                            </p>
                        </div>
                        <div style={serviceCardStyle}>
                            <h4 style={serviceCardTitleStyle}>HDMI Port Repair</h4>
                            <p style={serviceCardDescriptionStyle}>
                                No signal? We fix damaged or broken HDMI ports for a clear picture.
                            </p>
                        </div>
                        <div style={serviceCardStyle}>
                            <h4 style={serviceCardTitleStyle}>Overheating Issues</h4>
                            <p style={serviceCardDescriptionStyle}>
                                Console shutting down? We offer cleaning and thermal paste replacement.
                            </p>
                        </div>
                        <div style={serviceCardStyle}>
                            <h4 style={serviceCardTitleStyle}>Controller Repairs</h4>
                            <p style={serviceCardDescriptionStyle}>
                                Stick drift or button issues? We can repair your controllers.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section style={ctaSectionStyle}>
                <div style={contentContainerStyle}>
                    <div style={ctaContentStyle}>
                        <h2 style={ctaTitleStyle}>Other Console Problems?</h2>
                        <p style={ctaDescriptionStyle}>
                            We handle a wide range of console issues. Contact us today for a
                            free diagnostic and custom repair quote.
                        </p>
                        <div style={ctaButtonsStyle}>
                            <Link to="/contact" style={primaryCtaButtonStyle}>
                                Get Custom Quote
                            </Link>
                            <Link to="/location" style={secondaryCtaButtonStyle}>
                                Visit Our Store
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

// --- Styles (Using #1E3A8A blue) ---
const pageStyle = { fontFamily: "'Poppins', sans-serif", backgroundColor: '#fff', minHeight: '100vh', color: '#1E3A8A', };
const brandsSelectionSectionStyle = { padding: '4rem 2rem', paddingTop: '6rem', backgroundColor: '#fff', };
const contentContainerStyle = { maxWidth: '1400px', margin: '0 auto', };
const sectionHeaderStyle = { textAlign: 'center', marginBottom: '3rem', };
const sectionTitleStyle = { fontSize: '2.5rem', fontWeight: '700', color: '#1E3A8A', marginBottom: '1rem', };
const sectionDescriptionStyle = { fontSize: '1.1rem', color: '#1E3A8A', maxWidth: '600px', margin: '0 auto', opacity: 0.8, };
const brandsGridStyle = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem', marginTop: '2rem', };
const brandCardStyle = { backgroundColor: '#fff', border: '1px solid #e8f0fe', borderRadius: '16px', padding: '2rem', textDecoration: 'none', color: '#1E3A8A', transition: 'all 0.3s ease', cursor: 'pointer', display: 'flex', flexDirection: 'column', height: '100%', };
const brandIconContainerStyle = { display: 'flex', justifyContent: 'center', marginBottom: '1.5rem', padding: '1rem', backgroundColor: '#f8fbff', borderRadius: '12px', width: '80px', height: '80px', alignSelf: 'center', alignItems: 'center', };
const brandIconStyle = { color: '#1E3A8A', };
const brandContentStyle = { textAlign: 'center', flex: 1, marginBottom: '1.5rem', };
const brandNameStyle = { fontSize: '1.5rem', fontWeight: '600', color: '#1E3A8A', marginBottom: '0.75rem', };
const brandDescriptionStyle = { fontSize: '0.95rem', color: '#1E3A8A', opacity: 0.8, lineHeight: '1.5', marginBottom: '1rem', };
const brandStatsStyle = { display: 'flex', justifyContent: 'center', gap: '1rem', };
const modelCountStyle = { fontSize: '0.85rem', color: '#1E3A8A', backgroundColor: '#e8f0fe', padding: '0.25rem 0.75rem', borderRadius: '12px', fontWeight: '500', };
const brandActionStyle = { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', paddingTop: '1rem', borderTop: '1px solid #e8f0fe', };
const actionTextStyle = { fontSize: '1rem', fontWeight: '500', color: '#1E3A8A', };
const arrowIconStyle = { fontSize: '0.9rem', color: '#1E3A8A', transition: 'transform 0.3s ease', };
const servicesHighlightSectionStyle = { backgroundColor: '#f8fbff', padding: '4rem 2rem', };
const highlightHeaderStyle = { textAlign: 'center', marginBottom: '3rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', };
const highlightIconStyle = { fontSize: '2rem', color: '#1E3A8A', };
const highlightTitleStyle = { fontSize: '2.2rem', fontWeight: '600', color: '#1E3A8A', margin: 0, };
const servicesGridStyle = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem', };
const serviceCardStyle = { backgroundColor: '#fff', padding: '2rem', borderRadius: '12px', border: '1px solid #e8f0fe', boxShadow: '0 2px 8px rgba(30, 58, 138, 0.05)', };
const serviceCardTitleStyle = { fontSize: '1.3rem', fontWeight: '600', color: '#1E3A8A', marginBottom: '1rem', };
const serviceCardDescriptionStyle = { fontSize: '1rem', color: '#1E3A8A', opacity: 0.8, lineHeight: '1.6', margin: 0, };
const ctaSectionStyle = { backgroundColor: '#e8f0fe', padding: '4rem 2rem', };
const ctaContentStyle = { textAlign: 'center', maxWidth: '700px', margin: '0 auto', };
const ctaTitleStyle = { fontSize: '2.2rem', fontWeight: '600', color: '#1E3A8A', marginBottom: '1rem', };
const ctaDescriptionStyle = { fontSize: '1.1rem', color: '#1E3A8A', opacity: 0.8, lineHeight: '1.6', marginBottom: '2rem', };
const ctaButtonsStyle = { display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap', };
const primaryCtaButtonStyle = { backgroundColor: '#1E3A8A', color: '#fff', padding: '1rem 2rem', borderRadius: '4px', textDecoration: 'none', fontWeight: '500', fontSize: '1rem', fontFamily: "'Poppins', sans-serif", transition: 'all 0.3s ease', border: '2px solid #1E3A8A', };
const secondaryCtaButtonStyle = { backgroundColor: 'transparent', color: '#1E3A8A', padding: '1rem 2rem', borderRadius: '4px', textDecoration: 'none', fontWeight: '500', fontSize: '1rem', fontFamily: "'Poppins', sans-serif", transition: 'all 0.3s ease', border: '2px solid #1E3A8A', };

export default ConsoleSelection;