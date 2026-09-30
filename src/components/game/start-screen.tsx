import { DoorClosed, Timer, TrainFront } from "lucide-react";
import { Button } from "@/components/ui/button";

export function StartScreen({ onStart }: { onStart: () => void }) {
  return (
    <div className="absolute inset-0 z-20 flex items-center justify-center bg-cab/80 p-4">
      <div className="w-full max-w-md rounded-xl bg-panel p-6 text-center shadow-cab ring-1 ring-border sm:p-8">
        <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-lg bg-line text-ink">
          <TrainFront className="size-6" />
        </div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted">Brick City Train</p>
        <h1 className="font-display mt-1 text-4xl font-bold tracking-tight text-ink text-balance">JackCumber Line</h1>
        <p className="mt-3 text-sm leading-relaxed text-muted text-pretty">
          Drive the cab, stop on the yellow line, and open doors only at platforms. Time, comfort, and passenger
          safety all count toward your score.
        </p>
        <ul className="mt-5 space-y-2 text-left text-sm text-ink">
          <li className="flex gap-2">
            <DoorClosed className="mt-0.5 size-4 shrink-0 text-danger" />
            Opening doors on open track is passenger endangerment.
          </li>
          <li className="flex gap-2">
            <Timer className="mt-0.5 size-4 shrink-0 text-signal" />
            Beat the timetable for a time bonus. Running late costs points.
          </li>
          <li className="flex gap-2">
            <TrainFront className="mt-0.5 size-4 shrink-0 text-line" />
            Station gaps vary. Smooth throttle, no mid-track stops.
          </li>
        </ul>
        <Button className="mt-6 w-full" size="lg" variant="primary" onClick={onStart}>
          Start run
        </Button>
        <p className="mt-3 text-[11px] leading-relaxed text-muted">
          Up / W throttle · Down / S brake · Space e-brake · H horn · D doors · L lights · R reverse
        </p>
      </div>
    </div>
  );
}
