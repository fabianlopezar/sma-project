/**
 * Layout compartido entre el mapa 2D y la escena 3D (mismas proporciones que ReferenceCampusMap).
 * Coordenadas en % del contenedor 16:9; origen arriba-izquierda como en CSS.
 */

export type MapRectPct = {
  left: number;
  top: number;
  w: number;
  h: number;
};

/** Ancho del “lienzo” lógico en unidades Three.js (X); la profundidad Z respeta 16:9. */
export const MAP_WORLD_W = 20;
export const MAP_WORLD_D = (MAP_WORLD_W * 9) / 16; // 11.25

/** I romana: serifa superior, astil, serifa inferior */
export const ROMAN_I_RECTS: MapRectPct[] = [
  { left: 7, top: 22, w: 24, h: 8 },
  { left: 16, top: 30, w: 6, h: 40 },
  { left: 7, top: 70, w: 24, h: 8 },
];

/** Cinco zonas interactivas (este): A→D en diagonal + E cuadrado */
export const EAST_RECTS: MapRectPct[] = [
  { left: 42, top: 78, w: 15, h: 8 },
  { left: 55, top: 58, w: 15, h: 8 },
  { left: 65, top: 40, w: 15, h: 8 },
  { left: 77, top: 18, w: 15, h: 8 },
  { left: 87, top: 52, w: 10, h: 15 },
];

/**
 * Convierte un rectángulo % del mapa en caja 3D sobre el suelo (Y hacia arriba).
 * - X, Z: huella del rectángulo en el plano.
 * - heightY: altura de extrusión del edificio.
 */
export function rectToWorldBox(
  r: MapRectPct,
  heightY: number,
): { position: [number, number, number]; size: [number, number, number] } {
  const sx = (r.w / 100) * MAP_WORLD_W;
  const sz = (r.h / 100) * MAP_WORLD_D;
  const cx = -MAP_WORLD_W / 2 + (r.left / 100) * MAP_WORLD_W + sx / 2;
  const cz = MAP_WORLD_D / 2 - (r.top / 100) * MAP_WORLD_D - sz / 2;
  return {
    position: [cx, heightY / 2, cz],
    size: [sx, heightY, sz],
  };
}

/** Centro del rectángulo en el plano XZ (Y=0), útil para líneas guía. */
export function rectCenterXZ(r: MapRectPct): [number, number] {
  const sx = (r.w / 100) * MAP_WORLD_W;
  const sz = (r.h / 100) * MAP_WORLD_D;
  const cx = -MAP_WORLD_W / 2 + (r.left / 100) * MAP_WORLD_W + sx / 2;
  const cz = MAP_WORLD_D / 2 - (r.top / 100) * MAP_WORLD_D - sz / 2;
  return [cx, cz];
}
