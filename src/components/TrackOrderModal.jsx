import React, { useState, useEffect } from 'react';
import { 
  X, Search, Package, CheckCircle2, Clock, Truck, Home, 
  MapPin, Phone, FileText, MessageCircle, AlertCircle, ArrowLeft,
  ArrowRight, ShieldCheck, HelpCircle
} from 'lucide-react';

export default function TrackOrderModal({ 
  isOpen, 
  onClose, 
  orders = [], 
  initialOrderId = '', 
  onViewInvoice,
  products = []
}) {
  const [searchTerm, setSearchTerm] = useState(initialOrderId || '');
  const [searchedOrder, setSearchedOrder] = useState(null);
  const [searchError, setSearchError] = useState('');

  // When opened with an explicit initialOrderId, load it immediately
  useEffect(() => {
    if (initialOrderId && orders.length > 0) {
      const orderSearchTarget = String(initialOrderId).trim().toLowerCase();
      const found = orders.find(
        (o) => String(o.id || '').trim().toLowerCase() === orderSearchTarget
      );
      if (found) {
        setSearchedOrder(found);
        setSearchTerm(found.id);
        setSearchError('');
      } else {
        setSearchedOrder(null);
        setSearchTerm(String(initialOrderId));
      }
    } else if (!initialOrderId) {
      // First ask bill number or phone number: reset searched order on fresh open
      setSearchedOrder(null);
      setSearchTerm('');
      setSearchError('');
    }
  }, [initialOrderId, isOpen, orders]);

  if (!isOpen) return null;

  const handleSearch = (e) => {
    if (e) e.preventDefault();
    const cleanTerm = searchTerm.trim().toLowerCase().replace(/[\s\-+]/g, '');

    if (!cleanTerm) {
      setSearchError('Please enter your Bill Number / Order Code or Phone Number');
      return;
    }

    const found = orders.find((o) => {
      const orderIdClean = o.id.toLowerCase().replace(/[\s\-+]/g, '');
      const phoneClean = (o.customer?.phone || '').replace(/[\s\-+]/g, '');
      const billCodeClean = (o.id || '').replace(/^hk[-_]?/i, '').toLowerCase();

      return (
        orderIdClean.includes(cleanTerm) ||
        billCodeClean.includes(cleanTerm) ||
        phoneClean.includes(cleanTerm) ||
        cleanTerm.includes(billCodeClean)
      );
    });

    if (found) {
      setSearchedOrder(found);
      setSearchError('');
    } else {
      setSearchError(
        `No order found matching "${searchTerm}". Please verify your Bill Number (e.g. SEF-2026-8941) or 10-digit Phone Number.`
      );
      setSearchedOrder(null);
    }
  };

  const handleSelectQuickOrder = (order) => {
    setSearchedOrder(order);
    setSearchTerm(order.id);
    setSearchError('');
  };

  const handleResetSearch = () => {
    setSearchedOrder(null);
    setSearchTerm('');
    setSearchError('');
  };

  const getStepIndex = (status) => {
    switch (status) {
      case 'Order Placed': return 0;
      case 'Confirmed': return 1;
      case 'Processing':
      case 'Packed': return 2;
      case 'Out for Delivery': return 3;
      case 'Delivered': return 4;
      case 'Cancelled': return -1;
      default: return 1;
    }
  };

  const steps = [
    { title: 'Order Placed', desc: 'Received & Logged', icon: Clock },
    { title: 'Confirmed', desc: 'Verified & Reserved', icon: CheckCircle2 },
    { title: 'Packed & Dispatched', desc: 'Central Warehouse Hub', icon: Package },
    { title: 'Out for Delivery', desc: 'On Delivery Vehicle', icon: Truck },
    { title: 'Delivered & Installed', desc: 'Doorstep Setup', icon: Home }
  ];

  const currentStep = searchedOrder ? getStepIndex(searchedOrder.status) : 0;

  const formatPrice = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val || 0);
  };

  return (
    <div className="track-modal-backdrop" onClick={onClose}>
      <div className="track-modal-panel" onClick={(e) => e.stopPropagation()}>
        
        {/* Header */}
        <div className="track-modal-header">
          <div className="header-left-col">
            <span className="track-badge">Live Order Tracking</span>
            <h2>Track Order &amp; Delivery Status</h2>
          </div>
          <button className="track-close-btn" onClick={onClose} aria-label="Close modal">
            <X size={20} />
          </button>
        </div>

        {/* STEP 1: If order is NOT yet found/selected -> FIRST ASK BILL NUMBER OR PHONE NUMBER */}
        {!searchedOrder ? (
          <div className="ask-order-screen animate-fade-in">
            <div className="ask-hero-icon-wrap">
              <Package size={44} className="ask-icon-pulse" />
            </div>

            <div className="ask-intro-text">
              <h3>Enter Bill Number or Phone Number</h3>
              <p>
                Please enter the <strong>Bill Number / Order Code</strong> printed on your receipt 
                or your <strong>Registered Mobile Number</strong> to see live dispatch, vehicle location, and delivery status.
              </p>
            </div>

            {/* Prompt Search Form */}
            <form onSubmit={handleSearch} className="ask-form-card">
              <div className="ask-input-group">
                <label htmlFor="track-bill-input" className="ask-input-label">
                  Bill Number / Order Code OR Mobile Number:
                </label>
                <div className="ask-input-wrap">
                  <Search size={20} className="ask-search-icon" />
                  <input
                    id="track-bill-input"
                    name="billNumberOrPhone"
                    type="text"
                    autoComplete="on"
                    placeholder="e.g. SEF-2026-8941 or 98401 23456"
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setSearchError('');
                    }}
                    className="ask-input"
                    autoFocus
                  />
                  {searchTerm && (
                    <button 
                      type="button" 
                      className="ask-clear-input-btn"
                      onClick={() => setSearchTerm('')}
                    >
                      <X size={15} />
                    </button>
                  )}
                </div>
              </div>

              {searchError && (
                <div className="ask-error-banner animate-fade-in">
                  <AlertCircle size={18} />
                  <span>{searchError}</span>
                </div>
              )}

              <button type="submit" className="ask-submit-btn">
                <span>Track Order Status</span>
                <ArrowRight size={18} />
              </button>
            </form>

            {/* Quick Demo Bills Assistance */}
            {orders.length > 0 && (
              <div className="demo-bills-section">
                <span className="demo-bills-title">Quick Test with Demo Bills:</span>
                <div className="demo-pills-list">
                  {orders.slice(0, 3).map((o) => (
                    <button
                      key={o.id}
                      type="button"
                      className="demo-pill-btn"
                      onClick={() => handleSelectQuickOrder(o)}
                      title={`Track Bill #${o.id}`}
                    >
                      <FileText size={13} />
                      <strong>Bill #{o.id}</strong>
                      <span className="demo-pill-status">({o.status})</span>
                    </button>
                  ))}
                  {orders[0]?.customer?.phone && (
                    <button
                      type="button"
                      className="demo-pill-btn"
                      onClick={() => {
                        setSearchTerm(orders[0].customer.phone);
                        const clean = orders[0].customer.phone.replace(/[\s\-+]/g, '');
                        const found = orders.find(ord => (ord.customer?.phone || '').replace(/[\s\-+]/g, '').includes(clean));
                        if (found) setSearchedOrder(found);
                      }}
                      title="Track using Customer Phone"
                    >
                      <Phone size={13} />
                      <strong>Phone: {orders[0].customer.phone}</strong>
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Information Tips Footer */}
            <div className="track-help-footer">
              <div className="help-tip-item">
                <ShieldCheck size={16} className="help-icon" />
                <span>Bill Number can be found at the top-right of your purchase invoice or SMS update.</span>
              </div>
              <div className="help-tip-item">
                <MessageCircle size={16} className="help-icon" />
                <span>
                  Having trouble finding your bill?{' '}
                  <a 
                    href="https://wa.me/916383056338?text=Hi%20Sardar%20Mart%20Furniture%20and%20Home%20Appliances%2C%20I%20need%20help%20tracking%20my%20order%20status." 
                    target="_blank" 
                    rel="noreferrer"
                    className="wa-help-link"
                  >
                    Chat on WhatsApp
                  </a>
                </span>
              </div>
            </div>
          </div>
        ) : (
          /* STEP 2: When order IS found -> Display complete timeline & order info */
          <div className="order-found-screen animate-fade-in">
            {/* Top Back Navigation Bar */}
            <div className="track-back-bar">
              <button className="track-back-btn" onClick={handleResetSearch}>
                <ArrowLeft size={16} />
                <span>Track Another Bill / Phone</span>
              </button>
              <div className="current-bill-indicator">
                Tracking Bill: <strong>#{searchedOrder.id}</strong>
              </div>
            </div>

            {/* Status Summary Banner */}
            <div className="order-summary-card">
              <div className="summary-left">
                <span className="order-tag">Bill / Order Reference</span>
                <h3 className="order-id">#{searchedOrder.id}</h3>
                <p className="order-date">Date: {searchedOrder.date}</p>
              </div>

              <div className="summary-right">
                <div className={`status-pill ${searchedOrder.status.toLowerCase().replace(/\s+/g, '-')}`}>
                  <span className="status-dot"></span>
                  <strong>{searchedOrder.status}</strong>
                </div>
                <div className="delivery-courier">
                  <Truck size={14} /> Fleet: {searchedOrder.courier || 'Sardar Express Fleet'}
                </div>
              </div>
            </div>

            {/* Visual Step-by-Step Timeline Stepper */}
            <div className="timeline-container">
              <div className="timeline-header-row">
                <h4 className="timeline-heading">Delivery Status Timeline</h4>
                <span className="timeline-step-indicator">
                  Step {Math.max(1, currentStep + 1)} of {steps.length}
                </span>
              </div>

              <div className="stepper-horizontal">
                {steps.map((step, idx) => {
                  const Icon = step.icon;
                  const isCompleted = currentStep >= idx;
                  const isCurrent = currentStep === idx;
                  return (
                    <div 
                      key={idx} 
                      className={`step-item ${isCompleted ? 'completed' : ''} ${isCurrent ? 'current' : ''}`}
                    >
                      <div className="step-circle">
                        <Icon size={16} />
                      </div>
                      <div className="step-label">
                        <strong>{step.title}</strong>
                        <small>{step.desc}</small>
                      </div>
                      {idx < steps.length - 1 && (
                        <div className={`step-connector ${currentStep > idx ? 'connector-done' : ''}`}></div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Two Column Delivery & Payment Grid */}
            <div className="details-two-col">
              {/* Delivery Address Details */}
              <div className="delivery-details-card">
                <div className="card-head">
                  <MapPin size={16} />
                  <h4>Delivery Address</h4>
                </div>
                <p className="recipient-name"><strong>{searchedOrder.customer?.name}</strong></p>
                <p className="recipient-address">
                  {searchedOrder.customer?.address}<br />
                  {searchedOrder.customer?.city} - {searchedOrder.customer?.pincode}
                </p>
                <div className="recipient-phone">
                  <Phone size={13} /> {searchedOrder.customer?.phone}
                </div>
                {searchedOrder.notes && (
                  <div className="delivery-notes-box">
                    <small>Delivery Instructions:</small>
                    <p>{searchedOrder.notes}</p>
                  </div>
                )}
              </div>

              {/* Billing & Invoice Details */}
              <div className="delivery-details-card">
                <div className="card-head">
                  <FileText size={16} />
                  <h4>Billing &amp; Payment</h4>
                </div>
                <div className="pay-row">
                  <span>Payment Mode:</span>
                  <strong>{searchedOrder.paymentMethod}</strong>
                </div>
                <div className="pay-row">
                  <span>Payment Status:</span>
                  <span className="pay-status-tag">{searchedOrder.paymentStatus}</span>
                </div>
                <div className="pay-row total-pay-row">
                  <span>Total Bill Amount:</span>
                  <strong className="grand-price">{formatPrice(searchedOrder.total)}</strong>
                </div>

                <div className="invoice-actions-group">
                  <button 
                    className="btn-view-invoice-link"
                    onClick={() => onViewInvoice && onViewInvoice(searchedOrder)}
                  >
                    <FileText size={14} /> View &amp; Print Tax Invoice (Bill)
                  </button>
                  <a 
                    href={`https://wa.me/916383056338?text=Hi%20Sardar%20Mart%20Furniture%20and%20Home%20Appliances%2C%20I%20am%20inquiring%20about%20my%20Bill%20%23${searchedOrder.id}`}
                    target="_blank" 
                    rel="noreferrer"
                    className="btn-order-wa"
                  >
                    <MessageCircle size={14} /> WhatsApp Support
                  </a>
                </div>
              </div>
            </div>

            {/* Items in this Shipment */}
            <div className="order-items-list-card">
              <h4>Items in this Shipment ({searchedOrder.items?.length || 0})</h4>
              <div className="items-table-wrap">
                {searchedOrder.items?.map((item, idx) => (
                  <div key={idx} className="track-item-row">
                    <img 
                      src={item.image || products.find(p => String(p.id) === String(item.id))?.image || 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=200&q=80'} 
                      alt={item.name} 
                      className="track-item-img" 
                    />
                    <div className="track-item-info">
                      <div className="track-item-name">{item.name}</div>
                      <div className="track-item-meta">
                        Qty: <strong>{item.quantity}</strong> × {formatPrice(item.price)}
                      </div>
                    </div>
                    <div className="track-item-total">
                      {formatPrice(item.price * item.quantity)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

      </div>

      <style>{`
        .track-modal-backdrop {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(15, 23, 42, 0.72);
          backdrop-filter: blur(4px);
          z-index: 1100;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 16px;
        }
        .track-modal-panel {
          background: #ffffff;
          border-radius: 16px;
          max-width: 780px;
          width: 100%;
          max-height: 92vh;
          overflow-y: auto;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.35);
          display: flex;
          flex-direction: column;
        }

        /* Header */
        .track-modal-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 20px 24px;
          background: #2b170e;
          color: #ffffff;
          border-radius: 16px 16px 0 0;
        }
        .header-left-col {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .track-badge {
          background: rgba(255, 255, 255, 0.15);
          color: #fde68a;
          padding: 2px 10px;
          border-radius: 20px;
          font-size: 0.72rem;
          font-weight: 700;
          letter-spacing: 0.4px;
          display: inline-block;
          width: fit-content;
        }
        .track-modal-header h2 {
          font-size: 1.25rem;
          margin: 0;
          color: #ffffff;
        }
        .track-close-btn {
          background: rgba(255, 255, 255, 0.1);
          color: #ffffff;
          border: none;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: background 0.2s ease;
        }
        .track-close-btn:hover {
          background: rgba(255, 255, 255, 0.25);
        }

        /* STEP 1: Ask Bill Number or Phone Screen */
        .ask-order-screen {
          padding: 36px 32px 30px;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }
        .ask-hero-icon-wrap {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background: #fef3c7;
          color: #d97706;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 20px;
          box-shadow: 0 10px 25px rgba(217, 119, 6, 0.18);
        }
        .ask-icon-pulse {
          animation: iconFloat 2.5s ease-in-out infinite;
        }
        @keyframes iconFloat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }

        .ask-intro-text h3 {
          font-size: 1.35rem;
          color: #1e293b;
          font-weight: 800;
          margin-bottom: 8px;
        }
        .ask-intro-text p {
          font-size: 0.92rem;
          color: #64748b;
          max-width: 520px;
          line-height: 1.5;
          margin-bottom: 24px;
        }
        .ask-intro-text strong {
          color: #2b170e;
        }

        /* Form Card */
        .ask-form-card {
          width: 100%;
          max-width: 540px;
          background: #f8fafc;
          border: 1.5px solid #e2e8f0;
          border-radius: 12px;
          padding: 22px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
          margin-bottom: 24px;
          text-align: left;
        }
        .ask-input-group {
          margin-bottom: 16px;
        }
        .ask-input-label {
          display: block;
          font-size: 0.85rem;
          font-weight: 700;
          color: #334155;
          margin-bottom: 8px;
        }
        .ask-input-wrap {
          position: relative;
          display: flex;
          align-items: center;
        }
        .ask-search-icon {
          position: absolute;
          left: 14px;
          color: #94a3b8;
          pointer-events: none;
        }
        .ask-input {
          width: 100%;
          padding: 13px 40px 13px 44px;
          border: 2px solid #cbd5e1;
          border-radius: 8px;
          font-size: 0.98rem;
          font-weight: 600;
          color: #0f172a;
          outline: none;
          background: #ffffff;
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
        }
        .ask-input:focus {
          border-color: #d97706;
          box-shadow: 0 0 0 4px rgba(217, 119, 6, 0.15);
        }
        .ask-clear-input-btn {
          position: absolute;
          right: 12px;
          background: #e2e8f0;
          color: #64748b;
          border: none;
          width: 22px;
          height: 22px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }

        .ask-error-banner {
          background: #fef2f2;
          color: #b91c1c;
          border: 1px solid #fecaca;
          padding: 10px 14px;
          border-radius: 8px;
          font-size: 0.86rem;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 16px;
        }

        .ask-submit-btn {
          width: 100%;
          background: #d97706;
          color: #ffffff;
          border: none;
          padding: 13px;
          border-radius: 8px;
          font-weight: 700;
          font-size: 0.98rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          box-shadow: 0 4px 14px rgba(217, 119, 6, 0.3);
          transition: background 0.2s ease, transform 0.1s ease;
        }
        .ask-submit-btn:hover {
          background: #b45309;
          transform: translateY(-1px);
        }

        /* Demo Bills Pill Section */
        .demo-bills-section {
          width: 100%;
          max-width: 540px;
          margin-bottom: 24px;
        }
        .demo-bills-title {
          display: block;
          font-size: 0.8rem;
          font-weight: 700;
          color: #64748b;
          margin-bottom: 8px;
          text-align: left;
        }
        .demo-pills-list {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }
        .demo-pill-btn {
          background: #f1f5f9;
          color: #334155;
          border: 1px solid #cbd5e1;
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 0.78rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 6px;
          transition: all 0.2s ease;
        }
        .demo-pill-btn:hover {
          background: #fef3c7;
          border-color: #d97706;
          color: #92400e;
        }
        .demo-pill-status {
          color: #64748b;
          font-size: 0.72rem;
        }

        /* Help Footer */
        .track-help-footer {
          width: 100%;
          max-width: 540px;
          padding-top: 16px;
          border-top: 1px dashed #e2e8f0;
          display: flex;
          flex-direction: column;
          gap: 8px;
          text-align: left;
        }
        .help-tip-item {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.82rem;
          color: #64748b;
        }
        .help-icon {
          color: #d97706;
          flex-shrink: 0;
        }
        .wa-help-link {
          color: #16a34a;
          font-weight: 700;
          text-decoration: underline;
        }

        /* STEP 2: When Order is Found */
        .order-found-screen {
          padding: 20px 24px 28px;
        }
        .track-back-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-bottom: 14px;
          margin-bottom: 16px;
          border-bottom: 1px solid #e2e8f0;
        }
        .track-back-btn {
          background: #f1f5f9;
          color: #334155;
          border: 1px solid #cbd5e1;
          padding: 7px 14px;
          border-radius: 8px;
          font-size: 0.84rem;
          font-weight: 700;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 6px;
          transition: all 0.2s ease;
        }
        .track-back-btn:hover {
          background: #e2e8f0;
          color: #0f172a;
        }
        .current-bill-indicator {
          font-size: 0.85rem;
          color: #64748b;
        }
        .current-bill-indicator strong {
          color: #d97706;
        }

        /* Status Highlight Banner */
        .order-summary-card {
          background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
          border: 1px solid #cbd5e1;
          border-radius: 12px;
          padding: 16px 20px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 20px;
          flex-wrap: wrap;
          gap: 12px;
        }
        .order-tag {
          font-size: 0.75rem;
          font-weight: 700;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .order-id {
          font-size: 1.4rem;
          color: #1e293b;
          font-weight: 800;
          margin: 2px 0 4px;
        }
        .order-date {
          font-size: 0.82rem;
          color: #64748b;
          margin: 0;
        }
        .summary-right {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 6px;
        }
        .status-pill {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 6px 14px;
          border-radius: 20px;
          font-size: 0.88rem;
          font-weight: 700;
        }
        .status-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: currentColor;
        }
        .status-pill.order-placed {
          background: #e0f2fe;
          color: #0369a1;
        }
        .status-pill.confirmed {
          background: #fef3c7;
          color: #92400e;
        }
        .status-pill.packed {
          background: #e0e7ff;
          color: #4338ca;
        }
        .status-pill.out-for-delivery {
          background: #fed7aa;
          color: #9a3412;
        }
        .status-pill.delivered {
          background: #dcfce7;
          color: #166534;
        }
        .status-pill.cancelled {
          background: #fee2e2;
          color: #991b1b;
        }
        .delivery-courier {
          font-size: 0.78rem;
          color: #64748b;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        /* Timeline Stepper */
        .timeline-container {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 20px 22px;
          margin-bottom: 20px;
        }
        .timeline-header-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 22px;
        }
        .timeline-heading {
          font-size: 0.95rem;
          font-weight: 800;
          color: #1e293b;
          margin: 0;
        }
        .timeline-step-indicator {
          font-size: 0.78rem;
          font-weight: 700;
          color: #d97706;
          background: #fef3c7;
          padding: 2px 8px;
          border-radius: 12px;
        }

        .stepper-horizontal {
          display: flex;
          justify-content: space-between;
          position: relative;
        }
        .step-item {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          position: relative;
        }
        .step-circle {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          background: #f1f5f9;
          color: #94a3b8;
          border: 2px solid #cbd5e1;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 8px;
          z-index: 2;
          transition: all 0.3s ease;
        }
        .step-item.completed .step-circle {
          background: #16a34a;
          color: #ffffff;
          border-color: #16a34a;
        }
        .step-item.current .step-circle {
          background: #d97706;
          color: #ffffff;
          border-color: #d97706;
          box-shadow: 0 0 0 4px rgba(217, 119, 6, 0.2);
          transform: scale(1.08);
        }

        .step-label strong {
          display: block;
          font-size: 0.78rem;
          color: #1e293b;
          line-height: 1.2;
        }
        .step-label small {
          font-size: 0.7rem;
          color: #64748b;
          display: block;
          margin-top: 2px;
        }
        .step-item.current .step-label strong {
          color: #d97706;
          font-weight: 800;
        }

        .step-connector {
          position: absolute;
          top: 19px;
          left: 50%;
          width: 100%;
          height: 3px;
          background: #e2e8f0;
          z-index: 1;
        }
        .step-connector.connector-done {
          background: #16a34a;
        }

        /* Two Column Grid */
        .details-two-col {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          margin-bottom: 20px;
        }
        .delivery-details-card {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 16px 18px;
        }
        .card-head {
          display: flex;
          align-items: center;
          gap: 6px;
          color: #2b170e;
          font-weight: 700;
          margin-bottom: 12px;
          padding-bottom: 8px;
          border-bottom: 1px solid #e2e8f0;
        }
        .card-head h4 {
          font-size: 0.9rem;
          margin: 0;
        }

        .recipient-name {
          font-size: 0.95rem;
          color: #0f172a;
          margin-bottom: 4px;
        }
        .recipient-address {
          font-size: 0.85rem;
          color: #475569;
          line-height: 1.4;
          margin-bottom: 8px;
        }
        .recipient-phone {
          font-size: 0.82rem;
          color: #64748b;
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .delivery-notes-box {
          margin-top: 10px;
          padding: 8px 10px;
          background: #fef3c7;
          border-radius: 6px;
          border-left: 3px solid #d97706;
        }
        .delivery-notes-box small {
          display: block;
          font-weight: 700;
          color: #92400e;
          font-size: 0.72rem;
        }
        .delivery-notes-box p {
          font-size: 0.8rem;
          color: #78350f;
          margin: 2px 0 0;
        }

        .pay-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.85rem;
          color: #64748b;
          margin-bottom: 8px;
        }
        .pay-row strong {
          color: #1e293b;
        }
        .pay-status-tag {
          background: #dcfce7;
          color: #166534;
          padding: 2px 8px;
          border-radius: 12px;
          font-size: 0.75rem;
          font-weight: 700;
        }
        .total-pay-row {
          margin-top: 10px;
          padding-top: 10px;
          border-top: 1px dashed #cbd5e1;
        }
        .grand-price {
          font-size: 1.15rem;
          color: #d97706;
          font-weight: 800;
        }

        .invoice-actions-group {
          margin-top: 14px;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .btn-view-invoice-link {
          background: #2b170e;
          color: #ffffff;
          border: none;
          padding: 9px 12px;
          border-radius: 8px;
          font-size: 0.82rem;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          cursor: pointer;
          transition: background 0.2s ease;
        }
        .btn-view-invoice-link:hover {
          background: #452414;
        }
        .btn-order-wa {
          background: #25d366;
          color: #ffffff;
          padding: 8px 12px;
          border-radius: 8px;
          font-size: 0.82rem;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          text-decoration: none;
          transition: background 0.2s ease;
        }
        .btn-order-wa:hover {
          background: #1eb954;
        }

        /* Items in Shipment */
        .order-items-list-card {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 16px 18px;
        }
        .order-items-list-card h4 {
          font-size: 0.9rem;
          font-weight: 800;
          color: #1e293b;
          margin-bottom: 12px;
        }
        .items-table-wrap {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .track-item-row {
          display: flex;
          align-items: center;
          gap: 12px;
          padding-bottom: 10px;
          border-bottom: 1px solid #f1f5f9;
        }
        .track-item-row:last-child {
          border-bottom: none;
          padding-bottom: 0;
        }
        .track-item-img {
          width: 52px;
          height: 52px;
          object-fit: cover;
          border-radius: 8px;
          border: 1px solid #e2e8f0;
          flex-shrink: 0;
        }
        .track-item-info {
          flex: 1;
        }
        .track-item-name {
          font-size: 0.88rem;
          font-weight: 700;
          color: #1e293b;
        }
        .track-item-meta {
          font-size: 0.78rem;
          color: #64748b;
          margin-top: 2px;
        }
        .track-item-total {
          font-size: 0.92rem;
          font-weight: 800;
          color: #0f172a;
        }

        @media (max-width: 640px) {
          .track-modal-backdrop {
            padding: 8px;
          }
          .track-modal-panel {
            max-height: 96vh;
            border-radius: 12px;
          }
          .ask-order-screen {
            padding: 24px 16px;
          }
          .order-found-screen {
            padding: 16px;
          }
          .details-two-col {
            grid-template-columns: 1fr;
          }
          .stepper-horizontal {
            flex-direction: column;
            align-items: flex-start;
            gap: 18px;
            padding-left: 10px;
          }
          .step-item {
            flex-direction: row;
            text-align: left;
            gap: 12px;
          }
          .step-connector {
            display: none;
          }
          .step-circle {
            margin-bottom: 0;
            flex-shrink: 0;
          }
        }

        @media (max-width: 480px) {
          .track-modal-header {
            padding: 14px 16px;
          }
          .track-modal-header h2 {
            font-size: 1.1rem;
          }
          .ask-order-screen {
            padding: 20px 12px;
          }
          .ask-hero-icon-wrap {
            width: 60px;
            height: 60px;
            margin-bottom: 14px;
          }
          .ask-form-card {
            padding: 14px 12px;
          }
          .order-id {
            font-size: 1.15rem;
          }
          .track-item-img {
            width: 44px;
            height: 44px;
          }
          .track-item-name {
            font-size: 0.82rem;
          }
          .track-item-total {
            font-size: 0.85rem;
          }
        }
      `}</style>
    </div>
  );
}
