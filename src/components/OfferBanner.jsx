import React from 'react';
import { ArrowRight, Tag, Percent, Sparkles, CreditCard, ShieldCheck } from 'lucide-react';

export default function OfferBanner({ type = 'duo', onNavigate }) {
  if (type === 'duo') {
    return (
      <section className="duo-banners-section">
        <div className="container">
          <div className="duo-grid">
            {/* Banner 1: Furniture */}
            <div 
              className="promo-banner-card furn-banner"
              onClick={() => onNavigate && onNavigate('furniture')}
            >
              <div className="banner-overlay-gradient"></div>
              <img 
                src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80" 
                alt="Premium Furniture Collection" 
                className="banner-bg-img"
              />
              <div className="banner-content">
                <span className="banner-badge">Handcrafted Elegance</span>
                <h3 className="banner-title">Premium Furniture Collection</h3>
                <p className="banner-subtext">Comfort | Style | Solid Sheesham Wood</p>
                <button className="banner-cta-btn">
                  Explore Now <ArrowRight size={16} />
                </button>
              </div>
            </div>

            {/* Banner 2: Electronics */}
            <div 
              className="promo-banner-card elec-banner"
              onClick={() => onNavigate && onNavigate('electronics')}
            >
              <div className="banner-overlay-gradient"></div>
              <img 
                src="https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&w=800&q=80" 
                alt="Latest Electronics" 
                className="banner-bg-img"
              />
              <div className="banner-content">
                <span className="banner-badge badge-amber">Smart Innovation</span>
                <h3 className="banner-title">Latest Smart Electronics</h3>
                <p className="banner-subtext">Smart Living for Every Modern Home</p>
                <button className="banner-cta-btn">
                  Explore Now <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>

        <style>{`
          .duo-banners-section {
            padding: 20px 0 35px;
          }
          .duo-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 24px;
          }
          .promo-banner-card {
            position: relative;
            height: 250px;
            border-radius: var(--radius-xl);
            overflow: hidden;
            cursor: pointer;
            box-shadow: var(--shadow-md);
            transition: all var(--transition-normal);
          }
          .promo-banner-card:hover {
            transform: translateY(-4px);
            box-shadow: var(--shadow-xl);
          }
          .banner-bg-img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            transition: transform 0.6s ease;
          }
          .promo-banner-card:hover .banner-bg-img {
            transform: scale(1.06);
          }
          .banner-overlay-gradient {
            position: absolute;
            inset: 0;
            background: linear-gradient(90deg, rgba(30, 16, 10, 0.88) 0%, rgba(30, 16, 10, 0.5) 60%, rgba(30, 16, 10, 0.2) 100%);
            z-index: 1;
          }
          .banner-content {
            position: absolute;
            inset: 0;
            z-index: 2;
            padding: 30px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: flex-start;
            color: #ffffff;
            max-width: 80%;
          }
          .banner-badge {
            background: rgba(255, 255, 255, 0.2);
            backdrop-filter: blur(4px);
            color: #fed7aa;
            font-size: 0.72rem;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 1px;
            padding: 4px 10px;
            border-radius: var(--radius-full);
            margin-bottom: 12px;
          }
          .banner-badge.badge-amber {
            color: #fde047;
          }
          .banner-title {
            font-size: 1.55rem;
            font-weight: 800;
            color: #ffffff;
            line-height: 1.2;
            margin-bottom: 6px;
          }
          .banner-subtext {
            font-size: 0.9rem;
            color: #ffedd5;
            margin-bottom: 18px;
            font-weight: 400;
          }
          .banner-cta-btn {
            background: var(--color-primary);
            color: #ffffff;
            padding: 9px 20px;
            border-radius: var(--radius-md);
            font-weight: 700;
            font-size: 0.88rem;
            display: inline-flex;
            align-items: center;
            gap: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
            transition: all var(--transition-fast);
          }
          .promo-banner-card:hover .banner-cta-btn {
            background: #ffffff;
            color: var(--color-warm-dark);
          }

          @media (max-width: 768px) {
            .duo-grid {
              grid-template-columns: 1fr;
              gap: 16px;
            }
            .promo-banner-card {
              height: 200px;
            }
            .banner-title {
              font-size: 1.3rem;
            }
          }
        `}</style>
      </section>
    );
  }

  // Trio special deals strip (Festival Offers, Combo Deals, EMI Options)
  return (
    <section className="trio-offers-section">
      <div className="container">
        <div className="trio-grid">
          {/* Card 1: Festival Offers */}
          <div 
            className="trio-card card-festive"
            onClick={() => onNavigate && onNavigate('offers')}
          >
            <div className="trio-inner">
              <span className="trio-top-tag">
                <Sparkles size={14} /> Festival Offers
              </span>
              <h4 className="trio-big-title">Up to 50% OFF</h4>
              <p className="trio-desc">On Selected Living, Dining &amp; Electronics</p>
              <button className="trio-cta-btn">
                Shop Offers <ArrowRight size={14} />
              </button>
            </div>
            <div className="trio-image-box">
              <img 
                src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=300&q=80" 
                alt="Festival Offers" 
              />
            </div>
          </div>

          {/* Card 2: Combo Deals */}
          <div 
            className="trio-card card-combo"
            onClick={() => onNavigate && onNavigate('offers')}
          >
            <div className="trio-inner">
              <span className="trio-top-tag">
                <Percent size={14} /> Combo Deals
              </span>
              <h4 className="trio-big-title">Furniture + Electronics</h4>
              <p className="trio-desc">Best Bundled Prices for Your New Home</p>
              <button className="trio-cta-btn">
                Explore Deals <ArrowRight size={14} />
              </button>
            </div>
            <div className="trio-image-box">
              <img 
                src="https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&w=300&q=80" 
                alt="Combo Deals" 
              />
            </div>
          </div>

          {/* Card 3: EMI Options */}
          <div 
            className="trio-card card-emi"
            onClick={() => onNavigate && onNavigate('offers')}
          >
            <div className="trio-inner">
              <span className="trio-top-tag">
                <CreditCard size={14} /> EMI Options Available
              </span>
              <h4 className="trio-big-title">Shop Now, Pay Later</h4>
              <p className="trio-desc">0% Interest No Cost EMI on Leading Cards</p>
              <button className="trio-cta-btn">
                Know More <ArrowRight size={14} />
              </button>
            </div>
            <div className="trio-image-box emi-illustration">
              <div className="credit-card-mockup">
                <div className="card-chip"></div>
                <div className="card-num">•••• •••• •••• 4242</div>
                <div className="card-brand">NO COST EMI</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .trio-offers-section {
          padding: 30px 0 45px;
        }
        .trio-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
        }
        .trio-card {
          background: #ffffff;
          border-radius: var(--radius-lg);
          border: 1px solid var(--color-border);
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 22px;
          cursor: pointer;
          transition: all var(--transition-fast);
          box-shadow: var(--shadow-sm);
          position: relative;
        }
        .trio-card:hover {
          transform: translateY(-4px);
          box-shadow: var(--shadow-lg);
          border-color: var(--color-primary);
        }

        .card-festive {
          background: linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%);
        }
        .card-combo {
          background: linear-gradient(135deg, #fefce8 0%, #fef9c3 100%);
        }
        .card-emi {
          background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
        }

        .trio-inner {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
        }
        .trio-top-tag {
          font-size: 0.76rem;
          font-weight: 700;
          color: var(--color-primary);
          display: inline-flex;
          align-items: center;
          gap: 5px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 6px;
        }
        .trio-big-title {
          font-size: 1.25rem;
          font-weight: 800;
          color: var(--color-warm-dark);
          line-height: 1.2;
          margin-bottom: 4px;
        }
        .trio-desc {
          font-size: 0.8rem;
          color: var(--color-text-muted);
          margin-bottom: 14px;
          line-height: 1.35;
        }
        .trio-cta-btn {
          background: var(--color-warm-dark);
          color: #ffffff;
          padding: 6px 14px;
          border-radius: var(--radius-md);
          font-size: 0.8rem;
          font-weight: 700;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          transition: background var(--transition-fast);
        }
        .trio-card:hover .trio-cta-btn {
          background: var(--color-primary);
        }

        .trio-image-box {
          width: 95px;
          height: 95px;
          border-radius: var(--radius-md);
          overflow: hidden;
          flex-shrink: 0;
          margin-left: 12px;
          box-shadow: 0 4px 10px rgba(0,0,0,0.1);
        }
        .trio-image-box img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .emi-illustration {
          background: #1e293b;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 10px;
        }
        .credit-card-mockup {
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, #0284c7 0%, #0369a1 100%);
          border-radius: 6px;
          padding: 6px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          color: #ffffff;
          font-size: 0.5rem;
        }
        .card-chip {
          width: 12px;
          height: 9px;
          background: #fbbf24;
          border-radius: 2px;
        }
        .card-num {
          font-family: monospace;
          letter-spacing: 0.5px;
        }
        .card-brand {
          font-weight: 800;
          letter-spacing: 0.5px;
          text-align: right;
        }

        @media (max-width: 900px) {
          .trio-grid {
            grid-template-columns: 1fr;
            gap: 14px;
          }
        }
      `}</style>
    </section>
  );
}
