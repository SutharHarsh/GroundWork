/** The two learners. No secrets here: passwords live only in server env vars (SEED_PASSWORD_*). */
export const USERS = [
  { id: "aditya-sharma", name: "Aditya Sharma", username: "aditya sharma", pathId: "frontend", passwordEnv: "SEED_PASSWORD_ADITYA" },
  { id: "harsh-suthar", name: "Harsh Suthar", username: "harsh suthar", pathId: "designer", passwordEnv: "SEED_PASSWORD_HARSH" },
] as const;

export const PATHS = [
  { id: "frontend", title: "AI-Native Frontend Developer", role: "AI-Native Frontend Developer", file: "ai-native-frontend-developer.md" },
  { id: "designer", title: "AI-Native Product Designer", role: "AI-Native Product Designer", file: "ai-native-product-designer.md" },
] as const;

export type AuthUser = { id: string; name: string; pathId: string };
