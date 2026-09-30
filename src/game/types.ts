export interface Station {
  name: string;
  pos: number;
  passengers: number;
  visited: boolean;
  isTerminal: boolean;
}

export interface GameState {
  stations: Station[];
  stationPoints: number;
  passengersDelivered: number;
  passengersOnBoard: number;
  trainPos: number;
  trainSpeed: number;
  targetSpeed: number;
  direction: 1 | -1;
  throttle: number;
  doorsOpen: boolean;
  lightsOn: boolean;
  isEmergencyBraking: boolean;
  ebrakeUntil: number;
  wheelRotation: number;
  accelDeductions: number;
  reversalCount: number;
  midTrackStopCount: number;
  endangermentCount: number;
  endangeredPassengers: number;
  wasStopped: boolean;
  prevThrottle: number;
  elapsedTime: number;
  timerRunning: boolean;
  routeFinished: boolean;
  boardingAcc: number;
  hornUntil: number;
  message: string;
  messageUntil: number;
  started: boolean;
  muted: boolean;
  now: number;
  railAcc: number;
  finishArmed: boolean;
  parTimeSec: number;
}

export type SimEvent =
  | { type: "log"; text: string }
  | { type: "board" }
  | { type: "chime" }
  | { type: "alarm" }
  | { type: "brake" }
  | { type: "horn" }
  | { type: "rail" }
  | { type: "finish" };

export interface HudSnapshot {
  speed: number;
  throttle: number;
  direction: 1 | -1;
  doorsOpen: boolean;
  lightsOn: boolean;
  isEmergencyBraking: boolean;
  stationPoints: number;
  passengersOnBoard: number;
  passengersDelivered: number;
  nextStationName: string;
  stationDist: number;
  atPlatform: boolean;
  inYard: boolean;
  elapsedTime: number;
  message: string;
  showMessage: boolean;
  started: boolean;
  routeFinished: boolean;
  stations: Station[];
  trainPos: number;
  routeEnd: number;
  endangermentCount: number;
  muted: boolean;
  hornActive: boolean;
}

export interface ScoreBreakdown {
  travelTimeLabel: string;
  parTimeLabel: string;
  stationPoints: number;
  stationScore: number;
  skippedCount: number;
  skippedPenalty: number;
  passengersDelivered: number;
  passengerScore: number;
  accelPen: number;
  revPen: number;
  reversalCount: number;
  midStopPen: number;
  midTrackStopCount: number;
  comfortScore: number;
  endangermentCount: number;
  endangeredPassengers: number;
  endangerPen: number;
  timeScore: number;
  elapsedSec: number;
  parTimeSec: number;
  total: number;
}
