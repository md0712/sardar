import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, Heart, ShoppingBag, Phone, MapPin, 
  Menu, X, ChevronDown, Sparkles, MessageCircle, 
  ShieldCheck, Truck, ArrowRight, Package,
  Flame, Check, Headphones, Compass, Tag
} from 'lucide-react';

export default function Navbar({ 
  currentPage, 
  setCurrentPage, 
  cartCount = 0, 
  wishlistCount = 0,
  onOpenCart,
  onOpenWishlist,
  onOpenAuth,
  onSearch,
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  onOpenAdmin,
  onOpenTrackOrder,
  onNavigateSubcategory
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSearchVisible, setMobileSearchVisible] = useState(false);
  const [announcementIndex, setAnnouncementIndex] = useState(0);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [isPaused, setIsPaused] = useState(false);
  const [mobileExpandedCat, setMobileExpandedCat] = useState({
    furniture: false,
    electronics: false
  });

  // Prevent background scroll when mobile drawer is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

  const handleNavClick = (page) => {
    setCurrentPage(page);
    setActiveDropdown(null);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubcatClick = (category, subcat) => {
    if (onNavigateSubcategory) {
      onNavigateSubcategory(category, subcat);
    } else {
      handleNavClick(category);
    }
    setActiveDropdown(null);
    setMobileMenuOpen(false);
  };

  const announcements = [
    {
      id: 1,
      badge: "Festive Offers",
      text: "Grand Festival Season: Up to 50% OFF on Luxury Sofas, Beds & 4K OLED TVs",
      action: () => handleNavClick('offers')
    },
    {
      id: 2,
      badge: "Showroom Perks",
      text: "Free Express Delivery & 0% Easy EMI on Bajaj Finserv, HDFC & TVS Credit",
      action: () => handleNavClick('offers')
    },
    {
      id: 3,
      badge: "Visit Store",
      text: "Flagship Showroom: No. 192, E.H Road, Vyasarpadi, Chennai - 39 (Open All 7 Days)",
      action: () => handleNavClick('contact')
    }
  ];

  // Auto-slide announcement ticker
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setAnnouncementIndex((prev) => (prev + 1) % announcements.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [announcements.length, isPaused]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      if (currentPage !== 'furniture' && currentPage !== 'electronics' && currentPage !== 'appliances') {
        setCurrentPage('furniture');
      }
      if (onSearch) onSearch(searchQuery);
      setMobileMenuOpen(false);
      setMobileSearchVisible(false);
    }
  };

  const currentAnn = announcements[announcementIndex];

  return (
    <header className="sardar-nav-root">
      
      {/* 1. TOP ANNOUNCEMENT MICRO-BAR */}
      <div className="sardar-top-strip">
        <div className="container sardar-top-content">
          
          {/* Rotating Banner Ticker */}
          <div 
            className="sardar-ticker"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            onClick={currentAnn.action}
          >
            <span className="sardar-ticker-tag">{currentAnn.badge}</span>
            <span className="sardar-ticker-text">{currentAnn.text}</span>
          </div>

          {/* Quick Support & Location Actions */}
          <div className="sardar-top-links">
            <button onClick={() => handleNavClick('contact')} className="sardar-top-btn">
              <MapPin size={12} /> Showroom: Vyasarpadi, Chennai
            </button>
            <span className="sardar-dot-sep">•</span>
            <button onClick={onOpenTrackOrder} className="sardar-top-btn">
              <Package size={12} /> Track Order
            </button>
            <span className="sardar-dot-sep">•</span>
            <a 
              href="https://wa.me/916383056338" 
              target="_blank" 
              rel="noreferrer" 
              className="sardar-top-btn sardar-top-wa"
            >
              <MessageCircle size={12} /> WhatsApp: +91 6383056338
            </a>
          </div>

        </div>
      </div>

      {/* 2. MAIN HEADER (BRAND + SEARCH + ACTIONS) */}
      <div className="sardar-main-bar">
        <div className="container sardar-main-content">
          
          {/* Logo & Brand Identity */}
          <div className="sardar-logo-area" onClick={() => handleNavClick('home')}>
            <img 
              src="/logo.png" 
              alt="Sardar Mart Furniture and Home Appliances Logo" 
              className="sardar-logo-img" 
            />
            <div className="sardar-brand-titles">
              <div className="sardar-brand-primary">
                Sardar <span className="sardar-gold">Mart</span>
              </div>
              <div className="sardar-brand-secondary">
                FURNITURE AND HOME APPLIANCES <span className="sardar-sub-dot">•</span> CHENNAI
              </div>
            </div>
          </div>

          {/* Centered Intelligent Search Capsule */}
          <form className="sardar-search-bar" onSubmit={handleSearchSubmit}>
            <div className="sardar-cat-filter">
              <select 
                id="search-category-filter"
                aria-label="Filter by category"
                value={selectedCategory} 
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="sardar-cat-select"
              >
                <option value="all">All Catalog</option>
                <option value="furniture">Furniture</option>
                <option value="electronics">Electronics</option>
                <option value="appliances">Appliances</option>
              </select>
              <ChevronDown size={13} className="sardar-cat-arrow" />
            </div>

            <div className="sardar-search-field">
              <Search size={16} className="sardar-search-icon-left" />
              <input
                id="search-input-box"
                type="text"
                autoComplete="off"
                aria-label="Search catalog"
                placeholder="Search sofas, teak beds, 4K OLED TVs, refrigerators..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="sardar-search-input"
              />
              {searchQuery && (
                <button 
                  type="button" 
                  className="sardar-search-clear"
                  onClick={() => setSearchQuery('')}
                  title="Clear search"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            <button type="submit" className="sardar-search-submit" aria-label="Search products">
              <Search size={15} />
              <span>Search</span>
            </button>
          </form>

          {/* Right Header Actions */}
          <div className="sardar-actions-bar">
            
            {/* Showroom Direct WhatsApp Callout */}
            <a 
              href="https://wa.me/916383056338?text=Hello%20Sardar%20Mart%20Furniture%20and%20Home%20Appliances!%20I%20would%20like%20to%20enquire%20about%20your%20products."
              target="_blank" 
              rel="noreferrer"
              className="sardar-helpline-card"
              title="Click to chat with Showroom Consultant on WhatsApp"
            >
              <div className="sardar-helpline-icon-wrap">
                <MessageCircle size={16} />
                <span className="sardar-live-dot" />
              </div>
              <div className="sardar-helpline-details">
                <span className="sardar-helpline-title">Showroom Help</span>
                <span className="sardar-helpline-phone">+91 6383056338</span>
              </div>
            </a>

            {/* Mobile Search Trigger */}
            <button 
              className="sardar-mob-search-btn"
              onClick={() => setMobileSearchVisible(!mobileSearchVisible)}
              aria-label="Toggle mobile search"
            >
              <Search size={21} />
            </button>

            {/* Wishlist Button */}
            <button 
              className="sardar-action-item"
              onClick={onOpenWishlist}
              title="View Wishlist"
            >
              <div className="sardar-action-icon-box">
                <Heart size={20} />
                {wishlistCount > 0 && (
                  <span className="sardar-count-pill">{wishlistCount}</span>
                )}
              </div>
              <div className="sardar-action-textbox">
                <span className="sardar-action-micro">Saved</span>
                <span className="sardar-action-bold">Wishlist</span>
              </div>
            </button>

            {/* Shopping Cart Button */}
            <button 
              className="sardar-action-item sardar-cart-action"
              onClick={onOpenCart}
              title="View Shopping Cart"
            >
              <div className="sardar-action-icon-box">
                <ShoppingBag size={20} />
                {cartCount > 0 && (
                  <span className="sardar-count-pill cart-pill">{cartCount}</span>
                )}
              </div>
              <div className="sardar-action-textbox">
                <span className="sardar-action-micro">Bag</span>
                <span className="sardar-action-bold">Cart ({cartCount})</span>
              </div>
            </button>

            {/* Mobile Hamburger Drawer Button */}
            <button 
              className="sardar-mob-menu-btn"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open Navigation Menu"
            >
              <Menu size={24} />
            </button>

          </div>
        </div>

        {/* Mobile Search Expandable Bar */}
        {mobileSearchVisible && (
          <div className="container sardar-mob-search-container animate-fade-in">
            <form onSubmit={handleSearchSubmit} className="sardar-mob-search-form">
              <Search size={16} className="sardar-mob-search-icon" />
              <input 
                type="text"
                autoComplete="off"
                placeholder="Search sofas, beds, smart TVs, fridges..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
              />
              <button type="submit">Search</button>
            </form>
          </div>
        )}
      </div>

      {/* 3. PRIMARY CATEGORY NAVIGATION BAR */}
      <nav className="sardar-nav-bar">
        <div className="container sardar-nav-content">
          <ul className="sardar-nav-items">
            
            {/* Home */}
            <li className={`sardar-nav-tab ${currentPage === 'home' ? 'active' : ''}`}>
              <button onClick={() => handleNavClick('home')}>
                <span>Home</span>
              </button>
            </li>

            {/* Furniture Mega Menu */}
            <li 
              className={`sardar-nav-tab has-menu ${currentPage === 'furniture' ? 'active' : ''}`}
              onMouseEnter={() => setActiveDropdown('furniture')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button onClick={() => handleNavClick('furniture')} className="tab-btn-dropdown">
                <span>Furniture</span>
                <ChevronDown size={13} className={`tab-chevron ${activeDropdown === 'furniture' ? 'rotated' : ''}`} />
              </button>

              {activeDropdown === 'furniture' && (
                <div className="sardar-mega-dropdown animate-fade-in">
                  <div className="sardar-mega-grid">
                    <div className="sardar-mega-categories">
                      <span className="sardar-mega-header">SOLID TEAK &amp; LUXURY LIVING</span>
                      <div className="sardar-mega-list">
                        <button onClick={() => handleSubcatClick('furniture', 'sofas')} className="sardar-mega-link">
                          <span className="sardar-mega-emoji">🛋️</span>
                          <div>
                            <strong>Sofas &amp; Recliners</strong>
                            <small>L-Shape, Recliners, 3-Seater Leatherette</small>
                          </div>
                        </button>
                        <button onClick={() => handleSubcatClick('furniture', 'beds')} className="sardar-mega-link">
                          <span className="sardar-mega-emoji">🛏️</span>
                          <div>
                            <strong>Beds &amp; Mattresses</strong>
                            <small>King, Queen Hydraulic Storage &amp; Ortho</small>
                          </div>
                        </button>
                        <button onClick={() => handleSubcatClick('furniture', 'dining')} className="sardar-mega-link">
                          <span className="sardar-mega-emoji">🪑</span>
                          <div>
                            <strong>Dining Sets &amp; Tables</strong>
                            <small>Solid Sheesham &amp; Teak 6-Seater Suites</small>
                          </div>
                        </button>
                        <button onClick={() => handleSubcatClick('furniture', 'wardrobes')} className="sardar-mega-link">
                          <span className="sardar-mega-emoji">🚪</span>
                          <div>
                            <strong>Wardrobes &amp; Closets</strong>
                            <small>3-Door, Sliding Mirrors &amp; Modern Almirahs</small>
                          </div>
                        </button>
                        <button onClick={() => handleSubcatClick('furniture', 'chairs')} className="sardar-mega-link">
                          <span className="sardar-mega-emoji">💼</span>
                          <div>
                            <strong>Study &amp; Office Chairs</strong>
                            <small>Ergonomic Mesh &amp; Executive Desks</small>
                          </div>
                        </button>
                      </div>
                      <div className="sardar-mega-footer">
                        <button onClick={() => { setActiveDropdown(null); handleNavClick('furniture'); }}>
                          View All Furniture Models <ArrowRight size={13} />
                        </button>
                      </div>
                    </div>

                    <div className="sardar-mega-banner furn" onClick={() => { setActiveDropdown(null); handleNavClick('offers'); }}>
                      <span className="sardar-banner-chip">HOT DEAL</span>
                      <h4>Custom Teak Wood Sets</h4>
                      <p>Custom fabric colors, high-density foam &amp; 10-year termite warranty.</p>
                      <span className="sardar-banner-cta">Explore Combo Offers →</span>
                    </div>
                  </div>
                </div>
              )}
            </li>

            {/* Electronics Mega Menu */}
            <li 
              className={`sardar-nav-tab has-menu ${currentPage === 'electronics' ? 'active' : ''}`}
              onMouseEnter={() => setActiveDropdown('electronics')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button onClick={() => handleNavClick('electronics')} className="tab-btn-dropdown">
                <span>Electronics</span>
                <ChevronDown size={13} className={`tab-chevron ${activeDropdown === 'electronics' ? 'rotated' : ''}`} />
              </button>

              {activeDropdown === 'electronics' && (
                <div className="sardar-mega-dropdown animate-fade-in">
                  <div className="sardar-mega-grid">
                    <div className="sardar-mega-categories">
                      <span className="sardar-mega-header">ENTERTAINMENT &amp; APPLIANCES</span>
                      <div className="sardar-mega-list">
                        <button onClick={() => handleSubcatClick('electronics', 'tvs')} className="sardar-mega-link">
                          <span className="sardar-mega-emoji">📺</span>
                          <div>
                            <strong>Smart 4K &amp; OLED TVs</strong>
                            <small>Sony Bravia, Samsung, LG 43" to 75" Google TVs</small>
                          </div>
                        </button>
                        <button onClick={() => handleSubcatClick('electronics', 'refrigerators')} className="sardar-mega-link">
                          <span className="sardar-mega-emoji">🧊</span>
                          <div>
                            <strong>Inverter Refrigerators</strong>
                            <small>Double Door, Side-by-Side Frost Free</small>
                          </div>
                        </button>
                        <button onClick={() => handleSubcatClick('electronics', 'washing-machines')} className="sardar-mega-link">
                          <span className="sardar-mega-emoji">🧺</span>
                          <div>
                            <strong>Washing Machines</strong>
                            <small>Front Load &amp; Top Load Smart Inverters</small>
                          </div>
                        </button>
                        <button onClick={() => handleSubcatClick('electronics', 'air-conditioners')} className="sardar-mega-link">
                          <span className="sardar-mega-emoji">❄️</span>
                          <div>
                            <strong>Inverter Air Conditioners</strong>
                            <small>1.5 Ton 5-Star Split ACs with Copper Condensers</small>
                          </div>
                        </button>
                        <button onClick={() => handleSubcatClick('electronics', 'audio')} className="sardar-mega-link">
                          <span className="sardar-mega-emoji">🔊</span>
                          <div>
                            <strong>Soundbars &amp; Audio</strong>
                            <small>Dolby Atmos Wireless Subwoofer Systems</small>
                          </div>
                        </button>
                      </div>
                      <div className="sardar-mega-footer">
                        <button onClick={() => { setActiveDropdown(null); handleNavClick('electronics'); }}>
                          View All Electronics <ArrowRight size={13} />
                        </button>
                      </div>
                    </div>

                    <div className="sardar-mega-banner elec" onClick={() => { setActiveDropdown(null); handleNavClick('offers'); }}>
                      <span className="sardar-banner-chip">0% EASY EMI</span>
                      <h4>Authorized Brand Dealership</h4>
                      <p>Instant approval via Bajaj Finserv, HDFC &amp; TVS Credit at 0% interest.</p>
                      <span className="sardar-banner-cta">Check EMI Options →</span>
                    </div>
                  </div>
                </div>
              )}
            </li>

            {/* Home Appliances */}
            <li className={`sardar-nav-tab ${currentPage === 'appliances' ? 'active' : ''}`}>
              <button onClick={() => handleNavClick('appliances')}>
                <span>Home Appliances</span>
              </button>
            </li>

            {/* Festival Offers Tab with Flame Badge */}
            <li className={`sardar-nav-tab offers-tab ${currentPage === 'offers' ? 'active' : ''}`}>
              <button onClick={() => handleNavClick('offers')}>
                <Flame size={14} className="sardar-flame-icon" />
                <span>Festival Offers</span>
                <span className="sardar-discount-tag">50% OFF</span>
              </button>
            </li>

            {/* About Showroom */}
            <li className={`sardar-nav-tab ${currentPage === 'about' ? 'active' : ''}`}>
              <button onClick={() => handleNavClick('about')}>
                <span>About Showroom</span>
              </button>
            </li>

            {/* Contact & Directions */}
            <li className={`sardar-nav-tab ${currentPage === 'contact' ? 'active' : ''}`}>
              <button onClick={() => handleNavClick('contact')}>
                <span>Contact &amp; Visit</span>
              </button>
            </li>

          </ul>

          {/* Right Showroom Timing Tag */}
          <div className="sardar-nav-timing">
            <span className="sardar-timing-dot" />
            <span>Open 9:30 AM – 9:30 PM (All 7 Days)</span>
          </div>

        </div>
      </nav>

      {/* 4. LUXURY MOBILE SLIDE DRAWER */}
      {mobileMenuOpen && (
        <div className="sardar-drawer-overlay animate-fade-in" onClick={() => setMobileMenuOpen(false)}>
          <div className="sardar-drawer-container" onClick={(e) => e.stopPropagation()}>
            
            {/* Drawer Top */}
            <div className="sardar-drawer-head">
              <div className="sardar-drawer-brand-wrap" onClick={() => handleNavClick('home')}>
                <img src="/logo.png" alt="Sardar Logo" className="sardar-drawer-logo" />
                <div>
                  <h3 className="sardar-drawer-brand-name">Sardar <span>Mart</span></h3>
                  <small>FURNITURE AND HOME APPLIANCES • CHENNAI</small>
                </div>
              </div>
              <button 
                className="sardar-drawer-close-btn"
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Close Menu"
              >
                <X size={22} />
              </button>
            </div>

            {/* Drawer Quick Search */}
            <form onSubmit={handleSearchSubmit} className="sardar-drawer-search">
              <Search size={16} color="#94a3b8" />
              <input 
                type="text" 
                placeholder="Search sofas, beds, TVs, fridges..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button type="submit">Search</button>
            </form>

            {/* Drawer Navigation Links */}
            <div className="sardar-drawer-body">
              <span className="sardar-drawer-label">BROWSE STORE</span>

              <button 
                className={`sardar-drawer-nav-item ${currentPage === 'home' ? 'active' : ''}`}
                onClick={() => handleNavClick('home')}
              >
                <span>🏠 Home Page</span>
                <ArrowRight size={15} />
              </button>

              {/* Furniture Accordion */}
              <div className="sardar-drawer-accordion-block">
                <div className="sardar-accordion-header-row">
                  <button 
                    className={`sardar-drawer-nav-item ${currentPage === 'furniture' ? 'active' : ''}`}
                    onClick={() => handleNavClick('furniture')}
                  >
                    <span>🛋️ Furniture Catalog</span>
                  </button>
                  <button 
                    className="sardar-accordion-trigger"
                    onClick={() => setMobileExpandedCat(prev => ({ ...prev, furniture: !prev.furniture }))}
                  >
                    <ChevronDown size={18} className={`sardar-acc-icon ${mobileExpandedCat.furniture ? 'open' : ''}`} />
                  </button>
                </div>
                {mobileExpandedCat.furniture && (
                  <div className="sardar-drawer-sublinks animate-fade-in">
                    <button onClick={() => handleSubcatClick('furniture', 'sofas')}>🛋️ Sofas &amp; Recliners</button>
                    <button onClick={() => handleSubcatClick('furniture', 'beds')}>🛏️ Beds &amp; Mattresses</button>
                    <button onClick={() => handleSubcatClick('furniture', 'dining')}>🪑 Dining Sets &amp; Tables</button>
                    <button onClick={() => handleSubcatClick('furniture', 'wardrobes')}>🚪 Wardrobes &amp; Closets</button>
                    <button onClick={() => handleSubcatClick('furniture', 'chairs')}>💼 Study &amp; Office Chairs</button>
                    <button onClick={() => handleSubcatClick('furniture', 'all')} className="see-all">Explore All Furniture →</button>
                  </div>
                )}
              </div>

              {/* Electronics Accordion */}
              <div className="sardar-drawer-accordion-block">
                <div className="sardar-accordion-header-row">
                  <button 
                    className={`sardar-drawer-nav-item ${currentPage === 'electronics' ? 'active' : ''}`}
                    onClick={() => handleNavClick('electronics')}
                  >
                    <span>📺 Electronics &amp; TVs</span>
                  </button>
                  <button 
                    className="sardar-accordion-trigger"
                    onClick={() => setMobileExpandedCat(prev => ({ ...prev, electronics: !prev.electronics }))}
                  >
                    <ChevronDown size={18} className={`sardar-acc-icon ${mobileExpandedCat.electronics ? 'open' : ''}`} />
                  </button>
                </div>
                {mobileExpandedCat.electronics && (
                  <div className="sardar-drawer-sublinks animate-fade-in">
                    <button onClick={() => handleSubcatClick('electronics', 'tvs')}>📺 Smart 4K &amp; OLED TVs</button>
                    <button onClick={() => handleSubcatClick('electronics', 'refrigerators')}>🧊 Inverter Refrigerators</button>
                    <button onClick={() => handleSubcatClick('electronics', 'washing-machines')}>🧺 Washing Machines</button>
                    <button onClick={() => handleSubcatClick('electronics', 'air-conditioners')}>❄️ Inverter Air Conditioners</button>
                    <button onClick={() => handleSubcatClick('electronics', 'audio')}>🔊 Soundbars &amp; Home Audio</button>
                    <button onClick={() => handleSubcatClick('electronics', 'all')} className="see-all">Explore All Electronics →</button>
                  </div>
                )}
              </div>

              <button 
                className={`sardar-drawer-nav-item ${currentPage === 'appliances' ? 'active' : ''}`}
                onClick={() => handleNavClick('appliances')}
              >
                <span>🍳 Home Appliances</span>
                <ArrowRight size={15} />
              </button>

              <button 
                className={`sardar-drawer-nav-item offers-link ${currentPage === 'offers' ? 'active' : ''}`}
                onClick={() => handleNavClick('offers')}
              >
                <span>🔥 Festival Offers (Up to 50% OFF)</span>
                <ArrowRight size={15} />
              </button>

              <span className="sardar-drawer-label" style={{ marginTop: '16px' }}>SERVICES &amp; SHOWROOM</span>

              <button 
                className={`sardar-drawer-nav-item ${currentPage === 'about' ? 'active' : ''}`}
                onClick={() => handleNavClick('about')}
              >
                <span>🏢 About Sardar Heritage</span>
                <ArrowRight size={15} />
              </button>

              <button 
                className={`sardar-drawer-nav-item ${currentPage === 'contact' ? 'active' : ''}`}
                onClick={() => handleNavClick('contact')}
              >
                <span>📍 Showroom Address &amp; Map</span>
                <ArrowRight size={15} />
              </button>

              <button 
                className="sardar-drawer-nav-item"
                onClick={() => { setMobileMenuOpen(false); onOpenTrackOrder(); }}
              >
                <span>📦 Track Your Live Order</span>
                <ArrowRight size={15} />
              </button>

              {/* Showroom WhatsApp Card */}
              <div className="sardar-drawer-card">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#166534', fontWeight: 800, fontSize: '0.85rem' }}>
                  <MessageCircle size={16} /> Live Showroom Consultant
                </div>
                <p style={{ margin: '6px 0 10px', fontSize: '0.78rem', color: '#15803d', lineHeight: 1.4 }}>
                  Enquire about solid wood, sofa fabric customizations, and 0% EMI schemes directly.
                </p>
                <a 
                  href="https://wa.me/916383056338"
                  target="_blank"
                  rel="noreferrer"
                  className="sardar-drawer-wa-btn"
                >
                  <MessageCircle size={15} /> Chat: +91 6383056338
                </a>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* 5. LUXURY RESPONSIVE NAVBAR STYLES */}
      <style>{`
        .sardar-nav-root {
          position: sticky;
          top: 0;
          z-index: 1000;
          background: #ffffff;
          box-shadow: 0 4px 20px -2px rgba(42, 24, 16, 0.08);
          font-family: inherit;
        }

        /* 1. TOP ANNOUNCEMENT STRIP */
        .sardar-top-strip {
          background: #180f0a;
          color: #f1dfd3;
          padding: 7px 0;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          font-size: 0.78rem;
        }
        .sardar-top-content {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
        }
        .sardar-ticker {
          flex: 1;
          display: flex;
          align-items: center;
          gap: 10px;
          cursor: pointer;
          min-height: 22px;
          overflow: hidden;
        }
        .sardar-ticker-tag {
          background: #b45309;
          color: #ffffff;
          font-size: 0.65rem;
          font-weight: 800;
          padding: 2px 8px;
          border-radius: 9999px;
          letter-spacing: 0.3px;
          text-transform: uppercase;
          flex-shrink: 0;
        }
        .sardar-ticker-text {
          font-weight: 500;
          color: #ffffff;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .sardar-top-links {
          display: flex;
          align-items: center;
          gap: 12px;
          flex-shrink: 0;
        }
        .sardar-top-btn {
          background: none;
          border: none;
          color: #f1dfd3;
          font-size: 0.78rem;
          font-weight: 500;
          display: inline-flex;
          align-items: center;
          gap: 5px;
          cursor: pointer;
          text-decoration: none;
          padding: 0;
          transition: color 0.15s ease;
        }
        .sardar-top-btn:hover {
          color: #f59e0b;
        }
        .sardar-top-wa {
          color: #6ee7b7;
          font-weight: 600;
        }
        .sardar-top-wa:hover {
          color: #a7f3d0;
        }
        .sardar-dot-sep {
          color: #5c4538;
          font-size: 0.75rem;
        }

        /* 2. MAIN HEADER BAR */
        .sardar-main-bar {
          background: #ffffff;
          padding: 12px 0;
          border-bottom: 1px solid #f1e7df;
          position: relative;
        }
        .sardar-main-content {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
        }

        /* Brand & Logo */
        .sardar-logo-area {
          display: flex;
          align-items: center;
          gap: 12px;
          cursor: pointer;
          user-select: none;
          flex-shrink: 0;
        }
        .sardar-logo-img {
          height: 48px;
          width: auto;
          max-width: 130px;
          object-fit: contain;
          border-radius: 8px;
          filter: drop-shadow(0 2px 4px rgba(42, 24, 16, 0.1));
          transition: transform 0.2s ease;
        }
        .sardar-logo-area:hover .sardar-logo-img {
          transform: scale(1.02);
        }
        .sardar-brand-titles {
          display: flex;
          flex-direction: column;
        }
        .sardar-brand-primary {
          font-family: var(--font-heading);
          font-size: 1.55rem;
          font-weight: 800;
          color: #1c0e08;
          line-height: 1.1;
          letter-spacing: -0.6px;
        }
        .sardar-gold {
          color: #b45309;
          font-weight: 800;
        }
        .sardar-brand-secondary {
          font-size: 0.58rem;
          font-weight: 500;
          letter-spacing: 1.2px;
          color: #8c766b;
          margin-top: 2px;
          white-space: nowrap;
        }
        .sardar-sub-dot {
          color: #b45309;
        }

        /* Centered Intelligent Search Capsule */
        .sardar-search-bar {
          flex: 1;
          max-width: 620px;
          min-width: 280px;
          display: flex;
          align-items: center;
          background: #faf7f4;
          border: 1.5px solid #e5d8cc;
          border-radius: 9999px;
          padding: 3px 3px 3px 14px;
          transition: all 0.2s ease;
        }
        .sardar-search-bar:focus-within {
          background: #ffffff;
          border-color: #b45309;
          box-shadow: 0 0 0 3.5px rgba(180, 83, 9, 0.12);
        }
        .sardar-cat-filter {
          position: relative;
          display: flex;
          align-items: center;
          padding-right: 12px;
          border-right: 1.5px solid #e7d8cc;
          flex-shrink: 0;
        }
        .sardar-cat-select {
          appearance: none;
          background: transparent;
          border: none;
          outline: none;
          font-size: 0.82rem;
          font-weight: 700;
          color: #44322a;
          cursor: pointer;
          padding-right: 16px;
        }
        .sardar-cat-arrow {
          position: absolute;
          right: 0;
          pointer-events: none;
          color: #8c766b;
        }
        .sardar-search-field {
          flex: 1;
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 0 10px;
          position: relative;
        }
        .sardar-search-icon-left {
          color: #a89487;
          flex-shrink: 0;
        }
        .sardar-search-input {
          width: 100%;
          border: none;
          background: transparent;
          outline: none;
          font-size: 0.88rem;
          color: #1e0d07;
          font-weight: 500;
        }
        .sardar-search-input::placeholder {
          color: #94a3b8;
          font-size: 0.83rem;
        }
        .sardar-search-clear {
          background: none;
          border: none;
          color: #94a3b8;
          cursor: pointer;
          padding: 2px;
          display: flex;
        }
        .sardar-search-clear:hover {
          color: #334155;
        }
        .sardar-search-submit {
          background: linear-gradient(135deg, #b45309 0%, #853704 100%);
          color: #ffffff;
          border: none;
          border-radius: 9999px;
          height: 38px;
          padding: 0 18px;
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.84rem;
          font-weight: 700;
          cursor: pointer;
          flex-shrink: 0;
          box-shadow: 0 2px 6px rgba(180, 83, 9, 0.25);
          transition: transform 0.15s ease, box-shadow 0.15s ease;
        }
        .sardar-search-submit:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 10px rgba(180, 83, 9, 0.35);
        }

        /* Right Actions Bar */
        .sardar-actions-bar {
          display: flex;
          align-items: center;
          gap: 12px;
          flex-shrink: 0;
        }

        /* Showroom WhatsApp Card */
        .sardar-helpline-card {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 6px 14px 6px 8px;
          background: #f0fdf4;
          border: 1.5px solid #bbf7d0;
          border-radius: 9999px;
          text-decoration: none;
          transition: all 0.2s ease;
        }
        .sardar-helpline-card:hover {
          background: #dcfce7;
          border-color: #86efac;
          transform: translateY(-1px);
          box-shadow: 0 3px 10px rgba(22, 163, 74, 0.12);
        }
        .sardar-helpline-icon-wrap {
          position: relative;
          width: 30px;
          height: 30px;
          background: #16a34a;
          color: #ffffff;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .sardar-live-dot {
          position: absolute;
          width: 8px;
          height: 8px;
          background: #22c55e;
          border-radius: 50%;
          top: -1px;
          right: -1px;
          box-shadow: 0 0 0 2px #ffffff;
          animation: pulseGreen 2s infinite;
        }
        @keyframes pulseGreen {
          0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.7); }
          70% { transform: scale(1); box-shadow: 0 0 0 6px rgba(34, 197, 94, 0); }
          100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(34, 197, 94, 0); }
        }
        .sardar-helpline-details {
          display: flex;
          flex-direction: column;
        }
        .sardar-helpline-title {
          font-size: 0.65rem;
          font-weight: 800;
          color: #15803d;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          line-height: 1;
        }
        .sardar-helpline-phone {
          font-size: 0.82rem;
          font-weight: 800;
          color: #14532d;
          margin-top: 2px;
          line-height: 1;
        }

        /* Action Item Buttons */
        .sardar-action-item {
          background: none;
          border: none;
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 6px 10px;
          border-radius: 10px;
          cursor: pointer;
          color: #2b1810;
          transition: all 0.15s ease;
          position: relative;
        }
        .sardar-action-item:hover {
          background: #fbf5ef;
          color: #b45309;
        }
        .sardar-action-icon-box {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .sardar-action-textbox {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          line-height: 1.15;
        }
        .sardar-action-micro {
          font-size: 0.68rem;
          color: #78716c;
          font-weight: 600;
        }
        .sardar-action-bold {
          font-size: 0.82rem;
          font-weight: 800;
          color: inherit;
        }

        /* Count Badge Pills */
        .sardar-count-pill {
          position: absolute;
          top: -7px;
          right: -9px;
          background: #b45309;
          color: #ffffff;
          font-size: 0.65rem;
          font-weight: 800;
          min-width: 17px;
          height: 17px;
          padding: 0 4px;
          border-radius: 9999px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 2px solid #ffffff;
          box-shadow: 0 2px 4px rgba(0,0,0,0.15);
        }
        .sardar-count-pill.cart-pill {
          background: #dc2626;
        }
        .sardar-auth-indicator {
          position: absolute;
          bottom: -2px;
          right: -5px;
          background: #16a34a;
          color: #ffffff;
          width: 13px;
          height: 13px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1.5px solid #ffffff;
        }

        /* Popover Menu */
        .sardar-account-dropdown-wrapper {
          position: relative;
        }
        .sardar-account-popover {
          position: absolute;
          top: calc(100% + 8px);
          right: 0;
          width: 240px;
          background: #ffffff;
          border-radius: 14px;
          box-shadow: 0 14px 35px rgba(42, 24, 16, 0.16);
          border: 1.5px solid #ebd9cc;
          padding: 12px;
          z-index: 1100;
        }
        .sardar-popover-header {
          border-bottom: 1px solid #f1e4db;
          padding-bottom: 10px;
          margin-bottom: 8px;
        }
        .sardar-popover-greeting {
          font-size: 0.7rem;
          color: #a89487;
          font-weight: 700;
          text-transform: uppercase;
          display: block;
        }
        .sardar-popover-user {
          display: block;
          font-size: 0.95rem;
          color: #1e0d07;
          font-weight: 800;
          margin-top: 2px;
        }
        .sardar-popover-email {
          display: block;
          font-size: 0.78rem;
          color: #78716c;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .sardar-popover-admin-badge {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          background: #fef3c7;
          color: #b45309;
          font-size: 0.7rem;
          font-weight: 800;
          padding: 2px 7px;
          border-radius: 4px;
          margin-top: 5px;
        }
        .sardar-popover-links {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .sardar-popover-item {
          background: none;
          border: none;
          text-align: left;
          padding: 9px 12px;
          border-radius: 8px;
          font-size: 0.85rem;
          font-weight: 600;
          color: #332018;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 9px;
          transition: background 0.15s ease;
        }
        .sardar-popover-item:hover {
          background: #fbf5ef;
          color: #b45309;
        }
        .sardar-popover-item.admin {
          color: #b45309;
        }
        .sardar-popover-item.signout {
          color: #dc2626;
          background: #fef2f2;
          margin-top: 4px;
        }
        .sardar-popover-item.signout:hover {
          background: #fee2e2;
        }

        /* Mobile Trigger Buttons */
        .sardar-mob-search-btn,
        .sardar-mob-menu-btn {
          display: none;
          background: none;
          border: none;
          color: #1e0d07;
          padding: 6px;
          cursor: pointer;
          border-radius: 8px;
        }
        .sardar-mob-search-btn:hover,
        .sardar-mob-menu-btn:hover {
          background: #fbf5ef;
        }

        /* Mobile Expandable Search Form */
        .sardar-mob-search-container {
          padding-top: 8px;
          padding-bottom: 8px;
        }
        .sardar-mob-search-form {
          display: flex;
          align-items: center;
          background: #f8fafc;
          border: 1.5px solid #cbd5e1;
          border-radius: 9999px;
          padding: 4px 6px 4px 14px;
        }
        .sardar-mob-search-icon {
          margin-right: 8px;
          color: #64748b;
        }
        .sardar-mob-search-form input {
          flex: 1;
          border: none;
          background: transparent;
          outline: none;
          font-size: 0.9rem;
        }
        .sardar-mob-search-form button {
          background: #b45309;
          color: white;
          border: none;
          border-radius: 9999px;
          padding: 7px 16px;
          font-size: 0.82rem;
          font-weight: 700;
        }

        /* 3. PRIMARY CATEGORY NAVIGATION BAR */
        .sardar-nav-bar {
          background: #faf7f3;
          border-bottom: 1.5px solid #eae0d5;
          position: relative;
        }
        .sardar-nav-content {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .sardar-nav-items {
          display: flex;
          align-items: center;
          list-style: none;
          margin: 0;
          padding: 0;
          gap: 4px;
          white-space: nowrap;
        }
        .sardar-nav-tab {
          position: relative;
        }
        .sardar-nav-tab button {
          background: none;
          border: none;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 11px 16px;
          font-size: 0.88rem;
          font-weight: 700;
          color: #3b281f;
          cursor: pointer;
          transition: all 0.15s ease;
          border-radius: 8px;
          margin: 3px 0;
        }
        .sardar-nav-tab button:hover {
          color: #b45309;
          background: #f2e6dc;
        }
        .sardar-nav-tab.active button {
          color: #b45309;
          background: #ebd8cb;
          font-weight: 800;
        }
        .tab-chevron {
          transition: transform 0.2s ease;
          color: #8c766b;
        }
        .tab-chevron.rotated {
          transform: rotate(180deg);
          color: #b45309;
        }
        .sardar-nav-tab.offers-tab button {
          color: #c2410c;
        }
        .sardar-flame-icon {
          color: #ea580c;
        }
        .sardar-discount-tag {
          background: #fee2e2;
          color: #dc2626;
          font-size: 0.65rem;
          font-weight: 800;
          padding: 2px 6px;
          border-radius: 9999px;
          letter-spacing: 0.3px;
        }

        /* Right Timing Pill */
        .sardar-nav-timing {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          font-size: 0.78rem;
          font-weight: 700;
          color: #785e50;
        }
        .sardar-timing-dot {
          width: 7px;
          height: 7px;
          background: #22c55e;
          border-radius: 50%;
        }

        /* Mega Dropdown Menus */
        .sardar-mega-dropdown {
          position: absolute;
          top: 100%;
          left: 0;
          width: 620px;
          background: #ffffff;
          border-radius: 16px;
          box-shadow: 0 16px 36px rgba(42, 24, 16, 0.18);
          border: 1.5px solid #ebd9cc;
          padding: 20px;
          z-index: 1200;
        }
        .sardar-mega-grid {
          display: grid;
          grid-template-columns: 1.6fr 1fr;
          gap: 20px;
        }
        .sardar-mega-header {
          display: block;
          font-size: 0.7rem;
          font-weight: 800;
          color: #8c766b;
          letter-spacing: 1.2px;
          margin-bottom: 12px;
        }
        .sardar-mega-list {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .sardar-mega-link {
          background: none;
          border: none;
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 8px 10px;
          border-radius: 10px;
          text-align: left;
          cursor: pointer;
          transition: background 0.15s ease;
        }
        .sardar-mega-link:hover {
          background: #fbf5ef;
        }
        .sardar-mega-emoji {
          font-size: 1.3rem;
          flex-shrink: 0;
        }
        .sardar-mega-link strong {
          display: block;
          font-size: 0.88rem;
          color: #1e0d07;
        }
        .sardar-mega-link small {
          display: block;
          font-size: 0.74rem;
          color: #64748b;
        }
        .sardar-mega-footer {
          margin-top: 14px;
          border-top: 1px solid #f1e4db;
          padding-top: 10px;
        }
        .sardar-mega-footer button {
          background: none;
          border: none;
          color: #b45309;
          font-size: 0.82rem;
          font-weight: 700;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .sardar-mega-footer button:hover {
          text-decoration: underline;
        }

        .sardar-mega-banner {
          background: linear-gradient(135deg, #2b170e 0%, #150904 100%);
          color: #ffffff;
          border-radius: 12px;
          padding: 20px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          cursor: pointer;
        }
        .sardar-mega-banner.elec {
          background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
        }
        .sardar-banner-chip {
          background: #f59e0b;
          color: #1e0d07;
          font-size: 0.65rem;
          font-weight: 800;
          padding: 2px 7px;
          border-radius: 4px;
          align-self: flex-start;
          margin-bottom: 10px;
        }
        .sardar-mega-banner h4 {
          margin: 0 0 6px;
          font-size: 1.05rem;
          font-weight: 800;
        }
        .sardar-mega-banner p {
          margin: 0 0 14px;
          font-size: 0.78rem;
          color: #cbd5e1;
          line-height: 1.4;
        }
        .sardar-banner-cta {
          color: #fde047;
          font-size: 0.8rem;
          font-weight: 700;
        }

        /* 4. MOBILE DRAWER */
        .sardar-drawer-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.6);
          backdrop-filter: blur(4px);
          z-index: 2000;
          display: flex;
        }
        .sardar-drawer-container {
          width: 85%;
          max-width: 360px;
          height: 100%;
          background: #ffffff;
          box-shadow: 6px 0 25px rgba(0,0,0,0.25);
          display: flex;
          flex-direction: column;
          overflow: hidden;
          animation: slideDrawer 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        @keyframes slideDrawer {
          from { transform: translateX(-100%); }
          to { transform: translateX(0); }
        }
        .sardar-drawer-head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 20px;
          background: #180f0a;
          color: #ffffff;
        }
        .sardar-drawer-brand-wrap {
          display: flex;
          align-items: center;
          gap: 10px;
          cursor: pointer;
        }
        .sardar-drawer-logo {
          height: 36px;
          border-radius: 6px;
        }
        .sardar-drawer-brand-name {
          margin: 0;
          font-size: 1.15rem;
          font-weight: 800;
          color: #ffffff;
        }
        .sardar-drawer-brand-name span {
          color: #fbbf24;
        }
        .sardar-drawer-head small {
          font-size: 0.6rem;
          color: #cbd5e1;
          letter-spacing: 1px;
        }
        .sardar-drawer-close-btn {
          background: none;
          border: none;
          color: #ffffff;
          cursor: pointer;
        }

        .sardar-drawer-search {
          display: flex;
          align-items: center;
          background: #f1f5f9;
          margin: 14px 18px 6px;
          padding: 8px 12px;
          border-radius: 10px;
          gap: 8px;
        }
        .sardar-drawer-search input {
          flex: 1;
          border: none;
          background: transparent;
          outline: none;
          font-size: 0.88rem;
        }
        .sardar-drawer-search button {
          background: #b45309;
          color: white;
          border: none;
          border-radius: 6px;
          padding: 4px 10px;
          font-size: 0.78rem;
          font-weight: 700;
        }

        .sardar-drawer-body {
          flex: 1;
          overflow-y: auto;
          padding: 14px 18px 30px;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .sardar-drawer-label {
          font-size: 0.68rem;
          font-weight: 800;
          color: #94a3b8;
          letter-spacing: 1.2px;
          margin: 6px 0 4px 4px;
        }
        .sardar-drawer-nav-item {
          background: none;
          border: none;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 11px 14px;
          border-radius: 10px;
          font-size: 0.92rem;
          font-weight: 700;
          color: #1e293b;
          text-align: left;
          cursor: pointer;
          transition: background 0.15s ease;
        }
        .sardar-drawer-nav-item:hover,
        .sardar-drawer-nav-item.active {
          background: #fbf5ef;
          color: #b45309;
        }
        .sardar-drawer-nav-item.offers-link {
          color: #c2410c;
        }

        .sardar-drawer-accordion-block {
          display: flex;
          flex-direction: column;
        }
        .sardar-accordion-header-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .sardar-accordion-header-row .sardar-drawer-nav-item {
          flex: 1;
        }
        .sardar-accordion-trigger {
          background: none;
          border: none;
          padding: 10px 14px;
          cursor: pointer;
          color: #64748b;
        }
        .sardar-acc-icon {
          transition: transform 0.2s ease;
        }
        .sardar-acc-icon.open {
          transform: rotate(180deg);
          color: #b45309;
        }
        .sardar-drawer-sublinks {
          display: flex;
          flex-direction: column;
          gap: 4px;
          background: #f8fafc;
          border-radius: 10px;
          padding: 8px 12px;
          margin: 4px 0 8px 12px;
        }
        .sardar-drawer-sublinks button {
          background: none;
          border: none;
          text-align: left;
          padding: 8px 10px;
          font-size: 0.85rem;
          font-weight: 600;
          color: #334155;
          cursor: pointer;
          border-radius: 6px;
        }
        .sardar-drawer-sublinks button:hover {
          background: #f1f5f9;
          color: #b45309;
        }
        .sardar-drawer-sublinks button.see-all {
          color: #b45309;
          font-weight: 700;
        }

        .sardar-drawer-card {
          margin-top: 16px;
          background: #f0fdf4;
          border: 1px solid #bbf7d0;
          border-radius: 12px;
          padding: 14px;
        }
        .sardar-drawer-wa-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          background: #16a34a;
          color: #ffffff;
          padding: 9px;
          border-radius: 8px;
          text-decoration: none;
          font-size: 0.85rem;
          font-weight: 700;
        }

        /* ------------------------------------------- */
        /* RESPONSIVE BREAKPOINTS                      */
        /* ------------------------------------------- */

        /* 1200px and below */
        @media (max-width: 1200px) {
          .sardar-nav-timing {
            display: none;
          }
          .sardar-action-textbox {
            display: none;
          }
          .sardar-action-item {
            padding: 6px 8px;
          }
          .sardar-search-bar {
            max-width: 480px;
          }
        }

        /* 992px and below (Tablets & Mobile) */
        @media (max-width: 992px) {
          .sardar-nav-bar {
            display: none;
          }
          .sardar-search-bar {
            display: none;
          }
          .sardar-helpline-card {
            display: none;
          }
          .sardar-top-links {
            display: none;
          }
          .sardar-mob-search-btn,
          .sardar-mob-menu-btn {
            display: flex;
          }
          .sardar-ticker {
            justify-content: center;
          }
          .sardar-main-content {
            padding: 0 16px;
          }
          .sardar-brand-primary {
            font-size: 1.3rem;
          }
        }

        /* 600px and below (Phones) */
        @media (max-width: 600px) {
          .sardar-ticker-tag {
            display: none;
          }
          .sardar-ticker-text {
            font-size: 0.74rem;
          }
          .sardar-logo-img {
            height: 38px;
          }
          .sardar-brand-primary {
            font-size: 1.15rem;
          }
          .sardar-brand-secondary {
            display: none;
          }
          .sardar-actions-bar {
            gap: 4px;
          }
          .sardar-action-item {
            padding: 6px 6px;
          }
        }
      `}</style>
    </header>
  );
}
