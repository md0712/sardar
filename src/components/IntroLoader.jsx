import React, { useState, useEffect } from 'react';
import { Sofa, Tv, Refrigerator, Tag, ShieldCheck, ArrowRight, Heart } from 'lucide-react';

export default function IntroLoader({ onComplete }) {
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('Loading Your Perfect Home...');
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    // Smooth progress bar animation over ~3.2 seconds
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        const next = prev + 2;
        if (next > 30 && next < 65) {
          setStatusText('Curating Furniture & Smart Living...');
        } else if (next >= 65 && next < 95) {
          setStatusText('Connecting Modern Appliances...');
        } else if (next >= 95) {
          setStatusText('Welcome to Sardar Mart Furniture and Home Appliances!');
        }
        return next;
      });
    }, 55);

    return () => clearInterval(interval);
  }, []);

  // When progress reaches 100%, trigger exit transition
  useEffect(() => {
    if (progress === 100) {
      const exitTimer = setTimeout(() => {
        handleComplete();
      }, 500);
      return () => clearTimeout(exitTimer);
    }
  }, [progress]);

  const handleComplete = () => {
    setIsExiting(true);
    setTimeout(() => {
      if (onComplete) onComplete();
    }, 600);
  };

  return (
    <div className={`sardar-intro-screen ${isExiting ? 'fade-out' : ''}`}>
      {/* Top Left & Right Decorative Organic Shapes */}
      <div className="corner-decor top-left">
        <svg viewBox="0 0 300 240" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M-40 -40 C60 20, 160 30, 220 -20 C280 -70, 310 -30, 310 -40 Z" fill="#f5ede3" opacity="0.8" />
          <path d="M-50 40 C40 100, 120 120, 180 80 C240 40, 260 0, 260 -40" stroke="#8d5b3d" strokeWidth="2.5" strokeDasharray="6 4" fill="none" opacity="0.4" />
          <path d="M-60 90 C30 160, 90 190, 150 160 C210 130, 230 70, 230 -10" fill="#ede0d1" opacity="0.5" />
        </svg>
      </div>

      <div className="corner-decor top-right">
        <svg viewBox="0 0 300 240" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M340 -40 C240 20, 140 30, 80 -20 C20 -70, -10 -30, -10 -40 Z" fill="#f5ede3" opacity="0.8" />
          <path d="M350 40 C260 100, 180 120, 120 80 C60 40, 40 0, 40 -40" stroke="#8d5b3d" strokeWidth="2.5" fill="none" opacity="0.5" />
          {/* Decorative Branch/Leaves Accent */}
          <g transform="translate(200, 20) rotate(-25) scale(0.65)" stroke="#6c3e23" strokeWidth="3" fill="none">
            <path d="M10 90 Q 40 40 80 10" />
            <path d="M30 65 Q 15 50 25 40 Q 40 50 30 65" fill="#8d5b3d" />
            <path d="M45 45 Q 65 30 60 20 Q 45 25 45 45" fill="#8d5b3d" />
            <path d="M65 25 Q 60 5 75 0 Q 80 15 65 25" fill="#8d5b3d" />
          </g>
        </svg>
      </div>

      {/* Skip Button (Top Right) */}
      <button 
        type="button" 
        className="intro-skip-pill" 
        onClick={handleComplete}
        aria-label="Skip to Home"
      >
        <span>Skip to Home</span>
        <ArrowRight size={13} />
      </button>

      {/* Main Container */}
      <div className="intro-stage-container">
        
        {/* Left Side: Living Room Furniture Scene */}
        <div className="stage-scene-side scene-left animate-slide-right">
          <div className="scene-composition furniture-comp">
            {/* Wooden slats background panel */}
            <div className="slat-wall-backdrop"></div>
            
            {/* Tall floor lamp */}
            <div className="floor-lamp-decor">
              <div className="lamp-shade"></div>
              <div className="lamp-pole"></div>
              <div className="lamp-legs"></div>
            </div>

            {/* Cozy Beige Living Room Sofa */}
            <div className="scene-image-card sofa-card">
              <img 
                src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=650&q=80" 
                alt="Sardar Mart Furniture and Home Appliances Living Room Furniture" 
                className="scene-photo"
              />
              <div className="card-ambient-shadow"></div>
            </div>

            {/* Coffee Table with plant */}
            <div className="coffee-table-decor">
              <div className="table-top"></div>
              <div className="table-legs"></div>
            </div>
          </div>
        </div>

        {/* Center: Brand Identity, Spinner, Progress & Categories */}
        <div className="stage-center-hub animate-fade-in">
          
          {/* Brand Logo Header */}
          <div className="brand-emblem-header">
            <div className="logo-icon-svg-wrap" style={{ background: 'transparent', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <img 
                src="/logo.png" 
                alt="Sardar Mart Furniture and Home Appliances" 
                style={{ width: '84px', height: '84px', objectFit: 'contain', borderRadius: '14px' }} 
              />
            </div>

            <h1 className="brand-logo-text" style={{ fontSize: '1.8rem', textAlign: 'center', fontWeight: 500 }}>
              <strong style={{ fontWeight: 800 }}>Sardar Mart</strong> Furniture and Home Appliances
            </h1>
            <span className="brand-logo-subtitle">PREMIUM FURNITURE &amp; HOME APPLIANCES</span>
            
            <div className="brand-tagline-row">
              <span>Better Home</span>
              <span className="tagline-divider">|</span>
              <span>Better Living</span>
            </div>
          </div>

          {/* Animated Circular Spinner with Center Sardar Logo */}
          <div className="center-spinner-wrapper">
            <div className="spinner-circular-track">
              {/* Spinning dual-tone arc */}
              <div 
                className="spinner-active-arc" 
                style={{ transform: `rotate(${progress * 3.6}deg)` }}
              >
                <div className="spinner-orbit-node"></div>
              </div>
            </div>

            <div className="spinner-emblem-core" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <img 
                src="/logo.png" 
                alt="Logo" 
                style={{ width: '42px', height: '42px', objectFit: 'contain', borderRadius: '8px' }} 
              />
            </div>
          </div>

          {/* Status Label & Loading Progress Bar */}
          <div className="progress-group-block">
            <h2 className="loading-status-heading">{statusText}</h2>

            <div className="progress-pill-track">
              <div 
                className="progress-pill-fill" 
                style={{ width: `${progress}%` }}
              ></div>
            </div>

            <span className="please-wait-caption">
              {progress < 100 ? 'Please wait...' : 'Opening Storefront...'}
            </span>
          </div>

          {/* Bottom 5 Features & Category Badges with Dividers */}
          <div className="bottom-categories-row">
            <div className="category-item-col">
              <div className="category-icon-wrap">
                <Sofa size={20} />
              </div>
              <span>Furniture</span>
            </div>

            <div className="category-item-divider"></div>

            <div className="category-item-col">
              <div className="category-icon-wrap">
                <Tv size={20} />
              </div>
              <span>Electronics</span>
            </div>

            <div className="category-item-divider"></div>

            <div className="category-item-col">
              <div className="category-icon-wrap">
                <Refrigerator size={20} />
              </div>
              <span>Home Appliances</span>
            </div>

            <div className="category-item-divider"></div>

            <div className="category-item-col">
              <div className="category-icon-wrap">
                <Tag size={20} />
              </div>
              <span>Offers</span>
            </div>

            <div className="category-item-divider"></div>

            <div className="category-item-col">
              <div className="category-icon-wrap">
                <ShieldCheck size={20} />
              </div>
              <span>Quality Products</span>
            </div>
          </div>

          {/* Delicate Ornamental Line with Centered Heart */}
          <div className="ornamental-bottom-line">
            <span className="line-segment"></span>
            <span className="heart-ornament">
              <Heart size={10} fill="#8d5b3d" color="#8d5b3d" />
            </span>
            <span className="line-segment"></span>
          </div>

        </div>

        {/* Right Side: Smart Electronics & Appliances Scene */}
        <div className="stage-scene-side scene-right animate-slide-left">
          <div className="scene-composition electronics-comp">
            {/* Refrigerator */}
            <div className="appliance-hero-stack">
              <img 
                src="https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?auto=format&fit=crop&w=650&q=80" 
                alt="Smart Inverter Refrigerator" 
                className="appliance-photo fridge-photo"
              />
              <div className="front-electronics-row">
                <img 
                  src="https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&w=450&q=80" 
                  alt="4K OLED TV" 
                  className="tv-photo"
                />
                <img 
                  src="https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?auto=format&fit=crop&w=350&q=80" 
                  alt="AI Steam Washing Machine" 
                  className="washer-photo"
                />
              </div>
            </div>
          </div>
        </div>

      </div>

      <style>{`
        /* Whole Screen Clean Beige & White Aesthetics matching user reference image */
        .sardar-intro-screen {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: #ffffff;
          z-index: 999999;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
          transition: opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1), transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .sardar-intro-screen.fade-out {
          opacity: 0;
          transform: scale(1.02);
          pointer-events: none;
        }

        /* Decorative Corner Waves */
        .corner-decor {
          position: absolute;
          width: 320px;
          height: 240px;
          pointer-events: none;
          z-index: 1;
        }
        .corner-decor.top-left {
          top: 0;
          left: 0;
        }
        .corner-decor.top-right {
          top: 0;
          right: 0;
        }

        /* Skip Pill Button */
        .intro-skip-pill {
          position: absolute;
          top: 24px;
          right: 28px;
          background: #fdfaf7;
          border: 1px solid #ebdccf;
          color: #8d5b3d;
          padding: 7px 16px;
          border-radius: 20px;
          font-size: 0.82rem;
          font-weight: 700;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 6px;
          box-shadow: 0 2px 8px rgba(141, 91, 61, 0.08);
          transition: all 0.2s ease;
          z-index: 10;
        }
        .intro-skip-pill:hover {
          background: #8d5b3d;
          color: #ffffff;
          border-color: #8d5b3d;
          transform: translateX(2px);
        }

        /* 3-Column Stage Container */
        .intro-stage-container {
          position: relative;
          z-index: 2;
          width: 100%;
          max-width: 1380px;
          height: 100%;
          max-height: 820px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 20px 40px;
        }

        /* Side Scenes */
        .stage-scene-side {
          flex: 1;
          max-width: 380px;
          height: 520px;
          display: flex;
          align-items: center;
          position: relative;
        }
        .scene-left {
          justify-content: flex-start;
        }
        .scene-right {
          justify-content: flex-end;
        }

        /* Left Furniture Scene (Sofa, Lamp, Table, Slats) */
        .furniture-comp {
          position: relative;
          width: 100%;
          height: 100%;
          display: flex;
          align-items: flex-end;
        }
        .slat-wall-backdrop {
          position: absolute;
          top: 40px;
          left: 0;
          width: 60px;
          height: 380px;
          background: repeating-linear-gradient(
            90deg,
            #8d5b3d 0px,
            #8d5b3d 8px,
            transparent 8px,
            transparent 16px
          );
          opacity: 0.85;
          border-radius: 4px;
        }
        .floor-lamp-decor {
          position: absolute;
          left: 45px;
          bottom: 120px;
          display: flex;
          flex-direction: column;
          align-items: center;
          z-index: 2;
        }
        .lamp-shade {
          width: 48px;
          height: 40px;
          background: #fdfaf7;
          border: 1px solid #ebdccf;
          border-radius: 6px 6px 16px 16px;
          box-shadow: 0 4px 15px rgba(245, 158, 11, 0.25);
        }
        .lamp-pole {
          width: 3px;
          height: 110px;
          background: #8d5b3d;
        }
        .lamp-legs {
          width: 40px;
          height: 50px;
          border-left: 2px solid #8d5b3d;
          border-right: 2px solid #8d5b3d;
          transform: perspective(40px) rotateX(20deg);
        }

        .sofa-card {
          position: relative;
          z-index: 3;
          width: 320px;
          height: 220px;
          border-radius: 14px;
          overflow: hidden;
          box-shadow: 0 15px 35px rgba(61, 35, 20, 0.12);
          border: 1px solid #f2e9e1;
          background: #ffffff;
        }
        .scene-photo {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        /* Right Electronics Scene (Fridge, TV, Washer) */
        .electronics-comp {
          position: relative;
          width: 100%;
          height: 100%;
          display: flex;
          align-items: flex-end;
          justify-content: flex-end;
        }
        .appliance-hero-stack {
          position: relative;
          display: flex;
          align-items: flex-end;
          gap: 12px;
        }
        .fridge-photo {
          width: 160px;
          height: 380px;
          object-fit: cover;
          border-radius: 12px;
          box-shadow: 0 16px 36px rgba(0, 0, 0, 0.12);
          border: 1px solid #e5e7eb;
        }
        .front-electronics-row {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .tv-photo {
          width: 170px;
          height: 110px;
          object-fit: cover;
          border-radius: 8px;
          border: 2px solid #1e293b;
          box-shadow: 0 12px 25px rgba(0, 0, 0, 0.18);
        }
        .washer-photo {
          width: 140px;
          height: 140px;
          object-fit: cover;
          border-radius: 10px;
          box-shadow: 0 12px 25px rgba(0, 0, 0, 0.12);
          border: 1px solid #e2e8f0;
        }

        /* Center Hub */
        .stage-center-hub {
          flex: 1.3;
          max-width: 580px;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          padding: 0 16px;
        }

        /* Brand Emblem Header */
        .brand-emblem-header {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-bottom: 28px;
        }
        .logo-icon-svg-wrap {
          margin-bottom: 8px;
          filter: drop-shadow(0 2px 4px rgba(61, 35, 20, 0.1));
        }
        .brand-logo-text {
          font-size: 2.3rem;
          font-weight: 800;
          color: #3d2314;
          margin: 0;
          line-height: 1;
          letter-spacing: -0.5px;
        }
        .brand-logo-subtitle {
          font-size: 0.72rem;
          font-weight: 700;
          letter-spacing: 2.5px;
          color: #3d2314;
          margin-top: 4px;
        }
        .brand-tagline-row {
          display: flex;
          align-items: center;
          gap: 14px;
          margin-top: 14px;
          font-size: 0.95rem;
          color: #8d5b3d;
          font-weight: 600;
          letter-spacing: 0.6px;
        }
        .tagline-divider {
          color: #cbd5e1;
        }

        /* Center Circular Spinner */
        .center-spinner-wrapper {
          position: relative;
          width: 140px;
          height: 140px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 22px;
        }
        .spinner-circular-track {
          position: absolute;
          inset: 0;
          border-radius: 50%;
          border: 5px solid #ebdccf;
        }
        .spinner-active-arc {
          position: absolute;
          inset: -5px;
          border-radius: 50%;
          border: 5px solid transparent;
          border-top-color: #8d5b3d;
          border-right-color: #8d5b3d;
          transition: transform 0.1s linear;
        }
        .spinner-orbit-node {
          position: absolute;
          top: 6px;
          right: 18px;
          width: 10px;
          height: 10px;
          background: #8d5b3d;
          border-radius: 50%;
          box-shadow: 0 0 6px rgba(141, 91, 61, 0.6);
        }
        .spinner-emblem-core {
          width: 108px;
          height: 108px;
          border-radius: 50%;
          background: #fdfaf7;
          border: 1px solid #ebdccf;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 14px rgba(141, 91, 61, 0.08);
        }

        /* Status & Progress Bar */
        .progress-group-block {
          width: 100%;
          max-width: 440px;
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-bottom: 28px;
        }
        .loading-status-heading {
          font-size: 1.15rem;
          font-weight: 700;
          color: #3d2314;
          margin: 0 0 12px;
          letter-spacing: 0.2px;
        }
        .progress-pill-track {
          width: 100%;
          height: 11px;
          background: #ebdccf;
          border-radius: 30px;
          overflow: hidden;
          padding: 2px;
          box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.06);
        }
        .progress-pill-fill {
          height: 100%;
          background: #8d5b3d;
          border-radius: 30px;
          transition: width 0.1s linear;
        }
        .please-wait-caption {
          font-size: 0.82rem;
          color: #8d5b3d;
          font-weight: 500;
          margin-top: 8px;
        }

        /* Bottom 5 Categories Row */
        .bottom-categories-row {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 16px;
          width: 100%;
          max-width: 540px;
          margin-bottom: 16px;
        }
        .category-item-col {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
          color: #3d2314;
          font-size: 0.74rem;
          font-weight: 600;
          text-align: center;
          flex: 1;
        }
        .category-icon-wrap {
          color: #3d2314;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.2s ease;
        }
        .category-item-col:hover .category-icon-wrap {
          transform: translateY(-2px);
          color: #8d5b3d;
        }
        .category-item-divider {
          width: 1px;
          height: 32px;
          background: #e5d8cb;
        }

        /* Ornamental Line with Heart */
        .ornamental-bottom-line {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          width: 160px;
        }
        .line-segment {
          flex: 1;
          height: 1px;
          background: #8d5b3d;
          opacity: 0.45;
        }
        .heart-ornament {
          display: flex;
          align-items: center;
          justify-content: center;
        }

        /* Keyframe Animations */
        .animate-fade-in {
          animation: introFadeIn 0.8s ease forwards;
        }
        .animate-slide-right {
          animation: introSlideRight 0.9s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .animate-slide-left {
          animation: introSlideLeft 0.9s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        @keyframes introFadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes introSlideRight {
          from { opacity: 0; transform: translateX(-30px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes introSlideLeft {
          from { opacity: 0; transform: translateX(30px); }
          to { opacity: 1; transform: translateX(0); }
        }

        /* Responsive Breakpoints */
        @media (max-width: 1024px) {
          .stage-scene-side {
            display: none;
          }
          .stage-center-hub {
            max-width: 520px;
          }
          .intro-stage-container {
            justify-content: center;
            padding: 20px 24px;
          }
        }

        @media (max-width: 640px) {
          .sardar-intro-screen {
            padding: 16px 12px;
          }
          .corner-decor {
            width: 160px;
            height: 120px;
            opacity: 0.55;
          }
          .intro-skip-pill {
            top: 14px;
            right: 14px;
            padding: 5px 12px;
            font-size: 0.74rem;
          }
          .intro-stage-container {
            padding: 8px 0;
            max-height: 100%;
          }
          .stage-center-hub {
            max-width: 100%;
            padding: 0 4px;
          }
          .brand-emblem-header {
            margin-bottom: 14px;
          }
          .logo-icon-svg-wrap {
            margin-bottom: 4px;
          }
          .logo-icon-svg-wrap svg {
            width: 52px;
            height: 46px;
          }
          .brand-logo-text {
            font-size: 1.85rem;
          }
          .brand-logo-subtitle {
            font-size: 0.64rem;
            letter-spacing: 2px;
          }
          .brand-tagline-row {
            font-size: 0.84rem;
            gap: 10px;
            margin-top: 8px;
          }

          .center-spinner-wrapper {
            width: 105px;
            height: 105px;
            margin-bottom: 16px;
          }
          .spinner-emblem-core {
            width: 80px;
            height: 80px;
          }
          .spinner-emblem-core svg {
            width: 36px;
            height: 32px;
          }

          .progress-group-block {
            max-width: 320px;
            margin-bottom: 18px;
          }
          .loading-status-heading {
            font-size: 0.98rem;
            margin-bottom: 8px;
          }
          .progress-pill-track {
            height: 8px;
          }
          .please-wait-caption {
            font-size: 0.74rem;
            margin-top: 6px;
          }

          .bottom-categories-row {
            gap: 6px;
            max-width: 100%;
            margin-bottom: 12px;
          }
          .category-item-col {
            gap: 4px;
          }
          .category-icon-wrap svg {
            width: 17px;
            height: 17px;
          }
          .category-item-col span {
            font-size: 0.64rem;
          }
          .category-item-divider {
            height: 22px;
          }
          .ornamental-bottom-line {
            width: 120px;
          }
        }

        @media (max-width: 420px) {
          .brand-logo-text {
            font-size: 1.65rem;
          }
          .brand-tagline-row {
            font-size: 0.76rem;
            gap: 8px;
          }
          .center-spinner-wrapper {
            width: 92px;
            height: 92px;
            margin-bottom: 12px;
          }
          .spinner-emblem-core {
            width: 70px;
            height: 70px;
          }
          .spinner-emblem-core svg {
            width: 30px;
            height: 26px;
          }
          .loading-status-heading {
            font-size: 0.9rem;
          }
          .bottom-categories-row {
            gap: 3px;
          }
          .category-item-col span {
            font-size: 0.58rem;
          }
          .category-icon-wrap svg {
            width: 15px;
            height: 15px;
          }
          .category-item-divider {
            height: 18px;
          }
        }

        @media (max-width: 360px) {
          .intro-skip-pill {
            top: 10px;
            right: 10px;
            padding: 4px 10px;
            font-size: 0.68rem;
          }
          .brand-logo-text {
            font-size: 1.45rem;
          }
          .brand-tagline-row {
            font-size: 0.7rem;
            gap: 6px;
          }
          .center-spinner-wrapper {
            width: 80px;
            height: 80px;
            margin-bottom: 10px;
          }
          .spinner-emblem-core {
            width: 60px;
            height: 60px;
          }
          .spinner-emblem-core svg {
            width: 26px;
            height: 22px;
          }
          .bottom-categories-row {
            gap: 2px;
          }
          .category-item-col span {
            font-size: 0.52rem;
          }
          .category-icon-wrap svg {
            width: 13px;
            height: 13px;
          }
          .category-item-divider {
            height: 14px;
          }
        }

        @media (max-height: 700px) {
          .brand-emblem-header {
            margin-bottom: 8px;
          }
          .brand-tagline-row {
            margin-top: 4px;
          }
          .center-spinner-wrapper {
            width: 86px;
            height: 86px;
            margin-bottom: 10px;
          }
          .spinner-emblem-core {
            width: 66px;
            height: 66px;
          }
          .progress-group-block {
            margin-bottom: 12px;
          }
          .bottom-categories-row {
            margin-bottom: 8px;
          }
        }
      `}</style>
    </div>
  );
}
