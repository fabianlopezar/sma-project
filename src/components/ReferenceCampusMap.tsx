import { useState } from "react";
import { EAST_RECTS, ROMAN_I_RECTS, type MapRectPct } from "@/lib/campusMapLayout";

type MapBlock = {
  id: string;
  label: string;
  rect: MapRectPct;
};

/**
 * Mapa según referencia: fondo claro, bloques negros.
 * Rectángulos definidos en campusMapLayout.ts (misma fuente que el campus 3D).
 */
export default function ReferenceCampusMap() {
  const [activeId, setActiveId] = useState<string | null>(null);

  const blocksLeft: MapBlock[] = [
    {
      id: "roman-i-serif-top",
      label: "I romana — serifa superior (travesaño)",
      rect: ROMAN_I_RECTS[0],
    },
    {
      id: "roman-i-stem",
      label: "I romana — astil (columna central)",
      rect: ROMAN_I_RECTS[1],
    },
    {
      id: "roman-i-serif-bottom",
      label: "I romana — serifa inferior (travesaño)",
      rect: ROMAN_I_RECTS[2],
    },
  ];

  const blocksEast: MapBlock[] = [
    { id: "east-a", label: "Este — bloque A (más bajo, centro-abajo)", rect: EAST_RECTS[0] },
    { id: "east-b", label: "Este — bloque B (segundo peldaño)", rect: EAST_RECTS[1] },
    { id: "east-c", label: "Este — bloque C (tercer peldaño)", rect: EAST_RECTS[2] },
    { id: "east-d", label: "Este — bloque D (más alto, esquina superior derecha)", rect: EAST_RECTS[3] },
    { id: "east-e-square", label: "Este — bloque E (cuadrado, borde derecho)", rect: EAST_RECTS[4] },
  ];

  const allBlocks = [...blocksLeft, ...blocksEast];

  const blockClass = (b: MapBlock) => `
    absolute rounded-[3px] bg-[#1a1a1a]
    transition-[transform,background-color,box-shadow] duration-200 ease-out
    cursor-pointer shadow-sm
    hover:bg-primary hover:shadow-md hover:z-10 hover:scale-[1.02]
    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/80 focus-visible:ring-offset-2 focus-visible:z-10
    ${activeId === b.id ? "ring-2 ring-primary ring-offset-2 ring-offset-white z-10 bg-primary scale-[1.015]" : ""}
  `;

  return (
    <div className="w-full max-w-5xl mx-auto px-4">
      <div
        className="relative w-full min-h-[200px] aspect-video sm:min-h-[260px] bg-white rounded-2xl border border-border overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.06),0_8px_24px_-6px_rgba(0,0,0,0.08)]"
        role="img"
        aria-label="Mapa esquemático: I romana a la izquierda y bloques en diagonal a la derecha"
      >
        {allBlocks.map((b) => (
          <div
            key={b.id}
            id={b.id}
            title={b.label}
            className={blockClass(b)}
            style={{
              left: `${b.rect.left}%`,
              top: `${b.rect.top}%`,
              width: `${b.rect.w}%`,
              height: `${b.rect.h}%`,
            }}
            onMouseEnter={() => setActiveId(b.id)}
            onMouseLeave={() => setActiveId(null)}
            onFocus={() => setActiveId(b.id)}
            onBlur={() => setActiveId(null)}
            tabIndex={0}
            data-block={b.id}
          />
        ))}
      </div>

      <p className="mt-4 text-center text-sm text-muted-foreground min-h-[1.25rem]">
        {activeId
          ? allBlocks.find((x) => x.id === activeId)?.label ?? ""
          : "Pasa el cursor por un bloque (o Tab) para ver la descripción."}
      </p>

      <details className="mt-6 text-xs text-muted-foreground max-w-3xl mx-auto">
        <summary className="cursor-pointer font-medium text-foreground">
          Lista de bloques (ids)
        </summary>
        <ul className="mt-2 space-y-1 font-mono text-[11px] break-all">
          {allBlocks.map((b) => (
            <li key={`doc-${b.id}`}>
              <span className="text-foreground">{b.id}</span> — {b.label}
            </li>
          ))}
        </ul>
      </details>
    </div>
  );
}
