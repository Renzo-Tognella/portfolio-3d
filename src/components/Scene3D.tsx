"use client";

import { useRef, useMemo, useEffect, useCallback, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  Float,
  Sparkles,
  PerformanceMonitor,
  OrbitControls,
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
// Materials — consistent PBR palette
// ---------------------------------------------------------------------------
const MAT = {
  wood: (color = "#5C4033") => (
    <meshStandardMaterial color={color} roughness={0.65} metalness={0.05} />
  ),
  metal: (color = "#2C2C2C") => (
    <meshStandardMaterial color={color} roughness={0.25} metalness={0.7} />
  ),
  plastic: (color = "#3A3A3A") => (
    <meshStandardMaterial color={color} roughness={0.45} metalness={0.1} />
  ),
  ceramic: (color = "#E8D5C4") => (
    <meshStandardMaterial color={color} roughness={0.35} metalness={0.05} />
  ),
  glass: (color = "#88ccff") => (
    <meshStandardMaterial color={color} roughness={0.05} metalness={0.1} transparent opacity={0.3} />
  ),
  fabric: (color = "#4A5568") => (
    <meshStandardMaterial color={color} roughness={0.9} metalness={0} />
  ),
  leaf: () => (
    <meshStandardMaterial color="#3D7A4A" roughness={0.7} metalness={0} side={THREE.DoubleSide} />
  ),
  emissive: (color: string, intensity = 0.3) => (
    <meshStandardMaterial color={color} emissive={color} emissiveIntensity={intensity} roughness={0.1} metalness={0.1} />
  ),
  bulb: () => (
    <meshStandardMaterial color="#FFE4B5" emissive="#FFE4B5" emissiveIntensity={2} />
  ),
};

// ---------------------------------------------------------------------------
// Camera Rig — scroll-driven + mouse parallax
// ---------------------------------------------------------------------------
function CameraRig({ scrollProgress }: { scrollProgress: number }) {
  const { camera } = useThree();
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

    // Start isometric, zoom in on scroll
    const baseX = 6 + (2.5 - 6) * eased;
    const baseY = 5 + (2 - 5) * eased;
    const baseZ = 6 + (2.5 - 6) * eased;

    // Mouse parallax
    const mx = mouse.current.x * 0.2 * (1 - eased * 0.6);
    const my = -mouse.current.y * 0.12 * (1 - eased * 0.6);

    camera.position.lerp(
      new THREE.Vector3(baseX + mx, baseY + my, baseZ),
      0.04
    );
    camera.lookAt(0, 0.8, 0);
  });

  return null;
}

// ---------------------------------------------------------------------------
// Wooden Desk
// ---------------------------------------------------------------------------
function Desk() {
  return (
    <group>
      {/* Tabletop */}
      <mesh position={[0, 0.75, 0]} castShadow receiveShadow>
        <boxGeometry args={[3.2, 0.08, 1.5]} />
        {MAT.wood("#6B4F3A")}
      </mesh>
      {/* Desk legs — tapered */}
      {[
        [-1.45, 0.35, -0.6],
        [1.45, 0.35, -0.6],
        [-1.45, 0.35, 0.6],
        [1.45, 0.35, 0.6],
      ].map((pos, i) => (
        <mesh key={i} position={pos as [number, number, number]} castShadow>
          <boxGeometry args={[0.08, 0.72, 0.08]} />
          {MAT.wood("#5C4033")}
        </mesh>
      ))}
      {/* Crossbar back */}
      <mesh position={[0, 0.35, -0.6]} castShadow>
        <boxGeometry args={[2.9, 0.06, 0.06]} />
        {MAT.wood("#5C4033")}
      </mesh>
    </group>
  );
}

// ---------------------------------------------------------------------------
// Monitor with stand
// ---------------------------------------------------------------------------
function Monitor() {
  const screenRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (screenRef.current) {
      const mat = screenRef.current.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity = 0.25 + Math.sin(state.clock.elapsedTime * 1.2) * 0.08;
    }
  });

  return (
    <group position={[0, 0.79, -0.35]}>
      {/* Bezel */}
      <mesh castShadow>
        <boxGeometry args={[1.8, 1.1, 0.06]} />
        {MAT.metal("#1a1a2e")}
      </mesh>
      {/* Screen */}
      <mesh ref={screenRef} position={[0, 0, 0.035]}>
        <planeGeometry args={[1.65, 0.95]} />
        {MAT.emissive("#3B4CC0", 0.25)}
      </mesh>
      {/* Code lines on screen */}
      <group position={[0, 0, 0.037]}>
        {[-0.3, -0.2, -0.1, 0.0, 0.1, 0.2, 0.3].map((y, i) => (
          <mesh key={i} position={[-0.1 + (i % 3) * 0.12, y, 0]}>
            <planeGeometry args={[0.35 + Math.sin(i * 1.3) * 0.2, 0.018]} />
            <meshBasicMaterial color="#7C8CFF" transparent opacity={0.25 + (i % 3) * 0.08} />
          </mesh>
        ))}
      </group>
      {/* Stand neck */}
      <mesh position={[0, -0.6, 0]} castShadow>
        <boxGeometry args={[0.08, 0.2, 0.08]} />
        {MAT.metal("#2a2a3a")}
      </mesh>
      {/* Stand base */}
      <mesh position={[0, -0.7, 0.05]} castShadow>
        <boxGeometry args={[0.5, 0.04, 0.3]} />
        {MAT.metal("#2a2a3a")}
      </mesh>
    </group>
  );
}

// ---------------------------------------------------------------------------
// Second monitor (smaller, angled)
// ---------------------------------------------------------------------------
function SecondMonitor() {
  return (
    <group position={[-1.1, 0.79, -0.2]} rotation={[0, 0.35, 0]}>
      <mesh castShadow>
        <boxGeometry args={[1.2, 0.8, 0.05]} />
        {MAT.metal("#1a1a2e")}
      </mesh>
      <mesh position={[0, 0, 0.03]}>
        <planeGeometry args={[1.05, 0.65]} />
        {MAT.emissive("#1E3A5F", 0.2)}
      </mesh>
      <mesh position={[0, -0.45, 0]}>
        <cylinderGeometry args={[0.03, 0.05, 0.15, 8]} />
        {MAT.metal()}
      </mesh>
      <mesh position={[0, -0.53, 0.04]}>
        <boxGeometry args={[0.35, 0.03, 0.2]} />
        {MAT.metal()}
      </mesh>
    </group>
  );
}

// ---------------------------------------------------------------------------
// Keyboard with procedural keys
// ---------------------------------------------------------------------------
function Keyboard() {
  const rows = [
    { y: 0.0, keys: 14, w: 0.1, gap: 0.015 },
    { y: 0.12, keys: 13, w: 0.1, gap: 0.015 },
    { y: 0.24, keys: 12, w: 0.1, gap: 0.015 },
    { y: 0.36, keys: 10, w: 0.1, gap: 0.015 },
    { y: 0.48, keys: 8, w: 0.1, gap: 0.015 },
  ];

  return (
    <group position={[-0.15, 0.83, 0.25]}>
      {/* Body */}
      <mesh castShadow>
        <boxGeometry args={[1.6, 0.04, 0.7]} />
        {MAT.plastic("#2D2D2D")}
      </mesh>
      {/* Keys */}
      {rows.map((row, ri) =>
        Array.from({ length: row.keys }, (_, ki) => (
          <mesh
            key={`${ri}-${ki}`}
            position={[
              -0.7 + ki * (row.w + row.gap) + (ri === 4 ? 0.3 : ri === 3 ? 0.15 : 0),
              0.03,
              -0.28 + row.y,
            ]}
          >
            <boxGeometry args={[row.w - 0.02, 0.025, 0.09]} />
            <meshStandardMaterial color="#3A3A3A" roughness={0.5} metalness={0.15} />
          </mesh>
        ))
      )}
    </group>
  );
}

// ---------------------------------------------------------------------------
// Mouse
// ---------------------------------------------------------------------------
function Mouse() {
  return (
    <group position={[0.9, 0.83, 0.3]}>
      <mesh castShadow>
        <capsuleGeometry args={[0.04, 0.08, 4, 16]} />
        <meshStandardMaterial color="#2D2D2D" roughness={0.35} metalness={0.2} />
      </mesh>
      {/* Scroll wheel */}
      <mesh position={[0, 0.035, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.012, 0.012, 0.03, 8]} />
        <meshStandardMaterial color="#555" roughness={0.3} metalness={0.4} />
      </mesh>
    </group>
  );
}

// ---------------------------------------------------------------------------
// Coffee Machine
// ---------------------------------------------------------------------------
function CoffeeMachine() {
  return (
    <group position={[1.2, 0.79, 0.05]}>
      {/* Main body */}
      <mesh position={[0, 0.25, 0]} castShadow>
        <boxGeometry args={[0.35, 0.5, 0.3]} />
        {MAT.metal("#3A3A3A")}
      </mesh>
      {/* Top */}
      <mesh position={[0, 0.52, 0]} castShadow>
        <boxGeometry args={[0.38, 0.06, 0.33]} />
        {MAT.metal("#2A2A2A")}
      </mesh>
      {/* Water tank (glass) */}
      <mesh position={[0.2, 0.25, 0]}>
        <boxGeometry args={[0.12, 0.4, 0.25]} />
        {MAT.glass("#66aadd")}
      </mesh>
      {/* Drip tray */}
      <mesh position={[0, 0.03, 0.12]} castShadow>
        <boxGeometry args={[0.3, 0.04, 0.12]} />
        {MAT.metal("#444")}
      </mesh>
      {/* Cup on drip tray */}
      <group position={[0, 0.08, 0.15]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.04, 0.035, 0.07, 12]} />
          {MAT.ceramic("#E8D5C4")}
        </mesh>
        {/* Coffee liquid */}
        <mesh position={[0, 0.02, 0]}>
          <cylinderGeometry args={[0.035, 0.035, 0.02, 12]} />
          <meshStandardMaterial color="#3C1A00" roughness={0.2} />
        </mesh>
      </group>
      {/* Spout */}
      <mesh position={[0, 0.15, 0.1]}>
        <boxGeometry args={[0.06, 0.04, 0.08]} />
        {MAT.metal("#333")}
      </mesh>
      {/* LED indicator */}
      <mesh position={[0.15, 0.2, 0.155]}>
        <sphereGeometry args={[0.012, 8, 8]} />
        <meshStandardMaterial color="#22c55e" emissive="#22c55e" emissiveIntensity={1.5} />
      </mesh>
      {/* Buttons */}
      {[0, 0.04].map((y, i) => (
        <mesh key={i} position={[-0.15, 0.2 + y, 0.155]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.015, 0.015, 0.01, 8]} />
          <meshStandardMaterial color="#555" roughness={0.3} metalness={0.5} />
        </mesh>
      ))}
    </group>
  );
}

// ---------------------------------------------------------------------------
// Desk Lamp
// ---------------------------------------------------------------------------
function DeskLamp() {
  const lightRef = useRef<THREE.PointLight>(null);

  useFrame((state) => {
    if (lightRef.current) {
      // Subtle flicker
      lightRef.current.intensity = 2.5 + Math.sin(state.clock.elapsedTime * 8) * 0.05 + Math.sin(state.clock.elapsedTime * 3.7) * 0.1;
    }
  });

  return (
    <group position={[-1.3, 0.79, -0.35]}>
      {/* Base */}
      <mesh castShadow>
        <cylinderGeometry args={[0.12, 0.14, 0.03, 16]} />
        {MAT.metal("#333")}
      </mesh>
      {/* Lower arm */}
      <mesh position={[0, 0.35, 0]} rotation={[0, 0, 0.15]} castShadow>
        <cylinderGeometry args={[0.02, 0.02, 0.7, 8]} />
        {MAT.metal("#444")}
      </mesh>
      {/* Upper arm */}
      <mesh position={[0.12, 0.72, 0]} rotation={[0, 0, -0.3]} castShadow>
        <cylinderGeometry args={[0.015, 0.015, 0.5, 8]} />
        {MAT.metal("#444")}
      </mesh>
      {/* Shade */}
      <mesh position={[0.22, 0.95, 0]} castShadow>
        <cylinderGeometry args={[0.05, 0.14, 0.15, 16, 1, true]} />
        <meshStandardMaterial color="#1a1a2e" roughness={0.6} side={THREE.DoubleSide} />
      </mesh>
      {/* Bulb */}
      <mesh position={[0.22, 0.92, 0]}>
        <sphereGeometry args={[0.035, 8, 8]} />
        {MAT.bulb()}
      </mesh>
      {/* Light */}
      <pointLight
        ref={lightRef}
        position={[0.22, 0.9, 0]}
        color="#FFE0A0"
        intensity={2.5}
        distance={4}
        decay={2}
        castShadow
      />
    </group>
  );
}

// ---------------------------------------------------------------------------
// Books Stack
// ---------------------------------------------------------------------------
function Books() {
  const bookColors = ["#8B4513", "#1E3A5F", "#5B2C6F", "#7B241C"];
  const bookWidths = [0.25, 0.2, 0.22, 0.18];

  return (
    <group position={[1.1, 0.79, -0.45]}>
      {bookColors.map((color, i) => (
        <mesh key={i} position={[i * 0.02, 0.04 + i * 0.05, 0]} castShadow>
          <boxGeometry args={[bookWidths[i], 0.045, 0.35]} />
          <meshStandardMaterial color={color} roughness={0.7} />
        </mesh>
      ))}
    </group>
  );
}

// ---------------------------------------------------------------------------
// Coffee Mug with Steam
// ---------------------------------------------------------------------------
function CoffeeMug() {
  return (
    <group position={[-0.6, 0.79, 0.4]}>
      <mesh castShadow>
        <cylinderGeometry args={[0.05, 0.045, 0.1, 16]} />
        {MAT.ceramic("#C85A4A")}
      </mesh>
      {/* Handle */}
      <mesh position={[0.06, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <torusGeometry args={[0.035, 0.01, 8, 16, Math.PI]} />
        {MAT.ceramic("#C85A4A")}
      </mesh>
      {/* Coffee surface */}
      <mesh position={[0, 0.04, 0]}>
        <cylinderGeometry args={[0.045, 0.045, 0.01, 16]} />
        <meshStandardMaterial color="#3C1A00" roughness={0.15} />
      </mesh>
      {/* Steam */}
      <Float speed={2} floatIntensity={0.15}>
        <mesh position={[0, 0.1, 0]}>
          <sphereGeometry args={[0.015, 6, 6]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.1} />
        </mesh>
      </Float>
      <Float speed={1.5} floatIntensity={0.12}>
        <mesh position={[0.01, 0.14, 0.01]}>
          <sphereGeometry args={[0.012, 6, 6]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.07} />
        </mesh>
      </Float>
    </group>
  );
}

// ---------------------------------------------------------------------------
// Plant (Potted)
// ---------------------------------------------------------------------------
function Plant() {
  const stems = useMemo(
    () =>
      Array.from({ length: 7 }, (_, i) => ({
        x: Math.sin(i * 1.3) * 0.04,
        z: Math.cos(i * 1.7) * 0.04,
        h: 0.08 + Math.random() * 0.08,
        lean: (Math.random() - 0.5) * 0.3,
      })),
    []
  );

  return (
    <group position={[-1.4, 0.79, 0.35]}>
      {/* Pot */}
      <mesh castShadow>
        <cylinderGeometry args={[0.07, 0.055, 0.09, 12]} />
        {MAT.ceramic("#D4956A")}
      </mesh>
      {/* Soil */}
      <mesh position={[0, 0.045, 0]}>
        <cylinderGeometry args={[0.065, 0.065, 0.015, 12]} />
        <meshStandardMaterial color="#3E2723" roughness={0.9} />
      </mesh>
      {/* Stems + leaves */}
      {stems.map((s, i) => (
        <group key={i} position={[s.x, 0.09, s.z]} rotation={[s.lean, 0, s.lean * 0.5]}>
          {/* Stem */}
          <mesh>
            <cylinderGeometry args={[0.004, 0.004, s.h, 4]} />
            <meshStandardMaterial color="#2E7D32" />
          </mesh>
          {/* Leaf */}
          <mesh position={[0, s.h / 2, 0]} rotation={[0.3, i * 0.5, 0.2]}>
            <sphereGeometry args={[0.035, 6, 4, 0, Math.PI * 2, 0, Math.PI / 2]} />
            {MAT.leaf()}
          </mesh>
        </group>
      ))}
    </group>
  );
}

// ---------------------------------------------------------------------------
// Headphones on stand
// ---------------------------------------------------------------------------
function Headphones() {
  return (
    <group position={[0.7, 0.79, -0.4]} rotation={[0, -0.3, 0]}>
      {/* Stand */}
      <mesh castShadow>
        <cylinderGeometry args={[0.025, 0.04, 0.3, 8]} />
        {MAT.metal("#444")}
      </mesh>
      {/* Headband */}
      <mesh position={[0, 0.18, 0]} rotation={[0, 0, Math.PI]}>
        <torusGeometry args={[0.08, 0.012, 8, 24, Math.PI]} />
        {MAT.plastic("#2D2D2D")}
      </mesh>
      {/* Ear cups */}
      <mesh position={[-0.08, 0.1, 0]} rotation={[0, 0, 0.3]}>
        <sphereGeometry args={[0.04, 8, 8]} />
        {MAT.plastic("#333")}
      </mesh>
      <mesh position={[0.08, 0.1, 0]} rotation={[0, 0, -0.3]}>
        <sphereGeometry args={[0.04, 8, 8]} />
        {MAT.plastic("#333")}
      </mesh>
    </group>
  );
}

// ---------------------------------------------------------------------------
// Notepad
// ---------------------------------------------------------------------------
function Notepad() {
  return (
    <group position={[0.35, 0.8, 0.45]} rotation={[0, 0.2, 0]}>
      <mesh castShadow>
        <boxGeometry args={[0.25, 0.015, 0.35]} />
        <meshStandardMaterial color="#F5F0E8" roughness={0.8} />
      </mesh>
      {/* Lines */}
      {[-0.1, -0.05, 0.0, 0.05, 0.1].map((y, i) => (
        <mesh key={i} position={[0, 0.009, y]}>
          <planeGeometry args={[0.2, 0.002]} />
          <meshBasicMaterial color="#B8C4E8" transparent opacity={0.5} />
        </mesh>
      ))}
      {/* Pen */}
      <group position={[0.18, 0.01, 0]} rotation={[0, 0, 0.15]}>
        <mesh>
          <cylinderGeometry args={[0.008, 0.008, 0.2, 6]} />
          <meshStandardMaterial color="#1a1a2e" roughness={0.3} metalness={0.4} />
        </mesh>
        {/* Pen clip */}
        <mesh position={[0.01, 0.06, 0]}>
          <boxGeometry args={[0.004, 0.06, 0.008]} />
          <meshStandardMaterial color="#C0C0C0" metalness={0.8} roughness={0.2} />
        </mesh>
      </group>
    </group>
  );
}

// ---------------------------------------------------------------------------
// Floating Particles (dust motes)
// ---------------------------------------------------------------------------
function FloatingDust({ count }: { count: number }) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const particles = useMemo(
    () =>
      Array.from({ length: count }, () => ({
        x: (Math.random() - 0.5) * 6,
        y: Math.random() * 3 + 0.2,
        z: (Math.random() - 0.5) * 4,
        speed: 0.2 + Math.random() * 0.4,
        offset: Math.random() * Math.PI * 2,
        scale: 0.01 + Math.random() * 0.02,
      })),
    [count]
  );

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const t = clock.elapsedTime;
    particles.forEach((p, i) => {
      dummy.position.set(
        p.x + Math.sin(t * p.speed + p.offset) * 0.3,
        p.y + Math.sin(t * p.speed * 0.5 + p.offset) * 0.2,
        p.z + Math.cos(t * p.speed + p.offset) * 0.3
      );
      dummy.scale.setScalar(p.scale);
      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(i, dummy.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <sphereGeometry args={[1, 6, 6]} />
      <meshBasicMaterial color="#FFE4B5" transparent opacity={0.4} />
    </instancedMesh>
  );
}

// ---------------------------------------------------------------------------
// Floor
// ---------------------------------------------------------------------------
function Floor() {
  return (
    <group position={[0, -0.01, 0]}>
      {/* Floor plane */}
      <mesh receiveShadow>
        <planeGeometry args={[12, 12]} />
        <meshStandardMaterial color="#12121f" roughness={0.95} metalness={0} />
      </mesh>
      {/* Grid overlay */}
      <gridHelper args={[12, 24, "#1E1E3A", "#16162A"]} position={[0, 0.001, 0]} />
    </group>
  );
}

// ---------------------------------------------------------------------------
// Lights — cinematic warm/cool
// ---------------------------------------------------------------------------
function Lights() {
  return (
    <>
      {/* Cool ambient fill */}
      <ambientLight intensity={0.12} color="#B8C4E8" />
      {/* Warm key light from above */}
      <directionalLight
        position={[3, 8, 4]}
        intensity={0.35}
        color="#FFE8D0"
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-bias={-0.0005}
      />
      {/* Cool fill from left */}
      <directionalLight position={[-5, 4, -1]} intensity={0.15} color="#B8C4E8" />
      {/* Accent rim light */}
      <pointLight position={[2, 1.5, 2]} intensity={0.4} color="#6366f1" distance={5} decay={2} />
    </>
  );
}

// ---------------------------------------------------------------------------
// Scene content with quality tiers
// ---------------------------------------------------------------------------
function SceneContent({ tier, scrollProgress }: Scene3DProps) {
  const [quality, setQuality] = useState(tier);

  const handleDecline = useCallback(() => setQuality("low"), []);
  const handleIncline = useCallback(() => setQuality(tier), [tier]);

  const dustCount = quality === "high" ? 80 : quality === "medium" ? 40 : 15;
  const sparkleCount = quality === "high" ? 100 : quality === "medium" ? 50 : 20;
  const autoRotate = !(scrollProgress > 0.02 && scrollProgress < 0.95);

  return (
    <>
      <PerformanceMonitor onDecline={handleDecline} onIncline={handleIncline} />

      {/* Background + Fog */}
      <color attach="background" args={["#0a0a12"]} />
      <fog attach="fog" args={["#0a0a12", 8, 20]} />

      <CameraRig scrollProgress={scrollProgress} />
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        maxPolarAngle={Math.PI / 2.2}
        minPolarAngle={Math.PI / 6}
        autoRotate={autoRotate}
        autoRotateSpeed={0.3}
        enableDamping
        dampingFactor={0.05}
        target={[0, 0.8, 0]}
      />

      <Lights />
      <Floor />

      {/* Desk setup */}
      <Desk />
      <Monitor />
      <SecondMonitor />
      <Keyboard />
      <Mouse />
      <CoffeeMachine />
      <DeskLamp />
      <Books />
      <CoffeeMug />
      <Plant />
      <Headphones />
      <Notepad />

      {/* Atmosphere */}
      <FloatingDust count={dustCount} />
      <Sparkles
        count={sparkleCount}
        scale={[6, 4, 4]}
        size={1.2}
        speed={0.2}
        color="#6366f1"
        opacity={0.2}
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
      shadows
      gl={{
        antialias: tier !== "low",
        powerPreference: "high-performance",
        alpha: false,
        stencil: false,
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.2,
      }}
      camera={{ position: [6, 5, 6], fov: 32, near: 0.1, far: 100 }}
      performance={{ min: 0.5 }}
    >
      <SceneContent tier={tier} scrollProgress={scrollProgress} />
    </Canvas>
  );
}
