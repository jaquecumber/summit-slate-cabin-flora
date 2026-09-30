import type { Station } from "./types";

/** Engine must sit within this many world units of a station marker. */
export const PLATFORM_RADIUS = 160;

/** World units advanced per km/h per second. */
export const PX_PER_KMH = 4.2;

export const TRAIN_START = 90;
export const INTERMEDIATE_COUNT = 8;

export function createStations(): Station[] {
  return [
    { name: "1. Brick Central", pos: 1080, passengers: 5, visited: false, isTerminal: false },
    { name: "2. City Park", pos: 3180, passengers: 8, visited: false, isTerminal: false },
    { name: "3. Yellow Bridge", pos: 4620, passengers: 3, visited: false, isTerminal: false },
    { name: "4. North Suburbs", pos: 7540, passengers: 6, visited: false, isTerminal: false },
    { name: "5. River Crossing", pos: 9720, passengers: 7, visited: false, isTerminal: false },
    { name: "6. East Plaza", pos: 14080, passengers: 9, visited: false, isTerminal: false },
    { name: "7. Tech District", pos: 16240, passengers: 4, visited: false, isTerminal: false },
    { name: "8. Harbor Bay", pos: 19560, passengers: 6, visited: false, isTerminal: false },
    { name: "9. Grand Terminal", pos: 22840, passengers: 0, visited: false, isTerminal: true },
  ];
}

export function routeEnd(stations: Station[]) {
  return stations[stations.length - 1]?.pos ?? 0;
}

export function computeParTimeSec(stations: Station[]) {
  const end = routeEnd(stations);
  const cruiseKmh = 36;
  const driveSec = end / (cruiseKmh * PX_PER_KMH);
  const stopSec = INTERMEDIATE_COUNT * 6.5;
  return Math.round(driveSec + stopSec);
}

export function stationAt(stations: Station[], pos: number, radius = PLATFORM_RADIUS) {
  return stations.find((s) => Math.abs(s.pos - pos) < radius) ?? null;
}

export function nextStation(stations: Station[], pos: number) {
  return stations.find((s) => s.pos > pos - 40) ?? stations[stations.length - 1]!;
}
