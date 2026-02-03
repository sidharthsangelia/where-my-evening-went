# Where My Evening Went

A privacy-first, voice-first personal reflection app.

Users record a short voice entry about how their evening went, creating a private, read-only archive over time.

This repository contains the core application code and infrastructure for the project.

---

## Overview

Where My Evening Went is a lightweight web app designed for intentional daily reflection.

The experience is deliberately minimal:
- No feeds
- No social features
- No optimization loops
- No engagement mechanics

The app focuses on capturing a single moment per day and preserving it as-is.

---

## Tech Stack

**Frontend & Backend**
- Next.js (App Router)
- TypeScript
- Server Actions / Route Handlers

**Authentication**
- Clerk

**Database**
- PostgreSQL (Neon)

**File Storage**
- UploadThing (audio + optional images)

**Validation & Background Jobs**
- Zod
- Inngest

**Optional / Paid Features**
- Speech-to-text (e.g. Whisper)
- LLM-based summaries (opt-in only)

---

## Core Features (MVP)

- User authentication
- Browser-based voice recording
- One voice entry per day
- Read-only archive of past entries
- Optional metadata (mood, image)
- Full data export
- Account deletion

---

## Project Structure

```txt
/
├─ app/
│  ├─ api/            # Route handlers
│  ├─ today/          # Daily entry UI
│  ├─ archive/        # Read-only history
│  └─ settings/       # Account & data controls
│
├─ server/
│  ├─ services/       # Core business logic
│  ├─ validators/     # Zod schemas
│  └─ lib/            # DB, auth, utilities
│
├─ docs/
│  └─ PROJECT_OVERVIEW.mdx
│
├─ .env.example
├─ README.md
└─ package.json
```
Local Development

Clone the repository

Install dependencies

npm install


Create a .env.local file based on .env.example

Run the development server

npm run dev


Open http://localhost:3000
