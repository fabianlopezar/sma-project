import { useRef, useState, useCallback, useMemo } from 'react';
import { Canvas, useFrame, ThreeEvent } from '@react-three/fiber';
import { OrbitControls, Text, Float, RoundedBox } from '@react-three/drei';
import * as THREE from 'three';
import {
  EAST_RECTS,
  MAP_WORLD_D,
  MAP_WORLD_W,
  ROMAN_I_RECTS,
  rectCenterXZ,
  rectToWorldBox,
} from '@/lib/campusMapLayout';

export interface BuildingData {
  id: string;
  name: string;
  description: string;
  position: [number, number, number];
  size: [number, number, number];
  color: string;
  hoverColor: string;
  roofIdle: string;
  roofActive: string;
  icon: string;
}

/** Alturas de extrusión 3D (bloques este = mismas zonas que los botones del campus). */
const EAST_HEIGHTS = [1.22, 1.55, 1.2, 1.28, 1.42] as const;

/** I romana: serifas más bajas, astil más alto (ancla visual). */
const ROMAN_HEIGHTS = [1.05, 2.75, 1.05] as const;

const EAST_BUILDING_META: Omit<BuildingData, 'position' | 'size'>[] = [
  {
    id: 'programas',
    name: 'Programas Académicos',
    description: 'Explora nuestra oferta académica con programas diseñados para el futuro.',
    color: '#3D7AE8',
    hoverColor: '#5B94FF',
    roofIdle: '#1E4FA8',
    roofActive: '#2E6BDC',
    icon: '📚',
  },
  {
    id: 'orientacion',
    name: 'Orientación Vocacional',
    description: 'Descubre tu camino profesional a través de experiencias interactivas.',
    color: '#C8102E',
    hoverColor: '#E30613',
    roofIdle: '#A0001C',
    roofActive: '#FF3D4D',
    icon: '🧠',
  },
  {
    id: 'testimonios',
    name: 'Testimonios',
    description: 'Historias reales de estudiantes que ya viven la experiencia universitaria.',
    color: '#7B5CE4',
    hoverColor: '#9B7EF5',
    roofIdle: '#5A3DC9',
    roofActive: '#B49AFF',
    icon: '🎥',
  },
  {
    id: 'impacto',
    name: 'Impacto Institucional',
    description: 'Conoce nuestros proyectos que transforman la región y la sociedad.',
    color: '#0D9F9A',
    hoverColor: '#2EC4BF',
    roofIdle: '#067A76',
    roofActive: '#4FD9D4',
    icon: '🏛',
  },
  {
    id: 'vida',
    name: 'Vida Universitaria',
    description: 'Experimenta la cultura, los espacios y la comunidad que te espera.',
    color: '#F59E0B',
    hoverColor: '#FBBF24',
    roofIdle: '#D97706',
    roofActive: '#FCD34D',
    icon: '🎓',
  },
];

function buildBuildingsFromLayout(): BuildingData[] {
  return EAST_RECTS.map((rect, i) => {
    const { position, size } = rectToWorldBox(rect, EAST_HEIGHTS[i]);
    return { ...EAST_BUILDING_META[i], position, size };
  });
}

/** Edificios/zonas clicables: misma disposición que el mapa 2D (este). */
export const BUILDINGS: BuildingData[] = buildBuildingsFromLayout();

const LABEL_IDLE = '#333333';
const LABEL_ACTIVE = '#E30613';

function bevelRadius(sx: number, sy: number, sz: number, cap = 0.09) {
  return Math.min(cap, Math.max(0.02, Math.min(sx, sy, sz) * 0.14));
}

/** Volumen de la I romana: no abre panel; solo decora el mapa 3D. */
function RomanMapVolume({
  position,
  size,
}: {
  position: [number, number, number];
  size: [number, number, number];
}) {
  const [hovered, setHovered] = useState(false);
  const base = '#1c1c1c';
  const hot = '#2d2d2d';
  const roof = '#111111';

  const r = bevelRadius(size[0], size[1], size[2], 0.07);
  const rw = size[0] + 0.1;
  const rd = size[2] + 0.1;
  const rh = 0.09;

  return (
    <group position={position}>
      <RoundedBox
        position={[0, size[1] / 2, 0]}
        args={size}
        radius={r}
        smoothness={3}
        castShadow
        receiveShadow
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
        }}
        onPointerOut={() => setHovered(false)}
      >
        <meshStandardMaterial
          color={hovered ? hot : base}
          roughness={0.38}
          metalness={0.06}
          emissive={hovered ? hot : base}
          emissiveIntensity={hovered ? 0.05 : 0.015}
        />
      </RoundedBox>
      <RoundedBox position={[0, size[1] + rh / 2, 0]} args={[rw, rh, rd]} radius={Math.min(0.05, r)} smoothness={2} castShadow>
        <meshStandardMaterial color={roof} roughness={0.48} metalness={0.12} />
      </RoundedBox>
    </group>
  );
}

function Building({
  data,
  onHover,
  onClick,
  isActive,
}: {
  data: BuildingData;
  onHover: (id: string | null) => void;
  onClick: (id: string) => void;
  isActive: boolean;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const targetScale = useRef(1);
  const currentScale = useRef(1);

  useFrame(() => {
    if (!meshRef.current) return;
    targetScale.current = hovered || isActive ? 1.045 : 1;
    currentScale.current += (targetScale.current - currentScale.current) * 0.12;
    meshRef.current.scale.setScalar(currentScale.current);
  });

  const handlePointerOver = useCallback(
    (e: ThreeEvent<PointerEvent>) => {
      e.stopPropagation();
      setHovered(true);
      onHover(data.id);
      document.body.style.cursor = 'pointer';
    },
    [data.id, onHover],
  );

  const handlePointerOut = useCallback(() => {
    setHovered(false);
    onHover(null);
    document.body.style.cursor = 'default';
  }, [onHover]);

  const handleClick = useCallback(
    (e: ThreeEvent<MouseEvent>) => {
      e.stopPropagation();
      onClick(data.id);
    },
    [data.id, onClick],
  );

  const color = hovered || isActive ? data.hoverColor : data.color;
  const roofColor = hovered || isActive ? data.roofActive : data.roofIdle;
  const labelColor = hovered || isActive ? LABEL_ACTIVE : LABEL_IDLE;
  const isHot = hovered || isActive;
  const br = bevelRadius(data.size[0], data.size[1], data.size[2]);
  const roofH = 0.12;
  const roofPad = 0.14;

  return (
    <group position={data.position}>
      <RoundedBox
        ref={meshRef}
        position={[0, data.size[1] / 2, 0]}
        args={data.size}
        radius={br}
        smoothness={3}
        castShadow
        receiveShadow
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
        onClick={handleClick}
      >
        <meshStandardMaterial
          color={color}
          roughness={isHot ? 0.2 : 0.32}
          metalness={isHot ? 0.2 : 0.12}
          emissive={color}
          emissiveIntensity={isHot ? 0.11 : 0.035}
        />
      </RoundedBox>
      <RoundedBox
        position={[0, data.size[1] + roofH / 2, 0]}
        args={[data.size[0] + roofPad, roofH, data.size[2] + roofPad]}
        radius={Math.min(0.06, br)}
        smoothness={2}
        castShadow
      >
        <meshStandardMaterial
          color={roofColor}
          metalness={0.28}
          roughness={0.26}
          emissive={roofColor}
          emissiveIntensity={isHot ? 0.08 : 0.025}
        />
      </RoundedBox>
      <Float speed={1.25} floatIntensity={0.12} rotationIntensity={0}>
        <Text
          position={[0, data.size[1] + 0.95, 0]}
          fontSize={0.26}
          color={labelColor}
          outlineWidth={0.025}
          outlineColor="#ffffff"
          anchorX="center"
          anchorY="bottom"
          maxWidth={3.8}
          textAlign="center"
        >
          {data.name}
        </Text>
      </Float>
      {(hovered || isActive) && (
        <mesh position={[0, 0.015, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[Math.max(data.size[0], data.size[2]) * 0.55, 32]} />
          <meshBasicMaterial color={data.hoverColor} transparent opacity={0.14} />
        </mesh>
      )}
    </group>
  );
}

function Ground() {
  const extent = Math.max(MAP_WORLD_W, MAP_WORLD_D) * 1.65;
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
      <planeGeometry args={[extent, extent]} />
      <meshStandardMaterial color="#F5F5F5" roughness={0.95} metalness={0} />
    </mesh>
  );
}

function GridLines() {
  const extent = Math.max(MAP_WORLD_W, MAP_WORLD_D) * 1.65;
  const divs = 36;
  return <gridHelper args={[extent, divs, '#E8E8E8', '#F0F0F0']} position={[0, 0.008, 0]} />;
}

/** Rutas suaves entre centros de los bloques este (A→B→C→D) + enlace al astil de la I. */
function MapPaths() {
  const segments = useMemo(() => {
    const y = 0.03;
    const stem = rectCenterXZ(ROMAN_I_RECTS[1]);
    const a = rectCenterXZ(EAST_RECTS[0]);
    const pts: THREE.Vector3[][] = [
      [
        new THREE.Vector3(stem[0], y, stem[1]),
        new THREE.Vector3(a[0], y, a[1]),
      ],
      ...[0, 1, 2].map((i) => {
        const p0 = rectCenterXZ(EAST_RECTS[i]);
        const p1 = rectCenterXZ(EAST_RECTS[i + 1]);
        return [new THREE.Vector3(p0[0], y, p0[1]), new THREE.Vector3(p1[0], y, p1[1])];
      }),
    ];
    return pts;
  }, []);

  return (
    <>
      {segments.map((pair, i) => {
        const geo = new THREE.BufferGeometry().setFromPoints(pair);
        return (
          <line key={i}>
            <bufferGeometry attach="geometry" {...geo} />
            <lineBasicMaterial attach="material" color="#E30613" transparent opacity={0.22} />
          </line>
        );
      })}
    </>
  );
}

export default function CampusScene({
  onBuildingClick,
  activeBuilding,
}: {
  onBuildingClick: (id: string) => void;
  activeBuilding: string | null;
}) {
  const romanVolumes = useMemo(
    () =>
      ROMAN_I_RECTS.map((rect, i) => ({
        key: `roman-${i}`,
        ...rectToWorldBox(rect, ROMAN_HEIGHTS[i]),
      })),
    [],
  );

  return (
    <Canvas
      shadows
      camera={{ position: [9, 12, 11], fov: 48 }}
      style={{ width: '100%', height: '100%' }}
      gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
      onCreated={({ gl }) => {
        gl.shadowMap.enabled = true;
        gl.shadowMap.type = THREE.PCFSoftShadowMap;
      }}
    >
      <color attach="background" args={['#FFFFFF']} />
      <fog attach="fog" args={['#FFFFFF', 22, 48]} />

      <ambientLight intensity={0.55} />
      <hemisphereLight color="#FFFFFF" groundColor="#EEF0F4" intensity={0.42} />
      <directionalLight
        position={[10, 15, 5]}
        intensity={0.85}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={40}
        shadow-camera-left={-14}
        shadow-camera-right={14}
        shadow-camera-top={14}
        shadow-camera-bottom={-14}
        shadow-bias={-0.00025}
      />
      <directionalLight position={[-6, 10, -4]} intensity={0.28} color="#FFF8F5" />
      <pointLight position={[2, 9, 1]} intensity={0.2} color="#E30613" distance={28} decay={2} />

      <Ground />
      <GridLines />
      <MapPaths />

      {romanVolumes.map((v) => (
        <RomanMapVolume key={v.key} position={v.position} size={v.size} />
      ))}

      {BUILDINGS.map((b) => (
        <Building
          key={b.id}
          data={b}
          onHover={() => {}}
          onClick={onBuildingClick}
          isActive={activeBuilding === b.id}
        />
      ))}

      <OrbitControls
        enableDamping
        dampingFactor={0.05}
        target={[2.2, 0, 0]}
        minDistance={6}
        maxDistance={26}
        maxPolarAngle={Math.PI / 2.25}
        minPolarAngle={Math.PI / 6}
        autoRotate
        autoRotateSpeed={0.28}
      />
    </Canvas>
  );
}
