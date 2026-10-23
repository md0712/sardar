import React, { useState, useEffect } from 'react';
import { 
  Phone, MessageCircle, Mail, MapPin, Clock, 
  Send, CheckCircle, Navigation, Sparkles, Building,
  ExternalLink, ShieldCheck, CreditCard, Truck, Car, Star
} from 'lucide-react';
import { createCustomerReview, subscribeToReviews } from '../services/reviewService';
import { createEnquiry } from '../services/enquiryService';

export default function Contact() {
  const [liveReviews, setLiveReviews] = useState([]);

  useEffect(() => {
    const unsub = subscribeToReviews((list) => {
      setLiveReviews(list || []);
    });
    return () => {
      if (typeof unsub === 'function') unsub();
    };
  }, []);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    rating: 5,
    category: 'Furniture & Living Room Sofas',
    branch: 'Flagship Showroom (No. 192, E.H Road, Vyasarpadi, Chennai - 39)',
    message: ''
  });

  const [hoverRating, setHoverRating] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [copiedAddress, setCopiedAddress] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Store information
  const storeData = {
    name: 'Sardar Mart Furniture and Home Appliances',
    tagline: 'Your Home, Our Priority',
    primaryPhone: '6383056338',
    secondaryPhone: '9344623632',
    whatsappNumber: '6383056338',
    email: 'sardarmart64@gmail.com',
    address: 'No. 192, E.H Road, Cholan nagar, Vyasarpadi, Erukancheri, Chennai - 39.',
    timing: '09:30 AM – 09:30 PM (All 7 Days Open)',
    instagram: {
      name: 'sardar_mart_ch_39',
      handle: '@sardar_mart_ch_39',
      url: 'https://www.instagram.com/sardar_mart_ch_39?xtok=N2c2cW8xYmdzM3Fy'
    },
    googleMapsLink: 'https://maps.google.com/?q=No.+192,+E.H+Road,+Cholan+Nagar,+Vyasarpadi,+Erukancheri,+Chennai+-+600039',
    mapEmbedUrl: 'https://maps.google.com/maps?q=No.+192,+E.H+Road,+Cholan+Nagar,+Vyasarpadi,+Erukancheri,+Chennai+-+600039&t=&z=16&ie=UTF8&iwloc=&output=embed'
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleCopyAddress = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(storeData.address);
      setCopiedAddress(true);
      setTimeout(() => setCopiedAddress(false), 2500);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) {
      alert('Please provide your name and phone number so our showroom consultant can contact you.');
      return;
    }

    setIsSubmitting(true);
    try {
      // Save directly to Firestore 'reviews' (and sync to 'enquiries')
      await createCustomerReview({
        name: formData.name,
        phone: formData.phone,
        contact: formData.phone,
        email: formData.email || '',
        rating: formData.rating || 5,
        category: formData.category || 'General Showroom Feedback',
        branch: formData.branch,
        message: formData.message || '',
        feedback: formData.message || '',
        status: 'New'
      });
    } catch (err) {
      console.warn('Could not post review to Firestore:', err);
    } finally {
      setIsSubmitting(false);
      setSubmitted(true);
    }
  };

  const handleForwardToWhatsApp = () => {
    const text = encodeURIComponent(
      `Hello Sardar Mart Furniture and Home Appliances! My name is ${formData.name}. Phone: ${formData.phone}. Email: ${formData.email || 'N/A'}. Rating: ${formData.rating} Stars. Feedback/Enquiry for ${formData.category}: ${formData.message || 'I would like to enquire about products and showroom consultation.'}`
    );
    window.open(`https://wa.me/91${storeData.whatsappNumber}?text=${text}`, '_blank');
  };

  return (
    <div className="contact-page-wrapper">
      {/* 1. Hero Header */}
      <section className="contact-hero">
        <div className="container">
          <div className="contact-hero-content">
            <span className="contact-pill-tag">
              <Sparkles size={14} /> Official Showroom &amp; Customer Care
            </span>
            <h1 className="contact-hero-title">
              Connect with <span><strong>Sardar Mart</strong> Furniture and Home Appliances</span>
            </h1>
            <p className="contact-hero-sub">
              Visit our grand showroom in Chennai to experience solid-wood furniture, luxury sofas, smart TVs, and energy-efficient appliances. We are open all 7 days with dedicated consultants ready to assist you.
            </p>

            <div className="hero-perks-ribbon">
              <div className="perk-chip">
                <Clock size={14} /> 9:30 AM – 9:30 PM (All 7 Days)
              </div>
              <div className="perk-chip">
                <Car size={14} /> Free Customer Parking
              </div>
              <div className="perk-chip">
                <MessageCircle size={14} /> Instant WhatsApp Support
              </div>
              <div className="perk-chip">
                <CreditCard size={14} /> 0% No-Cost EMI
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Communication Channels Grid */}
      <section className="contact-channels-section">
        <div className="container">
          <div className="channels-cards-grid">
            
            {/* Phone Card */}
            <div className="contact-channel-card phone-card">
              <div className="channel-icon-box phone-accent">
                <Phone size={24} />
              </div>
              <div className="channel-body">
                <span className="channel-kicker">Call Showroom Direct</span>
                <h3 className="channel-title">Helpline Numbers</h3>
                <div className="phone-links-group">
                  <a href={`tel:+91${storeData.primaryPhone}`} className="primary-tel-link">
                    +91 {storeData.primaryPhone}
                  </a>
                  <span className="tel-separator">•</span>
                  <a href={`tel:+91${storeData.secondaryPhone}`} className="secondary-tel-link">
                    +91 {storeData.secondaryPhone}
                  </a>
                </div>
                <p className="channel-hint">Instant phone assistance &amp; stock enquiries</p>
              </div>
              <a href={`tel:+91${storeData.primaryPhone}`} className="channel-action-btn">
                <Phone size={14} /> Call Now
              </a>
            </div>

            {/* WhatsApp Card */}
            <div className="contact-channel-card wa-card">
              <div className="channel-icon-box wa-accent">
                <MessageCircle size={24} />
              </div>
              <div className="channel-body">
                <div className="status-indicator-row">
                  <span className="channel-kicker">Live WhatsApp Chat</span>
                  <span className="online-pill">
                    <span className="online-dot"></span> Online
                  </span>
                </div>
                <h3 className="channel-title">+91 {storeData.whatsappNumber}</h3>
                <p className="channel-hint">Chat with store manager, get photos &amp; price quotes</p>
              </div>
              <a 
                href={`https://wa.me/91${storeData.whatsappNumber}?text=Hi%20Sardar%20Mart%20Furniture%20and%20Home%20Appliances%2C%20I%20would%20like%20to%20enquire%20about%20your%20products`}
                target="_blank" 
                rel="noreferrer"
                className="channel-action-btn wa-btn"
              >
                <MessageCircle size={15} /> Chat on WhatsApp
              </a>
            </div>

            {/* Email Card */}
            <div className="contact-channel-card email-card">
              <div className="channel-icon-box email-accent">
                <Mail size={24} />
              </div>
              <div className="channel-body">
                <span className="channel-kicker">Written Support</span>
                <h3 className="channel-title">{storeData.email}</h3>
                <p className="channel-hint">Send purchase orders, quotes &amp; corporate queries</p>
              </div>
              <a href={`mailto:${storeData.email}`} className="channel-action-btn">
                <Mail size={14} /> Send Email
              </a>
            </div>

            {/* Instagram Card - Shows Logo and Name only, opens link in new tab */}
            <div className="contact-channel-card insta-card">
              <div className="channel-icon-box insta-accent">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
                </svg>
              </div>
              <div className="channel-body">
                <span className="channel-kicker">Official Instagram</span>
                <h3 className="channel-title">{storeData.instagram.name}</h3>
                <p className="channel-hint">Follow for new catalog arrivals, video tours &amp; offers</p>
              </div>
              <a 
                href={storeData.instagram.url}
                target="_blank" 
                rel="noopener noreferrer"
                className="channel-action-btn insta-btn"
                title="View Instagram Profile"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
                </svg>
                <span>{storeData.instagram.handle}</span>
                <ExternalLink size={13} />
              </a>
            </div>

          </div>
        </div>
      </section>

      {/* 3. Main Split Section: Showroom Details & Priority Enquiry Form */}
      <section className="contact-main-split">
        <div className="container">
          <div className="contact-split-grid">
            
            {/* Left: Showroom Location & Visiting Details */}
            <div className="showroom-info-column">
              <div className="showroom-spotlight-card">
                <div className="spotlight-header">
                  <div className="spotlight-badge">
                    <Building size={16} /> Flagship Mega Showroom
                  </div>
                  <span className="spotlight-city">Chennai</span>
                </div>

                <h2 className="spotlight-name"><strong>Sardar Mart</strong> Furniture and Home Appliances</h2>
                
                <div className="spotlight-address-box">
                  <div className="pin-circle">
                    <MapPin size={22} color="#b45309" />
                  </div>
                  <div className="address-text-group">
                    <strong>Showroom Address:</strong>
                    <p>{storeData.address}</p>
                    <span className="landmark-tag">📍 Cholan Nagar, E.H. Road (Vyasarpadi / Erukancheri)</span>
                  </div>
                </div>

                <div className="showroom-meta-grid">
                  <div className="meta-item">
                    <Clock size={18} className="meta-icon" />
                    <div>
                      <strong>Working Hours</strong>
                      <p>9:30 AM – 9:30 PM (All 7 Days Open)</p>
                    </div>
                  </div>
                  <div className="meta-item">
                    <Car size={18} className="meta-icon" />
                    <div>
                      <strong>Parking Facility</strong>
                      <p>Free customer parking on premises</p>
                    </div>
                  </div>
                  <div className="meta-item">
                    <Truck size={18} className="meta-icon" />
                    <div>
                      <strong>Fast Delivery</strong>
                      <p>Same-day &amp; 24-hr express delivery in Chennai</p>
                    </div>
                  </div>
                  <div className="meta-item">
                    <ShieldCheck size={18} className="meta-icon" />
                    <div>
                      <strong>Warranty &amp; Support</strong>
                      <p>100% Genuine brand warranty &amp; installation</p>
                    </div>
                  </div>
                </div>

                <div className="spotlight-actions">
                  <a 
                    href={storeData.googleMapsLink}
                    target="_blank" 
                    rel="noreferrer"
                    className="btn-spotlight-map"
                  >
                    <Navigation size={16} /> Open in Google Maps
                  </a>
                  <button 
                    type="button"
                    onClick={handleCopyAddress}
                    className="btn-spotlight-copy"
                  >
                    {copiedAddress ? '✓ Address Copied!' : 'Copy Full Address'}
                  </button>
                </div>
              </div>

              {/* Showroom Perks Banner */}
              <div className="visit-perks-card">
                <h4>Why Visit Our Chennai Store?</h4>
                <ul className="perks-checklist">
                  <li>
                    <CheckCircle size={16} color="#16a34a" />
                    <span><strong>Live Demonstration:</strong> Test 4K OLED TVs, soundbars, inverter ACs, and modular kitchen appliances.</span>
                  </li>
                  <li>
                    <CheckCircle size={16} color="#16a34a" />
                    <span><strong>Custom Furniture Fabrics:</strong> Select from 100+ premium upholstery fabrics, teak wood finishes, and mattress firmness levels.</span>
                  </li>
                  <li>
                    <CheckCircle size={16} color="#16a34a" />
                    <span><strong>On-The-Spot 0% EMI:</strong> Instant approval via Bajaj Finserv, HDFC, TVS Credit, IDFC FIRST Bank.</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Right: Enquiry Form */}
            <div className="enquiry-form-column">
              <div className="enquiry-card-wrapper">
                {!submitted ? (
                  <>
                    <div className="enquiry-header">
                      <span className="enquiry-badge">VIP Consultation</span>
                      <h2>Plan a Visit or Request a Callback</h2>
                      <p>
                        Interested in bulk orders, sofa customization, or instant combo discounts? Submit your query and an interior consultant will call or WhatsApp you shortly.
                      </p>
                    </div>

                    <form onSubmit={handleSubmit} className="modern-enquiry-form">
                      <div className="form-fields-grid">
                        
                        <div className="input-group">
                          <label>Full Name <span className="req">*</span></label>
                          <input 
                            type="text" 
                            name="name" 
                            required 
                            placeholder="e.g. Rajesh Kumar" 
                            value={formData.name}
                            onChange={handleChange}
                          />
                        </div>

                        <div className="input-group">
                          <label>Phone / WhatsApp Number <span className="req">*</span></label>
                          <input 
                            type="tel" 
                            name="phone" 
                            required 
                            placeholder="e.g. 6383056338" 
                            value={formData.phone}
                            onChange={handleChange}
                          />
                        </div>

                        <div className="input-group full-span">
                          <label>Email Address</label>
                          <input 
                            type="email" 
                            name="email" 
                            placeholder="e.g. rajesh@gmail.com" 
                            value={formData.email}
                            onChange={handleChange}
                          />
                        </div>

                        <div className="input-group">
                          <label>Category of Interest</label>
                          <select 
                            name="category" 
                            value={formData.category}
                            onChange={handleChange}
                          >
                            <option>Furniture &amp; Living Room Sofas</option>
                            <option>Teak Wood Beds &amp; Orthopedic Mattresses</option>
                            <option>Dining Table Sets &amp; Wardrobes</option>
                            <option>Smart 4K TVs &amp; Home Audio</option>
                            <option>Refrigerators &amp; Washing Machines</option>
                            <option>Kitchen Chimneys &amp; Built-in Hobs</option>
                            <option>Complete Home Combo Bundles (Special Offer)</option>
                            <option>Commercial / Bulk Corporate Enquiry</option>
                          </select>
                        </div>

                        <div className="input-group">
                          <label>Preferred Showroom</label>
                          <input 
                            type="text" 
                            name="branch" 
                            readOnly 
                            value={formData.branch}
                            className="readonly-input"
                          />
                        </div>

                        {/* Interactive Star Rating Selector */}
                        <div className="input-group full-span rating-picker-group">
                          <label>Rate Showroom / Shopping Experience</label>
                          <div className="star-rating-interactive">
                            {[1, 2, 3, 4, 5].map((starVal) => {
                              const activeStar = (hoverRating || formData.rating) >= starVal;
                              return (
                                <button
                                  key={starVal}
                                  type="button"
                                  className={`star-pick-btn ${activeStar ? 'filled' : ''}`}
                                  onMouseEnter={() => setHoverRating(starVal)}
                                  onMouseLeave={() => setHoverRating(0)}
                                  onClick={() => setFormData({ ...formData, rating: starVal })}
                                  title={`${starVal} Star${starVal > 1 ? 's' : ''}`}
                                >
                                  <Star 
                                    size={24} 
                                    fill={activeStar ? '#f59e0b' : 'none'} 
                                    color={activeStar ? '#f59e0b' : '#94a3b8'} 
                                  />
                                </button>
                              );
                            })}
                            <span className="rating-badge-text">
                              {formData.rating === 5 ? '★ Excellent (5/5)' :
                               formData.rating === 4 ? '★ Great (4/5)' :
                               formData.rating === 3 ? '★ Good (3/5)' :
                               formData.rating === 2 ? '★ Fair (2/5)' : '★ Needs Improvement (1/5)'}
                            </span>
                          </div>
                        </div>

                        <div className="input-group full-span">
                          <label>Customer Feedback &amp; Product Requirements <span className="req">*</span></label>
                          <textarea 
                            name="message" 
                            rows={4} 
                            required
                            placeholder="Share your feedback, showroom experience, questions about custom sofa fabric colors, room dimensions, or 0% EMI..."
                            value={formData.message}
                            onChange={handleChange}
                          ></textarea>
                        </div>

                      </div>

                      <button type="submit" className="btn-submit-enquiry" disabled={isSubmitting}>
                        <Send size={18} /> {isSubmitting ? 'Saving to Store Records...' : 'Submit Customer Feedback & Enquiry'}
                      </button>

                      <p className="privacy-micro-note">
                        🔒 Saved securely to our live Cloud Firestore registry. Our managers review all customer feedback daily.
                      </p>
                    </form>
                  </>
                ) : (
                  <div className="enquiry-success-box animate-fade-in">
                    <div className="success-icon-bubble">
                      <CheckCircle size={44} color="#15803d" />
                    </div>
                    <h2>Thank You, {formData.name}!</h2>
                    <p className="success-message">
                      Your enquiry has been received. Our showroom team at <strong>E.H Road, Vyasarpadi</strong> has logged your inquiry.
                    </p>

                    <div className="summary-card">
                      <div className="summary-row">
                        <span>Showroom:</span>
                        <strong>Vyasarpadi / Erukancheri, Chennai - 39</strong>
                      </div>
                      <div className="summary-row">
                        <span>Experience Rating:</span>
                        <strong style={{ color: '#b45309' }}>{'★'.repeat(formData.rating)} ({formData.rating}/5 Stars)</strong>
                      </div>
                      <div className="summary-row">
                        <span>Interest Area:</span>
                        <strong>{formData.category}</strong>
                      </div>
                      <div className="summary-row">
                        <span>Customer Contact:</span>
                        <strong>{formData.phone} {formData.email ? `• ${formData.email}` : ''}</strong>
                      </div>
                    </div>

                    <div className="success-actions">
                      <button 
                        type="button"
                        className="btn-wa-direct-handoff"
                        onClick={handleForwardToWhatsApp}
                      >
                        <MessageCircle size={18} /> Continue to WhatsApp Chat
                      </button>
                      <button 
                        type="button"
                        className="btn-reset-form"
                        onClick={() => setSubmitted(false)}
                      >
                        Submit Another Query
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 4. Interactive Google Maps Section */}
      <section className="google-map-interactive-section">
        <div className="container">
          <div className="map-card-container">
            <div className="map-card-header">
              <div className="map-header-info">
                <span className="map-pill">
                  <MapPin size={13} /> Live Navigation
                </span>
                <h3>Showroom Location &amp; Directions</h3>
                <p>{storeData.address}</p>
              </div>
              <div className="map-header-cta">
                <a 
                  href={storeData.googleMapsLink}
                  target="_blank" 
                  rel="noreferrer"
                  className="btn-get-directions"
                >
                  <Navigation size={16} /> Get Driving Directions
                </a>
              </div>
            </div>

            <div className="map-iframe-wrapper">
              <iframe
                title="Sardar Mart Furniture and Home Appliances Location"
                src={storeData.mapEmbedUrl}
                width="100%"
                height="450"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Verified Customer Reviews & Feedback from Showroom */}
      {liveReviews.length > 0 && (
        <section className="contact-live-reviews-section" style={{ padding: '40px 0 20px' }}>
          <div className="container">
            <div style={{ textAlign: 'center', marginBottom: '32px' }}>
              <span className="contact-pill-tag" style={{ background: '#fef3c7', color: '#b45309', border: '1px solid #fde68a' }}>
                <Star size={13} fill="#b45309" /> Genuine Customer Experiences
              </span>
              <h2 style={{ fontSize: '1.85rem', fontWeight: 800, margin: '10px 0 6px', color: '#0f172a' }}>
                Showroom Reviews &amp; Testimonials
              </h2>
              <p style={{ color: '#64748b', maxWidth: '640px', margin: '0 auto', fontSize: '0.92rem' }}>
                Real feedback submitted by customers who shopped and visited our flagship showroom in Chennai.
              </p>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '20px'
            }}>
              {liveReviews.map((r) => {
                const ratingCount = Math.min(5, Math.max(1, Number(r.rating) || 5));
                const initials = (r.name || 'C')
                  .trim()
                  .split(/\s+/)
                  .map(w => w[0])
                  .join('')
                  .toUpperCase()
                  .slice(0, 2) || 'C';

                return (
                  <div key={r.id} style={{
                    background: '#ffffff',
                    border: '1.5px solid #e2e8f0',
                    borderRadius: '16px',
                    padding: '24px',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.03)',
                    display: 'flex',
                    flexDirection: 'column'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                      <div style={{ display: 'flex', gap: '3px' }}>
                        {[...Array(ratingCount)].map((_, i) => (
                          <Star key={i} size={15} fill="#f59e0b" color="#f59e0b" />
                        ))}
                      </div>
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        background: '#ecfdf5',
                        color: '#047857',
                        border: '1px solid #a7f3d0',
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        padding: '2px 7px',
                        borderRadius: '12px'
                      }}>
                        <ShieldCheck size={12} /> Verified Showroom Review
                      </span>
                    </div>

                    {r.category && (
                      <div style={{
                        fontSize: '0.78rem',
                        background: '#f8fafc',
                        border: '1px solid #e2e8f0',
                        color: '#475569',
                        padding: '3px 8px',
                        borderRadius: '6px',
                        marginBottom: '10px',
                        fontWeight: 600,
                        alignSelf: 'flex-start'
                      }}>
                        {r.category}
                      </div>
                    )}

                    <p style={{
                      fontSize: '0.92rem',
                      lineHeight: '1.6',
                      color: '#334155',
                      fontStyle: 'italic',
                      margin: '0 0 16px',
                      flex: 1
                    }}>
                      "{r.message || r.feedback || 'Great experience visiting the showroom!'}"
                    </p>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', borderTop: '1px solid #f1f5f9', paddingTop: '12px', marginTop: 'auto' }}>
                      <div style={{
                        width: '38px',
                        height: '38px',
                        borderRadius: '50%',
                        background: '#fef3c7',
                        color: '#b45309',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 800,
                        fontSize: '0.88rem',
                        flexShrink: 0
                      }}>
                        {initials}
                      </div>
                      <div>
                        <h4 style={{ margin: 0, fontSize: '0.92rem', color: '#0f172a', fontWeight: 700 }}>
                          {r.name || 'Valued Customer'}
                        </h4>
                        <span style={{ fontSize: '0.74rem', color: '#64748b' }}>
                          {r.date || 'Recent Customer'}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Custom Scoped CSS Styles */}
      <style>{`
        .contact-page-wrapper {
          background-color: #fcfbf9;
          padding-bottom: 70px;
          color: #1e293b;
          font-family: inherit;
        }

        /* 1. Hero Section */
        .contact-hero {
          background: radial-gradient(circle at 50% 20%, #3e1f13 0%, #1e0d07 100%);
          color: #ffffff;
          padding: 60px 0 50px;
          text-align: center;
          position: relative;
          overflow: hidden;
        }
        .contact-hero::before {
          content: '';
          position: absolute;
          inset: 0;
          background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.02' fill-rule='evenodd'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/svg%3E");
          opacity: 0.8;
          pointer-events: none;
        }
        .contact-hero-content {
          max-width: 820px;
          margin: 0 auto;
          position: relative;
          z-index: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .contact-pill-tag {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: rgba(251, 191, 36, 0.15);
          border: 1px solid rgba(251, 191, 36, 0.4);
          color: #fbbf24;
          font-size: 0.82rem;
          font-weight: 700;
          padding: 4px 14px;
          border-radius: 20px;
          margin-bottom: 14px;
          text-transform: uppercase;
          letter-spacing: 0.6px;
        }
        .contact-hero-title {
          font-size: 2.6rem;
          font-weight: 800;
          line-height: 1.25;
          margin: 0 0 16px;
          color: #ffffff;
        }
        .contact-hero-title span {
          background: linear-gradient(90deg, #fef08a 0%, #f59e0b 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .contact-hero-sub {
          color: #e2d5cb;
          font-size: 1.05rem;
          line-height: 1.6;
          margin: 0 0 28px;
          max-width: 740px;
        }
        .hero-perks-ribbon {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 12px;
        }
        .perk-chip {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.14);
          backdrop-filter: blur(8px);
          padding: 6px 14px;
          border-radius: 20px;
          font-size: 0.82rem;
          font-weight: 600;
          color: #f8fafc;
        }

        /* 2. Communication Channels Grid */
        .contact-channels-section {
          margin-top: -30px;
          position: relative;
          z-index: 2;
          padding-bottom: 30px;
        }
        .channels-cards-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
        }
        .contact-channel-card {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 16px;
          padding: 24px 20px;
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.06), 0 8px 10px -6px rgba(0, 0, 0, 0.04);
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          transition: all 0.25s ease;
        }
        .contact-channel-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.05);
          border-color: #cbd5e1;
        }
        .channel-icon-box {
          width: 52px;
          height: 52px;
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 16px;
          transition: transform 0.2s ease;
        }
        .contact-channel-card:hover .channel-icon-box {
          transform: scale(1.08);
        }
        .phone-accent {
          background: #fef3c7;
          color: #b45309;
        }
        .wa-accent {
          background: #dcfce7;
          color: #15803d;
        }
        .email-accent {
          background: #e0e7ff;
          color: #4338ca;
        }
        .insta-accent {
          background: linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%);
          color: #ffffff;
        }
        .channel-body {
          flex: 1;
          margin-bottom: 18px;
        }
        .channel-kicker {
          font-size: 0.72rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          color: #64748b;
          display: block;
          margin-bottom: 4px;
        }
        .status-indicator-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 4px;
        }
        .online-pill {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          font-size: 0.68rem;
          font-weight: 700;
          color: #15803d;
          background: #dcfce7;
          padding: 2px 8px;
          border-radius: 10px;
        }
        .online-dot {
          width: 6px;
          height: 6px;
          background: #22c55e;
          border-radius: 50%;
          animation: pulseGreen 1.5s infinite;
        }
        @keyframes pulseGreen {
          0% { box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.7); }
          70% { box-shadow: 0 0 0 6px rgba(34, 197, 94, 0); }
          100% { box-shadow: 0 0 0 0 rgba(34, 197, 94, 0); }
        }
        .channel-title {
          font-size: 1.05rem;
          font-weight: 700;
          color: #0f172a;
          margin: 0 0 6px;
          word-break: break-word;
        }
        .phone-links-group {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 6px;
          margin-bottom: 6px;
        }
        .primary-tel-link {
          font-size: 1.05rem;
          font-weight: 800;
          color: #0f172a;
          text-decoration: none;
        }
        .primary-tel-link:hover {
          color: #b45309;
        }
        .tel-separator {
          color: #94a3b8;
          font-weight: 700;
        }
        .secondary-tel-link {
          font-size: 0.92rem;
          font-weight: 700;
          color: #475569;
          text-decoration: none;
        }
        .secondary-tel-link:hover {
          color: #b45309;
        }
        .channel-hint {
          font-size: 0.78rem;
          color: #64748b;
          line-height: 1.4;
          margin: 0;
        }
        .channel-action-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 9px 14px;
          border-radius: 10px;
          font-size: 0.82rem;
          font-weight: 700;
          text-decoration: none;
          background: #f1f5f9;
          color: #1e293b;
          transition: all 0.2s ease;
          border: 1px solid #e2e8f0;
          cursor: pointer;
        }
        .channel-action-btn:hover {
          background: #0f172a;
          color: #ffffff;
          border-color: #0f172a;
        }
        .channel-action-btn.wa-btn {
          background: #15803d;
          color: #ffffff;
          border-color: #15803d;
        }
        .channel-action-btn.wa-btn:hover {
          background: #166534;
        }
        .channel-action-btn.insta-btn {
          background: linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%);
          color: #ffffff;
          border: none;
        }
        .channel-action-btn.insta-btn:hover {
          opacity: 0.92;
          transform: scale(1.02);
        }

        /* 3. Main Split Section */
        .contact-main-split {
          padding: 30px 0 50px;
        }
        .contact-split-grid {
          display: grid;
          grid-template-columns: 1fr 1.25fr;
          gap: 36px;
          align-items: start;
        }

        /* Spotlight Card */
        .showroom-spotlight-card {
          background: #ffffff;
          border: 1.5px solid #fed7aa;
          border-radius: 20px;
          padding: 32px 28px;
          box-shadow: 0 12px 30px -10px rgba(180, 83, 9, 0.08);
          margin-bottom: 24px;
        }
        .spotlight-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 12px;
        }
        .spotlight-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 0.76rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          color: #9a3412;
          background: #ffedd5;
          padding: 4px 10px;
          border-radius: 6px;
        }
        .spotlight-city {
          font-size: 0.8rem;
          font-weight: 700;
          color: #64748b;
        }
        .spotlight-name {
          font-size: 1.45rem;
          font-weight: 800;
          color: #1e293b;
          margin: 0 0 18px;
          line-height: 1.3;
        }
        .spotlight-address-box {
          display: flex;
          gap: 14px;
          padding: 16px;
          background: #fffbeb;
          border: 1px solid #fef3c7;
          border-radius: 12px;
          margin-bottom: 22px;
        }
        .pin-circle {
          width: 42px;
          height: 42px;
          border-radius: 10px;
          background: #fde68a;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .address-text-group strong {
          display: block;
          font-size: 0.8rem;
          text-transform: uppercase;
          letter-spacing: 0.4px;
          color: #92400e;
          margin-bottom: 3px;
        }
        .address-text-group p {
          font-size: 0.95rem;
          font-weight: 600;
          color: #1e293b;
          line-height: 1.45;
          margin: 0 0 6px;
        }
        .landmark-tag {
          font-size: 0.76rem;
          color: #78350f;
          font-weight: 600;
          display: block;
        }
        .showroom-meta-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 16px;
          margin-bottom: 24px;
        }
        .meta-item {
          display: flex;
          gap: 10px;
          align-items: flex-start;
        }
        .meta-icon {
          color: #9a3412;
          flex-shrink: 0;
          margin-top: 2px;
        }
        .meta-item strong {
          display: block;
          font-size: 0.82rem;
          color: #0f172a;
          margin-bottom: 2px;
        }
        .meta-item p {
          font-size: 0.78rem;
          color: #64748b;
          margin: 0;
          line-height: 1.35;
        }
        .spotlight-actions {
          display: flex;
          gap: 12px;
        }
        .btn-spotlight-map {
          flex: 1.2;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          background: #9a3412;
          color: #ffffff;
          padding: 11px 18px;
          border-radius: 10px;
          font-size: 0.88rem;
          font-weight: 700;
          text-decoration: none;
          box-shadow: 0 4px 12px rgba(154, 52, 18, 0.25);
          transition: all 0.2s ease;
        }
        .btn-spotlight-map:hover {
          background: #7c2d12;
          transform: translateY(-1px);
        }
        .btn-spotlight-copy {
          flex: 1;
          background: #f1f5f9;
          color: #334155;
          border: 1px solid #cbd5e1;
          padding: 11px 14px;
          border-radius: 10px;
          font-size: 0.84rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .btn-spotlight-copy:hover {
          background: #e2e8f0;
          color: #0f172a;
        }

        /* Perks Card */
        .visit-perks-card {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 16px;
          padding: 24px;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.03);
        }
        .visit-perks-card h4 {
          font-size: 1.05rem;
          font-weight: 800;
          color: #0f172a;
          margin: 0 0 14px;
        }
        .perks-checklist {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .perks-checklist li {
          display: flex;
          gap: 10px;
          align-items: flex-start;
          font-size: 0.84rem;
          line-height: 1.45;
          color: #475569;
        }
        .perks-checklist li strong {
          color: #0f172a;
        }

        /* Enquiry Form Card */
        .enquiry-card-wrapper {
          background: #ffffff;
          border: 1.5px solid #e2e8f0;
          border-radius: 20px;
          padding: 36px 32px;
          box-shadow: 0 15px 35px -5px rgba(0, 0, 0, 0.06);
        }
        .enquiry-header {
          margin-bottom: 24px;
        }
        .enquiry-badge {
          display: inline-block;
          font-size: 0.72rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          color: #15803d;
          background: #dcfce7;
          padding: 3px 10px;
          border-radius: 4px;
          margin-bottom: 8px;
        }
        .enquiry-header h2 {
          font-size: 1.55rem;
          font-weight: 800;
          color: #0f172a;
          margin: 0 0 8px;
        }
        .enquiry-header p {
          font-size: 0.88rem;
          color: #64748b;
          line-height: 1.5;
          margin: 0;
        }
        .modern-enquiry-form {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        .form-fields-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 16px;
        }
        .input-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .input-group.full-span {
          grid-column: span 2;
        }
        .input-group label {
          font-size: 0.82rem;
          font-weight: 700;
          color: #334155;
        }
        .input-group .req {
          color: #dc2626;
        }
        .input-group input,
        .input-group select,
        .input-group textarea {
          width: 100%;
          padding: 10px 14px;
          border: 1.5px solid #cbd5e1;
          border-radius: 10px;
          font-size: 0.88rem;
          color: #0f172a;
          background: #f8fafc;
          transition: all 0.2s ease;
          font-family: inherit;
        }
        .input-group input:focus,
        .input-group select:focus,
        .input-group textarea:focus {
          outline: none;
          border-color: #b45309;
          background: #ffffff;
          box-shadow: 0 0 0 3px rgba(180, 83, 9, 0.12);
        }
        .input-group .readonly-input {
          background: #f1f5f9;
          color: #475569;
          cursor: not-allowed;
          font-weight: 600;
        }
        .star-rating-interactive {
          display: flex;
          align-items: center;
          gap: 6px;
          background: #f8fafc;
          border: 1.5px solid #cbd5e1;
          padding: 8px 14px;
          border-radius: 10px;
          flex-wrap: wrap;
        }
        .star-pick-btn {
          background: none;
          border: none;
          padding: 3px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.15s ease;
        }
        .star-pick-btn:hover {
          transform: scale(1.22);
        }
        .rating-badge-text {
          margin-left: 8px;
          font-size: 0.82rem;
          font-weight: 700;
          color: #b45309;
        }
        .btn-submit-enquiry {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          background: #9a3412;
          color: #ffffff;
          border: none;
          padding: 13px 24px;
          border-radius: 10px;
          font-size: 0.96rem;
          font-weight: 700;
          cursor: pointer;
          box-shadow: 0 4px 14px rgba(154, 52, 18, 0.3);
          transition: all 0.2s ease;
        }
        .btn-submit-enquiry:hover {
          background: #7c2d12;
          transform: translateY(-1px);
          box-shadow: 0 6px 18px rgba(154, 52, 18, 0.38);
        }
        .privacy-micro-note {
          font-size: 0.74rem;
          color: #94a3b8;
          text-align: center;
          margin: 0;
        }

        /* Success Card */
        .enquiry-success-box {
          text-align: center;
          padding: 20px 10px;
        }
        .success-icon-bubble {
          width: 72px;
          height: 72px;
          border-radius: 50%;
          background: #dcfce7;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 18px;
        }
        .enquiry-success-box h2 {
          font-size: 1.5rem;
          font-weight: 800;
          color: #0f172a;
          margin: 0 0 10px;
        }
        .success-message {
          font-size: 0.92rem;
          color: #475569;
          line-height: 1.5;
          margin: 0 0 24px;
        }
        .summary-card {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 16px;
          margin-bottom: 24px;
          text-align: left;
        }
        .summary-row {
          display: flex;
          justify-content: space-between;
          padding: 6px 0;
          font-size: 0.84rem;
          border-bottom: 1px solid #edf2f7;
        }
        .summary-row:last-child {
          border-bottom: none;
        }
        .summary-row span {
          color: #64748b;
        }
        .summary-row strong {
          color: #0f172a;
        }
        .success-actions {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .btn-wa-direct-handoff {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          background: #15803d;
          color: #ffffff;
          border: none;
          padding: 12px 20px;
          border-radius: 10px;
          font-size: 0.9rem;
          font-weight: 700;
          cursor: pointer;
          box-shadow: 0 4px 12px rgba(21, 128, 61, 0.25);
          transition: all 0.2s ease;
        }
        .btn-wa-direct-handoff:hover {
          background: #166534;
        }
        .btn-reset-form {
          background: #f1f5f9;
          color: #475569;
          border: 1px solid #cbd5e1;
          padding: 10px 18px;
          border-radius: 10px;
          font-size: 0.85rem;
          font-weight: 600;
          cursor: pointer;
        }
        .btn-reset-form:hover {
          background: #e2e8f0;
          color: #0f172a;
        }

        /* 4. Google Maps Section */
        .google-map-interactive-section {
          padding-top: 10px;
        }
        .map-card-container {
          background: #ffffff;
          border: 1.5px solid #e2e8f0;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
        }
        .map-card-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 24px 28px;
          background: #ffffff;
          border-bottom: 1px solid #f1f5f9;
        }
        .map-pill {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          font-size: 0.72rem;
          font-weight: 800;
          text-transform: uppercase;
          color: #b45309;
          background: #fef3c7;
          padding: 3px 8px;
          border-radius: 6px;
          margin-bottom: 6px;
        }
        .map-header-info h3 {
          font-size: 1.25rem;
          font-weight: 800;
          color: #0f172a;
          margin: 0 0 4px;
        }
        .map-header-info p {
          font-size: 0.86rem;
          color: #64748b;
          margin: 0;
        }
        .btn-get-directions {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: #9a3412;
          color: #ffffff;
          padding: 10px 18px;
          border-radius: 10px;
          font-size: 0.85rem;
          font-weight: 700;
          text-decoration: none;
          box-shadow: 0 4px 12px rgba(154, 52, 18, 0.2);
          transition: all 0.2s ease;
        }
        .btn-get-directions:hover {
          background: #7c2d12;
          transform: translateY(-1px);
        }
        .map-iframe-wrapper {
          line-height: 0;
          background: #f1f5f9;
        }

        /* Responsive Breakpoints */
        @media (max-width: 1024px) {
          .channels-cards-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          .contact-split-grid {
            grid-template-columns: 1fr;
          }
        }
        @media (max-width: 640px) {
          .channels-cards-grid {
            grid-template-columns: 1fr;
          }
          .form-fields-grid {
            grid-template-columns: 1fr;
          }
          .input-group.full-span {
            grid-column: span 1;
          }
          .showroom-meta-grid {
            grid-template-columns: 1fr;
          }
          .spotlight-actions {
            flex-direction: column;
          }
          .map-card-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 14px;
          }
          .btn-get-directions {
            width: 100%;
            justify-content: center;
          }
          .contact-hero-title {
            font-size: 1.95rem;
          }
        }
      `}</style>
    </div>
  );
}
