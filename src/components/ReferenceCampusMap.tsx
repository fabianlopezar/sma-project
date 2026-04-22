import { useState } from 'react';

type Hotspot = {
  id: string;
  label: string;
  description: string;
  left: number;
  top: number;
  width: number;
  height: number;
};

type ReferenceCampusMapProps = {
  onBuildingClick: (id: string) => void;
  activeBuilding: string | null;
};

/**
 * Mapa 2D con imagen aérea de fondo + hotspots transparentes.
 * Los porcentajes pueden ajustarse después para que encajen mejor.
 */
export default function ReferenceCampusMap({
  onBuildingClick,
  activeBuilding,
}: ReferenceCampusMapProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  // Coordenadas aproximadas sobre la foto aérea.
  // Puedes afinarlas luego manualmente.
  const hotspots: Hotspot[] = [
    {
      id: 'programas',
      label: '📚 Programas Académicos',
      description: 'Explora nuestra oferta académica.',
      left: 12.5,
      top: 24.5,
      width: 25,
      height: 52,
    },
    {
      id: 'orientacion',
      label: '🧠 Orientación Vocacional',
      description: 'Descubre tu camino profesional.',
      left: 76,
      top: 12,
      width: 22.5,
      height: 14,
    },
    {
      id: 'testimonios',
      label: '🎥 Testimonios',
      description: 'Historias reales de estudiantes y egresados.',
      left: 65,
      top: 32.5,
      width: 22,
      height: 13,
    },
    {
      id: 'impacto',
      label: '🏛 Impacto Institucional',
      description: 'Conoce proyectos con impacto social.',
      left: 54.5,
      top: 54,
      width: 21,
      height: 13,
    },
    {
      id: 'vida',
      label: '🎓 Vida Universitaria',
      description: 'Experimenta la cultura y comunidad del campus.',
      left: 42.8,
      top: 75,
      width: 21.5,
      height: 13,
    },
  ];

  const currentId = hoveredId ?? activeBuilding;
  const currentHotspot = hotspots.find((x) => x.id === currentId) ?? null;

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
            alt="Vista aérea del campus de la Universidad Autónoma de Occidente"
            className="absolute inset-0 h-full w-full object-cover"
            draggable={false}
          />

          {/* Capa muy sutil para mejorar contraste */}
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
                  'absolute rounded-xl transition-all duration-200 ease-out',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#d71920]',
                  isHot
                    ? 'border-2 border-[#d71920] bg-[#d71920]/15 shadow-[0_0_0_1px_rgba(255,255,255,0.65),0_8px_24px_rgba(0,0,0,0.22)] scale-[1.01] z-20'
                    : 'border-2 border-white/85 bg-white/5 shadow-[0_0_0_1px_rgba(0,0,0,0.12),0_4px_10px_rgba(0,0,0,0.16)] hover:border-[#d71920] hover:bg-[#d71920]/10 hover:scale-[1.01] z-10',
                ].join(' ')}
                style={{
                  left: `${spot.left}%`,
                  top: `${spot.top}%`,
                  width: `${spot.width}%`,
                  height: `${spot.height}%`,
                }}
                onClick={() => onBuildingClick(spot.id)}
                onMouseEnter={() => setHoveredId(spot.id)}
                onMouseLeave={() => setHoveredId(null)}
                onFocus={() => setHoveredId(spot.id)}
                onBlur={() => setHoveredId(null)}
              >
                {/* Indicador pequeño para reforzar que es clickeable */}
                <span
                  className={[
                    'absolute -top-2 -left-2 h-4 w-4 rounded-full border-2',
                    isHot
                      ? 'bg-[#d71920] border-white'
                      : 'bg-white border-[#d71920]',
                  ].join(' ')}
                />
                <span className="sr-only">{spot.label}</span>
              </button>
            );
          })}

          {/* Tarjeta informativa flotante */}
          <div className="absolute left-4 bottom-4 sm:left-6 sm:bottom-6 max-w-[340px] rounded-2xl border border-black/10 bg-white px-4 py-3 shadow-[0_8px_24px_rgba(0,0,0,0.18)]">
              <p className="text-sm font-bold text-gray-900">
                  {currentHotspot ? currentHotspot.label : 'Campus UAO'}
              </p>
              <p className="mt-1 text-sm leading-relaxed text-gray-700">
                  {currentHotspot
                  ? currentHotspot.description
                  : 'Haz clic sobre un contorno para abrir la información de esa zona.'}
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