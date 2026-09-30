import {
  ArrowLeftRight,
  CircleStop,
  DoorClosed,
  DoorOpen,
  Lightbulb,
  LightbulbOff,
  Megaphone,
  Siren,
} from "lucide-react";
import { CabButton } from "./cab-button";
import { ThrottleLever } from "./throttle-lever";
import type { HudSnapshot } from "@/game/types";

export function Dashboard({
  hud,
  onBrake,
  onEbrake,
  onHorn,
  onDoors,
  onLights,
  onDir,
  onThrottle,
}: {
  hud: HudSnapshot;
  onBrake: () => void;
  onEbrake: () => void;
  onHorn: () => void;
  onDoors: () => void;
  onLights: () => void;
  onDir: () => void;
  onThrottle: (n: number) => void;
}) {
  return (
    <div className="grid shrink-0 grid-cols-1 gap-2 bg-cab p-2 sm:grid-cols-[minmax(0,220px)_1fr_minmax(0,180px)] sm:gap-3 sm:p-3">
      <section className="flex flex-col gap-2 rounded-lg bg-panel p-3 ring-1 ring-border">
        <h2 className="text-[11px] font-semibold uppercase tracking-wider text-muted">Instrument panel</h2>
        <div className="flex items-end justify-between gap-3 sm:flex-col sm:items-center sm:justify-center">
          <div className="text-center">
            <div className="font-display text-5xl font-bold leading-none text-signal tabular-nums">{hud.speed}</div>
            <div className="mt-1 text-[11px] text-muted">km/h</div>
          </div>
          <div className="min-w-0 text-left text-xs sm:w-full">
            <div className="text-muted">Next</div>
            <div className="truncate font-semibold text-signal">{hud.nextStationName}</div>
            <div className="tabular-nums text-ink">{Math.round(hud.stationDist)} m</div>
            <div
              className={
                hud.atPlatform || hud.inYard ? "mt-1 font-semibold text-ok" : "mt-1 text-muted"
              }
            >
              {hud.atPlatform ? "On platform" : hud.inYard ? "Yard — doors safe" : "Open track"}
            </div>
          </div>
        </div>
      </section>

      <section className="flex flex-col gap-2 rounded-lg bg-panel p-3 ring-1 ring-border">
        <h2 className="text-[11px] font-semibold uppercase tracking-wider text-muted">Train controls</h2>
        <div className="grid grid-cols-3 gap-2">
          <CabButton
            tone="brake"
            label="Brake"
            hint="Down arrow or S"
            icon={<CircleStop className="size-4" />}
            onClick={onBrake}
          />
          <CabButton
            tone="danger"
            label="E-Brake"
            hint="Space"
            active={hud.isEmergencyBraking}
            icon={<Siren className="size-4" />}
            onClick={onEbrake}
          />
          <CabButton
            tone="signal"
            label="Horn"
            hint="H"
            active={hud.hornActive}
            icon={<Megaphone className="size-4" />}
            onClick={onHorn}
          />
          <CabButton
            tone="line"
            label="Doors"
            hint="D"
            active={hud.doorsOpen}
            icon={hud.doorsOpen ? <DoorOpen className="size-4" /> : <DoorClosed className="size-4" />}
            onClick={onDoors}
          />
          <CabButton
            tone="signal"
            label={hud.lightsOn ? "Lights on" : "Lights off"}
            hint="L"
            active={hud.lightsOn}
            icon={hud.lightsOn ? <Lightbulb className="size-4" /> : <LightbulbOff className="size-4" />}
            onClick={onLights}
          />
          <CabButton
            tone="quiet"
            label={hud.direction === 1 ? "Dir fwd" : "Dir rev"}
            hint="R"
            icon={<ArrowLeftRight className="size-4" />}
            onClick={onDir}
          />
        </div>
      </section>

      <section className="flex flex-col gap-2 rounded-lg bg-panel p-3 ring-1 ring-border">
        <h2 className="text-[11px] font-semibold uppercase tracking-wider text-muted">10-speed throttle</h2>
        <ThrottleLever value={hud.throttle} onChange={onThrottle} disabled={!hud.started || hud.routeFinished} />
      </section>
    </div>
  );
}
