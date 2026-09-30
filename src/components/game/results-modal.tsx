import { Button } from "@/components/ui/button";
import type { ScoreBreakdown } from "@/game/types";
import { cn } from "@/lib/utils";

function Row({
  label,
  value,
  warn,
}: {
  label: string;
  value: string;
  warn?: boolean;
}) {
  return (
    <div className="flex items-baseline justify-between gap-4 text-sm">
      <span className="text-muted">{label}</span>
      <span className={cn("font-semibold tabular-nums", warn ? "text-danger" : "text-sky")}>{value}</span>
    </div>
  );
}

export function ResultsModal({ score, onAgain }: { score: ScoreBreakdown; onAgain: () => void }) {
  const timeLabel =
    score.timeScore >= 0
      ? `${score.travelTimeLabel}  +${score.timeScore} pts`
      : `${score.travelTimeLabel}  ${score.timeScore} pts`;

  return (
    <div className="absolute inset-0 z-30 flex items-center justify-center bg-cab/90 p-4" role="dialog" aria-modal="true">
      <div className="w-full max-w-md rounded-xl bg-panel p-6 shadow-cab ring-2 ring-signal sm:p-7">
        <h2 className="font-display text-center text-3xl font-bold tracking-tight text-signal">Route completed</h2>
        <p className="mt-1 text-center text-xs text-muted">Par time {score.parTimeLabel}</p>
        <div className="mt-5 space-y-2">
          <Row label="Travel time score" value={timeLabel} warn={score.timeScore < 0} />
          <Row
            label="Stations visited"
            value={`${score.stationPoints} / 8  (+${score.stationScore} pts)`}
          />
          <Row
            label="Skipped stations"
            value={`-${score.skippedPenalty} pts (${score.skippedCount} skipped)`}
            warn={score.skippedPenalty > 0}
          />
          <Row
            label="Passengers delivered"
            value={`${score.passengersDelivered}  (+${score.passengerScore} pts)`}
          />
          <Row label="Hard accel / brake" value={`-${score.accelPen} pts`} warn={score.accelPen > 0} />
          <Row
            label="Reversals"
            value={`-${score.revPen} pts (${score.reversalCount}x)`}
            warn={score.revPen > 0}
          />
          <Row
            label="Mid-track stops"
            value={`-${score.midStopPen} pts (${score.midTrackStopCount}x)`}
            warn={score.midStopPen > 0}
          />
          <Row
            label="Passenger endangerment"
            value={`-${score.endangerPen} pts (${score.endangermentCount} doors / ${score.endangeredPassengers} at risk)`}
            warn={score.endangerPen > 0}
          />
          <Row label="Comfort" value={`${score.comfortScore} / 100`} />
        </div>
        <div className="mt-4 flex items-center justify-between border-t border-dashed border-signal pt-3">
          <span className="text-sm font-semibold uppercase tracking-wide">Total score</span>
          <span className="font-display text-3xl font-bold text-signal tabular-nums">{score.total} pts</span>
        </div>
        <Button className="mt-5 w-full" size="lg" variant="line" onClick={onAgain}>
          Drive route again
        </Button>
      </div>
    </div>
  );
}
