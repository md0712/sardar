import React, { useState } from 'react';
import { 
  Phone, Mail, MapPin, Clock, MessageCircle, 
  ShieldCheck, CreditCard, Truck, RefreshCw, Lock, Package,
  ExternalLink, ChevronRight, X, CheckCircle2
} from 'lucide-react';
import { FaInstagram, FaFacebookF, FaYoutube, FaWhatsapp } from 'react-icons/fa';

export default function Footer({ onNavigate, onOpenAdmin, onOpenTrackOrder, storeSettings }) {
  const [activePolicy, setActivePolicy] = useState(null);

  const handleLink = (page) => {
    if (onNavigate) onNavigate(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Safe fallback to storeSettings or localStorage or defaults
  const siteContent = (() => {
    if (storeSettings) return storeSettings;
    try {
      const saved = localStorage.getItem('hk_site_content');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  })();

  const brandDesc = siteContent?.footerDescription || 'Your one-stop destination for premium stylish furniture and the latest smart home electronics. Transforming homes across Tamil Nadu and all over India with unmatched quality and value.';
  const instagram = siteContent?.instagramUrl || 'https://www.instagram.com/sardar_mart_ch_39?xtok=N2c2cW8xYmdzM3Fy';
  const facebook = siteContent?.facebookUrl || 'https://facebook.com';
  const youtube = siteContent?.youtubeUrl || 'https://youtube.com';
  const primaryPhone = siteContent?.phone || '+91 6383056338';
  const secondaryPhone = siteContent?.secondaryPhone || '+91 9344623632';
  const cleanWaNumber = (siteContent?.whatsappNumber || '916383056338').replace(/\D/g, '');
  const storeAddress = siteContent?.address || 'No. 192, E.H Road, Cholan nagar, Vyasarpadi, Erukancheri, Chennai - 39.';
  const storeEmail = siteContent?.email || 'sardarmart64@gmail.com';
  const storeTiming = siteContent?.timing || 'Mon - Sun: 09:30 AM – 09:30 PM (All 7 Days Open)';

  const policyDetails = {
    returns: {
      title: '7-Day Easy Replacement & Return Policy',
      badge: 'Zero-Hassle Protection',
      description: 'We inspect every piece before dispatch. However, if any furniture or electronics arrives damaged or defective, we provide immediate door-step resolution.',
      points: [
        'Free doorstep replacement or repair within 7 days of delivery for damaged or defective items.',
        'Transit damage is 100% insured by Sardar Mart white-glove transport team.',
        'Items must remain in original condition with warranty cards, manuals, and accessories intact.',
        'Instant customer support verification via WhatsApp photo/video sharing.'
      ]
    },
    warranty: {
      title: '100% Genuine Brand Warranty Registration',
      badge: 'Direct Manufacturer Guarantee',
      description: 'Every single product sold at Sardar Mart is 100% authentic with genuine manufacturer warranty covering Tamil Nadu and all of India.',
      points: [
        'Televisions & Appliances: 1 to 5 Year official manufacturer warranty (Samsung, LG, Sony, Whirlpool, Godrej, Haier).',
        'Luxury Wooden & Metal Furniture: 1 to 10 Year structural durability warranty on frames and joinery.',
        'Authorized service technician visits arranged directly at your doorstep.',
        'Tax invoice generated on delivery serves as your official warranty proof.'
      ]
    },
    emi: {
      title: '0% No-Cost EMI & Easy Financing Schemes',
      badge: 'Affordable Luxury for Every Home',
      description: 'Furnish your entire home or upgrade your smart electronics today with instant 0% EMI financing plans.',
      points: [
        'Bajaj Finserv, HDB Financial & TVS Credit paperless spot approvals in showroom.',
        'Leading bank credit cards (HDFC, ICICI, SBI, Axis, Kotak) supported with 3, 6, 9 & 12 months no-cost EMI.',
        'Zero down-payment options available on select living room, bedroom and appliance combos.',
        'Fast transparent processing with no hidden administrative fees.'
      ]
    },
    shipping: {
      title: 'White-Glove Pan-India & Express Chennai Delivery',
      badge: 'Safe & Insured Doorstep Transit',
      description: 'We treat your furniture and electronics with extreme care using specialized packaging and trained transport staff.',
      points: [
        'Express Chennai Delivery: Within 24 to 48 hours with complimentary assembly.',
        'Tamil Nadu & South India: Dispatched via dedicated logistics network in 2-4 business days.',
        'White-glove unboxing and room-of-choice placement available.',
        'Real-time live dispatch tracking available right from our Track Order portal.'
      ]
    },
    privacy: {
      title: 'Customer Data Privacy & Purchase Security',
      badge: '100% Secure & Protected',
      description: 'Your personal information, phone numbers, and transaction details are strictly safeguarded with bank-grade 256-bit SSL encryption.',
      points: [
        'No sale or sharing of phone numbers or emails with third-party telemarketers.',
        'Payment details are processed through RBI-approved secure payment gateways (Razorpay, UPI, RuPay).',
        'WhatsApp alerts sent only for active order confirmations, dispatch updates, and requested quotes.',
        'Full compliance with Indian IT Act and Digital Personal Data Protection standards.'
      ]
    }
  };

  return (
    <footer className="site-footer">
      {/* 1. VALUE & TRUST PILLARS STRIP */}
      <div className="pre-footer-trust-bar">
        <div className="container">
          <div className="trust-badges-grid">
            <div className="trust-item">
              <div className="trust-icon-circle">
                <Truck size={22} />
              </div>
              <div className="trust-text">
                <h4>Free Home Delivery</h4>
                <p>Safe door-step transit & white-glove unboxing</p>
              </div>
            </div>

            <div className="trust-item">
              <div className="trust-icon-circle">
                <CreditCard size={22} />
              </div>
              <div className="trust-text">
                <h4>Easy 0% EMI</h4>
                <p>Bajaj Finserv & cards up to 24 months</p>
              </div>
            </div>

            <div className="trust-item">
              <div className="trust-icon-circle">
                <ShieldCheck size={22} />
              </div>
              <div className="trust-text">
                <h4>100% Genuine Warranty</h4>
                <p>Direct manufacturer brand backing</p>
              </div>
            </div>

            <div className="trust-item">
              <div className="trust-icon-circle">
                <RefreshCw size={22} />
              </div>
              <div className="trust-text">
                <h4>7-Day Easy Returns</h4>
                <p>Hassle-free replacement guarantee</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. MAIN FOOTER CONTENT COLUMNS */}
      <div className="main-footer-body">
        <div className="container">
          <div className="footer-columns-grid">
            
            {/* Col 1: Brand Info & Social Presence */}
            <div className="footer-brand-col">
              <div className="footer-logo" onClick={() => handleLink('home')}>
                <img 
                  src="/logo.png" 
                  alt="Sardar Mart Furniture and Home Appliances" 
                  className="footer-logo-img" 
                />
                <div className="footer-logo-text">
                  <div className="footer-brand-title">
                    Sardar <span className="gold-accent">Mart</span>
                  </div>
                  <div className="footer-brand-tagline">
                    FURNITURE AND HOME APPLIANCES • CHENNAI
                  </div>
                </div>
              </div>

              <div className="heritage-badge">
                <span className="heritage-dot"></span>
                <span>ESTD. 1998 • Trusted by 50,000+ Tamil Nadu Homes</span>
              </div>

              <p className="footer-brand-desc">
                {brandDesc}
              </p>

              {/* Showroom Status Indicator */}
              <div className="showroom-status-pill">
                <span className="live-pulse-dot"></span>
                <span className="showroom-status-text">Showroom Open Today • 9:30 AM – 9:30 PM</span>
              </div>

              {/* Social Media Links with Official Logos */}
              <div className="footer-social-wrapper">
                <span className="social-label">Follow Us:</span>
                <div className="footer-social-links">
                  {/* Official Instagram Button */}
                  <a 
                    href={instagram} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    aria-label="Follow Sardar Mart on Instagram" 
                    title="Follow @sardar_mart_ch_39 on Instagram"
                    className="footer-social-btn btn-instagram"
                  >
                    <FaInstagram size={19} />
                  </a>

                  {/* WhatsApp Direct */}
                  <a 
                    href={`https://wa.me/${cleanWaNumber}`} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    aria-label="Chat with Sardar Mart on WhatsApp" 
                    title="Chat on WhatsApp: +91 6383056338"
                    className="footer-social-btn btn-whatsapp"
                  >
                    <FaWhatsapp size={20} />
                  </a>

                  {/* Facebook */}
                  <a 
                    href={facebook} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    aria-label="Follow Sardar Mart on Facebook" 
                    title="Facebook"
                    className="footer-social-btn btn-facebook"
                  >
                    <FaFacebookF size={17} />
                  </a>

                  {/* YouTube */}
                  <a 
                    href={youtube} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    aria-label="Subscribe to Sardar Mart YouTube Channel" 
                    title="YouTube Channel"
                    className="footer-social-btn btn-youtube"
                  >
                    <FaYoutube size={19} />
                  </a>
                </div>

                {/* Highlighted Instagram Verified Follow Pill */}
                <a 
                  href={instagram} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="instagram-follow-pill"
                >
                  <FaInstagram size={15} className="pill-insta-icon" />
                  <span>@sardar_mart_ch_39</span>
                  <ExternalLink size={12} className="pill-ext-icon" />
                </a>
              </div>
            </div>

            {/* Col 2: Curated Collections */}
            <div className="footer-links-col">
              <h3 className="footer-heading">
                <span>Collections</span>
              </h3>
              <ul className="footer-nav-list">
                <li>
                  <button onClick={() => handleLink('furniture')}>
                    <ChevronRight size={14} className="nav-arrow" />
                    <span>Living &amp; Bedroom Furniture</span>
                  </button>
                </li>
                <li>
                  <button onClick={() => handleLink('electronics')}>
                    <ChevronRight size={14} className="nav-arrow" />
                    <span>Smart 4K TVs &amp; Home Audio</span>
                  </button>
                </li>
                <li>
                  <button onClick={() => handleLink('appliances')}>
                    <ChevronRight size={14} className="nav-arrow" />
                    <span>Refrigerators &amp; Washing Machines</span>
                  </button>
                </li>
                <li>
                  <button onClick={() => handleLink('appliances')}>
                    <ChevronRight size={14} className="nav-arrow" />
                    <span>Kitchen &amp; Home Appliances</span>
                  </button>
                </li>
                <li>
                  <button onClick={() => handleLink('offers')} className="highlight-nav-item">
                    <ChevronRight size={14} className="nav-arrow" />
                    <span>Festival Mega Combos</span>
                    <span className="hot-pill">SAVE 50%</span>
                  </button>
                </li>
                <li>
                  <button onClick={() => handleLink('about')}>
                    <ChevronRight size={14} className="nav-arrow" />
                    <span>Our 25-Year Heritage &amp; Story</span>
                  </button>
                </li>
                <li>
                  <button onClick={() => handleLink('contact')}>
                    <ChevronRight size={14} className="nav-arrow" />
                    <span>Showroom Experience Center</span>
                  </button>
                </li>
              </ul>
            </div>

            {/* Col 3: Customer Care & Policies */}
            <div className="footer-links-col">
              <h3 className="footer-heading">
                <span>Customer Care</span>
              </h3>
              <ul className="footer-nav-list">
                <li>
                  <button onClick={onOpenTrackOrder} className="track-order-highlight">
                    <Package size={15} className="track-box-icon" />
                    <span>Track Order Status</span>
                    <span className="live-tag">LIVE</span>
                  </button>
                </li>
                <li>
                  <button onClick={() => setActivePolicy('returns')}>
                    <ChevronRight size={14} className="nav-arrow" />
                    <span>7-Day Replacement Policy</span>
                  </button>
                </li>
                <li>
                  <button onClick={() => setActivePolicy('warranty')}>
                    <ChevronRight size={14} className="nav-arrow" />
                    <span>Warranty &amp; Service Claims</span>
                  </button>
                </li>
                <li>
                  <button onClick={() => setActivePolicy('emi')}>
                    <ChevronRight size={14} className="nav-arrow" />
                    <span>0% No-Cost EMI Calculator</span>
                  </button>
                </li>
                <li>
                  <button onClick={() => setActivePolicy('shipping')}>
                    <ChevronRight size={14} className="nav-arrow" />
                    <span>Shipping &amp; Delivery Guide</span>
                  </button>
                </li>
                <li>
                  <button onClick={() => setActivePolicy('privacy')}>
                    <ChevronRight size={14} className="nav-arrow" />
                    <span>Privacy Policy &amp; Security</span>
                  </button>
                </li>
                <li>
                  <button onClick={() => handleLink('contact')}>
                    <ChevronRight size={14} className="nav-arrow" />
                    <span>Customer Grievance &amp; Help</span>
                  </button>
                </li>
              </ul>
            </div>

            {/* Col 4: Showroom Helplines & Address */}
            <div className="footer-contact-col">
              <h3 className="footer-heading">
                <span>Showroom Helpdesk</span>
              </h3>
              <div className="contact-cards-stack">
                
                {/* Helplines Pill */}
                <div className="contact-card">
                  <div className="contact-card-icon hotline-icon">
                    <Phone size={16} />
                  </div>
                  <div className="contact-card-info">
                    <span className="card-label">Direct Showroom Helplines</span>
                    <div className="helpline-numbers-row">
                      <a href={`tel:${primaryPhone.replace(/\s+/g, '')}`} className="helpline-link">
                        {primaryPhone}
                      </a>
                      <span className="num-sep">•</span>
                      <a href={`tel:${secondaryPhone.replace(/\s+/g, '')}`} className="helpline-link">
                        {secondaryPhone}
                      </a>
                    </div>
                  </div>
                </div>

                {/* WhatsApp Support Pill */}
                <div className="contact-card">
                  <div className="contact-card-icon wa-icon">
                    <MessageCircle size={16} />
                  </div>
                  <div className="contact-card-info">
                    <span className="card-label">WhatsApp Direct Assistance</span>
                    <a 
                      href={`https://wa.me/${cleanWaNumber}`} 
                      target="_blank" 
                      rel="noreferrer" 
                      className="wa-action-link"
                    >
                      +{cleanWaNumber} <span className="instant-badge">Instant Reply</span>
                    </a>
                  </div>
                </div>

                {/* Email Pill */}
                <div className="contact-card">
                  <div className="contact-card-icon email-icon">
                    <Mail size={16} />
                  </div>
                  <div className="contact-card-info">
                    <span className="card-label">Support Email</span>
                    <a href={`mailto:${storeEmail}`} className="email-link">
                      {storeEmail}
                    </a>
                  </div>
                </div>

                {/* Address Pill */}
                <div className="contact-card address-card">
                  <div className="contact-card-icon pin-icon">
                    <MapPin size={16} />
                  </div>
                  <div className="contact-card-info">
                    <span className="card-label">Flagship Showroom Address</span>
                    <p className="showroom-address-text">{storeAddress}</p>
                    <a 
                      href="https://maps.google.com/?q=Sardar+Mart+Furniture+and+Home+Appliances+Vyasarpadi+Chennai" 
                      target="_blank" 
                      rel="noreferrer"
                      className="maps-direction-btn"
                    >
                      <MapPin size={12} />
                      <span>Get Directions (Google Maps)</span>
                    </a>
                  </div>
                </div>

                {/* Hours */}
                <div className="contact-card hours-card">
                  <div className="contact-card-icon clock-icon">
                    <Clock size={16} />
                  </div>
                  <div className="contact-card-info">
                    <span className="card-label">Showroom Hours</span>
                    <span className="hours-text">{storeTiming}</span>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </div>

      {/* 3. BOTTOM COPYRIGHT & TRUST CERTIFICATIONS BAR */}
      <div className="footer-bottom-bar">
        <div className="container bottom-bar-inner">
          
          {/* Left: Copyright & Legal Entity */}
          <div className="copyright-group">
            <p className="copyright-text">
              © {new Date().getFullYear()} <strong>Sardar Mart</strong> Furniture and Home Appliances. All rights reserved.
            </p>
            <span className="powered-by-divider">•</span>
            <span className="gstin-badge">GSTIN: 33DVKPR2334L1Z9</span>
            <span className="powered-by-divider">•</span>
            <p className="powered-by-text">
              Engineered by{' '}
              <a 
                href="https://dmdigitallab.netlify.app" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="powered-by-link"
              >
                DM Digital Labs
              </a>
            </p>
          </div>

          {/* Right: Payment Badges & Staff Portal Link */}
          <div className="bottom-bar-right-group">
            <div className="payment-modes-strip">
              <span className="payment-tag-title">Accepted Modes:</span>
              <div className="payment-badges-list">
                <span className="pay-chip">UPI / GPay / PhonePe</span>
                <span className="pay-chip">Visa / Mastercard</span>
                <span className="pay-chip">RuPay</span>
                <span className="pay-chip emi-chip">0% No-Cost EMI</span>
                <span className="pay-chip">Cash on Delivery</span>
              </div>
            </div>

            <button 
              onClick={onOpenAdmin} 
              className="staff-portal-btn"
              title="Authorized Staff & CMS Access (Restricted Portal)"
            >
              <Lock size={12} />
              <span>Staff Portal</span>
            </button>
          </div>

        </div>
      </div>

      {/* 4. INTERACTIVE POLICY TRANSPARENCY MODAL */}
      {activePolicy && (
        <div className="policy-modal-backdrop" onClick={() => setActivePolicy(null)}>
          <div className="policy-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="policy-modal-header">
              <div className="policy-header-title">
                <span className="policy-pill-badge">{policyDetails[activePolicy].badge}</span>
                <h3>{policyDetails[activePolicy].title}</h3>
              </div>
              <button 
                onClick={() => setActivePolicy(null)} 
                className="policy-modal-close"
                aria-label="Close modal"
              >
                <X size={20} />
              </button>
            </div>

            <div className="policy-modal-body">
              <p className="policy-desc-text">
                {policyDetails[activePolicy].description}
              </p>
              <ul className="policy-points-list">
                {policyDetails[activePolicy].points.map((pt, idx) => (
                  <li key={idx}>
                    <CheckCircle2 size={16} className="point-icon" />
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
                <FaWhatsapp size={16} />
                <span>Chat with Showroom Support on WhatsApp</span>
              </a>
              <button onClick={() => setActivePolicy(null)} className="policy-close-action-btn">
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* COMPREHENSIVE STYLING */}
      <style>{`
        .site-footer {
          background: #120905;
          color: #d1bfb3;
          font-family: var(--font-body, system-ui, sans-serif);
          position: relative;
          border-top: 1px solid rgba(255, 255, 255, 0.08);
          overflow: hidden;
        }

        /* Ambient Glow Effect */
        .site-footer::before {
          content: '';
          position: absolute;
          top: -120px;
          left: 50%;
          transform: translateX(-50%);
          width: 800px;
          height: 240px;
          background: radial-gradient(ellipse at center, rgba(217, 119, 6, 0.12) 0%, rgba(217, 119, 6, 0) 70%);
          pointer-events: none;
          z-index: 0;
        }

        /* 1. Value Bar */
        .pre-footer-trust-bar {
          background: #170c07;
          border-bottom: 1px solid rgba(255, 255, 255, 0.06);
          padding: 24px 0;
          position: relative;
          z-index: 1;
        }
        .trust-badges-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
        }
        .trust-item {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 12px 16px;
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 12px;
          transition: all 0.25s ease;
        }
        .trust-item:hover {
          background: rgba(255, 255, 255, 0.04);
          border-color: rgba(217, 119, 6, 0.3);
          transform: translateY(-2px);
        }
        .trust-icon-circle {
          width: 44px;
          height: 44px;
          background: linear-gradient(135deg, rgba(217, 119, 6, 0.25) 0%, rgba(180, 83, 9, 0.1) 100%);
          color: #fbbf24;
          border: 1px solid rgba(245, 158, 11, 0.3);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .trust-text h4 {
          color: #ffffff;
          font-size: 0.92rem;
          font-weight: 700;
          margin-bottom: 2px;
        }
        .trust-text p {
          font-size: 0.76rem;
          color: #a89487;
          line-height: 1.35;
        }

        /* 2. Main Footer */
        .main-footer-body {
          padding: 56px 0 46px;
          position: relative;
          z-index: 1;
        }
        .footer-columns-grid {
          display: grid;
          grid-template-columns: 1.4fr 1.05fr 1.05fr 1.3fr;
          gap: 44px;
        }

        /* Column 1: Brand */
        .footer-brand-col {
          display: flex;
          flex-direction: column;
        }
        .footer-logo {
          display: inline-flex;
          align-items: center;
          gap: 14px;
          cursor: pointer;
          margin-bottom: 12px;
          text-decoration: none;
        }
        .footer-logo-img {
          height: 46px;
          width: auto;
          max-width: 130px;
          object-fit: contain;
          border-radius: 8px;
          filter: drop-shadow(0 4px 8px rgba(0,0,0,0.4));
        }
        .footer-logo-text {
          display: flex;
          flex-direction: column;
        }
        .footer-brand-title {
          font-family: var(--font-heading, sans-serif);
          font-size: 1.55rem;
          font-weight: 800;
          color: #ffffff;
          line-height: 1.1;
          letter-spacing: -0.02em;
        }
        .gold-accent {
          color: #f59e0b;
        }
        .footer-brand-tagline {
          font-size: 0.62rem;
          font-weight: 500;
          letter-spacing: 1.8px;
          color: #a89487;
          margin-top: 2px;
        }
        .heritage-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 0.72rem;
          color: #fbbf24;
          background: rgba(251, 191, 36, 0.08);
          border: 1px solid rgba(251, 191, 36, 0.2);
          border-radius: 9999px;
          padding: 3px 10px;
          margin-bottom: 14px;
          width: fit-content;
        }
        .heritage-dot {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: #fbbf24;
        }
        .footer-brand-desc {
          font-size: 0.86rem;
          line-height: 1.6;
          color: #b3a195;
          margin-bottom: 16px;
        }

        /* Showroom Live Pulse */
        .showroom-status-pill {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(34, 197, 94, 0.1);
          border: 1px solid rgba(34, 197, 94, 0.25);
          border-radius: 8px;
          padding: 6px 12px;
          margin-bottom: 22px;
          width: fit-content;
        }
        .live-pulse-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #22c55e;
          box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.7);
          animation: statusPulse 2s infinite;
        }
        @keyframes statusPulse {
          0% { box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.7); }
          70% { box-shadow: 0 0 0 7px rgba(34, 197, 94, 0); }
          100% { box-shadow: 0 0 0 0 rgba(34, 197, 94, 0); }
        }
        .showroom-status-text {
          font-size: 0.76rem;
          color: #86efac;
          font-weight: 600;
        }

        /* Social Media Section */
        .footer-social-wrapper {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .social-label {
          font-size: 0.76rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.8px;
          color: #8c766a;
        }
        .footer-social-links {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-wrap: wrap;
        }
        .footer-social-btn {
          width: 38px;
          height: 38px;
          border-radius: 10px;
          background: rgba(255, 255, 255, 0.06);
          color: #e2d5cb;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid rgba(255, 255, 255, 0.1);
          transition: all 0.22s ease;
          cursor: pointer;
          position: relative;
        }
        
        /* Official Brand Colors on Hover */
        .footer-social-btn.btn-instagram:hover {
          background: radial-gradient(circle at 30% 107%, #fdf497 0%, #fdf497 5%, #fd5949 45%, #d6249f 60%, #285AEB 90%);
          color: #ffffff;
          border-color: transparent;
          transform: translateY(-3px);
          box-shadow: 0 6px 16px rgba(214, 36, 159, 0.45);
        }
        .footer-social-btn.btn-whatsapp:hover {
          background: #25d366;
          color: #ffffff;
          border-color: #25d366;
          transform: translateY(-3px);
          box-shadow: 0 6px 16px rgba(37, 211, 102, 0.45);
        }
        .footer-social-btn.btn-facebook:hover {
          background: #1877f2;
          color: #ffffff;
          border-color: #1877f2;
          transform: translateY(-3px);
          box-shadow: 0 6px 16px rgba(24, 119, 242, 0.45);
        }
        .footer-social-btn.btn-youtube:hover {
          background: #ff0000;
          color: #ffffff;
          border-color: #ff0000;
          transform: translateY(-3px);
          box-shadow: 0 6px 16px rgba(255, 0, 0, 0.45);
        }

        /* Instagram Verified Follow Pill */
        .instagram-follow-pill {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          background: linear-gradient(135deg, rgba(214, 36, 159, 0.12) 0%, rgba(253, 89, 73, 0.12) 100%);
          border: 1px solid rgba(214, 36, 159, 0.35);
          color: #fbcfe8;
          font-size: 0.78rem;
          font-weight: 600;
          padding: 6px 12px;
          border-radius: 8px;
          width: fit-content;
          transition: all 0.2s ease;
          margin-top: 4px;
        }
        .instagram-follow-pill:hover {
          background: linear-gradient(135deg, rgba(214, 36, 159, 0.25) 0%, rgba(253, 89, 73, 0.25) 100%);
          border-color: #f472b6;
          color: #ffffff;
          transform: translateX(2px);
        }
        .pill-insta-icon {
          color: #f472b6;
        }
        .pill-ext-icon {
          opacity: 0.7;
        }

        /* Headings */
        .footer-heading {
          color: #ffffff;
          font-size: 1.05rem;
          font-family: var(--font-heading, sans-serif);
          margin-bottom: 20px;
          position: relative;
          padding-bottom: 10px;
        }
        .footer-heading::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 34px;
          height: 2px;
          background: #d97706;
          border-radius: 2px;
        }

        /* Nav lists */
        .footer-nav-list {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 9px;
          padding: 0;
          margin: 0;
        }
        .footer-nav-list li button {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          color: #b7a497;
          font-size: 0.88rem;
          background: none;
          border: none;
          padding: 3px 0;
          cursor: pointer;
          text-align: left;
          transition: all 0.2s ease;
        }
        .nav-arrow {
          color: #785949;
          transition: transform 0.2s ease, color 0.2s ease;
          flex-shrink: 0;
        }
        .footer-nav-list li button:hover {
          color: #ffffff;
          padding-left: 4px;
        }
        .footer-nav-list li button:hover .nav-arrow {
          color: #f59e0b;
          transform: translateX(2px);
        }

        /* Highlighting Special Items */
        .highlight-nav-item {
          color: #f59e0b !important;
          font-weight: 600;
        }
        .hot-pill {
          background: #ef4444;
          color: #ffffff;
          font-size: 0.65rem;
          font-weight: 800;
          padding: 2px 6px;
          border-radius: 4px;
          letter-spacing: 0.5px;
          margin-left: 6px;
        }
        .track-order-highlight {
          background: rgba(245, 158, 11, 0.12) !important;
          border: 1px solid rgba(245, 158, 11, 0.3) !important;
          color: #fde68a !important;
          padding: 6px 12px !important;
          border-radius: 8px !important;
          font-weight: 600;
          margin-bottom: 4px;
        }
        .track-order-highlight:hover {
          background: rgba(245, 158, 11, 0.22) !important;
          border-color: #f59e0b !important;
          color: #ffffff !important;
        }
        .track-box-icon {
          color: #f59e0b;
        }
        .live-tag {
          font-size: 0.62rem;
          background: #22c55e;
          color: #000;
          font-weight: 800;
          padding: 1px 5px;
          border-radius: 3px;
          margin-left: auto;
        }

        /* Column 4: Contact Showroom Cards */
        .contact-cards-stack {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .contact-card {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          background: rgba(255, 255, 255, 0.025);
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 10px;
          padding: 10px 14px;
          transition: border-color 0.2s ease, background 0.2s ease;
        }
        .contact-card:hover {
          background: rgba(255, 255, 255, 0.045);
          border-color: rgba(217, 119, 6, 0.35);
        }
        .contact-card-icon {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          margin-top: 2px;
        }
        .hotline-icon {
          background: rgba(245, 158, 11, 0.15);
          color: #f59e0b;
        }
        .wa-icon {
          background: rgba(34, 197, 94, 0.15);
          color: #22c55e;
        }
        .email-icon {
          background: rgba(59, 130, 246, 0.15);
          color: #60a5fa;
        }
        .pin-icon {
          background: rgba(239, 68, 68, 0.15);
          color: #f87171;
        }
        .clock-icon {
          background: rgba(168, 85, 247, 0.15);
          color: #c084fc;
        }

        .contact-card-info {
          display: flex;
          flex-direction: column;
          flex: 1;
        }
        .card-label {
          font-size: 0.68rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          color: #8c766a;
          margin-bottom: 2px;
        }
        .helpline-numbers-row {
          display: flex;
          align-items: center;
          gap: 6px;
          flex-wrap: wrap;
        }
        .helpline-link {
          color: #ffffff;
          font-size: 0.86rem;
          font-weight: 700;
          transition: color 0.2s ease;
        }
        .helpline-link:hover {
          color: #fbbf24;
          text-decoration: underline;
        }
        .num-sep {
          color: #5c4335;
          font-weight: bold;
        }
        .wa-action-link {
          color: #86efac;
          font-size: 0.86rem;
          font-weight: 700;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          transition: color 0.2s ease;
        }
        .wa-action-link:hover {
          color: #bbf7d0;
          text-decoration: underline;
        }
        .instant-badge {
          background: rgba(34, 197, 94, 0.2);
          color: #4ade80;
          font-size: 0.65rem;
          padding: 1px 6px;
          border-radius: 4px;
        }
        .email-link {
          color: #d1b8a7;
          font-size: 0.84rem;
          transition: color 0.2s ease;
        }
        .email-link:hover {
          color: #ffffff;
        }
        .showroom-address-text {
          font-size: 0.8rem;
          color: #bfaea2;
          line-height: 1.4;
          margin-bottom: 6px;
        }
        .maps-direction-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 0.74rem;
          font-weight: 700;
          color: #f59e0b;
          transition: color 0.2s ease;
          width: fit-content;
        }
        .maps-direction-btn:hover {
          color: #fde047;
          text-decoration: underline;
        }
        .hours-text {
          font-size: 0.8rem;
          color: #e2d5cb;
        }

        /* 3. Bottom Bar */
        .footer-bottom-bar {
          background: #0b0503;
          padding: 20px 0;
          border-top: 1px solid rgba(255, 255, 255, 0.05);
          font-size: 0.8rem;
          position: relative;
          z-index: 1;
        }
        .bottom-bar-inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 16px;
        }
        .copyright-group {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
        }
        .copyright-text {
          color: #8c766a;
          margin: 0;
        }
        .powered-by-divider {
          color: #453025;
        }
        .gstin-badge {
          color: #a89487;
          font-size: 0.74rem;
          background: rgba(255, 255, 255, 0.04);
          padding: 2px 6px;
          border-radius: 4px;
          border: 1px solid rgba(255, 255, 255, 0.06);
        }
        .powered-by-text {
          color: #a89487;
          margin: 0;
        }
        .powered-by-link {
          color: #f59e0b;
          font-weight: 700;
          text-decoration: none;
          transition: color 0.2s ease;
        }
        .powered-by-link:hover {
          color: #fde047;
          text-decoration: underline;
        }

        .bottom-bar-right-group {
          display: flex;
          align-items: center;
          gap: 18px;
          flex-wrap: wrap;
        }
        .payment-modes-strip {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
        }
        .payment-tag-title {
          color: #785949;
          font-size: 0.72rem;
          text-transform: uppercase;
          font-weight: 700;
          letter-spacing: 0.5px;
        }
        .payment-badges-list {
          display: flex;
          align-items: center;
          gap: 6px;
          flex-wrap: wrap;
        }
        .pay-chip {
          background: rgba(255, 255, 255, 0.06);
          border: 1px solid rgba(255, 255, 255, 0.09);
          color: #d1bfb3;
          padding: 3px 8px;
          border-radius: 4px;
          font-size: 0.7rem;
          font-weight: 600;
        }
        .emi-chip {
          border-color: rgba(245, 158, 11, 0.35);
          color: #fbbf24;
          background: rgba(245, 158, 11, 0.1);
        }
        .staff-portal-btn {
          background: rgba(255, 255, 255, 0.05);
          color: #a89487;
          border: 1px solid rgba(255, 255, 255, 0.12);
          padding: 4px 10px;
          border-radius: 6px;
          font-size: 0.72rem;
          display: inline-flex;
          align-items: center;
          gap: 5px;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .staff-portal-btn:hover {
          color: #fde68a;
          border-color: rgba(253, 230, 138, 0.4);
          background: rgba(255, 255, 255, 0.1);
        }

        /* 4. Policy Modal */
        .policy-modal-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.75);
          backdrop-filter: blur(6px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 10000;
          padding: 20px;
          animation: fadeIn 0.2s ease;
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .policy-modal-card {
          background: #1c0e08;
          border: 1px solid rgba(217, 119, 6, 0.3);
          border-radius: 18px;
          max-width: 560px;
          width: 100%;
          box-shadow: 0 25px 60px rgba(0, 0, 0, 0.6);
          overflow: hidden;
          animation: scaleUp 0.25s cubic-bezier(0.16, 1, 0.3, 1);
        }
        @keyframes scaleUp {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .policy-modal-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          padding: 24px 28px 18px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          background: rgba(255, 255, 255, 0.02);
        }
        .policy-pill-badge {
          display: inline-block;
          font-size: 0.7rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 1px;
          color: #fbbf24;
          background: rgba(251, 191, 36, 0.12);
          border: 1px solid rgba(251, 191, 36, 0.25);
          padding: 2px 8px;
          border-radius: 4px;
          margin-bottom: 6px;
        }
        .policy-header-title h3 {
          color: #ffffff;
          font-size: 1.25rem;
          font-family: var(--font-heading, sans-serif);
          margin: 0;
        }
        .policy-modal-close {
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: #d1bfb3;
          width: 34px;
          height: 34px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .policy-modal-close:hover {
          background: rgba(255, 255, 255, 0.18);
          color: #ffffff;
        }
        .policy-modal-body {
          padding: 24px 28px;
        }
        .policy-desc-text {
          color: #d8c7bc;
          font-size: 0.92rem;
          line-height: 1.5;
          margin-bottom: 18px;
        }
        .policy-points-list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .policy-points-list li {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          font-size: 0.88rem;
          color: #bfaea2;
          line-height: 1.45;
        }
        .point-icon {
          color: #22c55e;
          flex-shrink: 0;
          margin-top: 2px;
        }
        .policy-modal-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 18px 28px;
          background: rgba(0, 0, 0, 0.3);
          border-top: 1px solid rgba(255, 255, 255, 0.08);
          gap: 12px;
          flex-wrap: wrap;
        }
        .policy-wa-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: #25d366;
          color: #ffffff;
          font-size: 0.84rem;
          font-weight: 700;
          padding: 8px 16px;
          border-radius: 8px;
          transition: background 0.2s ease;
        }
        .policy-wa-btn:hover {
          background: #20ba59;
        }
        .policy-close-action-btn {
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.12);
          color: #ffffff;
          padding: 8px 18px;
          border-radius: 8px;
          font-size: 0.84rem;
          cursor: pointer;
        }
        .policy-close-action-btn:hover {
          background: rgba(255, 255, 255, 0.15);
        }

        /* Responsive Breakpoints */
        @media (max-width: 1080px) {
          .footer-columns-grid {
            grid-template-columns: 1.3fr 1fr 1fr;
            gap: 30px;
          }
          .footer-contact-col {
            grid-column: span 3;
          }
          .contact-cards-stack {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 14px;
          }
        }

        @media (max-width: 900px) {
          .trust-badges-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 768px) {
          .site-footer {
            /* Critical safe-area clearance for MobileBottomNav */
            padding-bottom: calc(75px + env(safe-area-inset-bottom, 0px));
          }
          .footer-columns-grid {
            grid-template-columns: 1fr;
            gap: 32px;
          }
          .footer-contact-col {
            grid-column: span 1;
          }
          .contact-cards-stack {
            grid-template-columns: 1fr;
          }
          .bottom-bar-inner {
            flex-direction: column;
            align-items: flex-start;
            gap: 16px;
          }
          .bottom-bar-right-group {
            flex-direction: column;
            align-items: flex-start;
            gap: 12px;
            width: 100%;
          }
          .staff-portal-btn {
            align-self: flex-start;
          }
        }

        @media (max-width: 520px) {
          .trust-badges-grid {
            grid-template-columns: 1fr;
          }
          .helpline-numbers-row {
            flex-direction: column;
            align-items: flex-start;
            gap: 2px;
          }
          .num-sep {
            display: none;
          }
        }
      `}</style>
    </footer>
  );
}