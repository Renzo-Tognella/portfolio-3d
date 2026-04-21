"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  Float,
  MeshTransmissionMaterial,
  Text,
  Sparkles,
  Environment,
  ContactShadows,
} from "@react-three/drei";
import * as THREE from "three";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
interface Scene3DProps {
  tier: "high" | "medium" | "low";
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
        {/* Screen bezel */}
        <mesh>
          <boxGeometry args={[1.4, 0.9, 0.05]} />
          <meshStandardMaterial color="#1a1a2e" metalness={0.5} roughness={0.3} />
        </mesh>
        {/* Screen surface (emissive) */}
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
        {/* Handle */}
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
// Skill/Project Nodes (interactive spheres)
// ---------------------------------------------------------------------------
interface SkillNodeProps {
  position: [number, number, number];
  label: string;
  color?: string;
  size?: number;
}

function SkillNode({ position, label, color = "#6366f1", size = 0.08 }: SkillNodeProps) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.y =
        position[1] + Math.sin(state.clock.elapsedTime * 0.8 + position[0]) * 0.05;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0} floatIntensity={0.3}>
      <group position={position}>
        <mesh ref={meshRef}>
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
      </group>
    </Float>
  );
}

// ---------------------------------------------------------------------------
// Connection lines between nodes
// ---------------------------------------------------------------------------
function ConnectionLines() {
  const lines = useMemo(() => {
    const connections: [number, number][] = [
      [0, 1], [0, 2], [1, 3], [2, 4], [3, 5],
      [4, 6], [5, 7], [6, 8], [0, 4], [1, 7],
      [2, 6], [3, 8], [0, 8], [1, 5],
    ];

    const nodePositions: [number, number, number][] = [
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

    return connections.map(([a, b]) => [
      new THREE.Vector3(...nodePositions[a]),
      new THREE.Vector3(...nodePositions[b]),
    ]);
  }, []);

  return (
    <group>
      {lines.map((points, i) => (
        <primitive key={i} object={new THREE.Line(
          new THREE.BufferGeometry().setFromPoints(points),
          new THREE.LineBasicMaterial({
            color: "#6366f1",
            transparent: true,
            opacity: 0.15,
          })
        )} />
      ))}
    </group>
  );
}

// ---------------------------------------------------------------------------
// Particles (background)
// ---------------------------------------------------------------------------
function Particles({ tier }: { tier: string }) {
  const count = tier === "high" ? 200 : tier === "medium" ? 100 : 50;
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
      <pointLight
        position={[0, 2, 0]}
        intensity={1.0}
        color="#fff5e1"
        distance={5}
        decay={2}
      />
      <pointLight
        position={[-2, 1, 1]}
        intensity={0.5}
        color="#6366f1"
        distance={6}
        decay={2}
      />
      <pointLight
        position={[2, 0.5, -1]}
        intensity={0.3}
        color="#06b6d4"
        distance={6}
        decay={2}
      />
    </>
  );
}

// ---------------------------------------------------------------------------
// Main Scene
// ---------------------------------------------------------------------------
const SKILL_NODES: SkillNodeProps[] = [
  { position: [-1.8, 1.2, 0.3], label: "TypeScript", color: "#3178c6" },
  { position: [-1.5, 0.3, 1.2], label: "React", color: "#61dafb" },
  { position: [-1.2, -0.3, 0.8], label: "Node.js", color: "#339933" },
  { position: [1.5, 1.0, 0.5], label: "AWS", color: "#ff9900" },
  { position: [1.8, 0.2, 1.0], label: "Docker", color: "#2496ed" },
  { position: [1.3, -0.4, 0.6], label: "Python", color: "#3776ab" },
  { position: [0.5, 1.5, 1.0], label: "Next.js", color: "#ffffff" },
  { position: [-0.5, 1.6, 0.8], label: "Git", color: "#f05032" },
  { position: [0.0, -0.8, 1.2], label: "SQL", color: "#336791" },
];

function SceneContent({ tier }: Scene3DProps) {
  return (
    <>
      <Lights />
      <Desk />
      <ConnectionLines />
      {SKILL_NODES.map((node, i) => (
        <SkillNode key={i} {...node} size={tier === "low" ? 0.06 : 0.08} />
      ))}
      <Particles tier={tier} />
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

export default function Scene3D({ tier }: Scene3DProps) {
  const dpr: [number, number] = tier === "high" ? [1, 1.5] : [1, 1];

  return (
    <Canvas
      dpr={dpr}
      frameloop="demand"
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
      <SceneContent tier={tier} />
    </Canvas>
  );
}
