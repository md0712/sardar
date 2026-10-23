# Sardar Mart Furniture and Home Appliances — Premium E-Commerce Web Application

A modern, responsive, and aesthetic web platform for **Sardar Mart Furniture and Home Appliances**, modeled after luxury showroom retail and modern Indian e-commerce standards. Built with **React**, **Vite**, **Vanilla CSS Design Tokens**, and **Lucide Icons**.

---

## 🌟 Key Features

1. **Responsive Multi-Page Architecture**:
   - **Home**: Split hero showcase (furniture & electronics), 4-point value proposition strip, shop by category circular navigation, duo promotional banners, tabbed featured products, trio festive campaign deals, verified customer testimonials, and Chennai flagship showroom locator.
   - **Furniture**: Comprehensive catalog with subcategory filters (Sofas, Beds, Dining Sets, Wardrobes, Chairs), price range slider, and multi-criteria sorting.
   - **Electronics**: Smart 4K TVs, Inverter Refrigerators, AI Steam Washing Machines, and Inverter ACs with brand warranty specifications.
   - **Home Appliances**: Heavy-duty mixer grinders, digital touch air fryers, convection microwave ovens, and copper mineral water purifiers.
   - **Product Details**: Multi-photo gallery thumbnail switcher, technical specifications table, real-time postal pincode delivery estimator, WhatsApp instant inquiry generator, and related recommendations.
   - **Offers & Deals**: Festival sales (up to 50% OFF), combo bundles (living room & kitchen packages with up to ₹25,000 savings), interactive **0% No-Cost EMI Calculator**, and one-click coupon code copying (`FESTIVE50`, `COMBOBEST`, `HOME5`).
   - **About Us**: 15+ years brand story, craftsmanship standards, customer satisfaction statistics, core values, and authorized tier-1 brand partners (Samsung, LG, Sony, Bosch, etc.).
   - **Contact Us**: Working interactive enquiry form with instant ticket confirmation, 3 showroom branch selector (Thousand Lights, OMR Tech corridor, Coimbatore), and responsive **Google Maps** integration.

2. **WhatsApp Direct Inquiry System**:
   - Every product card and product detail page includes a dedicated **WhatsApp Enquiry** button.
   - Automatically pre-formats an inquiry message with the product name, SKU, and price, directly connecting buyers with the showroom sales team.

3. **Interactive Cart & Wishlist Drawers**:
   - Slide-in side drawer with live quantity adjustments (+ / -) and item removals.
   - Dynamic coupon code discount calculation with error feedback.
   - Dual checkout paths: **Checkout via WhatsApp** (exports full itemized invoice directly to chat) or **Pay Online / Card / EMI**.
   - Full wishlist persistence using browser `localStorage`.

4. **Product Updates via Admin CMS Modal**:
   - Built-in live catalog manager allowing showroom staff to add new products with custom images, prices, discounts, and category tags without code modification.

---

## 📁 Project Directory Structure

```
furniture-electronics/
├── public/
│   ├── images/
│   ├── logos/
│   │   ├── logo.png
│   │   └── sardar-logo.png
│   └── banners/
├── src/
│   ├── components/
│   │   ├── Navbar.jsx
│   │   ├── Footer.jsx
│   │   ├── ProductCard.jsx
│   │   ├── CategoryCard.jsx
│   │   ├── OfferBanner.jsx
│   │   ├── CartDrawer.jsx
│   │   ├── WishlistDrawer.jsx
│   │   └── AdminModal.jsx
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── Furniture.jsx
│   │   ├── Electronics.jsx
│   │   ├── Appliances.jsx
│   │   ├── ProductDetails.jsx
│   │   ├── Offers.jsx
│   │   ├── About.jsx
│   │   └── Contact.jsx
│   ├── data/
│   │   └── products.js
│   ├── assets/
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher recommended)
- npm or yarn

### Installation
1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the local development server:
   ```bash
   npm run dev
   ```

3. Build for production:
   ```bash
   npm run build
   ```

4. Preview production build:
   ```bash
   npm run preview
   ```

---

## 🎨 Design System & Aesthetics
- **Color Palette**: Warm espresso (`#2a1810`), terracotta amber (`#a24e23`), warm sand (`#faf7f2`), and WhatsApp green (`#25d366`).
- **Typography**: `Outfit` for bold modern headlines and `Plus Jakarta Sans` for clean, legible body text.
- **Accessibility**: High-contrast labels, semantic HTML5 elements, and touch-friendly interactive targets.
