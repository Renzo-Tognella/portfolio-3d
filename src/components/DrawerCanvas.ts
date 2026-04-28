"use client";

import { useStaticCanvasTexture } from "@/hooks/useCanvasTexture";

interface DrawerProject {
  title: string;
  tech: string;
  color: string;
}

/* ────────────────────────────────────────────
   Hook: generates a CanvasTexture for drawer face labels
   ──────────────────────────────────────────── */

export function useDrawerTexture(project: DrawerProject) {
  const texture = useStaticCanvasTexture(
    512,
    256,
    (ctx, canvas) => {
      const W = canvas.width;
      const H = canvas.height;

      // Background
      ctx.fillStyle = "#0f0f1a";
      ctx.fillRect(0, 0, W, H);

      // Title
      ctx.fillStyle = project.color;
      ctx.font = "bold 36px monospace";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(project.title, W / 2, H / 2 - 16);

      // Tech line
      ctx.fillStyle = "#94a3b8";
      ctx.font = "16px monospace";
      ctx.fillText(project.tech, W / 2, H / 2 + 22);
    },
    [project.title, project.tech, project.color]
  );

  return texture;
}
