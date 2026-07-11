# ADR 0001: Capability via Profile Existence, Not a Role Field

## Status
Accepted

## Context
Most auth schemas default to a single `role` field on the `User` model
(e.g. `STUDENT` / `TEACHER` / `ADMIN`), chosen once at signup. This is the
standard pattern and would have been the obvious default here.

Learnova has a planned feature (not yet built) where a single account can
hold both a student profile and an instructor profile at the same time,
and switch which one is active — the same way an Upwork account can
attach both a client profile and a freelancer profile to the same
identity. A single exclusive `role` field cannot represent
"has both capabilities" without being either abused (e.g. an enum that
allows a `BOTH` value, which doesn't scale if a third capability is added)
or migrated later.

## Decision
`User` has no `role` field for student/teacher. Instead, capability is
derived from whether a `StudentProfile` and/or `InstructorProfile` row
exists for that user:

```prisma
model User {
  instructorProfile InstructorProfile?
  studentProfile    StudentProfile?
}
```

A user isn't a student or an instructor — a user is an authenticated
email. `instructorProfile !== null` just means an instructor profile has
been attached to that email. Both relations are independent — a user can
have neither, either, or both at once, with no schema change required to
support that.

The only actual role-style field retained is `systemRole` (`USER` /
`ADMIN`), which is a genuine platform permission tier, not a
teaching/learning capability, and has no profile data of its own.

## Alternatives Considered
- **Single `role` enum field on `User`.** Simpler and more conventional,
  but assumes exclusivity. Supporting simultaneous student+instructor
  capability later would require either an enum value like `BOTH`
  (doesn't generalize) or a schema migration at the point the feature is
  actually needed.
- **Separate `Student` and `Teacher` user tables entirely.** Rejected
  earlier in the design — duplicates auth logic (login, JWT issuance,
  password reset) across two tables for data that's otherwise identical.

## Consequences
- The current model is: a user is fundamentally an authenticated email
  address. Once authenticated, they can create a `StudentProfile` and/or
  an `InstructorProfile` — independently, in any combination.
- Onboarding is "create a profile" rather than "choose a role once" —
  a user can add an `InstructorProfile` later without touching their
  existing `StudentProfile`.
- Capability is encoded directly into the JWT issued at login/profile
  creation (e.g. which profiles exist for this user), and auth checks
  read that from the JWT rather than querying `instructorProfile !== null`
  /`studentProfile !== null` against the database on every request.
  The JWT is re-issued whenever a profile is created, so it always
  reflects current capability.
- No separate "current view" field (e.g. `activeRole`) is introduced.
  The JWT itself is the single source of truth for both what a user is
  capable of and what auth checks act on — there's no additional layer
  to keep in sync.