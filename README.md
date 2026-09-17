# 🎓 UNIMANDI — Campus Rental & Resale Marketplace

> A high-trust, peer-to-peer campus marketplace designed for university students to rent, sell, and discover academic resources (textbooks, lab kits, calculators, electronics, hostel gear, PG rooms, and cycles) directly from peers and seniors with zero commission and verified security.

---

## 📂 Project Architecture & Directory Structure

```text
d:/RENTIFY/
├── 📄 README.md                 # Project Overview & Architecture Guide
├── 📄 Rentify_PRD.pdf           # Product Requirements Document
├── 📄 Rentify_TechSpec.pdf      # Technical Architecture & API Specifications
│
├── 📁 client/                   # 🖥️ FRONTEND (React 18 + Vite + Tailwind CSS)
│   ├── 📄 package.json          # Frontend Dependencies & Scripts (lucide-react, vite, tailwind)
│   ├── 📄 vite.config.js        # Vite Config & Dev Server Proxy (port 3000 -> 5000)
│   ├── 📄 tailwind.config.js    # Design System Tokens (#121417, #FF5A1F, #10B981)
│   ├── 📄 index.html            # HTML Shell with Google Fonts (Outfit & Plus Jakarta Sans)
│   └── 📁 src/
│       ├── 📄 main.jsx          # React Bootstrap with Context Providers
│       ├── 📄 App.jsx           # Main View Switcher & Modal Container
│       ├── 📄 index.css         # Global Styles, Micro-Animations & Scrollbars
│       │
│       ├── 📁 context/          # 🧠 State Management (React Context)
│       │   ├── AuthContext.jsx       # Student Login, Roll No & Email Verification
│       │   ├── ListingsContext.jsx   # Feed Items, PG Gender Filters, Wishlist & Search
│       │   ├── ChatContext.jsx       # 1-on-1 In-Chat Negotiation & Deal Locking
│       │   └── StoreContext.jsx      # Tanish SAC Store Products & Digital QR Passes
│       │
│       ├── 📁 data/
│       │   └── seedListings.js       # Seed Data for Listings, Categories & PG Filters
│       │
│       └── 📁 components/       # 🧩 Reusable UI Components
│           ├── 📁 layout/            # Navbar, MobileBottomNav, Footer
│           ├── 📁 feed/              # HeroBanner, LiveActivityTicker, CategoryBar, SearchFilterBar, ListingCard, InFeedSellBanner
│           ├── 📁 chat/              # ChatDrawer, MessageThread, OfferModal
│           ├── 📁 store/             # TanishStoreView, TanishMerchantDashboard, PickupPassModal
│           ├── 📁 item/              # ItemDetailModal, SellerCard
│           ├── 📁 post/              # PostItemModal (with PG Gender Selector)
│           ├── 📁 profile/           # ProfileView, MyListingsTabs, RatingModal
│           ├── 📁 safety/            # ReportBlockModal
│           ├── 📁 auth/              # LoginScreen, CompleteProfileScreen
│           └── 📁 common/            # Badge, EmptyState, Modal
│
└── 📁 server/                   # ⚙️ BACKEND (Node.js + Express.js API)
    ├── 📄 package.json          # Backend Dependencies & Scripts (express, cors, dotenv)
    ├── 📄 server.js             # Express App Entrypoint & Route Mounting (port 5000)
    │
    ├── 📁 data/
    │   └── store.js             # In-Memory Campus Database (Users, Items, Deals, Orders)
    │
    ├── 📁 routes/               # 🛣️ REST API Endpoints
    │   ├── authRoutes.js        # /api/auth (Login, Verification, Profile Setup)
    │   ├── listingRoutes.js     # /api/listings (CRUD Listings, PG Gender Filter, Branch Match)
    │   ├── chatRoutes.js        # /api/chat (Threads, In-Chat Offers & Messages)
    │   ├── dealRoutes.js        # /api/deals (Two-Sided Deal Confirmation & Status)
    │   ├── ratingRoutes.js      # /api/ratings (Peer Reviews & Trust Scores)
    │   ├── safetyRoutes.js      # /api/safety (Report Listing & Block User)
    │   └── userRoutes.js        # /api/users (User Profiles & My Listings)
    │
    └── 📁 controllers/          # 🎮 Business Logic & Request Handlers
        ├── authController.js    # Auth & Verification Logic
        ├── listingController.js # Listings Ranking & Search Filtering
        ├── chatController.js    # Chat & Offer Negotiation Handshake
        ├── dealController.js    # Two-Sided Deal Locking Handlers
        ├── ratingController.js  # Ratings & Trust Score Computation
        ├── safetyController.js  # Campus Moderation & Safety Handlers
        └── userController.js    # User Profile Handlers
```

---

## 🎨 Minimalist Swiss Monochrome & Electric Orange Design System

- **Background Canvas**: `#F8F9FA` Clean High-Contrast Surface
- **Primary Charcoal**: `#121417` Deep Swiss Charcoal Black
- **Electric Orange Accent**: `#FF5A1F` High-Energy Primary CTAs & Highlights
- **Success / Verified**: `#10B981` Emerald Green Verified Student Badges
- **Typography**: 
  - **Headlines & Display**: `Outfit` (Sharp Swiss geometry)
  - **Body & Controls**: `Plus Jakarta Sans` (Crisp modern legibility)

---

## 🌟 Key Features & Integrations

### 1. 🏠 PG & Hostel Gender Restriction Filter (Girls Only / Boys Only)
- 1-click quick filter buttons for **🌸 Girls Only**, **🔷 Boys Only**, and **👥 Co-ed / Any**.
- Distinct visual badges on listing cards and item detail specifications.

### 2. ❤️ 1-Click Wishlist / Favorite Heart Toggle
- Save any item with 1 tap on the floating heart icon on listing cards.
- View and manage bookmarked items in the dedicated **Saved Wishlist** tab.

### 3. 🤝 In-Chat "Make an Offer" Negotiation Engine
- Buyers can propose price offers directly inside chat (*"Make an Offer: ₹1,500"*).
- Sellers can **Accept**, **Counter-Offer**, or **Decline** with 1 tap.
- Accepted offers automatically update the deal value and transition to **Two-Sided Deal Confirmation**!

### 4. 🏪 Official Tanish Stationery Store & Digital QR Pass
- Order drafting tools, lab manuals, and exam supplies online with instant QR counter pickup.

### 5. 🏢 Hyperlocal Campus Location Cluster Selector
- Filter items instantly by:
  - `📍 All Campus Areas`
  - `🏢 Boys Hostels (Blocks 1-4)`
  - `🏢 Girls Hostels (Blocks A-B)`
  - `🎓 Academic Depts & Central Library`
  - `🚪 Off-Campus PGs (Gate 1 & 2)`

---

## 🚀 Local Run Guide

1. **Start Backend Server**:
   ```bash
   cd server
   npm start
   ```
   *(Running on `http://localhost:5000`)*

2. **Start Web Frontend**:
   ```bash
   cd client
   npm run dev
   ```
   *(Running on `http://localhost:3000`)*
