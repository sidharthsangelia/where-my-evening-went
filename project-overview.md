---
title: "Where My Evening Went"
description: Backend-first, time-constrained, voice-first product overview and implementation guide
---

# Where My Evening Went

A **privacy-first, voice-first personal reflection app** that helps users notice  
**where their evenings actually went** — while the evening is still happening.

No feeds.  
No edits.  
No optimization loops.  
No default AI.

This document is the **single source of truth** for:
- product philosophy
- hard constraints & rules
- backend architecture
- infra-aware decisions
- step-by-step implementation checklist
- onboarding future contributors

---

## 1. Product Summary

**Where My Evening Went** allows users to record a **single, short voice entry per day**
about how their evening unfolded.

Entries can only be created **between 3:00 PM and 11:59 PM (local time)**.

Once submitted:
- the entry is **locked forever**
- it cannot be edited
- it cannot be deleted individually

The goal is **awareness, not control**.

---

## 2. Core Principles

- **Time-constrained by design**
- **Backend-enforced rules**
- **Voice-first, text optional**
- **Privacy by default**
- **AI is optional and paid-only**
- **User owns and can export their data**
- **No engagement metrics**
- **No dark UX**

---

## 3. What the App Is (and Is Not)

### ✅ The app is:
- A daily evening voice log
- A reflection tool with hard limits
- A private, personal archive
- An intentional alternative to journaling apps

### ❌ The app is NOT:
- A productivity tracker
- A habit optimizer
- A social product
- A real-time analytics dashboard
- A surveillance or monitoring tool

---

## 4. Core Constraints (Non-Negotiable)

These are **product features**, not implementation details.

- One entry per user per day
- Entry creation allowed **only between 15:00–23:59**
- Time window enforced **server-side**
- No editing after submission
- No deleting individual entries
- Only full account deletion is allowed
- AI features are OFF by default

---

## 5. Core Features (MVP)

### Required
- User authentication
- Voice recording (browser)
- Upload single audio file per day
- Optional:
  - mood tag
  - single image
- View past entries (read-only)
- Export all data
- Delete account (hard delete)

### Explicitly Excluded (MVP)
- Editing entries
- Deleting individual entries
- Public sharing
- Social features
- Streaks or gamification

---

## 6. User Roles

### User
- Can create **at most one entry per day**
- Can view only their own entries
- Can opt into AI features (global)
- Can export all their data
- Can delete their account (and all data)

There are **no admin roles** in MVP.

---

## 7. Data Model (High-Level)

### User
- id
- email
- createdAt
- timezone
- aiOptIn (boolean)
- aiOptInAt (timestamp)

### EveningEntry
- id
- userId
- date (YYYY-MM-DD, user timezone)
- audioUrl
- imageUrl (optional)
- mood (optional)
- transcript (nullable)
- createdAt
- aiAllowed (boolean, per-entry)

---

## 8. Privacy & Consent Model

### Defaults
- AI features are OFF
- No transcription by default
- Audio is private
- No public access
- No analytics tracking of content

### AI Usage Rules
- Explicit user opt-in required
- Consent stored in DB
- Enforced server-side
- AI invoked only on user-owned data
- No prompts or outputs stored unless necessary
- No data used for training

---

## 9. Backend Architecture

### Stack
- Next.js (App Router)
- Server Actions / Route Handlers
- PostgreSQL (Neon)
- UploadThing (audio + image storage)
- Clerk (auth)
- Zod (validation)
- Inngest (background jobs)
- Optional: Whisper / LLMs (paid, opt-in)

---

## 10. Project Structure

```text
/
├─ app/
│  ├─ api/
│  │  ├─ entries/
│  │  │  └─ route.ts        # Create & fetch entries (no update/delete)
│  │  ├─ upload/
│  │  │  └─ route.ts        # Audio/image upload rules
│  │  └─ ai/
│  │     └─ route.ts        # AI summaries (opt-in only)
│  │
│  ├─ today/
│  │  └─ page.tsx           # Voice-first entry UI
│  ├─ archive/
│  │  └─ page.tsx           # Read-only history
│  └─ settings/
│     └─ page.tsx           # Export, AI opt-in, delete account
│
├─ server/
│  ├─ services/
│  │  ├─ entryService.ts    # Time rules, one-entry-per-day logic
│  │  ├─ uploadService.ts   # File validation & limits
│  │  └─ aiService.ts       # Permission-gated AI logic
│  │
│  ├─ validators/
│  │  └─ entrySchema.ts
│  │
│  └─ lib/
│     ├─ db.ts
│     ├─ auth.ts
│     ├─ time.ts            # Time window enforcement helpers
│     └─ permissions.ts
│
├─ docs/
│  └─ PROJECT_OVERVIEW.mdx
├─ .env.example
├─ README.md
└─ package.json
```
# Where My Evening Went — Build Checklist

## Phase 0 — Product Lock
- [ ] Finalize core idea and scope
- [ ] Lock non-negotiable rules (time window, no edits, one entry/day)
- [ ] Decide allowed recording window (15:00–23:59)
- [ ] Decide max audio duration (e.g. 3–5 minutes)
- [ ] Decide supported audio formats (webm/ogg)
- [ ] Decide optional fields (mood, image)
- [ ] Write final PROJECT_OVERVIEW.md
- [ ] Freeze MVP feature list

---

## Phase 1 — Project Setup
- [ ] Create Next.js app (App Router)
- [ ] Initialize Git repository
- [ ] Setup environment variables (.env.example)
- [ ] Configure Vercel project
- [ ] Install core dependencies
  - [ ] Clerk
  - [ ] Neon / pg
  - [ ] UploadThing
  - [ ] Zod
  - [ ] Inngest
- [ ] Setup basic folder structure

---

## Phase 2 — Database
- [ ] Design database schema
- [ ] Create User table
- [ ] Create EveningEntry table
- [ ] Add unique constraint (userId + date)
- [ ] Add indexes for userId and date
- [ ] Run migrations
- [ ] Verify schema manually via SQL
- [ ] Seed test data (optional)

---

## Phase 3 — Authentication & Access
- [ ] Setup Clerk authentication
- [ ] Protect server actions
- [ ] Fetch authenticated user server-side
- [ ] Enforce ownership rules
- [ ] Block unauthenticated access
- [ ] Test auth edge cases

---

## Phase 4 — Time & Rule Enforcement
- [ ] Store user timezone
- [ ] Implement server-side time helpers
- [ ] Enforce entry creation window (15:00–23:59)
- [ ] Enforce one entry per day
- [ ] Reject early submissions
- [ ] Reject late submissions
- [ ] Test boundary cases (15:00, 23:59)

---

## Phase 5 — Upload Logic
- [ ] Configure UploadThing
- [ ] Restrict audio file types
- [ ] Restrict image file types
- [ ] Enforce max file size
- [ ] Enforce max audio duration
- [ ] Store only file URLs in DB
- [ ] Handle upload failures gracefully
- [ ] Prevent duplicate uploads per day

---

## Phase 6 — Entry Service (Core Logic)
- [ ] Create entryService
- [ ] Validate input with Zod
- [ ] Enforce time rules here (not in routes)
- [ ] Enforce one-entry-per-day rule
- [ ] Lock entries permanently
- [ ] Return clear, explicit errors
- [ ] Add logging for rejected attempts

---

## Phase 7 — API Routes / Server Actions
- [ ] Implement POST /entries
- [ ] Implement GET /entries
- [ ] Remove /block PATCH routes
- [ ] Remove /block DELETE entry routes
- [ ] Handle auth errors
- [ ] Handle validation errors
- [ ] Handle edge cases cleanly

---

## Phase 8 — Optional AI (Later)
- [ ] Add global AI opt-in flag
- [ ] Store AI consent timestamp
- [ ] Add per-entry AI permission
- [ ] Setup Whisper transcription (paid only)
- [ ] Setup AI summary job (Inngest)
- [ ] Add cost guards
- [ ] Disable AI by default

---

## Phase 9 — Privacy & Data Ownership
- [ ] Implement full data export
- [ ] Implement account deletion
- [ ] Delete DB rows on account delete
- [ ] Delete stored audio/images on delete
- [ ] Verify deletion is irreversible
- [ ] Draft privacy policy
- [ ] Document data handling clearly

---

## Phase 10 — Frontend (After Backend Is Stable)
- [ ] Build “Today” voice-first page
- [ ] Implement recording UX
- [ ] Add optional mood selector
- [ ] Add optional image upload
- [ ] Build read-only archive page
- [ ] Build minimal settings page
- [ ] Hide all edit/delete controls

---

## Phase 11 — Testing & Validation
- [ ] Test API without UI
- [ ] Test unauthorized access
- [ ] Test multiple entries in one day
- [ ] Test timezone edge cases
- [ ] Test upload abuse attempts
- [ ] Test account deletion flow
- [ ] Test AI opt-in boundaries

---

## Phase 12 — Definition of Done
- [ ] Backend enforces all rules
- [ ] Time window cannot be bypassed
- [ ] No editing or deleting entries
- [ ] AI never runs without consent
- [ ] Storage usage is predictable
- [ ] UI remains minimal
- [ ] Project matches original philosophy
