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
        {/* Deep gold gradient for shield body */}
        <linearGradient id="shield-body-grad" x1="20" y1="20" x2="80" y2="80" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#E5C158" />
          <stop offset="50%" stopColor="#C59E3F" />
          <stop offset="100%" stopColor="#8F6B1E" />
        </linearGradient>

        {/* Light gold/cream gradient for shield highlight */}
        <linearGradient id="shield-highlight-grad" x1="50" y1="20" x2="80" y2="80" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFF2CC" />
          <stop offset="40%" stopColor="#F5D061" />
          <stop offset="100%" stopColor="#A8812F" />
        </linearGradient>

        {/* Outer orbital rings gradient */}
        <linearGradient id="orbit-grad-1" x1="10" y1="10" x2="90" y2="90" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFF2CC" stopOpacity="0.9" />
          <stop offset="35%" stopColor="#E5C158" />
          <stop offset="70%" stopColor="#8F6B1E" />
          <stop offset="100%" stopColor="#3D2C24" stopOpacity="0.8" />
        </linearGradient>

        {/* Checkmark gradient */}
        <linearGradient id="checkmark-grad" x1="30" y1="40" x2="75" y2="25" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFECA1" />
          <stop offset="50%" stopColor="#FCD14D" />
          <stop offset="100%" stopColor="#D4A325" />
        </linearGradient>
        
        {/* Subtle drop shadow */}
        <filter id="logo-shadow" x="-10%" y="-10%" width="120%" height="120%" filterUnits="userSpaceOnUse">
          <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#231510" floodOpacity="0.3" />
        </filter>
      </defs>

      {/* Orbit Rings (Spiral swirling paths) */}
      <path
        d="M 50 8 C 73.2 8, 92 26.8, 92 50 C 92 68.5, 80 84.2, 63 89.5 M 37 90.5 C 20.7 85.7, 8 70.8, 8 53 C 8 28.5, 26.5 10, 48 8.5"
        stroke="url(#orbit-grad-1)"
        strokeWidth="3.5"
        strokeLinecap="round"
        filter="url(#logo-shadow)"
      />
      
      <path
        d="M 50 16 C 68.8 16, 84 31.2, 84 50 C 84 63, 76.7 74.3, 66 80 M 34 80 C 22.8 74.3, 16 63, 16 50 C 16 33, 29 18.5, 45 16.5"
        stroke="url(#shield-body-grad)"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.85"
      />

      {/* Stylized Shield Container */}
      <g filter="url(#logo-shadow)">
        {/* Shield base outline */}
        <path
          d="M 50 22 C 60 22, 69.5 25.5, 71.5 35 C 72.5 52, 60.5 66.5, 50 71 C 39.5 66.5, 27.5 52, 28.5 35 C 30.5 25.5, 40 22, 50 22 Z"
          fill="url(#shield-body-grad)"
        />
        
        {/* Shield highlight right half split */}
        <path
          d="M 50 22 C 55 22, 69.5 25.5, 71.5 35 C 72.5 52, 60.5 66.5, 50 71 Z"
          fill="url(#shield-highlight-grad)"
          opacity="0.95"
        />

        {/* Shield inner border overlay */}
        <path
          d="M 50 26 C 58 26, 65.5 28.8, 67 36.5 C 67.8 49.5, 58.5 61, 50 65 M 50 26 C 42 26, 34.5 28.8, 33 36.5 C 32.2 49.5, 41.5 61, 50 65"
          stroke="#3D2C24"
          strokeWidth="1.2"
          strokeOpacity="0.25"
          fill="none"
        />
      </g>

      {/* Bold 3D Checkmark overlapping the shield */}
      <g filter="url(#logo-shadow)">
        {/* Checkmark Shadow/Outline base */}
        <path
          d="M 36 50 L 46 60 L 73 31 L 68 26 L 46 48 L 41 43 Z"
          fill="#3D2C24"
          opacity="0.3"
          transform="translate(1, 2)"
        />
        
        {/* Main Checkmark Body */}
        <path
          d="M 36 50 L 46 60 L 73 31 L 68 26 L 46 48 L 41 43 Z"
          fill="url(#checkmark-grad)"
          stroke="#3D2C24"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        
        {/* Checkmark inner lighting highlight */}
        <path
          d="M 37.5 49 L 46 57.5 L 71 30.5"
          stroke="#FFF9E6"
          strokeWidth="0.8"
          strokeLinecap="round"
          fill="none"
          opacity="0.8"
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
