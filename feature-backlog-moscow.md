# Klyraen — MoSCoW Feature Backlog (MVP)

Capacity budget: 100 story points. Must ≤ 60 / Should ≤ 20 / Could ≤ 20.

## Must Have (60 pts) — MVP fails without these

| #  | Feature                                       | Pts | Business justification                                                                                  |
|----|-----------------------------------------------|-----|--------------------------------------------------------------------------------------------------------|
| M1 | Sign-up / sign-in + tenant onboarding         | 10  | Without identity + tenant scoping there is no product. Clerk gives tenant-aware auth in <1 day.        |
| M2 | Prompt composer → generation job submission   | 12  | Core value proposition. Nothing else matters if users can't request a song.                            |
| M3 | Async generation worker + status polling      | 12  | Generation takes 30-180s. Synchronous HTTP times out on Heroku (30s router limit). Queue is mandatory. |
| M4 | Song library + playback                       | 8   | Users must be able to hear/see what they generated, or the loop is broken.                             |
| M5 | Durable asset storage (S3-compatible)         | 5   | Heroku dynos are ephemeral — local files are lost on restart. Audio must persist.                      |
| M6 | Billing: Stripe subscription + usage metering | 10  | No billing = no business. Gates usage limits so cost per user is bounded.                              |
| M7 | Dashboard + per-plan usage limits             | 3   | Without limits, one free user can burn the AI-provider budget.                                         |

## Should Have (20 pts) — expected in the first paid release

| #  | Feature                                       | Pts | Business justification                                                                                  |
|----|-----------------------------------------------|-----|--------------------------------------------------------------------------------------------------------|
| S1 | Lyrics editor before generation               | 8   | Users who can edit lyrics are far more likely to publish and stay. Strong retention lever.             |
| S2 | Style presets (genre/mood/BPM/key)            | 6   | Reduces prompt-engineering friction; new users get decent results without skill.                       |
| S3 | Public share link (read-only)                 | 6   | Cheapest acquisition loop; shared songs bring unauthenticated viewers into the funnel.                 |

## Could Have (20 pts) — nice-to-have, cut first if timeline slips

| #  | Feature                                       | Pts | Business justification                                                                                  |
|----|-----------------------------------------------|-----|--------------------------------------------------------------------------------------------------------|
| C1 | Stem export (vocals / drums / bass / other)   | 8   | High value for pro users; not required to prove the core loop.                                         |
| C2 | Regenerate one section (verse/chorus)         | 6   | Improves output quality, but full regenerate is a fine v1 substitute.                                  |
| C3 | Voice style selector (male/female/child/raspy) | 6  | Broadens appeal; default voice is acceptable for MVP.                                                  |

## Won't Have (this release) — explicitly out of scope

| #  | Feature                              | Reason                                                                     |
|----|--------------------------------------|-----------------------------------------------------------------------------|
| W1 | Real-time collaborative editing      | Multi-user CRDT/Yjs infrastructure is a whole product of its own.           |
| W2 | Marketplace / sell songs             | Requires payouts, tax handling, moderation, copyright review — legal risk.  |
| W3 | Native iOS/Android apps              | PWA + responsive web covers 95% of use; app-store overhead not justified.   |
| W4 | Custom model fine-tuning             | Hosted provider only; fine-tuning is a post-PMF bet.                        |
| W5 | Self-hosted / on-prem                | SaaS-only model; no enterprise on-prem demand yet.                          |
| W6 | Multi-language UI                    | English first; localization is a scale problem, not a launch problem.       |
| W7 | Social feed / following              | Duplicates share-link value (S3) at 10× the complexity.                     |