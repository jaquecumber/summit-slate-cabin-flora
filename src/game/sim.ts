import { clamp } from "@/lib/utils";
import {
  PX_PER_KMH,
  TRAIN_START,
  computeParTimeSec,
  createStations,
  nextStation,
  routeEnd,
  stationAt,
} from "./stations";
import type { GameState, HudSnapshot, SimEvent } from "./types";

const THROTTLE_KMH = 6;
const BOARD_INTERVAL = 0.42;

function log(state: GameState, events: SimEvent[], text: string) {
  state.message = text;
  state.messageUntil = state.now + 3.1;
  events.push({ type: "log", text });
}

export function initialState(): GameState {
  const stations = createStations();
  return {
    stations,
    stationPoints: 0,
    passengersDelivered: 0,
    passengersOnBoard: 0,
    trainPos: TRAIN_START,
    trainSpeed: 0,
    targetSpeed: 0,
    direction: 1,
    throttle: 0,
    doorsOpen: false,
    lightsOn: true,
    isEmergencyBraking: false,
    ebrakeUntil: 0,
    wheelRotation: 0,
    accelDeductions: 0,
    reversalCount: 0,
    midTrackStopCount: 0,
    endangermentCount: 0,
    endangeredPassengers: 0,
    wasStopped: true,
    prevThrottle: 0,
    elapsedTime: 0,
    timerRunning: false,
    routeFinished: false,
    boardingAcc: 0,
    hornUntil: 0,
    message: "Welcome aboard. Drive the platforms, or run express to Grand Terminal.",
    messageUntil: 8,
    started: false,
    muted: false,
    now: 0,
    railAcc: 0,
    finishArmed: false,
    parTimeSec: computeParTimeSec(stations),
  };
}

export function createGame() {
  const state = initialState();
  let injectedKeys: Set<string> | null = null;
  const held = new Set<string>();
  const prevHeld = new Set<string>();
  let throttleRepeat = 0;
  let lastDoorWarn = -10;
  let finishAt = 0;

  function effectiveKeys() {
    return injectedKeys ?? held;
  }

  function justPressed(code: string) {
    const keys = effectiveKeys();
    return keys.has(code) && !prevHeld.has(code);
  }

  function applyThrottle(level: number, events: SimEvent[], announceJerk: boolean) {
    const next = clamp(Math.round(level), 0, 10);
    if (state.doorsOpen) {
      if (next > 0 && state.now - lastDoorWarn > 1.5) {
        lastDoorWarn = state.now;
        log(state, events, "Close the doors before moving.");
      }
      state.throttle = 0;
      state.targetSpeed = 0;
      return;
    }
    if (state.isEmergencyBraking || state.routeFinished) return;
    if (announceJerk && Math.abs(next - state.prevThrottle) > 3) {
      state.accelDeductions += 5;
      log(state, events, "Jerky throttle change. Comfort penalty.");
    }
    state.throttle = next;
    state.prevThrottle = next;
    state.targetSpeed = next * THROTTLE_KMH * state.direction;
  }

  function start() {
    if (state.started) return;
    state.started = true;
    state.timerRunning = true;
    state.message = "Cab live. Stop on the yellow line to board.";
    state.messageUntil = state.now + 4;
  }

  function reset() {
    Object.assign(state, initialState());
    injectedKeys = null;
    held.clear();
    prevHeld.clear();
    throttleRepeat = 0;
    lastDoorWarn = -10;
    finishAt = 0;
  }

  function brake(events: SimEvent[] = []) {
    if (state.routeFinished) return;
    events.push({ type: "brake" });
    const current = state.throttle;
    if (current >= 3) {
      state.accelDeductions += 3;
      log(state, events, "Heavy braking. Comfort penalty.");
    }
    applyThrottle(Math.max(0, current - 2), events, false);
  }

  function ebrake(events: SimEvent[] = []) {
    if (state.routeFinished) return;
    events.push({ type: "brake" });
    state.isEmergencyBraking = true;
    state.ebrakeUntil = state.now + 1.5;
    state.accelDeductions += 10;
    state.throttle = 0;
    state.prevThrottle = 0;
    state.targetSpeed = 0;
    log(state, events, "Emergency brake. Comfort -10.");
  }

  function toggleDoors(events: SimEvent[] = []) {
    if (Math.abs(state.trainSpeed) > 0.5) {
      log(state, events, "Stop fully before opening the doors.");
      return;
    }
    state.doorsOpen = !state.doorsOpen;
    if (state.doorsOpen) {
      state.throttle = 0;
      state.targetSpeed = 0;
      const at = stationAt(state.stations, state.trainPos);
      const inYard = state.trainPos < TRAIN_START + 140;
      if (!at && !inYard) {
        state.endangermentCount += 1;
        if (state.passengersOnBoard > 0) {
          state.passengersOnBoard -= 1;
          state.endangeredPassengers += 1;
          log(state, events, "Doors opened off-platform. A passenger stepped onto the track.");
        } else {
          log(state, events, "Doors opened on open track. Safety penalty.");
        }
        events.push({ type: "alarm" });
      } else {
        events.push({ type: "chime" });
        log(state, events, at ? `Doors open at ${at.name}.` : "Doors open in the yard.");
      }
    } else {
      events.push({ type: "chime" });
      log(state, events, "Doors closed.");
    }
  }

  function toggleDir(events: SimEvent[] = []) {
    if (Math.abs(state.trainSpeed) > 0.5) {
      log(state, events, "Stop fully before reversing.");
      return;
    }
    state.direction = state.direction === 1 ? -1 : 1;
    state.reversalCount += 1;
    state.targetSpeed = state.throttle * THROTTLE_KMH * state.direction;
    log(state, events, "Direction reversed. Comfort penalty.");
  }

  function toggleLights() {
    state.lightsOn = !state.lightsOn;
  }

  function horn(events: SimEvent[] = []) {
    if (state.now < state.hornUntil - 0.15) return;
    state.hornUntil = state.now + 0.85;
    events.push({ type: "horn" });
  }

  function snapshot(): HudSnapshot {
    const nxt = nextStation(state.stations, state.trainPos);
    return {
      speed: Math.round(Math.abs(state.trainSpeed)),
      throttle: state.throttle,
      direction: state.direction,
      doorsOpen: state.doorsOpen,
      lightsOn: state.lightsOn,
      isEmergencyBraking: state.isEmergencyBraking,
      stationPoints: state.stationPoints,
      passengersOnBoard: state.passengersOnBoard,
      passengersDelivered: state.passengersDelivered,
      nextStationName: nxt.name,
      stationDist: Math.max(0, nxt.pos - state.trainPos),
      atPlatform: Boolean(stationAt(state.stations, state.trainPos)),
      inYard: state.trainPos < TRAIN_START + 140,
      elapsedTime: state.elapsedTime,
      message: state.message,
      showMessage: state.now < state.messageUntil,
      started: state.started,
      routeFinished: state.routeFinished,
      stations: state.stations,
      trainPos: state.trainPos,
      routeEnd: routeEnd(state.stations),
      endangermentCount: state.endangermentCount,
      muted: state.muted,
      hornActive: state.now < state.hornUntil,
    };
  }

  function step(dt: number): SimEvent[] {
    const events: SimEvent[] = [];
    const capped = Math.min(dt, 0.1);
    state.now += capped;

    const keys = effectiveKeys();

    if (state.started && !state.routeFinished) {
      throttleRepeat += capped;
      if (throttleRepeat >= 0.14) {
        throttleRepeat = 0;
        if (keys.has("KeyW") || keys.has("ArrowUp")) {
          applyThrottle(state.throttle + 1, events, true);
        }
        if (keys.has("KeyS") || keys.has("ArrowDown")) {
          applyThrottle(state.throttle - 1, events, false);
        }
      }
      if (justPressed("KeyS") || justPressed("ArrowDown")) {
        brake(events);
      }
      if (justPressed("Space")) ebrake(events);
      if (justPressed("KeyD")) toggleDoors(events);
      if (justPressed("KeyR")) toggleDir(events);
      if (justPressed("KeyL")) toggleLights();
      if (justPressed("KeyH")) horn(events);
    }

    prevHeld.clear();
    for (const k of keys) prevHeld.add(k);

    if (state.isEmergencyBraking && state.now >= state.ebrakeUntil) {
      state.isEmergencyBraking = false;
    }

    if (state.timerRunning) state.elapsedTime += capped * 1000;

    const target = state.isEmergencyBraking ? 0 : state.targetSpeed;
    const k = state.isEmergencyBraking
      ? 9
      : target === 0 || Math.abs(target) < Math.abs(state.trainSpeed)
        ? 2.6
        : 1.7;
    state.trainSpeed += (target - state.trainSpeed) * (1 - Math.exp(-k * capped));
    if (Math.abs(state.trainSpeed) < 0.02) state.trainSpeed = 0;

    const atStation = Boolean(stationAt(state.stations, state.trainPos));
    if (state.trainSpeed === 0 && !state.wasStopped) {
      state.wasStopped = true;
      if (!atStation && state.trainPos > TRAIN_START + 40 && !state.routeFinished && state.started) {
        state.midTrackStopCount += 1;
        log(state, events, "Stopped in the middle of the track. Comfort penalty.");
      }
    } else if (Math.abs(state.trainSpeed) > 0.5) {
      state.wasStopped = false;
    }

    state.trainPos += state.trainSpeed * PX_PER_KMH * capped;
    state.wheelRotation += state.trainSpeed * 2.4 * capped;
    if (state.trainPos < 0) {
      state.trainPos = 0;
      state.trainSpeed = 0;
    }

    if (Math.abs(state.trainSpeed) > 6) {
      state.railAcc += Math.abs(state.trainSpeed) * capped;
      if (state.railAcc > 14) {
        state.railAcc = 0;
        events.push({ type: "rail" });
      }
    }

    const current = stationAt(state.stations, state.trainPos);
    if (current && Math.abs(state.trainSpeed) < 0.25 && state.doorsOpen && !state.routeFinished) {
      state.boardingAcc += capped;
      if (!current.visited && !current.isTerminal) {
        current.visited = true;
        state.stationPoints += 1;
        log(state, events, `Station point at ${current.name}.`);
      }
      if (state.boardingAcc >= BOARD_INTERVAL) {
        state.boardingAcc = 0;
        if (current.isTerminal) {
          if (state.passengersOnBoard > 0) {
            const n = state.passengersOnBoard;
            state.passengersDelivered += n;
            state.passengersOnBoard = 0;
            log(state, events, `All ${n} passengers delivered to Grand Terminal.`);
            events.push({ type: "chime" });
            state.finishArmed = true;
            finishAt = state.now + 1.05;
          } else if (!state.finishArmed) {
            state.finishArmed = true;
            finishAt = state.now + 0.7;
          }
        } else if (current.passengers > 0) {
          current.passengers -= 1;
          state.passengersOnBoard += 1;
          events.push({ type: "board" });
          log(state, events, `Passenger boarded. ${current.passengers} waiting.`);
        }
      }
    } else {
      state.boardingAcc = 0;
    }

    if (
      state.finishArmed &&
      !state.routeFinished &&
      state.passengersOnBoard === 0 &&
      state.now >= finishAt
    ) {
      state.routeFinished = true;
      state.timerRunning = false;
      state.throttle = 0;
      state.targetSpeed = 0;
      events.push({ type: "finish" });
    }

    return events;
  }

  return {
    state,
    start,
    reset,
    step,
    snapshot,
    setThrottle: (level: number) => applyThrottle(level, [], true),
    brake: () => brake([]),
    ebrake: () => ebrake([]),
    toggleDoors: () => toggleDoors([]),
    toggleDir: () => toggleDir([]),
    toggleLights,
    horn: () => horn([]),
    keyDown(code: string) {
      held.add(code);
    },
    keyUp(code: string) {
      held.delete(code);
    },
    blur() {
      held.clear();
    },
    setKeys(codes: string[]) {
      injectedKeys = new Set(codes);
    },
    getSpeed() {
      return state.trainSpeed;
    },
    getYaw() {
      return state.direction === 1 ? 0 : Math.PI;
    },
  };
}

export type TrainGame = ReturnType<typeof createGame>;
