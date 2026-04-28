"use client";

import { useRef, useEffect, useCallback } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

/**
 * Hook that creates a THREE.CanvasTexture from a 2D canvas.
 * The `draw` callback is executed every frame (useFrame) so the texture stays
 * in sync with reactive values (scrollProgress, etc.).
 *
 * Usage:
 *   const texture = useCanvasTexture(1920, 1080, (ctx, canvas) => {
 *     ctx.fillStyle = "#000";
 *     ctx.fillRect(0, 0, canvas.width, canvas.height);
 *     ctx.fillStyle = "#fff";
 *     ctx.fillText("Hello", 100, 100);
 *   });
 */
export function useCanvasTexture(
  width: number,
  height: number,
  draw: (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => void
) {
  const textureRef = useRef<THREE.CanvasTexture | null>(null);
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

    textureRef.current = tex;

    return () => {
      tex.dispose();
      textureRef.current = null;
    };
  }, [width, height]);

  // Redraw every frame
  useFrame(() => {
    const tex = textureRef.current;
    if (!tex) return;

    const canvas = tex.image as HTMLCanvasElement;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    drawRef.current(ctx, canvas);
    tex.needsUpdate = true;
  });

  return textureRef;
}

/**
 * Static version — draws only when deps change.
 * Use this for content that does NOT animate every frame.
 */
export function useStaticCanvasTexture(
  width: number,
  height: number,
  draw: (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => void,
  deps: React.DependencyList = []
) {
  const textureRef = useRef<THREE.CanvasTexture | null>(null);

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

    textureRef.current = tex;

    return () => {
      tex.dispose();
      textureRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [width, height, ...deps]);

  return textureRef;
}
