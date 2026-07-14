import { useEffect, useRef, useState } from "react";

export function HeartCursor() {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [hearts, setHearts] = useState<{ id: number; x: number; y: number }[]>([]);
  const idRef = useRef(0);
  const lastSpawn = useRef(0);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });
      const now = Date.now();
      if (now - lastSpawn.current > 90) {
        lastSpawn.current = now;
        const id = idRef.current++;
        setHearts((h) => [...h.slice(-14), { id, x: e.clientX, y: e.clientY }]);
        setTimeout(() => setHearts((h) => h.filter((p) => p.id !== id)), 1200);
      }
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <>
      <div
        className="pointer-events-none fixed z-[100] -translate-x-1/2 -translate-y-1/2 transition-transform duration-100"
        style={{ left: pos.x, top: pos.y }}
      >
        <div className="h-6 w-6 rounded-full border-2 border-white/70 shadow-[0_0_20px_rgba(255,180,220,0.8)]" />
      </div>
      {hearts.map((h) => (
        <div
          key={h.id}
          className="pointer-events-none fixed z-[99] text-pink-400"
          style={{
            left: h.x,
            top: h.y,
            animation: "float-slow 1.2s ease-out forwards",
            opacity: 0.9,
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 21s-7-4.35-9.5-8.5C.5 8.5 3 4 7 4c2 0 3.5 1 5 3 1.5-2 3-3 5-3 4 0 6.5 4.5 4.5 8.5C19 16.65 12 21 12 21z" />
          </svg>
        </div>
      ))}
    </>
  );
}
