# Groundwork — Product Overview

> A private mastery platform that turns two professional syllabuses into an honest, dated learning plan, and makes every progress claim traceable to real work.

---

## Contents

1. [What Groundwork is](#1-what-groundwork-is)
2. [Who it is for](#2-who-it-is-for)
3. [Product principles](#3-product-principles)
4. [Core concepts](#4-core-concepts)
5. [The learner journey](#5-the-learner-journey)
6. [Feature tour](#6-feature-tour)
7. [How the plan is built](#7-how-the-plan-is-built)
8. [Mastery, proof of work and streaks](#8-mastery-proof-of-work-and-streaks)
9. [Weekend project engine](#9-weekend-project-engine)
10. [Design system](#10-design-system)
11. [Architecture](#11-architecture)
12. [Data model](#12-data-model)
13. [Security and privacy](#13-security-and-privacy)
14. [Accessibility and responsiveness](#14-accessibility-and-responsiveness)
15. [Quality and testing](#15-quality-and-testing)
16. [Running and deploying](#16-running-and-deploying)
17. [Known limitations and next steps](#17-known-limitations-and-next-steps)

---

## 1. What Groundwork is

Groundwork is a web application for two learners following two career paths:

| Learner | Career path | Syllabus |
|---|---|---|
| Aditya Sharma | AI-Native Frontend Developer | `syllabus/ai-native-frontend-developer.md` |
| Harsh Suthar | AI-Native Product Designer | `syllabus/ai-native-product-designer.md` |

Each learner signs in to see only their own path. Groundwork reads the complete syllabus, breaks it into trackable topics, fits as much as honestly possible into the time left before **December 31, 2026**, and tracks progress against real evidence: learning sessions, completed concepts, mastery assessments, projects and proof of work.

It is not a checklist app. Reading a topic does not make it mastered, a ticked box does not extend a streak, and every chart is computed from stored activity.

### At a glance

| | Frontend path | Design path |
|---|---|---|
| Learning domains | 29 + 8 optional specializations | 23 + 7 optional specializations |
| Trackable topics | 342 | 195 |
| Subtopics (checklist items) | 1,671 | 1,071 |
| Linked resources | 399 | 256 |
| Stage capstones from the syllabus | 5 | 5 |

---

## 2. Who it is for

**Primary users:** two motivated learners with limited time and an ambitious deadline. They need to know, every day:

1. Where am I?
2. What have I completed?
3. What have I actually mastered, with evidence?
4. What should I do next?
5. Am I on track for the deadline?

The dashboard is designed to answer those five questions without any navigation.

---

## 3. Product principles

1. **The syllabus is the source of truth.** Every domain, topic, subtopic, concept, prerequisite and resource comes from the Markdown files. Nothing is silently dropped or replaced with a generic plan.
2. **Honest scope over false completion.** Seven weeks cannot cover two full professional disciplines. The plan schedules what genuinely fits and marks the rest as *continued learning (2027)*.
3. **Completion and mastery are different.** Completion means "I studied it." Mastery means "I can prove it," which requires a self-assessment against a rubric, a written explanation and linked proof of work.
4. **Every metric represents real work.** Streaks, hours, completion trends and weekly consistency all come from stored sessions, assessments, projects and proofs.
5. **Focused, not busy.** A calm, editorial interface with one clear next action, not a project-management tool.

---

## 4. Core concepts

| Concept | Meaning |
|---|---|
| **Domain** | A major learning area from the syllabus (e.g. *Domain 12: React — Fundamentals to Internals*). Grouped into stages. |
| **Parent topic → Topic → Subtopic → Concept** | The syllabus hierarchy. Topics are the unit you track; subtopics form the topic's completion checklist; concepts explain each subtopic. |
| **Tier** | *Essential*, *Senior* (core-senior) or *Optional*, taken from the syllabus labels. |
| **Plan bucket** | *In this plan* (scheduled before the deadline), *Stretch goal*, or *Continued learning (2027)*. |
| **Topic status** | Not started, Learning, Practiced, Completed, Mastered, Needs revision. *Blocked by prerequisites* is derived. |
| **Prerequisites** | A domain unlocks when at least **half** of the planned topics in each prerequisite domain are completed. |
| **Schedule item** | A dated task: *Learn*, *Revision*, *Assessment*, *Project* or *Your task*. |
| **Proof of work** | Evidence attached to a topic and/or project: a GitHub repo, live link, Figma file, video, screenshot, PDF, document, written explanation or reflection. |

---

## 5. The learner journey

```
Sign in ──► Set availability (weekday + weekend hours) ──► Plan generated
   │
   ▼
Overview: "48 days until December 31", today's targets, next topic
   │
   ▼
Topic workspace: study → tick concepts → log time → mark completed
   │
   ▼
Add proof of work ──► Mastery assessment ──► Mastered (or flagged for revision)
   │
   ▼
Weekend: project built from this week's topics ──► submit with proof, self-assessment, reflection
   │
   ▼
Daily: plan rebuilds, unfinished work moves forward, scope stays honest
```

---

## 6. Feature tour

### Sign in
Username and password with show/hide, validation, loading and error states. Credentials are verified on the server; five failed attempts lock that username for 15 minutes. If the server can't be reached, a clear message appears instead of a crash.

### Onboarding
On first sign-in, each learner states how many hours they can realistically study on weekdays and on weekends. A live preview shows how much of the essential syllabus fits. The browser's timezone is detected automatically. The answers can be changed later in Settings.

### Overview (dashboard)
- Greeting, career role, current stage and current domain.
- **The runway:** one bar per day from plan start to December 31, showing done, missed (moved forward) and still-scheduled time, with weekend project days marked. It is the product's signature view.
- An on-track sentence based on the last seven days of scheduled work.
- **Next recommended topic** with a one-click timed session.
- Today's targets, upcoming projects and recent activity.
- Progress figures: topics completed, plan completion, mastered, learning now, needs revision, this week's completion, current and longest streak, learning time, and continued-learning count.

### Today (daily planner)
Today's tasks grouped as Learning, Revision, Assessments, Project work and Your tasks. Each task can be completed with time logged, started as a timed session, or moved to another day. Learners can log off-plan study and add their own tasks. The view navigates day by day.

### Roadmap explorer
The complete syllabus by stage and domain, with:
- Search across topics, subtopics and concepts.
- Filters by status and by plan scope.
- Expand/collapse per domain (remembered on the device).
- Per-domain progress and prerequisite locks ("Unlocks after Domain 3 (40% done)").
- Inline status changes.
- An "About this profession" section rendering the syllabus introduction, learning sequence, and timeless-versus-tools guidance.

### Topic workspace
For every topic: description, learning objectives, the concept checklist, four practical exercises (frontend: explain, build, break, teach; design: explain, apply, critique, show), recommended resources ranked by relevance, personal notes, proof of work, the mastery assessment and its history, prerequisites, related projects, logged sessions, and links to the previous and next topics.

### Projects
- **Weekend projects:** one per week, generated from that week's topics and getting harder each week.
- **Stage capstones:** five per path, taken from the syllabus's "Building while learning" section.
- **Final portfolio:** due December 31.

Each project has a problem statement, objectives, related topics, requirements, deliverables, evaluation criteria, a deadline and a status (Planned → In progress → Submitted → Under review → Completed). Submission is gated on a deliverable, proof of work, a self-assessment on every criterion, a reflection and the skills demonstrated.

### Proof of work
A searchable, filterable list of all evidence, with links, inline image previews, private file downloads, a review status and deletion. New proof can be added here, from a topic, or from a project.

### Calendar
Week and month views of the live plan: daily targets, weekend projects, revision, assessments and milestones (project due dates and the December 31 deadline). Done, overdue and moved-forward states are shown with icons and labels, not colour alone.

### Resources
Every resource from both syllabus tables and the cross-cutting directory, grouped into nine categories: documentation, courses, books, YouTube and talks, blogs and articles, podcasts, research papers, tools and communities, and industry experts. Learners can search, filter by domain, bookmark, mark as read and add notes.

### Progress (analytics)
Syllabus and plan completion, mastery rate, learning time, streaks and revision backlog; deadline progress (time elapsed against planned topics done); a GitHub-style activity heatmap; weekly consistency and monthly activity; topics completed over time against the planned pace; learning hours per week; completion by domain; and project and proof-of-work counts. Every chart has hover and keyboard tooltips, and the line, column and domain charts also offer a data-table view.

### Settings
Change weekday and weekend hours or timezone (this rebuilds the plan), rebuild the plan on demand, and see the current scope split.

---

## 7. How the plan is built

The planner (`src/server/planner.ts`) runs at onboarding, whenever availability changes, on demand, and automatically once a day.

1. **Move unfinished work forward.** Past planned tasks are marked *moved forward*; revision and hand-moved tasks shift to today.
2. **Measure capacity.** Each day from today to December 31 gets the learner's weekday or weekend minutes, minus time already committed.
3. **Reserve structure.**
   - Weekdays: a short review of the previous day's topics (about 12% of the day, or 10 minutes on short days).
   - Fridays: a weekly mastery check (30 minutes, or 15 on short days).
   - Weekends: the weekly project, plus a Sunday weekly review (about 35% of Sunday).
   - December 31: a final mastery review and portfolio check.
4. **Choose the scope.** Topics already in progress are always included. If every essential topic fits, they are all scheduled and Senior topics are added as stretch goals. If not, each domain gets a share of the time, weighted towards **foundations (×1.15)** and **AI-native skills (×1.35)**, and takes a **contiguous slice of its essential topics in syllabus order**, so a domain's sequence is never broken. Everything else becomes continued learning.
5. **Pack the days.** Selected topics are laid out in syllabus order. Long topics are split into parts across days, and no day exceeds the learner's stated hours.
6. **Generate weekend projects** from each week's topics (see section 9), plus stage capstone due dates.

When a topic is completed, spaced revision is scheduled at **+2 and +7 days**. A topic flagged for revision gets a 30-minute revision task the next day.

> Example (Nov 13, 2026): at 3 h per weekday, about 66 frontend topics (~89 h) fit before the deadline and 276 are continued learning. At 2 h per weekday, about 43 design topics fit.

---

## 8. Mastery, proof of work and streaks

### Mastery rubric
A topic must be *Completed* before it can be assessed. Each criterion is rated 1–4 (Not yet, With help, Independently, Could teach it).

| Frontend developer | Product designer |
|---|---|
| Explain the concept | Understand the principle |
| Implement independently | Apply it independently |
| Debug problems | Explain design decisions |
| Explain architectural decisions | Critique alternatives |
| Apply it in a real project | Demonstrate in a real product |

**Mastered** requires every criterion at 3 or higher, a written explanation of at least 80 characters, and at least one linked proof of work. A failed assessment is saved, flags the topic *Needs revision* and schedules a revision task naming the weak criteria.

### Proof of work
URL evidence is validated (GitHub and Figma links are checked for the right domain). Files up to 15 MB (images, PDF, Office documents, text, Markdown, `.fig`, `.zip`) are stored privately and served only to their owner.

### Streaks
A day counts only if it contains a meaningful learning event:
- a learning session of 10 minutes or more,
- a submitted project,
- a proof-of-work submission, or
- a mastery assessment.

Ticking a box or changing a status does not count.

---

## 9. Weekend project engine

For every week, the engine:

1. Collects the topics scheduled Monday to Friday plus anything actually completed that week.
2. Ranks the week's domains by study time and picks the most-studied domain whose project block hasn't been used on an earlier weekend.
3. Combines that domain's project block (title, brief, requirements, deliverables, criteria) with the first requirement from up to two secondary domains, plus an explicit requirement to apply the week's named topics.
4. Raises the level each week: Beginner exercise → Small practical implementation → Intermediate → Advanced → Real-world professional → Portfolio-quality. From week 3 it asks for written trade-offs; from week 5, automated checks (frontend) or validation with a real person (design); from week 6, portfolio-ready presentation.

Projects keep regenerating with the plan until the learner starts them, after which they are frozen.

**Example progression (frontend):** Developer environment and shell toolkit → Network request investigation → Responsive layout system → Interactive JavaScript application → React application → Security hardening → LLM-powered feature.

**Example progression (design):** Visual principles study → Figma fundamentals build → Polished interface from a visual system → User research sprint → Complex product interface → AI capabilities exploration → AI-native feature design.

---

## 10. Design system

**Theme: Ocean teal + coral.** Cool blue-grey surfaces, a deep teal accent, and warm coral as the highlight. Light and dark follow the system unless the learner picks one in the sidebar; the choice is saved on the device and applied before first paint, so there is no flash.

| Token | Light | Dark | Use |
|---|---|---|---|
| Background | `#F4F7F8` | `#0E1518` | Page |
| Surface | `#FFFFFF` | `#152024` | Panels, lists |
| Ink | `#102027` | `#E6F0F2` | Primary text |
| Accent / primary | `#0E7C86` | `#4FD1DB` / `#22B3BF` | Buttons, links, progress |
| Pop (coral) | `#E5584A` | `#FF8A7D` | Streak, today marker, design-path identity |
| Chart: done / missed | `#0094A0` / `#E5584A` | `#17A0AB` / `#D95F50` | Validated for colour-vision deficiency |

- **Type:** Instrument Sans for the interface; Newsreader (serif) for topic titles, notes and long-form syllabus reading.
- **Career identity:** a teal avatar for the frontend path, a coral one for the design path.
- **Status colours:** learning (blue), practiced (violet), completed (green), mastered (teal with a ring), needs revision (pink), blocked (grey). These are always paired with a text label.
- **Restraint:** thin separators, few shadows, one primary action per view, motion only in response to user actions, and `prefers-reduced-motion` respected.

---

## 11. Architecture

| Layer | Choice |
|---|---|
| Framework | Next.js 16 (App Router, server components, server actions), React 19 |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS v4 with CSS-variable design tokens |
| Database | SQLite via better-sqlite3 + Drizzle ORM; migrations in `drizzle/` |
| Validation | Zod on every server action |
| Charts | A small dependency-free chart kit (`src/components/client/charts.tsx`) |
| Icons | lucide-react |
| Markdown | marked (syllabus content only) |

```
syllabus/*.md ──(scripts/seed.ts + src/lib/syllabus/parse.ts)──► SQLite content tables
                                                                     │
Browser ──► proxy.ts (optimistic cookie check) ──► Server components ┤──► src/server/data.ts, stats.ts
   │                                                                 │
   └──► Server actions (src/server/actions/*) ──► guards.ts (auth + ownership) ──► planner.ts / DB
```

Key folders:

| Path | Contents |
|---|---|
| `src/app/(app)/` | Authenticated pages: overview, today, roadmap, topic workspace, calendar, projects, proof, resources, progress, settings |
| `src/app/login`, `src/app/welcome` | Sign-in and onboarding |
| `src/app/api/files/[id]` | Owner-only file downloads |
| `src/server/` | Auth, guards, planner, data access, statistics, server actions |
| `src/lib/` | Syllabus parser, project templates, dates, mastery rubric, statuses, localStorage preferences |
| `src/components/` | UI primitives and client components |
| `scripts/` | Seeding, syllabus inspection, end-to-end and planner tests |

---

## 12. Data model

**Syllabus content** (seeded; IDs are deterministic, so re-seeding keeps progress): `paths`, `domains`, `domain_prereqs`, `parent_topics`, `topics`, `subtopics`, `resources`.

**Accounts:** `users` (hashed password, path, availability, timezone), `sessions` (hashed tokens), `login_attempts`.

**Learning data (per user):**

| Table | Holds |
|---|---|
| `topic_progress` | Status, plan bucket, notes, minutes spent, timestamps |
| `subtopic_progress` | Concept checklist state |
| `learning_sessions` | Timed and logged sessions |
| `mastery_assessments` | Ratings, explanation, linked proofs, pass/fail |
| `proofs` | Evidence entries and uploaded-file metadata |
| `projects` | Weekend projects, capstones, final portfolio, submissions |
| `schedule_items` | The dated plan, including moved and user-added tasks |
| `resource_states` | Bookmarks, read state, notes |
| `activities` | Event log behind streaks, the heatmap and recent activity |

**Per-device preferences** (localStorage only, never learning data): theme, expanded roadmap domains, roadmap filters, resource filters.

---

## 13. Security and privacy

- Passwords are stored only as **scrypt** hashes with per-user salts; seed passwords live in a git-ignored `.env.local`.
- Sessions use random tokens stored as SHA-256 hashes, in **httpOnly, SameSite=Lax** cookies (Secure in production). They last 60 days and renew automatically with activity.
- The session cookie name is scoped to the database file, so separate instances on `localhost` don't overwrite each other's sign-in.
- **Login rate limiting:** five failures in 15 minutes locks the username, and timing is kept constant for unknown usernames.
- **Server-side authorization everywhere:** every page, action and route re-checks the session and ownership. Each learner can only reach their own path, topics, projects, proofs and files; cross-account URLs return *not found*.
- Server actions get Next.js's built-in origin (CSRF) checks; uploads are validated by size and type and served with `nosniff`, a sandboxed CSP and owner-only access.
- Security headers: `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy`, `Permissions-Policy`.
- User-entered text is always rendered as text; only the trusted syllabus files are rendered as Markdown.

---

## 14. Accessibility and responsiveness

- Semantic landmarks, a skip link, a labelled form for every input, and `aria-live` feedback for saves and filters.
- Full keyboard support with visible focus rings; dialogs use native `<dialog>`.
- Status and chart meaning is never colour-only (icons, labels, legends and data tables).
- WCAG AA contrast for text tokens in both themes; chart palettes validated for colour-vision deficiency.
- **Mobile:** a top bar plus a bottom tab bar (Overview, Today, Roadmap, Projects, More), a sheet for the remaining sections, touch-sized controls, no horizontal overflow, and camera-friendly file upload.
- Reduced-motion preferences are respected.

---

## 15. Quality and testing

| Check | What it covers |
|---|---|
| `npm run test:e2e` (Playwright) | Sign-in errors and redirects, onboarding, every page for both learners, the topic → concepts → notes → time → complete → proof → mastery flow, image upload and owner-only download, planner tasks, custom tasks, projects, bookmarks, streak, mobile layouts without overflow, dark mode, theme persistence, session persistence, logout, and cross-account isolation |
| `npm run test:planner` | Planner invariants across simulated days: no unfinished past tasks, nothing after the deadline, capacity respected, projects only on weekends, syllabus order preserved, honest scope, capstones present |
| `npm run syllabus:inspect` | Structural summary proving every domain, topic and resource is parsed |
| `npm run typecheck`, `npm run lint` | TypeScript and ESLint |

All tests run against a throwaway test database, never the real one.

---

## 16. Running and deploying

```bash
npm install
cp .env.example .env.local      # set SEED_PASSWORD_ADITYA and SEED_PASSWORD_HARSH
npm run db:seed                 # loads both syllabuses and creates the two accounts
npm run dev                     # development
npm run build && npm start      # production
```

Groundwork needs a Node.js 22+ host with a **persistent disk** for the SQLite file and uploads (a VPS, Railway, Render or Fly.io with a volume). Set `DATABASE_PATH` and `UPLOAD_DIR` to the volume and serve over HTTPS. Serverless hosts without persistent storage would need hosted SQLite or Postgres and object storage instead. See `README.md` for details.

---

## 17. Known limitations and next steps

**Current limitations**
- Proof-of-work review status is set by the learner; there is no separate reviewer or mentor role.
- Weekend projects are assembled from curated per-domain blocks plus the week's topics, not written by an AI model.
- Two fixed accounts; there is no self-service sign-up or password reset UI (passwords can be reset with `npm run db:seed -- --reset-passwords`).
- Single-instance SQLite: suitable for two learners, not for horizontal scaling.
- Not yet deployed; it runs locally.

**Possible next steps**
- A mentor/reviewer role that can accept or request changes on proof of work.
- Shared accountability: a view where both learners see each other's streak and weekly consistency (opt-in).
- Spaced-repetition quizzes generated from each topic's concepts.
- An AI study companion that explains concepts and critiques submitted work, with human verification.
- An export of the final portfolio and continuation plan as a shareable page.
- Hosted deployment with automated backups.
