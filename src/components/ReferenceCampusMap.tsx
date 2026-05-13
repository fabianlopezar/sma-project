import { useState } from "react";

type CampusHotspot = {
  id: string;
  label: string;
  description: string;
  left: number;
  top: number;
  width: number;
  height: number;
};

type ReferenceCampusMapProps = {
  onBuildingClick?: (id: string) => void;
  activeBuilding?: string | null;
};

/**
 * Mapa 2D interactivo con imagen aérea de fondo.
 * Reemplaza completamente la escena 3D.
 */
export default function ReferenceCampusMap({
  onBuildingClick,
  activeBuilding = null,
}: ReferenceCampusMapProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const hotspots: CampusHotspot[] = [
    {
      id: "programas",
      label: "📚 Programas Académicos",
      description: "Explora nuestra oferta académica y las rutas de formación.",
      left: 12,
      top: 23,
      width: 26,
      height: 54.5,
    },
    {
      id: "orientacion",
      label: "🧠 Orientación Vocacional",
      description: "Descubre herramientas para elegir tu camino profesional.",
      left: 77,
      top: 11,
      width: 21,
      height: 15,
    },
    {
      id: "testimonios",
      label: "🎥 Testimonios",
      description: "Conoce historias de estudiantes y egresados UAO.",
      left: 66,
      top: 32,
      width: 20,
      height: 13,
    },
    {
      id: "impacto",
      label: "🏛 Impacto Institucional",
      description: "Explora proyectos, logros e impacto de la universidad.",
      left: 55,
      top: 54.1,
      width: 20,
      height: 15,
    },
    {
      id: "vida",
      label: "🎓 Vida Universitaria",
      description: "Conoce espacios, cultura, bienestar y experiencia de campus.",
      left: 43,
      top: 75,
      width: 21,
      height: 13,
    },
  ];

  const currentId = hoveredId ?? activeBuilding;
  const currentHotspot = hotspots.find((spot) => spot.id === currentId) ?? null;

  return (
    <div className="w-full h-full flex items-center justify-center px-3 py-5 sm:px-5 md:px-8">
      <div className="w-full max-w-7xl">
        <div
          className="
            relative w-full aspect-[1776/894]
            overflow-hidden rounded-[24px] md:rounded-[30px]
            border border-black/10 bg-white
            shadow-[0_1px_3px_rgba(0,0,0,0.08),0_12px_32px_-8px_rgba(0,0,0,0.18)]
          "
          role="img"
          aria-label="Mapa 2D interactivo del campus UAO"
        >
          <img
            src="src/img/mapaUAO.png"
            alt="Mapa aéreo del campus UAO"
            className="absolute inset-0 h-full w-full object-cover"
            draggable={false}
          />

          <div className="absolute inset-0 bg-black/5 pointer-events-none" />

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
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-red-600",
                  isHot
                    ? "z-20 scale-[1.01] border-2 border-[#d71920] bg-[#d71920]/15 shadow-[0_0_0_1px_rgba(255,255,255,0.75),0_8px_24px_rgba(0,0,0,0.24)]"
                    : "z-10 border-2 border-white/85 bg-white/5 shadow-[0_0_0_1px_rgba(0,0,0,0.16),0_4px_10px_rgba(0,0,0,0.18)] hover:border-[#d71920] hover:bg-[#d71920]/10 hover:scale-[1.01]",
                ].join(" ")}
                style={{
                  left: `${spot.left}%`,
                  top: `${spot.top}%`,
                  width: `${spot.width}%`,
                  height: `${spot.height}%`,
                }}
                onClick={() => onBuildingClick?.(spot.id)}
                onMouseEnter={() => setHoveredId(spot.id)}
                onMouseLeave={() => setHoveredId(null)}
                onFocus={() => setHoveredId(spot.id)}
                onBlur={() => setHoveredId(null)}
              >
                <span
                  className={[
                    "absolute -left-2 -top-2 h-4 w-4 rounded-full border-2 shadow-sm",
                    isHot
                      ? "border-white bg-[#d71920]"
                      : "border-[#d71920] bg-white",
                  ].join(" ")}
                />

                <span className="sr-only">{spot.label}</span>
              </button>
            );
          })}

          <div className="absolute left-3 bottom-3 max-w-[280px] rounded-2xl border border-black/10 bg-white px-4 py-3 shadow-lg sm:left-5 sm:bottom-5 sm:max-w-[340px]">
            <p className="text-sm font-bold text-gray-900">
              {currentHotspot ? currentHotspot.label : "Campus UAO"}
            </p>

            <p className="mt-1 text-xs leading-relaxed text-gray-700 sm:text-sm">
              {currentHotspot
                ? currentHotspot.description
                : "Haz clic sobre un contorno para abrir la información de esa zona."}
            </p>
          </div>
        </div>

        <p className="mt-4 text-center text-xs text-muted-foreground sm:text-sm">
          Los contornos indican zonas interactivas del campus.
        </p>
      </div>
    </div>
  );
}