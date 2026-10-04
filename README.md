# Verdixa 🥬

A full-stack online grocery delivery platform — think Zepto, Swiggy Instamart, or Blinkit — built end-to-end with a modern React/TypeScript frontend and a Node.js/Express backend. Customers browse, search, and order groceries with live delivery tracking; delivery partners manage their own deliveries; admins run the store from a dashboard.

**Live demo:** [https://verdixa.vercel.app/]
**Repo:** https://github.com/Nishant5395/Verdixa

---

## ✨ Features

### Shopping experience
- Product browsing with pagination, category filters, price/rating filters, and organic-only toggle
- Relevance-ranked search with **typo tolerance** (e.g. "bananna" still finds "Banana") and live autocomplete suggestions
- Persistent cart with real-time price quotes from the server (never trusts client-side totals)
- **Coupons** — percentage or flat discounts, minimum order value, max discount cap, first-order-only, usage limits, date windows
- Address book with **country → state → city** cascading selection and **automatic PIN-code lookup** (city/state auto-fill for Indian addresses)
- Dynamic pricing: configurable currency, tax rate, delivery fee, and free-delivery threshold

### Checkout & payments
- Stripe card payments and Cash on Delivery
- Webhook-verified payment fulfillment (order is only marked paid when Stripe confirms it, not on redirect)
- Atomic stock reservation at checkout — prevents overselling under concurrent orders
- Automatic stock/coupon release on cancelled or abandoned (unpaid) orders

### Order lifecycle
- Full status pipeline: Placed → Confirmed → Assigned → Packed → Out for Delivery → Delivered
- **Customer self-service cancellation** (up until the order starts being packed)
- Live order tracking with a delivery partner map and OTP-verified handoff
- Admin-assigned or auto-assigned delivery partners, with automatic retry if no rider is free

### AI support chat 🤖
- Built-in chat widget powered by Google Gemini (free tier)
- Answers general questions (delivery fees, coupons, cancellation policy) grounded in the store's actual live configuration
- For logged-in customers, can securely look up their *own* order status via function calling — never another customer's data
- Gracefully disables itself if no API key is configured, rather than breaking the page

### Three-role system
- **Customers** — browse, order, track, cancel, chat
- **Delivery partners** — their own portal to view assigned deliveries, update status, and complete handoff with OTP
- **Admins** — dashboard for products, orders, coupons, and delivery partner management

### Engineering highlights
- Input validation on every endpoint with Zod
- Rate limiting (general API, login attempts, OTP entry, chat) to prevent abuse
- Security headers via Helmet, configurable CORS allowlist
- Background jobs (Inngest) for low-stock alerts, delivery rider auto-assignment, and releasing stock from abandoned checkouts
- **150+ automated integration tests** against a real PostgreSQL database, covering payment race conditions, stock-concurrency under load, coupon edge cases, and cross-user access control

---

## 🛠️ Tech Stack

**Frontend:** React 19, TypeScript, Vite, Tailwind CSS 4, React Router
**Backend:** Node.js, Express 5, TypeScript
**Database:** PostgreSQL (Neon), Prisma ORM
**Payments:** Stripe (Checkout + Webhooks)
**AI:** Google Gemini API (function calling)
**Background jobs:** Inngest
**Auth:** JWT, bcrypt
**Validation:** Zod
**Deployment:** Vercel

---

## 📁 Project Structure

```
Verdixa/
├── client/              # React + TypeScript frontend
│   └── src/
│       ├── components/  # Reusable UI components
│       ├── pages/       # Route-level pages (customer, admin, delivery)
│       ├── context/     # Auth & cart state
│       └── config/      # API client
└── server/              # Express + TypeScript backend
    ├── controllers/     # Route handlers
    ├── routes/          # Express routers
    ├── middleware/       # Auth, rate limiting, admin checks
    ├── utils/           # Coupon engine, fuzzy search, order helpers
    ├── inngest/         # Background jobs
    └── prisma/          # Database schema
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- A PostgreSQL database (e.g. a free [Neon](https://neon.tech) instance)
- A [Stripe](https://stripe.com) account (test mode is fine)
- A free [Google Gemini API key](https://aistudio.google.com/apikey) (optional, for chat support)

### 1. Clone and install
```bash
git clone https://github.com/Nishant5395/Verdixa.git
cd Verdixa

cd server && npm install
cd ../client && npm install
```

### 2. Configure environment variables

Create `server/.env`:
```env
DATABASE_URL=postgresql://user:password@host/dbname
JWT_SECRET=your-secret-key
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
ADMIN_EMAILS=you@example.com

# Optional
GEMINI_API_KEY=your-gemini-key       # enables AI chat support
CHAT_MODEL=gemini-flash-lite-latest
CURRENCY=inr
TAX_RATE=0.05
DELIVERY_FEE=30
FREE_DELIVERY_THRESHOLD=499
CORS_ORIGINS=http://localhost:5173
```

### 3. Set up the database
```bash
cd server
npx prisma generate
npx prisma db push
```

### 4. Run it
```bash
# Terminal 1
cd server && npm run dev

# Terminal 2
cd client && npm run dev
```

Visit `http://localhost:5173`. Register with the email you set in `ADMIN_EMAILS` to get admin access.

---

## 🧪 Testing

The backend was validated with an automated integration test suite (150+ assertions) run against a live PostgreSQL instance, covering:
- Concurrent checkout races (stock never goes negative, coupons never over-redeem)
- Stripe webhook signature verification and idempotency
- Cross-user access control (users can never read or modify another user's orders/addresses)
- Input validation and rejection of malformed/malicious input

---

## 📸 Screenshots

*(Add a few screenshots or a short demo GIF here — homepage, product search, checkout, and the chat widget are good ones to show.)*

---

## 📄 License

[Add your license here, e.g. MIT]

---

Built by [Nishant Anand](https://github.com/Nishant5395)