// src/pages/BuyDeviceListPage.js
import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
    FaArrowLeft, FaSearch, FaLaptop, FaMobileAlt, FaTabletAlt, FaClock, FaGamepad, FaHeadphones,
    FaSortAmountDown, FaTags, FaTools, FaShieldAlt
} from 'react-icons/fa';
import DeviceSaleCard from '../components/DeviceSaleCard';
import DeviceSaleDetailModal from '../components/DeviceSaleDetailModal';

const categoryDetailsMap = {
    phones: { title: "Phones", icon: FaMobileAlt },
    tablets: { title: "Tablets", icon: FaTabletAlt },
    laptops: { title: "Laptops", icon: FaLaptop },
    watches: { title: "Watches", icon: FaClock },
    consoles: { title: "Gaming Consoles", icon: FaGamepad },
    accessories: { title: "Accessories", icon: FaHeadphones },
    default: { title: "Devices", icon: FaTools }
};

const conditionOrder = { 'New': 1, 'Excellent': 2, 'Very Good': 3, 'Good': 4, 'Fair': 5 };

function BuyDeviceListPage() {
    const { category } = useParams();
    const [searchTerm, setSearchTerm] = useState('');
    const [filterBrand, setFilterBrand] = useState('');
    const [filterCondition, setFilterCondition] = useState('');
    const [sortBy, setSortBy] = useState('name-asc');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [products, setProducts] = useState([]);
    const [selectedDeviceForModal, setSelectedDeviceForModal] = useState(null);
    const [showDetailModal, setShowDetailModal] = useState(false);

    const categoryInfo = categoryDetailsMap[category] || categoryDetailsMap.default;
    const CategoryIcon = categoryInfo.icon;

    // Fetch products from API
    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await fetch(`/api/products/category/${category}`);
                if (!response.ok) throw new Error('Failed to fetch products');
                const data = await response.json();
                setProducts(data);
            } catch (err) {
                console.error('Error fetching products:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (category) {
            fetchProducts();
        }
    }, [category]);

    const availableBrands = useMemo(() => {
        const brands = new Set(products.map(p => p.brand));
        return Array.from(brands).sort();
    }, [products]);

    const availableConditions = useMemo(() => {
        const conditions = new Set(products.map(p => p.condition));
        return Array.from(conditions).sort((a, b) => (conditionOrder[a] || 99) - (conditionOrder[b] || 99));
    }, [products]);

    const displayedDevices = useMemo(() => {
        let filtered = products.filter(device => {
            const matchesSearchTerm = device.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                     device.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                     (device.description && device.description.toLowerCase().includes(searchTerm.toLowerCase()));
            const matchesBrandFilter = filterBrand ? device.brand === filterBrand : true;
            const matchesConditionFilter = filterCondition ? device.condition === filterCondition : true;
            
            return matchesSearchTerm && matchesBrandFilter && matchesConditionFilter;
        });

        // Sorting
        const [sortField, sortDirection] = sortBy.split('-');
        filtered.sort((a, b) => {
            let valA = a[sortField];
            let valB = b[sortField];

            if (sortField === 'price') {
                valA = a.price;
                valB = b.price;
            } else if (sortField === 'condition') {
                valA = conditionOrder[a.condition] || 99;
                valB = conditionOrder[b.condition] || 99;
            } else if (typeof valA === 'string') {
                valA = valA.toLowerCase();
                valB = valB.toLowerCase();
            }

            if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
            if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
            return 0;
        });

        return filtered;
    }, [products, searchTerm, filterBrand, filterCondition, sortBy]);

    const handleDeviceDetailsClick = (device) => {
        setSelectedDeviceForModal(device);
        setShowDetailModal(true);
    };

    const handleCloseDetailModal = () => {
        setShowDetailModal(false);
        setSelectedDeviceForModal(null);
    };
    
    const clearAllFilters = () => {
        setSearchTerm('');
        setFilterBrand('');
        setFilterCondition('');
        setSortBy('name-asc');
    };

    if (loading) {
        return (
            <div style={pageStyle}>
                <div style={loadingContainerStyle}>
                    <h2>Loading {categoryInfo.title}...</h2>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div style={pageStyle}>
                <div style={errorContainerStyle}>
                    <h2>Error Loading Products</h2>
                    <p>{error}</p>
                    <Link to="/buy" style={backButtonStyle}>
                        <FaArrowLeft style={{ marginRight: '8px' }} />
                        Back to Categories
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div style={pageStyle}>
            <div style={headerSectionStyle}>
                <div style={headerNavStyle}>
                    <Link to="/buy" style={backButtonStyle}>
                        <FaArrowLeft style={{ marginRight: '8px' }} />
                        Back to Categories
                    </Link>
                </div>
                <div style={headerContentStyle}>
                    <CategoryIcon style={categoryIconHeaderStyle} />
                    <h1 style={pageTitleStyle}>Buy {categoryInfo.title}</h1>
                    <p style={pageSubtitleStyle}>
                        Explore our collection of quality {categoryInfo.title.toLowerCase()}.
                        Found {displayedDevices.length} device(s).
                    </p>
                </div>

                <div style={controlsBarContainerStyle}>
                    <div style={searchInputContainerStyle}>
                        <FaSearch style={searchIconStyle} />
                        <input
                            type="text"
                            placeholder={`Search ${categoryInfo.title.toLowerCase()}...`}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={searchInputStyle}
                        />
                    </div>
                    <div style={filterSortGroupStyle}>
                        {availableBrands.length > 1 && (
                            <div style={filterItemContainerStyle}>
                                <FaTags style={filterIconStyle} />
                                <select value={filterBrand} onChange={(e) => setFilterBrand(e.target.value)} style={filterSelectStyle}>
                                    <option value="">All Brands</option>
                                    {availableBrands.map(brand => (<option key={brand} value={brand}>{brand}</option>))}
                                </select>
                            </div>
                        )}
                        {availableConditions.length > 0 && (
                             <div style={filterItemContainerStyle}>
                                <FaShieldAlt style={filterIconStyle} />
                                <select value={filterCondition} onChange={(e) => setFilterCondition(e.target.value)} style={filterSelectStyle}>
                                    <option value="">All Conditions</option>
                                    {availableConditions.map(condition => (<option key={condition} value={condition}>{condition}</option>))}
                                </select>
                            </div>
                        )}
                        <div style={filterItemContainerStyle}>
                            <FaSortAmountDown style={filterIconStyle} />
                            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} style={filterSelectStyle}>
                                <option value="name-asc">Name (A-Z)</option>
                                <option value="name-desc">Name (Z-A)</option>
                                <option value="price-asc">Price (Low-High)</option>
                                <option value="price-desc">Price (High-Low)</option>
                                <option value="condition-asc">Condition (Best First)</option>
                            </select>
                        </div>
                    </div>
                     {(searchTerm || filterBrand || filterCondition) && (
                        <button onClick={clearAllFilters} style={clearAllFiltersButtonStyle}>Clear All Filters</button>
                    )}
                </div>
            </div>

            <div style={contentContainerStyle}>
                {displayedDevices.length > 0 ? (
                    <div style={devicesGridStyle}>
                        {displayedDevices.map(device => (
                            <DeviceSaleCard key={device._id} device={device} onDetailsClick={handleDeviceDetailsClick} />
                        ))}
                    </div>
                ) : (
                    <div style={emptyStateStyle}>
                        <h3 style={emptyTitleStyle}>No Devices Match Your Criteria</h3>
                        <p>Try adjusting your search or filters, or check back later as our inventory updates frequently.</p>
                        <button onClick={clearAllFilters} style={clearFiltersButtonStyle}>Reset Filters</button>
                         <p style={{ marginTop: '1rem' }}>
                            <Link to="/contact" style={contactLinkStyle}>Contact us</Link> if you're looking for something specific.
                        </p>
                    </div>
                )}
            </div>

            <DeviceSaleDetailModal device={selectedDeviceForModal} show={showDetailModal} onClose={handleCloseDetailModal} />
        </div>
    );
}

// Styles - keeping them shorter
const pageStyle = { fontFamily: "'Poppins', sans-serif", backgroundColor: '#f4f6f8', minHeight: '100vh', color: '#1E3A8A' };
const headerSectionStyle = { backgroundColor: '#fff', padding: '2rem', borderBottom: '1px solid #dee2e6' };
const headerNavStyle = { display: 'flex', justifyContent: 'flex-start', marginBottom: '1.5rem', maxWidth: '1400px', margin: '0 auto 1.5rem auto', padding: '0 1rem' };
const backButtonStyle = { display: 'inline-flex', alignItems: 'center', color: '#1E3A8A', textDecoration: 'none', fontSize: '1rem', fontWeight: '500', padding: '0.6rem 1.2rem', border: '1px solid #ced4da', borderRadius: '8px', transition: 'all 0.2s ease' };
const headerContentStyle = { textAlign: 'center', marginBottom: '2rem' };
const categoryIconHeaderStyle = { fontSize: '3.5rem', color: '#1E3A8A', marginBottom: '0.75rem' };
const pageTitleStyle = { fontSize: '2.8rem', fontWeight: '700', color: '#1E3A8A', marginBottom: '0.75rem', textTransform: 'capitalize' };
const pageSubtitleStyle = { fontSize: '1.15rem', color: '#495057', maxWidth: '750px', margin: '0 auto', lineHeight: 1.7 };
const controlsBarContainerStyle = { display: 'flex', flexDirection: 'column', gap: '1rem', padding: '1.5rem', backgroundColor: '#ffffff', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0, 0, 0, 0.07)', maxWidth: '1200px', margin: '0 auto', border: '1px solid #e0e7ff' };
const searchInputContainerStyle = { position: 'relative', width: '100%' };
const searchIconStyle = { position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#6c757d', fontSize: '1.1rem' };
const searchInputStyle = { width: '100%', padding: '0.9rem 1rem 0.9rem 3rem', fontSize: '1rem', border: '1px solid #ced4da', borderRadius: '8px', outline: 'none', fontFamily: "'Poppins', sans-serif", boxSizing: 'border-box' };
const filterSortGroupStyle = { display: 'flex', flexWrap: 'wrap', gap: '1rem', width: '100%' };
const filterItemContainerStyle = { display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: '#f8f9fa', padding: '0.5rem 0.75rem', borderRadius: '8px', border: '1px solid #ced4da', flex: '1 1 auto', minWidth: '180px' };
const filterIconStyle = { color: '#1E3A8A', fontSize: '1rem', opacity: 0.9 };
const filterSelectStyle = { flexGrow: 1, padding: '0.4rem', fontSize: '0.9rem', border: 'none', borderRadius: '6px', outline: 'none', fontFamily: "'Poppins', sans-serif", backgroundColor: 'transparent', cursor: 'pointer', minWidth: '120px' };
const clearAllFiltersButtonStyle = { backgroundColor: 'transparent', color: '#1E3A8A', border: '1px solid #1E3A8A', padding: '0.75rem 1.2rem', borderRadius: '8px', cursor: 'pointer', fontSize: '0.9rem', fontWeight: '600', fontFamily: "'Poppins', sans-serif", transition: 'all 0.2s ease', marginLeft: 'auto', whiteSpace: 'nowrap' };
const contentContainerStyle = { padding: '2.5rem 1.5rem', maxWidth: '1500px', margin: '0 auto' };
const devicesGridStyle = { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' };
const emptyStateStyle = { textAlign: 'center', padding: '4rem 2rem', backgroundColor: '#fff', borderRadius: '12px', maxWidth: '700px', margin: '3rem auto', boxShadow: '0 6px 20px rgba(30, 58, 138, 0.08)' };
const emptyTitleStyle = { fontSize: '1.7rem', fontWeight: '600', color: '#1E3A8A', marginBottom: '1rem' };
const clearFiltersButtonStyle = { backgroundColor: '#1E3A8A', color: '#fff', border: 'none', padding: '0.75rem 1.5rem', borderRadius: '8px', cursor: 'pointer', fontSize: '1rem', fontWeight: '500', fontFamily: "'Poppins', sans-serif", marginTop: '1.5rem', transition: 'background-color 0.2s ease' };
const contactLinkStyle = { color: '#1E3A8A', textDecoration: 'underline', fontWeight: '600' };
const loadingContainerStyle = { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px', color: '#1E3A8A' };
const errorContainerStyle = { textAlign: 'center', padding: '3rem', color: '#1E3A8A' };

export default BuyDeviceListPage;