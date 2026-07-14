import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Particles } from "@/components/magic/Particles";
import { MagicButton, SceneShell } from "@/components/magic/ui";

const LINES = [
  "Hi Madam Ji...",
  "I made something only for you...",
  "I hope this makes you smile.",
];

export function Intro({ onEnter }: { onEnter: () => void }) {
  const [idx, setIdx] = useState(0);
  const [showBtn, setShowBtn] = useState(false);

  useEffect(() => {
    if (idx < LINES.length - 1) {
      const t = setTimeout(() => setIdx((i) => i + 1), 2600);
      return () => clearTimeout(t);
    } else {
      const t = setTimeout(() => setShowBtn(true), 2200);
      return () => clearTimeout(t);
    }
  }, [idx]);

  return (
    <SceneShell bg="radial-gradient(ellipse at 50% 40%, oklch(0.28 0.08 300) 0%, oklch(0.12 0.04 280) 60%, #000 100%)">
      <Particles variant="stars" count={80} />
      <Particles variant="fireflies" count={12} />

      {/* Moon rising */}
      <motion.div
        initial={{ y: "60vh", opacity: 0 }}
        animate={{ y: "-5vh", opacity: 1 }}
        transition={{ duration: 6, ease: "easeOut" }}
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
      >
        <div
          className="h-64 w-64 rounded-full"
          style={{
            background: "radial-gradient(circle at 35% 35%, oklch(0.98 0.05 90), oklch(0.86 0.08 70) 60%, oklch(0.7 0.1 50) 100%)",
            boxShadow: "0 0 120px oklch(0.95 0.08 80 / 0.6), 0 0 240px oklch(0.9 0.1 70 / 0.4)",
          }}
        />
      </motion.div>

      {/* Heartbeat pulse */}
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          initial={{ scale: 1, opacity: 0.15 }}
          animate={{ scale: [1, 1.4, 1], opacity: [0.15, 0.3, 0.15] }}
          transition={{ duration: 1.4, repeat: Infinity }}
          className="h-96 w-96 rounded-full"
          style={{ background: "radial-gradient(circle, oklch(0.7 0.2 20 / 0.25), transparent 60%)" }}
        />
      </div>

      <div className="relative z-10 flex min-h-screen flex-col items-center justify-end pb-24 px-6 text-center">
        <div className="mb-10 min-h-[8rem] flex flex-col items-center gap-3">
          {LINES.slice(0, idx + 1).map((line, i) => (
            <motion.p
              key={i}
              initial={{ opacity: 0, y: 12, filter: "blur(8px)" }}
              animate={{ opacity: i === idx ? 1 : 0.5, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 1.4 }}
              className={`display text-3xl md:text-5xl text-white/95 text-glow ${i === 0 ? "hand text-4xl md:text-6xl" : ""}`}
            >
              {line}
            </motion.p>
          ))}
        </div>
        {showBtn && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }}>
            <MagicButton onClick={onEnter}>✨ Enter My Little World</MagicButton>
          </motion.div>
        )}
      </div>
    </SceneShell>
  );
}
