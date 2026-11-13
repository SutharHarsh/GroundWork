"use client";
import { createContext, useCallback, useContext, useEffect, useRef, useState, useTransition, type ReactNode } from "react";
import { CheckCircle2, AlertCircle, X } from "lucide-react";

type Toast = { id: number; kind: "ok" | "error"; text: string };
const ToastContext = createContext<(kind: Toast["kind"], text: string) => void>(() => {});

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const counter = useRef(0);
  const push = useCallback((kind: Toast["kind"], text: string) => {
    const id = ++counter.current;
    setToasts((ts) => [...ts.slice(-2), { id, kind, text }]);
    window.setTimeout(() => setToasts((ts) => ts.filter((x) => x.id !== id)), kind === "error" ? 7000 : 3800);
  }, []);
  return (
    <ToastContext value={push}>
      {children}
      <div aria-live="polite" role="status" className="pointer-events-none fixed inset-x-0 top-4 z-[60] flex flex-col items-center gap-2 px-4">
        {toasts.map((t) => (
          <div
            key={t.id}
            className="animate-rise pointer-events-auto flex max-w-md items-start gap-2.5 rounded-2xl bg-ink px-4 py-3 text-[14px] text-on-ink shadow-[0_12px_40px_rgba(0,0,0,.35)]"
          >
            {t.kind === "ok" ? <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-accent" /> : <AlertCircle className="mt-0.5 size-4 shrink-0 text-danger" />}
            <span className="min-w-0 flex-1">{t.text}</span>
            <button type="button" aria-label="Dismiss" onClick={() => setToasts((ts) => ts.filter((x) => x.id !== t.id))} className="-mr-1 rounded p-0.5 opacity-60 hover:opacity-100">
              <X className="size-3.5" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext>
  );
}

export function useToast() {
  return useContext(ToastContext);
}

type Result = { ok: true; message?: string } | { ok: false; error: string };

/** Runs a server action in a transition and reports its result as a toast. */
export function useAction() {
  const toast = useToast();
  const [pending, start] = useTransition();
  const runAction = useCallback(
    (fn: () => Promise<Result>, opts?: { onSuccess?: () => void; silent?: boolean }) => {
      start(async () => {
        let res: Result;
        try {
          res = await fn();
        } catch (e) {
          // Network failures (server stopped, offline) surface as a TypeError from fetch.
          if (e instanceof TypeError) {
            toast("error", "Couldn't reach Groundwork. Check that the app is running and your connection is on, then try again.");
            return;
          }
          throw e;
        }
        if (res.ok) {
          if (res.message && !opts?.silent) toast("ok", res.message);
          opts?.onSuccess?.();
        } else toast("error", res.error);
      });
    },
    [toast],
  );
  return [pending, runAction] as const;
}

/** Shows a toast once on mount (used for server-provided notices). */
export function MountToast({ text }: { text: string }) {
  const toast = useToast();
  useEffect(() => {
    toast("ok", text);
  }, [text, toast]);
  return null;
}
