import React, { useState, useMemo } from 'react';
import { 
  Heart, ShoppingBag, Trash2, ArrowLeft, 
  MessageCircle, Sparkles, Package, ArrowRight,
  Share2, CheckCircle2, ShieldCheck, Tag
} from 'lucide-react';
import ProductCard from '../components/ProductCard';

export default function Wishlist({
  wishlist = [],
  onToggleWishlist,
  onRemoveWishlist,
  onAddToCart,
  cart = [],
  onUpdateQuantity,
  onSelectProduct,
  onNavigate
}) {
  const [filterCategory, setFilterCategory] = useState('all');
  const [copiedToast, setCopiedToast] = useState(false);

  // Available categories in user's wishlist
  const categoriesInWishlist = useMemo(() => {
    const cats = new Set(wishlist.map(item => item.category?.toLowerCase() || 'other'));
    return ['all', ...Array.from(cats)];
  }, [wishlist]);

  // Filtered items
  const filteredItems = useMemo(() => {
    if (filterCategory === 'all') return wishlist;
    return wishlist.filter(item => (item.category || '').toLowerCase() === filterCategory.toLowerCase());
  }, [wishlist, filterCategory]);

  // Total value calculation
  const totalWishlistValue = useMemo(() => {
    return wishlist.reduce((acc, item) => acc + (Number(item.price) || 0), 0);
  }, [wishlist]);

  // Handle "Move All to Cart"
  const handleMoveAllToCart = () => {
    if (wishlist.length === 0) return;
    wishlist.forEach(item => {
      onAddToCart(item, 1);
    });
  };

  // Handle Clear Wishlist
  const handleClearWishlist = () => {
    if (window.confirm('Are you sure you want to remove all saved items from your wishlist?')) {
      wishlist.forEach(item => {
        if (onRemoveWishlist) onRemoveWishlist(item.id);
        else if (onToggleWishlist) onToggleWishlist(item);
      });
    }
  };

  // Build WhatsApp enquiry message with wishlist items
  const handleWhatsAppEnquiry = () => {
    if (wishlist.length === 0) return;
    const itemList = wishlist.map((item, idx) => `${idx + 1}. ${item.name} (₹${(Number(item.price) || 0).toLocaleString('en-IN')})`).join('%0A');
    const message = `Hello Sardar Mart Furniture and Home Appliances!%0A%0AI have saved the following items to my Wishlist on your website and would like to enquire about availability, best showroom discount, and delivery:%0A%0A${itemList}%0A%0ATotal Shortlisted Value: ₹${totalWishlistValue.toLocaleString('en-IN')}%0A%0APlease let me know the best deal. Thank you!`;
    window.open(`https://wa.me/916383056338?text=${message}`, '_blank');
  };

  // Share Wishlist
  const handleShareWishlist = () => {
    const url = window.location.origin;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
      setCopiedToast(true);
      setTimeout(() => setCopiedToast(false), 2500);
    }
  };

  return (
    <div className="wishlist-page-root animate-fade-in">
      
      {/* 1. HERO BANNER */}
      <div className="catalog-hero-banner wishlist-banner">
        <div className="container banner-inner">
          <div className="banner-breadcrumb">
            <button onClick={() => onNavigate('home')} className="crumb-btn">
              <ArrowLeft size={14} /> Back to Home
            </button>
            <span className="crumb-sep">/</span>
            <span className="crumb-current">Wishlist</span>
          </div>

          <span className="banner-badge">
            <Heart size={14} fill="#e11d48" color="#e11d48" style={{ display: 'inline', verticalAlign: '-2px' }} />
            {' '}Saved Favourites • {wishlist.length} {wishlist.length === 1 ? 'Item' : 'Items'}
          </span>

          <h1 className="banner-heading">My Wishlist Collection</h1>
          <p className="banner-sub">
            Curate your dream furniture, luxury living sets, and top-tier smart home appliances. Items are saved locally and synced with your session.
          </p>

          {wishlist.length > 0 && (
            <div className="wishlist-summary-chips">
              <div className="summary-chip">
                <span className="chip-label">Total Shortlisted Items:</span>
                <strong className="chip-value">{wishlist.length}</strong>
              </div>
              <div className="summary-chip highlight">
                <span className="chip-label">Estimated Collection Value:</span>
                <strong className="chip-value">₹{totalWishlistValue.toLocaleString('en-IN')}</strong>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="container main-catalog-container">
        
        {wishlist.length > 0 ? (
          <>
            {/* 2. TOOLBAR / ACTION BAR */}
            <div className="wishlist-toolbar">
              <div className="wishlist-toolbar-left">
                {categoriesInWishlist.length > 2 && (
                  <div className="wishlist-filter-tabs">
                    {categoriesInWishlist.map(cat => (
                      <button
                        key={cat}
                        className={`wishlist-tab-btn ${filterCategory === cat ? 'active' : ''}`}
                        onClick={() => setFilterCategory(cat)}
                      >
                        {cat === 'all' ? 'All Saved' : cat.charAt(0).toUpperCase() + cat.slice(1)}
                      </button>
                    ))}
                  </div>
                )}
                <span className="wishlist-count-label">
                  Showing <strong>{filteredItems.length}</strong> {filteredItems.length === 1 ? 'item' : 'items'}
                </span>
              </div>

              {/* Action buttons */}
              <div className="wishlist-toolbar-actions">
                <button
                  type="button"
                  className="wishlist-action-btn primary"
                  onClick={handleMoveAllToCart}
                  title="Add all wishlist items into your shopping cart"
                >
                  <ShoppingBag size={16} />
                  <span>Move All to Cart</span>
                </button>

                <button
                  type="button"
                  className="wishlist-action-btn whatsapp"
                  onClick={handleWhatsAppEnquiry}
                  title="Enquire about these items on WhatsApp"
                >
                  <MessageCircle size={16} />
                  <span>Enquire on WhatsApp</span>
                </button>

                <button
                  type="button"
                  className="wishlist-action-btn outline"
                  onClick={handleClearWishlist}
                  title="Clear all items from wishlist"
                >
                  <Trash2 size={15} />
                  <span>Clear All</span>
                </button>
              </div>
            </div>

            {/* 3. PRODUCT GRID */}
            <div className="catalog-products-grid">
              {filteredItems.map(product => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onSelectProduct={onSelectProduct}
                  onAddToCart={onAddToCart}
                  isWishlisted={true}
                  onToggleWishlist={onToggleWishlist}
                  cartQuantity={cart?.find(item => item.id === product.id)?.quantity || 0}
                  onUpdateQuantity={onUpdateQuantity}
                />
              ))}
            </div>

            {/* 4. BOTTOM HELPER BANNER */}
            <div className="wishlist-bottom-banner">
              <div className="bottom-banner-content">
                <ShieldCheck size={28} className="shield-icon" />
                <div>
                  <h4>100% Price Match &amp; Official Warranty Guarantee</h4>
                  <p>All shortlisted furniture items are eligible for free doorstep showroom demonstration and customizable fabric options in Chennai.</p>
                </div>
              </div>
              <button
                type="button"
                className="btn-primary"
                onClick={() => onNavigate('furniture')}
              >
                Continue Shopping <ArrowRight size={16} />
              </button>
            </div>
          </>
        ) : (
          /* 5. EMPTY STATE */
          <div className="wishlist-empty-card">
            <div className="empty-heart-circle">
              <Heart size={44} color="#e11d48" />
            </div>
            <h2>Your Wishlist is Empty</h2>
            <p>
              Explore our handcrafted teak wood furniture, 4K UHD smart electronics, and modern kitchen appliances. Click the heart icon on any item to save it here for later.
            </p>

            <div className="empty-explore-grid">
              <button 
                className="empty-cat-btn"
                onClick={() => onNavigate('furniture')}
              >
                <span className="cat-emoji">🛋️</span>
                <strong>Living &amp; Bedroom Furniture</strong>
                <small>Sofas, Teak Beds, Wardrobes</small>
              </button>

              <button 
                className="empty-cat-btn"
                onClick={() => onNavigate('electronics')}
              >
                <span className="cat-emoji">📺</span>
                <strong>Smart Electronics</strong>
                <small>Smart TVs, Refrigerators, ACs</small>
              </button>

              <button 
                className="empty-cat-btn"
                onClick={() => onNavigate('appliances')}
              >
                <span className="cat-emoji">🍳</span>
                <strong>Kitchen Appliances</strong>
                <small>Mixers, Stoves, Chimneys</small>
              </button>

              <button 
                className="empty-cat-btn offer"
                onClick={() => onNavigate('offers')}
              >
                <span className="cat-emoji">🔥</span>
                <strong>Festival Deals</strong>
                <small>Up to 50% Off Showroom Combos</small>
              </button>
            </div>

            <button
              className="btn-primary start-shopping-btn"
              onClick={() => onNavigate('home')}
            >
              Start Exploring Showroom <ArrowRight size={16} />
            </button>
          </div>
        )}

      </div>

      {copiedToast && (
        <div className="toast-container">
          <div className="toast-msg">
            <span>Link copied to clipboard!</span>
          </div>
        </div>
      )}

      {/* STYLES */}
      <style>{`
        .wishlist-page-root {
          min-height: 75vh;
          padding-bottom: 50px;
        }

        .wishlist-banner {
          background: linear-gradient(135deg, #2b1307 0%, #4a210f 50%, #200f07 100%) !important;
          color: #ffffff;
        }

        .banner-breadcrumb {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 12px;
          font-size: 0.85rem;
        }

        .crumb-btn {
          background: transparent;
          border: none;
          color: rgba(255, 255, 255, 0.75);
          font-size: 0.82rem;
          font-weight: 600;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 0;
          transition: color 0.2s;
        }

        .crumb-btn:hover {
          color: #ffffff;
        }

        .crumb-sep {
          color: rgba(255, 255, 255, 0.4);
        }

        .crumb-current {
          color: #f1dfd3;
          font-weight: 700;
        }

        .wishlist-summary-chips {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
          margin-top: 18px;
        }

        .summary-chip {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(8px);
          border: 1px solid rgba(255, 255, 255, 0.18);
          padding: 7px 14px;
          border-radius: 999px;
          font-size: 0.84rem;
        }

        .summary-chip.highlight {
          background: rgba(200, 90, 23, 0.25);
          border-color: rgba(246, 173, 85, 0.4);
        }

        .summary-chip .chip-label {
          color: rgba(255, 255, 255, 0.8);
        }

        .summary-chip .chip-value {
          color: #ffffff;
          font-weight: 800;
        }

        .wishlist-toolbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: #ffffff;
          padding: 14px 18px;
          border-radius: 14px;
          border: 1px solid #e2e8f0;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
          margin-bottom: 22px;
          gap: 16px;
          flex-wrap: wrap;
        }

        .wishlist-toolbar-left {
          display: flex;
          align-items: center;
          gap: 16px;
          flex-wrap: wrap;
        }

        .wishlist-filter-tabs {
          display: flex;
          gap: 6px;
        }

        .wishlist-tab-btn {
          background: #f1f5f9;
          border: 1px solid transparent;
          color: #475569;
          font-size: 0.8rem;
          font-weight: 700;
          padding: 6px 14px;
          border-radius: 999px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .wishlist-tab-btn.active {
          background: #8c3b10;
          color: #ffffff;
        }

        .wishlist-count-label {
          font-size: 0.86rem;
          color: #64748b;
        }

        .wishlist-toolbar-actions {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-wrap: wrap;
        }

        .wishlist-action-btn {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          padding: 9px 15px;
          border-radius: 10px;
          font-size: 0.84rem;
          font-weight: 700;
          cursor: pointer;
          border: none;
          transition: all 0.2s;
        }

        .wishlist-action-btn.primary {
          background: #c85a17;
          color: #ffffff;
          box-shadow: 0 2px 6px rgba(200, 90, 23, 0.25);
        }

        .wishlist-action-btn.primary:hover {
          background: #a24e23;
        }

        .wishlist-action-btn.whatsapp {
          background: #16a34a;
          color: #ffffff;
          box-shadow: 0 2px 6px rgba(22, 163, 74, 0.25);
        }

        .wishlist-action-btn.whatsapp:hover {
          background: #15803d;
        }

        .wishlist-action-btn.outline {
          background: #ffffff;
          border: 1px solid #cbd5e1;
          color: #64748b;
        }

        .wishlist-action-btn.outline:hover {
          background: #fee2e2;
          color: #dc2626;
          border-color: #fca5a5;
        }

        .wishlist-bottom-banner {
          margin-top: 36px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 16px;
          padding: 22px 28px;
          gap: 20px;
          flex-wrap: wrap;
        }

        .bottom-banner-content {
          display: flex;
          align-items: center;
          gap: 16px;
          flex: 1;
        }

        .bottom-banner-content .shield-icon {
          color: #c85a17;
          flex-shrink: 0;
        }

        .bottom-banner-content h4 {
          font-size: 1rem;
          font-weight: 800;
          color: #1e293b;
          margin-bottom: 4px;
        }

        .bottom-banner-content p {
          font-size: 0.84rem;
          color: #64748b;
          margin: 0;
        }

        /* EMPTY STATE */
        .wishlist-empty-card {
          background: #ffffff;
          border: 1px dashed #cbd5e1;
          border-radius: 20px;
          padding: 50px 24px;
          text-align: center;
          max-width: 760px;
          margin: 30px auto;
          box-shadow: 0 4px 14px rgba(0, 0, 0, 0.03);
        }

        .empty-heart-circle {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background: #ffe4e6;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 20px;
        }

        .wishlist-empty-card h2 {
          font-size: 1.5rem;
          font-weight: 800;
          color: #1e293b;
          margin-bottom: 10px;
        }

        .wishlist-empty-card p {
          font-size: 0.92rem;
          color: #64748b;
          max-width: 520px;
          margin: 0 auto 28px;
          line-height: 1.5;
        }

        .empty-explore-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
          margin-bottom: 28px;
          text-align: left;
        }

        .empty-cat-btn {
          background: #f8fafc;
          border: 1.5px solid #e2e8f0;
          border-radius: 14px;
          padding: 16px;
          cursor: pointer;
          display: flex;
          flex-direction: column;
          gap: 4px;
          transition: all 0.2s;
        }

        .empty-cat-btn:hover {
          border-color: #c85a17;
          background: #fff8f4;
          transform: translateY(-2px);
        }

        .empty-cat-btn .cat-emoji {
          font-size: 1.6rem;
          margin-bottom: 4px;
        }

        .empty-cat-btn strong {
          font-size: 0.92rem;
          color: #1e293b;
        }

        .empty-cat-btn small {
          font-size: 0.78rem;
          color: #64748b;
        }

        .empty-cat-btn.offer:hover {
          border-color: #ef4444;
          background: #fef2f2;
        }

        .start-shopping-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 12px 28px;
          font-size: 0.95rem;
          border-radius: 12px;
        }

        @media (max-width: 800px) {
          .wishlist-toolbar {
            flex-direction: column;
            align-items: stretch;
            padding: 14px;
            gap: 12px;
          }
          .wishlist-toolbar-actions {
            width: 100%;
            justify-content: stretch;
          }
          .wishlist-action-btn {
            flex: 1;
            justify-content: center;
            font-size: 0.78rem;
            padding: 8px 10px;
          }
          .empty-explore-grid {
            grid-template-columns: 1fr;
          }
          .bottom-banner-content {
            flex-direction: column;
            align-items: flex-start;
          }
        }
      `}</style>
    </div>
  );
}
