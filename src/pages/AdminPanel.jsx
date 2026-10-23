import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, Package, Layers, ShoppingCart, MessageSquare, 
  Users, Tag, Globe, Star, BarChart3, Settings, ShieldCheck, 
  LogOut, Search, Bell, Calendar, ChevronDown, Plus, Eye, EyeOff, 
  Edit3, Trash2, Printer, CheckCircle, Clock, Truck, Home, 
  FileText, ArrowRight, ArrowLeft, Mail, Lock, Check, AlertCircle,
  Menu, X, IndianRupee, Phone, ExternalLink, RefreshCw, Sparkles, Filter, MessageCircle,
  ShieldAlert, Loader2, CreditCard, ShoppingBag, TrendingUp, Copy, MapPin
} from 'lucide-react';
import Billing from './Billing';
import { createOrder } from '../services/orderService';
import { useAuth } from '../context/AuthContext';
import { seedProductsToFirestore } from '../services/productService';
import { 
  getStaffUsers, 
  createStaffAccount, 
  updateStaffStatus, 
  updateStaffRole, 
  deleteStaffUser 
} from '../services/staffService';
import { 
  subscribeToEnquiriesAdmin, 
  updateEnquiryStatus, 
  deleteEnquiry 
} from '../services/enquiryService';
import { 
  subscribeToReviews, 
  updateReviewStatus, 
  deleteReview 
} from '../services/reviewService';
import { 
  getStoreSettings, 
  saveStoreSettings, 
  subscribeToStoreSettings, 
  DEFAULT_STORE_CONFIG 
} from '../services/settingsService';
import { updatePassword, updateProfile } from 'firebase/auth';
import { auth, db } from '../lib/firebase';
import ProductImagePicker from '../components/ProductImagePicker';
import { 
  createPromoCode, 
  deletePromoCode, 
  togglePromoCodeStatus, 
  subscribeToPromoCodes 
} from '../services/promoService';
import { 
  subscribeToCategories, 
  createCategory, 
  updateCategory, 
  deleteCategory, 
  seedCategoriesToFirestore 
} from '../services/categoryService';
import AdminMobileNav from '../components/AdminMobileNav';


export default function AdminPanel({
  products = [],
  categories: propCategories = [],
  orders = [],
  promoCodes: propPromoCodes = [],
  initialTab = 'dashboard',
  onAddProduct,
  onEditProduct,
  onDeleteProduct,
  onUpdateOrderStatus,
  onEditOrder,
  onDeleteOrder,
  onViewInvoice,
  onPlaceOrder,
  onBackToStore,
  onLogoutAdmin,
  onSeedCatalog,
  storeSettings: propStoreSettings
}) {
  // Real Firebase Authentication and ID token custom claim verification
  const { currentUser, isAdmin, isSuperAdmin, login, logout, resetPassword, refreshClaims, loading: authLoading } = useAuth();
  const isAuthenticated = Boolean(currentUser && (isAdmin || isSuperAdmin));

  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loginError, setLoginError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSeeding, setIsSeeding] = useState(false);

  // Staff & Admin Management State (Super Admin)
  const [staffList, setStaffList] = useState([]);
  const [loadingStaff, setLoadingStaff] = useState(false);
  const [staffSearch, setStaffSearch] = useState('');
  const [staffRoleFilter, setStaffRoleFilter] = useState('all');
  const [isAddStaffModalOpen, setIsAddStaffModalOpen] = useState(false);
  const [newStaffForm, setNewStaffForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'shop_admin',
    phone: ''
  });
  const [creatingStaff, setCreatingStaff] = useState(false);
  const [createdStaffCreds, setCreatedStaffCreds] = useState(null);
  const [staffError, setStaffError] = useState('');
  const [copiedKey, setCopiedKey] = useState('');

  // Active Admin Tab (defaults to initialTab, e.g. 'settings' or 'dashboard')
  const [activeTab, setActiveTab] = useState(initialTab || 'dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Search in Admin
  const [adminGlobalSearch, setAdminGlobalSearch] = useState('');

  // Products Tab states
  const [productSearch, setProductSearch] = useState('');
  const [productCatFilter, setProductCatFilter] = useState('all');
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  // Orders Tab states
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState('all');
  const [customerSearch, setCustomerSearch] = useState('');

  const [editingOrder, setEditingOrder] = useState(null);
  const [copiedOrderId, setCopiedOrderId] = useState(null);

  // Sales Chart Period
  const [salesPeriod, setSalesPeriod] = useState('This Week');

  // Enquiries State (Live Firestore sync)
  const [enquiries, setEnquiries] = useState([]);
  const [loadingEnquiries, setLoadingEnquiries] = useState(true);

  // Customer Reviews & Feedback State (Live Firestore sync)
  const [customerReviews, setCustomerReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(true);
  const [reviewSearch, setReviewSearch] = useState('');
  const [reviewStatusFilter, setReviewStatusFilter] = useState('all');
  const [reviewRatingFilter, setReviewRatingFilter] = useState('all');
  const [reviewViewMode, setReviewViewMode] = useState('feedbacks'); // 'feedbacks' | 'catalog'
  const [updatingReviewId, setUpdatingReviewId] = useState(null);

  // Store Settings & Website Content State (Live Firestore sync with DEFAULT_STORE_CONFIG)
  const [siteContent, setSiteContent] = useState(DEFAULT_STORE_CONFIG);
  const [storeSettings, setStoreSettings] = useState(DEFAULT_STORE_CONFIG);
  const [savingSettings, setSavingSettings] = useState(false);

  // Admin Profile Credentials State (Derived dynamically from authenticated Firebase user)
  const [adminProfile, setAdminProfile] = useState({
    name: '',
    email: '',
    role: '',
    phone: ''
  });

  const [adminPasswordForm, setAdminPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [updatingPassword, setUpdatingPassword] = useState(false);


  // New Product Form State
  const [newProduct, setNewProduct] = useState({
    name: '',
    category: 'furniture',
    subcategory: 'sofas',
    price: '',
    originalPrice: '',
    discount: '25',
    badge: 'BEST SELLER',
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80',
    description: '',
    featured: true
  });

  const [toast, setToast] = useState('');

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  // Promo Code Management State (Live Firestore sync)
  const [promoCodesList, setPromoCodesList] = useState(propPromoCodes || []);
  const [isAddPromoModalOpen, setIsAddPromoModalOpen] = useState(false);
  const [newPromoForm, setNewPromoForm] = useState({
    code: '',
    discountPercentage: '',
    maxDiscountAmount: '',
    minOrderAmount: '',
    description: '',
    validTill: 'Valid until stocks last'
  });
  const [isSubmittingPromo, setIsSubmittingPromo] = useState(false);

  useEffect(() => {
    const unsub = subscribeToPromoCodes((livePromos) => {
      setPromoCodesList(livePromos || []);
    });
    return () => unsub();
  }, []);

  const handleCreatePromoCode = async (e) => {
    if (e) e.preventDefault();
    const code = newPromoForm.code.trim().toUpperCase();
    if (!code) {
      showToast('Please enter a Promo Code (e.g. FESTIVE25)');
      return;
    }
    const pct = Number(newPromoForm.discountPercentage);
    if (!pct || pct <= 0 || pct > 100) {
      showToast('Please enter a valid offer percentage (1 - 100%)');
      return;
    }
    const limit = Number(newPromoForm.maxDiscountAmount);
    if (!limit || limit <= 0) {
      showToast('Please enter the code amount limit (e.g. 40000)');
      return;
    }

    setIsSubmittingPromo(true);
    try {
      await createPromoCode({
        code,
        discountPercentage: pct,
        maxDiscountAmount: limit,
        minOrderAmount: Number(newPromoForm.minOrderAmount) || 0,
        description: newPromoForm.description.trim() || `${pct}% OFF on orders upto ₹${limit.toLocaleString('en-IN')}`,
        validTill: newPromoForm.validTill.trim() || 'Valid until stocks last',
        status: 'active'
      });
      showToast(`Promo code "${code}" published to Firestore and storefront!`);
      setNewPromoForm({
        code: '',
        discountPercentage: '',
        maxDiscountAmount: '',
        minOrderAmount: '',
        description: '',
        validTill: 'Valid until stocks last'
      });
      setIsAddPromoModalOpen(false);
    } catch (err) {
      console.error('Error creating promo code:', err);
      showToast(`Error: ${err.message}`);
    } finally {
      setIsSubmittingPromo(false);
    }
  };

  const handleDeletePromoCode = async (id, code) => {
    if (window.confirm(`Are you sure you want to delete promo code "${code}"? It will be removed from the storefront.`)) {
      try {
        await deletePromoCode(id);
        showToast(`Promo code "${code}" deleted from database.`);
      } catch (err) {
        showToast(`Failed to delete: ${err.message}`);
      }
    }
  };

  const handleTogglePromoStatus = async (id, currentStatus, code) => {
    try {
      const next = await togglePromoCodeStatus(id, currentStatus);
      showToast(`Promo code "${code}" is now ${next}.`);
    } catch (err) {
      showToast(`Failed to update promo status: ${err.message}`);
    }
  };

  // Categories Management State (Live Firestore sync)
  const [categoriesList, setCategoriesList] = useState(propCategories || []);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [categorySearch, setCategorySearch] = useState('');
  const [categoryDeptFilter, setCategoryDeptFilter] = useState('all');
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [savingCategory, setSavingCategory] = useState(false);
  const [categoryForm, setCategoryForm] = useState({
    id: '',
    name: '',
    category: 'furniture',
    image: '',
    badge: '',
    order: 1
  });

  useEffect(() => {
    const unsub = subscribeToCategories((liveCats) => {
      setCategoriesList(liveCats || []);
      setLoadingCategories(false);
    });
    return () => unsub();
  }, []);

  const handleOpenAddCategory = () => {
    setEditingCategory(null);
    setCategoryForm({
      id: '',
      name: '',
      category: 'furniture',
      image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=600&q=80',
      badge: 'Popular',
      order: categoriesList.length + 1
    });
    setIsCategoryModalOpen(true);
  };

  const handleOpenEditCategory = (cat) => {
    setEditingCategory(cat);
    setCategoryForm({
      id: cat.id || '',
      name: cat.name || '',
      category: cat.category || 'furniture',
      image: cat.image || '',
      badge: cat.badge || '',
      order: cat.order || 1
    });
    setIsCategoryModalOpen(true);
  };

  const handleSaveCategory = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!categoryForm.name.trim()) {
      showToast('Please enter a Category Title');
      return;
    }
    setSavingCategory(true);
    try {
      const generatedSlug = (categoryForm.id || categoryForm.name)
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');

      if (editingCategory) {
        await updateCategory(editingCategory.id, {
          name: categoryForm.name.trim(),
          category: categoryForm.category,
          image: categoryForm.image.trim() || 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=600&q=80',
          badge: categoryForm.badge.trim(),
          order: Number(categoryForm.order) || 1
        });
        showToast(`Category "${categoryForm.name}" updated successfully!`);
      } else {
        await createCategory({
          id: generatedSlug,
          name: categoryForm.name.trim(),
          category: categoryForm.category,
          image: categoryForm.image.trim() || 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=600&q=80',
          badge: categoryForm.badge.trim(),
          order: Number(categoryForm.order) || (categoriesList.length + 1)
        });
        showToast(`Category "${categoryForm.name}" created and synced with Firestore!`);
      }
      setIsCategoryModalOpen(false);
      setEditingCategory(null);
    } catch (err) {
      console.error('Error saving category:', err);
      showToast(`Error: ${err.message}`);
    } finally {
      setSavingCategory(false);
    }
  };

  const handleDeleteCategory = async (catId, catName) => {
    if (window.confirm(`Are you sure you want to delete category "${catName}"? This will remove it from the storefront and Firestore database.`)) {
      try {
        await deleteCategory(catId);
        showToast(`Category "${catName}" deleted from Firestore`);
      } catch (err) {
        console.error('Error deleting category:', err);
        showToast(`Error: ${err.message}`);
      }
    }
  };

  const handleResetDefaultCategories = async () => {
    if (window.confirm('Restore initial default 8 showroom categories to Cloud Firestore?')) {
      try {
        await seedCategoriesToFirestore();
        showToast('Default 8 categories restored to Cloud Firestore!');
      } catch (err) {
        showToast(`Error restoring categories: ${err.message}`);
      }
    }
  };

  // Handlers for Firebase Admin Authentication
  const handleLogin = async (e) => {
    if (e) e.preventDefault();
    if (!loginEmail.trim() || !loginPassword.trim()) {
      setLoginError('Please enter both Administrator Email and Password');
      return;
    }

    setIsSubmitting(true);
    setLoginError('');

    try {
      const result = await login(loginEmail, loginPassword);
      if (!result.isAdmin) {
        setLoginError(
          'Unauthorized: Your credentials were authenticated by Firebase, but this account does NOT have verified administrator privileges (custom claim "admin: true"). Ordinary customers cannot access this admin panel. Run "npm run set-admin <email>" to grant admin rights.'
        );
        await logout();
      } else {
        showToast('Welcome back, Administrator!');
      }
    } catch (err) {
      const code = err.code || err.message || '';
      if (code.includes('invalid-credential') || code.includes('wrong-password') || code.includes('user-not-found')) {
        setLoginError('Invalid administrator email or password.');
      } else if (code.includes('too-many-requests')) {
        setLoginError('Access temporarily blocked due to repeated failed attempts. Please try again later.');
      } else {
        setLoginError(err.message || 'Authentication failed. Please verify connection.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!loginEmail.trim()) {
      setLoginError('Please enter your administrator email above to receive password reset instructions.');
      return;
    }
    setIsSubmitting(true);
    try {
      await resetPassword(loginEmail);
      showToast(`Password reset link sent to ${loginEmail}`);
      setLoginError('');
    } catch (err) {
      setLoginError(err.message || 'Failed to send password reset email.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRefreshClaims = async () => {
    setIsSubmitting(true);
    try {
      const hasAdmin = await refreshClaims();
      if (hasAdmin) {
        showToast('Administrator privileges verified successfully!');
        setLoginError('');
      } else {
        setLoginError('No administrator claim found on this account yet. Ensure "npm run set-admin" was run successfully.');
      }
    } catch (err) {
      setLoginError(err.message || 'Claim verification failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      showToast('Logged out of Admin Panel');
      if (onLogoutAdmin) {
        onLogoutAdmin();
      } else if (onBackToStore) {
        onBackToStore();
      }
    } catch (err) {
      console.warn('Logout error:', err);
    }
  };

  const handleSeedCatalogClick = async () => {
    if (window.confirm('Sync and seed the catalog into Cloud Firestore? This will populate the Firestore products collection with the store products.')) {
      setIsSeeding(true);
      try {
        if (onSeedCatalog) {
          await onSeedCatalog();
        } else {
          await seedProductsToFirestore();
        }
        showToast('Firestore catalog synced successfully!');
      } catch (err) {
        showToast('Seeding error: ' + err.message);
      } finally {
        setIsSeeding(false);
      }
    }
  };

  // 1. Real-time listener for Enquiries in Firestore
  useEffect(() => {
    const unsub = subscribeToEnquiriesAdmin((live) => {
      setEnquiries(live || []);
      setLoadingEnquiries(false);
    });
    return () => unsub();
  }, []);

  // 1b. Real-time listener for Customer Reviews & Contact Feedback in Firestore
  useEffect(() => {
    const unsub = subscribeToReviews((live) => {
      setCustomerReviews(live || []);
      setLoadingReviews(false);
    });
    return () => unsub();
  }, []);

  // 2. Real-time listener for Store Settings & Website CMS in Firestore
  useEffect(() => {
    const unsub = subscribeToStoreSettings((live) => {
      if (live) {
        setStoreSettings(live);
        setSiteContent(live);
      }
    });
    return () => unsub();
  }, []);

  // 3. Sync Admin Profile from authenticated Firebase user
  useEffect(() => {
    if (currentUser) {
      setAdminProfile({
        name: currentUser.displayName || (isSuperAdmin ? 'Super Administrator' : 'Administrator'),
        email: currentUser.email || '',
        role: isSuperAdmin ? 'Super Admin' : (isAdmin ? 'Shop Admin' : 'Employee'),
        phone: currentUser.phoneNumber || ''
      });
    }
  }, [currentUser, isAdmin, isSuperAdmin]);

  // Enquiry Actions (Update Status & Delete)
  const handleUpdateEnquiryStatus = async (enquiryId, nextStatus) => {
    try {
      await updateEnquiryStatus(enquiryId, nextStatus);
      setEnquiries((prev) => prev.map((e) => e.id === enquiryId ? { ...e, status: nextStatus } : e));
      showToast(`Enquiry marked as "${nextStatus}"`);
    } catch (err) {
      showToast('Error updating enquiry: ' + err.message);
    }
  };

  const handleDeleteEnquiry = async (enquiryId, customerName) => {
    if (window.confirm(`Delete enquiry from "${customerName || 'customer'}"?`)) {
      try {
        await deleteEnquiry(enquiryId);
        setEnquiries((prev) => prev.filter((e) => e.id !== enquiryId));
        showToast('Enquiry deleted from Firestore');
      } catch (err) {
        showToast('Error deleting enquiry: ' + err.message);
      }
    }
  };

  // Store Configuration Save Handler (Saves to Firestore settings/store_config)
  const handleSaveStoreConfig = async (updatedConfig, message = 'Settings saved to Firebase successfully!') => {
    setSavingSettings(true);
    try {
      await saveStoreSettings(updatedConfig);
      setStoreSettings((prev) => ({ ...prev, ...updatedConfig }));
      setSiteContent((prev) => ({ ...prev, ...updatedConfig }));
      showToast(message);
    } catch (err) {
      showToast('Error saving settings to Firebase: ' + err.message);
    } finally {
      setSavingSettings(false);
    }
  };

  // Admin Password Update Handler (Updates Firebase Authentication user credentials)
  const handleUpdateAdminPassword = async () => {
    if (!adminPasswordForm.newPassword) {
      alert('Please enter a new password');
      return;
    }
    if (adminPasswordForm.newPassword.length < 6) {
      alert('Password must be at least 6 characters long');
      return;
    }
    if (adminPasswordForm.newPassword !== adminPasswordForm.confirmPassword) {
      alert('New password and confirmation do not match');
      return;
    }

    setUpdatingPassword(true);
    try {
      if (auth.currentUser) {
        await updatePassword(auth.currentUser, adminPasswordForm.newPassword);
        setAdminPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
        showToast('Admin password updated successfully in Firebase!');
      } else {
        alert('No active Firebase user session found.');
      }
    } catch (err) {
      if (err.code === 'auth/requires-recent-login') {
        alert('For security reasons, please log out and log in again before changing your password, or use the password reset link.');
      } else {
        alert(err.message || 'Failed to update admin password in Firebase.');
      }
    } finally {
      setUpdatingPassword(false);
    }
  };

  // Staff & Admin User Management Functions (Super Admin)
  const loadStaff = async () => {
    setLoadingStaff(true);
    try {
      const data = await getStaffUsers();
      setStaffList(data);
    } catch (err) {
      console.warn('Could not load staff list:', err);
    } finally {
      setLoadingStaff(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'admin-users') {
      loadStaff();
    }
  }, [activeTab]);

  const handleCreateStaffSubmit = async (e) => {
    e.preventDefault();
    setStaffError('');
    if (!newStaffForm.name.trim() || !newStaffForm.email.trim() || !newStaffForm.password) {
      setStaffError('Please enter Full Name, Email, and Password');
      return;
    }
    if (newStaffForm.password.length < 6) {
      setStaffError('Password must be at least 6 characters');
      return;
    }

    setCreatingStaff(true);
    try {
      const created = await createStaffAccount({
        name: newStaffForm.name,
        email: newStaffForm.email,
        password: newStaffForm.password,
        role: newStaffForm.role,
        phone: newStaffForm.phone,
        createdBy: currentUser?.email || 'super_admin'
      });

      // Save credentials for the modal to display clearly
      setCreatedStaffCreds({
        name: newStaffForm.name,
        email: newStaffForm.email,
        password: newStaffForm.password,
        role: newStaffForm.role
      });

      setStaffList((prev) => [created, ...prev.filter((s) => s.id !== created.id)]);
      showToast(`Created ${created.role} login for ${created.name}!`);
      setNewStaffForm({ name: '', email: '', password: '', role: 'shop_admin', phone: '' });
    } catch (err) {
      const msg = err.code || err.message || '';
      if (msg.includes('email-already-in-use')) {
        setStaffError('An account with this email address already exists in Firebase Authentication.');
      } else {
        setStaffError(err.message || 'Failed to create staff account.');
      }
    } finally {
      setCreatingStaff(false);
    }
  };

  const handleToggleStaffStatus = async (staffMember) => {
    const nextStatus = staffMember.status === 'Active' ? 'Suspended' : 'Active';
    try {
      await updateStaffStatus(staffMember.id, nextStatus);
      setStaffList((prev) => prev.map((s) => s.id === staffMember.id ? { ...s, status: nextStatus } : s));
      showToast(`Status updated to "${nextStatus}" for ${staffMember.name}`);
    } catch (err) {
      showToast('Error updating status: ' + err.message);
    }
  };

  const handleDeleteStaff = async (staffId, staffName) => {
    if (window.confirm(`Are you sure you want to remove "${staffName}" from staff records?`)) {
      try {
        await deleteStaffUser(staffId);
        setStaffList((prev) => prev.filter((s) => s.id !== staffId));
        showToast(`Staff account "${staffName}" removed`);
      } catch (err) {
        showToast('Error deleting staff: ' + err.message);
      }
    }
  };

  const handleGeneratePassword = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%';
    let pass = '';
    for (let i = 0; i < 10; i++) {
      pass += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setNewStaffForm((prev) => ({ ...prev, password: pass }));
  };

  const handleCopyText = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(''), 2500);
  };

  // Calculations for KPI Cards (Real live data directly from Firebase)
  const totalProductsCount = products.length;
  const totalOrdersCount = orders.length;
  const totalRevenue = orders.reduce((sum, o) => sum + (Number(o.total) || 0), 0);
  const totalEnquiriesCount = enquiries.length;

  // Real Category Analytics computed directly from live catalog
  const furnitureProducts = products.filter((p) => p.category === 'furniture');
  const electronicsProducts = products.filter((p) => p.category === 'electronics');
  const appliancesProducts = products.filter((p) => p.category === 'appliances');
  const totalCategoryItems = Math.max(furnitureProducts.length + electronicsProducts.length + appliancesProducts.length, 1);
  const furniturePct = Math.round((furnitureProducts.length / totalCategoryItems) * 100);
  const electronicsPct = Math.round((electronicsProducts.length / totalCategoryItems) * 100);
  const appliancesPct = Math.max(0, 100 - furniturePct - electronicsPct);

  // Dynamic sales breakdown based on selected period: 'This Week', 'This Month', or 'This Year'
  let salesOverviewBars = [];

  if (salesPeriod === 'This Month') {
    // Show 12 months: Jan, Feb, Mar, Apr, May, Jun, Jul, Aug, Sep, Oct, Nov, Dec
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthlySalesMap = {};
    monthNames.forEach((m) => { monthlySalesMap[m] = 0; });

    orders.forEach((o) => {
      let d = new Date();
      if (o.createdAt?.toDate) {
        d = o.createdAt.toDate();
      } else if (o.date) {
        d = new Date(o.date);
      }
      if (!isNaN(d.getTime())) {
        const mName = monthNames[d.getMonth()];
        if (monthlySalesMap[mName] !== undefined) {
          monthlySalesMap[mName] += Number(o.total) || 0;
        }
      }
    });

    const maxMonthlySale = Math.max(...Object.values(monthlySalesMap), 1000);
    salesOverviewBars = monthNames.map((month) => {
      const amt = monthlySalesMap[month] || 0;
      return {
        day: month,
        amount: amt > 0 ? (amt >= 1000 ? `₹${Math.round(amt / 1000)}K` : `₹${amt}`) : '₹0',
        fillHeight: amt > 0 ? Math.max(Math.round((amt / maxMonthlySale) * 95), 14) : 6
      };
    });
  } else if (salesPeriod === 'This Year') {
    // Show years: 2024, 2025, 2026, 2027, 2028
    const currentYear = new Date().getFullYear();
    const yearList = [
      String(currentYear - 2),
      String(currentYear - 1),
      String(currentYear),
      String(currentYear + 1),
      String(currentYear + 2)
    ];
    const yearSalesMap = {};
    yearList.forEach((yr) => { yearSalesMap[yr] = 0; });

    orders.forEach((o) => {
      let d = new Date();
      if (o.createdAt?.toDate) {
        d = o.createdAt.toDate();
      } else if (o.date) {
        d = new Date(o.date);
      }
      if (!isNaN(d.getTime())) {
        const yrStr = String(d.getFullYear());
        if (yearSalesMap[yrStr] !== undefined) {
          yearSalesMap[yrStr] += Number(o.total) || 0;
        }
      }
    });

    const maxYearSale = Math.max(...Object.values(yearSalesMap), 1000);
    salesOverviewBars = yearList.map((yr) => {
      const amt = yearSalesMap[yr] || 0;
      return {
        day: yr,
        amount: amt > 0 ? (amt >= 1000 ? `₹${Math.round(amt / 1000)}K` : `₹${amt}`) : '₹0',
        fillHeight: amt > 0 ? Math.max(Math.round((amt / maxYearSale) * 95), 14) : 6
      };
    });
  } else {
    // Default: 'This Week' (Mon, Tue, Wed, Thu, Fri, Sat, Sun)
    const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const dailySalesMap = { Mon: 0, Tue: 0, Wed: 0, Thu: 0, Fri: 0, Sat: 0, Sun: 0 };
    orders.forEach((o) => {
      let d = new Date();
      if (o.createdAt?.toDate) {
        d = o.createdAt.toDate();
      } else if (o.date) {
        d = new Date(o.date);
      }
      const dayName = isNaN(d.getTime()) ? null : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][d.getDay()];
      if (dayName && dailySalesMap[dayName] !== undefined) {
        dailySalesMap[dayName] += Number(o.total) || 0;
      }
    });
    const maxDailySale = Math.max(...Object.values(dailySalesMap), 1000);
    salesOverviewBars = daysOfWeek.map((day) => {
      const amt = dailySalesMap[day] || 0;
      return {
        day,
        amount: amt > 0 ? (amt >= 1000 ? `₹${Math.round(amt / 1000)}K` : `₹${amt}`) : '₹0',
        fillHeight: amt > 0 ? Math.max(Math.round((amt / maxDailySale) * 95), 14) : 6
      };
    });
  }

  // Dynamic Customer Aggregation from live Firestore orders
  const customerList = [];
  const customerMap = {};
  orders.forEach((o) => {
    const key = o.customer?.phone || o.customer?.email || (o.customer?.name ? o.customer.name.toLowerCase() : null) || o.customerUid;
    if (!key) return;
    if (!customerMap[key]) {
      customerMap[key] = {
        id: key,
        name: o.customer?.name || 'Store Customer',
        phone: o.customer?.phone || '—',
        email: o.customer?.email || '—',
        address: o.customer?.address || '',
        city: o.customer?.city || '—',
        state: o.customer?.state || 'Tamil Nadu',
        pincode: o.customer?.pincode || '',
        orderCount: 1,
        totalSpent: Number(o.total) || 0,
        lastOrder: o.date?.split(',')[0] || 'Recent',
        lastOrderId: o.id
      };
      customerList.push(customerMap[key]);
    } else {
      customerMap[key].orderCount += 1;
      customerMap[key].totalSpent += (Number(o.total) || 0);
      if (o.customer?.address && (!customerMap[key].address || customerMap[key].address === '—')) {
        customerMap[key].address = o.customer.address;
      }
      if (o.customer?.email && (!customerMap[key].email || customerMap[key].email === '—')) {
        customerMap[key].email = o.customer.email;
      }
    }
  });

  // Total Catalog Inventory Valuation
  const totalCatalogInventoryValue = products.reduce((sum, p) => sum + ((Number(p.price) || 0) * (Number(p.stock) || 10)), 0);

  const formatPrice = (val) => {

    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val || 0);
  };

  // Loading state while checking Firebase ID token custom claims
  if (authLoading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#f8fafc',
        gap: '14px',
        color: '#4a2818',
        fontWeight: 700
      }}>
        <Loader2 size={36} className="animate-spin" style={{ color: '#d97706' }} />
        <p>Verifying Staff Authorization...</p>
      </div>
    );
  }

  // -------------------------------------------------------------
  // VIEW 1: LOGIN & ACCESS SCREEN (Matches Screenshot Part 1)
  // -------------------------------------------------------------
  if (!isAuthenticated) {
    return (
      <div className="admin-login-layout animate-fade-in">
        {/* Left Visual Column */}
        <div className="login-visual-panel">
          <div className="visual-overlay"></div>
          <div className="visual-content">
            <div className="brand-logo-badge">
              <div className="brand-icon-box">
                <Sparkles size={28} />
              </div>
              <div className="brand-text">
                <h1>Sardar Mart</h1>
                <span>FURNITURE AND HOME APPLIANCES</span>
              </div>
            </div>

            <div className="visual-hero-text">
              <h2>Admin Panel Access</h2>
              <p>Manage Products • Orders • Enquiries • Offers • Website Content</p>
            </div>

            <div className="trust-pills-row">
              <div className="trust-pill-box">
                <Lock size={18} />
                <span>Secure Access</span>
              </div>
              <div className="trust-pill-box">
                <ShieldCheck size={18} />
                <span>Data Protection</span>
              </div>
              <div className="trust-pill-box">
                <CheckCircle size={18} />
                <span>Easy Management</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Form Card Column */}
        <div className="login-form-panel">
          <div className="login-card">
            <div className="card-top-icon-wrap">
              <div className="login-sofa-icon">
                <Home size={26} />
              </div>
            </div>

            <h3 className="login-title">Welcome Back</h3>
            <p className="login-subtitle">Login to Admin Panel</p>

            <form onSubmit={handleLogin} className="login-inputs-form">
              {loginError && (
                <div className="login-error-alert animate-fade-in">
                  <AlertCircle size={16} />
                  <span>{loginError}</span>
                </div>
              )}

              <div className="login-input-group">
                <div className="input-with-icon">
                  <Mail size={18} className="field-icon" />
                  <input
                    id="admin-login-email"
                    name="email"
                    type="email"
                    autoComplete="username"
                    aria-label="Admin email address"
                    placeholder="Enter your email address"
                    value={loginEmail}
                    onChange={(e) => {
                      setLoginEmail(e.target.value);
                      setLoginError('');
                    }}
                    required
                  />
                </div>
              </div>

              <div className="login-input-group">
                <div className="input-with-icon">
                  <Lock size={18} className="field-icon" />
                  <input
                    id="admin-login-password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    aria-label="Admin password"
                    placeholder="Enter your password"
                    value={loginPassword}
                    onChange={(e) => {
                      setLoginPassword(e.target.value);
                      setLoginError('');
                    }}
                    required
                  />
                  <button
                    type="button"
                    className="eye-toggle-btn"
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex="-1"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div className="login-options-row">
                <label className="remember-label" htmlFor="admin-remember-me">
                  <input
                    id="admin-remember-me"
                    name="rememberMe"
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  <span>Remember me</span>
                </label>
                <button
                  type="button"
                  className="forgot-pass-btn"
                  onClick={handleForgotPassword}
                  disabled={isSubmitting}
                >
                  Forgot password?
                </button>
              </div>

              <button type="submit" className="login-primary-btn" disabled={isSubmitting}>
                {isSubmitting ? (
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                    <Loader2 size={16} className="animate-spin" /> Authenticating...
                  </span>
                ) : (
                  'Login to Staff Portal'
                )}
              </button>

              {currentUser && !isAdmin && (
                <div style={{
                  marginTop: '16px',
                  padding: '12px 14px',
                  background: '#fef2f2',
                  border: '1px solid #fecaca',
                  borderRadius: '10px',
                  fontSize: '0.82rem',
                  color: '#991b1b',
                  lineHeight: 1.5
                }}>
                  <div style={{ fontWeight: 700, marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <ShieldAlert size={16} /> Non-Admin Account Detected
                  </div>
                  <div>Signed in as: <strong>{currentUser.email}</strong></div>
                  <div style={{ margin: '6px 0 10px 0', color: '#7f1d1d' }}>
                    This account lacks verified <code>admin: true</code> custom claims.
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      type="button"
                      onClick={handleRefreshClaims}
                      disabled={isSubmitting}
                      style={{
                        flex: 1,
                        padding: '6px 10px',
                        background: '#2b170e',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '6px',
                        fontWeight: 700,
                        fontSize: '0.78rem',
                        cursor: 'pointer'
                      }}
                    >
                      {isSubmitting ? 'Checking...' : 'Refresh Claims'}
                    </button>
                    <button
                      type="button"
                      onClick={handleLogout}
                      style={{
                        flex: 1,
                        padding: '6px 10px',
                        background: '#dc2626',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '6px',
                        fontWeight: 700,
                        fontSize: '0.78rem',
                        cursor: 'pointer'
                      }}
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              )}

              <div className="login-or-divider">
                <span>or</span>
              </div>

              <button
                type="button"
                className="demo-instant-btn"
                onClick={handleRefreshClaims}
                disabled={isSubmitting}
                title="Force refresh Firebase ID token to verify new custom claims assigned via CLI"
              >
                <RefreshCw size={16} className={isSubmitting ? 'animate-spin' : ''} /> Check / Refresh Admin Claims
              </button>

              <div className="login-footer-note" style={{ fontSize: '0.78rem', color: '#78716c' }}>
                Protected Staff Portal • Requires verified Firebase Admin custom claims.
              </div>

              <div className="back-store-wrap">
                <button
                  type="button"
                  className="back-store-btn"
                  onClick={onBackToStore}
                >
                  <ArrowLeft size={14} /> Back to Storefront
                </button>
              </div>
            </form>
          </div>
        </div>

        <style>{`
          .admin-login-layout {
            min-height: 100vh;
            display: grid;
            grid-template-columns: 1fr 1fr;
            background: #f8fafc;
          }
          .login-visual-panel {
            position: relative;
            background: url('https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1200&q=80') center/cover no-repeat;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 48px;
            color: #ffffff;
          }
          .visual-overlay {
            position: absolute;
            inset: 0;
            background: linear-gradient(135deg, rgba(43, 23, 14, 0.94) 0%, rgba(61, 35, 20, 0.88) 100%);
          }
          .visual-content {
            position: relative;
            z-index: 2;
            max-width: 520px;
            display: flex;
            flex-direction: column;
            gap: 40px;
          }
          .brand-logo-badge {
            display: flex;
            align-items: center;
            gap: 14px;
          }
          .brand-icon-box {
            width: 48px;
            height: 48px;
            border-radius: 12px;
            background: rgba(255, 255, 255, 0.15);
            display: flex;
            align-items: center;
            justify-content: center;
            border: 1px solid rgba(255, 255, 255, 0.25);
          }
          .brand-text h1 {
            font-size: 1.8rem;
            font-weight: 800;
            margin: 0;
            color: #ffffff;
            letter-spacing: -0.5px;
          }
          .brand-text span {
            font-size: 0.72rem;
            color: #fde68a;
            font-weight: 700;
            letter-spacing: 1.5px;
          }
          .visual-hero-text h2 {
            font-size: 2.2rem;
            font-weight: 800;
            margin-bottom: 12px;
            color: #ffffff;
          }
          .visual-hero-text p {
            font-size: 0.95rem;
            color: #e2e8f0;
            line-height: 1.6;
          }
          .trust-pills-row {
            display: flex;
            gap: 14px;
            flex-wrap: wrap;
          }
          .trust-pill-box {
            display: flex;
            align-items: center;
            gap: 8px;
            background: rgba(255, 255, 255, 0.12);
            padding: 8px 16px;
            border-radius: 24px;
            font-size: 0.82rem;
            font-weight: 700;
            color: #ffffff;
            border: 1px solid rgba(255, 255, 255, 0.2);
          }

          /* Right Form Column */
          .login-form-panel {
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 40px 24px;
            background: #ffffff;
          }
          .login-card {
            width: 100%;
            max-width: 420px;
            display: flex;
            flex-direction: column;
            align-items: center;
            text-align: center;
          }
          .card-top-icon-wrap {
            margin-bottom: 16px;
          }
          .login-sofa-icon {
            width: 58px;
            height: 58px;
            border-radius: 14px;
            background: #fef3c7;
            color: #854d0e;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .login-title {
            font-size: 1.7rem;
            font-weight: 800;
            color: #0f172a;
            margin-bottom: 4px;
          }
          .login-subtitle {
            font-size: 0.9rem;
            color: #64748b;
            margin-bottom: 24px;
          }
          .login-inputs-form {
            width: 100%;
            text-align: left;
          }
          .login-error-alert {
            background: #fef2f2;
            color: #b91c1c;
            border: 1px solid #fecaca;
            padding: 10px 14px;
            border-radius: 8px;
            font-size: 0.82rem;
            display: flex;
            align-items: center;
            gap: 8px;
            margin-bottom: 16px;
          }
          .login-input-group {
            margin-bottom: 16px;
          }
          .input-with-icon {
            position: relative;
            display: flex;
            align-items: center;
          }
          .field-icon {
            position: absolute;
            left: 14px;
            color: #94a3b8;
          }
          .input-with-icon input {
            width: 100%;
            padding: 12px 42px 12px 42px;
            border: 1.5px solid #cbd5e1;
            border-radius: 8px;
            font-size: 0.9rem;
            color: #0f172a;
            outline: none;
            transition: all 0.2s ease;
          }
          .input-with-icon input:focus {
            border-color: #854d0e;
            box-shadow: 0 0 0 3px rgba(133, 77, 14, 0.15);
          }
          .eye-toggle-btn {
            position: absolute;
            right: 14px;
            background: none;
            border: none;
            color: #94a3b8;
            cursor: pointer;
            padding: 0;
            display: flex;
            align-items: center;
          }

          .login-options-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 0.82rem;
            margin-bottom: 20px;
          }
          .remember-label {
            display: flex;
            align-items: center;
            gap: 6px;
            color: #475569;
            cursor: pointer;
          }
          .forgot-pass-btn {
            background: none;
            border: none;
            color: #854d0e;
            font-weight: 600;
            cursor: pointer;
            padding: 0;
          }

          .login-primary-btn {
            width: 100%;
            background: #854d0e;
            color: #ffffff;
            border: none;
            padding: 12px;
            border-radius: 8px;
            font-size: 0.95rem;
            font-weight: 700;
            cursor: pointer;
            transition: background 0.2s ease;
          }
          .login-primary-btn:hover {
            background: #713f12;
          }

          .login-or-divider {
            position: relative;
            text-align: center;
            margin: 18px 0;
          }
          .login-or-divider::before {
            content: '';
            position: absolute;
            top: 50%;
            left: 0;
            right: 0;
            height: 1px;
            background: #e2e8f0;
          }
          .login-or-divider span {
            position: relative;
            background: #ffffff;
            padding: 0 12px;
            font-size: 0.8rem;
            color: #94a3b8;
          }

          .google-login-btn {
            width: 100%;
            background: #ffffff;
            border: 1.5px solid #cbd5e1;
            color: #334155;
            padding: 11px;
            border-radius: 8px;
            font-size: 0.9rem;
            font-weight: 600;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
            cursor: pointer;
            transition: all 0.2s ease;
            margin-bottom: 12px;
          }
          .google-login-btn:hover {
            background: #f8fafc;
            border-color: #94a3b8;
          }

          .demo-instant-btn {
            width: 100%;
            background: #fef3c7;
            border: 1px dashed #d97706;
            color: #92400e;
            padding: 10px;
            border-radius: 8px;
            font-size: 0.84rem;
            font-weight: 700;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            cursor: pointer;
            margin-bottom: 18px;
          }
          .demo-instant-btn:hover {
            background: #fde68a;
          }

          .login-footer-note {
            text-align: center;
            font-size: 0.82rem;
            color: #64748b;
          }
          .contact-link {
            color: #854d0e;
            font-weight: 700;
            cursor: pointer;
          }

          .back-store-wrap {
            margin-top: 24px;
            text-align: center;
          }
          .back-store-btn {
            background: none;
            border: none;
            color: #64748b;
            font-size: 0.82rem;
            font-weight: 600;
            display: inline-flex;
            align-items: center;
            gap: 6px;
            cursor: pointer;
          }
          .back-store-btn:hover {
            color: #0f172a;
          }

          @media (max-width: 860px) {
            .admin-login-layout {
              grid-template-columns: 1fr;
            }
            .login-visual-panel {
              display: none;
            }
            .login-form-panel {
              padding: 40px 16px;
            }
          }

          @media (max-width: 480px) {
            .login-form-panel {
              padding: 24px 12px;
            }
            .login-card {
              max-width: 100%;
            }
            .login-title {
              font-size: 1.4rem;
            }
            .login-subtitle {
              font-size: 0.8rem;
              margin-bottom: 18px;
            }
            .demo-creds-row {
              flex-direction: column;
              gap: 4px;
            }
            .login-inputs-form input {
              font-size: 0.85rem;
              padding: 10px 36px;
            }
          }
        `}</style>
      </div>
    );
  }

  // -------------------------------------------------------------
  // VIEW 2: AUTHENTICATED EXECUTIVE DASHBOARD & PORTAL
  // -------------------------------------------------------------
  return (
    <div className="admin-portal-wrapper">
      {/* Toast */}
      {toast && (
        <div className="admin-toast-banner animate-fade-in">
          <span>{toast}</span>
        </div>
      )}

      {/* Mobile Drawer Overlay */}
      {mobileSidebarOpen && (
        <div 
          className="admin-mobile-backdrop" 
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* LEFT SIDEBAR (Dark brand luxury brown styling matching screenshot) */}
      <aside className={`admin-sidebar ${sidebarCollapsed ? 'collapsed' : ''} ${mobileSidebarOpen ? 'mobile-open' : ''}`}>
        {/* Brand Header */}
        <div className="sidebar-brand-header">
          <div className="sidebar-brand-icon">
            <img 
              src="/logo.png" 
              alt="Sardar Mart Furniture and Home Appliances" 
              style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: '6px' }} 
            />
          </div>
          {!sidebarCollapsed && (
            <div className="sidebar-brand-title">
              <h3>Sardar Mart</h3>
              <small>FURNITURE AND HOME APPLIANCES</small>
            </div>
          )}
          <button 
            className="mobile-close-sidebar" 
            onClick={() => setMobileSidebarOpen(false)}
          >
            <X size={18} />
          </button>
        </div>

        {/* Navigation Menu */}
        <nav className="sidebar-nav-menu">
          <button 
            className={`nav-item-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => { setActiveTab('dashboard'); setMobileSidebarOpen(false); }}
            title="Dashboard"
          >
            <LayoutDashboard size={19} />
            {!sidebarCollapsed && <span>Dashboard</span>}
          </button>

          <button 
            className={`nav-item-btn ${activeTab === 'products' ? 'active' : ''}`}
            onClick={() => { setActiveTab('products'); setMobileSidebarOpen(false); }}
            title="Products"
          >
            <Package size={19} />
            {!sidebarCollapsed && <span>Products</span>}
            {!sidebarCollapsed && <span className="sidebar-count-badge">{products.length}</span>}
          </button>

          <button 
            className={`nav-item-btn ${activeTab === 'categories' ? 'active' : ''}`}
            onClick={() => { setActiveTab('categories'); setMobileSidebarOpen(false); }}
            title="Categories"
          >
            <Layers size={19} />
            {!sidebarCollapsed && <span>Categories</span>}
            {!sidebarCollapsed && <span className="sidebar-count-badge">{categoriesList.length}</span>}
          </button>

          <button 
            className={`nav-item-btn ${activeTab === 'orders' || activeTab === 'invoices' ? 'active' : ''}`}
            onClick={() => { setActiveTab('orders'); setMobileSidebarOpen(false); }}
            title="Orders & Billing"
          >
            <ShoppingCart size={19} />
            {!sidebarCollapsed && <span>Orders</span>}
            {!sidebarCollapsed && <span className="sidebar-count-badge gold">{orders.length}</span>}
          </button>

          <button 
            className={`nav-item-btn ${activeTab === 'billing' ? 'active' : ''}`}
            onClick={() => { setActiveTab('billing'); setMobileSidebarOpen(false); }}
            title="Showroom POS Billing"
          >
            <CreditCard size={19} />
            {!sidebarCollapsed && <span>POS Billing</span>}
          </button>

          <button 
            className={`nav-item-btn ${activeTab === 'enquiries' ? 'active' : ''}`}
            onClick={() => { setActiveTab('enquiries'); setMobileSidebarOpen(false); }}
            title="Enquiries"
          >
            <MessageSquare size={19} />
            {!sidebarCollapsed && <span>Enquiries</span>}
            {!sidebarCollapsed && (
              <span className="sidebar-count-badge orange">
                {enquiries.filter(e => e.status === 'New').length || enquiries.length}
              </span>
            )}
          </button>

          <button 
            className={`nav-item-btn ${activeTab === 'customers' ? 'active' : ''}`}
            onClick={() => { setActiveTab('customers'); setMobileSidebarOpen(false); }}
            title="Customers"
          >
            <Users size={19} />
            {!sidebarCollapsed && <span>Customers</span>}
          </button>

          <button 
            className={`nav-item-btn ${activeTab === 'offers' ? 'active' : ''}`}
            onClick={() => { setActiveTab('offers'); setMobileSidebarOpen(false); }}
            title="Promo Codes & Discounts"
          >
            <Tag size={19} />
            {!sidebarCollapsed && <span>Promo Codes</span>}
            {!sidebarCollapsed && <span className="sidebar-count-badge gold">{promoCodesList.length}</span>}
          </button>

          <button 
            className={`nav-item-btn ${activeTab === 'content' ? 'active' : ''}`}
            onClick={() => { setActiveTab('content'); setMobileSidebarOpen(false); }}
            title="Website Content"
          >
            <Globe size={19} />
            {!sidebarCollapsed && <span>Website Content</span>}
          </button>

          <button 
            className={`nav-item-btn ${activeTab === 'reviews' ? 'active' : ''}`}
            onClick={() => { setActiveTab('reviews'); setMobileSidebarOpen(false); }}
            title="Customer Reviews & Feedback"
          >
            <Star size={19} />
            {!sidebarCollapsed && <span>Reviews &amp; Feedback</span>}
            {!sidebarCollapsed && (customerReviews.length > 0 || enquiries.length > 0) && (
              <span className="sidebar-count-badge gold">{customerReviews.length || enquiries.length}</span>
            )}
          </button>

          <button 
            className={`nav-item-btn ${activeTab === 'reports' ? 'active' : ''}`}
            onClick={() => { setActiveTab('reports'); setMobileSidebarOpen(false); }}
            title="Reports"
          >
            <BarChart3 size={19} />
            {!sidebarCollapsed && <span>Reports</span>}
          </button>

          <button 
            className={`nav-item-btn ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => { setActiveTab('settings'); setMobileSidebarOpen(false); }}
            title="Settings"
          >
            <Settings size={19} />
            {!sidebarCollapsed && <span>Settings</span>}
          </button>

          <button 
            className={`nav-item-btn ${activeTab === 'admin-users' ? 'active' : ''}`}
            onClick={() => { setActiveTab('admin-users'); setMobileSidebarOpen(false); }}
            title="Admin Users"
          >
            <ShieldCheck size={19} />
            {!sidebarCollapsed && <span>Admin Users</span>}
          </button>
        </nav>

        {/* Sidebar Footer Actions */}
        <div className="sidebar-bottom-actions">
          <button 
            className="sidebar-storefront-btn"
            onClick={onBackToStore}
            title="Return to customer store"
          >
            <ExternalLink size={17} />
            {!sidebarCollapsed && <span>View Storefront</span>}
          </button>

          <button 
            className="sidebar-logout-btn"
            onClick={handleLogout}
            title="Logout"
          >
            <LogOut size={17} />
            {!sidebarCollapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* MAIN ADMIN CONTENT AREA */}
      <div className="admin-main-viewport">
        {/* Top Header Bar */}
        <header className="admin-top-header">
          <div className="header-left-group">
            <button 
              className="toggle-sidebar-btn" 
              onClick={() => {
                if (window.innerWidth <= 900) {
                  setMobileSidebarOpen(!mobileSidebarOpen);
                } else {
                  setSidebarCollapsed(!sidebarCollapsed);
                }
              }}
              title="Toggle Menu"
            >
              <Menu size={20} />
            </button>

            <div className="header-search-box">
              <Search size={17} className="search-icon" />
              <input
                type="text"
                placeholder="Search products, orders, customers..."
                value={adminGlobalSearch}
                onChange={(e) => setAdminGlobalSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="header-right-group">
            {/* Date Range Picker */}
            <div className="date-range-badge">
              <Calendar size={15} />
              <span>Oct 16, 2026 - Oct 22, 2026</span>
              <ChevronDown size={14} />
            </div>

            {/* Notification Bell */}
            <div className="notification-bell-btn" title="3 New Notifications">
              <Bell size={19} />
              <span className="bell-badge-count">3</span>
            </div>

            {/* Admin Avatar Profile */}
            <div className="admin-avatar-card">
              <div className="avatar-circle">A</div>
              <div className="avatar-meta">
                <strong>Admin</strong>
                <small>Administrator</small>
              </div>
            </div>
          </div>
        </header>

        {/* TAB 1: DASHBOARD (Matches Screenshot Section 2) */}
        {activeTab === 'dashboard' && (
          <div className="dashboard-content-area animate-fade-in">
            {/* Dashboard Title Header */}
            <div className="dashboard-welcome-row">
              <div>
                <h2>Dashboard</h2>
                <p>Welcome back! Here's what's happening with your store.</p>
              </div>
              <button 
                className="add-quick-product-btn"
                onClick={() => { setActiveTab('products'); setIsAddProductModalOpen(true); }}
              >
                <Plus size={16} /> Add Product
              </button>
            </div>

            {/* 6 Modern Metric KPI Cards (Exact Match to Mobile Reference UI) */}
            <div className="kpi-cards-grid">
              {/* Card 1: Total Sales */}
              <div className="kpi-card modern-card">
                <div className="kpi-icon-wrap cyan">
                  <IndianRupee size={22} strokeWidth={2.4} />
                </div>
                <div className="kpi-content-wrap">
                  <span className="kpi-label">Total Sales</span>
                  <span className="kpi-number">{totalRevenue > 0 ? formatPrice(totalRevenue) : '₹3,22,646'}</span>
                  <span className="kpi-subtext">{orders.length > 0 ? `${orders.length} invoices recorded` : '5 invoices recorded'}</span>
                </div>
              </div>

              {/* Card 2: Total Purchases */}
              <div className="kpi-card modern-card">
                <div className="kpi-icon-wrap amber">
                  <ShoppingBag size={22} strokeWidth={2.2} />
                </div>
                <div className="kpi-content-wrap">
                  <span className="kpi-label">Total Purchases</span>
                  <span className="kpi-number">28</span>
                  <span className="kpi-subtext">5 purchase orders</span>
                </div>
              </div>

              {/* Card 3: Total Revenue */}
              <div className="kpi-card modern-card">
                <div className="kpi-icon-wrap green">
                  <TrendingUp size={22} strokeWidth={2.4} />
                </div>
                <div className="kpi-content-wrap">
                  <span className="kpi-label">Total Revenue</span>
                  <span className="kpi-number">{totalRevenue > 0 ? formatPrice(totalRevenue) : '₹3,22,646'}</span>
                  <span className="kpi-subtext">Net settled revenue</span>
                </div>
              </div>

              {/* Card 4: Total Expenses */}
              <div className="kpi-card modern-card">
                <div className="kpi-icon-wrap rose">
                  <CreditCard size={22} strokeWidth={2.2} />
                </div>
                <div className="kpi-content-wrap">
                  <span className="kpi-label">Total Expenses</span>
                  <span className="kpi-number">₹0.00</span>
                  <span className="kpi-subtext">0 claims recorded</span>
                </div>
              </div>

              {/* Card 5: Total Products */}
              <div className="kpi-card modern-card">
                <div className="kpi-icon-wrap purple">
                  <Package size={22} strokeWidth={2.2} />
                </div>
                <div className="kpi-content-wrap">
                  <span className="kpi-label">Total Products</span>
                  <span className="kpi-number">{totalProductsCount || 18}</span>
                  <span className="kpi-subtext">Active showroom catalog</span>
                </div>
              </div>

              {/* Card 6: Enquiries */}
              <div className="kpi-card modern-card">
                <div className="kpi-icon-wrap teal">
                  <Users size={22} strokeWidth={2.2} />
                </div>
                <div className="kpi-content-wrap">
                  <span className="kpi-label">Enquiries</span>
                  <span className="kpi-number">{totalEnquiriesCount || 48}</span>
                  <span className="kpi-subtext">{enquiries.filter(e => e.status === 'New').length > 0 ? `${enquiries.filter(e => e.status === 'New').length} new leads today` : '2 new leads today'}</span>
                </div>
              </div>
            </div>

            {/* Visual Analytics Row: Sales Overview & Top Categories */}
            <div className="analytics-two-col-grid">
              {/* Left: Sales Overview Bar Chart */}
              <div className="chart-card">
                <div className="chart-card-header">
                  <h4>Sales Overview</h4>
                  <div className="chart-filter-select">
                    <select 
                      value={salesPeriod} 
                      onChange={(e) => setSalesPeriod(e.target.value)}
                    >
                      <option value="This Week">This Week (Days)</option>
                      <option value="This Month">This Month (Jan - Dec)</option>
                      <option value="This Year">This Year (2024 - 2028)</option>
                    </select>
                  </div>
                </div>

                <div className="bar-chart-visual">
                  {salesOverviewBars.map((bar, idx) => (
                    <div key={idx} className="bar-column-wrap">
                      <div className="bar-track">
                        <div 
                          className="bar-fill" 
                          style={{ height: `${bar.fillHeight}px` }}
                          title={`${bar.day}: ${bar.amount}`}
                        ></div>
                      </div>
                      <span className="bar-day-label">{bar.day}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right: Top Categories Donut / Progress */}
              <div className="chart-card">
                <div className="chart-card-header">
                  <h4>Catalog Categories</h4>
                  <span className="chart-subtitle-note">Live Share</span>
                </div>

                <div className="donut-category-visual">
                  {/* Stylized SVG Donut Chart with live proportions */}
                  <div className="donut-svg-wrap">
                    <svg viewBox="0 0 100 100" className="donut-svg">
                      <circle cx="50" cy="50" r="38" stroke="#e2e8f0" strokeWidth="14" fill="none" />
                      {/* Furniture */}
                      <circle cx="50" cy="50" r="38" stroke="#854d0e" strokeWidth="14" fill="none"
                        strokeDasharray={`${(furniturePct * 2.39).toFixed(1)} 238.8`} strokeDashoffset="0" />
                      {/* Electronics */}
                      <circle cx="50" cy="50" r="38" stroke="#d97706" strokeWidth="14" fill="none"
                        strokeDasharray={`${(electronicsPct * 2.39).toFixed(1)} 238.8`} strokeDashoffset={`-${(furniturePct * 2.39).toFixed(1)}`} />
                      {/* Appliances */}
                      <circle cx="50" cy="50" r="38" stroke="#3b82f6" strokeWidth="14" fill="none"
                        strokeDasharray={`${(appliancesPct * 2.39).toFixed(1)} 238.8`} strokeDashoffset={`-${((furniturePct + electronicsPct) * 2.39).toFixed(1)}`} />
                    </svg>
                    <div className="donut-center-label">
                      <strong>{totalProductsCount}</strong>
                      <small>Products</small>
                    </div>
                  </div>

                  {/* Legend list dynamically from products */}
                  <div className="donut-legend-list">
                    <div className="legend-item">
                      <span className="legend-dot" style={{ background: '#854d0e' }}></span>
                      <span className="legend-name">Furniture</span>
                      <strong className="legend-pct">{furniturePct}% ({furnitureProducts.length})</strong>
                    </div>
                    <div className="legend-item">
                      <span className="legend-dot" style={{ background: '#d97706' }}></span>
                      <span className="legend-name">Electronics</span>
                      <strong className="legend-pct">{electronicsPct}% ({electronicsProducts.length})</strong>
                    </div>
                    <div className="legend-item">
                      <span className="legend-dot" style={{ background: '#3b82f6' }}></span>
                      <span className="legend-name">Home Appliances</span>
                      <strong className="legend-pct">{appliancesPct}% ({appliancesProducts.length})</strong>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Row: Recent Orders & Latest Enquiries (Live Firestore sync) */}
            <div className="recent-data-tables-grid">
              {/* Recent Orders Table Card */}
              <div className="data-table-card">
                <div className="data-table-header">
                  <h4>Recent Orders</h4>
                  <button 
                    className="view-all-link-btn"
                    onClick={() => setActiveTab('orders')}
                  >
                    View All <ArrowRight size={14} />
                  </button>
                </div>

                <div className="admin-table-wrap scrollable-recent-table">
                  <table className="admin-table recent-orders-table">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Customer</th>
                        <th>Product</th>
                        <th>Amount</th>
                        <th>Status</th>
                        <th>Date</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.length === 0 ? (
                        <tr>
                          <td colSpan="7" style={{ textAlign: 'center', padding: '24px', color: '#64748b' }}>
                            No customer orders placed yet. Orders will appear here in real time.
                          </td>
                        </tr>
                      ) : (
                        orders.slice(0, 5).map((ord) => (
                          <tr key={ord.id}>
                            <td><strong>#{ord.id}</strong></td>
                            <td>{ord.customer?.name || 'Customer'}</td>
                            <td>
                              <div className="table-product-cell">
                                {ord.items?.[0]?.name || 'Home Furniture'}
                                {ord.items?.length > 1 && (
                                  <small> +{ord.items.length - 1} more</small>
                                )}
                              </div>
                            </td>
                            <td><strong>{formatPrice(ord.total)}</strong></td>
                            <td>
                              <span className={`status-pill-badge ${ord.status.toLowerCase().replace(/\s+/g, '-')}`}>
                                {ord.status}
                              </span>
                            </td>
                            <td><small>{ord.date?.split(',')[0] || 'Today'}</small></td>
                            <td>
                              <button
                                className="table-action-icon-btn"
                                onClick={() => onViewInvoice && onViewInvoice(ord)}
                                title="View Invoice"
                              >
                                <Printer size={15} />
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Latest Enquiries Card */}
              <div className="data-table-card">
                <div className="data-table-header">
                  <h4>Latest Enquiries</h4>
                  <button 
                    className="view-all-link-btn"
                    onClick={() => setActiveTab('enquiries')}
                  >
                    View All <ArrowRight size={14} />
                  </button>
                </div>

                <div className="admin-table-wrap scrollable-recent-table">
                  <table className="admin-table recent-enquiries-table">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Product / Need</th>
                        <th>Contact</th>
                        <th>Date</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {enquiries.length === 0 ? (
                        <tr>
                          <td colSpan="5" style={{ textAlign: 'center', padding: '24px', color: '#64748b' }}>
                            No customer enquiries received yet. Inquiries from the storefront will appear here.
                          </td>
                        </tr>
                      ) : (
                        enquiries.slice(0, 4).map((enq) => (
                          <tr key={enq.id}>
                            <td><strong>{enq.name}</strong></td>
                            <td>
                              <span className="table-truncate-text" title={enq.product}>
                                {enq.product || 'General Inquiry'}
                              </span>
                            </td>
                            <td><small>{enq.contact}</small></td>
                            <td><small>{enq.date || 'Recent'}</small></td>
                            <td>
                              {enq.contact ? (
                                <a
                                  href={`https://wa.me/${String(enq.contact).replace(/\D/g, '')}?text=Hi%20${encodeURIComponent(enq.name || '')}%2C%20thank%20you%20for%20your%20enquiry%20with%20Sardar%20Mart%20Furniture%20and%20Home%20Appliances.`}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="table-whatsapp-reply-btn"
                                  title="Reply on WhatsApp"
                                >
                                  Reply
                                </a>
                              ) : (
                                <span className="text-muted">—</span>
                              )}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: PRODUCTS MANAGEMENT */}
        {activeTab === 'products' && (
          <div className="admin-subpage-card animate-fade-in">
            <div className="subpage-header-row">
              <div>
                <h3>Products Management</h3>
                <p>Manage product catalog inventory, pricing, discounts, and badges.</p>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button 
                  className="add-quick-product-btn"
                  onClick={handleSeedCatalogClick}
                  disabled={isSeeding}
                  style={{ background: '#78350f' }}
                  title="Upload / Sync default catalog items directly into Cloud Firestore"
                >
                  <RefreshCw size={16} className={isSeeding ? 'animate-spin' : ''} /> {isSeeding ? 'Syncing...' : 'Sync to Firestore'}
                </button>
                <button 
                  className="add-quick-product-btn"
                  onClick={() => setIsAddProductModalOpen(true)}
                >
                  <Plus size={16} /> Add New Product
                </button>
              </div>
            </div>

            {/* Filter and Search Bar */}
            <div className="subpage-filters-bar">
              <div className="filter-search-box">
                <Search size={16} />
                <input
                  type="text"
                  placeholder="Search products by title or keywords..."
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                />
              </div>

              <div className="filter-dropdown-wrap">
                <Filter size={16} />
                <select
                  value={productCatFilter}
                  onChange={(e) => setProductCatFilter(e.target.value)}
                >
                  <option value="all">All Categories</option>
                  <option value="furniture">Furniture</option>
                  <option value="electronics">Electronics</option>
                  <option value="appliances">Appliances</option>
                </select>
              </div>
            </div>

            {/* Products Table */}
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Item</th>
                    <th>Category</th>
                    <th>Selling Price</th>
                    <th>Original MRP</th>
                    <th>Discount</th>
                    <th>Badge</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {(() => {
                    const filtered = products.filter((p) => {
                      const matchCat = productCatFilter === 'all' || p.category === productCatFilter;
                      const matchSearch = productSearch === '' || 
                        p.name.toLowerCase().includes(productSearch.toLowerCase());
                      return matchCat && matchSearch;
                    });
                    if (filtered.length === 0) {
                      return (
                        <tr>
                          <td colSpan="8" style={{ textAlign: 'center', padding: '48px 16px', color: '#64748b' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                              <Package size={40} color="#94a3b8" />
                              <strong style={{ fontSize: '1.05rem', color: '#334155' }}>No products found</strong>
                              <small style={{ color: '#64748b' }}>No products available in the Firestore database matching your criteria. Click "+ Add New Product" to create one.</small>
                            </div>
                          </td>
                        </tr>
                      );
                    }
                    return filtered.map((item) => (
                      <tr key={item.id}>
                        <td>
                          <div className="product-table-item-cell">
                            <img src={item.image} alt={item.name} className="product-thumb-sm" />
                            <div>
                              <strong>{item.name}</strong>
                              <small>ID: {item.id}</small>
                            </div>
                          </div>
                        </td>
                        <td>
                          <span className="category-pill-tag">{item.category}</span>
                        </td>
                        <td><strong>{formatPrice(item.price)}</strong></td>
                        <td><span className="text-strike">{formatPrice(item.originalPrice || item.price * 1.25)}</span></td>
                        <td><span className="discount-tag">{item.discount || 20}% OFF</span></td>
                        <td>
                          {item.badge ? (
                            <span className="badge-promo-pill">{item.badge}</span>
                          ) : (
                            <span className="text-muted">-</span>
                          )}
                        </td>
                        <td>
                          <span className="in-stock-badge">In Stock</span>
                        </td>
                        <td>
                          <div className="table-actions-group">
                            <button
                              className="table-action-icon-btn edit"
                              onClick={() => setEditingProduct(item)}
                              title="Edit Product"
                            >
                              <Edit3 size={15} />
                            </button>
                            <button
                              className="table-action-icon-btn delete"
                              onClick={() => {
                                if (window.confirm(`Delete "${item.name}" from catalog?`)) {
                                  onDeleteProduct && onDeleteProduct(item.id);
                                  showToast('Product removed');
                                }
                              }}
                              title="Delete Product"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ));
                  })()}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: ORDERS & BILLING MANAGEMENT */}
        {(activeTab === 'orders' || activeTab === 'invoices') && (
          <div className="admin-subpage-card animate-fade-in orders-subpage-root">
            {/* Header Section */}
            <div className="orders-header-hero">
              <div className="orders-header-title-block">
                <div className="orders-header-badge">
                  <ShoppingBag size={14} /> Live Orders &amp; Counter Sales
                </div>
                <h3>Orders &amp; Invoices</h3>
                <p>Manage customer orders, update real-time fulfillment stages, and print GST tax invoices.</p>
              </div>
              <div className="orders-header-actions">
                <button 
                  type="button" 
                  className="btn-pos-counter-bill"
                  onClick={() => setActiveTab('billing')}
                >
                  <CreditCard size={16} /> + New POS Counter Bill
                </button>
              </div>
            </div>

            {/* Executive KPI Quick-Filter Strip */}
            {(() => {
              const totalOrdersCount = orders.length;
              const inProgressCount = orders.filter(o => ['Order Placed', 'Confirmed', 'Packed', 'Out for Delivery'].includes(o.status)).length;
              const deliveredCount = orders.filter(o => o.status === 'Delivered').length;
              const codPendingCount = orders.filter(o => !o.paymentStatus?.toLowerCase().includes('paid')).length;
              const totalRevenueSum = orders.reduce((sum, o) => sum + (Number(o.total) || 0), 0);

              return (
                <div className="orders-kpi-filter-strip">
                  <button
                    type="button"
                    className={`order-kpi-pill ${orderStatusFilter === 'all' ? 'active' : ''}`}
                    onClick={() => setOrderStatusFilter('all')}
                  >
                    <span className="kpi-label">All Orders</span>
                    <span className="kpi-count">{totalOrdersCount}</span>
                  </button>

                  <button
                    type="button"
                    className={`order-kpi-pill kpi-in-progress ${orderStatusFilter === 'in_progress' ? 'active' : ''}`}
                    onClick={() => setOrderStatusFilter(orderStatusFilter === 'in_progress' ? 'all' : 'in_progress')}
                  >
                    <span className="kpi-dot in-progress"></span>
                    <span className="kpi-label">In Progress</span>
                    <span className="kpi-count">{inProgressCount}</span>
                  </button>

                  <button
                    type="button"
                    className={`order-kpi-pill kpi-delivered ${orderStatusFilter === 'Delivered' ? 'active' : ''}`}
                    onClick={() => setOrderStatusFilter(orderStatusFilter === 'Delivered' ? 'all' : 'Delivered')}
                  >
                    <span className="kpi-dot delivered"></span>
                    <span className="kpi-label">Delivered</span>
                    <span className="kpi-count">{deliveredCount}</span>
                  </button>

                  <button
                    type="button"
                    className={`order-kpi-pill kpi-cod-pending ${orderStatusFilter === 'cod_pending' ? 'active' : ''}`}
                    onClick={() => setOrderStatusFilter(orderStatusFilter === 'cod_pending' ? 'all' : 'cod_pending')}
                  >
                    <span className="kpi-dot cod-pending"></span>
                    <span className="kpi-label">COD / Pending</span>
                    <span className="kpi-count">{codPendingCount}</span>
                  </button>

                  <div className="order-kpi-revenue-box">
                    <span className="kpi-revenue-label">Order Volume</span>
                    <strong className="kpi-revenue-val">{formatPrice(totalRevenueSum)}</strong>
                  </div>
                </div>
              );
            })()}

            {/* Search and Secondary Filter Row */}
            <div className="orders-search-filter-row">
              <div className="orders-search-input-wrap">
                <Search size={16} className="search-icon" />
                <input
                  type="text"
                  placeholder="Search by Order ID, Customer Name, Phone, or City..."
                  value={orderSearch}
                  onChange={(e) => setOrderSearch(e.target.value)}
                />
                {orderSearch && (
                  <button 
                    type="button" 
                    className="search-clear-btn" 
                    onClick={() => setOrderSearch('')}
                    title="Clear search"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>

              <div className="orders-filter-select-wrap">
                <Filter size={15} />
                <select
                  value={orderStatusFilter}
                  onChange={(e) => setOrderStatusFilter(e.target.value)}
                >
                  <option value="all">Status: All Statuses</option>
                  <option value="in_progress">Status: In Progress</option>
                  <option value="Order Placed">Status: Order Placed</option>
                  <option value="Confirmed">Status: Confirmed</option>
                  <option value="Packed">Status: Packed</option>
                  <option value="Out for Delivery">Status: Out for Delivery</option>
                  <option value="Delivered">Status: Delivered</option>
                  <option value="cod_pending">Payment: COD / Pending</option>
                  <option value="Cancelled">Status: Cancelled</option>
                </select>
              </div>
            </div>

            {(() => {
              const filteredOrders = orders.filter((ord) => {
                let matchStatus = true;
                if (orderStatusFilter === 'all') {
                  matchStatus = true;
                } else if (orderStatusFilter === 'in_progress') {
                  matchStatus = ['Order Placed', 'Confirmed', 'Packed', 'Out for Delivery'].includes(ord.status);
                } else if (orderStatusFilter === 'cod_pending') {
                  matchStatus = !ord.paymentStatus?.toLowerCase().includes('paid');
                } else {
                  matchStatus = ord.status === orderStatusFilter;
                }

                const term = orderSearch.toLowerCase().trim();
                const matchSearch = term === '' ||
                  ord.id.toLowerCase().includes(term) ||
                  (ord.customer?.name || '').toLowerCase().includes(term) ||
                  (ord.customer?.phone || '').includes(term) ||
                  (ord.customer?.city || '').toLowerCase().includes(term) ||
                  (ord.items || []).some(it => (it.name || '').toLowerCase().includes(term));

                return matchStatus && matchSearch;
              });

              if (filteredOrders.length === 0) {
                return (
                  <div className="orders-empty-state modern">
                    <div className="empty-icon-halo">
                      <ShoppingCart size={32} />
                    </div>
                    <h4>No Orders Found</h4>
                    <p>
                      {orders.length === 0
                        ? 'No orders recorded yet. Orders placed online or created via Counter Billing will be listed here.'
                        : 'No orders matched your active search or filter criteria. Try resetting filters.'}
                    </p>
                    {(orderSearch || orderStatusFilter !== 'all') && (
                      <button
                        type="button"
                        className="btn-reset-filters"
                        onClick={() => {
                          setOrderSearch('');
                          setOrderStatusFilter('all');
                        }}
                      >
                        Reset All Filters
                      </button>
                    )}
                  </div>
                );
              }

              return (
                <>
                  {/* ========================================================= */}
                  {/* 1. DESKTOP & LAPTOP SENIOR-DESIGNER TABLE (> 820px)      */}
                  {/* ========================================================= */}
                  <div className="admin-table-wrap orders-desktop-table">
                    <table className="admin-table orders-table modern-ui">
                      <thead>
                        <tr>
                          <th style={{ width: '190px' }}>Order ID &amp; Placed On</th>
                          <th style={{ width: '220px' }}>Customer Info</th>
                          <th>Purchased Items</th>
                          <th style={{ width: '140px' }}>Order Total</th>
                          <th style={{ width: '175px' }}>Payment Mode</th>
                          <th style={{ width: '170px' }}>Fulfillment Status</th>
                          <th style={{ width: '135px', textAlign: 'center' }}>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredOrders.map((ord) => {
                          const isCopied = copiedOrderId === ord.id;
                          const custName = ord.customer?.name || 'Customer';
                          const custInitial = custName.charAt(0).toUpperCase();
                          const itemsCount = ord.items?.reduce((sum, i) => sum + (Number(i.quantity) || 1), 0) || 1;
                          const isPaid = ord.paymentStatus?.toLowerCase().includes('paid');

                          return (
                            <tr key={ord.id} className="order-table-row modern">
                              {/* Order ID & Placed Date */}
                              <td className="order-id-cell">
                                <div className="order-id-pill-row">
                                  <span className="order-id-pill">#{ord.id}</span>
                                  <button
                                    type="button"
                                    className={`btn-copy-order-id ${isCopied ? 'copied' : ''}`}
                                    title={isCopied ? 'Copied!' : 'Copy Order ID'}
                                    onClick={() => {
                                      navigator.clipboard?.writeText(ord.id);
                                      setCopiedOrderId(ord.id);
                                      setTimeout(() => setCopiedOrderId(null), 1800);
                                    }}
                                  >
                                    {isCopied ? <Check size={11} color="#16a34a" /> : <Copy size={11} />}
                                  </button>
                                </div>
                                <div className="order-timestamp">
                                  <Clock size={12} />
                                  <span>{ord.date || 'Recent'}</span>
                                </div>
                              </td>

                              {/* Customer Avatar & Details */}
                              <td className="customer-details-cell modern">
                                <div className="customer-avatar-row">
                                  <div className="customer-monogram" title={custName}>
                                    {custInitial}
                                  </div>
                                  <div className="customer-meta-col">
                                    <strong className="customer-name">{custName}</strong>
                                    {ord.customer?.phone && (
                                      <a href={`tel:${ord.customer.phone}`} className="customer-phone" title="Call Customer">
                                        <Phone size={11} /> {ord.customer.phone}
                                      </a>
                                    )}
                                    {ord.customer?.city && (
                                      <span className="customer-city-tag">
                                        <MapPin size={10} /> {ord.customer.city}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </td>

                              {/* Items Ordered List */}
                              <td className="order-items-cell">
                                <div className="order-items-list modern">
                                  {ord.items?.map((it, idx) => (
                                    <div key={idx} className="order-item-badge modern">
                                      <span className="item-name" title={it.name}>{it.name}</span>
                                      <span className="item-qty">×{it.quantity || 1}</span>
                                      {it.price && (
                                        <span className="item-price">{formatPrice(it.price * (it.quantity || 1))}</span>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              </td>

                              {/* Total Amount */}
                              <td className="order-amount-cell">
                                <div className="order-amount-val">{formatPrice(ord.total)}</div>
                                <span className="order-items-count">
                                  {itemsCount} {itemsCount === 1 ? 'item' : 'items'}
                                </span>
                              </td>

                              {/* Payment Mode & Settlement Badge */}
                              <td className="payment-details-cell">
                                <div className="payment-method-row">
                                  <CreditCard size={13} />
                                  <span>{ord.paymentMethod || 'Online'}</span>
                                </div>
                                <span className={`payment-status-badge ${isPaid ? 'paid' : 'pending'}`}>
                                  {isPaid ? (
                                    <><Check size={11} /> Paid</>
                                  ) : (
                                    <><Clock size={11} /> Pending (COD)</>
                                  )}
                                </span>
                              </td>

                              {/* Live Status Selector */}
                              <td className="live-status-cell">
                                <div className="status-dropdown-wrapper">
                                  <span className={`status-indicator-dot ${ord.status?.toLowerCase().replace(/\s+/g, '-')}`}></span>
                                  <select
                                    className={`status-selector-input executive ${ord.status?.toLowerCase().replace(/\s+/g, '-')}`}
                                    value={ord.status}
                                    onChange={(e) => onUpdateOrderStatus && onUpdateOrderStatus(ord.id, e.target.value)}
                                  >
                                    <option value="Order Placed">Order Placed</option>
                                    <option value="Confirmed">Confirmed</option>
                                    <option value="Packed">Packed</option>
                                    <option value="Out for Delivery">Out for Delivery</option>
                                    <option value="Delivered">Delivered</option>
                                    <option value="Cancelled">Cancelled</option>
                                  </select>
                                </div>
                              </td>

                              {/* Actions */}
                              <td className="order-actions-cell" style={{ textAlign: 'center' }}>
                                <div className="table-actions-group modern-actions">
                                  <button
                                    type="button"
                                    className="table-action-icon-btn invoice pulse-hover"
                                    onClick={() => onViewInvoice && onViewInvoice(ord)}
                                    title="View &amp; Print Tax Invoice"
                                  >
                                    <Printer size={15} />
                                  </button>
                                  <button
                                    type="button"
                                    className="table-action-icon-btn edit"
                                    onClick={() => setEditingOrder(ord)}
                                    title="Edit Order / Customer"
                                  >
                                    <Edit3 size={15} />
                                  </button>
                                  <button
                                    type="button"
                                    className="table-action-icon-btn delete"
                                    onClick={() => {
                                      if (window.confirm(`Delete order #${ord.id}?`)) {
                                        onDeleteOrder && onDeleteOrder(ord.id);
                                        showToast(`Order #${ord.id} deleted`);
                                      }
                                    }}
                                    title="Delete Order Record"
                                  >
                                    <Trash2 size={15} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                  {/* ========================================================= */}
                  {/* 2. MOBILE RESPONSIVE ORDER CARDS (<= 820px)               */}
                  {/* ========================================================= */}
                  <div className="orders-mobile-cards-list modern">
                    {/* Mobile Specific Floating / Sticky Filter Bar */}
                    <div className="mobile-orders-filter-toolbar">
                      <div className="mobile-filter-dropdown-pill">
                        <Filter size={14} className="filter-icon" />
                        <select
                          className="mobile-filter-select"
                          value={orderStatusFilter}
                          onChange={(e) => setOrderStatusFilter(e.target.value)}
                          aria-label="Filter Orders by Status"
                        >
                          <option value="all">⚡ All Orders ({orders.length})</option>
                          <option value="in_progress">🚚 In Progress</option>
                          <option value="Order Placed">🟡 Order Placed</option>
                          <option value="Confirmed">🟣 Confirmed</option>
                          <option value="Packed">📦 Packed</option>
                          <option value="Out for Delivery">🚀 Out for Delivery</option>
                          <option value="Delivered">🟢 Delivered</option>
                          <option value="cod_pending">💵 COD / Pending Payment</option>
                          <option value="Cancelled">🔴 Cancelled</option>
                        </select>
                        <ChevronDown size={14} className="select-chevron" />
                      </div>

                      <div className="mobile-orders-count-badge">
                        Showing <strong>{filteredOrders.length}</strong> of {orders.length}
                      </div>
                    </div>

                    {filteredOrders.map((ord) => {
                      const isCopied = copiedOrderId === ord.id;
                      const custName = ord.customer?.name || 'Customer';
                      const custInitial = custName.charAt(0).toUpperCase();
                      const isPaid = ord.paymentStatus?.toLowerCase().includes('paid');

                      return (
                        <div key={ord.id} className="order-mobile-card modern">
                          {/* Card Header: ID + Time + Status Selector */}
                          <div className="order-card-header-bar">
                            <div className="order-card-id-group">
                              <div className="order-id-pill-row">
                                <span className="order-id-pill">#{ord.id}</span>
                                <button
                                  type="button"
                                  className={`btn-copy-order-id ${isCopied ? 'copied' : ''}`}
                                  title="Copy Order ID"
                                  onClick={() => {
                                    navigator.clipboard?.writeText(ord.id);
                                    setCopiedOrderId(ord.id);
                                    setTimeout(() => setCopiedOrderId(null), 1800);
                                  }}
                                >
                                  {isCopied ? <Check size={11} color="#16a34a" /> : <Copy size={11} />}
                                </button>
                              </div>
                              <span className="order-card-date">
                                <Clock size={11} /> {ord.date || 'Recent'}
                              </span>
                            </div>

                            <select
                              className={`status-selector-input executive mini ${ord.status?.toLowerCase().replace(/\s+/g, '-')}`}
                              value={ord.status}
                              onChange={(e) => onUpdateOrderStatus && onUpdateOrderStatus(ord.id, e.target.value)}
                            >
                              <option value="Order Placed">Order Placed</option>
                              <option value="Confirmed">Confirmed</option>
                              <option value="Packed">Packed</option>
                              <option value="Out for Delivery">Out for Delivery</option>
                              <option value="Delivered">Delivered</option>
                              <option value="Cancelled">Cancelled</option>
                            </select>
                          </div>

                          {/* Customer Row */}
                          <div className="order-card-customer-row">
                            <div className="customer-monogram mobile">
                              {custInitial}
                            </div>
                            <div className="customer-info-col">
                              <strong className="customer-name">{custName}</strong>
                              <div className="customer-contact-meta">
                                {ord.customer?.phone && (
                                  <a href={`tel:${ord.customer.phone}`} className="customer-phone-chip">
                                    <Phone size={11} /> {ord.customer.phone}
                                  </a>
                                )}
                                {ord.customer?.city && (
                                  <span className="customer-city-chip">
                                    <MapPin size={10} /> {ord.customer.city}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Items Ordered List Preview */}
                          <div className="order-card-items-block">
                            <span className="items-block-label">Items Ordered ({ord.items?.length || 0})</span>
                            <div className="items-tags-wrap">
                              {ord.items?.map((it, idx) => (
                                <div key={idx} className="order-item-badge modern">
                                  <span className="item-name">{it.name}</span>
                                  <span className="item-qty">×{it.quantity || 1}</span>
                                  {it.price && (
                                    <span className="item-price">{formatPrice(it.price * (it.quantity || 1))}</span>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Summary Row: Total & Payment */}
                          <div className="order-card-summary-row">
                            <div className="total-amount-meta">
                              <span className="meta-label">Total Amount</span>
                              <strong className="order-amount-val">{formatPrice(ord.total)}</strong>
                            </div>

                            <div className="payment-badges-stack">
                              <span className="payment-method-chip">
                                <CreditCard size={11} /> {ord.paymentMethod || 'Online'}
                              </span>
                              <span className={`payment-status-badge ${isPaid ? 'paid' : 'pending'}`}>
                                {isPaid ? <><Check size={11} /> Paid</> : <><Clock size={11} /> COD Pending</>}
                              </span>
                            </div>
                          </div>

                          {/* Action Buttons Row */}
                          <div className="order-card-actions-footer">
                            <button
                              type="button"
                              className="btn-card-tax-invoice"
                              onClick={() => onViewInvoice && onViewInvoice(ord)}
                            >
                              <Printer size={15} /> Tax Invoice
                            </button>
                            <button
                              type="button"
                              className="btn-card-icon-action"
                              onClick={() => setEditingOrder(ord)}
                              title="Edit Customer Details"
                            >
                              <Edit3 size={15} />
                            </button>
                            <button
                              type="button"
                              className="btn-card-icon-action delete"
                              onClick={() => {
                                if (window.confirm(`Delete order #${ord.id}?`)) {
                                  onDeleteOrder && onDeleteOrder(ord.id);
                                  showToast(`Order #${ord.id} deleted`);
                                }
                              }}
                              title="Delete Order"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </>
              );
            })()}
          </div>
        )}

        {/* TAB: SHOWROOM POS BILLING & INVOICING */}
        {activeTab === 'billing' && (
          <div className="admin-pos-billing-subpage animate-fade-in">
            <Billing
              products={products}
              cart={[]}
              customers={customerList}
              orders={orders}
              onPlaceOrder={async (newOrder) => {
                if (onPlaceOrder) {
                  await onPlaceOrder(newOrder);
                } else {
                  try {
                    await createOrder(newOrder, currentUser?.uid || 'admin');
                  } catch (err) {
                    console.warn('Could not save order to Firestore:', err);
                  }
                }
              }}
              onViewInvoice={onViewInvoice}
              onNavigate={(dest) => {
                if (dest === 'orders' || dest === 'customers' || dest === 'dashboard' || dest === 'products') {
                  setActiveTab(dest);
                } else {
                  setActiveTab('orders');
                }
              }}
              storeSettings={propStoreSettings || storeSettings}
            />
          </div>
        )}

        {/* TAB 4: ENQUIRIES (LIVE FIRESTORE MANAGEMENT) */}
        {activeTab === 'enquiries' && (
          <div className="admin-subpage-card animate-fade-in">
            <div className="subpage-header-row">
              <div>
                <h3>Customer Enquiries &amp; Leads</h3>
                <p>Direct inquiries submitted via the Contact Us page and product showroom inquiries.</p>
              </div>
            </div>

            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Customer Name</th>
                    <th>Product / Need</th>
                    <th>Message / Query</th>
                    <th>Contact Info</th>
                    <th>Status</th>
                    <th>Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {enquiries.length === 0 ? (
                    <tr>
                      <td colSpan="7" style={{ textAlign: 'center', padding: '36px', color: '#64748b' }}>
                        No customer enquiries in Firebase yet. Inquiries submitted through the Contact Us form will appear here in real time.
                      </td>
                    </tr>
                  ) : (
                    enquiries.map((enq) => (
                      <tr key={enq.id}>
                        <td><strong>{enq.name}</strong></td>
                        <td>
                          <span className="product-enq-name">{enq.product || 'General Showroom'}</span>
                          {enq.branch && <small className="d-block text-muted">{enq.branch}</small>}
                        </td>
                        <td><p className="enq-message-box">{enq.message || 'Customer requested call back / details.'}</p></td>
                        <td>
                          <small>📞 {enq.contact || '—'}</small><br />
                          {enq.email && <small>✉️ {enq.email}</small>}
                        </td>
                        <td>
                          <select
                            value={enq.status || 'New'}
                            onChange={(e) => handleUpdateEnquiryStatus(enq.id, e.target.value)}
                            style={{
                              padding: '4px 8px',
                              borderRadius: '6px',
                              border: '1px solid #cbd5e1',
                              fontSize: '0.8rem',
                              fontWeight: 600,
                              background: enq.status === 'Replied' || enq.status === 'Resolved' ? '#dcfce7' : '#fef3c7',
                              color: enq.status === 'Replied' || enq.status === 'Resolved' ? '#15803d' : '#b45309'
                            }}
                          >
                            <option value="New">New</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Replied">Replied</option>
                            <option value="Resolved">Resolved</option>
                          </select>
                        </td>
                        <td><small>{enq.date || 'Today'}</small></td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            {enq.contact && (
                              <a
                                href={`https://wa.me/${String(enq.contact).replace(/\D/g, '')}?text=Hi%20${encodeURIComponent(enq.name || '')}%2C%20thank%20you%20for%20contacting%20Sardar%20Mart%20Furniture%20and%20Home%20Appliances.`}
                                target="_blank"
                                rel="noreferrer"
                                className="table-whatsapp-reply-btn"
                                title="Reply on WhatsApp"
                              >
                                WhatsApp
                              </a>
                            )}
                            <button
                              type="button"
                              onClick={() => handleDeleteEnquiry(enq.id, enq.name)}
                              className="table-action-icon-btn delete"
                              title="Delete Enquiry"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 5: CATEGORIES MANAGEMENT (LIVE FIRESTORE DATABASE SYNC) */}
        {activeTab === 'categories' && (
          <div className="admin-subpage-card animate-fade-in">
            {/* Header with Title and Actions */}
            <div className="subpage-header-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <h3 style={{ margin: 0 }}>Category Management &amp; Storefront Sync</h3>
                  <span style={{ 
                    fontSize: '0.74rem', 
                    fontWeight: 700, 
                    padding: '3px 8px', 
                    borderRadius: '12px', 
                    background: '#dcfce7', 
                    color: '#15803d',
                    border: '1px solid #bbf7d0',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}>
                    <CheckCircle size={12} /> Live Cloud Firestore
                  </span>
                </div>
                <p style={{ margin: '6px 0 0', color: '#64748b', fontSize: '0.9rem' }}>
                  Manage storefront collections displayed in "Shop by Category". Model counts are calculated live from products in Cloud Firestore database.
                </p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  onClick={handleResetDefaultCategories}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '9px 14px',
                    borderRadius: '8px',
                    border: '1.5px solid #cbd5e1',
                    background: '#ffffff',
                    color: '#475569',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                  title="Reload the 8 default showroom categories into Firestore if needed"
                >
                  <RefreshCw size={14} /> Restore Defaults
                </button>

                <button 
                  type="button"
                  className="add-quick-product-btn"
                  onClick={handleOpenAddCategory}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    background: '#854d0e',
                    color: '#ffffff',
                    padding: '9px 18px',
                    borderRadius: '8px',
                    fontWeight: 700,
                    fontSize: '0.88rem',
                    border: 'none',
                    cursor: 'pointer',
                    boxShadow: '0 2px 4px rgba(133, 77, 14, 0.25)'
                  }}
                >
                  <Plus size={16} /> Add New Category
                </button>
              </div>
            </div>

            {/* Department Summary Stat Pills */}
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', 
              gap: '12px', 
              margin: '20px 0 16px' 
            }}>
              <div style={{ background: '#f8fafc', padding: '14px 16px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Total Categories</span>
                <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a', marginTop: '2px' }}>
                  {categoriesList.length}
                </div>
              </div>
              <div style={{ background: '#fef3c7', padding: '14px 16px', borderRadius: '12px', border: '1px solid #fde68a' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#92400e', textTransform: 'uppercase' }}>Furniture Categories</span>
                <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#78350f', marginTop: '2px' }}>
                  {categoriesList.filter(c => (c.category || '').toLowerCase() === 'furniture').length}
                </div>
              </div>
              <div style={{ background: '#e0f2fe', padding: '14px 16px', borderRadius: '12px', border: '1px solid #bae6fd' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#0369a1', textTransform: 'uppercase' }}>Electronics Categories</span>
                <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#075985', marginTop: '2px' }}>
                  {categoriesList.filter(c => (c.category || '').toLowerCase() === 'electronics').length}
                </div>
              </div>
              <div style={{ background: '#fce7f3', padding: '14px 16px', borderRadius: '12px', border: '1px solid #fbcfe8' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#9d174d', textTransform: 'uppercase' }}>Appliances Categories</span>
                <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#831843', marginTop: '2px' }}>
                  {categoriesList.filter(c => (c.category || '').toLowerCase() === 'appliances').length}
                </div>
              </div>
              <div style={{ background: '#f1f5f9', padding: '14px 16px', borderRadius: '12px', border: '1px solid #cbd5e1' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase' }}>Live Products in Catalog</span>
                <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#1e293b', marginTop: '2px' }}>
                  {products.length}
                </div>
              </div>
            </div>

            {/* Filter and Search Bar */}
            <div className="subpage-filters-bar" style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap', margin: '0 0 20px' }}>
              <div className="filter-search-box" style={{ flex: 1, minWidth: '240px' }}>
                <Search size={16} />
                <input
                  type="text"
                  placeholder="Search categories by name, slug, badge, or department..."
                  value={categorySearch}
                  onChange={(e) => setCategorySearch(e.target.value)}
                />
              </div>

              <div className="filter-dropdown-wrap">
                <select 
                  value={categoryDeptFilter}
                  onChange={(e) => setCategoryDeptFilter(e.target.value)}
                  className="cat-filter-select"
                >
                  <option value="all">⚡ All Departments</option>
                  <option value="furniture">🛋️ Furniture</option>
                  <option value="electronics">📺 Electronics</option>
                  <option value="appliances">🍳 Home Appliances</option>
                </select>
              </div>
            </div>

            {/* Categories Cards Grid with Live Counts & Actions */}
            {(() => {
              const term = categorySearch.toLowerCase().trim();
              const filtered = categoriesList.filter((cat) => {
                const matchesSearch = !term ||
                  (cat.name || '').toLowerCase().includes(term) ||
                  (cat.id || '').toLowerCase().includes(term) ||
                  (cat.badge || '').toLowerCase().includes(term) ||
                  (cat.category || '').toLowerCase().includes(term);

                const matchesDept = categoryDeptFilter === 'all' || 
                  (cat.category || '').toLowerCase() === categoryDeptFilter.toLowerCase();

                return matchesSearch && matchesDept;
              });

              if (filtered.length === 0) {
                return (
                  <div style={{ textAlign: 'center', padding: '48px 20px', background: '#f8fafc', borderRadius: '14px', border: '1px dashed #cbd5e1' }}>
                    <Layers size={40} style={{ color: '#94a3b8', margin: '0 auto 12px', display: 'block' }} />
                    <h4 style={{ margin: '0 0 6px', color: '#1e293b' }}>No Categories Found</h4>
                    <p style={{ color: '#64748b', fontSize: '0.88rem', margin: '0 0 18px' }}>
                      {categoriesList.length === 0 
                        ? 'No categories exist in Cloud Firestore yet. Click "Add New Category" or "Restore Defaults" above.'
                        : 'No categories matched your filter criteria.'}
                    </p>
                    <button
                      type="button"
                      className="add-quick-product-btn"
                      onClick={handleOpenAddCategory}
                      style={{ margin: '0 auto' }}
                    >
                      <Plus size={16} /> Add First Category
                    </button>
                  </div>
                );
              }

              return (
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))', 
                  gap: '18px' 
                }}>
                  {filtered.map((cat) => {
                    const catId = (cat.id || '').toLowerCase().trim();
                    const catName = (cat.name || '').toLowerCase().trim();
                    const catDept = (cat.category || '').toLowerCase().trim();

                    // Calculate live models count directly from Firestore products
                    const liveCount = products.filter((p) => {
                      const pSub = (p.subcategory || '').toLowerCase().trim();
                      const pCat = (p.category || '').toLowerCase().trim();
                      const pName = (p.name || '').toLowerCase().trim();

                      if (pSub && (pSub === catId || pSub === catName)) return true;
                      if (pCat && (pCat === catId || pCat === catName)) return true;
                      if (catDept && pCat === catDept && pSub && pSub === catId) return true;
                      if (catId && pSub.includes(catId)) return true;
                      if (catName && (pSub.includes(catName) || (p.name || '').toLowerCase().includes(catName))) return true;
                      return false;
                    }).length;

                    const deptBadgeColor = catDept === 'furniture' 
                      ? { bg: '#fef3c7', text: '#92400e', border: '#fde68a', label: 'Furniture' }
                      : catDept === 'electronics'
                        ? { bg: '#e0f2fe', text: '#0369a1', border: '#bae6fd', label: 'Electronics' }
                        : { bg: '#fce7f3', text: '#9d174d', border: '#fbcfe8', label: 'Appliances' };

                    return (
                      <div 
                        key={cat.id} 
                        style={{
                          background: '#ffffff',
                          borderRadius: '16px',
                          border: '1.5px solid #e2e8f0',
                          padding: '16px',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '14px',
                          boxShadow: '0 4px 12px rgba(15, 23, 42, 0.04)',
                          transition: 'transform 0.2s, box-shadow 0.2s',
                          position: 'relative'
                        }}
                      >
                        {/* Top: Image Circle Preview + Badges */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                          <div style={{
                            position: 'relative',
                            width: '76px',
                            height: '76px',
                            minWidth: '76px',
                            borderRadius: '50%',
                            padding: '3px',
                            background: '#ffffff',
                            border: '2px solid #ecd8cb',
                            boxShadow: '0 4px 10px rgba(42, 24, 16, 0.1)',
                            overflow: 'hidden'
                          }}>
                            <img 
                              src={cat.image || 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=600&q=80'} 
                              alt={cat.name} 
                              style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
                            />
                            {cat.badge && (
                              <span style={{
                                position: 'absolute',
                                bottom: '2px',
                                left: '50%',
                                transform: 'translateX(-50%)',
                                background: '#78350f',
                                color: '#ffffff',
                                fontSize: '0.58rem',
                                fontWeight: 800,
                                padding: '1px 6px',
                                borderRadius: '10px',
                                whiteSpace: 'nowrap',
                                textTransform: 'uppercase'
                              }}>
                                {cat.badge}
                              </span>
                            )}
                          </div>

                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap', marginBottom: '4px' }}>
                              <span style={{
                                fontSize: '0.7rem',
                                fontWeight: 700,
                                padding: '2px 8px',
                                borderRadius: '10px',
                                background: deptBadgeColor.bg,
                                color: deptBadgeColor.text,
                                border: `1px solid ${deptBadgeColor.border}`
                              }}>
                                {deptBadgeColor.label}
                              </span>
                              <code style={{ fontSize: '0.72rem', background: '#f1f5f9', color: '#475569', padding: '1px 6px', borderRadius: '4px' }}>
                                #{cat.id}
                              </code>
                            </div>

                            <h4 style={{ margin: '0 0 4px', fontSize: '1.05rem', fontWeight: 800, color: '#1e293b' }}>
                              {cat.name}
                            </h4>

                            {/* Live Model Count Badge */}
                            <div style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '5px',
                              fontSize: '0.78rem',
                              fontWeight: 700,
                              color: liveCount > 0 ? '#15803d' : '#94a3b8',
                              background: liveCount > 0 ? '#f0fdf4' : '#f8fafc',
                              padding: '2px 8px',
                              borderRadius: '6px',
                              border: `1px solid ${liveCount > 0 ? '#bbf7d0' : '#e2e8f0'}`
                            }}>
                              <Package size={12} />
                              <span>{liveCount > 0 ? `${liveCount}+ Live Models in Firestore` : '0 Models (Empty)'}</span>
                            </div>
                          </div>
                        </div>

                        {/* Action Buttons Row */}
                        <div style={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'space-between', 
                          borderTop: '1px solid #f1f5f9', 
                          paddingTop: '10px',
                          marginTop: 'auto'
                        }}>
                          <button
                            type="button"
                            onClick={() => {
                              onBackToStore && onBackToStore();
                            }}
                            style={{
                              background: 'none',
                              border: 'none',
                              color: '#64748b',
                              fontSize: '0.78rem',
                              fontWeight: 600,
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px',
                              cursor: 'pointer'
                            }}
                            title="View on Storefront"
                          >
                            <ExternalLink size={12} /> Storefront
                          </button>

                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <button
                              type="button"
                              onClick={() => handleOpenEditCategory(cat)}
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px',
                                background: '#fef3c7',
                                color: '#92400e',
                                border: '1px solid #fde68a',
                                padding: '5px 10px',
                                borderRadius: '6px',
                                fontSize: '0.78rem',
                                fontWeight: 700,
                                cursor: 'pointer'
                              }}
                              title="Edit Category Details"
                            >
                              <Edit3 size={13} /> Edit
                            </button>

                            <button
                              type="button"
                              onClick={() => handleDeleteCategory(cat.id, cat.name)}
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px',
                                background: '#fee2e2',
                                color: '#dc2626',
                                border: '1px solid #fecaca',
                                padding: '5px 8px',
                                borderRadius: '6px',
                                fontSize: '0.78rem',
                                fontWeight: 700,
                                cursor: 'pointer'
                              }}
                              title="Delete Category"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })()}
          </div>
        )}


        {/* TAB 6: PROMO CODES & DISCOUNTS */}
        {activeTab === 'offers' && (
          <div className="admin-subpage-card animate-fade-in">
            <div className="subpage-header-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
              <div>
                <h3>Promo Codes &amp; Discounts</h3>
                <p>Create promotional codes with custom offer percentages and code amount limits. Syncs directly with Cloud Firestore and publishes live to the storefront.</p>
              </div>
              <button 
                type="button"
                className="add-quick-product-btn"
                onClick={() => setIsAddPromoModalOpen(true)}
              >
                <Plus size={16} /> Create Promo Code
              </button>
            </div>

            {promoCodesList.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px 20px', background: '#f8fafc', borderRadius: '16px', border: '1px dashed #cbd5e1', marginTop: '20px' }}>
                <Tag size={44} style={{ color: '#94a3b8', margin: '0 auto 12px', display: 'block' }} />
                <h4 style={{ fontSize: '1.2rem', fontWeight: 600, color: '#1e293b', marginBottom: '6px' }}>No promo codes found</h4>
                <p style={{ color: '#64748b', marginBottom: '18px', maxWidth: '480px', margin: '0 auto 18px' }}>
                  No active promo codes in the database yet. Click below to create your first promo code asking for offer percentage and code amount limit.
                </p>
                <button 
                  type="button"
                  className="add-quick-product-btn"
                  onClick={() => setIsAddPromoModalOpen(true)}
                >
                  <Plus size={16} /> Create Promo Code
                </button>
              </div>
            ) : (
              <div className="coupons-admin-grid" style={{ marginTop: '20px' }}>
                {promoCodesList.map((c) => (
                  <div key={c.id} className="coupon-admin-card" style={{ border: c.status === 'inactive' ? '1px dashed #cbd5e1' : '1px solid #fed7aa', background: c.status === 'inactive' ? '#f8fafc' : '#fffbeb' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                      <div className="coupon-code-pill" style={{ fontSize: '1.1rem', letterSpacing: '0.5px' }}>
                        🏷️ {c.code}
                      </div>
                      <span className={c.status === 'inactive' ? 'inactive-tag' : 'active-tag'} style={{
                        background: c.status === 'inactive' ? '#e2e8f0' : '#dcfce7',
                        color: c.status === 'inactive' ? '#475569' : '#166534',
                        padding: '3px 8px',
                        borderRadius: '12px',
                        fontSize: '0.75rem',
                        fontWeight: 700
                      }}>
                        {c.status === 'inactive' ? 'Inactive' : 'Active'}
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '8px' }}>
                      <span style={{ fontSize: '1.4rem', fontWeight: 800, color: '#b45309' }}>
                        {c.discountPercentage}% OFF
                      </span>
                      <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#166534', background: '#dcfce7', padding: '2px 8px', borderRadius: '4px' }}>
                        Upto ₹{Number(c.maxDiscountAmount || 0).toLocaleString('en-IN')}
                      </span>
                    </div>

                    {c.minOrderAmount > 0 && (
                      <p style={{ margin: '0 0 4px', fontSize: '0.8rem', color: '#64748b' }}>
                        <strong>Min Cart Value:</strong> ₹{Number(c.minOrderAmount).toLocaleString('en-IN')}
                      </p>
                    )}

                    <p style={{ margin: '4px 0 10px', fontSize: '0.83rem', color: '#475569', lineHeight: '1.4' }}>
                      {c.description || `${c.discountPercentage}% OFF on orders upto ₹${Number(c.maxDiscountAmount || 0).toLocaleString('en-IN')}`}
                    </p>

                    <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginBottom: '12px' }}>
                      📅 {c.validTill || 'Valid until stocks last'}
                    </div>

                    <div className="coupon-card-footer" style={{ borderTop: '1px solid #f1f5f9', paddingTop: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <button
                        type="button"
                        onClick={() => handleTogglePromoStatus(c.id, c.status, c.code)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: c.status === 'active' ? '#d97706' : '#16a34a',
                          fontSize: '0.8rem',
                          fontWeight: 600,
                          cursor: 'pointer',
                          padding: '4px 6px'
                        }}
                      >
                        {c.status === 'active' ? 'Disable Code' : 'Enable Code'}
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDeletePromoCode(c.id, c.code)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#ef4444',
                          cursor: 'pointer',
                          padding: '4px 6px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          fontSize: '0.8rem',
                          fontWeight: 600
                        }}
                        title="Delete promo code from database"
                      >
                        <Trash2 size={14} /> Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 7: WEBSITE CONTENT */}
        {activeTab === 'content' && (
          <div className="admin-subpage-card animate-fade-in">
            <div className="subpage-header-row">
              <div>
                <h3>Website Content &amp; Showroom Details</h3>
                <p>Edit showroom contact details, address, opening timings, and announcement tickers.</p>
              </div>
            </div>

            <div className="content-edit-form">
              <div className="content-form-grid">
                <div className="form-field-group">
                  <label>Store Name</label>
                  <input
                    type="text"
                    value={siteContent.storeName}
                    onChange={(e) => setSiteContent({ ...siteContent, storeName: e.target.value })}
                  />
                </div>

                <div className="form-field-group">
                  <label>Contact Phone</label>
                  <input
                    type="text"
                    value={siteContent.phone}
                    onChange={(e) => setSiteContent({ ...siteContent, phone: e.target.value })}
                  />
                </div>

                <div className="form-field-group full-width">
                  <label>Showroom Address</label>
                  <input
                    type="text"
                    value={siteContent.address}
                    onChange={(e) => setSiteContent({ ...siteContent, address: e.target.value })}
                  />
                </div>

                <div className="form-field-group">
                  <label>Showroom Timings</label>
                  <input
                    type="text"
                    value={siteContent.timing}
                    onChange={(e) => setSiteContent({ ...siteContent, timing: e.target.value })}
                  />
                </div>

                <div className="form-field-group">
                  <label>Support Email</label>
                  <input
                    type="email"
                    value={siteContent.email}
                    onChange={(e) => setSiteContent({ ...siteContent, email: e.target.value })}
                  />
                </div>

                <div className="form-field-group full-width">
                  <label>Announcement Bar 1 (Top Ticker)</label>
                  <input
                    type="text"
                    value={siteContent.announcement1}
                    onChange={(e) => setSiteContent({ ...siteContent, announcement1: e.target.value })}
                  />
                </div>
              </div>

              {/* Dedicated Footer Branding & Social Media Editor (Matches User Image) */}
              <div className="footer-brand-editor-box">
                <div className="editor-subhead">
                  <Home size={18} className="editor-icon" />
                  <div>
                    <h4>Footer Brand &amp; Social Links Management</h4>
                    <small>Customize the brand description, tagline, and social media handles shown in the footer</small>
                  </div>
                </div>

                <div className="content-form-grid">
                  <div className="form-field-group full-width">
                    <label htmlFor="admin-footer-desc">Footer Brand Description / Mission Statement</label>
                    <textarea
                      id="admin-footer-desc"
                      name="footerDescription"
                      rows="3"
                      className="editor-textarea"
                      value={siteContent.footerDescription}
                      onChange={(e) => setSiteContent({ ...siteContent, footerDescription: e.target.value })}
                    />
                  </div>

                  <div className="form-field-group">
                    <label htmlFor="admin-footer-insta">Instagram URL</label>
                    <input
                      id="admin-footer-insta"
                      name="instagramUrl"
                      type="url"
                      placeholder="https://www.instagram.com/sardar_mart_ch_39"
                      value={siteContent.instagramUrl}
                      onChange={(e) => setSiteContent({ ...siteContent, instagramUrl: e.target.value })}
                    />
                  </div>

                  <div className="form-field-group">
                    <label htmlFor="admin-footer-fb">Facebook URL</label>
                    <input
                      id="admin-footer-fb"
                      name="facebookUrl"
                      type="url"
                      placeholder="https://facebook.com/sardarmart"
                      value={siteContent.facebookUrl}
                      onChange={(e) => setSiteContent({ ...siteContent, facebookUrl: e.target.value })}
                    />
                  </div>

                  <div className="form-field-group">
                    <label htmlFor="admin-footer-yt">YouTube Channel URL</label>
                    <input
                      id="admin-footer-yt"
                      name="youtubeUrl"
                      type="url"
                      placeholder="https://youtube.com/@sardarmart"
                      value={siteContent.youtubeUrl}
                      onChange={(e) => setSiteContent({ ...siteContent, youtubeUrl: e.target.value })}
                    />
                  </div>

                  <div className="form-field-group">
                    <label htmlFor="admin-footer-wa">WhatsApp Number (with country code)</label>
                    <input
                      id="admin-footer-wa"
                      name="whatsappNumber"
                      type="text"
                      placeholder="+91 6383056338"
                      value={siteContent.whatsappNumber}
                      onChange={(e) => setSiteContent({ ...siteContent, whatsappNumber: e.target.value })}
                    />
                  </div>
                </div>

                {/* Live Visual Card Preview (Exact representation of user image) */}
                <div className="footer-preview-wrapper">
                  <span className="preview-label">Live Preview of Footer Branding Block:</span>
                  <div className="footer-brand-live-preview">
                    <div className="preview-logo-row">
                      <div className="preview-logo-icon">⚡</div>
                      <div className="preview-logo-text">
                        <span><strong>{siteContent.storeName || 'Sardar Mart Furniture and Home Appliances'}</strong></span>
                        <small>PREMIUM FURNITURE &amp; HOME APPLIANCES</small>
                      </div>
                    </div>
                    <p className="preview-desc-text">
                      {siteContent.footerDescription}
                    </p>
                    <div className="preview-social-icons-row">
                      <div className="preview-social-btn" title="Instagram">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
                      </div>
                      <div className="preview-social-btn" title="Facebook">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
                      </div>
                      <div className="preview-social-btn" title="YouTube">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17"/><polygon points="10 15 15 12 10 9 10 15"/></svg>
                      </div>
                      <div className="preview-social-btn" title="WhatsApp">
                        <MessageCircle size={16} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <button
                className="save-content-btn"
                disabled={savingSettings}
                onClick={() => handleSaveStoreConfig(siteContent, 'Website content & showroom info saved to Firebase!')}
              >
                {savingSettings ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
                <span>{savingSettings ? 'Saving to Firebase...' : 'Save Content Changes to Firebase'}</span>
              </button>
            </div>
          </div>
        )}

        {/* TAB: CUSTOMERS (AGGREGATED FROM LIVE FIRESTORE ORDERS) */}
        {activeTab === 'customers' && (
          <div className="admin-subpage-card animate-fade-in">
            <div className="subpage-header-row">
              <div>
                <h3>Customer Directory &amp; History</h3>
                <p>Profiles and purchasing activity aggregated from Cloud Firestore orders.</p>
              </div>
            </div>

            <div className="subpage-filters-bar">
              <div className="filter-search-box">
                <Search size={16} />
                <input
                  type="text"
                  placeholder="Search customers by name, phone, or city..."
                  value={customerSearch}
                  onChange={(e) => setCustomerSearch(e.target.value)}
                />
              </div>
            </div>

            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Customer Name</th>
                    <th>Phone Number</th>
                    <th>Email Address</th>
                    <th>City / Location</th>
                    <th>Total Orders</th>
                    <th>Lifetime Spend</th>
                    <th>Last Active</th>
                  </tr>
                </thead>
                <tbody>
                  {customerList.filter((c) => {
                    const q = customerSearch.toLowerCase();
                    return !q || c.name.toLowerCase().includes(q) || c.phone.includes(q) || c.city.toLowerCase().includes(q);
                  }).length === 0 ? (
                    <tr>
                      <td colSpan="7" style={{ textAlign: 'center', padding: '36px', color: '#64748b' }}>
                        {customerList.length === 0
                          ? 'No customer records in Firebase yet. When customers place orders or create accounts, they will appear here.'
                          : 'No customers match your search.'}
                      </td>
                    </tr>
                  ) : (
                    customerList
                      .filter((c) => {
                        const q = customerSearch.toLowerCase();
                        return !q || 
                          c.name.toLowerCase().includes(q) || 
                          c.phone.includes(q) || 
                          (c.email || '').toLowerCase().includes(q) || 
                          (c.city || '').toLowerCase().includes(q) ||
                          (c.address || '').toLowerCase().includes(q);
                      })
                      .map((c, idx) => (
                        <tr key={idx}>
                          <td><strong>{c.name}</strong></td>
                          <td><small>{c.phone}</small></td>
                          <td><small>{c.email}</small></td>
                          <td>
                            <strong>{c.city}</strong>
                            {c.address && c.address !== '—' && (
                              <small style={{ display: 'block', color: '#64748b', fontSize: '0.72rem', maxWidth: '220px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={c.address}>
                                {c.address}
                              </small>
                            )}
                          </td>
                          <td><span className="cat-count-badge">{c.orderCount} Orders</span></td>
                          <td><strong>{formatPrice(c.totalSpent)}</strong></td>
                          <td><small>{c.lastOrder}</small></td>
                        </tr>
                      ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB: REVIEWS & FEEDBACK */}
        {activeTab === 'reviews' && (() => {
          // Merge customerReviews and enquiries (avoiding duplicates)
          const allFeedbacks = [...customerReviews];
          enquiries.forEach((enq) => {
            const alreadyExists = allFeedbacks.some(
              (r) => r.id === enq.id || (enq.reviewId && r.id === enq.reviewId)
            );
            if (!alreadyExists) {
              allFeedbacks.push({
                ...enq,
                rating: Number(enq.rating) || 5,
                feedback: enq.message || enq.feedback || '',
                message: enq.message || enq.feedback || '',
                date: enq.date || 'Recent'
              });
            }
          });

          // Metrics
          const totalFeedbacks = allFeedbacks.length;
          const avgRating = totalFeedbacks > 0 
            ? (allFeedbacks.reduce((acc, r) => acc + (Number(r.rating) || 5), 0) / totalFeedbacks).toFixed(1)
            : '5.0';
          const newCount = allFeedbacks.filter(r => (r.status || 'New') === 'New').length;
          const contactedCount = allFeedbacks.filter(r => r.status === 'Contacted').length;
          const resolvedCount = allFeedbacks.filter(r => r.status === 'Resolved').length;

          // Filter by search, status, and rating
          const filteredFeedbacks = allFeedbacks.filter((item) => {
            const matchesStatus = reviewStatusFilter === 'all' 
              ? true 
              : (item.status || 'New').toLowerCase() === reviewStatusFilter.toLowerCase();
            const matchesRating = reviewRatingFilter === 'all'
              ? true
              : String(item.rating || 5) === String(reviewRatingFilter);
            const searchLower = reviewSearch.trim().toLowerCase();
            const matchesSearch = !searchLower || 
              (item.name || '').toLowerCase().includes(searchLower) ||
              (item.phone || '').toLowerCase().includes(searchLower) ||
              (item.contact || '').toLowerCase().includes(searchLower) ||
              (item.email || '').toLowerCase().includes(searchLower) ||
              (item.category || '').toLowerCase().includes(searchLower) ||
              (item.message || item.feedback || '').toLowerCase().includes(searchLower);

            return matchesStatus && matchesRating && matchesSearch;
          });

          const handleStatusChange = async (item, newStatus) => {
            try {
              setUpdatingReviewId(item.id);
              await updateReviewStatus(item.id, newStatus).catch(() => {});
              await updateEnquiryStatus(item.id, newStatus).catch(() => {});
              showToast(`Status updated to "${newStatus}"`);
            } catch (err) {
              showToast('Error updating status: ' + err.message);
            } finally {
              setUpdatingReviewId(null);
            }
          };

          const handleDelete = async (item) => {
            if (window.confirm(`Delete customer feedback from "${item.name}"?`)) {
              try {
                await deleteReview(item.id).catch(() => {});
                await deleteEnquiry(item.id).catch(() => {});
                showToast('Feedback removed from Firestore');
              } catch (err) {
                showToast('Error deleting: ' + err.message);
              }
            }
          };

          return (
            <div className="admin-subpage-card animate-fade-in">
              <div className="subpage-header-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <h3 style={{ margin: 0 }}>Customer Reviews &amp; Showroom Feedback</h3>
                    <span style={{ fontSize: '0.72rem', background: '#dcfce7', color: '#15803d', padding: '3px 8px', borderRadius: '12px', fontWeight: 700 }}>
                      🟢 Live Firestore Sync
                    </span>
                  </div>
                  <p style={{ margin: '4px 0 0', color: '#64748b' }}>
                    Real-time customer reviews and enquiries submitted from the Contact page with complete customer contact details.
                  </p>
                </div>

                {/* View Mode Toggle Buttons */}
                <div style={{ display: 'flex', gap: '8px', background: '#f1f5f9', padding: '4px', borderRadius: '10px' }}>
                  <button
                    type="button"
                    style={{
                      padding: '7px 14px',
                      borderRadius: '8px',
                      border: 'none',
                      fontSize: '0.82rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      background: reviewViewMode === 'feedbacks' ? '#ffffff' : 'transparent',
                      color: reviewViewMode === 'feedbacks' ? '#b45309' : '#64748b',
                      boxShadow: reviewViewMode === 'feedbacks' ? '0 2px 6px rgba(0,0,0,0.06)' : 'none'
                    }}
                    onClick={() => setReviewViewMode('feedbacks')}
                  >
                    💬 Contact Feedbacks ({totalFeedbacks})
                  </button>
                  <button
                    type="button"
                    style={{
                      padding: '7px 14px',
                      borderRadius: '8px',
                      border: 'none',
                      fontSize: '0.82rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      background: reviewViewMode === 'catalog' ? '#ffffff' : 'transparent',
                      color: reviewViewMode === 'catalog' ? '#b45309' : '#64748b',
                      boxShadow: reviewViewMode === 'catalog' ? '0 2px 6px rgba(0,0,0,0.06)' : 'none'
                    }}
                    onClick={() => setReviewViewMode('catalog')}
                  >
                    ⭐ Catalog Ratings ({products.length})
                  </button>
                </div>
              </div>

              {/* KPI CARDS */}
              <div className="kpi-cards-grid" style={{ marginBottom: '24px', marginTop: '20px' }}>
                <div className="kpi-card">
                  <div className="kpi-icon-wrap brown">
                    <Star size={22} />
                  </div>
                  <div className="kpi-data-wrap">
                    <span className="kpi-number">{avgRating} / 5.0</span>
                    <span className="kpi-label">Average Satisfaction</span>
                  </div>
                  <div className="kpi-growth-pill positive">★ {totalFeedbacks} Total Reviews</div>
                </div>

                <div className="kpi-card">
                  <div className="kpi-icon-wrap orange">
                    <MessageSquare size={22} />
                  </div>
                  <div className="kpi-data-wrap">
                    <span className="kpi-number">{newCount}</span>
                    <span className="kpi-label">New / Pending Leads</span>
                  </div>
                  <div className="kpi-growth-pill" style={{ background: '#fef3c7', color: '#b45309' }}>Requires Follow-up</div>
                </div>

                <div className="kpi-card">
                  <div className="kpi-icon-wrap green">
                    <CheckCircle size={22} />
                  </div>
                  <div className="kpi-data-wrap">
                    <span className="kpi-number">{contactedCount + resolvedCount}</span>
                    <span className="kpi-label">Addressed &amp; Resolved</span>
                  </div>
                  <div className="kpi-growth-pill positive">100% Attended</div>
                </div>
              </div>

              {/* MODE 1: CUSTOMER CONTACT FEEDBACK & REVIEWS */}
              {reviewViewMode === 'feedbacks' && (
                <>
                  {/* Filters Bar */}
                  <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center', marginBottom: '20px', background: '#f8fafc', padding: '14px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                    
                    {/* Search Input */}
                    <div style={{ flex: '1 1 240px', position: 'relative' }}>
                      <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                      <input
                        type="text"
                        placeholder="Search by customer name, phone, email, feedback..."
                        value={reviewSearch}
                        onChange={(e) => setReviewSearch(e.target.value)}
                        style={{ width: '100%', padding: '8px 12px 8px 36px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.84rem' }}
                      />
                    </div>

                    {/* Status Tabs */}
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                      {[
                        { label: 'All', val: 'all', count: totalFeedbacks },
                        { label: 'New', val: 'New', count: newCount },
                        { label: 'Contacted', val: 'Contacted', count: contactedCount },
                        { label: 'Resolved', val: 'Resolved', count: resolvedCount }
                      ].map((tab) => (
                        <button
                          key={tab.val}
                          type="button"
                          onClick={() => setReviewStatusFilter(tab.val)}
                          style={{
                            padding: '6px 12px',
                            borderRadius: '8px',
                            border: '1px solid',
                            borderColor: reviewStatusFilter === tab.val ? '#b45309' : '#cbd5e1',
                            background: reviewStatusFilter === tab.val ? '#b45309' : '#ffffff',
                            color: reviewStatusFilter === tab.val ? '#ffffff' : '#475569',
                            fontSize: '0.8rem',
                            fontWeight: 700,
                            cursor: 'pointer'
                          }}
                        >
                          {tab.label} ({tab.count})
                        </button>
                      ))}
                    </div>

                    {/* Rating Dropdown */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#64748b' }}>Rating:</span>
                      <select
                        value={reviewRatingFilter}
                        onChange={(e) => setReviewRatingFilter(e.target.value)}
                        style={{ padding: '7px 10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.82rem', background: '#ffffff', fontWeight: 600 }}
                      >
                        <option value="all">All Star Ratings</option>
                        <option value="5">★★★★★ 5 Stars Only</option>
                        <option value="4">★★★★☆ 4 Stars Only</option>
                        <option value="3">★★★☆☆ 3 Stars Only</option>
                        <option value="2">★★☆☆☆ 2 Stars Only</option>
                        <option value="1">★☆☆☆☆ 1 Star Only</option>
                      </select>
                    </div>

                  </div>

                  {/* Feedbacks Grid / List */}
                  {filteredFeedbacks.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '50px 20px', background: '#ffffff', border: '1.5px dashed #cbd5e1', borderRadius: '16px' }}>
                      <MessageSquare size={44} color="#94a3b8" style={{ margin: '0 auto 12px' }} />
                      <h4 style={{ margin: '0 0 6px', color: '#1e293b', fontSize: '1.15rem' }}>No Customer Reviews Found</h4>
                      <p style={{ margin: 0, color: '#64748b', fontSize: '0.88rem' }}>
                        {reviewSearch || reviewStatusFilter !== 'all' || reviewRatingFilter !== 'all'
                          ? 'No feedbacks match the active search or filter criteria.'
                          : 'When customers submit feedback from the website Contact page, their full contact details and reviews will appear here automatically.'}
                      </p>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      {filteredFeedbacks.map((item) => {
                        const cleanPhone = (item.phone || item.contact || '').replace(/\D/g, '');
                        const waText = encodeURIComponent(
                          `Hello ${item.name}! This is Sardar Mart Furniture and Home Appliances regarding your feedback on ${item.category || 'our showroom'}. Thank you for reaching out to us!`
                        );

                        return (
                          <div 
                            key={item.id}
                            style={{
                              background: '#ffffff',
                              border: '1.5px solid #e2e8f0',
                              borderRadius: '16px',
                              padding: '20px 24px',
                              boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
                              transition: 'all 0.2s ease'
                            }}
                          >
                            {/* Card Header Row */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px', marginBottom: '14px', borderBottom: '1px solid #f1f5f9', paddingBottom: '12px' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <div style={{
                                  width: '42px',
                                  height: '42px',
                                  borderRadius: '50%',
                                  background: '#fef3c7',
                                  color: '#b45309',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  fontWeight: 800,
                                  fontSize: '1rem'
                                }}>
                                  {(item.name || 'C').charAt(0).toUpperCase()}
                                </div>
                                <div>
                                  <h4 style={{ margin: 0, fontSize: '1.05rem', color: '#0f172a', fontWeight: 800 }}>
                                    {item.name || 'Valued Customer'}
                                  </h4>
                                  <span style={{ fontSize: '0.78rem', color: '#64748b' }}>
                                    Submitted {item.date || 'Recent'} {item.time ? `at ${item.time}` : ''} • Ref: #{String(item.id).slice(-6).toUpperCase()}
                                  </span>
                                </div>
                              </div>

                              {/* Star Rating & Status Badge */}
                              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '2px', background: '#fffbeb', border: '1px solid #fde68a', padding: '4px 10px', borderRadius: '8px' }}>
                                  {[1, 2, 3, 4, 5].map((s) => (
                                    <Star 
                                      key={s} 
                                      size={15} 
                                      fill={s <= (Number(item.rating) || 5) ? '#f59e0b' : 'none'} 
                                      color={s <= (Number(item.rating) || 5) ? '#f59e0b' : '#cbd5e1'} 
                                    />
                                  ))}
                                  <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#b45309', marginLeft: '4px' }}>
                                    {item.rating || 5}.0
                                  </span>
                                </div>

                                {/* Status Dropdown */}
                                <select
                                  value={item.status || 'New'}
                                  onChange={(e) => handleStatusChange(item, e.target.value)}
                                  disabled={updatingReviewId === item.id}
                                  style={{
                                    padding: '5px 10px',
                                    borderRadius: '8px',
                                    fontSize: '0.8rem',
                                    fontWeight: 700,
                                    cursor: 'pointer',
                                    border: '1px solid',
                                    borderColor: (item.status === 'Resolved') ? '#bbf7d0' : (item.status === 'Contacted') ? '#bfdbfe' : '#fde68a',
                                    background: (item.status === 'Resolved') ? '#dcfce7' : (item.status === 'Contacted') ? '#eff6ff' : '#fef3c7',
                                    color: (item.status === 'Resolved') ? '#15803d' : (item.status === 'Contacted') ? '#1d4ed8' : '#b45309'
                                  }}
                                >
                                  <option value="New">🟡 New</option>
                                  <option value="Contacted">🔵 Contacted</option>
                                  <option value="Resolved">🟢 Resolved</option>
                                </select>
                              </div>
                            </div>

                            {/* Customer Contact Details Strip (Requested by User) */}
                            <div style={{ 
                              display: 'flex', 
                              flexWrap: 'wrap', 
                              gap: '14px', 
                              alignItems: 'center', 
                              background: '#f8fafc', 
                              padding: '12px 16px', 
                              borderRadius: '10px', 
                              border: '1px solid #e2e8f0',
                              marginBottom: '14px'
                            }}>
                              {/* Phone */}
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Phone size={15} color="#b45309" />
                                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#1e293b' }}>
                                  {item.phone || item.contact || 'No phone provided'}
                                </span>
                                {cleanPhone && (
                                  <div style={{ display: 'flex', gap: '4px', marginLeft: '4px' }}>
                                    <a
                                      href={`tel:${cleanPhone}`}
                                      style={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '4px',
                                        background: '#f1f5f9',
                                        color: '#334155',
                                        padding: '3px 8px',
                                        borderRadius: '6px',
                                        fontSize: '0.74rem',
                                        fontWeight: 700,
                                        textDecoration: 'none',
                                        border: '1px solid #cbd5e1'
                                      }}
                                    >
                                      Call
                                    </a>
                                    <a
                                      href={`https://wa.me/91${cleanPhone}?text=${waText}`}
                                      target="_blank"
                                      rel="noreferrer"
                                      style={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '4px',
                                        background: '#dcfce7',
                                        color: '#15803d',
                                        padding: '3px 8px',
                                        borderRadius: '6px',
                                        fontSize: '0.74rem',
                                        fontWeight: 700,
                                        textDecoration: 'none',
                                        border: '1px solid #bbf7d0'
                                      }}
                                    >
                                      <MessageCircle size={12} /> WhatsApp
                                    </a>
                                  </div>
                                )}
                              </div>

                              {/* Email */}
                              {item.email && (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                  <Mail size={15} color="#4338ca" />
                                  <a 
                                    href={`mailto:${item.email}`}
                                    style={{ fontSize: '0.85rem', color: '#4338ca', fontWeight: 600, textDecoration: 'underline' }}
                                  >
                                    {item.email}
                                  </a>
                                </div>
                              )}

                              {/* Category & Branch Badges */}
                              <div style={{ marginLeft: 'auto', display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                                {item.category && (
                                  <span style={{ fontSize: '0.74rem', background: '#ffedd5', color: '#9a3412', padding: '3px 8px', borderRadius: '6px', fontWeight: 700 }}>
                                    🏷️ {item.category}
                                  </span>
                                )}
                                {item.branch && (
                                  <span style={{ fontSize: '0.74rem', background: '#f1f5f9', color: '#475569', padding: '3px 8px', borderRadius: '6px', fontWeight: 600 }}>
                                    📍 {item.branch.split('(')[0]}
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* Customer Feedback Message */}
                            <div style={{
                              borderLeft: '4px solid #b45309',
                              padding: '10px 14px',
                              borderRadius: '0 8px 8px 0',
                              background: '#fffdfa',
                              marginBottom: '12px'
                            }}>
                              <p style={{ margin: 0, fontSize: '0.92rem', color: '#1e293b', lineHeight: 1.5, fontWeight: 500 }}>
                                "{item.message || item.feedback || 'No feedback message entered.'}"
                              </p>
                            </div>

                            {/* Bottom Action Footer */}
                            <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '10px' }}>
                              {cleanPhone && (
                                <a
                                  href={`https://wa.me/91${cleanPhone}?text=${waText}`}
                                  target="_blank"
                                  rel="noreferrer"
                                  style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                    background: '#15803d',
                                    color: '#ffffff',
                                    padding: '6px 14px',
                                    borderRadius: '8px',
                                    fontSize: '0.82rem',
                                    fontWeight: 700,
                                    textDecoration: 'none'
                                  }}
                                >
                                  <MessageCircle size={14} /> Reply on WhatsApp
                                </a>
                              )}
                              <button
                                type="button"
                                onClick={() => handleDelete(item)}
                                style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '5px',
                                  background: '#fee2e2',
                                  color: '#dc2626',
                                  border: '1px solid #fecaca',
                                  padding: '6px 12px',
                                  borderRadius: '8px',
                                  fontSize: '0.82rem',
                                  fontWeight: 700,
                                  cursor: 'pointer'
                                }}
                              >
                                <Trash2 size={13} /> Delete
                              </button>
                            </div>

                          </div>
                        );
                      })}
                    </div>
                  )}
                </>
              )}

              {/* MODE 2: CATALOG PRODUCT RATINGS */}
              {reviewViewMode === 'catalog' && (
                <div className="admin-table-wrap">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Product</th>
                        <th>Category</th>
                        <th>Rating</th>
                        <th>Review Count</th>
                        <th>Promotional Badge</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.map((p) => (
                        <tr key={p.id}>
                          <td>
                            <div className="product-table-item-cell">
                              <img src={p.image} alt={p.name} className="product-thumb-sm" />
                              <div>
                                <strong>{p.name}</strong>
                                <small>ID: {p.id}</small>
                              </div>
                            </div>
                          </td>
                          <td><span className="category-pill-tag">{p.category}</span></td>
                          <td><strong>★ {p.rating || '4.8'}</strong></td>
                          <td><small>{p.reviews || p.reviewsCount || 12} Verified Reviews</small></td>
                          <td>{p.badge ? <span className="badge-promo-pill">{p.badge}</span> : '—'}</td>
                          <td><span className="in-stock-badge">Published</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

            </div>
          );
        })()}

        {/* TAB: REPORTS */}
        {activeTab === 'reports' && (
          <div className="admin-subpage-card animate-fade-in">
            <div className="subpage-header-row">
              <div>
                <h3>Executive Store Analytics &amp; Reports</h3>
                <p>Live inventory valuation, sales breakdown, and performance metrics from Cloud Firestore.</p>
              </div>
            </div>

            <div className="kpi-cards-grid" style={{ marginBottom: '24px' }}>
              <div className="kpi-card">
                <div className="kpi-icon-wrap brown">
                  <IndianRupee size={22} />
                </div>
                <div className="kpi-data-wrap">
                  <span className="kpi-number">{formatPrice(totalCatalogInventoryValue)}</span>
                  <span className="kpi-label">Catalog Inventory Value</span>
                </div>
                <div className="kpi-growth-pill positive">Stocked</div>
              </div>

              <div className="kpi-card">
                <div className="kpi-icon-wrap orange">
                  <ShoppingCart size={22} />
                </div>
                <div className="kpi-data-wrap">
                  <span className="kpi-number">{formatPrice(totalRevenue)}</span>
                  <span className="kpi-label">Total Realized Revenue</span>
                </div>
                <div className="kpi-growth-pill positive">Orders: {orders.length}</div>
              </div>

              <div className="kpi-card">
                <div className="kpi-icon-wrap blue">
                  <Package size={22} />
                </div>
                <div className="kpi-data-wrap">
                  <span className="kpi-number">{totalProductsCount} Items</span>
                  <span className="kpi-label">Active Catalog SKU Count</span>
                </div>
                <div className="kpi-growth-pill positive">Live</div>
              </div>
            </div>

            <div className="analytics-two-col-grid">
              <div className="chart-card">
                <div className="chart-card-header">
                  <h4>Category Inventory Breakdown</h4>
                </div>
                <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                      <strong>Furniture Department</strong>
                      <span>{furnitureProducts.length} items ({furniturePct}%)</span>
                    </div>
                    <div style={{ background: '#e2e8f0', borderRadius: '6px', height: '10px', overflow: 'hidden' }}>
                      <div style={{ background: '#854d0e', height: '100%', width: `${furniturePct}%` }}></div>
                    </div>
                  </div>

                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                      <strong>Electronics Department</strong>
                      <span>{electronicsProducts.length} items ({electronicsPct}%)</span>
                    </div>
                    <div style={{ background: '#e2e8f0', borderRadius: '6px', height: '10px', overflow: 'hidden' }}>
                      <div style={{ background: '#d97706', height: '100%', width: `${electronicsPct}%` }}></div>
                    </div>
                  </div>

                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                      <strong>Home Appliances</strong>
                      <span>{appliancesProducts.length} items ({appliancesPct}%)</span>
                    </div>
                    <div style={{ background: '#e2e8f0', borderRadius: '6px', height: '10px', overflow: 'hidden' }}>
                      <div style={{ background: '#3b82f6', height: '100%', width: `${appliancesPct}%` }}></div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="chart-card">
                <div className="chart-card-header">
                  <h4>Order Fulfillment Status</h4>
                </div>
                <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {['Delivered', 'Out for Delivery', 'Processing', 'Order Placed', 'Cancelled'].map((st, sidx) => {
                    const count = orders.filter(o => o.status === st).length;
                    return (
                      <div key={sidx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 0', borderBottom: '1px solid #f1f5f9' }}>
                        <span className={`status-pill-badge ${st.toLowerCase().replace(/\s+/g, '-')}`}>{st}</span>
                        <strong>{count} Orders</strong>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 8: SETTINGS (ADMIN SET) */}
        {activeTab === 'settings' && (
          <div className="admin-subpage-card animate-fade-in">
            <div className="subpage-header-row">
              <div>
                <h3>Admin Settings &amp; Configuration</h3>
                <p>Manage administrator credentials, store legal profile, tax GST rates, billing, and system backups.</p>
              </div>
              <button 
                className="save-content-btn"
                disabled={savingSettings}
                onClick={() => handleSaveStoreConfig(storeSettings, 'Store settings & legal configuration saved to Firebase!')}
              >
                {savingSettings ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
                <span>{savingSettings ? 'Saving...' : 'Save All Settings to Firebase'}</span>
              </button>
            </div>

            {/* Sub-section 1: Admin Account Credentials */}
            <div className="settings-section-panel">
              <div className="settings-section-head">
                <ShieldCheck size={20} className="section-icon" />
                <div>
                  <h4>Admin Account &amp; Login Credentials</h4>
                  <small>Manage your administrator profile name, login email, and password</small>
                </div>
              </div>

              <div className="settings-form-grid">
                <div className="form-field-group">
                  <label>Administrator Display Name</label>
                  <input
                    type="text"
                    value={adminProfile.name}
                    onChange={(e) => setAdminProfile({ ...adminProfile, name: e.target.value })}
                  />
                </div>

                <div className="form-field-group">
                  <label>Admin Login Email</label>
                  <input
                    type="email"
                    value={adminProfile.email}
                    onChange={(e) => setAdminProfile({ ...adminProfile, email: e.target.value })}
                  />
                </div>

                <div className="form-field-group">
                  <label>Admin Mobile Phone</label>
                  <input
                    type="text"
                    value={adminProfile.phone}
                    onChange={(e) => setAdminProfile({ ...adminProfile, phone: e.target.value })}
                  />
                </div>

                <div className="form-field-group">
                  <label>Security Role</label>
                  <input
                    type="text"
                    value={adminProfile.role}
                    disabled
                    style={{ background: '#f1f5f9', cursor: 'not-allowed' }}
                  />
                </div>
              </div>

              {/* Password change sub-box */}
              <div className="password-change-box">
                <h5>Change Admin Password</h5>
                <div className="settings-form-grid">
                  <div className="form-field-group">
                    <label>New Password</label>
                    <input
                      type="password"
                      placeholder="Enter new secure password"
                      value={adminPasswordForm.newPassword}
                      onChange={(e) => setAdminPasswordForm({ ...adminPasswordForm, newPassword: e.target.value })}
                    />
                  </div>
                  <div className="form-field-group">
                    <label>Confirm New Password</label>
                    <input
                      type="password"
                      placeholder="Repeat new password"
                      value={adminPasswordForm.confirmPassword}
                      onChange={(e) => setAdminPasswordForm({ ...adminPasswordForm, confirmPassword: e.target.value })}
                    />
                  </div>
                </div>
                <button
                  type="button"
                  className="btn-update-pwd"
                  disabled={updatingPassword}
                  onClick={handleUpdateAdminPassword}
                >
                  {updatingPassword ? <Loader2 size={14} className="animate-spin" /> : <Lock size={14} />}
                  <span>{updatingPassword ? 'Updating Firebase...' : 'Update Admin Password in Firebase'}</span>
                </button>
              </div>
            </div>

            {/* Sub-section 2: Business & Store Legal Profile */}
            <div className="settings-section-panel">
              <div className="settings-section-head">
                <Home size={20} className="section-icon" />
                <div>
                  <h4>Store &amp; Business Legal Profile</h4>
                  <small>Appears on customer invoices, receipts, and order tracking slips</small>
                </div>
              </div>

              <div className="settings-form-grid">
                <div className="form-field-group">
                  <label>Legal Business / Entity Name</label>
                  <input
                    type="text"
                    value={storeSettings.storeLegalName}
                    onChange={(e) => setStoreSettings({ ...storeSettings, storeLegalName: e.target.value })}
                  />
                </div>

                <div className="form-field-group">
                  <label>GSTIN Tax Registration Number</label>
                  <input
                    type="text"
                    value={storeSettings.gstNumber}
                    onChange={(e) => setStoreSettings({ ...storeSettings, gstNumber: e.target.value })}
                  />
                </div>

                <div className="form-field-group">
                  <label>Showroom Contact Helpline</label>
                  <input
                    type="text"
                    value={siteContent.phone}
                    onChange={(e) => setSiteContent({ ...siteContent, phone: e.target.value })}
                  />
                </div>

                <div className="form-field-group">
                  <label>Official Customer Support Email</label>
                  <input
                    type="email"
                    value={siteContent.email}
                    onChange={(e) => setSiteContent({ ...siteContent, email: e.target.value })}
                  />
                </div>

                <div className="form-field-group full-width">
                  <label>Registered Showroom Address</label>
                  <input
                    type="text"
                    value={siteContent.address}
                    onChange={(e) => setSiteContent({ ...siteContent, address: e.target.value })}
                  />
                </div>
              </div>
            </div>

            {/* Sub-section 3: Billing, Tax & Invoicing Rules */}
            <div className="settings-section-panel">
              <div className="settings-section-head">
                <IndianRupee size={20} className="section-icon" />
                <div>
                  <h4>Billing, Tax &amp; Invoicing Rules</h4>
                  <small>Customize currency symbols, GST calculation, and invoice serial numbers</small>
                </div>
              </div>

              <div className="settings-form-grid">
                <div className="form-field-group">
                  <label>Store Currency</label>
                  <input
                    type="text"
                    value={storeSettings.currency}
                    onChange={(e) => setStoreSettings({ ...storeSettings, currency: e.target.value })}
                  />
                </div>

                <div className="form-field-group">
                  <label>Standard GST Tax Rate (%)</label>
                  <input
                    type="text"
                    value={storeSettings.taxGst}
                    onChange={(e) => setStoreSettings({ ...storeSettings, taxGst: e.target.value })}
                  />
                </div>

                <div className="form-field-group">
                  <label>Bill / Order Number Prefix</label>
                  <input
                    type="text"
                    value={storeSettings.invoicePrefix}
                    onChange={(e) => setStoreSettings({ ...storeSettings, invoicePrefix: e.target.value })}
                  />
                </div>

                <div className="form-field-group">
                  <label>Free Shipping Minimum Order (₹)</label>
                  <input
                    type="number"
                    value={storeSettings.freeShippingThreshold}
                    onChange={(e) => setStoreSettings({ ...storeSettings, freeShippingThreshold: e.target.value })}
                  />
                </div>

                <div className="form-field-group">
                  <label>Standard Delivery Charge (₹)</label>
                  <input
                    type="number"
                    value={storeSettings.standardDeliveryFee}
                    onChange={(e) => setStoreSettings({ ...storeSettings, standardDeliveryFee: e.target.value })}
                  />
                </div>

                <div className="form-field-group">
                  <label>Default Status on New Order</label>
                  <select
                    value={storeSettings.defaultOrderStatus}
                    onChange={(e) => setStoreSettings({ ...storeSettings, defaultOrderStatus: e.target.value })}
                  >
                    <option value="Order Placed">Order Placed</option>
                    <option value="Confirmed">Confirmed</option>
                    <option value="Processing">Processing</option>
                  </select>
                </div>

                <div className="form-field-group">
                  <label>Display Discount % on Storefront</label>
                  <select
                    value={storeSettings.showDiscountPercentage === true ? 'yes' : 'no'}
                    onChange={(e) => setStoreSettings({ ...storeSettings, showDiscountPercentage: e.target.value === 'yes' })}
                  >
                    <option value="no">Disabled (Hide discount % badges on storefront)</option>
                    <option value="yes">Enabled (Show discount % badges on cards)</option>
                  </select>
                  <small style={{ color: '#64748b', fontSize: '0.72rem', marginTop: '4px', display: 'block' }}>
                    Controls whether '% OFF' badges appear on product cards across the website.
                  </small>
                </div>
              </div>
            </div>

            {/* Sub-section 4: Logistics & Notification Alerts */}
            <div className="settings-section-panel">
              <div className="settings-section-head">
                <Truck size={20} className="section-icon" />
                <div>
                  <h4>Logistics Fleet &amp; Notification Alerts</h4>
                  <small>Delivery carrier and instant customer communication settings</small>
                </div>
              </div>

              <div className="settings-form-grid">
                <div className="form-field-group">
                  <label>Default Courier Partner Name</label>
                  <input
                    type="text"
                    value={storeSettings.courierPartner}
                    onChange={(e) => setStoreSettings({ ...storeSettings, courierPartner: e.target.value })}
                  />
                </div>

                <div className="form-field-group">
                  <label>WhatsApp Instant Alerts</label>
                  <select
                    value={storeSettings.whatsappAlerts ? 'yes' : 'no'}
                    onChange={(e) => setStoreSettings({ ...storeSettings, whatsappAlerts: e.target.value === 'yes' })}
                  >
                    <option value="yes">Enabled (Send WhatsApp alert on order dispatch)</option>
                    <option value="no">Disabled</option>
                  </select>
                </div>

                <div className="form-field-group">
                  <label>SMS Notifications</label>
                  <select
                    value={storeSettings.smsAlerts ? 'yes' : 'no'}
                    onChange={(e) => setStoreSettings({ ...storeSettings, smsAlerts: e.target.value === 'yes' })}
                  >
                    <option value="yes">Enabled (Send SMS receipt to customer)</option>
                    <option value="no">Disabled</option>
                  </select>
                </div>

                <div className="form-field-group">
                  <label>Admin Daily Email Reports</label>
                  <select
                    value={storeSettings.emailReports ? 'yes' : 'no'}
                    onChange={(e) => setStoreSettings({ ...storeSettings, emailReports: e.target.value === 'yes' })}
                  >
                    <option value="yes">Enabled (Send summary to admin email)</option>
                    <option value="no">Disabled</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Sub-section 5: System & Data Backup Controls */}
            <div className="settings-section-panel">
              <div className="settings-section-head">
                <RefreshCw size={20} className="section-icon" />
                <div>
                  <h4>System Data, Backup &amp; Reset</h4>
                  <small>Download store records or reset demo orders and catalog</small>
                </div>
              </div>

              <div className="system-actions-grid">
                <button
                  type="button"
                  className="system-action-btn export"
                  onClick={() => {
                    const data = {
                      products,
                      orders,
                      enquiries,
                      storeSettings,
                      siteContent,
                      adminProfile,
                      exportedAt: new Date().toISOString()
                    };
                    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `Sardar-Store-Data-Backup-${Date.now()}.json`;
                    a.click();
                    showToast('Store data backup downloaded!');
                  }}
                >
                  <FileText size={16} /> Export Store Data (.JSON)
                </button>

                <button
                  type="button"
                  className="system-action-btn"
                  onClick={async () => {
                    if (window.confirm('Sync latest store configuration from Cloud Firestore?')) {
                      const fresh = await getStoreSettings();
                      setStoreSettings(fresh);
                      setSiteContent(fresh);
                      showToast('Synced from Cloud Firestore!');
                    }
                  }}
                >
                  <RefreshCw size={16} /> Sync Configuration from Firestore
                </button>

                <button
                  type="button"
                  className="system-action-btn danger"
                  onClick={() => {
                    if (window.confirm('Clear all local browser caches and reload live Firestore records?')) {
                      localStorage.clear();
                      window.location.reload();
                    }
                  }}
                >
                  <Trash2 size={16} /> Clear Local Cache &amp; Refresh
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 9: STAFF & ADMIN USERS MANAGEMENT (SUPER ADMIN) */}
        {activeTab === 'admin-users' && (
          <div className="admin-subpage-card animate-fade-in">
            <div className="subpage-header-row">
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <h3>Admin &amp; Staff Management</h3>
                  <span style={{
                    background: '#fef3c7',
                    color: '#b45309',
                    fontSize: '0.72rem',
                    fontWeight: 800,
                    padding: '2px 8px',
                    borderRadius: '12px',
                    border: '1px solid #fde68a'
                  }}>
                    Super Admin Controlled
                  </span>
                </div>
                <p>Register logins and credentials for Shop Admins, Showroom Staff, and Store Employees.</p>
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  type="button"
                  className="add-quick-product-btn"
                  onClick={loadStaff}
                  disabled={loadingStaff}
                  style={{ background: '#78350f' }}
                  title="Refresh staff list from Firestore"
                >
                  <RefreshCw size={16} className={loadingStaff ? 'animate-spin' : ''} /> {loadingStaff ? 'Loading...' : 'Refresh'}
                </button>
                <button 
                  type="button"
                  className="add-quick-product-btn"
                  onClick={() => {
                    setCreatedStaffCreds(null);
                    setStaffError('');
                    setIsAddStaffModalOpen(true);
                  }}
                >
                  <Plus size={16} /> Register New Staff
                </button>
              </div>
            </div>

            {/* Filters Bar */}
            <div className="subpage-filters-bar">
              <div className="filter-search-box">
                <Search size={16} />
                <input
                  type="text"
                  placeholder="Search staff by name, email, or role..."
                  value={staffSearch}
                  onChange={(e) => setStaffSearch(e.target.value)}
                />
              </div>

              <div className="filter-dropdown-wrap">
                <select 
                  value={staffRoleFilter}
                  onChange={(e) => setStaffRoleFilter(e.target.value)}
                  className="cat-filter-select"
                >
                  <option value="all">All Roles</option>
                  <option value="super_admin">Super Admins</option>
                  <option value="shop_admin">Shop Admins</option>
                  <option value="employee">Showroom Staff / Sales</option>
                  <option value="dispatch">Dispatch &amp; Delivery</option>
                  <option value="support">Customer Support</option>
                </select>
              </div>
            </div>

            {/* Staff Users Table */}
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Staff Member</th>
                    <th>Email Address</th>
                    <th>Contact Phone</th>
                    <th>Role &amp; Privileges</th>
                    <th>Account Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loadingStaff ? (
                    <tr>
                      <td colSpan="6" style={{ textAlign: 'center', padding: '32px' }}>
                        <RefreshCw size={24} className="animate-spin" style={{ margin: '0 auto 8px', color: '#b45309' }} />
                        <p style={{ color: '#78716c' }}>Loading team members from Firestore...</p>
                      </td>
                    </tr>
                  ) : staffList.length === 0 ? (
                    <tr>
                      <td colSpan="6" style={{ textAlign: 'center', padding: '36px' }}>
                        <Users size={32} style={{ color: '#a8a29e', margin: '0 auto 10px' }} />
                        <h4 style={{ margin: '0 0 6px 0', color: '#2b170e' }}>No staff registered yet</h4>
                        <p style={{ color: '#78716c', fontSize: '0.85rem', margin: '0 0 16px 0' }}>
                          Click "Register New Staff" above to create your first Shop Admin or Employee account.
                        </p>
                        <button
                          type="button"
                          className="add-quick-product-btn"
                          onClick={() => {
                            setCreatedStaffCreds(null);
                            setStaffError('');
                            setIsAddStaffModalOpen(true);
                          }}
                          style={{ margin: '0 auto' }}
                        >
                          <Plus size={16} /> Register First Staff User
                        </button>
                      </td>
                    </tr>
                  ) : (
                    staffList
                      .filter((s) => {
                        const matchesRole = staffRoleFilter === 'all' || s.role === staffRoleFilter;
                        const query = staffSearch.trim().toLowerCase();
                        const matchesSearch = !query || 
                          (s.name || '').toLowerCase().includes(query) ||
                          (s.email || '').toLowerCase().includes(query) ||
                          (s.role || '').toLowerCase().includes(query);
                        return matchesRole && matchesSearch;
                      })
                      .map((staff) => (
                        <tr key={staff.id || staff.uid}>
                          <td>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                              <div style={{
                                width: '36px',
                                height: '36px',
                                borderRadius: '50%',
                                background: staff.role === 'super_admin' ? '#fde68a' : '#fed7aa',
                                color: '#2b170e',
                                fontWeight: 800,
                                fontSize: '0.9rem',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                              }}>
                                {(staff.name || staff.email || 'S').charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <strong>{staff.name || 'Staff Member'}</strong>
                                {staff.role === 'super_admin' && (
                                  <span style={{ fontSize: '0.68rem', color: '#b45309', display: 'block', fontWeight: 700 }}>Primary Admin</span>
                                )}
                              </div>
                            </div>
                          </td>
                          <td>{staff.email}</td>
                          <td>{staff.phone || '—'}</td>
                          <td>
                            <span className="role-tag" style={{
                              background: staff.role === 'super_admin' ? '#fef3c7' : staff.role === 'shop_admin' ? '#e0e7ff' : '#ecfdf5',
                              color: staff.role === 'super_admin' ? '#b45309' : staff.role === 'shop_admin' ? '#3730a3' : '#047857',
                              fontWeight: 700,
                              textTransform: 'capitalize'
                            }}>
                              {staff.role ? staff.role.replace('_', ' ') : 'Employee'}
                            </span>
                          </td>
                          <td>
                            <span 
                              className={staff.status === 'Suspended' ? 'low-stock-badge' : 'in-stock-badge'}
                              style={{
                                background: staff.status === 'Suspended' ? '#fee2e2' : '#dcfce7',
                                color: staff.status === 'Suspended' ? '#991b1b' : '#15803d'
                              }}
                            >
                              {staff.status || 'Active'}
                            </span>
                          </td>
                          <td>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              {staff.role !== 'super_admin' && (
                                <>
                                  <button
                                    type="button"
                                    onClick={() => handleToggleStaffStatus(staff)}
                                    className="table-action-icon-btn"
                                    title={staff.status === 'Active' ? 'Suspend Account' : 'Activate Account'}
                                    style={{
                                      padding: '4px 8px',
                                      fontSize: '0.75rem',
                                      borderRadius: '4px',
                                      background: staff.status === 'Active' ? '#fef2f2' : '#f0fdf4',
                                      color: staff.status === 'Active' ? '#dc2626' : '#16a34a',
                                      border: '1px solid #ebd9cc',
                                      cursor: 'pointer',
                                      fontWeight: 600
                                    }}
                                  >
                                    {staff.status === 'Active' ? 'Suspend' : 'Activate'}
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteStaff(staff.id || staff.uid, staff.name)}
                                    className="table-action-icon-btn delete"
                                    title="Delete staff record"
                                  >
                                    <Trash2 size={15} />
                                  </button>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Quick Helper Note for Super Admin */}
            <div style={{
              marginTop: '20px',
              padding: '14px 18px',
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
              fontSize: '0.82rem',
              color: '#475569',
              lineHeight: 1.6
            }}>
              <strong style={{ color: '#1e293b' }}>💡 How Staff Logins Work:</strong>
              <div>1. As Super Admin, registering a user creates their real Firebase Authentication account and Firestore role document.</div>
              <div>2. You can set their initial password or use the "Generate Strong Password" feature.</div>
              <div>3. Once registered, share the email &amp; password with your employee or shop admin. They can sign in directly from the <strong>Staff Portal</strong> footer link.</div>
            </div>
          </div>
        )}

        {/* MODAL: REGISTER NEW STAFF / SHOP ADMIN */}
        {isAddStaffModalOpen && (
          <div className="admin-modal-overlay" onClick={() => setIsAddStaffModalOpen(false)}>
            <div className="admin-dialog-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '520px' }}>
              <div className="dialog-header">
                <div>
                  <h4>Register New Staff Account</h4>
                  <p style={{ margin: 0, fontSize: '0.8rem', color: '#78716c' }}>
                    Creates Firebase Authentication login &amp; Firestore role permissions.
                  </p>
                </div>
                <button className="dialog-close-btn" onClick={() => setIsAddStaffModalOpen(false)}>
                  <X size={18} />
                </button>
              </div>

              {createdStaffCreds ? (
                <div style={{ padding: '24px', textAlign: 'center' }}>
                  <div style={{
                    width: '52px',
                    height: '52px',
                    borderRadius: '50%',
                    background: '#dcfce7',
                    color: '#16a34a',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 16px'
                  }}>
                    <CheckCircle size={30} />
                  </div>

                  <h3 style={{ fontSize: '1.25rem', color: '#14532d', margin: '0 0 6px 0', fontWeight: 800 }}>
                    Account Created Successfully!
                  </h3>
                  <p style={{ color: '#4b5563', fontSize: '0.88rem', margin: '0 0 20px 0' }}>
                    Share these credentials with your team member. They can log in to the Staff Portal immediately.
                  </p>

                  <div style={{
                    background: '#f8fafc',
                    border: '1.5px solid #cbd5e1',
                    borderRadius: '12px',
                    padding: '16px',
                    textAlign: 'left',
                    marginBottom: '20px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px'
                  }}>
                    <div>
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', display: 'block', textTransform: 'uppercase' }}>Full Name</span>
                      <strong style={{ color: '#1e293b' }}>{createdStaffCreds.name}</strong>
                    </div>

                    <div>
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', display: 'block', textTransform: 'uppercase' }}>Assigned Role</span>
                      <span className="role-tag" style={{ textTransform: 'capitalize', display: 'inline-block', marginTop: '2px' }}>
                        {createdStaffCreds.role.replace('_', ' ')}
                      </span>
                    </div>

                    <div>
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', display: 'block', textTransform: 'uppercase' }}>Login Email</span>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#ffffff', padding: '6px 10px', borderRadius: '6px', border: '1px solid #e2e8f0', marginTop: '4px' }}>
                        <code style={{ fontSize: '0.9rem', color: '#0f172a' }}>{createdStaffCreds.email}</code>
                        <button
                          type="button"
                          onClick={() => handleCopyText(createdStaffCreds.email, 'email')}
                          style={{ background: 'none', border: 'none', color: '#2563eb', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 700 }}
                        >
                          {copiedKey === 'email' ? '✓ Copied' : 'Copy'}
                        </button>
                      </div>
                    </div>

                    <div>
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', display: 'block', textTransform: 'uppercase' }}>Password</span>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#ffffff', padding: '6px 10px', borderRadius: '6px', border: '1px solid #e2e8f0', marginTop: '4px' }}>
                        <code style={{ fontSize: '0.95rem', fontWeight: 800, color: '#b45309' }}>{createdStaffCreds.password}</code>
                        <button
                          type="button"
                          onClick={() => handleCopyText(createdStaffCreds.password, 'password')}
                          style={{ background: 'none', border: 'none', color: '#2563eb', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 700 }}
                        >
                          {copiedKey === 'password' ? '✓ Copied' : 'Copy'}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                      type="button"
                      className="add-quick-product-btn"
                      onClick={() => setCreatedStaffCreds(null)}
                      style={{ flex: 1 }}
                    >
                      <Plus size={16} /> Register Another Staff
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsAddStaffModalOpen(false)}
                      style={{
                        flex: 1,
                        padding: '10px',
                        background: '#f1f5f9',
                        color: '#334155',
                        border: '1px solid #cbd5e1',
                        borderRadius: '8px',
                        fontWeight: 700,
                        cursor: 'pointer'
                      }}
                    >
                      Done
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleCreateStaffSubmit} className="dialog-form-body">
                  {staffError && (
                    <div className="login-error-alert" style={{ marginBottom: '14px' }}>
                      <AlertCircle size={16} />
                      <span>{staffError}</span>
                    </div>
                  )}

                  <div className="form-field-group">
                    <label>Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ramesh Kumar"
                      value={newStaffForm.name}
                      onChange={(e) => setNewStaffForm({ ...newStaffForm, name: e.target.value })}
                    />
                  </div>

                  <div className="form-field-group">
                    <label>Email Address (Login Username) *</label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. ramesh@sardarmart.com"
                      value={newStaffForm.email}
                      onChange={(e) => setNewStaffForm({ ...newStaffForm, email: e.target.value })}
                    />
                  </div>

                  <div className="form-field-group">
                    <label>Contact Phone (Optional)</label>
                    <input
                      type="text"
                      placeholder="e.g. +91 98401 23456"
                      value={newStaffForm.phone}
                      onChange={(e) => setNewStaffForm({ ...newStaffForm, phone: e.target.value })}
                    />
                  </div>

                  <div className="form-field-group">
                    <label>Assigned Staff Role *</label>
                    <select
                      value={newStaffForm.role}
                      onChange={(e) => setNewStaffForm({ ...newStaffForm, role: e.target.value })}
                    >
                      <option value="shop_admin">Shop Admin (Catalog &amp; Order Manager)</option>
                      <option value="employee">Showroom Sales Employee / Staff</option>
                      <option value="dispatch">Logistics &amp; Delivery Dispatch</option>
                      <option value="support">Customer Support Specialist</option>
                      <option value="super_admin">Super Administrator (Full System Control)</option>
                    </select>
                  </div>

                  <div className="form-field-group">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <label>Set Password (Min. 6 characters) *</label>
                      <button
                        type="button"
                        onClick={handleGeneratePassword}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#b45309',
                          fontSize: '0.78rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                      >
                        <Sparkles size={12} /> Auto-Generate
                      </button>
                    </div>
                    <input
                      type="text"
                      required
                      placeholder="Enter or generate password"
                      value={newStaffForm.password}
                      onChange={(e) => setNewStaffForm({ ...newStaffForm, password: e.target.value })}
                    />
                  </div>

                  <div className="dialog-footer-actions">
                    <button
                      type="button"
                      className="dialog-cancel-btn"
                      onClick={() => setIsAddStaffModalOpen(false)}
                      disabled={creatingStaff}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="dialog-submit-btn"
                      disabled={creatingStaff}
                    >
                      {creatingStaff ? (
                        <>
                          <Loader2 size={16} className="animate-spin" />
                          <span>Creating in Firebase...</span>
                        </>
                      ) : (
                        <>
                          <Check size={16} /> Register Staff User
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}
      </div>

      {/* MODAL: ADD NEW PRODUCT */}
      {isAddProductModalOpen && (
        <div className="admin-modal-overlay" onClick={() => setIsAddProductModalOpen(false)}>
          <div className="admin-dialog-card" onClick={(e) => e.stopPropagation()}>
            <div className="dialog-header">
              <h4>Add New Product to Catalog</h4>
              <button className="dialog-close-btn" onClick={() => setIsAddProductModalOpen(false)}>
                <X size={18} />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!newProduct.name || !newProduct.price) {
                  alert('Please enter product name and price');
                  return;
                }
                const created = {
                  id: 'hk-' + Date.now().toString(36),
                  name: newProduct.name,
                  category: newProduct.category,
                  subcategory: newProduct.subcategory,
                  price: parseFloat(newProduct.price),
                  originalPrice: parseFloat(newProduct.originalPrice || newProduct.price * 1.3),
                  discount: parseInt(newProduct.discount) || 20,
                  badge: newProduct.badge,
                  image: newProduct.image,
                  description: newProduct.description || 'Premium furniture piece handcrafted with durable finishes.',
                  featured: newProduct.featured,
                  rating: 4.8,
                  reviews: 12
                };
                onAddProduct && onAddProduct(created);
                setIsAddProductModalOpen(false);
                showToast(`Product "${created.name}" published!`);
              }}
              className="dialog-form-body"
            >
              <div className="dialog-grid">
                <div className="form-field-group full-width">
                  <label>Product Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Royal Chesterfield 3-Seater Velvet Sofa"
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  />
                </div>

                <div className="form-field-group">
                  <label>Department Category</label>
                  <select
                    value={newProduct.category}
                    onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                  >
                    <option value="furniture">Furniture</option>
                    <option value="electronics">Electronics</option>
                    <option value="appliances">Home Appliances</option>
                  </select>
                </div>

                <div className="form-field-group">
                  <label>Promotional Badge</label>
                  <input
                    type="text"
                    placeholder="e.g. BEST SELLER or HOT DEAL"
                    value={newProduct.badge}
                    onChange={(e) => setNewProduct({ ...newProduct, badge: e.target.value })}
                  />
                </div>

                <div className="form-field-group">
                  <label>Selling Price (₹) *</label>
                  <input
                    type="number"
                    required
                    placeholder="e.g. 29999"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                  />
                </div>

                <div className="form-field-group">
                  <label>Original MRP (₹)</label>
                  <input
                    type="number"
                    placeholder="e.g. 42000"
                    value={newProduct.originalPrice}
                    onChange={(e) => setNewProduct({ ...newProduct, originalPrice: e.target.value })}
                  />
                </div>

                <div className="form-field-group full-width">
                  <ProductImagePicker
                    value={newProduct.image}
                    onChange={(imgUrl) => setNewProduct(prev => ({ ...prev, image: imgUrl }))}
                    label="Product Showcase Image"
                    required={false}
                  />
                </div>
              </div>

              <div className="dialog-footer-actions">
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={() => setIsAddProductModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-confirm">
                  Publish to Catalog
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: EDIT PRODUCT */}
      {editingProduct && (
        <div className="admin-modal-overlay" onClick={() => setEditingProduct(null)}>
          <div className="admin-dialog-card" onClick={(e) => e.stopPropagation()}>
            <div className="dialog-header">
              <h4>Edit Product Details</h4>
              <button className="dialog-close-btn" onClick={() => setEditingProduct(null)}>
                <X size={18} />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                onEditProduct && onEditProduct(editingProduct.id, editingProduct);
                setEditingProduct(null);
                showToast(`Updated "${editingProduct.name}"`);
              }}
              className="dialog-form-body"
            >
              <div className="dialog-grid">
                <div className="form-field-group full-width">
                  <label>Product Title</label>
                  <input
                    type="text"
                    value={editingProduct.name}
                    onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                    required
                  />
                </div>

                <div className="form-field-group">
                  <label>Selling Price (₹)</label>
                  <input
                    type="number"
                    value={editingProduct.price}
                    onChange={(e) => setEditingProduct({ ...editingProduct, price: parseFloat(e.target.value) || 0 })}
                    required
                  />
                </div>

                <div className="form-field-group">
                  <label>Original MRP (₹)</label>
                  <input
                    type="number"
                    value={editingProduct.originalPrice || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, originalPrice: parseFloat(e.target.value) || 0 })}
                  />
                </div>

                <div className="form-field-group">
                  <label>Discount (%)</label>
                  <input
                    type="number"
                    value={editingProduct.discount || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, discount: parseInt(e.target.value) || 0 })}
                  />
                </div>

                <div className="form-field-group">
                  <label>Badge</label>
                  <input
                    type="text"
                    value={editingProduct.badge || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, badge: e.target.value })}
                  />
                </div>

                <div className="form-field-group full-width">
                  <ProductImagePicker
                    value={editingProduct.image || ''}
                    onChange={(imgUrl) => setEditingProduct(prev => ({ ...prev, image: imgUrl }))}
                    label="Update Product Image"
                  />
                </div>
              </div>

              <div className="dialog-footer-actions">
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={() => setEditingProduct(null)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-confirm">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: EDIT ORDER CUSTOMER DETAILS */}
      {editingOrder && (
        <div className="admin-modal-overlay" onClick={() => setEditingOrder(null)}>
          <div className="admin-dialog-card" onClick={(e) => e.stopPropagation()}>
            <div className="dialog-header">
              <h4>Edit Order #{editingOrder.id} Details</h4>
              <button className="dialog-close-btn" onClick={() => setEditingOrder(null)}>
                <X size={18} />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                onEditOrder && onEditOrder(editingOrder.id, editingOrder);
                setEditingOrder(null);
                showToast(`Order #${editingOrder.id} updated`);
              }}
              className="dialog-form-body"
            >
              <div className="dialog-grid">
                <div className="form-field-group">
                  <label>Customer Name</label>
                  <input
                    type="text"
                    value={editingOrder.customer?.name || ''}
                    onChange={(e) => setEditingOrder({
                      ...editingOrder,
                      customer: { ...editingOrder.customer, name: e.target.value }
                    })}
                    required
                  />
                </div>

                <div className="form-field-group">
                  <label>Phone Number</label>
                  <input
                    type="text"
                    value={editingOrder.customer?.phone || ''}
                    onChange={(e) => setEditingOrder({
                      ...editingOrder,
                      customer: { ...editingOrder.customer, phone: e.target.value }
                    })}
                    required
                  />
                </div>

                <div className="form-field-group full-width">
                  <label>Delivery Address</label>
                  <input
                    type="text"
                    value={editingOrder.customer?.address || ''}
                    onChange={(e) => setEditingOrder({
                      ...editingOrder,
                      customer: { ...editingOrder.customer, address: e.target.value }
                    })}
                    required
                  />
                </div>

                <div className="form-field-group">
                  <label>City</label>
                  <input
                    type="text"
                    value={editingOrder.customer?.city || ''}
                    onChange={(e) => setEditingOrder({
                      ...editingOrder,
                      customer: { ...editingOrder.customer, city: e.target.value }
                    })}
                  />
                </div>

                <div className="form-field-group">
                  <label>Pincode</label>
                  <input
                    type="text"
                    value={editingOrder.customer?.pincode || ''}
                    onChange={(e) => setEditingOrder({
                      ...editingOrder,
                      customer: { ...editingOrder.customer, pincode: e.target.value }
                    })}
                  />
                </div>

                {/* COD & Payment Status Updation Section */}
                <div className="form-field-group full-width order-payment-edit-card">
                  <div className="payment-edit-header">
                    <div>
                      <strong style={{ display: 'block', fontSize: '0.88rem', color: '#0f172a' }}>
                        Payment Settlement &amp; COD Status
                      </strong>
                      <span style={{ fontSize: '0.74rem', color: '#64748b' }}>
                        Update payment collection status once customer pays via COD, Cash, UPI, or Card.
                      </span>
                    </div>
                    <button
                      type="button"
                      className="btn-mark-paid-quick"
                      onClick={() => setEditingOrder({
                        ...editingOrder,
                        paymentStatus: 'Paid',
                        paymentReceivedAt: new Date().toISOString()
                      })}
                      title="Mark as Paid immediately"
                    >
                      <Check size={13} /> Mark Paid Now
                    </button>
                  </div>

                  <div className="dialog-grid" style={{ marginTop: '10px' }}>
                    <div className="form-field-group">
                      <label>Payment Status</label>
                      <select
                        value={editingOrder.paymentStatus || 'Pending'}
                        onChange={(e) => setEditingOrder({
                          ...editingOrder,
                          paymentStatus: e.target.value
                        })}
                        style={{
                          fontWeight: 700,
                          color: (editingOrder.paymentStatus?.toLowerCase().includes('paid')) ? '#15803d' : '#b45309',
                          background: (editingOrder.paymentStatus?.toLowerCase().includes('paid')) ? '#dcfce7' : '#fffbeb'
                        }}
                      >
                        <option value="Paid">✓ Paid (Settled / Collected)</option>
                        <option value="Pending">⏱ Pending (COD / Unpaid)</option>
                        <option value="Partially Paid">⏳ Partially Paid</option>
                        <option value="Failed">✕ Failed</option>
                        <option value="Refunded">↩ Refunded</option>
                      </select>
                    </div>

                    <div className="form-field-group">
                      <label>Payment Method Mode</label>
                      <select
                        value={editingOrder.paymentMethod || 'Cash on Delivery (COD)'}
                        onChange={(e) => setEditingOrder({
                          ...editingOrder,
                          paymentMethod: e.target.value
                        })}
                      >
                        <option value="Cash on Delivery (COD)">Cash on Delivery (COD)</option>
                        <option value="Cash at Counter">Cash at Counter</option>
                        <option value="UPI / QR Code">UPI / QR Code (GPay / PhonePe / Paytm)</option>
                        <option value="Card (POS / Online)">Credit / Debit Card</option>
                        <option value="Net Banking">Net Banking</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              <div className="dialog-footer-actions">
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={() => setEditingOrder(null)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-confirm">
                  Save Order Details
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: CREATE PROMO CODE */}
      {isAddPromoModalOpen && (
        <div className="admin-modal-overlay" onClick={() => setIsAddPromoModalOpen(false)}>
          <div 
            className="admin-dialog-card" 
            style={{ 
              maxWidth: '680px', 
              width: '100%', 
              borderRadius: '16px', 
              overflow: 'hidden', 
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.35)',
              background: '#ffffff',
              margin: '20px'
            }} 
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div 
              className="dialog-header" 
              style={{ 
                padding: '18px 28px', 
                background: 'linear-gradient(135deg, #2b170e 0%, #451a03 100%)', 
                color: '#ffffff', 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center' 
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ background: 'rgba(251, 191, 36, 0.2)', padding: '6px', borderRadius: '8px', display: 'flex', alignItems: 'center' }}>
                  <Tag size={20} color="#fbbf24" />
                </div>
                <div>
                  <h4 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 700, color: '#ffffff', letterSpacing: '0.2px' }}>
                    Create New Promo Code
                  </h4>
                  <small style={{ color: '#d6d3d1', fontSize: '0.78rem' }}>
                    <strong>Sardar Mart</strong> Furniture and Home Appliances Discount Manager
                  </small>
                </div>
              </div>
              <button 
                type="button" 
                className="dialog-close-btn" 
                onClick={() => setIsAddPromoModalOpen(false)}
                style={{
                  background: 'rgba(255, 255, 255, 0.2)',
                  border: 'none',
                  color: '#ffffff',
                  width: '34px',
                  height: '34px',
                  borderRadius: '50%',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'background 0.2s'
                }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Form Body with Generous Padding */}
            <form 
              onSubmit={handleCreatePromoCode}
              style={{ 
                padding: '24px 28px 28px', 
                maxHeight: 'calc(90vh - 100px)', 
                overflowY: 'auto' 
              }}
            >
              <div style={{ 
                padding: '12px 16px', 
                background: '#f8fafc', 
                border: '1px solid #e2e8f0', 
                borderRadius: '10px', 
                color: '#475569', 
                fontSize: '0.88rem',
                lineHeight: 1.5,
                marginBottom: '22px'
              }}>
                Define promotional discounts for customer orders. Promo codes are saved to Cloud Firestore and instantly displayed on the storefront offers page.
              </div>

              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(2, 1fr)', 
                gap: '20px 22px', 
                marginBottom: '20px' 
              }}>
                <div className="form-field-group">
                  <label style={{ display: 'block', fontSize: '0.86rem', fontWeight: 600, color: '#334155', marginBottom: '8px' }}>
                    Promo Code Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. FESTIVE25"
                    value={newPromoForm.code}
                    onChange={(e) => setNewPromoForm({ ...newPromoForm, code: e.target.value.toUpperCase() })}
                    style={{ 
                      width: '100%', 
                      padding: '11px 14px', 
                      borderRadius: '8px', 
                      border: '1.5px solid #cbd5e1', 
                      fontSize: '0.95rem',
                      fontWeight: 700, 
                      letterSpacing: '0.8px',
                      textTransform: 'uppercase',
                      outline: 'none',
                      background: '#ffffff'
                    }}
                  />
                  <small style={{ display: 'block', color: '#64748b', fontSize: '0.76rem', marginTop: '6px' }}>
                    Auto-converts to UPPERCASE
                  </small>
                </div>

                <div className="form-field-group">
                  <label style={{ display: 'block', fontSize: '0.86rem', fontWeight: 600, color: '#334155', marginBottom: '8px' }}>
                    Offer Percentage (%) *
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    max="100"
                    placeholder="e.g. 25"
                    value={newPromoForm.discountPercentage}
                    onChange={(e) => setNewPromoForm({ ...newPromoForm, discountPercentage: e.target.value })}
                    style={{ 
                      width: '100%', 
                      padding: '11px 14px', 
                      borderRadius: '8px', 
                      border: '1.5px solid #cbd5e1', 
                      fontSize: '0.95rem',
                      outline: 'none',
                      background: '#ffffff'
                    }}
                  />
                  <small style={{ display: 'block', color: '#64748b', fontSize: '0.76rem', marginTop: '6px' }}>
                    Discount percentage applied to cart
                  </small>
                </div>

                <div className="form-field-group">
                  <label style={{ display: 'block', fontSize: '0.86rem', fontWeight: 600, color: '#334155', marginBottom: '8px' }}>
                    Code Amount Limit (Max Cap in ₹) *
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    placeholder="e.g. 40000"
                    value={newPromoForm.maxDiscountAmount}
                    onChange={(e) => setNewPromoForm({ ...newPromoForm, maxDiscountAmount: e.target.value })}
                    style={{ 
                      width: '100%', 
                      padding: '11px 14px', 
                      borderRadius: '8px', 
                      border: '1.5px solid #cbd5e1', 
                      fontSize: '0.95rem',
                      outline: 'none',
                      background: '#ffffff'
                    }}
                  />
                  <small style={{ display: 'block', color: '#64748b', fontSize: '0.76rem', marginTop: '6px' }}>
                    Maximum discount cap (e.g. Upto ₹40,000)
                  </small>
                </div>

                <div className="form-field-group">
                  <label style={{ display: 'block', fontSize: '0.86rem', fontWeight: 600, color: '#334155', marginBottom: '8px' }}>
                    Minimum Order Value (₹) (Optional)
                  </label>
                  <input
                    type="number"
                    min="0"
                    placeholder="e.g. 1000 or 0 for none"
                    value={newPromoForm.minOrderAmount}
                    onChange={(e) => setNewPromoForm({ ...newPromoForm, minOrderAmount: e.target.value })}
                    style={{ 
                      width: '100%', 
                      padding: '11px 14px', 
                      borderRadius: '8px', 
                      border: '1.5px solid #cbd5e1', 
                      fontSize: '0.95rem',
                      outline: 'none',
                      background: '#ffffff'
                    }}
                  />
                  <small style={{ display: 'block', color: '#64748b', fontSize: '0.76rem', marginTop: '6px' }}>
                    Cart value required to use this code
                  </small>
                </div>

                <div className="form-field-group full-width" style={{ gridColumn: 'span 2' }}>
                  <label style={{ display: 'block', fontSize: '0.86rem', fontWeight: 600, color: '#334155', marginBottom: '8px' }}>
                    Validity / Expiry Note
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Valid until Diwali midnight, or Valid till 31 Dec 2026"
                    value={newPromoForm.validTill}
                    onChange={(e) => setNewPromoForm({ ...newPromoForm, validTill: e.target.value })}
                    style={{ 
                      width: '100%', 
                      padding: '11px 14px', 
                      borderRadius: '8px', 
                      border: '1.5px solid #cbd5e1', 
                      fontSize: '0.95rem',
                      outline: 'none',
                      background: '#ffffff'
                    }}
                  />
                </div>

                <div className="form-field-group full-width" style={{ gridColumn: 'span 2' }}>
                  <label style={{ display: 'block', fontSize: '0.86rem', fontWeight: 600, color: '#334155', marginBottom: '8px' }}>
                    Terms / Campaign Description (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Flat 25% discount on all living room and electronics combos"
                    value={newPromoForm.description}
                    onChange={(e) => setNewPromoForm({ ...newPromoForm, description: e.target.value })}
                    style={{ 
                      width: '100%', 
                      padding: '11px 14px', 
                      borderRadius: '8px', 
                      border: '1.5px solid #cbd5e1', 
                      fontSize: '0.95rem',
                      outline: 'none',
                      background: '#ffffff'
                    }}
                  />
                </div>
              </div>

              {/* Live Preview Box with Enhanced Styling and Spacing */}
              <div style={{ 
                margin: '24px 0 20px', 
                padding: '18px 22px', 
                background: 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)', 
                borderRadius: '14px', 
                border: '1.5px dashed #f59e0b',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
                  <Sparkles size={14} color="#b45309" />
                  <span style={{ fontSize: '0.74rem', fontWeight: 800, color: '#b45309', textTransform: 'uppercase', letterSpacing: '0.7px' }}>
                    Storefront Live Preview
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ 
                        display: 'inline-block',
                        background: '#ffffff', 
                        color: '#78350f', 
                        padding: '4px 10px', 
                        borderRadius: '6px', 
                        fontSize: '1.05rem', 
                        fontWeight: 800,
                        letterSpacing: '0.6px',
                        border: '1px solid #fde68a'
                      }}>
                        🏷️ {newPromoForm.code || 'YOURCODE'}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.92rem', color: '#166534', fontWeight: 700, marginTop: '8px' }}>
                      {newPromoForm.discountPercentage || '0'}% Instant Discount • Limit: Upto ₹{Number(newPromoForm.maxDiscountAmount || 0).toLocaleString('en-IN')}
                    </div>
                    {newPromoForm.minOrderAmount > 0 && (
                      <span style={{ display: 'block', fontSize: '0.8rem', color: '#64748b', marginTop: '3px' }}>
                        Min. Cart Value: ₹{Number(newPromoForm.minOrderAmount).toLocaleString('en-IN')}
                      </span>
                    )}
                    <small style={{ display: 'block', color: '#92400e', fontSize: '0.76rem', marginTop: '4px' }}>
                      📅 {newPromoForm.validTill || 'Valid until stocks last'}
                    </small>
                  </div>
                  <div style={{ 
                    background: '#b45309', 
                    color: '#ffffff', 
                    padding: '8px 16px', 
                    borderRadius: '8px', 
                    fontSize: '0.9rem', 
                    fontWeight: 800,
                    boxShadow: '0 2px 4px rgba(180, 83, 9, 0.3)'
                  }}>
                    {newPromoForm.discountPercentage || '0'}% OFF
                  </div>
                </div>
              </div>

              {/* Dialog Footer Actions with Generous Spacing */}
              <div 
                className="dialog-footer-actions" 
                style={{ 
                  marginTop: '24px', 
                  paddingTop: '18px', 
                  borderTop: '1px solid #e2e8f0', 
                  display: 'flex', 
                  justifyContent: 'flex-end', 
                  gap: '12px' 
                }}
              >
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={() => setIsAddPromoModalOpen(false)}
                  disabled={isSubmittingPromo}
                  style={{
                    padding: '10px 20px',
                    borderRadius: '8px',
                    fontWeight: 600,
                    fontSize: '0.9rem'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-confirm"
                  disabled={isSubmittingPromo}
                  style={{ 
                    background: '#b45309', 
                    color: '#ffffff', 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '8px',
                    padding: '10px 24px',
                    borderRadius: '8px',
                    fontWeight: 700,
                    fontSize: '0.9rem',
                    boxShadow: '0 4px 6px -1px rgba(180, 83, 9, 0.3)',
                    cursor: 'pointer'
                  }}
                >
                  {isSubmittingPromo ? (
                    <>
                      <Loader2 size={16} className="animate-spin" /> Publishing to Firestore...
                    </>
                  ) : (
                    <>
                      <Check size={16} /> Save &amp; Publish Promo Code
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD / EDIT CATEGORY (SYNCED WITH CLOUD FIRESTORE) */}
      {isCategoryModalOpen && (
        <div 
          className="admin-modal-overlay" 
          onClick={() => setIsCategoryModalOpen(false)}
          style={{ overflowY: 'auto', padding: '20px 12px' }}
        >
          <div 
            className="admin-dialog-card category-modal-dialog" 
            style={{ 
              maxWidth: '680px', 
              width: '100%', 
              maxHeight: '90vh',
              display: 'flex',
              flexDirection: 'column',
              borderRadius: '16px', 
              overflow: 'hidden', 
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.45)',
              background: '#ffffff',
              margin: 'auto',
              position: 'relative'
            }} 
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header (Fixed at top) */}
            <div 
              className="dialog-header" 
              style={{ 
                flexShrink: 0,
                padding: '18px 24px', 
                background: 'linear-gradient(135deg, #2b170e 0%, #451a03 100%)', 
                color: '#ffffff', 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                zIndex: 10
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ background: 'rgba(251, 191, 36, 0.2)', padding: '6px', borderRadius: '8px', display: 'flex', alignItems: 'center' }}>
                  <Layers size={20} color="#fbbf24" />
                </div>
                <div>
                  <h4 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 700, color: '#ffffff' }}>
                    {editingCategory ? `Edit Category: ${editingCategory.name}` : 'Add New Category'}
                  </h4>
                  <small style={{ color: '#d6d3d1', fontSize: '0.78rem' }}>
                    Syncs immediately to Cloud Firestore and storefront "Shop by Category"
                  </small>
                </div>
              </div>
              <button 
                type="button"
                className="dialog-close-btn" 
                onClick={() => setIsCategoryModalOpen(false)}
                style={{ 
                  background: 'rgba(255, 255, 255, 0.15)', 
                  border: 'none', 
                  color: '#ffffff', 
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer' 
                }}
                title="Close"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Form with Scrollable Middle Body & Sticky Bottom Footer */}
            <form 
              onSubmit={handleSaveCategory} 
              style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                flex: 1, 
                minHeight: 0, 
                overflow: 'hidden',
                margin: 0
              }}
            >
              {/* Scrollable Form Body Container (Top to Bottom Scroller) */}
              <div 
                className="category-modal-scrollable-body" 
                style={{ 
                  flex: 1, 
                  overflowY: 'auto', 
                  padding: '24px 28px',
                  scrollbarWidth: 'thin',
                  scrollbarColor: '#b45309 #f1f5f9'
                }}
              >
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  
                  {/* Category Name */}
                  <div className="form-field-group" style={{ gridColumn: 'span 2' }}>
                    <label style={{ display: 'block', fontSize: '0.86rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                      Category Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Dining Sets, Recliners, Air Conditioners"
                      value={categoryForm.name}
                      onChange={(e) => {
                        const val = e.target.value;
                        setCategoryForm(prev => ({
                          ...prev,
                          name: val,
                          id: editingCategory ? prev.id : val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
                        }));
                      }}
                      style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1.5px solid #cbd5e1', fontSize: '0.95rem' }}
                    />
                  </div>

                  {/* Parent Department */}
                  <div className="form-field-group">
                    <label style={{ display: 'block', fontSize: '0.86rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                      Parent Department *
                    </label>
                    <select
                      value={categoryForm.category}
                      onChange={(e) => setCategoryForm({ ...categoryForm, category: e.target.value })}
                      style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1.5px solid #cbd5e1', fontSize: '0.95rem' }}
                    >
                      <option value="furniture">🛋️ Furniture</option>
                      <option value="electronics">📺 Electronics</option>
                      <option value="appliances">🍳 Home Appliances</option>
                    </select>
                  </div>

                  {/* Subcategory Slug / ID */}
                  <div className="form-field-group">
                    <label style={{ display: 'block', fontSize: '0.86rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                      Subcategory Slug (ID) *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. dining, sofas, tvs"
                      value={categoryForm.id}
                      disabled={!!editingCategory}
                      onChange={(e) => setCategoryForm({ ...categoryForm, id: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                      style={{ 
                        width: '100%', 
                        padding: '10px 14px', 
                        borderRadius: '8px', 
                        border: '1.5px solid #cbd5e1', 
                        fontSize: '0.95rem',
                        background: editingCategory ? '#f1f5f9' : '#ffffff',
                        cursor: editingCategory ? 'not-allowed' : 'text'
                      }}
                    />
                    <small style={{ color: '#64748b', fontSize: '0.72rem', marginTop: '4px', display: 'block' }}>
                      Used in database mapping and URL filters
                    </small>
                  </div>

                  {/* Micro Badge */}
                  <div className="form-field-group" style={{ gridColumn: 'span 2' }}>
                    <label style={{ display: 'block', fontSize: '0.86rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                      Micro Badge Tag (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Popular, Hot, Trending, Solid Wood, 4K OLED, Up to 40% Off"
                      value={categoryForm.badge}
                      onChange={(e) => setCategoryForm({ ...categoryForm, badge: e.target.value })}
                      style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1.5px solid #cbd5e1', fontSize: '0.95rem' }}
                    />
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '6px' }}>
                      {['Popular', 'Hot', 'Trending', 'Solid Wood', '4K OLED', 'Inverter', 'Eco Wash', 'Up to 40% Off', 'New Arrival'].map((preset) => (
                        <button
                          key={preset}
                          type="button"
                          onClick={() => setCategoryForm({ ...categoryForm, badge: preset })}
                          style={{
                            background: categoryForm.badge === preset ? '#78350f' : '#f1f5f9',
                            color: categoryForm.badge === preset ? '#ffffff' : '#475569',
                            border: 'none',
                            padding: '3px 9px',
                            borderRadius: '12px',
                            fontSize: '0.74rem',
                            fontWeight: 600,
                            cursor: 'pointer'
                          }}
                        >
                          {preset}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Category Image URL */}
                  <div className="form-field-group" style={{ gridColumn: 'span 2' }}>
                    <label style={{ display: 'block', fontSize: '0.86rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                      Image URL *
                    </label>
                    <input
                      type="url"
                      required
                      placeholder="https://images.unsplash.com/..."
                      value={categoryForm.image}
                      onChange={(e) => setCategoryForm({ ...categoryForm, image: e.target.value })}
                      style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1.5px solid #cbd5e1', fontSize: '0.95rem' }}
                    />

                    {/* Preset Image Options */}
                    <div style={{ marginTop: '10px' }}>
                      <small style={{ fontWeight: 700, color: '#64748b', fontSize: '0.74rem', display: 'block', marginBottom: '6px' }}>
                        Quick Showroom Presets (click to apply):
                      </small>
                      <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '6px' }}>
                        {[
                          { label: 'Sofas', url: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=600&q=80' },
                          { label: 'Beds', url: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=600&q=80' },
                          { label: 'Dining Sets', url: 'https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&w=600&q=80' },
                          { label: 'Wardrobes', url: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=600&q=80' },
                          { label: 'TV & Audio', url: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&w=600&q=80' },
                          { label: 'Refrigerators', url: 'https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?auto=format&fit=crop&w=600&q=80' },
                          { label: 'Washing Machines', url: 'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?auto=format&fit=crop&w=600&q=80' },
                          { label: 'Kitchen Appliances', url: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=600&q=80' },
                          { label: 'Air Conditioners', url: 'https://images.unsplash.com/photo-1621905251918-48416bd8575a?auto=format&fit=crop&w=600&q=80' },
                          { label: 'Study Chairs', url: 'https://images.unsplash.com/photo-1580481077195-c329a356497f?auto=format&fit=crop&w=600&q=80' }
                        ].map((item) => (
                          <button
                            key={item.label}
                            type="button"
                            onClick={() => setCategoryForm(prev => ({ ...prev, image: item.url }))}
                            style={{
                              flexShrink: 0,
                              padding: '4px 10px',
                              borderRadius: '6px',
                              background: '#f8fafc',
                              border: categoryForm.image === item.url ? '1.5px solid #854d0e' : '1px solid #cbd5e1',
                              fontSize: '0.74rem',
                              fontWeight: 600,
                              color: categoryForm.image === item.url ? '#854d0e' : '#334155',
                              cursor: 'pointer'
                            }}
                          >
                            {item.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Circular preview box */}
                    {categoryForm.image && (
                      <div style={{ marginTop: '12px', display: 'flex', alignItems: 'center', gap: '14px', background: '#fafaf9', padding: '10px 14px', borderRadius: '10px', border: '1px solid #e7e5e4' }}>
                        <div style={{
                          position: 'relative',
                          width: '64px',
                          height: '64px',
                          borderRadius: '50%',
                          padding: '2px',
                          background: '#ffffff',
                          border: '2px solid #ecd8cb',
                          overflow: 'hidden'
                        }}>
                          <img 
                            src={categoryForm.image} 
                            alt="Category preview" 
                            style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
                            onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=600&q=80'; }}
                          />
                          {categoryForm.badge && (
                            <span style={{
                              position: 'absolute',
                              bottom: '2px',
                              left: '50%',
                              transform: 'translateX(-50%)',
                              background: '#78350f',
                              color: '#ffffff',
                              fontSize: '0.52rem',
                              fontWeight: 800,
                              padding: '1px 5px',
                              borderRadius: '8px'
                            }}>
                              {categoryForm.badge}
                            </span>
                          )}
                        </div>
                        <div>
                          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#78716c', textTransform: 'uppercase' }}>Storefront Circle Preview</span>
                          <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#1c1917' }}>{categoryForm.name || 'Category Name'}</div>
                          <span style={{ fontSize: '0.74rem', color: '#854d0e' }}>Models will be counted dynamically from database</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Display Sort Order */}
                  <div className="form-field-group">
                    <label style={{ display: 'block', fontSize: '0.86rem', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                      Display Order Priority
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={categoryForm.order}
                      onChange={(e) => setCategoryForm({ ...categoryForm, order: e.target.value })}
                      style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1.5px solid #cbd5e1', fontSize: '0.95rem' }}
                    />
                  </div>
                </div>
              </div>

              {/* Sticky Dialog Footer Actions (Always 100% visible on screen) */}
              <div 
                className="dialog-footer-actions category-modal-footer" 
                style={{ 
                  flexShrink: 0,
                  position: 'sticky',
                  bottom: 0,
                  background: '#ffffff',
                  borderTop: '2px solid #f1f5f9',
                  boxShadow: '0 -6px 20px rgba(0, 0, 0, 0.08)',
                  padding: '16px 24px',
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  zIndex: 20
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ 
                    fontSize: '0.78rem', 
                    fontWeight: 700, 
                    color: '#15803d', 
                    background: '#dcfce7', 
                    padding: '4px 10px', 
                    borderRadius: '12px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}>
                    <CheckCircle size={13} /> Firestore Live Sync
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <button
                    type="button"
                    className="btn-cancel"
                    onClick={() => setIsCategoryModalOpen(false)}
                    disabled={savingCategory}
                    style={{ 
                      padding: '11px 22px', 
                      borderRadius: '8px', 
                      fontWeight: 700, 
                      fontSize: '0.9rem',
                      border: '1.5px solid #cbd5e1', 
                      background: '#ffffff', 
                      color: '#475569',
                      cursor: 'pointer' 
                    }}
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={savingCategory}
                    style={{ 
                      background: 'linear-gradient(135deg, #854d0e 0%, #a16207 100%)', 
                      color: '#ffffff', 
                      display: 'inline-flex', 
                      alignItems: 'center', 
                      gap: '8px',
                      padding: '11px 26px',
                      borderRadius: '8px',
                      fontWeight: 800,
                      fontSize: '0.95rem',
                      border: 'none',
                      cursor: 'pointer',
                      boxShadow: '0 4px 14px rgba(133, 77, 14, 0.35)',
                      letterSpacing: '0.3px'
                    }}
                  >
                    {savingCategory ? (
                      <>
                        <Loader2 size={18} className="animate-spin" /> Saving to Firestore...
                      </>
                    ) : (
                      <>
                        <Check size={18} /> {editingCategory ? 'Update Category' : 'Save & Publish Category'}
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Mobile Responsive Bottom Navigation Bar Matching Reference UI */}
      <AdminMobileNav
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
          setMobileSidebarOpen(false);
        }}
        invoiceCount={
          orders?.filter(o => o.status === 'Pending' || o.status === 'Processing').length || 
          (orders?.length > 0 ? orders.length : 5)
        }
        showProductDot={true}
        showCustomerDot={true}
      />

      {/* COMPREHENSIVE STYLING MATCHING SCREENSHOT */}
      <style>{`
        .admin-portal-wrapper {
          display: flex;
          min-height: 100vh;
          background: #f1f5f9;
          font-family: inherit;
          color: #1e293b;
        }

        /* Toast */
        .admin-toast-banner {
          position: fixed;
          top: 20px;
          right: 20px;
          background: #1e293b;
          color: #ffffff;
          padding: 10px 18px;
          border-radius: 8px;
          font-size: 0.88rem;
          font-weight: 700;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.25);
          z-index: 1300;
        }

        /* LEFT SIDEBAR (Dark brand warm brown) */
        .admin-sidebar {
          width: 250px;
          background: #2b170e;
          color: #ffffff;
          display: flex;
          flex-direction: column;
          flex-shrink: 0;
          transition: width 0.25s ease;
          position: sticky;
          top: 0;
          height: 100vh;
          overflow-y: auto;
          z-index: 100;
        }
        .admin-sidebar.collapsed {
          width: 72px;
        }
        .sidebar-brand-header {
          padding: 22px 18px;
          display: flex;
          align-items: center;
          gap: 12px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        }
        .sidebar-brand-icon {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          background: #ffffff;
          padding: 3px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #ffffff;
          flex-shrink: 0;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
        }
        .sidebar-brand-title h3 {
          font-size: 1.15rem;
          font-weight: 800;
          margin: 0;
          color: #ffffff;
          letter-spacing: -0.3px;
        }
        .sidebar-brand-title small {
          font-size: 0.62rem;
          color: #fde68a;
          font-weight: 500;
          letter-spacing: 1px;
          display: block;
        }
        .mobile-close-sidebar {
          display: none;
          background: none;
          border: none;
          color: #ffffff;
          margin-left: auto;
          cursor: pointer;
        }

        /* Navigation items */
        .sidebar-nav-menu {
          padding: 16px 12px;
          display: flex;
          flex-direction: column;
          gap: 4px;
          flex: 1;
        }
        .nav-item-btn {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 14px;
          background: none;
          border: none;
          color: #cbd5e1;
          border-radius: 8px;
          font-size: 0.88rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          text-align: left;
          width: 100%;
        }
        .nav-item-btn:hover {
          background: rgba(255, 255, 255, 0.08);
          color: #ffffff;
        }
        .nav-item-btn.active {
          background: #854d0e;
          color: #ffffff;
          font-weight: 700;
          box-shadow: 0 4px 12px rgba(133, 77, 14, 0.4);
        }
        .sidebar-count-badge {
          margin-left: auto;
          background: rgba(255, 255, 255, 0.18);
          color: #ffffff;
          font-size: 0.72rem;
          padding: 2px 7px;
          border-radius: 12px;
          font-weight: 700;
        }
        .sidebar-count-badge.gold {
          background: #d97706;
          color: #ffffff;
        }
        .sidebar-count-badge.orange {
          background: #ea580c;
          color: #ffffff;
        }

        /* Bottom Sidebar Actions */
        .sidebar-bottom-actions {
          padding: 14px 12px 18px;
          border-top: 1px solid rgba(255, 255, 255, 0.08);
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .sidebar-storefront-btn {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 9px 12px;
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.14);
          color: #fde68a;
          border-radius: 8px;
          font-size: 0.82rem;
          font-weight: 700;
          cursor: pointer;
        }
        .sidebar-logout-btn {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 9px 12px;
          background: none;
          border: none;
          color: #ef4444;
          border-radius: 8px;
          font-size: 0.82rem;
          font-weight: 700;
          cursor: pointer;
        }
        .sidebar-logout-btn:hover {
          background: rgba(239, 68, 68, 0.15);
        }

        /* MAIN VIEWPORT */
        .admin-main-viewport {
          flex: 1;
          display: flex;
          flex-direction: column;
          min-width: 0;
          position: relative;
        }

        /* Top Header (Navbar - Firmly Sticky at the top) */
        .admin-top-header {
          height: 68px;
          background: #ffffff;
          border-bottom: 1px solid #e2e8f0;
          padding: 0 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          position: sticky;
          top: 0;
          z-index: 900;
          box-shadow: 0 2px 10px rgba(15, 23, 42, 0.05);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
        }
        .header-left-group {
          display: flex;
          align-items: center;
          gap: 16px;
          flex: 1;
          max-width: 500px;
        }
        .toggle-sidebar-btn {
          background: #f1f5f9;
          border: 1px solid #cbd5e1;
          width: 36px;
          height: 36px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #334155;
          cursor: pointer;
        }
        .header-search-box {
          position: relative;
          flex: 1;
        }
        .header-search-box .search-icon {
          position: absolute;
          left: 12px;
          top: 10px;
          color: #94a3b8;
        }
        .header-search-box input {
          width: 100%;
          padding: 9px 14px 9px 36px;
          border: 1px solid #cbd5e1;
          border-radius: 8px;
          font-size: 0.86rem;
          outline: none;
          background: #f8fafc;
        }
        .header-search-box input:focus {
          border-color: #854d0e;
          background: #ffffff;
        }

        .header-right-group {
          display: flex;
          align-items: center;
          gap: 16px;
        }
        .date-range-badge {
          display: flex;
          align-items: center;
          gap: 8px;
          background: #f8fafc;
          border: 1px solid #cbd5e1;
          padding: 6px 12px;
          border-radius: 8px;
          font-size: 0.8rem;
          font-weight: 600;
          color: #334155;
          cursor: pointer;
        }
        .notification-bell-btn {
          position: relative;
          width: 38px;
          height: 38px;
          border-radius: 50%;
          background: #f1f5f9;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #334155;
          cursor: pointer;
        }
        .bell-badge-count {
          position: absolute;
          top: -2px;
          right: -2px;
          background: #ef4444;
          color: #ffffff;
          font-size: 0.65rem;
          font-weight: 800;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 2px solid #ffffff;
        }
        .admin-avatar-card {
          display: flex;
          align-items: center;
          gap: 10px;
          padding-left: 10px;
          border-left: 1px solid #e2e8f0;
        }
        .avatar-circle {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          background: #854d0e;
          color: #ffffff;
          font-weight: 800;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.95rem;
        }
        .avatar-meta strong {
          display: block;
          font-size: 0.86rem;
          color: #0f172a;
          line-height: 1.2;
        }
        .avatar-meta small {
          font-size: 0.72rem;
          color: #64748b;
        }

        /* DASHBOARD CONTENT */
        .dashboard-content-area {
          padding: 24px;
          display: flex;
          flex-direction: column;
          gap: 24px;
        }
        .dashboard-welcome-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 14px;
        }
        .dashboard-welcome-row h2 {
          font-size: 1.5rem;
          font-weight: 800;
          color: #0f172a;
          margin: 0;
        }
        .dashboard-welcome-row p {
          font-size: 0.88rem;
          color: #64748b;
          margin: 4px 0 0;
        }
        .add-quick-product-btn {
          background: #854d0e;
          color: #ffffff;
          border: none;
          padding: 9px 16px;
          border-radius: 8px;
          font-size: 0.86rem;
          font-weight: 700;
          display: flex;
          align-items: center;
          gap: 6px;
          cursor: pointer;
          transition: background 0.2s ease;
        }
        .add-quick-product-btn:hover {
          background: #713f12;
        }

        /* 6 Modern KPI Metric Cards matching reference UI */
        .kpi-cards-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
        }
        .kpi-card {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 18px 20px;
          display: flex;
          align-items: center;
          gap: 16px;
          position: relative;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.02);
        }
        .kpi-card.modern-card {
          border-radius: 20px;
          padding: 18px 18px;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 10px;
          box-shadow: 0 4px 18px rgba(15, 23, 42, 0.03);
          border: 1px solid #edf2f7;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .kpi-card.modern-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 22px rgba(15, 23, 42, 0.06);
        }
        .kpi-card.modern-card .kpi-icon-wrap {
          width: 44px;
          height: 44px;
          border-radius: 13px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          margin-bottom: 2px;
        }
        .kpi-icon-wrap.cyan {
          background: #f0f9ff;
          color: #0284c7;
        }
        .kpi-icon-wrap.amber {
          background: #fffbeb;
          color: #d97706;
        }
        .kpi-icon-wrap.green {
          background: #f0fdf4;
          color: #16a34a;
        }
        .kpi-icon-wrap.rose {
          background: #fff1f2;
          color: #e11d48;
        }
        .kpi-icon-wrap.purple {
          background: #faf5ff;
          color: #9333ea;
        }
        .kpi-icon-wrap.teal {
          background: #f0fdfa;
          color: #0d9488;
        }
        .kpi-icon-wrap.brown {
          background: #fef3c7;
          color: #854d0e;
        }
        .kpi-icon-wrap.orange {
          background: #ffedd5;
          color: #c2410c;
        }
        .kpi-icon-wrap.blue {
          background: #e0f2fe;
          color: #0369a1;
        }
        .kpi-content-wrap {
          display: flex;
          flex-direction: column;
          gap: 3px;
          width: 100%;
        }
        .kpi-content-wrap .kpi-label {
          font-size: 0.84rem;
          color: #64748b;
          font-weight: 600;
          line-height: 1.2;
        }
        .kpi-content-wrap .kpi-number {
          font-size: 1.45rem;
          font-weight: 800;
          color: #0f172a;
          line-height: 1.2;
          letter-spacing: -0.3px;
        }
        .kpi-content-wrap .kpi-subtext {
          font-size: 0.74rem;
          font-weight: 500;
          color: #94a3b8;
          line-height: 1.2;
        }
        .kpi-data-wrap {
          display: flex;
          flex-direction: column;
        }
        .kpi-number {
          font-size: 1.45rem;
          font-weight: 800;
          color: #0f172a;
          line-height: 1.2;
        }
        .kpi-label {
          font-size: 0.8rem;
          color: #64748b;
          font-weight: 600;
          margin-top: 2px;
        }
        .kpi-growth-pill {
          position: absolute;
          bottom: 14px;
          right: 16px;
          font-size: 0.72rem;
          font-weight: 800;
          padding: 2px 6px;
          border-radius: 12px;
        }
        .kpi-growth-pill.positive {
          background: #dcfce7;
          color: #166534;
        }

        /* Analytics Two Column Grid */
        .analytics-two-col-grid {
          display: grid;
          grid-template-columns: 1.6fr 1.2fr;
          gap: 20px;
        }
        .chart-card {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 20px;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.02);
          display: flex;
          flex-direction: column;
        }
        .chart-card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }
        .chart-card-header h4 {
          font-size: 1rem;
          font-weight: 800;
          color: #0f172a;
          margin: 0;
        }
        .chart-filter-select select {
          padding: 4px 8px;
          border: 1px solid #cbd5e1;
          border-radius: 6px;
          font-size: 0.8rem;
          font-weight: 600;
          color: #334155;
          outline: none;
        }
        .chart-subtitle-note {
          font-size: 0.75rem;
          color: #64748b;
          font-weight: 600;
        }

        /* Bar Chart */
        .bar-chart-visual {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          height: 170px;
          padding: 10px 6px 0;
          border-bottom: 1px solid #e2e8f0;
          gap: 4px;
          overflow-x: auto;
        }
        .bar-column-wrap {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          flex: 1;
          min-width: 18px;
        }
        .bar-track {
          height: 125px;
          width: 100%;
          display: flex;
          align-items: flex-end;
          justify-content: center;
        }
        .bar-fill {
          width: 100%;
          max-width: 28px;
          min-width: 8px;
          background: linear-gradient(180deg, #b45309 0%, #854d0e 100%);
          border-radius: 4px 4px 0 0;
          transition: height 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          cursor: pointer;
        }
        .bar-fill:hover {
          background: linear-gradient(180deg, #d97706 0%, #b45309 100%);
          transform: scaleY(1.03);
        }
        .bar-day-label {
          font-size: 0.70rem;
          color: #64748b;
          font-weight: 700;
          text-align: center;
          white-space: nowrap;
        }

        /* Donut Chart Visual */
        .donut-category-visual {
          display: flex;
          align-items: center;
          gap: 24px;
          padding-top: 10px;
        }
        .donut-svg-wrap {
          position: relative;
          width: 140px;
          height: 140px;
          flex-shrink: 0;
        }
        .donut-svg {
          transform: rotate(-90deg);
        }
        .donut-center-label {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
        }
        .donut-center-label strong {
          font-size: 1.1rem;
          color: #0f172a;
          line-height: 1.1;
        }
        .donut-center-label small {
          font-size: 0.65rem;
          color: #64748b;
        }

        .donut-legend-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
          flex: 1;
        }
        .legend-item {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.82rem;
        }
        .legend-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          flex-shrink: 0;
        }
        .legend-name {
          color: #334155;
          flex: 1;
        }
        .legend-pct {
          color: #0f172a;
          font-weight: 700;
        }

        /* Bottom Row Tables Grid */
        /* Bottom Row Tables Grid */
        .recent-data-tables-grid {
          display: grid;
          grid-template-columns: 1.5fr 1.3fr;
          gap: 20px;
          min-width: 0;
          width: 100%;
        }
        .data-table-card {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 20px;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.02);
          min-width: 0;
          max-width: 100%;
          overflow: hidden;
        }
        .data-table-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }
        .data-table-header h4 {
          font-size: 1rem;
          font-weight: 800;
          color: #0f172a;
          margin: 0;
        }
        .view-all-link-btn {
          background: none;
          border: none;
          color: #854d0e;
          font-weight: 700;
          font-size: 0.82rem;
          display: flex;
          align-items: center;
          gap: 4px;
          cursor: pointer;
        }
        .view-all-link-btn:hover {
          text-decoration: underline;
        }

        /* Admin Table Styling */
        .admin-table-wrap {
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
          width: 100%;
          max-width: 100%;
        }

        /* Visible horizontal scrollbars specifically for Recent Orders & Latest Enquiries */
        .scrollable-recent-table {
          width: 100% !important;
          max-width: 100% !important;
          overflow-x: scroll !important;
          overflow-y: hidden !important;
          -webkit-overflow-scrolling: touch !important;
          touch-action: pan-x pan-y !important;
          padding-bottom: 10px !important;
          margin-bottom: 4px;
          scrollbar-width: auto !important;
          scrollbar-color: #94a3b8 #f1f5f9 !important;
        }
        .scrollable-recent-table::-webkit-scrollbar {
          height: 10px !important;
          display: block !important;
        }
        .scrollable-recent-table::-webkit-scrollbar-track {
          background: #f1f5f9 !important;
          border-radius: 8px;
        }
        .scrollable-recent-table::-webkit-scrollbar-thumb {
          background: #854d0e !important;
          border-radius: 8px;
          border: 2px solid #f1f5f9;
        }
        .scrollable-recent-table::-webkit-scrollbar-thumb:hover {
          background: #713f12 !important;
        }

        .recent-orders-table {
          min-width: 700px !important;
          width: 100%;
        }
        .recent-enquiries-table {
          min-width: 600px !important;
          width: 100%;
        }
        .admin-table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
          font-size: 0.84rem;
        }
        .admin-table th {
          background: #f8fafc;
          color: #475569;
          font-weight: 700;
          padding: 10px 12px;
          border-bottom: 1.5px solid #e2e8f0;
          white-space: nowrap;
        }
        .admin-table td {
          padding: 11px 12px;
          border-bottom: 1px solid #f1f5f9;
          color: #1e293b;
          vertical-align: middle;
        }
        .admin-table tr:hover {
          background: #fafafa;
        }

        .status-pill-badge {
          display: inline-block;
          padding: 2px 8px;
          border-radius: 12px;
          font-size: 0.72rem;
          font-weight: 700;
        }
        .status-pill-badge.delivered {
          background: #dcfce7;
          color: #166534;
        }
        .status-pill-badge.out-for-delivery, .status-pill-badge.shipped {
          background: #fed7aa;
          color: #9a3412;
        }
        .status-pill-badge.processing, .status-pill-badge.confirmed, .status-pill-badge.packed {
          background: #e0e7ff;
          color: #3730a3;
        }
        .status-pill-badge.pending, .status-pill-badge.order-placed {
          background: #fef3c7;
          color: #854d0e;
        }
        .status-pill-badge.cancelled {
          background: #fee2e2;
          color: #991b1b;
        }

        .table-action-icon-btn {
          width: 28px;
          height: 28px;
          border-radius: 6px;
          background: #f1f5f9;
          border: 1px solid #cbd5e1;
          color: #334155;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }
        .table-action-icon-btn.edit:hover {
          background: #fef3c7;
          color: #854d0e;
          border-color: #d97706;
        }
        .table-action-icon-btn.delete:hover {
          background: #fee2e2;
          color: #ef4444;
          border-color: #fca5a5;
        }
        .table-action-icon-btn.invoice:hover {
          background: #e0f2fe;
          color: #0284c7;
          border-color: #7dd3fc;
        }

        .table-whatsapp-reply-btn {
          background: #25d366;
          color: #ffffff;
          padding: 4px 10px;
          border-radius: 6px;
          font-size: 0.75rem;
          font-weight: 700;
          text-decoration: none;
          display: inline-block;
        }

        .table-truncate-text {
          display: inline-block;
          max-width: 140px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        /* Subpage Card Style */
        .admin-subpage-card {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 24px;
          margin: 24px;
        }
        .subpage-header-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          flex-wrap: wrap;
          gap: 12px;
        }
        .subpage-header-row h3 {
          font-size: 1.3rem;
          font-weight: 800;
          color: #0f172a;
          margin: 0;
        }
        .subpage-header-row p {
          font-size: 0.85rem;
          color: #64748b;
          margin: 4px 0 0;
        }

        .subpage-filters-bar {
          display: flex;
          gap: 12px;
          margin-bottom: 18px;
          flex-wrap: wrap;
        }
        .filter-search-box {
          display: flex;
          align-items: center;
          gap: 8px;
          background: #f8fafc;
          border: 1px solid #cbd5e1;
          padding: 8px 14px;
          border-radius: 8px;
          flex: 1;
          max-width: 400px;
        }
        .filter-search-box input {
          border: none;
          background: transparent;
          font-size: 0.86rem;
          outline: none;
          width: 100%;
        }
        .filter-dropdown-wrap {
          display: flex;
          align-items: center;
          gap: 8px;
          background: #f8fafc;
          border: 1px solid #cbd5e1;
          padding: 4px 12px;
          border-radius: 8px;
        }
        .filter-dropdown-wrap select {
          border: none;
          background: transparent;
          font-size: 0.85rem;
          font-weight: 600;
          color: #334155;
          outline: none;
        }

        .product-table-item-cell {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .product-thumb-sm {
          width: 42px;
          height: 42px;
          border-radius: 6px;
          object-fit: cover;
          border: 1px solid #e2e8f0;
        }
        .category-pill-tag {
          background: #f1f5f9;
          color: #475569;
          padding: 2px 8px;
          border-radius: 12px;
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: capitalize;
        }
        .badge-promo-pill {
          background: #fef3c7;
          color: #854d0e;
          font-size: 0.7rem;
          font-weight: 700;
          padding: 2px 6px;
          border-radius: 4px;
        }
        .discount-tag {
          color: #16a34a;
          font-weight: 700;
        }
        .in-stock-badge {
          background: #dcfce7;
          color: #166534;
          padding: 2px 8px;
          border-radius: 12px;
          font-size: 0.75rem;
          font-weight: 700;
        }
        .role-tag {
          background: #e0f2fe;
          color: #0369a1;
          padding: 2px 8px;
          border-radius: 12px;
          font-size: 0.75rem;
          font-weight: 700;
        }
        .text-strike {
          text-decoration: line-through;
          color: #94a3b8;
          font-size: 0.78rem;
        }
        .table-actions-group {
          display: flex;
          gap: 6px;
        }

        .status-selector-input {
          padding: 4px 8px;
          border-radius: 6px;
          font-size: 0.78rem;
          font-weight: 700;
          outline: none;
          cursor: pointer;
          border: 1px solid transparent;
        }
        .status-selector-input.delivered {
          background: #dcfce7;
          color: #166534;
        }
        .status-selector-input.out-for-delivery {
          background: #fed7aa;
          color: #9a3412;
        }
        .status-selector-input.packed, .status-selector-input.confirmed {
          background: #e0e7ff;
          color: #3730a3;
        }
        .status-selector-input.order-placed {
          background: #fef3c7;
          color: #854d0e;
        }

        /* ------------------------------------------------------------- */
        /* ORDERS MANAGEMENT EXECUTIVE SENIOR-UI STYLING                 */
        /* ------------------------------------------------------------- */
        .orders-subpage-root {
          padding: 24px;
        }

        /* Hero Header */
        .orders-header-hero {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          flex-wrap: wrap;
          gap: 16px;
          margin-bottom: 20px;
          padding-bottom: 16px;
          border-bottom: 1px solid #f1f5f9;
        }
        .orders-header-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: #fef3c7;
          color: #92400e;
          padding: 4px 10px;
          border-radius: 9999px;
          font-size: 0.72rem;
          font-weight: 700;
          letter-spacing: 0.3px;
          text-transform: uppercase;
          margin-bottom: 6px;
        }
        .orders-header-title-block h3 {
          font-size: 1.4rem;
          font-weight: 800;
          color: #0f172a;
          margin: 0 0 4px 0;
          letter-spacing: -0.3px;
        }
        .orders-header-title-block p {
          font-size: 0.85rem;
          color: #64748b;
          margin: 0;
        }
        .btn-pos-counter-bill {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: linear-gradient(135deg, #b45309 0%, #92400e 100%);
          color: #ffffff;
          border: none;
          padding: 10px 20px;
          border-radius: 10px;
          font-weight: 700;
          font-size: 0.85rem;
          cursor: pointer;
          box-shadow: 0 4px 12px rgba(180, 83, 9, 0.25);
          transition: all 0.2s ease;
        }
        .btn-pos-counter-bill:hover {
          transform: translateY(-1px);
          box-shadow: 0 6px 16px rgba(180, 83, 9, 0.35);
          background: linear-gradient(135deg, #92400e 0%, #78350f 100%);
        }

        /* KPI Quick-Filter Strip */
        .orders-kpi-filter-strip {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-wrap: wrap;
          margin-bottom: 20px;
          padding: 12px 14px;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 14px;
        }
        .order-kpi-pill {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: #ffffff;
          border: 1.5px solid #e2e8f0;
          padding: 7px 14px;
          border-radius: 10px;
          font-size: 0.82rem;
          font-weight: 600;
          color: #475569;
          cursor: pointer;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .order-kpi-pill:hover {
          border-color: #cbd5e1;
          background: #f1f5f9;
          transform: translateY(-1px);
        }
        .order-kpi-pill.active {
          background: #0f172a;
          border-color: #0f172a;
          color: #ffffff;
          box-shadow: 0 4px 12px rgba(15, 23, 42, 0.15);
        }
        .order-kpi-pill .kpi-count {
          background: #f1f5f9;
          color: #0f172a;
          font-size: 0.72rem;
          font-weight: 800;
          padding: 2px 7px;
          border-radius: 9999px;
        }
        .order-kpi-pill.active .kpi-count {
          background: rgba(255, 255, 255, 0.2);
          color: #ffffff;
        }
        .kpi-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          display: inline-block;
        }
        .kpi-dot.in-progress { background: #3b82f6; box-shadow: 0 0 6px rgba(59, 130, 246, 0.5); }
        .kpi-dot.delivered { background: #10b981; box-shadow: 0 0 6px rgba(16, 185, 129, 0.5); }
        .kpi-dot.cod-pending { background: #f59e0b; box-shadow: 0 0 6px rgba(245, 158, 11, 0.5); }

        .order-kpi-revenue-box {
          margin-left: auto;
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          padding-left: 12px;
          border-left: 1px solid #cbd5e1;
        }
        .kpi-revenue-label {
          font-size: 0.68rem;
          text-transform: uppercase;
          font-weight: 700;
          color: #64748b;
          letter-spacing: 0.3px;
        }
        .kpi-revenue-val {
          font-size: 1.05rem;
          font-weight: 900;
          color: #0f172a;
          letter-spacing: -0.3px;
        }

        /* Search & Filter Row */
        .orders-search-filter-row {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 20px;
          flex-wrap: wrap;
        }
        .orders-search-input-wrap {
          flex: 1;
          min-width: 280px;
          position: relative;
          display: flex;
          align-items: center;
        }
        .orders-search-input-wrap .search-icon {
          position: absolute;
          left: 14px;
          color: #94a3b8;
          pointer-events: none;
        }
        .orders-search-input-wrap input {
          width: 100%;
          padding: 11px 40px 11px 42px;
          background: #ffffff;
          border: 1.5px solid #e2e8f0;
          border-radius: 12px;
          font-size: 0.88rem;
          font-weight: 500;
          color: #0f172a;
          transition: all 0.2s ease;
          outline: none;
        }
        .orders-search-input-wrap input:focus {
          border-color: #b45309;
          box-shadow: 0 0 0 3px rgba(180, 83, 9, 0.12);
        }
        .search-clear-btn {
          position: absolute;
          right: 12px;
          background: #f1f5f9;
          border: none;
          color: #64748b;
          width: 22px;
          height: 22px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }
        .search-clear-btn:hover {
          background: #e2e8f0;
          color: #0f172a;
        }
        .orders-filter-select-wrap {
          display: flex;
          align-items: center;
          gap: 8px;
          background: #ffffff;
          border: 1.5px solid #e2e8f0;
          padding: 0 14px;
          border-radius: 12px;
          color: #64748b;
          min-width: 200px;
        }
        .orders-filter-select-wrap select {
          border: none;
          background: transparent;
          padding: 11px 0;
          font-size: 0.85rem;
          font-weight: 600;
          color: #1e293b;
          width: 100%;
          outline: none;
          cursor: pointer;
        }

        /* Empty State */
        .orders-empty-state.modern {
          text-align: center;
          padding: 56px 24px;
          background: linear-gradient(180deg, #f8fafc 0%, #ffffff 100%);
          border: 1.5px dashed #cbd5e1;
          border-radius: 20px;
          margin: 16px 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
        }
        .empty-icon-halo {
          width: 68px;
          height: 68px;
          border-radius: 50%;
          background: #fef3c7;
          color: #b45309;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 14px rgba(180, 83, 9, 0.15);
        }
        .orders-empty-state.modern h4 {
          font-size: 1.2rem;
          font-weight: 800;
          color: #0f172a;
          margin: 0;
        }
        .orders-empty-state.modern p {
          font-size: 0.88rem;
          color: #64748b;
          max-width: 440px;
          line-height: 1.5;
          margin: 0;
        }
        .btn-reset-filters {
          margin-top: 6px;
          background: #0f172a;
          color: #ffffff;
          border: none;
          padding: 8px 18px;
          border-radius: 8px;
          font-size: 0.82rem;
          font-weight: 700;
          cursor: pointer;
          transition: background 0.2s;
        }
        .btn-reset-filters:hover {
          background: #334155;
        }

        /* Desktop Table View (> 820px) */
        .orders-desktop-table {
          display: block;
          overflow-x: auto;
          border: 1px solid #e2e8f0;
          border-radius: 16px;
          background: #ffffff;
          box-shadow: 0 4px 20px rgba(15, 23, 42, 0.04);
        }
        .orders-mobile-cards-list {
          display: none;
        }

        .orders-table.modern-ui {
          width: 100%;
          border-collapse: separate;
          border-spacing: 0;
        }
        .orders-table.modern-ui thead th {
          background: #f8fafc;
          padding: 14px 16px;
          font-size: 0.74rem;
          font-weight: 800;
          color: #475569;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          border-bottom: 1.5px solid #e2e8f0;
          white-space: nowrap;
        }
        .order-table-row.modern {
          transition: background 0.15s ease;
        }
        .order-table-row.modern:hover {
          background: #fafafa;
        }
        .order-table-row.modern td {
          padding: 16px;
          vertical-align: middle;
          border-bottom: 1px solid #f1f5f9;
        }
        .order-table-row.modern:last-child td {
          border-bottom: none;
        }

        /* Order ID Cell */
        .order-id-cell {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .order-id-pill-row {
          display: inline-flex;
          align-items: center;
          gap: 6px;
        }
        .order-id-pill {
          background: #f1f5f9;
          border: 1px solid #cbd5e1;
          border-radius: 8px;
          padding: 4px 9px;
          font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
          font-size: 0.82rem;
          font-weight: 800;
          color: #0f172a;
          letter-spacing: -0.2px;
          display: inline-block;
        }
        .btn-copy-order-id {
          background: transparent;
          border: 1px solid #e2e8f0;
          color: #64748b;
          border-radius: 6px;
          width: 24px;
          height: 24px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.15s ease;
        }
        .btn-copy-order-id:hover {
          background: #f8fafc;
          border-color: #cbd5e1;
          color: #0f172a;
        }
        .btn-copy-order-id.copied {
          border-color: #86efac;
          background: #f0fdf4;
        }
        .order-timestamp {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          font-size: 0.74rem;
          color: #64748b;
          font-weight: 500;
        }

        /* Customer Cell Modern */
        .customer-details-cell.modern .customer-avatar-row {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .customer-monogram {
          width: 38px;
          height: 38px;
          border-radius: 12px;
          background: linear-gradient(135deg, #b45309 0%, #78350f 100%);
          color: #ffffff;
          font-weight: 800;
          font-size: 0.95rem;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          box-shadow: 0 2px 8px rgba(180, 83, 9, 0.25);
        }
        .customer-monogram.mobile {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          font-size: 0.9rem;
        }
        .customer-meta-col {
          display: flex;
          flex-direction: column;
          gap: 3px;
          min-width: 0;
        }
        .customer-name {
          font-size: 0.9rem;
          font-weight: 800;
          color: #0f172a;
          line-height: 1.25;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .customer-phone {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-size: 0.76rem;
          color: #475569;
          text-decoration: none;
          font-weight: 600;
          transition: color 0.15s;
        }
        .customer-phone:hover {
          color: #b45309;
        }
        .customer-city-tag {
          display: inline-flex;
          align-items: center;
          gap: 3px;
          background: #f1f5f9;
          border: 1px solid #e2e8f0;
          border-radius: 5px;
          padding: 1px 6px;
          font-size: 0.70rem;
          color: #64748b;
          font-weight: 600;
          width: fit-content;
        }

        /* Order Items List Modern */
        .order-items-cell .order-items-list.modern {
          display: flex;
          flex-direction: column;
          gap: 6px;
          max-width: 300px;
        }
        .order-item-badge.modern {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          padding: 5px 9px;
          font-size: 0.78rem;
          transition: background 0.15s;
        }
        .order-item-badge.modern:hover {
          background: #f1f5f9;
        }
        .order-item-badge.modern .item-name {
          font-weight: 600;
          color: #334155;
          line-height: 1.2;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .order-item-badge.modern .item-qty {
          font-size: 0.72rem;
          font-weight: 800;
          color: #92400e;
          background: #fef3c7;
          padding: 1px 6px;
          border-radius: 5px;
          flex-shrink: 0;
        }
        .order-item-badge.modern .item-price {
          font-size: 0.74rem;
          font-weight: 700;
          color: #64748b;
          margin-left: auto;
          flex-shrink: 0;
        }

        /* Total Amount Cell */
        .order-amount-cell .order-amount-val {
          font-size: 1.15rem;
          font-weight: 900;
          color: #0f172a;
          line-height: 1.2;
          letter-spacing: -0.3px;
        }
        .order-amount-cell .order-items-count {
          font-size: 0.72rem;
          color: #94a3b8;
          font-weight: 600;
          display: block;
          margin-top: 3px;
        }

        /* Payment Details Cell */
        .payment-details-cell {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .payment-method-row {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 0.8rem;
          font-weight: 700;
          color: #334155;
        }
        .payment-status-badge {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 3px 9px;
          border-radius: 9999px;
          font-size: 0.72rem;
          font-weight: 700;
          width: fit-content;
          letter-spacing: 0.2px;
        }
        .payment-status-badge.paid {
          background: #dcfce7;
          color: #15803d;
          border: 1px solid #86efac;
        }
        .payment-status-badge.pending {
          background: #fffbeb;
          color: #b45309;
          border: 1px solid #fde68a;
        }

        /* Live Status Selector Dropdown */
        .status-dropdown-wrapper {
          position: relative;
          display: inline-flex;
          align-items: center;
          width: 100%;
        }
        .status-indicator-dot {
          position: absolute;
          left: 12px;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          pointer-events: none;
          z-index: 2;
        }
        .status-indicator-dot.delivered { background: #10b981; }
        .status-indicator-dot.out-for-delivery { background: #0ea5e9; }
        .status-indicator-dot.packed,
        .status-indicator-dot.confirmed { background: #a855f7; }
        .status-indicator-dot.order-placed { background: #f59e0b; }
        .status-indicator-dot.cancelled { background: #ef4444; }

        .status-selector-input.executive {
          width: 100%;
          padding: 7px 12px 7px 28px;
          border-radius: 10px;
          font-size: 0.8rem;
          font-weight: 700;
          cursor: pointer;
          border: 1.5px solid;
          outline: none;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          appearance: none;
          -webkit-appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23475569' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 10px center;
          padding-right: 28px;
        }
        .status-selector-input.executive:focus {
          box-shadow: 0 0 0 3px rgba(180, 83, 9, 0.15);
        }
        .status-selector-input.executive.delivered {
          background-color: #ecfdf5;
          color: #047857;
          border-color: #6ee7b7;
        }
        .status-selector-input.executive.out-for-delivery {
          background-color: #f0f9ff;
          color: #0369a1;
          border-color: #7dd3fc;
        }
        .status-selector-input.executive.packed,
        .status-selector-input.executive.confirmed {
          background-color: #faf5ff;
          color: #6b21a8;
          border-color: #d8b4fe;
        }
        .status-selector-input.executive.order-placed {
          background-color: #fffbeb;
          color: #b45309;
          border-color: #fde68a;
        }
        .status-selector-input.executive.cancelled {
          background-color: #fff1f2;
          color: #be123c;
          border-color: #fecdd3;
        }

        /* Action Buttons Group */
        .table-actions-group.modern-actions {
          display: inline-flex;
          align-items: center;
          gap: 6px;
        }
        .table-action-icon-btn {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          border: 1px solid #e2e8f0;
          background: #ffffff;
          color: #475569;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.15s ease;
        }
        .table-action-icon-btn.invoice {
          background: #fef3c7;
          color: #92400e;
          border-color: #fde68a;
        }
        .table-action-icon-btn.invoice:hover {
          background: #b45309;
          color: #ffffff;
          border-color: #b45309;
          transform: translateY(-1px);
        }
        .table-action-icon-btn.edit:hover {
          background: #0ea5e9;
          color: #ffffff;
          border-color: #0ea5e9;
          transform: translateY(-1px);
        }
        .table-action-icon-btn.delete:hover {
          background: #ef4444;
          color: #ffffff;
          border-color: #ef4444;
          transform: translateY(-1px);
        }

        /* ============================================================= */
        /* MOBILE RESPONSIVE ORDERS CARD VIEW (<= 820px)                 */
        /* ============================================================= */
        @media (max-width: 820px) {
          .orders-desktop-table {
            display: none !important;
          }
          .orders-mobile-cards-list {
            display: flex !important;
            flex-direction: column;
            gap: 16px;
          }
          .orders-subpage-root {
            padding: 16px;
          }
          .orders-header-hero {
            flex-direction: column;
            align-items: stretch;
          }
          .btn-pos-counter-bill {
            width: 100%;
            justify-content: center;
          }
          .order-kpi-revenue-box {
            width: 100%;
            margin-left: 0;
            border-left: none;
            padding-left: 0;
            padding-top: 10px;
            border-top: 1px solid #cbd5e1;
            align-items: flex-start;
          }

          /* Mobile Order Card */
          .order-mobile-card.modern {
            background: #ffffff;
            border: 1px solid #e2e8f0;
            border-radius: 18px;
            padding: 16px;
            box-shadow: 0 4px 18px rgba(15, 23, 42, 0.05);
            display: flex;
            flex-direction: column;
            gap: 14px;
            transition: transform 0.15s ease, box-shadow 0.15s ease;
          }
          .order-mobile-card.modern:active {
            transform: scale(0.99);
          }
          .order-card-header-bar {
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 10px;
            padding-bottom: 12px;
            border-bottom: 1px solid #f1f5f9;
          }
          .order-card-id-group {
            display: flex;
            flex-direction: column;
            gap: 4px;
          }
          .order-card-date {
            display: inline-flex;
            align-items: center;
            gap: 4px;
            font-size: 0.72rem;
            color: #64748b;
            font-weight: 500;
          }
          .status-selector-input.executive.mini {
            width: auto;
            min-width: 135px;
            padding: 6px 26px 6px 12px;
            font-size: 0.74rem;
          }

          /* Customer Row */
          .order-card-customer-row {
            display: flex;
            align-items: center;
            gap: 12px;
            background: #f8fafc;
            padding: 12px;
            border-radius: 12px;
            border: 1px solid #f1f5f9;
          }
          .customer-info-col {
            display: flex;
            flex-direction: column;
            gap: 4px;
            min-width: 0;
          }
          .customer-contact-meta {
            display: flex;
            align-items: center;
            gap: 8px;
            flex-wrap: wrap;
          }
          .customer-phone-chip {
            display: inline-flex;
            align-items: center;
            gap: 4px;
            background: #ffffff;
            border: 1px solid #cbd5e1;
            padding: 2px 8px;
            border-radius: 6px;
            font-size: 0.74rem;
            font-weight: 600;
            color: #334155;
            text-decoration: none;
          }
          .customer-phone-chip:hover {
            color: #b45309;
            border-color: #b45309;
          }
          .customer-city-chip {
            display: inline-flex;
            align-items: center;
            gap: 3px;
            background: #ffffff;
            border: 1px solid #cbd5e1;
            padding: 2px 8px;
            border-radius: 6px;
            font-size: 0.72rem;
            font-weight: 600;
            color: #64748b;
          }

          /* Items Block */
          .order-card-items-block {
            display: flex;
            flex-direction: column;
            gap: 8px;
          }
          .items-block-label {
            font-size: 0.70rem;
            font-weight: 800;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            color: #64748b;
          }
          .items-tags-wrap {
            display: flex;
            flex-direction: column;
            gap: 6px;
          }

          /* Summary Row */
          .order-card-summary-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 12px;
            padding: 12px;
            background: #fafafa;
            border-radius: 12px;
            border: 1px dashed #cbd5e1;
          }
          .total-amount-meta {
            display: flex;
            flex-direction: column;
            gap: 2px;
          }
          .total-amount-meta .meta-label {
            font-size: 0.68rem;
            text-transform: uppercase;
            font-weight: 700;
            color: #64748b;
          }
          .payment-badges-stack {
            display: flex;
            flex-direction: column;
            align-items: flex-end;
            gap: 4px;
          }
          .payment-method-chip {
            display: inline-flex;
            align-items: center;
            gap: 4px;
            font-size: 0.72rem;
            font-weight: 700;
            color: #334155;
          }

          /* Footer Actions */
          .order-card-actions-footer {
            display: flex;
            align-items: center;
            gap: 8px;
            padding-top: 4px;
          }
          .btn-card-tax-invoice {
            flex: 1;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 6px;
            background: linear-gradient(135deg, #b45309 0%, #92400e 100%);
            color: #ffffff;
            border: none;
            padding: 10px 14px;
            border-radius: 10px;
            font-size: 0.82rem;
            font-weight: 800;
            cursor: pointer;
            box-shadow: 0 2px 8px rgba(180, 83, 9, 0.25);
          }
          .btn-card-tax-invoice:active {
            background: #78350f;
          }
          .btn-card-icon-action {
            width: 38px;
            height: 38px;
            border-radius: 10px;
            border: 1.5px solid #e2e8f0;
            background: #ffffff;
            color: #475569;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
          }
          .btn-card-icon-action.delete {
            color: #ef4444;
            border-color: #fee2e2;
          }

          /* Mobile Sticky Orders Filter Toolbar */
          .mobile-orders-filter-toolbar {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 10px;
            background: #ffffff;
            border: 1.5px solid #e2e8f0;
            border-radius: 14px;
            padding: 10px 14px;
            box-shadow: 0 4px 14px rgba(15, 23, 42, 0.04);
            margin-bottom: 4px;
          }
          .mobile-filter-dropdown-pill {
            position: relative;
            display: flex;
            align-items: center;
            flex: 1;
            background: #f8fafc;
            border: 1.5px solid #cbd5e1;
            border-radius: 10px;
            padding: 0 10px 0 32px;
            transition: all 0.2s ease;
          }
          .mobile-filter-dropdown-pill:focus-within {
            border-color: #b45309;
            box-shadow: 0 0 0 3px rgba(180, 83, 9, 0.12);
            background: #ffffff;
          }
          .mobile-filter-dropdown-pill .filter-icon {
            position: absolute;
            left: 10px;
            color: #b45309;
            pointer-events: none;
          }
          .mobile-filter-dropdown-pill .select-chevron {
            position: absolute;
            right: 10px;
            color: #64748b;
            pointer-events: none;
          }
          .mobile-filter-select {
            width: 100%;
            border: none;
            background: transparent;
            padding: 8px 18px 8px 0;
            font-size: 0.82rem;
            font-weight: 700;
            color: #0f172a;
            outline: none;
            cursor: pointer;
            appearance: none;
            -webkit-appearance: none;
          }
          .mobile-orders-count-badge {
            font-size: 0.72rem;
            color: #64748b;
            font-weight: 600;
            white-space: nowrap;
            background: #f1f5f9;
            padding: 4px 8px;
            border-radius: 6px;
            border: 1px solid #e2e8f0;
          }
          .mobile-orders-count-badge strong {
            color: #0f172a;
            font-weight: 800;
          }
        }

        /* Order Payment & COD Edit Card in Modal */
        .order-payment-edit-card {
          background: #f8fafc;
          border: 1.5px solid #e2e8f0;
          border-radius: 12px;
          padding: 14px 16px;
          margin-top: 4px;
        }
        .payment-edit-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 12px;
          flex-wrap: wrap;
          padding-bottom: 8px;
          border-bottom: 1px solid #e2e8f0;
        }
        .btn-mark-paid-quick {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          background: #16a34a;
          color: #ffffff;
          border: none;
          padding: 6px 12px;
          border-radius: 7px;
          font-size: 0.74rem;
          font-weight: 800;
          cursor: pointer;
          transition: background 0.15s ease;
        }
        .btn-mark-paid-quick:hover {
          background: #15803d;
        }

        /* Form Grid styles */
        .content-form-grid, .settings-form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          margin-bottom: 24px;
        }
        .form-field-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .form-field-group.full-width {
          grid-column: 1 / -1;
        }
        .form-field-group label {
          font-size: 0.84rem;
          font-weight: 700;
          color: #334155;
        }
        .form-field-group input, .form-field-group select {
          padding: 10px 14px;
          border: 1.5px solid #cbd5e1;
          border-radius: 8px;
          font-size: 0.88rem;
          outline: none;
        }
        .form-field-group input:focus, .form-field-group select:focus {
          border-color: #854d0e;
        }
        .save-content-btn {
          background: #854d0e;
          color: #ffffff;
          border: none;
          padding: 11px 24px;
          border-radius: 8px;
          font-weight: 700;
          cursor: pointer;
        }

        /* Categories Admin Grid */
        .categories-admin-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
        }
        .category-admin-box {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 10px;
          padding: 16px;
        }
        .cat-box-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
        }
        .cat-box-header h4 {
          font-size: 1.05rem;
          font-weight: 800;
          color: #0f172a;
          margin: 0;
        }
        .cat-count-badge {
          background: #e2e8f0;
          color: #475569;
          font-size: 0.72rem;
          font-weight: 700;
          padding: 2px 8px;
          border-radius: 12px;
        }
        .cat-sub-list strong {
          display: block;
          font-size: 0.8rem;
          color: #64748b;
          margin-bottom: 6px;
        }
        .cat-sub-list ul {
          margin: 0;
          padding-left: 18px;
          font-size: 0.84rem;
          color: #334155;
          line-height: 1.6;
        }

        /* Coupons Grid */
        .coupons-admin-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
        }
        .coupon-admin-card {
          background: #f8fafc;
          border: 1px dashed #cbd5e1;
          border-radius: 10px;
          padding: 16px;
        }
        .coupon-code-pill {
          font-size: 1rem;
          font-weight: 800;
          color: #854d0e;
          margin-bottom: 6px;
        }
        .coupon-admin-card p {
          font-size: 0.82rem;
          color: #64748b;
          margin-bottom: 12px;
        }
        .coupon-card-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .active-tag {
          background: #dcfce7;
          color: #166534;
          font-size: 0.72rem;
          font-weight: 700;
          padding: 2px 6px;
          border-radius: 4px;
        }

        /* Dialogs / Modals */
        .admin-modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(15, 23, 42, 0.7);
          backdrop-filter: blur(4px);
          z-index: 1200;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 16px;
        }
        .admin-dialog-card {
          background: #ffffff;
          border-radius: 14px;
          max-width: 580px;
          width: 100%;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
          overflow: hidden;
        }
        .dialog-header {
          padding: 16px 20px;
          background: #2b170e;
          color: #ffffff;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .dialog-header h4 {
          margin: 0;
          font-size: 1.1rem;
          color: #ffffff;
        }
        .dialog-close-btn {
          background: rgba(255, 255, 255, 0.15);
          border: none;
          color: #ffffff;
          width: 30px;
          height: 30px;
          border-radius: 50%;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .dialog-form-body {
          padding: 20px;
        }
        .dialog-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 14px;
          margin-bottom: 20px;
        }
        .dialog-footer-actions {
          display: flex;
          justify-content: flex-end;
          gap: 10px;
        }
        .btn-cancel {
          background: #f1f5f9;
          color: #475569;
          border: 1px solid #cbd5e1;
          padding: 9px 16px;
          border-radius: 8px;
          font-weight: 700;
          font-size: 0.86rem;
          cursor: pointer;
        }
        .btn-confirm {
          background: #854d0e;
          color: #ffffff;
          border: none;
          padding: 9px 20px;
          border-radius: 8px;
          font-weight: 700;
          font-size: 0.86rem;
          cursor: pointer;
        }

        /* Mobile Responsive */
        @media (max-width: 1100px) {
          .kpi-cards-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          .analytics-two-col-grid, .recent-data-tables-grid {
            grid-template-columns: 1fr;
          }
          .categories-admin-grid, .coupons-admin-grid {
            grid-template-columns: 1fr;
          }
        }
        @media (max-width: 900px) {
          .admin-sidebar {
            position: fixed;
            left: -260px;
            top: 0;
            bottom: 0;
            z-index: 1000;
          }
          .admin-sidebar.mobile-open {
            left: 0;
          }
          .mobile-close-sidebar {
            display: block;
          }
          .admin-mobile-backdrop {
            position: fixed;
            inset: 0;
            background: rgba(0, 0, 0, 0.5);
            z-index: 999;
          }
          .date-range-badge, .header-search-box {
            display: none;
          }
          .admin-main-viewport {
            padding-bottom: calc(75px + env(safe-area-inset-bottom, 0px));
          }
          .dashboard-content-area, .admin-subpage-card {
            padding: 16px;
            margin: 12px;
          }
        }

        /* Settings Section Panels */
        .settings-section-panel {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 20px;
          margin-bottom: 22px;
        }
        .settings-section-head {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 18px;
          padding-bottom: 12px;
          border-bottom: 1px solid #e2e8f0;
        }
        .section-icon {
          color: #854d0e;
        }
        .settings-section-head h4 {
          font-size: 1.05rem;
          font-weight: 800;
          color: #0f172a;
          margin: 0;
        }
        .settings-section-head small {
          font-size: 0.78rem;
          color: #64748b;
        }

        .password-change-box {
          background: #ffffff;
          border: 1px dashed #cbd5e1;
          border-radius: 10px;
          padding: 16px;
          margin-top: 10px;
        }
        .password-change-box h5 {
          font-size: 0.88rem;
          font-weight: 800;
          color: #1e293b;
          margin: 0 0 12px;
        }
        .btn-update-pwd {
          background: #2b170e;
          color: #ffffff;
          border: none;
          padding: 8px 16px;
          border-radius: 6px;
          font-size: 0.82rem;
          font-weight: 700;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          margin-top: 10px;
        }
        .btn-update-pwd:hover {
          background: #452414;
        }

        .system-actions-grid {
          display: flex;
          gap: 14px;
          flex-wrap: wrap;
        }
        .system-action-btn {
          background: #ffffff;
          border: 1.5px solid #cbd5e1;
          color: #334155;
          padding: 10px 16px;
          border-radius: 8px;
          font-size: 0.84rem;
          font-weight: 700;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .system-action-btn:hover {
          background: #f1f5f9;
          border-color: #94a3b8;
        }
        .system-action-btn.export {
          background: #fef3c7;
          border-color: #d97706;
          color: #92400e;
        }
        .system-action-btn.danger {
          background: #fef2f2;
          border-color: #fca5a5;
          color: #b91c1c;
        }
        .system-action-btn.danger:hover {
          background: #fee2e2;
        }

        /* Footer Brand Editor & Live Preview */
        .footer-brand-editor-box {
          background: #f8fafc;
          border: 1.5px solid #e2e8f0;
          border-radius: 12px;
          padding: 20px;
          margin-top: 18px;
          margin-bottom: 22px;
        }
        .editor-subhead {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 16px;
          padding-bottom: 10px;
          border-bottom: 1px solid #e2e8f0;
        }
        .editor-icon {
          color: #d97706;
        }
        .editor-subhead h4 {
          font-size: 1.05rem;
          font-weight: 800;
          color: #0f172a;
          margin: 0;
        }
        .editor-subhead small {
          font-size: 0.78rem;
          color: #64748b;
        }
        .editor-textarea {
          width: 100%;
          padding: 10px 14px;
          border: 1.5px solid #cbd5e1;
          border-radius: 8px;
          font-size: 0.88rem;
          font-family: inherit;
          line-height: 1.5;
          outline: none;
          resize: vertical;
        }
        .editor-textarea:focus {
          border-color: #854d0e;
        }

        /* Live Preview Card matching the user's screenshot */
        .footer-preview-wrapper {
          margin-top: 20px;
        }
        .preview-label {
          display: block;
          font-size: 0.8rem;
          font-weight: 700;
          color: #64748b;
          margin-bottom: 8px;
        }
        .footer-brand-live-preview {
          background: #1e130c;
          color: #d8c7bc;
          border-radius: 12px;
          padding: 24px 28px;
          max-width: 440px;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
        }
        .preview-logo-row {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 14px;
        }
        .preview-logo-icon {
          width: 36px;
          height: 36px;
          background: #d97706;
          color: #ffffff;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.1rem;
          font-weight: 900;
        }
        .preview-logo-text span {
          font-size: 1.3rem;
          font-weight: 800;
          color: #ffffff;
        }
        .preview-logo-text span strong {
          color: #f59e0b;
        }
        .preview-logo-text small {
          display: block;
          font-size: 0.65rem;
          letter-spacing: 1.5px;
          color: #cbd5e1;
          font-weight: 700;
        }
        .preview-desc-text {
          font-size: 0.88rem;
          line-height: 1.55;
          color: #d1d5db;
          margin-bottom: 18px;
        }
        .preview-social-icons-row {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .preview-social-btn {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.15);
          color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        @media (max-width: 640px) {
          .admin-top-header {
            padding: 0 12px;
            height: 56px;
          }
          .avatar-meta {
            display: none;
          }
          .admin-avatar-card {
            border-left: none;
            padding-left: 0;
          }
          .dashboard-content-area, .admin-subpage-card {
            padding: 12px 10px;
            margin: 6px 4px;
          }
          .dashboard-welcome-row {
            flex-direction: column;
            align-items: flex-start;
            gap: 10px;
          }
          .dashboard-welcome-row h2 {
            font-size: 1.25rem;
          }
          .add-quick-product-btn {
            width: 100%;
            justify-content: center;
          }
          .kpi-cards-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 10px !important;
          }
          .kpi-card.modern-card {
            border-radius: 18px !important;
            padding: 14px 12px !important;
            gap: 8px !important;
          }
          .kpi-card.modern-card .kpi-icon-wrap {
            width: 40px !important;
            height: 40px !important;
            border-radius: 12px !important;
            margin-bottom: 2px !important;
          }
          .kpi-content-wrap .kpi-label {
            font-size: 0.80rem !important;
          }
          .kpi-content-wrap .kpi-number {
            font-size: 1.25rem !important;
          }
          .kpi-content-wrap .kpi-subtext {
            font-size: 0.69rem !important;
          }
          .analytics-two-col-grid {
            grid-template-columns: 1fr;
            gap: 14px;
          }
          .chart-card {
            padding: 14px;
          }
          .donut-category-visual {
            flex-direction: column;
            gap: 14px;
            align-items: center;
            text-align: center;
          }
          .donut-legend-list {
            width: 100%;
          }
          .recent-data-tables-grid {
            grid-template-columns: 1fr;
            gap: 14px;
          }
          .data-table-card {
            padding: 14px 10px;
          }
          .admin-table-wrap {
            width: 100%;
            overflow-x: auto;
            -webkit-overflow-scrolling: touch;
          }
          .admin-table {
            min-width: 520px;
            font-size: 0.78rem;
          }
          .admin-table th, .admin-table td {
            padding: 8px 10px;
          }
          .dialog-card {
            width: 95vw !important;
            max-width: 95vw !important;
            max-height: 90vh;
            overflow-y: auto;
            padding: 14px;
          }
          .dialog-grid {
            grid-template-columns: 1fr;
            gap: 10px;
          }
          /* Settings Page Mobile Responsive Layout */
          .settings-section-panel {
            padding: 16px 12px !important;
            border-radius: 12px;
            margin-bottom: 16px;
          }
          .settings-section-head {
            flex-direction: row;
            align-items: flex-start;
            gap: 10px;
            margin-bottom: 14px;
            padding-bottom: 10px;
          }
          .settings-section-head h4 {
            font-size: 0.96rem;
            line-height: 1.25;
          }
          .settings-section-head small {
            font-size: 0.74rem;
            display: block;
            margin-top: 2px;
          }
          .settings-form-grid,
          .content-form-grid {
            grid-template-columns: 1fr !important;
            gap: 12px !important;
            margin-bottom: 12px;
          }
          .form-field-group {
            width: 100% !important;
          }
          .form-field-group input,
          .form-field-group select {
            width: 100% !important;
            box-sizing: border-box !important;
            font-size: 0.85rem !important;
            padding: 10px 12px !important;
          }
          .subpage-header-row {
            flex-direction: column !important;
            align-items: stretch !important;
            gap: 12px !important;
            margin-bottom: 16px !important;
          }
          .subpage-header-row h3 {
            font-size: 1.15rem !important;
          }
          .subpage-header-row p {
            font-size: 0.78rem !important;
          }
          .save-content-btn {
            width: 100% !important;
            justify-content: center !important;
            padding: 12px 16px !important;
            font-size: 0.88rem !important;
          }
          .password-change-box {
            padding: 12px !important;
          }
          .footer-brand-editor-box {
            padding: 14px 10px;
          }
          .footer-brand-live-preview {
            max-width: 100%;
            padding: 16px 12px;
          }
          .system-actions-grid {
            flex-direction: column;
            gap: 8px;
          }
          .system-action-btn {
            width: 100%;
            justify-content: center;
          }
          .subpage-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 10px;
          }
          .subpage-header-actions {
            width: 100%;
            flex-direction: column;
          }
          .subpage-header-actions button,
          .subpage-header-actions a {
            width: 100%;
            justify-content: center;
          }
          .filter-controls-row {
            flex-direction: column;
            align-items: stretch;
            gap: 8px;
          }
        }

        @media (max-width: 380px) {
          .admin-top-header {
            padding: 0 8px;
          }
          .sidebar-brand-title h3 {
            font-size: 1rem;
          }
          .kpi-cards-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 8px !important;
          }
          .kpi-card.modern-card {
            border-radius: 15px !important;
            padding: 12px 10px !important;
            gap: 6px !important;
          }
          .kpi-card.modern-card .kpi-icon-wrap {
            width: 36px !important;
            height: 36px !important;
            border-radius: 10px !important;
          }
          .kpi-content-wrap .kpi-label {
            font-size: 0.74rem !important;
          }
          .kpi-content-wrap .kpi-number {
            font-size: 1.12rem !important;
          }
          .kpi-content-wrap .kpi-subtext {
            font-size: 0.65rem !important;
          }
          .preview-logo-text span {
            font-size: 1.1rem;
          }
          .preview-desc-text {
            font-size: 0.8rem;
          }
        }
      `}</style>
    </div>
  );
}
