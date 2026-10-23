import React, { useState, useEffect } from 'react';
import { 
  ShoppingBag, ShoppingCart, User, Phone, MapPin, CreditCard, CheckCircle2, 
  Truck, ShieldCheck, FileText, Printer, Download, RotateCcw, 
  Trash2, Plus, Minus, Tag, Clock, Sparkles, MessageCircle, 
  Search, Layers, Receipt, Check, ArrowRight 
} from 'lucide-react';
import { products as initialProducts } from '../data/products';
import './Billing.css';

export default function Billing({ 
  cart = [], 
  products = [], 
  customers = [],
  orders = [],
  onAddToCart, 
  onUpdateQuantity, 
  onRemoveFromCart, 
  onClearCart, 
  onPlaceOrder, 
  onNavigate, 
  onViewInvoice, 
  storeSettings 
}) {
  // Client selection mode: 'existing' | 'walkin'
  const [clientMode, setClientMode] = useState('existing');
  const [selectedCustomerId, setSelectedCustomerId] = useState('');

  // Customer Form State
  const [formData, setFormData] = useState({
    name: 'Priya Sharma',
    phone: '+919840123456',
    address: 'Plot 42, Green Park Avenue, Anna Nagar',
    city: 'Chennai',
    pincode: '600040',
    email: 'priya.sharma@example.com'
  });

  // Catalog Picker state (strictly from Firestore backend database)
  const catalogList = products || [];
  const [catalogSearch, setCatalogSearch] = useState('');
  const [catalogCat, setCatalogCat] = useState('all');

  // Manage Bill Items
  const [billItems, setBillItems] = useState(cart && cart.length > 0 ? cart : []);

  // Sync with cart if cart changes
  useEffect(() => {
    if (cart && cart.length > 0) {
      setBillItems(cart);
    }
  }, [cart]);

  // Adjustments & Pricing inputs
  const [discountInput, setDiscountInput] = useState(0);
  const [deliveryFeeInput, setDeliveryFeeInput] = useState(0);
  const [gstRate, setGstRate] = useState(18); // Selectable GST: 0%, 9%, 12%, 18%

  // Payment & Order Status states matching the exact options in the reference image
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [paymentStatus, setPaymentStatus] = useState('Paid Online (Verified)');
  const [orderStatus, setOrderStatus] = useState('Delivered (Immediate Handover)');
  const [specialNotes, setSpecialNotes] = useState('Showroom billing invoice with direct customer handover.');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [placedOrder, setPlacedOrder] = useState(null);

  // Existing customers list (derived from props or initial fallback)
  const existingCustomersList = (customers && customers.length > 0) ? customers : [
    { id: 'c1', name: 'Priya Sharma', phone: '+919840123456', address: 'Plot 42, Green Park Avenue, Anna Nagar', city: 'Chennai', pincode: '600040', orderCount: 3 },
    { id: 'c2', name: 'Rajesh Kumar', phone: '+919840234567', address: '12, 1st Cross, Gandhi Road, T. Nagar', city: 'Chennai', pincode: '600017', orderCount: 2 },
    { id: 'c3', name: 'Meena Sundaram', phone: '+919840345678', address: '88, Velachery Main Road', city: 'Chennai', pincode: '600042', orderCount: 4 },
    { id: 'c4', name: 'Karthik Raja', phone: '+919840456789', address: '55, GST Road, Tambaram', city: 'Chennai', pincode: '600045', orderCount: 1 },
    { id: 'c5', name: 'Ananya Krishnan', phone: '+919840567890', address: '24, Besant Avenue, Adyar', city: 'Chennai', pincode: '600020', orderCount: 2 },
    { id: 'c6', name: 'Syed Ibrahim', phone: '+919840678901', address: '10, Mount Road, Thousand Lights', city: 'Chennai', pincode: '600006', orderCount: 3 },
    { id: 'c7', name: 'Venkatesh Rao', phone: '+919840789012', address: '36, 4th Avenue, Ashok Nagar', city: 'Chennai', pincode: '600083', orderCount: 1 },
    { id: 'c8', name: 'Divya Ramesh', phone: '+919840890123', address: '19, Cathedral Road, Gopalapuram', city: 'Chennai', pincode: '600086', orderCount: 2 },
    { id: 'c9', name: 'Rahim Baig', phone: '+916383056338', address: '190, Erukkenchery High Rd, Vyasarpadi', city: 'Chennai', pincode: '600039', orderCount: 5 },
    { id: 'c10', name: 'Lakshmi Narayanan', phone: '+919840901234', address: '77, Nelson Manickam Road, Aminjikarai', city: 'Chennai', pincode: '600029', orderCount: 2 }
  ];

  // Currency Formatter
  const formatPrice = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val || 0);
  };

  // Pricing Calculations (Dynamic GST: Base Subtotal + selectable GST % added separately)
  const subtotal = billItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const totalItemCount = billItems.reduce((acc, item) => acc + item.quantity, 0);
  const discountAmount = Math.min(subtotal, Math.max(0, Number(discountInput) || 0));
  const deliveryAmount = Math.max(0, Number(deliveryFeeInput) || 0);

  // Taxable Base amount after discount
  const taxableAmount = Math.max(0, subtotal - discountAmount);

  // Dynamic GST split: half CGST, half SGST
  const numGstRate = Number(gstRate) || 0;
  const halfGstRate = numGstRate / 2;
  const cgst = numGstRate > 0 ? Math.round(taxableAmount * (halfGstRate / 100)) : 0;
  const sgst = numGstRate > 0 ? Math.round(taxableAmount * (halfGstRate / 100)) : 0;
  const gstAmount = cgst + sgst; // Total dynamic GST added

  // Final Total Amount
  const calculatedGrandTotal = taxableAmount + gstAmount + deliveryAmount;

  // Handle Input Changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Choose Existing Customer
  const handleSelectExistingCustomer = (e) => {
    const selectedId = e.target.value;
    setSelectedCustomerId(selectedId);
    if (!selectedId) return;

    const matched = existingCustomersList.find(c => (c.id === selectedId || c.phone === selectedId || c.name === selectedId));
    if (matched) {
      setFormData({
        name: matched.name || '',
        phone: matched.phone || '',
        address: matched.address || '',
        city: matched.city || 'Chennai',
        pincode: matched.pincode || '600001',
        email: matched.email || `${matched.name.toLowerCase().replace(/\s+/g, '')}@example.com`
      });
      setClientMode('existing');
    }
  };

  // Add product to bill
  const handleAddProductToBill = (prod) => {
    const existing = billItems.find(item => item.id === prod.id);
    if (existing) {
      const newQty = existing.quantity + 1;
      setBillItems(prev => prev.map(item => item.id === prod.id ? { ...item, quantity: newQty } : item));
      if (onUpdateQuantity) onUpdateQuantity(prod.id, newQty);
    } else {
      const newItem = {
        id: prod.id,
        name: prod.name,
        price: prod.price,
        quantity: 1,
        image: prod.image,
        category: prod.category || 'furniture'
      };
      setBillItems(prev => [...prev, newItem]);
      if (onAddToCart) {
        onAddToCart(newItem, 1);
      } else if (onUpdateQuantity) {
        onUpdateQuantity(prod.id, 1);
      }
    }
  };

  // Update quantity in bill
  const handleUpdateItemQty = (id, newQty) => {
    if (newQty <= 0) {
      handleRemoveItem(id);
      return;
    }
    setBillItems(prev => prev.map(item => item.id === id ? { ...item, quantity: newQty } : item));
    if (onUpdateQuantity) onUpdateQuantity(id, newQty);
  };

  // Remove single line item
  const handleRemoveItem = (id) => {
    setBillItems(prev => prev.filter(item => item.id !== id));
    if (onRemoveFromCart) onRemoveFromCart(id);
  };

  // Clear all bill items
  const handleClearAllBillItems = () => {
    setBillItems([]);
    if (onClearCart) onClearCart();
  };

  // Clear Form Button (top right)
  const handleClearForm = () => {
    setFormData({
      name: '',
      phone: '',
      email: '',
      address: '',
      city: 'Chennai',
      pincode: '600001'
    });
    setSelectedCustomerId('');
    setBillItems([]);
    setDiscountInput(0);
    setDeliveryFeeInput(0);
    if (onClearCart) onClearCart();
  };

  // Add custom line item (Custom Item / Charge)
  const handleAddCustomLineItem = () => {
    const customName = window.prompt('Enter Custom Item or Service Name:', 'Custom Woodwork & Assembly');
    if (!customName || !customName.trim()) return;
    const priceStr = window.prompt('Enter Unit Price (₹):', '1500');
    const customPrice = Math.max(0, Number(priceStr) || 0);
    const customItem = {
      id: `custom-${Date.now()}`,
      name: customName.trim(),
      price: customPrice,
      quantity: 1,
      image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=200&q=80',
      category: 'services'
    };
    setBillItems(prev => [...prev, customItem]);
    if (onAddToCart) {
      onAddToCart(customItem, 1);
    } else if (onUpdateQuantity) {
      onUpdateQuantity(customItem.id, 1);
    }
  };

  // Generate readable payment label
  const getReadablePaymentMethod = () => {
    switch (paymentMethod) {
      case 'upi': return 'UPI (GPay / PhonePe)';
      case 'card': return 'Credit / Debit Card';
      case 'cash': return 'Cash at Counter';
      case 'emi': return 'No-Cost EMI';
      case 'netbanking': return 'Net Banking';
      case 'cod': return 'Cash on Delivery';
      default: return 'UPI (GPay / PhonePe)';
    }
  };

  // Handle Order Generation & Submission
  const handleGenerateBill = (e) => {
    if (e) e.preventDefault();

    if (billItems.length === 0) {
      alert('Your bill is currently empty. Please select at least one product from the Showroom Catalog on the left.');
      return;
    }
    if (!formData.name.trim()) {
      alert('Please enter customer full name.');
      return;
    }
    if (!formData.phone.trim()) {
      alert('Please enter customer phone number for tax invoice dispatch.');
      return;
    }

    setIsSubmitting(true);
    const orderId = `SM-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const now = new Date();
    const formattedDate = now.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) + ', ' + now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

    const newOrder = {
      id: orderId,
      date: formattedDate,
      customer: {
        name: formData.name,
        phone: formData.phone,
        email: formData.email || `${formData.name.toLowerCase().replace(/\s+/g, '')}@gmail.com`,
        address: formData.address || 'Showroom Counter Handover',
        city: formData.city || 'Chennai',
        state: 'Tamil Nadu',
        pincode: formData.pincode || '600001'
      },
      items: billItems.map(i => ({
        id: i.id,
        name: i.name,
        price: i.price,
        quantity: i.quantity,
        image: i.image,
        category: i.category || 'furniture'
      })),
      subtotal,
      discount: Number(discountInput) || 0,
      delivery: Number(deliveryFeeInput) || 0,
      taxableAmount,
      cgst,
      sgst,
      gstAmount,
      total: calculatedGrandTotal,
      paymentMethod: getReadablePaymentMethod(),
      paymentStatus: paymentStatus,
      status: orderStatus,
      courier: 'Sardar Mart Express Delivery Fleet',
      trackingNumber: `SM-EXP-${Math.floor(10000 + Math.random() * 90000)}`,
      notes: specialNotes || 'Showroom billing invoice with direct customer handover.'
    };

    setTimeout(async () => {
      if (onPlaceOrder) {
        await onPlaceOrder(newOrder);
      }
      if (onClearCart) onClearCart();
      setPlacedOrder(newOrder);
      setIsSubmitting(false);

      // Immediately open tax invoice modal for on-screen viewing & printing
      if (onViewInvoice) {
        onViewInvoice(newOrder);
      }
    }, 400);
  };

  // WhatsApp Order Forwarding
  const handleSendOrderOnWhatsApp = (order) => {
    const itemsList = order.items
      .map(i => `• ${i.name} (Qty: ${i.quantity}) - ${formatPrice(i.price * i.quantity)}`)
      .join('%0A');
    const msg = encodeURIComponent(
      `Hello Sardar Mart Team!%0A%0AI have placed a showroom order:%0A*Order Bill No:* #${order.id}%0A*Customer Name:* ${order.customer.name}%0A*Phone:* ${order.customer.phone}%0A*Delivery City:* ${order.customer.city} (${order.customer.pincode})%0A%0A*Items:*%0A${itemsList}%0A%0A*Grand Total:* ${formatPrice(order.total)}%0A*Payment Mode:* ${order.paymentMethod}%0A*Status:* ${order.status}%0AThank you!`
    );
    window.open(`https://wa.me/916383056338?text=${msg}`, '_blank');
  };

  return (
    <div className="pos-billing-container">
      {/* 1. TOP HEADER ROW */}
      <div className="pos-top-header">
        <div className="pos-top-title-group">
          <div className="pos-badge-row">
            <span className="pos-brand-tag">SHOWROOM POS</span>
            <span className="pos-brand-sub">Tax Invoice Generator</span>
          </div>
          <h2 className="pos-main-heading">Create New Bill &amp; Tax Invoice</h2>
          <p className="pos-sub-lead">
            Instant showroom checkout for walk-in clients, phone orders, and direct sales settlement.
          </p>
        </div>

        <div className="pos-top-actions">
          <button type="button" className="btn-pos-clear" onClick={handleClearForm}>
            <RotateCcw size={14} /> Clear Form
          </button>
          <button 
            type="button" 
            className="btn-pos-orders" 
            onClick={() => onNavigate ? onNavigate('orders') : null}
          >
            <ShoppingBag size={14} /> View Orders ({orders.length || 5})
          </button>
        </div>
      </div>

      {/* 2. CUSTOMER INFORMATION CARD */}
      <div className="pos-card customer-info-card">
        <div className="pos-card-head">
          <div className="card-head-left">
            <User size={16} className="head-icon-purple" />
            <h3 className="card-head-title">Customer Information</h3>
          </div>
          <div className="client-type-toggle">
            <button 
              type="button" 
              className={`toggle-pill ${clientMode === 'existing' ? 'active' : ''}`}
              onClick={() => setClientMode('existing')}
            >
              Existing Client
            </button>
            <button 
              type="button" 
              className={`toggle-pill ${clientMode === 'walkin' ? 'active' : ''}`}
              onClick={() => {
                setClientMode('walkin');
                setSelectedCustomerId('');
                setFormData({
                  name: '',
                  phone: '',
                  address: '',
                  city: 'Chennai',
                  pincode: '600001',
                  email: ''
                });
              }}
            >
              + Walk-In / New
            </button>
          </div>
        </div>

        {/* Directory customer select row */}
        <div className="customer-select-row">
          <label className="pos-field-label">Choose Existing Customer from Directory:</label>
          <select 
            value={selectedCustomerId}
            onChange={handleSelectExistingCustomer}
            className="pos-select-input"
          >
            <option value="">-- Select Customer Profile ({existingCustomersList.length} Available) --</option>
            {existingCustomersList.map((cust, i) => (
              <option key={cust.id || i} value={cust.id || cust.phone || cust.name}>
                {cust.name} ({cust.phone}) — {cust.city || 'Chennai'} [{cust.orderCount || 1} Orders]
              </option>
            ))}
          </select>
        </div>

        {/* 4 Inputs Grid: CUSTOMER FULL NAME, PHONE NUMBER, BILLING & DELIVERY ADDRESS, CITY & PINCODE */}
        <div className="customer-fields-grid">
          <div className="pos-input-group">
            <label className="pos-field-label">CUSTOMER FULL NAME *</label>
            <input 
              type="text" 
              name="name" 
              required 
              value={formData.name} 
              onChange={handleInputChange} 
              placeholder="e.g. Priya Sharma" 
              className="pos-text-input"
            />
          </div>

          <div className="pos-input-group">
            <label className="pos-field-label">PHONE NUMBER *</label>
            <input 
              type="tel" 
              name="phone" 
              required 
              value={formData.phone} 
              onChange={handleInputChange} 
              placeholder="+919840123456" 
              className="pos-text-input"
            />
          </div>

          <div className="pos-input-group address-col">
            <label className="pos-field-label">BILLING &amp; DELIVERY ADDRESS</label>
            <input 
              type="text" 
              name="address" 
              value={formData.address} 
              onChange={handleInputChange} 
              placeholder="Plot 42, Green Park Avenue, Anna Nagar" 
              className="pos-text-input"
            />
          </div>

          <div className="pos-input-group city-pin-col">
            <label className="pos-field-label">CITY &amp; PINCODE</label>
            <div className="city-pin-inputs-pair">
              <input 
                type="text" 
                name="city" 
                value={formData.city} 
                onChange={handleInputChange} 
                placeholder="Chennai" 
                className="pos-text-input city-half"
              />
              <input 
                type="text" 
                name="pincode" 
                value={formData.pincode} 
                onChange={handleInputChange} 
                placeholder="600040" 
                className="pos-text-input pin-half"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 3. MAIN 2-COLUMN POS LAYOUT */}
      <div className="pos-main-grid">
        {/* LEFT COLUMN: Showroom Catalog */}
        <div className="pos-left-column">
          <div className="pos-card catalog-card">
            <div className="pos-card-head">
              <div className="card-head-left">
                <Layers size={16} className="head-icon-purple" />
                <h3 className="card-head-title">Select Products from Showroom Catalog</h3>
              </div>
              <button 
                type="button" 
                className="btn-pos-custom-charge"
                onClick={handleAddCustomLineItem}
                title="Add custom line item (Carpentry, Polishing, Assembly, etc.)"
              >
                + Custom Item / Charge
              </button>
            </div>

            {/* Catalog Search */}
            <div className="pos-search-row">
              <Search size={15} className="pos-search-icon" />
              <input 
                type="text" 
                placeholder="Search products by name, model or specs..."
                value={catalogSearch}
                onChange={(e) => setCatalogSearch(e.target.value)}
                className="pos-search-input"
              />
            </div>

            {/* Category Filter Pills */}
            <div className="pos-category-pills">
              {['all', 'furniture', 'electronics', 'appliances'].map(cat => (
                <button
                  key={cat}
                  type="button"
                  className={`pos-cat-pill ${catalogCat === cat ? 'active' : ''}`}
                  onClick={() => setCatalogCat(cat)}
                >
                  {cat === 'all' ? 'All Items' : cat.charAt(0).toUpperCase() + cat.slice(1)}
                </button>
              ))}
            </div>

            <div className="pos-products-6col-grid">
              {(() => {
                const filtered = catalogList.filter(p => {
                  const matchCat = catalogCat === 'all' || p.category === catalogCat;
                  const matchSearch = !catalogSearch.trim() || 
                    p.name.toLowerCase().includes(catalogSearch.toLowerCase()) ||
                    (p.category || '').toLowerCase().includes(catalogSearch.toLowerCase());
                  return matchCat && matchSearch;
                });
                if (filtered.length === 0) {
                  return (
                    <div className="pos-no-products" style={{ gridColumn: '1 / -1', padding: '36px 16px', textAlign: 'center', background: '#f8fafc', borderRadius: '8px', border: '1px dashed #cbd5e1' }}>
                      <Package size={32} color="#94a3b8" style={{ margin: '0 auto 8px' }} />
                      <p style={{ margin: 0, fontWeight: 700, color: '#475569' }}>No products found</p>
                      <small style={{ color: '#64748b' }}>No items found in Firestore database matching this criteria.</small>
                    </div>
                  );
                }
                return filtered.map(p => {
                  const inBill = billItems.find(it => it.id === p.id);
                  return (
                    <div key={p.id} className={`pos-product-tile ${inBill ? 'tile-selected' : ''}`}>
                      <div className="tile-thumb-box">
                        <span className="tile-cat-badge">
                          {p.category ? p.category.charAt(0).toUpperCase() + p.category.slice(1) : 'Furniture'}
                        </span>
                        <img src={p.image} alt={p.name} loading="lazy" />
                      </div>
                      <div className="tile-body">
                        <h4 className="tile-name" title={p.name}>{p.name}</h4>
                        <div className="tile-price">{formatPrice(p.price)}</div>
                        <div className="tile-stock">In Showroom Stock</div>
                      </div>
                      <button
                        type="button"
                        className={`tile-add-btn ${inBill ? 'btn-added' : ''}`}
                        onClick={() => handleAddProductToBill(p)}
                      >
                        {inBill ? (
                          <>✓ Added ({inBill.quantity})</>
                        ) : (
                          <>+ Add to Bill</>
                        )}
                      </button>
                    </div>
                  );
                });
              })()}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Bill Items & Settlement */}
        <div className="pos-right-column">
          <div className="pos-card bill-card">
            <div className="pos-card-head">
              <div className="card-head-left">
                <ShoppingCart size={16} className="head-icon-purple" />
                <h3 className="card-head-title">Bill Items ({totalItemCount})</h3>
              </div>
              {billItems.length > 0 && (
                <button type="button" className="btn-pos-clear-cart" onClick={handleClearAllBillItems}>
                  Clear
                </button>
              )}
            </div>

            {/* Bill Items Area */}
            <div className="bill-items-viewport">
              {billItems.length === 0 ? (
                <div className="empty-bill-box">
                  <Receipt size={44} className="empty-receipt-icon" />
                  <p className="empty-bill-heading">No products in bill yet.</p>
                  <p className="empty-bill-desc">Click &quot;+ Add to Bill&quot; from the catalog on the left to include products.</p>
                </div>
              ) : (
                <div className="bill-items-scroll-list">
                  {billItems.map(item => (
                    <div key={item.id} className="bill-row-item">
                      <img src={item.image} alt={item.name} className="bill-thumb" />
                      <div className="bill-info">
                        <strong className="bill-title">{item.name}</strong>
                        <div className="bill-unit-price">{formatPrice(item.price)} each</div>
                        <div className="bill-qty-wrap">
                          <div className="pos-qty-stepper">
                            <button type="button" onClick={() => handleUpdateItemQty(item.id, item.quantity - 1)}>-</button>
                            <span>{item.quantity}</span>
                            <button type="button" onClick={() => handleUpdateItemQty(item.id, item.quantity + 1)}>+</button>
                          </div>
                          <button type="button" className="btn-bill-del" onClick={() => handleRemoveItem(item.id)}>
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>
                      <div className="bill-total-price">
                        {formatPrice(item.price * item.quantity)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Calculation & Pricing Sheet */}
            <div className="pos-pricing-sheet">
              <div className="pos-price-row">
                <span className="price-label">Subtotal ({totalItemCount} Items):</span>
                <span className="price-val">{formatPrice(subtotal)}</span>
              </div>

              <div className="pos-price-row with-input-box">
                <span className="price-label">Showroom Discount (₹):</span>
                <input 
                  type="number"
                  min="0"
                  value={discountInput}
                  onChange={(e) => setDiscountInput(Number(e.target.value) || 0)}
                  className="pos-num-input"
                  placeholder="0"
                />
              </div>

              {/* Taxable Base Amount */}
              <div className="pos-price-row pos-taxable-row">
                <span className="price-label">Taxable Amount:</span>
                <span className="price-val">{formatPrice(taxableAmount)}</span>
              </div>

              {/* GST Rate Selector Control Row */}
              <div className="pos-price-row pos-gst-selector-row">
                <div className="gst-label-with-select">
                  <span className="price-label">GST Tax Rate:</span>
                  <select
                    value={gstRate}
                    onChange={(e) => setGstRate(Number(e.target.value))}
                    className="pos-gst-dropdown"
                    aria-label="Select GST rate percentage"
                  >
                    <option value={18}>18% GST (Standard)</option>
                    <option value={12}>12% GST</option>
                    <option value={9}>9% GST</option>
                    <option value={0}>0% GST (Exempt)</option>
                  </select>
                </div>
                <span className="gst-rate-active-pill">{gstRate}%</span>
              </div>

              {/* Separate CGST */}
              <div className="pos-price-row pos-gst-row">
                <span className="price-label">CGST ({halfGstRate}%):</span>
                <span className="price-val text-gst">+{formatPrice(cgst)}</span>
              </div>

              {/* Separate SGST */}
              <div className="pos-price-row pos-gst-row">
                <span className="price-label">SGST ({halfGstRate}%):</span>
                <span className="price-val text-gst">+{formatPrice(sgst)}</span>
              </div>

              {/* Total GST Tag */}
              <div className="pos-price-row pos-total-gst-row">
                <span className="price-label">Total GST ({gstRate}% Added):</span>
                <span className="price-val text-gst-total">+{formatPrice(gstAmount)}</span>
              </div>

              <div className="pos-price-row with-input-box">
                <span className="price-label">Delivery &amp; White-Glove Assembly:</span>
                <input 
                  type="number"
                  min="0"
                  value={deliveryFeeInput}
                  onChange={(e) => setDeliveryFeeInput(Number(e.target.value) || 0)}
                  className="pos-num-input"
                  placeholder="0"
                />
              </div>

              {/* Exact Lavender Grand Total Box from the reference image */}
              <div className="pos-grand-total-lavender-banner">
                <div className="grand-title-column">
                  <h4 className="grand-title-text">Grand Total Payable</h4>
                  <span className="grand-gst-subtitle">
                    {gstRate > 0 
                      ? `Total amount including ${gstRate}% GST (CGST ${halfGstRate}% + SGST ${halfGstRate}%)`
                      : 'Total amount (0% GST Exempt)'}
                  </span>
                </div>
                <div className="grand-amount-number">
                  {formatPrice(calculatedGrandTotal)}
                </div>
              </div>
            </div>

            {/* Payment Method Selector (6 options in 3x2 grid) */}
            <div className="pos-payment-methods-box">
              <label className="pos-field-label">PAYMENT METHOD:</label>
              <div className="payment-options-3x2-grid">
                {[
                  { id: 'upi', label: 'UPI (GPay / PhonePe)' },
                  { id: 'card', label: 'Credit / Debit Card' },
                  { id: 'cash', label: 'Cash at Counter' },
                  { id: 'emi', label: 'No-Cost EMI' },
                  { id: 'netbanking', label: 'Net Banking' },
                  { id: 'cod', label: 'Cash on Delivery' }
                ].map(opt => (
                  <button
                    key={opt.id}
                    type="button"
                    className={`pay-mode-btn ${paymentMethod === opt.id ? 'active' : ''}`}
                    onClick={() => setPaymentMethod(opt.id)}
                  >
                    <span className="radio-circle-indicator">
                      {paymentMethod === opt.id && <span className="radio-dot-inner" />}
                    </span>
                    <span className="pay-mode-title">{opt.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 2 Status Dropdowns Row */}
            <div className="pos-status-dropdowns-row">
              <div className="pos-input-group">
                <label className="pos-field-label">PAYMENT SETTLEMENT STATUS</label>
                <select 
                  value={paymentStatus}
                  onChange={(e) => setPaymentStatus(e.target.value)}
                  className="pos-select-input status-select"
                >
                  <option value="Paid Online (Verified)">Paid Online (Verified)</option>
                  <option value="Paid at Counter (Cash / UPI)">Paid at Counter (Cash / UPI)</option>
                  <option value="Pending (Cash at Counter)">Pending (Cash at Counter)</option>
                  <option value="EMI Pre-Approved (Doorstep KYC)">EMI Pre-Approved (Doorstep KYC)</option>
                </select>
              </div>

              <div className="pos-input-group">
                <label className="pos-field-label">DELIVERY / ORDER STATUS</label>
                <select 
                  value={orderStatus}
                  onChange={(e) => setOrderStatus(e.target.value)}
                  className="pos-select-input status-select"
                >
                  <option value="Delivered (Immediate Handover)">Delivered (Immediate Handover)</option>
                  <option value="Order Placed">Order Placed</option>
                  <option value="Out for Delivery">Out for Delivery</option>
                  <option value="Packed & Ready">Packed &amp; Ready</option>
                </select>
              </div>
            </div>

            {/* Remarks / Invoice Notes */}
            <div className="pos-input-group remarks-input-wrap">
              <label className="pos-field-label">SHOWROOM BILL REMARKS / INVOICE NOTES</label>
              <input 
                type="text" 
                value={specialNotes} 
                onChange={(e) => setSpecialNotes(e.target.value)}
                placeholder="Showroom billing invoice with direct customer handover."
                className="pos-text-input remarks-input"
              />
            </div>

            {/* Big Purple Action Button */}
            <button 
              type="button" 
              className="btn-pos-generate-bill"
              onClick={handleGenerateBill}
              disabled={isSubmitting}
            >
              <Printer size={18} />
              <span>{isSubmitting ? 'Generating Bill & Syncing to Cloud...' : 'Generate Bill & Print Tax Invoice'}</span>
            </button>

            {/* Save Bill to Orders indicator */}
            <div className="pos-save-orders-indicator">
              <Check size={14} className="save-check-icon" />
              <span>Save Bill to Orders</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
