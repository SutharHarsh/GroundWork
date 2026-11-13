import type { Metadata } from "next";
import { LocalProvider } from "@/components/client/local-provider";
import { requireUser } from "@/server/auth";
import { CONTENT_VERSION } from "@/server/content";
import { WelcomeView } from "./view";

export const metadata: Metadata = { title: "Set up your plan" };
export const dynamic = "force-dynamic";

export default async function WelcomePage() {
  const user = await requireUser();
  return (
    <LocalProvider user={user} contentVersion={CONTENT_VERSION} requireOnboarded={false}>
      <WelcomeView />
    </LocalProvider>
  );
}
