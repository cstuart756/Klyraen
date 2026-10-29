# Klyraen Operations Runbook

This document outlines the standard operating procedures for the Klyraen platform.

## Rollback a Bad Deploy
If a new deployment introduces a critical bug, roll back to the previous stable release immediately:
1. Check recent releases: heroku releases -a klyraen-staging
2. Roll back to the previous version (e.g., v35): heroku releases:rollback v35 -a klyraen-staging

## Rotate Secrets (Every 90 Days)
If a key is compromised or hits its expiration, rotate it immediately.

### Clerk (Auth)
1. Go to the Clerk Dashboard -> API Keys.
2. Rotate the Publishable and Secret keys.
3. Update Heroku: heroku config:set CLERK_SECRET_KEY=sk_test_... -a klyraen-staging
4. Rebuild: git commit --allow-empty -m "chore: rebuild for clerk rotation" && git push heroku main

### Stripe (Billing)
1. Go to Stripe Dashboard -> Developers -> API Keys -> Roll Key.
2. Update Heroku: heroku config:set STRIPE_SECRET_KEY=sk_test_... -a klyraen-staging
3. Restart web dynos: heroku restart -a klyraen-staging

### Replicate (AI)
1. Go to Replicate -> API Tokens -> Delete and create new.
2. Update Heroku: heroku config:set REPLICATE_API_TOKEN=r8_... -a klyraen-staging
3. Restart worker dynos: heroku ps:scale worker=0 -a klyraen-staging && heroku ps:scale worker=1 -a klyraen-staging

## Monitoring and Logs
To watch live traffic and worker activity: heroku logs --tail -a klyraen-staging
To check the health of the database: heroku pg:info -a klyraen-staging

## Scaling and Costs
- Web Dyno: heroku ps:scale web=1 -a klyraen-staging
- Worker Dyno: heroku ps:scale worker=1 -a klyraen-staging
- To save costs during development, scale the worker to 0 when not in use.