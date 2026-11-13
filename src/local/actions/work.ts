import { uid } from "@/lib/uid";
import { and, eq } from "drizzle-orm";
import { z } from "zod";
import { db, t } from "@/db";
import { PROJECT_STATUSES, PROOF_TYPES, REVIEW_STATUSES } from "@/lib/status";
import { requireOnboardedUser } from "../auth";
import { recordActivity } from "../data";
import { ActionError, ownProject, ownProof, ownTopic, run } from "../guards";
import { MAX_UPLOAD_BYTES, deleteFile, putFile } from "../files";


const ALLOWED: Record<string, string[]> = {
  image: [".png", ".jpg", ".jpeg", ".webp", ".gif"],
  pdf: [".pdf"],
  document: [".pdf", ".doc", ".docx", ".ppt", ".pptx", ".key", ".txt", ".md", ".png", ".jpg", ".jpeg", ".webp", ".fig", ".zip"],
};
const MIME_BY_EXT: Record<string, string> = {
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".pdf": "application/pdf",
  ".doc": "application/msword",
  ".docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ".ppt": "application/vnd.ms-powerpoint",
  ".pptx": "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  ".key": "application/octet-stream",
  ".txt": "text/plain",
  ".md": "text/markdown",
  ".fig": "application/octet-stream",
  ".zip": "application/zip",
};

const proofSchema = z.object({
  title: z.string().trim().min(3, "Give the proof a title (at least 3 characters).").max(160),
  description: z.string().trim().max(5000).default(""),
  type: z.enum(PROOF_TYPES.map((p) => p.value) as [string, ...string[]]),
  url: z.string().trim().max(2000).optional().default(""),
  topicId: z.string().optional().default(""),
  projectId: z.string().optional().default(""),
  reflection: z.string().trim().max(5000).default(""),
});

function validUrl(raw: string) {
  try {
    const u = new URL(raw);
    return u.protocol === "https:" || u.protocol === "http:";
  } catch {
    return false;
  }
}

export async function createProof(formData: FormData) {
  return run(async () => {
    const user = await requireOnboardedUser();
    const parsed = proofSchema.safeParse({
      title: formData.get("title"),
      description: formData.get("description") ?? "",
      type: formData.get("type"),
      url: formData.get("url") ?? "",
      topicId: formData.get("topicId") ?? "",
      projectId: formData.get("projectId") ?? "",
      reflection: formData.get("reflection") ?? "",
    });
    if (!parsed.success) throw new ActionError(parsed.error.issues[0].message);
    const data = parsed.data;
    const kind = PROOF_TYPES.find((p) => p.value === data.type)!;
    if (data.topicId) await ownTopic(user, data.topicId);
    if (data.projectId) await ownProject(user, data.projectId);
    if (!data.topicId && !data.projectId) throw new ActionError("Link the proof to a topic or a project so it counts as evidence.");

    let file: { name: string; path: string; mime: string; size: number } | null = null;
    if (kind.needs === "url") {
      if (!validUrl(data.url)) throw new ActionError("Enter a full link starting with https://");
      if (data.type === "github" && !/github\.com\//i.test(data.url)) throw new ActionError("That doesn't look like a GitHub link.");
      if (data.type === "figma" && !/figma\.com\//i.test(data.url)) throw new ActionError("That doesn't look like a Figma link.");
    } else if (kind.needs === "file") {
      const upload = formData.get("file");
      if (!(upload instanceof File) || upload.size === 0) throw new ActionError("Choose a file to upload.");
      if (upload.size > MAX_UPLOAD_BYTES) throw new ActionError(`Files can be up to ${Math.round(MAX_UPLOAD_BYTES / 1024 / 1024)} MB.`);
      const ext = (upload.name.match(/\.[^.]+$/)?.[0] ?? "").toLowerCase();
      if (!ALLOWED[data.type]?.includes(ext)) throw new ActionError(`That file type isn't supported here. Use ${ALLOWED[data.type].join(", ")}.`);
      const mime = MIME_BY_EXT[ext] ?? "application/octet-stream";
      const key = `idb:${user.id}:${uid()}${ext}`;
      try {
        await putFile(key, { blob: upload.slice(0, upload.size, mime), name: upload.name.slice(0, 200), mime });
      } catch {
        throw new ActionError("This browser couldn't store the file. Free some space, or add a link instead.");
      }
      file = { name: upload.name.slice(0, 200), path: key, mime, size: upload.size };
      if (data.url && !validUrl(data.url)) data.url = "";
    } else if (data.description.length < 40) {
      throw new ActionError("Write at least a few sentences (40+ characters) for a written explanation or reflection.");
    }

    const now = Date.now();
    const id = uid();
    await db.insert(t.proofs)
      .values({
        id,
        userId: user.id,
        title: data.title,
        description: data.description,
        topicId: data.topicId || null,
        projectId: data.projectId || null,
        type: data.type,
        url: kind.needs === "url" ? data.url : data.url || null,
        fileName: file?.name ?? null,
        filePath: file?.path ?? null,
        mime: file?.mime ?? null,
        size: file?.size ?? null,
        reflection: data.reflection,
        reviewStatus: "submitted",
        submittedAt: now,
        updatedAt: now,
      })
      .run();
    await recordActivity(user, { type: "proof", label: `Submitted proof: ${data.title}`, refId: id, countsForStreak: true });
    return "Proof of work saved";
  });
}

export async function setProofReview(proofId: string, status: string) {
  return run(async () => {
    const user = await requireOnboardedUser();
    await ownProof(user, proofId);
    const s = z.enum(REVIEW_STATUSES).parse(status);
    await db.update(t.proofs).set({ reviewStatus: s, updatedAt: Date.now() }).where(eq(t.proofs.id, proofId)).run();
  });
}

export async function deleteProof(proofId: string) {
  return run(async () => {
    const user = await requireOnboardedUser();
    const proof = await ownProof(user, proofId);
    if (proof.filePath?.startsWith("idb:")) await deleteFile(proof.filePath).catch(() => undefined);
    await db.delete(t.proofs).where(eq(t.proofs.id, proof.id)).run();
    return "Proof deleted";
  });
}

/* ── Projects ─────────────────────────────────────────────────────────────── */

const workSchema = z.object({
  deliverableText: z.string().max(10000),
  reflection: z.string().max(10000),
  skills: z.string().max(2000),
  selfAssessment: z.record(z.string(), z.number().int().min(1).max(4)),
});

export async function saveProjectWork(projectId: string, input: z.input<typeof workSchema>) {
  return run(async () => {
    const user = await requireOnboardedUser();
    const project = await ownProject(user, projectId);
    const parsed = workSchema.safeParse(input);
    if (!parsed.success) throw new ActionError(parsed.error.issues[0].message);
    await db.update(t.projects)
      .set({
        deliverableText: parsed.data.deliverableText,
        reflection: parsed.data.reflection,
        skills: parsed.data.skills,
        selfAssessment: JSON.stringify(parsed.data.selfAssessment),
        status: project.status === "planned" ? "in_progress" : project.status,
        updatedAt: Date.now(),
      })
      .where(eq(t.projects.id, project.id))
      .run();
    return "Project saved";
  });
}

export async function setProjectStatus(projectId: string, statusRaw: string) {
  return run(async () => {
    const user = await requireOnboardedUser();
    const project = await ownProject(user, projectId);
    const status = z.enum(PROJECT_STATUSES).parse(statusRaw);
    const now = Date.now();
    if (status === "submitted" || status === "under_review" || status === "completed") {
      const proofs = await db.select().from(t.proofs).where(and(eq(t.proofs.userId, user.id), eq(t.proofs.projectId, project.id))).all();
      const criteria = JSON.parse(project.criteria) as string[];
      const assessment = JSON.parse(project.selfAssessment) as Record<string, number>;
      const missing: string[] = [];
      if (project.deliverableText.trim().length < 20) missing.push("describe the deliverable");
      if (!proofs.length) missing.push("attach proof of work");
      if (criteria.some((_, i) => !assessment[String(i)])) missing.push("rate every evaluation criterion");
      if (project.reflection.trim().length < 40) missing.push("write a reflection");
      if (project.skills.trim().length < 3) missing.push("list the skills demonstrated");
      if (missing.length) throw new ActionError(`Before submitting: ${missing.join(", ")}.`);
    }
    if (status === "completed" && !["submitted", "under_review"].includes(project.status)) throw new ActionError("Submit the project before marking it completed.");
    await db.update(t.projects)
      .set({
        status,
        submittedAt: status === "submitted" ? now : project.submittedAt,
        completedAt: status === "completed" ? now : null,
        updatedAt: now,
      })
      .where(eq(t.projects.id, project.id))
      .run();
    if (status === "submitted" && project.status !== "submitted")
      await recordActivity(user, { type: "project_submitted", label: `Submitted ${project.title}`, refId: project.id, countsForStreak: true });
    if (status === "completed") await recordActivity(user, { type: "project_completed", label: `Completed ${project.title}`, refId: project.id, countsForStreak: false });
    return `Project ${status.replace("_", " ")}`;
  });
}

/* ── Resources ────────────────────────────────────────────────────────────── */

export async function updateResourceState(resourceId: string, patch: { bookmarked?: boolean; read?: boolean; note?: string }) {
  return run(async () => {
    const user = await requireOnboardedUser();
    const res = await db.select().from(t.resources).where(eq(t.resources.id, resourceId)).get();
    if (!res || res.pathId !== user.pathId) throw new ActionError("That resource isn't in your library.");
    const current = await db.select().from(t.resourceStates).where(and(eq(t.resourceStates.userId, user.id), eq(t.resourceStates.resourceId, resourceId))).get();
    const next = {
      bookmarked: patch.bookmarked ?? current?.bookmarked ?? false,
      read: patch.read ?? current?.read ?? false,
      note: (patch.note ?? current?.note ?? "").slice(0, 5000),
      updatedAt: Date.now(),
    };
    await db.insert(t.resourceStates)
      .values({ userId: user.id, resourceId, ...next })
      .onConflictDoUpdate({ target: [t.resourceStates.userId, t.resourceStates.resourceId], set: next })
      .run();
    return patch.note !== undefined ? "Note saved" : undefined;
  });
}
