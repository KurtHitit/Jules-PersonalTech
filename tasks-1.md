# Cerebra – App Development Tasks (UPDATED)

> **Legend**  
> - [ ] Not started  - [/] In progress  - [x] Completed

---

## 0. Cross-Cutting Setup
- [ ] Establish **design-system library** (Tailwind theme + shadcn/ui primitives)  
  - [ ] Token file → colors, spacing, typography  
  - [ ] Storybook with live docs  
- [ ] Configure **global state** (tRPC/React-Query + Zustand)  
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
- [ ] e2e tests: auth, account-deletion

---

## 2. Onboarding & Asset Capture
- [ ] **Welcome tour** (optional skip)  
- [ ] **“Add First Asset” wizard**  
  - [ ] Barcode scanner component (webcam + mobile camera)  
  - [ ] OCR receipt upload (file picker / drag-drop)  
  - [ ] Manual entry fallback  
  - **[ ] Warranty date picker (DateTimePicker) → maps to `warrantyExpirationDate`**
  - **[ ] Photo / document selector (react-native-image-picker & document-picker)**  
  - **[ ] Upload selected files to `/api/uploads` → receive signed-URL**  
- [ ] **Asset details form** (dynamic fields per category)  
  - **[ ] Add / edit `warrantyExpirationDate` field**  
- [ ] Success screen → schedule creation CTA  
- [ ] Unit tests for wizard edge cases

---

## 3. Dashboard & Asset Management
- [ ] **Dashboard layout** (summary cards, upcoming tasks)  
- [ ] **Asset list grid / filter / sort**  
  - [ ] Virtualized list for >1 k assets  
  - [ ] Bulk-select + delete / export  
  - **[ ] Show warranty expiration badge & counts for photos / docs**  
- [ ] **Asset detail page**  
  - [ ] Tabbed timeline (events, documents, photos)  
  - [ ] Warranty countdown badge  
  - **[ ] “Troubleshoot” button → DiagnosticScreen**  
  - **[ ] “View Service History” button → ServiceHistoryScreen**  
- [ ] **Edit / Transfer / Duplicate** actions  
- [ ] **Search bar** with fuzzy + tag filters  
- [ ] Cypress flows: list → detail → edit

---

## 4. Maintenance Scheduler & Notifications
- [ ] **Scheduler UI** (RRULE builder)  
- [ ] **Notification preferences** (push, email, SMS toggles)  
- [ ] **Reminder toast** + modal actions (Snooze, Done)  
- [ ] **Batch “Smart bundle” UI** when >1 task due  
- [ ] Tests: timezone edge cases
- **Manual Reminder Sub-Module**
  - **Backend**
    - [ ] `Reminder` model (userId, itemId?, title, notes, dueDate, isRecurring, recurrencePattern)  
    - [ ] `/api/reminders` CRUD endpoints  
  - **Mobile**
    - [ ] `RemindersScreen` – list upcoming & past reminders  
    - [ ] `AddReminderScreen` – create / edit reminder with recurrence options  
    - [ ] `reminderService.ts` – REST helper  
    - [ ] (Future) Push notification integration (FCM / APNS)

---

## 5. AI Diagnostics Chat
- **Phase 1 Bootstrap**
  - **Backend**
    - [ ] `diagnosticService.ts` – Map-based tips for Laptop, Refrigerator, etc.  
    - [ ] `/api/diagnostics` (POST) → returns troubleshooting steps  
  - **Mobile**
    - [ ] `DiagnosticScreen` – problem description form + results view  
    - [ ] Wire from `ItemDetailScreen` (category passed through)  
- [ ] **Full chat window** (LLM streaming, markdown support)  ← later phase  
- [ ] **Clarifying question cards** (LLM tool-call UI)  
- [ ] **Image upload & preview** (drag-drop & mobile gallery)  
- [ ] **Display diagnostic steps** with collapsible accordions  
- [ ] **Escalate to technician** CTA → booking modal  
- [ ] Capture thumbs-up/down and “Fixed? ✔️/✘” feedback  
- [ ] Visual loading/error states & retries

---

## 6. Service History
- **Backend**
  - [ ] `ServiceHistory` model (itemId, serviceType, dateOfService, providerDetails, cost, notes, documents[])  
  - [ ] `/api/items/:itemId/history` CRUD endpoints  
- **Mobile**
  - [ ] `ServiceHistoryScreen` – list all service entries  
  - [ ] `AddServiceEntryScreen` – form with file uploads  
  - [ ] `serviceHistoryService.ts` – REST helper  
- [ ] Timeline renders on Asset detail page  
- [ ] e2e tests: add → list → edit → delete

---

## 7. Technician Finder
- [ ] **Map view** (Mapbox) with clustered pins  
- [ ] **Technician card list** (rating, distance, badges)  
- [ ] **Filter drawer** (price, specialty, availability)  
- [ ] **Booking modal**  
  - [ ] Date/time picker  
  - [ ] Problem description & file upload  
  - [ ] Confirm & cancel flows  
- [ ] **In-app chat** with technician (push notifications)  
- [ ] End-to-end happy-path tests

---

## 8. Social Module
- [ ] **Group directory** (search, join/leave)  
- [ ] **Forum threads**  
  - [ ] Rich-text editor (markdown + images)  
  - [ ] Upvote / accept answer controls  
  - [ ] AI summarizer banner  
- [ ] **Direct messages** (Phoenix Channels)  
- [ ] **Notifications for mentions / replies**  
- [ ] **Tech reviews page** with star rating & comment  
- [ ] Moderation flag button (report content)

---

## 9. Gamification UI
- [ ] **XP progress bar** in navbar  
- [ ] **Badge cabinet** (filter, hover tooltip)  
- [ ] **Leaderboards page**  
  - [ ] Global vs Friends tabs  
  - [ ] Weekly reset countdown  
- [ ] **Achievement toasts** (confetti animation)  
- [ ] **Good Owner Score** chip on profile & marketplace listings

---

## 10. Marketplace & Payments
- [ ] **Listing wizard** (photos, price, condition)  
- [ ] **Good Owner badge verification** overlay  
- [ ] **Stripe checkout** integration  
  - [ ] Escrow flow (payment intent → release)  
- [ ] **Order history** (buyer & seller views)  
- [ ] **Dispute dashboard** (open ticket, upload evidence)  
- [ ] Mobile push for offer accepted / shipped

---

## 11. Mobile-Specific Enhancements
- [ ] **Native camera barcode scanning** (ML Kit)  
- [ ] **Offline cache & sync** (SQLite + redux-persist)  
- [ ] **Deep links / Push notifications** (Expo)  
- [ ] **Biometric auth** (FaceID / Android)  
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
- [ ] **Referral code flow** (share sheet)  
- [ ] **In-product NPS survey**  
- [ ] **Changelog drawer** (what’s new)  
- [ ] **Feature-flag toggles** for experimental UI  
- [ ] **Analytics dashboards** (Mixpanel/Fathom)
