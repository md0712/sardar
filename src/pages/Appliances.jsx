import React, { useState, useMemo } from 'react';
import { ArrowUpDown, Sparkles, ChefHat, Package, Layers } from 'lucide-react';
import ProductCard from '../components/ProductCard';

export default function Appliances({ 
  onSelectProduct, 
  onAddToCart, 
  wishlist = [], 
  onToggleWishlist,
  cart = [],
  onUpdateQuantity,
  searchQuery = '',
  selectedSubcategory = 'all',
  setSelectedSubcategory,
  products: customProducts
}) {
  const allProducts = Array.isArray(customProducts) ? customProducts : (customProducts || []);
  const [selectedSubcat, setSelectedSubcat] = useState(selectedSubcategory);

  React.useEffect(() => {
    if (selectedSubcategory) {
      setSelectedSubcat(selectedSubcategory);
    }
  }, [selectedSubcategory]);

  const [sortBy, setSortBy] = useState('popular');
  const [maxPrice, setMaxPrice] = useState(20000);

  const appliancesProducts = useMemo(() => {
    return allProducts.filter(p => p.category === 'appliances');
  }, [allProducts]);

  const subcategories = useMemo(() => {
    const list = [
      { id: 'all', label: 'All Appliances' },
      { id: 'mixers', label: 'Mixer Grinders' },
      { id: 'kitchen', label: 'Air Fryers & Microwave' },
      { id: 'home', label: 'RO Water Purifiers' }
    ];
    const known = new Set(list.map(s => s.id.toLowerCase()));
    appliancesProducts.forEach(p => {
      if (p.subcategory && !known.has(p.subcategory.toLowerCase())) {
        known.add(p.subcategory.toLowerCase());
        list.push({
          id: p.subcategory,
          label: p.subcategory.charAt(0).toUpperCase() + p.subcategory.slice(1).replace(/-/g, ' ')
        });
      }
    });
    if (selectedSubcat && selectedSubcat !== 'all' && !known.has(selectedSubcat.toLowerCase())) {
      list.push({
        id: selectedSubcat,
        label: selectedSubcat.charAt(0).toUpperCase() + selectedSubcat.slice(1).replace(/-/g, ' ')
      });
    }
    return list;
  }, [appliancesProducts, selectedSubcat]);

  const filteredProducts = useMemo(() => {
    return appliancesProducts.filter(p => {
      const matchSubcat = selectedSubcat === 'all' || 
        p.subcategory === selectedSubcat || 
        (p.subcategory && p.subcategory.toLowerCase() === selectedSubcat.toLowerCase()) ||
        (p.category && p.category.toLowerCase() === selectedSubcat.toLowerCase());
      const matchPrice = p.price <= maxPrice;
      const matchSearch = searchQuery === '' || 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchSubcat && matchPrice && matchSearch;
    }).sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      if (sortBy === 'discount') return b.discount - a.discount;
      if (sortBy === 'rating') return b.rating - a.rating;
      return 0;
    });
  }, [appliancesProducts, selectedSubcat, maxPrice, searchQuery, sortBy]);

  return (
    <div className="catalog-page">
      <div className="catalog-hero-banner appliances-banner">
        <div className="container banner-inner">
          <span className="banner-badge">Smart Kitchen &amp; Home Living</span>
          <h1 className="banner-heading">Kitchen &amp; Home Appliances</h1>
          <p className="banner-sub">
            Heavy-duty mixer grinders, oil-free digital air fryers, convection ovens, and copper mineral water purifiers.
          </p>
        </div>
      </div>

      <div className="container main-catalog-container">
        <div className="catalog-toolbar">
          {/* Subcategory Dropdown for Mobile View */}
          <div className="subcat-mobile-dropdown-wrap">
            <Layers size={15} className="subcat-dropdown-icon" />
            <select
              value={selectedSubcat}
              onChange={(e) => setSelectedSubcat(e.target.value)}
              className="subcat-mobile-select"
              aria-label="Filter by appliances subcategory"
            >
              {subcategories.map(sub => (
                <option key={sub.id} value={sub.id}>
                  {sub.label}
                </option>
              ))}
            </select>
          </div>

          <div className="subcat-pills desktop-subcat-pills">
            {subcategories.map(sub => (
              <button
                key={sub.id}
                className={`pill-btn ${selectedSubcat === sub.id ? 'active' : ''}`}
                onClick={() => setSelectedSubcat(sub.id)}
              >
                {sub.label}
              </button>
            ))}
          </div>

          <div className="toolbar-controls">
            <div className="price-slider-control">
              <span className="price-label">Max: ₹{maxPrice.toLocaleString('en-IN')}</span>
              <input 
                type="range" 
                min="2000" 
                max="20000" 
                step="1000"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="range-input"
              />
            </div>

            <div className="sort-select-wrapper">
              <ArrowUpDown size={14} className="sort-icon" />
              <select 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value)}
                className="sort-dropdown"
              >
                <option value="popular">Sort: Popularity</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="discount">Highest Discount</option>
                <option value="rating">Top Rated</option>
              </select>
            </div>
          </div>
        </div>

        <div className="results-count-bar">
          <span>Showing <strong>{filteredProducts.length}</strong> appliances</span>
        </div>

        {filteredProducts.length > 0 ? (
          <div className="catalog-products-grid">
            {filteredProducts.map(product => (
              <ProductCard
                key={product.id}
                product={product}
                onSelectProduct={onSelectProduct}
                onAddToCart={onAddToCart}
                isWishlisted={wishlist.some(item => item.id === product.id)}
                onToggleWishlist={onToggleWishlist}
                cartQuantity={cart?.find(item => item.id === product.id)?.quantity || 0}
                onUpdateQuantity={onUpdateQuantity}
              />
            ))}
          </div>
        ) : (
          <div className="no-products-box" style={{ textAlign: 'center', padding: '60px 20px', background: '#f8fafc', borderRadius: '16px', margin: '20px 0', border: '1px dashed #cbd5e1' }}>
            <Package size={44} style={{ color: '#94a3b8', margin: '0 auto 12px', display: 'block' }} />
            <h3 style={{ fontSize: '1.2rem', fontWeight: 600, color: '#1e293b', marginBottom: '6px' }}>No products found</h3>
            <p style={{ color: '#64748b', marginBottom: '16px' }}>No appliances found in the store database matching your criteria.</p>
            <button 
              className="btn-primary" 
              onClick={() => { setSelectedSubcat('all'); setMaxPrice(20000); }}
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>

      <style>{`
        .appliances-banner {
          background: linear-gradient(135deg, #14532d 0%, #064e3b 100%) !important;
        }
        .appliances-banner .banner-badge {
          background: rgba(74, 222, 128, 0.2);
          color: #86efac;
        }
      `}</style>
    </div>
  );
}
