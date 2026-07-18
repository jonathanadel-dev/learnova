# ADR 0002: Hand-Rolled JWT Auth via jose + bcryptjs, Not NextAuth

## Status
Accepted

## Context
Next.js projects default to NextAuth (Auth.js) for authentication — it's
the conventional choice, handles session management, providers, and CSRF
out of the box, and most tutorials assume it.

Learnova's auth model is non-standard in a way that matters here: capability
is derived from profile existence rather than a role field (see ADR 0001),
and `currentProfile` — which profile view is currently active — needs to
live in the session payload itself and be re-issued whenever a profile is
created. NextAuth's session/JWT callback model can be bent to carry custom
claims like this, but the callback structure, session strategy, and adapter
layer are built around NextAuth's own assumptions about what a session
represents, and diverging from those assumptions means fighting the
library's defaults rather than using them.

There's also a portfolio dimension to this decision: Learnova exists as a
demonstration of engineering ability for master's applications, and
"integrated NextAuth" demonstrates far less than "designed and implemented
the auth flow," including its security properties.

## Decision
Auth is hand-rolled:
- **jose** for signing/verifying JWTs — a pure Web Crypto API
  implementation, meaning it runs identically on Node.js and Edge runtime
  with no code changes either way. This matters less for `proxy.ts`
  specifically now that it defaults to Node runtime (Next.js 16+), but it
  keeps auth verification portable if any route later opts into Edge
  runtime explicitly, and avoids `jsonwebtoken`'s dependency on Node's
  built-in `crypto` module, which doesn't exist outside Node.
- **bcryptjs** for password hashing — a pure-JS implementation with no
  native/compiled bindings. This avoids the build and deployment friction
  native modules like `bcrypt` can introduce in serverless bundling
  (Vercel functions), independent of whether the code runs on Node or
  Edge.
- Tokens are stored in httpOnly cookies (not localStorage), set/cleared
  directly in route handlers.
- The JWT payload carries `currentProfile` and whatever claims auth checks
  need, and is re-issued whenever underlying capability changes (e.g. a
  profile is created) — see ADR 0001's Consequences section for why this
  keeps the JWT as the single source of truth instead of introducing a
  separate synced field.

## Alternatives Considered
- **NextAuth (Auth.js).** Faster to set up, but its session/JWT model
  assumes a shape that doesn't map cleanly onto "capability via profile
  existence" without working against its callback and adapter
  abstractions. Also weaker as a portfolio signal for what this project is
  meant to demonstrate.
- **Clerk / Supabase Auth (managed auth-as-a-service).** Removes the
  security surface area entirely, but locks user/session data into an
  external provider's model and again demonstrates configuration rather
  than implementation for portfolio purposes.

## Consequences
- Full control over token shape, claims, and refresh behavior — but full
  responsibility for getting it right. No library defaults to fall back on
  for CSRF handling, token rotation, or cookie flags; these are
  implemented and reasoned about explicitly.
- Edge-compatible by construction, so auth checks in middleware don't
  require a separate Node-runtime code path.
- No session store/adapter/database lookup required per request — the JWT
  itself carries what auth checks need, consistent with ADR 0001.
- Higher maintenance burden if security best practices shift (e.g. token
  rotation strategy, algorithm choice) — there's no upstream library
  release to absorb that; it's a deliberate, revisited decision each time.
