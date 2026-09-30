import { formatTime } from "@/lib/utils";
import { INTERMEDIATE_COUNT } from "./stations";
import type { GameState, ScoreBreakdown } from "./types";

export function computeScore(state: GameState): ScoreBreakdown {
  const skippedCount = state.stations.filter((s) => !s.isTerminal && !s.visited).length;
  const skippedPenalty = skippedCount * 150;
  const accelPen = state.accelDeductions;
  const revPen = state.reversalCount * 5;
  const midStopPen = state.midTrackStopCount * 10;
  const comfortScore = Math.max(0, 100 - accelPen - revPen - midStopPen);

  const endangerPen = state.endangermentCount * 50 + state.endangeredPassengers * 25;

  const elapsedSec = state.elapsedTime / 1000;
  const parTimeSec = state.parTimeSec;
  const timeDiff = elapsedSec - parTimeSec;
  const timeScore =
    timeDiff <= 0 ? Math.min(400, Math.round(-timeDiff * 2.5)) : -Math.round(timeDiff * 4);

  const stationScore = state.stationPoints * 100;
  const passengerScore = state.passengersDelivered * 20;

  const total = Math.max(
    0,
    stationScore + passengerScore + comfortScore + timeScore - skippedPenalty - endangerPen,
  );

  return {
    travelTimeLabel: formatTime(state.elapsedTime),
    parTimeLabel: formatTime(parTimeSec * 1000),
    stationPoints: state.stationPoints,
    stationScore,
    skippedCount,
    skippedPenalty,
    passengersDelivered: state.passengersDelivered,
    passengerScore,
    accelPen,
    revPen,
    reversalCount: state.reversalCount,
    midStopPen,
    midTrackStopCount: state.midTrackStopCount,
    comfortScore,
    endangermentCount: state.endangermentCount,
    endangeredPassengers: state.endangeredPassengers,
    endangerPen,
    timeScore,
    elapsedSec,
    parTimeSec,
    total,
  };
}

export function stationCapLabel(points: number) {
  return `${points} / ${INTERMEDIATE_COUNT}`;
}
