export const TOPIC_STATUSES = ["not_started", "learning", "practiced", "completed", "mastered", "needs_revision"] as const;
export type TopicStatus = (typeof TOPIC_STATUSES)[number];
export type DisplayStatus = TopicStatus | "blocked";

export const STATUS_LABEL: Record<DisplayStatus, string> = {
  not_started: "Not started",
  learning: "Learning",
  practiced: "Practiced",
  completed: "Completed",
  mastered: "Mastered",
  needs_revision: "Needs revision",
  blocked: "Blocked by prerequisites",
};

export const DONE_STATUSES: TopicStatus[] = ["completed", "mastered", "needs_revision"];
export const ACTIVE_STATUSES: TopicStatus[] = ["learning", "practiced", "needs_revision"];

export const isDone = (s: string) => s === "completed" || s === "mastered" || s === "needs_revision";

export const TIER_LABEL: Record<string, string> = {
  essential: "Essential",
  "core-senior": "Senior",
  optional: "Optional",
};

export const BUCKET_LABEL: Record<string, string> = {
  core: "In this plan",
  stretch: "Stretch goal",
  continued: "Continued learning (2027)",
};

export const PROJECT_STATUSES = ["planned", "in_progress", "submitted", "under_review", "completed"] as const;
export type ProjectStatus = (typeof PROJECT_STATUSES)[number];
export const PROJECT_STATUS_LABEL: Record<ProjectStatus, string> = {
  planned: "Planned",
  in_progress: "In progress",
  submitted: "Submitted",
  under_review: "Under review",
  completed: "Completed",
};

export const PROOF_TYPES = [
  { value: "github", label: "GitHub repository", needs: "url" },
  { value: "live", label: "Live project", needs: "url" },
  { value: "figma", label: "Figma file", needs: "url" },
  { value: "video", label: "Video", needs: "url" },
  { value: "link", label: "Other link", needs: "url" },
  { value: "image", label: "Screenshot or image", needs: "file" },
  { value: "pdf", label: "PDF", needs: "file" },
  { value: "document", label: "Document", needs: "file" },
  { value: "writing", label: "Written explanation", needs: "text" },
  { value: "reflection", label: "Reflection", needs: "text" },
] as const;
export type ProofType = (typeof PROOF_TYPES)[number]["value"];

export const REVIEW_STATUSES = ["submitted", "under_review", "accepted", "needs_changes"] as const;
export const REVIEW_LABEL: Record<string, string> = {
  submitted: "Submitted",
  under_review: "Under review",
  accepted: "Accepted",
  needs_changes: "Needs changes",
};
