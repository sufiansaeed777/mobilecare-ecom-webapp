// src/pages/admin/StockManagement.js
import React, { useState, useEffect } from 'react';
import AdminLayout from './components/AdminLayout';
import { 
    FaExclamationTriangle, FaSave, FaUndo, FaSearch, 
    FaCheckCircle, FaTimes, FaBox, FaArrowUp, FaArrowDown,
    FaFilter, FaChartLine, FaExclamationCircle, FaClock,
    FaSortAmountDown, FaSortAmountUp, FaEdit
} from 'react-icons/fa';

const StockManagement = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [changes, setChanges] = useState({});
    const [showLowStockOnly, setShowLowStockOnly] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCategory, setFilterCategory] = useState('');
    const [sortBy, setSortBy] = useState('name');
    const [sortOrder, setSortOrder] = useState('asc');
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [bulkEditMode, setBulkEditMode] = useState(false);

    useEffect(() => {
        fetchProducts();
    }, [showLowStockOnly]);

    const fetchProducts = async () => {
        try {
            const token = localStorage.getItem('adminToken');
            const url = showLowStockOnly 
                ? '/api/products/low-stock?threshold=5' 
                : '/api/products';
            
            const response = await fetch(url, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            
            if (!response.ok) throw new Error('Failed to fetch products');
            const data = await response.json();
            setProducts(data);
        } catch (err) {
            setError('Failed to load products');
        } finally {
            setLoading(false);
        }
    };

    const handleQuantityChange = (productId, value) => {
        const quantity = parseInt(value) || 0;
        const stockStatus = quantity === 0 ? 'Out of Stock' : 
                          quantity <= 5 ? 'Low Stock' : 'In Stock';
        
        setChanges({
            ...changes,
            [productId]: { quantity, stockStatus }
        });
    };

    const handleStatusChange = (productId, stockStatus) => {
        const currentProduct = products.find(p => p._id === productId);
        const currentQuantity = changes[productId]?.quantity ?? currentProduct?.quantity ?? 0;
        
        // Auto-adjust quantity based on status
        let newQuantity = currentQuantity;
        if (stockStatus === 'Out of Stock' && currentQuantity > 0) {
            newQuantity = 0;
        } else if (stockStatus === 'Low Stock' && (currentQuantity === 0 || currentQuantity > 5)) {
            newQuantity = 3;
        } else if (stockStatus === 'In Stock' && currentQuantity <= 5) {
            newQuantity = 10;
        }
        
        setChanges({
            ...changes,
            [productId]: {
                quantity: newQuantity,
                stockStatus
            }
        });
    };

    const handleBulkUpdate = (updateType) => {
        const newChanges = { ...changes };
        selectedProducts.forEach(productId => {
            const product = products.find(p => p._id === productId);
            if (product) {
                switch(updateType) {
                    case 'in-stock':
                        newChanges[productId] = { quantity: 10, stockStatus: 'In Stock' };
                        break;
                    case 'low-stock':
                        newChanges[productId] = { quantity: 3, stockStatus: 'Low Stock' };
                        break;
                    case 'out-of-stock':
                        newChanges[productId] = { quantity: 0, stockStatus: 'Out of Stock' };
                        break;
                    default:
                        break;
                }
            }
        });
        setChanges(newChanges);
        setSelectedProducts([]);
        setBulkEditMode(false);
    };

    const saveChanges = async () => {
        setSaving(true);
        setError('');
        setSuccess('');

        try {
            const token = localStorage.getItem('adminToken');
            const updates = Object.keys(changes).map(productId => ({
                productId,
                ...changes[productId]
            }));

            const response = await fetch('/api/products/bulk-stock', {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ updates })
            });

            if (!response.ok) throw new Error('Failed to update stock');
            
            setSuccess(`Successfully updated ${updates.length} product${updates.length > 1 ? 's' : ''}`);
            setChanges({});
            fetchProducts();
        } catch (err) {
            setError('Failed to save changes');
        } finally {
            setSaving(false);
        }
    };

    const resetChanges = () => {
        setChanges({});
        setSelectedProducts([]);
        setBulkEditMode(false);
    };

    const getDisplayQuantity = (product) => {
        return changes[product._id]?.quantity !== undefined 
            ? changes[product._id].quantity 
            : product.quantity;
    };

    const getDisplayStatus = (product) => {
        return changes[product._id]?.stockStatus || product.stockStatus;
    };

    const hasChanges = Object.keys(changes).length > 0;

    // Calculate stats
    const stats = {
        total: products.length,
        inStock: products.filter(p => p.stockStatus === 'In Stock').length,
        lowStock: products.filter(p => p.stockStatus === 'Low Stock').length,
        outOfStock: products.filter(p => p.stockStatus === 'Out of Stock').length,
        totalValue: products.reduce((sum, p) => sum + (p.price * p.quantity), 0),
        pendingChanges: Object.keys(changes).length
    };

    // Filter and sort products
    const filteredProducts = products
        .filter(product => {
            const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                product.brand.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesCategory = !filterCategory || product.category === filterCategory;
            return matchesSearch && matchesCategory;
        })
        .sort((a, b) => {
            let aVal = a[sortBy];
            let bVal = b[sortBy];
            
            if (sortBy === 'quantity' || sortBy === 'price') {
                aVal = parseFloat(aVal) || 0;
                bVal = parseFloat(bVal) || 0;
            }
            
            if (sortOrder === 'asc') {
                return aVal > bVal ? 1 : -1;
            } else {
                return aVal < bVal ? 1 : -1;
            }
        });

    if (loading) return (
        <AdminLayout activeItem="stock">
            <div style={styles.loadingContainer}>
                <div style={styles.spinner}></div>
                <p>Loading stock levels...</p>
            </div>
        </AdminLayout>
    );

    return (
        <AdminLayout activeItem="stock">
            <div style={styles.container}>
                <div style={styles.header}>
                    <div>
                        <h2 style={styles.title}>Stock Management</h2>
                        <p style={styles.subtitle}>Monitor and update inventory levels</p>
                    </div>
                    <div style={styles.headerActions}>
                        {hasChanges && (
                            <div style={styles.changesBadge}>
                                <FaEdit /> {stats.pendingChanges} pending changes
                            </div>
                        )}
                        <button
                            style={{...styles.bulkEditButton, ...(bulkEditMode ? styles.bulkEditButtonActive : {})}}
                            onClick={() => {
                                setBulkEditMode(!bulkEditMode);
                                setSelectedProducts([]);
                            }}
                        >
                            {bulkEditMode ? 'Cancel Bulk Edit' : 'Bulk Edit'}
                        </button>
                    </div>
                </div>

                {/* Stats Cards */}
                <div style={styles.statsGrid}>
                    <div style={{...styles.statCard, borderLeft: '4px solid #10b981'}}>
                        <div style={styles.statHeader}>
                            <FaCheckCircle style={{...styles.statIcon, color: '#10b981'}} />
                            <span style={styles.statLabel}>In Stock</span>
                        </div>
                        <div style={styles.statContent}>
                            <span style={styles.statNumber}>{stats.inStock}</span>
                            <span style={styles.statPercentage}>
                                {((stats.inStock / stats.total) * 100).toFixed(0)}%
                            </span>
                        </div>
                    </div>
                    
                    <div style={{...styles.statCard, borderLeft: '4px solid #f59e0b'}}>
                        <div style={styles.statHeader}>
                            <FaExclamationTriangle style={{...styles.statIcon, color: '#f59e0b'}} />
                            <span style={styles.statLabel}>Low Stock</span>
                        </div>
                        <div style={styles.statContent}>
                            <span style={styles.statNumber}>{stats.lowStock}</span>
                            <span style={styles.statPercentage}>
                                {((stats.lowStock / stats.total) * 100).toFixed(0)}%
                            </span>
                        </div>
                    </div>
                    
                    <div style={{...styles.statCard, borderLeft: '4px solid #ef4444'}}>
                        <div style={styles.statHeader}>
                            <FaTimes style={{...styles.statIcon, color: '#ef4444'}} />
                            <span style={styles.statLabel}>Out of Stock</span>
                        </div>
                        <div style={styles.statContent}>
                            <span style={styles.statNumber}>{stats.outOfStock}</span>
                            <span style={styles.statPercentage}>
                                {((stats.outOfStock / stats.total) * 100).toFixed(0)}%
                            </span>
                        </div>
                    </div>
                    
                    <div style={{...styles.statCard, borderLeft: '4px solid #3b82f6'}}>
                        <div style={styles.statHeader}>
                            <FaChartLine style={{...styles.statIcon, color: '#3b82f6'}} />
                            <span style={styles.statLabel}>Total Value</span>
                        </div>
                        <div style={styles.statContent}>
                            <span style={styles.statNumber}>£{stats.totalValue.toLocaleString()}</span>
                        </div>
                    </div>
                </div>

                {/* Controls */}
                <div style={styles.controls}>
                    <div style={styles.leftControls}>
                        <div style={styles.searchSection}>
                            <FaSearch style={styles.searchIcon} />
                            <input
                                type="text"
                                placeholder="Search products..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                style={styles.searchInput}
                            />
                        </div>
                        <div style={styles.filterSection}>
                            <FaFilter style={styles.filterIcon} />
                            <select
                                value={filterCategory}
                                onChange={(e) => setFilterCategory(e.target.value)}
                                style={styles.filterSelect}
                            >
                                <option value="">All Categories</option>
                                <option value="phones">Phones</option>
                                <option value="tablets">Tablets</option>
                                <option value="laptops">Laptops</option>
                                <option value="watches">Watches</option>
                                <option value="consoles">Consoles</option>
                                <option value="accessories">Accessories</option>
                            </select>
                        </div>
                        <label style={styles.checkboxLabel}>
                            <input
                                type="checkbox"
                                checked={showLowStockOnly}
                                onChange={(e) => setShowLowStockOnly(e.target.checked)}
                                style={styles.checkbox}
                            />
                            <span>Low Stock Only</span>
                        </label>
                    </div>
                    
                    <div style={styles.rightControls}>
                        {bulkEditMode && selectedProducts.length > 0 && (
                            <div style={styles.bulkActions}>
                                <span style={styles.selectedCount}>{selectedProducts.length} selected</span>
                                <button
                                    style={{...styles.bulkActionBtn, backgroundColor: '#10b981'}}
                                    onClick={() => handleBulkUpdate('in-stock')}
                                >
                                    Mark In Stock
                                </button>
                                <button
                                    style={{...styles.bulkActionBtn, backgroundColor: '#f59e0b'}}
                                    onClick={() => handleBulkUpdate('low-stock')}
                                >
                                    Mark Low Stock
                                </button>
                                <button
                                    style={{...styles.bulkActionBtn, backgroundColor: '#ef4444'}}
                                    onClick={() => handleBulkUpdate('out-of-stock')}
                                >
                                    Mark Out of Stock
                                </button>
                            </div>
                        )}
                        
                        <select
                            value={`${sortBy}-${sortOrder}`}
                            onChange={(e) => {
                                const [field, order] = e.target.value.split('-');
                                setSortBy(field);
                                setSortOrder(order);
                            }}
                            style={styles.sortSelect}
                        >
                            <option value="name-asc">Name (A-Z)</option>
                            <option value="name-desc">Name (Z-A)</option>
                            <option value="quantity-asc">Stock (Low to High)</option>
                            <option value="quantity-desc">Stock (High to Low)</option>
                            <option value="price-asc">Price (Low to High)</option>
                            <option value="price-desc">Price (High to Low)</option>
                        </select>
                        
                        {hasChanges && (
                            <>
                                <button
                                    onClick={saveChanges}
                                    disabled={saving}
                                    style={styles.saveButton}
                                >
                                    <FaSave /> {saving ? 'Saving...' : `Save ${Object.keys(changes).length} Changes`}
                                </button>
                                <button
                                    onClick={resetChanges}
                                    style={styles.resetButton}
                                >
                                    <FaUndo /> Reset
                                </button>
                            </>
                        )}
                    </div>
                </div>

                {error && (
                    <div style={styles.error}>
                        <FaExclamationCircle /> {error}
                    </div>
                )}
                {success && (
                    <div style={styles.success}>
                        <FaCheckCircle /> {success}
                    </div>
                )}

                {/* Table */}
                <div style={styles.tableContainer}>
                    <div style={styles.tableWrapper}>
                        <table style={styles.table}>
                            <thead>
                                <tr>
                                    {bulkEditMode && <th style={styles.th}></th>}
                                    <th style={styles.th}>Product</th>
                                    <th style={styles.th}>Category</th>
                                    <th style={styles.th}>Current</th>
                                    <th style={styles.th}>New Qty</th>
                                    <th style={styles.th}>Status</th>
                                    <th style={styles.th}>Value</th>
                                    <th style={styles.th}>Alerts</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredProducts.map(product => {
                                    const displayQuantity = getDisplayQuantity(product);
                                    const displayStatus = getDisplayStatus(product);
                                    const hasChange = changes[product._id] !== undefined;
                                    const productValue = product.price * displayQuantity;

                                    return (
                                        <tr key={product._id} style={hasChange ? styles.changedRow : {}}>
                                            {bulkEditMode && (
                                                <td style={styles.td}>
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedProducts.includes(product._id)}
                                                        onChange={(e) => {
                                                            if (e.target.checked) {
                                                                setSelectedProducts([...selectedProducts, product._id]);
                                                            } else {
                                                                setSelectedProducts(selectedProducts.filter(id => id !== product._id));
                                                            }
                                                        }}
                                                        style={styles.checkbox}
                                                    />
                                                </td>
                                            )}
                                            <td style={styles.td}>
                                                <div style={styles.productInfo}>
                                                    <strong style={styles.productName}>{product.name}</strong>
                                                    <span style={styles.brandText}>{product.brand}</span>
                                                </div>
                                            </td>
                                            <td style={styles.td}>
                                                <span style={styles.categoryBadge}>
                                                    {product.category}
                                                </span>
                                            </td>
                                            <td style={styles.td}>
                                                <div style={styles.stockInfo}>
                                                    <span style={getStockStyle(product.stockStatus)}>
                                                        {product.quantity}
                                                    </span>
                                                    {hasChange && product.quantity !== displayQuantity && (
                                                        <span style={styles.changeIndicator}>
                                                            {displayQuantity > product.quantity ? (
                                                                <FaArrowUp color="#10b981" />
                                                            ) : (
                                                                <FaArrowDown color="#ef4444" />
                                                            )}
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                            <td style={styles.td}>
                                                <input
                                                    type="number"
                                                    min="0"
                                                    value={displayQuantity}
                                                    onChange={(e) => handleQuantityChange(product._id, e.target.value)}
                                                    style={{
                                                        ...styles.quantityInput,
                                                        ...(hasChange ? styles.quantityInputChanged : {})
                                                    }}
                                                />
                                            </td>
                                            <td style={styles.td}>
                                                <select
                                                    value={displayStatus}
                                                    onChange={(e) => handleStatusChange(product._id, e.target.value)}
                                                    style={{
                                                        ...styles.statusSelect,
                                                        ...getStockSelectStyle(displayStatus)
                                                    }}
                                                >
                                                    <option value="In Stock">In Stock</option>
                                                    <option value="Low Stock">Low Stock</option>
                                                    <option value="Out of Stock">Out of Stock</option>
                                                </select>
                                            </td>
                                            <td style={styles.td}>
                                                <span style={styles.valueText}>
                                                    £{productValue.toLocaleString()}
                                                </span>
                                            </td>
                                            <td style={styles.td}>
                                                {displayQuantity === 0 ? (
                                                    <span style={styles.alertBadge}>
                                                        <FaTimes /> Out
                                                    </span>
                                                ) : displayQuantity <= 5 ? (
                                                    <span style={styles.warningBadge}>
                                                        <FaExclamationTriangle /> Low
                                                    </span>
                                                ) : (
                                                    <span style={styles.successBadge}>
                                                        <FaCheckCircle /> Good
                                                    </span>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                    {filteredProducts.length === 0 && (
                        <div style={styles.emptyState}>
                            <FaBox style={styles.emptyIcon} />
                            <p>No products found matching your criteria</p>
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
};

const getStockStyle = (status) => {
    const baseStyle = { 
        padding: '0.375rem 0.75rem', 
        borderRadius: '9999px', 
        fontSize: 'clamp(0.7rem, 1.5vw, 0.875rem)', 
        fontWeight: '600',
        display: 'inline-block'
    };
    switch(status) {
        case 'In Stock': return { ...baseStyle, backgroundColor: '#d1fae5', color: '#065f46' };
        case 'Low Stock': return { ...baseStyle, backgroundColor: '#fed7aa', color: '#9a3412' };
        case 'Out of Stock': return { ...baseStyle, backgroundColor: '#fee2e2', color: '#991b1b' };
        default: return baseStyle;
    }
};

const getStockSelectStyle = (status) => {
    switch(status) {
        case 'In Stock': return { borderColor: '#10b981', backgroundColor: '#f0fdf4' };
        case 'Low Stock': return { borderColor: '#f59e0b', backgroundColor: '#fffbeb' };
        case 'Out of Stock': return { borderColor: '#ef4444', backgroundColor: '#fef2f2' };
        default: return {};
    }
};

const styles = {
    container: { 
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif"
    },
    loadingContainer: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '60vh',
        color: '#64748b'
    },
    spinner: {
        width: '40px',
        height: '40px',
        border: '3px solid #e2e8f0',
        borderTop: '3px solid #3b82f6',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
        marginBottom: '1rem'
    },
    header: { 
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '2rem',
        flexWrap: 'wrap',
        gap: '1rem'
    },
    title: { 
        fontSize: 'clamp(1.5rem, 4vw, 2.25rem)', 
        fontWeight: '800', 
        color: '#0f172a', 
        marginBottom: '0.25rem',
        letterSpacing: '-0.025em'
    },
    subtitle: {
        fontSize: 'clamp(0.875rem, 2vw, 1rem)',
        color: '#64748b',
        margin: 0
    },
    headerActions: {
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        flexWrap: 'wrap'
    },
    changesBadge: {
        backgroundColor: '#dbeafe',
        color: '#1e40af',
        padding: '0.5rem 1rem',
        borderRadius: '9999px',
        fontSize: 'clamp(0.75rem, 1.5vw, 0.875rem)',
        fontWeight: '600',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem'
    },
    bulkEditButton: {
        backgroundColor: '#6366f1',
        color: '#fff',
        border: 'none',
        padding: 'clamp(0.5rem, 2vw, 0.625rem) clamp(1rem, 2.5vw, 1.25rem)',
        borderRadius: '0.75rem',
        fontSize: 'clamp(0.75rem, 1.5vw, 0.875rem)',
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'all 0.2s ease'
    },
    bulkEditButtonActive: {
        backgroundColor: '#4f46e5'
    },
    statsGrid: { 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 220px), 1fr))', 
        gap: 'clamp(0.75rem, 2vw, 1.25rem)', 
        marginBottom: '2rem' 
    },
    statCard: {
        backgroundColor: '#fff',
        padding: 'clamp(1rem, 3vw, 1.5rem)',
        borderRadius: '1rem',
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        transition: 'all 0.2s ease'
    },
    statHeader: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        marginBottom: '1rem'
    },
    statIcon: {
        fontSize: 'clamp(1rem, 2vw, 1.25rem)'
    },
    statLabel: {
        fontSize: 'clamp(0.75rem, 1.5vw, 0.875rem)',
        color: '#64748b',
        fontWeight: '500'
    },
    statContent: {
        display: 'flex',
        alignItems: 'baseline',
        justifyContent: 'space-between'
    },
    statNumber: {
        fontSize: 'clamp(1.5rem, 3vw, 2rem)',
        fontWeight: '700',
        color: '#0f172a'
    },
    statPercentage: {
        fontSize: 'clamp(0.75rem, 1.5vw, 0.875rem)',
        color: '#64748b',
        fontWeight: '500'
    },
    controls: { 
        display: 'flex', 
        justifyContent: 'space-between',
        alignItems: 'center', 
        gap: '1rem', 
        marginBottom: '1.5rem',
        flexWrap: 'wrap',
        backgroundColor: '#fff',
        padding: 'clamp(1rem, 3vw, 1.5rem)',
        borderRadius: '1rem',
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
    },
    leftControls: {
        display: 'flex',
        alignItems: 'center',
        gap: 'clamp(0.5rem, 2vw, 1rem)',
        flex: 1,
        flexWrap: 'wrap'
    },
    rightControls: {
        display: 'flex',
        alignItems: 'center',
        gap: 'clamp(0.5rem, 2vw, 1rem)',
        flexWrap: 'wrap'
    },
    searchSection: { 
        position: 'relative', 
        minWidth: '200px',
        flex: '1 1 auto',
        maxWidth: '300px'
    },
    searchIcon: { 
        position: 'absolute', 
        left: '1rem', 
        top: '50%', 
        transform: 'translateY(-50%)', 
        color: '#64748b' 
    },
    searchInput: { 
        width: '100%', 
        padding: 'clamp(0.625rem, 2vw, 0.75rem) 1rem clamp(0.625rem, 2vw, 0.75rem) 2.75rem', 
        border: '1px solid #e2e8f0', 
        borderRadius: '0.75rem', 
        fontSize: 'clamp(0.875rem, 2vw, 0.9375rem)',
        transition: 'all 0.2s ease',
        outline: 'none'
    },
    filterSection: {
        position: 'relative'
    },
    filterIcon: {
        position: 'absolute',
        left: '1rem',
        top: '50%',
        transform: 'translateY(-50%)',
        color: '#64748b'
    },
    filterSelect: { 
        padding: 'clamp(0.625rem, 2vw, 0.75rem) 1rem clamp(0.625rem, 2vw, 0.75rem) 2.75rem', 
        border: '1px solid #e2e8f0', 
        borderRadius: '0.75rem', 
        fontSize: 'clamp(0.875rem, 2vw, 0.9375rem)',
        backgroundColor: '#fff',
        cursor: 'pointer',
        outline: 'none'
    },
    sortSelect: {
        padding: 'clamp(0.625rem, 2vw, 0.75rem) 1rem',
        border: '1px solid #e2e8f0',
        borderRadius: '0.75rem',
        fontSize: 'clamp(0.875rem, 2vw, 0.9375rem)',
        backgroundColor: '#fff',
        cursor: 'pointer',
        outline: 'none'
    },
    checkboxLabel: { 
        display: 'flex', 
        alignItems: 'center', 
        gap: '0.5rem', 
        color: '#475569',
        fontWeight: '500',
        cursor: 'pointer',
        fontSize: 'clamp(0.875rem, 2vw, 0.9375rem)',
        whiteSpace: 'nowrap'
    },
    checkbox: { 
        width: '1.125rem', 
        height: '1.125rem', 
        cursor: 'pointer' 
    },
    bulkActions: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        padding: '0.5rem 1rem',
        backgroundColor: '#f1f5f9',
        borderRadius: '0.75rem',
        flexWrap: 'wrap'
    },
    selectedCount: {
        fontSize: 'clamp(0.75rem, 1.5vw, 0.875rem)',
        fontWeight: '600',
        color: '#475569'
    },
    bulkActionBtn: {
        color: '#fff',
        border: 'none',
        padding: 'clamp(0.375rem, 1vw, 0.5rem) clamp(0.75rem, 2vw, 1rem)',
        borderRadius: '0.5rem',
        fontSize: 'clamp(0.7rem, 1.5vw, 0.75rem)',
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'all 0.2s ease'
    },
    saveButton: { 
        backgroundColor: '#10b981', 
        color: '#fff', 
        border: 'none', 
        padding: 'clamp(0.625rem, 2vw, 0.75rem) clamp(1.25rem, 3vw, 1.5rem)', 
        borderRadius: '0.75rem', 
        cursor: 'pointer', 
        display: 'flex', 
        alignItems: 'center', 
        gap: '0.5rem', 
        fontWeight: '600',
        fontSize: 'clamp(0.875rem, 2vw, 0.9375rem)',
        transition: 'all 0.2s ease',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    },
    resetButton: { 
        backgroundColor: '#64748b', 
        color: '#fff', 
        border: 'none', 
        padding: 'clamp(0.625rem, 2vw, 0.75rem) clamp(1.25rem, 3vw, 1.5rem)', 
        borderRadius: '0.75rem', 
        cursor: 'pointer', 
        display: 'flex', 
        alignItems: 'center', 
        gap: '0.5rem',
        fontWeight: '600',
        fontSize: 'clamp(0.875rem, 2vw, 0.9375rem)',
        transition: 'all 0.2s ease'
    },
    error: { 
        backgroundColor: '#fee2e2', 
        color: '#991b1b', 
        padding: '1rem 1.25rem', 
        borderRadius: '0.75rem', 
        marginBottom: '1rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        border: '1px solid #fecaca'
    },
    success: { 
        backgroundColor: '#d1fae5', 
        color: '#065f46', 
        padding: '1rem 1.25rem', 
        borderRadius: '0.75rem', 
        marginBottom: '1rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        border: '1px solid #a7f3d0'
    },
    tableContainer: { 
        backgroundColor: '#fff', 
        borderRadius: '1rem', 
        overflow: 'hidden', 
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
    },
    tableWrapper: {
        overflowX: 'auto',
        WebkitOverflowScrolling: 'touch'
    },
    table: { 
        width: '100%', 
        borderCollapse: 'collapse',
        minWidth: '600px'
    },
    th: { 
        padding: 'clamp(0.75rem, 2vw, 1.25rem) clamp(0.5rem, 2vw, 1rem)', 
        textAlign: 'left', 
        borderBottom: '2px solid #e2e8f0', 
        backgroundColor: '#f8fafc', 
        fontWeight: '600', 
        color: '#475569',
        fontSize: 'clamp(0.75rem, 1.5vw, 0.875rem)',
        textTransform: 'uppercase',
        letterSpacing: '0.025em',
        whiteSpace: 'nowrap'
    },
    td: { 
        padding: 'clamp(0.75rem, 2vw, 1.25rem) clamp(0.5rem, 2vw, 1rem)', 
        borderBottom: '1px solid #f1f5f9', 
        verticalAlign: 'middle' 
    },
    changedRow: { 
        backgroundColor: '#fef3c7' 
    },
    productInfo: { 
        display: 'flex',
        flexDirection: 'column',
        gap: '0.25rem'
    },
    productName: {
        color: '#0f172a',
        fontSize: 'clamp(0.875rem, 2vw, 0.9375rem)'
    },
    brandText: { 
        color: '#64748b', 
        fontSize: 'clamp(0.75rem, 1.5vw, 0.875rem)' 
    },
    categoryBadge: { 
        backgroundColor: '#eff6ff', 
        color: '#1e40af', 
        padding: '0.375rem 0.75rem', 
        borderRadius: '9999px', 
        fontSize: 'clamp(0.7rem, 1.5vw, 0.75rem)',
        fontWeight: '600',
        display: 'inline-block'
    },
    stockInfo: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem'
    },
    changeIndicator: {
        display: 'flex',
        alignItems: 'center'
    },
    quantityInput: { 
        width: 'clamp(80px, 15vw, 100px)', 
        padding: 'clamp(0.5rem, 1.5vw, 0.625rem) clamp(0.625rem, 1.5vw, 0.75rem)', 
        border: '2px solid #e2e8f0', 
        borderRadius: '0.5rem', 
        fontSize: 'clamp(0.875rem, 2vw, 0.9375rem)',
        textAlign: 'center',
        fontWeight: '600',
        transition: 'all 0.2s ease',
        outline: 'none'
    },
    quantityInputChanged: {
        borderColor: '#3b82f6',
        backgroundColor: '#eff6ff'
    },
    statusSelect: { 
        padding: 'clamp(0.5rem, 1.5vw, 0.625rem) clamp(0.625rem, 1.5vw, 0.75rem)', 
        border: '2px solid #e2e8f0', 
        borderRadius: '0.5rem', 
        fontSize: 'clamp(0.75rem, 1.5vw, 0.875rem)', 
        cursor: 'pointer',
        fontWeight: '600',
        transition: 'all 0.2s ease',
        outline: 'none',
        minWidth: 'clamp(120px, 20vw, 140px)'
    },
    valueText: {
        fontWeight: '600',
        color: '#0f172a',
        fontSize: 'clamp(0.875rem, 2vw, 0.9375rem)'
    },
    alertBadge: { 
        color: '#ef4444', 
        backgroundColor: '#fee2e2',
        padding: '0.375rem 0.75rem',
        borderRadius: '9999px',
        display: 'inline-flex', 
        alignItems: 'center', 
        gap: '0.375rem', 
        fontSize: 'clamp(0.7rem, 1.5vw, 0.75rem)',
        fontWeight: '600'
    },
    warningBadge: { 
        color: '#f59e0b',
        backgroundColor: '#fef3c7',
        padding: '0.375rem 0.75rem',
        borderRadius: '9999px',
        display: 'inline-flex', 
        alignItems: 'center', 
        gap: '0.375rem', 
        fontSize: 'clamp(0.7rem, 1.5vw, 0.75rem)',
        fontWeight: '600'
    },
    successBadge: {
        color: '#10b981',
        backgroundColor: '#d1fae5',
        padding: '0.375rem 0.75rem',
        borderRadius: '9999px',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.375rem',
        fontSize: 'clamp(0.7rem, 1.5vw, 0.75rem)',
        fontWeight: '600'
    },
    emptyState: {
        padding: '4rem 2rem',
        textAlign: 'center',
        color: '#64748b'
    },
    emptyIcon: {
        fontSize: '3rem',
        marginBottom: '1rem',
        opacity: 0.3
    }
};

// Add animation
const styleSheet = document.createElement("style");
styleSheet.textContent = `
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
    
    /* Input focus styles */
    .stock-input:focus {
        border-color: #3b82f6 !important;
        box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1) !important;
    }
    
    /* Hover effects */
    .stat-card:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 16px rgba(0,0,0,0.1);
    }
    
    /* Button hover effects */
    button:hover:not(:disabled) {
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    }
    
    button:disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }

    /* Responsive adjustments for very small screens */
    @media (max-width: 480px) {
        .controls {
            flex-direction: column;
            align-items: stretch !important;
        }
        
        .leftControls, .rightControls {
            width: 100%;
            flex-direction: column;
            align-items: stretch !important;
        }
        
        .searchSection, .filterSection {
            width: 100% !important;
            max-width: none !important;
        }
        
        .bulkActions {
            justify-content: center;
        }
    }
`;
document.head.appendChild(styleSheet);

export default StockManagement;