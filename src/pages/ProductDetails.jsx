import React, { useState } from 'react';
import { 
  ArrowLeft, Star, ShoppingBag, MessageCircle, Heart, 
  Truck, ShieldCheck, RefreshCw, CheckCircle2, MapPin, 
  CreditCard, Share2, Info 
} from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { subscribeToStoreSettings, DEFAULT_STORE_CONFIG } from '../services/settingsService';

export default function ProductDetails({ 
  product, 
  onBack, 
  onAddToCart, 
  onSelectProduct,
  isWishlisted = false, 
  onToggleWishlist,
  cartItem,
  onUpdateQuantity,
  onRemoveFromCart,
  onOpenCart,
  products = []
}) {
  if (!product) return null;

  const {
    id,
    name,
    category,
    price,
    originalPrice,
    discount,
    rating = product.rating || null,
    reviewsCount = product.reviewsCount || product.reviews || 0,
    badge,
    image,
    description,
    features = [],
    specifications = {},
    modelNumber = '',
    additionalInformation = []
  } = product;

  // Extract all available gallery images added by user / catalog
  const primaryImg = product.image || product.imageUrl || '';
  const rawList = Array.isArray(product.gallery) && product.gallery.length > 0
    ? product.gallery
    : (Array.isArray(product.images) && product.images.length > 0
        ? product.images
        : [primaryImg]);
  
  const allGalleryImages = Array.from(new Set([primaryImg, ...rawList].filter(Boolean)));
  const gallery = allGalleryImages.length > 0 ? allGalleryImages : [primaryImg].filter(Boolean);

  const [activeImage, setActiveImage] = useState(gallery[0] || primaryImg);

  React.useEffect(() => {
    setActiveImage(gallery[0] || primaryImg);
  }, [product?.id, primaryImg]);

  const [localAddedQty, setLocalAddedQty] = useState(0);
  const [pincode, setPincode] = useState('');
  const [deliveryStatus, setDeliveryStatus] = useState(null);
  const [showDiscount, setShowDiscount] = useState(() => {
    return Boolean(DEFAULT_STORE_CONFIG.showDiscountPercentage);
  });

  React.useEffect(() => {
    const unsub = subscribeToStoreSettings((settings) => {
      if (settings && typeof settings.showDiscountPercentage !== 'undefined') {
        setShowDiscount(Boolean(settings.showDiscountPercentage));
      }
    });
    return () => unsub();
  }, []);

  // Sync with cart item quantity
  const currentQty = cartItem ? cartItem.quantity : localAddedQty;

  const handleAddInitialToCart = () => {
    if (onAddToCart) {
      onAddToCart(product, 1);
    }
    setLocalAddedQty(1);
  };

  const handleIncreaseQty = () => {
    const nextQty = currentQty + 1;
    if (onUpdateQuantity && cartItem) {
      onUpdateQuantity(product.id, nextQty);
    } else if (onAddToCart) {
      onAddToCart(product, 1);
    }
    setLocalAddedQty(nextQty);
  };

  const handleDecreaseQty = () => {
    if (currentQty > 1) {
      const nextQty = currentQty - 1;
      if (onUpdateQuantity && cartItem) {
        onUpdateQuantity(product.id, nextQty);
      }
      setLocalAddedQty(nextQty);
    } else {
      if (onRemoveFromCart && cartItem) {
        onRemoveFromCart(product.id);
      }
      setLocalAddedQty(0);
    }
  };

  const formatPrice = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);
  };

  const handlePincodeCheck = (e) => {
    e.preventDefault();
    if (pincode.trim().length === 6) {
      setDeliveryStatus({
        success: true,
        text: `Free Delivery & Professional Installation Available by Tomorrow to PIN ${pincode}!`
      });
    } else {
      setDeliveryStatus({
        success: false,
        text: 'Please enter a valid 6-digit Indian Postal Pincode.'
      });
    }
  };

  const handleWhatsAppChat = () => {
    const msg = encodeURIComponent(
      `Hello Sardar Mart Furniture and Home Appliances Team! I am looking at "${name}" (ID: ${id}) priced at ${formatPrice(price)}. Can you please share showroom availability, fabric swatches / color options, and delivery timeline?`
    );
    window.open(`https://wa.me/916383056338?text=${msg}`, '_blank');
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${name} | Sardar Mart Furniture and Home Appliances`,
        text: `Check out ${name} at Sardar Mart Furniture and Home Appliances:`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Product link copied to clipboard!');
    }
  };

  // Check if current item is a refrigerator or belongs to appliances category
  const isRefrigerator = 
    (category && (category.toLowerCase() === 'refrigerator' || category.toLowerCase() === 'appliances' || category.toLowerCase() === 'home-appliances')) ||
    (product.subcategory && (product.subcategory.toLowerCase().includes('refrig') || product.subcategory.toLowerCase().includes('fridge'))) ||
    (name && (name.toLowerCase().includes('refrigerator') || name.toLowerCase().includes('fridge')));

  // Related products: when viewing refrigerator, show all products related to refrigerator category; if no product, do not display anything
  const relatedProducts = React.useMemo(() => {
    if (!Array.isArray(products) || products.length === 0) return [];

    if (isRefrigerator) {
      return products.filter((p) => {
        if (!p || p.id === id) return false;
        const pSub = (p.subcategory || '').toLowerCase();
        const pCat = (p.category || '').toLowerCase();
        const pName = (p.name || p.title || '').toLowerCase();
        return (
          pSub === 'refrigerator' ||
          pSub.includes('refrig') ||
          pSub.includes('fridge') ||
          pCat === 'refrigerator' ||
          pName.includes('refrigerator') ||
          pName.includes('fridge')
        );
      });
    }

    // For other categories, show matching subcategory / category items
    return products.filter((p) => {
      if (!p || p.id === id) return false;
      if (product.subcategory && p.subcategory && p.subcategory.toLowerCase() === product.subcategory.toLowerCase()) {
        return true;
      }
      return p.category && p.category.toLowerCase() === (category || '').toLowerCase();
    }).slice(0, 4);
  }, [products, id, category, product.subcategory, name, isRefrigerator]);

  return (
    <div className="product-details-page">
      <div className="container">
        {/* Breadcrumb and Back */}
        <div className="breadcrumb-nav">
          <button className="back-btn" onClick={onBack}>
            <ArrowLeft size={16} /> Back to Catalog
          </button>
          <span className="crumb-sep">/</span>
          <span className="crumb-link" onClick={onBack}>{category.toUpperCase()}</span>
          <span className="crumb-sep">/</span>
          <span className="crumb-current">{name}</span>
        </div>

        {/* Main Details Grid */}
        <div className="details-main-grid">
          {/* Left Column: Image Gallery */}
          <div className="gallery-column">
            <div className="main-display-box">
              <img 
                src={activeImage || 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80'} 
                alt={name} 
                className="active-hero-img" 
                decoding="async"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80';
                }}
              />
              {badge && <span className="detail-badge">{badge}</span>}
              {discount > 0 && showDiscount && <span className="detail-discount">{discount}% OFF</span>}
              <button 
                className={`detail-wish-btn ${isWishlisted ? 'active' : ''}`}
                onClick={() => onToggleWishlist(product)}
                title={isWishlisted ? "Remove from wishlist" : "Save to wishlist"}
              >
                <Heart size={20} fill={isWishlisted ? "#e11d48" : "none"} color={isWishlisted ? "#e11d48" : "#4a3328"} />
              </button>
            </div>

            {/* Thumbnail switcher */}
            {gallery.length > 1 && (
              <div className="thumbnails-strip">
                {gallery.map((imgUrl, idx) => (
                  <button 
                    key={idx}
                    className={`thumb-btn ${activeImage === imgUrl ? 'selected' : ''}`}
                    onClick={() => setActiveImage(imgUrl)}
                  >
                    <img src={imgUrl} alt={`Thumbnail ${idx + 1}`} />
                  </button>
                ))}
              </div>
            )}

            {/* Value Trust Assurances */}
            <div className="details-trust-box">
              <div className="trust-row">
                <Truck size={20} className="trust-icon" />
                <div>
                  <strong>Free Home Delivery &amp; Assembly</strong>
                  <span>White-glove unboxing and room-of-choice setup</span>
                </div>
              </div>
              <div className="trust-row">
                <ShieldCheck size={20} className="trust-icon" />
                <div>
                  <strong>Genuine Manufacturer Warranty</strong>
                  <span>Direct brand support with original GST invoice</span>
                </div>
              </div>
              <div className="trust-row">
                <CreditCard size={20} className="trust-icon" />
                <div>
                  <strong>No-Cost EMI from ₹{Math.round(price / 6).toLocaleString('en-IN')}/mo</strong>
                  <span>Zero down-payment on leading bank credit/debit cards</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Product Info & Actions */}
          <div className="info-column">
            <div className="title-share-row">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <span className="sku-tag">SKU: {id.toUpperCase()}</span>
                {modelNumber && (
                  <span className="model-badge-tag" style={{
                    background: '#fdf6ed',
                    color: '#854d0e',
                    border: '1px solid #ead6c5',
                    padding: '2px 9px',
                    borderRadius: '6px',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    letterSpacing: '0.02em'
                  }}>
                    Model: {modelNumber}
                  </span>
                )}
              </div>
              <button className="share-btn" onClick={handleShare} title="Share product">
                <Share2 size={16} /> Share
              </button>
            </div>

            <h1 className="detail-product-title">{name}</h1>

            {/* Rating pill */}
            <div className="detail-rating-row">
              {rating ? (
                <>
                  <div className="star-rating-box">
                    <Star size={15} fill="#f59e0b" color="#f59e0b" />
                    <span>{rating}</span>
                  </div>
                  {reviewsCount > 0 && (
                    <span className="rating-count">({reviewsCount} customer reviews)</span>
                  )}
                  <span className="dot-sep">•</span>
                </>
              ) : null}
              <span className="in-stock-tag">
                <CheckCircle2 size={14} /> In Stock (Ready for Dispatch)
              </span>
            </div>

            {/* Price block */}
            <div className="detail-price-card">
              <div className="price-top">
                <span className="big-price">{formatPrice(price)}</span>
                {originalPrice && originalPrice > price && (
                  <span className="big-mrp">{formatPrice(originalPrice)}</span>
                )}
                {discount > 0 && showDiscount && (
                  <span className="save-tag">You Save {discount}%</span>
                )}
              </div>
              <span className="tax-inclusive-text">Inclusive of all taxes &amp; standard GST invoice</span>
            </div>

            {/* Description */}
            <p className="detail-description">{description}</p>

            {/* Key Features list */}
            {features.length > 0 && (
              <div className="features-bullet-list">
                <h4>Key Product Features:</h4>
                <ul>
                  {(() => {
                    const dedicatedFeatures = features.filter(f => f && (f.type === 'feature' || typeof f === 'string'));
                    const listToDisplay = dedicatedFeatures.length > 0 ? dedicatedFeatures : features;
                    return listToDisplay.map((feat, i) => {
                      const isString = typeof feat === 'string';
                      const name = isString ? '' : (feat.name || '');
                      const val = isString ? feat : (feat.value || '');
                      if (!name && !val) return null;
                      return (
                        <li key={i}>
                          <span className="check-bullet">✓</span>{' '}
                          {name && name.toLowerCase() !== 'feature' ? (
                            <span><strong>{name}</strong>: {val}</span>
                          ) : (
                            <span>{val || name}</span>
                          )}
                        </li>
                      );
                    });
                  })()}
                </ul>
              </div>
            )}

            {/* Quantity and Actions */}
            <div className="purchase-action-container">
              {currentQty === 0 ? (
                /* Initial State: ONLY Add to Cart button is shown (Quantity is hidden) */
                <div className="buttons-stack">
                  <button 
                    className="btn-primary add-cart-big"
                    onClick={handleAddInitialToCart}
                  >
                    <ShoppingBag size={20} /> Add to Cart • {formatPrice(price)}
                  </button>

                  <button 
                    className="btn-whatsapp wa-big-btn"
                    onClick={handleWhatsAppChat}
                  >
                    <MessageCircle size={20} /> Enquire on WhatsApp
                  </button>
                </div>
              ) : (
                /* When clicked Add to Cart: ONLY THEN show Quantity 1 or many */
                <div className="added-cart-active-flow animate-fade-in">
                  <div className="cart-success-badge-row">
                    <span className="cart-added-pill">✓ Added to Cart</span>
                    <span className="cart-item-total">
                      Subtotal: <strong>{formatPrice(price * currentQty)}</strong>
                    </span>
                  </div>

                  <div className="quantity-wrapper active-qty-wrapper">
                    <span className="qty-label">Quantity:</span>
                    <div className="qty-counter active-counter">
                      <button 
                        onClick={handleDecreaseQty}
                        aria-label="Decrease quantity"
                        title={currentQty === 1 ? "Remove from cart" : "Decrease quantity"}
                      >
                        -
                      </button>
                      <span className="qty-val">{currentQty}</span>
                      <button 
                        onClick={handleIncreaseQty}
                        aria-label="Increase quantity"
                        title="Increase quantity"
                      >
                        +
                      </button>
                    </div>
                    <span className="qty-status-note">
                      {currentQty === 1 ? '1 item' : `${currentQty} items`}
                    </span>
                  </div>

                  <div className="buttons-stack">
                    <button 
                      className="btn-primary view-cart-big"
                      onClick={() => onOpenCart && onOpenCart()}
                    >
                      <ShoppingBag size={20} /> View in Cart • {formatPrice(price * currentQty)}
                    </button>

                    <button 
                      className="btn-whatsapp wa-big-btn"
                      onClick={handleWhatsAppChat}
                    >
                      <MessageCircle size={20} /> Enquire on WhatsApp
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Pincode delivery check */}
            <div className="pincode-check-card">
              <div className="pincode-header">
                <MapPin size={18} className="pin-icon" />
                <strong>Check Delivery &amp; Showroom Availability</strong>
              </div>
              <form onSubmit={handlePincodeCheck} className="pincode-form">
                <input 
                  type="text" 
                  placeholder="Enter 6-digit Pincode (e.g. 600001)"
                  maxLength={6}
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
                  className="pincode-input"
                />
                <button type="submit" className="pincode-check-btn">Check</button>
              </form>
              {deliveryStatus && (
                <div className={`delivery-alert ${deliveryStatus.success ? 'success' : 'error'}`}>
                  {deliveryStatus.text}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Specifications Table */}
        <div className="specifications-section">
          <h3 className="section-title">Complete Technical Specifications</h3>
          <div className="specs-table-wrapper">
            <table className="specs-table">
              <tbody>
                {modelNumber && (
                  <tr className="even-row">
                    <td className="spec-key"><strong>Model Number</strong></td>
                    <td className="spec-val"><strong style={{ color: '#78350f' }}>{modelNumber}</strong></td>
                  </tr>
                )}
                {/* Dynamic Features / Model Specifications array */}
                {Array.isArray(features) && features
                  .filter(feat => feat && typeof feat === 'object' && feat.name && (feat.type !== 'feature' || !features.some(f => f && f.type === 'spec')))
                  .map((feat, idx) => {
                    return (
                      <tr key={`feat-${idx}`} className={(idx + (modelNumber ? 1 : 0)) % 2 === 0 ? 'even-row' : ''}>
                        <td className="spec-key">{feat.name}</td>
                        <td className="spec-val">{feat.value || 'Yes'}</td>
                      </tr>
                    );
                  })}
                {/* Legacy specifications object */}
                {specifications && typeof specifications === 'object' && !Array.isArray(specifications) && Object.entries(specifications).map(([key, value], idx) => (
                  <tr key={`spec-${idx}`} className={idx % 2 === 0 ? 'even-row' : ''}>
                    <td className="spec-key">{key}</td>
                    <td className="spec-val">{value}</td>
                  </tr>
                ))}
                <tr>
                  <td className="spec-key">Catalog Item SKU</td>
                  <td className="spec-val">{id.toUpperCase()}</td>
                </tr>
                <tr>
                  <td className="spec-key">In-Box Contents</td>
                  <td className="spec-val">Main Unit, User Manual, Official Warranty Card &amp; Installation Hardware</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Custom Fields Section */}
        {Array.isArray(additionalInformation) && additionalInformation.filter(item => item && item.name && item.name.trim()).length > 0 && (
          <div className="specifications-section additional-info-section" style={{ marginTop: '30px' }}>
            <h3 className="section-title">Custom Fields &amp; Additional Specifications</h3>
            <div className="specs-table-wrapper">
              <table className="specs-table">
                <tbody>
                  {additionalInformation.filter(item => item && item.name && item.name.trim()).map((item, idx) => (
                    <tr key={idx} className={idx % 2 === 0 ? 'even-row' : ''}>
                      <td className="spec-key">{item.name}</td>
                      <td className="spec-val">{item.value || 'Included / Standard'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Related Products: If no products, do not display anything */}
        {relatedProducts && relatedProducts.length > 0 ? (
          <div className="related-section">
            <h3 className="section-title">
              {isRefrigerator 
                ? "Related Products in Refrigerator Category" 
                : "Frequently Bought Together & Similar Items"}
            </h3>
            <div className="related-grid">
              {relatedProducts.map(prod => (
                <ProductCard
                  key={prod.id}
                  product={prod}
                  onSelectProduct={onSelectProduct}
                  onAddToCart={onAddToCart}
                  isWishlisted={false}
                  onToggleWishlist={onToggleWishlist}
                />
              ))}
            </div>
          </div>
        ) : null}
      </div>

      <style>{`
        .product-details-page {
          padding: 24px 0 60px;
        }

        .breadcrumb-nav {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 24px;
          font-size: 0.85rem;
          color: var(--color-text-muted);
          flex-wrap: wrap;
        }
        .back-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-weight: 700;
          color: var(--color-primary);
          background: #ffffff;
          padding: 6px 14px;
          border-radius: var(--radius-full);
          border: 1px solid var(--color-border);
        }
        .back-btn:hover {
          background: var(--color-primary-light);
        }
        .crumb-sep {
          color: #d1b8a7;
        }
        .crumb-link {
          cursor: pointer;
          font-weight: 600;
        }
        .crumb-link:hover {
          color: var(--color-primary);
        }
        .crumb-current {
          color: var(--color-text-main);
          font-weight: 700;
        }

        /* Main Details Grid */
        .details-main-grid {
          display: grid;
          grid-template-columns: 1fr 1.1fr;
          gap: 40px;
          margin-bottom: 50px;
          background: #ffffff;
          padding: 36px;
          border-radius: var(--radius-xl);
          border: 1px solid var(--color-border);
          box-shadow: var(--shadow-sm);
        }

        /* Gallery */
        .gallery-column {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .main-display-box {
          position: relative;
          width: 100%;
          height: 420px;
          border-radius: var(--radius-lg);
          background: #fbf8f4;
          overflow: hidden;
          border: 1px solid var(--color-border);
        }
        .active-hero-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.4s ease;
        }
        .detail-badge {
          position: absolute;
          top: 14px;
          left: 14px;
          background: var(--color-warm-dark);
          color: #ffffff;
          font-size: 0.75rem;
          font-weight: 700;
          padding: 4px 10px;
          border-radius: 4px;
        }
        .detail-discount {
          position: absolute;
          top: 14px;
          left: 100px;
          background: #dc2626;
          color: #ffffff;
          font-size: 0.75rem;
          font-weight: 800;
          padding: 4px 10px;
          border-radius: 4px;
        }
        .detail-wish-btn {
          position: absolute;
          top: 14px;
          right: 14px;
          width: 42px;
          height: 42px;
          border-radius: 50%;
          background: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: var(--shadow-md);
        }
        .detail-wish-btn:hover {
          transform: scale(1.1);
        }

        .thumbnails-strip {
          display: flex;
          gap: 12px;
          overflow-x: auto;
          padding-bottom: 6px;
        }
        .thumb-btn {
          width: 80px;
          height: 70px;
          border-radius: var(--radius-md);
          overflow: hidden;
          border: 2px solid #ecd8cb;
          background: #ffffff;
          flex-shrink: 0;
          opacity: 0.7;
          transition: all var(--transition-fast);
        }
        .thumb-btn.selected {
          border-color: var(--color-primary);
          opacity: 1;
          box-shadow: 0 0 0 2px rgba(162, 78, 35, 0.2);
        }
        .thumb-btn img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .details-trust-box {
          background: #faf6f1;
          border-radius: var(--radius-md);
          padding: 18px;
          border: 1px solid var(--color-border);
          display: flex;
          flex-direction: column;
          gap: 14px;
          margin-top: 10px;
        }
        .trust-row {
          display: flex;
          align-items: flex-start;
          gap: 12px;
        }
        .trust-icon {
          color: var(--color-primary);
          flex-shrink: 0;
          margin-top: 2px;
        }
        .trust-row div {
          display: flex;
          flex-direction: column;
        }
        .trust-row strong {
          font-size: 0.88rem;
          color: var(--color-text-main);
        }
        .trust-row span {
          font-size: 0.78rem;
          color: var(--color-text-muted);
        }

        /* Right Column */
        .info-column {
          display: flex;
          flex-direction: column;
        }
        .title-share-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 10px;
        }
        .sku-tag {
          font-size: 0.75rem;
          font-weight: 700;
          color: var(--color-text-light);
          letter-spacing: 1px;
        }
        .share-btn {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          font-size: 0.8rem;
          color: var(--color-text-muted);
          font-weight: 600;
        }
        .share-btn:hover {
          color: var(--color-primary);
        }

        .detail-product-title {
          font-size: 2rem;
          font-weight: 800;
          color: var(--color-text-main);
          line-height: 1.25;
          margin-bottom: 12px;
        }

        .detail-rating-row {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 20px;
          flex-wrap: wrap;
        }
        .star-rating-box {
          background: #fef08a;
          color: #854d0e;
          font-size: 0.82rem;
          font-weight: 800;
          padding: 2px 8px;
          border-radius: 4px;
          display: inline-flex;
          align-items: center;
          gap: 4px;
        }
        .rating-count {
          font-size: 0.84rem;
          color: var(--color-text-muted);
        }
        .dot-sep {
          color: #cbb8ac;
        }
        .in-stock-tag {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          color: #15803d;
          font-size: 0.82rem;
          font-weight: 700;
        }

        .detail-price-card {
          background: #fdfaf6;
          border: 1.5px dashed #e8dcd2;
          padding: 16px 20px;
          border-radius: var(--radius-lg);
          margin-bottom: 20px;
        }
        .price-top {
          display: flex;
          align-items: baseline;
          gap: 14px;
          margin-bottom: 4px;
        }
        .big-price {
          font-family: var(--font-heading);
          font-size: 2.1rem;
          font-weight: 800;
          color: var(--color-primary);
        }
        .big-mrp {
          font-size: 1.15rem;
          text-decoration: line-through;
          color: #a89487;
        }
        .save-tag {
          background: #f0fdf4;
          color: #166534;
          border: 1px solid #bbf7d0;
          padding: 3px 8px;
          border-radius: 4px;
          font-size: 0.82rem;
          font-weight: 700;
        }
        .tax-inclusive-text {
          font-size: 0.78rem;
          color: var(--color-text-light);
        }

        .detail-description {
          font-size: 0.95rem;
          line-height: 1.6;
          color: var(--color-text-muted);
          margin-bottom: 20px;
        }

        .features-bullet-list {
          margin-bottom: 26px;
        }
        .features-bullet-list h4 {
          font-size: 0.95rem;
          margin-bottom: 10px;
        }
        .features-bullet-list ul {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .features-bullet-list li {
          font-size: 0.88rem;
          color: var(--color-text-main);
          display: flex;
          align-items: flex-start;
          gap: 8px;
        }
        .check-bullet {
          color: var(--color-success);
          font-weight: 800;
        }

        /* Purchase Action */
        .purchase-action-container {
          display: flex;
          flex-direction: column;
          gap: 16px;
          margin-bottom: 24px;
        }
        .quantity-wrapper {
          display: flex;
          align-items: center;
          gap: 14px;
        }
        .qty-label {
          font-size: 0.9rem;
          font-weight: 700;
        }
        .qty-counter {
          display: flex;
          align-items: center;
          border: 1px solid var(--color-border);
          border-radius: var(--radius-md);
          background: #ffffff;
        }
        .qty-counter button {
          width: 36px;
          height: 36px;
          font-size: 1.1rem;
          font-weight: 700;
          color: var(--color-text-main);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .qty-counter button:hover {
          background: #f4eee5;
        }
        .qty-counter span {
          width: 40px;
          text-align: center;
          font-weight: 700;
        }

        .buttons-stack {
          display: flex;
          gap: 12px;
        }
        .add-cart-big {
          flex: 1.4;
          padding: 13px 20px;
          font-size: 1rem;
        }
        .view-cart-big {
          flex: 1.4;
          padding: 13px 20px;
          font-size: 1rem;
          background: #15803d;
          box-shadow: 0 4px 14px rgba(21, 128, 61, 0.3);
        }
        .view-cart-big:hover {
          background: #166534;
        }
        .wa-big-btn {
          flex: 1;
          padding: 13px 18px;
          font-size: 0.95rem;
        }

        /* Active In-Cart Quantity Flow */
        .added-cart-active-flow {
          display: flex;
          flex-direction: column;
          gap: 12px;
          background: #fbf8f5;
          border: 1.5px solid #ecd8cb;
          border-radius: var(--radius-lg);
          padding: 16px;
        }
        .cart-success-badge-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-bottom: 8px;
          border-bottom: 1px dashed #e8dcd2;
        }
        .cart-added-pill {
          background: #f0fdf4;
          color: #15803d;
          font-size: 0.8rem;
          font-weight: 700;
          padding: 3px 10px;
          border-radius: var(--radius-full);
          border: 1px solid #bbf7d0;
          display: inline-flex;
          align-items: center;
          gap: 4px;
        }
        .cart-item-total {
          font-size: 0.88rem;
          color: var(--color-text-main);
        }
        .cart-item-total strong {
          color: var(--color-primary);
          font-size: 1rem;
        }
        .active-qty-wrapper {
          background: #ffffff;
          padding: 8px 14px;
          border-radius: var(--radius-md);
          border: 1px solid #ecd8cb;
          display: inline-flex;
          align-items: center;
          width: fit-content;
        }
        .active-counter {
          border: 1.5px solid var(--color-primary);
        }
        .active-counter button {
          background: #fff8f5;
          color: var(--color-primary);
        }
        .active-counter button:hover {
          background: var(--color-primary);
          color: #ffffff;
        }
        .qty-status-note {
          font-size: 0.82rem;
          font-weight: 600;
          color: var(--color-text-muted);
        }

        /* Pincode */
        .pincode-check-card {
          background: #fbf9f6;
          border: 1px solid var(--color-border);
          padding: 16px;
          border-radius: var(--radius-md);
        }
        .pincode-header {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.88rem;
          margin-bottom: 10px;
        }
        .pin-icon {
          color: var(--color-primary);
        }
        .pincode-form {
          display: flex;
          gap: 8px;
        }
        .pincode-input {
          flex: 1;
          border: 1px solid #d4c2b5;
          padding: 8px 14px;
          border-radius: var(--radius-md);
          outline: none;
        }
        .pincode-check-btn {
          background: var(--color-warm-dark);
          color: #ffffff;
          padding: 8px 18px;
          border-radius: var(--radius-md);
          font-weight: 700;
        }
        .delivery-alert {
          margin-top: 10px;
          padding: 8px 12px;
          border-radius: 6px;
          font-size: 0.82rem;
          font-weight: 600;
        }
        .delivery-alert.success {
          background: #f0fdf4;
          color: #166534;
          border: 1px solid #bbf7d0;
        }
        .delivery-alert.error {
          background: #fef2f2;
          color: #991b1b;
          border: 1px solid #fecaca;
        }

        /* Specifications */
        .specifications-section, .related-section {
          background: #ffffff;
          padding: 36px;
          border-radius: var(--radius-xl);
          border: 1px solid var(--color-border);
          margin-bottom: 40px;
        }
        .section-title {
          font-size: 1.4rem;
          margin-bottom: 22px;
          position: relative;
          padding-bottom: 8px;
        }
        .section-title::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 44px;
          height: 3px;
          background: var(--color-primary);
          border-radius: 2px;
        }

        .specs-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 0.9rem;
        }
        .specs-table tr {
          border-bottom: 1px solid #f0e6de;
        }
        .specs-table tr.even-row {
          background: #faf6f1;
        }
        .spec-key {
          width: 32%;
          padding: 12px 18px;
          font-weight: 700;
          color: var(--color-text-main);
        }
        .spec-val {
          padding: 12px 18px;
          color: var(--color-text-muted);
        }

        .related-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
        }

        @media (max-width: 900px) {
          .details-main-grid {
            grid-template-columns: 1fr;
            padding: 20px;
          }
          .main-display-box {
            height: 320px;
          }
          .buttons-stack {
            flex-direction: column;
          }
          .related-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 12px;
          }
        }
        @media (max-width: 600px) {
          .details-main-grid {
            padding: 14px;
            border-radius: var(--radius-lg);
          }
          .main-display-box {
            height: 240px;
          }
          .detail-product-title {
            font-size: 1.35rem;
          }
          .big-price {
            font-size: 1.55rem;
          }
          .thumb-btn {
            width: 62px;
            height: 52px;
          }
          .specifications-section, .related-section {
            padding: 18px 14px;
            border-radius: var(--radius-lg);
          }
          .specs-table {
            font-size: 0.8rem;
          }
          .spec-key {
            width: 40%;
            padding: 8px 10px;
          }
          .spec-val {
            padding: 8px 10px;
          }
          .related-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 10px;
          }
        }

        @media (max-width: 480px) {
          .breadcrumb-nav {
            overflow-x: auto;
            white-space: nowrap;
            font-size: 0.74rem;
            -webkit-overflow-scrolling: touch;
            scrollbar-width: none;
            padding-bottom: 4px;
          }
          .breadcrumb-nav::-webkit-scrollbar {
            display: none;
          }
          .detail-product-title {
            font-size: 1.2rem;
          }
          .big-price {
            font-size: 1.35rem;
          }
          .original-striked-price {
            font-size: 0.82rem;
          }
          .pincode-form {
            flex-direction: column;
            gap: 8px;
          }
          .pincode-check-btn {
            width: 100%;
          }
          .action-btn-whatsapp, .action-btn-cart {
            width: 100%;
            justify-content: center;
          }
          .spec-key {
            width: 45%;
            font-size: 0.76rem;
            padding: 6px 8px;
          }
          .spec-val {
            font-size: 0.76rem;
            padding: 6px 8px;
          }
        }
      `}</style>
    </div>
  );
}
