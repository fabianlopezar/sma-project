import { createContext, useContext, useState, useCallback, ReactNode } from "react";

/**
 * Estado global del progreso del usuario en los minijuegos.
 *
 * Responsabilidades:
 * - Recordar que fases ha completado el usuario, con su score y XP.
 * - Persistir en localStorage para que sobreviva refreshes.
 * - Saber cual fase esta activa actualmente (para mostrar el modal de Unity).
 *
 * NO renderiza nada visualmente. Solo es estado + funciones.
 */

export type PhaseResult = {
  score: number;
  xp: number;
  completedAt: string; // ISO date
};

export type GameProgress = {
  /** Mapa de phaseId -> resultado. Si esta presente, la fase esta completada. */
  completedPhases: Record<string, PhaseResult>;
  /** Suma total de XP acumulado por el usuario. */
  totalXP: number;
};

type GameProgressContextValue = {
  // ----- Progreso del usuario -----
  progress: GameProgress;
  isPhaseCompleted: (phaseId: string) => boolean;
  getPhaseResult: (phaseId: string) => PhaseResult | undefined;
  markPhaseCompleted: (phaseId: string, score: number, xp: number) => void;
  resetProgress: () => void;

  // ----- Estado del juego activo -----
  /** Si !== null, hay un minijuego abierto. El UnityGameModal lee esto. */
  activeGameId: string | null;
  openGame: (gameId: string) => void;
  closeGame: () => void;
};

const STORAGE_KEY = "sma-game-progress-v1";

const defaultProgress: GameProgress = {
  completedPhases: {},
  totalXP: 0,
};

const loadInitialProgress = (): GameProgress => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return defaultProgress;
    const parsed = JSON.parse(stored) as GameProgress;
    // Validacion defensiva por si el formato cambia
    if (!parsed.completedPhases || typeof parsed.totalXP !== "number") {
      return defaultProgress;
    }
    return parsed;
  } catch {
    return defaultProgress;
  }
};

const persistProgress = (next: GameProgress) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // localStorage puede fallar en modo incognito o si esta lleno. Silencioso.
  }
};

const GameProgressContext = createContext<GameProgressContextValue | null>(null);

export const GameProgressProvider = ({ children }: { children: ReactNode }) => {
  const [progress, setProgress] = useState<GameProgress>(loadInitialProgress);
  const [activeGameId, setActiveGameId] = useState<string | null>(null);

  const isPhaseCompleted = useCallback(
    (phaseId: string) => phaseId in progress.completedPhases,
    [progress.completedPhases],
  );

  const getPhaseResult = useCallback(
    (phaseId: string) => progress.completedPhases[phaseId],
    [progress.completedPhases],
  );

  const markPhaseCompleted = useCallback(
    (phaseId: string, score: number, xp: number) => {
      setProgress((prev) => {
        // Si ya estaba completada, suma solo el XP nuevo si es mejor score?
        // Por ahora: simplemente sobrescribe con el ultimo resultado.
        const previousXP = prev.completedPhases[phaseId]?.xp ?? 0;
        const xpDelta = xp - previousXP;

        const next: GameProgress = {
          ...prev,
          completedPhases: {
            ...prev.completedPhases,
            [phaseId]: {
              score,
              xp,
              completedAt: new Date().toISOString(),
            },
          },
          totalXP: prev.totalXP + xpDelta,
        };
        persistProgress(next);
        return next;
      });
    },
    [],
  );

  const resetProgress = useCallback(() => {
    setProgress(defaultProgress);
    persistProgress(defaultProgress);
  }, []);

  const openGame = useCallback((gameId: string) => {
    setActiveGameId(gameId);
  }, []);

  const closeGame = useCallback(() => {
    setActiveGameId(null);
  }, []);

  return (
    <GameProgressContext.Provider
      value={{
        progress,
        isPhaseCompleted,
        getPhaseResult,
        markPhaseCompleted,
        resetProgress,
        activeGameId,
        openGame,
        closeGame,
      }}
    >
      {children}
    </GameProgressContext.Provider>
  );
};

export const useGameProgress = () => {
  const ctx = useContext(GameProgressContext);
  if (!ctx) {
    throw new Error(
      "useGameProgress debe usarse dentro de un <GameProgressProvider>. " +
        "Envuelve tu App con el provider en src/App.tsx.",
    );
  }
  return ctx;
};
