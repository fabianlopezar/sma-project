import { useRef, useState, useCallback } from 'react';
import { Canvas, useFrame, useThree, ThreeEvent } from '@react-three/fiber';
import { OrbitControls, Text, Float } from '@react-three/drei';
import * as THREE from 'three';

export interface BuildingData {
  id: string;
  name: string;
  description: string;
  position: [number, number, number];
  size: [number, number, number];
  color: string;
  hoverColor: string;
  icon: string;
}

export const BUILDINGS: BuildingData[] = [
  {
    id: 'programas',
    name: 'Programas Académicos',
    description: 'Explora nuestra oferta académica con programas diseñados para el futuro.',
    position: [-4, 0, -2],
    size: [2, 3, 2],
    color: '#c8956c',
    hoverColor: '#e8a84c',
    icon: '📚',
  },
  {
    id: 'orientacion',
    name: 'Orientación Vocacional',
    description: 'Descubre tu camino profesional a través de experiencias interactivas.',
    position: [0, 0, 0],
    size: [2.5, 4, 2.5],
    color: '#d4a44a',
    hoverColor: '#f0c050',
    icon: '🧠',
  },
  {
    id: 'testimonios',
    name: 'Testimonios',
    description: 'Historias reales de estudiantes que ya viven la experiencia universitaria.',
    position: [4, 0, -2],
    size: [2, 2.5, 2],
    color: '#8a9a6c',
    hoverColor: '#a8bc80',
    icon: '🎥',
  },
  {
    id: 'impacto',
    name: 'Impacto Institucional',
    description: 'Conoce nuestros proyectos que transforman la región y la sociedad.',
    position: [-3, 0, 3],
    size: [2, 2, 3],
    color: '#6c8a9a',
    hoverColor: '#80a8bc',
    icon: '🏛',
  },
  {
    id: 'vida',
    name: 'Vida Universitaria',
    description: 'Experimenta la cultura, los espacios y la comunidad que te espera.',
    position: [3.5, 0, 3],
    size: [2.5, 2, 2],
    color: '#9a6c8a',
    hoverColor: '#bc80a8',
    icon: '🎓',
  },
];

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
    targetScale.current = hovered || isActive ? 1.08 : 1;
    currentScale.current += (targetScale.current - currentScale.current) * 0.1;
    meshRef.current.scale.setScalar(currentScale.current);
  });

  const handlePointerOver = useCallback((e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    setHovered(true);
    onHover(data.id);
    document.body.style.cursor = 'pointer';
  }, [data.id, onHover]);

  const handlePointerOut = useCallback(() => {
    setHovered(false);
    onHover(null);
    document.body.style.cursor = 'default';
  }, [onHover]);

  const handleClick = useCallback((e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    onClick(data.id);
  }, [data.id, onClick]);

  const color = hovered || isActive ? data.hoverColor : data.color;

  return (
    <group position={data.position}>
      <mesh
        ref={meshRef}
        position={[0, data.size[1] / 2, 0]}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
        onClick={handleClick}
        castShadow
        receiveShadow
      >
        <boxGeometry args={data.size} />
        <meshStandardMaterial
          color={color}
          roughness={0.3}
          metalness={0.1}
          transparent
          opacity={0.9}
        />
      </mesh>
      {/* Roof accent */}
      <mesh position={[0, data.size[1] + 0.1, 0]}>
        <boxGeometry args={[data.size[0] + 0.2, 0.15, data.size[2] + 0.2]} />
        <meshStandardMaterial color={hovered || isActive ? '#f0c050' : '#d4a44a'} metalness={0.3} roughness={0.2} />
      </mesh>
      {/* Label */}
      <Float speed={2} floatIntensity={0.3}>
        <Text
          position={[0, data.size[1] + 1, 0]}
          fontSize={0.3}
          color={hovered || isActive ? '#f0c050' : '#aaa'}
          anchorX="center"
          anchorY="bottom"
          maxWidth={3}
          textAlign="center"
        >
          {data.name}
        </Text>
      </Float>
      {/* Glow base */}
      {(hovered || isActive) && (
        <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[data.size[0] + 1, data.size[2] + 1]} />
          <meshBasicMaterial color="#d4a44a" transparent opacity={0.15} />
        </mesh>
      )}
    </group>
  );
}

function Ground() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
      <planeGeometry args={[30, 30]} />
      <meshStandardMaterial color="#1a1d25" roughness={0.9} metalness={0} />
    </mesh>
  );
}

function GridLines() {
  return (
    <gridHelper args={[30, 30, '#2a2d35', '#1e2128']} position={[0, 0.01, 0]} />
  );
}

function Paths() {
  const points = [
    [new THREE.Vector3(-4, 0.02, -2), new THREE.Vector3(0, 0.02, 0)],
    [new THREE.Vector3(0, 0.02, 0), new THREE.Vector3(4, 0.02, -2)],
    [new THREE.Vector3(0, 0.02, 0), new THREE.Vector3(-3, 0.02, 3)],
    [new THREE.Vector3(0, 0.02, 0), new THREE.Vector3(3.5, 0.02, 3)],
  ];

  return (
    <>
      {points.map((pair, i) => {
        const geo = new THREE.BufferGeometry().setFromPoints(pair);
        return (
          <line key={i}>
            <bufferGeometry attach="geometry" {...geo} />
            <lineBasicMaterial attach="material" color="#d4a44a" transparent opacity={0.2} />
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
  const [hoveredBuilding, setHoveredBuilding] = useState<string | null>(null);

  return (
    <Canvas
      shadows
      camera={{ position: [8, 8, 8], fov: 50 }}
      style={{ width: '100%', height: '100%' }}
      gl={{ antialias: true, alpha: true }}
    >
      <color attach="background" args={['#0d0f14']} />
      <fog attach="fog" args={['#0d0f14', 15, 35]} />

      <ambientLight intensity={0.4} />
      <directionalLight
        position={[10, 15, 5]}
        intensity={1}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <pointLight position={[0, 8, 0]} intensity={0.3} color="#d4a44a" />

      <Ground />
      <GridLines />

      {BUILDINGS.map((b) => (
        <Building
          key={b.id}
          data={b}
          onHover={setHoveredBuilding}
          onClick={onBuildingClick}
          isActive={activeBuilding === b.id}
        />
      ))}

      <OrbitControls
        enableDamping
        dampingFactor={0.05}
        minDistance={5}
        maxDistance={20}
        maxPolarAngle={Math.PI / 2.3}
        minPolarAngle={Math.PI / 6}
        autoRotate
        autoRotateSpeed={0.3}
      />
    </Canvas>
  );
}
