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
} from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
interface Scene3DProps {
  tier: "high" | "medium" | "low";
  scrollProgress: number;
}

// ---------------------------------------------------------------------------
// Skill categories for tooltip display
// ---------------------------------------------------------------------------
const SKILL_CATEGORIES: Record<string, string> = {
  TypeScript: "Language",
  React: "Framework",
  "Node.js": "Runtime",
  AWS: "Cloud",
  Docker: "DevOps",
  Python: "Language",
  "Next.js": "Framework",
  Git: "Tool",
  SQL: "Database",
};

// ---------------------------------------------------------------------------
// Shared node positions (used by nodes + connection lines)
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
  { position: NODE_POSITIONS[0], label: "TypeScript", color: "#3178c6" },
  { position: NODE_POSITIONS[1], label: "React", color: "#61dafb" },
  { position: NODE_POSITIONS[2], label: "Node.js", color: "#339933" },
  { position: NODE_POSITIONS[3], label: "AWS", color: "#ff9900" },
  { position: NODE_POSITIONS[4], label: "Docker", color: "#2496ed" },
  { position: NODE_POSITIONS[5], label: "Python", color: "#3776ab" },
  { position: NODE_POSITIONS[6], label: "Next.js", color: "#ffffff" },
  { position: NODE_POSITIONS[7], label: "Git", color: "#f05032" },
  { position: NODE_POSITIONS[8], label: "SQL", color: "#336791" },
];

// ---------------------------------------------------------------------------
// Camera Rig — scroll-driven camera animation
// ---------------------------------------------------------------------------
function CameraRig({ scrollProgress }: { scrollProgress: number }) {
  const { camera } = useThree();
  const target = useRef(new THREE.Vector3(0, 0.85, -0.3)); // monitor position

  useFrame(() => {
    // Scroll 0-0.3: camera stays wide, slight orbit
    // Scroll 0.3-0.7: camera zooms toward monitor
    // Scroll 0.7-1.0: camera close to monitor

    const t = scrollProgress;
    const startZ = 3.5;
    const endZ = 1.8;
    const startY = 1.5;
    const endY = 1.0;
    const startX = 0;
    const endX = 0;

    // Ease-out cubic for smooth deceleration
    const eased = 1 - Math.pow(1 - t, 3);

    const z = startZ + (endZ - startZ) * eased;
    const y = startY + (endY - startY) * eased;
    const x = startX + (endX - startX) * eased;

    camera.position.lerp(new THREE.Vector3(x, y, z), 0.05);
    camera.lookAt(target.current);
  });

  return null;
}

// ---------------------------------------------------------------------------
// Floating Desk (procedural geometry)
// ---------------------------------------------------------------------------
function Desk() {
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
        {/* Screen surface (emissive glow) */}
        <mesh position={[0, 0, 0.03]}>
          <planeGeometry args={[1.3, 0.8]} />
          <meshStandardMaterial
            color="#6366f1"
            emissive="#6366f1"
            emissiveIntensity={0.15}
            metalness={0.1}
            roughness={0.9}
          />
        </mesh>
        {/* Monitor stand */}
        <mesh position={[0, -0.52, 0]}>
          <boxGeometry args={[0.1, 0.18, 0.1]} />
          <meshStandardMaterial color="#2a2a3a" />
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
          <meshStandardMaterial color="#3a3a4a" metalness={0.2} roughness={0.6} />
        </mesh>
        <mesh position={[0.07, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <torusGeometry args={[0.04, 0.01, 8, 16, Math.PI]} />
          <meshStandardMaterial color="#3a3a4a" />
        </mesh>
      </group>

      {/* Small plant */}
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
// Skill/Project Nodes (floating spheres with labels + hover tooltips)
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

  const scale = isHovered ? 1.3 : 1;

  return (
    <Float speed={1.5} rotationIntensity={0} floatIntensity={0.3}>
      <group position={position}>
        <mesh
          ref={meshRef}
          scale={scale}
          onPointerOver={(e) => {
            e.stopPropagation();
            onHover();
          }}
          onPointerOut={(e) => {
            e.stopPropagation();
            onUnhover();
          }}
        >
          <sphereGeometry args={[size, 16, 16]} />
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={0.4}
            metalness={0.6}
            roughness={0.2}
          />
        </mesh>
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
// Connection lines between nodes
// ---------------------------------------------------------------------------
function ConnectionLines({ opacity = 0.15 }: { opacity?: number }) {
  const lines = useMemo(
    () =>
      NODE_CONNECTIONS.map(([a, b]) => [
        new THREE.Vector3(...NODE_POSITIONS[a]),
        new THREE.Vector3(...NODE_POSITIONS[b]),
      ]),
    []
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
            })
          )}
        />
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
// Lights
// ---------------------------------------------------------------------------
function Lights() {
  return (
    <>
      <ambientLight intensity={0.3} color="#8888cc" />
      <pointLight position={[0, 2, 0]} intensity={1.0} color="#fff5e1" distance={5} decay={2} />
      <pointLight position={[-2, 1, 1]} intensity={0.5} color="#6366f1" distance={6} decay={2} />
      <pointLight position={[2, 0.5, -1]} intensity={0.3} color="#06b6d4" distance={6} decay={2} />
    </>
  );
}

// ---------------------------------------------------------------------------
// Post-processing (Bloom) — high tier only
// ---------------------------------------------------------------------------
function PostProcessing() {
  return (
    <EffectComposer>
      <Bloom
        intensity={0.8}
        luminanceThreshold={0.6}
        luminanceSmoothing={0.9}
        mipmapBlur
      />
    </EffectComposer>
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

  // Disable auto-rotate when user is scrolling
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
      <Desk />
      <ConnectionLines />
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
      {quality === "high" && <PostProcessing />}
    </>
  );
}

// ---------------------------------------------------------------------------
// Exported Scene3D component
// ---------------------------------------------------------------------------
export default function Scene3D({ tier, scrollProgress }: Scene3DProps) {
  const dpr: [number, number] = tier === "high" ? [1, 1.5] : [1, 1];

  // Use callback form for gl to avoid Turbopack/R3F v9 null-reference bug
  // (Cannot read properties of null (reading 'alpha'))
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const glConfig = useCallback(
    (defaultProps: any) =>
      new THREE.WebGLRenderer({
        ...defaultProps,
        antialias: tier !== "low",
        powerPreference: "high-performance",
        alpha: true,
        stencil: false,
      }),
    [tier]
  );

  return (
    <Canvas
      dpr={dpr}
      frameloop="always"
      gl={glConfig}
      camera={{ position: [0, 1.5, 3.5], fov: 50 }}
      performance={{ min: 0.5 }}
      style={{ background: "transparent" }}
    >
      <SceneContent tier={tier} scrollProgress={scrollProgress} />
    </Canvas>
  );
}
