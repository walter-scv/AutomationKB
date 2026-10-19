// Los efectos cortos (tick, acierto, error, vida extra, fanfarria) son 8-bit
// sintetizados con Web Audio (osciladores + envolventes) — sin archivos
// externos para esos. La música de fondo sí es un archivo real
// (site/static/audio/power-stage-loop.mp3), reproducido con un <audio> aparte.
// En ambos casos, lo que dispara la creación del AudioContext / el primer
// play() es siempre un gesto real del usuario (el toggle) — los navegadores
// bloquean el audio si se intenta antes de eso.

const STORAGE_KEY = 'akb:sound:v1';
const MUSIC_VOLUME = 0.35;

type Listener = (enabled: boolean) => void;

let ctx: AudioContext | null = null;
let musicEl: HTMLAudioElement | null = null;
let musicSrc: string | null = null;
let enabled = false;
const listeners = new Set<Listener>();

function readStoredPreference(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY) === 'on';
  } catch {
    return false;
  }
}

function writeStoredPreference(value: boolean): void {
  try {
    localStorage.setItem(STORAGE_KEY, value ? 'on' : 'off');
  } catch {
    // localStorage no disponible — se sigue sin persistir la preferencia.
  }
}

function getContext(): AudioContext {
  if (!ctx) {
    const Ctor = window.AudioContext || (window as unknown as {webkitAudioContext: typeof AudioContext}).webkitAudioContext;
    ctx = new Ctor();
  }
  if (ctx.state === 'suspended') void ctx.resume();
  return ctx;
}

function tone(
  audioCtx: AudioContext,
  opts: {freq: number; start: number; duration: number; type?: OscillatorType; volume?: number; slideTo?: number}
): void {
  const {freq, start, duration, type = 'square', volume = 0.07, slideTo} = opts;
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, start);
  if (slideTo) osc.frequency.linearRampToValueAtTime(slideTo, start + duration);
  gain.gain.setValueAtTime(0, start);
  gain.gain.linearRampToValueAtTime(volume, start + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
  osc.connect(gain).connect(audioCtx.destination);
  osc.start(start);
  osc.stop(start + duration + 0.02);
}

/** La URL la resuelve un componente React con useBaseUrl (acá no hay acceso
 * a ese contexto) — ver <SoundToggle>, que la setea una sola vez al montar. */
export function setMusicSrc(src: string): void {
  musicSrc = src;
}

function startMusic(): void {
  if (!musicSrc) return;
  if (!musicEl) {
    musicEl = new Audio(musicSrc);
    musicEl.loop = true;
    musicEl.volume = MUSIC_VOLUME;
  }
  void musicEl.play().catch(() => {
    // Autoplay bloqueado por el navegador — se reintenta en el próximo gesto.
  });
}

function stopMusic(): void {
  musicEl?.pause();
}

export function isSoundEnabled(): boolean {
  return enabled;
}

export function subscribe(listener: Listener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function notify(): void {
  listeners.forEach((l) => l(enabled));
}

/** Sincroniza el estado del módulo con lo guardado en localStorage, y deja
 * todo listo para retomar la música sin un nuevo toggle si la página se
 * recargó con el sonido ya activado (el primer click/tecla en la página la
 * resume, porque crear el AudioContext todavía necesita un gesto nuevo). */
export function initSoundPreference(): void {
  enabled = readStoredPreference();
  notify();
  if (enabled && typeof document !== 'undefined') {
    const resume = () => {
      if (enabled && !ctx) {
        getContext();
        startMusic();
      }
      document.removeEventListener('pointerdown', resume);
      document.removeEventListener('keydown', resume);
    };
    document.addEventListener('pointerdown', resume, {once: true});
    document.addEventListener('keydown', resume, {once: true});
  }
}

export function setSoundEnabled(value: boolean): void {
  enabled = value;
  writeStoredPreference(value);
  if (value) {
    getContext();
    startMusic();
    playTick();
  } else {
    stopMusic();
  }
  notify();
}

export function playTick(): void {
  if (!enabled || !ctx) return;
  tone(ctx, {freq: 880, start: ctx.currentTime, duration: 0.04, type: 'square', volume: 0.05});
}

export function playCorrect(): void {
  if (!enabled || !ctx) return;
  const now = ctx.currentTime;
  [523.25, 659.25, 783.99, 1046.5].forEach((freq, i) =>
    tone(ctx!, {freq, start: now + i * 0.07, duration: 0.12, type: 'square', volume: 0.07})
  );
}

export function playWrong(): void {
  if (!enabled || !ctx) return;
  tone(ctx, {freq: 220, start: ctx.currentTime, duration: 0.2, type: 'square', volume: 0.08, slideTo: 100});
}

/** "Vida extra": se dispara una sola vez, la primera vez que una actividad
 * entera (no una sola pregunta) queda 100% completa. */
export function playExtraLife(): void {
  if (!enabled || !ctx) return;
  const now = ctx.currentTime;
  const notes = [523.25, 659.25, 783.99, 1046.5, 1318.5, 1567.98];
  notes.forEach((freq, i) => {
    const isLast = i === notes.length - 1;
    tone(ctx!, {freq, start: now + i * 0.07, duration: isLast ? 0.3 : 0.1, type: 'square', volume: 0.09});
  });
}

/** Fanfarria de "arranca la partida". Devuelve cuánto dura (ms), para que
 * quien navegue pueda esperar a que termine antes de cambiar de página. */
export function playStartFanfare(): number {
  if (!enabled || !ctx) return 0;
  const now = ctx.currentTime;
  const notes = [392, 523.25, 659.25, 783.99, 1046.5];
  notes.forEach((freq, i) => tone(ctx!, {freq, start: now + i * 0.09, duration: 0.18, type: 'square', volume: 0.09}));
  return notes.length * 90 + 180;
}
