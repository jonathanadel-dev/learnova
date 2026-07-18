# Architecture — Learnova

> Stable, settled decisions. Updated rarely — only when a decision is finalized and implemented. Full reasoning lives in ADRs (`docs/decisions/`); this file is the quick-reference index, not the reasoning itself.
> Verified against the `auth-system` branch on 2026-07-18 — reflects actual code, not assumptions.

## Stack
Next.js 16.2.10 (App Router) · React 19.2 · TypeScript · Tailwind v4 · shadcn/ui (`@base-ui/react`) · lucide-react · PostgreSQL + Prisma 7 (`prisma-client` generator, custom output to `app/generated/prisma`, `@prisma/adapter-pg`) · Zod v4 (imported via `zod/v3` compat namespace) · react-hook-form · pnpm · Vercel

## Core model (implemented)
- **User** is unified — capability derives from profile existence, not a role field (ADR 0001).
  - `StudentProfile` / `InstructorProfile` are optional 1:1 relations off `User`, both `onDelete: Cascade`.
  - `systemRole` (`USER` / `ADMIN`) is a separate enum — permission tier only, unrelated to student/instructor capability.
- `emailVerified` is a `DateTime?` (not a boolean) — null means unverified, a timestamp means verified.
- No `Course`, `Enrollment`, or `LessonProgress` models yet — schema currently covers auth only.

## Auth (implemented)
- Hand-rolled JWT via **jose** + **bcryptjs**, not NextAuth (ADR 0002).
- Session cookie: `learnova_session`, httpOnly, `secure` in production, `sameSite: lax`, 30-day maxAge.
- JWT payload shape (`lib/auth/jwt.ts`): `userId`, `hasStudentProfile`, `hasInstructorProfile`, `currentProfile`, `systemRole`, `emailVerified`.
- Route protection lives in **`proxy.ts`** (root-level, Next.js 16's renamed middleware convention — runs on **Node.js runtime by default** in Next 16, not Edge).
  - Matcher covers `/signup`, `/login`, `/student/:path*`, `/instructor/:path*`, `/admin/:path*`.
  - Redirects logged-in users away from `/signup` and `/login`.
  - Gates `/student` and `/instructor` on profile existence, redirecting to onboarding routes if the profile doesn't exist yet (**onboarding pages not built yet** — proxy references `/student/onboarding` and `/instructor/onboarding`, neither exists in the app tree yet).
  - Gates `/admin` on `systemRole === 'ADMIN'`.
- Signup (`app/api/auth/signup/route.ts`) and login (`app/api/auth/login/route.ts`) both validate with Zod (`lib/schemas/auth.ts`) and use a shared `AppError` class (`lib/errors.ts`) for typed error responses.
- Email collision handling (ADR 0003): signup checks `emailVerified` inside a `prisma.$transaction` — verified existing row → reject; unverified existing row → delete then create fresh.

## Route structure (implemented so far)
- `app/(auth)/login`, `app/(auth)/signup` — public auth pages.
- `app/(public)/home`, `app/(public)/` — public/landing pages.
- `app/(dashboard)/instructor` — single instructor dashboard page exists; no student dashboard yet.
- `app/api/auth/{login,signup}` — the only API routes so far.

## Tooling / process
- CodeRabbit for automated PR review.
- Conventional Commits + feature-branch workflow.
- ADRs live in `docs/decisions/` on `main`.

## Planned (not yet built)
- Student/instructor onboarding flows (referenced by `proxy.ts`, not yet implemented).
- Course creation and the full course/lesson/enrollment data model.
- In-lesson auto-graded code exercises via Judge0 API + Monaco editor — parked until auth is complete.

## ADR index
- ADR 0001: Capability via profile existence, not a role field
- ADR 0002: Hand-rolled JWT auth via jose + bcryptjs, not NextAuth
- ADR 0003: Email collision — reclaim via `emailVerified`, not a hard unique reject

---
*Last updated: 2026-07-18*
