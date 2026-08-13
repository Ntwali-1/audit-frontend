import * as React from "react";

export function LogoIcon({ className, size = 32 }: { className?: string; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        {/* $50k Platinum/Chrome metallic gradients with high contrast */}
        <linearGradient id="facet-light" x1="30" y1="20" x2="70" y2="80" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="40%" stopColor="#F4F4F5" />
          <stop offset="100%" stopColor="#D4D4D8" />
        </linearGradient>

        <linearGradient id="facet-medium" x1="30" y1="20" x2="70" y2="80" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#E4E4E7" />
          <stop offset="100%" stopColor="#A1A1A6" />
        </linearGradient>

        <linearGradient id="facet-dark" x1="30" y1="20" x2="70" y2="80" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#27272A" />
          <stop offset="100%" stopColor="#09090B" />
        </linearGradient>

        <linearGradient id="glow-grad" x1="50" y1="0" x2="50" y2="100" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.0" />
        </linearGradient>

        {/* High-end ambient occlusion drop shadow */}
        <filter id="premium-shadow" x="-20%" y="-20%" width="140%" height="140%" filterUnits="userSpaceOnUse">
          <feDropShadow dx="0" dy="6" stdDeviation="6" floodColor="#000000" floodOpacity="0.4" />
          <feDropShadow dx="0" dy="1" stdDeviation="2" floodColor="#000000" floodOpacity="0.2" />
        </filter>
      </defs>

      {/* Abstract outer ring representing the compass frame (ultra-thin, elegant) */}
      <circle
        cx="50"
        cy="50"
        r="44"
        stroke="url(#glow-grad)"
        strokeWidth="1.5"
        strokeDasharray="4 2"
        opacity="0.4"
      />
      <circle
        cx="50"
        cy="50"
        r="44"
        stroke="#FFFFFF"
        strokeWidth="1"
        opacity="0.1"
      />

      {/* The 3D Faceted "Audit Compass" Emblem */}
      <g filter="url(#premium-shadow)">
        {/* Left Side / Back Facet (Dark obsidian) */}
        <path
          d="M 28 54 L 46 68 L 46 44 L 28 54 Z"
          fill="url(#facet-dark)"
        />
        
        {/* Bottom Right Facet (Medium Slate/Graphite) */}
        <path
          d="M 46 68 L 76 34 L 56 46 L 46 68 Z"
          fill="url(#facet-medium)"
        />

        {/* Top/Main Facet (Brilliant Chrome/Silver) */}
        {/* This forms the sharp upward pointing needle/checkmark */}
        <path
          d="M 46 44 L 76 34 L 56 46 L 46 44 Z"
          fill="url(#facet-light)"
        />

        {/* Center fold highlight (Razor-sharp line) */}
        <path
          d="M 46 68 L 56 46 L 76 34"
          stroke="#FFFFFF"
          strokeWidth="0.75"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.6"
        />
      </g>
    </svg>
  );
}

export function LogoWithText({ className, size = 32 }: { className?: string; size?: number }) {
  return (
    <div className={`flex items-center gap-3 ${className || ""}`}>
      <LogoIcon size={size} />
      <span className="font-display font-semibold text-white tracking-tight" style={{ fontSize: `${size * 0.47}px` }}>
        Auditly
      </span>
    </div>
  );
}
