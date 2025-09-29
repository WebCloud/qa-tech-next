import type { ActionType } from "@/lib/types";
import { ArrowRight, Pointer } from "lucide-react";

export function ActionIcon({
  type,
  className,
}: {
  type: ActionType;
  className?: string;
}) {
  const Icon = type === "interaction" ? Pointer : ArrowRight;
  return <Icon className={className} aria-hidden="true" />;
}
