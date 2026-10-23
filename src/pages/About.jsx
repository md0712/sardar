import React from 'react';
import { 
  Building2, Award, Users, ShieldCheck, HeartHandshake, 
  MapPin, CheckCircle2, Sparkles, Phone, MessageCircle 
} from 'lucide-react';
import { storeInfo } from '../data/products';

export default function About({ onNavigate }) {
  const brandPartners = [
    'Samsung', 'LG Electronics', 'Sony Bravia', 'Bosch Home', 
    'Whirlpool', 'Panasonic', 'Philips', 'Prestige', 'Sleepwell', 'Duroflex'
  ];

  return (
    <div className="about-page">
      {/* 1. Hero Header */}
      <section className="about-hero">
        <div className="container">
          <div className="about-hero-content">
            <span className="badge-pill badge-bestseller">Established 2011</span>
            <h1 className="about-headline">
              Crafting Beautiful Homes with Elegance &amp; Innovation
            </h1>
            <p className="about-sub">
              For over a decade, <strong>Sardar Mart</strong> Furniture and Home Appliances has stood as South India's premier integrated furniture and consumer electronics destination.
            </p>
          </div>
        </div>
      </section>

      {/* 2. Stats Grid */}
      <section className="about-stats-section">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-card">
              <span className="stat-number">15,000+</span>
              <span className="stat-label">Homes Furnished Across India</span>
            </div>
            <div className="stat-card">
              <span className="stat-number">10,000+</span>
              <span className="stat-label">Sq.Ft Flagship Showroom Space</span>
            </div>
            <div className="stat-card">
              <span className="stat-number">500+</span>
              <span className="stat-label">Curated Furniture &amp; Appliance Models</span>
            </div>
            <div className="stat-card">
              <span className="stat-number">4.8 ★</span>
              <span className="stat-label">Customer Satisfaction Rating</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Our Story & Philosophy */}
      <section className="about-story-section">
        <div className="container">
          <div className="story-grid">
            <div className="story-img-box">
              <img 
                src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80" 
                alt="Sardar Mart Furniture and Home Appliances Showroom Interior" 
                className="story-img"
              />
              <div className="story-experience-badge">
                <strong>15+ Years</strong>
                <span>Of Trust &amp; Excellence</span>
              </div>
            </div>

            <div className="story-text-col">
              <span className="section-pill">Our Heritage</span>
              <h2 className="story-heading">From a Modest Studio to South India’s Most Trusted Mega Store</h2>
              <p>
                <strong>Sardar Mart</strong> Furniture and Home Appliances began with a simple belief: a home should be an inspiring sanctuary of comfort, style, and effortless modern convenience. Homeowners shouldn't have to visit five different stores across town just to coordinate their living room sofa, dining suite, and 4K entertainment system.
              </p>
              <p>
                By bringing together master carpentry with authorized tier-1 electronics dealerships, we give homeowners a seamless one-stop experience with unified delivery, single-invoice financing, and unified warranty assurance.
              </p>

              <div className="story-checklist">
                <div className="check-item">
                  <CheckCircle2 size={18} className="check-icon" />
                  <span>100% Seasoned Sheesham &amp; Kiln-Dried Teak Wood</span>
                </div>
                <div className="check-item">
                  <CheckCircle2 size={18} className="check-icon" />
                  <span>Authorized Dealer for Sony, LG, Samsung &amp; Bosch</span>
                </div>
                <div className="check-item">
                  <CheckCircle2 size={18} className="check-icon" />
                  <span>Direct Factory-to-Consumer Transparent Pricing</span>
                </div>
                <div className="check-item">
                  <CheckCircle2 size={18} className="check-icon" />
                  <span>White-Glove In-Home Unboxing &amp; Expert Assembly</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Core Pillars */}
      <section className="pillars-section">
        <div className="container">
          <div className="section-header-center">
            <h2 className="section-main-heading">Why Choose <strong>Sardar Mart</strong> Furniture and Home Appliances?</h2>
            <p className="section-sub-heading">Built upon four core promises to make home improvement enjoyable and stress-free</p>
          </div>

          <div className="pillars-grid">
            <div className="pillar-card">
              <div className="pillar-icon-box">
                <Award size={26} />
              </div>
              <h3>Master Craftsmanship</h3>
              <p>Every wooden piece is hand-finished with multi-stage polyurethane lacquers that resist moisture, termite attacks, and heat stains.</p>
            </div>

            <div className="pillar-card">
              <div className="pillar-icon-box">
                <ShieldCheck size={26} />
              </div>
              <h3>Authentic Brand Warranty</h3>
              <p>Zero grey-market components. All smart TVs, refrigerators, and appliances are sourced directly from brand headquarters with GST tax invoices.</p>
            </div>

            <div className="pillar-card">
              <div className="pillar-icon-box">
                <HeartHandshake size={26} />
              </div>
              <h3>Personalized Interior Consult</h3>
              <p>Our in-house showroom architects offer free 3D layout recommendations to ensure your chosen furniture dimensions fit your room layout perfectly.</p>
            </div>

            <div className="pillar-card">
              <div className="pillar-icon-box">
                <Sparkles size={26} />
              </div>
              <h3>Synchronized Delivery</h3>
              <p>Order a living room sofa, dining set, and 55" TV together, and have them all delivered and mounted simultaneously in one single visit.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Brand Partners */}
      <section className="partners-section">
        <div className="container">
          <div className="section-header-center">
            <span className="partners-tag">Trusted Technology Alliances</span>
            <h3 className="partners-title">Authorized Brand Partners</h3>
          </div>

          <div className="partners-pills-row">
            {brandPartners.map((brand, i) => (
              <div key={i} className="partner-brand-pill">
                {brand}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Showroom Branches Preview */}
      <section className="branches-preview-section">
        <div className="container">
          <div className="branches-card">
            <div className="branches-left">
              <h2>Visit Our Experience Showrooms</h2>
              <p>Walk through real-life apartment mockups, touch the premium upholstery, and experience theater-grade Dolby Atmos sound in person.</p>
              
              <div className="branch-items-list">
                {storeInfo.branches.map((b, i) => (
                  <div key={i} className="branch-preview-row">
                    <MapPin size={18} className="branch-pin" />
                    <div>
                      <strong>{b.name}</strong>
                      <span>{b.address}</span>
                      <small>🕒 {b.timing}</small>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="branches-right-cta">
              <button 
                className="btn-primary"
                onClick={() => onNavigate('contact')}
              >
                View Full Map &amp; Directions
              </button>
              <a 
                href="https://wa.me/916383056338?text=Hi%20Sardar%20Mart%20Furniture%20and%20Home%20Appliances%2C%20I%20would%20like%20to%20visit%20your%20Chennai%20showroom"
                target="_blank"
                rel="noreferrer"
                className="btn-whatsapp"
              >
                <MessageCircle size={18} /> Schedule VIP Showroom Visit
              </a>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        .about-page {
          padding-bottom: 60px;
        }

        .about-hero {
          background: linear-gradient(135deg, #2a1810 0%, #170d07 100%);
          color: #ffffff;
          padding: 60px 0;
          text-align: center;
        }
        .about-hero-content {
          max-width: 750px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .about-headline {
          font-size: 2.7rem;
          font-weight: 800;
          color: #ffffff;
          margin: 14px 0 10px;
          line-height: 1.2;
        }
        .about-sub {
          font-size: 1.1rem;
          color: #e2d5cb;
          line-height: 1.5;
        }

        /* Stats */
        .about-stats-section {
          transform: translateY(-30px);
        }
        .stats-grid {
          background: #ffffff;
          border-radius: var(--radius-xl);
          border: 1px solid var(--color-border);
          box-shadow: var(--shadow-md);
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          padding: 24px 30px;
          gap: 20px;
        }
        .stat-card {
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          border-right: 1px solid #f0e6de;
        }
        .stat-card:last-child {
          border-right: none;
        }
        .stat-number {
          font-family: var(--font-heading);
          font-size: 2.2rem;
          font-weight: 800;
          color: var(--color-primary);
          line-height: 1;
          margin-bottom: 6px;
        }
        .stat-label {
          font-size: 0.8rem;
          color: var(--color-text-muted);
          font-weight: 600;
        }

        /* Story */
        .about-story-section {
          padding: 40px 0 60px;
        }
        .story-grid {
          display: grid;
          grid-template-columns: 1fr 1.2fr;
          gap: 50px;
          align-items: center;
        }
        .story-img-box {
          position: relative;
          height: 440px;
          border-radius: var(--radius-xl);
          overflow: hidden;
          box-shadow: var(--shadow-lg);
        }
        .story-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .story-experience-badge {
          position: absolute;
          bottom: 24px;
          right: 24px;
          background: rgba(36, 20, 14, 0.9);
          backdrop-filter: blur(8px);
          color: #ffffff;
          padding: 16px 22px;
          border-radius: var(--radius-lg);
          border: 1px solid rgba(255, 255, 255, 0.2);
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .story-experience-badge strong {
          font-family: var(--font-heading);
          font-size: 1.6rem;
          color: #fde047;
          line-height: 1;
        }
        .story-experience-badge span {
          font-size: 0.75rem;
          color: #e2d5cb;
        }

        .story-text-col {
          display: flex;
          flex-direction: column;
        }
        .section-pill {
          color: var(--color-primary);
          font-size: 0.8rem;
          font-weight: 800;
          letter-spacing: 1px;
          text-transform: uppercase;
          margin-bottom: 8px;
        }
        .story-heading {
          font-size: 2.1rem;
          font-weight: 800;
          line-height: 1.25;
          margin-bottom: 16px;
        }
        .story-text-col p {
          color: var(--color-text-muted);
          font-size: 0.95rem;
          line-height: 1.65;
          margin-bottom: 14px;
        }
        .story-checklist {
          margin-top: 14px;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .check-item {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 0.92rem;
          font-weight: 600;
          color: var(--color-text-main);
        }
        .check-icon {
          color: var(--color-primary);
          flex-shrink: 0;
        }

        /* Pillars */
        .pillars-section {
          padding: 60px 0;
          background: #fbf7f2;
          border-top: 1px solid var(--color-border);
          border-bottom: 1px solid var(--color-border);
        }
        .pillars-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 24px;
        }
        .pillar-card {
          background: #ffffff;
          padding: 26px;
          border-radius: var(--radius-lg);
          border: 1px solid var(--color-border);
          box-shadow: var(--shadow-sm);
          display: flex;
          flex-direction: column;
        }
        .pillar-icon-box {
          width: 52px;
          height: 52px;
          border-radius: 12px;
          background: var(--color-primary-light);
          color: var(--color-primary);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 16px;
        }
        .pillar-card h3 {
          font-size: 1.15rem;
          margin-bottom: 8px;
        }
        .pillar-card p {
          font-size: 0.86rem;
          color: var(--color-text-muted);
          line-height: 1.5;
        }

        /* Partners */
        .partners-section {
          padding: 50px 0;
        }
        .partners-tag {
          font-size: 0.78rem;
          font-weight: 700;
          color: var(--color-primary);
          text-transform: uppercase;
          letter-spacing: 1px;
        }
        .partners-title {
          font-size: 1.6rem;
          margin-top: 4px;
        }
        .partners-pills-row {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 12px;
          margin-top: 24px;
        }
        .partner-brand-pill {
          background: #ffffff;
          border: 1px solid var(--color-border);
          padding: 10px 22px;
          border-radius: var(--radius-full);
          font-weight: 700;
          font-size: 0.95rem;
          color: var(--color-warm-dark);
          box-shadow: var(--shadow-sm);
        }

        /* Branches Card */
        .branches-preview-section {
          padding: 20px 0 50px;
        }
        .branches-card {
          background: linear-gradient(135deg, #2a1810 0%, #170d07 100%);
          color: #ffffff;
          border-radius: var(--radius-xl);
          padding: 40px;
          display: grid;
          grid-template-columns: 1.5fr 1fr;
          gap: 40px;
          align-items: center;
        }
        .branches-left h2 {
          font-size: 1.85rem;
          color: #ffffff;
          margin-bottom: 8px;
        }
        .branches-left p {
          color: #d1b8a7;
          font-size: 0.9rem;
          margin-bottom: 24px;
        }
        .branch-items-list {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }
        .branch-preview-row {
          display: flex;
          align-items: flex-start;
          gap: 12px;
        }
        .branch-pin {
          color: #fde047;
          flex-shrink: 0;
          margin-top: 2px;
        }
        .branch-preview-row div {
          display: flex;
          flex-direction: column;
        }
        .branch-preview-row strong {
          color: #ffffff;
          font-size: 0.95rem;
        }
        .branch-preview-row span {
          color: #d1b8a7;
          font-size: 0.82rem;
        }
        .branch-preview-row small {
          color: #4ade80;
          font-size: 0.75rem;
          margin-top: 2px;
        }
        .branches-right-cta {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        @media (max-width: 992px) {
          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          .story-grid {
            grid-template-columns: 1fr;
          }
          .pillars-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          .branches-card {
            grid-template-columns: 1fr;
            padding: 26px;
          }
        }
        @media (max-width: 600px) {
          .stats-strip-box {
            padding: 18px 14px;
          }
          .stats-grid {
            grid-template-columns: 1fr;
            gap: 14px;
          }
          .stat-card {
            border-right: none;
            border-bottom: 1px solid #f0e6de;
            padding-bottom: 12px;
          }
          .stat-number {
            font-size: 1.8rem;
          }
          .story-img-box {
            height: 250px;
          }
          .story-heading {
            font-size: 1.5rem;
          }
          .pillars-grid {
            grid-template-columns: 1fr;
          }
          .branches-card {
            padding: 20px 14px;
          }
        }
      `}</style>
    </div>
  );
}
