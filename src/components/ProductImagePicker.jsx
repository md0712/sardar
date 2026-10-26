import React, { useState, useRef } from 'react';
import { Upload, Image as ImageIcon, Trash2, CheckCircle2, Loader2, RefreshCw, Link as LinkIcon, Camera } from 'lucide-react';
import { uploadProductImage } from '../services/imageUploadService';

export default function ProductImagePicker({
  value = '',
  onChange,
  label = 'Product Image',
  required = false,
  folder = 'products'
}) {
  const [localPreview, setLocalPreview] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [showUrlField, setShowUrlField] = useState(false);
  const [manualUrl, setManualUrl] = useState('');
  const fileInputRef = useRef(null);

  const displayImage = localPreview || value;

  const handleFileProcess = async (file) => {
    if (!file || !file.type.startsWith('image/')) {
      alert('Please choose a valid image file (PNG, JPG, WebP, etc.)');
      return;
    }

    // Instant local preview so user sees the image in < 15ms
    const previewUrl = URL.createObjectURL(file);
    setLocalPreview(previewUrl);
    setIsUploading(true);
    setUploadStatus('Optimizing image...');

    try {
      const result = await uploadProductImage(file, folder);
      onChange && onChange(result.url);
      setUploadStatus(
        result.source === 'firebase_storage'
          ? '✓ Uploaded to Cloud Storage'
          : '✓ Ready to save'
      );
    } catch (err) {
      console.error('Image processing failed:', err);
      alert('Could not process image: ' + err.message);
      setUploadStatus('');
      setLocalPreview(null);
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileProcess(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileProcess(file);
    }
  };

  const handleRemoveImage = () => {
    if (localPreview) {
      try {
        URL.revokeObjectURL(localPreview);
      } catch (e) {}
    }
    setLocalPreview(null);
    onChange && onChange('');
    setUploadStatus('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleApplyManualUrl = () => {
    if (manualUrl.trim()) {
      if (localPreview) {
        try {
          URL.revokeObjectURL(localPreview);
        } catch (e) {}
      }
      setLocalPreview(null);
      onChange && onChange(manualUrl.trim());
      setUploadStatus('✓ URL applied');
      setManualUrl('');
      setShowUrlField(false);
    }
  };

  return (
    <div className="product-image-picker-root">
      <div className="picker-header-row">
        <label className="picker-main-label">
          <Camera size={15} />
          <span>{label} {required && <strong style={{ color: '#dc2626' }}>*</strong>}</span>
        </label>
        {displayImage && (
          <span className="picker-ready-badge">
            <CheckCircle2 size={13} color="#16a34a" /> Attached
          </span>
        )}
      </div>

      {/* Hidden Native File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileInputChange}
        style={{ display: 'none' }}
        id="hidden-product-file-input"
      />

      {/* State A: Image is Selected (Preview Mode) */}
      {displayImage ? (
        <div className="image-preview-box">
          <img
            src={displayImage}
            alt="Product Preview"
            className="preview-photo"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=400&q=80';
            }}
          />
          <div className="preview-details">
            <div className="preview-status-line">
              {isUploading ? (
                <span className="status-badge uploading">
                  <Loader2 size={13} className="spin-icon" /> {uploadStatus || 'Optimizing image...'}
                </span>
              ) : (
                <span className="status-badge ready">
                  <CheckCircle2 size={13} /> {uploadStatus || 'Ready to save'}
                </span>
              )}
            </div>
            <p className="preview-note">
              This photo is optimized and will be saved to the catalog.
            </p>
            <div className="preview-actions">
              <button
                type="button"
                className="btn-picker-action change"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
              >
                <RefreshCw size={13} /> Choose Another Photo
              </button>
              <button
                type="button"
                className="btn-picker-action remove"
                onClick={handleRemoveImage}
                disabled={isUploading}
              >
                <Trash2 size={13} /> Remove
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* State B: Empty Dropzone / Choose File Area */
        <div
          className={`image-dropzone ${isDragging ? 'dragging' : ''} ${isUploading ? 'uploading' : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => !isUploading && fileInputRef.current?.click()}
        >
          {isUploading ? (
            <div className="dropzone-loading">
              <Loader2 size={32} className="spin-icon" color="#b45309" />
              <p className="loading-text">Processing &amp; Uploading to Firebase...</p>
              <small>Optimizing image dimensions &amp; compression</small>
            </div>
          ) : (
            <div className="dropzone-content">
              <div className="dropzone-icon-bubble">
                <Upload size={22} />
              </div>
              <div className="dropzone-text-group">
                <span className="dropzone-cta-btn">
                  <Upload size={14} /> Choose Image File from Computer / Phone
                </span>
                <span className="dropzone-drag-hint">or drag &amp; drop product photo here</span>
                <span className="dropzone-file-specs">Supports PNG, JPG, JPEG, WebP • Auto-saved to Firebase</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Secondary Option: Paste Image URL */}
      <div className="manual-url-option">
        {!showUrlField ? (
          <button
            type="button"
            className="toggle-manual-url-btn"
            onClick={() => setShowUrlField(true)}
          >
            <LinkIcon size={12} /> Or enter image link / URL manually
          </button>
        ) : (
          <div className="manual-url-input-row">
            <input
              type="url"
              placeholder="Paste public image URL (https://...)"
              value={manualUrl}
              onChange={(e) => setManualUrl(e.target.value)}
              className="manual-url-input"
            />
            <button
              type="button"
              className="btn-apply-url"
              onClick={handleApplyManualUrl}
            >
              Apply
            </button>
            <button
              type="button"
              className="btn-cancel-url"
              onClick={() => { setShowUrlField(false); setManualUrl(''); }}
            >
              Cancel
            </button>
          </div>
        )}
      </div>

      <style>{`
        .product-image-picker-root {
          margin-bottom: 14px;
        }
        .picker-header-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 6px;
        }
        .picker-main-label {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 0.86rem;
          font-weight: 700;
          color: #334155;
        }
        .picker-ready-badge {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-size: 0.72rem;
          font-weight: 700;
          color: #15803d;
          background: #dcfce7;
          padding: 2px 8px;
          border-radius: 12px;
        }
        .image-dropzone {
          border: 2px dashed #d97706;
          border-radius: 10px;
          background: #fffbeb;
          padding: 20px 16px;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
        }
        .image-dropzone:hover {
          background: #fef3c7;
          border-color: #b45309;
        }
        .image-dropzone.dragging {
          background: #fed7aa;
          border-color: #c2410c;
          transform: scale(1.01);
        }
        .image-dropzone.uploading {
          cursor: wait;
          background: #f8fafc;
          border-color: #cbd5e1;
        }
        .dropzone-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
        }
        .dropzone-icon-bubble {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: #fed7aa;
          color: #9a3412;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .dropzone-text-group {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
        }
        .dropzone-cta-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: #9a3412;
          color: #ffffff;
          padding: 7px 16px;
          border-radius: 6px;
          font-size: 0.85rem;
          font-weight: 700;
          box-shadow: 0 2px 6px rgba(154, 52, 18, 0.25);
        }
        .dropzone-drag-hint {
          font-size: 0.78rem;
          color: #64748b;
        }
        .dropzone-file-specs {
          font-size: 0.7rem;
          color: #94a3b8;
        }
        .dropzone-loading {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          padding: 10px;
        }
        .dropzone-loading .loading-text {
          font-size: 0.88rem;
          font-weight: 700;
          color: #9a3412;
          margin: 0;
        }
        .dropzone-loading small {
          font-size: 0.74rem;
          color: #64748b;
        }
        .spin-icon {
          animation: pickerSpin 1s linear infinite;
        }
        @keyframes pickerSpin {
          100% { transform: rotate(360deg); }
        }

        /* Preview Box */
        .image-preview-box {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 12px;
          background: #ffffff;
          border: 1.5px solid #e2e8f0;
          border-radius: 10px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
        }
        .preview-photo {
          width: 80px;
          height: 80px;
          border-radius: 8px;
          object-fit: cover;
          border: 1px solid #cbd5e1;
          background: #f8fafc;
          flex-shrink: 0;
        }
        .preview-details {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .status-badge {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          font-size: 0.74rem;
          font-weight: 700;
          padding: 3px 8px;
          border-radius: 4px;
          width: fit-content;
        }
        .status-badge.ready {
          color: #15803d;
          background: #dcfce7;
        }
        .status-badge.uploading {
          color: #b45309;
          background: #fef3c7;
        }
        .preview-note {
          font-size: 0.76rem;
          color: #64748b;
          margin: 2px 0 0;
        }
        .preview-actions {
          display: flex;
          gap: 8px;
          margin-top: 4px;
        }
        .btn-picker-action {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-size: 0.75rem;
          font-weight: 600;
          padding: 4px 10px;
          border-radius: 6px;
          cursor: pointer;
          border: 1px solid transparent;
        }
        .btn-picker-action.change {
          background: #f1f5f9;
          color: #1e293b;
          border-color: #cbd5e1;
        }
        .btn-picker-action.change:hover {
          background: #e2e8f0;
        }
        .btn-picker-action.remove {
          background: #fee2e2;
          color: #991b1b;
          border-color: #fca5a5;
        }
        .btn-picker-action.remove:hover {
          background: #fecaca;
        }

        /* Manual URL */
        .manual-url-option {
          margin-top: 6px;
        }
        .toggle-manual-url-btn {
          background: none;
          border: none;
          color: #9a3412;
          font-size: 0.76rem;
          cursor: pointer;
          padding: 0;
          display: inline-flex;
          align-items: center;
          gap: 4px;
          text-decoration: underline;
        }
        .toggle-manual-url-btn:hover {
          color: #7c2d12;
        }
        .manual-url-input-row {
          display: flex;
          gap: 6px;
          margin-top: 6px;
        }
        .manual-url-input {
          flex: 1;
          padding: 6px 10px;
          font-size: 0.82rem;
          border: 1px solid #cbd5e1;
          border-radius: 6px;
        }
        .btn-apply-url {
          background: #9a3412;
          color: #ffffff;
          border: none;
          padding: 6px 12px;
          border-radius: 6px;
          font-size: 0.8rem;
          font-weight: 700;
          cursor: pointer;
        }
        .btn-cancel-url {
          background: #f1f5f9;
          color: #64748b;
          border: 1px solid #cbd5e1;
          padding: 6px 10px;
          border-radius: 6px;
          font-size: 0.8rem;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
}
