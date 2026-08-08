# Rentify — Complete Project Briefing for AI Completion

> **Purpose:** This document gives an AI coding assistant everything it needs to bring the Rentify project to production-level completion, matching every Jira requirement, with zero errors.

---

## 1. Project Overview

**Rentify** is a Sri Lankan rental & services marketplace. It connects **Consumers** (who search, book, and review) with **Providers** (who list services/equipment, manage bookings and availability). An **Admin** moderates listings, verifies providers, and resolves disputes.

| Layer | Tech | Location |
|-------|------|----------|
| Frontend | React 18 + Vite, React Router v6, Axios, React Hook Form + Zod, Lucide icons | `d:\Work\Sasudul\Regal\client\` |
| Backend | Express.js 4, PostgreSQL 15 (pg driver), JWT auth, Sharp for images | `d:\Work\Sasudul\Regal\server\` |
| Database | PostgreSQL with PostGIS + pg_trgm extensions | `Regal_db` on localhost:5432 |
| File Storage | Local disk (`server/public/uploads/`) — avatars, listings, NIC docs | — |
| Image CDN for seed data | Unsplash URLs stored in DB JSONB `photos` column | — |

### Key Env Variables (server/.env)
```
PORT=5000
DB_NAME=Regal_db  (NOTE: .env says Rentify_db but actual DB is Regal_db — MUST be reconciled)
DB_USER=postgres
DB_PASSWORD=your_db_password
JWT_SECRET=your_super_secret_jwt_key_change_in_production
CLOUDINARY_CLOUD_NAME=Root
CLOUDINARY_API_KEY=488987514233253
CLOUDINARY_API_SECRET=sM7ceZf_L6fkbNp2xi-XHkBxG-4
VITE_GOOGLE_MAPS_API_KEY=AIzaSyAdsvZ2PMYO5KpHg4rr0oYJg4UnA2S633Y
```

> [!CAUTION]
> **DB_NAME mismatch:** `server/.env` says `DB_NAME=Rentify_db` but the actual database name used is `Regal_db`. The `server/config/db.js` defaults to `Rentify_db`. The scratch scripts and `reset_and_seed.sql` target `Regal_db`. **You MUST ensure `.env` says `DB_NAME=Regal_db`** or all DB connections will fail silently.

---

## 2. Database Schema (Source of Truth: `reset_and_seed.sql`)

### Tables (in dependency order)
1. **users** — id (UUID), email, mobile, password_hash, role (`consumer`|`provider`|`admin`), status (`pending_verification`|`verified`|`suspended`|`banned`), full_name, bio, address, district, country, profile_photo_url, nic_number, nic_document_url, trust_score, is_deleted, failed_attempts, locked_until, is_2fa_enabled, visibility_settings (JSONB)
2. **categories** — id (UUID), name, type (`service`|`equipment`), parent_id, is_active. UNIQUE(name, type).
3. **listings** — id (UUID), provider_id → users, category_id → categories, title, description, type (`service`|`equipment`), status (`pending_approval`|`active`|`suspended`|`deleted`), price_per_unit, unit_label, deposit_amount, photos (JSONB array of URLs), tags (JSONB), district, geo_lat, geo_lng, condition (condition_enum: `new`|`good`|`fair`), quantity, quantity_available, specifications (JSONB), average_rating, review_count
4. **listing_availability** — id, listing_id → listings, date, is_available, blocked_reason. UNIQUE(listing_id, date).
5. **bookings** — id, consumer_id → users, provider_id → users, status (booking_status_enum: `pending`|`confirmed`|`cancelled`|`completed`|`disputed`|`rejected`), booking_type (booking_type_enum: `service`|`equipment`|`bundle`), service_listing_id → listings, equipment_listing_id → listings, scheduled_date, scheduled_time, duration_hours, total_price, notes
6. **payments** — id, booking_id → bookings, amount, platform_fee, currency, status, gateway_reference
7. **reviews** — id, booking_id → bookings, reviewer_id → users, reviewee_id → users, listing_id → listings, rating (1-5), comment, status. UNIQUE(booking_id, reviewer_id, reviewee_id).
8. **messages** — id, booking_id → bookings, sender_id → users, recipient_id → users, content, is_read
9. **notifications** — id, user_id → users, type, title, body, metadata (JSONB), is_read
10. **refresh_tokens** — id, user_id → users, token, expires_at, is_revoked
11. **password_reset_tokens** — id, user_id → users, token_hash, expires_at, is_used

### Seed Data (6 categories, 8 users, 12 listings)
- **Categories:** Properties, Services, Electronics, Furniture, Clothings, Machinery
- **Users:** 6 providers, 1 consumer (kasun@rentify.lk), 1 admin (admin@rentify.lk). Password for all: `password123`
- **Listings:** 2 per category, all `active` status, with Unsplash photo URLs in `photos` JSONB
- **Availability:** 30 days of available dates for all listings
- **Bookings:** 1 completed booking (AC Service), 1 review

---

## 3. Backend Architecture

### Route Mounting (server.js → /api/v1/*)
| Prefix | Router File | Controller |
|--------|-------------|------------|
| `/auth` | auth.routes.js | auth.controller.js |
| `/users` | user.routes.js | user.controller.js |
| `/listings` | listing.routes.js | listing.controller.js |
| `/bookings` | booking.routes.js | booking.controller.js |
| `/payments` | payment.routes.js | payment.controller.js |
| `/reviews` | review.routes.js | review.controller.js |
| `/search` | search.routes.js | search.controller.js |
| `/messages` | messaging.routes.js | messaging.controller.js |
| `/notifications` | notification.routes.js | notification.controller.js |
| `/admin` | admin.routes.js | admin.controller.js |

### Middleware Stack
1. **helmet** — Security headers
2. **cors** — Allows `CLIENT_URL` and any localhost in dev
3. **express.json** — 10MB limit
4. **express.urlencoded** — extended: true
5. **express.static** — `/uploads` → `server/public/uploads/`
6. **auth.middleware.js** — JWT verification, populates `req.user = { userId, role, status }`
7. **optionalAuth.middleware.js** — Same as auth but doesn't reject unauthenticated
8. **role.middleware.js** — `requireRole('admin')` etc.
9. **upload.middleware.js** — multer config for avatars, listing photos, NIC docs
10. **validate.middleware.js** — express-validator result checker
11. **error.middleware.js** — Global error handler (last)

### Services
| Service | Purpose | Status |
|---------|---------|--------|
| auth.service.js | bcrypt hash/compare, JWT sign/verify | ✅ Working |
| otp.service.js | In-memory OTP generation & verification (dev mode) | ✅ Working |
| notification.service.js | sendInApp (DB), sendEmail (mock console.log), sendSMS (not implemented) | ⚠️ Partial |
| upload.service.js | Cloudinary upload helper | ✅ Working (but local disk used for avatars/listings) |
| availability.service.js | Availability checking logic | ✅ Working |
| payment.service.js | PayHere/Stripe stubs | ❌ Stub only |
| trust.service.js | Trust score calculation | ✅ Working |

### Models (all use raw pg `query()`)
user.model.js, listing.model.js, booking.model.js, category.model.js, review.model.js, notification.model.js, message.model.js, payment.model.js, refresh_token.model.js, password_reset_token.model.js

---

## 4. Frontend Architecture

### Routing (App.jsx)
| Path | Component | Access |
|------|-----------|--------|
| `/` | HomePage | Public |
| `/register` | RegisterPage | Public |
| `/login` | LoginPage | Public |
| `/reset-password` | ResetPasswordPage | Public |
| `/search` | SearchPage | Public |
| `/listings/:id` | ListingDetailPage | Public |
| `/bookings` | BookingHistoryPage | Consumer |
| `/bundle-booking` | BundleBookingPage | Consumer |
| `/provider/dashboard` | ProviderDashboardPage | Provider |
| `/provider/listings/new/service` | CreateServiceListingPage | Provider |
| `/provider/listings/new/equipment` | CreateEquipmentListingPage | Provider |
| `/provider/availability` | AvailabilityCalendarPage | Provider |
| `/provider/booking-requests` | BookingRequestsPage | Provider |
| `/admin/dashboard` | AdminDashboardPage | Admin |
| `/admin/provider-approvals` | ProviderApprovalPage | Admin |
| `/admin/nic-verification` | NICVerificationPage | Admin |
| `/admin/listing-moderation` | ListingModerationPage | Admin |
| `/admin/users` | UserManagementPage | Admin |
| `/admin/disputes` | DisputesPage | Admin |
| `/admin/categories` | CategoryManagementPage | Admin |
| `/profile` | ProfilePage | Any authenticated |
| `/messages` | MessagingPage | Any authenticated |
| `/notifications` | NotificationsPage | Any authenticated |

### State Management
- **AuthContext** (context/AuthContext.jsx) — user, token, login, logout, loginSuccess, register
- **useAuth** hook (hooks/useAuth.js) — convenience hook for AuthContext

### API Client
- **axiosInstance.js** — baseURL `http://localhost:5000/api/v1`, auto-attaches JWT from localStorage/sessionStorage, 401 interceptor clears token and redirects to `/login`

---

## 5. Jira User Stories — Status Audit

Every Jira item is marked **Done** in the CSV. Below is my **real code audit** of whether each is actually complete and working:

### E1 — User Management & Trust

#### US01 — Register with Mobile + NIC Verification
| Subtask | Jira | Code Status | Issues |
|---------|------|-------------|--------|
| Design Register UI | SCRUM-3 | ✅ Done | Multi-step wizard with role selection, password strength meter |
| Backend Registration API | SCRUM-86 | ✅ Done | Creates user, returns userId + temp token |
| OTP Generation & Verification | SCRUM-87 | ✅ Done | In-memory OTP store, dev mode returns code in response |
| NIC Upload & Storage | SCRUM-88 | ⚠️ Partial | Backend route exists (`POST /users/:id/nic-upload`). Frontend RegisterPage Step 3 now calls it with FormData. **BUT:** `upload.middleware.js` `uploadNic` must be verified to use `multer.memoryStorage()` or disk storage consistently. Test this end-to-end. |
| Develop Register Page UI | SCRUM-115 | ✅ Done | — |

**Known Issues:**
1. Registration flow works for **Consumer** (steps 1→2→login). For **Provider** (steps 1→2→3), the NIC upload endpoint may fail if multer is misconfigured or if the `Authorization` header doesn't carry the temporary token correctly.
2. The `registeredUserId` and `registeredUserToken` state variables were added in a recent session to wire up NIC upload — verify they are populated correctly from the `register` and `verifyOtp` API responses.

#### US02 — Secure Login
| Subtask | Jira | Code Status | Issues |
|---------|------|-------------|--------|
| Design Login UI | SCRUM-35 | ✅ Done | Email/mobile + password + remember me |
| Backend integration | SCRUM-36 | ✅ Done | Login with lockout after 3 failed attempts |
| OTP verification (2FA) | SCRUM-37 | ✅ Done | Optional 2FA toggle, pre-auth token flow |
| Login Page UI | SCRUM-116 | ✅ Done | — |
| Password Reset Flow | SCRUM-119 | ✅ Done | Token-based email reset (mock email in dev) |

**Known Issues:**
1. Login uses `findByEmailOrMobile(identifier)` — the login form sends `{ identifier, password }` but the controller destructures `{ identifier, email, mobile, password }` and coalesces them. This works but is fragile.
2. The `useAuth.login()` sends the identifier in a `payload` object with `email` or `mobile` keys, but the controller also accepts a top-level `identifier` field. Make sure both code paths are consistent.

#### US03 — Profile Management
| Subtask | Jira | Code Status | Issues |
|---------|------|-------------|--------|
| Design profile edit UI | SCRUM-38 | ✅ Done | Tabs: Account, Security, Preferences |
| Backend profile update | SCRUM-39 | ✅ Done | PUT /users/:id |
| Photo upload & cloud storage | SCRUM-40 | ✅ Done | POST /users/:id/avatar, Sharp resize to webp |
| Validations & permissions | SCRUM-41 | ⚠️ Fixed Recently | mobile validation uses `{ checkFalsy: true }` now |
| Develop profile edit UI | SCRUM-117 | ✅ Done | — |

**Known Issues:**
1. **Profile save was broken** — The backend's express-validator rule for `mobile` was rejecting empty strings. Fixed by changing `{ nullable: true }` to `{ checkFalsy: true }` on the mobile field.
2. The frontend Zod schema uses `.refine()` on mobile with a Sri Lankan regex but allows empty/null — this is now consistent with the backend.
3. **Avatar upload:** The frontend sends the file as field name `file` but `upload.middleware.js` may expect a different field name. Verify `uploadSingle` accepts `file` field name.
4. The Zod schema has a `display_name` field but the DB schema has no `display_name` column — this will silently fail on save. Either add the column or remove the field.

---

### E2 — Listing Management

#### US06 — Create Service Listing
| Subtask | Jira | Code Status | Issues |
|---------|------|-------------|--------|
| Design service details UI | SCRUM-26 | ✅ Done | Multi-step wizard |
| Upload images Backend | SCRUM-27 | ✅ Done | POST /listings/:id/photos |
| Publish listing Backend | SCRUM-28 | ✅ Done | POST /listings creates with status `pending_approval` |
| Enter Service Details UI | SCRUM-118 | ✅ Done | — |

#### US07 — Create Equipment Listing
| Subtask | Jira | Code Status | Issues |
|---------|------|-------------|--------|
| Design equipment listing form | SCRUM-101 | ✅ Done | — |
| Backend API + DB model | SCRUM-102 | ✅ Done | Validates condition enum, quantity |
| Calendar field integration | SCRUM-103 | ✅ Done | Auto-creates 30 days availability on listing creation |
| Photo handling | SCRUM-104 | ✅ Done | — |
| Equipment listing form UI | SCRUM-113 | ✅ Done | — |

**Known Issues:**
1. New listings are created with status `pending_approval`. They won't appear in search until an admin approves them. **This is by design** but the provider dashboard should show their own listings regardless of status.
2. The listing creation wizard's Step4Preview fetches categories to map UUID→name. Verify `GET /search/categories` returns the 6 seeded categories without errors.
3. Photo upload uses `multer.memoryStorage()` with `req.files` (array). Verify the route has `upload.array('photos', 10)` middleware.

---

### E3 — Search & Discovery

#### US09 — Search by Category, District, Keyword
| Subtask | Jira | Code Status | Issues |
|---------|------|-------------|--------|
| Implement Backend Search API | SCRUM-22 | ✅ Done | Full-text + trigram fuzzy search |
| Test Search Functionality | SCRUM-23 | ✅ Done | `search.test.js` exists |
| Integrate Search Filters | SCRUM-24 | ✅ Done | Category, district, price range, rating, sort |

**Known Issues:**
1. **Search 500 errors were previously reported.** Root cause: `pg_trgm` extension not installed OR `SET pg_trgm.similarity_threshold` fails. The `reset_and_seed.sql` now includes `CREATE EXTENSION IF NOT EXISTS pg_trgm` — ensure the seed script has been run.
2. `GET /search/categories` returns all categories. Verify this endpoint doesn't 500.
3. The frontend SearchPage calls both `/search?q=` and `/search/categories` on mount.

#### US10 — Geo-Based Search (Nearby Providers)
| Subtask | Jira | Code Status | Issues |
|---------|------|-------------|--------|
| Add lat/lng to Provider table | SCRUM-67 | ✅ Done | `geo_lat`/`geo_lng` on listings table |
| Distance calculation API | SCRUM-68 | ✅ Done | Haversine formula in SQL |
| "Use My Location" button | SCRUM-69 | ✅ Done | GPS + manual city/ZIP |
| Map component (Google Maps) | SCRUM-122 | ✅ Done | `@react-google-maps/api` integrated |
| Radius filter test | SCRUM-123 | ✅ Done | — |
| Location permission fallback | SCRUM-152 | ✅ Done | Manual city input |
| Manual city/ZIP geocoding | SCRUM-153 | ✅ Done | — |

**Known Issues:**
1. Google Maps API key is in `.env` as `VITE_GOOGLE_MAPS_API_KEY`. The key works but may have billing/quota limits.
2. The `searchNearby` endpoint at `GET /search/nearby?lat=&lng=&radius=` works correctly. Verify frontend calls it with proper params.

---

### E4 — Booking Management

#### US11 — Send Booking Request
| Subtask | Jira | Code Status | Issues |
|---------|------|-------------|--------|
| Design booking request UI | SCRUM-52 | ✅ Done | In ListingDetailPage |
| Backend booking request API | SCRUM-53 | ✅ Done | POST /bookings with availability check |
| Status management (Pending) | SCRUM-54 | ✅ Done | Default status = `pending` |
| Notification to Provider | SCRUM-55 | ✅ Done | In-app notification via setImmediate |
| Basic availability check | SCRUM-56 | ✅ Done | booking.model.js `checkAvailabilityConflict()` |

#### US12 — Accept/Reject Booking Requests
| Subtask | Jira | Code Status | Issues |
|---------|------|-------------|--------|
| Status column with enums | SCRUM-48 | ✅ Done | booking_status_enum |
| API endpoints for accept/reject | SCRUM-49 | ✅ Done | PUT /bookings/:id/accept, PUT /bookings/:id/reject |
| Accept/Reject buttons UI | SCRUM-50 | ✅ Done | In BookingRequestsPage |
| Consumer notification on status change | SCRUM-51 | ✅ Done | In-app notification |
| Provider booking details view | SCRUM-159 | ✅ Done | — |
| Conflict test (double accept) | SCRUM-133 | ✅ Done | `booking.test.js` |

#### US04 — View Booking History
| Subtask | Jira | Code Status | Issues |
|---------|------|-------------|--------|
| API endpoint for past bookings | SCRUM-58 | ✅ Done | GET /users/:id/bookings + GET /bookings |
| My Bookings page UI | SCRUM-59 | ✅ Done | BookingHistoryPage with table |
| Status badges | SCRUM-60 | ✅ Done | Color-coded chips |
| Pagination API | SCRUM-125 | ✅ Done | page + limit params |
| Security test (own history only) | SCRUM-126 | ✅ Done | — |
| API for full booking history | SCRUM-149 | ✅ Done | All statuses returned |
| History filters/tabs | SCRUM-150 | ✅ Done | Past, Active, Pending, Canceled tabs |
| Booking timeline dates | SCRUM-151 | ✅ Done | — |
| My Bookings page layout | SCRUM-176 | ✅ Done | Responsive design |

#### US08 — Equipment Availability Calendar
| Subtask | Jira | Code Status | Issues |
|---------|------|-------------|--------|
| EquipmentAvailability table | SCRUM-75 | ✅ Done | `listing_availability` table |
| API for blocked dates CRUD | SCRUM-76 | ✅ Done | PUT /listings/:id/availability |
| Calendar UI component | SCRUM-77 | ✅ Done | AvailabilityCalendarPage |
| Booking creation checks availability | SCRUM-78 | ✅ Done | Rejects if blocked |
| API to fetch availability for date range | SCRUM-154 | ✅ Done | GET /listings/:id/availability |
| Unit tests for overlap validation | SCRUM-155 | ✅ Done | — |
| Double-booking prevention test | SCRUM-127 | ✅ Done | — |

#### US14 — Provider Schedule Dashboard
| Subtask | Jira | Code Status | Issues |
|---------|------|-------------|--------|
| API for future bookings | SCRUM-128 | ✅ Done | GET /bookings?upcoming=true |
| Dashboard widget for upcoming bookings | SCRUM-129 | ✅ Done | ProviderDashboardPage |
| Filter by Today/This Week/This Month | SCRUM-130 | ✅ Done | — |
| Link bookings to availability calendar | SCRUM-131 | ✅ Done | — |
| Past/cancelled filter test | SCRUM-132 | ✅ Done | — |
| Color-coded status labels | SCRUM-156 | ✅ Done | — |
| Empty/loading/error states | SCRUM-157 | ✅ Done | — |
| API for blocked-out dates | SCRUM-158 | ✅ Done | — |

#### US13 — Bundle Booking (Service + Equipment)
| Subtask | Jira | Code Status | Issues |
|---------|------|-------------|--------|
| Bundle booking page UI | SCRUM-134 | ✅ Done | BundleBookingPage.jsx |
| DB transaction wrapping | SCRUM-73 | ✅ Done | booking.model.js uses BEGIN/COMMIT/ROLLBACK |
| Bundle price integration test | SCRUM-135 | ✅ Done | `booking.test.js` |

---

## 6. CRITICAL BUGS AND INCOMPLETE FEATURES

> [!CAUTION]
> These are the items that MUST be fixed before the project can be considered complete.

### BUG-01: Database Name Mismatch (CRITICAL)
- **File:** `server/.env` line 18 says `DB_NAME=Rentify_db`
- **Reality:** Database is named `Regal_db`
- **Fix:** Change `.env` to `DB_NAME=Regal_db`
- **Impact:** Server crashes on startup if DB doesn't exist

### BUG-02: Seed Script Must Be Re-Run
- **File:** `reset_and_seed.sql` was updated with Unsplash photo URLs in the `photos` JSONB column
- **Status:** Unknown if it was actually executed against the database
- **Fix:** Run `psql -U postgres -d Regal_db -f reset_and_seed.sql` after fixing the DB_NAME
- **Impact:** Listings show no images on HomePage/SearchPage if photos column is empty

### BUG-03: Provider Dashboard — No Quick Actions Working
- **Issue:** Provider dashboard has navigation links but providers cannot see their own listings
- **Root Cause:** The "My Listings" section in ProviderDashboardPage calls `GET /listings?provider_id=<userId>` but may not properly filter by provider_id when the user has no listings yet
- **Fix:** Ensure the provider dashboard:
  1. Shows "Create Service Listing" and "Create Equipment Listing" buttons with working navigation
  2. Shows the provider's own listings regardless of their status (including `pending_approval`)
  3. Shows upcoming bookings correctly

### BUG-04: Images Not Showing on HomePage
- **Root Cause:** Listing images must come from the database `photos` JSONB column, NOT from frontend hardcoded fallbacks
- **Files Involved:**
  - `client/src/utils/imageHelper.js` — centralized cover image extraction
  - `client/src/components/listings/ListingCard.jsx` — uses imageHelper
  - `client/src/pages/consumer/HomePage.jsx` — featured listings section
- **Fix:** Ensure imageHelper.js extracts `listing.photos[0]` and the database has actual photo URLs (depends on BUG-02)

### BUG-05: Profile Page — Potential `display_name` Column Missing
- **Issue:** ProfilePage's Zod schema has a `display_name` field but the `users` table has no `display_name` column
- **Fix:** Either `ALTER TABLE users ADD COLUMN display_name VARCHAR(255)` or remove `display_name` from the frontend schema and form

### BUG-06: Avatar Upload Field Name Mismatch
- **Issue:** ProfilePage sends avatar file as field name `file` but `upload.middleware.js uploadSingle` may expect a different name
- **Fix:** Verify `upload.middleware.js` exports `uploadSingle` using `multer().single('file')` — if it uses a different name (like `avatar` or `photo`), update either the middleware or the frontend

### BUG-07: Admin Pages Are Stubs
- **Issue:** All 7 admin pages (AdminDashboardPage, ProviderApprovalPage, NICVerificationPage, ListingModerationPage, UserManagementPage, DisputesPage, CategoryManagementPage) are placeholder components with no real functionality
- **Backend:** The admin controller has ALL the necessary endpoints fully implemented
- **Fix:** Build real admin UIs that call:
  - `GET /admin/analytics` → Dashboard stats
  - `GET /admin/providers?status=pending_verification` → Provider approvals list
  - `PUT /admin/providers/:id/approve` / `PUT /admin/providers/:id/reject`
  - `GET /admin/nic-verifications` → NIC verification queue
  - `GET /admin/listings?status=pending_approval` → Listing moderation
  - `PUT /admin/listings/:id/approve` / `PUT /admin/listings/:id/suspend`
  - `GET /admin/users` → User management with search, filter, ban/suspend/reinstate
  - `GET /admin/disputes` → Disputed bookings, `PUT /admin/disputes/:id/resolve`
  - `GET /admin/categories` → CRUD for categories

### BUG-08: Messaging Page Is a Stub
- **Issue:** `MessagingPage.jsx` is a placeholder (~1650 bytes)
- **Backend:** `messaging.controller.js` exists but is minimal
- **Fix:** Build a real messaging UI or at minimum a functional stub that shows "No messages" state

### BUG-09: Notifications Page Is a Stub
- **Issue:** `NotificationsPage.jsx` is a placeholder (~1571 bytes)
- **Backend:** `notification.controller.js` and `notification.model.js` work — notifications ARE being created by booking/listing controllers
- **Fix:** Build a real notifications list page that calls `GET /notifications` and shows unread/read notifications with mark-as-read functionality

### BUG-10: Payment Flow Is a Stub
- **Issue:** `payment.controller.js` and `payment.service.js` are stub implementations
- **Impact:** No actual payment processing — acceptable for MVP but the controller should at least not crash

### BUG-11: Notification Service sendSMS Throws
- **Issue:** `notification.service.js` `sendSMS()` does `throw new Error('sendSMS not implemented')` — if any code path calls it, the server crashes
- **Fix:** Change to a safe no-op mock like `sendEmail` instead of throwing

### BUG-12: Notification Service `notify()` Throws
- **Issue:** Same as above — `notify()` throws instead of being a no-op
- **Fix:** Implement as a dispatcher or change to safe no-op

---

## 7. FILE-BY-FILE REFERENCE MAP

### Backend Files
```
server/
├── server.js                          — Express app setup, route mounting
├── config/
│   └── db.js                          — pg.Pool connection config
├── middleware/
│   ├── auth.middleware.js             — JWT verify → req.user
│   ├── optionalAuth.middleware.js     — Same but non-blocking
│   ├── role.middleware.js             — requireRole() guard
│   ├── upload.middleware.js           — multer configs (uploadSingle, uploadPhotos, uploadNic)
│   ├── validate.middleware.js         — express-validator result check
│   └── error.middleware.js            — Global error handler
├── controllers/
│   ├── auth.controller.js             — register, login, refresh, OTP, 2FA, password reset
│   ├── user.controller.js             — getProfile, updateProfile, uploadAvatar, uploadNicDocument, getBookingHistory
│   ├── listing.controller.js          — CRUD, availability, photo upload
│   ├── booking.controller.js          — create, getAll, getById, accept, reject, cancel, complete
│   ├── search.controller.js           — search, getCategories, searchNearby
│   ├── review.controller.js           — create, getByListing, getByProvider
│   ├── admin.controller.js            — Full admin CRUD (providers, listings, users, categories, disputes, analytics)
│   ├── notification.controller.js     — getAll, markRead
│   ├── messaging.controller.js        — getConversation, sendMessage
│   └── payment.controller.js          — createPayment, verifyPayment (stubs)
├── models/
│   ├── user.model.js                  — CRUD + findByMobile, findByEmailOrMobile, findAdmins, updateStatus, etc.
│   ├── listing.model.js               — CRUD + findAll with filters, updatePhotos, updateStatus, softDelete
│   ├── booking.model.js               — CRUD + findByConsumer, findByProvider, checkAvailabilityConflict, DB transactions
│   ├── category.model.js              — CRUD
│   ├── review.model.js                — CRUD + calculateAverageRating
│   ├── notification.model.js          — create, findByUser, markRead
│   ├── message.model.js               — create, findByBooking
│   ├── payment.model.js               — create, findByBooking
│   ├── refresh_token.model.js         — create, findByToken, revoke, revokeAllForUser
│   └── password_reset_token.model.js  — create, findByHash, markAsUsed
├── services/
│   ├── auth.service.js                — hashPassword, comparePassword, generateToken, verifyToken
│   ├── otp.service.js                 — In-memory OTP store, generate(), verify()
│   ├── notification.service.js        — sendInApp, sendEmail (mock), sendSMS (THROWS), notify (THROWS)
│   ├── upload.service.js              — Cloudinary upload helper
│   ├── availability.service.js        — Availability logic
│   ├── payment.service.js             — PayHere/Stripe stubs
│   └── trust.service.js               — Trust score calculation
├── routes/
│   ├── auth.routes.js, user.routes.js, listing.routes.js, booking.routes.js,
│   ├── search.routes.js, review.routes.js, admin.routes.js,
│   ├── notification.routes.js, messaging.routes.js, payment.routes.js
├── db/
│   ├── migrations/                    — 19 SQL migration files
│   └── seeds/seed.sql                 — Original seed (superseded by reset_and_seed.sql)
└── __tests__/
    ├── auth.test.js, booking.test.js, listing.test.js, search.test.js, user.test.js, admin.test.js, payment.test.js
```

### Frontend Files
```
client/src/
├── App.jsx                            — Route definitions
├── main.jsx                           — ReactDOM.createRoot, AuthProvider, BrowserRouter
├── index.css                          — Global CSS variables and resets
├── api/
│   └── axiosInstance.js               — Axios config with JWT interceptor
├── context/
│   └── AuthContext.jsx                — Auth state, login(), logout(), loginSuccess()
├── hooks/
│   └── useAuth.js                     — Convenience hook for AuthContext
├── utils/
│   └── imageHelper.js                 — getCoverImage() utility
├── components/
│   ├── layout/
│   │   ├── Navbar.jsx + Navbar.css    — Top navigation with role-aware links
│   │   ├── Footer.jsx + Footer.css    — Site footer
│   │   └── Sidebar.jsx               — Admin sidebar
│   ├── common/
│   │   └── ProtectedRoute.jsx         — Route guard by role
│   ├── listings/
│   │   ├── ListingCard.jsx            — Reusable listing card
│   │   ├── ListingGrid.jsx            — Grid layout for cards
│   │   └── Steps/                     — Multi-step wizard components
│   │       ├── Step1BasicInfo.jsx, Step2Pricing.jsx, Step3Photos.jsx, Step4Preview.jsx
│   │       ├── EquipmentStep1.jsx, EquipmentStep2.jsx, EquipmentStep3Photos.jsx, EquipmentStep4Preview.jsx
│   └── reviews/                       — Review display components
├── pages/
│   ├── auth/
│   │   ├── RegisterPage.jsx + .css    — 3-step registration (role→details→OTP→NIC)
│   │   ├── LoginPage.jsx + .css       — Login with remember-me, 2FA
│   │   └── ResetPasswordPage.jsx      — Password reset flow
│   ├── consumer/
│   │   ├── HomePage.jsx + .css        — Landing page with categories + featured listings
│   │   ├── SearchPage.jsx + .css      — Full search with filters, map, results grid
│   │   ├── ListingDetailPage.jsx + .css — Listing details + booking form + reviews
│   │   ├── BookingHistoryPage.jsx + .css — Consumer booking history with tabs
│   │   └── BundleBookingPage.jsx + .css — Bundle booking (service + equipment)
│   ├── provider/
│   │   ├── ProviderDashboardPage.jsx + .css — Dashboard with stats and quick actions
│   │   ├── CreateServiceListingPage.jsx     — Service listing wizard
│   │   ├── CreateEquipmentListingPage.jsx   — Equipment listing wizard
│   │   ├── CreateListingPage.jsx + .css     — Shared listing creation base
│   │   ├── AvailabilityCalendarPage.jsx + .css — Calendar for blocking dates
│   │   └── BookingRequestsPage.jsx + .css   — Pending requests with accept/reject
│   ├── admin/
│   │   ├── AdminDashboardPage.jsx     — ❌ STUB — needs real analytics UI
│   │   ├── ProviderApprovalPage.jsx   — ❌ STUB — needs real approval queue
│   │   ├── NICVerificationPage.jsx    — ❌ STUB — needs real NIC review UI
│   │   ├── ListingModerationPage.jsx  — ❌ STUB — needs real moderation UI
│   │   ├── UserManagementPage.jsx     — ❌ STUB — needs real user admin UI
│   │   ├── DisputesPage.jsx           — ❌ STUB — needs real dispute resolution UI
│   │   └── CategoryManagementPage.jsx — ❌ STUB — needs real category CRUD UI
│   ├── shared/
│   │   ├── ProfilePage.jsx + .css     — Profile edit + avatar + visibility + 2FA
│   │   ├── MessagingPage.jsx          — ❌ STUB — needs real messaging UI
│   │   └── NotificationsPage.jsx      — ❌ STUB — needs real notifications list
│   └── errors/
│       ├── NotFoundPage.jsx           — 404 page
│       └── UnauthorizedPage.jsx       — 403 page
```

---

## 8. STEP-BY-STEP COMPLETION INSTRUCTIONS

> [!IMPORTANT]
> Execute these steps in order. Each step depends on the previous ones.

### Phase 0: Environment & Database Reset
1. **Fix `.env` DB_NAME:** In `server/.env`, change `DB_NAME=Rentify_db` to `DB_NAME=Regal_db`
2. **Run seed script:** Execute `reset_and_seed.sql` against the `Regal_db` database. This drops and recreates all tables, extensions, and seed data.
3. **Verify server starts:** Run `npm run dev` in `server/` — should connect to `Regal_db` on port 5000
4. **Verify client starts:** Run `npm run dev` in `client/` — should start Vite on port 5173
5. **Verify `/api/v1/health`** returns `{ status: 'ok' }`
6. **Verify `/api/v1/search/categories`** returns 6 categories
7. **Verify `/api/v1/search?q=`** returns 12 active listings with photos

### Phase 1: Fix Critical Bugs
1. **Fix notification service crashes:**
   - In `server/services/notification.service.js`, change `sendSMS` from `throw` to a console.log mock (like `sendEmail`)
   - Change `notify` from `throw` to a dispatcher that calls `sendInApp` only (skip email/SMS for now)

2. **Fix avatar upload field name:**
   - In `server/middleware/upload.middleware.js`, verify `uploadSingle` uses `multer().single('file')` — the frontend sends file as `file` field name
   - If it uses a different name, update it to `'file'`

3. **Fix display_name column:**
   - Either add `ALTER TABLE users ADD COLUMN IF NOT EXISTS display_name VARCHAR(255)` to the seed script
   - OR remove `display_name` from ProfilePage's Zod schema and form JSX

4. **Verify NIC upload flow end-to-end:**
   - Register as provider (mobile + password)
   - Verify OTP
   - Upload NIC document in Step 3
   - Verify the file is saved to `server/public/uploads/nic/` and `users.nic_document_url` is updated

5. **Verify profile update works:**
   - Login as consumer or provider
   - Navigate to `/profile`
   - Edit full_name, bio, address
   - Save → verify PUT /users/:id succeeds
   - Upload avatar → verify file saved and displayed

### Phase 2: Build Real Admin Pages
Each admin page has a fully working backend endpoint. Build React UIs that call them.

**AdminDashboardPage.jsx:**
- Call `GET /admin/analytics` on mount
- Display cards: Total Users by Role, Total Listings by Type, Bookings by Status, Total Revenue, Pending Providers count, Pending Listings count
- Link to other admin pages

**ProviderApprovalPage.jsx:**
- Call `GET /admin/providers?status=pending_verification`
- Show table of pending providers with NIC number, NIC document link, registration date
- "Approve" button → `PUT /admin/providers/:id/approve`
- "Reject" button → `PUT /admin/providers/:id/reject` with reason input

**NICVerificationPage.jsx:**
- Call `GET /admin/nic-verifications`
- Show list of users with uploaded NIC documents
- Display NIC document image/PDF
- "Verify" / "Reject" actions

**ListingModerationPage.jsx:**
- Call `GET /admin/listings?status=pending_approval`
- Show listing cards with title, description, photos, price, provider name
- "Approve" button → `PUT /admin/listings/:id/approve`
- "Suspend" button → `PUT /admin/listings/:id/suspend`

**UserManagementPage.jsx:**
- Call `GET /admin/users` with search/filter/pagination
- Show user table with role, status, trust score
- Actions: Ban, Suspend, Reinstate

**DisputesPage.jsx:**
- Call `GET /admin/disputes`
- Show disputed bookings with consumer/provider names
- "Resolve" button with status selector

**CategoryManagementPage.jsx:**
- Call `GET /admin/categories`
- Show table with name, type, status
- Add New Category form
- Edit/Delete actions

### Phase 3: Build Real Messaging & Notifications Pages

**NotificationsPage.jsx:**
- Call `GET /notifications`
- Render notification list with type icon, title, body, timestamp
- "Mark as Read" action → `PUT /notifications/:id/read`
- Show unread count badge in Navbar

**MessagingPage.jsx:**
- This can be a simplified version:
- Call `GET /messages?booking_id=` to get conversation
- Show message thread
- Send message form → `POST /messages`
- Or show "Coming soon" placeholder if messaging is out of MVP scope

### Phase 4: Polish Provider Dashboard
- Ensure "My Listings" section fetches `GET /listings?provider_id=<userId>&status=all` (not just active)
- Add "Create New Listing" button that navigates to `/provider/listings/new/service` or `/provider/listings/new/equipment`
- Show upcoming bookings widget with "View All" link to `/provider/booking-requests`
- Show quick stats: total listings, pending bookings, completed bookings

### Phase 5: Polish Frontend Data Flow
1. **HomePage featured listings:** Must come from `GET /listings?limit=6` or `GET /search?limit=6` — NOT hardcoded
2. **ListingCard images:** Must use `listing.photos[0]` from the API response — fallback to `imageHelper.js` only if photos is empty
3. **ListingDetailPage:** Gallery should iterate `listing.photos[]` array from the API
4. **SearchPage:** Must show real results from backend with pagination

### Phase 6: Run Tests and Fix Failures
```bash
cd server
npm test
```
Fix any test failures. The test suite includes:
- `auth.test.js` — Registration, login, OTP, password reset, 2FA, account lockout
- `booking.test.js` — Create, accept, reject, cancel, complete, conflict detection, bundle pricing
- `listing.test.js` — CRUD, photo upload, availability, authorization
- `search.test.js` — Full-text search, filters, geo-proximity
- `user.test.js` — Profile CRUD, booking history, security (own-data-only)

### Phase 7: Final Verification Checklist
- [ ] Consumer can register (mobile + OTP)
- [ ] Provider can register (mobile + OTP + NIC upload)
- [ ] Login works with correct credentials
- [ ] Login fails after 3 wrong attempts (lockout)
- [ ] Password reset flow works
- [ ] Profile edit saves correctly
- [ ] Avatar upload works
- [ ] Provider can create service listing (multi-step wizard)
- [ ] Provider can create equipment listing (multi-step wizard)
- [ ] Admin can approve/reject pending listings
- [ ] Approved listings appear in search
- [ ] Search by keyword returns results
- [ ] Search by category filters correctly
- [ ] Search by district filters correctly
- [ ] Price range filter works
- [ ] Geo-based nearby search works
- [ ] Google Maps displays provider pins
- [ ] Consumer can book a listing (date + time + duration)
- [ ] Provider receives booking notification
- [ ] Provider can accept booking (no conflicts)
- [ ] Provider cannot accept conflicting booking (409)
- [ ] Provider can reject booking
- [ ] Consumer receives accept/reject notification
- [ ] Consumer can cancel pending/confirmed booking
- [ ] Booking history shows all statuses with tabs
- [ ] Booking history pagination works
- [ ] Provider availability calendar shows/blocks dates
- [ ] Bundle booking (service + equipment) calculates correct total
- [ ] Bundle booking uses DB transaction (all-or-nothing)
- [ ] Reviews can be submitted for completed bookings
- [ ] Review updates listing average_rating and provider trust_score
- [ ] Admin dashboard shows analytics
- [ ] Admin can approve/reject providers
- [ ] Admin can moderate listings
- [ ] Admin can manage users (ban/suspend/reinstate)
- [ ] Admin can manage categories (CRUD)
- [ ] Admin can resolve disputes
- [ ] Notifications page shows in-app notifications
- [ ] All 7 backend test suites pass

---

## 9. CODING STANDARDS

1. **Backend:** CommonJS (`require`/`module.exports`), async/await, Express error handling via `next(error)`
2. **Frontend:** ES Modules (`import`/`export`), React 18 functional components, hooks only
3. **CSS:** Vanilla CSS with CSS custom properties (no Tailwind), dark-friendly color palette
4. **Validation:** Backend uses `express-validator`, frontend uses `zod` + `react-hook-form`
5. **Auth:** JWT in `Authorization: Bearer <token>`, stored in localStorage (rememberMe) or sessionStorage
6. **DB Queries:** Raw SQL via `pg` pool, no ORM. Parameterized queries ($1, $2...) always.
7. **File Uploads:** `multer.memoryStorage()` → `sharp` processing → local disk. No direct Cloudinary for avatars/listings (despite Cloudinary config existing).
8. **Error Responses:** `{ error: 'Short Code', message: 'Human readable' }` with appropriate HTTP status codes
9. **Notifications:** Async via `setImmediate()` after HTTP response — never block the response

---

## 10. SEED LOGIN CREDENTIALS

| Role | Email | Mobile | Password |
|------|-------|--------|----------|
| Provider | suresh@rentify.lk | 0771111111 | password123 |
| Provider | priyantha@rentify.lk | 0772222222 | password123 |
| Provider | aruna@rentify.lk | 0773333333 | password123 |
| Provider | nimal@rentify.lk | 0774444444 | password123 |
| Provider | nilmani@rentify.lk | 0775555555 | password123 |
| Provider | lanka_mach@rentify.lk | 0776666666 | password123 |
| Consumer | kasun@rentify.lk | 0777777777 | password123 |
| Admin | admin@rentify.lk | 0778888888 | password123 |

> [!NOTE]
> The login controller accepts both email and mobile as the identifier field. The frontend LoginPage sends `{ identifier, password }` where identifier can be either.

---

## 11. WHAT "DONE" LOOKS LIKE

When this project is complete:
1. Every page renders without console errors
2. Every API endpoint returns correct data (no 500s)
3. All 7 backend test suites pass (`npm test`)
4. The frontend builds without warnings (`npm run build`)
5. All Jira user stories function end-to-end as described in their acceptance criteria
6. Admin pages are fully functional (not stubs)
7. Notifications and messaging pages show real data
8. Images on all listing pages come from the database `photos` JSONB column
9. Profile management works completely (edit, save, avatar upload)
10. The provider dashboard shows real data and provides working navigation to all provider features
