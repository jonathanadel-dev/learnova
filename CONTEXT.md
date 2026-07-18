# Context — Learnova

> Paste this file (plus any relevant source files) at the start of a session with any AI tool. Keep it short — this is "what an AI needs to know right now," not a history log. Stable, settled decisions belong in ARCHITECTURE.md, not here.

## What Learnova is
Full-stack LMS for adult self-learners. Next.js 16 (App Router), React 19, TypeScript, Tailwind v4, shadcn/ui, PostgreSQL + Prisma, pnpm, Vercel.
Repo: github.com/jonathanadel-dev/learnova · Live: learnova-delta.vercel.app
Active branch as of last check: `auth-system`

## Current focus
- Core signup/login/session flow is implemented (JWT via jose, httpOnly cookie, bcryptjs).
- Route protection via `proxy.ts` is in place for `/signup`, `/login`, `/student`, `/instructor`, `/admin`.
- Not yet built: `/student/onboarding` and `/instructor/onboarding` pages — `proxy.ts` already redirects to them, so these are the next real gap.
- Email verification flow itself (sending the email) is stubbed out — see commented-out `sendVerificationEmail` call in the signup route.

## Recent decisions
<!-- Only decisions relevant to what you're currently building. Move resolved/stable ones to ARCHITECTURE.md or delete. -->
-

## Known gotchas
- `emailVerified` on `User` is a `DateTime?`, not a boolean — check for `null` vs. a timestamp, don't treat it as truthy/falsy shorthand without knowing that.
- Zod is imported from `zod/v3` (compat namespace) even though the package is Zod v4 — don't assume v4 top-level API without checking which namespace a given file imports from.
- Prisma client output is customized to `app/generated/prisma` (not the default location) — imports and any tooling assuming the default path will break.
- `proxy.ts` runs on Node.js runtime by default (Next.js 16), not Edge — don't reason about it as if it's Edge-constrained.

## Not doing
<!-- Explicit exclusions, so a fresh AI doesn't suggest them. -->
- No NextAuth — auth is hand-rolled with jose + bcryptjs (ADR 0002).
- No role field — capability derives from profile existence (ADR 0001).
- No password-presence check for email collision — collision handling is based purely on `emailVerified` (ADR 0003).

---
*Last updated: 2026-07-18*
