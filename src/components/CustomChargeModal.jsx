import React, { useState, useEffect, useRef } from 'react';
import { 
  X, Plus, Minus, IndianRupee, Wrench, Truck, 
  Sparkles, Check, AlertCircle, Layers, Tag, ShieldCheck 
} from 'lucide-react';

const PRESET_CHARGES = [
  { name: 'Custom Woodwork & Assembly', price: 1500, category: 'Carpentry', icon: '🪚' },
  { name: 'Wall Mounting & Installation', price: 850, category: 'Installation', icon: '🪛' },
  { name: 'Express Safe Transit & Delivery', price: 750, category: 'Logistics', icon: '🚚' },
  { name: 'Furniture Polishing & Buffing', price: 1200, category: 'Finishing', icon: '✨' },
  { name: 'Custom Fabric & Cushioning', price: 2200, category: 'Upholstery', icon: '🛋️' },
  { name: 'Appliance Setup & Testing', price: 500, category: 'Setup', icon: '🔌' },
  { name: 'Careful Unboxing & Disposal', price: 350, category: 'Handling', icon: '📦' }
];

export default function CustomChargeModal({
  isOpen,
  onClose,
  onAddCharge
}) {
  const [chargeName, setChargeName] = useState('');
  const [chargePrice, setChargePrice] = useState('');
  const [chargeQuantity, setChargeQuantity] = useState(1);
  const [chargeCategory, setChargeCategory] = useState('Carpentry');
  const [chargeNotes, setChargeNotes] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const nameInputRef = useRef(null);

  // Reset and focus when modal opens
  useEffect(() => {
    if (isOpen) {
      setChargeName('Custom Woodwork & Assembly');
      setChargePrice('1500');
      setChargeQuantity(1);
      setChargeCategory('Carpentry');
      setChargeNotes('');
      setErrorMessage('');
      setTimeout(() => {
        if (nameInputRef.current) {
          nameInputRef.current.focus();
          nameInputRef.current.select();
        }
      }, 100);
    }
  }, [isOpen]);

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSelectPreset = (preset) => {
    setChargeName(preset.name);
    setChargePrice(String(preset.price));
    setChargeCategory(preset.category);
    setErrorMessage('');
  };

  const handleIncrementQty = () => {
    setChargeQuantity((prev) => prev + 1);
  };

  const handleDecrementQty = () => {
    setChargeQuantity((prev) => Math.max(1, prev - 1));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmedName = chargeName.trim();
    if (!trimmedName) {
      setErrorMessage('Please enter a charge or service name.');
      return;
    }

    const parsedPrice = parseFloat(chargePrice);
    if (isNaN(parsedPrice) || parsedPrice < 0) {
      setErrorMessage('Please enter a valid price (₹0 or greater).');
      return;
    }

    const qty = Math.max(1, parseInt(chargeQuantity, 10) || 1);

    const customLineItem = {
      id: `custom-${Date.now()}`,
      name: trimmedName,
      title: trimmedName,
      price: parsedPrice,
      sellingPrice: parsedPrice,
      quantity: qty,
      category: (chargeCategory || 'Services').toLowerCase(),
      categoryName: chargeCategory,
      notes: chargeNotes.trim() || undefined,
      isCustomCharge: true,
      image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=300&q=80'
    };

    onAddCharge(customLineItem);
    onClose();
  };

  const numPrice = Math.max(0, parseFloat(chargePrice) || 0);
  const totalAmount = numPrice * Math.max(1, chargeQuantity);

  const formatPrice = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val || 0);
  };

  return (
    <div 
      className="custom-charge-modal-backdrop"
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.65)',
        backdropFilter: 'blur(4px)',
        zIndex: 99999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        animation: 'customChargeFadeIn 0.2s ease-out'
      }}
    >
      <div 
        className="custom-charge-modal-card"
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '18px',
          width: '100%',
          maxWidth: '560px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.35)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          maxHeight: '92vh',
          animation: 'customChargeSlideUp 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
      >
        {/* Header */}
        <div style={{
          padding: '18px 24px',
          background: 'linear-gradient(135deg, #2a1810 0%, #4a2818 100%)',
          color: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #d97706 0%, #b45309 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              boxShadow: '0 4px 10px rgba(180, 83, 9, 0.35)'
            }}>
              <Wrench size={20} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800, color: '#ffffff' }}>
                Add Custom Charge
              </h3>
              <p style={{ margin: '2px 0 0', fontSize: '0.78rem', color: '#fed7aa' }}>
                Add woodwork, service fees, or custom charges directly to this bill
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close custom charge modal"
            style={{
              background: 'rgba(255, 255, 255, 0.12)',
              border: 'none',
              borderRadius: '8px',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              cursor: 'pointer',
              transition: 'background 0.15s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.8)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.12)'}
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div style={{ padding: '20px 24px', overflowY: 'auto', flex: 1 }}>
          {/* Quick Presets */}
          <div style={{ marginBottom: '18px' }}>
            <label style={{ 
              display: 'block', 
              fontSize: '0.75rem', 
              fontWeight: 800, 
              color: '#64748b', 
              textTransform: 'uppercase', 
              letterSpacing: '0.04em',
              marginBottom: '8px' 
            }}>
              Quick Presets (Click to Auto-fill)
            </label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '7px' }}>
              {PRESET_CHARGES.map((preset, idx) => {
                const isSelected = chargeName === preset.name;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectPreset(preset)}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px',
                      padding: '5px 11px',
                      borderRadius: '8px',
                      fontSize: '0.78rem',
                      fontWeight: 600,
                      border: isSelected ? '1.5px solid #b45309' : '1px solid #e2e8f0',
                      background: isSelected ? '#fffbeb' : '#f8fafc',
                      color: isSelected ? '#b45309' : '#334155',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <span>{preset.icon}</span>
                    <span>{preset.name}</span>
                    <span style={{ 
                      fontSize: '0.7rem', 
                      fontWeight: 700, 
                      color: isSelected ? '#92400e' : '#64748b',
                      marginLeft: '2px' 
                    }}>
                      ₹{preset.price}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <form id="custom-charge-form" onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {/* Error Message */}
            {errorMessage && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '9px 12px',
                background: '#fef2f2',
                border: '1px solid #fecaca',
                borderRadius: '8px',
                color: '#b91c1c',
                fontSize: '0.82rem',
                fontWeight: 600
              }}>
                <AlertCircle size={15} style={{ flexShrink: 0 }} />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Item Name */}
            <div>
              <label style={{ 
                display: 'block', 
                fontSize: '0.82rem', 
                fontWeight: 700, 
                color: '#1e293b', 
                marginBottom: '6px' 
              }}>
                Custom Item / Service Name <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <input
                ref={nameInputRef}
                type="text"
                value={chargeName}
                onChange={(e) => {
                  setChargeName(e.target.value);
                  setErrorMessage('');
                }}
                placeholder="e.g. Custom Carpentry, Fabric Buffing, Unboxing"
                required
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: '10px',
                  border: '1.5px solid #cbd5e1',
                  fontSize: '0.92rem',
                  color: '#0f172a',
                  boxSizing: 'border-box',
                  outline: 'none',
                  transition: 'border-color 0.2s ease'
                }}
                onFocus={(e) => e.target.style.borderColor = '#b45309'}
                onBlur={(e) => e.target.style.borderColor = '#cbd5e1'}
              />
            </div>

            {/* Price & Quantity in 2 Columns */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: '12px' }}>
              {/* Unit Price */}
              <div>
                <label style={{ 
                  display: 'block', 
                  fontSize: '0.82rem', 
                  fontWeight: 700, 
                  color: '#1e293b', 
                  marginBottom: '6px' 
                }}>
                  Unit Price (₹) <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <div style={{ position: 'relative' }}>
                  <span style={{
                    position: 'absolute',
                    left: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#64748b',
                    fontSize: '0.9rem',
                    fontWeight: 700
                  }}>
                    ₹
                  </span>
                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={chargePrice}
                    onChange={(e) => {
                      setChargePrice(e.target.value);
                      setErrorMessage('');
                    }}
                    placeholder="1500"
                    required
                    style={{
                      width: '100%',
                      padding: '10px 12px 10px 28px',
                      borderRadius: '10px',
                      border: '1.5px solid #cbd5e1',
                      fontSize: '0.92rem',
                      fontWeight: 700,
                      color: '#0f172a',
                      boxSizing: 'border-box',
                      outline: 'none',
                      transition: 'border-color 0.2s ease'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#b45309'}
                    onBlur={(e) => e.target.style.borderColor = '#cbd5e1'}
                  />
                </div>
              </div>

              {/* Quantity Stepper */}
              <div>
                <label style={{ 
                  display: 'block', 
                  fontSize: '0.82rem', 
                  fontWeight: 700, 
                  color: '#1e293b', 
                  marginBottom: '6px' 
                }}>
                  Quantity
                </label>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  border: '1.5px solid #cbd5e1',
                  borderRadius: '10px',
                  overflow: 'hidden',
                  background: '#ffffff'
                }}>
                  <button
                    type="button"
                    onClick={handleDecrementQty}
                    aria-label="Decrease quantity"
                    style={{
                      border: 'none',
                      background: '#f8fafc',
                      width: '36px',
                      height: '40px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      color: '#334155'
                    }}
                  >
                    <Minus size={14} />
                  </button>
                  <input
                    type="number"
                    min="1"
                    value={chargeQuantity}
                    onChange={(e) => setChargeQuantity(Math.max(1, parseInt(e.target.value, 10) || 1))}
                    style={{
                      width: '100%',
                      flex: 1,
                      border: 'none',
                      textAlign: 'center',
                      fontSize: '0.92rem',
                      fontWeight: 800,
                      color: '#0f172a',
                      outline: 'none',
                      padding: 0
                    }}
                  />
                  <button
                    type="button"
                    onClick={handleIncrementQty}
                    aria-label="Increase quantity"
                    style={{
                      border: 'none',
                      background: '#f8fafc',
                      width: '36px',
                      height: '40px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      color: '#334155'
                    }}
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>
            </div>

            {/* Category / Department Tag */}
            <div>
              <label style={{ 
                display: 'block', 
                fontSize: '0.82rem', 
                fontWeight: 700, 
                color: '#1e293b', 
                marginBottom: '6px' 
              }}>
                Service Category / Department
              </label>
              <select
                value={chargeCategory}
                onChange={(e) => setChargeCategory(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: '10px',
                  border: '1.5px solid #cbd5e1',
                  fontSize: '0.88rem',
                  color: '#0f172a',
                  backgroundColor: '#ffffff',
                  boxSizing: 'border-box',
                  outline: 'none',
                  cursor: 'pointer'
                }}
              >
                <option value="Carpentry">🪚 Carpentry &amp; Woodwork</option>
                <option value="Installation">🪛 Installation &amp; Wall Mounting</option>
                <option value="Logistics">🚚 Logistics &amp; Safe Transit</option>
                <option value="Finishing">✨ Finishing &amp; Polishing</option>
                <option value="Upholstery">🛋️ Upholstery &amp; Cushions</option>
                <option value="Setup">🔌 Appliance Testing &amp; Setup</option>
                <option value="Custom">⚙️ General Custom Service</option>
              </select>
            </div>

            {/* Optional Description / Invoice Notes */}
            <div>
              <label style={{ 
                display: 'block', 
                fontSize: '0.82rem', 
                fontWeight: 700, 
                color: '#1e293b', 
                marginBottom: '6px' 
              }}>
                Notes / Scope Description <span style={{ fontWeight: 400, color: '#94a3b8' }}>(Optional)</span>
              </label>
              <input
                type="text"
                value={chargeNotes}
                onChange={(e) => setChargeNotes(e.target.value)}
                placeholder="e.g. 2nd floor delivery with unboxing and hardware fitting"
                style={{
                  width: '100%',
                  padding: '9px 12px',
                  borderRadius: '10px',
                  border: '1.5px solid #cbd5e1',
                  fontSize: '0.84rem',
                  color: '#334155',
                  boxSizing: 'border-box',
                  outline: 'none'
                }}
              />
            </div>
          </form>

          {/* Live Total Calculation Card */}
          <div style={{
            marginTop: '16px',
            padding: '14px 16px',
            background: 'linear-gradient(135deg, #fef3c7 0%, #ffedd5 100%)',
            borderRadius: '12px',
            border: '1px solid #fde68a',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div>
              <span style={{ fontSize: '0.74rem', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 800, color: '#92400e' }}>
                Total Charge to Bill
              </span>
              <div style={{ fontSize: '0.8rem', color: '#b45309', marginTop: '2px' }}>
                {chargeQuantity} × {formatPrice(numPrice)}
              </div>
            </div>
            <div style={{ fontSize: '1.35rem', fontWeight: 900, color: '#8c3b10' }}>
              {formatPrice(totalAmount)}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div style={{
          padding: '14px 24px',
          background: '#f8fafc',
          borderTop: '1px solid #e2e8f0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          gap: '10px'
        }}>
          <button
            type="button"
            onClick={onClose}
            style={{
              padding: '10px 18px',
              borderRadius: '10px',
              border: '1px solid #cbd5e1',
              background: '#ffffff',
              color: '#475569',
              fontSize: '0.88rem',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
          >
            Cancel
          </button>
          <button
            type="submit"
            form="custom-charge-form"
            style={{
              padding: '10px 22px',
              borderRadius: '10px',
              border: 'none',
              background: 'linear-gradient(135deg, #8c3b10 0%, #b45309 100%)',
              color: '#ffffff',
              fontSize: '0.88rem',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 4px 12px rgba(140, 59, 16, 0.28)',
              transition: 'all 0.15s ease'
            }}
          >
            <Check size={16} />
            <span>Add to Bill</span>
          </button>
        </div>
      </div>

      <style>{`
        @keyframes customChargeFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes customChargeSlideUp {
          from { transform: translateY(18px) scale(0.97); opacity: 0; }
          to { transform: translateY(0) scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
