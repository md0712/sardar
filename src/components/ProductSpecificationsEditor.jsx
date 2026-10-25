import React from 'react';
import { Plus, Trash2, Sparkles, HelpCircle, Layers, FileText } from 'lucide-react';

// Recommended contextual suggestions by category to assist the admin
const CATEGORY_FEATURE_SUGGESTIONS = {
  furniture: [
    'Primary Material',
    'Seating Capacity',
    'Frame Material',
    'Upholstery Color',
    'Dimensions (W × D × H)',
    'Foam Density',
    'Finish / Polish',
    'Warranty'
  ],
  electronics: [
    'Capacity',
    'Energy Rating',
    'Cooling Technology',
    'Compressor Type',
    'Screen Size',
    'Display Resolution',
    'Door Type',
    'Power Consumption',
    'Warranty'
  ],
  appliances: [
    'Capacity / Volume',
    'Power Consumption',
    'Motor Type',
    'Body Material',
    'Speed Settings',
    'Auto Shut-off',
    'Voltage Requirement',
    'Warranty'
  ]
};

const ADDITIONAL_INFO_SUGGESTIONS = [
  'Country of Origin',
  'Installation Required',
  'Assembly Required',
  'Manufacturer',
  'Package Contents',
  'Delivery Type',
  'Care Instructions',
  'Safety Information'
];

export default function ProductSpecificationsEditor({
  features = [],
  onFeaturesChange,
  additionalInformation = [],
  onAdditionalInfoChange,
  category = 'furniture'
}) {
  // Ensure we always have arrays to work with
  const safeFeatures = Array.isArray(features) ? features : [];
  const safeAdditionalInfo = Array.isArray(additionalInformation) ? additionalInformation : [];

  // Handlers for Features
  const handleAddFeature = (suggestedName = '') => {
    onFeaturesChange([
      ...safeFeatures,
      { name: suggestedName, value: '' }
    ]);
  };

  const handleUpdateFeature = (index, field, val) => {
    const updated = safeFeatures.map((item, idx) => {
      if (idx === index) {
        return { ...item, [field]: val };
      }
      return item;
    });
    onFeaturesChange(updated);
  };

  const handleRemoveFeature = (index) => {
    const updated = safeFeatures.filter((_, idx) => idx !== index);
    onFeaturesChange(updated);
  };

  // Handlers for Additional Information
  const handleAddCustomField = (suggestedName = '') => {
    onAdditionalInfoChange([
      ...safeAdditionalInfo,
      { name: suggestedName, value: '' }
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

  const activeCategorySuggestions = CATEGORY_FEATURE_SUGGESTIONS[category] || CATEGORY_FEATURE_SUGGESTIONS.furniture;

  return (
    <div className="product-specs-editor-container">
      {/* SECTION 4: PRODUCT FEATURES & SPECIFICATIONS */}
      <div className="specs-editor-section">
        <div className="specs-section-header">
          <div className="specs-section-title-wrap">
            <span className="specs-section-badge">
              <Layers size={15} />
            </span>
            <div>
              <h5 className="specs-section-title">Product Features &amp; Specifications</h5>
              <p className="specs-section-subtitle">
                Add dynamic technical details specific to this item (e.g. Capacity, Material, Warranty, Energy Rating).
              </p>
            </div>
          </div>
          <button
            type="button"
            className="btn-add-row-action"
            onClick={() => handleAddFeature()}
            title="Add a new specification row"
          >
            <Plus size={15} /> Add Feature
          </button>
        </div>

        {/* Suggestion Quick Chips */}
        <div className="specs-suggestions-bar">
          <span className="suggestions-label">
            <Sparkles size={12} /> Quick Suggestions:
          </span>
          <div className="suggestions-chips-wrap">
            {activeCategorySuggestions.map((sug, i) => {
              const alreadyAdded = safeFeatures.some(f => f.name.toLowerCase() === sug.toLowerCase());
              return (
                <button
                  key={i}
                  type="button"
                  className={`suggestion-chip ${alreadyAdded ? 'added' : ''}`}
                  onClick={() => !alreadyAdded && handleAddFeature(sug)}
                  disabled={alreadyAdded}
                  title={alreadyAdded ? 'Already added' : `Click to add "${sug}"`}
                >
                  {alreadyAdded ? '✓' : '+'} {sug}
                </button>
              );
            })}
          </div>
        </div>

        {/* Feature Rows List */}
        {safeFeatures.length === 0 ? (
          <div className="specs-empty-state">
            <p>No specifications added yet.</p>
            <button
              type="button"
              className="btn-empty-add"
              onClick={() => handleAddFeature()}
            >
              <Plus size={14} /> Add First Specification
            </button>
          </div>
        ) : (
          <div className="specs-rows-list">
            <div className="specs-rows-header">
              <span className="col-header-name">Feature / Specification Name</span>
              <span className="col-header-val">Feature Value / Details</span>
              <span className="col-header-action">Action</span>
            </div>
            {safeFeatures.map((item, idx) => {
              const isNameMissing = !item.name.trim() && item.value.trim();
              const isValueMissing = item.name.trim() && !item.value.trim();

              return (
                <div key={idx} className="spec-row-item animate-fade-in">
                  <div className="spec-row-inputs">
                    <div className="spec-input-field">
                      <input
                        type="text"
                        placeholder="e.g. Cooling Technology, Dimensions"
                        value={item.name}
                        onChange={(e) => handleUpdateFeature(idx, 'name', e.target.value)}
                        className={`spec-input ${isNameMissing ? 'input-warning' : ''}`}
                      />
                      {isNameMissing && <small className="field-hint-warn">Specify a feature name</small>}
                    </div>

                    <div className="spec-input-field">
                      <input
                        type="text"
                        placeholder="e.g. Frost Free, 210 × 85 × 90 cm"
                        value={item.value}
                        onChange={(e) => handleUpdateFeature(idx, 'value', e.target.value)}
                        className={`spec-input ${isValueMissing ? 'input-warning' : ''}`}
                      />
                      {isValueMissing && <small className="field-hint-warn">Specify value or remove row</small>}
                    </div>
                  </div>

                  <button
                    type="button"
                    className="btn-remove-row"
                    onClick={() => handleRemoveFeature(idx)}
                    title="Remove this specification"
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

      {/* SECTION 5: ADDITIONAL INFORMATION */}
      <div className="specs-editor-section" style={{ marginTop: '24px' }}>
        <div className="specs-section-header">
          <div className="specs-section-title-wrap">
            <span className="specs-section-badge secondary">
              <FileText size={15} />
            </span>
            <div>
              <h5 className="specs-section-title">Additional Information</h5>
              <p className="specs-section-subtitle">
                Add custom auxiliary details (e.g. Installation Required, Country of Origin, Delivery Type, Package Contents).
              </p>
            </div>
          </div>
          <button
            type="button"
            className="btn-add-row-action"
            onClick={() => handleAddCustomField()}
            title="Add a new custom information field"
          >
            <Plus size={15} /> Add Custom Field
          </button>
        </div>

        {/* Suggestion Quick Chips */}
        <div className="specs-suggestions-bar">
          <span className="suggestions-label">
            <Sparkles size={12} /> Suggested Custom Fields:
          </span>
          <div className="suggestions-chips-wrap">
            {ADDITIONAL_INFO_SUGGESTIONS.map((sug, i) => {
              const alreadyAdded = safeAdditionalInfo.some(f => f.name.toLowerCase() === sug.toLowerCase());
              return (
                <button
                  key={i}
                  type="button"
                  className={`suggestion-chip ${alreadyAdded ? 'added' : ''}`}
                  onClick={() => !alreadyAdded && handleAddCustomField(sug)}
                  disabled={alreadyAdded}
                  title={alreadyAdded ? 'Already added' : `Click to add "${sug}"`}
                >
                  {alreadyAdded ? '✓' : '+'} {sug}
                </button>
              );
            })}
          </div>
        </div>

        {/* Custom Fields Rows List */}
        {safeAdditionalInfo.length === 0 ? (
          <div className="specs-empty-state">
            <p>No additional information fields added yet.</p>
            <button
              type="button"
              className="btn-empty-add"
              onClick={() => handleAddCustomField()}
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
                        placeholder="e.g. Country of Origin, Installation Required"
                        value={item.name}
                        onChange={(e) => handleUpdateCustomField(idx, 'name', e.target.value)}
                        className={`spec-input ${isNameMissing ? 'input-warning' : ''}`}
                      />
                      {isNameMissing && <small className="field-hint-warn">Specify a field name</small>}
                    </div>

                    <div className="spec-input-field">
                      <input
                        type="text"
                        placeholder="e.g. India, Yes (Technician Provided)"
                        value={item.value}
                        onChange={(e) => handleUpdateCustomField(idx, 'value', e.target.value)}
                        className={`spec-input ${isValueMissing ? 'input-warning' : ''}`}
                      />
                      {isValueMissing && <small className="field-hint-warn">Specify value or remove field</small>}
                    </div>
                  </div>

                  <button
                    type="button"
                    className="btn-remove-row"
                    onClick={() => handleRemoveCustomField(idx)}
                    title="Remove this custom field"
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
          gap: 4px;
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
          margin-bottom: 12px;
        }

        .specs-section-title-wrap {
          display: flex;
          align-items: flex-start;
          gap: 10px;
        }

        .specs-section-badge {
          width: 28px;
          height: 28px;
          border-radius: 8px;
          background: #78350f;
          color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          margin-top: 2px;
        }

        .specs-section-badge.secondary {
          background: #9a3412;
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

        .specs-suggestions-bar {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 14px;
          padding: 8px 10px;
          background: #ffffff;
          border-radius: 8px;
          border: 1px dashed #e2d3c7;
          flex-wrap: wrap;
        }

        .suggestions-label {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-size: 0.76rem;
          font-weight: 600;
          color: #854d0e;
        }

        .suggestions-chips-wrap {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
        }

        .suggestion-chip {
          background: #fdf8f4;
          border: 1px solid #ebdcd0;
          color: #6a3418;
          font-size: 0.74rem;
          font-weight: 600;
          padding: 3px 9px;
          border-radius: 999px;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .suggestion-chip:hover:not(:disabled) {
          background: #78350f;
          color: #ffffff;
          border-color: #78350f;
        }

        .suggestion-chip.added {
          opacity: 0.5;
          cursor: default;
          background: #f1f5f9;
          border-color: #e2e8f0;
          color: #64748b;
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
        }
      `}</style>
    </div>
  );
}
