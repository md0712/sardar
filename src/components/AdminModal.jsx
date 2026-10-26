import React, { useState } from 'react';
import { 
  X, Plus, Check, Trash2, Edit3, Eye, Printer, Package, 
  ShoppingBag, Search, Filter, RefreshCw, AlertTriangle, ShieldCheck, 
  ChevronRight, ArrowUpDown, IndianRupee, Layers, Tag 
} from 'lucide-react';
import ProductImagePicker from './ProductImagePicker';
import ProductSpecificationsEditor from './ProductSpecificationsEditor';

export default function AdminModal({ 
  isOpen, 
  onClose, 
  products = [], 
  orders = [], 
  onAddProduct, 
  onEditProduct, 
  onDeleteProduct, 
  onUpdateOrderStatus, 
  onEditOrder, 
  onDeleteOrder, 
  onViewInvoice,
  categories = []
}) {
  const [activeTab, setActiveTab] = useState('orders'); // 'orders' | 'products' | 'add-product'

  // Helper to get available subcategories from Categories page + showroom defaults
  const getAvailableSubcategories = (dept) => {
    const deptKey = (dept || '').toLowerCase().trim();
    const fromCategories = (categories || [])
      .filter((cat) => (cat.category || '').toLowerCase().trim() === deptKey)
      .map((cat) => ({
        id: cat.id || cat.name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-'),
        name: cat.name,
        isCustom: true
      }));

    const defaults = {
      furniture: [
        { id: 'sofas', name: 'Sofas & Recliners' },
        { id: 'beds', name: 'Beds & Mattresses' },
        { id: 'dining', name: 'Dining Sets' },
        { id: 'wardrobes', name: 'Wardrobes' },
        { id: 'chairs', name: 'Chairs & Study Tables' }
      ],
      electronics: [
        { id: 'tvs', name: 'Smart TVs & Audio' },
        { id: 'soundbars', name: 'Soundbars & Speakers' },
        { id: 'accessories', name: 'Electronic Accessories' }
      ],
      appliances: [
        { id: 'refrigerator', name: 'Refrigerators' },
        { id: 'washers', name: 'Washing Machines' },
        { id: 'kitchen', name: 'Kitchen Appliances' },
        { id: 'air-conditioners', name: 'Air Conditioners' },
        { id: 'mixers', name: 'Mixer Grinders' },
        { id: 'purifiers', name: 'Water Purifiers' }
      ]
    };

    const fallbackList = defaults[deptKey] || [];
    const combined = [...fromCategories];
    const seen = new Set(fromCategories.map(c => (c.id || '').toLowerCase().replace(/s$/, '')));
    const seenNames = new Set(fromCategories.map(c => (c.name || '').toLowerCase().replace(/s$/, '')));

    fallbackList.forEach((item) => {
      const idNorm = item.id.toLowerCase().replace(/s$/, '');
      const nameNorm = item.name.toLowerCase().replace(/s$/, '');
      if (!seen.has(idNorm) && !seenNames.has(nameNorm)) {
        combined.push({ ...item, isCustom: false });
        seen.add(idNorm);
      }
    });

    return combined;
  };
  
  // Orders Search & Filter
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState('all');
  const [editingOrder, setEditingOrder] = useState(null);

  // Products Search & Filter
  const [productSearch, setProductSearch] = useState('');
  const [productCatFilter, setProductCatFilter] = useState('all');
  const [editingProduct, setEditingProduct] = useState(null);

  // Add Product Form State
  const [newProductForm, setNewProductForm] = useState({
    name: '',
    modelNumber: '',
    category: 'furniture',
    subcategory: 'sofas',
    price: '',
    originalPrice: '',
    discount: '25',
    badge: 'BEST SELLER',
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80',
    description: '',
    featured: true,
    features: [],
    additionalInformation: []
  });

  const [notification, setNotification] = useState('');

  if (!isOpen) return null;

  const triggerNotice = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(''), 3000);
  };

  const formatPrice = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val || 0);
  };

  // Filtered Orders
  const filteredOrders = orders.filter(o => {
    const matchesSearch = 
      o.id.toLowerCase().includes(orderSearch.toLowerCase()) ||
      (o.customer?.name && o.customer.name.toLowerCase().includes(orderSearch.toLowerCase())) ||
      (o.customer?.phone && o.customer.phone.includes(orderSearch));
    const matchesStatus = orderStatusFilter === 'all' || o.status === orderStatusFilter;
    return matchesSearch && matchesStatus;
  });

  // Filtered Products (Search by name, title, id, or modelNumber)
  const filteredProducts = products.filter(p => {
    const q = productSearch.toLowerCase().trim();
    const matchesSearch = q === '' ||
      (p.name && p.name.toLowerCase().includes(q)) ||
      (p.title && p.title.toLowerCase().includes(q)) ||
      (p.id && p.id.toLowerCase().includes(q)) ||
      (p.modelNumber && p.modelNumber.toLowerCase().includes(q));
    const matchesCat = productCatFilter === 'all' || p.category === productCatFilter;
    return matchesSearch && matchesCat;
  });

  // Open Edit Product with normalized specifications
  const handleOpenEditProduct = (prod) => {
    let normalizedFeatures = [];
    if (Array.isArray(prod.features)) {
      normalizedFeatures = prod.features.map(f => {
        if (typeof f === 'string') return { name: 'Specification', value: f };
        if (f && typeof f === 'object') return { name: f.name || '', value: f.value || '', ...(f.type ? { type: f.type } : {}) };
        return null;
      }).filter(Boolean);
    } else if (prod.specifications && typeof prod.specifications === 'object') {
      normalizedFeatures = Object.entries(prod.specifications).map(([name, value]) => ({
        name,
        value: String(value || '')
      }));
    }

    let normalizedAdditionalInfo = [];
    if (Array.isArray(prod.additionalInformation)) {
      normalizedAdditionalInfo = prod.additionalInformation.map(a => {
        if (typeof a === 'string') return { name: 'Info', value: a };
        if (a && typeof a === 'object') return { name: a.name || '', value: a.value || '' };
        return null;
      }).filter(Boolean);
    }

    setEditingProduct({
      ...prod,
      name: prod.name || prod.title || '',
      modelNumber: prod.modelNumber || '',
      features: normalizedFeatures,
      additionalInformation: normalizedAdditionalInfo
    });
  };

  // Handle Add Product Submit
  const handleAddProductSubmit = (e) => {
    e.preventDefault();
    if (!newProductForm.name || !newProductForm.price) {
      alert('Product name and price are required.');
      return;
    }

    // Clean features
    const cleanFeatures = (newProductForm.features || [])
      .filter(f => f && (f.name.trim() || f.value.trim()))
      .map(f => ({ name: f.name.trim(), value: f.value.trim(), ...(f.type ? { type: f.type } : {}) }));

    const invalidFeature = cleanFeatures.find(f => !f.name || !f.value);
    if (invalidFeature) {
      alert('Each specification row must have both a Feature Name and a Feature Value. Please complete or delete empty fields.');
      return;
    }

    // Clean custom fields
    const cleanAdditionalInfo = (newProductForm.additionalInformation || [])
      .filter(a => a && (a.name.trim() || a.value.trim()))
      .map(a => ({ name: a.name.trim(), value: a.value.trim() }));

    const invalidCustom = cleanAdditionalInfo.find(a => !a.name || !a.value);
    if (invalidCustom) {
      alert('Each custom field must have both a Field Name and a Field Value. Please complete or delete empty fields.');
      return;
    }

    const priceNum = Number(newProductForm.price);
    const origPriceNum = newProductForm.originalPrice ? Number(newProductForm.originalPrice) : Math.round(priceNum * 1.28);
    const discountNum = Math.max(0, Math.round(((origPriceNum - priceNum) / (origPriceNum || 1)) * 100));

    const createdProduct = {
      id: `hk-${newProductForm.category.slice(0, 4)}-${Date.now().toString().slice(-4)}`,
      name: newProductForm.name.trim(),
      title: newProductForm.name.trim(),
      modelNumber: (newProductForm.modelNumber || '').trim(),
      category: newProductForm.category,
      subcategory: (newProductForm.subcategory || '').trim() || (newProductForm.category === 'appliances' ? 'refrigerator' : (newProductForm.category === 'electronics' ? 'tvs' : 'sofas')),
      price: priceNum,
      sellingPrice: priceNum,
      originalPrice: origPriceNum,
      originalMRP: origPriceNum,
      discount: discountNum,
      badge: newProductForm.badge ? newProductForm.badge.trim() : null,
      image: newProductForm.image,
      imageUrl: newProductForm.image,
      gallery: [newProductForm.image],
      description: newProductForm.description || 'Showroom verified premium addition to Sardar Mart Furniture and Home Appliances catalog.',
      features: cleanFeatures,
      additionalInformation: cleanAdditionalInfo,
      featured: newProductForm.featured
    };

    if (onAddProduct) onAddProduct(createdProduct);
    triggerNotice(`Added "${createdProduct.name}" to catalog!`);
    setActiveTab('products');
    const initSubs = getAvailableSubcategories('furniture');
    setNewProductForm({
      name: '',
      modelNumber: '',
      category: 'furniture',
      subcategory: initSubs[0]?.id || 'sofas',
      price: '',
      originalPrice: '',
      discount: '25',
      badge: 'BEST SELLER',
      image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80',
      description: '',
      featured: true,
      features: [],
      additionalInformation: []
    });
  };

  // Handle Edit Product Submit
  const handleSaveProductEdit = (e) => {
    e.preventDefault();
    if (!editingProduct) return;

    const cleanFeatures = (editingProduct.features || [])
      .filter(f => f && (f.name.trim() || f.value.trim()))
      .map(f => ({ name: f.name.trim(), value: f.value.trim(), ...(f.type ? { type: f.type } : {}) }));

    const invalidFeature = cleanFeatures.find(f => !f.name || !f.value);
    if (invalidFeature) {
      alert('Each specification row must have both a Feature Name and a Feature Value. Please complete or delete empty fields.');
      return;
    }

    const cleanAdditionalInfo = (editingProduct.additionalInformation || [])
      .filter(a => a && (a.name.trim() || a.value.trim()))
      .map(a => ({ name: a.name.trim(), value: a.value.trim() }));

    const invalidCustom = cleanAdditionalInfo.find(a => !a.name || !a.value);
    if (invalidCustom) {
      alert('Each custom field must have both a Field Name and a Field Value. Please complete or delete empty fields.');
      return;
    }

    const priceNum = Number(editingProduct.price) || 0;
    const origPriceNum = editingProduct.originalPrice ? Number(editingProduct.originalPrice) : Math.round(priceNum * 1.25);
    const discountNum = editingProduct.discount !== '' && editingProduct.discount !== undefined
      ? parseInt(editingProduct.discount)
      : Math.max(0, Math.round(((origPriceNum - priceNum) / (origPriceNum || 1)) * 100));

    const updated = {
      ...editingProduct,
      name: editingProduct.name.trim(),
      title: editingProduct.name.trim(),
      modelNumber: (editingProduct.modelNumber || '').trim(),
      category: editingProduct.category,
      subcategory: (editingProduct.subcategory || '').trim() || (editingProduct.category === 'appliances' ? 'refrigerator' : (editingProduct.category === 'electronics' ? 'tvs' : 'sofas')),
      price: priceNum,
      sellingPrice: priceNum,
      originalPrice: origPriceNum,
      originalMRP: origPriceNum,
      discount: discountNum,
      badge: (editingProduct.badge || '').trim() || null,
      features: cleanFeatures,
      additionalInformation: cleanAdditionalInfo
    };

    if (onEditProduct) onEditProduct(editingProduct.id, updated);
    triggerNotice(`Updated "${updated.name}" successfully!`);
    setEditingProduct(null);
  };

  // Handle Edit Order Submit
  const handleSaveOrderEdit = (e) => {
    e.preventDefault();
    if (!editingOrder) return;
    if (onEditOrder) onEditOrder(editingOrder.id, editingOrder);
    triggerNotice(`Updated Order #${editingOrder.id} successfully!`);
    setEditingOrder(null);
  };

  return (
    <div className="admin-modal-backdrop" onClick={onClose}>
      <div className="admin-modal-panel" onClick={(e) => e.stopPropagation()}>
        {/* Top Header */}
        <div className="admin-header-bar">
          <div className="header-brand-wrap" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <img src="/logo.png" alt="Sardar Logo" style={{ height: '36px', width: 'auto', objectFit: 'contain', borderRadius: '6px' }} />
            <div>
              <span className="admin-portal-pill">Staff &amp; Store Management Portal</span>
              <h2><strong>Sardar Mart</strong> Furniture and Home Appliances Operations CMS</h2>
            </div>
          </div>

          <div className="header-nav-tabs">
            <button 
              className={`tab-btn ${activeTab === 'orders' ? 'active' : ''}`}
              onClick={() => { setActiveTab('orders'); setEditingProduct(null); setEditingOrder(null); }}
            >
              <Package size={15} /> Orders &amp; Billing ({orders.length})
            </button>
            <button 
              className={`tab-btn ${activeTab === 'products' ? 'active' : ''}`}
              onClick={() => { setActiveTab('products'); setEditingProduct(null); setEditingOrder(null); }}
            >
              <ShoppingBag size={15} /> Manage Catalog ({products.length})
            </button>
            <button 
              className={`tab-btn ${activeTab === 'add-product' ? 'active' : ''}`}
              onClick={() => { setActiveTab('add-product'); setEditingProduct(null); setEditingOrder(null); }}
            >
              <Plus size={15} /> Add New Item
            </button>
          </div>

          <button className="close-btn" onClick={onClose} title="Close CMS">
            <X size={20} />
          </button>
        </div>

        {/* Global Alert Notification */}
        {notification && (
          <div className="admin-notification-toast animate-fade-in">
            <Check size={16} /> {notification}
          </div>
        )}

        {/* TAB 1: ORDERS & BILLING MANAGEMENT */}
        {activeTab === 'orders' && (
          <div className="admin-tab-content">
            <div className="tab-toolbar">
              <div className="search-wrap">
                <Search size={16} className="search-icon" />
                <input 
                  id="admin-order-search"
                  name="orderSearch"
                  type="text" 
                  aria-label="Search orders"
                  placeholder="Search orders by ID, customer name, or phone..." 
                  value={orderSearch}
                  onChange={(e) => setOrderSearch(e.target.value)}
                  className="admin-search-input"
                />
              </div>

              <div className="filter-select-wrap">
                <Filter size={15} />
                <select 
                  id="admin-order-status-filter"
                  name="orderStatusFilter"
                  aria-label="Filter orders by status"
                  value={orderStatusFilter} 
                  onChange={(e) => setOrderStatusFilter(e.target.value)}
                  className="admin-select"
                >
                  <option value="all">All Order Statuses</option>
                  <option value="Order Placed">Order Placed</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Packed">Packed / Dispatched</option>
                  <option value="Out for Delivery">Out for Delivery</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            {/* Quick Metrics Bar */}
            <div className="orders-metrics-row">
              <div className="metric-box">
                <span className="metric-lbl">Total Orders</span>
                <span className="metric-val">{orders.length}</span>
              </div>
              <div className="metric-box">
                <span className="metric-lbl">Total Billed Revenue</span>
                <span className="metric-val">
                  {formatPrice(orders.reduce((sum, o) => sum + (o.total || 0), 0))}
                </span>
              </div>
              <div className="metric-box">
                <span className="metric-lbl">Out for Delivery</span>
                <span className="metric-val text-orange">
                  {orders.filter(o => o.status === 'Out for Delivery').length}
                </span>
              </div>
              <div className="metric-box">
                <span className="metric-lbl">Completed Deliveries</span>
                <span className="metric-val text-green">
                  {orders.filter(o => o.status === 'Delivered').length}
                </span>
              </div>
            </div>

            {/* Orders Table */}
            <div className="admin-table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Order Ref</th>
                    <th>Customer &amp; Contact</th>
                    <th>Items</th>
                    <th>Total</th>
                    <th>Payment</th>
                    <th>Track Status (Live)</th>
                    <th style={{ textAlign: 'center' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.length > 0 ? (
                    filteredOrders.map(order => (
                      <tr key={order.id}>
                        <td>
                          <strong>#{order.id}</strong>
                          <div className="sub-time">{order.date}</div>
                        </td>
                        <td>
                          <div className="cust-name"><strong>{order.customer?.name}</strong></div>
                          <div className="cust-sub">{order.customer?.phone} • {order.customer?.city}</div>
                        </td>
                        <td>
                          <span className="items-badge">
                            {order.items?.length || 0} Products
                          </span>
                        </td>
                        <td>
                          <strong className="order-price">{formatPrice(order.total)}</strong>
                        </td>
                        <td>
                          <span className={`payment-pill ${order.paymentStatus?.toLowerCase().includes('paid') ? 'paid' : 'pending'}`}>
                            {order.paymentMethod}
                          </span>
                        </td>
                        <td>
                          {/* Live Track Status Changer */}
                          <select 
                            value={order.status}
                            onChange={(e) => {
                              if (onUpdateOrderStatus) onUpdateOrderStatus(order.id, e.target.value);
                              triggerNotice(`Order #${order.id} status changed to "${e.target.value}"`);
                            }}
                            className={`status-select ${order.status.toLowerCase().replace(/\s+/g, '-')}`}
                          >
                            <option value="Order Placed">Order Placed</option>
                            <option value="Confirmed">Confirmed</option>
                            <option value="Packed">Packed / Dispatched</option>
                            <option value="Out for Delivery">Out for Delivery</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </td>
                        <td>
                          <div className="action-buttons-cell">
                            <button 
                              className="btn-action-icon btn-invoice"
                              onClick={() => onViewInvoice && onViewInvoice(order)}
                              title="View & Print Tax Invoice (Bill)"
                            >
                              <Printer size={15} />
                            </button>
                            <button 
                              className="btn-action-icon btn-edit"
                              onClick={() => setEditingOrder({ ...order })}
                              title="Edit Customer Details & Address"
                            >
                              <Edit3 size={15} />
                            </button>
                            <button 
                              className="btn-action-icon btn-delete"
                              onClick={() => {
                                if (window.confirm(`Are you sure you want to remove order #${order.id}?`)) {
                                  if (onDeleteOrder) onDeleteOrder(order.id);
                                  triggerNotice(`Removed order #${order.id}`);
                                }
                              }}
                              title="Remove Order"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="empty-table-msg">
                        No orders found matching your search.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* EDIT ORDER MODAL SUB-VIEW */}
            {editingOrder && (
              <div className="sub-modal-backdrop">
                <div className="sub-modal-panel">
                  <div className="sub-modal-header">
                    <h3>Edit Order #{editingOrder.id}</h3>
                    <button onClick={() => setEditingOrder(null)}><X size={18} /></button>
                  </div>
                  <form onSubmit={handleSaveOrderEdit} className="admin-edit-form">
                    <div className="form-grid-2">
                      <div className="form-group">
                        <label>Customer Name</label>
                        <input 
                          type="text" 
                          value={editingOrder.customer?.name || ''} 
                          onChange={(e) => setEditingOrder(prev => ({
                            ...prev,
                            customer: { ...prev.customer, name: e.target.value }
                          }))}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label>Phone Number</label>
                        <input 
                          type="text" 
                          value={editingOrder.customer?.phone || ''} 
                          onChange={(e) => setEditingOrder(prev => ({
                            ...prev,
                            customer: { ...prev.customer, phone: e.target.value }
                          }))}
                          required
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label>Delivery Address</label>
                      <input 
                        type="text" 
                        value={editingOrder.customer?.address || ''} 
                        onChange={(e) => setEditingOrder(prev => ({
                          ...prev,
                          customer: { ...prev.customer, address: e.target.value }
                        }))}
                        required
                      />
                    </div>

                    <div className="form-grid-2">
                      <div className="form-group">
                        <label>City</label>
                        <input 
                          type="text" 
                          value={editingOrder.customer?.city || ''} 
                          onChange={(e) => setEditingOrder(prev => ({
                            ...prev,
                            customer: { ...prev.customer, city: e.target.value }
                          }))}
                        />
                      </div>
                      <div className="form-group">
                        <label>Pincode</label>
                        <input 
                          type="text" 
                          value={editingOrder.customer?.pincode || ''} 
                          onChange={(e) => setEditingOrder(prev => ({
                            ...prev,
                            customer: { ...prev.customer, pincode: e.target.value }
                          }))}
                        />
                      </div>
                    </div>

                    <div className="form-grid-2">
                      <div className="form-group">
                        <label>Order Status</label>
                        <select 
                          value={editingOrder.status}
                          onChange={(e) => setEditingOrder(prev => ({ ...prev, status: e.target.value }))}
                        >
                          <option value="Order Placed">Order Placed</option>
                          <option value="Confirmed">Confirmed</option>
                          <option value="Packed">Packed / Dispatched</option>
                          <option value="Out for Delivery">Out for Delivery</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </div>
                      <div className="form-group">
                        <label>Payment / COD Status</label>
                        <select 
                          value={editingOrder.paymentStatus || 'Pending'}
                          onChange={(e) => setEditingOrder(prev => ({ ...prev, paymentStatus: e.target.value }))}
                        >
                          <option value="Paid">✓ Paid (Settled / Collected)</option>
                          <option value="Pending">⏱ Pending (COD / Unpaid)</option>
                          <option value="Partially Paid">⏳ Partially Paid</option>
                          <option value="Failed">✕ Failed</option>
                        </select>
                      </div>
                    </div>

                    <div className="form-grid-2">
                      <div className="form-group">
                        <label>Payment Method</label>
                        <select 
                          value={editingOrder.paymentMethod || 'Cash on Delivery (COD)'}
                          onChange={(e) => setEditingOrder(prev => ({ ...prev, paymentMethod: e.target.value }))}
                        >
                          <option value="Cash on Delivery (COD)">Cash on Delivery (COD)</option>
                          <option value="Cash at Counter">Cash at Counter</option>
                          <option value="UPI / QR Code">UPI / QR Code</option>
                          <option value="Card (POS / Online)">Card (POS / Online)</option>
                        </select>
                      </div>
                      <div className="form-group">
                        <label>Delivery Partner / Courier</label>
                        <input 
                          type="text" 
                          placeholder="e.g. Porter Platform Delivery"
                          value={editingOrder.courier || ''} 
                          onChange={(e) => setEditingOrder(prev => ({ ...prev, courier: e.target.value }))}
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label>Delivery Fee / Porter Charges (₹)</label>
                      <input
                        type="number"
                        min="0"
                        placeholder="e.g. 250 (0 if free/none)"
                        value={editingOrder.delivery !== undefined ? editingOrder.delivery : (editingOrder.deliveryFee ?? 0)}
                        onChange={(e) => {
                          const newDelivery = Math.max(0, Number(e.target.value) || 0);
                          const prevDelivery = Number(editingOrder.delivery ?? editingOrder.deliveryFee ?? 0);
                          const currentTotal = Number(editingOrder.total) || 0;
                          const adjustedTotal = Math.max(0, currentTotal - prevDelivery + newDelivery);
                          setEditingOrder(prev => ({
                            ...prev,
                            delivery: newDelivery,
                            deliveryFee: newDelivery,
                            total: adjustedTotal
                          }));
                        }}
                      />
                      <small style={{ fontSize: '0.72rem', color: '#64748b' }}>
                        If 0, bill prints ₹0 (not FREE). Updates order total.
                      </small>
                    </div>

                    <div className="sub-modal-actions">
                      <button type="button" className="btn-cancel" onClick={() => setEditingOrder(null)}>Cancel</button>
                      <button type="submit" className="btn-save">Save Changes</button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: PRODUCT CATALOG MANAGEMENT (EDIT & REMOVE) */}
        {activeTab === 'products' && (
          <div className="admin-tab-content">
            <div className="tab-toolbar">
              <div className="search-wrap">
                <Search size={16} className="search-icon" />
                <input 
                  type="text" 
                  placeholder="Search products by title, SKU, or category..." 
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  className="admin-search-input"
                />
              </div>

              <div className="filter-select-wrap">
                <select 
                  value={productCatFilter} 
                  onChange={(e) => setProductCatFilter(e.target.value)}
                  className="admin-select"
                >
                  <option value="all">All Departments</option>
                  <option value="furniture">Furniture</option>
                  <option value="electronics">Electronics</option>
                  <option value="appliances">Home Appliances</option>
                </select>
              </div>

              <button 
                className="btn-add-product-cta"
                onClick={() => setActiveTab('add-product')}
              >
                <Plus size={16} /> Add Product
              </button>
            </div>

            {/* Products Table */}
            <div className="admin-table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th style={{ width: '60px' }}>Image</th>
                    <th>Product Title &amp; SKU</th>
                    <th>Department</th>
                    <th>Selling Price</th>
                    <th>Original MRP</th>
                    <th>Discount</th>
                    <th>Badge</th>
                    <th style={{ textAlign: 'center' }}>Featured</th>
                    <th style={{ textAlign: 'center' }}>Control Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.length > 0 ? (
                    filteredProducts.map(product => (
                      <tr key={product.id}>
                        <td>
                          <img src={product.image} alt={product.name} className="product-thumb-cell" />
                        </td>
                        <td>
                          <strong>{product.name}</strong>
                          <div className="sub-time">
                            ID: {product.id} • {product.subcategory}
                            {product.modelNumber && (
                              <span style={{ marginLeft: '6px', color: '#854d0e', fontWeight: 700 }}>
                                • Model: {product.modelNumber}
                              </span>
                            )}
                          </div>
                        </td>
                        <td>
                          <span className="cat-pill-tag">
                            {product.category === 'appliances' ? 'Appliances' : product.category}
                          </span>
                        </td>
                        <td>
                          <strong className="order-price">{formatPrice(product.price)}</strong>
                        </td>
                        <td>
                          <span className="mrp-strikethrough">{formatPrice(product.originalPrice)}</span>
                        </td>
                        <td>
                          <span className="discount-tag-admin">{product.discount}% OFF</span>
                        </td>
                        <td>
                          {product.badge ? (
                            <span className="admin-badge-pill">{product.badge}</span>
                          ) : (
                            <span className="no-badge-tag">—</span>
                          )}
                        </td>
                        <td style={{ textAlign: 'center' }}>
                          <input 
                            type="checkbox" 
                            checked={!!product.featured} 
                            onChange={(e) => {
                              if (onEditProduct) onEditProduct(product.id, { ...product, featured: e.target.checked });
                              triggerNotice(`Updated "${product.name}" featured status`);
                            }}
                          />
                        </td>
                        <td>
                          <div className="action-buttons-cell">
                            <button 
                              className="btn-action-icon btn-edit"
                              onClick={() => handleOpenEditProduct(product)}
                              title="Edit Product Price, Title &amp; Details"
                            >
                              <Edit3 size={15} />
                            </button>
                            <button 
                              className="btn-action-icon btn-delete"
                              onClick={() => {
                                if (window.confirm(`Are you sure you want to remove "${product.name}" from catalog?`)) {
                                  if (onDeleteProduct) onDeleteProduct(product.id);
                                  triggerNotice(`Removed "${product.name}" from catalog`);
                                }
                              }}
                              title="Delete / Remove Product"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="9" className="empty-table-msg">
                        No products match your search.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* EDIT PRODUCT SUB-MODAL */}
            {editingProduct && (
              <div className="sub-modal-backdrop">
                <div className="sub-modal-panel">
                  <div className="sub-modal-header">
                    <h3>Edit Product: {editingProduct.name}</h3>
                    <button onClick={() => setEditingProduct(null)}><X size={18} /></button>
                  </div>
                  <form onSubmit={handleSaveProductEdit} className="admin-edit-form">
                    <div className="form-grid-2">
                      <div className="form-group">
                        <label>Product Title *</label>
                        <input 
                          type="text" 
                          value={editingProduct.name} 
                          onChange={(e) => setEditingProduct(prev => ({ ...prev, name: e.target.value }))}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label>Model Number <span style={{ fontWeight: 400, color: '#64748b' }}>(Optional)</span></label>
                        <input 
                          type="text" 
                          placeholder="e.g. Samsung RT28C3453S8 or FUR-3S-001"
                          value={editingProduct.modelNumber || ''} 
                          onChange={(e) => setEditingProduct(prev => ({ ...prev, modelNumber: e.target.value }))}
                        />
                      </div>
                    </div>

                    <div className="form-grid-2">
                      <div className="form-group">
                        <label>Category *</label>
                        <select 
                          value={editingProduct.category}
                          onChange={(e) => {
                            const nextCat = e.target.value;
                            const available = getAvailableSubcategories(nextCat);
                            setEditingProduct(prev => ({
                              ...prev,
                              category: nextCat,
                              subcategory: available.length > 0 ? available[0].id : ''
                            }));
                          }}
                        >
                          <option value="furniture">Furniture</option>
                          <option value="electronics">Electronics</option>
                          <option value="appliances">Home Appliances</option>
                        </select>
                      </div>
                      <div className="form-group">
                        <label>Sub Category * (from Categories)</label>
                        <select 
                          value={editingProduct.subcategory || (getAvailableSubcategories(editingProduct.category)[0]?.id || '')} 
                          onChange={(e) => setEditingProduct(prev => ({ ...prev, subcategory: e.target.value }))}
                          required
                        >
                          {getAvailableSubcategories(editingProduct.category).map((sub) => (
                            <option key={sub.id} value={sub.id}>
                              {sub.name}{sub.isCustom ? ' ★ (Categories Page)' : ''}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="form-grid-3">
                      <div className="form-group">
                        <label>Selling Price (₹) *</label>
                        <input 
                          type="number" 
                          value={editingProduct.price} 
                          onChange={(e) => setEditingProduct(prev => ({ ...prev, price: Number(e.target.value) }))}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label>Original MRP (₹)</label>
                        <input 
                          type="number" 
                          value={editingProduct.originalPrice || ''} 
                          onChange={(e) => setEditingProduct(prev => ({ ...prev, originalPrice: Number(e.target.value) }))}
                        />
                      </div>
                      <div className="form-group">
                        <label>Discount %</label>
                        <input 
                          type="number" 
                          value={editingProduct.discount || ''} 
                          onChange={(e) => setEditingProduct(prev => ({ ...prev, discount: Number(e.target.value) }))}
                        />
                      </div>
                    </div>

                    <div className="form-grid-2">
                      <div className="form-group">
                        <label>Badge Label (Optional)</label>
                        <select 
                          value={editingProduct.badge || ''}
                          onChange={(e) => setEditingProduct(prev => ({ ...prev, badge: e.target.value || null }))}
                        >
                          <option value="">No Badge</option>
                          <option value="BEST SELLER">BEST SELLER</option>
                          <option value="NEW ARRIVAL">NEW ARRIVAL</option>
                          <option value="OFFER">OFFER</option>
                          <option value="NEW">NEW</option>
                        </select>
                      </div>
                      <div className="form-group" style={{ gridColumn: 'span 2' }}>
                        <ProductImagePicker
                          value={editingProduct.image || ''}
                          onChange={(imgUrl) => setEditingProduct(prev => ({ ...prev, image: imgUrl }))}
                          label="Product Image"
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label>Description</label>
                      <textarea 
                        rows="2"
                        value={editingProduct.description || ''} 
                        onChange={(e) => setEditingProduct(prev => ({ ...prev, description: e.target.value }))}
                      />
                    </div>

                    {/* Dynamic Specifications and Custom Fields */}
                    <div style={{ marginTop: '14px', marginBottom: '14px' }}>
                      <ProductSpecificationsEditor
                        features={editingProduct.features || []}
                        onFeaturesChange={(updated) => setEditingProduct(prev => ({ ...prev, features: updated }))}
                        additionalInformation={editingProduct.additionalInformation || []}
                        onAdditionalInfoChange={(updated) => setEditingProduct(prev => ({ ...prev, additionalInformation: updated }))}
                        category={editingProduct.category}
                      />
                    </div>

                    <div className="form-checkbox-row">
                      <label>
                        <input 
                          type="checkbox" 
                          checked={!!editingProduct.featured}
                          onChange={(e) => setEditingProduct(prev => ({ ...prev, featured: e.target.checked }))}
                        />
                        <span>Display on Home Page Featured Products Grid</span>
                      </label>
                    </div>

                    <div className="sub-modal-actions">
                      <button type="button" className="btn-cancel" onClick={() => setEditingProduct(null)}>Cancel</button>
                      <button type="submit" className="btn-save">Save Product</button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: ADD NEW PRODUCT FORM */}
        {activeTab === 'add-product' && (
          <div className="admin-tab-content">
            <div className="add-product-container">
              <h3>Publish New Product to Catalog</h3>
              <p className="add-subtext">Add a new furniture or electronic piece directly into the live showroom catalog.</p>

              <form onSubmit={handleAddProductSubmit} className="admin-add-form">
                <div className="form-grid-2">
                  <div className="form-group">
                    <label>Product Name *</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Solid Sheesham Bookcase with Drawers" 
                      value={newProductForm.name}
                      onChange={(e) => setNewProductForm(prev => ({ ...prev, name: e.target.value }))}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Model Number <span style={{ fontWeight: 400, color: '#64748b' }}>(Optional)</span></label>
                    <input 
                      type="text" 
                      placeholder="e.g. Samsung RT28C3453S8 or FUR-3S-001" 
                      value={newProductForm.modelNumber}
                      onChange={(e) => setNewProductForm(prev => ({ ...prev, modelNumber: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="form-grid-2">
                  <div className="form-group">
                    <label>Department Category *</label>
                    <select 
                      value={newProductForm.category}
                      onChange={(e) => {
                        const nextCat = e.target.value;
                        const available = getAvailableSubcategories(nextCat);
                        setNewProductForm(prev => ({
                          ...prev,
                          category: nextCat,
                          subcategory: available.length > 0 ? available[0].id : ''
                        }));
                      }}
                    >
                      <option value="furniture">Furniture</option>
                      <option value="electronics">Electronics</option>
                      <option value="appliances">Home Appliances</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Sub Category * (from Categories)</label>
                    <select 
                      value={newProductForm.subcategory || (getAvailableSubcategories(newProductForm.category)[0]?.id || '')}
                      onChange={(e) => setNewProductForm(prev => ({ ...prev, subcategory: e.target.value }))}
                      required
                    >
                      {getAvailableSubcategories(newProductForm.category).map((sub) => (
                        <option key={sub.id} value={sub.id}>
                          {sub.name}{sub.isCustom ? ' ★ (Categories Page)' : ''}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label>Promotional Badge</label>
                  <input 
                    type="text"
                    placeholder="e.g. BEST SELLER or HOT DEAL"
                    value={newProductForm.badge}
                    onChange={(e) => setNewProductForm(prev => ({ ...prev, badge: e.target.value }))}
                  />
                </div>

                <div className="form-grid-2">
                  <div className="form-group">
                    <label>Selling Price (₹) *</label>
                    <input 
                      type="number" 
                      placeholder="e.g. 15999" 
                      value={newProductForm.price}
                      onChange={(e) => setNewProductForm(prev => ({ ...prev, price: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Original MRP (₹)</label>
                    <input 
                      type="number" 
                      placeholder="e.g. 21999" 
                      value={newProductForm.originalPrice}
                      onChange={(e) => setNewProductForm(prev => ({ ...prev, originalPrice: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <ProductImagePicker
                    value={newProductForm.image}
                    onChange={(imgUrl) => setNewProductForm(prev => ({ ...prev, image: imgUrl }))}
                    label="Product Image (Choose File or Drag & Drop)"
                    required={false}
                  />
                </div>

                <div className="form-group">
                  <label>Product Description</label>
                  <textarea 
                    rows="2"
                    placeholder="Describe comfort, materials, finish, and design specifications..."
                    value={newProductForm.description}
                    onChange={(e) => setNewProductForm(prev => ({ ...prev, description: e.target.value }))}
                  />
                </div>

                {/* Dynamic Specifications and Custom Fields */}
                <div style={{ marginTop: '14px', marginBottom: '14px' }}>
                  <ProductSpecificationsEditor
                    features={newProductForm.features || []}
                    onFeaturesChange={(updated) => setNewProductForm(prev => ({ ...prev, features: updated }))}
                    additionalInformation={newProductForm.additionalInformation || []}
                    onAdditionalInfoChange={(updated) => setNewProductForm(prev => ({ ...prev, additionalInformation: updated }))}
                    category={newProductForm.category}
                  />
                </div>

                <div className="form-checkbox-row">
                  <label>
                    <input 
                      type="checkbox" 
                      checked={newProductForm.featured}
                      onChange={(e) => setNewProductForm(prev => ({ ...prev, featured: e.target.checked }))}
                    />
                    <span>Highlight on Home Page Featured Grid</span>
                  </label>
                </div>

                <button type="submit" className="btn-publish-product">
                  <Plus size={18} /> Publish to Live Catalog
                </button>
              </form>
            </div>
          </div>
        )}
      </div>

      <style>{`
        .admin-modal-backdrop {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(15, 23, 42, 0.75);
          backdrop-filter: blur(4px);
          z-index: 1150;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 16px;
        }
        .admin-modal-panel {
          background: #ffffff;
          border-radius: 14px;
          max-width: 1050px;
          width: 100%;
          max-height: 94vh;
          overflow-y: auto;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.4);
          display: flex;
          flex-direction: column;
        }

        /* Header */
        .admin-header-bar {
          background: #2b170e;
          color: #ffffff;
          padding: 18px 24px;
          border-radius: 14px 14px 0 0;
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 16px;
        }
        .admin-portal-pill {
          background: rgba(255, 255, 255, 0.15);
          color: #fde68a;
          padding: 3px 10px;
          border-radius: 20px;
          font-size: 0.72rem;
          font-weight: 700;
        }
        .header-brand-wrap h2 {
          font-size: 1.25rem;
          margin-top: 4px;
          color: #ffffff;
        }

        .header-nav-tabs {
          display: flex;
          gap: 8px;
        }
        .header-nav-tabs .tab-btn {
          background: rgba(255, 255, 255, 0.1);
          color: #e2e8f0;
          border: 1px solid rgba(255, 255, 255, 0.2);
          padding: 7px 14px;
          border-radius: 8px;
          font-size: 0.82rem;
          font-weight: 700;
          display: flex;
          align-items: center;
          gap: 6px;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .header-nav-tabs .tab-btn:hover {
          background: rgba(255, 255, 255, 0.2);
        }
        .header-nav-tabs .tab-btn.active {
          background: #d97706;
          color: #ffffff;
          border-color: #d97706;
          box-shadow: 0 2px 6px rgba(217, 119, 6, 0.4);
        }

        .close-btn {
          background: rgba(255, 255, 255, 0.1);
          color: #ffffff;
          border: none;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }

        /* Toast notification */
        .admin-notification-toast {
          background: #dcfce7;
          color: #15803d;
          border-bottom: 1px solid #bbf7d0;
          padding: 10px 24px;
          font-weight: 700;
          font-size: 0.85rem;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        /* Tab Content */
        .admin-tab-content {
          padding: 22px 24px;
        }

        .tab-toolbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 14px;
          margin-bottom: 18px;
          flex-wrap: wrap;
        }
        .search-wrap {
          flex: 1;
          min-width: 260px;
          position: relative;
        }
        .search-wrap .search-icon {
          position: absolute;
          top: 10px;
          left: 12px;
          color: #94a3b8;
        }
        .admin-search-input {
          width: 100%;
          padding: 9px 12px 9px 38px;
          border: 1.5px solid #cbd5e1;
          border-radius: 8px;
          font-size: 0.85rem;
          outline: none;
        }
        .admin-search-input:focus {
          border-color: #d97706;
        }

        .filter-select-wrap {
          display: flex;
          align-items: center;
          gap: 6px;
          color: #64748b;
        }
        .admin-select {
          padding: 8px 12px;
          border: 1.5px solid #cbd5e1;
          border-radius: 8px;
          font-size: 0.85rem;
          background: #ffffff;
          outline: none;
        }

        .btn-add-product-cta {
          background: #15803d;
          color: #ffffff;
          border: none;
          padding: 8px 16px;
          border-radius: 8px;
          font-weight: 700;
          font-size: 0.84rem;
          display: flex;
          align-items: center;
          gap: 6px;
          cursor: pointer;
          transition: background 0.2s ease;
        }
        .btn-add-product-cta:hover {
          background: #166534;
        }

        /* Metrics Bar */
        .orders-metrics-row {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 14px;
          margin-bottom: 18px;
        }
        .metric-box {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          padding: 12px 14px;
        }
        .metric-lbl {
          display: block;
          font-size: 0.72rem;
          color: #64748b;
          font-weight: 600;
          text-transform: uppercase;
        }
        .metric-val {
          font-size: 1.25rem;
          font-weight: 800;
          color: #0f172a;
        }
        .text-orange { color: #ea580c !important; }
        .text-green { color: #16a34a !important; }

        /* Tables */
        .admin-table-container {
          overflow-x: auto;
          border: 1px solid #e2e8f0;
          border-radius: 10px;
        }
        .admin-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 0.82rem;
          background: #ffffff;
        }
        .admin-table th {
          background: #f1f5f9;
          color: #334155;
          font-weight: 700;
          text-align: left;
          padding: 11px 12px;
          border-bottom: 2px solid #cbd5e1;
          white-space: nowrap;
        }
        .admin-table td {
          padding: 10px 12px;
          border-bottom: 1px solid #e2e8f0;
          vertical-align: middle;
        }
        .sub-time {
          font-size: 0.72rem;
          color: #94a3b8;
        }
        .cust-name {
          color: #0f172a;
        }
        .cust-sub {
          font-size: 0.72rem;
          color: #64748b;
        }
        .order-price {
          color: #0f172a;
          font-size: 0.88rem;
        }
        .items-badge {
          background: #f1f5f9;
          color: #475569;
          padding: 3px 8px;
          border-radius: 4px;
          font-weight: 600;
          font-size: 0.72rem;
        }

        /* Payment Pill */
        .payment-pill {
          padding: 2px 8px;
          border-radius: 4px;
          font-size: 0.72rem;
          font-weight: 700;
        }
        .payment-pill.paid {
          background: #dcfce7;
          color: #15803d;
        }
        .payment-pill.pending {
          background: #fef3c7;
          color: #b45309;
        }

        /* Live Status Select */
        .status-select {
          padding: 4px 8px;
          border-radius: 6px;
          font-weight: 700;
          font-size: 0.75rem;
          border: 1.5px solid transparent;
          outline: none;
          cursor: pointer;
        }
        .status-select.order-placed {
          background: #fef3c7;
          color: #b45309;
          border-color: #fde68a;
        }
        .status-select.confirmed {
          background: #e0f2fe;
          color: #0369a1;
          border-color: #bae6fd;
        }
        .status-select.packed {
          background: #f3e8ff;
          color: #7e22ce;
          border-color: #e9d5ff;
        }
        .status-select.out-for-delivery {
          background: #fed7aa;
          color: #c2410c;
          border-color: #fdba74;
        }
        .status-select.delivered {
          background: #dcfce7;
          color: #15803d;
          border-color: #bbf7d0;
        }
        .status-select.cancelled {
          background: #fee2e2;
          color: #b91c1c;
          border-color: #fecaca;
        }

        /* Action Buttons */
        .action-buttons-cell {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
        }
        .btn-action-icon {
          width: 30px;
          height: 30px;
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          border: 1px solid transparent;
          transition: all 0.15s ease;
        }
        .btn-invoice {
          background: #fef3c7;
          color: #b45309;
          border-color: #fde68a;
        }
        .btn-invoice:hover {
          background: #fde68a;
        }
        .btn-edit {
          background: #e0f2fe;
          color: #0369a1;
          border-color: #bae6fd;
        }
        .btn-edit:hover {
          background: #bae6fd;
        }
        .btn-delete {
          background: #fee2e2;
          color: #dc2626;
          border-color: #fecaca;
        }
        .btn-delete:hover {
          background: #fecaca;
        }

        /* Products Table Spec */
        .product-thumb-cell {
          width: 44px;
          height: 44px;
          object-fit: cover;
          border-radius: 6px;
          border: 1px solid #e2e8f0;
        }
        .cat-pill-tag {
          background: #f1f5f9;
          color: #475569;
          font-weight: 600;
          font-size: 0.72rem;
          padding: 2px 8px;
          border-radius: 4px;
          text-transform: capitalize;
        }
        .mrp-strikethrough {
          color: #94a3b8;
          text-decoration: line-through;
          font-size: 0.75rem;
        }
        .discount-tag-admin {
          background: #fff7ed;
          color: #c2410c;
          font-weight: 700;
          font-size: 0.72rem;
          padding: 2px 6px;
          border-radius: 4px;
        }
        .admin-badge-pill {
          background: #dc2626;
          color: #ffffff;
          font-size: 0.65rem;
          font-weight: 800;
          padding: 2px 6px;
          border-radius: 4px;
        }
        .no-badge-tag {
          color: #94a3b8;
        }

        /* Sub Modals (Edit Order & Edit Product) */
        .sub-modal-backdrop {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(15, 23, 42, 0.6);
          z-index: 1200;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 16px;
        }
        .sub-modal-panel {
          background: #ffffff;
          border-radius: 12px;
          max-width: 600px;
          width: 100%;
          max-height: 90vh;
          overflow-y: auto;
          padding: 24px;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.3);
        }
        .sub-modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 18px;
          padding-bottom: 12px;
          border-bottom: 1px solid #e2e8f0;
        }
        .sub-modal-header h3 {
          font-size: 1.1rem;
          color: #0f172a;
        }

        .admin-edit-form, .admin-add-form {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }
        .form-grid-2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }
        .form-grid-3 {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 12px;
        }
        .form-group {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .form-group label {
          font-size: 0.76rem;
          font-weight: 700;
          color: #475569;
        }
        .form-group input, .form-group select, .form-group textarea {
          padding: 8px 12px;
          border: 1.5px solid #cbd5e1;
          border-radius: 6px;
          font-size: 0.85rem;
          outline: none;
        }
        .form-group input:focus, .form-group select:focus, .form-group textarea:focus {
          border-color: #d97706;
        }
        .form-checkbox-row label {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.82rem;
          color: #334155;
          cursor: pointer;
        }

        .sub-modal-actions {
          display: flex;
          justify-content: flex-end;
          gap: 10px;
          margin-top: 10px;
        }
        .btn-cancel {
          background: #f1f5f9;
          color: #475569;
          border: none;
          padding: 8px 16px;
          border-radius: 6px;
          font-weight: 600;
          cursor: pointer;
        }
        .btn-save {
          background: #2b170e;
          color: #ffffff;
          border: none;
          padding: 8px 18px;
          border-radius: 6px;
          font-weight: 700;
          cursor: pointer;
        }
        .btn-save:hover {
          background: #4a2312;
        }

        /* Add Product tab */
        .add-product-container {
          max-width: 680px;
          margin: 0 auto;
          background: #fafaf9;
          padding: 24px;
          border-radius: 12px;
          border: 1px solid #e7e5e4;
        }
        .add-product-container h3 {
          font-size: 1.15rem;
          color: #2b170e;
        }
        .add-subtext {
          font-size: 0.8rem;
          color: #78716c;
          margin-bottom: 16px;
        }
        .btn-publish-product {
          background: #2b170e;
          color: #ffffff;
          border: none;
          padding: 12px;
          border-radius: 8px;
          font-weight: 700;
          font-size: 0.92rem;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          cursor: pointer;
          margin-top: 8px;
          transition: background 0.2s ease;
        }
        .btn-publish-product:hover {
          background: #4a2312;
        }

        @media (max-width: 768px) {
          .orders-metrics-row {
            grid-template-columns: 1fr 1fr;
          }
          .admin-header-bar {
            flex-direction: column;
            align-items: flex-start;
          }
          .header-nav-tabs {
            width: 100%;
            overflow-x: auto;
          }
          .form-grid-2, .form-grid-3 {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
