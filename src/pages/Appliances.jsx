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
  products: customProducts,
  categories = []
}) {
  const allProducts = Array.isArray(customProducts) ? customProducts : (customProducts || []);
  const [selectedSubcat, setSelectedSubcat] = useState(selectedSubcategory);

  React.useEffect(() => {
    if (selectedSubcategory) {
      setSelectedSubcat(selectedSubcategory);
    }
  }, [selectedSubcategory]);

  const [sortBy, setSortBy] = useState('popular');
  const [maxPrice, setMaxPrice] = useState(200000);

  const appliancesProducts = useMemo(() => {
    return allProducts.filter(p => {
      const cat = (p.category || '').toLowerCase().trim();
      return cat === 'appliances' || cat === 'appliance' || cat === 'home-appliances' || cat === 'home appliances';
    });
  }, [allProducts]);

  const subcategories = useMemo(() => {
    const list = [
      { id: 'all', label: 'All Appliances' }
    ];
    const known = new Set(['all']);

    // 1. Categories created in Categories page for Appliances
    (categories || []).forEach(c => {
      const cDept = (c.category || '').toLowerCase().trim();
      if (cDept === 'appliances' || cDept === 'appliance' || cDept === 'home-appliances' || cDept === 'home appliances') {
        const idNorm = (c.id || c.name || '').toLowerCase().trim();
        const normSingular = idNorm.replace(/s$/, '');
        const exists = Array.from(known).some(k => k.replace(/s$/, '') === normSingular);
        if (!exists) {
          known.add(idNorm);
          list.push({
            id: c.id,
            label: c.name || (c.id.charAt(0).toUpperCase() + c.id.slice(1))
          });
        }
      }
    });

    // 2. Subcategories from live database products
    appliancesProducts.forEach(p => {
      if (p.subcategory) {
        const idNorm = p.subcategory.toLowerCase().trim();
        const normSingular = idNorm.replace(/s$/, '');
        const exists = Array.from(known).some(k => k.replace(/s$/, '') === normSingular);
        if (!exists) {
          known.add(idNorm);
          list.push({
            id: p.subcategory,
            label: p.subcategory.charAt(0).toUpperCase() + p.subcategory.slice(1).replace(/-/g, ' ')
          });
        }
      }
    });

    // 3. Standard fallback categories if not already present
    const defaults = [
      { id: 'refrigerator', label: 'Refrigerators' },
      { id: 'mixers', label: 'Mixer Grinders' },
      { id: 'kitchen', label: 'Air Fryers & Microwave' },
      { id: 'home', label: 'RO Water Purifiers' }
    ];
    defaults.forEach(d => {
      const normSingular = d.id.replace(/s$/, '');
      const exists = Array.from(known).some(k => k.replace(/s$/, '') === normSingular);
      if (!exists) {
        known.add(d.id);
        list.push(d);
      }
    });

    if (selectedSubcat && selectedSubcat !== 'all') {
      const selNorm = selectedSubcat.toLowerCase().replace(/s$/, '');
      const exists = Array.from(known).some(k => k.replace(/s$/, '') === selNorm);
      if (!exists) {
        list.push({
          id: selectedSubcat,
          label: selectedSubcat.charAt(0).toUpperCase() + selectedSubcat.slice(1).replace(/-/g, ' ')
        });
      }
    }

    return list;
  }, [categories, appliancesProducts, selectedSubcat]);

  const filteredProducts = useMemo(() => {
    return appliancesProducts.filter(p => {
      const norm = (s) => (s || '').toLowerCase().trim().replace(/s$/, '');
      const matchSubcat = selectedSubcat === 'all' || 
        p.subcategory === selectedSubcat || 
        (p.subcategory && norm(p.subcategory) === norm(selectedSubcat)) ||
        (p.category && norm(p.category) === norm(selectedSubcat));
      const pPrice = Number(p.price ?? p.sellingPrice ?? 0);
      const matchPrice = pPrice <= maxPrice;
      const matchSearch = searchQuery === '' || 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.description && p.description.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchSubcat && matchPrice && matchSearch;
    }).sort((a, b) => {
      const priceA = Number(a.price ?? a.sellingPrice ?? 0);
      const priceB = Number(b.price ?? b.sellingPrice ?? 0);
      if (sortBy === 'price-low') return priceA - priceB;
      if (sortBy === 'price-high') return priceB - priceA;
      if (sortBy === 'discount') return (b.discount || 0) - (a.discount || 0);
      if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
      if (sortBy === 'name-asc') {
        const nameA = (a.name || a.title || '').toLowerCase();
        const nameB = (b.name || b.title || '').toLowerCase();
        return nameA.localeCompare(nameB);
      }
      if (sortBy === 'name-desc') {
        const nameA = (a.name || a.title || '').toLowerCase();
        const nameB = (b.name || b.title || '').toLowerCase();
        return nameB.localeCompare(nameA);
      }
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
            Heavy-duty mixer grinders, refrigerators, air fryers, convection ovens, and water purifiers.
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
                min="1000" 
                max="200000" 
                step="2000"
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
                <option value="name-asc">Alphabetical: A to Z</option>
                <option value="name-desc">Alphabetical: Z to A</option>
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
