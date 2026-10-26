import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Trash2, 
  Layers, 
  Tv, 
  Zap, 
  Home, 
  CheckCircle2, 
  Sliders, 
  Maximize2, 
  ShieldCheck, 
  Cpu, 
  Wrench, 
  Palette, 
  Users, 
  Volume2, 
  Wifi, 
  Sparkles,
  Award
} from 'lucide-react';

// Predefined model specification templates for the three product types
export const CATEGORY_DEFINITIONS = {
  appliances: {
    id: 'appliances',
    label: 'Home Appliance',
    subtitle: 'Refrigerators, Washing Machines, Air Conditioners, Microwaves & Kitchen Appliances',
    specs: [
      { name: 'Capacity / Volume', placeholder: 'e.g. 260 Litres, 7 Kg, 1.5 Ton, 28 L' },
      { name: 'Energy Rating', placeholder: 'e.g. 5 Star BEE Rating, 3 Star Inverter' },
      { name: 'Power Consumption', placeholder: 'e.g. 1450 Watts, 230V / 50Hz' },
      { name: 'Compressor / Motor Type', placeholder: 'e.g. Smart Inverter Compressor, BLDC Motor' },
      { name: 'Body / Drum Material', placeholder: 'e.g. Toughened Glass, Stainless Steel' },
      { name: 'Voltage Requirement', placeholder: 'e.g. 220-240V AC, 50 Hz' },
      { name: 'Warranty', placeholder: 'e.g. 1 Year Comprehensive + 10 Years Motor/Compressor' }
    ]
  },
  electronics: {
    id: 'electronics',
    label: 'Electronic Items',
    subtitle: 'Smart TVs, Audio Systems, Home Theatres, Monitors & Electronics',
    specs: [
      { name: 'Display / Screen Size', placeholder: 'e.g. 55 Inch 4K UHD OLED (139 cm)' },
      { name: 'Resolution & Refresh Rate', placeholder: 'e.g. 3840 × 2160 Pixels, 120Hz' },
      { name: 'Audio Output & Technology', placeholder: 'e.g. 40W Dolby Atmos / DTS Virtual:X' },
      { name: 'Connectivity & Ports', placeholder: 'e.g. 3x HDMI 2.1, 2x USB, Wi-Fi 6, Bluetooth 5.2' },
      { name: 'Operating System / Processor', placeholder: 'e.g. Google TV, Quad-Core Processor' },
      { name: 'Power Consumption', placeholder: 'e.g. 120 Watts, Standby < 0.5W' },
      { name: 'Warranty', placeholder: 'e.g. 2 Years Comprehensive Brand Warranty' }
    ]
  },
  furniture: {
    id: 'furniture',
    label: 'Furniture',
    subtitle: 'Living Room, Bedroom, Dining, Recliners, Tables & Storage Furniture',
    specs: [
      { name: 'Dimensions (L × W × H)', placeholder: 'e.g. 84 × 36 × 34 inches / 213 × 91 × 86 cm' },
      { name: 'Primary Material', placeholder: 'e.g. Solid Sheesham Wood, Teak Wood, Engineered Wood' },
      { name: 'Seating Capacity / Size', placeholder: 'e.g. 3-Seater, King Size (72 × 78 in), 6-Seater Dining' },
      { name: 'Upholstery / Fabric Material', placeholder: 'e.g. Premium Velvet Fabric - Royal Blue, Leatherette' },
      { name: 'Finish / Polish', placeholder: 'e.g. Walnut Matte Finish, Natural Honey Teak' },
      { name: 'Assembly Type', placeholder: 'e.g. Pre-assembled, Carpenter Assembly Provided' },
      { name: 'Warranty', placeholder: 'e.g. 5 Years Termite & Structural Warranty' }
    ]
  }
};

const normalizeCategory = (cat) => {
  if (!cat) return 'furniture';
  const c = String(cat).toLowerCase();
  if (c.includes('appliance')) return 'appliances';
  if (c.includes('electronic')) return 'electronics';
  return 'furniture';
};

export default function ProductSpecificationsEditor({
  features = [],
  onFeaturesChange,
  additionalInformation = [],
  onAdditionalInfoChange,
  category = 'furniture'
}) {
  const [activeCategory, setActiveCategory] = useState(() => normalizeCategory(category));

  // Sync category tab if parent category changes
  useEffect(() => {
    if (category) {
      setActiveCategory(normalizeCategory(category));
    }
  }, [category]);

  const safeFeatures = Array.isArray(features) ? features : [];
  const safeAdditionalInfo = Array.isArray(additionalInformation) ? additionalInformation : [];

  const currentCategoryDef = CATEGORY_DEFINITIONS[activeCategory] || CATEGORY_DEFINITIONS.furniture;
  const standardSpecsList = currentCategoryDef.specs;

  // Helper: Find existing standard spec value from safeFeatures
  const findStandardSpecItem = (specName) => {
    const sLower = specName.toLowerCase();
    return safeFeatures.find(f => {
      if (!f || !f.name) return false;
      const fLower = f.name.toLowerCase();
      if (fLower === sLower) return true;
      if (sLower.includes('capacity') && fLower.includes('capacity')) return true;
      if (sLower.includes('dimensions') && fLower.includes('dimensions')) return true;
      if (sLower.includes('warranty') && fLower.includes('warranty')) return true;
      if (sLower.includes('primary material') && fLower.includes('material')) return true;
      if (sLower.includes('energy rating') && fLower.includes('energy')) return true;
      if (sLower.includes('power consumption') && fLower.includes('power')) return true;
      if (sLower.includes('screen size') && fLower.includes('screen')) return true;
      return false;
    });
  };

  const getStandardSpecValue = (specName) => {
    const match = findStandardSpecItem(specName);
    return match ? match.value : '';
  };

  // Handler: Update standard specification field
  const handleUpdateStandardSpec = (specName, val) => {
    const existing = findStandardSpecItem(specName);
    let updated;

    if (!val.trim()) {
      // Remove empty specification to prevent invalid validation submission
      updated = safeFeatures.filter(f => f !== existing);
    } else {
      if (existing) {
        updated = safeFeatures.map(f => {
          if (f === existing) {
            return { ...f, name: specName, value: val, type: 'spec' };
          }
          return f;
        });
      } else {
        updated = [...safeFeatures, { name: specName, value: val, type: 'spec' }];
      }
    }
    onFeaturesChange(updated);
  };

  // Check whether an item in safeFeatures is one of the standard specs
  const isItemStandardSpec = (item) => {
    if (!item || !item.name) return false;
    return standardSpecsList.some(spec => {
      const sLower = spec.name.toLowerCase();
      const fLower = item.name.toLowerCase();
      if (sLower === fLower) return true;
      if (sLower.includes('capacity') && fLower.includes('capacity')) return true;
      if (sLower.includes('dimensions') && fLower.includes('dimensions')) return true;
      if (sLower.includes('warranty') && fLower.includes('warranty')) return true;
      if (sLower.includes('primary material') && fLower.includes('material')) return true;
      if (sLower.includes('energy rating') && fLower.includes('energy')) return true;
      if (sLower.includes('power consumption') && fLower.includes('power')) return true;
      if (sLower.includes('screen size') && fLower.includes('screen')) return true;
      return false;
    });
  };

  // Custom Model Specifications (type !== 'feature' and not matching standard specs)
  const customSpecsWithIndices = safeFeatures
    .map((item, originalIndex) => ({ item, originalIndex }))
    .filter(({ item }) => item && item.type !== 'feature' && !isItemStandardSpec(item));

  // Product Features (explicit type === 'feature')
  const productFeaturesWithIndices = safeFeatures
    .map((item, originalIndex) => ({ item, originalIndex }))
    .filter(({ item }) => item && item.type === 'feature');

  // Handlers for Custom Model Specifications
  const handleAddCustomSpec = () => {
    onFeaturesChange([
      ...safeFeatures,
      { name: '', value: '', type: 'spec' }
    ]);
  };

  const handleUpdateCustomSpec = (originalIndex, field, val) => {
    const updated = safeFeatures.map((item, idx) => {
      if (idx === originalIndex) {
        return { ...item, [field]: val, type: 'spec' };
      }
      return item;
    });
    onFeaturesChange(updated);
  };

  const handleRemoveCustomSpec = (originalIndex) => {
    const updated = safeFeatures.filter((_, idx) => idx !== originalIndex);
    onFeaturesChange(updated);
  };

  // Handlers for Product Features
  const handleAddProductFeature = () => {
    onFeaturesChange([
      ...safeFeatures,
      { name: '', value: '', type: 'feature' }
    ]);
  };

  const handleUpdateProductFeature = (originalIndex, field, val) => {
    const updated = safeFeatures.map((item, idx) => {
      if (idx === originalIndex) {
        return { ...item, [field]: val, type: 'feature' };
      }
      return item;
    });
    onFeaturesChange(updated);
  };

  const handleRemoveProductFeature = (originalIndex) => {
    const updated = safeFeatures.filter((_, idx) => idx !== originalIndex);
    onFeaturesChange(updated);
  };

  // Handlers for Custom Fields (formerly Additional Information)
  const handleAddCustomField = () => {
    onAdditionalInfoChange([
      ...safeAdditionalInfo,
      { name: '', value: '' }
    ]);
  };

  const handleUpdateCustomField = (index, field, val) => {
    const updated = safeAdditionalInfo.map((item, idx) => {
      if (idx === index) {
        return { ...item, [field]: val };
      }
      return item;
    });
    onAdditionalInfoChange(updated);
  };

  const handleRemoveCustomField = (index) => {
    const updated = safeAdditionalInfo.filter((_, idx) => idx !== index);
    onAdditionalInfoChange(updated);
  };

  return (
    <div className="product-specs-editor-container">
      {/* SECTION 1: MODEL SPECIFICATIONS */}
      <div className="specs-editor-section">
        <div className="specs-section-header">
          <div className="specs-section-title-wrap">
            <span className="specs-section-badge">
              <Layers size={16} />
            </span>
            <div>
              <h5 className="specs-section-title">Model Specifications</h5>
              <p className="specs-section-subtitle">
                Category-tailored technical specifications ({currentCategoryDef.label}).
              </p>
            </div>
          </div>

          {/* Category Switcher Tabs */}
          <div className="category-specs-tabs" role="tablist">
            <button
              type="button"
              className={`cat-tab-btn ${activeCategory === 'appliances' ? 'active' : ''}`}
              onClick={() => setActiveCategory('appliances')}
              title="Home Appliances template"
            >
              <Home size={13} /> Home Appliance
            </button>
            <button
              type="button"
              className={`cat-tab-btn ${activeCategory === 'electronics' ? 'active' : ''}`}
              onClick={() => setActiveCategory('electronics')}
              title="Electronic Items template"
            >
              <Tv size={13} /> Electronic Items
            </button>
            <button
              type="button"
              className={`cat-tab-btn ${activeCategory === 'furniture' ? 'active' : ''}`}
              onClick={() => setActiveCategory('furniture')}
              title="Furniture template"
            >
              <Layers size={13} /> Furniture
            </button>
          </div>
        </div>

        {/* Standard Model Specification Fields Grid */}
        <div className="specs-fields-grid">
          {standardSpecsList.map((spec) => {
            const val = getStandardSpecValue(spec.name);
            const isFilled = Boolean(val && val.trim());

            return (
              <div key={spec.name} className={`spec-field-card ${isFilled ? 'filled' : ''}`}>
                <label className="spec-field-label">
                  <span>{spec.name}</span>
                  {isFilled && <span className="spec-filled-dot" title="Value entered">✓</span>}
                </label>
                <input
                  type="text"
                  placeholder={spec.placeholder}
                  value={val}
                  onChange={(e) => handleUpdateStandardSpec(spec.name, e.target.value)}
                  className="spec-field-input"
                />
              </div>
            );
          })}
        </div>

        {/* Custom Model Specifications Sub-List */}
        <div className="custom-specs-subblock">
          <div className="subblock-header">
            <span className="subblock-title">Additional Model Specifications</span>
            <button
              type="button"
              className="btn-add-mini"
              onClick={handleAddCustomSpec}
            >
              <Plus size={13} /> Add Specification
            </button>
          </div>

          {customSpecsWithIndices.length > 0 && (
            <div className="specs-rows-list">
              <div className="specs-rows-header">
                <span className="col-header-name">Specification Name</span>
                <span className="col-header-val">Specification Value</span>
                <span className="col-header-action">Action</span>
              </div>
              {customSpecsWithIndices.map(({ item, originalIndex }) => {
                const isNameMissing = !item.name.trim() && item.value.trim();
                const isValueMissing = item.name.trim() && !item.value.trim();

                return (
                  <div key={originalIndex} className="spec-row-item animate-fade-in">
                    <div className="spec-row-inputs">
                      <div className="spec-input-field">
                        <input
                          type="text"
                          placeholder="e.g. Foam Density, Door Count, Voltage"
                          value={item.name}
                          onChange={(e) => handleUpdateCustomSpec(originalIndex, 'name', e.target.value)}
                          className={`spec-input ${isNameMissing ? 'input-warning' : ''}`}
                        />
                        {isNameMissing && <small className="field-hint-warn">Specify a name</small>}
                      </div>

                      <div className="spec-input-field">
                        <input
                          type="text"
                          placeholder="e.g. 32D Rebonded, Double Door, 220V"
                          value={item.value}
                          onChange={(e) => handleUpdateCustomSpec(originalIndex, 'value', e.target.value)}
                          className={`spec-input ${isValueMissing ? 'input-warning' : ''}`}
                        />
                        {isValueMissing && <small className="field-hint-warn">Specify a value</small>}
                      </div>
                    </div>

                    <button
                      type="button"
                      className="btn-remove-row"
                      onClick={() => handleRemoveCustomSpec(originalIndex)}
                      title="Remove specification"
                      aria-label="Remove specification"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* SECTION 2: PRODUCT FEATURES */}
      <div className="specs-editor-section" style={{ marginTop: '20px' }}>
        <div className="specs-section-header">
          <div className="specs-section-title-wrap">
            <span className="specs-section-badge accent-badge">
              <CheckCircle2 size={16} />
            </span>
            <div>
              <h5 className="specs-section-title">Product Features</h5>
              <p className="specs-section-subtitle">
                Add standout product features, key selling points, and benefits.
              </p>
            </div>
          </div>
          <button
            type="button"
            className="btn-add-row-action"
            onClick={handleAddProductFeature}
            title="Add a new product feature"
          >
            <Plus size={15} /> Add Product Feature
          </button>
        </div>

        {productFeaturesWithIndices.length === 0 ? (
          <div className="specs-empty-state">
            <p>No product features added yet.</p>
            <button
              type="button"
              className="btn-empty-add"
              onClick={handleAddProductFeature}
            >
              <Plus size={14} /> Add First Product Feature
            </button>
          </div>
        ) : (
          <div className="specs-rows-list">
            <div className="specs-rows-header">
              <span className="col-header-name">Feature Name / Headline</span>
              <span className="col-header-val">Feature Details / Description</span>
              <span className="col-header-action">Action</span>
            </div>
            {productFeaturesWithIndices.map(({ item, originalIndex }) => {
              const isNameMissing = !item.name.trim() && item.value.trim();
              const isValueMissing = item.name.trim() && !item.value.trim();

              return (
                <div key={originalIndex} className="spec-row-item feature-row-item animate-fade-in">
                  <div className="spec-row-inputs">
                    <div className="spec-input-field">
                      <input
                        type="text"
                        placeholder="e.g. Smart Inverter Compressor, Frost Free Technology"
                        value={item.name}
                        onChange={(e) => handleUpdateProductFeature(originalIndex, 'name', e.target.value)}
                        className={`spec-input ${isNameMissing ? 'input-warning' : ''}`}
                      />
                      {isNameMissing && <small className="field-hint-warn">Specify feature name</small>}
                    </div>

                    <div className="spec-input-field">
                      <input
                        type="text"
                        placeholder="e.g. Saves up to 50% energy with whisper-quiet 36dB operation"
                        value={item.value}
                        onChange={(e) => handleUpdateProductFeature(originalIndex, 'value', e.target.value)}
                        className={`spec-input ${isValueMissing ? 'input-warning' : ''}`}
                      />
                      {isValueMissing && <small className="field-hint-warn">Specify feature details</small>}
                    </div>
                  </div>

                  <button
                    type="button"
                    className="btn-remove-row"
                    onClick={() => handleRemoveProductFeature(originalIndex)}
                    title="Remove product feature"
                    aria-label="Remove product feature"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* SECTION 3: CUSTOM FIELDS */}
      <div className="specs-editor-section" style={{ marginTop: '20px' }}>
        <div className="specs-section-header">
          <div className="specs-section-title-wrap">
            <span className="specs-section-badge secondary-badge">
              <Sliders size={16} />
            </span>
            <div>
              <h5 className="specs-section-title">Custom Fields</h5>
              <p className="specs-section-subtitle">
                Add custom key-value attributes for this product.
              </p>
            </div>
          </div>
          <button
            type="button"
            className="btn-add-row-action"
            onClick={handleAddCustomField}
            title="Add a custom field"
          >
            <Plus size={15} /> Add Custom Field
          </button>
        </div>

        {safeAdditionalInfo.length === 0 ? (
          <div className="specs-empty-state">
            <p>No custom fields added yet.</p>
            <button
              type="button"
              className="btn-empty-add"
              onClick={handleAddCustomField}
            >
              <Plus size={14} /> Add First Custom Field
            </button>
          </div>
        ) : (
          <div className="specs-rows-list">
            <div className="specs-rows-header">
              <span className="col-header-name">Custom Field Name</span>
              <span className="col-header-val">Custom Field Value</span>
              <span className="col-header-action">Action</span>
            </div>
            {safeAdditionalInfo.map((item, idx) => {
              const isNameMissing = !item.name.trim() && item.value.trim();
              const isValueMissing = item.name.trim() && !item.value.trim();

              return (
                <div key={idx} className="spec-row-item animate-fade-in">
                  <div className="spec-row-inputs">
                    <div className="spec-input-field">
                      <input
                        type="text"
                        placeholder="e.g. Country of Origin, In-Box Contents, Care Instructions"
                        value={item.name}
                        onChange={(e) => handleUpdateCustomField(idx, 'name', e.target.value)}
                        className={`spec-input ${isNameMissing ? 'input-warning' : ''}`}
                      />
                      {isNameMissing && <small className="field-hint-warn">Specify field name</small>}
                    </div>

                    <div className="spec-input-field">
                      <input
                        type="text"
                        placeholder="e.g. India, 1 Unit with Remote & User Manual, Wipe with damp cloth"
                        value={item.value}
                        onChange={(e) => handleUpdateCustomField(idx, 'value', e.target.value)}
                        className={`spec-input ${isValueMissing ? 'input-warning' : ''}`}
                      />
                      {isValueMissing && <small className="field-hint-warn">Specify field value</small>}
                    </div>
                  </div>

                  <button
                    type="button"
                    className="btn-remove-row"
                    onClick={() => handleRemoveCustomField(idx)}
                    title="Remove custom field"
                    aria-label="Remove custom field"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <style>{`
        .product-specs-editor-container {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .specs-editor-section {
          background: #faf8f5;
          border: 1px solid #ebdcd0;
          border-radius: 12px;
          padding: 16px 18px;
          transition: all 0.2s ease;
        }

        .specs-section-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 12px;
          margin-bottom: 14px;
          flex-wrap: wrap;
        }

        .specs-section-title-wrap {
          display: flex;
          align-items: flex-start;
          gap: 10px;
        }

        .specs-section-badge {
          width: 30px;
          height: 30px;
          border-radius: 8px;
          background: #78350f;
          color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          margin-top: 2px;
        }

        .specs-section-badge.accent-badge {
          background: #047857;
        }

        .specs-section-badge.secondary-badge {
          background: #b45309;
        }

        .specs-section-title {
          font-size: 0.96rem;
          font-weight: 700;
          color: #2b170e;
          margin: 0 0 2px 0;
        }

        .specs-section-subtitle {
          font-size: 0.8rem;
          color: #64748b;
          margin: 0;
          line-height: 1.35;
        }

        /* Category Switcher Tabs */
        .category-specs-tabs {
          display: flex;
          gap: 6px;
          background: #f1ece6;
          padding: 3px;
          border-radius: 8px;
          border: 1px solid #e5d7cc;
        }

        .cat-tab-btn {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 5px 11px;
          border-radius: 6px;
          border: none;
          background: transparent;
          color: #6a3418;
          font-size: 0.76rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.15s ease;
          white-space: nowrap;
        }

        .cat-tab-btn:hover {
          color: #2b170e;
          background: rgba(255, 255, 255, 0.5);
        }

        .cat-tab-btn.active {
          background: #ffffff;
          color: #78350f;
          font-weight: 700;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
        }

        /* Standard Model Specification Fields Grid */
        .specs-fields-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 12px;
          margin-bottom: 16px;
        }

        .spec-field-card {
          background: #ffffff;
          border: 1px solid #ebdcd0;
          border-radius: 9px;
          padding: 10px 12px;
          display: flex;
          flex-direction: column;
          gap: 6px;
          transition: all 0.15s ease;
        }

        .spec-field-card:hover {
          border-color: #c9ad96;
        }

        .spec-field-card.filled {
          border-color: #bbf7d0;
          background: #fcfdfc;
        }

        .spec-field-label {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 0.78rem;
          font-weight: 700;
          color: #43281c;
          margin: 0;
        }

        .spec-filled-dot {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #dcfce7;
          color: #15803d;
          font-size: 0.68rem;
          font-weight: 800;
        }

        .spec-field-input {
          width: 100%;
          padding: 7px 10px;
          font-size: 0.84rem;
          border: 1px solid #dcd1c6;
          border-radius: 7px;
          background: #ffffff;
          color: #1e293b;
          font-family: inherit;
          transition: all 0.15s ease;
        }

        .spec-field-input:focus {
          outline: none;
          border-color: #78350f;
          box-shadow: 0 0 0 2.5px rgba(120, 53, 15, 0.12);
        }

        /* Custom Specs Subblock */
        .custom-specs-subblock {
          border-top: 1px dashed #ebdcd0;
          padding-top: 14px;
        }

        .subblock-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 10px;
        }

        .subblock-title {
          font-size: 0.8rem;
          font-weight: 700;
          color: #78350f;
          text-transform: uppercase;
          letter-spacing: 0.03em;
        }

        .btn-add-mini {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          background: #ffffff;
          color: #78350f;
          border: 1px solid #d4b8a2;
          padding: 4px 10px;
          border-radius: 6px;
          font-size: 0.74rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .btn-add-mini:hover {
          background: #fbf7f4;
          border-color: #78350f;
        }

        .btn-add-row-action {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: #ffffff;
          color: #78350f;
          border: 1.5px solid #d4b8a2;
          padding: 7px 14px;
          border-radius: 8px;
          font-size: 0.82rem;
          font-weight: 700;
          cursor: pointer;
          white-space: nowrap;
          transition: all 0.15s ease-in-out;
        }

        .btn-add-row-action:hover {
          background: #fbf7f4;
          border-color: #78350f;
          color: #592507;
          box-shadow: 0 2px 4px rgba(120, 53, 15, 0.08);
        }

        .specs-empty-state {
          text-align: center;
          padding: 20px 14px;
          background: #ffffff;
          border: 1px dashed #cbd5e1;
          border-radius: 10px;
          color: #64748b;
          font-size: 0.85rem;
        }

        .specs-empty-state p {
          margin: 0 0 10px 0;
        }

        .btn-empty-add {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: #78350f;
          color: #ffffff;
          border: none;
          padding: 7px 16px;
          border-radius: 8px;
          font-size: 0.82rem;
          font-weight: 700;
          cursor: pointer;
          transition: background 0.15s ease;
        }

        .btn-empty-add:hover {
          background: #592507;
        }

        .specs-rows-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .specs-rows-header {
          display: grid;
          grid-template-columns: 1fr 1.2fr 44px;
          gap: 10px;
          padding: 0 6px 4px;
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          color: #78350f;
        }

        .col-header-action {
          text-align: center;
        }

        .spec-row-item {
          display: grid;
          grid-template-columns: 1fr 42px;
          gap: 10px;
          align-items: flex-start;
          background: #ffffff;
          padding: 10px 12px;
          border-radius: 10px;
          border: 1px solid #ebdcd0;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.02);
          transition: border-color 0.15s ease;
        }

        .spec-row-item:hover {
          border-color: #c9ad96;
        }

        .spec-row-inputs {
          display: grid;
          grid-template-columns: 1fr 1.2fr;
          gap: 10px;
        }

        .spec-input-field {
          display: flex;
          flex-direction: column;
          gap: 3px;
        }

        .spec-input {
          width: 100%;
          padding: 8px 12px;
          font-size: 0.88rem;
          border: 1.5px solid #dcd1c6;
          border-radius: 8px;
          background: #ffffff;
          color: #1e293b;
          font-family: inherit;
          transition: all 0.15s ease;
        }

        .spec-input:focus {
          outline: none;
          border-color: #78350f;
          box-shadow: 0 0 0 3px rgba(120, 53, 15, 0.12);
        }

        .spec-input.input-warning {
          border-color: #f59e0b;
          background: #fffdfa;
        }

        .field-hint-warn {
          font-size: 0.72rem;
          color: #b45309;
          font-weight: 600;
        }

        .btn-remove-row {
          width: 40px;
          height: 38px;
          border-radius: 8px;
          border: 1px solid #fee2e2;
          background: #fef2f2;
          color: #dc2626;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.15s ease;
          flex-shrink: 0;
        }

        .btn-remove-row:hover {
          background: #fee2e2;
          color: #991b1b;
          transform: scale(1.04);
        }

        @media (max-width: 640px) {
          .specs-rows-header {
            display: none;
          }
          .spec-row-inputs {
            grid-template-columns: 1fr;
          }
          .spec-row-item {
            grid-template-columns: 1fr auto;
          }
          .specs-section-header {
            flex-direction: column;
            align-items: stretch;
          }
          .btn-add-row-action {
            justify-content: center;
          }
          .category-specs-tabs {
            flex-direction: column;
          }
          .specs-fields-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
