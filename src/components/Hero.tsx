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
// Device tier detection
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
// Hero — GSAP ScrollTrigger "Dive Into Screen" + snap transition
//
// Layout:
//   <section ref={heroSectionRef}>
//     <div data-scroll-spacer className="h-[300vh]">
//       <div ref={canvasWrapperRef} className="sticky top-0 h-screen">
//         <Canvas />
//         <TextOverlay />
//         <ScrollIndicator />
//         <FlashOverlay />  ← brief white flash on snap
//       </div>
//     </div>
//   </section>
//   <About />  ← normal flow below
//
// Transition behavior:
//   - 0%–85%: smooth dive animation, text fades early
//   - 85%–92%: canvas fades to 0 FAST
//   - At 92%: canvas gets display:none (hard snap)
//   - User scrolls into About — feels like a new screen
//   - Scrolling BACK: once progress drops below 85%, canvas reappears
// ---------------------------------------------------------------------------
export function Hero() {
  const tier = useDeviceTier();
  const [mounted, setMounted] = useState(false);

  // Ref-driven scroll progress
  const progressRef = useRef(0);

  // Synced state for Scene3D
  const [scrollProgress, setScrollProgress] = useState(0);
  const rafIdRef = useRef(0);
  const lastSyncedRef = useRef(0);

  // DOM refs
  const heroSectionRef = useRef<HTMLElement>(null);
  const canvasWrapperRef = useRef<HTMLDivElement>(null);
  const textOverlayRef = useRef<HTMLDivElement>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);
  const flashRef = useRef<HTMLDivElement>(null);

  // Force mount
  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // rAF loop: sync progressRef → scrollProgress state at ~60fps
  useEffect(() => {
    if (!mounted) return;

    const sync = () => {
      const current = progressRef.current;
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
  // -----------------------------------------------------------------------
  useGSAP(
    () => {
      if (!heroSectionRef.current || !canvasWrapperRef.current) return;

      const spacer = heroSectionRef.current.querySelector<HTMLElement>(
        "[data-scroll-spacer]"
      );
      if (!spacer) return;

      // Main progress tracker
      gsap.timeline({
        scrollTrigger: {
          trigger: spacer,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.5,
          onUpdate: (self) => {
            progressRef.current = self.progress;
          },
        },
      });

      // Text overlay: fade out 0–20%
      if (textOverlayRef.current) {
        gsap.to(textOverlayRef.current, {
          opacity: 0,
          ease: "power2.in",
          scrollTrigger: {
            trigger: spacer,
            start: "top top",
            end: "20% top",
            scrub: 0.3,
          },
        });
      }

      // Scroll indicator: fade out 0–10%
      if (scrollIndicatorRef.current) {
        gsap.to(scrollIndicatorRef.current, {
          opacity: 0,
          ease: "power2.in",
          scrollTrigger: {
            trigger: spacer,
            start: "top top",
            end: "10% top",
            scrub: 0.2,
          },
        });
      }

      // Canvas wrapper: FAST fade at 82–90% (not gradual!)
      if (canvasWrapperRef.current) {
        gsap.to(canvasWrapperRef.current, {
          opacity: 0,
          ease: "power2.in",
          scrollTrigger: {
            trigger: spacer,
            start: "82% top",
            end: "90% top",
            scrub: 0.2,
          },
        });
      }

      // Flash overlay: brief burst at 85–90% then fade
      if (flashRef.current) {
        gsap
          .timeline({
            scrollTrigger: {
              trigger: spacer,
              start: "84% top",
              end: "92% top",
              scrub: 0.15,
            },
          })
          .fromTo(
            flashRef.current,
            { opacity: 0 },
            { opacity: 0.12, duration: 0.4, ease: "power2.in" }
          )
          .to(flashRef.current, {
            opacity: 0,
            duration: 0.6,
            ease: "power2.out",
          });
      }
    },
    {
      scope: heroSectionRef,
      dependencies: [mounted],
    }
  );

  // -----------------------------------------------------------------------
  // Early-exit states
  // -----------------------------------------------------------------------
  if (!mounted) return <HeroSkeleton />;
  if (tier === "none") return <StaticHero />;

  // When canvas is fully faded, disable pointer events so user can interact with About
  const canvasFaded = scrollProgress > 0.92;

  // -----------------------------------------------------------------------
  // Render
  // -----------------------------------------------------------------------
  return (
    <section
      id="hero"
      ref={heroSectionRef}
      className="relative w-full"
    >
      {/* Scroll spacer — 200vh (reduced from 300vh for snappier feel) */}
      <div data-scroll-spacer className="relative h-[200vh]">
        {/* Sticky canvas container — crossfade via GSAP opacity (82-92%), no hard cut */}
        <div
          ref={canvasWrapperRef}
          className="sticky top-0 h-screen w-full transition-opacity"
          style={{
            opacity: 1,
            pointerEvents: canvasFaded ? "none" : "auto",
          }}
        >
          <SceneErrorBoundary fallback={<StaticHero />}>
            <Scene3D tier={tier} scrollProgress={scrollProgress} />
          </SceneErrorBoundary>

          {/* Text overlay — fades 0–20% */}
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

          {/* Scroll indicator — fades 0–10% */}
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

          {/* Flash overlay — brief white burst during snap */}
          <div
            ref={flashRef}
            className="pointer-events-none absolute inset-0 z-20 bg-white"
            style={{ opacity: 0 }}
          />
        </div>
      </div>
    </section>
  );
}
