$readmeCode = @'
# 🎵 Klyraen | AI Music Studio

**Live Demo:** [https://klyraen-staging-0d2d4236213e.herokuapp.com](https://klyraen-staging-0d2d4236213e.herokuapp.com)

![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white)
![Heroku](https://img.shields.io/badge/Heroku-430098?style=for-the-badge&logo=heroku&logoColor=white)

Klyraen is a production-ready, multi-tenant B2B SaaS platform that transforms natural language descriptions into AI-generated music. Built from zero to deployment, the platform features a stunning "Cyberpunk" UI, asynchronous background processing, and enterprise-grade tenant isolation.

---

## 📸 Application Preview

*(Save a screenshot of your Studio page as `assets/studio-preview.png` in your repo to make this show up!)*
![Klyraen Studio UI](assets/studio-preview.png)

---

## ✨ Core Features

*   **Prompt-to-Music Generation:** Users describe the vibe, and Meta's MusicGen AI (via Replicate) generates a 15-second audio track.
*   **Asynchronous Job Queue:** AI generation takes 30–60 seconds. Built a robust BullMQ + Redis worker system to process jobs in the background, preventing HTTP timeouts.
*   **Multi-Tenant Architecture:** Every database table is strictly scoped to a `tenantId`. Users are automatically provisioned a "Personal Workspace" upon signup using Clerk Organizations.
*   **Real-Time Polling:** The frontend polls the API to update the UI from `QUEUED` -> `PROCESSING` -> `COMPLETED` without requiring the user to refresh.
*   **Dynamic Audio Visualizers:** Built entirely with CSS and React, featuring animated waveform bars and a glowing neon ring.
*   **Tiered Billing Flow:** Integrated Stripe Checkout to handle subscription upgrades for the "Pro" plan.

---

## 🏗️ Architecture & System Design

This application is not just a frontend wrapper. It is a fully decoupled system designed for scale.

### The Asynchronous Flow
1. **Client:** The React frontend sends a `POST /api/generate` request.
2. **API:** Validates the user, checks tenant credits, writes a `QUEUED` record to PostgreSQL, and pushes a job to Redis.
3. **Worker:** A separate Node.js dyno picks up the job from Redis, calls the Replicate API, waits for the AI to finish, and updates the Postgres record to `COMPLETED`.
4. **Client:** The frontend polls `GET /api/generations/[id]` and renders the audio player when ready.

```mermaid
sequenceDiagram
    participant User
    participant NextJS as Next.js API
    participant Postgres
    participant Redis
    participant Worker
    participant AI as Replicate (MusicGen)

    User->>NextJS: POST /api/generate
    NextJS->>Postgres: Create Generation (Status: QUEUED)
    NextJS->>Redis: Enqueue Job
    NextJS-->>User: Return Generation ID

    Redis->>Worker: Pick up job
    Worker->>Postgres: Update (Status: PROCESSING)
    Worker->>AI: Generate Audio
    AI-->>Worker: Audio URL
    Worker->>Postgres: Update (Status: COMPLETED, URL)

    User->>NextJS: GET /api/generations/[id] (Polling)
    NextJS-->>User: Returns URL
```

## 🎨 UI/UX & Design Documentation

Klyraen uses a custom dark-mode design system based on the "Cyberpunk / Neon" aesthetic, featuring glassmorphism, gradient text, and CSS-based audio visualizers.
Wireframes (Phase 2)

(If you saved your wireframes to docs/wireframes/, they will appear here!)

    View Onboarding Flow

    View Composer UI

    View Billing Flow

Database Schema (Phase 2)

The database is designed for multi-tenancy. Each Generation and Song is tied to a Tenant (Workspace), not just a User.

    View the Entity-Relationship Diagram (ERD)

    Read the Multi-Tenancy Design Doc

💻 Tech Stack

Frontend:

    Next.js 16 (App Router, Server Components)

    React 19

    Tailwind CSS (Custom Design System)

    Lucide React (Icons)

Backend & Database:

    Node.js (Custom Express-style API Route Handlers)

    PostgreSQL (Hosted on Heroku)

    Prisma ORM (Schema migrations and type-safe queries)

Infrastructure & Services:

    Auth: Clerk (User management, Organizations)

    Queue/Worker: Redis + BullMQ

    AI Generation: Replicate API (Meta MusicGen)

    Billing: Stripe (Checkout & Webhooks)

    Deployment: Heroku (Dockerless Node.js buildpack, Web + Worker Dynos)

    CI/CD: GitHub Actions (Automated build checks on PRs)

🚀 Local Setup Instructions
1. Prerequisites

    Node.js (v20+)

    PostgreSQL

    Redis (Run via Docker: docker run -p 6379:6379 redis)

2. Environment Variables

Create a .env file in the root directory:
env

# Database
DATABASE_URL="postgresql://user:password@localhost:5432/klyraen"
REDIS_URL="redis://localhost:6379"

# Clerk Auth
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_..."
CLERK_SECRET_KEY="sk_test_..."

# AI Provider (Replicate)
REPLICATE_API_TOKEN="r8_..."

# Stripe Billing
STRIPE_SECRET_KEY="sk_test_..."
NEXT_PUBLIC_APP_URL="http://localhost:3000"

3. Installation
bash

# Clone the repository
git clone https://github.com/cstuart756/Klyraen.git
cd Klyraen

# Install dependencies
npm install

# Run database migrations
npx prisma generate
npx prisma migrate dev

# Start the Next.js frontend
npm run dev

# In a separate terminal, start the background worker
npm run worker

🛡️ Production Operations

This project includes a comprehensive RUNBOOK.md detailing:

    How to rollback a bad deploy.

    How to rotate Clerk, Stripe, and Replicate API keys.

    How to monitor Heroku dynos and database health.

🗺️ Future Roadmap (v2.0)

    Audio Processing: Integrate LALAL.AI for high-quality stem separation (isolating vocals from instrumentals).

    Real Vocals: Swap the instrumental MusicGen model for Suno/ElevenLabs APIs to generate full songs with lyrics and singing vocals.

    Direct DSP Distribution: Integrate a white-label distributor (like Revelator) to allow users to publish their AI tracks directly to Spotify and Apple Music.

    S3 Storage: Move generated .mp3 files from temporary Replicate URLs to long-term AWS S3 buckets.
    '@
    [IO.File]::WriteAllText("PWD\README.md", readmeCode, [System.Text.UTF8Encoding]::new($false))   