"use client";

import { useRef, useEffect, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

/**
 * Hook that creates a THREE.CanvasTexture from a 2D canvas.
 * The `draw` callback is executed every frame (useFrame) so the texture stays
 * in sync with reactive values (scrollProgress, etc.).
 *
 * Usage:
 *   const texture = useCanvasTexture(1920, 1080, (ctx, canvas) => { ... });
 */
export function useCanvasTexture(
  width: number,
  height: number,
  draw: (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => void
) {
  const [texture, setTexture] = useState<THREE.CanvasTexture | null>(null);
  const drawRef = useRef(draw);

  // Keep draw callback fresh without recreating the texture
  useEffect(() => {
    drawRef.current = draw;
  }, [draw]);

  // Create texture once
  useEffect(() => {
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;

    const tex = new THREE.CanvasTexture(canvas);
    tex.minFilter = THREE.LinearFilter;
    tex.magFilter = THREE.LinearFilter;
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = 16;
    tex.generateMipmaps = false;

    setTexture(tex);

    return () => {
      tex.dispose();
      setTexture(null);
    };
  }, [width, height]);

  // Redraw every frame
  useFrame(() => {
    if (!texture) return;

    const canvas = texture.image as HTMLCanvasElement;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    drawRef.current(ctx, canvas);
    texture.needsUpdate = true;
  });

  return texture;
}

/**
 * Static version — draws only when deps change.
 * Use this for content that does NOT animate every frame.
 * Returns a THREE.CanvasTexture (not a ref) so React re-renders when ready.
 */
export function useStaticCanvasTexture(
  width: number,
  height: number,
  draw: (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => void,
  deps: React.DependencyList = []
) {
  const [texture, setTexture] = useState<THREE.CanvasTexture | null>(null);

  useEffect(() => {
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    draw(ctx, canvas);

    const tex = new THREE.CanvasTexture(canvas);
    tex.minFilter = THREE.LinearFilter;
    tex.magFilter = THREE.LinearFilter;
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = 16;
    tex.generateMipmaps = false;

    setTexture(tex);

    return () => {
      tex.dispose();
      setTexture(null);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [width, height, ...deps]);

  return texture;
}
