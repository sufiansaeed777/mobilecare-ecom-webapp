// src/pages/admin/AdminProducts.js
import React, { useState, useEffect } from 'react';
import AdminLayout from './components/AdminLayout';
import { 
  FaPlus, FaEdit, FaTrash, FaSearch, FaFilter, FaUpload, 
  FaImage, FaFire, FaTimes, FaBox, FaTag, FaDollarSign,
  FaCheckCircle, FaExclamationCircle, FaClock, FaArrowUp,
  FaArrowDown, FaChartLine, FaSave, FaEye, FaChartBar,
  FaShoppingCart, FaSortAmountDown, FaSortAmountUp, FaList,
  FaTh, FaPercent, FaBoxes
} from 'react-icons/fa';
import { compressImage, formatFileSize } from '../../utils/imageCompression';

const AdminProducts = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCategory, setFilterCategory] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [uploadingImage, setUploadingImage] = useState(false);
    const [imagePreview, setImagePreview] = useState('');
    const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'table'
    const [sortBy, setSortBy] = useState('name');
    const [sortOrder, setSortOrder] = useState('asc');

    // Form states
    const [formData, setFormData] = useState({
        name: '',
        brand: 'Apple',
        category: 'watches',
        price: '',
        condition: 'New',
        deviceType: 'New',
        stockStatus: 'In Stock',
        quantity: 0,
        description: '',
        keyFeatures: [],
        storage: '',
        ram: '',
        color: '',
        caseSize: '',
        image: '',
        isActive: true,
        isSpecialOffer: false
    });

    // Stats calculation
    const stats = {
        total: products.length,
        inStock: products.filter(p => p.stockStatus === 'In Stock').length,
        lowStock: products.filter(p => p.stockStatus === 'Low Stock').length,
        outOfStock: products.filter(p => p.stockStatus === 'Out of Stock').length,
        specialOffers: products.filter(p => p.isSpecialOffer).length,
        totalValue: products.reduce((sum, p) => sum + (p.price * p.quantity), 0)
    };

    // Fetch products
    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const token = localStorage.getItem('adminToken');
            const response = await fetch('/api/products', {
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

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Validate file type
        const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/avif'];
        if (!validTypes.includes(file.type)) {
            setError('Please upload a valid image file (JPEG, PNG, WebP, or AVIF)');
            return;
        }

        // Show original file size
        const originalSize = formatFileSize(file.size);
        setSuccess(`Original image size: ${originalSize}`);

        setUploadingImage(true);
        
        try {
            // Compress the image
            const compressedFile = await compressImage(file, {
                maxWidth: 1920,
                maxHeight: 1920,
                quality: 0.8,
                maxSizeMB: 2
            });
            
            const compressedSize = formatFileSize(compressedFile.size);
            const savedPercentage = Math.round((1 - compressedFile.size / file.size) * 100);
            
            setSuccess(`Image compressed: ${originalSize} → ${compressedSize} (${savedPercentage}% saved)`);
            
            // Upload compressed image
            const formData = new FormData();
            formData.append('image', compressedFile);
            formData.append('deviceType', 'buy');

            const token = localStorage.getItem('adminToken');
            const response = await fetch('/api/admin/upload-image', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });

            if (!response.ok) throw new Error('Failed to upload image');

            const data = await response.json();
            setFormData(prev => ({ ...prev, image: data.imageUrl }));
            setImagePreview(data.imageUrl);
            setSuccess(`Image uploaded successfully! Compressed from ${originalSize} to ${compressedSize}`);
        } catch (err) {
            setError('Failed to compress or upload image: ' + err.message);
        } finally {
            setUploadingImage(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        try {
            const token = localStorage.getItem('adminToken');
            const url = editingProduct 
                ? `/api/products/${editingProduct._id}` 
                : '/api/products';
            
            const method = editingProduct ? 'PUT' : 'POST';
            
            const response = await fetch(url, {
                method,
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    ...formData,
                    price: parseFloat(formData.price),
                    quantity: parseInt(formData.quantity),
                    keyFeatures: formData.keyFeatures.filter(f => f.trim()),
                    isSpecialOffer: formData.isSpecialOffer
                })
            });
            
            if (!response.ok) throw new Error('Failed to save product');
            
            setSuccess(editingProduct ? 'Product updated successfully' : 'Product added successfully');
            setShowModal(false);
            fetchProducts();
            resetForm();
        } catch (err) {
            setError('Failed to save product');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this product?')) return;
        
        try {
            const token = localStorage.getItem('adminToken');
            const response = await fetch(`/api/products/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            
            if (!response.ok) throw new Error('Failed to delete product');
            
            setSuccess('Product deleted successfully');
            fetchProducts();
        } catch (err) {
            setError('Failed to delete product');
        }
    };

    const handleEdit = (product) => {
        setEditingProduct(product);
        setFormData({
            ...product,
            keyFeatures: product.keyFeatures || [],
            isSpecialOffer: product.isSpecialOffer || false
        });
        setImagePreview(product.image || '');
        setShowModal(true);
    };

    const resetForm = () => {
        setEditingProduct(null);
        setImagePreview('');
        setFormData({
            name: '',
            brand: 'Apple',
            category: 'watches',
            price: '',
            condition: 'New',
            deviceType: 'New',
            stockStatus: 'In Stock',
            quantity: 0,
            description: '',
            keyFeatures: [],
            storage: '',
            ram: '',
            color: '',
            caseSize: '',
            image: '',
            isActive: true,
            isSpecialOffer: false
        });
    };

    const handleKeyFeatureChange = (index, value) => {
        const newFeatures = [...formData.keyFeatures];
        newFeatures[index] = value;
        setFormData({ ...formData, keyFeatures: newFeatures });
    };

    const addKeyFeature = () => {
        setFormData({ ...formData, keyFeatures: [...formData.keyFeatures, ''] });
    };

    const removeKeyFeature = (index) => {
        const newFeatures = formData.keyFeatures.filter((_, i) => i !== index);
        setFormData({ ...formData, keyFeatures: newFeatures });
    };

    // Filter and sort products
    const filteredAndSortedProducts = products
        .filter(product => {
            const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                product.brand.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesCategory = !filterCategory || product.category === filterCategory;
            return matchesSearch && matchesCategory;
        })
        .sort((a, b) => {
            let aVal = a[sortBy];
            let bVal = b[sortBy];
            
            if (sortBy === 'price' || sortBy === 'quantity') {
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
        <AdminLayout activeItem="products">
            <div style={styles.loadingContainer}>
                <div style={styles.spinner}></div>
                <p>Loading products...</p>
            </div>
        </AdminLayout>
    );

    return (
        <AdminLayout activeItem="products">
            <div style={styles.container}>
                {/* Header */}
                <div style={styles.header}>
                    <div style={styles.headerContent}>
                        <div style={styles.headerText}>
                            <h1 style={styles.title}>Product Management</h1>
                            <p style={styles.subtitle}>Manage your product inventory and listings</p>
                        </div>
                        <button 
                            style={styles.addButton}
                            onClick={() => {
                                resetForm();
                                setShowModal(true);
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-2px)';
                                e.currentTarget.style.boxShadow = '0 8px 20px rgba(16, 185, 129, 0.4)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = '0 4px 12px rgba(16, 185, 129, 0.3)';
                            }}
                        >
                            <FaPlus /> Add New Product
                        </button>
                    </div>
                </div>

                {/* Stats Cards */}
                <div style={styles.statsGrid}>
                    <div style={styles.statCard}>
                        <div style={styles.statCardContent}>
                            <FaBoxes style={{ ...styles.statIcon, color: '#6366f1' }} />
                            <div style={styles.statInfo}>
                                <h3 style={styles.statNumber}>{stats.total}</h3>
                                <p style={styles.statLabel}>Total Products</p>
                            </div>
                        </div>
                        <div style={styles.statTrend}>
                            <FaChartLine style={{ marginRight: '0.25rem' }} />
                            <span>Active Listings</span>
                        </div>
                    </div>
                    
                    <div style={styles.statCard}>
                        <div style={styles.statCardContent}>
                            <FaCheckCircle style={{ ...styles.statIcon, color: '#10b981' }} />
                            <div style={styles.statInfo}>
                                <h3 style={styles.statNumber}>{stats.inStock}</h3>
                                <p style={styles.statLabel}>In Stock</p>
                            </div>
                        </div>
                        <div style={styles.statTrend}>
                            <FaArrowUp style={{ marginRight: '0.25rem', color: '#10b981' }} />
                            <span style={{ color: '#10b981' }}>{((stats.inStock / stats.total) * 100).toFixed(0)}%</span>
                        </div>
                    </div>
                    
                    <div style={styles.statCard}>
                        <div style={styles.statCardContent}>
                            <FaExclamationCircle style={{ ...styles.statIcon, color: '#f59e0b' }} />
                            <div style={styles.statInfo}>
                                <h3 style={styles.statNumber}>{stats.lowStock}</h3>
                                <p style={styles.statLabel}>Low Stock</p>
                            </div>
                        </div>
                        <div style={styles.statTrend}>
                            <FaExclamationCircle style={{ marginRight: '0.25rem', color: '#f59e0b' }} />
                            <span style={{ color: '#f59e0b' }}>Attention</span>
                        </div>
                    </div>
                    
                    <div style={styles.statCard}>
                        <div style={styles.statCardContent}>
                            <FaTimes style={{ ...styles.statIcon, color: '#ef4444' }} />
                            <div style={styles.statInfo}>
                                <h3 style={styles.statNumber}>{stats.outOfStock}</h3>
                                <p style={styles.statLabel}>Out of Stock</p>
                            </div>
                        </div>
                        <div style={styles.statTrend}>
                            <FaArrowDown style={{ marginRight: '0.25rem', color: '#ef4444' }} />
                            <span style={{ color: '#ef4444' }}>Critical</span>
                        </div>
                    </div>
                    
                    <div style={styles.statCard}>
                        <div style={styles.statCardContent}>
                            <FaDollarSign style={{ ...styles.statIcon, color: '#3b82f6' }} />
                            <div style={styles.statInfo}>
                                <h3 style={styles.statNumber}>£{stats.totalValue.toLocaleString()}</h3>
                                <p style={styles.statLabel}>Total Value</p>
                            </div>
                        </div>
                        <div style={styles.statTrend}>
                            <FaChartBar style={{ marginRight: '0.25rem' }} />
                            <span>Inventory</span>
                        </div>
                    </div>
                    
                    <div style={styles.statCard}>
                        <div style={styles.statCardContent}>
                            <FaFire style={{ ...styles.statIcon, color: '#ef4444' }} />
                            <div style={styles.statInfo}>
                                <h3 style={styles.statNumber}>{stats.specialOffers}</h3>
                                <p style={styles.statLabel}>Special Offers</p>
                            </div>
                        </div>
                        <div style={styles.statTrend}>
                            <FaPercent style={{ marginRight: '0.25rem', color: '#ef4444' }} />
                            <span style={{ color: '#ef4444' }}>Active Deals</span>
                        </div>
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

                {/* Filters and View Controls */}
                <div style={styles.controlsSection}>
                    <div style={styles.searchAndFilter}>
                        <div style={styles.searchBox}>
                            <FaSearch style={styles.searchIcon} />
                            <input
                                type="text"
                                placeholder="Search products..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                style={styles.searchInput}
                                onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                                onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                            />
                        </div>
                        <div style={styles.filterBox}>
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
                    </div>
                    <div style={styles.viewControls}>
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
                            <option value="price-asc">Price (Low to High)</option>
                            <option value="price-desc">Price (High to Low)</option>
                            <option value="quantity-asc">Stock (Low to High)</option>
                            <option value="quantity-desc">Stock (High to Low)</option>
                        </select>
                        <div style={styles.viewToggle}>
                            <button
                                style={{
                                    ...styles.viewButton,
                                    ...(viewMode === 'grid' ? styles.viewButtonActive : {})
                                }}
                                onClick={() => setViewMode('grid')}
                            >
                                <FaTh /> Grid
                            </button>
                            <button
                                style={{
                                    ...styles.viewButton,
                                    ...(viewMode === 'table' ? styles.viewButtonActive : {})
                                }}
                                onClick={() => setViewMode('table')}
                            >
                                <FaList /> Table
                            </button>
                        </div>
                    </div>
                </div>

                {/* Products Display */}
                {viewMode === 'grid' ? (
                    <div style={styles.productsGrid}>
                        {filteredAndSortedProducts.map(product => (
                            <div 
                                key={product._id} 
                                style={styles.productCard}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-8px)';
                                    e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.15)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)';
                                }}
                            >
                                <div style={styles.productImageContainer}>
                                    {product.isSpecialOffer && (
                                        <div style={styles.specialBadge}>
                                            <FaFire /> Special Offer
                                        </div>
                                    )}
                                    <div style={styles.stockIndicator(product.stockStatus)} />
                                    {product.image ? (
                                        <img 
                                            src={product.image} 
                                            alt={product.name}
                                            style={styles.productImage}
                                            onError={(e) => {
                                                e.target.src = '/images/placeholder.png';
                                            }}
                                        />
                                    ) : (
                                        <div style={styles.noImage}>
                                            <FaImage size={60} />
                                            <p>No Image</p>
                                        </div>
                                    )}
                                </div>
                                <div style={styles.productInfo}>
                                    <div style={styles.productHeader}>
                                        <span style={styles.productBrand}>{product.brand}</span>
                                        <span style={styles.productCategory}>{product.category}</span>
                                    </div>
                                    <h3 style={styles.productName}>{product.name}</h3>
                                    <div style={styles.productMeta}>
                                        <div style={styles.productPrice}>
                                            <span style={styles.priceLabel}>Price</span>
                                            <span style={styles.priceValue}>£{product.price}</span>
                                        </div>
                                        <div style={styles.productStock}>
                                            <span style={styles.stockLabel}>Stock</span>
                                            <span style={getStockStyle(product.stockStatus)}>
                                                {product.quantity} units
                                            </span>
                                        </div>
                                    </div>
                                    {product.condition && (
                                        <div style={styles.productCondition}>
                                            <FaTag size={12} /> {product.condition}
                                        </div>
                                    )}
                                </div>
                                <div style={styles.productActions}>
                                    <button
                                        style={styles.actionButton}
                                        onClick={() => handleEdit(product)}
                                        title="Edit Product"
                                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#eff6ff'}
                                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#f8fafc'}
                                    >
                                        <FaEdit style={{ color: '#3b82f6' }} />
                                    </button>
                                    <button
                                        style={styles.actionButton}
                                        onClick={() => handleDelete(product._id)}
                                        title="Delete Product"
                                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#fef2f2'}
                                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#f8fafc'}
                                    >
                                        <FaTrash style={{ color: '#ef4444' }} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div style={styles.tableContainer}>
                        <table style={styles.table}>
                            <thead>
                                <tr>
                                    <th style={styles.th}>Image</th>
                                    <th style={styles.th}>Product Details</th>
                                    <th style={styles.th}>Category</th>
                                    <th style={styles.th}>Price</th>
                                    <th style={styles.th}>Stock</th>
                                    <th style={styles.th}>Status</th>
                                    <th style={styles.th}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredAndSortedProducts.map(product => (
                                    <tr key={product._id}>
                                        <td style={styles.td}>
                                            {product.image ? (
                                                <img 
                                                    src={product.image} 
                                                    alt={product.name}
                                                    style={styles.tableProductImage}
                                                    onError={(e) => {
                                                        e.target.src = '/images/placeholder.png';
                                                    }}
                                                />
                                            ) : (
                                                <div style={styles.tableNoImage}>
                                                    <FaImage />
                                                </div>
                                            )}
                                        </td>
                                        <td style={styles.td}>
                                            <div style={styles.tableProductInfo}>
                                                <div style={styles.tableProductName}>{product.name}</div>
                                                <div style={styles.tableProductBrand}>{product.brand}</div>
                                            </div>
                                        </td>
                                        <td style={styles.td}>
                                            <span style={styles.categoryBadge}>{product.category}</span>
                                        </td>
                                        <td style={styles.td}>
                                            <div style={styles.tablePriceCell}>
                                                <span style={styles.tablePriceValue}>£{product.price}</span>
                                            </div>
                                        </td>
                                        <td style={styles.td}>
                                            <div style={styles.tableStockInfo}>
                                                <span style={getStockStyle(product.stockStatus)}>
                                                    {product.stockStatus}
                                                </span>
                                                <span style={styles.tableStockQuantity}>{product.quantity} units</span>
                                            </div>
                                        </td>
                                        <td style={styles.td}>
                                            <div style={styles.statusCell}>
                                                {product.isSpecialOffer && (
                                                    <FaFire color="#ef4444" size={18} title="Special Offer" />
                                                )}
                                                {product.condition && (
                                                    <span style={styles.conditionBadge}>{product.condition}</span>
                                                )}
                                            </div>
                                        </td>
                                        <td style={styles.td}>
                                            <div style={styles.tableActions}>
                                                <button
                                                    style={styles.tableActionButton}
                                                    onClick={() => handleEdit(product)}
                                                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#dbeafe'}
                                                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#eff6ff'}
                                                >
                                                    <FaEdit />
                                                </button>
                                                <button
                                                    style={styles.tableActionButton}
                                                    onClick={() => handleDelete(product._id)}
                                                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#fee2e2'}
                                                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#fef2f2'}
                                                >
                                                    <FaTrash />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {filteredAndSortedProducts.length === 0 && (
                            <div style={styles.emptyState}>
                                <FaBox size={60} />
                                <h3>No products found</h3>
                                <p>Try adjusting your search or filters</p>
                            </div>
                        )}
                    </div>
                )}

                {/* Modal */}
                {showModal && (
                    <div style={styles.modal} onClick={() => { setShowModal(false); resetForm(); }}>
                        <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                            <div style={styles.modalHeader}>
                                <h2 style={styles.modalTitle}>
                                    <FaShoppingCart style={{ color: '#3b82f6', marginRight: '0.75rem' }} />
                                    {editingProduct ? 'Edit Product' : 'Add New Product'}
                                </h2>
                                <button 
                                    style={styles.closeButton}
                                    onClick={() => { setShowModal(false); resetForm(); }}
                                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
                                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                >
                                    <FaTimes />
                                </button>
                            </div>
                            <form onSubmit={handleSubmit} style={styles.form}>
                                {/* Image Upload Section */}
                                <div style={styles.imageUploadSection}>
                                    <h3 style={styles.sectionTitle}>Product Image</h3>
                                    <div style={styles.imageUploadContent}>
                                        <div style={styles.imagePreviewContainer}>
                                            {imagePreview || formData.image ? (
                                                <img 
                                                    src={imagePreview || formData.image} 
                                                    alt="Product preview"
                                                    style={styles.imagePreview}
                                                />
                                            ) : (
                                                <div style={styles.imagePlaceholder}>
                                                    <FaImage size={50} color="#9ca3af" />
                                                    <p>No image uploaded</p>
                                                </div>
                                            )}
                                        </div>
                                        <div style={styles.uploadButtonContainer}>
                                            <label style={styles.uploadButton}>
                                                <FaUpload /> {uploadingImage ? 'Uploading...' : 'Upload Image'}
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={handleImageUpload}
                                                    style={{ display: 'none' }}
                                                    disabled={uploadingImage}
                                                />
                                            </label>
                                            <p style={styles.uploadHint}>
                                                Supported formats: JPEG, PNG, WebP, AVIF (Max 5MB)
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Product Details Section */}
                                <div style={styles.formSection}>
                                    <h3 style={styles.sectionTitle}>Product Details</h3>
                                    <div style={styles.formGrid}>
                                        <div style={styles.formGroup}>
                                            <label style={styles.label}>Product Name *</label>
                                            <input
                                                type="text"
                                                value={formData.name}
                                                onChange={(e) => setFormData({...formData, name: e.target.value})}
                                                required
                                                style={styles.input}
                                                placeholder="Enter product name"
                                            />
                                        </div>
                                        
                                        <div style={styles.formGroup}>
                                            <label style={styles.label}>Category *</label>
                                            <select
                                                value={formData.category}
                                                onChange={(e) => setFormData({...formData, category: e.target.value})}
                                                style={styles.input}
                                            >
                                                <option value="phones">Phones</option>
                                                <option value="tablets">Tablets</option>
                                                <option value="laptops">Laptops</option>
                                                <option value="watches">Watches</option>
                                                <option value="consoles">Consoles</option>
                                                <option value="accessories">Accessories</option>
                                            </select>
                                        </div>

                                        <div style={styles.formGroup}>
                                            <label style={styles.label}>Brand *</label>
                                            <input
                                                type="text"
                                                value={formData.brand}
                                                onChange={(e) => setFormData({...formData, brand: e.target.value})}
                                                required
                                                style={styles.input}
                                                placeholder="Enter brand name"
                                            />
                                        </div>

                                        <div style={styles.formGroup}>
                                            <label style={styles.label}>Price (£) *</label>
                                            <input
                                                type="number"
                                                step="0.01"
                                                value={formData.price}
                                                onChange={(e) => setFormData({...formData, price: e.target.value})}
                                                required
                                                style={styles.input}
                                                placeholder="0.00"
                                            />
                                        </div>

                                        <div style={styles.formGroup}>
                                            <label style={styles.label}>Condition</label>
                                            <select
                                                value={formData.condition}
                                                onChange={(e) => setFormData({...formData, condition: e.target.value})}
                                                style={styles.input}
                                            >
                                                <option value="New">New</option>
                                                <option value="Excellent">Excellent</option>
                                                <option value="Very Good">Very Good</option>
                                                <option value="Good">Good</option>
                                                <option value="Fair">Fair</option>
                                            </select>
                                        </div>

                                        <div style={styles.formGroup}>
                                            <label style={styles.label}>Stock Status</label>
                                            <select
                                                value={formData.stockStatus}
                                                onChange={(e) => setFormData({...formData, stockStatus: e.target.value})}
                                                style={styles.input}
                                            >
                                                <option value="In Stock">In Stock</option>
                                                <option value="Low Stock">Low Stock</option>
                                                <option value="Out of Stock">Out of Stock</option>
                                            </select>
                                        </div>

                                        <div style={styles.formGroup}>
                                            <label style={styles.label}>Quantity</label>
                                            <input
                                                type="number"
                                                value={formData.quantity}
                                                onChange={(e) => setFormData({...formData, quantity: e.target.value})}
                                                style={styles.input}
                                                placeholder="0"
                                            />
                                        </div>

                                        <div style={styles.formGroup}>
                                            <label style={styles.label}>Color</label>
                                            <input
                                                type="text"
                                                value={formData.color}
                                                onChange={(e) => setFormData({...formData, color: e.target.value})}
                                                style={styles.input}
                                                placeholder="Enter color"
                                            />
                                        </div>

                                        {formData.category === 'watches' && (
                                            <div style={styles.formGroup}>
                                                <label style={styles.label}>Case Size</label>
                                                <input
                                                    type="text"
                                                    value={formData.caseSize}
                                                    onChange={(e) => setFormData({...formData, caseSize: e.target.value})}
                                                    style={styles.input}
                                                    placeholder="e.g., 42mm"
                                                />
                                            </div>
                                        )}

                                        {(formData.category === 'phones' || formData.category === 'tablets' || formData.category === 'laptops') && (
                                            <div style={styles.formGroup}>
                                                <label style={styles.label}>Storage</label>
                                                <input
                                                    type="text"
                                                    value={formData.storage}
                                                    onChange={(e) => setFormData({...formData, storage: e.target.value})}
                                                    style={styles.input}
                                                    placeholder="e.g., 128GB"
                                                />
                                            </div>
                                        )}

                                        {formData.category === 'laptops' && (
                                            <div style={styles.formGroup}>
                                                <label style={styles.label}>RAM</label>
                                                <input
                                                    type="text"
                                                    value={formData.ram}
                                                    onChange={(e) => setFormData({...formData, ram: e.target.value})}
                                                    style={styles.input}
                                                    placeholder="e.g., 16GB"
                                                />
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Description Section */}
                                <div style={styles.formSection}>
                                    <div style={styles.formGroup}>
                                        <label style={styles.label}>Description</label>
                                        <textarea
                                            value={formData.description}
                                            onChange={(e) => setFormData({...formData, description: e.target.value})}
                                            style={styles.textarea}
                                            placeholder="Enter product description..."
                                            rows={4}
                                        />
                                    </div>
                                </div>

                                {/* Key Features Section */}
                                <div style={styles.formSection}>
                                    <h3 style={styles.sectionTitle}>Key Features</h3>
                                    <div style={styles.featuresContainer}>
                                        {formData.keyFeatures.map((feature, index) => (
                                            <div key={index} style={styles.featureRow}>
                                                <input
                                                    type="text"
                                                    value={feature}
                                                    onChange={(e) => handleKeyFeatureChange(index, e.target.value)}
                                                    style={styles.featureInput}
                                                    placeholder="Enter feature"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => removeKeyFeature(index)}
                                                    style={styles.removeFeatureBtn}
                                                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#fecaca'}
                                                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#fee2e2'}
                                                >
                                                    <FaTimes />
                                                </button>
                                            </div>
                                        ))}
                                        <button
                                            type="button"
                                            onClick={addKeyFeature}
                                            style={styles.addFeatureBtn}
                                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#059669'}
                                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#10b981'}
                                        >
                                            <FaPlus /> Add Feature
                                        </button>
                                    </div>
                                </div>

                                {/* Special Offer Section */}
                                <div style={styles.specialOfferSection}>
                                    <label style={styles.checkboxLabel}>
                                        <input
                                            type="checkbox"
                                            checked={formData.isSpecialOffer}
                                            onChange={(e) => setFormData({...formData, isSpecialOffer: e.target.checked})}
                                            style={styles.checkbox}
                                        />
                                        <div style={styles.checkboxContent}>
                                            <FaFire style={{ color: '#ef4444', fontSize: '1.5rem' }} />
                                            <div>
                                                <span style={styles.checkboxTitle}>Mark as Special Offer</span>
                                                <span style={styles.checkboxDescription}>This product will be highlighted with a special badge</span>
                                            </div>
                                        </div>
                                    </label>
                                </div>

                                <div style={styles.modalActions}>
                                    <button 
                                        type="button" 
                                        onClick={() => {
                                            setShowModal(false);
                                            resetForm();
                                        }}
                                        style={styles.cancelBtn}
                                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#e5e7eb'}
                                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
                                    >
                                        Cancel
                                    </button>
                                    <button 
                                        type="submit" 
                                        style={styles.saveBtn} 
                                        disabled={uploadingImage}
                                        onMouseEnter={(e) => !uploadingImage && (e.currentTarget.style.backgroundColor = '#2563eb')}
                                        onMouseLeave={(e) => !uploadingImage && (e.currentTarget.style.backgroundColor = '#3b82f6')}
                                    >
                                        <FaSave /> {editingProduct ? 'Update Product' : 'Add Product'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
};

const getStockStyle = (status) => {
    const baseStyle = { 
        padding: '0.375rem 0.75rem', 
        borderRadius: '9999px', 
        fontSize: 'clamp(0.7rem, 1.5vw, 0.75rem)', 
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

// Modern, clean styles
const styles = {
    container: { 
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
        backgroundColor: '#f8fafc',
        minHeight: '100vh'
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
        background: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)',
        borderRadius: '1rem',
        padding: 'clamp(1.5rem, 4vw, 2.5rem) clamp(1rem, 3vw, 2rem)',
        marginBottom: '2rem',
        boxShadow: '0 10px 30px rgba(59, 130, 246, 0.3)'
    },
    headerContent: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem'
    },
    headerText: {
        color: 'white'
    },
    title: { 
        fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', 
        fontWeight: '800', 
        margin: 0,
        marginBottom: '0.25rem',
        letterSpacing: '-0.025em'
    },
    subtitle: {
        fontSize: 'clamp(0.875rem, 2vw, 1.125rem)',
        opacity: 0.9,
        margin: 0
    },
    addButton: { 
        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
        color: '#fff', 
        border: 'none', 
        padding: 'clamp(0.75rem, 2vw, 0.875rem) clamp(1.25rem, 3vw, 1.75rem)', 
        borderRadius: '0.75rem', 
        fontSize: 'clamp(0.875rem, 2vw, 0.9375rem)', 
        fontWeight: '600', 
        cursor: 'pointer', 
        display: 'flex', 
        alignItems: 'center', 
        gap: '0.5rem', 
        transition: 'all 0.2s ease',
        boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)'
    },
    // Stats Grid
    statsGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 200px), 1fr))',
        gap: 'clamp(0.75rem, 2vw, 1.25rem)',
        marginBottom: '2rem'
    },
    statCard: {
        backgroundColor: 'white',
        padding: 'clamp(1rem, 3vw, 1.5rem)',
        borderRadius: '1rem',
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        border: '1px solid #e5e7eb',
        transition: 'all 0.3s ease',
        cursor: 'pointer'
    },
    statCardContent: {
        display: 'flex',
        alignItems: 'flex-start',
        gap: '1rem',
        marginBottom: '1rem'
    },
    statIcon: {
        fontSize: 'clamp(1.5rem, 3vw, 2rem)',
        opacity: 0.8
    },
    statInfo: {
        flex: 1
    },
    statNumber: {
        fontSize: 'clamp(1.5rem, 3vw, 2rem)',
        fontWeight: '700',
        color: '#0f172a',
        margin: 0,
        lineHeight: 1
    },
    statLabel: {
        fontSize: 'clamp(0.75rem, 1.5vw, 0.875rem)',
        color: '#64748b',
        fontWeight: '500',
        marginTop: '0.25rem'
    },
    statTrend: {
        display: 'flex',
        alignItems: 'center',
        fontSize: 'clamp(0.7rem, 1.5vw, 0.75rem)',
        color: '#64748b',
        borderTop: '1px solid #f1f5f9',
        paddingTop: '0.75rem'
    },
    // Controls
    controlsSection: {
        backgroundColor: 'white',
        padding: 'clamp(1rem, 3vw, 1.5rem)',
        borderRadius: '1rem',
        marginBottom: '2rem',
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '1rem',
        flexWrap: 'wrap'
    },
    searchAndFilter: { 
        display: 'flex', 
        gap: '1rem',
        flex: 1,
        flexWrap: 'wrap'
    },
    searchBox: { 
        position: 'relative', 
        flex: 1,
        minWidth: '200px'
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
        border: '2px solid #e5e7eb', 
        borderRadius: '0.75rem', 
        fontSize: 'clamp(0.875rem, 2vw, 0.9375rem)',
        backgroundColor: '#f9fafb',
        transition: 'all 0.2s ease',
        outline: 'none'
    },
    filterBox: { 
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
        border: '2px solid #e5e7eb', 
        borderRadius: '0.75rem', 
        fontSize: 'clamp(0.875rem, 2vw, 0.9375rem)',
        backgroundColor: '#f9fafb',
        cursor: 'pointer',
        outline: 'none'
    },
    viewControls: {
        display: 'flex',
        gap: '1rem',
        alignItems: 'center'
    },
    sortSelect: {
        padding: 'clamp(0.625rem, 2vw, 0.75rem) 1rem',
        border: '2px solid #e5e7eb',
        borderRadius: '0.75rem',
        fontSize: 'clamp(0.875rem, 2vw, 0.9375rem)',
        backgroundColor: '#f9fafb',
        cursor: 'pointer',
        outline: 'none'
    },
    viewToggle: {
        display: 'flex',
        backgroundColor: '#f3f4f6',
        borderRadius: '0.75rem',
        padding: '0.25rem',
        gap: '0.25rem'
    },
    viewButton: {
        padding: 'clamp(0.5rem, 1.5vw, 0.625rem) clamp(0.75rem, 2vw, 1rem)',
        border: 'none',
        backgroundColor: 'transparent',
        cursor: 'pointer',
        fontSize: 'clamp(0.75rem, 1.5vw, 0.875rem)',
        fontWeight: '500',
        color: '#64748b',
        transition: 'all 0.2s ease',
        borderRadius: '0.5rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.375rem'
    },
    viewButtonActive: {
        backgroundColor: 'white',
        color: '#0f172a',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    },
    // Grid View
    productsGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 280px), 1fr))',
        gap: 'clamp(1rem, 2vw, 1.5rem)'
    },
    productCard: {
        backgroundColor: '#fff',
        borderRadius: '1rem',
        overflow: 'hidden',
        boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
        transition: 'all 0.3s ease',
        position: 'relative',
        border: '1px solid #e5e7eb',
        cursor: 'pointer'
    },
    productImageContainer: {
        position: 'relative',
        height: 'clamp(180px, 25vw, 220px)',
        backgroundColor: '#f8fafc',
        overflow: 'hidden'
    },
    stockIndicator: (status) => ({
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '4px',
        backgroundColor: status === 'In Stock' ? '#10b981' : 
                        status === 'Low Stock' ? '#f59e0b' : '#ef4444',
        zIndex: 2
    }),
    specialBadge: {
        position: 'absolute',
        top: '1rem',
        right: '1rem',
        backgroundColor: '#ef4444',
        color: '#fff',
        padding: '0.375rem 0.75rem',
        borderRadius: '9999px',
        fontSize: 'clamp(0.7rem, 1.5vw, 0.75rem)',
        fontWeight: '600',
        display: 'flex',
        alignItems: 'center',
        gap: '0.25rem',
        zIndex: 1,
        boxShadow: '0 2px 8px rgba(239, 68, 68, 0.3)'
    },
    productImage: {
        width: '100%',
        height: '100%',
        objectFit: 'contain',
        padding: '1rem'
    },
    noImage: {
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#cbd5e1'
    },
    productInfo: {
        padding: 'clamp(1rem, 2.5vw, 1.25rem)'
    },
    productHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '0.5rem',
        gap: '0.5rem'
    },
    productBrand: {
        fontSize: 'clamp(0.75rem, 1.5vw, 0.875rem)',
        color: '#64748b',
        fontWeight: '500'
    },
    productCategory: {
        fontSize: 'clamp(0.7rem, 1.5vw, 0.75rem)',
        color: '#3b82f6',
        backgroundColor: '#eff6ff',
        padding: '0.25rem 0.5rem',
        borderRadius: '0.375rem',
        fontWeight: '500'
    },
    productName: {
        fontSize: 'clamp(0.875rem, 2vw, 1.125rem)',
        fontWeight: '600',
        color: '#0f172a',
        marginBottom: '0.75rem',
        lineHeight: 1.4,
        display: '-webkit-box',
        WebkitLineClamp: 2,
        WebkitBoxOrient: 'vertical',
        overflow: 'hidden'
    },
    productMeta: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '0.75rem',
        marginBottom: '0.75rem'
    },
    productPrice: {
        display: 'flex',
        flexDirection: 'column',
        gap: '0.25rem'
    },
    priceLabel: {
        fontSize: 'clamp(0.7rem, 1.5vw, 0.75rem)',
        color: '#64748b',
        fontWeight: '500'
    },
    priceValue: {
        fontSize: 'clamp(1rem, 2vw, 1.25rem)',
        fontWeight: '700',
        color: '#0f172a'
    },
    productStock: {
        display: 'flex',
        flexDirection: 'column',
        gap: '0.25rem',
        alignItems: 'flex-end'
    },
    stockLabel: {
        fontSize: 'clamp(0.7rem, 1.5vw, 0.75rem)',
        color: '#64748b',
        fontWeight: '500'
    },
    productCondition: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.375rem',
        fontSize: 'clamp(0.75rem, 1.5vw, 0.875rem)',
        color: '#6b7280'
    },
    productActions: {
        display: 'flex',
        gap: '0.5rem',
        padding: 'clamp(0.75rem, 2vw, 1rem) clamp(1rem, 2.5vw, 1.25rem)',
        borderTop: '1px solid #f1f5f9',
        backgroundColor: '#f8fafc'
    },
    actionButton: {
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'clamp(0.5rem, 1.5vw, 0.625rem)',
        backgroundColor: '#f8fafc',
        border: '1px solid #e5e7eb',
        borderRadius: '0.5rem',
        cursor: 'pointer',
        transition: 'all 0.2s ease'
    },
    // Table View
    tableContainer: { 
        backgroundColor: '#fff', 
        borderRadius: '1rem', 
        overflow: 'hidden', 
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        position: 'relative'
    },
    table: { 
        width: '100%', 
        borderCollapse: 'collapse' 
    },
    th: { 
        padding: 'clamp(0.75rem, 2vw, 1.25rem) clamp(0.5rem, 1.5vw, 1rem)', 
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
        padding: 'clamp(0.75rem, 2vw, 1rem) clamp(0.5rem, 1.5vw, 1rem)', 
        borderBottom: '1px solid #f1f5f9',
        verticalAlign: 'middle'
    },
    tableProductImage: { 
        width: 'clamp(40px, 8vw, 60px)', 
        height: 'clamp(40px, 8vw, 60px)', 
        objectFit: 'cover', 
        borderRadius: '0.5rem',
        border: '1px solid #e5e7eb'
    },
    tableNoImage: { 
        width: 'clamp(40px, 8vw, 60px)', 
        height: 'clamp(40px, 8vw, 60px)', 
        backgroundColor: '#f3f4f6', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        borderRadius: '0.5rem', 
        color: '#9ca3af' 
    },
    tableProductInfo: {
        display: 'flex',
        flexDirection: 'column',
        gap: '0.25rem'
    },
    tableProductName: {
        fontWeight: '600',
        color: '#0f172a',
        fontSize: 'clamp(0.875rem, 2vw, 1rem)'
    },
    tableProductBrand: {
        fontSize: 'clamp(0.75rem, 1.5vw, 0.875rem)',
        color: '#64748b'
    },
    categoryBadge: {
        fontSize: 'clamp(0.7rem, 1.5vw, 0.75rem)',
        color: '#3b82f6',
        backgroundColor: '#eff6ff',
        padding: '0.25rem 0.5rem',
        borderRadius: '0.375rem',
        fontWeight: '500',
        display: 'inline-block'
    },
    tablePriceCell: {
        display: 'flex',
        flexDirection: 'column',
        gap: '0.25rem'
    },
    tablePriceValue: {
        fontWeight: '700',
        color: '#0f172a',
        fontSize: 'clamp(0.875rem, 2vw, 1rem)'
    },
    tableStockInfo: {
        display: 'flex',
        flexDirection: 'column',
        gap: '0.25rem'
    },
    tableStockQuantity: {
        fontSize: 'clamp(0.75rem, 1.5vw, 0.875rem)',
        color: '#64748b'
    },
    statusCell: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem'
    },
    conditionBadge: {
        fontSize: 'clamp(0.7rem, 1.5vw, 0.75rem)',
        backgroundColor: '#f3f4f6',
        color: '#374151',
        padding: '0.25rem 0.5rem',
        borderRadius: '0.375rem',
        fontWeight: '500'
    },
    tableActions: {
        display: 'flex',
        gap: '0.5rem'
    },
    tableActionButton: {
        padding: 'clamp(0.375rem, 1vw, 0.5rem) clamp(0.5rem, 1.5vw, 0.625rem)',
        backgroundColor: '#eff6ff',
        color: '#3b82f6',
        border: 'none',
        borderRadius: '0.375rem',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        fontSize: 'clamp(0.75rem, 1.5vw, 0.875rem)'
    },
    emptyState: {
        padding: 'clamp(3rem, 6vw, 4rem) clamp(1.5rem, 4vw, 2rem)',
        textAlign: 'center',
        color: '#64748b'
    },
    // Modal
    modal: { 
        position: 'fixed', 
        top: 0, 
        left: 0, 
        right: 0, 
        bottom: 0, 
        backgroundColor: 'rgba(0,0,0,0.6)', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        zIndex: 1000, 
        backdropFilter: 'blur(4px)',
        padding: '1rem'
    },
    modalContent: { 
        backgroundColor: '#fff', 
        borderRadius: '1.25rem', 
        width: '90%', 
        maxWidth: '900px', 
        maxHeight: '90vh', 
        overflowY: 'auto', 
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        animation: 'slideIn 0.3s ease-out'
    },
    modalHeader: { 
        padding: 'clamp(1.5rem, 3vw, 2rem)', 
        borderBottom: '2px solid #e5e7eb', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        position: 'sticky',
        top: 0,
        backgroundColor: '#fff',
        zIndex: 10
    },
    modalTitle: { 
        fontSize: 'clamp(1.5rem, 3vw, 1.75rem)', 
        fontWeight: '700', 
        color: '#0f172a', 
        margin: 0,
        display: 'flex',
        alignItems: 'center'
    },
    closeButton: { 
        background: 'none', 
        border: 'none', 
        fontSize: '1.5rem', 
        color: '#64748b', 
        cursor: 'pointer', 
        padding: '0.5rem',
        borderRadius: '0.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all 0.2s ease'
    },
    form: { 
        padding: 'clamp(1.5rem, 3vw, 2rem)' 
    },
    formSection: {
        marginBottom: '2rem'
    },
    sectionTitle: {
        fontSize: 'clamp(1rem, 2vw, 1.125rem)',
        fontWeight: '600',
        color: '#1e293b',
        marginBottom: '1rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem'
    },
    imageUploadSection: { 
        marginBottom: '2rem'
    },
    imageUploadContent: {
        display: 'flex',
        gap: '2rem',
        alignItems: 'flex-start',
        flexWrap: 'wrap'
    },
    imagePreviewContainer: { 
        flex: '0 0 auto' 
    },
    imagePreview: { 
        width: 'clamp(150px, 20vw, 200px)', 
        height: 'clamp(150px, 20vw, 200px)', 
        objectFit: 'cover', 
        borderRadius: '0.75rem',
        border: '2px solid #e2e8f0'
    },
    imagePlaceholder: { 
        width: 'clamp(150px, 20vw, 200px)', 
        height: 'clamp(150px, 20vw, 200px)', 
        backgroundColor: '#f1f5f9', 
        borderRadius: '0.75rem', 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center', 
        border: '2px dashed #cbd5e1' 
    },
    uploadButtonContainer: { 
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem',
        minWidth: '200px'
    },
    uploadButton: { 
        backgroundColor: '#3b82f6', 
        color: '#fff', 
        padding: 'clamp(0.75rem, 2vw, 1rem) clamp(1.25rem, 3vw, 1.5rem)', 
        borderRadius: '0.75rem', 
        cursor: 'pointer', 
        display: 'inline-flex', 
        alignItems: 'center', 
        gap: '0.5rem', 
        fontSize: 'clamp(0.875rem, 2vw, 0.9375rem)', 
        fontWeight: '600',
        transition: 'all 0.2s ease',
        border: 'none',
        justifyContent: 'center'
    },
    uploadingText: {
        fontSize: 'clamp(0.875rem, 2vw, 1rem)',
        color: '#3b82f6',
        fontWeight: '500'
    },
    uploadHint: {
        fontSize: 'clamp(0.75rem, 1.5vw, 0.875rem)',
        color: '#64748b',
        margin: 0
    },
    formGrid: { 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 250px), 1fr))', 
        gap: '1.25rem', 
        marginBottom: '1.5rem' 
    },
    formGroup: { 
        marginBottom: '1.25rem' 
    },
    label: {
        display: 'block',
        marginBottom: '0.5rem',
        fontWeight: '600',
        fontSize: 'clamp(0.875rem, 2vw, 1rem)',
        color: '#334155'
    },
    input: { 
        width: '100%', 
        padding: 'clamp(0.75rem, 2vw, 1rem)', 
        border: '2px solid #e5e7eb', 
        borderRadius: '0.75rem', 
        fontSize: 'clamp(0.875rem, 2vw, 0.9375rem)',
        transition: 'all 0.2s ease',
        backgroundColor: '#f9fafb',
        outline: 'none'
    },
    textarea: {
        width: '100%',
        padding: 'clamp(0.75rem, 2vw, 1rem)',
        border: '2px solid #e5e7eb',
        borderRadius: '0.75rem',
        fontSize: 'clamp(0.875rem, 2vw, 0.9375rem)',
        transition: 'all 0.2s ease',
        backgroundColor: '#f9fafb',
        outline: 'none',
        resize: 'vertical',
        fontFamily: 'inherit'
    },
    featuresContainer: {
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem'
    },
    featureRow: { 
        display: 'flex', 
        gap: '0.5rem', 
        alignItems: 'center'
    },
    featureInput: {
        flex: 1,
        padding: 'clamp(0.75rem, 2vw, 1rem)',
        border: '2px solid #e5e7eb',
        borderRadius: '0.75rem',
        fontSize: 'clamp(0.875rem, 2vw, 0.9375rem)',
        outline: 'none',
        backgroundColor: '#f9fafb'
    },
    removeFeatureBtn: { 
        backgroundColor: '#fee2e2', 
        color: '#ef4444', 
        border: 'none', 
        padding: 'clamp(0.75rem, 2vw, 1rem)', 
        borderRadius: '0.5rem', 
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all 0.2s ease'
    },
    addFeatureBtn: { 
        backgroundColor: '#10b981', 
        color: '#fff', 
        border: 'none', 
        padding: 'clamp(0.625rem, 2vw, 0.75rem) clamp(1rem, 2.5vw, 1.25rem)', 
        borderRadius: '0.5rem', 
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        fontSize: 'clamp(0.875rem, 2vw, 0.9375rem)',
        fontWeight: '500',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.375rem',
        alignSelf: 'flex-start'
    },
    specialOfferSection: { 
        backgroundColor: '#fef3c7', 
        padding: 'clamp(1rem, 2.5vw, 1.25rem)', 
        borderRadius: '0.75rem', 
        marginBottom: '1.5rem',
        border: '1px solid #fde68a'
    },
    checkboxLabel: { 
        display: 'flex', 
        alignItems: 'center', 
        cursor: 'pointer',
        gap: '1rem'
    },
    checkbox: { 
        width: '20px', 
        height: '20px', 
        cursor: 'pointer',
        flexShrink: 0
    },
    checkboxContent: {
        display: 'flex',
        alignItems: 'center',
        gap: '1rem'
    },
    checkboxTitle: {
        fontSize: 'clamp(0.875rem, 2vw, 1rem)', 
        fontWeight: '600', 
        color: '#92400e',
        display: 'block'
    },
    checkboxDescription: {
        fontSize: 'clamp(0.75rem, 1.5vw, 0.875rem)',
        color: '#b45309',
        display: 'block',
        marginTop: '0.25rem'
    },
    modalActions: { 
        display: 'flex', 
        gap: '1rem', 
        marginTop: '2rem',
        paddingTop: '1.5rem',
        borderTop: '2px solid #e5e7eb',
        justifyContent: 'flex-end',
        flexWrap: 'wrap'
    },
    saveBtn: { 
        backgroundColor: '#3b82f6', 
        color: '#fff', 
        border: 'none', 
        padding: 'clamp(0.875rem, 2vw, 1rem) clamp(1.5rem, 3vw, 2rem)', 
        borderRadius: '0.75rem', 
        fontSize: 'clamp(0.875rem, 2vw, 1rem)', 
        fontWeight: '600', 
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem'
    },
    cancelBtn: { 
        backgroundColor: '#f3f4f6', 
        color: '#475569', 
        border: '1px solid #e2e8f0',
        padding: 'clamp(0.875rem, 2vw, 1rem) clamp(1.5rem, 3vw, 2rem)', 
        borderRadius: '0.75rem', 
        fontSize: 'clamp(0.875rem, 2vw, 1rem)', 
        fontWeight: '600', 
        cursor: 'pointer',
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
        gap: '0.5rem'
    },
    success: { 
        backgroundColor: '#d1fae5', 
        color: '#065f46', 
        padding: '1rem 1.25rem', 
        borderRadius: '0.75rem', 
        marginBottom: '1rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem'
    }
};

// Add CSS animation for spinner and slide in
const styleSheet = document.createElement("style");
styleSheet.textContent = `
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
    
    @keyframes slideIn {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    /* Input focus styles */
    input:focus, select:focus, textarea:focus {
        border-color: #3b82f6 !important;
        box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1) !important;
    }
    
    /* Stat card hover */
    .stat-card:hover {
        transform: translateY(-4px);
        box-shadow: 0 12px 24px rgba(0,0,0,0.12);
        border-color: #3b82f6;
    }
    
    /* Responsive table */
    @media (max-width: 768px) {
        .table-container {
            overflow-x: auto;
            -webkit-overflow-scrolling: touch;
        }
        
        table {
            min-width: 600px;
        }
    }
`;
document.head.appendChild(styleSheet);

export default AdminProducts;