import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Particles } from "@/components/magic/Particles";
import { MagicButton, SceneShell } from "@/components/magic/ui";
import childImg from "@/assets/mj-child.jpg.asset.json";
import floralImg from "@/assets/mj-floral.png.asset.json";
import sareeGreyImg from "@/assets/mj-saree-grey.png.asset.json";
import sareeBlackImg from "@/assets/mj-saree-black.png.asset.json";
import blueImg from "@/assets/mj-blue.jpg.asset.json";
import mj4 from "@/assets/mj-4.png.asset.json";
import mj5 from "@/assets/mj-5.png.asset.json";
import mj6 from "@/assets/mj-6.png.asset.json";
import mj7 from "@/assets/mj-7.png.asset.json";
import mj8 from "@/assets/mj-8.png.asset.json";
import mj9 from "@/assets/mj-9.png.asset.json";
import mj10 from "@/assets/mj-10.png.asset.json";
import mj11 from "@/assets/mj-11.png.asset.json";
import mj12 from "@/assets/mj-12.png.asset.json";
import mj13 from "@/assets/mj-13.png.asset.json";
import mj14 from "@/assets/mj-14.png.asset.json";
import mj15 from "@/assets/mj-15.png.asset.json";
import mj16 from "@/assets/mj-16.png.asset.json";

const LEAVES = [
  { src: childImg.url, caption: "Tiny you, already stealing hearts." },
  { src: floralImg.url, caption: "Blooming like the flowers you wear." },
  { src: sareeGreyImg.url, caption: "Grace in every fold." },
  { src: sareeBlackImg.url, caption: "Gold on midnight — royalty." },
  { src: blueImg.url, caption: "My favourite shade of blue." },
  { src: mj4.url, caption: "Black saree, golden hour — breathtaking." },
  { src: mj5.url, caption: "Flowers meeting their match." },
  { src: mj6.url, caption: "A scene straight out of a movie." },
  { src: mj7.url, caption: "Timeless — like something from a dream." },
  { src: mj8.url, caption: "Soft glow, softer smile." },
  { src: mj9.url, caption: "Elegance in ivory and ink." },
  { src: mj10.url, caption: "A princess from another era." },
  { src: mj11.url, caption: "Fairy lights and you — pure magic." },
  { src: mj12.url, caption: "Black & gold — absolutely regal." },
  { src: mj13.url, caption: "Effortlessly cool. Effortlessly you." },
  { src: mj14.url, caption: "Those jhumkas — a little poem on your ear." },
  { src: mj15.url, caption: "Little dancer, big dreams — pure sunshine." },
  { src: mj16.url, caption: "Sunglasses on, heart stolen. Instantly." },
];

function useIsMobile() {
  const [m, setM] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 768px), (pointer: coarse)");
    const on = () => setM(mq.matches);
    on();
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  return m;
}

// Hand-placed blossom coordinates that cluster naturally around a canopy silhouette.
// x: 0..100 (% of tree box width), y: 0..100 (% of tree box height, 0 = top of canopy).
const CANOPY_SPOTS: Array<{ x: number; y: number; s: number }> = [
  { x: 50, y: 10, s: 1.1 },
  { x: 34, y: 16, s: 0.95 },
  { x: 66, y: 16, s: 0.95 },
  { x: 22, y: 26, s: 1.05 },
  { x: 78, y: 26, s: 1.05 },
  { x: 42, y: 22, s: 0.9 },
  { x: 58, y: 22, s: 0.9 },
  { x: 14, y: 40, s: 1.0 },
  { x: 86, y: 40, s: 1.0 },
  { x: 30, y: 38, s: 0.95 },
  { x: 70, y: 38, s: 0.95 },
  { x: 50, y: 34, s: 1.1 },
  { x: 22, y: 54, s: 0.9 },
  { x: 78, y: 54, s: 0.9 },
  { x: 50, y: 52, s: 1.0 },
  { x: 38, y: 64, s: 0.95 },
  { x: 62, y: 64, s: 0.95 },
  { x: 50, y: 72, s: 1.0 },
];

export function ChildhoodTree({ onNext }: { onNext: () => void }) {
  const [open, setOpen] = useState<number | null>(null);
  const isMobile = useIsMobile();

  const positioned = useMemo(
    () =>
      LEAVES.map((leaf, i) => {
        const spot = CANOPY_SPOTS[i % CANOPY_SPOTS.length];
        return {
          ...leaf,
          x: spot.x,
          y: spot.y,
          scale: spot.s,
          floatDur: 4 + (i % 3),
          floatDelay: (i % 5) * 0.35,
        };
      }),
    [],
  );

  useEffect(() => {
    if (open === null) return;
    const img = new Image();
    img.src = LEAVES[open].src;
  }, [open]);

  const close = useCallback(() => setOpen(null), []);
  const prev = useCallback(
    () => setOpen((o) => (o === null ? o : (o - 1 + LEAVES.length) % LEAVES.length)),
    [],
  );
  const next = useCallback(
    () => setOpen((o) => (o === null ? o : (o + 1) % LEAVES.length)),
    [],
  );

  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      else if (e.key === "ArrowLeft") prev();
      else if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, close, prev, next]);

  return (
    <SceneShell bg="linear-gradient(180deg, oklch(0.95 0.05 260) 0%, oklch(0.92 0.07 320) 45%, oklch(0.88 0.09 30) 100%)">
      {/* soft sun halo */}
      <div
        className="pointer-events-none absolute -top-32 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full opacity-70"
        style={{
          background:
            "radial-gradient(circle, oklch(0.98 0.08 80 / 0.9) 0%, oklch(0.94 0.1 60 / 0.4) 40%, transparent 70%)",
          filter: "blur(20px)",
        }}
      />

      {/* distant hills */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[45%]">
        <svg viewBox="0 0 1200 400" preserveAspectRatio="none" className="h-full w-full">
          <path
            d="M0,260 C200,180 380,240 560,200 C740,160 920,240 1200,190 L1200,400 L0,400 Z"
            fill="oklch(0.86 0.08 320 / 0.55)"
          />
          <path
            d="M0,320 C220,270 420,310 640,280 C860,250 1040,310 1200,290 L1200,400 L0,400 Z"
            fill="oklch(0.82 0.1 340 / 0.7)"
          />
          <path
            d="M0,360 C240,330 460,360 700,340 C940,320 1080,360 1200,350 L1200,400 L0,400 Z"
            fill="oklch(0.78 0.11 20 / 0.85)"
          />
        </svg>
      </div>

      <Particles variant="petals" count={isMobile ? 14 : 40} />
      <Particles variant="fireflies" count={isMobile ? 4 : 10} />

      {/* Tree */}
      <div className="absolute inset-0 flex items-end justify-center">
        <div className="relative mb-8 h-[78vh] w-[92vw] max-w-3xl [contain:layout_paint]">
          <svg
            viewBox="0 0 400 520"
            preserveAspectRatio="xMidYMax meet"
            className="absolute inset-0 h-full w-full drop-shadow-[0_20px_40px_oklch(0.6_0.1_340/0.3)]"
            aria-hidden
          >
            <defs>
              <radialGradient id="canopy" cx="50%" cy="40%" r="60%">
                <stop offset="0%" stopColor="oklch(0.94 0.08 340)" />
                <stop offset="55%" stopColor="oklch(0.86 0.13 350)" />
                <stop offset="100%" stopColor="oklch(0.72 0.15 340 / 0.9)" />
              </radialGradient>
              <linearGradient id="trunk" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="oklch(0.55 0.08 40)" />
                <stop offset="100%" stopColor="oklch(0.32 0.06 30)" />
              </linearGradient>
              <filter id="soft" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="2" />
              </filter>
            </defs>

            {/* ground shadow */}
            <ellipse cx="200" cy="500" rx="170" ry="14" fill="oklch(0.4 0.06 320 / 0.25)" filter="url(#soft)" />

            {/* trunk */}
            <path
              d="M188 500 C 185 430, 180 380, 190 320 L 210 320 C 220 380, 215 430, 212 500 Z"
              fill="url(#trunk)"
            />
            {/* main branches */}
            <path
              d="M200 340 C 170 300, 140 280, 110 260"
              stroke="oklch(0.38 0.07 30)"
              strokeWidth="10"
              strokeLinecap="round"
              fill="none"
            />
            <path
              d="M200 340 C 230 300, 260 280, 295 258"
              stroke="oklch(0.38 0.07 30)"
              strokeWidth="10"
              strokeLinecap="round"
              fill="none"
            />
            <path
              d="M200 330 C 195 280, 200 240, 205 200"
              stroke="oklch(0.38 0.07 30)"
              strokeWidth="9"
              strokeLinecap="round"
              fill="none"
            />

            {/* canopy — layered blobs for a soft, painterly shape */}
            <g opacity="0.95">
              <ellipse cx="120" cy="240" rx="95" ry="80" fill="url(#canopy)" />
              <ellipse cx="290" cy="240" rx="100" ry="82" fill="url(#canopy)" />
              <ellipse cx="200" cy="180" rx="115" ry="95" fill="url(#canopy)" />
              <ellipse cx="200" cy="260" rx="150" ry="90" fill="url(#canopy)" />
            </g>

            {/* highlight sheen */}
            <ellipse cx="170" cy="150" rx="55" ry="24" fill="oklch(1 0 0 / 0.35)" filter="url(#soft)" />
          </svg>

          {/* Fairy-light garland strung across the canopy */}
          <svg
            viewBox="0 0 400 520"
            preserveAspectRatio="xMidYMax meet"
            className="pointer-events-none absolute inset-0 h-full w-full"
            aria-hidden
          >
            <path
              d="M40 200 Q 200 260 360 200"
              stroke="oklch(0.98 0.05 90 / 0.55)"
              strokeWidth="1"
              fill="none"
              strokeDasharray="1 6"
            />
          </svg>
          {Array.from({ length: 12 }).map((_, i) => (
            <span
              key={`fl-${i}`}
              className="ct-firefly-bulb absolute h-1.5 w-1.5 rounded-full"
              style={{
                left: `${8 + i * 7.5}%`,
                top: `${38 + Math.sin((i / 11) * Math.PI) * -6 + 8}%`,
                background: i % 2 ? "oklch(0.95 0.14 80)" : "oklch(0.92 0.14 340)",
                boxShadow: "0 0 10px oklch(0.95 0.14 80 / 0.9), 0 0 20px oklch(0.9 0.14 340 / 0.6)",
                animationDelay: `${i * 0.18}s`,
              }}
            />
          ))}

          {/* Blossoms */}
          {positioned.map((leaf, i) => (
            <motion.button
              key={i}
              onClick={() => setOpen(i)}
              whileHover={{ scale: leaf.scale * 1.18, zIndex: 5 }}
              whileTap={{ scale: leaf.scale * 0.94 }}
              initial={{ opacity: 0, scale: 0, y: -20 }}
              animate={{ opacity: 1, scale: leaf.scale, y: 0 }}
              transition={{ delay: 0.05 * i, type: "spring", stiffness: 90, damping: 12 }}
              className="ct-blossom group absolute -translate-x-1/2 -translate-y-1/2"
              style={{
                left: `${leaf.x}%`,
                top: `${leaf.y}%`,
                animationDuration: `${leaf.floatDur}s`,
                animationDelay: `${leaf.floatDelay}s`,
                width: 72,
                height: 72,
              }}
              aria-label={leaf.caption}
            >
              {/* petal frame */}
              <span
                className="absolute inset-0 rounded-full opacity-90 blur-[2px] transition-opacity group-hover:opacity-100"
                style={{
                  background:
                    "conic-gradient(from 0deg, oklch(0.95 0.1 350), oklch(0.9 0.12 320), oklch(0.95 0.1 60), oklch(0.9 0.12 350), oklch(0.95 0.1 350))",
                }}
              />
              {/* glow */}
              <span
                className="absolute -inset-2 rounded-full opacity-60 blur-md transition-opacity group-hover:opacity-100"
                style={{ background: "radial-gradient(circle, oklch(0.95 0.14 340 / 0.9), transparent 70%)" }}
              />
              <span className="absolute inset-1.5 overflow-hidden rounded-full ring-2 ring-white/90 shadow-[0_6px_18px_oklch(0.4_0.1_320/0.35)]">
                <img
                  src={leaf.src}
                  alt=""
                  width={72}
                  height={72}
                  loading="lazy"
                  decoding="async"
                  draggable={false}
                  className="h-full w-full object-cover"
                />
              </span>
              {/* sparkle */}
              <span className="pointer-events-none absolute -right-1 -top-1 text-xs opacity-0 transition-opacity group-hover:opacity-100">
                ✨
              </span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Header */}
      <div className="pointer-events-none absolute top-6 left-0 right-0 flex flex-col items-center px-4 text-center">
        <span className="mb-2 inline-flex items-center gap-2 rounded-full border border-white/60 bg-white/25 px-3 py-1 text-xs uppercase tracking-[0.25em] text-white/90 backdrop-blur-md">
          🌸 chapter one
        </span>
        <h2 className="display text-4xl md:text-6xl text-white text-glow leading-tight">
          The Childhood Tree
        </h2>
        <p className="hand text-xl md:text-2xl text-white/90 mt-1">
          every blossom is a version of you i adore
        </p>
        <span className="mt-3 rounded-full bg-white/25 px-3 py-1 text-xs text-white/90 backdrop-blur-md">
          {LEAVES.length} blossoms · tap to unfold
        </span>
      </div>

      {/* CTA */}
      <div className="absolute bottom-6 left-0 right-0 flex justify-center px-4">
        <MagicButton onClick={onNext}>Walk the memory path →</MagicButton>
      </div>

      {/* Polaroid modal */}
      <AnimatePresence>
        {open !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
            className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 p-4 backdrop-blur-lg"
          >
            <motion.div
              key={open}
              onClick={(e) => e.stopPropagation()}
              initial={{ y: -120, rotate: -12, opacity: 0, scale: 0.9 }}
              animate={{ y: 0, rotate: -2.5, opacity: 1, scale: 1 }}
              exit={{ y: 60, rotate: 4, opacity: 0, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 110, damping: 15 }}
              className="relative rounded-md bg-[oklch(0.98_0.02_80)] p-4 pb-6 shadow-[0_30px_80px_-20px_oklch(0.2_0.1_320/0.7)]"
            >
              {/* tape */}
              <span className="absolute -top-3 left-1/2 h-6 w-24 -translate-x-1/2 -rotate-3 bg-white/60 shadow-sm backdrop-blur-sm" />

              <div className="relative flex h-[62vh] max-h-[440px] w-[82vw] max-w-[360px] items-center justify-center overflow-hidden rounded-sm bg-gradient-to-br from-pink-100 to-amber-100">
                <img
                  src={LEAVES[open].src}
                  alt={LEAVES[open].caption}
                  decoding="async"
                  fetchPriority="high"
                  className="h-full w-full object-cover"
                />
                <span className="absolute left-2 top-2 rounded-full bg-black/40 px-2 py-0.5 text-[10px] font-medium tracking-wider text-white backdrop-blur-sm">
                  {String(open + 1).padStart(2, "0")} / {String(LEAVES.length).padStart(2, "0")}
                </span>
              </div>

              <p className="hand mt-4 text-center text-2xl leading-tight text-pink-700 max-w-[340px]">
                {LEAVES[open].caption}
              </p>

              {/* prev / next */}
              <button
                onClick={prev}
                aria-label="Previous"
                className="absolute -left-14 top-1/2 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 text-lg text-pink-700 shadow-lg backdrop-blur-md transition hover:scale-110 hover:bg-white sm:flex"
              >
                ←
              </button>
              <button
                onClick={next}
                aria-label="Next"
                className="absolute -right-14 top-1/2 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 text-lg text-pink-700 shadow-lg backdrop-blur-md transition hover:scale-110 hover:bg-white sm:flex"
              >
                →
              </button>

              {/* mobile controls */}
              <div className="mt-3 flex items-center justify-center gap-3 sm:hidden">
                <button
                  onClick={prev}
                  className="rounded-full bg-pink-100 px-4 py-1.5 text-sm text-pink-700 shadow"
                >
                  ← prev
                </button>
                <button
                  onClick={next}
                  className="rounded-full bg-pink-100 px-4 py-1.5 text-sm text-pink-700 shadow"
                >
                  next →
                </button>
              </div>

              <button
                onClick={close}
                aria-label="Close"
                className="absolute -right-3 -top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white text-lg shadow-lg transition hover:scale-110"
              >
                ✕
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </SceneShell>
  );
}
