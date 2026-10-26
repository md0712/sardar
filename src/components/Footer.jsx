import React, { useState } from 'react';
import { 
  Phone, Mail, MapPin, Clock, MessageCircle, 
  ShieldCheck, CreditCard, Truck, RefreshCw, Lock, 
  ExternalLink, ChevronRight, X, CheckCircle2, Sparkles
} from 'lucide-react';
import { FaInstagram, FaFacebookF, FaYoutube, FaWhatsapp } from 'react-icons/fa';

export default function Footer({ onNavigate, onOpenAdmin, storeSettings }) {
  const [activePolicy, setActivePolicy] = useState(null);

  const handleLink = (page) => {
    if (onNavigate) onNavigate(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Dynamic store configuration fallback
  const siteContent = (() => {
    if (storeSettings) return storeSettings;
    try {
      const saved = localStorage.getItem('hk_site_content');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  })();

  const brandDesc = siteContent?.footerDescription || 'Chennai’s premier destination for handcrafted solid-wood furniture and the latest smart home appliances since 1998.';
  const instagram = siteContent?.instagramUrl || 'https://www.instagram.com/sardar_mart_ch_39?xtok=N2c2cW8xYmdzM3Fy';
  const facebook = siteContent?.facebookUrl || 'https://facebook.com';
  const youtube = siteContent?.youtubeUrl || 'https://youtube.com';
  const primaryPhone = siteContent?.phone || '+91 6383056338';
  const secondaryPhone = siteContent?.secondaryPhone || '+91 9344623632';
  const cleanWaNumber = (siteContent?.whatsappNumber || '916383056338').replace(/\D/g, '');
  const storeAddress = siteContent?.address || 'No. 192, E.H Road, Vyasarpadi, Chennai - 39.';
  const storeEmail = siteContent?.email || 'sardarmart64@gmail.com';
  const storeTiming = siteContent?.timing || '09:30 AM – 09:30 PM (All 7 Days)';

  const policyDetails = {
    returns: {
      title: '7-Day Easy Replacement & Return Policy',
      badge: 'Zero-Hassle Protection',
      description: 'Every product is thoroughly inspected before dispatch. If any furniture or appliance arrives damaged, defective, or not matching specifications, we provide immediate door-step resolution.',
      points: [
        'Free doorstep replacement or repair within 7 days of delivery.',
        '100% transit insurance covered by Sardar Mart delivery fleet.',
        'Items must retain original warranty cards, manuals, and serial stickers.',
        'Quick WhatsApp verification with photo or short video.'
      ]
    },
    warranty: {
      title: '100% Genuine Brand Warranty Registration',
      badge: 'Direct Manufacturer Guarantee',
      description: 'Every appliance and electronics unit sold at Sardar Mart is 100% original with genuine manufacturer warranty honored across India.',
      points: [
        'Appliances & Smart TVs: 1 to 5 Years official manufacturer warranty (Samsung, LG, Sony, Haier, Godrej).',
        'Handcrafted Teak & Sheesham Furniture: Up to 10-year structural warranty against termite and joint defects.',
        'Authorized brand technician doorstep service arranged for warranty claims.',
        'Showroom tax invoice provided on delivery serves as official warranty proof.'
      ]
    },
    emi: {
      title: '0% No-Cost EMI & Paperless Financing Schemes',
      badge: 'Affordable Luxury for Every Home',
      description: 'Upgrade your living space today with flexible, zero-cost EMI plans from leading banks and finance partners.',
      points: [
        'Instant paperless spot approvals with Bajaj Finserv, HDB Financial & TVS Credit.',
        'Leading bank cards (HDFC, ICICI, SBI, Axis, Kotak) supported with 3, 6, 9 & 12-month 0% EMI.',
        'Zero down-payment options on select furniture sets and electronics combos.',
        'Transparent processing with zero hidden administration fees.'
      ]
    },
    shipping: {
      title: 'White-Glove Pan-India & Express Chennai Delivery',
      badge: 'Safe & Insured Doorstep Transit',
      description: 'We treat your furniture and electronics with extreme care using multi-layer protective packaging and trained transport staff.',
      points: [
        'Express Chennai Delivery: Delivered within 24 to 48 hours with complimentary assembly.',
        'Tamil Nadu & South India: Dispatched via dedicated logistics network in 2-4 business days.',
        'White-glove unboxing and room-of-choice placement included.',
        'Certified handling with live delivery tracking.'
      ]
    },
    privacy: {
      title: 'Customer Data Privacy & Purchase Security',
      badge: '100% Secure & Protected',
      description: 'Your personal data, phone numbers, and payment details are strictly safeguarded with 256-bit SSL encryption.',
      points: [
        'Strict zero-spam policy: we never sell or share customer contact data.',
        'Transactions processed via RBI-approved secure payment gateways (Razorpay, UPI, RuPay).',
        'WhatsApp alerts sent only for active order confirmations, dispatch updates, and requested quotes.',
        'Full compliance with Indian IT Act and Digital Personal Data Protection standards.'
      ]
    }
  };

  return (
    <footer className="compact-site-footer">
      {/* 1. SLIM VALUE & TRUST STRIP */}
      <div className="compact-trust-strip">
        <div className="container">
          <div className="compact-trust-grid">
            <div className="c-trust-item">
              <Truck size={17} className="c-trust-icon" />
              <span><strong>Free Delivery</strong> &amp; Assembly</span>
            </div>
            <div className="c-trust-item">
              <CreditCard size={17} className="c-trust-icon" />
              <span><strong>0% No-Cost EMI</strong> Up to 24 Mos</span>
            </div>
            <div className="c-trust-item">
              <ShieldCheck size={17} className="c-trust-icon" />
              <span><strong>100% Genuine</strong> Brand Warranty</span>
            </div>
            <div className="c-trust-item">
              <RefreshCw size={17} className="c-trust-icon" />
              <span><strong>7-Day Easy</strong> Replacement</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. MAIN FOOTER CONTENT - COMPACT 4-COLUMN GRID */}
      <div className="compact-footer-main">
        <div className="container">
          <div className="compact-cols-grid">
            
            {/* Col 1: Brand & Heritage */}
            <div className="c-col c-brand-col">
              <div className="c-brand-header" onClick={() => handleLink('home')}>
                <img 
                  src="/logo.png" 
                  alt="Sardar Mart Logo" 
                  className="c-logo-img" 
                  onError={(e) => { e.currentTarget.style.display = 'none'; }}
                />
                <div>
                  <h3 className="c-brand-title">
                    SARDAR <span>MART</span>
                  </h3>
                  <span className="c-brand-sub">FURNITURE &amp; ELECTRONICS • CHENNAI</span>
                </div>
              </div>

              <p className="c-brand-desc">{brandDesc}</p>

              <div className="c-meta-row">
                <span className="c-heritage-pill">
                  <Sparkles size={11} /> ESTD. 1998 • 50,000+ Happy Homes
                </span>
                <span className="c-hours-pill">
                  <Clock size={11} /> {storeTiming}
                </span>
              </div>

              <div className="c-social-row">
                <span className="c-social-text">Follow Us:</span>
                <a 
                  href={instagram} 
                  target="_blank" 
                  rel="noreferrer" 
                  aria-label="Instagram"
                  className="c-social-icon insta"
                  title="@sardar_mart_ch_39"
                >
                  <FaInstagram size={15} />
                </a>
                <a 
                  href={`https://wa.me/${cleanWaNumber}`} 
                  target="_blank" 
                  rel="noreferrer" 
                  aria-label="WhatsApp"
                  className="c-social-icon wa"
                  title="WhatsApp"
                >
                  <FaWhatsapp size={16} />
                </a>
                <a 
                  href={facebook} 
                  target="_blank" 
                  rel="noreferrer" 
                  aria-label="Facebook"
                  className="c-social-icon fb"
                  title="Facebook"
                >
                  <FaFacebookF size={14} />
                </a>
                <a 
                  href={youtube} 
                  target="_blank" 
                  rel="noreferrer" 
                  aria-label="YouTube"
                  className="c-social-icon yt"
                  title="YouTube"
                >
                  <FaYoutube size={15} />
                </a>
              </div>
            </div>

            {/* Col 2: Catalog Quick Links */}
            <div className="c-col">
              <h4 className="c-col-heading">Catalog &amp; Offers</h4>
              <ul className="c-links-list">
                <li>
                  <button type="button" onClick={() => handleLink('furniture')}>
                    Living &amp; Bedroom Furniture
                  </button>
                </li>
                <li>
                  <button type="button" onClick={() => handleLink('electronics')}>
                    Smart 4K TVs &amp; Home Audio
                  </button>
                </li>
                <li>
                  <button type="button" onClick={() => handleLink('appliances')}>
                    Refrigerators &amp; Washers
                  </button>
                </li>
                <li>
                  <button type="button" onClick={() => handleLink('appliances')}>
                    Kitchen &amp; Home Appliances
                  </button>
                </li>
                <li>
                  <button type="button" onClick={() => handleLink('offers')} className="c-hot-link">
                    Festival Offers <span className="c-mini-badge">50% OFF</span>
                  </button>
                </li>
                <li>
                  <button type="button" onClick={() => handleLink('wishlist')} style={{ color: '#c85a17', fontWeight: 700 }}>
                    ❤️ My Saved Wishlist
                  </button>
                </li>
                <li>
                  <button type="button" onClick={() => handleLink('about')}>
                    Our 25-Year Showroom Story
                  </button>
                </li>
              </ul>
            </div>

            {/* Col 3: Customer Care & Policies */}
            <div className="c-col">
              <h4 className="c-col-heading">Customer Care</h4>
              <ul className="c-links-list">
                <li>
                  <button type="button" onClick={() => setActivePolicy('returns')}>
                    7-Day Replacement Policy
                  </button>
                </li>
                <li>
                  <button type="button" onClick={() => setActivePolicy('warranty')}>
                    100% Brand Warranty Claims
                  </button>
                </li>
                <li>
                  <button type="button" onClick={() => setActivePolicy('emi')}>
                    0% No-Cost EMI Schemes
                  </button>
                </li>
                <li>
                  <button type="button" onClick={() => setActivePolicy('shipping')}>
                    White-Glove Delivery Guide
                  </button>
                </li>
                <li>
                  <button type="button" onClick={() => setActivePolicy('privacy')}>
                    Privacy Policy &amp; Security
                  </button>
                </li>
                <li>
                  <button type="button" onClick={() => handleLink('contact')}>
                    Customer Grievance &amp; Feedback
                  </button>
                </li>
              </ul>
            </div>

            {/* Col 4: Showroom Contact & Helpdesk */}
            <div className="c-col c-contact-col">
              <h4 className="c-col-heading">Showroom Helpdesk</h4>
              <div className="c-contact-list">
                <div className="c-contact-item">
                  <Phone size={14} className="c-ci-icon" />
                  <div>
                    <span className="c-ci-label">Helplines:</span>
                    <div className="c-ci-val">
                      <a href={`tel:${primaryPhone.replace(/\s+/g, '')}`}>{primaryPhone}</a>
                      <span className="sep">•</span>
                      <a href={`tel:${secondaryPhone.replace(/\s+/g, '')}`}>{secondaryPhone}</a>
                    </div>
                  </div>
                </div>

                <div className="c-contact-item">
                  <MessageCircle size={14} className="c-ci-icon" />
                  <div>
                    <span className="c-ci-label">WhatsApp Support:</span>
                    <div className="c-ci-val">
                      <a 
                        href={`https://wa.me/${cleanWaNumber}`} 
                        target="_blank" 
                        rel="noreferrer"
                        className="c-wa-link"
                      >
                        +{cleanWaNumber} <span className="c-instant-tag">Instant Reply</span>
                      </a>
                    </div>
                  </div>
                </div>

                <div className="c-contact-item">
                  <Mail size={14} className="c-ci-icon" />
                  <div>
                    <span className="c-ci-label">Email:</span>
                    <a href={`mailto:${storeEmail}`} className="c-ci-val email">{storeEmail}</a>
                  </div>
                </div>

                <div className="c-contact-item">
                  <MapPin size={14} className="c-ci-icon" />
                  <div>
                    <span className="c-ci-label">Flagship Store:</span>
                    <span className="c-ci-val address">{storeAddress}</span>
                    <a 
                      href="https://maps.google.com/?q=No.+192,+E.H+Road,+Cholan+Nagar,+Vyasarpadi,+Erukancheri,+Chennai+-+600039" 
                      target="_blank" 
                      rel="noreferrer" 
                      className="c-directions-link"
                    >
                      Google Maps Directions <ExternalLink size={10} />
                    </a>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* 3. COMPACT BOTTOM BAR WITH STAFF PORTAL ACCESS */}
      <div className="compact-footer-bottom">
        <div className="container">
          <div className="c-bottom-inner">
            
            {/* Copyright & Legal */}
            <div className="c-bottom-legal">
              <span>© {new Date().getFullYear()} <strong>Sardar Mart</strong> Furniture and Home Appliances.</span>
              <span className="c-b-dot">•</span>
              <span className="c-gstin">GSTIN: 33DVKPR2334L1Z9</span>
              <span className="c-b-dot">•</span>
              <span>
                Engineered by{' '}
                <a 
                  href="https://dmdigitallab.netlify.app" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="c-credit-link"
                >
                  DM Digital Labs
                </a>
              </span>
            </div>

            {/* Payment Chips & Staff Portal Button */}
            <div className="c-bottom-actions">
              <div className="c-payment-chips">
                <span className="c-chip">UPI</span>
                <span className="c-chip">RuPay</span>
                <span className="c-chip">Visa / MC</span>
                <span className="c-chip gold">0% EMI</span>
                <span className="c-chip">Cash on Delivery</span>
              </div>

              {/* Direct Access to Staff Portal / Admin Page */}
              <button 
                type="button"
                onClick={onOpenAdmin} 
                className="c-staff-portal-btn"
                title="Authorized Staff & Administrator Access"
              >
                <Lock size={12} />
                <span>Staff Portal</span>
              </button>
            </div>

          </div>
        </div>
      </div>

      {/* 4. COMPACT INTERACTIVE POLICY MODAL */}
      {activePolicy && (
        <div className="policy-modal-backdrop" onClick={() => setActivePolicy(null)}>
          <div className="policy-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="policy-modal-header">
              <div>
                <span className="policy-pill-badge">{policyDetails[activePolicy].badge}</span>
                <h3>{policyDetails[activePolicy].title}</h3>
              </div>
              <button 
                type="button"
                onClick={() => setActivePolicy(null)} 
                className="policy-modal-close"
                aria-label="Close modal"
              >
                <X size={18} />
              </button>
            </div>

            <div className="policy-modal-body">
              <p className="policy-desc-text">
                {policyDetails[activePolicy].description}
              </p>
              <ul className="policy-points-list">
                {policyDetails[activePolicy].points.map((pt, idx) => (
                  <li key={idx}>
                    <CheckCircle2 size={15} className="point-icon" />
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="policy-modal-footer">
              <a 
                href={`https://wa.me/${cleanWaNumber}?text=Hi%20Sardar%20Mart,%20I%20have%20a%20query%20regarding%20${encodeURIComponent(policyDetails[activePolicy].title)}`}
                target="_blank" 
                rel="noreferrer" 
                className="policy-wa-btn"
              >
                <FaWhatsapp size={15} />
                <span>Chat on WhatsApp</span>
              </a>
              <button type="button" onClick={() => setActivePolicy(null)} className="policy-close-action-btn">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* COMPACT STYLES */}
      <style>{`
        .compact-site-footer {
          background: #140a05;
          color: #c9b8ab;
          font-family: var(--font-body, system-ui, sans-serif);
          border-top: 1px solid rgba(255, 255, 255, 0.08);
          position: relative;
          font-size: 0.84rem;
          line-height: 1.45;
        }

        /* 1. Value Strip */
        .compact-trust-strip {
          background: #1c0e08;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
          padding: 10px 0;
        }
        .compact-trust-grid {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 12px;
          flex-wrap: wrap;
        }
        .c-trust-item {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          color: #e8ded6;
          font-size: 0.78rem;
        }
        .c-trust-item strong {
          color: #fcd34d;
          font-weight: 700;
        }
        .c-trust-icon {
          color: #f59e0b;
          flex-shrink: 0;
        }

        /* 2. Main Body */
        .compact-footer-main {
          padding: 34px 0 26px;
        }
        .compact-cols-grid {
          display: grid;
          grid-template-columns: 1.35fr 0.95fr 1fr 1.2fr;
          gap: 28px;
        }

        /* Brand Column */
        .c-brand-col {
          display: flex;
          flex-direction: column;
        }
        .c-brand-header {
          display: flex;
          align-items: center;
          gap: 10px;
          cursor: pointer;
          margin-bottom: 8px;
        }
        .c-logo-img {
          width: 38px;
          height: 38px;
          object-fit: contain;
          border-radius: 8px;
          background: rgba(255, 255, 255, 0.06);
          padding: 2px;
        }
        .c-brand-title {
          font-size: 1.15rem;
          font-weight: 800;
          color: #ffffff;
          letter-spacing: 0.5px;
          margin: 0;
          line-height: 1.1;
        }
        .c-brand-title span {
          color: #f59e0b;
        }
        .c-brand-sub {
          font-size: 0.65rem;
          color: #9c887e;
          font-weight: 700;
          letter-spacing: 0.8px;
          display: block;
          margin-top: 2px;
        }
        .c-brand-desc {
          font-size: 0.8rem;
          color: #a89487;
          margin: 0 0 10px;
          line-height: 1.45;
          max-width: 320px;
        }
        .c-meta-row {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          margin-bottom: 12px;
        }
        .c-heritage-pill, .c-hours-pill {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          font-size: 0.7rem;
          font-weight: 600;
          padding: 3px 8px;
          border-radius: 6px;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.08);
          color: #d8c8bd;
        }
        .c-heritage-pill {
          color: #fde68a;
          border-color: rgba(245, 158, 11, 0.25);
          background: rgba(245, 158, 11, 0.08);
        }

        /* Social Icons */
        .c-social-row {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .c-social-text {
          font-size: 0.72rem;
          color: #9c887e;
          font-weight: 600;
          margin-right: 2px;
        }
        .c-social-icon {
          width: 30px;
          height: 30px;
          border-radius: 8px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.08);
          display: inline-flex;
          align-items: center;
          justify-content: center;
          color: #ffffff;
          transition: all 0.2s ease;
          text-decoration: none;
        }
        .c-social-icon:hover {
          transform: translateY(-2px);
        }
        .c-social-icon.insta:hover {
          background: #e1306c;
          border-color: #e1306c;
        }
        .c-social-icon.wa:hover {
          background: #25d366;
          border-color: #25d366;
        }
        .c-social-icon.fb:hover {
          background: #1877f2;
          border-color: #1877f2;
        }
        .c-social-icon.yt:hover {
          background: #ff0000;
          border-color: #ff0000;
        }

        /* Nav Columns */
        .c-col-heading {
          font-size: 0.88rem;
          font-weight: 700;
          color: #ffffff;
          text-transform: uppercase;
          letter-spacing: 0.6px;
          margin: 0 0 12px;
          position: relative;
          padding-bottom: 6px;
          border-bottom: 1.5px solid rgba(245, 158, 11, 0.35);
          display: inline-block;
        }
        .c-links-list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 7px;
        }
        .c-links-list li button {
          background: none;
          border: none;
          color: #baa79a;
          font-size: 0.8rem;
          cursor: pointer;
          padding: 0;
          text-align: left;
          transition: color 0.15s ease;
          display: inline-flex;
          align-items: center;
          gap: 6px;
        }
        .c-links-list li button:hover {
          color: #f59e0b;
        }
        .c-hot-link {
          color: #fed7aa !important;
          font-weight: 600;
        }
        .c-mini-badge {
          font-size: 0.62rem;
          font-weight: 800;
          background: #dc2626;
          color: #ffffff;
          padding: 1px 5px;
          border-radius: 4px;
          letter-spacing: 0.3px;
        }

        /* Contact Column */
        .c-contact-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .c-contact-item {
          display: flex;
          align-items: flex-start;
          gap: 9px;
          font-size: 0.78rem;
        }
        .c-ci-icon {
          color: #f59e0b;
          margin-top: 2px;
          flex-shrink: 0;
        }
        .c-ci-label {
          display: block;
          color: #8c786c;
          font-size: 0.7rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.3px;
        }
        .c-ci-val {
          color: #e2d5cb;
          line-height: 1.35;
        }
        .c-ci-val a {
          color: #ffffff;
          text-decoration: none;
          font-weight: 600;
          transition: color 0.15s ease;
        }
        .c-ci-val a:hover {
          color: #f59e0b;
        }
        .c-ci-val .sep {
          margin: 0 4px;
          color: #8c786c;
        }
        .c-wa-link {
          color: #4ade80 !important;
          display: inline-flex;
          align-items: center;
          gap: 6px;
        }
        .c-instant-tag {
          font-size: 0.62rem;
          background: rgba(34, 197, 94, 0.2);
          color: #4ade80;
          padding: 1px 5px;
          border-radius: 4px;
          font-weight: 700;
        }
        .c-ci-val.email {
          color: #93c5fd;
          word-break: break-all;
        }
        .c-ci-val.address {
          display: block;
          color: #d1bfb3;
          font-size: 0.76rem;
        }
        .c-directions-link {
          display: inline-flex;
          align-items: center;
          gap: 3px;
          color: #f59e0b !important;
          font-size: 0.72rem;
          font-weight: 600;
          margin-top: 2px;
        }

        /* 3. Bottom Bar */
        .compact-footer-bottom {
          background: #0d0603;
          border-top: 1px solid rgba(255, 255, 255, 0.05);
          padding: 12px 0;
        }
        .c-bottom-inner {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 16px;
          flex-wrap: wrap;
          font-size: 0.74rem;
          color: #8c786c;
        }
        .c-bottom-legal {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
        }
        .c-bottom-legal strong {
          color: #ffffff;
        }
        .c-b-dot {
          color: #523f34;
        }
        .c-gstin {
          color: #a89487;
          font-weight: 600;
        }
        .c-credit-link {
          color: #f59e0b;
          text-decoration: none;
          font-weight: 600;
        }
        .c-bottom-actions {
          display: flex;
          align-items: center;
          gap: 14px;
          flex-wrap: wrap;
        }
        .c-payment-chips {
          display: flex;
          gap: 5px;
          align-items: center;
          flex-wrap: wrap;
        }
        .c-chip {
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.08);
          color: #b09f92;
          font-size: 0.65rem;
          font-weight: 600;
          padding: 2px 7px;
          border-radius: 4px;
        }
        .c-chip.gold {
          background: rgba(245, 158, 11, 0.12);
          border-color: rgba(245, 158, 11, 0.3);
          color: #fcd34d;
        }

        /* Staff Portal Button */
        .c-staff-portal-btn {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          background: linear-gradient(135deg, rgba(245, 158, 11, 0.18) 0%, rgba(180, 83, 9, 0.28) 100%);
          border: 1px solid rgba(245, 158, 11, 0.45);
          color: #fef3c7;
          font-size: 0.72rem;
          font-weight: 700;
          padding: 5px 12px;
          border-radius: 20px;
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: 0 1px 6px rgba(0,0,0,0.2);
          white-space: nowrap;
        }
        .c-staff-portal-btn:hover {
          background: #b45309;
          color: #ffffff;
          border-color: #f59e0b;
          transform: translateY(-1px);
          box-shadow: 0 3px 10px rgba(180, 83, 9, 0.35);
        }

        /* Policy Modal */
        .policy-modal-backdrop {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: rgba(0, 0, 0, 0.7);
          backdrop-filter: blur(5px);
          z-index: 999999;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 16px;
        }
        .policy-modal-card {
          background: #ffffff;
          color: #1e293b;
          border-radius: 16px;
          max-width: 540px;
          width: 100%;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
          overflow: hidden;
          animation: popIn 0.2s ease-out;
        }
        @keyframes popIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .policy-modal-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          padding: 18px 22px 14px;
          border-bottom: 1px solid #f1f5f9;
        }
        .policy-pill-badge {
          display: inline-block;
          font-size: 0.7rem;
          font-weight: 700;
          background: #ecfdf5;
          color: #047857;
          padding: 2px 8px;
          border-radius: 6px;
          margin-bottom: 4px;
        }
        .policy-modal-header h3 {
          font-size: 1.05rem;
          font-weight: 800;
          color: #0f172a;
          margin: 0;
        }
        .policy-modal-close {
          background: none;
          border: none;
          color: #64748b;
          cursor: pointer;
          padding: 4px;
          border-radius: 6px;
        }
        .policy-modal-close:hover {
          color: #0f172a;
          background: #f1f5f9;
        }
        .policy-modal-body {
          padding: 18px 22px;
          max-height: 65vh;
          overflow-y: auto;
        }
        .policy-desc-text {
          font-size: 0.86rem;
          color: #475569;
          line-height: 1.5;
          margin: 0 0 14px;
        }
        .policy-points-list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .policy-points-list li {
          display: flex;
          align-items: flex-start;
          gap: 9px;
          font-size: 0.82rem;
          color: #334155;
          line-height: 1.45;
        }
        .point-icon {
          color: #16a34a;
          flex-shrink: 0;
          margin-top: 2px;
        }
        .policy-modal-footer {
          padding: 12px 22px 16px;
          border-top: 1px solid #f1f5f9;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 10px;
          background: #fafaf9;
        }
        .policy-wa-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: #15803d;
          color: #ffffff;
          padding: 7px 14px;
          border-radius: 8px;
          font-size: 0.78rem;
          font-weight: 700;
          text-decoration: none;
        }
        .policy-close-action-btn {
          background: #e2e8f0;
          color: #334155;
          border: none;
          padding: 7px 16px;
          border-radius: 8px;
          font-size: 0.78rem;
          font-weight: 700;
          cursor: pointer;
        }

        /* Responsive Breakpoints */
        @media (max-width: 960px) {
          .compact-cols-grid {
            grid-template-columns: 1fr 1fr;
            gap: 24px;
          }
          .c-brand-desc {
            max-width: 100%;
          }
        }

        @media (max-width: 600px) {
          .compact-trust-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 8px;
          }
          .c-trust-item {
            font-size: 0.72rem;
          }
          .compact-cols-grid {
            grid-template-columns: 1fr;
            gap: 20px;
          }
          .compact-footer-main {
            padding: 24px 0 20px;
          }
          .c-bottom-inner {
            flex-direction: column;
            align-items: flex-start;
            gap: 12px;
          }
          .c-bottom-actions {
            width: 100%;
            justify-content: space-between;
          }
        }
      `}</style>
    </footer>
  );
}