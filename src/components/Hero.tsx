"use client";

import dynamic from "next/dynamic";
import { useState, useEffect, useRef, useCallback, Component } from "react";
import type { ReactNode } from "react";

// Lazy load the 3D scene — never SSR
const Scene3D = dynamic(() => import("@/components/Scene3D"), {
  ssr: false,
  loading: () => <HeroSkeleton />,
});

// ---------------------------------------------------------------------------
// Error Boundary for 3D scene crashes
// ---------------------------------------------------------------------------
class SceneErrorBoundary extends Component<
  { children: ReactNode; fallback: ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: ReactNode; fallback: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: unknown, info: unknown) {
    console.error("[Scene3D] Canvas crashed:", error, info);
  }

  render() {
    if (this.state.hasError) return this.props.fallback;
    return this.props.children;
  }
}

function HeroSkeleton() {
  return (
    <div className="flex h-full items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="h-12 w-12 animate-spin rounded-full border-2 border-accent border-t-transparent" />
        <p className="font-mono text-sm text-muted">Carregando cena 3D...</p>
      </div>
    </div>
  );
}

function useDeviceTier() {
  const [tier, setTier] = useState<"high" | "medium" | "low" | "none">("none");

  useEffect(() => {
    try {
      const canvas = document.createElement("canvas");
      const gl = canvas.getContext("webgl2") || canvas.getContext("webgl");

      if (!gl) {
        setTier("none");
        canvas.remove();
        return;
      }

      const isMobile = /Android|iPhone|iPad/i.test(navigator.userAgent);
      const debugInfo = gl.getExtension("WEBGL_debug_renderer_info");
      const renderer = debugInfo
        ? gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL)
        : "";

      const isLowEnd = /Mali-[TG]|Adreno [1-5]\d{0,2}|Intel.*HD Graphics/i.test(
        renderer
      );

      if (isMobile || isLowEnd) {
        setTier("low");
      } else if (renderer.includes("Intel")) {
        setTier("medium");
      } else {
        setTier("high");
      }

      canvas.remove();
    } catch {
      setTier("none");
    }
  }, []);

  return tier;
}

function useScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const windowH = window.innerHeight;
      const p = Math.min(scrollY / windowH, 1);
      setProgress(p);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return progress;
}

function StaticHero() {
  return (
    <div className="flex h-full items-center justify-center">
      <div className="text-center">
        <h1 className="text-5xl font-bold tracking-tight">
          Renzo<span className="text-accent">.</span>
        </h1>
        <p className="mt-3 text-lg text-muted">Software Engineer</p>
        <div className="mt-6 flex justify-center gap-4">
          <div className="h-2 w-2 rounded-full bg-accent animate-pulse" />
          <div className="h-2 w-2 rounded-full bg-accent-secondary animate-pulse [animation-delay:200ms]" />
          <div className="h-2 w-2 rounded-full bg-accent animate-pulse [animation-delay:400ms]" />
        </div>
      </div>
    </div>
  );
}

export function Hero() {
  const tier = useDeviceTier();
  const [mounted, setMounted] = useState(false);
  const scrollProgress = useScrollProgress();

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 100);
    return () => clearTimeout(timer);
  }, []);

  if (!mounted) return <HeroSkeleton />;
  if (tier === "none") return <StaticHero />;

  // Fade overlay text as user scrolls
  const textOpacity = Math.max(0, 1 - scrollProgress * 2);

  return (
    <section id="hero" className="relative h-screen w-full">
      <div className="absolute inset-0">
        <SceneErrorBoundary fallback={<StaticHero />}>
          <Scene3D tier={tier} scrollProgress={scrollProgress} />
        </SceneErrorBoundary>
      </div>

      {/* Overlay content — fades out on scroll */}
      <div
        className="relative z-10 flex h-full flex-col items-center justify-center pointer-events-none"
        style={{ opacity: textOpacity }}
      >
        <h1 className="text-5xl font-bold tracking-tight sm:text-7xl">
          Renzo<span className="text-accent">.</span>
        </h1>
        <p className="mt-4 text-lg text-muted sm:text-xl">
          Software Engineer
        </p>
        <p className="mt-2 font-mono text-sm text-muted/70">
          Construindo sistemas que escalam
        </p>
      </div>

      {/* Scroll indicator — fades out quickly */}
      <div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
        style={{ opacity: Math.max(0, 1 - scrollProgress * 4) }}
      >
        <div className="flex flex-col items-center gap-2">
          <span className="text-xs text-muted">scroll</span>
          <div className="h-8 w-[1px] bg-gradient-to-b from-accent to-transparent animate-pulse" />
        </div>
      </div>
    </section>
  );
}
