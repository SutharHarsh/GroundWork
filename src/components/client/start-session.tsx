"use client";
import { startSession } from "@/local/actions/learning";
import { Button } from "@/components/ui";
import { useAction } from "./toast";

export function StartSessionButton({
  topicId,
  projectId,
  label = "Start session",
  variant = "accent",
  size = "md",
  className,
}: {
  topicId?: string;
  projectId?: string;
  label?: string;
  variant?: "accent" | "outline" | "ink";
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const [pending, run] = useAction();
  return (
    <Button variant={variant} size={size} disabled={pending} className={className} onClick={() => run(() => startSession({ topicId, projectId }))}>
      {label}
    </Button>
  );
}
