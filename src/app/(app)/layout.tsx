import { ToastProvider } from "@/components/client/toast";
import { LocalProvider } from "@/components/client/local-provider";
import { LocalShell } from "@/components/client/local-shell";
import { requireUser } from "@/server/auth";
import { CONTENT_VERSION } from "@/server/content";

export const dynamic = "force-dynamic";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser();
  return (
    <ToastProvider>
      <LocalProvider user={user} contentVersion={CONTENT_VERSION} requireOnboarded>
        <div data-path={user.pathId}>
          <LocalShell>{children}</LocalShell>
        </div>
      </LocalProvider>
    </ToastProvider>
  );
}
