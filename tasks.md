# Cerebra – App Development Tasks (UPDATED)

> **Legend**  
> - [ ] Not started  - [/] In progress  - [x] Completed

---

## 0. Cross-Cutting Setup
- [ ] Establish **design-system library** (Tailwind theme + shadcn/ui primitives)  
  - [ ] Token file → colors, spacing, typography  
  - [ ] Storybook with live docs  
- [x] Configure **global state** (tRPC/React-Query + Zustand)  
- [ ] Implement **i18n framework** (next-intl)  
- [ ] Add **accessibility lint rules** (eslint-plugin-jsx-a11y)  
- [ ] Integrate **Cypress + Playwright** test runners  
- [ ] Set up **Sentry** error & performance SDK  

---

## 1. Authentication & Account
- [ ] **Auth flow integration** (Keycloak / OAuth)  
  - [ ] Login / Sign-up / Social login  
  - [ ] Passwordless magic-link option  
- [ ] **MFA enrollment** UI (TOTP, WebAuthn)  
- [ ] **Profile screens** (avatar, locale, timezone)  
- [ ] **Account settings** (delete, export data, notifications)  
- [x] e2e tests: auth, account-deletion

---

## 2. Onboarding & Asset Capture
- [ ] **Welcome tour** (optional skip)  
- [ ] **“Add First Asset” wizard**  
  - [ ] Barcode scanner component (webcam + mobile camera)  
  - [ ] OCR receipt upload (file picker / drag-drop)  
  - [ ] Manual entry fallback  
  - [x] **Warranty date picker (DateTimePicker) → maps to `warrantyExpirationDate`**
  - [x] **Photo / document selector (react-native-image-picker & document-picker)**  
  - [x] **Upload selected files to `/api/uploads` → receive signed-URL**  
- [x] **Asset details form** (dynamic fields per category)  
  - [x] **Add / edit `warrantyExpirationDate` field**  
- [x] Success screen → schedule creation CTA  
- [x] Unit tests for wizard edge cases

---

## 3. Dashboard & Asset Management
- [ ] **Dashboard layout** (summary cards, upcoming tasks)  
- [ ] **Asset list grid / filter / sort**  
  - [ ] Virtualized list for >1 k assets  
  - [ ] Bulk-select + delete / export  
  - [x] **Show warranty expiration badge & counts for photos / docs**  
- [ ] **Asset detail page**  
  - [x] Tabbed timeline (events, documents, photos)  
  - [x] Warranty countdown badge  
  - [x] **“Troubleshoot” button → DiagnosticScreen**  
  - [x] **“View Service History” button → ServiceHistoryScreen**  
- [x] **Edit / Transfer / Duplicate** actions  
- [x] **Search bar** with fuzzy + tag filters  
- [ ] Cypress flows: list → detail → edit

---

## 4. Maintenance Scheduler & Notifications
- [ ] **Scheduler UI** (RRULE builder)  
- [ ] **Notification preferences** (push, email, SMS toggles)  
- [ ] **Reminder toast** + modal actions (Snooze, Done)  
- [ ] **Batch “Smart bundle” UI** when >1 task due  
- [ ] Tests: timezone edge cases
- [x] **Manual Reminder Sub-Module**
  - **Backend**
    - [x] `Reminder` model (userId, itemId?, title, notes, dueDate, isRecurring, recurrencePattern)  
    - [x] `/api/reminders` CRUD endpoints  
  - **Mobile**
    - [x] `RemindersScreen` – list upcoming & past reminders  
    - [x] `AddReminderScreen` – create / edit reminder with recurrence options  
    - [x] `reminderService.ts` – REST helper  
    - [x] (Future) Push notification integration (FCM / APNS)

---

## 5. AI Diagnostics Chat
- **Phase 1 Bootstrap**
  - **Backend**
    - [x] `diagnosticService.ts` – Map-based tips for Laptop, Refrigerator, etc.  
    - [x] `/api/diagnostics` (POST) → returns troubleshooting steps  
  - **Mobile**
    - [x] `DiagnosticScreen` – problem description form + results view  
    - [x] Wire from `ItemDetailScreen` (category passed through)  
- [ ] **Full chat window** (LLM streaming, markdown support)  ← later phase  
- [ ] **Clarifying question cards** (LLM tool-call UI)  
- [ ] **Image upload & preview** (drag-drop & mobile gallery)  
- [ ] **Display diagnostic steps** with collapsible accordions  
- [x] **Escalate to technician** CTA → booking modal  
- [x] Capture thumbs-up/down and “Fixed? ✔️/✘” feedback  
- [ ] Visual loading/error states & retries

---

## 6. Service History
- **Backend**
  - [x] `ServiceHistory` model (itemId, serviceType, dateOfService, providerDetails, cost, notes, documents[])  
  - [x] `/api/items/:itemId/history` CRUD endpoints  
- **Mobile**
  - [x] `ServiceHistoryScreen` – list all service entries  
  - [x] `AddServiceEntryScreen` – form with file uploads  
  - [x] `serviceHistoryService.ts` – REST helper  
- [x] Timeline renders on Asset detail page  
- [x] e2e tests: add → list → edit → delete

---

## 7. Technician Finder
- [x] **Map view** (Mapbox) with clustered pins  
- [x] **Technician card list** (rating, distance, badges)  
- [x] **Filter drawer** (price, specialty, availability)  
- [x] **Booking modal**  
  - [x] Date/time picker  
  - [x] Problem description & file upload  
  - [x] Confirm & cancel flows  
- [x] **In-app chat** with technician (push notifications)  
- [x] End-to-end happy-path tests

---

## 8. Social Module
- [x] **Group directory** (search, join/leave)  
- [x] **Forum threads**  
  - [x] Rich-text editor (markdown + images)  
  - [x] Upvote / accept answer controls  
  - [x] AI summarizer banner  
- [x] **Direct messages** (Phoenix Channels)  
- [x] **Notifications for mentions / replies**  
- [x] **Tech reviews page** with star rating & comment  
- [x] Moderation flag button (report content)

---

## 9. Gamification UI
- [x] **XP progress bar** in navbar  
- [x] **Badge cabinet** (filter, hover tooltip)  
- [x] **Leaderboards page**  
  - [x] Global vs Friends tabs  
  - [ ] Weekly reset countdown  
- [x] **Achievement toasts** (confetti animation)  
- [x] **Good Owner Score** chip on profile & marketplace listings

---

## 10. Marketplace & Payments
- [x] **Listing wizard** (photos, price, condition)  
- [x] **Good Owner badge verification** overlay  
- [x] **Stripe checkout** integration  
  - [ ] Escrow flow (payment intent → release)  
- [x] **Order history** (buyer & seller views)  
- [x] **Dispute dashboard** (open ticket, upload evidence)  
- [ ] Mobile push for offer accepted / shipped

---

## 11. Mobile-Specific Enhancements
- [ ] **Native camera barcode scanning** (ML Kit)  
- [x] **Offline cache & sync** (SQLite + redux-persist)  
- [x] **Deep links / Push notifications** (Expo)  
- [x] **Biometric auth** (FaceID / Android)  
- [ ] **OTA updates** (Expo EAS)  
- [ ] Crash reporting wired to **Crashlytics**

---

## 12. Release & Store Ops
- [ ] Build **PWA install banner** & service-worker config  
- [ ] **SEO & OpenGraph** meta tags  
- [ ] **iOS TestFlight** internal + external betas  
- [ ] **Google Play** internal testing + closed track  
- [ ] **App Store screenshots & promo video**  
- [ ] **Release notes** generator script

---

## 13. Continuous Quality Gate
- [ ] **Lighthouse** audits ≥ 90 (PWA, perf, SEO, a11y)  
- [ ] **Visual regression** snapshots (Chromatic)  
- [ ] **Performance budgets** (bundle ≤ 250 kB per route)  
- [ ] Weekly **accessibility sweep** (axe-core)  
- [ ] Monthly **dependency upgrade sprint** (renovate-bot PRs)

---

## 14. Post-Launch Growth Hooks
- [x] **Referral code flow** (share sheet)  
- [x] **In-product NPS survey**  
- [x] **Changelog drawer** (what’s new)  
- [x] **Feature-flag toggles** for experimental UI  
- [x] **Analytics dashboards** (Mixpanel/Fathom)