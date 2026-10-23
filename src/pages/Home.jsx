import React, { useState, useEffect } from 'react';
import { 
  ArrowRight, Sparkles, Truck, CreditCard, 
  ShieldCheck, Lock, Star, ChevronRight, ChevronLeft, MessageCircle, MapPin, Package, Layers 
} from 'lucide-react';
import CategoryCard from '../components/CategoryCard';
import ProductCard from '../components/ProductCard';
import OfferBanner from '../components/OfferBanner';
import { categories as defaultCategories, storeInfo } from '../data/products';
import { subscribeToReviews } from '../services/reviewService';

export default function Home({ 
  onNavigate, 
  onSelectProduct, 
  onAddToCart, 
  wishlist = [], 
  onToggleWishlist,
  cart = [],
  onUpdateQuantity,
  products: customProducts,
  categories: propCategories
}) {
  const allProducts = Array.isArray(customProducts) ? customProducts : (customProducts || []);
  const activeCategories = (Array.isArray(propCategories) && propCategories.length > 0)
    ? propCategories
    : defaultCategories;
  const [activeTab, setActiveTab] = useState('all');
  const [heroSlide, setHeroSlide] = useState(0);

  // Real customer reviews & feedback synced live from Cloud Firestore backend
  const [backendReviews, setBackendReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(true);

  useEffect(() => {
    const unsub = subscribeToReviews(
      (list) => {
        setBackendReviews(list || []);
        setLoadingReviews(false);
      },
      (err) => {
        console.warn('Real-time reviews subscription notice on Home:', err);
        setLoadingReviews(false);
      }
    );
    return () => {
      if (typeof unsub === 'function') unsub();
    };
  }, []);

  const heroSlides = [
    {
      id: 'slide-1',
      badge: 'New Festive Living Collection',
      badgeIcon: <Sparkles size={14} />,
      headline: 'Make Your Home More Beautiful',
      tagline: 'Stylish Furniture & Latest Electronics for a Better Living',
      extraNote: 'Up to 40% OFF on Sofas & Beds',
      image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1200&q=80',
      categoryTarget: 'furniture'
    },
    {
      id: 'slide-2',
      badge: 'Smart Home Innovation',
      badgeIcon: <Sparkles size={14} />,
      headline: 'Next-Gen Smart Electronics',
      tagline: '4K OLED Cinema TVs, Inverter Refrigerators & AI Steam Washers',
      extraNote: '0% No-Cost EMI Available for 18 Months',
      image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&w=1200&q=80',
      categoryTarget: 'electronics'
    },
    {
      id: 'slide-3',
      badge: 'Exclusive Combo Deals',
      badgeIcon: <Sparkles size={14} />,
      headline: 'Living Room Royale Bundles',
      tagline: 'Pair 3-Seater Recliners with 55" Smart TVs & Save Flat ₹25,000',
      extraNote: 'Free White-Glove Unboxing & Installation',
      image: 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&w=1200&q=80',
      categoryTarget: 'offers'
    },
    {
      id: 'slide-4',
      badge: 'Solid Wood Heritage',
      badgeIcon: <Sparkles size={14} />,
      headline: 'Handcrafted Sheesham Dining Sets',
      tagline: 'Timeless 6-Seater Contoured Dining Suites with 10-Year Warranty',
      extraNote: '100% Genuine Seasoned Timber',
      image: 'https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&w=1200&q=80',
      categoryTarget: 'furniture'
    }
  ];

  // Auto-slide hero carousel every 4.5s
  useEffect(() => {
    const timer = setInterval(() => {
      setHeroSlide((prev) => (prev + 1) % heroSlides.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  const prevHeroSlide = (e) => {
    e.stopPropagation();
    setHeroSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  const nextHeroSlide = (e) => {
    e.stopPropagation();
    setHeroSlide((prev) => (prev + 1) % heroSlides.length);
  };

  const filteredFeatured = allProducts.filter(p => {
    if (activeTab === 'all') return p.featured;
    return p.featured && p.category === activeTab;
  });
  const displayFeatured = filteredFeatured.length > 0 
    ? filteredFeatured 
    : (activeTab === 'all' ? allProducts : allProducts.filter(p => p.category === activeTab));

  const activeHero = heroSlides[heroSlide];

  return (
    <div className="home-page">
      {/* 1. Sliding Hero Showcase Section */}
      <section className="hero-section">
        <div className="container hero-container">
          <div className="hero-grid">
            {/* Left Sliding Main Hero Banner */}
            <div 
              className="hero-main-card"
              onClick={() => onNavigate(activeHero.categoryTarget)}
            >
              <div className="hero-overlay"></div>
              <img 
                src={activeHero.image} 
                alt={activeHero.headline} 
                className="hero-bg-img hero-slide-fade"
                key={heroSlide}
              />
              
              <div className="hero-content">
                <span className="hero-pill-badge">
                  {activeHero.badgeIcon} {activeHero.badge}
                </span>
                <h1 className="hero-headline">
                  {activeHero.headline}
                </h1>
                <p className="hero-tagline">
                  {activeHero.tagline}
                </p>
                <div className="hero-cta-group">
                  <button className="hero-primary-btn">
                    Shop Now <ArrowRight size={18} />
                  </button>
                  <span className="hero-extra-note">{activeHero.extraNote}</span>
                </div>
              </div>

              {/* Slider Controls: Arrows */}
              <button 
                className="hero-carousel-arrow hero-arrow-left" 
                onClick={prevHeroSlide} 
                aria-label="Previous Slide"
              >
                <ChevronLeft size={20} />
              </button>
              <button 
                className="hero-carousel-arrow hero-arrow-right" 
                onClick={nextHeroSlide} 
                aria-label="Next Slide"
              >
                <ChevronRight size={20} />
              </button>

              {/* Slider Controls: Pagination Dots */}
              <div className="hero-dots-container">
                {heroSlides.map((_, idx) => (
                  <button
                    key={idx}
                    className={`hero-dot ${idx === heroSlide ? 'active' : ''}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setHeroSlide(idx);
                    }}
                    aria-label={`Slide ${idx + 1}`}
                  />
                ))}
              </div>
            </div>

            {/* Right Hero Side Banner: Smart Electronics Focus */}
            <div 
              className="hero-side-card"
              onClick={() => onNavigate('electronics')}
            >
              <div className="side-hero-overlay"></div>
              <img 
                src="https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&w=800&q=80" 
                alt="Smart Electronics for a Smarter Home" 
                className="side-hero-img"
              />
              <div className="side-hero-content">
                <span className="side-hero-badge">Smart Home Living</span>
                <h2 className="side-hero-title">
                  Smart Electronics <br />for a Smarter Home
                </h2>
                <p className="side-hero-sub">
                  4K OLED TVs, Inverter Refrigerators &amp; AI Washers
                </p>
                <button className="side-hero-btn">
                  Explore Electronics <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Value Proposition Strip (4 Round Icons) */}
      <section className="features-strip-section">
        <div className="container">
          <div className="features-strip-card">
            <div className="strip-item">
              <div className="strip-icon-circle">
                <Truck size={22} />
              </div>
              <div className="strip-text">
                <strong>Free Delivery</strong>
                <span>All Over India</span>
              </div>
            </div>

            <div className="strip-item">
              <div className="strip-icon-circle">
                <CreditCard size={22} />
              </div>
              <div className="strip-text">
                <strong>Easy EMI</strong>
                <span>No Cost EMI Options</span>
              </div>
            </div>

            <div className="strip-item">
              <div className="strip-icon-circle">
                <ShieldCheck size={22} />
              </div>
              <div className="strip-text">
                <strong>1 Year Warranty</strong>
                <span>On Selected Products</span>
              </div>
            </div>

            <div className="strip-item">
              <div className="strip-icon-circle">
                <Lock size={22} />
              </div>
              <div className="strip-text">
                <strong>Secure Payment</strong>
                <span>100% Safe &amp; Secure</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Shop by Category */}
      <section className="categories-section">
        <div className="container">
          <div className="section-header-row">
            <div>
              <h2 className="section-main-heading">Shop by Category</h2>
              <p className="section-sub-heading">Explore our top handpicked collections for every corner of your home</p>
            </div>
            <button 
              className="view-all-link-btn"
              onClick={() => onNavigate('furniture')}
            >
              View All Categories <ChevronRight size={16} />
            </button>
          </div>

          <div className="categories-row-grid">
            {activeCategories.map((cat) => {
              const catId = (cat.id || '').toLowerCase().trim();
              const catName = (cat.name || '').toLowerCase().trim();
              const catDept = (cat.category || '').toLowerCase().trim();

              // Calculate live model count directly from backend Firestore database products
              const liveCount = allProducts.filter((p) => {
                const pSub = (p.subcategory || '').toLowerCase().trim();
                const pCat = (p.category || '').toLowerCase().trim();
                const pName = (p.name || '').toLowerCase().trim();

                // Direct subcategory match
                if (pSub && (pSub === catId || pSub === catName)) return true;
                // Match parent department if category is top-level
                if (pCat && (pCat === catId || pCat === catName)) return true;
                // Department match + subcategory
                if (catDept && pCat === catDept && pSub && pSub === catId) return true;
                // Keyword match
                if (catId && pSub.includes(catId)) return true;
                if (catName && (pSub.includes(catName) || pName.includes(catName))) return true;
                return false;
              }).length;

              // Format dynamic count label (e.g. "24+ Models", "3 Models", or "0 Models")
              const countLabel = liveCount > 0 
                ? (liveCount >= 5 ? `${liveCount}+ Models` : `${liveCount} Model${liveCount === 1 ? '' : 's'}`)
                : '0 Models';

              return (
                <CategoryCard 
                  key={cat.id} 
                  category={{
                    ...cat,
                    itemCount: countLabel
                  }} 
                  onSelectCategory={() => {
                    // Determine parent department
                    const targetDept = ['furniture', 'electronics', 'appliances'].includes(catDept)
                      ? catDept
                      : (['furniture', 'electronics', 'appliances'].includes(catId)
                          ? catId
                          : 'furniture');
                    // Navigate to department and filter by subcategory to display the products immediately
                    onNavigate(targetDept, cat.id);
                  }} 
                />
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. Duo Promos: Premium Furniture & Latest Electronics */}
      <OfferBanner type="duo" onNavigate={onNavigate} />

      {/* 5. Featured Products Section with Category Switcher Tabs */}
      <section className="featured-products-section">
        <div className="container container-wide">
          <div className="featured-header-row">
            <div>
              <h2 className="section-main-heading">Featured Products</h2>
              <p className="section-sub-heading">Best selling furniture &amp; popular electronics with instant WhatsApp inquiry</p>
            </div>

            {/* Mobile Dropdown Selector for Featured Products */}
            <div className="featured-mobile-dropdown-wrap">
              <Layers size={15} className="featured-dropdown-icon" />
              <select
                value={activeTab}
                onChange={(e) => setActiveTab(e.target.value)}
                className="featured-mobile-select"
                aria-label="Filter featured products category"
              >
                <option value="all">All Featured</option>
                <option value="furniture">Furniture</option>
                <option value="electronics">Electronics</option>
                <option value="appliances">Home Appliances</option>
              </select>
            </div>

            <div className="category-tabs-group desktop-category-tabs">
              <button 
                className={`tab-btn ${activeTab === 'all' ? 'active' : ''}`}
                onClick={() => setActiveTab('all')}
              >
                All Featured
              </button>
              <button 
                className={`tab-btn ${activeTab === 'furniture' ? 'active' : ''}`}
                onClick={() => setActiveTab('furniture')}
              >
                Furniture
              </button>
              <button 
                className={`tab-btn ${activeTab === 'electronics' ? 'active' : ''}`}
                onClick={() => setActiveTab('electronics')}
              >
                Electronics
              </button>
              <button 
                className={`tab-btn ${activeTab === 'appliances' ? 'active' : ''}`}
                onClick={() => setActiveTab('appliances')}
              >
                Home Appliances
              </button>
            </div>

            <button 
              className="view-all-link-btn desk-only"
              onClick={() => onNavigate(activeTab === 'all' ? 'furniture' : activeTab)}
            >
              View All ({allProducts.length}) <ChevronRight size={16} />
            </button>
          </div>

          {displayFeatured.length > 0 ? (
            <div className="products-grid">
              {displayFeatured.map((prod) => (
                <ProductCard
                  key={prod.id}
                  product={prod}
                  onSelectProduct={onSelectProduct}
                  onAddToCart={onAddToCart}
                  isWishlisted={wishlist.some(item => item.id === prod.id)}
                  onToggleWishlist={onToggleWishlist}
                  cartQuantity={cart?.find(item => item.id === prod.id)?.quantity || 0}
                  onUpdateQuantity={onUpdateQuantity}
                />
              ))}
            </div>
          ) : (
            <div className="no-products-box" style={{ textAlign: 'center', padding: '60px 20px', background: '#f8fafc', borderRadius: '16px', margin: '20px 0', border: '1px dashed #cbd5e1' }}>
              <Package size={48} style={{ color: '#94a3b8', margin: '0 auto 16px', display: 'block' }} />
              <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#1e293b', marginBottom: '8px' }}>No products found</h3>
              <p style={{ color: '#64748b', fontSize: '0.95rem' }}>No products available in this category yet from the store database.</p>
            </div>
          )}

          <div className="center-view-all-box">
            <button 
              className="btn-primary"
              onClick={() => onNavigate('furniture')}
            >
              Browse Full Catalog &amp; Filters <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </section>

      {/* 6. Trio Deals Campaign: Festival Offers, Combo Deals, EMI Options */}
      <OfferBanner type="trio" onNavigate={onNavigate} />

      {/* 7. Real Customer Reviews Section from Cloud Firestore Backend */}
      <section className="testimonials-section">
        <div className="container">
          <div className="section-header-center">
            <span className="badge-pill badge-bestseller">Verified Showroom Feedback</span>
            <h2 className="section-main-heading">What Our Valued Customers Say</h2>
            <p className="section-sub-heading">
              Real experiences and reviews submitted by our customers across Chennai
            </p>
          </div>

          {loadingReviews ? (
            <div style={{ textAlign: 'center', padding: '50px 0', color: '#64748b' }}>
              <div style={{ 
                display: 'inline-block', 
                width: '32px', 
                height: '32px', 
                border: '3px solid #e2e8f0', 
                borderTopColor: '#b45309', 
                borderRadius: '50%', 
                animation: 'spin 1s linear infinite' 
              }} />
              <p style={{ marginTop: '12px', fontSize: '0.9rem', fontWeight: 600 }}>Loading verified customer reviews...</p>
            </div>
          ) : backendReviews.length === 0 ? (
            <div style={{
              background: '#ffffff',
              border: '1.5px dashed #cbd5e1',
              borderRadius: '16px',
              padding: '40px 24px',
              textAlign: 'center',
              maxWidth: '620px',
              margin: '0 auto'
            }}>
              <Star size={38} color="#f59e0b" style={{ margin: '0 auto 12px' }} />
              <h3 style={{ margin: '0 0 8px', color: '#1e293b', fontSize: '1.2rem', fontWeight: 700 }}>
                Share Your Showroom Experience!
              </h3>
              <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '22px', lineHeight: 1.6 }}>
                Have you visited our flagship showroom at E.H Road, Vyasarpadi? We value your thoughts, ratings, and suggestions.
              </p>
              <button
                type="button"
                className="btn-primary"
                onClick={() => onNavigate && onNavigate('contact')}
                style={{ 
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '12px 24px', 
                  borderRadius: '10px', 
                  cursor: 'pointer', 
                  fontWeight: 700,
                  fontSize: '0.92rem'
                }}
              >
                Write a Showroom Review <ArrowRight size={16} />
              </button>
            </div>
          ) : (
            <>
              <div className="testimonials-grid">
                {backendReviews.map((rev) => {
                  const ratingNum = Math.min(5, Math.max(1, Number(rev.rating) || 5));
                  const initials = (rev.name || 'Valued Customer')
                    .trim()
                    .split(/\s+/)
                    .map((w) => w[0])
                    .join('')
                    .toUpperCase()
                    .slice(0, 2) || 'VC';

                  const cleanBranch = (rev.branch || '')
                    .replace(/^Flagship Showroom\s*\(/i, '')
                    .replace(/\)$/, '')
                    .replace(/^No\.\s*192,?\s*/i, '');

                  return (
                    <div key={rev.id} className="testimonial-card">
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                        <div className="t-stars" style={{ margin: 0 }}>
                          {[...Array(ratingNum)].map((_, i) => (
                            <Star key={i} size={16} fill="#f59e0b" color="#f59e0b" />
                          ))}
                        </div>
                        <span style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          background: '#ecfdf5',
                          color: '#047857',
                          border: '1px solid #a7f3d0',
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          padding: '3px 8px',
                          borderRadius: '12px'
                        }}>
                          <ShieldCheck size={12} /> Verified Customer
                        </span>
                      </div>

                      {rev.category && (
                        <div className="t-product-bought">
                          <span>Interest / Dept:</span> <strong>{rev.category}</strong>
                        </div>
                      )}

                      <p className="t-comment">
                        "{rev.message || rev.feedback || <>Great shopping experience with <strong>Sardar Mart</strong> Furniture and Home Appliances.</>}"
                      </p>

                      <div className="t-user-info" style={{ marginTop: 'auto', paddingTop: '14px', borderTop: '1px solid #f1f5f9' }}>
                        <div style={{
                          width: '42px',
                          height: '42px',
                          borderRadius: '50%',
                          background: '#fef3c7',
                          color: '#b45309',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 800,
                          fontSize: '0.92rem',
                          border: '2px solid #ecd8cb',
                          flexShrink: 0
                        }}>
                          {initials}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <h4 className="t-name" style={{ margin: 0, fontSize: '0.95rem', color: '#0f172a', fontWeight: 700 }}>
                            {rev.name || 'Valued Customer'}
                          </h4>
                          <span className="t-loc" style={{ fontSize: '0.75rem', color: '#64748b', display: 'block', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                            {cleanBranch || 'Chennai'} • {rev.date || 'Recent'}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Bottom Callout: Write a Review on Contact Page */}
              <div style={{ textAlign: 'center', marginTop: '36px' }}>
                <button
                  type="button"
                  onClick={() => onNavigate && onNavigate('contact')}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '12px 24px',
                    borderRadius: '50px',
                    background: '#ffffff',
                    border: '1.5px solid #b45309',
                    color: '#b45309',
                    fontWeight: 700,
                    fontSize: '0.88rem',
                    cursor: 'pointer',
                    boxShadow: '0 2px 8px rgba(180, 83, 9, 0.08)',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.background = '#b45309';
                    e.currentTarget.style.color = '#ffffff';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.background = '#ffffff';
                    e.currentTarget.style.color = '#b45309';
                  }}
                >
                  <Star size={16} fill="#f59e0b" color="#f59e0b" />
                  Have you shopped with us? Share your review on our Contact Page
                  <ArrowRight size={15} />
                </button>
              </div>
            </>
          )}
        </div>
      </section>

      {/* 8. Showroom & WhatsApp Direct Callout */}
      <section className="showroom-cta-section">
        <div className="container">
          <div className="showroom-cta-box">
            <div className="cta-left">
              <span className="cta-badge">📍 Experience Before You Buy</span>
              <h2>Visit Our Flagship Chennai Showroom</h2>
              <p>
                Experience over 10,000 sq.ft of luxurious living room setups, orthopedic mattresses, and live working smart home electronics. Our interior consultants are available 7 days a week.
              </p>
              <div className="cta-actions">
                <button 
                  className="btn-primary"
                  onClick={() => onNavigate('contact')}
                >
                  <MapPin size={18} /> Get Showroom Directions
                </button>
                <a 
                  href="https://wa.me/916383056338?text=Hi%20Sardar%20Mart%20Furniture%20and%20Home%20Appliances%2C%20I%20would%20like%20to%20book%20a%20showroom%20visit" 
                  target="_blank" 
                  rel="noreferrer"
                  className="btn-whatsapp"
                >
                  <MessageCircle size={18} /> Book Free VIP Consultation
                </a>
              </div>
            </div>
            <div className="cta-right">
              <div className="showroom-hours-card">
                <h4>Showroom Hours &amp; Location</h4>
                <p className="hours-row"><strong>Open:</strong> 9:30 AM – 9:30 PM (All 7 Days)</p>
                <p className="address-row">No. 192, E.H Road, Cholan nagar, Vyasarpadi, Erukancheri, Chennai - 39.</p>
                <div className="live-status-pill">
                  <span className="online-dot"></span> Showroom Open Now
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        /* Hero Section */
        .hero-section {
          padding: 24px 0 16px;
        }
        .hero-grid {
          display: grid;
          grid-template-columns: 1.65fr 1fr;
          gap: 20px;
        }

        .hero-main-card {
          position: relative;
          height: 440px;
          border-radius: var(--radius-xl);
          overflow: hidden;
          cursor: pointer;
          box-shadow: var(--shadow-lg);
        }
        .hero-bg-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.6s ease;
        }
        .hero-main-card:hover .hero-bg-img {
          transform: scale(1.04);
        }
        .hero-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(90deg, rgba(30, 16, 10, 0.85) 0%, rgba(30, 16, 10, 0.45) 55%, rgba(0, 0, 0, 0.1) 100%);
          z-index: 1;
        }
        .hero-content {
          position: absolute;
          inset: 0;
          z-index: 2;
          padding: 50px 45px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: flex-start;
          color: #ffffff;
          max-width: 580px;
        }
        .hero-pill-badge {
          background: rgba(255, 255, 255, 0.2);
          backdrop-filter: blur(6px);
          color: #fef08a;
          padding: 6px 14px;
          border-radius: var(--radius-full);
          font-size: 0.8rem;
          font-weight: 700;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          margin-bottom: 16px;
        }
        .hero-headline {
          font-size: 2.8rem;
          font-weight: 800;
          color: #ffffff;
          line-height: 1.15;
          margin-bottom: 12px;
          letter-spacing: -0.5px;
        }
        .hero-tagline {
          font-size: 1.05rem;
          color: #fce7db;
          margin-bottom: 26px;
          line-height: 1.45;
        }
        .hero-cta-group {
          display: flex;
          align-items: center;
          gap: 16px;
          flex-wrap: wrap;
        }
        .hero-primary-btn {
          background: var(--color-primary);
          color: #ffffff;
          padding: 13px 28px;
          border-radius: var(--radius-md);
          font-weight: 700;
          font-size: 1rem;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          box-shadow: 0 4px 18px rgba(162, 78, 35, 0.4);
          transition: all var(--transition-fast);
        }
        .hero-primary-btn:hover {
          background: #b45309;
          transform: translateY(-2px);
        }
        .hero-extra-note {
          font-size: 0.85rem;
          color: #fed7aa;
          font-weight: 600;
        }

        /* Hero Carousel Slider Controls */
        .hero-slide-fade {
          animation: heroFadeSlide 0.65s cubic-bezier(0.16, 1, 0.3, 1);
        }
        @keyframes heroFadeSlide {
          from { opacity: 0; transform: scale(1.05); }
          to { opacity: 1; transform: scale(1); }
        }

        .hero-carousel-arrow {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: rgba(30, 16, 10, 0.5);
          backdrop-filter: blur(6px);
          color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          z-index: 10;
          transition: all var(--transition-fast);
          border: 1px solid rgba(255, 255, 255, 0.25);
        }
        .hero-carousel-arrow:hover {
          background: #ffffff;
          color: var(--color-warm-dark);
          transform: translateY(-50%) scale(1.08);
        }
        .hero-arrow-left {
          left: 14px;
        }
        .hero-arrow-right {
          right: 14px;
        }

        .hero-dots-container {
          position: absolute;
          bottom: 18px;
          left: 45px;
          display: flex;
          gap: 6px;
          align-items: center;
          z-index: 10;
        }
        .hero-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.4);
          border: none;
          cursor: pointer;
          transition: all 0.25s ease;
        }
        .hero-dot.active {
          width: 24px;
          border-radius: 4px;
          background: #fde047;
        }

        @media (max-width: 680px) {
          .hero-dots-container {
            left: 20px;
            bottom: 12px;
          }
          .hero-carousel-arrow {
            width: 32px;
            height: 32px;
          }
        }

        /* Right Side Hero Banner */
        .hero-side-card {
          position: relative;
          height: 440px;
          border-radius: var(--radius-xl);
          overflow: hidden;
          cursor: pointer;
          box-shadow: var(--shadow-lg);
        }
        .side-hero-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.6s ease;
        }
        .hero-side-card:hover .side-hero-img {
          transform: scale(1.05);
        }
        .side-hero-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, rgba(20, 10, 6, 0.4) 0%, rgba(20, 10, 6, 0.88) 100%);
          z-index: 1;
        }
        .side-hero-content {
          position: absolute;
          inset: 0;
          z-index: 2;
          padding: 35px 30px;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          align-items: flex-start;
          color: #ffffff;
        }
        .side-hero-badge {
          background: #d97706;
          color: #ffffff;
          padding: 4px 10px;
          border-radius: 4px;
          font-size: 0.72rem;
          font-weight: 700;
          text-transform: uppercase;
          margin-bottom: 10px;
        }
        .side-hero-title {
          font-size: 1.7rem;
          font-weight: 800;
          color: #ffffff;
          line-height: 1.2;
          margin-bottom: 8px;
        }
        .side-hero-sub {
          font-size: 0.85rem;
          color: #e2d5cb;
          margin-bottom: 18px;
        }
        .side-hero-btn {
          background: #ffffff;
          color: var(--color-warm-dark);
          padding: 10px 20px;
          border-radius: var(--radius-md);
          font-weight: 700;
          font-size: 0.9rem;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          transition: all var(--transition-fast);
        }
        .hero-side-card:hover .side-hero-btn {
          background: var(--color-primary);
          color: #ffffff;
        }

        /* 2. Value Strip */
        .features-strip-section {
          padding: 16px 0 30px;
        }
        .features-strip-card {
          background: #ffffff;
          border-radius: var(--radius-xl);
          border: 1px solid var(--color-border);
          box-shadow: var(--shadow-sm);
          padding: 18px 30px;
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
        }
        .strip-item {
          display: flex;
          align-items: center;
          gap: 14px;
        }
        .strip-icon-circle {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          background: #fdf5ef;
          border: 1.5px solid #ecd8cb;
          color: var(--color-primary);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          transition: transform var(--transition-fast);
        }
        .strip-item:hover .strip-icon-circle {
          transform: scale(1.08);
          background: var(--color-primary-light);
        }
        .strip-text {
          display: flex;
          flex-direction: column;
        }
        .strip-text strong {
          font-size: 0.95rem;
          color: var(--color-text-main);
          font-weight: 700;
        }
        .strip-text span {
          font-size: 0.78rem;
          color: var(--color-text-muted);
        }

        /* Common Section Headings */
        .section-header-row {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          margin-bottom: 28px;
        }
        .section-header-center {
          text-align: center;
          max-width: 600px;
          margin: 0 auto 36px;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .section-main-heading {
          font-size: 1.85rem;
          font-weight: 800;
          color: var(--color-text-main);
          letter-spacing: -0.5px;
        }
        .section-sub-heading {
          font-size: 0.92rem;
          color: var(--color-text-muted);
          margin-top: 4px;
        }
        .view-all-link-btn {
          color: var(--color-primary);
          font-weight: 700;
          font-size: 0.9rem;
          display: inline-flex;
          align-items: center;
          gap: 4px;
        }
        .view-all-link-btn:hover {
          color: var(--color-primary-hover);
          text-decoration: underline;
        }

        /* Category Row */
        .categories-section {
          padding: 20px 0 30px;
        }
        .categories-row-grid {
          display: grid;
          grid-template-columns: repeat(8, 1fr);
          gap: 16px;
        }

        /* Featured Products */
        .featured-products-section {
          padding: 30px 0 45px;
        }
        .featured-header-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 26px;
          flex-wrap: wrap;
          gap: 16px;
        }
        .category-tabs-group {
          display: flex;
          background: #ffffff;
          padding: 4px;
          border-radius: var(--radius-full);
          border: 1px solid var(--color-border);
          gap: 4px;
        }
        .tab-btn {
          padding: 7px 18px;
          border-radius: var(--radius-full);
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--color-text-muted);
          transition: all var(--transition-fast);
        }
        .tab-btn:hover {
          color: var(--color-primary);
        }
        .tab-btn.active {
          background: var(--color-primary);
          color: #ffffff;
          box-shadow: 0 2px 6px rgba(162, 78, 35, 0.3);
        }

        .products-grid {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 16px;
        }
        .center-view-all-box {
          text-align: center;
          margin-top: 36px;
        }

        /* Testimonials */
        .testimonials-section {
          padding: 50px 0;
          background: #fbf7f2;
          border-top: 1px solid var(--color-border);
          border-bottom: 1px solid var(--color-border);
        }
        .testimonials-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
        }
        .testimonial-card {
          background: #ffffff;
          border-radius: var(--radius-lg);
          padding: 26px;
          border: 1px solid var(--color-border);
          box-shadow: var(--shadow-sm);
          display: flex;
          flex-direction: column;
        }
        .t-stars {
          display: flex;
          gap: 4px;
          margin-bottom: 12px;
        }
        .t-title {
          font-size: 1.05rem;
          font-weight: 700;
          color: var(--color-text-main);
          margin-bottom: 8px;
        }
        .t-comment {
          font-size: 0.88rem;
          color: var(--color-text-muted);
          line-height: 1.55;
          margin-bottom: 16px;
          font-style: italic;
          flex: 1;
        }
        .t-product-bought {
          font-size: 0.78rem;
          color: #785949;
          background: #faf4ee;
          padding: 4px 10px;
          border-radius: 6px;
          margin-bottom: 16px;
        }
        .t-user-info {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .t-avatar {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          object-fit: cover;
          border: 2px solid #ecd8cb;
        }
        .t-name {
          font-size: 0.95rem;
          font-weight: 700;
          color: var(--color-text-main);
        }
        .t-loc {
          font-size: 0.76rem;
          color: var(--color-text-light);
        }

        /* Showroom CTA */
        .showroom-cta-section {
          padding: 40px 0 50px;
        }
        .showroom-cta-box {
          background: linear-gradient(135deg, #2a1810 0%, #1a0e08 100%);
          border-radius: var(--radius-xl);
          padding: 45px;
          display: grid;
          grid-template-columns: 1.4fr 1fr;
          gap: 36px;
          align-items: center;
          color: #ffffff;
          box-shadow: var(--shadow-xl);
        }
        .cta-badge {
          background: rgba(245, 158, 11, 0.2);
          color: #fcd34d;
          font-size: 0.78rem;
          font-weight: 700;
          padding: 4px 12px;
          border-radius: var(--radius-full);
          display: inline-block;
          margin-bottom: 14px;
        }
        .cta-left h2 {
          font-size: 2rem;
          color: #ffffff;
          margin-bottom: 12px;
        }
        .cta-left p {
          color: #d1b8a7;
          font-size: 0.95rem;
          line-height: 1.6;
          margin-bottom: 24px;
        }
        .cta-actions {
          display: flex;
          gap: 14px;
          flex-wrap: wrap;
        }
        .showroom-hours-card {
          background: rgba(255, 255, 255, 0.07);
          border: 1px solid rgba(255, 255, 255, 0.12);
          backdrop-filter: blur(8px);
          padding: 24px;
          border-radius: var(--radius-lg);
        }
        .showroom-hours-card h4 {
          color: #fde047;
          font-size: 1.1rem;
          margin-bottom: 12px;
        }
        .hours-row {
          color: #ffffff;
          font-size: 0.9rem;
          margin-bottom: 8px;
        }
        .address-row {
          color: #e2d5cb;
          font-size: 0.85rem;
          line-height: 1.4;
          margin-bottom: 16px;
        }
        .live-status-pill {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: rgba(34, 197, 94, 0.2);
          color: #4ade80;
          font-size: 0.78rem;
          font-weight: 700;
          padding: 4px 10px;
          border-radius: var(--radius-full);
        }
        .online-dot {
          width: 8px;
          height: 8px;
          background: #22c55e;
          border-radius: 50%;
          box-shadow: 0 0 8px #22c55e;
        }

        /* Responsive */
        @media (max-width: 1200px) {
          .products-grid {
            grid-template-columns: repeat(4, 1fr);
            gap: 14px;
          }
        }
        @media (max-width: 960px) {
          .categories-row-grid {
            grid-template-columns: repeat(4, 1fr);
            gap: 16px;
          }
          .products-grid {
            grid-template-columns: repeat(3, 1fr);
            gap: 12px;
          }
        }
        @media (max-width: 900px) {
          .hero-grid {
            grid-template-columns: 1fr;
          }
          .hero-main-card {
            height: 340px;
          }
          .hero-side-card {
            height: 260px;
          }
          .hero-headline {
            font-size: 2.1rem;
          }
          .features-strip-card {
            grid-template-columns: repeat(2, 1fr);
            gap: 16px;
          }
          .testimonials-grid {
            grid-template-columns: 1fr;
          }
          .showroom-cta-box {
            grid-template-columns: 1fr;
            padding: 26px;
          }
          .desk-only {
            display: none;
          }
        }
        @media (max-width: 680px) {
          .hero-main-card {
            height: 320px;
            border-radius: var(--radius-lg);
          }
          .hero-content {
            padding: 24px 18px;
          }
          .hero-headline {
            font-size: 1.75rem;
            margin-bottom: 8px;
          }
          .hero-tagline {
            font-size: 0.85rem;
            margin-bottom: 16px;
          }
          .hero-primary-btn {
            padding: 10px 20px;
            font-size: 0.9rem;
          }
          .hero-extra-note {
            font-size: 0.75rem;
          }
          .hero-side-card {
            height: 220px;
            border-radius: var(--radius-lg);
          }
          .side-hero-content {
            padding: 20px 18px;
          }
          .side-hero-title {
            font-size: 1.35rem;
          }
          .side-hero-sub {
            font-size: 0.78rem;
            margin-bottom: 12px;
          }

          /* App-style horizontal swipeable category rail */
          .categories-section {
            padding: 14px 0 20px;
          }
          .categories-row-grid {
            display: flex;
            overflow-x: auto;
            gap: 14px;
            padding-bottom: 12px;
            scroll-snap-type: x mandatory;
            -webkit-overflow-scrolling: touch;
            scrollbar-width: none;
          }
          .categories-row-grid::-webkit-scrollbar {
            display: none;
          }
          .categories-row-grid > * {
            flex: 0 0 85px;
            scroll-snap-align: start;
          }

          .section-main-heading {
            font-size: 1.45rem;
          }
          .section-sub-heading {
            font-size: 0.82rem;
          }

          /* 2-column e-commerce grid on mobile */
          .products-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 10px !important;
          }

          /* 2x2 Value Proposition Strip */
          .features-strip-card {
            grid-template-columns: repeat(2, 1fr) !important;
            padding: 14px !important;
            gap: 12px !important;
            border-radius: var(--radius-lg);
          }
          .strip-item {
            gap: 10px;
          }
          .strip-icon-circle {
            width: 40px;
            height: 40px;
          }
          .strip-text strong {
            font-size: 0.84rem;
          }
          .strip-text span {
            font-size: 0.7rem;
          }

          .desktop-category-tabs {
            display: none !important;
          }
          .featured-mobile-dropdown-wrap {
            display: block !important;
            width: 100% !important;
            margin-top: 6px;
          }
          .center-view-all-box .btn-primary {
            width: 100%;
          }
        }

        @media (max-width: 380px) {
          .hero-main-card {
            height: 280px;
          }
          .hero-content {
            padding: 16px 14px;
          }
          .hero-headline {
            font-size: 1.35rem;
          }
          .hero-tagline {
            font-size: 0.78rem;
            margin-bottom: 12px;
          }
          .hero-primary-btn {
            padding: 8px 16px;
            font-size: 0.82rem;
          }
          .features-strip-card {
            grid-template-columns: 1fr !important;
            gap: 10px !important;
            padding: 12px !important;
          }
          .strip-icon-circle {
            width: 34px;
            height: 34px;
          }
          .showroom-cta-box {
            padding: 18px 14px;
          }
          .cta-left h2 {
            font-size: 1.45rem;
          }
          .cta-actions .btn-primary, .cta-actions .btn-whatsapp {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}
