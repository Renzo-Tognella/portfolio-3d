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
import { useMonitorTexture } from "@/components/MonitorCanvas";
import { usePostitTexture } from "@/components/PostitCanvas";
import { useDrawerTexture } from "@/components/DrawerCanvas";

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
// Dive Camera — diagonal angle, monitor as hero, chair NOT in frame
//
// Camera starts front-right diagonal (~40°), slightly above desk level.
// This avoids the chair (which is at z=1.3) and keeps the monitor dominant.
// Scroll drives camera closer and slightly lower, narrowing FOV.
// ---------------------------------------------------------------------------
const CAMERA_KEYFRAMES = [
  // Phase 0: Wide diagonal establishing — monitor visible, desk context
  { progress: 0.0, pos: new THREE.Vector3(3.5, 2.5, 3.0), fov: 38, lookAt: new THREE.Vector3(0, 1.5, -0.3) },
  // Phase 1: Drift closer, slight descent
  { progress: 0.2, pos: new THREE.Vector3(2.5, 2.1, 2.2), fov: 36, lookAt: new THREE.Vector3(0, 1.45, -0.3) },
  // Phase 2: Tighter — monitor dominates frame
  { progress: 0.45, pos: new THREE.Vector3(1.2, 1.7, 1.4), fov: 32, lookAt: new THREE.Vector3(0, 1.4, -0.3) },
  // Phase 3: Very close — screen content legible
  { progress: 0.7, pos: new THREE.Vector3(0.4, 1.4, 0.7), fov: 26, lookAt: new THREE.Vector3(0, 1.3, -0.3) },
  // Phase 4: Final — right at the monitor screen
  { progress: 1.0, pos: new THREE.Vector3(0.05, 1.3, 0.25), fov: 20, lookAt: new THREE.Vector3(0, 1.25, -0.35) },
];

function DiveCamera({ scrollProgress }: { scrollProgress: number }) {
  const { camera } = useThree();
  const mouse = useRef({ x: 0, y: 0 });
  const smoothProgress = useRef(0);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
      mouse.current.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  useFrame((_, delta) => {
    // Smooth the scroll progress
    smoothProgress.current = THREE.MathUtils.damp(
      smoothProgress.current,
      scrollProgress,
      4,
      delta
    );

    const t = Math.min(1, Math.max(0, smoothProgress.current));

    // Find surrounding keyframes
    let fromIdx = 0;
    for (let i = 0; i < CAMERA_KEYFRAMES.length - 1; i++) {
      if (t >= CAMERA_KEYFRAMES[i].progress && t <= CAMERA_KEYFRAMES[i + 1].progress) {
        fromIdx = i;
        break;
      }
    }
    const from = CAMERA_KEYFRAMES[fromIdx];
    const to = CAMERA_KEYFRAMES[Math.min(fromIdx + 1, CAMERA_KEYFRAMES.length - 1)];

    // Local progress between the two keyframes
    const range = to.progress - from.progress;
    const localT = range > 0 ? Math.min(1, (t - from.progress) / range) : 0;

    // Interpolate position and lookAt
    const pos = new THREE.Vector3().lerpVectors(from.pos, to.pos, localT);
    const look = new THREE.Vector3().lerpVectors(from.lookAt, to.lookAt, localT);

    // Mouse parallax — diminishes as we dive in
    const parallaxStrength = 1 - t * 0.9;
    const mx = mouse.current.x * 0.25 * parallaxStrength;
    const my = -mouse.current.y * 0.15 * parallaxStrength;

    pos.x += mx;
    pos.y += my;

    camera.position.lerp(pos, 0.08);
    camera.lookAt(look);

    // Animate FOV
    const targetFov = THREE.MathUtils.lerp(from.fov, to.fov, localT);
    if (camera instanceof THREE.PerspectiveCamera) {
      camera.fov = THREE.MathUtils.lerp(camera.fov, targetFov, 0.08);
      camera.updateProjectionMatrix();
    }
  });

  return null;
}

// ---------------------------------------------------------------------------
// Project data for desk drawers
// ---------------------------------------------------------------------------
const DRAWER_PROJECTS = [
  { id: 0, title: "Tradener", tech: "Rails / PG / Redis / Docker", color: "#818cf8" },
  { id: 1, title: "Modulus", tech: "Rails / Python / LLMs / PG", color: "#34d399" },
  { id: 2, title: "IEEE Research", tech: "C++ / Python / CV / NLP", color: "#fbbf24" },
];

// ---------------------------------------------------------------------------
// Project data for desk drawers
// ---------------------------------------------------------------------------
function Drawer({
  project,
  index,
}: {
  project: { title: string; tech: string; color: string };
  index: number;
}) {
  const [open, setOpen] = useState(false);
  const groupRef = useRef<THREE.Group>(null);
  const drawerTex = useDrawerTexture(project);

  const closedZ = -0.08;
  const openZ = 0.32;
  const xPos = (index - 1) * 0.85;

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    const target = open ? openZ : closedZ;
    groupRef.current.position.z = THREE.MathUtils.damp(
      groupRef.current.position.z,
      target,
      6,
      delta
    );
  });

  return (
    <group position={[xPos, 0.35, 0.6]}>
      {/* Cavity — visible when drawer slides out */}
      <mesh position={[0, 0, closedZ]}>
        <boxGeometry args={[0.7, 0.32, 0.46]} />
        <meshStandardMaterial color="#0a0a0a" roughness={0.9} />
      </mesh>

      {/* Drawer body + face */}
      <group ref={groupRef} position={[0, 0, closedZ]}>
        {/* Drawer box */}
        <mesh
          castShadow
          onClick={(e) => {
            e.stopPropagation();
            setOpen((o) => !o);
          }}
          onPointerOver={() => {
            document.body.style.cursor = "pointer";
          }}
          onPointerOut={() => {
            document.body.style.cursor = "auto";
          }}
        >
          <boxGeometry args={[0.7, 0.3, 0.45]} />
          {MAT.wood("#7B5F4A")}
        </mesh>

        {/* Front face — Canvas 2D texture with project info */}
        <mesh position={[0, 0, 0.23]}>
          <planeGeometry args={[0.6, 0.22]} />
          <meshStandardMaterial
            roughness={0.1}
            metalness={0}
            map={drawerTex ?? undefined}
          />
        </mesh>

        {/* Handle */}
        <mesh position={[0, 0.08, 0.26]} castShadow>
          <boxGeometry args={[0.3, 0.025, 0.025]} />
          {MAT.metal("#888")}
        </mesh>
      </group>
    </group>
  );
}

// ---------------------------------------------------------------------------
// Interactive Desk with clickable drawers
// ---------------------------------------------------------------------------
function InteractiveDesk() {
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

      {/* Front panel backboard — thin panel behind drawers */}
      <mesh position={[0, 0.35, -0.84]} castShadow>
        <boxGeometry args={[2.8, 0.6, 0.03]} />
        {MAT.wood("#4A3528")}
      </mesh>

      {/* Three project drawers */}
      {DRAWER_PROJECTS.map((proj, i) => (
        <Drawer key={proj.id} project={proj} index={i} />
      ))}
    </group>
  );
}

// ---------------------------------------------------------------------------
// Monitor with Canvas 2D texture + turn-on effect (content in MonitorCanvas.ts)
// ---------------------------------------------------------------------------

function Monitor({ scrollProgress }: { scrollProgress: number }) {
  const screenRef = useRef<THREE.Mesh>(null);
  const emissiveIntensity = useRef(0);
  const monitorTex = useMonitorTexture(scrollProgress);

  // Turn-on curve: screen stays off until progress ~0.3, then glows to full by 0.6
  useFrame((state, delta) => {
    if (!screenRef.current) return;
    const mat = screenRef.current.material as THREE.MeshStandardMaterial;

    // Turn-on curve
    let targetIntensity = 0;
    if (scrollProgress > 0.3 && scrollProgress <= 0.6) {
      targetIntensity = ((scrollProgress - 0.3) / 0.3) * 1.2;
    } else if (scrollProgress > 0.6) {
      targetIntensity = 1.0 + Math.sin(state.clock.elapsedTime * 1.2) * 0.08;
    }

    emissiveIntensity.current = THREE.MathUtils.lerp(
      emissiveIntensity.current,
      targetIntensity,
      delta * 3
    );
    mat.emissiveIntensity = emissiveIntensity.current;
  });

  const isScreenOn = scrollProgress > 0.28;

  return (
    <group position={[0, 1.5, -0.35]}>
      {/* Bezel */}
      <mesh castShadow>
        <boxGeometry args={[1.8, 1.1, 0.06]} />
        <meshStandardMaterial color="#22223a" roughness={0.25} metalness={0.6} />
      </mesh>
      {/* Screen — always has a faint standby glow, intensifies on scroll */}
      <mesh ref={screenRef} position={[0, 0, 0.035]}>
        <planeGeometry args={[1.65, 0.95]} />
        <meshStandardMaterial
          emissive={isScreenOn ? "#6366f1" : "#1E3A5F"}
          emissiveIntensity={isScreenOn ? 0 : 0.3}
          color="#0d1520"
          roughness={0.1}
          metalness={0.1}
          toneMapped={false}
          emissiveMap={monitorTex ?? undefined}
        />
      </mesh>
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
      {/* Power LED */}
      <mesh position={[0.75, -0.48, 0.035]}>
        <circleGeometry args={[0.012, 12]} />
        <meshStandardMaterial
          color={isScreenOn ? "#22c55e" : "#333333"}
          emissive={isScreenOn ? "#22c55e" : "#000000"}
          emissiveIntensity={isScreenOn ? 1.5 : 0}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}

// ---------------------------------------------------------------------------
// Second monitor (smaller, angled)
// ---------------------------------------------------------------------------
function SecondMonitor({ scrollProgress }: { scrollProgress: number }) {
  const secondScreenOn = scrollProgress > 0.2;
  const postitTex = usePostitTexture();

  return (
    <group position={[-1.1, 1.35, -0.15]} rotation={[0, 0.35, 0]}>
      <mesh castShadow>
        <boxGeometry args={[1.2, 0.8, 0.05]} />
        <meshStandardMaterial color="#22223a" roughness={0.25} metalness={0.6} />
      </mesh>
      <mesh position={[0, 0, 0.03]}>
        <planeGeometry args={[1.05, 0.65]} />
        <meshStandardMaterial
          color="#0d1520"
          emissive={secondScreenOn ? "#818cf8" : "#1E3A5F"}
          emissiveIntensity={secondScreenOn ? 1.2 : 0.3}
          roughness={0.1}
          metalness={0.1}
          toneMapped={false}
          emissiveMap={postitTex ?? undefined}
        />
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
function KeyMesh({
  position,
  size,
}: {
  position: [number, number, number];
  size: [number, number, number];
}) {
  const ref = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const glowRef = useRef(0);

  useFrame((_, delta) => {
    if (!ref.current) return;
    const target = hovered ? 1 : 0;
    glowRef.current = THREE.MathUtils.lerp(glowRef.current, target, delta * 12);
    const mat = ref.current.material as THREE.MeshStandardMaterial;
    mat.emissiveIntensity = glowRef.current * 0.8;
    mat.emissive.setHex(hovered ? 0x6366f1 : 0x000000);
    // Lift key slightly on hover
    ref.current.position.y = 0.03 + glowRef.current * 0.005;
  });

  return (
    <mesh
      ref={ref}
      position={position}
      onPointerOver={(e) => { e.stopPropagation(); setHovered(true); document.body.style.cursor = "pointer"; }}
      onPointerOut={() => { setHovered(false); document.body.style.cursor = "auto"; }}
    >
      <boxGeometry args={size} />
      <meshStandardMaterial color="#3A3A3A" roughness={0.5} metalness={0.15} />
    </mesh>
  );
}

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
      {/* Keys — interactive */}
      {rows.map((row, ri) =>
        Array.from({ length: row.keys }, (_, ki) => (
          <KeyMesh
            key={`${ri}-${ki}`}
            position={[
              -0.7 + ki * (row.w + row.gap) + (ri === 4 ? 0.3 : ri === 3 ? 0.15 : 0),
              0.03,
              -0.28 + row.y,
            ]}
            size={[row.w - 0.02, 0.025, 0.09]}
          />
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
// Interactive Books Stack
// ---------------------------------------------------------------------------

const SKILL_CATEGORIES = [
  {
    name: "Backend",
    color: "#6366f1", // indigo
    skills: ["Ruby on Rails", "Node.js", "Python", "GraphQL", "REST APIs"],
  },
  {
    name: "Bancos de Dados",
    color: "#06b6d4", // cyan
    skills: ["PostgreSQL", "MongoDB", "Redis", "MySQL"],
  },
  {
    name: "Infraestrutura",
    color: "#f59e0b", // amber
    skills: ["Docker", "Kubernetes", "AWS", "CI/CD", "Linux"],
  },
  {
    name: "Qualidade & IA",
    color: "#f43f5e", // rose
    skills: ["RSpec", "Jest", "Copilot", "ChatGPT", "Code Review"],
  },
];

interface BookProps {
  color: string;
  width: number;
  index: number;
  category: (typeof SKILL_CATEGORIES)[0];
}

function Book({ color, width, index, category }: BookProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const groupRef = useRef<THREE.Group>(null);
  const coverPivotRef = useRef<THREE.Group>(null);

  const targetOpen = useRef(0);
  const targetLift = useRef(0);
  const currentOpen = useRef(0);
  const currentLift = useRef(0);

  useFrame((_, delta) => {
    currentOpen.current = THREE.MathUtils.damp(
      currentOpen.current,
      targetOpen.current,
      8,
      delta
    );
    currentLift.current = THREE.MathUtils.damp(
      currentLift.current,
      targetLift.current,
      6,
      delta
    );

    if (coverPivotRef.current) {
      coverPivotRef.current.rotation.z = currentOpen.current;
    }
    if (groupRef.current) {
      groupRef.current.position.y =
        0.04 + index * 0.05 + currentLift.current;
    }
  });

  useEffect(() => {
    targetOpen.current = isOpen ? -Math.PI * 0.78 : 0;
  }, [isOpen]);

  useEffect(() => {
    targetLift.current = isHovered ? 0.03 : 0;
  }, [isHovered]);

  // Canvas texture for the inner page
  const pageTexture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 256;
    const ctx = canvas.getContext("2d")!;

    // Colored background
    ctx.fillStyle = category.color;
    ctx.fillRect(0, 0, 512, 256);

    // Subtle border
    ctx.strokeStyle = "rgba(0,0,0,0.25)";
    ctx.lineWidth = 6;
    ctx.strokeRect(3, 3, 506, 250);

    // Category name
    ctx.fillStyle = "white";
    ctx.font = "bold 32px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.shadowColor = "rgba(0,0,0,0.3)";
    ctx.shadowBlur = 4;
    ctx.fillText(category.name, 256, 48);
    ctx.shadowBlur = 0;

    // Divider line
    ctx.strokeStyle = "rgba(255,255,255,0.35)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(80, 72);
    ctx.lineTo(432, 72);
    ctx.stroke();

    // Skills
    ctx.font = "17px sans-serif";
    ctx.fillStyle = "rgba(255,255,255,0.9)";
    category.skills.forEach((skill, i) => {
      ctx.fillText(skill, 256, 105 + i * 28);
    });

    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.minFilter = THREE.LinearFilter;
    tex.magFilter = THREE.LinearFilter;
    return tex;
  }, [category]);

  const pagesWidth = width - 0.015;
  const pagesDepth = 0.33;
  const pagesHeight = 0.038;

  return (
    <group
      ref={groupRef}
      position={[index * 0.02, 0.04 + index * 0.05, 0]}
    >
      {/* Pages block — revealed when cover opens */}
      <mesh castShadow>
        <boxGeometry args={[pagesWidth, pagesHeight, pagesDepth]} />
        <meshStandardMaterial color="#F5F0E8" roughness={0.8} />
      </mesh>

      {/* Top page with skill text (always present, covered by the cover when closed) */}
      <mesh
        position={[0, pagesHeight / 2 + 0.001, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <planeGeometry args={[pagesWidth - 0.02, pagesDepth - 0.03]} />
        <meshStandardMaterial
          map={pageTexture}
          roughness={0.5}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Cover — pivoted at left spine edge, rotates around Z */}
      <group ref={coverPivotRef} position={[-width / 2, 0, 0]}>
        {/* Cover box offset so its left edge sits at pivot origin */}
        <mesh position={[width / 2, 0, 0]} castShadow>
          <boxGeometry args={[width, 0.045, 0.35]} />
          <meshStandardMaterial color={color} roughness={0.7} />
        </mesh>

        {/* Inner face of cover (visible when swung open) */}
        <mesh
          position={[width / 2, -0.023, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
        >
          <planeGeometry args={[width - 0.02, 0.33]} />
          <meshStandardMaterial
            color={category.color}
            roughness={0.4}
            side={THREE.DoubleSide}
          />
        </mesh>
      </group>

      {/* Invisible hit-target for pointer events */}
      <mesh
        position={[0, 0.025, 0]}
        onPointerOver={(e) => {
          e.stopPropagation();
          setIsHovered(true);
        }}
        onPointerOut={() => setIsHovered(false)}
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen((prev) => !prev);
        }}
      >
        <boxGeometry args={[width + 0.04, 0.06, 0.37]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>
    </group>
  );
}

function InteractiveBooks() {
  const bookColors = ["#8B4513", "#1E3A5F", "#5B2C6F", "#7B241C"];
  const bookWidths = [0.25, 0.2, 0.22, 0.18];

  return (
    <group position={[1.1, 0.79, -0.45]}>
      {bookColors.map((color, i) => (
        <Book
          key={i}
          color={color}
          width={bookWidths[i]}
          index={i}
          category={SKILL_CATEGORIES[i]}
        />
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
// Office Chair
// ---------------------------------------------------------------------------
function Chair() {
  return (
    <group position={[2.8, 0, 1.8]} rotation={[0, Math.PI * 0.7, 0]}>
      {/* Seat */}
      <mesh position={[0, 0.55, 0]} castShadow>
        <boxGeometry args={[0.55, 0.06, 0.5]} />
        {MAT.fabric("#2D3748")}
      </mesh>
      {/* Backrest */}
      <mesh position={[0, 0.85, -0.22]} rotation={[0.1, 0, 0]} castShadow>
        <boxGeometry args={[0.52, 0.55, 0.05]} />
        {MAT.fabric("#2D3748")}
      </mesh>
      {/* Armrests */}
      {[-0.3, 0.3].map((x, i) => (
        <group key={i}>
          {/* Armrest pad */}
          <mesh position={[x, 0.68, 0.05]} castShadow>
            <boxGeometry args={[0.06, 0.03, 0.25]} />
            {MAT.plastic("#3A3A3A")}
          </mesh>
          {/* Armrest support */}
          <mesh position={[x, 0.6, -0.05]}>
            <boxGeometry args={[0.04, 0.12, 0.04]} />
            {MAT.metal("#444")}
          </mesh>
        </group>
      ))}
      {/* Central column */}
      <mesh position={[0, 0.35, 0]}>
        <cylinderGeometry args={[0.03, 0.03, 0.25, 8]} />
        {MAT.metal("#444")}
      </mesh>
      {/* Gas lift cover */}
      <mesh position={[0, 0.5, 0]}>
        <cylinderGeometry args={[0.04, 0.03, 0.08, 8]} />
        {MAT.metal("#333")}
      </mesh>
      {/* Base star */}
      {[0, 1, 2, 3, 4].map((i) => {
        const angle = (i / 5) * Math.PI * 2;
        return (
          <mesh key={i} position={[Math.sin(angle) * 0.22, 0.15, Math.cos(angle) * 0.22]} rotation={[0, -angle, 0]}>
            <boxGeometry args={[0.04, 0.03, 0.3]} />
            {MAT.metal("#444")}
          </mesh>
        );
      })}
      {/* Wheels */}
      {[0, 1, 2, 3, 4].map((i) => {
        const angle = (i / 5) * Math.PI * 2;
        return (
          <mesh key={`w${i}`} position={[Math.sin(angle) * 0.38, 0.06, Math.cos(angle) * 0.38]}>
            <sphereGeometry args={[0.03, 6, 6]} />
            {MAT.plastic("#222")}
          </mesh>
        );
      })}
    </group>
  );
}

// ---------------------------------------------------------------------------
// Rug
// ---------------------------------------------------------------------------
function Rug() {
  return (
    <group>
      <mesh position={[0, 0.005, 0.6]} rotation={[-Math.PI / 2, 0, 0.1]} receiveShadow>
        <planeGeometry args={[3.5, 2.5]} />
        <meshStandardMaterial color="#2A1F3D" roughness={0.95} metalness={0} />
      </mesh>
      {/* Rug border */}
      <mesh position={[0, 0.006, 0.6]} rotation={[-Math.PI / 2, 0, 0.1]}>
        <planeGeometry args={[3.6, 2.6]} />
        <meshStandardMaterial color="#3B2D50" roughness={0.9} metalness={0} />
      </mesh>
      {/* Rug inner pattern */}
      <mesh position={[0, 0.007, 0.6]} rotation={[-Math.PI / 2, 0, 0.1]}>
        <planeGeometry args={[2.8, 1.8]} />
        <meshStandardMaterial color="#33244A" roughness={0.9} metalness={0} />
      </mesh>
    </group>
  );
}

// ---------------------------------------------------------------------------
// Ruby Logo Frame on Wall
// ---------------------------------------------------------------------------
function RubyFrame() {
  return (
    <group position={[0, 2.6, -1.5]} rotation={[0, 0, 0]}>
      {/* Frame outer */}
      <mesh castShadow>
        <boxGeometry args={[1.2, 1.2, 0.06]} />
        <meshStandardMaterial color="#3E2723" roughness={0.7} metalness={0.05} />
      </mesh>
      {/* Frame inner (matte) */}
      <mesh position={[0, 0, 0.035]}>
        <boxGeometry args={[1.0, 1.0, 0.01]} />
        <meshStandardMaterial color="#1e1e35" roughness={0.9} />
      </mesh>
      {/* Ruby gem — diamond shape */}
      <group position={[0, 0.05, 0.05]}>
        {/* Top facet (lighter) */}
        <mesh position={[0, 0.1, 0]}>
          <planeGeometry args={[0.35, 0.2]} />
          <meshStandardMaterial color="#CC342D" roughness={0.2} metalness={0.3} side={THREE.DoubleSide} />
        </mesh>
        {/* Bottom left facet (darker) */}
        <mesh position={[-0.09, -0.05, 0]} rotation={[0, 0, 0.15]}>
          <planeGeometry args={[0.2, 0.3]} />
          <meshStandardMaterial color="#9B1B12" roughness={0.2} metalness={0.3} side={THREE.DoubleSide} />
        </mesh>
        {/* Bottom right facet (medium) */}
        <mesh position={[0.09, -0.05, 0]} rotation={[0, 0, -0.15]}>
          <planeGeometry args={[0.2, 0.3]} />
          <meshStandardMaterial color="#B5221B" roughness={0.2} metalness={0.3} side={THREE.DoubleSide} />
        </mesh>
        {/* Outline glow */}
        <mesh>
          <ringGeometry args={[0.38, 0.42, 6]} />
          <meshBasicMaterial color="#CC342D" transparent opacity={0.15} side={THREE.DoubleSide} />
        </mesh>
      </group>
      {/* "Ruby" text */}
      <mesh position={[0, -0.35, 0.05]}>
        <planeGeometry args={[0.5, 0.12]} />
        <meshStandardMaterial color="#CC342D" emissive="#CC342D" emissiveIntensity={0.15} roughness={0.8} />
      </mesh>
      {/* Point light on frame — boosted for visibility from camera */}
      <pointLight position={[0, 0, 0.5]} color="#CC342D" intensity={1.0} distance={3} decay={2} />
    </group>
  );
}

// ---------------------------------------------------------------------------
// Floor
// ---------------------------------------------------------------------------
function Floor() {
  return (
    <group position={[0, -0.01, 0]}>
      {/* Floor plane */}
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[12, 12]} />
        <meshStandardMaterial color="#12121f" roughness={0.95} metalness={0} />
      </mesh>
      {/* Grid overlay */}
      <gridHelper args={[12, 24, "#1E1E3A", "#16162A"]} position={[0, 0.001, 0]} />
    </group>
  );
}

// ---------------------------------------------------------------------------
// Back Wall — far behind desk, acts as room backdrop
// ---------------------------------------------------------------------------
function BackWall() {
  return (
    <group position={[0, 3, -4]}>
      {/* Main wall */}
      <mesh>
        <planeGeometry args={[14, 8]} />
        <meshStandardMaterial color="#13131f" roughness={0.95} metalness={0} />
      </mesh>
      {/* Subtle warm bounce at desk level */}
      <mesh position={[0, -1.5, 0.01]}>
        <planeGeometry args={[6, 1]} />
        <meshStandardMaterial
          color="#1A1828"
          emissive="#FFE0A0"
          emissiveIntensity={0.02}
          roughness={1}
          transparent
          opacity={0.3}
        />
      </mesh>
    </group>
  );
}

// ---------------------------------------------------------------------------
// Lights — bright cinematic 3-point for dark scene visibility
// ---------------------------------------------------------------------------
function Lights() {
  return (
    <>
      {/* Ambient — strong enough to see everything */}
      <ambientLight intensity={0.35} color="#D0D8E8" />

      {/* KEY LIGHT — warm spot from upper-right, hitting monitor + desk */}
      <spotLight
        position={[3, 5, 3]}
        angle={0.6}
        penumbra={0.5}
        intensity={3.0}
        color="#FFE0B0"
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-bias={-0.0005}
      />

      {/* FILL — cool, from left, balances key */}
      <directionalLight
        position={[-4, 3, 2]}
        intensity={0.5}
        color="#A8BEE0"
      />

      {/* RIM — from behind desk, creates edge glow on monitor bezel */}
      <directionalLight
        position={[0, 2.5, -4]}
        intensity={0.6}
        color="#D0E0FF"
      />

      {/* FRONT FILL — low, from viewer direction, lifts desk surface */}
      <directionalLight
        position={[1, 1.5, 5]}
        intensity={0.35}
        color="#E8E0D0"
      />

      {/* ACCENT — indigo identity bounce */}
      <pointLight
        position={[1.5, 0.5, 1.5]}
        intensity={0.8}
        color="#6366f1"
        distance={6}
        decay={2}
      />

      {/* Desk lamp practical — warm pool */}
      <pointLight
        position={[-1.3, 1.8, -0.3]}
        intensity={0.5}
        color="#FFE0A0"
        distance={4}
        decay={2}
      />
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
  // Only auto-rotate when at the very top (progress ≈ 0)
  const autoRotate = scrollProgress < 0.03;

  return (
    <>
      <PerformanceMonitor onDecline={handleDecline} onIncline={handleIncline} />

      {/* Background + Fog */}
      <color attach="background" args={["#0a0a12"]} />
      <fog attach="fog" args={["#0a0a12", 6, 22]} />

      <DiveCamera scrollProgress={scrollProgress} />
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        enableRotate={scrollProgress < 0.05}
        maxPolarAngle={Math.PI / 2}
        minPolarAngle={Math.PI / 6}
        autoRotate={autoRotate}
        autoRotateSpeed={0.15}
        enableDamping
        dampingFactor={0.05}
        target={[0, 1.5, -0.3]}
      />

      <Lights />
      <Floor />
      <BackWall />

      {/* Desk setup */}
      <Chair />
      <Rug />
      <RubyFrame />
      <InteractiveDesk />
      <Monitor scrollProgress={scrollProgress} />
      <SecondMonitor scrollProgress={scrollProgress} />
      <Keyboard />
      <Mouse />
      <CoffeeMachine />
      <DeskLamp />
      <InteractiveBooks />
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
        toneMappingExposure: 1.6,
      }}
      camera={{ position: [3.5, 2.5, 3.0], fov: 38, near: 0.1, far: 100 }}
      performance={{ min: 0.5 }}
    >
      <SceneContent tier={tier} scrollProgress={scrollProgress} />
    </Canvas>
  );
}
