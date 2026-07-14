import { useMemo } from "react";

type Variant = "petals" | "fireflies" | "stars" | "butterflies" | "dust";

export function Particles({ variant = "petals", count = 30, className = "" }: { variant?: Variant; count?: number; className?: string }) {
  const items = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        top: Math.random() * 100,
        delay: Math.random() * 8,
        dur: 6 + Math.random() * 10,
        size: 0.6 + Math.random() * 1.2,
        hue: Math.floor(Math.random() * 60) + 320,
      })),
    [count, variant],
  );

  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`} aria-hidden>
      {items.map((it) => {
        if (variant === "petals")
          return (
            <div
              key={it.id}
              className="absolute"
              style={{
                left: `${it.left}%`,
                top: `-10%`,
                animation: `petal-fall ${it.dur}s linear ${it.delay}s infinite`,
                transform: `scale(${it.size})`,
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path d="M12 2c3 4 6 6 6 10a6 6 0 11-12 0c0-4 3-6 6-10z" fill={`oklch(0.88 0.1 ${it.hue})`} opacity="0.85" />
              </svg>
            </div>
          );
        if (variant === "fireflies")
          return (
            <div
              key={it.id}
              className="absolute h-2 w-2 rounded-full"
              style={{
                left: `${it.left}%`,
                top: `${it.top}%`,
                background: "radial-gradient(circle, oklch(0.95 0.15 90) 0%, oklch(0.85 0.18 80 / 0.3) 60%, transparent 100%)",
                boxShadow: "0 0 20px oklch(0.9 0.18 85 / 0.9), 0 0 40px oklch(0.85 0.2 75 / 0.5)",
                animation: `firefly ${it.dur}s ease-in-out ${it.delay}s infinite`,
              }}
            />
          );
        if (variant === "stars")
          return (
            <div
              key={it.id}
              className="absolute rounded-full bg-white"
              style={{
                left: `${it.left}%`,
                top: `${it.top}%`,
                width: `${it.size * 2}px`,
                height: `${it.size * 2}px`,
                boxShadow: `0 0 ${4 + it.size * 3}px white`,
                animation: `twinkle ${2 + it.dur * 0.3}s ease-in-out ${it.delay}s infinite`,
              }}
            />
          );
        if (variant === "butterflies")
          return (
            <div
              key={it.id}
              className="absolute"
              style={{
                left: `${it.left}%`,
                top: `${it.top}%`,
                animation: `firefly ${it.dur * 1.4}s ease-in-out ${it.delay}s infinite, float-slow ${it.dur}s ease-in-out ${it.delay}s infinite`,
              }}
            >
              <span style={{ fontSize: `${14 + it.size * 8}px`, filter: "drop-shadow(0 0 8px oklch(0.9 0.14 340 / 0.6))" }}>🦋</span>
            </div>
          );
        return (
          <div
            key={it.id}
            className="absolute h-1 w-1 rounded-full bg-white/40"
            style={{
              left: `${it.left}%`,
              top: `${it.top}%`,
              animation: `firefly ${it.dur}s ease-in-out ${it.delay}s infinite`,
            }}
          />
        );
      })}
    </div>
  );
}
