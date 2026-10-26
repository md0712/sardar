import React, { useState, useEffect } from 'react';
import { 
  X, ShoppingBag, Trash2, ArrowRight, MessageCircle, 
  CreditCard, Check, Tag, ShieldCheck, Truck, ArrowLeft, 
  FileText, Package, MapPin, Phone, User 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function CartDrawer({ 
  isOpen, 
  onClose, 
  cartItems = [], 
  onUpdateQuantity, 
  onRemoveItem, 
  onClearCart,
  onPlaceOrder,
  onViewInvoice,
  onNavigate,
  products = [],
  promoCodes = []
}) {
  const { currentUser, userProfile } = useAuth();
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState('');
  const [checkoutStep, setCheckoutStep] = useState('cart'); // 'cart' | 'billing' | 'success'
  const [lastPlacedOrder, setLastPlacedOrder] = useState(null);

  // Billing Form State
  const [billingForm, setBillingForm] = useState({
    name: '',
    phone: '',
    address: '',
    city: 'Chennai',
    pincode: '600001',
    paymentMethod: 'UPI (GPay / PhonePe)'
  });

  // Pre-fill authenticated customer details
  useEffect(() => {
    if (currentUser) {
      setBillingForm((prev) => ({
        ...prev,
        name: prev.name || userProfile?.name || currentUser.displayName || '',
        phone: prev.phone || userProfile?.phone || ''
      }));
    }
  }, [currentUser, userProfile]);

  if (!isOpen) return null;

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  const matchedPromo = promoCodes.find(
    (p) => p.code?.toUpperCase() === appliedCoupon?.toUpperCase() && p.status !== 'inactive'
  );

  let discountAmount = 0;
  if (matchedPromo) {
    if (!matchedPromo.minOrderAmount || subtotal >= matchedPromo.minOrderAmount) {
      const calcDiscount = Math.round(subtotal * (Number(matchedPromo.discountPercentage) / 100));
      discountAmount = (matchedPromo.maxDiscountAmount && matchedPromo.maxDiscountAmount > 0)
        ? Math.min(calcDiscount, Number(matchedPromo.maxDiscountAmount))
        : calcDiscount;
    }
  }

  const finalTotal = Math.max(0, subtotal - discountAmount);

  const formatPrice = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val || 0);
  };

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    const clean = couponCode.trim().toUpperCase();
    if (!clean) return;

    const promo = promoCodes.find(
      (p) => p.code?.toUpperCase() === clean && p.status !== 'inactive'
    );

    if (!promo) {
      setCouponError(`Invalid or inactive promo code: "${clean}".`);
      setAppliedCoupon(null);
      return;
    }

    if (promo.minOrderAmount && subtotal < promo.minOrderAmount) {
      setCouponError(`Code "${promo.code}" requires minimum cart value of ₹${Number(promo.minOrderAmount).toLocaleString('en-IN')}.`);
      setAppliedCoupon(null);
      return;
    }

    setAppliedCoupon(promo.code);
    setCouponError('');
  };

  const handleWhatsAppCheckout = () => {
    const itemsList = cartItems
      .map((item) => `• ${item.name} (Qty: ${item.quantity}) - ${formatPrice(item.price * item.quantity)}`)
      .join('%0A');

    const message = encodeURIComponent(
      `Hello Sardar Mart Furniture and Home Appliances, I want to confirm my order enquiry:%0A%0A${itemsList}%0A%0ASubtotal: ${formatPrice(subtotal)}%0ADiscount: ${formatPrice(discountAmount)}%0ANet Total: ${formatPrice(finalTotal)}%0A%0APlease provide delivery schedule and invoice confirmation.`
    );

    window.open(`https://wa.me/916383056338?text=${message}`, '_blank');
  };

  const handleProceedToBilling = () => {
    setCheckoutStep('billing');
  };

  const handleBillingSubmit = (e) => {
    e.preventDefault();
    if (!billingForm.name || !billingForm.phone || !billingForm.address) {
      alert('Please fill in your name, contact phone number, and delivery address.');
      return;
    }

    const orderId = `SEF-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const now = new Date();
    const formattedDate = now.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    }) + ', ' + now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

    const newOrder = {
      id: orderId,
      date: formattedDate,
      customerUid: currentUser?.uid || 'guest',
      customerEmail: currentUser?.email || '',
      customer: {
        name: billingForm.name,
        phone: billingForm.phone,
        address: billingForm.address,
        city: billingForm.city,
        pincode: billingForm.pincode
      },
      items: cartItems.map(item => {
        const backendProduct = products.find(p => String(p.id) === String(item.id));
        return {
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: backendProduct?.image || item.image || '',
          category: item.category || backendProduct?.category || 'furniture'
        };
      }),
      subtotal,
      discount: discountAmount,
      delivery: 0,
      total: finalTotal,
      paymentMethod: billingForm.paymentMethod,
      paymentStatus: billingForm.paymentMethod.includes('COD') || billingForm.paymentMethod.includes('Cash') ? 'Pending (COD)' : 'Paid Online',
      status: 'Order Placed',
      courier: 'Porter Platform Logistics',
      trackingNumber: `EXP-CH-${Math.floor(10000 + Math.random() * 90000)}`
    };

    setLastPlacedOrder(newOrder);
    if (onPlaceOrder) onPlaceOrder(newOrder);
    if (onClearCart) onClearCart();
    setCheckoutStep('success');
  };

  return (
    <div className="cart-drawer-backdrop" onClick={onClose}>
      <div className="cart-drawer-panel" onClick={(e) => e.stopPropagation()}>
        {/* Drawer Header */}
        <div className="drawer-header">
          <div className="drawer-title-group">
            <ShoppingBag size={22} className="cart-header-icon" />
            <div>
              <h2>
                {checkoutStep === 'cart' && `Your Shopping Cart (${cartItems.reduce((acc, i) => acc + i.quantity, 0)})`}
                {checkoutStep === 'billing' && 'Billing & Delivery Details'}
                {checkoutStep === 'success' && 'Order Placed Successfully!'}
              </h2>
              <span className="drawer-subtitle">
                {checkoutStep === 'cart' && 'Doorstep Delivery & Installation Across India'}
                {checkoutStep === 'billing' && 'Generate Tax Invoice & Live Dispatch Status'}
                {checkoutStep === 'success' && 'Your order is booked & being prepared for delivery'}
              </span>
            </div>
          </div>
          <button className="drawer-close-btn" onClick={onClose} aria-label="Close cart">
            <X size={20} />
          </button>
        </div>

        {/* STEP 1: CART ITEMS VIEW */}
        {checkoutStep === 'cart' && (
          <>
            {cartItems.length > 0 ? (
              <div className="drawer-content-scrollable">
                <div className="cart-items-list">
                  {cartItems.map((item) => (
                    <div key={item.id} className="cart-item-row animate-fade-in">
                      <div className="cart-item-thumb-box">
                        <img src={item.image} alt={item.name} className="cart-item-img" />
                      </div>

                      <div className="cart-item-info">
                        <span className="cart-item-cat">{item.category?.toUpperCase()}</span>
                        <h4 className="cart-item-title">{item.name}</h4>

                        <div className="cart-item-pricing">
                          <span className="item-unit-price">{formatPrice(item.price)}</span>
                          <span className="item-subtotal-val">Total: {formatPrice(item.price * item.quantity)}</span>
                        </div>

                        <div className="cart-item-actions">
                          <div className="cart-qty-counter">
                            <button onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}>-</button>
                            <span>{item.quantity}</span>
                            <button onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}>+</button>
                          </div>

                          <button 
                            className="remove-item-btn"
                            onClick={() => onRemoveItem(item.id)}
                            title="Remove item"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Coupon Code Section */}
                <div className="coupon-section">
                  <form onSubmit={handleApplyCoupon} className="coupon-form">
                    <div className="coupon-input-box">
                      <Tag size={16} className="tag-icon" />
                      <input 
                        id="cart-coupon-input"
                        name="couponCode"
                        type="text" 
                        autoComplete="off"
                        aria-label="Enter coupon discount code"
                        placeholder="Enter Coupon (e.g. COMBOBEST, FESTIVE50)"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        className="coupon-input"
                      />
                    </div>
                    <button type="submit" className="coupon-apply-btn">Apply</button>
                  </form>
                  {appliedCoupon && (
                    <div className="applied-tag">
                      <Check size={14} /> Coupon <strong>{appliedCoupon}</strong> applied successfully!
                    </div>
                  )}
                  {couponError && (
                    <div className="coupon-err">{couponError}</div>
                  )}
                </div>
              </div>
            ) : (
              <div className="empty-cart-state">
                <div className="empty-icon-circle">
                  <ShoppingBag size={48} color="#9c887e" />
                </div>
                <h3>Your cart is empty</h3>
                <p>Explore our handcrafted furniture and smart home electronics collections.</p>
                <button className="btn-primary" onClick={onClose}>
                  Start Shopping Now
                </button>
              </div>
            )}

            {/* Bottom Footer & Totals */}
            {cartItems.length > 0 && (
              <div className="drawer-footer">
                <div className="summary-table">
                  <div className="summary-row">
                    <span>Subtotal</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>
                  {discountAmount > 0 && (
                    <div className="summary-row discount-row">
                      <span>Discount</span>
                      <span>-{formatPrice(discountAmount)}</span>
                    </div>
                  )}
                  <div className="summary-row">
                    <span>Delivery Charge (via Porter)</span>
                    <span style={{ fontWeight: 600, color: '#0f172a' }}>₹0</span>
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '-4px', marginBottom: '8px' }}>
                    Sent via Porter platform • Porter charge added to bill by shopkeeper
                  </div>
                  <div className="summary-row total-row">
                    <strong>Total Amount</strong>
                    <strong className="grand-total">{formatPrice(finalTotal)}</strong>
                  </div>
                </div>

                <div className="checkout-buttons">
                  <button 
                    className="btn-primary checkout-card-btn"
                    onClick={handleProceedToBilling}
                  >
                    <CreditCard size={18} /> Proceed to Billing &amp; Order
                  </button>
                  <button 
                    className="btn-whatsapp checkout-wa-btn"
                    onClick={handleWhatsAppCheckout}
                  >
                    <MessageCircle size={18} /> Direct WhatsApp Order
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        {/* STEP 2: BILLING & CHECKOUT DETAILS */}
        {checkoutStep === 'billing' && (
          <div className="drawer-content-scrollable animate-fade-in">
            <button className="back-to-cart-link" onClick={() => setCheckoutStep('cart')}>
              <ArrowLeft size={16} /> Back to Cart Items
            </button>

            <form onSubmit={handleBillingSubmit} className="billing-form">
              <div className="billing-section-box">
                <h4><User size={16} /> Customer Information</h4>
                <div className="form-group-drawer">
                  <label htmlFor="billing-customer-name">Full Name *</label>
                  <input 
                    id="billing-customer-name"
                    name="name"
                    type="text" 
                    autoComplete="name"
                    placeholder="Enter customer name" 
                    value={billingForm.name}
                    onChange={(e) => setBillingForm(prev => ({ ...prev, name: e.target.value }))}
                    required
                  />
                </div>
                <div className="form-group-drawer">
                  <label htmlFor="billing-customer-phone">Mobile Number (For WhatsApp Updates &amp; Delivery Tracking) *</label>
                  <input 
                    id="billing-customer-phone"
                    name="tel"
                    type="tel" 
                    autoComplete="tel"
                    placeholder="e.g. 9876543210" 
                    value={billingForm.phone}
                    onChange={(e) => setBillingForm(prev => ({ ...prev, phone: e.target.value }))}
                    required
                  />
                </div>
              </div>

              <div className="billing-section-box">
                <h4><MapPin size={16} /> Delivery Address</h4>
                <div className="form-group-drawer">
                  <label htmlFor="billing-customer-address">House / Flat / Street Address *</label>
                  <input 
                    id="billing-customer-address"
                    name="street-address"
                    type="text" 
                    autoComplete="street-address"
                    placeholder="e.g. Flat 3B, Sunshine Apartments, Anna Nagar" 
                    value={billingForm.address}
                    onChange={(e) => setBillingForm(prev => ({ ...prev, address: e.target.value }))}
                    required
                  />
                </div>
                <div className="form-row-2">
                  <div className="form-group-drawer">
                    <label htmlFor="billing-customer-city">City</label>
                    <input 
                      id="billing-customer-city"
                      name="address-level2"
                      type="text" 
                      autoComplete="address-level2"
                      value={billingForm.city}
                      onChange={(e) => setBillingForm(prev => ({ ...prev, city: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="form-group-drawer">
                    <label htmlFor="billing-customer-pincode">Pincode</label>
                    <input 
                      id="billing-customer-pincode"
                      name="postal-code"
                      type="text" 
                      autoComplete="postal-code"
                      value={billingForm.pincode}
                      onChange={(e) => setBillingForm(prev => ({ ...prev, pincode: e.target.value }))}
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="billing-section-box">
                <h4><CreditCard size={16} /> Payment Method</h4>
                <div className="payment-options-grid">
                  {[
                    'UPI (GPay / PhonePe / Paytm)',
                    'Cash on Delivery (COD)',
                    'Credit / Debit Card',
                    '0% No-Cost EMI (6 to 18 Mos)'
                  ].map((mode, mIdx) => (
                    <label key={mode} className={`pay-radio-card ${billingForm.paymentMethod === mode ? 'selected' : ''}`}>
                      <input 
                        id={`payMethod-${mIdx}`}
                        type="radio" 
                        name="payMethod" 
                        checked={billingForm.paymentMethod === mode}
                        onChange={() => setBillingForm(prev => ({ ...prev, paymentMethod: mode }))}
                      />
                      <span>{mode}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Order Amount Preview */}
              <div className="billing-order-summary">
                <div className="summary-row">
                  <span>Items Total ({cartItems.reduce((a, b) => a + b.quantity, 0)})</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="summary-row discount-row">
                    <span>Discount</span>
                    <span>-{formatPrice(discountAmount)}</span>
                  </div>
                )}
                <div className="summary-row">
                  <span>Delivery Charge (via Porter)</span>
                  <span style={{ fontWeight: 600, color: '#0f172a' }}>₹0</span>
                </div>
                <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '-4px', marginBottom: '8px' }}>
                  Sent via Porter platform • Porter charge added to bill by shopkeeper
                </div>
                <div className="summary-row total-row">
                  <strong>Total Payable</strong>
                  <strong className="grand-total">{formatPrice(finalTotal)}</strong>
                </div>
              </div>

              <button type="submit" className="btn-confirm-order-now">
                <Check size={18} /> Confirm Order &amp; Generate Invoice
              </button>
            </form>
          </div>
        )}

        {/* STEP 3: SUCCESS & BILL VIEW */}
        {checkoutStep === 'success' && lastPlacedOrder && (
          <div className="checkout-success-view animate-fade-in">
            <div className="success-icon-badge">
              <Check size={40} color="#15803d" />
            </div>
            <h2>Order Placed Successfully!</h2>
            <p className="order-num">Order Reference: <strong>#{lastPlacedOrder.id}</strong></p>
            <p className="success-msg">
              Thank you for choosing <strong>Sardar Mart</strong> Furniture and Home Appliances, <strong>{lastPlacedOrder.customer?.name}</strong>. Your order is confirmed and our showroom fulfillment team in Chennai is preparing your items.
            </p>

            <div className="order-status-card-preview">
              <div className="preview-row">
                <span>Status:</span>
                <span className="status-live-badge">⚡ {lastPlacedOrder.status}</span>
              </div>
              <div className="preview-row">
                <span>Total Amount:</span>
                <strong>{formatPrice(lastPlacedOrder.total)}</strong>
              </div>
              <div className="preview-row">
                <span>Deliver to:</span>
                <span>{lastPlacedOrder.customer?.city} ({lastPlacedOrder.customer?.pincode})</span>
              </div>
            </div>

            <div className="success-actions-vertical">
              <button 
                className="btn-view-invoice-action"
                onClick={() => onViewInvoice && onViewInvoice(lastPlacedOrder)}
              >
                <FileText size={16} /> View &amp; Print Tax Invoice (Bill)
              </button>


              <button 
                className="btn-back-showroom"
                onClick={() => {
                  setCheckoutStep('cart');
                  onClose();
                }}
              >
                Continue Shopping
              </button>
            </div>
          </div>
        )}
      </div>

      <style>{`
        .cart-drawer-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(18, 10, 6, 0.65);
          backdrop-filter: blur(4px);
          z-index: 1000;
          display: flex;
          justify-content: flex-end;
        }
        .cart-drawer-panel {
          width: 440px;
          max-width: 100%;
          height: 100%;
          background: #ffffff;
          box-shadow: -10px 0 30px rgba(0, 0, 0, 0.25);
          display: flex;
          flex-direction: column;
          animation: slideDrawer 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        @keyframes slideDrawer {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }

        /* Header */
        .drawer-header {
          padding: 20px 24px;
          border-bottom: 1px solid var(--color-border);
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: var(--color-warm-cream);
        }
        .drawer-title-group {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .cart-header-icon {
          color: var(--color-primary);
        }
        .drawer-header h2 {
          font-size: 1.15rem;
          color: var(--color-text-main);
          margin-bottom: 2px;
        }
        .drawer-subtitle {
          font-size: 0.76rem;
          color: var(--color-text-light);
        }
        .drawer-close-btn {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          border: 1px solid var(--color-border);
          background: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: var(--color-text-light);
          transition: all var(--transition-fast);
        }
        .drawer-close-btn:hover {
          color: var(--color-primary);
          border-color: var(--color-primary);
        }

        /* Content scrollable */
        .drawer-content-scrollable {
          flex: 1;
          overflow-y: auto;
          padding: 20px 24px;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        /* Cart items */
        .cart-items-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .cart-item-row {
          display: flex;
          gap: 14px;
          padding-bottom: 16px;
          border-bottom: 1px dashed var(--color-border);
        }
        .cart-item-thumb-box {
          width: 75px;
          height: 75px;
          border-radius: var(--radius-md);
          overflow: hidden;
          background: #fbf7f2;
          flex-shrink: 0;
          border: 1px solid var(--color-border);
        }
        .cart-item-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .cart-item-info {
          flex: 1;
          display: flex;
          flex-direction: column;
        }
        .cart-item-cat {
          font-size: 0.68rem;
          font-weight: 700;
          color: var(--color-accent);
          letter-spacing: 0.5px;
        }
        .cart-item-title {
          font-size: 0.9rem;
          font-weight: 700;
          color: var(--color-text-main);
          line-height: 1.3;
          margin: 2px 0 6px;
        }
        .cart-item-pricing {
          display: flex;
          align-items: baseline;
          justify-content: space-between;
          margin-bottom: 8px;
        }
        .item-unit-price {
          font-size: 0.8rem;
          color: var(--color-text-muted);
        }
        .item-subtotal-val {
          font-size: 0.88rem;
          font-weight: 700;
          color: var(--color-primary);
        }

        .cart-item-actions {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: auto;
        }
        .cart-qty-counter {
          display: flex;
          align-items: center;
          background: #fdfaf7;
          border: 1px solid var(--color-border);
          border-radius: var(--radius-md);
          overflow: hidden;
        }
        .cart-qty-counter button {
          width: 28px;
          height: 28px;
          background: transparent;
          border: none;
          font-size: 1rem;
          font-weight: bold;
          cursor: pointer;
          color: var(--color-primary);
          transition: background var(--transition-fast);
        }
        .cart-qty-counter button:hover {
          background: #f4ede5;
        }
        .cart-qty-counter span {
          width: 28px;
          text-align: center;
          font-size: 0.85rem;
          font-weight: 700;
        }
        .remove-item-btn {
          background: transparent;
          border: none;
          color: #9c887e;
          cursor: pointer;
          padding: 4px;
          transition: color var(--transition-fast);
        }
        .remove-item-btn:hover {
          color: #dc2626;
        }

        /* Coupon */
        .coupon-section {
          background: #fcf9f5;
          padding: 14px;
          border-radius: var(--radius-md);
          border: 1px solid #ebdcd0;
        }
        .coupon-form {
          display: flex;
          gap: 8px;
        }
        .coupon-input-box {
          flex: 1;
          display: flex;
          align-items: center;
          background: #ffffff;
          border: 1px solid var(--color-border);
          border-radius: var(--radius-md);
          padding: 0 10px;
        }
        .tag-icon {
          color: #a89487;
          margin-right: 6px;
        }
        .coupon-input {
          width: 100%;
          border: none;
          padding: 8px 0;
          font-size: 0.84rem;
          outline: none;
          text-transform: uppercase;
        }
        .coupon-apply-btn {
          background: var(--color-warm-dark);
          color: #ffffff;
          border: none;
          padding: 0 14px;
          border-radius: var(--radius-md);
          font-weight: 600;
          font-size: 0.84rem;
          cursor: pointer;
        }
        .applied-tag {
          display: flex;
          align-items: center;
          gap: 6px;
          margin-top: 8px;
          font-size: 0.78rem;
          color: #15803d;
          font-weight: 600;
        }
        .coupon-err {
          margin-top: 6px;
          font-size: 0.75rem;
          color: #dc2626;
        }

        /* Empty state */
        .empty-cart-state {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 40px 24px;
          text-align: center;
        }
        .empty-icon-circle {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background: #f4ede5;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 18px;
        }
        .empty-cart-state h3 {
          font-size: 1.2rem;
          margin-bottom: 8px;
        }
        .empty-cart-state p {
          color: var(--color-text-muted);
          font-size: 0.88rem;
          margin-bottom: 20px;
        }

        /* Footer totals */
        .drawer-footer {
          padding: 20px 24px;
          border-top: 1px solid var(--color-border);
          background: #ffffff;
        }
        .summary-table {
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-bottom: 18px;
        }
        .summary-row {
          display: flex;
          justify-content: space-between;
          font-size: 0.88rem;
          color: var(--color-text-muted);
        }
        .discount-row {
          color: #15803d;
          font-weight: 600;
        }
        .free-text {
          color: #15803d;
          font-weight: 700;
        }
        .total-row {
          border-top: 1px dashed var(--color-border);
          padding-top: 10px;
          margin-top: 4px;
          font-size: 1.15rem;
          color: var(--color-text-main);
        }
        .grand-total {
          color: var(--color-primary);
        }

        .checkout-buttons {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .checkout-card-btn, .checkout-wa-btn {
          width: 100%;
          justify-content: center;
          padding: 12px;
          font-size: 0.95rem;
        }

        /* STEP 2: BILLING FORM */
        .back-to-cart-link {
          background: transparent;
          border: none;
          color: #78350f;
          font-weight: 700;
          font-size: 0.82rem;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          cursor: pointer;
          margin-bottom: 14px;
        }
        .billing-form {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .billing-section-box {
          background: #fbf9f6;
          border: 1px solid #ebdcd0;
          border-radius: 8px;
          padding: 14px 16px;
        }
        .billing-section-box h4 {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.88rem;
          color: #2b170e;
          margin-bottom: 12px;
        }
        .form-group-drawer {
          display: flex;
          flex-direction: column;
          gap: 4px;
          margin-bottom: 10px;
        }
        .form-group-drawer label {
          font-size: 0.74rem;
          font-weight: 700;
          color: #4b5563;
        }
        .form-group-drawer input {
          padding: 8px 12px;
          border: 1.5px solid #cbd5e1;
          border-radius: 6px;
          font-size: 0.85rem;
          outline: none;
        }
        .form-group-drawer input:focus {
          border-color: #d97706;
        }
        .form-row-2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
        }
        .payment-options-grid {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .pay-radio-card {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 8px 12px;
          border: 1.5px solid #e2e8f0;
          border-radius: 6px;
          background: #ffffff;
          font-size: 0.82rem;
          cursor: pointer;
          transition: all 0.15s ease;
        }
        .pay-radio-card.selected {
          border-color: #d97706;
          background: #fffbeb;
          font-weight: 700;
        }

        .billing-order-summary {
          background: #fffbeb;
          border: 1px solid #fde68a;
          border-radius: 8px;
          padding: 12px 14px;
        }
        .btn-confirm-order-now {
          background: #2b170e;
          color: #ffffff;
          border: none;
          padding: 13px;
          border-radius: 8px;
          font-weight: 700;
          font-size: 0.95rem;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          cursor: pointer;
          transition: background 0.2s ease;
        }
        .btn-confirm-order-now:hover {
          background: #4a2312;
        }

        /* Success Step */
        .checkout-success-view {
          padding: 40px 24px;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          overflow-y: auto;
        }
        .success-icon-badge {
          width: 72px;
          height: 72px;
          border-radius: 50%;
          background: #dcfce7;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 16px;
        }
        .checkout-success-view h2 {
          font-size: 1.3rem;
          color: #1e1008;
          margin-bottom: 4px;
        }
        .order-num {
          font-size: 0.95rem;
          color: #b45309;
          font-weight: 700;
          margin-bottom: 8px;
        }
        .success-msg {
          font-size: 0.85rem;
          color: #64748b;
          line-height: 1.45;
          margin-bottom: 18px;
        }

        .order-status-card-preview {
          width: 100%;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          padding: 12px 16px;
          margin-bottom: 20px;
          text-align: left;
        }
        .preview-row {
          display: flex;
          justify-content: space-between;
          font-size: 0.82rem;
          margin-bottom: 4px;
        }
        .status-live-badge {
          background: #fef3c7;
          color: #b45309;
          padding: 2px 8px;
          border-radius: 4px;
          font-weight: 700;
          font-size: 0.76rem;
        }

        .success-actions-vertical {
          width: 100%;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .btn-view-invoice-action {
          background: #d97706;
          color: #ffffff;
          border: none;
          padding: 11px;
          border-radius: 8px;
          font-weight: 700;
          font-size: 0.88rem;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          cursor: pointer;
        }
        .btn-view-invoice-action:hover {
          background: #b45309;
        }
        .btn-track-order-action {
          background: #2b170e;
          color: #ffffff;
          border: none;
          padding: 11px;
          border-radius: 8px;
          font-weight: 700;
          font-size: 0.88rem;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          cursor: pointer;
        }
        .btn-track-order-action:hover {
          background: #4a2312;
        }
        .btn-back-showroom {
          background: #ffffff;
          color: #64748b;
          border: 1px solid #cbd5e1;
          padding: 9px;
          border-radius: 8px;
          font-weight: 600;
          font-size: 0.84rem;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
}
