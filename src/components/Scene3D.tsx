"use client";

import { useRef, useMemo, useEffect, useCallback, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  Float,
  Text,
  Sparkles,
  ContactShadows,
  PerformanceMonitor,
  OrbitControls,
  Html,
  MeshDistortMaterial,
} from "@react-three/drei";
import * as THREE from "three";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
interface Scene3DProps {
  tier: "high" | "medium" | "low";
  scrollProgress: number;
}

// ---------------------------------------------------------------------------
// Skill categories for tooltip
// ---------------------------------------------------------------------------
const SKILL_CATEGORIES: Record<string, string> = {
  "Ruby on Rails": "Backend",
  PostgreSQL: "Database",
  Python: "Language",
  Docker: "DevOps",
  Redis: "Cache",
  AWS: "Cloud",
  Git: "VCS",
  RSpec: "Testing",
};

// ---------------------------------------------------------------------------
// Node layout — spread around desk
// ---------------------------------------------------------------------------
const NODE_POSITIONS: [number, number, number][] = [
  [-1.8, 1.2, 0.3],
  [-1.5, 0.3, 1.2],
  [-1.2, -0.3, 0.8],
  [1.5, 1.0, 0.5],
  [1.8, 0.2, 1.0],
  [1.3, -0.4, 0.6],
  [0.5, 1.5, 1.0],
  [-0.5, 1.6, 0.8],
  [0.0, -0.8, 1.2],
];

const NODE_CONNECTIONS: [number, number][] = [
  [0, 1], [0, 2], [1, 3], [2, 4], [3, 5],
  [4, 6], [5, 7], [6, 8], [0, 4], [1, 7],
  [2, 6], [3, 8], [0, 8], [1, 5],
];

const SKILL_NODES: { position: [number, number, number]; label: string; color: string }[] = [
  { position: NODE_POSITIONS[0], label: "Ruby on Rails", color: "#cc342d" },
  { position: NODE_POSITIONS[1], label: "PostgreSQL", color: "#336791" },
  { position: NODE_POSITIONS[2], label: "Python", color: "#3776ab" },
  { position: NODE_POSITIONS[3], label: "AWS", color: "#ff9900" },
  { position: NODE_POSITIONS[4], label: "Docker", color: "#2496ed" },
  { position: NODE_POSITIONS[5], label: "Redis", color: "#dc382d" },
  { position: NODE_POSITIONS[6], label: "Git", color: "#f05032" },
  { position: NODE_POSITIONS[7], label: "RSpec", color: "#cc342d" },
  { position: NODE_POSITIONS[8], label: "REST APIs", color: "#6366f1" },
];

// ---------------------------------------------------------------------------
// Camera Rig — scroll-driven + mouse parallax
// ---------------------------------------------------------------------------
function CameraRig({ scrollProgress }: { scrollProgress: number }) {
  const { camera } = useThree();
  const target = useRef(new THREE.Vector3(0, 0.85, -0.3));
  const mouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
      mouse.current.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  useFrame(() => {
    const t = scrollProgress;
    const eased = 1 - Math.pow(1 - t, 3);

    const baseX = 0;
    const baseY = 1.5 + (1.0 - 1.5) * eased;
    const baseZ = 3.5 + (1.8 - 3.5) * eased;

    // Mouse parallax (subtle ±0.15)
    const mx = mouse.current.x * 0.15 * (1 - eased * 0.5);
    const my = -mouse.current.y * 0.1 * (1 - eased * 0.5);

    camera.position.lerp(new THREE.Vector3(baseX + mx, baseY + my, baseZ), 0.05);
    camera.lookAt(target.current);
  });

  return null;
}

// ---------------------------------------------------------------------------
// Infinite Grid Floor
// ---------------------------------------------------------------------------
function InfiniteGrid() {
  const gridRef = useRef<THREE.Group>(null);

  return (
    <group ref={gridRef} position={[0, -0.5, 0]}>
      <gridHelper
        args={[20, 40, "#1a1a3e", "#12122a"]}
        rotation={[0, 0, 0]}
      />
      {/* Fade out grid at edges */}
      <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[20, 20]} />
        <meshBasicMaterial
          color="#0a0a0f"
          transparent
          opacity={0.7}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}

// ---------------------------------------------------------------------------
// Floating Desk (improved)
// ---------------------------------------------------------------------------
function Desk() {
  const screenRef = useRef<THREE.Mesh>(null);

  // Animate screen emissive pulse
  useFrame((state) => {
    if (screenRef.current) {
      const mat = screenRef.current.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity = 0.12 + Math.sin(state.clock.elapsedTime * 1.5) * 0.06;
    }
  });

  return (
    <group>
      {/* Desktop surface */}
      <mesh position={[0, 0.4, 0]}>
        <boxGeometry args={[2.4, 0.06, 1.2]} />
        <meshStandardMaterial color="#2a2a3a" metalness={0.3} roughness={0.7} />
      </mesh>

      {/* Desk legs */}
      {([
        [-1.1, -0.45, -0.5],
        [1.1, -0.45, -0.5],
        [-1.1, -0.45, 0.5],
        [1.1, -0.45, 0.5],
      ] as [number, number, number][]).map((pos, i) => (
        <mesh key={i} position={pos}>
          <boxGeometry args={[0.06, 0.9, 0.06]} />
          <meshStandardMaterial color="#1e1e2e" metalness={0.4} roughness={0.6} />
        </mesh>
      ))}

      {/* Monitor */}
      <group position={[0, 0.85, -0.3]}>
        <mesh>
          <boxGeometry args={[1.4, 0.9, 0.05]} />
          <meshStandardMaterial color="#1a1a2e" metalness={0.5} roughness={0.3} />
        </mesh>
        {/* Screen */}
        <mesh ref={screenRef} position={[0, 0, 0.03]}>
          <planeGeometry args={[1.3, 0.8]} />
          <meshStandardMaterial
            color="#4f46e5"
            emissive="#6366f1"
            emissiveIntensity={0.15}
            metalness={0.1}
            roughness={0.9}
          />
        </mesh>
        {/* Screen code lines */}
        <group position={[0, 0, 0.035]}>
          {[0.25, 0.15, 0.05, -0.05, -0.15, -0.25].map((y, i) => (
            <mesh key={i} position={[-0.15 + (i % 3) * 0.05, y, 0]}>
              <planeGeometry args={[0.3 + Math.sin(i) * 0.15, 0.015]} />
              <meshBasicMaterial color="#818cf8" transparent opacity={0.3 + (i % 3) * 0.1} />
            </mesh>
          ))}
        </group>
        {/* Monitor stand */}
        <mesh position={[0, -0.52, 0]}>
          <cylinderGeometry args={[0.04, 0.06, 0.18, 8]} />
          <meshStandardMaterial color="#2a2a3a" metalness={0.4} />
        </mesh>
        <mesh position={[0, -0.62, 0.05]}>
          <boxGeometry args={[0.4, 0.04, 0.25]} />
          <meshStandardMaterial color="#2a2a3a" />
        </mesh>
      </group>

      {/* Keyboard */}
      <mesh position={[-0.2, 0.47, 0.2]}>
        <boxGeometry args={[0.6, 0.02, 0.2]} />
        <meshStandardMaterial color="#1e1e2e" metalness={0.3} roughness={0.8} />
      </mesh>

      {/* Mouse */}
      <mesh position={[0.3, 0.46, 0.2]}>
        <boxGeometry args={[0.08, 0.03, 0.12]} />
        <meshStandardMaterial color="#1e1e2e" metalness={0.3} roughness={0.7} />
      </mesh>

      {/* Coffee mug */}
      <group position={[0.95, 0.55, 0.2]}>
        <mesh>
          <cylinderGeometry args={[0.06, 0.05, 0.12, 16]} />
          <meshStandardMaterial color="#5a4a3a" metalness={0.2} roughness={0.6} />
        </mesh>
        <mesh position={[0.07, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <torusGeometry args={[0.04, 0.01, 8, 16, Math.PI]} />
          <meshStandardMaterial color="#5a4a3a" />
        </mesh>
        {/* Steam particles */}
        <Float speed={2} floatIntensity={0.1}>
          <mesh position={[0, 0.1, 0]}>
            <sphereGeometry args={[0.02, 8, 8]} />
            <meshBasicMaterial color="#ffffff" transparent opacity={0.15} />
          </mesh>
        </Float>
      </group>

      {/* Plant */}
      <group position={[-0.9, 0.55, 0.1]}>
        <mesh>
          <cylinderGeometry args={[0.06, 0.05, 0.08, 8]} />
          <meshStandardMaterial color="#4a3a2a" />
        </mesh>
        <mesh position={[0, 0.08, 0]}>
          <sphereGeometry args={[0.06, 8, 8]} />
          <meshStandardMaterial color="#2d5a3d" />
        </mesh>
      </group>
    </group>
  );
}

// ---------------------------------------------------------------------------
// Holographic Ring — rotates above monitor
// ---------------------------------------------------------------------------
function HolographicRing() {
  const ringRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (ringRef.current) {
      ringRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.3 + 0.5;
      ringRef.current.rotation.z = state.clock.elapsedTime * 0.4;
    }
  });

  return (
    <Float speed={1} floatIntensity={0.2}>
      <mesh ref={ringRef} position={[0, 1.5, -0.3]}>
        <torusGeometry args={[0.2, 0.01, 16, 64]} />
        <meshStandardMaterial
          color="#818cf8"
          emissive="#6366f1"
          emissiveIntensity={0.6}
          metalness={0.8}
          roughness={0.1}
          transparent
          opacity={0.7}
        />
      </mesh>
      {/* Second ring, perpendicular */}
      <mesh position={[0, 1.5, -0.3]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.15, 0.008, 16, 48]} />
        <meshStandardMaterial
          color="#06b6d4"
          emissive="#06b6d4"
          emissiveIntensity={0.5}
          metalness={0.8}
          roughness={0.1}
          transparent
          opacity={0.5}
        />
      </mesh>
    </Float>
  );
}

// ---------------------------------------------------------------------------
// Skill Nodes — floating spheres with hover
// ---------------------------------------------------------------------------
function SkillNode({
  position,
  label,
  color = "#6366f1",
  size = 0.08,
  hoveredNode,
  onHover,
  onUnhover,
}: {
  position: [number, number, number];
  label: string;
  color?: string;
  size?: number;
  hoveredNode: string | null;
  onHover: () => void;
  onUnhover: () => void;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const isHovered = hoveredNode === label;

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.y =
        position[1] + Math.sin(state.clock.elapsedTime * 0.8 + position[0]) * 0.05;
    }
  });

  const scale = isHovered ? 1.4 : 1;

  return (
    <Float speed={1.5} rotationIntensity={0} floatIntensity={0.3}>
      <group position={position}>
        <mesh
          ref={meshRef}
          scale={scale}
          onPointerOver={(e) => { e.stopPropagation(); onHover(); }}
          onPointerOut={(e) => { e.stopPropagation(); onUnhover(); }}
        >
          <sphereGeometry args={[size, 16, 16]} />
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={isHovered ? 0.8 : 0.4}
            metalness={0.6}
            roughness={0.2}
          />
        </mesh>
        {/* Outer glow ring on hover */}
        {isHovered && (
          <mesh ref={meshRef} scale={scale * 2}>
            <ringGeometry args={[0.8, 1, 32]} />
            <meshBasicMaterial color={color} transparent opacity={0.15} side={THREE.DoubleSide} />
          </mesh>
        )}
        <Text
          position={[0, size + 0.06, 0]}
          fontSize={0.05}
          color="#e2e8f0"
          anchorX="center"
          anchorY="bottom"
        >
          {label}
        </Text>
        {isHovered && (
          <Html center distanceFactor={10}>
            <div
              className="pointer-events-none select-none rounded-lg border border-indigo-500/50 bg-gray-900/90 px-3 py-2 text-sm text-white whitespace-nowrap"
              style={{ fontFamily: "system-ui, sans-serif" }}
            >
              <div className="font-semibold">{label}</div>
              <div className="text-xs text-indigo-300">{SKILL_CATEGORIES[label] ?? "Skill"}</div>
            </div>
          </Html>
        )}
      </group>
    </Float>
  );
}

// ---------------------------------------------------------------------------
// Connection Lines with flowing particles
// ---------------------------------------------------------------------------
function ConnectionLines({ opacity = 0.15 }: { opacity?: number }) {
  const lines = useMemo(
    () =>
      NODE_CONNECTIONS.map(([a, b]) => [
        new THREE.Vector3(...NODE_POSITIONS[a]),
        new THREE.Vector3(...NODE_POSITIONS[b]),
      ]),
    [],
  );

  return (
    <group>
      {lines.map((points, i) => (
        <primitive
          key={i}
          object={new THREE.Line(
            new THREE.BufferGeometry().setFromPoints(points),
            new THREE.LineBasicMaterial({
              color: "#6366f1",
              transparent: true,
              opacity,
            }),
          )}
        />
      ))}
    </group>
  );
}

// ---------------------------------------------------------------------------
// Flowing Data Particles
// ---------------------------------------------------------------------------
function DataParticles() {
  const particlesRef = useRef<THREE.Group>(null);
  const particleData = useMemo(() => {
    return NODE_CONNECTIONS.map(([a, b]) => ({
      start: new THREE.Vector3(...NODE_POSITIONS[a]),
      end: new THREE.Vector3(...NODE_POSITIONS[b]),
      speed: 0.3 + Math.random() * 0.5,
      offset: Math.random() * Math.PI * 2,
    }));
  }, []);

  const meshRefs = useRef<(THREE.Mesh | null)[]>([]);

  useFrame((state) => {
    particleData.forEach((pd, i) => {
      const mesh = meshRefs.current[i];
      if (!mesh) return;
      const t = (Math.sin(state.clock.elapsedTime * pd.speed + pd.offset) + 1) / 2;
      mesh.position.lerpVectors(pd.start, pd.end, t);
    });
  });

  return (
    <group ref={particlesRef}>
      {particleData.map((_, i) => (
        <mesh
          key={i}
          ref={(el) => { meshRefs.current[i] = el; }}
        >
          <sphereGeometry args={[0.015, 8, 8]} />
          <meshBasicMaterial color="#818cf8" transparent opacity={0.8} />
        </mesh>
      ))}
    </group>
  );
}

// ---------------------------------------------------------------------------
// Particles
// ---------------------------------------------------------------------------
function Particles({ count }: { count: number }) {
  return (
    <Sparkles
      count={count}
      scale={[8, 6, 4]}
      size={1.5}
      speed={0.3}
      color="#6366f1"
      opacity={0.3}
    />
  );
}

// ---------------------------------------------------------------------------
// Lights — color cycling
// ---------------------------------------------------------------------------
function Lights() {
  const accentLight = useRef<THREE.PointLight>(null);

  useFrame((state) => {
    if (accentLight.current) {
      const t = state.clock.elapsedTime * 0.3;
      // Cycle between indigo and cyan
      accentLight.current.color.setHSL(0.65 + Math.sin(t) * 0.05, 0.8, 0.5);
    }
  });

  return (
    <>
      <ambientLight intensity={0.3} color="#8888cc" />
      <pointLight position={[0, 2, 0]} intensity={1.0} color="#fff5e1" distance={5} decay={2} />
      <pointLight ref={accentLight} position={[-2, 1, 1]} intensity={0.6} color="#6366f1" distance={6} decay={2} />
      <pointLight position={[2, 0.5, -1]} intensity={0.3} color="#06b6d4" distance={6} decay={2} />
    </>
  );
}

// ---------------------------------------------------------------------------
// Scene content with quality tiers
// ---------------------------------------------------------------------------
function SceneContent({ tier, scrollProgress }: Scene3DProps) {
  const [quality, setQuality] = useState(tier);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  const handleDecline = useCallback(() => setQuality("low"), []);
  const handleIncline = useCallback(() => setQuality(tier), [tier]);

  const particleCount = quality === "high" ? 200 : quality === "medium" ? 100 : 50;
  const nodeSize = quality === "low" ? 0.06 : 0.08;
  const autoRotate = !(scrollProgress > 0 && scrollProgress < 0.95);

  return (
    <>
      <PerformanceMonitor onDecline={handleDecline} onIncline={handleIncline} />
      <CameraRig scrollProgress={scrollProgress} />
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        maxPolarAngle={Math.PI / 2}
        minPolarAngle={Math.PI / 4}
        autoRotate={autoRotate}
        autoRotateSpeed={0.3}
      />
      <Lights />
      <InfiniteGrid />
      <Desk />
      <HolographicRing />
      <ConnectionLines />
      <DataParticles />
      {SKILL_NODES.map((node, i) => (
        <SkillNode
          key={i}
          {...node}
          size={nodeSize}
          hoveredNode={hoveredNode}
          onHover={() => setHoveredNode(node.label)}
          onUnhover={() => setHoveredNode(null)}
        />
      ))}
      <Particles count={particleCount} />
      <ContactShadows
        position={[0, -0.05, 0]}
        opacity={0.4}
        scale={5}
        blur={2}
        far={3}
      />
    </>
  );
}

// ---------------------------------------------------------------------------
// Exported Scene3D component
// ---------------------------------------------------------------------------
export default function Scene3D({ tier, scrollProgress }: Scene3DProps) {
  const dpr: [number, number] = tier === "high" ? [1, 1.5] : [1, 1];

  return (
    <Canvas
      dpr={dpr}
      frameloop="always"
      gl={{
        antialias: tier !== "low",
        powerPreference: "high-performance",
        alpha: true,
        stencil: false,
      }}
      camera={{ position: [0, 1.5, 3.5], fov: 50 }}
      performance={{ min: 0.5 }}
      style={{ background: "transparent" }}
    >
      <SceneContent tier={tier} scrollProgress={scrollProgress} />
    </Canvas>
  );
}
