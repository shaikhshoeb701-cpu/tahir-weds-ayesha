// Web Audio engine – an original, softly looping Arabic-style melody
// in Maqam Hijaz on D, played on a synthesised oud/qanun pluck,
// with a gentle daf (frame drum) rhythm and a low drone.
// Everything is generated in the browser – no audio files needed.

type Note = [number | null, number]; // [frequency or rest, length in beats]

const N = {
  G3: 196.0, A3: 220.0, C4: 261.63,
  D4: 293.66, Eb4: 311.13, Fs4: 369.99, G4: 392.0, A4: 440.0, Bb4: 466.16, C5: 523.25, D5: 587.33,
};

// Four 8-beat phrases (32 beats per loop)
const MELODY: Note[] = [
  // phrase 1 – opening, rising through the Hijaz tetrachord
  [N.D4, 1], [N.Eb4, 0.5], [N.Fs4, 0.5], [N.G4, 1], [N.A4, 1],
  [N.G4, 0.5], [N.Fs4, 0.5], [N.Eb4, 1], [N.D4, 2],
  // phrase 2 – answer from the upper note
  [N.A4, 1], [N.Bb4, 0.5], [N.A4, 0.5], [N.G4, 1], [N.Fs4, 1],
  [N.G4, 0.5], [N.A4, 0.5], [N.Fs4, 0.5], [N.Eb4, 0.5], [N.D4, 2],
  // phrase 3 – reaching the octave
  [N.D5, 1], [N.C5, 0.5], [N.Bb4, 0.5], [N.A4, 1], [N.G4, 1],
  [N.Fs4, 0.5], [N.G4, 0.5], [N.A4, 1], [null, 2],
  // phrase 4 – resolution back home
  [N.G4, 0.5], [N.Fs4, 0.5], [N.Eb4, 0.5], [N.Fs4, 0.5], [N.G4, 1], [N.A4, 1],
  [N.Fs4, 1], [N.Eb4, 1], [N.D4, 2],
];
const LOOP_BEATS = MELODY.reduce((s, n) => s + n[1], 0);

// Daf pattern inside one 4-beat bar: [beat offset, 'dum' | 'tek']
const DAF: [number, 'dum' | 'tek'][] = [
  [0, 'dum'], [1.5, 'tek'], [2, 'dum'], [3, 'tek'], [3.5, 'tek'],
];

const BPM = 80;
const BEAT = 60 / BPM;

class WeddingAudioEngine {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private wet: GainNode | null = null;
  private isPlayingAmbient = false;
  private schedulerTimer: number | null = null;
  private droneNodes: { osc: OscillatorNode; gain: GainNode }[] = [];
  private loopStart = 0;
  private melodyIdx = 0;
  private nextNoteTime = 0;
  private nextBar = 0;
  private listeners: ((playing: boolean) => void)[] = [];

  private initCtx() {
    if (!this.ctx) {
      const AudioCtxClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtxClass();

      this.master = this.ctx.createGain();
      this.master.gain.value = 0.0001;
      this.master.connect(this.ctx.destination);

      // simple hall reverb from a generated impulse response
      const conv = this.ctx.createConvolver();
      const len = this.ctx.sampleRate * 2.6;
      const ir = this.ctx.createBuffer(2, len, this.ctx.sampleRate);
      for (let ch = 0; ch < 2; ch++) {
        const d = ir.getChannelData(ch);
        for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 2.6);
      }
      conv.buffer = ir;
      this.wet = this.ctx.createGain();
      this.wet.gain.value = 0.32;
      this.wet.connect(conv);
      conv.connect(this.master);
    }
    if (this.ctx.state === 'suspended') this.ctx.resume();
  }

  /** route a node to the dry master and the reverb */
  private out(node: AudioNode) {
    node.connect(this.master!);
    node.connect(this.wet!);
  }

  // ---------- instruments ----------

  /** Oud-like plucked string: detuned saw + triangle through a closing low-pass */
  private pluck(freq: number, t: number, vel = 0.22, length = 1.4, bright = 2600) {
    const ctx = this.ctx!;
    const g = ctx.createGain();
    const f = ctx.createBiquadFilter();
    f.type = 'lowpass';
    f.Q.value = 2;
    f.frequency.setValueAtTime(bright, t);
    f.frequency.exponentialRampToValueAtTime(500, t + length * 0.6);

    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(vel, t + 0.006);
    g.gain.exponentialRampToValueAtTime(vel * 0.35, t + 0.18);
    g.gain.exponentialRampToValueAtTime(0.0001, t + length);

    [['sawtooth', 0, 0.55], ['triangle', 4, 0.8], ['sawtooth', -5, 0.35]].forEach(([type, det, lvl]) => {
      const o = ctx.createOscillator();
      const og = ctx.createGain();
      o.type = type as OscillatorType;
      o.frequency.setValueAtTime(freq, t);
      o.detune.value = det as number;
      og.gain.value = lvl as number;
      o.connect(og);
      og.connect(f);
      o.start(t);
      o.stop(t + length + 0.05);
    });
    f.connect(g);
    this.out(g);
  }

  /** Daf – low "dum" thump or bright "tek" slap with jingle rings */
  private daf(kind: 'dum' | 'tek', t: number, vel = 1) {
    const ctx = this.ctx!;
    if (kind === 'dum') {
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = 'sine';
      o.frequency.setValueAtTime(95, t);
      o.frequency.exponentialRampToValueAtTime(52, t + 0.25);
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(0.32 * vel, t + 0.01);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.45);
      o.connect(g);
      this.out(g);
      o.start(t);
      o.stop(t + 0.5);
    }
    // skin slap + ring noise
    const dur = kind === 'dum' ? 0.12 : 0.22;
    const buf = ctx.createBuffer(1, Math.floor(ctx.sampleRate * dur), ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    const src = ctx.createBufferSource();
    src.buffer = buf;
    const bp = ctx.createBiquadFilter();
    bp.type = 'bandpass';
    bp.frequency.value = kind === 'dum' ? 900 : 5200;
    bp.Q.value = kind === 'dum' ? 1 : 2.5;
    const g = ctx.createGain();
    const lvl = (kind === 'dum' ? 0.05 : 0.07) * vel;
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(lvl, t + 0.004);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    src.connect(bp);
    bp.connect(g);
    this.out(g);
    src.start(t);
  }

  private startDrone() {
    const ctx = this.ctx!;
    [73.42, 110.0, 146.83].forEach((fr, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = i === 2 ? 'triangle' : 'sine';
      osc.frequency.value = fr;
      gain.gain.setValueAtTime(0.0001, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(i === 2 ? 0.012 : 0.03, ctx.currentTime + 3);
      osc.connect(gain);
      this.out(gain);
      osc.start();
      this.droneNodes.push({ osc, gain });
    });
  }

  private stopDrone() {
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    this.droneNodes.forEach(({ osc, gain }) => {
      gain.gain.cancelScheduledValues(t);
      gain.gain.setValueAtTime(gain.gain.value, t);
      gain.gain.linearRampToValueAtTime(0.0001, t + 1.2);
      osc.stop(t + 1.3);
    });
    this.droneNodes = [];
  }

  // ---------- scheduler ----------

  private schedule = () => {
    if (!this.isPlayingAmbient || !this.ctx) return;
    const horizon = this.ctx.currentTime + 0.4;

    while (this.nextNoteTime < horizon) {
      const [freq, beats] = MELODY[this.melodyIdx];
      const len = beats * BEAT;
      if (freq) {
        if (beats >= 2) {
          // oud "risha" tremolo on long notes
          const steps = Math.floor(len / 0.16);
          for (let i = 0; i < steps; i++) {
            this.pluck(freq, this.nextNoteTime + i * 0.16, 0.16 * (1 - i / (steps + 2)), 0.5);
          }
        } else {
          this.pluck(freq, this.nextNoteTime, 0.22, Math.max(0.9, len * 1.6));
        }
      }
      this.nextNoteTime += len;
      this.melodyIdx = (this.melodyIdx + 1) % MELODY.length;
    }

    while (this.loopStart + this.nextBar * 4 * BEAT < horizon) {
      const barTime = this.loopStart + this.nextBar * 4 * BEAT;
      DAF.forEach(([off, kind]) => this.daf(kind, barTime + off * BEAT, kind === 'dum' ? 1 : 0.8));
      this.nextBar++;
    }
  };

  private notify(playing: boolean) {
    this.listeners.forEach((l) => l(playing));
  }

  /** components can subscribe to play/pause state */
  subscribe(fn: (playing: boolean) => void) {
    this.listeners.push(fn);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== fn);
    };
  }

  // ---------- public API ----------

  /** short qanun glissando up the maqam – used when the date is revealed */
  playReveal() {
    try {
      this.initCtx();
      if (!this.ctx) return;
      if (!this.isPlayingAmbient) {
        this.master!.gain.cancelScheduledValues(this.ctx.currentTime);
        this.master!.gain.setValueAtTime(0.6, this.ctx.currentTime);
      }
      const t = this.ctx.currentTime + 0.02;
      const run = [N.D4, N.Eb4, N.Fs4, N.G4, N.A4, N.Bb4, N.C5, N.D5, N.D5 * 2];
      run.forEach((f, i) => this.pluck(f, t + i * 0.07, 0.14, 1.6, 4200));
      this.daf('dum', t, 1);
      this.daf('tek', t + 0.35, 0.9);
      this.daf('dum', t + 0.6, 1);
    } catch {
      /* audio blocked */
    }
  }

  /** single soft pluck – used for small taps */
  playChime() {
    try {
      this.initCtx();
      if (!this.ctx) return;
      if (!this.isPlayingAmbient) this.master!.gain.setValueAtTime(0.6, this.ctx.currentTime);
      this.pluck(N.A4, this.ctx.currentTime + 0.01, 0.15, 1.2, 4000);
      this.pluck(N.D5, this.ctx.currentTime + 0.09, 0.12, 1.4, 4000);
    } catch {
      /* audio blocked */
    }
  }

  startAmbientMusic(onStateChange?: (playing: boolean) => void) {
    try {
      this.initCtx();
      if (!this.ctx || this.isPlayingAmbient) return;
      this.isPlayingAmbient = true;
      const now = this.ctx.currentTime;
      this.master!.gain.cancelScheduledValues(now);
      this.master!.gain.setValueAtTime(0.0001, now);
      this.master!.gain.exponentialRampToValueAtTime(0.7, now + 2.5);

      this.loopStart = now + 0.15;
      this.nextNoteTime = this.loopStart;
      this.melodyIdx = 0;
      this.nextBar = 0;
      this.startDrone();
      this.schedule();
      this.schedulerTimer = window.setInterval(this.schedule, 100);
      onStateChange?.(true);
      this.notify(true);
    } catch {
      this.isPlayingAmbient = false;
      onStateChange?.(false);
      this.notify(false);
    }
  }

  stopAmbientMusic(onStateChange?: (playing: boolean) => void) {
    this.isPlayingAmbient = false;
    if (this.schedulerTimer) {
      window.clearInterval(this.schedulerTimer);
      this.schedulerTimer = null;
    }
    if (this.ctx && this.master) {
      const t = this.ctx.currentTime;
      this.master.gain.cancelScheduledValues(t);
      this.master.gain.setValueAtTime(Math.max(this.master.gain.value, 0.0001), t);
      this.master.gain.exponentialRampToValueAtTime(0.0001, t + 1);
    }
    this.stopDrone();
    onStateChange?.(false);
    this.notify(false);
  }

  toggleAmbient(onStateChange?: (playing: boolean) => void): boolean {
    if (this.isPlayingAmbient) {
      this.stopAmbientMusic(onStateChange);
      return false;
    }
    this.startAmbientMusic(onStateChange);
    return true;
  }

  getIsPlaying() {
    return this.isPlayingAmbient;
  }
}

export { LOOP_BEATS };
export const weddingAudio = new WeddingAudioEngine();
