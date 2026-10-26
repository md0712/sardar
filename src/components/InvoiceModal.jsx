import React from 'react';
import { X, Printer, Download, CheckCircle, Package, MapPin, Phone, Mail, ShieldCheck } from 'lucide-react';

export default function InvoiceModal({ isOpen, onClose, order }) {
  if (!isOpen || !order) return null;

  const {
    id,
    date,
    customer = {},
    items = [],
    subtotal = 0,
    discount = 0,
    delivery = 0,
    total = 0,
    paymentMethod = 'UPI',
    paymentStatus = 'Paid',
    status = 'Confirmed',
    gstRate: orderGstRate,
    taxableAmount: orderTaxableAmount,
    cgst: orderCgst,
    sgst: orderSgst,
    gstAmount: orderGstAmount
  } = order;

  const formatPrice = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val || 0);
  };

  const handlePrint = () => {
    document.body.classList.add('invoice-printing-active');
    window.print();
  };

  React.useEffect(() => {
    const handleAfterPrint = () => {
      document.body.classList.remove('invoice-printing-active');
    };
    window.addEventListener('afterprint', handleAfterPrint);
    return () => {
      window.removeEventListener('afterprint', handleAfterPrint);
      document.body.classList.remove('invoice-printing-active');
    };
  }, []);

  // Determine if GST is applied or 0%
  // If order explicitly has gstRate: 0, or cgst: 0, or gstAmount: 0, or order comes from user page with 0% tax:
  let effectiveGstRate = 0;
  let taxableAmount = 0;
  let cgst = 0;
  let sgst = 0;
  let gstAmount = 0;

  if (orderGstRate !== undefined && Number(orderGstRate) > 0) {
    effectiveGstRate = Number(orderGstRate);
  } else if (orderGstAmount !== undefined && Number(orderGstAmount) > 0) {
    const base = Number(orderTaxableAmount) || Math.max(1, Number(total) - Number(orderGstAmount));
    effectiveGstRate = Math.round((Number(orderGstAmount) / base) * 100);
  } else if (orderCgst !== undefined && Number(orderCgst) > 0) {
    const totalGst = Number(orderCgst) * 2;
    const base = Number(orderTaxableAmount) || Math.max(1, Number(total) - totalGst);
    effectiveGstRate = Math.round((totalGst / base) * 100);
  }

  if (effectiveGstRate > 0) {
    taxableAmount = orderTaxableAmount !== undefined 
      ? Number(orderTaxableAmount) 
      : Math.round(Number(total) / (1 + effectiveGstRate / 100));
    gstAmount = orderGstAmount !== undefined 
      ? Number(orderGstAmount) 
      : (Number(total) - taxableAmount);
    cgst = orderCgst !== undefined ? Number(orderCgst) : Math.round(gstAmount / 2);
    sgst = orderSgst !== undefined ? Number(orderSgst) : (gstAmount - cgst);
  } else {
    // 0% GST (Zero-rated / no GST added, exact amount from user page)
    effectiveGstRate = 0;
    cgst = 0;
    sgst = 0;
    gstAmount = 0;
    taxableAmount = orderTaxableAmount !== undefined 
      ? Number(orderTaxableAmount) 
      : Math.max(0, (Number(subtotal) || Number(total)) - (Number(discount) || 0));
  }

  const halfGstRate = effectiveGstRate > 0 ? (effectiveGstRate / 2) : 0;
  const deliveryCharge = Number(order.delivery ?? order.deliveryFee ?? delivery ?? 0) || 0;
  const computedInvoiceTotal = (total && Number(total) > 0 && (order.delivery !== undefined || deliveryCharge === 0))
    ? Number(total)
    : (Math.max(0, (Number(subtotal) || 0) - (Number(discount) || 0)) + deliveryCharge + (Number(gstAmount) || 0));

  return (
    <div className="invoice-modal-backdrop" onClick={onClose}>
      <div className="invoice-modal-container" onClick={(e) => e.stopPropagation()}>
        {/* Top Control Bar (Hidden during Print) */}
        <div className="invoice-controls-bar no-print">
          <div className="controls-left">
            <span className="invoice-pill-tag">Tax Invoice &amp; Customer Receipt</span>
            <span className="invoice-order-ref">#{id}</span>
          </div>
          <div className="controls-right">
            <button className="btn-print" onClick={handlePrint} title="Print Invoice / Save as PDF">
              <Printer size={16} /> Print / Save PDF
            </button>
            <button className="btn-close-invoice" onClick={onClose} title="Close Invoice">
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Printable Tax Invoice Sheet */}
        <div className="invoice-sheet" id="printable-invoice">
          {/* Header */}
          <div className="invoice-header">
            <div className="brand-block">
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '8px' }}>
                <img 
                  src="/logo.png" 
                  alt="Sardar Mart Furniture and Home Appliances" 
                  style={{ height: '52px', width: 'auto', objectFit: 'contain', borderRadius: '6px' }} 
                />
                <div>
                  <div className="invoice-brand-title" style={{ fontSize: '1.4rem' }}>
                    Sardar <span>Mart</span>
                  </div>
                  <p className="invoice-brand-sub" style={{ margin: 0 }}>FURNITURE AND HOME APPLIANCES • CHENNAI</p>
                </div>
              </div>
              <p className="invoice-company-details">
                Sardar Mart Private Limited (Furniture &amp; Home Appliances)<br />
                No. 192, E.H Road, Cholan nagar, Vyasarpadi, Erukancheri<br />
                Chennai, Tamil Nadu - 600039<br />
                <strong>GSTIN:</strong> 33DVKPR2334L1Z9 | <strong>Phone:</strong> +91 6383056338 / +91 9344623632<br />
                <strong>Email:</strong> sardarmart64@gmail.com | <strong>Instagram:</strong> @sardar_mart_ch_39
              </p>
            </div>

            <div className="invoice-meta-block">
              <div className="invoice-title-stamp">TAX INVOICE</div>
              <table className="meta-table">
                <tbody>
                  <tr>
                    <td><strong>Invoice No:</strong></td>
                    <td>INV-{id}</td>
                  </tr>
                  <tr>
                    <td><strong>Invoice Date:</strong></td>
                    <td>{date}</td>
                  </tr>
                  <tr>
                    <td><strong>Payment Mode:</strong></td>
                    <td>{paymentMethod}</td>
                  </tr>
                  <tr>
                    <td><strong>Payment Status:</strong></td>
                    <td>
                      <span className={`status-tag ${paymentStatus.toLowerCase().includes('paid') ? 'paid' : 'pending'}`}>
                        {paymentStatus}
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td><strong>Order Status:</strong></td>
                    <td>
                      <span className="order-status-badge">{status}</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <hr className="invoice-divider" />

          {/* Billed To & Shipped To */}
          <div className="invoice-parties-row">
            <div className="party-box">
              <h4>Billed &amp; Shipped To:</h4>
              <p className="customer-name"><strong>{customer.name || 'Valued Customer'}</strong></p>
              <p className="customer-address">
                {customer.address || 'Showroom In-Store Order'}<br />
                {customer.city ? `${customer.city} - ${customer.pincode || ''}` : 'Chennai, Tamil Nadu'}<br />
                <strong>Phone:</strong> {customer.phone || '+91 6383056338'}
              </p>
            </div>
            <div className="party-box party-right">
              <h4>Dispatch &amp; Delivery Logistics:</h4>
              <p>
                <strong>{order.courier || 'Porter Platform Logistics'}</strong><br />
                Doorstep Delivery &amp; Certified Handover<br />
                Direct Manufacturer Warranty Active<br />
                <strong>Dedicated Support:</strong> 1800-425-9988
              </p>
            </div>
          </div>

          {/* Items Table */}
          <table className="invoice-items-table">
            <thead>
              <tr>
                <th style={{ width: '40px' }}>#</th>
                <th>Item Description</th>
                <th style={{ width: '80px', textAlign: 'center' }}>Qty</th>
                <th style={{ width: '110px', textAlign: 'right' }}>Unit Rate</th>
                <th style={{ width: '80px', textAlign: 'center' }}>GST</th>
                <th style={{ width: '120px', textAlign: 'right' }}>Amount</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>
                    <strong>{item.name}</strong>
                    <div className="item-sub-sku">SKU: {item.id}</div>
                  </td>
                  <td style={{ textAlign: 'center' }}>{item.quantity}</td>
                  <td style={{ textAlign: 'right' }}>{formatPrice(item.price)}</td>
                  <td style={{ textAlign: 'center' }}>{effectiveGstRate > 0 ? `${effectiveGstRate}% Incl.` : '0%'}</td>
                  <td style={{ textAlign: 'right' }}><strong>{formatPrice(item.price * item.quantity)}</strong></td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Summary & Tax Calculation */}
          <div className="invoice-summary-row">
            <div className="tax-breakdown-box">
              <h5>Tax Summary (Goods &amp; Services Tax)</h5>
              <div className="tax-table">
                <div className="tax-row">
                  <span>Taxable Value:</span>
                  <span>{formatPrice(taxableAmount)}</span>
                </div>
                <div className="tax-row">
                  <span>CGST ({halfGstRate}%):</span>
                  <span>{formatPrice(cgst)}</span>
                </div>
                <div className="tax-row">
                  <span>SGST ({halfGstRate}%):</span>
                  <span>{formatPrice(sgst)}</span>
                </div>
                <div className="tax-row">
                  <span>Total Tax Included:</span>
                  <span>{formatPrice(gstAmount)}</span>
                </div>
              </div>
            </div>

            <div className="totals-box">
              <div className="calc-row">
                <span>Subtotal:</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              {discount > 0 && (
                <div className="calc-row discount-calc">
                  <span>Promotional Discount:</span>
                  <span>-{formatPrice(discount)}</span>
                </div>
              )}
              <div className="calc-row">
                <span>Delivery Charge:</span>
                <span style={{ fontWeight: 600, color: '#0f172a' }}>
                  {formatPrice(deliveryCharge)}
                </span>
              </div>
              <div className="calc-row grand-total-calc">
                <strong>Invoice Total:</strong>
                <strong className="grand-price">{formatPrice(computedInvoiceTotal)}</strong>
              </div>
              <div className="amount-in-words">
                {effectiveGstRate > 0 
                  ? 'Inclusive of all applicable Indian Central & State Taxes.' 
                  : 'Zero-Rated / No GST Added (0% Tax).'}
              </div>
            </div>
          </div>

          {/* Terms & Footer Signature */}
          <div className="invoice-terms-row">
            <div className="terms-col">
              <h5>Terms &amp; Conditions:</h5>
              <ol>
                <li>Goods once sold are covered under official manufacturer structural/component warranties.</li>
                <li>Free doorstep installation and unpacking provided by <strong>Sardar Mart</strong> Furniture and Home Appliances certified technicians.</li>
                <li>7-day return/replacement policy applies for manufacturing transit damages.</li>
                <li>Jurisdiction of all disputes shall be the courts of Chennai, Tamil Nadu.</li>
              </ol>
            </div>
            <div className="signature-col">
              <div className="signature-line">
                <div className="seal-badge">SARDAR<br />VERIFIED</div>
              </div>
              <p>Authorized Signatory</p>
              <small>Sardar Mart Private Limited</small>
            </div>
          </div>

          <div className="invoice-footer-note">
            *** This is a computer generated legal tax invoice issued by <strong>Sardar Mart</strong> Furniture and Home Appliances ***
          </div>
        </div>
      </div>

      <style>{`
        .invoice-modal-backdrop {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(15, 23, 42, 0.75);
          backdrop-filter: blur(4px);
          z-index: 1200;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          overflow-y: auto;
        }
        .invoice-modal-container {
          background: #ffffff;
          border-radius: 12px;
          max-width: 820px;
          width: 100%;
          max-height: 94vh;
          overflow-y: auto;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.35);
          display: flex;
          flex-direction: column;
        }

        /* Top Controls */
        .invoice-controls-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 14px 24px;
          background: #2b170e;
          color: #ffffff;
          border-radius: 12px 12px 0 0;
        }
        .controls-left {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .invoice-pill-tag {
          background: rgba(255, 255, 255, 0.15);
          padding: 3px 10px;
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: 700;
          letter-spacing: 0.5px;
        }
        .invoice-order-ref {
          font-weight: 800;
          color: #fcd34d;
          font-size: 0.95rem;
        }
        .controls-right {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .btn-print {
          background: #f59e0b;
          color: #1e1008;
          border: none;
          padding: 7px 14px;
          border-radius: 6px;
          font-weight: 700;
          font-size: 0.82rem;
          display: flex;
          align-items: center;
          gap: 6px;
          cursor: pointer;
          transition: background 0.2s ease;
        }
        .btn-print:hover {
          background: #d97706;
          color: #ffffff;
        }
        .btn-close-invoice {
          background: rgba(255, 255, 255, 0.1);
          color: #ffffff;
          border: none;
          width: 32px;
          height: 32px;
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: background 0.2s ease;
        }
        .btn-close-invoice:hover {
          background: rgba(255, 255, 255, 0.25);
        }

        /* Printable Sheet */
        .invoice-sheet {
          padding: 32px 36px;
          background: #ffffff;
          color: #1f2937;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          font-size: 0.88rem;
          line-height: 1.45;
        }

        .invoice-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 20px;
        }
        .invoice-brand-title {
          font-family: var(--font-heading);
          font-size: 1.8rem;
          font-weight: 800;
          color: #2b170e;
          letter-spacing: -0.5px;
        }
        .invoice-brand-title span {
          color: #d97706;
          font-weight: 800;
        }
        .invoice-brand-sub {
          font-size: 0.72rem;
          letter-spacing: 1px;
          font-weight: 500;
          color: #6b7280;
          margin-bottom: 8px;
        }
        .invoice-company-details {
          font-size: 0.78rem;
          color: #4b5563;
          line-height: 1.4;
        }

        .invoice-meta-block {
          text-align: right;
        }
        .invoice-title-stamp {
          font-size: 1.3rem;
          font-weight: 900;
          color: #1e293b;
          letter-spacing: 1px;
          margin-bottom: 8px;
        }
        .meta-table {
          font-size: 0.8rem;
          border-collapse: collapse;
          margin-left: auto;
        }
        .meta-table td {
          padding: 2px 6px;
          text-align: left;
        }
        .status-tag {
          padding: 2px 8px;
          border-radius: 4px;
          font-weight: 700;
          font-size: 0.75rem;
        }
        .status-tag.paid {
          background: #dcfce7;
          color: #15803d;
        }
        .status-tag.pending {
          background: #fef3c7;
          color: #b45309;
        }
        .order-status-badge {
          background: #eff6ff;
          color: #1d4ed8;
          padding: 2px 8px;
          border-radius: 4px;
          font-weight: 700;
        }

        .invoice-divider {
          border: none;
          border-top: 1.5px solid #e5e7eb;
          margin: 18px 0;
        }

        /* Parties */
        .invoice-parties-row {
          display: flex;
          justify-content: space-between;
          gap: 20px;
          background: #f8fafc;
          padding: 14px 18px;
          border-radius: 8px;
          margin-bottom: 20px;
          border: 1px solid #e2e8f0;
        }
        .party-box h4 {
          font-size: 0.8rem;
          text-transform: uppercase;
          color: #64748b;
          letter-spacing: 0.5px;
          margin-bottom: 4px;
        }
        .customer-name {
          color: #0f172a;
          font-size: 0.95rem;
        }
        .customer-address {
          font-size: 0.8rem;
          color: #475569;
        }

        /* Table */
        .invoice-items-table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 20px;
        }
        .invoice-items-table th {
          background: #f1f5f9;
          color: #334155;
          font-weight: 700;
          font-size: 0.8rem;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          padding: 10px 12px;
          border-top: 1px solid #cbd5e1;
          border-bottom: 2px solid #cbd5e1;
        }
        .invoice-items-table td {
          padding: 12px;
          border-bottom: 1px solid #e2e8f0;
          font-size: 0.85rem;
        }
        .item-sub-sku {
          font-size: 0.72rem;
          color: #94a3b8;
          font-weight: 500;
        }

        /* Summary */
        .invoice-summary-row {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 20px;
          margin-bottom: 24px;
        }
        .tax-breakdown-box {
          flex: 1;
          background: #fafafa;
          border: 1px solid #e5e7eb;
          border-radius: 6px;
          padding: 12px 16px;
        }
        .tax-breakdown-box h5 {
          font-size: 0.78rem;
          text-transform: uppercase;
          color: #64748b;
          margin-bottom: 8px;
        }
        .tax-table {
          font-size: 0.78rem;
          color: #4b5563;
        }
        .tax-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 3px;
        }

        .totals-box {
          width: 320px;
          background: #fffbeb;
          border: 1px solid #fde68a;
          border-radius: 6px;
          padding: 14px 18px;
        }
        .calc-row {
          display: flex;
          justify-content: space-between;
          font-size: 0.85rem;
          margin-bottom: 6px;
          color: #4b5563;
        }
        .discount-calc {
          color: #dc2626;
          font-weight: 600;
        }
        .free-tag {
          color: #16a34a;
          font-weight: 700;
        }
        .grand-total-calc {
          border-top: 1.5px dashed #d97706;
          padding-top: 8px;
          margin-top: 8px;
          font-size: 1.05rem;
          color: #78350f;
        }
        .grand-price {
          color: #92400e;
        }
        .amount-in-words {
          font-size: 0.7rem;
          color: #92400e;
          margin-top: 6px;
          font-style: italic;
        }

        /* Terms & Signature */
        .invoice-terms-row {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          gap: 30px;
          margin-top: 16px;
          padding-top: 16px;
          border-top: 1px solid #e5e7eb;
        }
        .terms-col {
          flex: 1;
        }
        .terms-col h5 {
          font-size: 0.78rem;
          text-transform: uppercase;
          color: #64748b;
          margin-bottom: 4px;
        }
        .terms-col ol {
          padding-left: 16px;
          font-size: 0.72rem;
          color: #64748b;
          line-height: 1.4;
        }
        .signature-col {
          text-align: center;
          width: 180px;
        }
        .signature-line {
          height: 60px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-bottom: 1.5px solid #94a3b8;
          margin-bottom: 6px;
        }
        .seal-badge {
          border: 1.5px dashed #d97706;
          color: #b45309;
          font-size: 0.65rem;
          font-weight: 900;
          padding: 4px 8px;
          border-radius: 4px;
          transform: rotate(-5deg);
        }
        .signature-col p {
          font-size: 0.78rem;
          font-weight: 700;
          color: #1e293b;
        }
        .signature-col small {
          font-size: 0.68rem;
          color: #64748b;
        }

        .invoice-footer-note {
          text-align: center;
          font-size: 0.7rem;
          color: #94a3b8;
          margin-top: 24px;
          border-top: 1px solid #f1f5f9;
          padding-top: 8px;
        }

        @media (max-width: 640px) {
          .invoice-modal-backdrop {
            padding: 8px;
          }
          .invoice-modal-container {
            max-height: 96vh;
            border-radius: 8px;
          }
          .invoice-controls-bar {
            padding: 10px 14px;
            border-radius: 8px 8px 0 0;
          }
          .invoice-sheet {
            padding: 16px 12px;
            font-size: 0.8rem;
          }
          .invoice-header {
            flex-direction: column;
            gap: 14px;
          }
          .invoice-meta-block {
            width: 100%;
            text-align: left;
          }
          .meta-table {
            width: 100%;
          }
          .billing-shipping-grid {
            grid-template-columns: 1fr;
            gap: 12px;
          }
          .invoice-table-wrap {
            overflow-x: auto;
            width: 100%;
            -webkit-overflow-scrolling: touch;
          }
          .invoice-table {
            min-width: 480px;
          }
          .invoice-calculation-section {
            flex-direction: column;
            gap: 12px;
          }
          .totals-box {
            width: 100%;
            padding: 12px 14px;
          }
          .invoice-terms-row {
            flex-direction: column;
            gap: 16px;
            align-items: stretch;
          }
          .signature-col {
            width: 100%;
            margin-top: 8px;
          }
        }

        @media (max-width: 380px) {
          .invoice-brand-title {
            font-size: 1.4rem;
          }
          .invoice-pill-tag {
            font-size: 0.68rem;
            padding: 2px 6px;
          }
          .btn-print {
            font-size: 0.76rem;
            padding: 6px 10px;
          }
        }

        @media print {
          @page {
            size: A4 portrait;
            margin: 6mm 8mm;
          }

          html, body {
            margin: 0 !important;
            padding: 0 !important;
            background: #ffffff !important;
            height: auto !important;
            min-height: 0 !important;
            max-height: 100% !important;
            overflow: visible !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }

          /* Hide ALL other elements completely from the layout flow to eliminate extra pages */
          body > *:not(#root),
          #root > *:not(.invoice-modal-backdrop):not(.app-root),
          .admin-portal-wrapper,
          .admin-login-layout,
          .app-root > *:not(.invoice-modal-backdrop),
          .navbar,
          .footer,
          .site-header,
          .site-footer,
          .no-print {
            display: none !important;
            height: 0 !important;
            max-height: 0 !important;
            margin: 0 !important;
            padding: 0 !important;
            overflow: hidden !important;
            position: absolute !important;
            top: -99999px !important;
            left: -99999px !important;
            visibility: hidden !important;
          }

          /* Unconstrain and natural flow for printable invoice modal */
          .invoice-modal-backdrop {
            position: static !important;
            display: block !important;
            width: 100% !important;
            height: auto !important;
            min-height: 0 !important;
            max-height: none !important;
            padding: 0 !important;
            margin: 0 !important;
            background: transparent !important;
            overflow: visible !important;
            box-shadow: none !important;
            border: none !important;
          }

          .invoice-modal-container {
            position: static !important;
            display: block !important;
            width: 100% !important;
            max-width: 100% !important;
            height: auto !important;
            min-height: 0 !important;
            max-height: none !important;
            margin: 0 !important;
            padding: 0 !important;
            box-shadow: none !important;
            border: none !important;
            background: #ffffff !important;
            overflow: visible !important;
          }

          .invoice-sheet {
            position: static !important;
            display: block !important;
            width: 100% !important;
            max-width: 100% !important;
            height: auto !important;
            padding: 2mm 2mm 0 2mm !important;
            margin: 0 !important;
            border: none !important;
            box-shadow: none !important;
            background: #ffffff !important;
            page-break-after: avoid !important;
            break-after: avoid !important;
            page-break-inside: avoid !important;
            break-inside: avoid !important;
          }

          /* Compact styling for print to guarantee 1-page fit */
          .invoice-header {
            margin-bottom: 6px !important;
          }
          .invoice-brand-title {
            font-size: 1.3rem !important;
          }
          .invoice-brand-sub {
            font-size: 0.68rem !important;
            margin-bottom: 2px !important;
          }
          .invoice-company-details {
            font-size: 0.7rem !important;
            line-height: 1.25 !important;
          }
          .invoice-title-stamp {
            font-size: 1.15rem !important;
            margin-bottom: 4px !important;
          }
          .meta-table td {
            padding: 1px 4px !important;
            font-size: 0.74rem !important;
          }
          .invoice-divider {
            margin: 8px 0 !important;
          }
          .invoice-parties-row {
            padding: 6px 10px !important;
            margin-bottom: 8px !important;
            gap: 12px !important;
          }
          .party-box h4 {
            margin-bottom: 2px !important;
            font-size: 0.7rem !important;
          }
          .customer-name {
            font-size: 0.82rem !important;
          }
          .customer-address, .party-box p {
            font-size: 0.7rem !important;
            line-height: 1.25 !important;
          }
          .invoice-items-table {
            margin-bottom: 8px !important;
          }
          .invoice-items-table th {
            padding: 5px 6px !important;
            font-size: 0.7rem !important;
          }
          .invoice-items-table td {
            padding: 5px 6px !important;
            font-size: 0.74rem !important;
          }
          .item-sub-sku {
            font-size: 0.65rem !important;
          }
          .invoice-summary-row {
            margin-bottom: 8px !important;
            gap: 12px !important;
          }
          .tax-breakdown-box {
            padding: 6px 10px !important;
          }
          .tax-breakdown-box h5 {
            font-size: 0.7rem !important;
            margin-bottom: 3px !important;
          }
          .tax-row {
            font-size: 0.7rem !important;
            margin-bottom: 2px !important;
          }
          .totals-box {
            width: 260px !important;
            padding: 8px 12px !important;
          }
          .calc-row {
            font-size: 0.74rem !important;
            margin-bottom: 2px !important;
          }
          .grand-total-calc {
            margin-top: 4px !important;
            padding-top: 4px !important;
            font-size: 0.92rem !important;
          }
          .invoice-terms-row {
            margin-top: 6px !important;
            padding-top: 6px !important;
            gap: 14px !important;
          }
          .terms-col h5 {
            font-size: 0.7rem !important;
            margin-bottom: 2px !important;
          }
          .terms-col ol {
            font-size: 0.64rem !important;
            line-height: 1.2 !important;
            padding-left: 12px !important;
            margin: 0 !important;
          }
          .signature-col {
            width: 130px !important;
          }
          .signature-line {
            height: 32px !important;
            margin-bottom: 2px !important;
          }
          .seal-badge {
            font-size: 0.58rem !important;
            padding: 2px 6px !important;
          }
          .signature-col p {
            font-size: 0.68rem !important;
            margin: 0 !important;
          }
          .signature-col small {
            font-size: 0.6rem !important;
          }
          .invoice-footer-note {
            margin-top: 6px !important;
            font-size: 0.62rem !important;
          }
        }
      `}</style>
    </div>
  );
}
