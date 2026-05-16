import { useGameProgress } from "@/context/GameProgressContext";

/**
 * Hook conveniente para lanzar y cerrar minijuegos Unity desde cualquier
 * parte de la app, sin tener que conocer los detalles del Context.
 *
 * Uso tipico desde un boton:
 *
 *   const { startGame } = useUnityGame();
 *   <button onClick={() => startGame("biblioteca")}>Iniciar</button>
 *
 * Esto activa el UnityGameModal (que se renderiza una sola vez en App.tsx
 * cuando lo agregues) y le pasa el gameId. Cuando el minijuego termina,
 * el modal se cierra solo y el resultado queda registrado en el progreso.
 */
export const useUnityGame = () => {
  const {
    activeGameId,
    openGame,
    closeGame,
    isPhaseCompleted,
    getPhaseResult,
    progress,
  } = useGameProgress();

  return {
    /** Inicia un minijuego abriendo el modal de Unity con ese gameId. */
    startGame: openGame,

    /** Cierra el modal de Unity manualmente (sin completar la fase). */
    cancelGame: closeGame,

    /** Cual minijuego esta activo en este momento. null si no hay ninguno. */
    activeGameId,

    /** Devuelve true si el minijuego sigue abierto. */
    isGameOpen: activeGameId !== null,

    /** Saber si una fase ya fue completada (para mostrar checkmark, etc.). */
    isPhaseCompleted,

    /** Obtener el resultado de una fase completada (score, xp, fecha). */
    getPhaseResult,

    /** Progreso global del usuario (XP total, todas las fases). */
    progress,
  };
};
