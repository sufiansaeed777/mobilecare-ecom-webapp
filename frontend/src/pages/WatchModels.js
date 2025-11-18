// src/pages/WatchModels.js
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useParams, Link, useLocation, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaTools, FaSearch } from 'react-icons/fa';
import RepairsModal from '../components/RepairsModal';

function WatchModels() {
    const { brand: brandUrlParam } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [models, setModels] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [selectedWatch, setSelectedWatch] = useState(null);
    const [repairsData, setRepairsData] = useState([]);
    const [showRepairsModal, setShowRepairsModal] = useState(false);
    const [isLoadingRepairs, setIsLoadingRepairs] = useState(false);
    const [fetchError, setFetchError] = useState(null);

    const getWatchDbBrand = useCallback((urlBrand) => {
        const lower = urlBrand?.toLowerCase();
        switch (lower) {
            case 'iwatch': return 'Apple';
            case 'samsung': return 'Samsung';
            default: return urlBrand;
        }
    }, []);

    // Function to extract or determine watch release year
    const getWatchReleaseYear = useCallback((watchName, brand) => {
        const name = watchName.toLowerCase();
        
        // Watch model to year mapping for known models
        const watchYearMapping = {
            // Apple Watch models
            'apple watch series 10': 2024, 'apple watch series 9': 2023, 'apple watch series 8': 2022,
            'apple watch series 7': 2021, 'apple watch series 6': 2020, 'apple watch series 5': 2019,
            'apple watch series 4': 2018, 'apple watch series 3': 2017, 'apple watch series 2': 2016,
            'apple watch series 1': 2015, 'apple watch': 2015,
            'apple watch se (2nd generation)': 2022, 'apple watch se 2nd generation': 2022, 'apple watch se (2022)': 2022,
            'apple watch se (1st generation)': 2020, 'apple watch se 1st generation': 2020, 'apple watch se (2020)': 2020, 'apple watch se': 2020,
            'apple watch ultra 2': 2023, 'apple watch ultra': 2022,
            
            // Samsung Galaxy Watch models
            'galaxy watch 7': 2024, 'galaxy watch ultra': 2024,
            'galaxy watch 6': 2023, 'galaxy watch 6 classic': 2023,
            'galaxy watch 5': 2022, 'galaxy watch 5 pro': 2022,
            'galaxy watch 4': 2021, 'galaxy watch 4 classic': 2021,
            'galaxy watch 3': 2020, 'galaxy watch active 2': 2019, 'galaxy watch active': 2019,
            'galaxy watch': 2018, 'gear s3': 2016, 'gear s2': 2015,
            
            // Samsung Galaxy Buds (if included in watches category)
            'galaxy buds 3': 2024, 'galaxy buds 3 pro': 2024,
            'galaxy buds 2': 2021, 'galaxy buds 2 pro': 2022,
            'galaxy buds live': 2020, 'galaxy buds plus': 2020, 'galaxy buds': 2019,
            
            // Fitbit models
            'fitbit sense 2': 2022, 'fitbit sense': 2020,
            'fitbit versa 4': 2022, 'fitbit versa 3': 2020, 'fitbit versa 2': 2019, 'fitbit versa': 2018,
            'fitbit charge 6': 2023, 'fitbit charge 5': 2021, 'fitbit charge 4': 2020, 'fitbit charge 3': 2018,
            'fitbit inspire 3': 2022, 'fitbit inspire 2': 2020, 'fitbit inspire': 2019,
            
            // Garmin models
            'garmin venu 3': 2023, 'garmin venu 2': 2021, 'garmin venu': 2019,
            'garmin forerunner 965': 2023, 'garmin forerunner 955': 2022, 'garmin forerunner 945': 2019,
            'garmin fenix 8': 2024, 'garmin fenix 7': 2022, 'garmin fenix 6': 2019,
            
            // Fossil models
            'fossil gen 6': 2021, 'fossil gen 5': 2019, 'fossil gen 4': 2018,
            
            // Amazfit models
            'amazfit gtr 4': 2022, 'amazfit gtr 3': 2021, 'amazfit gtr 2': 2020,
            'amazfit gts 4': 2022, 'amazfit gts 3': 2021, 'amazfit gts 2': 2020,
        };
        
        // Check exact match first
        const exactMatch = watchYearMapping[name];
        if (exactMatch) return exactMatch;
        
        // Try partial matching for variations
        for (const [modelName, year] of Object.entries(watchYearMapping)) {
            if (name.includes(modelName) || modelName.includes(name)) {
                return year;
            }
        }
        
        // Extract year from watch name (look for 4-digit years)
        const yearMatch = name.match(/\b(20[0-9]{2})\b/);
        if (yearMatch) {
            return parseInt(yearMatch[1]);
        }
        
        // Extract series/generation numbers and estimate year
        if (brand === 'Apple') {
            // For Apple Watch Series
            const seriesMatch = name.match(/series\s*(\d+)/);
            if (seriesMatch) {
                const seriesNum = parseInt(seriesMatch[1]);
                if (seriesNum >= 10) return 2024;
                if (seriesNum >= 9) return 2023;
                if (seriesNum >= 8) return 2022;
                if (seriesNum >= 7) return 2021;
                if (seriesNum >= 6) return 2020;
                if (seriesNum >= 5) return 2019;
                if (seriesNum >= 4) return 2018;
                if (seriesNum >= 3) return 2017;
                if (seriesNum >= 2) return 2016;
                if (seriesNum >= 1) return 2015;
            }
            
            // Apple Watch Ultra
            if (name.includes('ultra')) {
                if (name.includes('2')) return 2023;
                return 2022;
            }
            
            // Apple Watch SE
            if (name.includes('se')) {
                if (name.includes('2nd') || name.includes('2022')) return 2022;
                return 2020;
            }
        }
        
        if (brand === 'Samsung') {
            // For Galaxy Watch series
            const watchMatch = name.match(/galaxy\s*watch\s*(\d+)/);
            if (watchMatch) {
                const watchNum = parseInt(watchMatch[1]);
                if (watchNum >= 7) return 2024;
                if (watchNum >= 6) return 2023;
                if (watchNum >= 5) return 2022;
                if (watchNum >= 4) return 2021;
                if (watchNum >= 3) return 2020;
                return 2018; // Original Galaxy Watch
            }
            
            // Galaxy Buds
            const budsMatch = name.match(/galaxy\s*buds\s*(\d+)/);
            if (budsMatch) {
                const budsNum = parseInt(budsMatch[1]);
                if (budsNum >= 3) return 2024;
                if (budsNum >= 2) return 2021;
                return 2019; // Original Galaxy Buds
            }
        }
        
        // For Fitbit models
        if (name.includes('fitbit')) {
            if (name.includes('charge')) {
                const chargeMatch = name.match(/charge\s*(\d+)/);
                if (chargeMatch) {
                    const chargeNum = parseInt(chargeMatch[1]);
                    if (chargeNum >= 6) return 2023;
                    if (chargeNum >= 5) return 2021;
                    if (chargeNum >= 4) return 2020;
                    if (chargeNum >= 3) return 2018;
                }
            }
            
            if (name.includes('versa')) {
                const versaMatch = name.match(/versa\s*(\d+)/);
                if (versaMatch) {
                    const versaNum = parseInt(versaMatch[1]);
                    if (versaNum >= 4) return 2022;
                    if (versaNum >= 3) return 2020;
                    if (versaNum >= 2) return 2019;
                    return 2018; // Original Versa
                }
            }
            
            if (name.includes('sense')) {
                if (name.includes('2')) return 2022;
                return 2020;
            }
        }
        
        // For generation-based models
        const genMatch = name.match(/gen\s*(\d+)/);
        if (genMatch) {
            const genNum = parseInt(genMatch[1]);
            if (genNum >= 6) return 2021;
            if (genNum >= 5) return 2019;
            if (genNum >= 4) return 2018;
            return 2017;
        }
        
        // Default fallback - return current year minus a reasonable offset
        return 2020;
    }, []);

    // Sort watches from latest to oldest
    const sortWatchesByYear = useCallback((watches) => {
        return watches.sort((a, b) => {
            const yearA = getWatchReleaseYear(a.name, a.brand);
            const yearB = getWatchReleaseYear(b.name, b.brand);
            
            // Sort by year (descending - latest first)
            if (yearA !== yearB) {
                return yearB - yearA;
            }
            
            // If same year, sort alphabetically
            return a.name.localeCompare(b.name);
        });
    }, [getWatchReleaseYear]);

    // Fetch watches from backend
    useEffect(() => {
        const fetchWatches = async () => {
            setLoading(true);
            setError(null);
            try {
                const dbBrand = getWatchDbBrand(brandUrlParam);
                const response = await fetch('/api/watches');
                
                if (!response.ok) {
                    throw new Error(`Failed to fetch watches: ${response.status}`);
                }
                
                const allWatches = await response.json();
                
                // Filter watches by brand
                const brandWatches = allWatches
                    .filter(watch => watch.brand === dbBrand)
                    .map(watch => ({
                        name: watch.model,
                        image: watch.image,
                        brand: watch.brand,
                        repairs: watch.repairs || []
                    }));
                
                // Sort watches from latest to oldest
                const sortedWatches = sortWatchesByYear(brandWatches);
                setModels(sortedWatches);
            } catch (err) {
                console.error('Error fetching watches:', err);
                setError(err.message);
                setModels([]);
            } finally {
                setLoading(false);
            }
        };

        if (brandUrlParam) {
            fetchWatches();
        }
    }, [brandUrlParam, getWatchDbBrand, sortWatchesByYear]);

    const displayModels = useMemo(() => {
        if (!searchTerm.trim()) {
            return models;
        }
        
        const filteredModels = models.filter(model =>
            model.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        
        // Re-sort filtered results to maintain latest-to-oldest order
        return sortWatchesByYear(filteredModels);
    }, [models, searchTerm, sortWatchesByYear]);

    useEffect(() => {
        setSelectedWatch(null);
        setShowRepairsModal(false);
        setIsLoadingRepairs(false);
        setFetchError(null);
        setRepairsData([]);
        setSearchTerm('');
    }, [brandUrlParam]);

    const handleModelClick = useCallback(async (model) => {
        if (!model || isLoadingRepairs) return;
        setSelectedWatch(model);
        setIsLoadingRepairs(true);
        setFetchError(null);
        setRepairsData([]);
        setShowRepairsModal(true);
        try {
            // Use the repairs data that came with the watch
            if (model.repairs && model.repairs.length > 0) {
                setRepairsData(model.repairs);
            } else {
                // Fallback to API call if repairs not included
                const dbBrand = model.brand || getWatchDbBrand(brandUrlParam);
                const url = `/api/watches/repairs?brand=${dbBrand}&model=${encodeURIComponent(model.name)}`;
                console.log("Request URL:", url);
                const response = await fetch(url);
                if (!response.ok) throw new Error(`Server error: ${response.status} ${response.statusText}`);
                const data = await response.json();
                setRepairsData(Array.isArray(data) ? data : []);
            }
        } catch (error) {
            console.error('Error fetching watch repairs data:', error);
            setFetchError(error.message || 'Failed to load repair details.');
            setRepairsData([]);
        } finally {
            setIsLoadingRepairs(false);
        }
    }, [isLoadingRepairs, brandUrlParam, getWatchDbBrand]);

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

                if (modelToOpen && (!selectedWatch || selectedWatch.name !== modelToOpen.name)) {
                    handleModelClick(modelToOpen);
                    navigate(location.pathname, { replace: true });
                } else if (!modelToOpen) {
                    navigate(location.pathname, { replace: true });
                }
            }
        }
    }, [location.search, models, handleModelClick, navigate, selectedWatch, isLoadingRepairs, loading]);

    const dbBrandName = useMemo(() => getWatchDbBrand(brandUrlParam), [brandUrlParam, getWatchDbBrand]);
    const brandDisplayName = dbBrandName === 'Apple' ? 'Apple Watch' : (dbBrandName || (brandUrlParam ? brandUrlParam.charAt(0).toUpperCase() + brandUrlParam.slice(1) : ''));

    if (loading) {
        return (
            <div style={pageStyle}>
                <div style={loadingContainerStyle}>
                    <h2>Loading {brandDisplayName} watches...</h2>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div style={pageStyle}>
                <div style={errorContainerStyle}>
                    <h2>Error Loading Watches</h2>
                    <p>{error}</p>
                    <Link to="/watch" style={backButtonStyle}>
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
                <Link to="/watch" style={backButtonStyle}>
                    <FaArrowLeft style={{ marginRight: '8px' }} />
                    Back to Brands
                </Link>

                <div style={titleSectionStyle}>
                    <h1 style={titleStyle}>
                        {brandDisplayName} Repairs
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

            {showRepairsModal && selectedWatch && (
                <RepairsModal
                    show={showRepairsModal}
                    onClose={handleCloseModal}
                    watchModel={{ ...selectedWatch, repairs: repairsData }}
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
const modelImageStyle = { maxWidth: '80%', maxHeight: '180px', objectFit: 'contain', borderRadius: '4px', };
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

export default WatchModels;