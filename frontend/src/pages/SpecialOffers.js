// src/pages/SpecialOffers.js
import React, { useState, useEffect } from 'react';
import { FaFire, FaPercent, FaClock, FaStar } from 'react-icons/fa';
import DeviceSaleCard from '../components/DeviceSaleCard';
import DeviceSaleDetailModal from '../components/DeviceSaleDetailModal';

const SpecialOffers = () => {
    const [specialOffers, setSpecialOffers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedDevice, setSelectedDevice] = useState(null);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [filterCategory, setFilterCategory] = useState('all');

    useEffect(() => {
        fetchSpecialOffers();
    }, []);

    const fetchSpecialOffers = async () => {
        try {
            const response = await fetch('/api/products/special-offers');
            if (!response.ok) throw new Error('Failed to fetch special offers');
            const data = await response.json();
            setSpecialOffers(data);
        } catch (error) {
            console.error('Error fetching special offers:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDetailsClick = (device) => {
        setSelectedDevice(device);
        setShowDetailModal(true);
    };

    const filteredOffers = filterCategory === 'all' 
        ? specialOffers 
        : specialOffers.filter(offer => offer.category === filterCategory);

    const categories = ['all', ...new Set(specialOffers.map(offer => offer.category))];

    if (loading) {
        return (
            <div style={styles.loadingContainer}>
                <div style={styles.loader}></div>
                <p>Loading special offers...</p>
            </div>
        );
    }

    return (
        <div style={styles.container}>
            {/* Hero Section */}
            <div style={styles.heroSection}>
                <div style={styles.heroContent}>
                    <div style={styles.heroIcon}>
                        <FaFire size={60} color="#ffffff" />
                    </div>
                    <h1 style={styles.heroTitle}>SPECIAL OFFERS</h1>
                    <p style={styles.heroSubtitle}>
                        Limited time deals on premium devices. Don't miss out on these amazing prices!
                    </p>
                    <div style={styles.offerBadges}>
                        <div style={styles.badge}>
                            <FaPercent size={20} />
                            <span>Up to 50% Off</span>
                        </div>
                        <div style={styles.badge}>
                            <FaClock size={20} />
                            <span>Limited Time</span>
                        </div>
                        <div style={styles.badge}>
                            <FaStar size={20} />
                            <span>Premium Quality</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filter Section */}
            {specialOffers.length > 0 && (
                <div style={styles.filterSection}>
                    <h3 style={styles.filterTitle}>Filter by Category:</h3>
                    <div style={styles.filterButtons}>
                        {categories.map(cat => (
                            <button
                                key={cat}
                                style={{
                                    ...styles.filterButton,
                                    ...(filterCategory === cat ? styles.filterButtonActive : {})
                                }}
                                onClick={() => setFilterCategory(cat)}
                            >
                                {cat.charAt(0).toUpperCase() + cat.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Offers Grid */}
            {filteredOffers.length === 0 ? (
                <div style={styles.emptyState}>
                    <div style={styles.emptyIcon}>🎯</div>
                    <h2>No Special Offers Available</h2>
                    <p>Check back soon for amazing deals!</p>
                </div>
            ) : (
                <div style={styles.offersGrid}>
                    {filteredOffers.map(device => (
                        <div key={device._id} style={styles.offerWrapper}>
                            <div style={styles.offerBadge}>
                                <FaFire /> Special Offer
                            </div>
                            <DeviceSaleCard
                                device={device}
                                onDetailsClick={handleDetailsClick}
                            />
                        </div>
                    ))}
                </div>
            )}

            {/* Detail Modal */}
            {showDetailModal && selectedDevice && (
                <DeviceSaleDetailModal
                    device={selectedDevice}
                    onClose={() => {
                        setShowDetailModal(false);
                        setSelectedDevice(null);
                    }}
                />
            )}
        </div>
    );
};

const styles = {
    container: {
        minHeight: '100vh',
        backgroundColor: '#f8fafc',
        fontFamily: 'Poppins, sans-serif'
    },
    loadingContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        gap: '1rem'
    },
    loader: {
        width: '50px',
        height: '50px',
        border: '4px solid #e5e7eb',
        borderTop: '4px solid #dc2626',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite'
    },
    heroSection: {
        background: 'linear-gradient(135deg, #dc2626 0%, #ef4444 100%)',
        color: 'white',
        padding: '4rem 2rem',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden'
    },
    heroContent: {
        maxWidth: '800px',
        margin: '0 auto',
        position: 'relative',
        zIndex: 1
    },
    heroIcon: {
        marginBottom: '1.5rem',
        animation: 'pulse 2s infinite',
        filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.3))'
    },
    heroTitle: {
        fontSize: '4rem',
        fontWeight: '900',
        marginBottom: '1rem',
        textShadow: '3px 3px 6px rgba(0,0,0,0.3)',
        letterSpacing: '0.05em',
        fontFamily: "'Poppins', sans-serif",
        textTransform: 'uppercase'
    },
    heroSubtitle: {
        fontSize: '1.3rem',
        marginBottom: '2rem',
        opacity: 0.95,
        fontWeight: '400',
        maxWidth: '600px',
        margin: '0 auto 2rem'
    },
    offerBadges: {
        display: 'flex',
        justifyContent: 'center',
        gap: '2rem',
        flexWrap: 'wrap'
    },
    badge: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        backgroundColor: 'rgba(255,255,255,0.2)',
        padding: '0.75rem 1.5rem',
        borderRadius: '50px',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255,255,255,0.3)',
        fontWeight: '600'
    },
    filterSection: {
        padding: '2rem',
        textAlign: 'center'
    },
    filterTitle: {
        fontSize: '1.2rem',
        marginBottom: '1rem',
        color: '#1E3A8A'
    },
    filterButtons: {
        display: 'flex',
        justifyContent: 'center',
        gap: '0.5rem',
        flexWrap: 'wrap'
    },
    filterButton: {
        padding: '0.5rem 1.5rem',
        border: '2px solid #e5e7eb',
        borderRadius: '25px',
        backgroundColor: 'white',
        color: '#6b7280',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        fontWeight: '500'
    },
    filterButtonActive: {
        backgroundColor: '#dc2626',
        color: 'white',
        borderColor: '#dc2626'
    },
    offersGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '2rem',
        padding: '2rem',
        maxWidth: '1400px',
        margin: '0 auto'
    },
    offerWrapper: {
        position: 'relative'
    },
    offerBadge: {
        position: 'absolute',
        top: '-10px',
        right: '10px',
        backgroundColor: '#ef4444',
        color: 'white',
        padding: '0.5rem 1rem',
        borderRadius: '20px',
        fontSize: '0.85rem',
        fontWeight: '600',
        display: 'flex',
        alignItems: 'center',
        gap: '0.3rem',
        zIndex: 10,
        boxShadow: '0 4px 6px rgba(239, 68, 68, 0.3)'
    },
    emptyState: {
        textAlign: 'center',
        padding: '4rem 2rem',
        color: '#6b7280'
    },
    emptyIcon: {
        fontSize: '4rem',
        marginBottom: '1rem'
    }
};

// Add keyframes for animations
const styleSheet = document.createElement('style');
styleSheet.textContent = `
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
    @keyframes pulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.1); }
    }
`;
document.head.appendChild(styleSheet);

export default SpecialOffers;