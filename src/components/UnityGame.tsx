import { useEffect, useCallback, useState } from "react";
import { Unity, useUnityContext } from "react-unity-webgl";

export type UnityResultPayload = {
  gameId: string;
  score: number;
  xp: number;
};

type UnityGameProps = {
  gameId?: string;
  onGameOver?: (result: UnityResultPayload) => void;
  onReady?: () => void;
  className?: string;
};

const LOADER_URL = "/unity-build/Build/Build.loader.js";
const DATA_URL = "/unity-build/Build/Build.data";
const FRAMEWORK_URL = "/unity-build/Build/Build.framework.js";
const CODE_URL = "/unity-build/Build/Build.wasm";

const UnityGame = ({ gameId, onGameOver, onReady, className }: UnityGameProps) => {
  // Estado: "checking" -> "ok" (build encontrado) | "missing" (no hay build)
  const [buildStatus, setBuildStatus] = useState<"checking" | "ok" | "missing">("checking");

  // Verifica que el loader exista ANTES de intentar cargar Unity. Asi evitamos
  // el "Cargando... 0%" colgado para siempre cuando no hay build.
  useEffect(() => {
    let cancelled = false;
    fetch(LOADER_URL, { method: "HEAD" })
      .then((res) => {
        if (cancelled) return;
        setBuildStatus(res.ok ? "ok" : "missing");
      })
      .catch(() => {
        if (!cancelled) setBuildStatus("missing");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (buildStatus === "checking") {
    return (
      <div className={className} style={overlay}>
        Verificando build de Unity…
      </div>
    );
  }

  if (buildStatus === "missing") {
    return (
      <div className={className} style={{ ...overlay, padding: 16, textAlign: "center" }}>
        <div>
          <p style={{ fontSize: 16, marginBottom: 8 }}>
            ⚠️ No se encontró el build de Unity.
          </p>
          <p style={{ fontSize: 13, color: "#bcd", marginBottom: 8 }}>
            Genera un build WebGL desde Unity y copia los archivos a:<br />
            <code>public/unity-build/Build/</code>
          </p>
          <p style={{ fontSize: 12, color: "#789" }}>
            Se espera: Build.loader.js, Build.data, Build.framework.js, Build.wasm
          </p>
        </div>
      </div>
    );
  }

  return (
    <UnityRunner
      gameId={gameId}
      onGameOver={onGameOver}
      onReady={onReady}
      className={className}
    />
  );
};

// Subcomponente que solo se monta cuando confirmamos que existe el build.
// Asi useUnityContext nunca se llama con una URL invalida.
const UnityRunner = ({ gameId, onGameOver, onReady, className }: UnityGameProps) => {
  const {
    unityProvider,
    sendMessage,
    addEventListener,
    removeEventListener,
    isLoaded,
    loadingProgression,
  } = useUnityContext({
    loaderUrl: LOADER_URL,
    dataUrl: DATA_URL,
    frameworkUrl: FRAMEWORK_URL,
    codeUrl: CODE_URL,
  });

  const handleGameOver = useCallback(
    (gid: unknown, score: unknown, xp: unknown) => {
      onGameOver?.({
        gameId: String(gid ?? ""),
        score: Number(score ?? 0),
        xp: Number(xp ?? 0),
      });
    },
    [onGameOver],
  );

  const handleReady = useCallback(() => {
    onReady?.();
  }, [onReady]);

  useEffect(() => {
    addEventListener("GameOver", handleGameOver);
    addEventListener("GameReady", handleReady);
    return () => {
      removeEventListener("GameOver", handleGameOver);
      removeEventListener("GameReady", handleReady);
    };
  }, [addEventListener, removeEventListener, handleGameOver, handleReady]);

  useEffect(() => {
    if (isLoaded && gameId) {
      sendMessage("GameManager", "StartMiniGame", gameId);
    }
  }, [isLoaded, gameId, sendMessage]);

  const progress = Math.round(loadingProgression * 100);

  return (
    <div className={className} style={{ position: "relative", width: "100%", height: "100%" }}>
      {!isLoaded && (
        <div style={{ ...overlay, position: "absolute", inset: 0, zIndex: 1 }}>
          Cargando minijuego… {progress}%
        </div>
      )}
      <Unity
        unityProvider={unityProvider}
        style={{ width: "100%", height: "100%", display: "block" }}
      />
    </div>
  );
};

const overlay: React.CSSProperties = {
  width: "100%",
  height: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: "rgba(0,0,0,0.7)",
  color: "white",
  fontFamily: "system-ui, sans-serif",
  fontSize: 14,
};

export default UnityGame;
