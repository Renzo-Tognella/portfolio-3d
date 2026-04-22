"use client";

import dynamic from "next/dynamic";
import { useState, useEffect, useRef, Component } from "react";
import type { ReactNode } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register GSAP plugins once
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

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

// ---------------------------------------------------------------------------
// Device tier detection (unchanged)
// ---------------------------------------------------------------------------
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

// ---------------------------------------------------------------------------
// Static fallback when WebGL is unavailable
// ---------------------------------------------------------------------------
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

// ---------------------------------------------------------------------------
// Hero — GSAP ScrollTrigger "Dive Into Screen" scroll infrastructure
// ---------------------------------------------------------------------------
export function Hero() {
  const tier = useDeviceTier();
  const [mounted, setMounted] = useState(false);

  // Ref-driven scroll progress — GSAP writes here on every scroll tick.
  // This is the canonical progress value; no React re-render per tick.
  const progressRef = useRef(0);

  // Synced state for Scene3D's number prop (Phase 1 bridge).
  // Updated via rAF loop — capped at 60fps, avoids excessive re-renders.
  const [scrollProgress, setScrollProgress] = useState(0);
  const rafIdRef = useRef(0);
  const lastSyncedRef = useRef(0);

  // DOM refs for GSAP targeting
  const heroSectionRef = useRef<HTMLElement>(null);
  const canvasWrapperRef = useRef<HTMLDivElement>(null);
  const textOverlayRef = useRef<HTMLDivElement>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);

  // Force a single re-render after mount so Scene3D hydrates correctly
  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // rAF loop: sync progressRef → scrollProgress state at ~60fps
  // Only triggers setState when value actually changes (throttled by rAF)
  useEffect(() => {
    if (!mounted) return;

    const sync = () => {
      const current = progressRef.current;
      // Only update state if value changed beyond floating-point noise
      if (Math.abs(current - lastSyncedRef.current) > 0.0005) {
        lastSyncedRef.current = current;
        setScrollProgress(current);
      }
      rafIdRef.current = requestAnimationFrame(sync);
    };

    rafIdRef.current = requestAnimationFrame(sync);
    return () => cancelAnimationFrame(rafIdRef.current);
  }, [mounted]);

  // -----------------------------------------------------------------------
  // GSAP ScrollTrigger setup
  //
  // Layout:
  //   <section ref={heroSectionRef}>   ← position: relative
  //     <div className="h-[400vh]">    ← tall scroll spacer
  //       <div ref={canvasWrapperRef}> ← position: sticky; top: 0; h-screen
  //         <Canvas />                 ← fills sticky container
  //       </div>
  //     </div>
  //   </section>
  //   <About />                        ← normal section below
  //
  // ScrollTrigger is attached to the spacer. As the user scrolls through
  // 400 vh of space, progressRef animates from 0 → 1.
  //
  // Side-effects driven by progress:
  //   • Text overlay:     fades out at 0–25% progress
  //   • Scroll indicator: fades out at 0–12% progress
  //   • Canvas wrapper:   fades to 0.15 opacity at 85–100% progress
  // -----------------------------------------------------------------------
  useGSAP(
    () => {
      if (!heroSectionRef.current || !canvasWrapperRef.current) return;

      const spacer = heroSectionRef.current.querySelector<HTMLElement>(
        "[data-scroll-spacer]"
      );
      if (!spacer) return;

      // Main scroll progress timeline (0 → 1 over the full spacer height)
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: spacer,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.5, // smooth 0.5s lag
          onUpdate: (self) => {
            progressRef.current = self.progress;
          },
        },
      });

      // Canvas wrapper fade-out near end of animation (85% → 100%)
      if (canvasWrapperRef.current) {
        gsap.to(canvasWrapperRef.current, {
          opacity: 0.15,
          ease: "none",
          scrollTrigger: {
            trigger: spacer,
            start: "85% top",
            end: "bottom bottom",
            scrub: 0.5,
          },
        });
      }

      // Text overlay: fade out over first 25% of scroll
      if (textOverlayRef.current) {
        gsap.to(textOverlayRef.current, {
          opacity: 0,
          ease: "power2.in",
          scrollTrigger: {
            trigger: spacer,
            start: "top top",
            end: "25% top",
            scrub: 0.3,
          },
        });
      }

      // Scroll indicator: fade out very quickly (first 12%)
      if (scrollIndicatorRef.current) {
        gsap.to(scrollIndicatorRef.current, {
          opacity: 0,
          ease: "power2.in",
          scrollTrigger: {
            trigger: spacer,
            start: "top top",
            end: "12% top",
            scrub: 0.2,
          },
        });
      }
    },
    {
      scope: heroSectionRef,
      dependencies: [mounted], // re-run after mount so DOM is ready
    }
  );

  // -----------------------------------------------------------------------
  // Early-exit states
  // -----------------------------------------------------------------------
  if (!mounted) return <HeroSkeleton />;
  if (tier === "none") return <StaticHero />;

  // -----------------------------------------------------------------------
  // Render
  // -----------------------------------------------------------------------
  return (
    <section
      id="hero"
      ref={heroSectionRef}
      className="relative w-full"
    >
      {/* Tall scroll spacer — GSAP ScrollTrigger tracks this */}
      <div data-scroll-spacer className="relative h-[400vh]">
        {/* Sticky canvas container — stays fixed in viewport while spacer scrolls */}
        <div
          ref={canvasWrapperRef}
          className="sticky top-0 h-screen w-full"
          style={{ opacity: 1 }}
        >
          <SceneErrorBoundary fallback={<StaticHero />}>
            <Scene3D tier={tier} scrollProgress={scrollProgress} />
          </SceneErrorBoundary>

          {/* Text overlay — fades out during 0–25% scroll */}
          <div
            ref={textOverlayRef}
            className="pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-center"
            style={{ opacity: 1 }}
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

          {/* Scroll indicator — fades out during 0–12% scroll */}
          <div
            ref={scrollIndicatorRef}
            className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2"
            style={{ opacity: 1 }}
          >
            <div className="flex flex-col items-center gap-2">
              <span className="text-xs text-muted">scroll</span>
              <div className="h-8 w-[1px] bg-gradient-to-b from-accent to-transparent animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
