# ADR 0003: Email Collision — Reclaim via `emailVerified`, Not a Hard Unique Reject

## Status
Accepted

## Context
`User` rows carry an `emailVerified` boolean. A row can exist for an email
without that email ever being verified — e.g. someone signs up but never
clicks the verification link, then abandons the account. If that same
email is entered at signup again (by the same person returning, or by
someone else who now owns that inbox), a naive unique-constraint check on
`email` would reject it outright as "already in use," even though no one
ever completed verification for it.

Treating any existing row as a hard collision would block a legitimate
signup attempt with no path forward except contacting support, over an
account that was never actually confirmed as belonging to anyone.

## Decision
On signup, check for an existing `User` row with that email:

- **If a row exists and `emailVerified` is `true`** — reject the signup
  with the standard "email already in use" response. This email is
  confirmed to belong to someone; it's a real collision.
- **If a row exists and `emailVerified` is `false`** — the old row is
  deleted and a new `User` row is created for the incoming signup, inside
  a single database transaction. The unverified row is treated as never
  having been meaningfully claimed, so the new signup takes the email
  outright rather than merging into or updating the old row.
- **If no row exists** — normal signup, no special handling.

Deleting and inserting happens in one transaction so the email is never
left without a row (or with two rows) if a step fails partway.

## Alternatives Considered
- **Hard unique constraint, reject on any existing row regardless of
  `emailVerified`.** Simplest, but blocks the common case of someone
  abandoning signup before verifying and later trying again — they'd be
  told their own email is taken by an account they can't access or
  confirm.
- **Update the old unverified row in place instead of delete + insert.**
  Rejected — the old row may carry partial/stale data from the abandoned
  signup attempt; starting from a clean new row is simpler and avoids
  needing to reason about which old fields are safe to keep.
- **Allow duplicate rows per email, disambiguate at login.** Rejected —
  email is the unique login identifier; duplicates would push the
  disambiguation problem to every future login instead of resolving it
  once at signup.

## Consequences
- Signup must check `emailVerified` on any existing row before deciding
  reject vs. reclaim — this check and the delete+insert both happen
  inside the same transaction, to avoid a race between two concurrent
  signup attempts for the same unverified email.
- An abandoned, never-verified signup provides no real claim to an email
  — anyone can retake it. This is intentional: verification, not mere
  row existence, is what makes an email "owned."
- No support ticket or manual intervention needed for the common case of
  someone re-attempting signup after abandoning an earlier, unverified
  attempt.

