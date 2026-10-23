import React, { useState } from 'react';
import { 
  Sparkles, Tag, Percent, Copy, Check, 
  ArrowRight, CreditCard, Calculator, Gift, HelpCircle, Package 
} from 'lucide-react';
import ProductCard from '../components/ProductCard';

export default function Offers({ 
  onSelectProduct, 
  onAddToCart, 
  wishlist = [], 
  onToggleWishlist,
  cart = [],
  onUpdateQuantity,
  products: customProducts,
  promoCodes: customPromoCodes = []
}) {
  const allProducts = Array.isArray(customProducts) ? customProducts : (customProducts || []);
  const activePromos = (customPromoCodes || []).filter(p => p.status !== 'inactive');
  const [copiedCode, setCopiedCode] = useState(null);
  const [emiAmount, setEmiAmount] = useState(45000);
  const [emiMonths, setEmiMonths] = useState(6);
  const [selectedBank, setSelectedBank] = useState('HDFC Bank');

  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  const calculatedMonthlyEmi = Math.round(emiAmount / emiMonths);

  // Grab combo products and high discount products
  const comboProducts = allProducts.filter(p => p.isCombo);
  const highDiscountProducts = allProducts.filter(p => p.discount >= 23 && !p.isCombo);

  return (
    <div className="offers-page">
      {/* 1. Header Hero */}
      <section className="offers-hero">
        <div className="container">
          <div className="offers-hero-card">
            <span className="offers-hero-pill">
              <Sparkles size={14} /> Mega Festive Grand Sale
            </span>
            <h1 className="offers-hero-title">
              Up to 50% OFF + Extra Combo Savings
            </h1>
            <p className="offers-hero-sub">
              Furnish your entire home for less. Exclusive showroom coupons, synchronized combo packages, and 0% No Cost EMI for up to 18 months.
            </p>
          </div>
        </div>
      </section>

      {/* 2. Active Coupons Strip */}
      <section className="coupons-section">
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div>
              <h2 className="section-title" style={{ margin: 0 }}>Claim Exclusive Discount Coupons</h2>
              <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: '0.9rem' }}>Use these verified promo codes during checkout to save instantly.</p>
            </div>
            {activePromos.length > 0 && (
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#b45309', background: '#fef3c7', padding: '4px 12px', borderRadius: '20px' }}>
                {activePromos.length} Verified Codes Active
              </span>
            )}
          </div>

          {activePromos.length > 0 ? (
            <div className="coupons-grid">
              {activePromos.map((offer) => (
                <div key={offer.id} className="coupon-card">
                  <div className="coupon-left">
                    <div className="coupon-tag-badge">
                      <Tag size={14} /> {offer.discountPercentage}% OFF
                    </div>
                    <h3 className="coupon-title">
                      {offer.discountPercentage}% Instant Discount
                    </h3>
                    <p className="coupon-desc" style={{ color: '#166534', fontWeight: 600, fontSize: '0.88rem', margin: '4px 0' }}>
                      ⚡ Offer limit: Upto ₹{Number(offer.maxDiscountAmount || 0).toLocaleString('en-IN')}
                    </p>
                    {offer.minOrderAmount > 0 && (
                      <span style={{ fontSize: '0.78rem', color: '#64748b', display: 'block', marginBottom: '4px' }}>
                        Min. Cart Value: ₹{Number(offer.minOrderAmount).toLocaleString('en-IN')}
                      </span>
                    )}
                    {offer.description && (
                      <p className="coupon-desc" style={{ fontSize: '0.82rem', color: '#475569', margin: '4px 0' }}>
                        {offer.description}
                      </p>
                    )}
                    <span className="coupon-validity">{offer.validTill || 'Valid until stocks last'}</span>
                  </div>

                  <div className="coupon-right">
                    <div className="coupon-code-box">
                      <span className="code-text">{offer.code}</span>
                    </div>
                    <button 
                      className={`copy-code-btn ${copiedCode === offer.code ? 'copied' : ''}`}
                      onClick={() => handleCopyCode(offer.code)}
                      title={`Copy promo code ${offer.code}`}
                    >
                      {copiedCode === offer.code ? (
                        <>
                          <Check size={14} /> Copied!
                        </>
                      ) : (
                        <>
                          <Copy size={14} /> Copy Code
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-products-box" style={{ textAlign: 'center', padding: '48px 20px', background: '#f8fafc', borderRadius: '16px', border: '1px dashed #cbd5e1' }}>
              <Tag size={40} style={{ color: '#94a3b8', margin: '0 auto 12px', display: 'block' }} />
              <h3 style={{ fontSize: '1.2rem', fontWeight: 600, color: '#1e293b', marginBottom: '6px' }}>No promo codes found</h3>
              <p style={{ color: '#64748b' }}>No active promo codes currently published from the store admin panel. Check back soon for seasonal discounts!</p>
            </div>
          )}
        </div>
      </section>

      {/* 3. Curated Combo Bundles (Furniture + Electronics) */}
      <section className="combos-section">
        <div className="container">
          <div className="section-header-box">
            <span className="badge-pill badge-festive">Best Value Bundles</span>
            <h2 className="section-main-heading">Exclusive Home Combo Deals</h2>
            <p className="section-sub-heading">Buy paired furniture &amp; electronics together to save up to ₹25,000 on single invoice</p>
          </div>

          {comboProducts.length > 0 ? (
            <div className="combos-grid">
              {comboProducts.map(combo => (
                <ProductCard
                  key={combo.id}
                  product={combo}
                  onSelectProduct={onSelectProduct}
                  onAddToCart={onAddToCart}
                  isWishlisted={wishlist.some(item => item.id === combo.id)}
                  onToggleWishlist={onToggleWishlist}
                  cartQuantity={cart?.find(item => item.id === combo.id)?.quantity || 0}
                  onUpdateQuantity={onUpdateQuantity}
                />
              ))}
            </div>
          ) : (
            <div className="no-products-box" style={{ textAlign: 'center', padding: '48px 20px', background: '#f8fafc', borderRadius: '16px', border: '1px dashed #cbd5e1' }}>
              <Package size={44} style={{ color: '#94a3b8', margin: '0 auto 12px', display: 'block' }} />
              <h3 style={{ fontSize: '1.2rem', fontWeight: 600, color: '#1e293b', marginBottom: '6px' }}>No products found</h3>
              <p style={{ color: '#64748b' }}>No combo bundle packages currently configured in the store database.</p>
            </div>
          )}
        </div>
      </section>

      {/* 4. Interactive No Cost EMI Calculator Widget */}
      <section className="emi-calculator-section">
        <div className="container">
          <div className="emi-calculator-card">
            <div className="calc-info-col">
              <span className="calc-badge">
                <Calculator size={16} /> Instant Financial Planner
              </span>
              <h2>No Cost EMI Calculator</h2>
              <p>
                Upgrade your lifestyle without straining your savings. 0% interest and zero processing fees on all credit and debit cards from our banking partners.
              </p>

              <div className="partner-banks-row">
                <span>Partner Banks:</span>
                <strong>HDFC • SBI • ICICI • Axis • Kotak • Bajaj Finserv</strong>
              </div>
            </div>

            <div className="calc-inputs-col">
              {/* Purchase amount slider */}
              <div className="calc-field">
                <div className="field-label-row">
                  <label>Total Order Amount</label>
                  <span className="highlight-val">₹{emiAmount.toLocaleString('en-IN')}</span>
                </div>
                <input 
                  type="range"
                  min="10000"
                  max="200000"
                  step="5000"
                  value={emiAmount}
                  onChange={(e) => setEmiAmount(Number(e.target.value))}
                  className="calc-range"
                />
              </div>

              {/* Tenure buttons */}
              <div className="calc-field">
                <label className="field-label">Select EMI Tenure (Months)</label>
                <div className="tenure-buttons">
                  {[3, 6, 9, 12, 18].map(m => (
                    <button
                      key={m}
                      className={`tenure-btn ${emiMonths === m ? 'active' : ''}`}
                      onClick={() => setEmiMonths(m)}
                    >
                      {m} Months
                    </button>
                  ))}
                </div>
              </div>

              {/* Bank selector */}
              <div className="calc-field">
                <label className="field-label">Choose Bank</label>
                <select 
                  value={selectedBank} 
                  onChange={(e) => setSelectedBank(e.target.value)}
                  className="calc-select"
                >
                  <option value="HDFC Bank">HDFC Bank (Instant Approval)</option>
                  <option value="ICICI Bank">ICICI Bank (No Cost EMI)</option>
                  <option value="State Bank of India">SBI Cards</option>
                  <option value="Axis Bank">Axis Bank</option>
                  <option value="Bajaj Finserv">Bajaj Finserv EMI Network Card</option>
                </select>
              </div>

              {/* Result Summary */}
              <div className="calc-result-box">
                <div className="result-main">
                  <span className="result-label">Monthly Installment</span>
                  <span className="result-val">₹{calculatedMonthlyEmi.toLocaleString('en-IN')} / mo</span>
                </div>
                <div className="result-breakdown">
                  <span>Interest: <strong>₹0 (Zero Interest)</strong></span>
                  <span>Processing Fee: <strong>₹0</strong></span>
                  <span>Total Payable: <strong>₹{emiAmount.toLocaleString('en-IN')}</strong></span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Blockbuster Discount Picks */}
      <section className="discount-picks-section">
        <div className="container">
          <div className="section-header-box">
            <h2 className="section-main-heading">Blockbuster Festive Discounts</h2>
            <p className="section-sub-heading">Save flat 20% to 40% on these top rated bestsellers</p>
          </div>

          {highDiscountProducts.length > 0 ? (
            <div className="combos-grid">
              {highDiscountProducts.slice(0, 4).map(prod => (
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
            <div className="no-products-box" style={{ textAlign: 'center', padding: '48px 20px', background: '#f8fafc', borderRadius: '16px', border: '1px dashed #cbd5e1' }}>
              <Package size={44} style={{ color: '#94a3b8', margin: '0 auto 12px', display: 'block' }} />
              <h3 style={{ fontSize: '1.2rem', fontWeight: 600, color: '#1e293b', marginBottom: '6px' }}>No products found</h3>
              <p style={{ color: '#64748b' }}>No special discount deals currently configured in the store database.</p>
            </div>
          )}
        </div>
      </section>

      <style>{`
        .offers-page {
          padding-bottom: 60px;
        }

        .offers-hero {
          padding: 24px 0 20px;
        }
        .offers-hero-card {
          background: linear-gradient(135deg, #a24e23 0%, #682c0e 100%);
          border-radius: var(--radius-xl);
          padding: 45px 36px;
          color: #ffffff;
          box-shadow: var(--shadow-lg);
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .offers-hero-pill {
          background: rgba(255, 255, 255, 0.2);
          color: #fde047;
          font-size: 0.8rem;
          font-weight: 700;
          padding: 5px 14px;
          border-radius: var(--radius-full);
          display: inline-flex;
          align-items: center;
          gap: 6px;
          margin-bottom: 14px;
        }
        .offers-hero-title {
          font-size: 2.5rem;
          font-weight: 800;
          color: #ffffff;
          margin-bottom: 10px;
          line-height: 1.2;
        }
        .offers-hero-sub {
          font-size: 1.05rem;
          color: #ffedd5;
          max-width: 650px;
          line-height: 1.5;
        }

        /* Coupons */
        .coupons-section {
          padding: 30px 0;
        }
        .coupons-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
          margin-top: 18px;
        }
        .coupon-card {
          background: #ffffff;
          border: 2px dashed #e8dcd2;
          border-radius: var(--radius-lg);
          padding: 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          box-shadow: var(--shadow-sm);
          transition: all var(--transition-fast);
        }
        .coupon-card:hover {
          border-color: var(--color-primary);
          box-shadow: var(--shadow-md);
        }
        .coupon-tag-badge {
          font-size: 0.72rem;
          font-weight: 700;
          color: var(--color-primary);
          display: inline-flex;
          align-items: center;
          gap: 4px;
          text-transform: uppercase;
          margin-bottom: 6px;
        }
        .coupon-title {
          font-size: 1.15rem;
          font-weight: 800;
          color: var(--color-warm-dark);
          margin-bottom: 4px;
        }
        .coupon-desc {
          font-size: 0.8rem;
          color: var(--color-text-muted);
          margin-bottom: 8px;
        }
        .coupon-validity {
          font-size: 0.72rem;
          color: #059669;
          font-weight: 600;
        }

        .coupon-right {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          margin-left: 14px;
        }
        .coupon-code-box {
          background: #faf4ef;
          border: 1px solid #ebd8cb;
          padding: 6px 12px;
          border-radius: 6px;
        }
        .code-text {
          font-family: monospace;
          font-weight: 800;
          font-size: 0.95rem;
          color: var(--color-primary);
          letter-spacing: 1px;
        }
        .copy-code-btn {
          background: var(--color-warm-dark);
          color: #ffffff;
          padding: 6px 12px;
          border-radius: var(--radius-md);
          font-size: 0.75rem;
          font-weight: 700;
          display: inline-flex;
          align-items: center;
          gap: 4px;
          transition: all var(--transition-fast);
        }
        .copy-code-btn:hover {
          background: var(--color-primary);
        }
        .copy-code-btn.copied {
          background: #15803d;
        }

        /* Combos */
        .combos-section, .discount-picks-section {
          padding: 30px 0;
        }
        .section-header-box {
          text-align: center;
          max-width: 600px;
          margin: 0 auto 30px;
        }
        .combos-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 24px;
        }

        /* EMI Calculator */
        .emi-calculator-section {
          padding: 40px 0;
        }
        .emi-calculator-card {
          background: #ffffff;
          border-radius: var(--radius-xl);
          border: 1px solid var(--color-border);
          box-shadow: var(--shadow-md);
          padding: 40px;
          display: grid;
          grid-template-columns: 1.2fr 1.4fr;
          gap: 45px;
          align-items: center;
        }
        .calc-badge {
          background: #fff7ed;
          color: var(--color-primary);
          padding: 4px 12px;
          border-radius: var(--radius-full);
          font-size: 0.78rem;
          font-weight: 700;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          margin-bottom: 12px;
        }
        .calc-info-col h2 {
          font-size: 2rem;
          margin-bottom: 12px;
        }
        .calc-info-col p {
          color: var(--color-text-muted);
          font-size: 0.95rem;
          line-height: 1.6;
          margin-bottom: 24px;
        }
        .partner-banks-row {
          background: #faf6f2;
          padding: 12px 16px;
          border-radius: var(--radius-md);
          font-size: 0.82rem;
          color: var(--color-text-main);
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .calc-inputs-col {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        .calc-field {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .field-label-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.9rem;
          font-weight: 700;
        }
        .highlight-val {
          color: var(--color-primary);
          font-size: 1.15rem;
          font-weight: 800;
        }
        .calc-range {
          accent-color: var(--color-primary);
          cursor: pointer;
        }
        .field-label {
          font-size: 0.88rem;
          font-weight: 700;
        }
        .tenure-buttons {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }
        .tenure-btn {
          padding: 8px 16px;
          border-radius: var(--radius-md);
          border: 1px solid var(--color-border);
          background: #ffffff;
          font-size: 0.85rem;
          font-weight: 600;
          transition: all var(--transition-fast);
        }
        .tenure-btn.active {
          background: var(--color-primary);
          color: #ffffff;
          border-color: var(--color-primary);
        }
        .calc-select {
          padding: 10px 14px;
          border-radius: var(--radius-md);
          border: 1px solid var(--color-border);
          font-size: 0.9rem;
          font-weight: 600;
          outline: none;
        }

        .calc-result-box {
          background: linear-gradient(135deg, #2a1810 0%, #1e110a 100%);
          color: #ffffff;
          border-radius: var(--radius-lg);
          padding: 20px;
        }
        .result-main {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          padding-bottom: 12px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.15);
          margin-bottom: 12px;
        }
        .result-label {
          font-size: 0.9rem;
          color: #e2d5cb;
        }
        .result-val {
          font-family: var(--font-heading);
          font-size: 1.6rem;
          font-weight: 800;
          color: #fde047;
        }
        .result-breakdown {
          display: flex;
          justify-content: space-between;
          font-size: 0.78rem;
          color: #d1b8a7;
          flex-wrap: wrap;
          gap: 10px;
        }
        .result-breakdown strong {
          color: #ffffff;
        }

        @media (max-width: 992px) {
          .coupons-grid {
            grid-template-columns: 1fr;
          }
          .combos-grid {
            grid-template-columns: 1fr;
          }
          .emi-calculator-card {
            grid-template-columns: 1fr;
            padding: 26px;
          }
        }
      `}</style>
    </div>
  );
}
