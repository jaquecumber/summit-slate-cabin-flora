import { PLATFORM_RADIUS } from "./stations";
import type { GameState } from "./types";

function hash(n: number) {
  const s = Math.sin(n * 12.9898) * 43758.5453;
  return s - Math.floor(s);
}

function drawMinifig(ctx: CanvasRenderingContext2D, x: number, y: number, alt: boolean) {
  ctx.fillStyle = alt ? "#1e3a8a" : "#7f1d1d";
  ctx.fillRect(x, y - 10, 7, 10);
  ctx.fillStyle = alt ? "#ef4444" : "#3b82f6";
  ctx.fillRect(x - 1, y - 24, 9, 14);
  ctx.fillStyle = "#ffcf00";
  ctx.beginPath();
  ctx.arc(x + 3.5, y - 28, 4, 0, Math.PI * 2);
  ctx.fill();
}

function drawBackground(ctx: CanvasRenderingContext2D, cameraX: number, w: number, h: number, groundY: number) {
  ctx.fillStyle = "#38bdf8";
  ctx.fillRect(0, 0, w, h);

  ctx.fillStyle = "#fef08a";
  ctx.beginPath();
  ctx.arc(w * 0.84, 56, 34, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#ffffff";
  for (let i = 0; i < 12; i++) {
    const cx = i * 520 - cameraX * 0.05;
    const screenX = ((cx % (w + 400)) + (w + 400)) % (w + 400) - 80;
    const cy = 42 + (i % 3) * 18;
    ctx.beginPath();
    ctx.arc(screenX, cy, 20, 0, Math.PI * 2);
    ctx.arc(screenX + 24, cy - 8, 26, 0, Math.PI * 2);
    ctx.arc(screenX + 52, cy, 20, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.fillStyle = "#86efac";
  ctx.beginPath();
  ctx.moveTo(0, groundY);
  for (let x = -200; x < w + 200; x += 90) {
    const worldX = x + cameraX * 0.16;
    const height = 48 + Math.sin(worldX * 0.003) * 28 + Math.cos(worldX * 0.007) * 18;
    ctx.lineTo(x, groundY - height);
  }
  ctx.lineTo(w, groundY);
  ctx.fill();
}

function drawBuildings(
  ctx: CanvasRenderingContext2D,
  cameraX: number,
  groundY: number,
  w: number,
  zone: "city" | "tech" | "harbor" | "suburb",
  start: number,
  end: number,
) {
  const step = zone === "suburb" ? 340 : 220;
  for (let x = Math.floor(start / step) * step; x < end; x += step) {
    const screenX = x - cameraX * 0.55;
    if (screenX < -80 || screenX > w + 80) continue;
    const hgt =
      zone === "tech"
        ? 90 + hash(x) * 70
        : zone === "city"
          ? 70 + hash(x) * 50
          : zone === "harbor"
            ? 40 + hash(x) * 30
            : 36 + hash(x) * 24;
    const bw = zone === "tech" ? 36 : 28;
    ctx.fillStyle = zone === "tech" ? "#334155" : zone === "harbor" ? "#78716c" : "#64748b";
    ctx.fillRect(screenX, groundY - hgt, bw, hgt);
    ctx.fillStyle = "#fde68a";
    const cols = 2;
    const rows = Math.max(2, Math.floor(hgt / 16));
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (hash(x + r * 9 + c) > 0.35) {
          ctx.fillRect(screenX + 6 + c * 10, groundY - hgt + 8 + r * 14, 6, 8);
        }
      }
    }
  }
}

function drawTrees(ctx: CanvasRenderingContext2D, cameraX: number, groundY: number, w: number, start: number, end: number, gap: number) {
  for (let x = Math.floor(start / gap) * gap; x < end; x += gap) {
    const screenX = x - cameraX * 0.4;
    if (screenX < -60 || screenX > w + 60) continue;
    ctx.fillStyle = "#b45309";
    ctx.fillRect(screenX - 4, groundY - 58, 8, 58);
    ctx.fillStyle = "#15803d";
    ctx.beginPath();
    ctx.arc(screenX, groundY - 78, 24, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#22c55e";
    ctx.beginPath();
    ctx.arc(screenX - 8, groundY - 86, 16, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawRiver(ctx: CanvasRenderingContext2D, cameraX: number, groundY: number, w: number, h: number) {
  const center = 9720;
  const half = 520;
  const left = center - half - cameraX;
  const right = center + half - cameraX;
  if (right < 0 || left > w) return;
  ctx.fillStyle = "#0284c7";
  ctx.fillRect(left, groundY - 6, right - left, h - (groundY - 6));
  ctx.fillStyle = "rgba(255,255,255,0.25)";
  ctx.fillRect(left, groundY + 10, right - left, 4);
}

function drawYellowBridge(ctx: CanvasRenderingContext2D, cameraX: number, groundY: number, w: number) {
  const pos = 4620;
  const screenX = pos - cameraX;
  if (screenX < -280 || screenX > w + 280) return;
  ctx.strokeStyle = "#eab308";
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(screenX - 220, groundY - 18);
  ctx.lineTo(screenX - 220, groundY - 92);
  ctx.lineTo(screenX + 220, groundY - 92);
  ctx.lineTo(screenX + 220, groundY - 18);
  ctx.stroke();
  ctx.lineWidth = 3;
  for (let i = -180; i <= 180; i += 60) {
    ctx.beginPath();
    ctx.moveTo(screenX + i, groundY - 18);
    ctx.lineTo(screenX + i + 30, groundY - 92);
    ctx.lineTo(screenX + i + 60, groundY - 18);
    ctx.stroke();
  }
}

function drawHarborCranes(ctx: CanvasRenderingContext2D, cameraX: number, groundY: number, w: number) {
  for (const x of [18800, 19240, 19980]) {
    const sx = x - cameraX * 0.7;
    if (sx < -40 || sx > w + 40) continue;
    ctx.fillStyle = "#a16207";
    ctx.fillRect(sx, groundY - 130, 8, 130);
    ctx.fillRect(sx, groundY - 130, 70, 6);
    ctx.fillRect(sx + 64, groundY - 126, 4, 36);
  }
}

function drawTrack(ctx: CanvasRenderingContext2D, cameraX: number, groundY: number, w: number, h: number) {
  ctx.fillStyle = "#15803d";
  ctx.fillRect(0, groundY, w, h - groundY);
  ctx.fillStyle = "#64748b";
  ctx.fillRect(0, groundY - 8, w, 8);

  const startX = Math.floor((cameraX - 80) / 20) * 20;
  for (let x = startX; x < cameraX + w + 80; x += 20) {
    const screenX = x - cameraX;
    ctx.fillStyle = "#78350f";
    ctx.fillRect(screenX - 4, groundY - 12, 8, 4);
    if (Math.abs(x) % 240 === 0) {
      ctx.fillStyle = "#94a3b8";
      ctx.fillRect(screenX - 3, groundY - 118, 6, 108);
      ctx.fillRect(screenX - 3, groundY - 118, 38, 5);
    }
  }

  ctx.strokeStyle = "#475569";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(0, groundY - 113);
  ctx.lineTo(w, groundY - 113);
  ctx.stroke();

  ctx.fillStyle = "#cbd5e1";
  ctx.fillRect(0, groundY - 16, w, 4);
}

function drawStations(ctx: CanvasRenderingContext2D, state: GameState, cameraX: number, groundY: number, w: number) {
  for (const st of state.stations) {
    const screenX = st.pos - cameraX;
    if (screenX < -260 || screenX > w + 260) continue;
    ctx.save();
    ctx.translate(screenX, groundY - 16);
    const half = PLATFORM_RADIUS + 20;
    ctx.fillStyle = st.isTerminal ? "#334155" : "#94a3b8";
    ctx.fillRect(-half, -12, half * 2, 12);
    ctx.fillStyle = "#ffcf00";
    ctx.fillRect(-half, -14, half * 2, 2);
    ctx.fillStyle = st.isTerminal ? "#e3000b" : "#0055bf";
    ctx.fillRect(-110, -80, 220, 10);
    ctx.fillStyle = "#475569";
    ctx.fillRect(-90, -70, 8, 58);
    ctx.fillRect(82, -70, 8, 58);
    ctx.fillStyle = st.visited ? "#16a34a" : "#e3000b";
    ctx.fillRect(-72, -100, 144, 18);
    ctx.fillStyle = "#fff";
    ctx.font = "bold 11px Barlow, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(st.name, 0, -87);
    for (let p = 0; p < st.passengers; p++) {
      drawMinifig(ctx, -120 + p * 16, -12, p % 2 === 0);
    }
    ctx.restore();
  }
}

function drawCarriage(
  ctx: CanvasRenderingContext2D,
  x: number,
  groundY: number,
  color: string,
  isFront: boolean,
  isRear: boolean,
  state: GameState,
) {
  ctx.save();
  ctx.translate(x, groundY - 16);
  const w = 180;
  const h = 55;

  ctx.fillStyle = "#111827";
  ctx.fillRect(-w / 2, -12, w, 12);

  for (const bx of [-w / 2 + 30, w / 2 - 30]) {
    ctx.fillStyle = "#374151";
    ctx.fillRect(bx - 18, -10, 36, 6);
    for (const wx of [-10, 10]) {
      ctx.save();
      ctx.translate(bx + wx, -6);
      ctx.rotate(state.wheelRotation);
      ctx.fillStyle = "#9ca3af";
      ctx.beginPath();
      ctx.arc(0, 0, 7, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#111827";
      ctx.beginPath();
      ctx.arc(0, 0, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "#9ca3af";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(-4, 0);
      ctx.lineTo(4, 0);
      ctx.moveTo(0, -4);
      ctx.lineTo(0, 4);
      ctx.stroke();
      ctx.restore();
    }
  }

  ctx.fillStyle = color;
  ctx.fillRect(-w / 2 + 5, -12 - h, w - 10, h);
  ctx.fillStyle = "#0055bf";
  ctx.fillRect(-w / 2 + 5, -12 - h + 32, w - 10, 10);
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(-w / 2 + 5, -12 - h + 28, w - 10, 4);

  if (isFront || isRear) {
    const dirMultiplier = isFront ? 1 : -1;
    const noseX = (w / 2 - 5) * dirMultiplier;
    ctx.fillStyle = "#ffcf00";
    ctx.beginPath();
    ctx.moveTo(noseX, -12);
    ctx.lineTo(noseX + 25 * dirMultiplier, -12);
    ctx.lineTo(noseX + 10 * dirMultiplier, -12 - h + 15);
    ctx.lineTo(noseX, -12 - h + 15);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = "#1e293b";
    ctx.beginPath();
    ctx.moveTo(noseX - 5 * dirMultiplier, -12 - h + 15);
    ctx.lineTo(noseX + 12 * dirMultiplier, -12 - h + 15);
    ctx.lineTo(noseX - 2 * dirMultiplier, -12 - h + 42);
    ctx.lineTo(noseX - 20 * dirMultiplier, -12 - h + 42);
    ctx.closePath();
    ctx.fill();

    if (isFront) {
      const hlX = noseX + 18;
      const hlY = -20;
      if (state.lightsOn) {
        const grad = ctx.createLinearGradient(hlX, hlY, hlX + 220, hlY);
        grad.addColorStop(0, "rgba(255, 253, 208, 0.8)");
        grad.addColorStop(1, "rgba(255, 253, 208, 0)");
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.moveTo(hlX, hlY);
        ctx.lineTo(hlX + 220, hlY - 35);
        ctx.lineTo(hlX + 220, hlY + 25);
        ctx.closePath();
        ctx.fill();
        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        ctx.arc(hlX, hlY, 5, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.fillStyle = "#64748b";
        ctx.beginPath();
        ctx.arc(hlX, hlY, 4, 0, Math.PI * 2);
        ctx.fill();
      }

      if (state.now < state.hornUntil) {
        const t = 1 - (state.hornUntil - state.now) / 0.85;
        ctx.strokeStyle = `rgba(255, 207, 0, ${1 - t})`;
        ctx.lineWidth = 2;
        for (let i = 1; i <= 3; i++) {
          ctx.beginPath();
          ctx.arc(hlX + 8, hlY - 8, 16 + t * 28 + i * 10, -0.55, 0.55);
          ctx.stroke();
        }
      }
    }
  }

  if (!isFront && !isRear) {
    ctx.fillStyle = "#1e293b";
    for (let wx = -w / 2 + 25; wx <= w / 2 - 35; wx += 30) {
      ctx.fillRect(wx, -12 - h + 12, 20, 18);
      ctx.fillStyle = "rgba(255,255,255,0.4)";
      ctx.fillRect(wx + 2, -12 - h + 14, 6, 14);
      ctx.fillStyle = "#1e293b";
    }
    const visible = Math.min(state.passengersOnBoard, 3);
    for (let m = 0; m < visible; m++) {
      const mx = -w / 2 + 32 + m * 30;
      ctx.fillStyle = "#ffcf00";
      ctx.beginPath();
      ctx.arc(mx + 5, -12 - h + 22, 3.5, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.strokeStyle = "#1e293b";
    ctx.lineWidth = 2;
    ctx.strokeRect(-w / 2 + 10, -12 - h + 5, 14, h - 5);
    ctx.strokeRect(w / 2 - 24, -12 - h + 5, 14, h - 5);
    if (state.doorsOpen) {
      ctx.fillStyle = "#ffcf00";
      ctx.fillRect(-w / 2 + 11, -12 - h + 6, 12, h - 7);
    }
  }

  ctx.fillStyle = color;
  for (let sx = -w / 2 + 10; sx <= w / 2 - 15; sx += 12) {
    ctx.fillRect(sx, -12 - h - 3, 6, 3);
  }

  if (isFront) {
    ctx.strokeStyle = "#475569";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(-20, -12 - h);
    ctx.lineTo(-10, -12 - h - 18);
    ctx.lineTo(10, -12 - h - 18);
    ctx.lineTo(20, -12 - h);
    ctx.moveTo(-10, -12 - h - 18);
    ctx.lineTo(0, -12 - h - 35);
    ctx.lineTo(10, -12 - h - 18);
    ctx.stroke();
    ctx.fillStyle = "#000";
    ctx.fillRect(-12, -12 - h - 37, 24, 3);
  }

  ctx.fillStyle = "#374151";
  ctx.fillRect(-w / 2 - 8, -18, 10, 6);
  ctx.fillRect(w / 2, -18, 10, 6);
  ctx.restore();
}

export function drawScene(
  ctx: CanvasRenderingContext2D,
  state: GameState,
  width: number,
  height: number,
) {
  const groundY = height * 0.74;
  const cameraX = state.trainPos - width * 0.38;

  ctx.clearRect(0, 0, width, height);
  drawBackground(ctx, cameraX, width, height, groundY);
  drawBuildings(ctx, cameraX, groundY, width, "city", 0, 2800);
  drawTrees(ctx, cameraX, groundY, width, 2400, 5200, 200);
  drawYellowBridge(ctx, cameraX, groundY, width);
  drawBuildings(ctx, cameraX, groundY, width, "suburb", 6200, 8600);
  drawTrees(ctx, cameraX, groundY, width, 6200, 9000, 260);
  drawRiver(ctx, cameraX, groundY, width, height);
  drawTrees(ctx, cameraX, groundY, width, 11000, 13800, 180);
  drawBuildings(ctx, cameraX, groundY, width, "tech", 15000, 17600);
  drawHarborCranes(ctx, cameraX, groundY, width);
  drawBuildings(ctx, cameraX, groundY, width, "harbor", 18400, 21400);
  drawBuildings(ctx, cameraX, groundY, width, "city", 21400, 24000);
  drawTrack(ctx, cameraX, groundY, width, height);
  drawStations(ctx, state, cameraX, groundY, width);

  const trainX = state.trainPos - cameraX;
  drawCarriage(ctx, trainX - 380, groundY, "#ffcf00", false, true, state);
  drawCarriage(ctx, trainX - 190, groundY, "#0055bf", false, false, state);
  drawCarriage(ctx, trainX, groundY, "#ffcf00", true, false, state);

  if (state.doorsOpen && !state.stations.some((s) => Math.abs(s.pos - state.trainPos) < PLATFORM_RADIUS)) {
    ctx.fillStyle = "rgba(227, 0, 11, 0.16)";
    ctx.fillRect(0, 0, width, height);
  }
}
