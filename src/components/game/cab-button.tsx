import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

const tones = {
  brake: "bg-brake text-ink shadow-[0_3px_0_0_var(--color-brake-deep)]",
  danger: "bg-danger text-ink shadow-[0_3px_0_0_var(--color-danger-deep)]",
  line: "bg-line text-ink shadow-[0_3px_0_0_var(--color-line-deep)]",
  signal: "bg-signal text-cab shadow-[0_3px_0_0_#b69100]",
  quiet: "bg-raised text-ink shadow-[0_3px_0_0_#161720]",
} as const;

export function CabButton({
  icon,
  label,
  hint,
  active,
  tone,
  onClick,
}: {
  icon: ReactNode;
  label: string;
  hint?: string;
  active?: boolean;
  tone: keyof typeof tones;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      title={hint}
      onClick={onClick}
      className={cn(
        "flex min-h-11 flex-col items-center justify-center gap-0.5 rounded-md px-2 py-2",
        "text-[11px] font-semibold uppercase tracking-wide",
        "transition-transform duration-75 ease-out",
        "active:translate-y-px active:shadow-none",
        tones[tone],
        active && "ring-2 ring-ink",
      )}
    >
      <span className="flex items-center gap-1.5">
        {icon}
        <span>{label}</span>
      </span>
    </button>
  );
}
