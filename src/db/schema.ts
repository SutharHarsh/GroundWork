import { sqliteTable, text, integer, real, primaryKey, index } from "drizzle-orm/sqlite-core";

/* ────────────────────────────  Syllabus content (seeded from Markdown)  ──────────────────────────── */

export const paths = sqliteTable("paths", {
  id: text("id").primaryKey(), // "frontend" | "designer"
  title: text("title").notNull(),
  role: text("role").notNull(),
  sourceFile: text("source_file").notNull(),
  introMd: text("intro_md").notNull().default(""),
  sequenceMd: text("sequence_md").notNull().default(""),
  timelessMd: text("timeless_md").notNull().default(""),
  capstones: text("capstones").notNull().default("[]"), // JSON [{stage,text}]
});

export const domains = sqliteTable(
  "domains",
  {
    id: text("id").primaryKey(), // "frontend:12"
    pathId: text("path_id").notNull(),
    code: text("code").notNull(), // "12" or "S1"
    title: text("title").notNull(),
    stage: text("stage").notNull(),
    stageNumber: integer("stage_number").notNull(),
    labelText: text("label_text").notNull().default(""),
    depthText: text("depth_text").notNull().default(""),
    prereqText: text("prereq_text").notNull().default(""),
    whyText: text("why_text").notNull().default(""),
    notesMd: text("notes_md").notNull().default(""),
    isSpecialization: integer("is_specialization", { mode: "boolean" }).notNull().default(false),
    isAi: integer("is_ai", { mode: "boolean" }).notNull().default(false),
    sort: integer("sort").notNull(),
  },
  (t) => [index("domains_path_idx").on(t.pathId)],
);

export const domainPrereqs = sqliteTable(
  "domain_prereqs",
  {
    domainId: text("domain_id").notNull(),
    prereqDomainId: text("prereq_domain_id").notNull(),
  },
  (t) => [primaryKey({ columns: [t.domainId, t.prereqDomainId] })],
);

export const parentTopics = sqliteTable(
  "parent_topics",
  {
    id: text("id").primaryKey(),
    domainId: text("domain_id").notNull(),
    code: text("code").notNull(),
    title: text("title").notNull(),
    tier: text("tier").notNull(), // essential | core-senior | optional
    sort: integer("sort").notNull(),
  },
  (t) => [index("parent_domain_idx").on(t.domainId)],
);

export const topics = sqliteTable(
  "topics",
  {
    id: text("id").primaryKey(), // "frontend:12.4.2"
    pathId: text("path_id").notNull(),
    domainId: text("domain_id").notNull(),
    parentId: text("parent_id").notNull(),
    code: text("code").notNull(),
    title: text("title").notNull(),
    tier: text("tier").notNull(),
    estMinutes: integer("est_minutes").notNull(),
    sort: integer("sort").notNull(),
  },
  (t) => [index("topics_path_idx").on(t.pathId), index("topics_domain_idx").on(t.domainId)],
);

export const subtopics = sqliteTable(
  "subtopics",
  {
    id: text("id").primaryKey(),
    topicId: text("topic_id").notNull(),
    title: text("title").notNull(),
    concepts: text("concepts").notNull().default("[]"), // JSON string[]
    sort: integer("sort").notNull(),
  },
  (t) => [index("subtopics_topic_idx").on(t.topicId)],
);

export const resources = sqliteTable(
  "resources",
  {
    id: text("id").primaryKey(),
    pathId: text("path_id").notNull(),
    domainId: text("domain_id"), // null for cross-cutting directory entries
    section: text("section").notNull(),
    category: text("category").notNull(),
    name: text("name").notNull(),
    type: text("type").notNull().default(""),
    creator: text("creator").notNull().default(""),
    url: text("url").notNull(),
    extraUrls: text("extra_urls").notNull().default("[]"),
    what: text("what").notNull().default(""),
    sort: integer("sort").notNull(),
  },
  (t) => [index("resources_path_idx").on(t.pathId)],
);

/* ────────────────────────────  Users & auth  ──────────────────────────── */

export const users = sqliteTable("users", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  username: text("username").notNull().unique(), // normalized lowercase
  passwordHash: text("password_hash").notNull(),
  pathId: text("path_id").notNull(),
  hoursWeekday: real("hours_weekday"),
  hoursWeekend: real("hours_weekend"),
  timezone: text("timezone").notNull().default("UTC"),
  theme: text("theme").notNull().default("system"),
  onboardedAt: integer("onboarded_at"),
  lastPlanDate: text("last_plan_date"),
  planNote: text("plan_note"),
  createdAt: integer("created_at").notNull(),
});

export const sessions = sqliteTable(
  "sessions",
  {
    id: text("id").primaryKey(), // sha256(token)
    userId: text("user_id").notNull(),
    expiresAt: integer("expires_at").notNull(),
    createdAt: integer("created_at").notNull(),
  },
  (t) => [index("sessions_user_idx").on(t.userId)],
);

export const loginAttempts = sqliteTable(
  "login_attempts",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    username: text("username").notNull(),
    success: integer("success", { mode: "boolean" }).notNull(),
    at: integer("at").notNull(),
  },
  (t) => [index("login_attempts_user_idx").on(t.username, t.at)],
);

/* ────────────────────────────  Learning data (per user)  ──────────────────────────── */

export const topicProgress = sqliteTable(
  "topic_progress",
  {
    userId: text("user_id").notNull(),
    topicId: text("topic_id").notNull(),
    status: text("status").notNull().default("not_started"),
    planBucket: text("plan_bucket").notNull().default("continued"), // core | stretch | continued
    notes: text("notes").notNull().default(""),
    minutesSpent: integer("minutes_spent").notNull().default(0),
    startedAt: integer("started_at"),
    completedAt: integer("completed_at"),
    masteredAt: integer("mastered_at"),
    updatedAt: integer("updated_at").notNull(),
  },
  (t) => [primaryKey({ columns: [t.userId, t.topicId] })],
);

export const subtopicProgress = sqliteTable(
  "subtopic_progress",
  {
    userId: text("user_id").notNull(),
    subtopicId: text("subtopic_id").notNull(),
    done: integer("done", { mode: "boolean" }).notNull().default(false),
    updatedAt: integer("updated_at").notNull(),
  },
  (t) => [primaryKey({ columns: [t.userId, t.subtopicId] })],
);

export const learningSessions = sqliteTable(
  "learning_sessions",
  {
    id: text("id").primaryKey(),
    userId: text("user_id").notNull(),
    topicId: text("topic_id"),
    projectId: text("project_id"),
    scheduleItemId: text("schedule_item_id"),
    startedAt: integer("started_at").notNull(),
    endedAt: integer("ended_at"),
    minutes: integer("minutes").notNull().default(0),
    note: text("note").notNull().default(""),
  },
  (t) => [index("sessions_learn_user_idx").on(t.userId, t.startedAt)],
);

export const masteryAssessments = sqliteTable(
  "mastery_assessments",
  {
    id: text("id").primaryKey(),
    userId: text("user_id").notNull(),
    topicId: text("topic_id").notNull(),
    ratings: text("ratings").notNull(), // JSON {criterionKey: 1-4}
    explanation: text("explanation").notNull(),
    proofIds: text("proof_ids").notNull().default("[]"),
    passed: integer("passed", { mode: "boolean" }).notNull(),
    createdAt: integer("created_at").notNull(),
  },
  (t) => [index("mastery_user_topic_idx").on(t.userId, t.topicId)],
);

export const proofs = sqliteTable(
  "proofs",
  {
    id: text("id").primaryKey(),
    userId: text("user_id").notNull(),
    title: text("title").notNull(),
    description: text("description").notNull().default(""),
    topicId: text("topic_id"),
    projectId: text("project_id"),
    type: text("type").notNull(),
    url: text("url"),
    fileName: text("file_name"),
    filePath: text("file_path"),
    mime: text("mime"),
    size: integer("size"),
    reflection: text("reflection").notNull().default(""),
    reviewStatus: text("review_status").notNull().default("submitted"),
    submittedAt: integer("submitted_at").notNull(),
    updatedAt: integer("updated_at").notNull(),
  },
  (t) => [index("proofs_user_idx").on(t.userId)],
);

export const projects = sqliteTable(
  "projects",
  {
    id: text("id").primaryKey(),
    userId: text("user_id").notNull(),
    kind: text("kind").notNull(), // weekend | capstone | final
    weekStart: text("week_start"),
    level: text("level").notNull(),
    title: text("title").notNull(),
    problem: text("problem").notNull(),
    objectives: text("objectives").notNull().default("[]"),
    topicIds: text("topic_ids").notNull().default("[]"),
    requirements: text("requirements").notNull().default("[]"),
    deliverables: text("deliverables").notNull().default("[]"),
    criteria: text("criteria").notNull().default("[]"),
    dueDate: text("due_date").notNull(),
    status: text("status").notNull().default("planned"),
    deliverableText: text("deliverable_text").notNull().default(""),
    selfAssessment: text("self_assessment").notNull().default("{}"),
    reflection: text("reflection").notNull().default(""),
    skills: text("skills").notNull().default(""),
    submittedAt: integer("submitted_at"),
    completedAt: integer("completed_at"),
    createdAt: integer("created_at").notNull(),
    updatedAt: integer("updated_at").notNull(),
    sort: integer("sort").notNull().default(0),
  },
  (t) => [index("projects_user_idx").on(t.userId)],
);

export const scheduleItems = sqliteTable(
  "schedule_items",
  {
    id: text("id").primaryKey(),
    userId: text("user_id").notNull(),
    date: text("date").notNull(), // YYYY-MM-DD in the user's timezone
    kind: text("kind").notNull(), // learn | review | assessment | project | custom
    topicId: text("topic_id"),
    topicIds: text("topic_ids").notNull().default("[]"),
    projectId: text("project_id"),
    title: text("title").notNull(),
    detail: text("detail").notNull().default(""),
    minutes: integer("minutes").notNull(),
    status: text("status").notNull().default("planned"), // planned | done | rescheduled | skipped
    origin: text("origin").notNull().default("plan"), // plan | user | revision
    rescheduledFrom: text("rescheduled_from"),
    sort: integer("sort").notNull().default(0),
    completedAt: integer("completed_at"),
    createdAt: integer("created_at").notNull(),
  },
  (t) => [index("schedule_user_date_idx").on(t.userId, t.date)],
);

export const resourceStates = sqliteTable(
  "resource_states",
  {
    userId: text("user_id").notNull(),
    resourceId: text("resource_id").notNull(),
    bookmarked: integer("bookmarked", { mode: "boolean" }).notNull().default(false),
    read: integer("read", { mode: "boolean" }).notNull().default(false),
    note: text("note").notNull().default(""),
    updatedAt: integer("updated_at").notNull(),
  },
  (t) => [primaryKey({ columns: [t.userId, t.resourceId] })],
);

export const activities = sqliteTable(
  "activities",
  {
    id: text("id").primaryKey(),
    userId: text("user_id").notNull(),
    date: text("date").notNull(),
    type: text("type").notNull(),
    refId: text("ref_id"),
    label: text("label").notNull(),
    minutes: integer("minutes").notNull().default(0),
    countsForStreak: integer("counts_for_streak", { mode: "boolean" }).notNull().default(false),
    createdAt: integer("created_at").notNull(),
  },
  (t) => [index("activities_user_date_idx").on(t.userId, t.date)],
);
