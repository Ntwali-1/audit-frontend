import React from "react";
import { cn } from "@/lib/utils";

interface SpinnerProps extends React.ComponentProps<"div"> {
  size?: number;
  invert?: boolean;
  disabled?: boolean;
}

export function Spinner({ size = 16, invert, disabled, className, ...props }: SpinnerProps) {
  if (disabled) return null;
  const sizePx = `${size}px`;
  const barWidth = `${(size * 0.2).toFixed(2)}px`;
  const barHeight = `${(size * 0.075).toFixed(2)}px`;

  return (
    <div
      className={cn("relative inline-block", className)}
      style={{ width: sizePx, height: sizePx }}
      {...props}
    >
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className="absolute left-1/2 top-1/2"
          style={{
            width: barWidth,
            height: barHeight,
            transform: `translate(-50%, -50%) rotate(${i * 72}deg) translateY(-${size * 0.35}px)`,
            transformOrigin: "center",
            animation: `spinner-fade 1s linear infinite`,
            animationDelay: `${i * 0.2}s`,
            background: invert ? "var(--background)" : "var(--primary)",
            borderRadius: "9999px",
          }}
        />
      ))}
      <style>{`@keyframes spinner-fade { 0%, 100% { opacity: 0.15 } 40% { opacity: 1 } }`}</style>
    </div>
  );
}

export function FullPageLoader({ label }: { label?: string }) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
      <Spinner size={48} />
      {label && <p className="text-sm text-muted-foreground">{label}</p>}
    </div>
  );
}
