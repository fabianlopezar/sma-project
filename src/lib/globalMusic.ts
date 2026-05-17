/**
 * Musica de fondo global y compartida entre toda la app.
 *
 * Pattern: singleton fuera de React (en variable de modulo). Cualquier
 * componente puede llamar a play / pause / resume sin necesidad de Context.
 *
 * Uso tipico:
 *   - Al montar la pagina raiz:  playGlobalMusic('/audio/music/ambiente_web.mp3', 0.25)
 *   - Al abrir Unity:             pauseGlobalMusic()
 *   - Al cerrar Unity:            resumeGlobalMusic()
 *
 * Maneja la restriccion de autoplay de los navegadores: si la primera
 * llamada a play() falla porque el usuario aun no interactuo con la pagina,
 * deja la pista pendiente y arranca apenas haya un click/tap en algun lado.
 */

let audio: HTMLAudioElement | null = null;
let pendingPlay = false;
let userInteracted = false;
let listenersAttached = false;

const tryPlay = () => {
  if (!audio) return;
  if (!userInteracted) {
    // Lo dejamos pendiente. Cuando el usuario haga su primer click, arranca.
    pendingPlay = true;
    attachInteractionListenersOnce();
    return;
  }
  audio.play().catch(() => {
    // Algunos navegadores aun pueden negar la reproduccion (modo silencio iOS).
    // Lo intentamos de nuevo en el proximo click.
    pendingPlay = true;
    attachInteractionListenersOnce();
  });
};

const onFirstInteraction = () => {
  userInteracted = true;
  if (pendingPlay && audio) {
    pendingPlay = false;
    audio.play().catch(() => {});
  }
};

const attachInteractionListenersOnce = () => {
  if (listenersAttached) return;
  if (typeof window === "undefined") return;
  listenersAttached = true;
  window.addEventListener("click", onFirstInteraction, { once: true });
  window.addEventListener("touchstart", onFirstInteraction, { once: true });
  window.addEventListener("keydown", onFirstInteraction, { once: true });
};

/**
 * Inicia o cambia la pista de fondo. Si ya esta sonando la misma pista,
 * no hace nada (evita el "reinicio" feo al re-renderizar).
 */
export const playGlobalMusic = (src: string, volume = 0.3) => {
  if (typeof window === "undefined") return;

  // Misma pista ya cargada -> solo asegurarnos de que esta sonando
  if (audio && audio.src.endsWith(src.replace(/^\//, ""))) {
    audio.volume = volume;
    if (audio.paused) tryPlay();
    return;
  }

  // Pista distinta o primera vez -> reemplazar
  if (audio) {
    audio.pause();
    audio.src = "";
  }
  audio = new Audio(src);
  audio.loop = true;
  audio.volume = volume;
  audio.preload = "auto";
  tryPlay();
};

export const pauseGlobalMusic = () => {
  if (audio && !audio.paused) audio.pause();
};

export const resumeGlobalMusic = () => {
  if (audio) tryPlay();
};

export const setGlobalMusicVolume = (volume: number) => {
  if (audio) audio.volume = Math.max(0, Math.min(1, volume));
};

export const stopGlobalMusic = () => {
  if (audio) {
    audio.pause();
    audio.src = "";
    audio = null;
  }
};
