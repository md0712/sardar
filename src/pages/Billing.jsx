import React, { useState, useEffect, useMemo } from 'react';
import { 
  ShoppingBag, ShoppingCart, User, Phone, MapPin, CreditCard, CheckCircle2, 
  Truck, ShieldCheck, FileText, Printer, Download, RotateCcw, 
  Trash2, Plus, Minus, Tag, Clock, Sparkles, MessageCircle, 
  Search, Layers, Receipt, Check, ArrowRight, Package, Smartphone, 
  Banknote, Percent, Landmark, X, BadgePercent, Share2 
} from 'lucide-react';
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

  // Customer Form State - Empty by default, no dummy pre-typed values
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    city: '',
    pincode: '',
    email: ''
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

  // Payment & Order Status states
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [paymentStatus, setPaymentStatus] = useState('Paid Online (Verified)');
  const [orderStatus, setOrderStatus] = useState('Delivered (Immediate Handover)');
  const [specialNotes, setSpecialNotes] = useState('Showroom billing invoice with direct customer handover.');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [placedOrder, setPlacedOrder] = useState(null);

  // Existing customers list strictly from actual customer orders in Firestore (no mock data)
  const existingCustomersList = useMemo(() => {
    return Array.isArray(customers) ? customers : [];
  }, [customers]);

  // Find currently selected customer profile
  const activeCustomerProfile = useMemo(() => {
    if (!selectedCustomerId) return null;
    return existingCustomersList.find(c => (c.id === selectedCustomerId || c.phone === selectedCustomerId || c.name === selectedCustomerId));
  }, [selectedCustomerId, existingCustomersList]);

  // Currency Formatter
  const formatPrice = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val || 0);
  };

  // Pricing Calculations
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
  const gstAmount = cgst + sgst;

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
    if (!selectedId) {
      setFormData({
        name: '',
        phone: '',
        address: '',
        city: '',
        pincode: '',
        email: ''
      });
      return;
    }

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

  // Apply Quick Discount Preset
  const handleApplyDiscountPreset = (type, value) => {
    if (type === 'percent') {
      const calculated = Math.round(subtotal * (value / 100));
      setDiscountInput(calculated);
    } else if (type === 'flat') {
      setDiscountInput(value);
    } else if (type === 'clear') {
      setDiscountInput(0);
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
        name: prod.name || prod.title || 'Product Item',
        price: Number(prod.price || prod.sellingPrice) || 0,
        quantity: 1,
        image: prod.image || prod.imageUrl || 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=300&q=80',
        category: prod.category || 'furniture',
        modelNumber: prod.modelNumber || ''
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
      city: '',
      pincode: ''
    });
    setSelectedCustomerId('');
    setBillItems([]);
    setDiscountInput(0);
    setDeliveryFeeInput(0);
    setPlacedOrder(null);
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
      case 'upi': return 'UPI (GPay / PhonePe / Paytm)';
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
      alert('Please enter or select a customer name.');
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
        category: i.category || 'furniture',
        modelNumber: i.modelNumber || ''
      })),
      subtotal,
      discount: Number(discountInput) || 0,
      delivery: Number(deliveryFeeInput) || 0,
      gstRate: numGstRate,
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
      try {
        if (onPlaceOrder) {
          await onPlaceOrder(newOrder);
        }
        if (onClearCart) onClearCart();

        // Clear billing items, customer details, and pricing adjustments once process completes
        setBillItems([]);
        setFormData({
          name: '',
          phone: '',
          address: '',
          city: '',
          pincode: '',
          email: ''
        });
        setSelectedCustomerId('');
        setDiscountInput(0);
        setDeliveryFeeInput(0);
        setSpecialNotes('Showroom billing invoice with direct customer handover.');
        setPlacedOrder(newOrder);
        setIsSubmitting(false);

        // Immediately open tax invoice modal for on-screen viewing & printing
        if (onViewInvoice) {
          onViewInvoice(newOrder);
        }
      } catch (err) {
        console.error('Error placing billing order:', err);
        setIsSubmitting(false);
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

  // Filter products by category and search term
  const filteredCatalog = useMemo(() => {
    return catalogList.filter(p => {
      const matchCat = catalogCat === 'all' || p.category === catalogCat;
      const q = catalogSearch.toLowerCase().trim();
      const matchSearch = !q || 
        ((p.name || p.title || '').toLowerCase().includes(q)) ||
        ((p.modelNumber || '').toLowerCase().includes(q)) ||
        ((p.category || '').toLowerCase().includes(q));
      return matchCat && matchSearch;
    });
  }, [catalogList, catalogCat, catalogSearch]);

  const todayDateString = useMemo(() => {
    return new Date().toLocaleDateString('en-IN', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  }, []);

  return (
    <div className="pos-billing-container">
      {/* 1. SLIM TOP HEADER BANNER */}
      <div className="pos-top-header compact-header">
        <div className="pos-top-title-group">
          <div className="pos-badge-row">
            <span className="pos-brand-tag">
              <span className="pos-live-dot" />
              SARDAR MART SHOWROOM POS
            </span>
            <span className="pos-brand-divider">/</span>
            <span className="pos-brand-sub">Counter Terminal &amp; GST Invoicing</span>
          </div>
          <div className="pos-heading-row">
            <h2 className="pos-main-heading">Showroom Billing &amp; Tax Invoicing</h2>
            <div className="pos-header-stats-strip inline-stats">
              <span className="pos-stat-pill">
                <Clock size={11} /> {todayDateString}
              </span>
              <span className="pos-stat-pill">
                <Layers size={11} /> {catalogList.length} Products
              </span>
              <span className="pos-stat-pill highlight">
                <ShoppingCart size={11} /> {totalItemCount} Items ({formatPrice(calculatedGrandTotal)})
              </span>
            </div>
          </div>
        </div>

        <div className="pos-top-actions">
          <button type="button" className="btn-pos-clear" onClick={handleClearForm} title="Reset all fields and start a fresh bill">
            <RotateCcw size={13} /> Clear Form
          </button>
          <button 
            type="button" 
            className="btn-pos-orders" 
            onClick={() => onNavigate ? onNavigate('orders') : null}
            title="View completed sales orders ledger"
          >
            <ShoppingBag size={13} /> View Orders ({orders.length || 0})
          </button>
        </div>
      </div>

      {/* SUCCESS BANNER WHEN ORDER HAS BEEN PLACED */}
      {placedOrder && (
        <div className="pos-order-success-banner animate-fade-in">
          <div className="success-banner-content">
            <div className="success-banner-icon-box">
              <CheckCircle2 size={22} />
            </div>
            <div className="success-banner-text">
              <h4 className="success-banner-title">Tax Invoice #{placedOrder.id} Generated Successfully!</h4>
              <p className="success-banner-sub">
                Billed to <strong>{placedOrder.customer.name}</strong> • Amount: <strong>{formatPrice(placedOrder.total)}</strong> ({placedOrder.paymentMethod})
              </p>
            </div>
          </div>
          <div className="success-banner-actions">
            {onViewInvoice && (
              <button 
                type="button" 
                className="btn-banner-action primary"
                onClick={() => onViewInvoice(placedOrder)}
              >
                <Printer size={13} /> Print Invoice
              </button>
            )}
            <button 
              type="button" 
              className="btn-banner-action whatsapp"
              onClick={() => handleSendOrderOnWhatsApp(placedOrder)}
            >
              <MessageCircle size={13} /> WhatsApp
            </button>
            <button 
              type="button" 
              className="btn-banner-action secondary"
              onClick={() => {
                setPlacedOrder(null);
                handleClearForm();
              }}
            >
              <Plus size={13} /> New Bill
            </button>
          </div>
        </div>
      )}

      {/* 2. COMPACT CUSTOMER PROFILE CARD (SHORTENED & INPUT FIELDS REMOVED FROM EXISTING DIRECTORY VIEW) */}
      <div className="pos-card customer-info-card compact-customer-card">
        <div className="pos-card-head compact-card-head">
          <div className="card-head-left">
            <div className="head-icon-badge small">
              <User size={14} />
            </div>
            <div>
              <h3 className="card-head-title compact-title">Customer Profile &amp; Invoicing</h3>
            </div>
          </div>

          <div className="client-type-toggle compact-toggle">
            <button 
              type="button" 
              className={`toggle-pill ${clientMode === 'existing' ? 'active' : ''}`}
              onClick={() => setClientMode('existing')}
            >
              <CheckCircle2 size={11} />
              Existing Client Directory
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
                  city: '',
                  pincode: '',
                  email: ''
                });
              }}
            >
              <Plus size={11} />
              Walk-In / New Client
            </button>
          </div>
        </div>

        {/* Existing Client Mode: Compact 1-line selector + selected chip (NO DUMMY PRE-FILLED INPUT BOXES) */}
        {clientMode === 'existing' && (
          <div className="customer-directory-compact-row">
            <div className="customer-picker-wrap">
              <select 
                value={selectedCustomerId}
                onChange={handleSelectExistingCustomer}
                className="pos-select-input customer-picker-select"
                aria-label="Choose Existing Customer"
              >
                {existingCustomersList.length === 0 ? (
                  <option value="">-- No Saved Customers in Directory Yet (Use Walk-In) --</option>
                ) : (
                  <>
                    <option value="">-- Choose Customer from Directory ({existingCustomersList.length} Profiles) --</option>
                    {existingCustomersList.map((cust, i) => (
                      <option key={cust.id || i} value={cust.id || cust.phone || cust.name}>
                        {cust.name} ({cust.phone}) — {cust.city || 'Chennai'} [{cust.orderCount || 1} Orders]
                      </option>
                    ))}
                  </>
                )}
              </select>
            </div>

            {/* Display active customer summary pill when a profile is selected */}
            {activeCustomerProfile ? (
              <div className="customer-compact-selected-chip animate-fade-in">
                <span className="customer-chip-avatar">
                  {activeCustomerProfile.name ? activeCustomerProfile.name.charAt(0).toUpperCase() : 'C'}
                </span>
                <span className="customer-chip-name">{activeCustomerProfile.name}</span>
                <span className="customer-chip-sep">•</span>
                <span className="customer-chip-phone"><Phone size={11} /> {activeCustomerProfile.phone}</span>
                <span className="customer-chip-sep">•</span>
                <span className="customer-chip-address"><MapPin size={11} /> {activeCustomerProfile.city || 'Chennai'} ({activeCustomerProfile.pincode || '600001'})</span>
                <span className="customer-chip-badge">{activeCustomerProfile.orderCount || 1} Orders</span>
              </div>
            ) : (
              <div className="customer-picker-hint">
                <span>Select a customer from directory above or switch to <strong>Walk-In / New Client</strong> to enter new shopper details.</span>
              </div>
            )}
          </div>
        )}

        {/* Walk-In / New Client Mode: Clean, EMPTY input fields ready for new customer entry */}
        {clientMode === 'walkin' && (
          <div className="customer-fields-grid compact-grid animate-fade-in">
            <div className="pos-input-group">
              <label className="pos-field-label">CUSTOMER NAME <span className="req-star">*</span></label>
              <div className="input-with-icon-wrap">
                <User size={13} className="input-field-icon" />
                <input 
                  type="text" 
                  name="name" 
                  required 
                  value={formData.name} 
                  onChange={handleInputChange} 
                  placeholder="Enter full name" 
                  className="pos-text-input"
                />
              </div>
            </div>

            <div className="pos-input-group">
              <label className="pos-field-label">PHONE NUMBER <span className="req-star">*</span></label>
              <div className="input-with-icon-wrap">
                <Phone size={13} className="input-field-icon" />
                <input 
                  type="tel" 
                  name="phone" 
                  required 
                  value={formData.phone} 
                  onChange={handleInputChange} 
                  placeholder="+91 Mobile number" 
                  className="pos-text-input"
                />
              </div>
            </div>

            <div className="pos-input-group address-col">
              <label className="pos-field-label">BILLING / DELIVERY ADDRESS</label>
              <div className="input-with-icon-wrap">
                <MapPin size={13} className="input-field-icon" />
                <input 
                  type="text" 
                  name="address" 
                  value={formData.address} 
                  onChange={handleInputChange} 
                  placeholder="Street / Flat / Area address" 
                  className="pos-text-input"
                />
              </div>
            </div>

            <div className="pos-input-group city-pin-col">
              <label className="pos-field-label">CITY &amp; PINCODE</label>
              <div className="city-pin-inputs-pair">
                <input 
                  type="text" 
                  name="city" 
                  value={formData.city} 
                  onChange={handleInputChange} 
                  placeholder="City" 
                  className="pos-text-input city-half"
                />
                <input 
                  type="text" 
                  name="pincode" 
                  value={formData.pincode} 
                  onChange={handleInputChange} 
                  placeholder="Pincode" 
                  className="pos-text-input pin-half"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 3. MAIN 2-COLUMN POS LAYOUT (MOVED MUCH HIGHER TO TOP) */}
      <div className="pos-main-grid">
        {/* LEFT COLUMN: Showroom Catalog */}
        <div className="pos-left-column">
          <div className="pos-card catalog-card">
            <div className="pos-card-head compact-card-head">
              <div className="card-head-left">
                <div className="head-icon-badge small">
                  <Layers size={14} />
                </div>
                <div>
                  <h3 className="card-head-title compact-title">Showroom Catalog Selection</h3>
                </div>
              </div>
              <button 
                type="button" 
                className="btn-pos-custom-charge"
                onClick={handleAddCustomLineItem}
                title="Add custom line item (Carpentry, Polishing, Assembly, etc.)"
              >
                <Plus size={12} />
                <span>+ Custom Charge</span>
              </button>
            </div>

            {/* Catalog Search & Category Filters */}
            <div className="pos-catalog-toolbar compact-toolbar">
              <div className="pos-search-row">
                <Search size={14} className="pos-search-icon" />
                <input 
                  type="text" 
                  placeholder="Search catalog by title, model number or category..."
                  value={catalogSearch}
                  onChange={(e) => setCatalogSearch(e.target.value)}
                  className="pos-search-input compact-search"
                />
                {catalogSearch && (
                  <button 
                    type="button" 
                    className="pos-search-clear-btn" 
                    onClick={() => setCatalogSearch('')}
                    title="Clear search"
                  >
                    <X size={12} />
                  </button>
                )}
              </div>

              {/* Category Filter Pills */}
              <div className="pos-category-pills">
                {[
                  { id: 'all', label: 'All Catalog' },
                  { id: 'furniture', label: 'Furniture' },
                  { id: 'electronics', label: 'Electronics' },
                  { id: 'appliances', label: 'Appliances' }
                ].map(cat => (
                  <button
                    key={cat.id}
                    type="button"
                    className={`pos-cat-pill ${catalogCat === cat.id ? 'active' : ''}`}
                    onClick={() => setCatalogCat(cat.id)}
                  >
                    {cat.label}
                    <span className="cat-pill-count">
                      {cat.id === 'all' 
                        ? catalogList.length 
                        : catalogList.filter(p => p.category === cat.id).length}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* 6-Column Product Tiles Grid */}
            <div className="pos-products-6col-grid">
              {filteredCatalog.length === 0 ? (
                <div className="pos-no-products">
                  <div className="no-products-icon-wrap">
                    <Package size={30} />
                  </div>
                  <h5 className="no-products-title">No matching products found</h5>
                  <p className="no-products-desc">
                    No items in the catalog match &quot;<strong>{catalogSearch}</strong>&quot;.
                  </p>
                  <button 
                    type="button" 
                    className="btn-reset-filter"
                    onClick={() => {
                      setCatalogSearch('');
                      setCatalogCat('all');
                    }}
                  >
                    View All Products
                  </button>
                </div>
              ) : (
                filteredCatalog.map(p => {
                  const inBill = billItems.find(it => it.id === p.id);
                  const price = Number(p.price || p.sellingPrice) || 0;
                  const title = p.name || p.title || 'Product';
                  const img = p.image || p.imageUrl || 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=300&q=80';

                  return (
                    <div 
                      key={p.id} 
                      className={`pos-product-tile ${inBill ? 'tile-selected' : ''}`}
                      onClick={() => handleAddProductToBill(p)}
                    >
                      <div className="tile-thumb-box">
                        <span className="tile-cat-badge">
                          {p.category ? p.category.charAt(0).toUpperCase() + p.category.slice(1) : 'Furniture'}
                        </span>
                        {p.modelNumber && (
                          <span className="tile-model-badge" title={`Model: ${p.modelNumber}`}>
                            {p.modelNumber}
                          </span>
                        )}
                        <img src={img} alt={title} loading="lazy" />
                      </div>
                      <div className="tile-body">
                        <h4 className="tile-name" title={title}>{title}</h4>
                        <div className="tile-price-row">
                          <span className="tile-price">{formatPrice(price)}</span>
                          <span className="tile-stock-dot" title="In Showroom Stock">● In Stock</span>
                        </div>
                      </div>
                      <button
                        type="button"
                        className={`tile-add-btn ${inBill ? 'btn-added' : ''}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddProductToBill(p);
                        }}
                      >
                        {inBill ? (
                          <>
                            <Check size={11} /> In Bill ({inBill.quantity})
                          </>
                        ) : (
                          <>
                            <Plus size={11} /> Add to Bill
                          </>
                        )}
                      </button>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Bill Items & Shortened Settlement Charges */}
        <div className="pos-right-column">
          <div className="pos-card bill-card compact-bill-card">
            {/* CURRENT BILL ITEMS MOVED PROMINENTLY TO TOP */}
            <div className="pos-card-head compact-card-head">
              <div className="card-head-left">
                <div className="head-icon-badge small">
                  <ShoppingCart size={14} />
                </div>
                <div>
                  <h3 className="card-head-title compact-title">Current Bill Items</h3>
                  <span className="card-head-badge-count">{totalItemCount} Units</span>
                </div>
              </div>
              {billItems.length > 0 && (
                <button 
                  type="button" 
                  className="btn-pos-clear-cart" 
                  onClick={handleClearAllBillItems}
                  title="Remove all products from bill"
                >
                  <Trash2 size={11} /> Clear All
                </button>
              )}
            </div>

            {/* Bill Items Area (Prominently placed at the top) */}
            <div className="bill-items-viewport compact-viewport">
              {billItems.length === 0 ? (
                <div className="empty-bill-box compact-empty">
                  <div className="empty-receipt-graphic small">
                    <Receipt size={30} />
                  </div>
                  <h4 className="empty-bill-heading">Bill is empty</h4>
                  <p className="empty-bill-desc">
                    Click &quot;+ Add to Bill&quot; from the catalog on the left to add items.
                  </p>
                </div>
              ) : (
                <div className="bill-items-scroll-list">
                  {billItems.map(item => (
                    <div key={item.id} className="bill-row-item compact-row">
                      <img src={item.image} alt={item.name} className="bill-thumb compact-thumb" />
                      <div className="bill-info">
                        <strong className="bill-title" title={item.name}>{item.name}</strong>
                        {item.modelNumber && (
                          <span className="bill-item-model">Model: {item.modelNumber}</span>
                        )}
                        <div className="bill-unit-price">{formatPrice(item.price)} each</div>
                        <div className="bill-qty-wrap">
                          <div className="pos-qty-stepper compact-stepper">
                            <button 
                              type="button" 
                              onClick={() => handleUpdateItemQty(item.id, item.quantity - 1)}
                              aria-label="Decrease quantity"
                            >
                              <Minus size={10} />
                            </button>
                            <span className="qty-number-display">{item.quantity}</span>
                            <button 
                              type="button" 
                              onClick={() => handleUpdateItemQty(item.id, item.quantity + 1)}
                              aria-label="Increase quantity"
                            >
                              <Plus size={10} />
                            </button>
                          </div>
                          <button 
                            type="button" 
                            className="btn-bill-del" 
                            onClick={() => handleRemoveItem(item.id)}
                            title="Remove item"
                          >
                            <Trash2 size={12} />
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

            {/* STREAMLINED & SHORTENED CHARGES CARD */}
            <div className="pos-pricing-sheet compact-charges-sheet">
              <div className="pos-price-row compact-price-row">
                <span className="price-label">Subtotal ({totalItemCount} Items):</span>
                <span className="price-val font-semibold">{formatPrice(subtotal)}</span>
              </div>

              {/* Showroom Discount with presets */}
              <div className="pos-discount-block compact-discount-block">
                <div className="pos-price-row with-input-box">
                  <span className="price-label">
                    <Tag size={11} className="inline-icon" />
                    Discount:
                  </span>
                  <div className="currency-input-wrap">
                    <span className="currency-symbol">₹</span>
                    <input 
                      type="number"
                      min="0"
                      value={discountInput || ''}
                      onChange={(e) => setDiscountInput(Math.max(0, Number(e.target.value) || 0))}
                      className="pos-num-input compact-num-input"
                      placeholder="0"
                    />
                  </div>
                </div>

                {/* Quick Discount Preset Chips */}
                <div className="pos-discount-chips-row compact-chips-row">
                  <button 
                    type="button" 
                    className="discount-chip"
                    onClick={() => handleApplyDiscountPreset('flat', 500)}
                  >
                    -₹500
                  </button>
                  <button 
                    type="button" 
                    className="discount-chip"
                    onClick={() => handleApplyDiscountPreset('flat', 1000)}
                  >
                    -₹1,000
                  </button>
                  <button 
                    type="button" 
                    className="discount-chip"
                    onClick={() => handleApplyDiscountPreset('percent', 5)}
                  >
                    -5%
                  </button>
                  <button 
                    type="button" 
                    className="discount-chip"
                    onClick={() => handleApplyDiscountPreset('percent', 10)}
                  >
                    -10%
                  </button>
                  {discountAmount > 0 && (
                    <button 
                      type="button" 
                      className="discount-chip clear-chip"
                      onClick={() => handleApplyDiscountPreset('clear')}
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>

              {/* GST Tax Rate & Tax Breakdown (Streamlined & Compact) */}
              <div className="pos-gst-box-card compact-gst-card">
                <div className="pos-price-row compact-price-row">
                  <div className="gst-label-with-select">
                    <span className="price-label font-semibold">GST Rate:</span>
                    <select
                      value={gstRate}
                      onChange={(e) => setGstRate(Number(e.target.value))}
                      className="pos-gst-dropdown compact-dropdown"
                      aria-label="Select GST rate percentage"
                    >
                      <option value={18}>18% GST (Standard)</option>
                      <option value={12}>12% GST (Furniture)</option>
                      <option value={9}>9% GST</option>
                      <option value={0}>0% GST (Exempt)</option>
                    </select>
                  </div>
                  <span className="text-gst-total">
                    {numGstRate > 0 ? `+${formatPrice(gstAmount)}` : 'Exempt'}
                  </span>
                </div>

                {numGstRate > 0 && (
                  <div className="pos-gst-split-compact">
                    <span>CGST ({halfGstRate}%): +{formatPrice(cgst)}</span>
                    <span className="split-sep">•</span>
                    <span>SGST ({halfGstRate}%): +{formatPrice(sgst)}</span>
                  </div>
                )}
              </div>

              {/* Delivery / Handling */}
              <div className="pos-price-row with-input-box compact-price-row">
                <span className="price-label">
                  <Truck size={11} className="inline-icon" />
                  Delivery / Porter Charge (₹):
                </span>
                <div className="currency-input-wrap">
                  <span className="currency-symbol">₹</span>
                  <input 
                    type="number"
                    min="0"
                    value={deliveryFeeInput || ''}
                    onChange={(e) => setDeliveryFeeInput(Math.max(0, Number(e.target.value) || 0))}
                    className="pos-num-input compact-num-input"
                    placeholder="0"
                  />
                </div>
              </div>

              {/* SHORTENED & STREAMLINED GRAND TOTAL BANNER */}
              <div className="pos-grand-total-banner compact-grand-banner">
                <div className="grand-title-column">
                  <span className="grand-tag-micro">PAYABLE TOTAL</span>
                  <h4 className="grand-title-text compact-grand-title">Grand Total</h4>
                </div>
                <div className="grand-amount-number compact-grand-amount">
                  {formatPrice(calculatedGrandTotal)}
                </div>
              </div>
            </div>

            {/* Compact Payment Method Selection */}
            <div className="pos-payment-methods-box compact-payment-box">
              <label className="pos-field-label">PAYMENT METHOD:</label>
              <div className="payment-options-3x2-grid compact-payment-grid">
                {[
                  { id: 'upi', label: 'UPI / QR', icon: Smartphone },
                  { id: 'card', label: 'Card', icon: CreditCard },
                  { id: 'cash', label: 'Cash', icon: Banknote },
                  { id: 'emi', label: 'No-Cost EMI', icon: Percent },
                  { id: 'netbanking', label: 'Net Banking', icon: Landmark },
                  { id: 'cod', label: 'COD', icon: Truck }
                ].map(opt => {
                  const IconComponent = opt.icon;
                  const isActive = paymentMethod === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      className={`pay-mode-btn compact-pay-btn ${isActive ? 'active' : ''}`}
                      onClick={() => setPaymentMethod(opt.id)}
                    >
                      <span className="radio-circle-indicator small">
                        {isActive && <span className="radio-dot-inner" />}
                      </span>
                      <IconComponent size={13} className="pay-mode-icon" />
                      <span className="pay-mode-title">{opt.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Compact Status Dropdowns Row */}
            <div className="pos-status-dropdowns-row compact-status-row">
              <div className="pos-input-group">
                <label className="pos-field-label">PAYMENT STATUS</label>
                <select 
                  value={paymentStatus}
                  onChange={(e) => setPaymentStatus(e.target.value)}
                  className="pos-select-input status-select compact-select"
                >
                  <option value="Paid Online (Verified)">Paid Online (Verified)</option>
                  <option value="Paid at Counter (Cash / UPI)">Paid at Counter (Cash / UPI)</option>
                  <option value="Pending (Cash at Counter)">Pending (Cash at Counter)</option>
                  <option value="EMI Pre-Approved (Doorstep KYC)">EMI Pre-Approved</option>
                </select>
              </div>

              <div className="pos-input-group">
                <label className="pos-field-label">ORDER STATUS</label>
                <select 
                  value={orderStatus}
                  onChange={(e) => setOrderStatus(e.target.value)}
                  className="pos-select-input status-select compact-select"
                >
                  <option value="Delivered (Immediate Handover)">Delivered (Handover)</option>
                  <option value="Order Placed">Order Placed</option>
                  <option value="Out for Delivery">Out for Delivery</option>
                  <option value="Packed & Ready">Packed &amp; Ready</option>
                </select>
              </div>
            </div>

            {/* Remarks / Invoice Notes */}
            <div className="pos-input-group remarks-input-wrap compact-remarks">
              <input 
                type="text" 
                value={specialNotes} 
                onChange={(e) => setSpecialNotes(e.target.value)}
                placeholder="Showroom invoice remarks / customer notes..."
                className="pos-text-input remarks-input compact-remarks-input"
              />
            </div>

            {/* Primary Action Button */}
            <button 
              type="button" 
              className="btn-pos-generate-bill compact-cta-btn"
              onClick={handleGenerateBill}
              disabled={isSubmitting || billItems.length === 0}
            >
              <Printer size={16} />
              <span>{isSubmitting ? 'Syncing & Generating...' : 'Generate Bill & Print Tax Invoice'}</span>
            </button>

            {/* Save Bill to Orders indicator */}
            <div className="pos-save-orders-indicator compact-indicator">
              <CheckCircle2 size={12} className="save-check-icon" />
              <span>Saves directly to Sardar Mart Orders Ledger &amp; Cloud Database</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
