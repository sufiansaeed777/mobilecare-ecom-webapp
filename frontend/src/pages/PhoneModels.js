// src/pages/PhoneModels.js
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useParams, Link, useLocation, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaTools, FaSearch } from 'react-icons/fa';
import RepairsModal from '../components/RepairsModal';

function PhoneModels() {
    const { brand: brandUrlParam } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [models, setModels] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [selectedPhone, setSelectedPhone] = useState(null);
    const [repairsData, setRepairsData] = useState([]);
    const [showRepairsModal, setShowRepairsModal] = useState(false);
    const [isLoadingRepairs, setIsLoadingRepairs] = useState(false);
    const [fetchError, setFetchError] = useState(null);

    const getPhoneDbBrand = useCallback((urlBrand) => {
        const lower = urlBrand?.toLowerCase();
        switch (lower) {
            case 'iphone': return 'Apple';
            case 'samsung': return 'Samsung';
            case 'pixel': return 'Google Pixel';
            case 'oneplus': return 'OnePlus';
            case 'huawei': return 'Huawei';
            case 'nokia': return 'Nokia';
            case 'motorola': return 'Motorola';
            case 'oppo': return 'Oppo';
            case 'redmi': return 'Redmi';
            default: return urlBrand;
        }
    }, []);

    // Function to extract or determine phone release year
    const getPhoneReleaseYear = useCallback((phoneName, brand) => {
        const name = phoneName.toLowerCase();
        
        // Phone model to year mapping for known models
        const phoneYearMapping = {
            // iPhone models
            'iphone 16 pro max': 2024, 'iphone 16 pro': 2024, 'iphone 16 plus': 2024, 'iphone 16': 2024,
            'iphone 15 pro max': 2023, 'iphone 15 pro': 2023, 'iphone 15 plus': 2023, 'iphone 15': 2023,
            'iphone 14 pro max': 2022, 'iphone 14 pro': 2022, 'iphone 14 plus': 2022, 'iphone 14': 2022,
            'iphone 13 pro max': 2021, 'iphone 13 pro': 2021, 'iphone 13 mini': 2021, 'iphone 13': 2021,
            'iphone 12 pro max': 2020, 'iphone 12 pro': 2020, 'iphone 12 mini': 2020, 'iphone 12': 2020,
            'iphone se (3rd generation)': 2022, 'iphone se 3rd generation': 2022, 'iphone se (2022)': 2022,
            'iphone se (2nd generation)': 2020, 'iphone se 2nd generation': 2020, 'iphone se (2020)': 2020,
            'iphone 11 pro max': 2019, 'iphone 11 pro': 2019, 'iphone 11': 2019,
            'iphone xs max': 2018, 'iphone xs': 2018, 'iphone xr': 2018,
            'iphone x': 2017, 'iphone 8 plus': 2017, 'iphone 8': 2017,
            'iphone 7 plus': 2016, 'iphone 7': 2016, 'iphone 6s plus': 2015, 'iphone 6s': 2015,
            'iphone 6 plus': 2014, 'iphone 6': 2014,
            
            // Samsung Galaxy S Series
            'galaxy s24 ultra': 2024, 'galaxy s24 plus': 2024, 'galaxy s24': 2024,
            'galaxy s23 ultra': 2023, 'galaxy s23 plus': 2023, 'galaxy s23': 2023,
            'galaxy s22 ultra': 2022, 'galaxy s22 plus': 2022, 'galaxy s22': 2022,
            'galaxy s21 ultra': 2021, 'galaxy s21 plus': 2021, 'galaxy s21': 2021,
            'galaxy s20 ultra': 2020, 'galaxy s20 plus': 2020, 'galaxy s20': 2020,
            'galaxy s10 plus': 2019, 'galaxy s10': 2019, 'galaxy s10e': 2019,
            'galaxy s9 plus': 2018, 'galaxy s9': 2018, 'galaxy s8 plus': 2017, 'galaxy s8': 2017,
            'galaxy s7 edge': 2016, 'galaxy s7': 2016, 'galaxy s6 edge': 2015, 'galaxy s6': 2015,
            
            // Samsung Galaxy Z Series
            'galaxy z fold6': 2024, 'galaxy z flip6': 2024,
            'galaxy z fold5': 2023, 'galaxy z flip5': 2023,
            'galaxy z fold4': 2022, 'galaxy z flip4': 2022,
            'galaxy z fold3': 2021, 'galaxy z flip3': 2021,
            'galaxy z fold2': 2020, 'galaxy z flip': 2020,
            'galaxy fold': 2019,
            
            // Samsung Galaxy A Series
            'galaxy a55': 2024, 'galaxy a35': 2024, 'galaxy a25': 2024, 'galaxy a15': 2024,
            'galaxy a54': 2023, 'galaxy a34': 2023, 'galaxy a24': 2023, 'galaxy a14': 2023,
            'galaxy a53': 2022, 'galaxy a33': 2022, 'galaxy a23': 2022, 'galaxy a13': 2022,
            'galaxy a52': 2021, 'galaxy a32': 2021, 'galaxy a22': 2021, 'galaxy a12': 2021,
            'galaxy a51': 2020, 'galaxy a31': 2020, 'galaxy a21': 2020, 'galaxy a11': 2020,
            
            // Google Pixel
            'pixel 9 pro xl': 2024, 'pixel 9 pro': 2024, 'pixel 9': 2024,
            'pixel 8 pro': 2023, 'pixel 8': 2023, 'pixel 8a': 2024,
            'pixel 7 pro': 2022, 'pixel 7': 2022, 'pixel 7a': 2023,
            'pixel 6 pro': 2021, 'pixel 6': 2021, 'pixel 6a': 2022,
            'pixel 5': 2020, 'pixel 5a': 2021, 'pixel 4a': 2020, 'pixel 4 xl': 2019, 'pixel 4': 2019,
            'pixel 3a xl': 2019, 'pixel 3a': 2019, 'pixel 3 xl': 2018, 'pixel 3': 2018,
            
            // OnePlus
            'oneplus 12': 2024, 'oneplus 12r': 2024,
            'oneplus 11': 2023, 'oneplus 11r': 2023,
            'oneplus 10 pro': 2022, 'oneplus 10t': 2022,
            'oneplus 9 pro': 2021, 'oneplus 9': 2021, 'oneplus 9r': 2021,
            'oneplus 8 pro': 2020, 'oneplus 8': 2020, 'oneplus 8t': 2020,
            'oneplus 7 pro': 2019, 'oneplus 7': 2019, 'oneplus 7t': 2019,
        };
        
        // Check exact match first
        const exactMatch = phoneYearMapping[name];
        if (exactMatch) return exactMatch;
        
        // Try partial matching for variations
        for (const [modelName, year] of Object.entries(phoneYearMapping)) {
            if (name.includes(modelName) || modelName.includes(name)) {
                return year;
            }
        }
        
        // Extract year from phone name (look for 4-digit years)
        const yearMatch = name.match(/\b(20[0-9]{2})\b/);
        if (yearMatch) {
            return parseInt(yearMatch[1]);
        }
        
        // Extract number-based models and estimate year
        if (brand === 'Apple') {
            // For iPhone models with numbers
            const iphoneMatch = name.match(/iphone\s*(\d+)/);
            if (iphoneMatch) {
                const modelNum = parseInt(iphoneMatch[1]);
                if (modelNum >= 16) return 2024;
                if (modelNum >= 15) return 2023;
                if (modelNum >= 14) return 2022;
                if (modelNum >= 13) return 2021;
                if (modelNum >= 12) return 2020;
                if (modelNum >= 11) return 2019;
                if (modelNum >= 10) return 2017;
                if (modelNum >= 8) return 2017;
                if (modelNum >= 7) return 2016;
                if (modelNum >= 6) return 2014;
            }
        }
        
        if (brand === 'Samsung') {
            // For Galaxy S series
            const sMatch = name.match(/galaxy\s*s\s*(\d+)/);
            if (sMatch) {
                const modelNum = parseInt(sMatch[1]);
                if (modelNum >= 24) return 2024;
                if (modelNum >= 23) return 2023;
                if (modelNum >= 22) return 2022;
                if (modelNum >= 21) return 2021;
                if (modelNum >= 20) return 2020;
                if (modelNum >= 10) return 2019;
                if (modelNum >= 9) return 2018;
                if (modelNum >= 8) return 2017;
                if (modelNum >= 7) return 2016;
                if (modelNum >= 6) return 2015;
            }
            
            // For Galaxy A series
            const aMatch = name.match(/galaxy\s*a\s*(\d+)/);
            if (aMatch) {
                const modelNum = parseInt(aMatch[1]);
                if (modelNum >= 55) return 2024;
                if (modelNum >= 54) return 2023;
                if (modelNum >= 53) return 2022;
                if (modelNum >= 52) return 2021;
                if (modelNum >= 51) return 2020;
                return 2019; // Older A series
            }
        }
        
        if (brand === 'Google Pixel') {
            const pixelMatch = name.match(/pixel\s*(\d+)/);
            if (pixelMatch) {
                const modelNum = parseInt(pixelMatch[1]);
                if (modelNum >= 9) return 2024;
                if (modelNum >= 8) return 2023;
                if (modelNum >= 7) return 2022;
                if (modelNum >= 6) return 2021;
                if (modelNum >= 5) return 2020;
                if (modelNum >= 4) return 2019;
                if (modelNum >= 3) return 2018;
            }
        }
        
        // Default fallback - return current year minus a reasonable offset
        return 2020;
    }, []);

    // Sort phones from latest to oldest
    const sortPhonesByYear = useCallback((phones) => {
        return phones.sort((a, b) => {
            const yearA = getPhoneReleaseYear(a.name, a.brand);
            const yearB = getPhoneReleaseYear(b.name, b.brand);
            
            // Sort by year (descending - latest first)
            if (yearA !== yearB) {
                return yearB - yearA;
            }
            
            // If same year, sort alphabetically
            return a.name.localeCompare(b.name);
        });
    }, [getPhoneReleaseYear]);

    // Fetch phones from backend
    useEffect(() => {
        const fetchPhones = async () => {
            setLoading(true);
            setError(null);
            try {
                const dbBrand = getPhoneDbBrand(brandUrlParam);
                const response = await fetch('/api/phones');
                
                if (!response.ok) {
                    throw new Error(`Failed to fetch phones: ${response.status}`);
                }
                
                const allPhones = await response.json();
                
                // Filter phones by brand
                const brandPhones = allPhones
                    .filter(phone => phone.brand === dbBrand)
                    .map(phone => ({
                        name: phone.model,
                        image: phone.image,
                        brand: phone.brand,
                        repairs: phone.repairs || []
                    }));
                
                // Sort phones from latest to oldest
                const sortedPhones = sortPhonesByYear(brandPhones);
                setModels(sortedPhones);
            } catch (err) {
                console.error('Error fetching phones:', err);
                setError(err.message);
                setModels([]);
            } finally {
                setLoading(false);
            }
        };

        if (brandUrlParam) {
            fetchPhones();
        }
    }, [brandUrlParam, getPhoneDbBrand, sortPhonesByYear]);

    const displayModels = useMemo(() => {
        if (!searchTerm.trim()) {
            return models;
        }
        
        const filteredModels = models.filter(model =>
            model.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        
        // Re-sort filtered results to maintain latest-to-oldest order
        return sortPhonesByYear(filteredModels);
    }, [models, searchTerm, sortPhonesByYear]);

    const groupedModels = useMemo(() => {
        if (brandUrlParam?.toLowerCase() === 'samsung') {
            const groups = {
                'S Series': [],
                'A Series': [],
                'Z Flip': [],
                'Z Fold': [],
                'Note': [],
                'J Series': [],
                'Others': []
            };
            
            const modelsToGroup = searchTerm.trim() 
                ? models.filter(model => model.name.toLowerCase().includes(searchTerm.toLowerCase()))
                : models;
                
            modelsToGroup.forEach(model => {
                const lowerName = model.name.toLowerCase();
                if (lowerName.includes('z flip')) {
                    groups['Z Flip'].push(model);
                } else if (lowerName.includes('z fold')) {
                    groups['Z Fold'].push(model);
                } else if (lowerName.includes('note')) {
                    groups['Note'].push(model);
                } else if (lowerName.includes('galaxy j')) {
                    groups['J Series'].push(model);
                } else if (lowerName.includes('a')) {
                    groups['A Series'].push(model);
                } else if (lowerName.includes('galaxy s')) {
                    groups['S Series'].push(model);
                } else {
                    groups['Others'].push(model);
                }
            });
            
            // Sort each group from latest to oldest
            Object.keys(groups).forEach(groupName => {
                groups[groupName] = sortPhonesByYear(groups[groupName]);
            });
            
            return groups;
        }
        return null;
    }, [brandUrlParam, models, searchTerm, sortPhonesByYear]);

    useEffect(() => {
        setSelectedPhone(null);
        setShowRepairsModal(false);
        setIsLoadingRepairs(false);
        setFetchError(null);
        setRepairsData([]);
        setSearchTerm('');
    }, [brandUrlParam]);

    const handleModelClick = useCallback(async (model) => {
        if (!model || isLoadingRepairs) return;
        setSelectedPhone(model);
        setIsLoadingRepairs(true);
        setFetchError(null);
        setRepairsData([]);
        setShowRepairsModal(true);
        
        try {
            // Use the repairs data that came with the phone
            if (model.repairs && model.repairs.length > 0) {
                setRepairsData(model.repairs);
            } else {
                // Fallback to API call if repairs not included
                const dbBrand = model.brand || getPhoneDbBrand(brandUrlParam);
                const url = `/api/phones/repairs?brand=${dbBrand}&model=${encodeURIComponent(model.name)}`;
                console.log("Request URL:", url);
                const response = await fetch(url);
                if (!response.ok) throw new Error(`Server error: ${response.status} ${response.statusText}`);
                const data = await response.json();
                setRepairsData(Array.isArray(data) ? data : []);
            }
        } catch (error) {
            console.error('Error fetching phone repairs data:', error);
            setFetchError(error.message || 'Failed to load repair details.');
            setRepairsData([]);
        } finally {
            setIsLoadingRepairs(false);
        }
    }, [isLoadingRepairs, brandUrlParam, getPhoneDbBrand]);

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

                if (modelToOpen && (!selectedPhone || selectedPhone.name !== modelToOpen.name)) {
                    console.log("Opening phone modal via URL:", decodedModelName);
                    handleModelClick(modelToOpen);
                    navigate(location.pathname, { replace: true });
                } else if (!modelToOpen) {
                    console.warn("Phone model specified in URL not found:", decodedModelName);
                    navigate(location.pathname, { replace: true });
                }
            }
        }
    }, [location.search, models, handleModelClick, navigate, selectedPhone, isLoadingRepairs, loading]);

    const dbBrandName = useMemo(() => getPhoneDbBrand(brandUrlParam), [brandUrlParam, getPhoneDbBrand]);
    const brandDisplayName = dbBrandName || (brandUrlParam ? brandUrlParam.charAt(0).toUpperCase() + brandUrlParam.slice(1) : '');

    if (loading) {
        return (
            <div style={pageStyle}>
                <div style={loadingContainerStyle}>
                    <h2>Loading {brandDisplayName} phones...</h2>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div style={pageStyle}>
                <div style={errorContainerStyle}>
                    <h2>Error Loading Phones</h2>
                    <p>{error}</p>
                    <Link to="/phone" style={backButtonStyle}>
                        <FaArrowLeft style={{ marginRight: '8px' }} />
                        Back to Brands
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div style={pageStyle}>
            {/* Header Section */}
            <div style={headerStyle}>
                <Link to="/phone" style={backButtonStyle}>
                    <FaArrowLeft style={{ marginRight: '8px' }} />
                    Back to Brands
                </Link>
                
                <div style={titleSectionStyle}>
                    <h1 style={titleStyle}>
                        {brandDisplayName} Phone Repairs
                    </h1>
                    <p style={subtitleStyle}>
                        Select your {brandDisplayName} model to view available repairs and pricing
                    </p>
                </div>

                {/* Search Bar */}
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

            {/* Models Grid */}
            <div style={contentContainerStyle}>
                {brandUrlParam?.toLowerCase() === 'samsung' && groupedModels ? (
                    Object.entries(groupedModels).map(([group, groupModels]) => {
                        if (groupModels.length === 0) return null;
                        
                        return (
                            <div key={group} style={groupSectionStyle}>
                                <h2 style={groupTitleStyle}>{group}</h2>
                                <div style={modelsGridStyle}>
                                    {groupModels.map((model, index) => (
                                        <ModelCard 
                                            key={`${model.name}-${index}`}
                                            model={model}
                                            onClick={() => handleModelClick(model)}
                                            onKeyDown={(e) => handleModelKeyDown(e, model)}
                                        />
                                    ))}
                                </div>
                            </div>
                        );
                    })
                ) : (
                    displayModels.length > 0 ? (
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
                    )
                )}
            </div>

            {showRepairsModal && selectedPhone && (
                <RepairsModal
                    show={showRepairsModal}
                    onClose={handleCloseModal}
                    watchModel={{ ...selectedPhone, repairs: repairsData }}
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

// Styles
const pageStyle = {
    fontFamily: "'Poppins', sans-serif",
    backgroundColor: '#fff',
    minHeight: '100vh',
    color: '#1E3A8A',
};

const headerStyle = {
    backgroundColor: '#fff',
    color: '#1E3A8A',
    padding: '2rem',
    textAlign: 'center',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
};

const backButtonStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    color: '#1E3A8A',
    textDecoration: 'none',
    fontSize: '1rem',
    fontWeight: '500',
    marginBottom: '1.5rem',
    padding: '0.5rem 1rem',
    border: '1px solid #e8f0fe',
    borderRadius: '4px',
    transition: 'all 0.3s ease',
    backgroundColor: '#f8f9fa'
};

const titleSectionStyle = {
    marginBottom: '2rem',
};

const titleStyle = {
    fontSize: '2.5rem',
    fontWeight: '700',
    marginBottom: '0.5rem',
    color: '#1E3A8A',
};

const subtitleStyle = {
    fontSize: '1.1rem',
    color: '#475569',
    maxWidth: '600px',
    margin: '0 auto',
};

const searchContainerStyle = {
    maxWidth: '500px',
    margin: '0 auto',
};

const searchInputContainerStyle = {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
};

const searchIconStyle = {
    position: 'absolute',
    left: '1rem',
    color: '#64748b',
    zIndex: 1,
};

const searchInputStyle = {
    width: '100%',
    padding: '0.75rem 1rem 0.75rem 2.5rem',
    fontSize: '1rem',
    border: '1px solid #e8f0fe',
    backgroundColor: '#fff',
    borderRadius: '25px',
    outline: 'none',
    boxShadow: '0 2px 8px rgba(30, 58, 138, 0.05)',
    fontFamily: "'Poppins', sans-serif",
    color: '#1E3A8A',
};

const contentContainerStyle = {
    padding: '2rem',
    maxWidth: '1400px',
    margin: '0 auto',
};

const groupSectionStyle = {
    marginBottom: '3rem',
};

const groupTitleStyle = {
    fontSize: '1.8rem',
    fontWeight: '600',
    color: '#1E3A8A',
    marginBottom: '1.5rem',
    paddingBottom: '0.5rem',
    borderBottom: '2px solid #f1f5f9',
};

const modelsGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '1.5rem',
    marginBottom: '2rem',
};

const modelCardStyle = {
    backgroundColor: '#fff',
    border: '1px solid #e8f0fe',
    borderRadius: '12px',
    padding: '1.5rem',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 2px 8px rgba(30, 58, 138, 0.05)',
    textAlign: 'center',
};

const imageContainerStyle = {
    position: 'relative',
    height: '200px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '1rem',
    backgroundColor: '#f8fbff',
    borderRadius: '8px',
};

const modelImageStyle = {
    maxWidth: '100%',
    maxHeight: '180px',
    objectFit: 'contain',
    borderRadius: '4px',
};

const cardContentStyle = {
    textAlign: 'center',
};

const modelNameStyle = {
    fontSize: '1.1rem',
    fontWeight: '600',
    color: '#1E3A8A',
    marginBottom: '0.75rem',
    lineHeight: '1.3',
};

const viewRepairsStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    color: '#1E3A8A',
    fontSize: '0.9rem',
    fontWeight: '500',
};

const toolIconStyle = {
    fontSize: '0.85rem',
};

const placeholderStyle = {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e9ecef',
    color: '#adb5bd',
    fontSize: '0.9rem',
    borderRadius: '4px',
};

const emptyStateStyle = {
    textAlign: 'center',
    padding: '3rem 2rem',
    backgroundColor: '#f8fbff',
    border: '1px solid #e8f0fe',
    borderRadius: '12px',
    maxWidth: '600px',
    margin: '2rem auto',
};

const emptyTitleStyle = {
    fontSize: '1.5rem',
    fontWeight: '600',
    color: '#1E3A8A',
    marginBottom: '1rem',
};

const clearSearchButtonStyle = {
    backgroundColor: '#1E3A8A',
    color: '#fff',
    border: 'none',
    padding: '0.75rem 1.5rem',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: '500',
    fontFamily: "'Poppins', sans-serif",
    marginTop: '1rem',
    transition: 'background-color 0.3s ease',
};

const contactLinkStyle = {
    color: '#1E3A8A',
    textDecoration: 'none',
    fontWeight: '500',
};

const loadingContainerStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '400px',
    color: '#1E3A8A',
};

const errorContainerStyle = {
    textAlign: 'center',
    padding: '3rem',
    color: '#1E3A8A',
};

export default PhoneModels;