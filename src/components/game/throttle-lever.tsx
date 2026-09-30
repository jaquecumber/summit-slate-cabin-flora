import { useCallback, useRef } from "react";
import { cn } from "@/lib/utils";

function levelFromPointer(clientX: number, clientY: number, el: HTMLElement) {
  const r = el.getBoundingClientRect();
  if (r.width > r.height) {
    return Math.round(Math.max(0, Math.min(10, ((clientX - r.left) / r.width) * 10)));
  }
  return Math.round(Math.max(0, Math.min(10, (1 - (clientY - r.top) / r.height) * 10)));
}

export function ThrottleLever({
  value,
  onChange,
  disabled,
}: {
  value: number;
  onChange: (n: number) => void;
  disabled?: boolean;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);
  const pct = (value / 10) * 100;

  const apply = useCallback(
    (clientX: number, clientY: number) => {
      const el = trackRef.current;
      if (!el || disabled) return;
      onChange(levelFromPointer(clientX, clientY, el));
    },
    [disabled, onChange],
  );

  return (
    <div className="flex h-full min-h-16 w-full items-center gap-3">
      <div
        ref={trackRef}
        role="slider"
        aria-valuemin={0}
        aria-valuemax={10}
        aria-valuenow={value}
        aria-label="Throttle"
        tabIndex={0}
        onKeyDown={(e) => {
          if (disabled) return;
          if (e.key === "ArrowUp" || e.key === "ArrowRight") onChange(Math.min(10, value + 1));
          if (e.key === "ArrowDown" || e.key === "ArrowLeft") onChange(Math.max(0, value - 1));
        }}
        onPointerDown={(e) => {
          dragging.current = true;
          e.currentTarget.setPointerCapture(e.pointerId);
          apply(e.clientX, e.clientY);
        }}
        onPointerMove={(e) => {
          if (!dragging.current) return;
          apply(e.clientX, e.clientY);
        }}
        onPointerUp={() => {
          dragging.current = false;
        }}
        onPointerCancel={() => {
          dragging.current = false;
        }}
        className={cn(
          "relative w-full touch-none rounded-full bg-cab ring-1 ring-border",
          "h-9 sm:h-full sm:min-h-28 sm:w-9",
        )}
      >
        <div
          className="absolute top-1/2 size-7 -translate-y-1/2 rounded-full bg-signal sm:hidden"
          style={{ left: `clamp(2px, calc(${pct}% - 14px), calc(100% - 30px))` }}
        />
        <div
          className="absolute left-1/2 hidden size-7 -translate-x-1/2 rounded-full bg-signal sm:block"
          style={{ bottom: `clamp(2px, calc(${pct}% - 14px), calc(100% - 30px))` }}
        />
      </div>
      <div className="hidden h-full min-h-28 flex-col justify-between py-0.5 text-[11px] font-semibold text-muted sm:flex">
        <span>10 MAX</span>
        <span>5 MID</span>
        <span>0 IDLE</span>
      </div>
      <div className="flex items-center gap-2 text-[11px] font-semibold text-muted sm:hidden">
        <span>IDLE</span>
        <span className="tabular-nums text-signal">{value}</span>
        <span>MAX</span>
      </div>
    </div>
  );
}
