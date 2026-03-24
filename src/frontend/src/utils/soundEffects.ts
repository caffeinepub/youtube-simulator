export type SoundType = "like" | "subscribe" | "upload" | "coin" | "levelup";

let audioCtx: AudioContext | null = null;

function getCtx(): AudioContext {
  if (!audioCtx)
    audioCtx = new (
      window.AudioContext || (window as any).webkitAudioContext
    )();
  return audioCtx;
}

const configs: Record<
  SoundType,
  { freq: number; type: OscillatorType; duration: number }
> = {
  like: { freq: 880, type: "sine", duration: 0.1 },
  subscribe: { freq: 523, type: "triangle", duration: 0.3 },
  upload: { freq: 659, type: "sine", duration: 0.4 },
  coin: { freq: 1047, type: "square", duration: 0.15 },
  levelup: { freq: 784, type: "sine", duration: 0.6 },
};

export function playSound(type: SoundType, enabled: boolean): void {
  if (!enabled) return;
  try {
    const ctx = getCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    const c = configs[type];
    osc.type = c.type;
    osc.frequency.setValueAtTime(c.freq, ctx.currentTime);
    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + c.duration);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + c.duration);
  } catch {
    // ignore
  }
}
