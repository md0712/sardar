import React from 'react';
import { Home, Grid, Sparkles, Heart, ShoppingBag } from 'lucide-react';

export default function MobileBottomNav({
  currentPage,
  onNavigate,
  cartCount = 0,
  wishlistCount = 0,
  onOpenCart,
  onOpenWishlist,
  onOpenCategories
}) {
  return (
    <nav className="mobile-bottom-nav">
      <button 
        className={`mob-nav-btn ${currentPage === 'home' ? 'active' : ''}`}
        onClick={() => onNavigate('home')}
        aria-label="Home"
      >
        <Home size={20} />
        <span>Home</span>
      </button>

      <button 
        className={`mob-nav-btn ${currentPage === 'furniture' || currentPage === 'electronics' || currentPage === 'appliances' ? 'active' : ''}`}
        onClick={onOpenCategories || (() => onNavigate('furniture'))}
        aria-label="Categories"
      >
        <Grid size={20} />
        <span>Browse</span>
      </button>

      <button 
        className={`mob-nav-btn ${currentPage === 'offers' ? 'active' : ''}`}
        onClick={() => onNavigate('offers')}
        aria-label="Offers"
      >
        <div className="icon-with-micro-tag">
          <Sparkles size={20} className="sparkle-mob-icon" />
          <span className="mob-offer-dot"></span>
        </div>
        <span>Offers</span>
      </button>

      <button 
        className="mob-nav-btn"
        onClick={onOpenWishlist}
        aria-label="Wishlist"
      >
        <div className="icon-with-micro-tag">
          <Heart size={20} />
          {wishlistCount > 0 && <span className="mob-badge">{wishlistCount}</span>}
        </div>
        <span>Wishlist</span>
      </button>

      <button 
        className="mob-nav-btn"
        onClick={onOpenCart}
        aria-label="Cart"
      >
        <div className="icon-with-micro-tag">
          <ShoppingBag size={20} />
          {cartCount > 0 && <span className="mob-badge cart-accent">{cartCount}</span>}
        </div>
        <span>Cart</span>
      </button>

      <style>{`
        .mobile-bottom-nav {
          display: none;
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          width: 100%;
          max-width: 100vw;
          box-sizing: border-box;
          background: #ffffff;
          border-top: 1px solid var(--color-border);
          box-shadow: 0 -4px 18px rgba(42, 24, 16, 0.08);
          z-index: 950;
          padding: 6px 4px calc(6px + env(safe-area-inset-bottom, 0px));
          justify-content: space-around;
          align-items: center;
          overflow: hidden;
          touch-action: none;
          overscroll-behavior: none;
          user-select: none;
          -webkit-user-select: none;
        }

        .mob-nav-btn {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 3px;
          background: none;
          border: none;
          color: #785949;
          font-size: 0.68rem;
          font-weight: 600;
          padding: 4px 2px;
          border-radius: var(--radius-md);
          position: relative;
          transition: all var(--transition-fast);
          flex: 1;
          min-width: 0;
          max-width: 20%;
          touch-action: manipulation;
          -webkit-tap-highlight-color: transparent;
        }

        .mob-nav-btn span {
          display: block;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 100%;
          text-align: center;
          line-height: 1.1;
        }

        .mob-nav-btn:hover,
        .mob-nav-btn.active {
          color: var(--color-primary);
        }

        .mob-nav-btn.active span {
          font-weight: 800;
        }

        .icon-with-micro-tag {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .mob-badge {
          position: absolute;
          top: -6px;
          right: -10px;
          background: var(--color-primary);
          color: #ffffff;
          font-size: 0.65rem;
          font-weight: 800;
          width: 17px;
          height: 17px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1.5px solid #ffffff;
        }

        .mob-badge.cart-accent {
          background: #b45309;
        }

        .sparkle-mob-icon {
          color: #ea580c;
        }

        .mob-offer-dot {
          position: absolute;
          top: -2px;
          right: -4px;
          width: 6px;
          height: 6px;
          background: #dc2626;
          border-radius: 50%;
        }

        @media (max-width: 768px) {
          .mobile-bottom-nav {
            display: flex;
            width: 100% !important;
            max-width: 100vw !important;
            left: 0 !important;
            right: 0 !important;
          }
        }
      `}</style>
    </nav>
  );
}
