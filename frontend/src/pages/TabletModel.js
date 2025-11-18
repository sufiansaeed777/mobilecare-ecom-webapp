// src/pages/TabletModels.js
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useParams, Link, useLocation, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaTools, FaSearch } from 'react-icons/fa';
import RepairsModal from '../components/RepairsModal';

function TabletModels() {
    const { brand: brandUrlParam } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [models, setModels] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [selectedTablet, setSelectedTablet] = useState(null);
    const [repairsData, setRepairsData] = useState([]);
    const [showRepairsModal, setShowRepairsModal] = useState(false);
    const [isLoadingRepairs, setIsLoadingRepairs] = useState(false);
    const [fetchError, setFetchError] = useState(null);

    const getTabletDbBrand = useCallback((urlBrand) => {
        const lower = urlBrand?.toLowerCase();
        switch (lower) {
            case 'ipad': return 'Apple';
            case 'samsung': return 'Samsung';
            default: return urlBrand;
        }
    }, []);

    // Fetch tablets from backend
    useEffect(() => {
        const fetchTablets = async () => {
            setLoading(true);
            setError(null);
            try {
                const dbBrand = getTabletDbBrand(brandUrlParam);
                const response = await fetch('/api/tablets');
                
                if (!response.ok) {
                    throw new Error(`Failed to fetch tablets: ${response.status}`);
                }
                
                const allTablets = await response.json();
                
                // Filter tablets by brand
                const brandTablets = allTablets
                    .filter(tablet => tablet.brand === dbBrand)
                    .map(tablet => ({
                        name: tablet.model,
                        image: tablet.image,
                        brand: tablet.brand,
                        repairs: tablet.repairs || []
                    }))
                    .sort((a, b) => a.name.localeCompare(b.name));
                
                setModels(brandTablets);
            } catch (err) {
                console.error('Error fetching tablets:', err);
                setError(err.message);
                setModels([]);
            } finally {
                setLoading(false);
            }
        };

        if (brandUrlParam) {
            fetchTablets();
        }
    }, [brandUrlParam, getTabletDbBrand]);

    const displayModels = useMemo(() => {
        if (!searchTerm.trim()) {
            return models;
        }
        return models.filter(model =>
            model.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [models, searchTerm]);

    useEffect(() => {
        setSelectedTablet(null);
        setShowRepairsModal(false);
        setIsLoadingRepairs(false);
        setFetchError(null);
        setRepairsData([]);
        setSearchTerm('');
    }, [brandUrlParam]);

    const handleModelClick = useCallback(async (model) => {
        if (!model || isLoadingRepairs) return;
        setSelectedTablet(model);
        setIsLoadingRepairs(true);
        setFetchError(null);
        setRepairsData([]);
        setShowRepairsModal(true);
        try {
            // Use the repairs data that came with the tablet
            if (model.repairs && model.repairs.length > 0) {
                setRepairsData(model.repairs);
            } else {
                // Fallback to API call if repairs not included
                const dbBrand = model.brand || getTabletDbBrand(brandUrlParam);
                const url = `/api/tablets/repairs?brand=${dbBrand}&model=${encodeURIComponent(model.name)}`;
                console.log("Request URL:", url);
                const response = await fetch(url);
                if (!response.ok) throw new Error(`Server error: ${response.status} ${response.statusText}`);
                const data = await response.json();
                setRepairsData(Array.isArray(data) ? data : []);
            }
        } catch (error) {
            console.error('Error fetching tablet repairs data:', error);
            setFetchError(error.message || 'Failed to load repair details.');
            setRepairsData([]);
        } finally {
            setIsLoadingRepairs(false);
        }
    }, [isLoadingRepairs, brandUrlParam, getTabletDbBrand]);

    const handleModelKeyDown = useCallback((event, model) => {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            handleModelClick(model);
        }
    }, [handleModelClick]);

    const handleCloseModal = useCallback(() => {
        setShowRepairsModal(false);
    }, []);

    useEffect(() => {
        if (models && models.length > 0 && !isLoadingRepairs && !loading) {
            const searchParams = new URLSearchParams(location.search);
            const modelNameToOpen = searchParams.get('openModal');

            if (modelNameToOpen) {
                const decodedModelName = decodeURIComponent(modelNameToOpen);
                const modelToOpen = models.find(m => m.name === decodedModelName);

                if (modelToOpen && (!selectedTablet || selectedTablet.name !== modelToOpen.name)) {
                    handleModelClick(modelToOpen);
                    navigate(location.pathname, { replace: true });
                } else if (!modelToOpen) {
                    navigate(location.pathname, { replace: true });
                }
            }
        }
    }, [location.search, models, handleModelClick, navigate, selectedTablet, isLoadingRepairs, loading]);

    const dbBrandName = useMemo(() => getTabletDbBrand(brandUrlParam), [brandUrlParam, getTabletDbBrand]);
    const brandDisplayName = dbBrandName || (brandUrlParam ? brandUrlParam.charAt(0).toUpperCase() + brandUrlParam.slice(1) : '');

    if (loading) {
        return (
            <div style={pageStyle}>
                <div style={loadingContainerStyle}>
                    <h2>Loading {brandDisplayName} tablets...</h2>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div style={pageStyle}>
                <div style={errorContainerStyle}>
                    <h2>Error Loading Tablets</h2>
                    <p>{error}</p>
                    <Link to="/tablet" style={backButtonStyle}>
                        <FaArrowLeft style={{ marginRight: '8px' }} />
                        Back to Brands
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div style={pageStyle}>
            <div style={headerStyle}>
                <Link to="/tablet" style={backButtonStyle}>
                    <FaArrowLeft style={{ marginRight: '8px' }} />
                    Back to Brands
                </Link>
                <div style={titleSectionStyle}>
                    <h1 style={titleStyle}>
                        {brandDisplayName} Tablet Repairs
                    </h1>
                    <p style={subtitleStyle}>
                        Select your {brandDisplayName} model to view available repairs and pricing.
                    </p>
                </div>
                <div style={searchContainerStyle}>
                    <div style={searchInputContainerStyle}>
                        <FaSearch style={searchIconStyle} />
                        <input
                            type="text"
                            placeholder={`Search ${brandDisplayName} models...`}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={searchInputStyle}
                        />
                    </div>
                </div>
            </div>
            <div style={contentContainerStyle}>
                {displayModels.length > 0 ? (
                    <div style={modelsGridStyle}>
                        {displayModels.map((model, index) => (
                            <ModelCard
                                key={`${model.name}-${index}`}
                                model={model}
                                onClick={() => handleModelClick(model)}
                                onKeyDown={(e) => handleModelKeyDown(e, model)}
                            />
                        ))}
                    </div>
                ) : (
                    <div style={emptyStateStyle}>
                        {searchTerm.trim() ? (
                            <>
                                <h3 style={emptyTitleStyle}>No models found</h3>
                                <p>No {brandDisplayName} models match your search "{searchTerm}"</p>
                                <button
                                    onClick={() => setSearchTerm('')}
                                    style={clearSearchButtonStyle}
                                >
                                    Clear Search
                                </button>
                            </>
                        ) : (
                            <>
                                <h3 style={emptyTitleStyle}>No {brandDisplayName} Models Available</h3>
                                <p>We don't have any {brandDisplayName} models in our database yet.</p>
                                <p>
                                    <Link to="/contact" style={contactLinkStyle}>
                                        Contact us directly
                                    </Link>
                                    {' '}for repair information and quotes.
                                </p>
                            </>
                        )}
                    </div>
                )}
            </div>
            {showRepairsModal && selectedTablet && (
                <RepairsModal
                    show={showRepairsModal}
                    onClose={handleCloseModal}
                    watchModel={{ ...selectedTablet, repairs: repairsData }}
                    isLoading={isLoadingRepairs}
                    error={fetchError}
                />
            )}
        </div>
    );
}

// Model Card Component
const ModelCard = ({ model, onClick, onKeyDown }) => (
    <div
        style={modelCardStyle}
        onClick={onClick}
        onKeyDown={onKeyDown}
        role="button"
        tabIndex={0}
        title={`View repairs for ${model.name}`}
    >
        <div style={imageContainerStyle}>
            {model.image ? (
                <img
                    src={model.image}
                    alt={model.name}
                    style={modelImageStyle}
                    loading="lazy"
                    onError={(e) => {
                        e.target.onerror = null;
                        e.target.style.display = 'none';
                        const placeholder = e.target.nextElementSibling;
                        if (placeholder) {
                            placeholder.style.display = 'flex';
                        }
                    }}
                />
            ) : null}
            <div style={{ ...placeholderStyle, display: model.image ? 'none' : 'flex' }}>
                <span>{model.name.split(' ')[0]}</span>
                <small>No Image</small>
            </div>
        </div>
        <div style={cardContentStyle}>
            <h3 style={modelNameStyle}>{model.name}</h3>
            <div style={viewRepairsStyle}>
                <FaTools style={toolIconStyle} />
                <span>View Repairs</span>
            </div>
        </div>
    </div>
);

// --- Styles ---
const pageStyle = { fontFamily: "'Poppins', sans-serif", backgroundColor: '#fff', minHeight: '100vh', color: '#1E3A8A', };
const headerStyle = { backgroundColor: '#fff', color: '#1E3A8A', padding: '2rem', textAlign: 'center', borderBottom: '1px solid #e8f0fe', };
const backButtonStyle = { display: 'inline-flex', alignItems: 'center', color: '#1E3A8A', textDecoration: 'none', fontSize: '1rem', fontWeight: '500', marginBottom: '1.5rem', padding: '0.5rem 1rem', border: '1px solid #1E3A8A', borderRadius: '4px', transition: 'all 0.3s ease', };
const titleSectionStyle = { marginBottom: '2rem', };
const titleStyle = { fontSize: '2.5rem', fontWeight: '700', marginBottom: '0.5rem', color: '#1E3A8A', };
const subtitleStyle = { fontSize: '1.1rem', color: '#5E7AAB', maxWidth: '600px', margin: '0 auto', };
const searchContainerStyle = { maxWidth: '500px', margin: '0 auto', };
const searchInputContainerStyle = { position: 'relative', display: 'flex', alignItems: 'center', };
const searchIconStyle = { position: 'absolute', left: '1rem', color: '#1E3A8A', zIndex: 1, };
const searchInputStyle = { width: '100%', padding: '0.75rem 1rem 0.75rem 2.5rem', fontSize: '1rem', border: '1px solid #e0e0e0', borderRadius: '25px', outline: 'none', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)', fontFamily: "'Poppins', sans-serif", backgroundColor: '#f8f9fa' };
const contentContainerStyle = { padding: '2rem', maxWidth: '1400px', margin: '0 auto', };
const modelsGridStyle = { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '2rem', };
const modelCardStyle = { backgroundColor: '#fff', border: '1px solid #e8f0fe', borderRadius: '12px', padding: '1.5rem', cursor: 'pointer', transition: 'all 0.3s ease', boxShadow: '0 2px 8px rgba(30, 58, 138, 0.08)', textAlign: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' };
const imageContainerStyle = { position: 'relative', height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem', backgroundColor: '#f8fbff', borderRadius: '8px', };
const modelImageStyle = { maxWidth: '100%', maxHeight: '180px', objectFit: 'contain', borderRadius: '4px', };
const cardContentStyle = { textAlign: 'center', marginTop: 'auto' };
const modelNameStyle = { fontSize: '1.1rem', fontWeight: '600', color: '#1E3A8A', marginBottom: '0.75rem', lineHeight: '1.3', minHeight: '3.9rem' };
const viewRepairsStyle = { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', color: '#1E3A8A', fontSize: '0.9rem', fontWeight: '500', marginTop: '1rem', padding: '0.5rem', backgroundColor: '#e8f0fe', borderRadius: '4px' };
const toolIconStyle = { fontSize: '0.85rem', };
const placeholderStyle = { width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', backgroundColor: '#e9ecef', color: '#adb5bd', fontSize: '0.9rem', borderRadius: '4px', };
const emptyStateStyle = { textAlign: 'center', padding: '3rem 2rem', backgroundColor: '#f8fbff', border: '1px solid #e8f0fe', borderRadius: '12px', maxWidth: '600px', margin: '2rem auto', };
const emptyTitleStyle = { fontSize: '1.5rem', fontWeight: '600', color: '#1E3A8A', marginBottom: '1rem', };
const clearSearchButtonStyle = { backgroundColor: '#1E3A8A', color: '#fff', border: 'none', padding: '0.75rem 1.5rem', borderRadius: '4px', cursor: 'pointer', fontSize: '1rem', fontWeight: '500', fontFamily: "'Poppins', sans-serif", marginTop: '1rem', transition: 'background-color 0.3s ease', };
const contactLinkStyle = { color: '#1E3A8A', textDecoration: 'none', fontWeight: '500', };
const loadingContainerStyle = { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px', color: '#1E3A8A', };
const errorContainerStyle = { textAlign: 'center', padding: '3rem', color: '#1E3A8A', };

export default TabletModels;