# Groundwork

A private mastery platform for two learners: **Aditya Sharma** (AI-Native Frontend Developer) and **Harsh Suthar** (AI-Native Product Designer). It turns the two syllabus files in `syllabus/` into trackable learning units, an honest plan up to **December 31, 2026**, weekend projects, mastery assessments backed by proof of work, and analytics computed from real activity.

## Quick start

```bash
npm install
cp .env.example .env.local      # set SEED_PASSWORD_ADITYA and SEED_PASSWORD_HARSH
npm run dev                     # builds the syllabus files, then serves http://localhost:3000
```

## Where data lives

- **Sign-in** is verified on the server against the passwords in env vars (hashed with scrypt in memory). The session is a signed, httpOnly cookie, with no database involved.
- **The syllabus** is built into `content/<path>.sqlite` by `scripts/build-content.ts` (runs before `dev` and `build`) and served only to a signed-in learner by `/api/content`.
- **Everything a learner adds** (progress, notes, sessions, plan, projects, proof of work) is saved in their browser's localStorage under `groundwork:data:<user>`. Uploaded files go to the browser's IndexedDB. Nothing is sent to the server.
- **Backups:** Settings → *Download backup* saves one JSON file, including uploads. *Restore from backup* loads it in any browser. Clearing site data erases local progress, so download a backup regularly.

| Area | Where |
|---|---|
| Syllabus parser | `src/lib/syllabus/parse.ts` |
| Syllabus build | `scripts/build-content.ts`, `scripts/lib/setup.ts` |
| Browser store (sql.js + localStorage + backup) | `src/local/store.ts`, `src/local/files.ts` |
| Planner | `src/local/planner.ts` |
| Actions | `src/local/actions/*` |
| Auth and sessions | `src/server/auth.ts`, `src/server/session.ts`, `src/proxy.ts` |
| Schema (Drizzle) | `src/db/schema.ts` |

**Planning rules.** Essential topics come first. If they don't all fit your hours, every domain gets a share of the time (weighted towards foundations and AI-native skills) and takes a contiguous slice of its topics in syllabus order; the rest is marked *continued learning* instead of pretending it will be finished. Weekdays carry learning plus daily review of the previous day's topics and a Friday mastery check; weekends carry the weekly project generated from that week's topics, increasing in difficulty each week. Completing a topic schedules spaced revision at +2 and +7 days. Once a day the plan rebuilds: unfinished tasks are marked as moved forward and the remaining time is redistributed.

**Mastery.** Completion and mastery are separate. Mastery requires every rubric criterion rated "independently" or higher, a written explanation, and at least one linked proof-of-work entry. A failed assessment flags the topic for revision and schedules a revision task.

**Streaks** count only meaningful events: a learning session of 10+ minutes, a submitted project, a proof-of-work submission, or a mastery assessment.

**Prerequisites.** A domain unlocks when each of its prerequisite domains has at least half of its planned topics completed.

## Configuration

| Variable | Purpose |
|---|---|
| `SEED_PASSWORD_ADITYA`, `SEED_PASSWORD_HARSH` | Sign-in passwords (server only) |
| `SESSION_SECRET` | Optional cookie-signing key; if unset, one is derived from the passwords |
| `SYLLABUS_DIR` | Folder with the syllabus Markdown files (default `./syllabus`) |
| `INSECURE_COOKIES` | Set to `1` only to serve production over plain HTTP |

## Deploying to Vercel

1. Import the repo. Keep the default build command (`npm run build`).
2. In Project → Settings → Environment Variables, add `SEED_PASSWORD_ADITYA` and `SEED_PASSWORD_HARSH`.
3. Deploy. No database or storage setup is needed; every push redeploys automatically.

## Tests

```bash
NEXT_DIST_DIR=.next-test npm run build
NEXT_DIST_DIR=.next-test npx next start --port 3100
npm run test:e2e -- ./data/e2e-shots        # Playwright: auth, isolation, every page, topic→proof→mastery, uploads, backup, mobile, dark mode
npm run syllabus:inspect                    # structural summary of both syllabus files
```
