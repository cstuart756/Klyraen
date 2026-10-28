# Klyraen — Product Requirements Document

## 1. Problem
Independent musicians and content creators need complete songs (vocals + lyrics +
melody + harmony + instrumental arrangement) but lack the production skills,
studio access, or budget to produce them. Existing AI music tools generate
instrumentals or short clips — not complete songs with singing vocals and
coherent lyrics.

## 2. Core value proposition
Describe a song in natural language → Klyraen delivers a complete, downloadable
song with vocals, lyrics, melody, harmony, and arrangement, in a consistent
musical key, tempo, and style, ready for release or licensing.

## 3. Users & roles
| Role              | Description                                       | Key need                                    |
|-------------------|---------------------------------------------------|---------------------------------------------|
| Creator           | Singer-songwriter, content creator, indie producer| Fast, complete songs from a prompt          |
| Team owner        | Creator on a paid plan inviting collaborators     | Shared library, usage tracking              |
| Workspace admin   | Manages billing and team members                  | Usage/cost visibility, plan management      |
| Platform admin    | Klyraen operator                                  | Support access, analytics, moderation       |

## 4. In scope (MVP)
- Prompt → full song (vocals + lyrics + instrumental).
- Style controls: genre, mood, BPM, key, language.
- Song library with playback and download.
- Subscription billing with usage metering.
- Team workspaces (multi-tenant).

## 5. Non-goals (explicit)
- Real-time collaborative editing.
- Marketplace / monetization of user songs.
- Native mobile apps.
- Custom model fine-tuning.
- Self-hosting / on-premise deployment.
- Real-time karaoke / interactive stem separation UI.
- Multi-language UI (English only at launch).

## 6. Success metrics (first 90 days)
- Activation: ≥40% of signups generate ≥1 song within 24h.
- Retention: ≥25% of week-1 users return in week 2.
- Conversion: ≥5% of free users upgrade to paid.
- Reliability: 99.5% generation-job success; p95 playback start < 800ms.

## 7. Constraints
- Generation is asynchronous: 30-180s per song. Must be queue-based, never
  synchronous in an HTTP request (Heroku router timeout is 30s).
- Heroku dynos are ephemeral: all audio assets go to S3-compatible object
  storage, never local disk.
- Multi-tenant from day one: every tenant-scoped table carries `tenant_id`.

## 8. MoSCoW summary
See `feature-backlog-moscow.md`. Must-Haves total 60 points of 100-point
capacity, satisfying the 60/20/20 capacity rule.