import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import WishlistDrawer from './components/WishlistDrawer';
import AdminModal from './components/AdminModal';
import TrackOrderModal from './components/TrackOrderModal';
import InvoiceModal from './components/InvoiceModal';
import MobileBottomNav from './components/MobileBottomNav';
import IntroLoader from './components/IntroLoader';
import AuthModal from './components/AuthModal';

import Home from './pages/Home';
import Furniture from './pages/Furniture';
import Electronics from './pages/Electronics';
import Appliances from './pages/Appliances';
import ProductDetails from './pages/ProductDetails';
import Offers from './pages/Offers';
import About from './pages/About';
import Contact from './pages/Contact';
import AdminPanel from './pages/AdminPanel';
import Billing from './pages/Billing';

import { AuthProvider, useAuth } from './context/AuthContext';
import { subscribeToStoreSettings, DEFAULT_STORE_CONFIG } from './services/settingsService';
import { 
  getProducts, 
  subscribeToProducts,
  createProduct, 
  updateProduct, 
  deleteProduct
} from './services/productService';
import { 
  createOrder, 
  updateOrderStatus, 
  editOrder, 
  deleteOrder, 
  subscribeToOrdersAdmin 
} from './services/orderService';
import { subscribeToPromoCodes } from './services/promoService';
import { subscribeToCategories } from './services/categoryService';

import { MessageCircle, ArrowUp } from 'lucide-react';


function AppContent() {
  const { currentUser, isAdmin } = useAuth();
  const [currentPage, setCurrentPage] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedPage = localStorage.getItem('sef_current_page');
      if (window.location.hash === '#admin' || savedPage === 'admin') {
        return 'admin';
      }
    }
    return 'home';
  });
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    const handleHash = () => {
      if (window.location.hash === '#admin') {
        setCurrentPage('admin');
        localStorage.setItem('sef_current_page', 'admin');
      } else if (currentPage === 'admin' && window.location.hash !== '#admin') {
        // If hash was removed externally
        const saved = localStorage.getItem('sef_current_page');
        if (saved !== 'admin') {
          setCurrentPage('home');
        }
      }
    };
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, [currentPage]);

  // Ensure URL hash and localStorage reflect admin view when active
  useEffect(() => {
    if (currentPage === 'admin') {
      localStorage.setItem('sef_current_page', 'admin');
      if (window.location.hash !== '#admin') {
        window.history.replaceState(null, '', '#admin');
      }
    } else {
      localStorage.removeItem('sef_current_page');
      if (window.location.hash === '#admin') {
        window.history.replaceState(null, '', window.location.pathname + window.location.search);
      }
    }
  }, [currentPage]);

  // Customer Auth Modal State
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState('login');

  const handleOpenAuth = (mode = 'login') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  // Intro Loading Animation: Furniture appears one by one, fades away, electronics appear one by one, then transitions to homepage
  const [showIntro, setShowIntro] = useState(() => {
    try {
      return !sessionStorage.getItem('hk_intro_shown');
    } catch {
      return true;
    }
  });

  // Dynamic Catalog State (Strictly loaded from Cloud Firestore database)
  const [catalogProducts, setCatalogProducts] = useState(() => {
    try {
      const saved = localStorage.getItem('sef_catalog_products');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [isProductsLoading, setIsProductsLoading] = useState(true);

  // Real-time listener for products from Cloud Firestore database
  useEffect(() => {
    const unsubscribe = subscribeToProducts((liveProducts) => {
      setCatalogProducts(liveProducts || []);
      setIsProductsLoading(false);
      try {
        localStorage.setItem('sef_catalog_products', JSON.stringify(liveProducts || []));
      } catch (e) {}
    });
    return () => unsubscribe();
  }, []);

  // Real-time listener for orders in Firestore
  useEffect(() => {
    const unsubscribe = subscribeToOrdersAdmin((liveOrders) => {
      setOrders(liveOrders || []);
    });
    return () => unsubscribe();
  }, []);

  // Store Settings (Legal, Tax, Payment Mode toggles)
  const [storeSettings, setStoreSettings] = useState(DEFAULT_STORE_CONFIG);

  useEffect(() => {
    const unsub = subscribeToStoreSettings((liveSettings) => {
      if (liveSettings) setStoreSettings(liveSettings);
    });
    return () => unsub();
  }, []);

  // Real-time listener for promo codes from Cloud Firestore
  const [promoCodes, setPromoCodes] = useState([]);
  useEffect(() => {
    const unsub = subscribeToPromoCodes((livePromos) => {
      setPromoCodes(livePromos || []);
    });
    return () => unsub();
  }, []);

  // Real-time listener for categories from Cloud Firestore database
  const [categories, setCategories] = useState(() => {
    try {
      const saved = localStorage.getItem('sef_categories');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    const unsub = subscribeToCategories((liveCats) => {
      if (liveCats && liveCats.length > 0) {
        setCategories(liveCats);
        try {
          localStorage.setItem('sef_categories', JSON.stringify(liveCats));
        } catch (e) {}
      }
    });
    return () => unsub();
  }, []);

  // Orders & Billing State (synced with Firestore)
  const [orders, setOrders] = useState(() => {
    try {
      const saved = localStorage.getItem('hk_orders');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Cart & Wishlist state
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('hk_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [wishlist, setWishlist] = useState(() => {
    try {
      const saved = localStorage.getItem('hk_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Drawers & Modals
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isTrackOrderOpen, setIsTrackOrderOpen] = useState(false);
  const [trackOrderId, setTrackOrderId] = useState('');
  const [activeInvoiceOrder, setActiveInvoiceOrder] = useState(null);

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedSubcategory, setSelectedSubcategory] = useState('all');

  // Toast notifications
  const [toast, setToast] = useState(null);

  // Scroll to top button visibility
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem('hk_cart', JSON.stringify(cart));
    } catch {}
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem('hk_wishlist', JSON.stringify(wishlist));
    } catch {}
  }, [wishlist]);

  useEffect(() => {
    try {
      localStorage.setItem('hk_catalog_products', JSON.stringify(catalogProducts));
    } catch {}
  }, [catalogProducts]);

  useEffect(() => {
    try {
      localStorage.setItem('hk_orders', JSON.stringify(orders));
    } catch {}
  }, [orders]);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Keyboard shortcut: Ctrl + Shift + A to open Admin Panel
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        setCurrentPage((prev) => (prev === 'admin' ? 'home' : 'admin'));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => {
      setToast(null);
    }, 3200);
  };

  // Cart actions
  const handleAddToCart = (product, qty = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + qty } : item
        );
      }
      return [...prev, { ...product, quantity: qty }];
    });
    showToast(`Added "${product.name}" to cart`);
  };

  const handleUpdateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      handleRemoveFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.id === productId ? { ...item, quantity } : item))
    );
  };

  const handleRemoveFromCart = (productId) => {
    setCart((prev) => prev.filter((item) => item.id !== productId));
  };

  const handleClearCart = () => {
    setCart([]);
  };

  // Wishlist actions
  const handleToggleWishlist = (product) => {
    const exists = wishlist.some((item) => item.id === product.id);
    if (exists) {
      setWishlist((prev) => prev.filter((item) => item.id !== product.id));
      showToast(`Removed "${product.name}" from wishlist`);
    } else {
      setWishlist((prev) => [...prev, product]);
      showToast(`Saved "${product.name}" to wishlist ❤️`);
    }
  };

  const handleRemoveWishlist = (productId) => {
    setWishlist((prev) => prev.filter((item) => item.id !== productId));
  };

  // Navigation & Product selection
  const handleSelectProduct = (product) => {
    setSelectedProduct(product);
    setCurrentPage('product-details');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigate = (page, subcat = 'all') => {
    setCurrentPage(page);
    setSelectedSubcategory(subcat);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Order Handlers (Billing & Tracking with Firestore persistence)
  const handlePlaceOrder = async (newOrder) => {
    setOrders((prev) => [newOrder, ...prev]);
    showToast(`Order #${newOrder.id} placed successfully!`);
    try {
      await createOrder(newOrder, currentUser?.uid || 'guest');
    } catch (err) {
      console.warn('Could not persist order to Firestore:', err);
    }
  };

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    );
    showToast(`Updated Order #${orderId} status to "${newStatus}"`);
    try {
      await updateOrderStatus(orderId, newStatus);
    } catch (err) {
      console.warn('Could not update order status in Firestore:', err);
    }
  };

  const handleEditOrder = async (orderId, updatedOrder) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, ...updatedOrder } : o))
    );
    showToast(`Order #${orderId} details updated`);
    try {
      await editOrder(orderId, updatedOrder);
    } catch (err) {
      console.warn('Could not edit order details in Firestore:', err);
    }
  };

  const handleDeleteOrder = async (orderId) => {
    setOrders((prev) => prev.filter((o) => o.id !== orderId));
    showToast(`Order #${orderId} deleted from records`);
    try {
      await deleteOrder(orderId);
    } catch (err) {
      console.warn('Could not delete order in Firestore:', err);
    }
  };

  // Catalog Handlers (Admin Edit & Remove with Firestore persistence)
  const handleAddProductAdmin = async (newProduct) => {
    showToast(`Publishing "${newProduct.name}" to Firebase...`);
    try {
      const saved = await createProduct(newProduct);
      showToast(`Product "${newProduct.name}" saved to Firestore database!`);
    } catch (err) {
      console.error('Could not save product to Firestore:', err);
      showToast(`Failed to save: ${err.message}`);
    }
  };

  const handleEditProductAdmin = async (productId, updatedProduct) => {
    setCatalogProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, ...updatedProduct } : p))
    );
    showToast(`Updated "${updatedProduct.name}"`);
    try {
      await updateProduct(productId, updatedProduct);
    } catch (err) {
      console.warn('Could not update product in Firestore:', err);
    }
  };

  const handleDeleteProductAdmin = async (productId) => {
    setCatalogProducts((prev) => prev.filter((p) => p.id !== productId));
    showToast(`Product removed from catalog`);
    try {
      await deleteProduct(productId);
    } catch (err) {
      console.warn('Could not delete product from Firestore:', err);
    }
  };

  // Track Order & Invoice openers
  const handleOpenTrackOrder = (orderId = '') => {
    setTrackOrderId(orderId);
    setIsTrackOrderOpen(true);
  };

  const handleViewInvoice = (order) => {
    setActiveInvoiceOrder(order);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenAdminPanel = () => {
    setCurrentPage('admin');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Dedicated Executive Admin Panel View (Matches Mockup)
  if (currentPage === 'admin') {
    return (
      <>
        <AdminPanel
          products={catalogProducts}
          categories={categories}
          orders={orders}
          promoCodes={promoCodes}
          onAddProduct={handleAddProductAdmin}
          onEditProduct={handleEditProductAdmin}
          onDeleteProduct={handleDeleteProductAdmin}
          onUpdateOrderStatus={handleUpdateOrderStatus}
          onEditOrder={handleEditOrder}
          onDeleteOrder={handleDeleteOrder}
          onViewInvoice={handleViewInvoice}
          onPlaceOrder={handlePlaceOrder}
          storeSettings={storeSettings}
          onBackToStore={() => {
            localStorage.removeItem('sef_current_page');
            setCurrentPage('home');
            window.location.hash = '';
          }}
          onLogoutAdmin={() => {
            localStorage.removeItem('sef_current_page');
            setCurrentPage('home');
            window.location.hash = '';
          }}
        />

        {/* Printable Tax Invoice Modal */}
        <InvoiceModal
          isOpen={!!activeInvoiceOrder}
          onClose={() => setActiveInvoiceOrder(null)}
          order={activeInvoiceOrder}
        />
      </>
    );
  }

  return (
    <div className="app-root">
      {/* Cinematic Intro Loading Animation */}
      {showIntro && (
        <IntroLoader 
          onComplete={() => {
            try {
              sessionStorage.setItem('hk_intro_shown', 'true');
            } catch {}
            setShowIntro(false);
          }} 
        />
      )}

      {/* Navbar */}
      <Navbar
        currentPage={currentPage}
        setCurrentPage={handleNavigate}
        cartCount={cart.reduce((acc, i) => acc + i.quantity, 0)}
        wishlistCount={wishlist.length}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenWishlist={() => setIsWishlistOpen(true)}
        onOpenAuth={handleOpenAuth}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedCategory={selectedCategory}
        setSelectedCategory={(cat) => {
          setSelectedCategory(cat);
          if (cat !== 'all') handleNavigate(cat);
        }}
        onSearch={(query) => {
          setSearchQuery(query);
          if (currentPage !== 'furniture' && currentPage !== 'electronics' && currentPage !== 'appliances') {
            handleNavigate('furniture');
          }
        }}
        onOpenAdmin={handleOpenAdminPanel}
        onOpenTrackOrder={handleOpenTrackOrder}
        onNavigateSubcategory={handleNavigate}
      />

      {/* Main Pages Router */}
      <main className="main-content-wrapper">
        {currentPage === 'home' && (
          <Home
            onNavigate={handleNavigate}
            onSelectProduct={handleSelectProduct}
            onAddToCart={handleAddToCart}
            wishlist={wishlist}
            onToggleWishlist={handleToggleWishlist}
            cart={cart}
            onUpdateQuantity={handleUpdateQuantity}
            products={catalogProducts}
            categories={categories}
          />
        )}

        {currentPage === 'furniture' && (
          <Furniture
            onSelectProduct={handleSelectProduct}
            onAddToCart={handleAddToCart}
            wishlist={wishlist}
            onToggleWishlist={handleToggleWishlist}
            cart={cart}
            onUpdateQuantity={handleUpdateQuantity}
            searchQuery={searchQuery}
            selectedSubcategory={selectedSubcategory}
            setSelectedSubcategory={setSelectedSubcategory}
            products={catalogProducts}
          />
        )}

        {currentPage === 'electronics' && (
          <Electronics
            onSelectProduct={handleSelectProduct}
            onAddToCart={handleAddToCart}
            wishlist={wishlist}
            onToggleWishlist={handleToggleWishlist}
            cart={cart}
            onUpdateQuantity={handleUpdateQuantity}
            searchQuery={searchQuery}
            selectedSubcategory={selectedSubcategory}
            setSelectedSubcategory={setSelectedSubcategory}
            products={catalogProducts}
          />
        )}

        {currentPage === 'appliances' && (
          <Appliances
            onSelectProduct={handleSelectProduct}
            onAddToCart={handleAddToCart}
            wishlist={wishlist}
            onToggleWishlist={handleToggleWishlist}
            cart={cart}
            onUpdateQuantity={handleUpdateQuantity}
            searchQuery={searchQuery}
            selectedSubcategory={selectedSubcategory}
            setSelectedSubcategory={setSelectedSubcategory}
            products={catalogProducts}
          />
        )}

        {currentPage === 'product-details' && (
          <ProductDetails
            product={selectedProduct}
            onBack={() => handleNavigate(selectedProduct?.category || 'home')}
            onAddToCart={handleAddToCart}
            onSelectProduct={handleSelectProduct}
            isWishlisted={wishlist.some((item) => item.id === selectedProduct?.id)}
            onToggleWishlist={handleToggleWishlist}
            cartItem={cart.find((item) => item.id === selectedProduct?.id)}
            onUpdateQuantity={handleUpdateQuantity}
            onRemoveFromCart={handleRemoveFromCart}
            onOpenCart={() => setIsCartOpen(true)}
          />
        )}

        {currentPage === 'offers' && (
          <Offers
            onSelectProduct={handleSelectProduct}
            onAddToCart={handleAddToCart}
            wishlist={wishlist}
            onToggleWishlist={handleToggleWishlist}
            cart={cart}
            onUpdateQuantity={handleUpdateQuantity}
            products={catalogProducts}
            promoCodes={promoCodes}
          />
        )}

        {currentPage === 'about' && (
          <About onNavigate={handleNavigate} />
        )}

        {currentPage === 'contact' && (
          <Contact />
        )}
      </main>

      {/* Footer */}
      <Footer 
        onNavigate={handleNavigate} 
        onOpenAdmin={handleOpenAdminPanel}
        onOpenTrackOrder={handleOpenTrackOrder}
        storeSettings={storeSettings}
      />

      {/* Cart & Billing Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cart}
        products={catalogProducts}
        promoCodes={promoCodes}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveFromCart}
        onClearCart={handleClearCart}
        onPlaceOrder={handlePlaceOrder}
        onOpenTrackOrder={handleOpenTrackOrder}
        onViewInvoice={handleViewInvoice}
        onNavigate={handleNavigate}
      />

      {/* Wishlist Drawer */}
      <WishlistDrawer
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        wishlist={wishlist}
        onRemoveWishlist={handleRemoveWishlist}
        onAddToCart={handleAddToCart}
        onSelectProduct={handleSelectProduct}
      />

      {/* Admin Operations & CMS Modal (Edit & Remove Orders + Catalog) */}
      <AdminModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        products={catalogProducts}
        orders={orders}
        onAddProduct={handleAddProductAdmin}
        onEditProduct={handleEditProductAdmin}
        onDeleteProduct={handleDeleteProductAdmin}
        onUpdateOrderStatus={handleUpdateOrderStatus}
        onEditOrder={handleEditOrder}
        onDeleteOrder={handleDeleteOrder}
        onViewInvoice={handleViewInvoice}
      />

      {/* Customer Live Order Tracking Modal */}
      <TrackOrderModal
        isOpen={isTrackOrderOpen}
        onClose={() => setIsTrackOrderOpen(false)}
        orders={orders}
        products={catalogProducts}
        initialOrderId={trackOrderId}
        onViewInvoice={handleViewInvoice}
      />

      {/* Professional Tax Invoice Sheet Modal */}
      <InvoiceModal
        isOpen={!!activeInvoiceOrder}
        onClose={() => setActiveInvoiceOrder(null)}
        order={activeInvoiceOrder}
      />

      {/* Customer Authentication Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialMode={authModalMode}
        onSuccess={(mode) => {
          showToast(mode === 'register' ? 'Account created! Welcome to Sardar Mart Furniture and Home Appliances.' : 'Signed in successfully!');
        }}
      />

      {/* Mobile Sticky Bottom Navigation */}
      <MobileBottomNav
        currentPage={currentPage}
        onNavigate={handleNavigate}
        cartCount={cart.reduce((acc, i) => acc + i.quantity, 0)}
        wishlistCount={wishlist.length}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenWishlist={() => setIsWishlistOpen(true)}
        onOpenCategories={() => handleNavigate('furniture')}
      />

      {/* Floating WhatsApp Quick Action Button */}
      <a
        href="https://wa.me/916383056338?text=Hi%20Sardar%20Mart%20Furniture%20and%20Home%20Appliances%2C%20I%20am%20browsing%20your%20website%20and%20would%20like%20to%20enquire%20about%20your%20products"
        target="_blank"
        rel="noreferrer"
        className="floating-wa-btn pulse-glow"
        title="Chat on WhatsApp"
        aria-label="WhatsApp Showroom Help"
      >
        <MessageCircle size={28} />
        <span className="wa-bubble-label">Chat with Us</span>
      </a>

      {/* Scroll to top */}
      {showScrollTop && (
        <button
          className="scroll-to-top-btn animate-fade-in"
          onClick={scrollToTop}
          title="Back to Top"
          aria-label="Scroll to top"
        >
          <ArrowUp size={20} />
        </button>
      )}

      {/* Toast Notification Container */}
      {toast && (
        <div className="toast-container">
          <div className="toast-msg">
            <span>{toast}</span>
          </div>
        </div>
      )}

      <style>{`
        .app-root {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          background: var(--color-warm-cream);
        }
        .main-content-wrapper {
          flex: 1;
        }

        /* Floating WhatsApp Button */
        .floating-wa-btn {
          position: fixed;
          bottom: 28px;
          right: 28px;
          background: var(--color-whatsapp);
          color: #ffffff;
          padding: 12px 18px 12px 14px;
          border-radius: var(--radius-full);
          display: flex;
          align-items: center;
          gap: 8px;
          box-shadow: 0 6px 20px rgba(37, 211, 102, 0.45);
          z-index: 850;
          transition: all var(--transition-fast);
          font-weight: 700;
          font-size: 0.92rem;
        }
        .floating-wa-btn:hover {
          background: var(--color-whatsapp-hover);
          transform: translateY(-3px) scale(1.03);
          box-shadow: 0 10px 25px rgba(37, 211, 102, 0.6);
        }
        .wa-bubble-label {
          letter-spacing: 0.2px;
        }

        /* Scroll to Top */
        .scroll-to-top-btn {
          position: fixed;
          bottom: 28px;
          left: 28px;
          width: 44px;
          height: 44px;
          background: var(--color-warm-dark);
          color: #ffffff;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: var(--shadow-md);
          z-index: 850;
          transition: all var(--transition-fast);
        }
        .scroll-to-top-btn:hover {
          background: var(--color-primary);
          transform: translateY(-3px);
        }

        @media (max-width: 600px) {
          .floating-wa-btn {
            bottom: 20px;
            right: 20px;
            padding: 12px;
            border-radius: 50%;
            width: 52px;
            height: 52px;
            justify-content: center;
          }
          .wa-bubble-label {
            display: none;
          }
          .scroll-to-top-btn {
            bottom: 20px;
            left: 20px;
          }
        }
      `}</style>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
