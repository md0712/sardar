import React from 'react';
import { X, Heart, ShoppingBag, Trash2 } from 'lucide-react';

export default function WishlistDrawer({ 
  isOpen, 
  onClose, 
  wishlist = [], 
  onRemoveWishlist, 
  onAddToCart,
  onSelectProduct 
}) {
  if (!isOpen) return null;

  const formatPrice = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);
  };

  return (
    <div className="cart-drawer-backdrop" onClick={onClose}>
      <div className="cart-drawer-panel" onClick={(e) => e.stopPropagation()}>
        <div className="drawer-header">
          <div className="drawer-title-box">
            <Heart size={20} color="#e11d48" fill="#e11d48" />
            <h3>Your Wishlist ({wishlist.length})</h3>
          </div>
          <button className="close-drawer-btn" onClick={onClose} aria-label="Close wishlist">
            <X size={20} />
          </button>
        </div>

        {wishlist.length > 0 ? (
          <div className="cart-scrollable-body">
            <div className="cart-items-list">
              {wishlist.map((item) => (
                <div key={item.id} className="cart-item-row">
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    className="cart-item-img"
                    onClick={() => { onSelectProduct(item); onClose(); }} 
                    style={{ cursor: 'pointer' }}
                  />
                  <div className="cart-item-details">
                    <h4 
                      className="cart-item-name"
                      onClick={() => { onSelectProduct(item); onClose(); }}
                      style={{ cursor: 'pointer' }}
                    >
                      {item.name}
                    </h4>
                    <span className="cart-item-price">{formatPrice(item.price)}</span>

                    <div className="cart-item-actions">
                      <button 
                        className="btn-primary"
                        style={{ padding: '6px 12px', fontSize: '0.8rem' }}
                        onClick={() => {
                          onAddToCart(item);
                          onRemoveWishlist(item.id);
                        }}
                      >
                        <ShoppingBag size={14} /> Move to Cart
                      </button>

                      <button 
                        className="remove-item-btn"
                        onClick={() => onRemoveWishlist(item.id)}
                        title="Remove from wishlist"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="empty-cart-state">
            <div className="empty-icon-circle">
              <Heart size={48} color="#9c887e" />
            </div>
            <h3>Your Wishlist is Empty</h3>
            <p>Save your favorite furniture sets &amp; appliances to review or inquire about them later.</p>
            <button className="btn-primary" onClick={onClose}>
              Explore Products
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
