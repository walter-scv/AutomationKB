// Los efectos cortos (tick, acierto, error, vida extra, fanfarria) son 8-bit
// sintetizados con Web Audio (osciladores + envolventes) — sin archivos
// externos para esos. La música de fondo sí es un archivo real
// (site/static/audio/power-stage-loop.mp3), reproducido con un <audio> aparte.
// En ambos casos, lo que dispara la creación del AudioContext / el primer
// play() es siempre un gesto real del usuario (el toggle) — los navegadores
// bloquean el audio si se intenta antes de eso.

const STORAGE_KEY = 'akb:sound:v1';
// En la portada (pantalla de menú, sin texto que leer) el volumen de la
// portada original suena bien; en una lección, de fondo mientras se lee,
// el mismo volumen distrae — por eso <SoundToggle> la baja según la ruta
// (ver setMusicVolume más abajo).
export const MUSIC_VOLUME_LANDING = 0.35;
export const MUSIC_VOLUME_LESSON = 0.15;

type Listener = (enabled: boolean) => void;

let ctx: AudioContext | null = null;
let musicEl: HTMLAudioElement | null = null;
let musicSrc: string | null = null;
let musicVolume = MUSIC_VOLUME_LANDING;
let enabled = false;
// true recién después de que getContext()+startMusic() corrieron al menos
// una vez. Separado de `enabled` porque, al recargar con el sonido ya
// activado en una sesión anterior, enabled es true desde el primer render
// (viene de localStorage) pero el audio todavía no arrancó — el navegador
// lo bloquea hasta un gesto nuevo. Ver resumeIfPending().
let playbackStarted = false;
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
  const {freq, start, duration, type = 'square', volume = 0.105, slideTo} = opts;
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

/** <SoundToggle> la llama cada vez que cambia de ruta (portada vs. lección),
 * así el volumen se ajusta en caliente aunque la música ya esté sonando. */
export function setMusicVolume(volume: number): void {
  musicVolume = volume;
  if (musicEl) musicEl.volume = volume;
}

function startMusic(): void {
  if (!musicSrc) return;
  if (!musicEl) {
    musicEl = new Audio(musicSrc);
    musicEl.loop = true;
  }
  musicEl.volume = musicVolume;
  void musicEl.play().catch(() => {
    // Autoplay bloqueado por el navegador — se reintenta en el próximo gesto.
  });
}

function stopMusic(): void {
  musicEl?.pause();
}

function activatePlayback(): void {
  getContext();
  startMusic();
  playbackStarted = true;
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
 * resume, porque crear el AudioContext todavía necesita un gesto nuevo).
 * Si ese primer gesto es un click en el propio <SoundToggle>, se lo dejamos
 * a su manejador (resumeIfPending) — si lo resolviéramos acá también,
 * terminaba disparando la reactivación Y el toggle-a-apagado en el mismo
 * click (el bug de "hay que tocarlo 2 veces"). */
export function initSoundPreference(): void {
  enabled = readStoredPreference();
  notify();
  if (enabled && typeof document !== 'undefined') {
    const resume = (event: Event) => {
      const target = event.target as HTMLElement | null;
      if (!target?.closest('[data-akb-sound-toggle]')) {
        resumeIfPending();
      }
      document.removeEventListener('pointerdown', resume);
      document.removeEventListener('keydown', resume);
    };
    document.addEventListener('pointerdown', resume, {once: true});
    document.addEventListener('keydown', resume, {once: true});
  }
}

/** La llama <SoundToggle> antes de decidir si el click prende/apaga.
 * Devuelve true si el click era justo el que faltaba para retomar un
 * sonido que ya estaba "prendido" (de una sesión anterior) pero nunca
 * había arrancado — en ese caso el toggle no debe además apagarlo. */
export function resumeIfPending(): boolean {
  if (enabled && !playbackStarted) {
    activatePlayback();
    notify();
    return true;
  }
  return false;
}

export function setSoundEnabled(value: boolean): void {
  enabled = value;
  writeStoredPreference(value);
  if (value) {
    activatePlayback();
    playTick();
  } else {
    stopMusic();
  }
  notify();
}

export function playTick(): void {
  if (!enabled || !ctx) return;
  tone(ctx, {freq: 880, start: ctx.currentTime, duration: 0.04, type: 'square', volume: 0.075});
}

export function playCorrect(): void {
  if (!enabled || !ctx) return;
  const now = ctx.currentTime;
  [523.25, 659.25, 783.99, 1046.5].forEach((freq, i) =>
    tone(ctx!, {freq, start: now + i * 0.07, duration: 0.12, type: 'square', volume: 0.105})
  );
}

export function playWrong(): void {
  if (!enabled || !ctx) return;
  tone(ctx, {freq: 220, start: ctx.currentTime, duration: 0.2, type: 'square', volume: 0.12, slideTo: 100});
}

/** "Vida extra": se dispara una sola vez, la primera vez que una actividad
 * entera (no una sola pregunta) queda 100% completa. Antes compartía notas y
 * timbre con playCorrect() y sonaba como "más de lo mismo" pegado atrás del
 * acierto de la última pregunta — ahora usa otra onda (triangle, más
 * campana que blip), otra melodía, un acorde final sostenido, y arranca con
 * una pequeña pausa después del acierto para que se perciba como un sonido
 * aparte, no una continuación. */
export function playExtraLife(): void {
  if (!enabled || !ctx) return;
  const audioCtx = ctx;
  // playCorrect() dura 0.33s (4 notas de 0.07s cada una + la última de 0.12s) y
  // suele dispararse justo antes que esta — el offset tiene que cubrir ese
  // tiempo completo, si no las dos se pisan en vez de sonar una después de la otra.
  const start = audioCtx.currentTime + 0.42;
  const run = [659.25, 783.99, 987.77, 1318.51]; // E5, G5, B5, E6
  run.forEach((freq, i) => tone(audioCtx, {freq, start: start + i * 0.08, duration: 0.14, type: 'triangle', volume: 0.16}));
  const chordAt = start + run.length * 0.08 + 0.02;
  tone(audioCtx, {freq: 1318.51, start: chordAt, duration: 0.45, type: 'triangle', volume: 0.14});
  tone(audioCtx, {freq: 1567.98, start: chordAt, duration: 0.45, type: 'triangle', volume: 0.11});
}

/** Fanfarria de "arranca la partida". Devuelve cuánto dura (ms), para que
 * quien navegue pueda esperar a que termine antes de cambiar de página. */
export function playStartFanfare(): number {
  if (!enabled || !ctx) return 0;
  const now = ctx.currentTime;
  const notes = [392, 523.25, 659.25, 783.99, 1046.5];
  notes.forEach((freq, i) => tone(ctx!, {freq, start: now + i * 0.09, duration: 0.18, type: 'square', volume: 0.135}));
  return notes.length * 90 + 180;
}
