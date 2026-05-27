"use client";

import { MeshGradient } from "@paper-design/shaders-react";

interface ShaderBackgroundProps {
  className?: string;
  variant?: "warm" | "subtle" | "vivid";
}

const PRESETS = {
  warm: {
    colors: ["#644a40", "#ffdfb5", "#ffe6c4", "#f9f9f9"],
    speed: 0.3,
    distortion: 0.6,
    swirl: 0.4,
  },
  subtle: {
    colors: ["#f9f9f9", "#efefef", "#ffe6c4", "#d8d8d8"],
    speed: 0.15,
    distortion: 0.4,
    swirl: 0.2,
  },
  vivid: {
    colors: ["#582d1d", "#644a40", "#ffdfb5", "#ffe6c4"],
    speed: 0.5,
    distortion: 0.8,
    swirl: 0.6,
  },
};

export function ShaderBackground({ className = "", variant = "subtle" }: ShaderBackgroundProps) {
  const p = PRESETS[variant];
  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}>
      <MeshGradient
        colors={p.colors}
        speed={p.speed}
        distortion={p.distortion}
        swirl={p.swirl}
        style={{ width: "100%", height: "100%" }}
      />
    </div>
  );
}
