let audioCtx = null;
function getCtx() {
  if (!audioCtx)
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  return audioCtx;
}
const configs = {
  like: { freq: 880, type: "sine", duration: 0.1 },
  subscribe: { freq: 523, type: "triangle", duration: 0.3 },
  upload: { freq: 659, type: "sine", duration: 0.4 },
  coin: { freq: 1047, type: "square", duration: 0.15 },
  levelup: { freq: 784, type: "sine", duration: 0.6 }
};
function playSound(type, enabled) {
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
    gain.gain.exponentialRampToValueAtTime(1e-3, ctx.currentTime + c.duration);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + c.duration);
  } catch {
  }
}
export {
  playSound
};
