import { i as __toESM } from "../_runtime.mjs";
import { K as require_react, b as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as TrainFront, c as ShieldAlert, d as LightbulbOff, f as DoorOpen, h as ArrowLeftRight, l as Megaphone, m as CircleStop, n as Volume2, o as Timer, p as DoorClosed, r as Users, s as Siren, t as VolumeX, u as Lightbulb } from "../_libs/lucide-react.mjs";
import { n as clsx, t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-BPA4mZRx.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var ctx = null;
var master = null;
var sfx = null;
var muted = false;
function getCtx() {
	return ctx;
}
function unlockAudio() {
	const w = window;
	const Ctor = window.AudioContext || w.webkitAudioContext;
	if (!Ctor) return;
	if (!ctx) {
		ctx = new Ctor({ latencyHint: "interactive" });
		master = ctx.createGain();
		sfx = ctx.createGain();
		sfx.gain.value = .9;
		master.gain.value = muted ? 0 : .85;
		sfx.connect(master);
		master.connect(ctx.destination);
	}
	if (ctx.state === "suspended") ctx.resume();
}
function resumeAudio() {
	if (ctx?.state === "suspended") ctx.resume();
}
function setMuted(next) {
	muted = next;
	if (master && ctx) master.gain.setTargetAtTime(next ? 0 : .85, ctx.currentTime, .02);
}
function bus() {
	return sfx;
}
function playBrakeSound() {
	const ac = getCtx();
	const out = bus();
	if (!ac || !out) return;
	const len = ac.sampleRate * .22;
	const buffer = ac.createBuffer(1, len, ac.sampleRate);
	const data = buffer.getChannelData(0);
	for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
	const noise = ac.createBufferSource();
	noise.buffer = buffer;
	const filter = ac.createBiquadFilter();
	filter.type = "bandpass";
	filter.frequency.value = 2600;
	filter.Q.value = 5;
	const gain = ac.createGain();
	gain.gain.setValueAtTime(.14, ac.currentTime);
	gain.gain.exponentialRampToValueAtTime(.01, ac.currentTime + .22);
	noise.connect(filter);
	filter.connect(gain);
	gain.connect(out);
	noise.start();
}
function playChimeSound() {
	const ac = getCtx();
	const out = bus();
	if (!ac || !out) return;
	const osc = ac.createOscillator();
	const gain = ac.createGain();
	osc.type = "sine";
	osc.frequency.setValueAtTime(523.25, ac.currentTime);
	osc.frequency.setValueAtTime(659.25, ac.currentTime + .12);
	gain.gain.setValueAtTime(.18, ac.currentTime);
	gain.gain.exponentialRampToValueAtTime(.01, ac.currentTime + .4);
	osc.connect(gain);
	gain.connect(out);
	osc.start();
	osc.stop(ac.currentTime + .4);
}
function playHornSound() {
	const ac = getCtx();
	const out = bus();
	if (!ac || !out) return;
	const now = ac.currentTime;
	for (const freq of [
		196,
		247,
		294
	]) {
		const osc = ac.createOscillator();
		osc.type = "sawtooth";
		osc.frequency.value = freq;
		const filter = ac.createBiquadFilter();
		filter.type = "lowpass";
		filter.frequency.value = 720;
		const gain = ac.createGain();
		gain.gain.setValueAtTime(1e-4, now);
		gain.gain.exponentialRampToValueAtTime(.07, now + .04);
		gain.gain.exponentialRampToValueAtTime(1e-4, now + .85);
		osc.connect(filter);
		filter.connect(gain);
		gain.connect(out);
		osc.start(now);
		osc.stop(now + .88);
	}
}
function playAlarmSound() {
	const ac = getCtx();
	const out = bus();
	if (!ac || !out) return;
	const now = ac.currentTime;
	const osc = ac.createOscillator();
	const gain = ac.createGain();
	osc.type = "square";
	osc.frequency.setValueAtTime(880, now);
	osc.frequency.setValueAtTime(620, now + .12);
	osc.frequency.setValueAtTime(880, now + .24);
	gain.gain.setValueAtTime(.08, now);
	gain.gain.exponentialRampToValueAtTime(.01, now + .38);
	osc.connect(gain);
	gain.connect(out);
	osc.start(now);
	osc.stop(now + .4);
}
function playRailClick() {
	const ac = getCtx();
	const out = bus();
	if (!ac || !out) return;
	const osc = ac.createOscillator();
	const gain = ac.createGain();
	osc.type = "triangle";
	osc.frequency.value = 180 + Math.random() * 40;
	gain.gain.setValueAtTime(.03, ac.currentTime);
	gain.gain.exponentialRampToValueAtTime(.004, ac.currentTime + .04);
	osc.connect(gain);
	gain.connect(out);
	osc.start();
	osc.stop(ac.currentTime + .05);
}
/** World units advanced per km/h per second. */
var PX_PER_KMH = 4.2;
function createStations() {
	return [
		{
			name: "1. Brick Central",
			pos: 1080,
			passengers: 5,
			visited: false,
			isTerminal: false
		},
		{
			name: "2. City Park",
			pos: 3180,
			passengers: 8,
			visited: false,
			isTerminal: false
		},
		{
			name: "3. Yellow Bridge",
			pos: 4620,
			passengers: 3,
			visited: false,
			isTerminal: false
		},
		{
			name: "4. North Suburbs",
			pos: 7540,
			passengers: 6,
			visited: false,
			isTerminal: false
		},
		{
			name: "5. River Crossing",
			pos: 9720,
			passengers: 7,
			visited: false,
			isTerminal: false
		},
		{
			name: "6. East Plaza",
			pos: 14080,
			passengers: 9,
			visited: false,
			isTerminal: false
		},
		{
			name: "7. Tech District",
			pos: 16240,
			passengers: 4,
			visited: false,
			isTerminal: false
		},
		{
			name: "8. Harbor Bay",
			pos: 19560,
			passengers: 6,
			visited: false,
			isTerminal: false
		},
		{
			name: "9. Grand Terminal",
			pos: 22840,
			passengers: 0,
			visited: false,
			isTerminal: true
		}
	];
}
function routeEnd(stations) {
	return stations[stations.length - 1]?.pos ?? 0;
}
function computeParTimeSec(stations) {
	const driveSec = routeEnd(stations) / (36 * PX_PER_KMH);
	return Math.round(driveSec + 52);
}
function stationAt(stations, pos, radius = 160) {
	return stations.find((s) => Math.abs(s.pos - pos) < radius) ?? null;
}
function nextStation(stations, pos) {
	return stations.find((s) => s.pos > pos - 40) ?? stations[stations.length - 1];
}
function hash(n) {
	const s = Math.sin(n * 12.9898) * 43758.5453;
	return s - Math.floor(s);
}
function drawMinifig(ctx, x, y, alt) {
	ctx.fillStyle = alt ? "#1e3a8a" : "#7f1d1d";
	ctx.fillRect(x, y - 10, 7, 10);
	ctx.fillStyle = alt ? "#ef4444" : "#3b82f6";
	ctx.fillRect(x - 1, y - 24, 9, 14);
	ctx.fillStyle = "#ffcf00";
	ctx.beginPath();
	ctx.arc(x + 3.5, y - 28, 4, 0, Math.PI * 2);
	ctx.fill();
}
function drawBackground(ctx, cameraX, w, h, groundY) {
	ctx.fillStyle = "#38bdf8";
	ctx.fillRect(0, 0, w, h);
	ctx.fillStyle = "#fef08a";
	ctx.beginPath();
	ctx.arc(w * .84, 56, 34, 0, Math.PI * 2);
	ctx.fill();
	ctx.fillStyle = "#ffffff";
	for (let i = 0; i < 12; i++) {
		const screenX = ((i * 520 - cameraX * .05) % (w + 400) + (w + 400)) % (w + 400) - 80;
		const cy = 42 + i % 3 * 18;
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
		const worldX = x + cameraX * .16;
		const height = 48 + Math.sin(worldX * .003) * 28 + Math.cos(worldX * .007) * 18;
		ctx.lineTo(x, groundY - height);
	}
	ctx.lineTo(w, groundY);
	ctx.fill();
}
function drawBuildings(ctx, cameraX, groundY, w, zone, start, end) {
	const step = zone === "suburb" ? 340 : 220;
	for (let x = Math.floor(start / step) * step; x < end; x += step) {
		const screenX = x - cameraX * .55;
		if (screenX < -80 || screenX > w + 80) continue;
		const hgt = zone === "tech" ? 90 + hash(x) * 70 : zone === "city" ? 70 + hash(x) * 50 : zone === "harbor" ? 40 + hash(x) * 30 : 36 + hash(x) * 24;
		const bw = zone === "tech" ? 36 : 28;
		ctx.fillStyle = zone === "tech" ? "#334155" : zone === "harbor" ? "#78716c" : "#64748b";
		ctx.fillRect(screenX, groundY - hgt, bw, hgt);
		ctx.fillStyle = "#fde68a";
		const cols = 2;
		const rows = Math.max(2, Math.floor(hgt / 16));
		for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) if (hash(x + r * 9 + c) > .35) ctx.fillRect(screenX + 6 + c * 10, groundY - hgt + 8 + r * 14, 6, 8);
	}
}
function drawTrees(ctx, cameraX, groundY, w, start, end, gap) {
	for (let x = Math.floor(start / gap) * gap; x < end; x += gap) {
		const screenX = x - cameraX * .4;
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
function drawRiver(ctx, cameraX, groundY, w, h) {
	const left = 9200 - cameraX;
	const right = 10240 - cameraX;
	if (right < 0 || left > w) return;
	ctx.fillStyle = "#0284c7";
	ctx.fillRect(left, groundY - 6, right - left, h - (groundY - 6));
	ctx.fillStyle = "rgba(255,255,255,0.25)";
	ctx.fillRect(left, groundY + 10, right - left, 4);
}
function drawYellowBridge(ctx, cameraX, groundY, w) {
	const screenX = 4620 - cameraX;
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
function drawHarborCranes(ctx, cameraX, groundY, w) {
	for (const x of [
		18800,
		19240,
		19980
	]) {
		const sx = x - cameraX * .7;
		if (sx < -40 || sx > w + 40) continue;
		ctx.fillStyle = "#a16207";
		ctx.fillRect(sx, groundY - 130, 8, 130);
		ctx.fillRect(sx, groundY - 130, 70, 6);
		ctx.fillRect(sx + 64, groundY - 126, 4, 36);
	}
}
function drawTrack(ctx, cameraX, groundY, w, h) {
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
function drawStations(ctx, state, cameraX, groundY, w) {
	for (const st of state.stations) {
		const screenX = st.pos - cameraX;
		if (screenX < -260 || screenX > w + 260) continue;
		ctx.save();
		ctx.translate(screenX, groundY - 16);
		ctx.fillStyle = st.isTerminal ? "#334155" : "#94a3b8";
		ctx.fillRect(-180, -12, 360, 12);
		ctx.fillStyle = "#ffcf00";
		ctx.fillRect(-180, -14, 360, 2);
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
		for (let p = 0; p < st.passengers; p++) drawMinifig(ctx, -120 + p * 16, -12, p % 2 === 0);
		ctx.restore();
	}
}
function drawCarriage(ctx, x, groundY, color, isFront, isRear, state) {
	ctx.save();
	ctx.translate(x, groundY - 16);
	const w = 180;
	const h = 55;
	ctx.fillStyle = "#111827";
	ctx.fillRect(-90, -12, w, 12);
	for (const bx of [-60, w / 2 - 30]) {
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
	ctx.fillRect(-85, -67, 170, h);
	ctx.fillStyle = "#0055bf";
	ctx.fillRect(-85, -35, 170, 10);
	ctx.fillStyle = "#ffffff";
	ctx.fillRect(-85, -39, 170, 4);
	if (isFront || isRear) {
		const dirMultiplier = isFront ? 1 : -1;
		const noseX = (w / 2 - 5) * dirMultiplier;
		ctx.fillStyle = "#ffcf00";
		ctx.beginPath();
		ctx.moveTo(noseX, -12);
		ctx.lineTo(noseX + 25 * dirMultiplier, -12);
		ctx.lineTo(noseX + 10 * dirMultiplier, -52);
		ctx.lineTo(noseX, -52);
		ctx.closePath();
		ctx.fill();
		ctx.fillStyle = "#1e293b";
		ctx.beginPath();
		ctx.moveTo(noseX - 5 * dirMultiplier, -52);
		ctx.lineTo(noseX + 12 * dirMultiplier, -52);
		ctx.lineTo(noseX - 2 * dirMultiplier, -25);
		ctx.lineTo(noseX - 20 * dirMultiplier, -25);
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
				ctx.lineTo(hlX + 220, -55);
				ctx.lineTo(hlX + 220, 5);
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
				const t = 1 - (state.hornUntil - state.now) / .85;
				ctx.strokeStyle = `rgba(255, 207, 0, ${1 - t})`;
				ctx.lineWidth = 2;
				for (let i = 1; i <= 3; i++) {
					ctx.beginPath();
					ctx.arc(hlX + 8, -28, 16 + t * 28 + i * 10, -.55, .55);
					ctx.stroke();
				}
			}
		}
	}
	if (!isFront && !isRear) {
		ctx.fillStyle = "#1e293b";
		for (let wx = -65; wx <= w / 2 - 35; wx += 30) {
			ctx.fillRect(wx, -55, 20, 18);
			ctx.fillStyle = "rgba(255,255,255,0.4)";
			ctx.fillRect(wx + 2, -53, 6, 14);
			ctx.fillStyle = "#1e293b";
		}
		const visible = Math.min(state.passengersOnBoard, 3);
		for (let m = 0; m < visible; m++) {
			const mx = -58 + m * 30;
			ctx.fillStyle = "#ffcf00";
			ctx.beginPath();
			ctx.arc(mx + 5, -45, 3.5, 0, Math.PI * 2);
			ctx.fill();
		}
		ctx.strokeStyle = "#1e293b";
		ctx.lineWidth = 2;
		ctx.strokeRect(-80, -62, 14, 50);
		ctx.strokeRect(w / 2 - 24, -62, 14, 50);
		if (state.doorsOpen) {
			ctx.fillStyle = "#ffcf00";
			ctx.fillRect(-79, -61, 12, 48);
		}
	}
	ctx.fillStyle = color;
	for (let sx = -80; sx <= w / 2 - 15; sx += 12) ctx.fillRect(sx, -70, 6, 3);
	if (isFront) {
		ctx.strokeStyle = "#475569";
		ctx.lineWidth = 2;
		ctx.beginPath();
		ctx.moveTo(-20, -67);
		ctx.lineTo(-10, -85);
		ctx.lineTo(10, -85);
		ctx.lineTo(20, -67);
		ctx.moveTo(-10, -85);
		ctx.lineTo(0, -102);
		ctx.lineTo(10, -85);
		ctx.stroke();
		ctx.fillStyle = "#000";
		ctx.fillRect(-12, -104, 24, 3);
	}
	ctx.fillStyle = "#374151";
	ctx.fillRect(-98, -18, 10, 6);
	ctx.fillRect(w / 2, -18, 10, 6);
	ctx.restore();
}
function drawScene(ctx, state, width, height) {
	const groundY = height * .74;
	const cameraX = state.trainPos - width * .38;
	ctx.clearRect(0, 0, width, height);
	drawBackground(ctx, cameraX, width, height, groundY);
	drawBuildings(ctx, cameraX, groundY, width, "city", 0, 2800);
	drawTrees(ctx, cameraX, groundY, width, 2400, 5200, 200);
	drawYellowBridge(ctx, cameraX, groundY, width);
	drawBuildings(ctx, cameraX, groundY, width, "suburb", 6200, 8600);
	drawTrees(ctx, cameraX, groundY, width, 6200, 9e3, 260);
	drawRiver(ctx, cameraX, groundY, width, height);
	drawTrees(ctx, cameraX, groundY, width, 11e3, 13800, 180);
	drawBuildings(ctx, cameraX, groundY, width, "tech", 15e3, 17600);
	drawHarborCranes(ctx, cameraX, groundY, width);
	drawBuildings(ctx, cameraX, groundY, width, "harbor", 18400, 21400);
	drawBuildings(ctx, cameraX, groundY, width, "city", 21400, 24e3);
	drawTrack(ctx, cameraX, groundY, width, height);
	drawStations(ctx, state, cameraX, groundY, width);
	const trainX = state.trainPos - cameraX;
	drawCarriage(ctx, trainX - 380, groundY, "#ffcf00", false, true, state);
	drawCarriage(ctx, trainX - 190, groundY, "#0055bf", false, false, state);
	drawCarriage(ctx, trainX, groundY, "#ffcf00", true, false, state);
	if (state.doorsOpen && !state.stations.some((s) => Math.abs(s.pos - state.trainPos) < 160)) {
		ctx.fillStyle = "rgba(227, 0, 11, 0.16)";
		ctx.fillRect(0, 0, width, height);
	}
}
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
function clamp(n, min, max) {
	return Math.max(min, Math.min(max, n));
}
function formatTime(ms) {
	const safe = Math.max(0, ms);
	const totalSec = safe / 1e3;
	const min = Math.floor(totalSec / 60);
	const sec = Math.floor(totalSec % 60);
	const tenths = Math.floor(safe % 1e3 / 100);
	return `${String(min).padStart(2, "0")}:${String(sec).padStart(2, "0")}.${tenths}`;
}
function computeScore(state) {
	const skippedCount = state.stations.filter((s) => !s.isTerminal && !s.visited).length;
	const skippedPenalty = skippedCount * 150;
	const accelPen = state.accelDeductions;
	const revPen = state.reversalCount * 5;
	const midStopPen = state.midTrackStopCount * 10;
	const comfortScore = Math.max(0, 100 - accelPen - revPen - midStopPen);
	const endangerPen = state.endangermentCount * 50 + state.endangeredPassengers * 25;
	const elapsedSec = state.elapsedTime / 1e3;
	const parTimeSec = state.parTimeSec;
	const timeDiff = elapsedSec - parTimeSec;
	const timeScore = timeDiff <= 0 ? Math.min(400, Math.round(-timeDiff * 2.5)) : -Math.round(timeDiff * 4);
	const stationScore = state.stationPoints * 100;
	const passengerScore = state.passengersDelivered * 20;
	const total = Math.max(0, stationScore + passengerScore + comfortScore + timeScore - skippedPenalty - endangerPen);
	return {
		travelTimeLabel: formatTime(state.elapsedTime),
		parTimeLabel: formatTime(parTimeSec * 1e3),
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
		total
	};
}
var THROTTLE_KMH = 6;
var BOARD_INTERVAL = .42;
function log(state, events, text) {
	state.message = text;
	state.messageUntil = state.now + 3.1;
	events.push({
		type: "log",
		text
	});
}
function initialState() {
	const stations = createStations();
	return {
		stations,
		stationPoints: 0,
		passengersDelivered: 0,
		passengersOnBoard: 0,
		trainPos: 90,
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
		parTimeSec: computeParTimeSec(stations)
	};
}
function createGame() {
	const state = initialState();
	let injectedKeys = null;
	const held = /* @__PURE__ */ new Set();
	const prevHeld = /* @__PURE__ */ new Set();
	let throttleRepeat = 0;
	let lastDoorWarn = -10;
	let finishAt = 0;
	function effectiveKeys() {
		return injectedKeys ?? held;
	}
	function justPressed(code) {
		return effectiveKeys().has(code) && !prevHeld.has(code);
	}
	function applyThrottle(level, events, announceJerk) {
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
	function brake(events = []) {
		if (state.routeFinished) return;
		events.push({ type: "brake" });
		const current = state.throttle;
		if (current >= 3) {
			state.accelDeductions += 3;
			log(state, events, "Heavy braking. Comfort penalty.");
		}
		applyThrottle(Math.max(0, current - 2), events, false);
	}
	function ebrake(events = []) {
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
	function toggleDoors(events = []) {
		if (Math.abs(state.trainSpeed) > .5) {
			log(state, events, "Stop fully before opening the doors.");
			return;
		}
		state.doorsOpen = !state.doorsOpen;
		if (state.doorsOpen) {
			state.throttle = 0;
			state.targetSpeed = 0;
			const at = stationAt(state.stations, state.trainPos);
			const inYard = state.trainPos < 230;
			if (!at && !inYard) {
				state.endangermentCount += 1;
				if (state.passengersOnBoard > 0) {
					state.passengersOnBoard -= 1;
					state.endangeredPassengers += 1;
					log(state, events, "Doors opened off-platform. A passenger stepped onto the track.");
				} else log(state, events, "Doors opened on open track. Safety penalty.");
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
	function toggleDir(events = []) {
		if (Math.abs(state.trainSpeed) > .5) {
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
	function horn(events = []) {
		if (state.now < state.hornUntil - .15) return;
		state.hornUntil = state.now + .85;
		events.push({ type: "horn" });
	}
	function snapshot() {
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
			inYard: state.trainPos < 230,
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
			hornActive: state.now < state.hornUntil
		};
	}
	function step(dt) {
		const events = [];
		const capped = Math.min(dt, .1);
		state.now += capped;
		const keys = effectiveKeys();
		if (state.started && !state.routeFinished) {
			throttleRepeat += capped;
			if (throttleRepeat >= .14) {
				throttleRepeat = 0;
				if (keys.has("KeyW") || keys.has("ArrowUp")) applyThrottle(state.throttle + 1, events, true);
				if (keys.has("KeyS") || keys.has("ArrowDown")) applyThrottle(state.throttle - 1, events, false);
			}
			if (justPressed("KeyS") || justPressed("ArrowDown")) brake(events);
			if (justPressed("Space")) ebrake(events);
			if (justPressed("KeyD")) toggleDoors(events);
			if (justPressed("KeyR")) toggleDir(events);
			if (justPressed("KeyL")) toggleLights();
			if (justPressed("KeyH")) horn(events);
		}
		prevHeld.clear();
		for (const k of keys) prevHeld.add(k);
		if (state.isEmergencyBraking && state.now >= state.ebrakeUntil) state.isEmergencyBraking = false;
		if (state.timerRunning) state.elapsedTime += capped * 1e3;
		const target = state.isEmergencyBraking ? 0 : state.targetSpeed;
		const k = state.isEmergencyBraking ? 9 : target === 0 || Math.abs(target) < Math.abs(state.trainSpeed) ? 2.6 : 1.7;
		state.trainSpeed += (target - state.trainSpeed) * (1 - Math.exp(-k * capped));
		if (Math.abs(state.trainSpeed) < .02) state.trainSpeed = 0;
		const atStation = Boolean(stationAt(state.stations, state.trainPos));
		if (state.trainSpeed === 0 && !state.wasStopped) {
			state.wasStopped = true;
			if (!atStation && state.trainPos > 130 && !state.routeFinished && state.started) {
				state.midTrackStopCount += 1;
				log(state, events, "Stopped in the middle of the track. Comfort penalty.");
			}
		} else if (Math.abs(state.trainSpeed) > .5) state.wasStopped = false;
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
		if (current && Math.abs(state.trainSpeed) < .25 && state.doorsOpen && !state.routeFinished) {
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
						finishAt = state.now + .7;
					}
				} else if (current.passengers > 0) {
					current.passengers -= 1;
					state.passengersOnBoard += 1;
					events.push({ type: "board" });
					log(state, events, `Passenger boarded. ${current.passengers} waiting.`);
				}
			}
		} else state.boardingAcc = 0;
		if (state.finishArmed && !state.routeFinished && state.passengersOnBoard === 0 && state.now >= finishAt) {
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
		setThrottle: (level) => applyThrottle(level, [], true),
		brake: () => brake([]),
		ebrake: () => ebrake([]),
		toggleDoors: () => toggleDoors([]),
		toggleDir: () => toggleDir([]),
		toggleLights,
		horn: () => horn([]),
		keyDown(code) {
			held.add(code);
		},
		keyUp(code) {
			held.delete(code);
		},
		blur() {
			held.clear();
		},
		setKeys(codes) {
			injectedKeys = new Set(codes);
		},
		getSpeed() {
			return state.trainSpeed;
		},
		getYaw() {
			return state.direction === 1 ? 0 : Math.PI;
		}
	};
}
var tones = {
	brake: "bg-brake text-ink shadow-[0_3px_0_0_var(--color-brake-deep)]",
	danger: "bg-danger text-ink shadow-[0_3px_0_0_var(--color-danger-deep)]",
	line: "bg-line text-ink shadow-[0_3px_0_0_var(--color-line-deep)]",
	signal: "bg-signal text-cab shadow-[0_3px_0_0_#b69100]",
	quiet: "bg-raised text-ink shadow-[0_3px_0_0_#161720]"
};
function CabButton({ icon, label, hint, active, tone, onClick }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type: "button",
		title: hint,
		onClick,
		className: cn("flex min-h-11 flex-col items-center justify-center gap-0.5 rounded-md px-2 py-2", "text-[11px] font-semibold uppercase tracking-wide", "transition-transform duration-75 ease-out", "active:translate-y-px active:shadow-none", tones[tone], active && "ring-2 ring-ink"),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
			className: "flex items-center gap-1.5",
			children: [icon, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: label })]
		})
	});
}
function levelFromPointer(clientX, clientY, el) {
	const r = el.getBoundingClientRect();
	if (r.width > r.height) return Math.round(Math.max(0, Math.min(10, (clientX - r.left) / r.width * 10)));
	return Math.round(Math.max(0, Math.min(10, (1 - (clientY - r.top) / r.height) * 10)));
}
function ThrottleLever({ value, onChange, disabled }) {
	const trackRef = (0, import_react.useRef)(null);
	const dragging = (0, import_react.useRef)(false);
	const pct = value / 10 * 100;
	const apply = (0, import_react.useCallback)((clientX, clientY) => {
		const el = trackRef.current;
		if (!el || disabled) return;
		onChange(levelFromPointer(clientX, clientY, el));
	}, [disabled, onChange]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex h-full min-h-16 w-full items-center gap-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				ref: trackRef,
				role: "slider",
				"aria-valuemin": 0,
				"aria-valuemax": 10,
				"aria-valuenow": value,
				"aria-label": "Throttle",
				tabIndex: 0,
				onKeyDown: (e) => {
					if (disabled) return;
					if (e.key === "ArrowUp" || e.key === "ArrowRight") onChange(Math.min(10, value + 1));
					if (e.key === "ArrowDown" || e.key === "ArrowLeft") onChange(Math.max(0, value - 1));
				},
				onPointerDown: (e) => {
					dragging.current = true;
					e.currentTarget.setPointerCapture(e.pointerId);
					apply(e.clientX, e.clientY);
				},
				onPointerMove: (e) => {
					if (!dragging.current) return;
					apply(e.clientX, e.clientY);
				},
				onPointerUp: () => {
					dragging.current = false;
				},
				onPointerCancel: () => {
					dragging.current = false;
				},
				className: cn("relative w-full touch-none rounded-full bg-cab ring-1 ring-border", "h-9 sm:h-full sm:min-h-28 sm:w-9"),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "absolute top-1/2 size-7 -translate-y-1/2 rounded-full bg-signal sm:hidden",
					style: { left: `clamp(2px, calc(${pct}% - 14px), calc(100% - 30px))` }
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "absolute left-1/2 hidden size-7 -translate-x-1/2 rounded-full bg-signal sm:block",
					style: { bottom: `clamp(2px, calc(${pct}% - 14px), calc(100% - 30px))` }
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "hidden h-full min-h-28 flex-col justify-between py-0.5 text-[11px] font-semibold text-muted sm:flex",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "10 MAX" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "5 MID" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "0 IDLE" })
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2 text-[11px] font-semibold text-muted sm:hidden",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "IDLE" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "tabular-nums text-signal",
						children: value
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "MAX" })
				]
			})
		]
	});
}
function Dashboard({ hud, onBrake, onEbrake, onHorn, onDoors, onLights, onDir, onThrottle }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid shrink-0 grid-cols-1 gap-2 bg-cab p-2 sm:grid-cols-[minmax(0,220px)_1fr_minmax(0,180px)] sm:gap-3 sm:p-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "flex flex-col gap-2 rounded-lg bg-panel p-3 ring-1 ring-border",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-[11px] font-semibold uppercase tracking-wider text-muted",
					children: "Instrument panel"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-end justify-between gap-3 sm:flex-col sm:items-center sm:justify-center",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-center",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "font-display text-5xl font-bold leading-none text-signal tabular-nums",
							children: hud.speed
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-1 text-[11px] text-muted",
							children: "km/h"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0 text-left text-xs sm:w-full",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-muted",
								children: "Next"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "truncate font-semibold text-signal",
								children: hud.nextStationName
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "tabular-nums text-ink",
								children: [Math.round(hud.stationDist), " m"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: hud.atPlatform || hud.inYard ? "mt-1 font-semibold text-ok" : "mt-1 text-muted",
								children: hud.atPlatform ? "On platform" : hud.inYard ? "Yard — doors safe" : "Open track"
							})
						]
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "flex flex-col gap-2 rounded-lg bg-panel p-3 ring-1 ring-border",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-[11px] font-semibold uppercase tracking-wider text-muted",
					children: "Train controls"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-3 gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CabButton, {
							tone: "brake",
							label: "Brake",
							hint: "Down arrow or S",
							icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleStop, { className: "size-4" }),
							onClick: onBrake
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CabButton, {
							tone: "danger",
							label: "E-Brake",
							hint: "Space",
							active: hud.isEmergencyBraking,
							icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Siren, { className: "size-4" }),
							onClick: onEbrake
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CabButton, {
							tone: "signal",
							label: "Horn",
							hint: "H",
							active: hud.hornActive,
							icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Megaphone, { className: "size-4" }),
							onClick: onHorn
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CabButton, {
							tone: "line",
							label: "Doors",
							hint: "D",
							active: hud.doorsOpen,
							icon: hud.doorsOpen ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DoorOpen, { className: "size-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DoorClosed, { className: "size-4" }),
							onClick: onDoors
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CabButton, {
							tone: "signal",
							label: hud.lightsOn ? "Lights on" : "Lights off",
							hint: "L",
							active: hud.lightsOn,
							icon: hud.lightsOn ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lightbulb, { className: "size-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LightbulbOff, { className: "size-4" }),
							onClick: onLights
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CabButton, {
							tone: "quiet",
							label: hud.direction === 1 ? "Dir fwd" : "Dir rev",
							hint: "R",
							icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeftRight, { className: "size-4" }),
							onClick: onDir
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "flex flex-col gap-2 rounded-lg bg-panel p-3 ring-1 ring-border",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-[11px] font-semibold uppercase tracking-wider text-muted",
					children: "10-speed throttle"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ThrottleLever, {
					value: hud.throttle,
					onChange: onThrottle,
					disabled: !hud.started || hud.routeFinished
				})]
			})
		]
	});
}
var buttonVariants = cva("inline-flex items-center justify-center gap-2 rounded-md font-semibold tracking-wide transition-opacity duration-150 ease-out disabled:pointer-events-none disabled:opacity-50", {
	variants: {
		variant: {
			primary: "bg-ink text-cab hover:opacity-90",
			secondary: "bg-raised text-ink ring-1 ring-border hover:opacity-90",
			line: "bg-line text-ink hover:opacity-90"
		},
		size: {
			md: "h-11 px-4 text-sm",
			lg: "h-12 px-6 text-base"
		}
	},
	defaultVariants: {
		variant: "primary",
		size: "md"
	}
});
function Button({ className, variant, size, type = "button", ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type,
		className: cn(buttonVariants({
			variant,
			size
		}), className),
		...props
	});
}
function Row({ label, value, warn }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-baseline justify-between gap-4 text-sm",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "text-muted",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: cn("font-semibold tabular-nums", warn ? "text-danger" : "text-sky"),
			children: value
		})]
	});
}
function ResultsModal({ score, onAgain }) {
	const timeLabel = score.timeScore >= 0 ? `${score.travelTimeLabel}  +${score.timeScore} pts` : `${score.travelTimeLabel}  ${score.timeScore} pts`;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "absolute inset-0 z-30 flex items-center justify-center bg-cab/90 p-4",
		role: "dialog",
		"aria-modal": "true",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "w-full max-w-md rounded-xl bg-panel p-6 shadow-cab ring-2 ring-signal sm:p-7",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-center text-3xl font-bold tracking-tight text-signal",
					children: "Route completed"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-1 text-center text-xs text-muted",
					children: ["Par time ", score.parTimeLabel]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-5 space-y-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
							label: "Travel time score",
							value: timeLabel,
							warn: score.timeScore < 0
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
							label: "Stations visited",
							value: `${score.stationPoints} / 8  (+${score.stationScore} pts)`
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
							label: "Skipped stations",
							value: `-${score.skippedPenalty} pts (${score.skippedCount} skipped)`,
							warn: score.skippedPenalty > 0
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
							label: "Passengers delivered",
							value: `${score.passengersDelivered}  (+${score.passengerScore} pts)`
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
							label: "Hard accel / brake",
							value: `-${score.accelPen} pts`,
							warn: score.accelPen > 0
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
							label: "Reversals",
							value: `-${score.revPen} pts (${score.reversalCount}x)`,
							warn: score.revPen > 0
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
							label: "Mid-track stops",
							value: `-${score.midStopPen} pts (${score.midTrackStopCount}x)`,
							warn: score.midStopPen > 0
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
							label: "Passenger endangerment",
							value: `-${score.endangerPen} pts (${score.endangermentCount} doors / ${score.endangeredPassengers} at risk)`,
							warn: score.endangerPen > 0
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
							label: "Comfort",
							value: `${score.comfortScore} / 100`
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4 flex items-center justify-between border-t border-dashed border-signal pt-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-sm font-semibold uppercase tracking-wide",
						children: "Total score"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "font-display text-3xl font-bold text-signal tabular-nums",
						children: [score.total, " pts"]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					className: "mt-5 w-full",
					size: "lg",
					variant: "line",
					onClick: onAgain,
					children: "Drive route again"
				})
			]
		})
	});
}
function StartScreen({ onStart }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "absolute inset-0 z-20 flex items-center justify-center bg-cab/80 p-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "w-full max-w-md rounded-xl bg-panel p-6 text-center shadow-cab ring-1 ring-border sm:p-8",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mx-auto mb-4 flex size-12 items-center justify-center rounded-lg bg-line text-ink",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrainFront, { className: "size-6" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-[11px] font-semibold uppercase tracking-[0.18em] text-muted",
					children: "Brick City Train"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-display mt-1 text-4xl font-bold tracking-tight text-ink text-balance",
					children: "JackCumber Line"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 text-sm leading-relaxed text-muted text-pretty",
					children: "Drive the cab, stop on the yellow line, and open doors only at platforms. Time, comfort, and passenger safety all count toward your score."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
					className: "mt-5 space-y-2 text-left text-sm text-ink",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "flex gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DoorClosed, { className: "mt-0.5 size-4 shrink-0 text-danger" }), "Opening doors on open track is passenger endangerment."]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "flex gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Timer, { className: "mt-0.5 size-4 shrink-0 text-signal" }), "Beat the timetable for a time bonus. Running late costs points."]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "flex gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrainFront, { className: "mt-0.5 size-4 shrink-0 text-line" }), "Station gaps vary. Smooth throttle, no mid-track stops."]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					className: "mt-6 w-full",
					size: "lg",
					variant: "primary",
					onClick: onStart,
					children: "Start run"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 text-[11px] leading-relaxed text-muted",
					children: "Up / W throttle · Down / S brake · Space e-brake · H horn · D doors · L lights · R reverse"
				})
			]
		})
	});
}
var GAME_CODES = /* @__PURE__ */ new Set([
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
	"KeyH"
]);
function playEvents(events) {
	for (const ev of events) if (ev.type === "brake") playBrakeSound();
	else if (ev.type === "chime" || ev.type === "board") playChimeSound();
	else if (ev.type === "alarm") playAlarmSound();
	else if (ev.type === "horn") playHornSound();
	else if (ev.type === "rail") playRailClick();
}
function RouteStrip({ hud }) {
	const end = Math.max(1, hud.routeEnd);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative mx-3 mb-2 h-2 rounded-full bg-raised ring-1 ring-border",
		children: [hud.stations.map((st) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			title: st.name,
			className: st.isTerminal ? "absolute top-1/2 size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-danger" : st.visited ? "absolute top-1/2 size-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-ok" : "absolute top-1/2 size-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-signal",
			style: { left: `${st.pos / end * 100}%` }
		}, st.name)), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "absolute top-1/2 size-3 -translate-x-1/2 -translate-y-1/2 rounded-sm bg-ink",
			style: { left: `${hud.trainPos / end * 100}%` }
		})]
	});
}
function TrainApp() {
	const wrapRef = (0, import_react.useRef)(null);
	const canvasRef = (0, import_react.useRef)(null);
	const gameRef = (0, import_react.useRef)(null);
	if (!gameRef.current) gameRef.current = createGame();
	const [hud, setHud] = (0, import_react.useState)(() => gameRef.current.snapshot());
	const [score, setScore] = (0, import_react.useState)(null);
	const hudRef = (0, import_react.useRef)(hud);
	hudRef.current = hud;
	const bump = (0, import_react.useCallback)(() => {
		const next = gameRef.current.snapshot();
		setHud(next);
		if (next.routeFinished) setScore(computeScore(gameRef.current.state));
	}, []);
	(0, import_react.useEffect)(() => {
		const game = gameRef.current;
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
		const loop = (t) => {
			if (!alive) return;
			const dt = Math.min(.1, (t - last) / 1e3);
			last = t;
			const events = game.step(dt);
			if (events.length) playEvents(events);
			const cssW = canvas.clientWidth;
			const cssH = canvas.clientHeight;
			drawScene(ctx, game.state, cssW, cssH);
			uiAcc += dt;
			if (uiAcc > .08 || events.length) {
				uiAcc = 0;
				bump();
			}
			raf = requestAnimationFrame(loop);
		};
		raf = requestAnimationFrame(loop);
		const onKeyDown = (e) => {
			if (e.metaKey || e.ctrlKey || e.altKey) return;
			if (GAME_CODES.has(e.code)) e.preventDefault();
			unlockAudio();
			game.keyDown(e.code);
		};
		const onKeyUp = (e) => {
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
			setKeys: (codes) => game.setKeys(codes)
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
	const withAudio = (fn) => {
		unlockAudio();
		fn();
		bump();
	};
	const start = () => {
		unlockAudio();
		gameRef.current.start();
		bump();
	};
	const again = () => {
		gameRef.current.reset();
		setScore(null);
		gameRef.current.start();
		bump();
	};
	const toggleMute = () => {
		const next = !hud.muted;
		gameRef.current.state.muted = next;
		setMuted(next);
		bump();
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex h-dvh min-h-0 flex-col overflow-hidden bg-cab text-ink",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "flex shrink-0 items-center justify-between gap-3 bg-line px-3 py-2 sm:px-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex min-w-0 items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrainFront, { className: "size-5 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "font-display truncate text-lg font-bold leading-tight tracking-wide sm:text-xl",
							children: "JackCumber Line"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[10px] font-semibold uppercase tracking-[0.14em] text-ink/80",
							children: "Brick City Train"
						})]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center justify-end gap-x-3 gap-y-1 text-[11px] font-semibold sm:gap-4 sm:text-xs",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "tabular-nums",
							children: ["Stations ", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-signal",
								children: [hud.stationPoints, " / 8"]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "inline-flex items-center gap-1 tabular-nums",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "size-3.5" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-signal",
									children: hud.passengersOnBoard
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-ink/70",
									children: "/"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-signal",
									children: hud.passengersDelivered
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "inline-flex items-center gap-1 tabular-nums",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldAlert, { className: "size-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: hud.endangermentCount ? "text-danger" : "text-signal",
								children: hud.endangermentCount
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "inline-flex items-center gap-1 tabular-nums",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Timer, { className: "size-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-signal",
								children: formatTime(hud.elapsedTime)
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: toggleMute,
							className: "rounded-md p-1.5 hover:bg-black/20",
							"aria-label": hud.muted ? "Unmute" : "Mute",
							children: hud.muted ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VolumeX, { className: "size-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Volume2, { className: "size-4" })
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				ref: wrapRef,
				className: "relative min-h-[180px] flex-1",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("canvas", {
						ref: canvasRef,
						className: "block h-full w-full touch-none bg-sky"
					}),
					hud.showMessage && hud.started ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "pointer-events-none absolute left-1/2 top-3 z-10 max-w-[90%] -translate-x-1/2 rounded-full bg-cab/90 px-4 py-1.5 text-center text-xs font-semibold text-signal ring-1 ring-signal",
						children: hud.message
					}) : null,
					!hud.started ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StartScreen, { onStart: start }) : null,
					hud.routeFinished && score ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResultsModal, {
						score,
						onAgain: again
					}) : null
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RouteStrip, { hud }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dashboard, {
				hud,
				onBrake: () => withAudio(() => {
					playBrakeSound();
					gameRef.current.brake();
				}),
				onEbrake: () => withAudio(() => {
					playBrakeSound();
					gameRef.current.ebrake();
				}),
				onHorn: () => withAudio(() => {
					playHornSound();
					gameRef.current.horn();
				}),
				onDoors: () => withAudio(() => {
					const before = gameRef.current.state.endangermentCount;
					const open = gameRef.current.state.doorsOpen;
					gameRef.current.toggleDoors();
					const after = gameRef.current.state;
					if (after.endangermentCount > before) playAlarmSound();
					else if (after.doorsOpen !== open) playChimeSound();
				}),
				onLights: () => withAudio(() => gameRef.current.toggleLights()),
				onDir: () => withAudio(() => gameRef.current.toggleDir()),
				onThrottle: (n) => withAudio(() => {
					gameRef.current.setThrottle(n);
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "shrink-0 px-3 pb-[max(0.5rem,env(safe-area-inset-bottom))] text-center text-[11px] text-muted",
				children: "Up throttle · Down brake · Space e-brake · H horn · D doors · L lights · R reverse"
			})
		]
	});
}
var SplitComponent = TrainApp;
//#endregion
export { SplitComponent as component };
