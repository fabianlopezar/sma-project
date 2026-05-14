import { useState } from "react";
import { Link } from "react-router-dom";
import UnityGame, { type UnityResultPayload } from "@/components/UnityGame";

/**
 * Pagina de prueba de integracion Unity <-> React.
 *
 * Ruta: /minijuego
 *
 * Funciona aun antes de tener el build de Unity: si no hay archivos en
 * public/unity-build, UnityGame muestra un mensaje claro y los botones
 * simplemente no haran nada, pero el resto de la UI sigue funcional.
 */
const MiniGamePage = () => {
  const [activeGame, setActiveGame] = useState<string | null>(null);
  const [lastResult, setLastResult] = useState<UnityResultPayload | null>(null);

  const games = [
    { id: "memorama", label: "Memorama UAO" },
    { id: "trivia", label: "Trivia vocacional" },
    { id: "puzzle", label: "Puzzle del campus" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#0b1020", color: "white", padding: 24 }}>
      {/* Marcador de "ruta funciona" - si ves esto la ruta esta cargando bien */}
      <div
        style={{
          padding: "6px 10px",
          background: "#16a34a",
          color: "white",
          borderRadius: 6,
          display: "inline-block",
          marginBottom: 12,
          fontSize: 12,
          fontWeight: 600,
        }}
      >
        ✓ Ruta /minijuego cargada correctamente
      </div>

      <header style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 16 }}>
        <Link to="/" style={{ color: "#9ad", textDecoration: "underline" }}>
          ← Volver
        </Link>
        <h1 style={{ margin: 0, fontSize: 22 }}>Prueba de integración Unity ↔ React</h1>
      </header>

      <section style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
        {games.map((g) => (
          <button
            key={g.id}
            onClick={() => setActiveGame(g.id)}
            style={{
              padding: "10px 14px",
              borderRadius: 8,
              border: "1px solid #345",
              background: activeGame === g.id ? "#2563eb" : "#1f2937",
              color: "white",
              cursor: "pointer",
            }}
          >
            ▶ {g.label}
          </button>
        ))}
        <button
          onClick={() => setActiveGame(null)}
          style={{
            padding: "10px 14px",
            borderRadius: 8,
            border: "1px solid #543",
            background: "#7f1d1d",
            color: "white",
            cursor: "pointer",
          }}
        >
          ✕ Cerrar Unity
        </button>
      </section>

      {lastResult && (
        <div
          style={{
            padding: 12,
            border: "1px solid #2a4",
            background: "rgba(20, 60, 40, 0.4)",
            borderRadius: 8,
            marginBottom: 16,
          }}
        >
          <strong>Resultado recibido desde Unity:</strong>{" "}
          juego <code>{lastResult.gameId}</code> · score {lastResult.score} · XP {lastResult.xp}
        </div>
      )}

      <div
        style={{
          width: "100%",
          height: 540,
          background: "#000",
          borderRadius: 12,
          overflow: "hidden",
          border: "1px solid #234",
        }}
      >
        {activeGame ? (
          <UnityGame
            // remontar cuando cambia el juego
            key={activeGame}
            gameId={activeGame}
            onReady={() => console.log("[Unity] listo")}
            onGameOver={(r) => {
              console.log("[Unity] GameOver", r);
              setLastResult(r);
            }}
          />
        ) : (
          <div
            style={{
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#789",
            }}
          >
            Selecciona un minijuego para cargar Unity
          </div>
        )}
      </div>

      <p style={{ marginTop: 16, color: "#9ab", fontSize: 13 }}>
        Coloca el build WebGL de Unity en <code>public/unity-build/</code>. Ver{" "}
        <code>docs-unity/INTEGRACION.md</code>.
      </p>
    </div>
  );
};

export default MiniGamePage;
