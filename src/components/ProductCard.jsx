import React, { useState, useEffect } from 'react';
import { Heart, ShoppingBag, MessageCircle, Eye } from 'lucide-react';
import { subscribeToStoreSettings, DEFAULT_STORE_CONFIG } from '../services/settingsService';

// Lightweight inline SVG icons tailored to match the screenshot specifications
function SpecIcon({ type }) {
  switch (type) {
    case 'sofa':
      return (
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 9V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v3" />
          <path d="M2 11a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v6H2z" />
          <path d="M4 17v3" />
          <path d="M20 17v3" />
        </svg>
      );
    case 'gear':
      return (
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
        </svg>
      );
    case 'clock':
      return (
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
      );
    case 'bed':
      return (
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M2 4v16" />
          <path d="M2 8h18a2 2 0 0 1 2 2v10" />
          <path d="M2 17h20" />
          <path d="M6 8v9" />
        </svg>
      );
    case 'shield':
      return (
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
      );
    case 'chair':
      return (
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 19v2" />
          <path d="M18 19v2" />
          <path d="M18 11V5a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v6" />
          <path d="M4 11h16a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-4a1 1 0 0 1 1-1z" />
        </svg>
      );
    case 'leaf':
      return (
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.5 21 2c-.5 4.5-1 6-2.1 11.8A7 7 0 0 1 11 20z" />
          <path d="M2 21c0-3 1.85-5.36 5.08-6" />
        </svg>
      );
    case 'tools':
      return (
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
        </svg>
      );
    case '4k':
      return (
        <svg width="15" height="13" viewBox="0 0 28 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="1" y="1" width="26" height="18" rx="3" />
          <text x="6" y="14" fontSize="10" fontWeight="bold" fill="currentColor" stroke="none">4K</text>
        </svg>
      );
    case 'wifi':
      return (
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 12.55a11 11 0 0 1 14.08 0" />
          <path d="M1.42 9a16 16 0 0 1 21.16 0" />
          <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
          <line x1="12" y1="20" x2="12.01" y2="20" />
        </svg>
      );
    case 'monitor':
      return (
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="3" width="20" height="14" rx="2" />
          <line x1="8" y1="21" x2="16" y2="21" />
          <line x1="12" y1="17" x2="12" y2="21" />
        </svg>
      );
    case 'zap':
      return (
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
        </svg>
      );
    case 'snowflake':
      return (
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" y1="2" x2="12" y2="22" />
          <line x1="2" y1="12" x2="22" y2="12" />
          <path d="m20 16-4-4 4-4" />
          <path d="m4 8 4 4-4 4" />
          <path d="m16 4-4 4-4-4" />
          <path d="m8 20 4-4 4 4" />
        </svg>
      );
    case 'storage':
      return (
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="12" y1="12" x2="12" y2="21" />
        </svg>
      );
    case 'tub':
      return (
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <circle cx="12" cy="12" r="5" />
        </svg>
      );
    case 'refresh':
      return (
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="23 4 23 10 17 10" />
          <polyline points="1 20 1 14 7 14" />
          <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
        </svg>
      );
    case 'droplet':
      return (
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
        </svg>
      );
    case 'volume':
      return (
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
          <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
        </svg>
      );
    case 'chef':
      return (
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 8h1a4 4 0 0 1 0 8h-1" />
          <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" />
          <line x1="6" y1="1" x2="6" y2="4" />
          <line x1="10" y1="1" x2="10" y2="4" />
          <line x1="14" y1="1" x2="14" y2="4" />
        </svg>
      );
    case 'grill':
      return (
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="4" width="20" height="12" rx="2" />
          <line x1="6" y1="8" x2="6" y2="12" />
          <line x1="10" y1="8" x2="10" y2="12" />
          <line x1="14" y1="8" x2="14" y2="12" />
          <line x1="18" y1="8" x2="18" y2="12" />
        </svg>
      );
    case 'lock':
      return (
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
      );
    case 'jars':
      return (
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="4" y="6" width="16" height="15" rx="2" />
          <line x1="8" y1="2" x2="16" y2="2" />
          <line x1="8" y1="6" x2="16" y2="6" />
        </svg>
      );
    case 'blade':
      return (
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="12 2 15 8 22 9 17 14 18 21 12 17 6 21 7 14 2 9 9 8 12 2" />
        </svg>
      );
    case 'flame':
      return (
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
        </svg>
      );
    case 'gem':
      return (
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 3h12l4 6-10 13L2 9z" />
          <path d="M11 3 8 9l4 13 4-13-3-6" />
          <path d="M2 9h20" />
        </svg>
      );
    case 'award':
      return (
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="8" r="7" />
          <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
        </svg>
      );
    default:
      return (
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
      );
  }
}

export default function ProductCard({ 
  product, 
  onSelectProduct, 
  onAddToCart, 
  isWishlisted = false, 
  onToggleWishlist,
  cartQuantity = 0,
  onUpdateQuantity
}) {
  const [localQty, setLocalQty] = useState(cartQuantity);
  const [showDiscount, setShowDiscount] = useState(() => {
    return Boolean(DEFAULT_STORE_CONFIG.showDiscountPercentage);
  });

  useEffect(() => {
    const unsub = subscribeToStoreSettings((settings) => {
      if (settings && typeof settings.showDiscountPercentage !== 'undefined') {
        setShowDiscount(Boolean(settings.showDiscountPercentage));
      }
    });
    return () => unsub();
  }, []);

  React.useEffect(() => {
    if (cartQuantity !== undefined) {
      setLocalQty(cartQuantity);
    }
  }, [cartQuantity]);

  const {
    id,
    name,
    category,
    price,
    originalPrice,
    discount,
    badge,
    image,
    highlights,
    specifications = {},
    features = []
  } = product;

  // Format category name for pill badge
  const categoryDisplay = 
    category === 'appliances' ? 'Home Appliances' :
    category.charAt(0).toUpperCase() + category.slice(1);

  // Helper to extract clean text from string or { name, value } feature
  const resolveFeatureText = (feat, fallback) => {
    if (!feat) return fallback;
    if (typeof feat === 'string') return feat;
    if (typeof feat === 'object' && feat.name) {
      return feat.value ? `${feat.name}: ${feat.value}` : feat.name;
    }
    return fallback;
  };

  // Derive 3 highlight chips if not explicitly defined
  const displayHighlights = highlights || [
    { label: specifications['Seating Capacity'] || specifications['Screen Size'] || specifications['Capacity'] || resolveFeatureText(features[0], 'Verified Quality'), icon: 'award' },
    { label: specifications['Primary Material'] || specifications['Display Technology'] || resolveFeatureText(features[1], 'Durable Build'), icon: 'shield' },
    { label: 'Multiple Colours', icon: 'clock' }
  ].slice(0, 3);

  const formatPrice = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);
  };

  const handleWhatsAppEnquiry = (e) => {
    e.stopPropagation();
    const message = encodeURIComponent(
      `Hello Sardar Mart Furniture and Home Appliances, I'm interested in inquiring about "${name}" (SKU: ${id}) priced at ${formatPrice(price)}. Is it available for immediate delivery?`
    );
    window.open(`https://wa.me/916383056338?text=${message}`, '_blank');
  };

  const handlePrimaryClick = (e) => {
    e.stopPropagation();
    if (onSelectProduct) {
      onSelectProduct(product);
    }
  };

  const handleIncreaseCardQty = (e) => {
    e.stopPropagation();
    const next = localQty + 1;
    setLocalQty(next);
    if (onUpdateQuantity) {
      onUpdateQuantity(product.id, next);
    } else if (onAddToCart) {
      onAddToCart(product, 1);
    }
  };

  const handleDecreaseCardQty = (e) => {
    e.stopPropagation();
    const next = Math.max(0, localQty - 1);
    setLocalQty(next);
    if (onUpdateQuantity) {
      onUpdateQuantity(product.id, next);
    }
  };

  const handleWishlistClick = (e) => {
    e.stopPropagation();
    if (onToggleWishlist) onToggleWishlist(product);
  };

  return (
    <div className="product-card" onClick={() => onSelectProduct && onSelectProduct(product)}>
      {/* Top Media Area */}
      <div className="product-image-container">
        <img 
          src={image || 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=600&q=80'} 
          alt={name} 
          className="product-image" 
          loading="lazy"
          decoding="async"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=600&q=80';
          }}
        />

        {/* Top-Left Ribbon Badge */}
        {badge && (
          badge === 'BEST SELLER' ? (
            <div className="card-ribbon-badge ribbon-red">
              <span>BEST</span>
              <span>SELLER</span>
            </div>
          ) : badge === 'NEW ARRIVAL' ? (
            <div className="card-ribbon-badge ribbon-red">
              <span>NEW</span>
              <span>ARRIVAL</span>
            </div>
          ) : badge === 'OFFER' ? (
            <div className="card-ribbon-badge ribbon-pill ribbon-offer">
              <span>OFFER</span>
            </div>
          ) : badge === 'NEW' ? (
            <div className="card-ribbon-badge ribbon-pill ribbon-new">
              <span>NEW</span>
            </div>
          ) : (
            <div className="card-ribbon-badge ribbon-pill ribbon-default">
              <span>{badge}</span>
            </div>
          )
        )}

        {/* Wishlist Button (Circular Top Right) */}
        <button 
          className={`card-wishlist-btn ${isWishlisted ? 'active' : ''}`}
          onClick={handleWishlistClick}
          title={isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
          aria-label="Wishlist toggle"
        >
          <Heart size={16} fill={isWishlisted ? "#e11d48" : "none"} color={isWishlisted ? "#e11d48" : "#374151"} />
        </button>

        {/* Quick View Hover Tab */}
        <div className="quick-view-overlay">
          <span><Eye size={13} /> View Specs</span>
        </div>
      </div>

      {/* Card Content Area */}
      <div className="product-card-body">
        {/* Category Pill */}
        <span className="card-category-pill">
          {categoryDisplay}
        </span>

        {/* Product Title */}
        <h3 className="product-title" title={name}>
          {name}
        </h3>

        {/* 3-Point Feature Specs with Icons */}
        <div className="card-features-grid">
          {displayHighlights.map((hl, idx) => (
            <span key={idx} className="feature-chip">
              <span className="feature-icon"><SpecIcon type={hl.icon} /></span>
              <span className="feature-text">{hl.label}</span>
            </span>
          ))}
        </div>

        {/* Price Row */}
        <div className="product-price-row">
          <span className="current-price">{formatPrice(price)}</span>
          {originalPrice && originalPrice > price && (
            <span className="original-price">{formatPrice(originalPrice)}</span>
          )}
          {discount > 0 && showDiscount && (
            <span className="discount-badge">{discount}% OFF</span>
          )}
        </div>

        {/* Action Buttons Row */}
        <div className="product-card-actions">
          {localQty === 0 ? (
            <button 
              className="btn-view-details"
              onClick={handlePrimaryClick}
              title="View full specifications & details"
            >
              <ShoppingBag size={14} />
              <span>View Details</span>
            </button>
          ) : (
            <div className="card-qty-stepper animate-fade-in" onClick={(e) => e.stopPropagation()}>
              <button 
                onClick={handleDecreaseCardQty}
                className="card-qty-step-btn"
                title={localQty === 1 ? "Remove from cart" : "Decrease quantity"}
              >
                -
              </button>
              <span className="card-qty-step-val">{localQty} in Cart</span>
              <button 
                onClick={handleIncreaseCardQty}
                className="card-qty-step-btn"
                title="Add more"
              >
                +
              </button>
            </div>
          )}
          
          <button 
            className="btn-enquire"
            onClick={handleWhatsAppEnquiry}
            title="Chat on WhatsApp about this product"
          >
            <MessageCircle size={14} />
            <span>Enquire</span>
          </button>
        </div>
      </div>

      <style>{`
        .product-card {
          background: #ffffff;
          border-radius: 14px;
          border: 1px solid #e5e7eb;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          transition: transform 0.22s ease, box-shadow 0.22s ease, border-color 0.22s ease;
          cursor: pointer;
          position: relative;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
        }
        .product-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 10px 24px rgba(45, 25, 15, 0.1);
          border-color: #cbd5e1;
        }

        /* Image area */
        .product-image-container {
          position: relative;
          width: 100%;
          height: 165px;
          background: #f8f6f2;
          overflow: hidden;
        }
        .product-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.4s ease;
        }
        .product-card:hover .product-image {
          transform: scale(1.05);
        }

        /* Badges */
        .card-ribbon-badge {
          position: absolute;
          z-index: 3;
          background: #dc2626;
          color: #ffffff;
          font-weight: 800;
          text-align: center;
          box-shadow: 0 2px 5px rgba(220, 38, 38, 0.35);
        }
        .card-ribbon-badge.ribbon-red {
          top: 0;
          left: 12px;
          padding: 6px 9px 8px 9px;
          font-size: 0.62rem;
          line-height: 1.15;
          letter-spacing: 0.4px;
          clip-path: polygon(0 0, 100% 0, 100% calc(100% - 5px), 50% 100%, 0 calc(100% - 5px));
          border-radius: 0 0 2px 2px;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .card-ribbon-badge.ribbon-pill {
          top: 10px;
          left: 10px;
          padding: 3px 10px;
          font-size: 0.68rem;
          letter-spacing: 0.4px;
          border-radius: 9999px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }
        .card-ribbon-badge.ribbon-offer {
          background: #dc2626;
        }
        .card-ribbon-badge.ribbon-new {
          background: #dc2626;
        }

        /* Wishlist circular button */
        .card-wishlist-btn {
          position: absolute;
          top: 9px;
          right: 9px;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: #ffffff;
          border: 1px solid #f1f5f9;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 3;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
          transition: transform 0.2s ease, background 0.2s ease;
          cursor: pointer;
        }
        .card-wishlist-btn:hover {
          transform: scale(1.1);
          background: #ffffff;
        }
        .card-wishlist-btn.active {
          background: #fff1f2;
          border-color: #fecdd3;
        }

        /* Quick view overlay */
        .quick-view-overlay {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          background: rgba(45, 25, 15, 0.85);
          color: #ffffff;
          padding: 5px;
          text-align: center;
          font-size: 0.72rem;
          font-weight: 600;
          backdrop-filter: blur(2px);
          transform: translateY(100%);
          transition: transform 0.2s ease;
        }
        .quick-view-overlay span {
          display: inline-flex;
          align-items: center;
          gap: 4px;
        }
        .product-card:hover .quick-view-overlay {
          transform: translateY(0);
        }

        /* Body */
        .product-card-body {
          padding: 12px 12px 14px 12px;
          display: flex;
          flex-direction: column;
          flex: 1;
        }

        .card-category-pill {
          align-self: flex-start;
          background: #f4efe9;
          color: #5c4033;
          font-size: 0.68rem;
          font-weight: 600;
          padding: 2.5px 9px;
          border-radius: 12px;
          margin-bottom: 6px;
        }

        .product-title {
          font-size: 0.88rem;
          font-weight: 700;
          color: #111827;
          line-height: 1.25;
          margin-bottom: 8px;
          min-height: 35px;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        /* Features highlight grid */
        .card-features-grid {
          display: flex;
          flex-wrap: wrap;
          gap: 4px 8px;
          margin-bottom: 10px;
          min-height: 38px;
          align-content: flex-start;
        }
        .feature-chip {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-size: 0.68rem;
          color: #4b5563;
          white-space: nowrap;
        }
        .feature-icon {
          display: inline-flex;
          align-items: center;
          color: #6b7280;
          flex-shrink: 0;
        }
        .feature-text {
          font-weight: 500;
        }

        /* Price row */
        .product-price-row {
          display: flex;
          align-items: baseline;
          gap: 6px;
          margin-top: auto;
          padding-top: 4px;
          padding-bottom: 2px;
        }
        .current-price {
          font-size: 1.05rem;
          font-weight: 800;
          color: #111827;
          letter-spacing: -0.2px;
        }
        .original-price {
          font-size: 0.74rem;
          color: #9ca3af;
          text-decoration: line-through;
        }
        .discount-badge {
          margin-left: auto;
          background: #fff7ed;
          border: 1px solid #ffedd5;
          color: #c2410c;
          font-size: 0.68rem;
          font-weight: 700;
          padding: 1.5px 6px;
          border-radius: 4px;
          white-space: nowrap;
        }

        /* Action Buttons Row */
        .product-card-actions {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-top: 10px;
        }
        .btn-view-details {
          flex: 1;
          background: #4a2312;
          color: #ffffff;
          border: none;
          border-radius: 6px;
          padding: 7px 6px;
          font-size: 0.74rem;
          font-weight: 600;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 5px;
          cursor: pointer;
          transition: background 0.2s ease;
          white-space: nowrap;
        }
        .btn-view-details:hover {
          background: #371a0d;
        }

        .btn-enquire {
          flex: 1;
          background: #ffffff;
          color: #16a34a;
          border: 1.5px solid #22c55e;
          border-radius: 6px;
          padding: 6.5px 6px;
          font-size: 0.74rem;
          font-weight: 600;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 5px;
          cursor: pointer;
          transition: all 0.2s ease;
          white-space: nowrap;
        }
        .btn-enquire:hover {
          background: #f0fdf4;
          border-color: #16a34a;
        }

        /* Quantity stepper in card */
        .card-qty-stepper {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: #fdfaf7;
          border: 1.5px solid #4a2312;
          border-radius: 6px;
          overflow: hidden;
          height: 31px;
        }
        .card-qty-step-btn {
          width: 26px;
          height: 100%;
          background: #f5ebe3;
          color: #4a2312;
          border: none;
          font-size: 0.95rem;
          font-weight: 800;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: background 0.15s ease;
        }
        .card-qty-step-btn:hover {
          background: #4a2312;
          color: #ffffff;
        }
        .card-qty-step-val {
          font-size: 0.72rem;
          font-weight: 700;
          color: #4a2312;
          padding: 0 3px;
          white-space: nowrap;
        }

        @media (max-width: 600px) {
          .product-image-container {
            height: 145px;
          }
          .product-card-body {
            padding: 10px 8px 10px 8px;
          }
          .product-title {
            font-size: 0.8rem;
            min-height: 32px;
          }
          .card-features-grid {
            min-height: auto;
            max-height: 40px;
            overflow: hidden;
            gap: 2px 6px;
          }
          .feature-chip {
            font-size: 0.65rem;
            max-width: 100%;
          }
          .feature-text {
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
          .current-price {
            font-size: 0.95rem;
          }
          .original-price {
            font-size: 0.7rem;
          }
          .discount-badge {
            font-size: 0.62rem;
            padding: 1px 4px;
          }
          .product-card-actions {
            gap: 4px;
          }
          .btn-view-details, .btn-enquire {
            font-size: 0.68rem;
            padding: 6px 4px;
            gap: 3px;
          }
          .card-qty-step-val {
            font-size: 0.65rem;
          }
        }

        @media (max-width: 380px) {
          .product-image-container {
            height: 130px;
          }
          .product-card-body {
            padding: 8px 6px 8px 6px;
          }
          .product-title {
            font-size: 0.76rem;
            min-height: 30px;
            margin-bottom: 4px;
          }
          .card-category-pill {
            font-size: 0.62rem;
            padding: 2px 6px;
            margin-bottom: 4px;
          }
          .card-features-grid {
            display: none;
          }
          .current-price {
            font-size: 0.88rem;
          }
          .original-price {
            font-size: 0.65rem;
          }
          .discount-badge {
            font-size: 0.58rem;
            padding: 1px 3px;
          }
          .product-card-actions {
            gap: 3px;
            margin-top: 6px;
          }
          .btn-view-details, .btn-enquire {
            font-size: 0.62rem;
            padding: 5px 2px;
            gap: 2px;
          }
          .btn-view-details svg, .btn-enquire svg {
            width: 11px;
            height: 11px;
          }
          .card-qty-step-val {
            font-size: 0.6rem;
            padding: 0 1px;
          }
          .card-qty-step-btn {
            width: 22px;
          }
        }
      `}</style>
    </div>
  );
}
