"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ShieldAlert, Timer, TrainFront, Users, Volume2, VolumeX } from "lucide-react";
import {
  playAlarmSound,
  playBrakeSound,
  playChimeSound,
  playHornSound,
  playRailClick,
  resumeAudio,
  setMuted,
  unlockAudio,
} from "@/game/audio";
import { drawScene } from "@/game/render";
import { computeScore } from "@/game/scoring";
import { createGame, type TrainGame } from "@/game/sim";
import type { HudSnapshot, ScoreBreakdown, SimEvent } from "@/game/types";
import { formatTime } from "@/lib/utils";
import { Dashboard } from "./dashboard";
import { ResultsModal } from "./results-modal";
import { StartScreen } from "./start-screen";

const GAME_CODES = new Set([
  "ArrowUp",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "Space",
  "KeyW",
  "KeyS",
  "KeyA",
  "KeyD",
  "KeyR",
  "KeyL",
  "KeyH",
]);

function playEvents(events: SimEvent[]) {
  for (const ev of events) {
    if (ev.type === "brake") playBrakeSound();
    else if (ev.type === "chime" || ev.type === "board") playChimeSound();
    else if (ev.type === "alarm") playAlarmSound();
    else if (ev.type === "horn") playHornSound();
    else if (ev.type === "rail") playRailClick();
  }
}

function RouteStrip({ hud }: { hud: HudSnapshot }) {
  const end = Math.max(1, hud.routeEnd);
  return (
    <div className="relative mx-3 mb-2 h-2 rounded-full bg-raised ring-1 ring-border">
      {hud.stations.map((st) => (
        <span
          key={st.name}
          title={st.name}
          className={
            st.isTerminal
              ? "absolute top-1/2 size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-danger"
              : st.visited
                ? "absolute top-1/2 size-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-ok"
                : "absolute top-1/2 size-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-signal"
          }
          style={{ left: `${(st.pos / end) * 100}%` }}
        />
      ))}
      <span
        className="absolute top-1/2 size-3 -translate-x-1/2 -translate-y-1/2 rounded-sm bg-ink"
        style={{ left: `${(hud.trainPos / end) * 100}%` }}
      />
    </div>
  );
}

export function TrainApp() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameRef = useRef<TrainGame | null>(null);
  if (!gameRef.current) gameRef.current = createGame();

  const [hud, setHud] = useState<HudSnapshot>(() => gameRef.current!.snapshot());
  const [score, setScore] = useState<ScoreBreakdown | null>(null);
  const hudRef = useRef(hud);
  hudRef.current = hud;

  const bump = useCallback(() => {
    const next = gameRef.current!.snapshot();
    setHud(next);
    if (next.routeFinished) {
      setScore(computeScore(gameRef.current!.state));
    }
  }, []);

  useEffect(() => {
    const game = gameRef.current!;
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let last = performance.now();
    let alive = true;
    let uiAcc = 0;

    const resize = () => {
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      const rect = wrap.getBoundingClientRect();
      const width = Math.max(320, Math.floor(rect.width));
      const height = Math.max(180, Math.floor(rect.height));
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(wrap);

    const loop = (t: number) => {
      if (!alive) return;
      const dt = Math.min(0.1, (t - last) / 1000);
      last = t;
      const events = game.step(dt);
      if (events.length) playEvents(events);
      const cssW = canvas.clientWidth;
      const cssH = canvas.clientHeight;
      drawScene(ctx, game.state, cssW, cssH);
      uiAcc += dt;
      if (uiAcc > 0.08 || events.length) {
        uiAcc = 0;
        bump();
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (GAME_CODES.has(e.code)) e.preventDefault();
      unlockAudio();
      game.keyDown(e.code);
    };
    const onKeyUp = (e: KeyboardEvent) => {
      game.keyUp(e.code);
    };
    const onBlur = () => game.blur();
    const onVis = () => {
      if (document.visibilityState === "visible") resumeAudio();
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    window.addEventListener("blur", onBlur);
    document.addEventListener("visibilitychange", onVis);

    window.__controlsTest = {
      getYaw: () => game.getYaw(),
      getSpeed: () => game.getSpeed(),
      setKeys: (codes: string[]) => game.setKeys(codes),
    };

    return () => {
      alive = false;
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      window.removeEventListener("blur", onBlur);
      document.removeEventListener("visibilitychange", onVis);
      delete window.__controlsTest;
    };
  }, [bump]);

  const withAudio = (fn: () => void) => {
    unlockAudio();
    fn();
    bump();
  };

  const start = () => {
    unlockAudio();
    gameRef.current!.start();
    bump();
  };

  const again = () => {
    gameRef.current!.reset();
    setScore(null);
    gameRef.current!.start();
    bump();
  };

  const toggleMute = () => {
    const next = !hud.muted;
    gameRef.current!.state.muted = next;
    setMuted(next);
    bump();
  };

  return (
    <div className="flex h-dvh min-h-0 flex-col overflow-hidden bg-cab text-ink">
      <header className="flex shrink-0 items-center justify-between gap-3 bg-line px-3 py-2 sm:px-5">
        <div className="flex min-w-0 items-center gap-2">
          <TrainFront className="size-5 shrink-0" />
          <div className="min-w-0">
            <h1 className="font-display truncate text-lg font-bold leading-tight tracking-wide sm:text-xl">
              JackCumber Line
            </h1>
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-ink/80">Brick City Train</p>
          </div>
        </div>
        <div className="flex flex-wrap items-center justify-end gap-x-3 gap-y-1 text-[11px] font-semibold sm:gap-4 sm:text-xs">
          <span className="tabular-nums">
            Stations <span className="text-signal">{hud.stationPoints} / 8</span>
          </span>
          <span className="inline-flex items-center gap-1 tabular-nums">
            <Users className="size-3.5" />
            <span className="text-signal">{hud.passengersOnBoard}</span>
            <span className="text-ink/70">/</span>
            <span className="text-signal">{hud.passengersDelivered}</span>
          </span>
          <span className="inline-flex items-center gap-1 tabular-nums">
            <ShieldAlert className="size-3.5" />
            <span className={hud.endangermentCount ? "text-danger" : "text-signal"}>{hud.endangermentCount}</span>
          </span>
          <span className="inline-flex items-center gap-1 tabular-nums">
            <Timer className="size-3.5" />
            <span className="text-signal">{formatTime(hud.elapsedTime)}</span>
          </span>
          <button
            type="button"
            onClick={toggleMute}
            className="rounded-md p-1.5 hover:bg-black/20"
            aria-label={hud.muted ? "Unmute" : "Mute"}
          >
            {hud.muted ? <VolumeX className="size-4" /> : <Volume2 className="size-4" />}
          </button>
        </div>
      </header>

      <div ref={wrapRef} className="relative min-h-[180px] flex-1">
        <canvas ref={canvasRef} className="block h-full w-full touch-none bg-sky" />
        {hud.showMessage && hud.started ? (
          <div className="pointer-events-none absolute left-1/2 top-3 z-10 max-w-[90%] -translate-x-1/2 rounded-full bg-cab/90 px-4 py-1.5 text-center text-xs font-semibold text-signal ring-1 ring-signal">
            {hud.message}
          </div>
        ) : null}
        {!hud.started ? <StartScreen onStart={start} /> : null}
        {hud.routeFinished && score ? <ResultsModal score={score} onAgain={again} /> : null}
      </div>

      <RouteStrip hud={hud} />
      <Dashboard
        hud={hud}
        onBrake={() =>
          withAudio(() => {
            playBrakeSound();
            gameRef.current!.brake();
          })
        }
        onEbrake={() =>
          withAudio(() => {
            playBrakeSound();
            gameRef.current!.ebrake();
          })
        }
        onHorn={() =>
          withAudio(() => {
            playHornSound();
            gameRef.current!.horn();
          })
        }
        onDoors={() =>
          withAudio(() => {
            const before = gameRef.current!.state.endangermentCount;
            const open = gameRef.current!.state.doorsOpen;
            gameRef.current!.toggleDoors();
            const after = gameRef.current!.state;
            if (after.endangermentCount > before) playAlarmSound();
            else if (after.doorsOpen !== open) playChimeSound();
          })
        }
        onLights={() => withAudio(() => gameRef.current!.toggleLights())}
        onDir={() => withAudio(() => gameRef.current!.toggleDir())}
        onThrottle={(n) =>
          withAudio(() => {
            gameRef.current!.setThrottle(n);
          })
        }
      />
      <p className="shrink-0 px-3 pb-[max(0.5rem,env(safe-area-inset-bottom))] text-center text-[11px] text-muted">
        Up throttle · Down brake · Space e-brake · H horn · D doors · L lights · R reverse
      </p>
    </div>
  );
}

declare global {
  interface Window {
    __controlsTest?: {
      getYaw: () => number;
      getSpeed: () => number;
      setKeys: (codes: string[]) => void;
    };
  }
}
