import React, { useState, useMemo } from 'react';
import { Filter, SlidersHorizontal, ArrowUpDown, Check, Sparkles, Package, Layers } from 'lucide-react';
import ProductCard from '../components/ProductCard';

export default function Furniture({ 
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
  const [maxPrice, setMaxPrice] = useState(60000);

  const furnitureProducts = useMemo(() => {
    return allProducts.filter(p => p.category === 'furniture');
  }, [allProducts]);

  const subcategories = useMemo(() => {
    const list = [
      { id: 'all', label: 'All Furniture' },
      { id: 'sofas', label: 'Sofas & Recliners' },
      { id: 'beds', label: 'Beds & Mattresses' },
      { id: 'dining', label: 'Dining Sets' },
      { id: 'wardrobes', label: 'Wardrobes' },
      { id: 'chairs', label: 'Chairs & Study' }
    ];
    const known = new Set(list.map(s => s.id.toLowerCase()));
    furnitureProducts.forEach(p => {
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
  }, [furnitureProducts, selectedSubcat]);

  const filteredProducts = useMemo(() => {
    return furnitureProducts.filter(p => {
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
      return 0; // Default popular
    });
  }, [furnitureProducts, selectedSubcat, maxPrice, searchQuery, sortBy]);

  return (
    <div className="catalog-page">
      {/* Catalog Hero Banner */}
      <div className="catalog-hero-banner">
        <div className="container banner-inner">
          <span className="banner-badge">Handcrafted Teak &amp; Sheesham</span>
          <h1 className="banner-heading">Living &amp; Bedroom Furniture</h1>
          <p className="banner-sub">
            Transform every corner of your home with timeless designs, ergonomic seating, and solid wood durability.
          </p>
        </div>
      </div>

      <div className="container main-catalog-container">
        {/* Filter and Subcategory Bar */}
        <div className="catalog-toolbar">
          {/* Subcategory Dropdown for Mobile View */}
          <div className="subcat-mobile-dropdown-wrap">
            <Layers size={15} className="subcat-dropdown-icon" />
            <select
              value={selectedSubcat}
              onChange={(e) => setSelectedSubcat(e.target.value)}
              className="subcat-mobile-select"
              aria-label="Filter by furniture subcategory"
            >
              {subcategories.map(sub => (
                <option key={sub.id} value={sub.id}>
                  {sub.label}
                </option>
              ))}
            </select>
          </div>

          {/* Subcategory Pills (Desktop) */}
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

          {/* Right Controls: Sort & Price filter */}
          <div className="toolbar-controls">
            <div className="price-slider-control">
              <span className="price-label">Max: ₹{maxPrice.toLocaleString('en-IN')}</span>
              <input 
                type="range" 
                min="5000" 
                max="60000" 
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
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="discount">Highest Discount</option>
                <option value="rating">Top Rated</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Count & Active Status */}
        <div className="results-count-bar">
          <span>Showing <strong>{filteredProducts.length}</strong> premium furniture products</span>
          {searchQuery && (
            <span className="search-filter-tag">Filtered by: "{searchQuery}"</span>
          )}
        </div>

        {/* Products Grid */}
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
            <p style={{ color: '#64748b', marginBottom: '16px' }}>No furniture products found in the store database matching your criteria.</p>
            <button 
              className="btn-primary" 
              onClick={() => { setSelectedSubcat('all'); setMaxPrice(60000); }}
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>

      <style>{`
        .catalog-page {
          padding-bottom: 60px;
        }
        .catalog-hero-banner {
          background: linear-gradient(135deg, #3d2315 0%, #1e110a 100%);
          color: #ffffff;
          padding: 45px 0;
          margin-bottom: 30px;
        }
        .banner-inner {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
        }
        .banner-badge {
          background: rgba(245, 158, 11, 0.2);
          color: #fde047;
          font-size: 0.75rem;
          font-weight: 700;
          padding: 4px 12px;
          border-radius: var(--radius-full);
          text-transform: uppercase;
          margin-bottom: 10px;
        }
        .banner-heading {
          font-size: 2.2rem;
          color: #ffffff;
          margin-bottom: 8px;
        }
        .banner-sub {
          color: #e2d5cb;
          max-width: 600px;
          font-size: 0.95rem;
          line-height: 1.5;
        }

        .catalog-toolbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: #ffffff;
          padding: 16px 20px;
          border-radius: var(--radius-lg);
          border: 1px solid var(--color-border);
          box-shadow: var(--shadow-sm);
          margin-bottom: 20px;
          flex-wrap: wrap;
          gap: 16px;
        }
        .subcat-pills {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }
        .pill-btn {
          padding: 8px 16px;
          border-radius: var(--radius-full);
          background: #f7f3ee;
          color: var(--color-text-main);
          font-size: 0.85rem;
          font-weight: 600;
          transition: all var(--transition-fast);
        }
        .pill-btn:hover {
          background: #ecd8cb;
          color: var(--color-primary);
        }
        .pill-btn.active {
          background: var(--color-primary);
          color: #ffffff;
        }

        .toolbar-controls {
          display: flex;
          align-items: center;
          gap: 20px;
          flex-wrap: wrap;
        }
        .price-slider-control {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .price-label {
          font-size: 0.82rem;
          font-weight: 700;
          color: var(--color-primary);
          white-space: nowrap;
        }
        .range-input {
          accent-color: var(--color-primary);
          cursor: pointer;
          width: 110px;
        }

        .sort-select-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }
        .sort-icon {
          position: absolute;
          left: 10px;
          color: var(--color-text-muted);
          pointer-events: none;
        }
        .sort-dropdown {
          padding: 8px 14px 8px 30px;
          border-radius: var(--radius-md);
          border: 1px solid var(--color-border);
          background: #ffffff;
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--color-text-main);
          cursor: pointer;
          outline: none;
        }

        .results-count-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 0.85rem;
          color: var(--color-text-muted);
          margin-bottom: 24px;
        }
        .search-filter-tag {
          background: #fef3c7;
          color: #92400e;
          padding: 3px 10px;
          border-radius: var(--radius-full);
          font-weight: 600;
        }

        .catalog-products-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
        }

        .no-products-box {
          text-align: center;
          padding: 60px 20px;
          background: #ffffff;
          border-radius: var(--radius-lg);
          border: 1px dashed var(--color-border);
        }
        .no-products-box p {
          margin-bottom: 16px;
          color: var(--color-text-muted);
          font-size: 1.05rem;
        }

        @media (max-width: 1100px) {
          .catalog-products-grid {
            grid-template-columns: repeat(3, 1fr);
            gap: 14px;
          }
        }
        @media (max-width: 800px) {
          .catalog-products-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 10px;
          }
          .catalog-toolbar {
            flex-direction: column;
            align-items: stretch;
            padding: 12px;
          }
        }
        @media (max-width: 640px) {
          .catalog-hero-banner {
            padding: 26px 0;
            margin-bottom: 16px;
          }
          .banner-heading {
            font-size: 1.6rem;
          }
          .banner-sub {
            font-size: 0.82rem;
          }
          .subcat-pills {
            overflow-x: auto;
            flex-wrap: nowrap;
            padding-bottom: 6px;
            scrollbar-width: none;
            -webkit-overflow-scrolling: touch;
          }
          .subcat-pills::-webkit-scrollbar {
            display: none;
          }
          .pill-btn {
            white-space: nowrap;
            padding: 6px 12px;
            font-size: 0.78rem;
          }
          .toolbar-controls {
            flex-direction: column;
            align-items: stretch;
            gap: 10px;
          }
          .price-slider-control {
            justify-content: space-between;
          }
          .range-input {
            width: 140px;
          }
          .sort-dropdown {
            width: 100%;
          }
          .catalog-products-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 10px !important;
          }
          .results-count-bar {
            font-size: 0.78rem;
            margin-bottom: 14px;
          }
        }
      `}</style>
    </div>
  );
}
