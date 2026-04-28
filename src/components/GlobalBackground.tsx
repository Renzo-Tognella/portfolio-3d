"use client";

export function GlobalBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {/* Base — warm dark void */}
      <div className="absolute inset-0 bg-[#08080c]" />

      {/* Orb 1 — top-left, indigo-violet */}
      <div
        className="absolute -top-[20%] -left-[10%] h-[70vh] w-[70vh] rounded-full blur-[140px]"
        style={{ background: "#4338ca", opacity: 0.04 }}
      />

      {/* Orb 2 — center-right, cyan-teal */}
      <div
        className="absolute top-[35%] -right-[15%] h-[60vh] w-[60vh] rounded-full blur-[140px]"
        style={{ background: "#0e7490", opacity: 0.035 }}
      />

      {/* Orb 3 — bottom-left, subtle amber */}
      <div
        className="absolute -bottom-[15%] left-[20%] h-[55vh] w-[55vh] rounded-full blur-[140px]"
        style={{ background: "#92400e", opacity: 0.025 }}
      />

      {/* Orb 4 — mid-left, deep rose */}
      <div
        className="absolute top-[55%] -left-[5%] h-[50vh] w-[50vh] rounded-full blur-[140px]"
        style={{ background: "#be123c", opacity: 0.02 }}
      />

      {/* Noise texture overlay for cohesion */}
      <div
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />
    </div>
  );
}
