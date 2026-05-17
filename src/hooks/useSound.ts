import { useCallback, useEffect, useRef } from "react";

type UseSoundOptions = {
  /** Volumen 0..1. Default 1 (al maximo). */
  volume?: number;
  /** Si es true, precarga el archivo al montar el componente. Default true. */
  preload?: boolean;
};

/**
 * Hook para reproducir un efecto de sonido one-shot (click, acierto, etc.).
 *
 * Uso:
 *   const playClick = useSound('/audio/sfx/click.mp3', { volume: 0.7 });
 *   <button onClick={() => playClick()}>...</button>
 *
 * Detalles:
 * - Cada llamada a la funcion devuelta crea una nueva instancia de Audio,
 *   asi que el mismo sonido puede solaparse si se dispara muchas veces
 *   rapidamente (por ejemplo, varios clicks seguidos).
 * - Si el navegador bloquea la reproduccion (porque el usuario todavia no
 *   interactuo con la pagina), el catch absorbe el error sin romper la app.
 *   El siguiente click ya estara permitido.
 */
export const useSound = (src: string, options: UseSoundOptions = {}) => {
  const { volume = 1, preload = true } = options;
  const preloadRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!preload) return;
    const audio = new Audio(src);
    audio.preload = "auto";
    audio.volume = volume;
    preloadRef.current = audio;
    return () => {
      preloadRef.current = null;
    };
  }, [src, volume, preload]);

  return useCallback(() => {
    try {
      const audio = new Audio(src);
      audio.volume = volume;
      audio.play().catch(() => {
        // Bloqueado por el navegador hasta el primer click del usuario. Silencioso.
      });
    } catch {
      // No-op
    }
  }, [src, volume]);
};
