import { useState } from "react";
import { EAST_RECTS, ROMAN_I_RECTS, type MapRectPct } from "@/lib/campusMapLayout";

type Hotspot = {
  id: string;
  label: string;
  description: string;
  rect: MapRectPct;
};

type ReferenceCampusMapProps = {
  onBuildingClick?: (id: string) => void;
  activeBuilding?: string | null;
};

/**
 * Mapa híbrido:
 * - Mantiene imagen aérea interactiva de andres-dev
 * - Reutiliza layout centralizado de campusMapLayout.ts del branch main
 */
export default function ReferenceCampusMap({
  onBuildingClick,
  activeBuilding = null,
}: ReferenceCampusMapProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const hotspots: Hotspot[] = [
    {
      id: "roman-i-serif-top",
      label: "📚 Programas Académicos",
      description: "Explora nuestra oferta académica.",
      rect: ROMAN_I_RECTS[0],
    },
    {
      id: "roman-i-stem",
      label: "🧠 Orientación Vocacional",
      description: "Descubre tu camino profesional.",
      rect: ROMAN_I_RECTS[1],
    },
    {
      id: "roman-i-serif-bottom",
      label: "🎥 Testimonios",
      description: "Historias reales de estudiantes y egresados.",
      rect: ROMAN_I_RECTS[2],
    },
    {
      id: "east-a",
      label: "🏛 Impacto Institucional",
      description: "Conoce proyectos con impacto social.",
      rect: EAST_RECTS[0],
    },
    {
      id: "east-b",
      label: "🎓 Vida Universitaria",
      description: "Experimenta la cultura y comunidad del campus.",
      rect: EAST_RECTS[1],
    },
  ];

  const currentId = hoveredId ?? activeBuilding;
  const currentHotspot =
    hotspots.find((x) => x.id === currentId) ?? null;

  return (
    <div className="w-full h-full flex items-center justify-center px-4 py-6 sm:px-6">
      <div className="w-full max-w-7xl">
        <div
          className="relative w-full aspect-[1776/894] overflow-hidden rounded-[28px] border border-black/10 bg-white shadow-[0_1px_3px_rgba(0,0,0,0.06),0_8px_24px_-6px_rgba(0,0,0,0.12)]"
          role="img"
          aria-label="Mapa aéreo del campus con zonas interactivas"
        >
          {/* Imagen de fondo */}
          <img
            src="src/img/mapaUAO.png"
            alt="Vista aérea del campus"
            className="absolute inset-0 h-full w-full object-cover"
            draggable={false}
          />

          {/* Overlay suave */}
          <div className="absolute inset-0 bg-black/5 pointer-events-none" />

          {/* Hotspots */}
          {hotspots.map((spot) => {
            const isHovered = hoveredId === spot.id;
            const isActive = activeBuilding === spot.id;
            const isHot = isHovered || isActive;

            return (
              <button
                key={spot.id}
                type="button"
                aria-label={spot.label}
                title={spot.label}
                className={[
                  "absolute rounded-xl transition-all duration-200 ease-out",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#d71920]",
                  isHot
                    ? "border-2 border-[#d71920] bg-[#d71920]/15 shadow-[0_0_0_1px_rgba(255,255,255,0.65),0_8px_24px_rgba(0,0,0,0.22)] scale-[1.01] z-20"
                    : "border-2 border-white/85 bg-white/5 shadow-[0_0_0_1px_rgba(0,0,0,0.12),0_4px_10px_rgba(0,0,0,0.16)] hover:border-[#d71920] hover:bg-[#d71920]/10 hover:scale-[1.01] z-10",
                ].join(" ")}
                style={{
                  left: `${spot.rect.left}%`,
                  top: `${spot.rect.top}%`,
                  width: `${spot.rect.w}%`,
                  height: `${spot.rect.h}%`,
                }}
                onClick={() => onBuildingClick?.(spot.id)}
                onMouseEnter={() => setHoveredId(spot.id)}
                onMouseLeave={() => setHoveredId(null)}
                onFocus={() => setHoveredId(spot.id)}
                onBlur={() => setHoveredId(null)}
              >
                {/* Indicador */}
                <span
                  className={[
                    "absolute -top-2 -left-2 h-4 w-4 rounded-full border-2",
                    isHot
                      ? "bg-[#d71920] border-white"
                      : "bg-white border-[#d71920]",
                  ].join(" ")}
                />

                <span className="sr-only">{spot.label}</span>
              </button>
            );
          })}

          {/* Card informativa */}
          <div className="absolute left-4 bottom-4 sm:left-6 sm:bottom-6 max-w-[340px] rounded-2xl border border-black/10 bg-white px-4 py-3 shadow-[0_8px_24px_rgba(0,0,0,0.18)]">
            <p className="text-sm font-bold text-gray-900">
              {currentHotspot
                ? currentHotspot.label
                : "Campus UAO"}
            </p>

            <p className="mt-1 text-sm leading-relaxed text-gray-700">
              {currentHotspot
                ? currentHotspot.description
                : "Haz clic sobre una zona para abrir su información."}
            </p>
          </div>
        </div>

        <p className="mt-4 text-center text-sm text-muted-foreground">
          Los contornos indican zonas interactivas del campus.
        </p>
      </div>
    </div>
  );
}