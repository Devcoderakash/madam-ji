import { AnimatePresence, motion, useAnimationControls } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const MESSAGES = [
  "🤭 Hehe... too slow!",
  "🌸 Catch me if you can!",
  "💖 Your heart already knows the answer.",
  "🐰 I think you're looking for the pink button.",
  "🦋 Oops... I'm a little shy today!",
  "🌷 Maybe isn't feeling brave enough.",
  "✨ Try the glowing one instead.",
  "💌 My butterflies won't let you press me.",
  "🌙 The answer is waiting right beside me.",
  "❤️ The pink button looks much happier.",
  "🥹 I'm too shy to be clicked.",
  "🌸 Wrong button, cutie!",
  "💞 I think \"Yes\" suits you better.",
  "✨ Your fairy tale starts with the other button.",
  "🎀 Just one click away... but not on me.",
];

type Trail = { id: number; x: number; y: number; kind: "heart" | "spark" | "fly" };
type Bubble = { id: number; x: number; y: number; text: string };

export function ShyMaybeButton({
  boundsRef,
  yesRef,
}: {
  boundsRef: React.RefObject<HTMLDivElement | null>;
  yesRef: React.RefObject<HTMLButtonElement | null>;
}) {
  const btnRef = useRef<HTMLButtonElement | null>(null);
  const controls = useAnimationControls();
  const posRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const [ready, setReady] = useState(false);
  const [trails, setTrails] = useState<Trail[]>([]);
  const [bubbles, setBubbles] = useState<Bubble[]>([]);
  const cooldownRef = useRef(0);
  const movingRef = useRef(false);
  const idRef = useRef(0);

  // Initialize position centered in the bounds, to the right of Yes.
  useEffect(() => {
    const bounds = boundsRef.current;
    const btn = btnRef.current;
    if (!bounds || !btn) return;
    const b = bounds.getBoundingClientRect();
    const bw = btn.offsetWidth;
    const bh = btn.offsetHeight;
    posRef.current = { x: b.width - bw - 16, y: (b.height - bh) / 2 };
    controls.set({ x: posRef.current.x, y: posRef.current.y, rotate: 0, scale: 1 });
    setReady(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const spawnBubble = (cx: number, cy: number) => {
    const id = ++idRef.current;
    const msg = MESSAGES[Math.floor(Math.random() * MESSAGES.length)];
    setBubbles((b) => [...b, { id, x: cx, y: cy, text: msg }]);
    setTimeout(() => setBubbles((b) => b.filter((x) => x.id !== id)), 1600);
  };

  const spawnTrail = (cx: number, cy: number) => {
    const kinds: Trail["kind"][] = ["heart", "spark", "spark", "fly"];
    const batch: Trail[] = [];
    for (let i = 0; i < 5; i++) {
      const id = ++idRef.current;
      batch.push({
        id,
        x: cx + (Math.random() - 0.5) * 40,
        y: cy + (Math.random() - 0.5) * 20,
        kind: kinds[Math.floor(Math.random() * kinds.length)],
      });
    }
    setTrails((t) => [...t, ...batch]);
    setTimeout(
      () => setTrails((t) => t.filter((x) => !batch.find((b) => b.id === x.id))),
      1400,
    );
  };

  const rectsOverlap = (a: DOMRect, b: DOMRect, pad = 12) =>
    !(
      a.right + pad < b.left ||
      a.left - pad > b.right ||
      a.bottom + pad < b.top ||
      a.top - pad > b.bottom
    );

  const pickNextPosition = () => {
    const bounds = boundsRef.current;
    const btn = btnRef.current;
    const yes = yesRef.current;
    if (!bounds || !btn) return null;
    const b = bounds.getBoundingClientRect();
    const bw = btn.offsetWidth;
    const bh = btn.offsetHeight;
    const yr = yes?.getBoundingClientRect();
    const cur = posRef.current;

    for (let i = 0; i < 24; i++) {
      const angle = Math.random() * Math.PI * 2;
      const dist = 20 + Math.random() * 20;
      let nx = cur.x + Math.cos(angle) * dist;
      let ny = cur.y + Math.sin(angle) * dist;
      nx = Math.max(6, Math.min(b.width - bw - 6, nx));
      ny = Math.max(6, Math.min(b.height - bh - 6, ny));

      if (yr) {
        const candidate = new DOMRect(b.left + nx, b.top + ny, bw, bh);
        if (rectsOverlap(candidate, yr, 14)) continue;
      }
      return { x: nx, y: ny };
    }
    return null;
  };

  const escape = async () => {
    if (movingRef.current) return;
    const now = performance.now();
    if (now - cooldownRef.current < 500) return;
    const next = pickNextPosition();
    if (!next) return;
    movingRef.current = true;
    cooldownRef.current = now;

    // Wiggle / blush pre-move
    await controls.start({
      scale: 0.96,
      rotate: [0, -3, 3, -2, 2, 0],
      transition: { duration: 0.2, ease: "easeOut" },
    });

    // Trails + bubble at current position (bounds-space)
    const btn = btnRef.current;
    const bounds = boundsRef.current;
    if (btn && bounds) {
      const r = btn.getBoundingClientRect();
      const br = bounds.getBoundingClientRect();
      const cx = r.left - br.left + r.width / 2;
      const cy = r.top - br.top + r.height / 2;
      spawnTrail(cx, cy);
      spawnBubble(cx, cy - 10);
    }

    posRef.current = next;

    // Slide + bounce
    await controls.start({
      x: next.x,
      y: next.y,
      scale: [1.05, 0.98, 1],
      rotate: 0,
      transition: {
        x: { type: "spring", stiffness: 260, damping: 22, mass: 0.6 },
        y: { type: "spring", stiffness: 260, damping: 22, mass: 0.6 },
        scale: { duration: 0.45, ease: "easeOut" },
        rotate: { duration: 0.2 },
      },
    });

    setTimeout(() => {
      movingRef.current = false;
    }, 120);
  };

  // Proximity detection
  useEffect(() => {
    if (!ready) return;
    const onMove = (e: PointerEvent) => {
      const btn = btnRef.current;
      if (!btn) return;
      const r = btn.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      if (Math.hypot(dx, dy) < 50 + Math.max(r.width, r.height) / 2) {
        escape();
      }
    };
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready]);

  return (
    <>
      {/* Trails layer */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <AnimatePresence>
          {trails.map((t) => (
            <motion.div
              key={t.id}
              initial={{ x: t.x, y: t.y, opacity: 0, scale: 0.6 }}
              animate={{
                x: t.x + (Math.random() - 0.5) * 30,
                y: t.y - 30 - Math.random() * 30,
                opacity: [0, 1, 0],
                scale: 1,
                rotate: (Math.random() - 0.5) * 60,
              }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              className="absolute text-lg"
              style={{ left: 0, top: 0 }}
            >
              {t.kind === "heart" ? "💗" : t.kind === "spark" ? "✨" : "🦋"}
            </motion.div>
          ))}
        </AnimatePresence>

        <AnimatePresence>
          {bubbles.map((b) => (
            <motion.div
              key={b.id}
              initial={{ x: b.x, y: b.y, opacity: 0, scale: 0.8 }}
              animate={{ y: b.y - 60, opacity: [0, 1, 1, 0], scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className="absolute -translate-x-1/2 -translate-y-full"
              style={{ left: 0, top: 0 }}
            >
              <div
                className="whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-medium text-pink-900 shadow-md backdrop-blur-md"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(255,220,235,0.9), rgba(255,240,245,0.85))",
                  border: "1px solid rgba(255,255,255,0.6)",
                  boxShadow:
                    "0 4px 16px rgba(255,120,170,0.35), inset 0 0 8px rgba(255,255,255,0.5)",
                }}
              >
                {b.text}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <motion.button
        ref={btnRef}
        animate={controls}
        initial={false}
        onClick={escape}
        className="glass absolute left-0 top-0 rounded-full px-6 py-3 text-white font-semibold"
        style={{ willChange: "transform", visibility: ready ? "visible" : "hidden" }}
      >
        <motion.span
          animate={{ y: [0, -2, 0] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
          className="inline-block"
        >
          🌸 Maybe
        </motion.span>
      </motion.button>
    </>
  );
}
