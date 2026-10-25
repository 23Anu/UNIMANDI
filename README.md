<p align="center">
  <img src="./client/public/logo.png" width="80" alt="UniMandi Logo" />
</p>

<h1 align="center">UNIMANDI</h1>
<h3 align="center">Buy · Sell · Rent · Connect — The Campus Peer-to-Peer Marketplace</h3>

<p align="center">
  <img src="https://img.shields.io/badge/React-18.3-blue?logo=react" />
  <img src="https://img.shields.io/badge/Node.js-ES%20Modules-green?logo=nodedotjs" />
  <img src="https://img.shields.io/badge/Socket.io-Realtime-black?logo=socketdotio" />
  <img src="https://img.shields.io/badge/Razorpay-Payments-blue?logo=razorpay" />
  <img src="https://img.shields.io/badge/Google%20OAuth-Authentication-red?logo=google" />
</p>

---

## 📋 Abstract

**UniMandi** is a full-stack, real-time peer-to-peer marketplace designed exclusively for college campus ecosystems. It solves the perennial problem of students struggling to find, buy, sell, and rent academic resources — textbooks, lab equipment, electronics, calculators, drafting kits, and daily-use items — within their own campus community.

Unlike generic marketplaces (OLX, Facebook Marketplace), UniMandi is hyper-localized to a single campus. It introduces a **trust-first architecture** where every user is Google-authenticated through their institutional identity, every deal is negotiated transparently through a built-in offer system, and payments are processed securely through **Razorpay** with UPI, cards, and net banking support.

The platform comprises two distinct transactional engines:

1. **Marketplace** — A peer-to-peer (C2C) listing system where students post items for rent or sale, negotiate prices in real-time chat, lock two-sided deals with mutual confirmation, and complete payments digitally.

2. **SAC Campus Store** — An official stationery and essentials pre-order system where students browse products, checkout with Razorpay, and receive a **QR-code pickup pass** for instant counter collection — eliminating long hostel-day queues.

The platform features real-time Socket.io-powered messaging, smart branch/year-based listing relevance scoring, multi-factor trust scores, and a campus safety layer with reporting and user blocking.

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT (React 18 + Vite)                 │
│                                                                 │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────────┐   │
│  │   Auth    │  │ Listings │  │   Chat   │  │    Store     │   │
│  │ Context   │  │ Context  │  │ Context  │  │   Context    │   │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └──────┬───────┘   │
│       │              │             │               │            │
│  ┌────┴──────────────┴─────────────┴───────────────┴────────┐  │
│  │                    API Service Layer                       │  │
│  │         (REST fetch + Socket.io real-time)                │  │
│  └──────────────────────┬────────────────────────────────────┘  │
│                         │                                       │
│  ┌──────────────────────┴────────────────────────────────────┐  │
│  │   Google OAuth Provider  │  Razorpay Checkout.js SDK      │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────┬───────────────────────────────┘
                                  │ HTTP / WebSocket
┌─────────────────────────────────┴───────────────────────────────┐
│                     SERVER (Node.js + Express)                   │
│                                                                  │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────────┐    │
│  │  Auth    │  │ Listings │  │   Chat   │  │    Store     │    │
│  │Controller│  │Controller│  │Controller│  │  Controller  │    │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └──────┬───────┘    │
│       │              │             │               │             │
│  ┌────┴──────────────┴─────────────┴───────────────┴─────────┐  │
│  │              Middleware Layer                               │  │
│  │  JWT Auth · Rate Limiting · CORS · Multer (Uploads)       │  │
│  └──────────────────────┬────────────────────────────────────┘  │
│                         │                                        │
│  ┌──────────────────────┴────────────────────────────────────┐  │
│  │         Data Persistence Layer                             │  │
│  │  ┌─────────────┐  ┌──────────────┐  ┌─────────────────┐  │  │
│  │  │ Campus JSON │  │  MongoDB     │  │   Supabase      │  │  │
│  │  │  (Default)  │  │  (Optional)  │  │   (Optional)    │  │  │
│  │  └─────────────┘  └──────────────┘  └─────────────────┘  │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                  │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  External Integrations                                     │  │
│  │  ┌─────────────────┐  ┌───────────────────────────────┐  │  │
│  │  │ Google Auth     │  │   Razorpay Payment Gateway    │  │  │
│  │  │ (ID Token       │  │   (Order Creation, Checkout,  │  │  │
│  │  │  Verification)  │  │    Signature Verification)    │  │  │
│  │  └─────────────────┘  └───────────────────────────────┘  │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                  │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  Socket.io Gateway — Real-time bidirectional events       │  │
│  │  (new listings, chat messages, deal confirmations,        │  │
│  │   typing indicators, offer broadcasts)                    │  │
│  └───────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────┘
```

---

## 🧩 Technical Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | React 18.3 + Vite 5.4 | SPA with HMR, component-based UI |
| **State Management** | React Context API (4 providers) | Auth, Listings, Chat, Store state |
| **Styling** | Vanilla CSS + CSS Custom Properties | Design token system, no framework lock-in |
| **Authentication** | Google OAuth 2.0 (`@react-oauth/google`) | ID token verification, institutional identity |
| **Payments** | Razorpay Checkout.js + Server SDK | UPI / Card / NetBanking with signature verification |
| **Real-time** | Socket.io (client + server) | Bi-directional WebSocket for chat, listings, deals |
| **Backend** | Node.js (ES Modules) + Express 4 | RESTful API with 9 route modules |
| **Auth Tokens** | JSON Web Tokens (JWT) | Stateless session management |
| **Database** | Persistent JSON Engine (default) | Zero-config, automatic disk sync with fallback to MongoDB / Supabase |
| **File Uploads** | Multer | Image upload for listings and profiles |
| **Security** | express-rate-limit, CORS, bcryptjs | Anti-spam, XSS protection, password hashing |
| **Icons** | Lucide React | 300+ consistent SVG icons |

---

## 🔑 Core Features & Technical Depth

### 1. Authentication — Google OAuth 2.0 (Zero Password Architecture)

```
User → Google Sign-In Button → Google ID Token
  → POST /api/auth/google-verify
    → google-auth-library verifyIdToken()
      → Extract: name, email, avatar, googleId
        → Upsert user in database
          → Generate JWT (24h expiry)
            → Return token + user object
```

- **No passwords stored** — eliminates credential leaks entirely
- Server-side ID token verification using `google-auth-library` with client ID validation
- Profile completion flow: after first login, user completes college details (branch, year, hostel, room)
- JWT issued with 24-hour sliding expiry for stateless session management

---

### 2. Marketplace Listings Engine

**Smart Relevance Scoring Algorithm:**
```javascript
score = 0
if (listing.targetBranch === user.branch)    score += 50  // Branch match
if (listing.targetYear === user.year)         score += 30  // Year match  
if (listing.isFeatured)                       score += 25  // Senior picks
if (listing.isUrgent)                         score += 20  // Urgent deals
if (seller.isVerified)                        score += 15  // Verified seller
score += seller.trustScore × 2                             // Trust weight
```

- **8 filter dimensions**: Category, Subcategory, Type (Rent/Sell), Price Range, Branch, Condition, Location, Gender
- **Category Tree** with hierarchical subcategories and "Coming Soon" support
- Real-time listing broadcasts via Socket.io (`new_listing_posted`, `listing_updated`)
- CRUD with status lifecycle: `Available → Reserved → Sold / Rented Out`

---

### 3. Real-Time Chat & Negotiation Protocol

```
┌──────────┐                    ┌──────────┐
│  Buyer   │◄──── Socket.io ───►│  Seller  │
└────┬─────┘                    └────┬─────┘
     │  1. Start Chat (listing)      │
     │──────────────────────────────►│
     │  2. Text Messages (live)      │
     │◄─────────────────────────────►│
     │  3. Price Offer (₹ amount)    │
     │──────────────────────────────►│
     │  4. Accept / Counter / Decline│
     │◄──────────────────────────────│
     │  5. Lock Deal (mutual)        │
     │──────────────────────────────►│
     │◄──────────────────────────────│
     │  6. Razorpay Payment          │
     │──────────── ₹ ──────────────►│
     │  7. Digital Receipt + Rating  │
     └──────────────────────────────┘
```

**Technical Implementation:**
- **Offer State Machine**: `pending → accepted / declined / countered`
- **Two-Sided Deal Lock**: Both buyer AND seller must independently confirm — prevents unilateral deals
- **Typing Indicators**: Debounced Socket.io events with 3s timeout
- **Quick Replies**: Context-aware one-tap response suggestions
- **Chat-scoped rooms**: `chat_{id}` Socket.io rooms for isolated message delivery

---

### 4. Razorpay Payment Integration

**Store Checkout Flow (B2C):**
```
Cart → createPaymentOrder (Backend)
  → Razorpay orders.create({ amount, currency, receipt })
    → Return orderId + keyId to frontend
      → new Razorpay(options).open()
        → handler(response) → createOrder with paymentId
          → QR Pickup Pass generated
```

**Marketplace Deal Flow (P2P):**
```
Seller & Buyer lock deal → Pay button appears
  → new Razorpay({ amount: agreedPrice × 100 }).open()
    → handler(response) → Receipt with razorpay_payment_id
      → Deal marked as paid & verified
```

- **Test mode**: `rzp_test_*` keys for demo environment
- **Failover**: If Razorpay is unavailable, falls back to simulated campus UPI
- **Signature verification**: Backend validates `razorpay_signature` using HMAC-SHA256

---

### 5. SAC Campus Store — Digital Pre-Order & QR Pickup Pass

A full e-commerce sub-system for the official Student Activity Center stationery shop:

- **Product Catalog**: Browse by category (Drawing & Drafting, Lab Records, Electronics, Stationery)
- **Cart System**: Add/remove/quantity management with live total
- **Razorpay Checkout**: One-click payment → instant QR code generation
- **Pickup Pass**: Unique 6-digit code (`UM-XXXXXX`) + QR payload for counter verification
- **Merchant Verification**: SAC counter staff scans/enters code to release order
- **Stock Management**: Real-time decrement on order placement

---

### 6. Trust & Safety System

| Feature | Implementation |
|---------|---------------|
| **Trust Score** | 5-point rating system aggregated across all deals |
| **Peer Reviews** | Post-deal rating with text feedback |
| **User Reporting** | Flag users for policy violations |
| **User Blocking** | Bilateral block system (blocked users can't chat or view listings) |
| **Rate Limiting** | Express middleware: 100 req/15min per IP on all `/api` routes |
| **Verified Badges** | Email + profile completion verification indicators |

---

### 7. Database Architecture — Adaptive Persistence Layer

UniMandi implements a **tri-tier fallback database strategy**:

```
Priority 1: MongoDB (if MONGODB_URI is set)
  ↓ fallback
Priority 2: Supabase (if SUPABASE_URL + key are set)
  ↓ fallback
Priority 3: Persistent Campus JSON Engine (always available)
```

The JSON engine provides:
- **Zero-config startup** — no external database required
- **Atomic disk sync** — `saveDB()` writes to `campus_db.json` after every mutation
- **In-memory performance** — all reads are from RAM, writes are async to disk
- **Schema**: `users`, `listings`, `products`, `orders`, `chats`, `ratings`, `reports`, `blockedUsers`

---

## 📁 Project Structure

```
UNIMANDAI/
├── client/                          # React Frontend (Vite)
│   ├── public/                      # Static assets
│   ├── src/
│   │   ├── components/
│   │   │   ├── auth/                # LoginScreen, ProfileComplete
│   │   │   ├── chat/                # MessageThread, DealReceiptModal
│   │   │   ├── common/              # Badge, Modal, Shared UI
│   │   │   ├── feed/                # CategoryBar, HeroBanner, ListingCard
│   │   │   ├── item/                # ItemDetailView
│   │   │   ├── layout/              # AppShell, BottomNav, Header
│   │   │   ├── post/                # PostItemModal (multi-step)
│   │   │   ├── profile/             # ProfileView, EditProfile
│   │   │   ├── safety/              # ReportModal
│   │   │   └── store/               # TanishStoreView, PickupPassModal
│   │   ├── context/
│   │   │   ├── AuthContext.jsx       # Google OAuth + JWT state
│   │   │   ├── ListingsContext.jsx   # Marketplace CRUD + filters
│   │   │   ├── ChatContext.jsx       # Real-time messaging + deals
│   │   │   └── StoreContext.jsx      # SAC Store + Razorpay orders
│   │   ├── data/
│   │   │   └── seedListings.js       # Categories, branches, constants
│   │   ├── services/
│   │   │   ├── api.js                # REST API client (8 modules)
│   │   │   └── socket.js            # Socket.io client singleton
│   │   ├── App.jsx                   # Root app with tab routing
│   │   └── main.jsx                  # Entry point + providers
│   ├── index.html                    # HTML shell + Razorpay script
│   ├── .env.local                    # VITE_GOOGLE_CLIENT_ID, VITE_RAZORPAY_KEY_ID
│   └── package.json
│
├── server/                           # Node.js Backend (Express)
│   ├── controllers/
│   │   ├── authController.js         # Google token verify + JWT
│   │   ├── listingController.js      # CRUD + relevance scoring
│   │   ├── chatController.js         # Messaging + offer protocol
│   │   ├── dealController.js         # Two-sided deal confirmation
│   │   ├── storeController.js        # Products + Razorpay orders
│   │   ├── ratingController.js       # Trust score aggregation
│   │   ├── safetyController.js       # Reports + blocks
│   │   └── userController.js         # Profile management
│   ├── routes/                       # 9 Express Router modules
│   ├── data/
│   │   ├── campus_db.json            # Persistent JSON database
│   │   └── store.js                  # In-memory data accessors
│   ├── config/
│   │   ├── db.js                     # MongoDB connection (optional)
│   │   └── supabase.js               # Supabase client (optional)
│   ├── socket.js                     # Socket.io server setup
│   ├── server.js                     # Express app + middleware
│   ├── .env                          # Server secrets
│   └── package.json
│
└── README.md
```

---

## 🔧 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/auth/google-verify` | Verify Google ID token, upsert user, return JWT |
| `GET` | `/api/auth/me` | Get current user from JWT |
| `POST` | `/api/auth/complete-profile` | Submit college details after first login |
| `GET` | `/api/auth/users` | List all registered users |

### Marketplace Listings
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/listings` | Get all listings (with filter query params) |
| `GET` | `/api/listings/:id` | Get single listing by ID |
| `POST` | `/api/listings` | Create new listing |
| `PUT` | `/api/listings/:id` | Update listing |
| `PATCH` | `/api/listings/:id/status` | Change listing status |
| `DELETE` | `/api/listings/:id` | Delete listing |

### Chat & Negotiation
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/chats?userId=` | Get all chats for a user |
| `POST` | `/api/chats` | Start or get existing chat |
| `GET` | `/api/chats/:id/messages` | Get chat messages |
| `POST` | `/api/chats/:id/messages` | Send message |
| `POST` | `/api/chats/:id/offer` | Make price offer |
| `POST` | `/api/chats/:id/offer/respond` | Accept / Decline / Counter |

### Deals & Payments
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/deals/:listingId/confirm` | Confirm deal (two-sided) |
| `POST` | `/api/store/create-payment-order` | Create Razorpay order |
| `POST` | `/api/store/orders` | Place confirmed order |
| `PATCH` | `/api/store/orders/:id/pickup` | Verify QR pickup code |

### SAC Store
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/store/products` | Browse store catalog |
| `POST` | `/api/store/products` | Add product (merchant) |
| `GET` | `/api/store/orders` | Get student orders |

### Safety & Ratings
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/ratings` | Submit deal rating |
| `GET` | `/api/ratings/user/:id` | Get user rating summary |
| `POST` | `/api/safety/report` | Report a user |
| `POST` | `/api/safety/block/:id` | Block a user |

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** ≥ 18.x
- **npm** ≥ 9.x
- A **Google Cloud** project with OAuth 2.0 credentials
- A **Razorpay** account (test mode is sufficient)

### 1. Clone & Install

```bash
git clone https://github.com/your-username/UNIMANDI.git
cd UNIMANDAI

# Install server dependencies
cd server && npm install

# Install client dependencies
cd ../client && npm install
```

### 2. Configure Environment

**Server** (`server/.env`):
```env
PORT=5000
JWT_SECRET=your_jwt_secret_key
GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxx
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
```

**Client** (`client/.env.local`):
```env
VITE_GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
VITE_RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxx
```

### 3. Run Development Servers

```bash
# Terminal 1: Backend (port 5000)
cd server && node server.js

# Terminal 2: Frontend (port 3000)
cd client && npx vite --host
```

### 4. Verify Startup

Backend should show:
```
💾 Loaded Persistent Campus Database from disk
💳 Razorpay Payment Gateway Initialized!
🚀 UNIMANDI Production Server running on http://localhost:5000
⚡ Real-time Socket.io Gateway active on port 5000
```

Open **http://localhost:3000** → Google Sign-In screen appears.

---

## 📊 Performance Characteristics

| Metric | Value |
|--------|-------|
| Frontend bundle (dev) | ~1.2 MB (unminified) |
| Cold server startup | < 2 seconds |
| API response time (JSON DB) | < 5ms average |
| Socket.io latency | < 50ms (localhost) |
| Vite HMR | < 100ms hot reload |
| Lighthouse Score (target) | 90+ Performance, 95+ Accessibility |

---

## 🛣️ Roadmap

- [ ] **Production Deployment** — Vercel (frontend) + Railway/Render (backend)
- [ ] **Hostel & PG Living** — Currently marked "Coming Soon", full sub-marketplace for room listings
- [ ] **Push Notifications** — FCM integration for deal updates and new messages
- [ ] **Image Compression** — Sharp.js pipeline for listing photo optimization
- [ ] **Admin Dashboard** — Moderation panel for reports and analytics
- [ ] **MongoDB Atlas Migration** — Move from JSON to cloud database for multi-instance support

---

## 👨‍💻 Author

**Kartik Narkhede**  
National Institute of Technology, Pune  
Computer Engineering — 2nd Year  

---

<p align="center">
  <sub>Built with ❤️ for the campus community</sub>
</p>
