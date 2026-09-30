type AudioWindow = Window & { webkitAudioContext?: typeof AudioContext };

let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let sfx: GainNode | null = null;
let muted = false;

function getCtx() {
  return ctx;
}

export function unlockAudio() {
  const w = window as AudioWindow;
  const Ctor = window.AudioContext || w.webkitAudioContext;
  if (!Ctor) return;
  if (!ctx) {
    ctx = new Ctor({ latencyHint: "interactive" });
    master = ctx.createGain();
    sfx = ctx.createGain();
    sfx.gain.value = 0.9;
    master.gain.value = muted ? 0 : 0.85;
    sfx.connect(master);
    master.connect(ctx.destination);
  }
  if (ctx.state === "suspended") void ctx.resume();
}

export function resumeAudio() {
  if (ctx?.state === "suspended") void ctx.resume();
}

export function setMuted(next: boolean) {
  muted = next;
  if (master && ctx) {
    master.gain.setTargetAtTime(next ? 0 : 0.85, ctx.currentTime, 0.02);
  }
}

function bus() {
  return sfx;
}

export function playBrakeSound() {
  const ac = getCtx();
  const out = bus();
  if (!ac || !out) return;
  const len = ac.sampleRate * 0.22;
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
  gain.gain.setValueAtTime(0.14, ac.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.01, ac.currentTime + 0.22);
  noise.connect(filter);
  filter.connect(gain);
  gain.connect(out);
  noise.start();
}

export function playChimeSound() {
  const ac = getCtx();
  const out = bus();
  if (!ac || !out) return;
  const osc = ac.createOscillator();
  const gain = ac.createGain();
  osc.type = "sine";
  osc.frequency.setValueAtTime(523.25, ac.currentTime);
  osc.frequency.setValueAtTime(659.25, ac.currentTime + 0.12);
  gain.gain.setValueAtTime(0.18, ac.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.01, ac.currentTime + 0.4);
  osc.connect(gain);
  gain.connect(out);
  osc.start();
  osc.stop(ac.currentTime + 0.4);
}

export function playHornSound() {
  const ac = getCtx();
  const out = bus();
  if (!ac || !out) return;
  const now = ac.currentTime;
  for (const freq of [196, 247, 294]) {
    const osc = ac.createOscillator();
    osc.type = "sawtooth";
    osc.frequency.value = freq;
    const filter = ac.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 720;
    const gain = ac.createGain();
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.07, now + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.85);
    osc.connect(filter);
    filter.connect(gain);
    gain.connect(out);
    osc.start(now);
    osc.stop(now + 0.88);
  }
}

export function playAlarmSound() {
  const ac = getCtx();
  const out = bus();
  if (!ac || !out) return;
  const now = ac.currentTime;
  const osc = ac.createOscillator();
  const gain = ac.createGain();
  osc.type = "square";
  osc.frequency.setValueAtTime(880, now);
  osc.frequency.setValueAtTime(620, now + 0.12);
  osc.frequency.setValueAtTime(880, now + 0.24);
  gain.gain.setValueAtTime(0.08, now);
  gain.gain.exponentialRampToValueAtTime(0.01, now + 0.38);
  osc.connect(gain);
  gain.connect(out);
  osc.start(now);
  osc.stop(now + 0.4);
}

export function playRailClick() {
  const ac = getCtx();
  const out = bus();
  if (!ac || !out) return;
  const osc = ac.createOscillator();
  const gain = ac.createGain();
  osc.type = "triangle";
  osc.frequency.value = 180 + Math.random() * 40;
  gain.gain.setValueAtTime(0.03, ac.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.004, ac.currentTime + 0.04);
  osc.connect(gain);
  gain.connect(out);
  osc.start();
  osc.stop(ac.currentTime + 0.05);
}
