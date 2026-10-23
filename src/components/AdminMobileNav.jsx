import React from 'react';
import { LayoutGrid, FileText, Package, Users } from 'lucide-react';

/**
 * Custom SVG Receipt Icon with Indian Rupee (₹) symbol
 * Matches the exact "Billing" icon design in the reference UI
 */
export function BillingReceiptIcon({ size = 22, color = 'currentColor', className = '' }) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke={color} 
      strokeWidth="1.8" 
      strokeLinecap="round" 
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {/* Torn / Serrated Edge Receipt Body */}
      <path d="M4.5 20.5V4.2l2.25 1.4 2.25-1.4 2.25 1.4 2.25-1.4 2.25 1.4 2.25-1.4 1.5 1V20.5l-1.5-1-2.25 1.4-2.25-1.4-2.25 1.4-2.25-1.4-2.25 1.4z" />
      {/* Indian Rupee (₹) inside receipt */}
      <path d="M8.5 7.8h7" />
      <path d="M8.5 10.6h5.8" />
      <path d="M9 7.8h2.8a2 2 0 0 1 0 4H9" />
      <path d="M11 11.8l3.6 5" />
    </svg>
  );
}

/**
 * AdminMobileNav
 * Modern mobile bottom navigation bar for Admin Panel
 * Layout: Dashboard | Invoices (with badge) | Billing | Products (with orange dot) | Customers (with purple dot) | Settings
 */
export default function AdminMobileNav({
  activeTab = 'dashboard',
  onTabChange,
  invoiceCount = 5,
  showProductDot = true,
  showCustomerDot = true
}) {
  const isTabActive = (itemKey) => {
    if (itemKey === 'invoices') {
      return activeTab === 'orders' || activeTab === 'invoices';
    }
    return activeTab === itemKey;
  };

  const handleSelect = (itemKey) => {
    if (!onTabChange) return;
    if (itemKey === 'invoices') {
      onTabChange('orders');
    } else {
      onTabChange(itemKey);
    }
    // Smooth scroll to top of viewport on tab switch
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <nav className="admin-mobile-nav" aria-label="Admin Mobile Navigation">
      {/* 1. Dashboard */}
      <button
        type="button"
        className={`admin-mob-item ${isTabActive('dashboard') ? 'active' : ''}`}
        onClick={() => handleSelect('dashboard')}
        aria-label="Dashboard"
      >
        <div className="admin-mob-icon-wrap">
          <LayoutGrid size={22} strokeWidth={1.8} />
        </div>
        <span className="admin-mob-label">Dashboard</span>
      </button>

      {/* 2. Invoices (with count badge) */}
      <button
        type="button"
        className={`admin-mob-item ${isTabActive('invoices') ? 'active' : ''}`}
        onClick={() => handleSelect('invoices')}
        aria-label="Invoices"
      >
        <div className="admin-mob-icon-wrap">
          <FileText size={22} strokeWidth={1.8} />
          {invoiceCount !== null && invoiceCount !== undefined && (
            <span className="admin-mob-badge orange-badge">
              {invoiceCount}
            </span>
          )}
        </div>
        <span className="admin-mob-label">Invoices</span>
      </button>

      {/* 3. Billing (Showroom POS & Invoicing) */}
      <button
        type="button"
        className={`admin-mob-item ${isTabActive('billing') ? 'active' : ''}`}
        onClick={() => handleSelect('billing')}
        aria-label="Billing"
      >
        <div className="admin-mob-icon-wrap">
          <BillingReceiptIcon size={22} />
        </div>
        <span className="admin-mob-label">Billing</span>
      </button>

      {/* 4. Products (with orange dot) */}
      <button
        type="button"
        className={`admin-mob-item ${isTabActive('products') ? 'active' : ''}`}
        onClick={() => handleSelect('products')}
        aria-label="Products"
      >
        <div className="admin-mob-icon-wrap">
          <Package size={22} strokeWidth={1.8} />
          {showProductDot && (
            <span className="admin-mob-dot orange-dot" aria-hidden="true" />
          )}
        </div>
        <span className="admin-mob-label">Products</span>
      </button>

      {/* 5. Customers (with purple dot) */}
      <button
        type="button"
        className={`admin-mob-item ${isTabActive('customers') ? 'active' : ''}`}
        onClick={() => handleSelect('customers')}
        aria-label="Customers"
      >
        <div className="admin-mob-icon-wrap">
          <Users size={22} strokeWidth={1.8} />
          {showCustomerDot && (
            <span className="admin-mob-dot purple-dot" aria-hidden="true" />
          )}
        </div>
        <span className="admin-mob-label">Customers</span>
      </button>

      <style>{`
        /* Mobile Bottom Navigation Bar */
        .admin-mobile-nav {
          display: none;
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          width: 100%;
          max-width: 100vw;
          box-sizing: border-box;
          background: #ffffff;
          border-top: 1px solid #e2e8f0;
          border-top-left-radius: 18px;
          border-top-right-radius: 18px;
          box-shadow: 0 -4px 20px rgba(15, 23, 42, 0.08);
          z-index: 998;
          padding: 8px 6px calc(8px + env(safe-area-inset-bottom, 0px));
          justify-content: space-around;
          align-items: center;
          user-select: none;
          -webkit-user-select: none;
          touch-action: none;
          -webkit-tap-highlight-color: transparent;
        }

        /* Show on mobile viewports */
        @media (max-width: 900px) {
          .admin-mobile-nav {
            display: flex;
          }
        }

        .admin-mob-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 3px;
          background: transparent;
          border: none;
          outline: none;
          padding: 4px 6px;
          cursor: pointer;
          color: #506176;
          flex: 1;
          max-width: 72px;
          position: relative;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .admin-mob-item:hover {
          color: #1e293b;
        }

        .admin-mob-item.active {
          color: #b45309;
        }

        .admin-mob-item.active .admin-mob-label {
          font-weight: 700;
          color: #b45309;
        }

        .admin-mob-icon-wrap {
          position: relative;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 28px;
          height: 28px;
          transition: transform 0.2s ease;
        }

        .admin-mob-item:active .admin-mob-icon-wrap {
          transform: scale(0.92);
        }

        .admin-mob-label {
          font-size: 0.70rem;
          font-weight: 500;
          line-height: 1.1;
          color: #506176;
          letter-spacing: -0.1px;
          white-space: nowrap;
          transition: color 0.2s ease, font-weight 0.2s ease;
        }

        /* Orange Count Badge (Matching 'Invoices' 5 badge) */
        .admin-mob-badge.orange-badge {
          position: absolute;
          top: -4px;
          right: -8px;
          background: #ea580c;
          background: linear-gradient(135deg, #f59e0b 0%, #ea580c 100%);
          color: #ffffff;
          font-size: 0.62rem;
          font-weight: 800;
          min-width: 17px;
          height: 17px;
          padding: 0 4px;
          border-radius: 9999px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 2px solid #ffffff;
          box-shadow: 0 1px 4px rgba(234, 88, 12, 0.45);
          line-height: 1;
        }

        /* Indicator Dots */
        .admin-mob-dot {
          position: absolute;
          width: 7px;
          height: 7px;
          border-radius: 50%;
          border: 1.5px solid #ffffff;
        }

        /* Orange dot on Products */
        .admin-mob-dot.orange-dot {
          top: -2px;
          right: -3px;
          background: #ea580c;
          box-shadow: 0 1px 3px rgba(234, 88, 12, 0.4);
        }

        /* Purple dot on Customers */
        .admin-mob-dot.purple-dot {
          top: -2px;
          right: -3px;
          background: #8b5cf6;
          box-shadow: 0 1px 3px rgba(139, 92, 246, 0.4);
        }
      `}</style>
    </nav>
  );
}
