import { useEffect, useRef } from "react";

type UseBackgroundMusicOptions = {
  /** Volumen 0..1. Default 0.3 (musica suave para no tapar la voz). */
  volume?: number;
  /** Si la pista debe repetirse en loop. Default true. */
  loop?: boolean;
  /** Si se intenta reproducir apenas el componente se monta. Default true.
   *  Si el navegador bloquea la auto-reproduccion, queda esperando al
   *  primer click/tap del usuario y arranca en ese momento. */
  autoplay?: boolean;
};

/**
 * Hook para reproducir musica de fondo en loop dentro de un componente.
 *
 * Uso:
 *   useBackgroundMusic('/audio/music/expedicion.mp3', { volume: 0.3 });
 *
 *   // Para detenerla, pasa null como src:
 *   useBackgroundMusic(activa ? '/audio/music/intro.mp3' : null);
 *
 * Detalles:
 * - Se pausa y libera automaticamente cuando el componente se desmonta.
 * - Si el navegador bloquea auto-play, se queda escuchando el primer
 *   click/tap en window y ahi recien arranca la musica.
 */
export const useBackgroundMusic = (
  src: string | null,
  options: UseBackgroundMusicOptions = {},
) => {
  const { volume = 0.3, loop = true, autoplay = true } = options;
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!src) return;

    const audio = new Audio(src);
    audio.loop = loop;
    audio.volume = volume;
    audio.preload = "auto";
    audioRef.current = audio;

    let cleanupListeners: (() => void) | null = null;

    if (autoplay) {
      audio.play().catch(() => {
        // Auto-play bloqueado por el navegador.
        // Esperamos al primer click/tap del usuario y ahi arrancamos.
        const onInteract = () => {
          audio.play().catch(() => {});
          if (cleanupListeners) cleanupListeners();
        };
        window.addEventListener("click", onInteract, { once: true });
        window.addEventListener("touchstart", onInteract, { once: true });
        cleanupListeners = () => {
          window.removeEventListener("click", onInteract);
          window.removeEventListener("touchstart", onInteract);
        };
      });
    }

    return () => {
      audio.pause();
      audio.src = "";
      audioRef.current = null;
      if (cleanupListeners) cleanupListeners();
    };
  }, [src, loop, volume, autoplay]);
};
