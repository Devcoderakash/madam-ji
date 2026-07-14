import { AnimatePresence, motion } from "framer-motion";
import { useMemo, useState } from "react";
import { Particles } from "@/components/magic/Particles";
import { GlassCard, MagicButton, SceneShell } from "@/components/magic/ui";

const MEMORIES = [
  { date: "Spring, Year One", place: "By the old bookstore", emoji: "📚", song: "Sweater Weather", body: "The first time I noticed the way you say my name." },
  { date: "Late June", place: "Rooftop, 11:47 pm", emoji: "🌃", song: "From the Start", body: "You laughed at my terrible joke. I decided that was it." },
  { date: "Winter walk", place: "Park path, snow", emoji: "❄️", song: "Cardigan", body: "Cold hands, warm everything else." },
  { date: "Golden hour", place: "Terrace, tea steaming", emoji: "🌇", song: "Ocean Eyes", body: "You in that light — the definition of soft." },
  { date: "Random Tuesday", place: "Text at 2:14 pm", emoji: "💌", song: "Golden Hour", body: "'Thinking of you.' The most complete sentence." },
  { date: "Monsoon", place: "That tiny café", emoji: "☔", song: "Perfect", body: "Rain outside, universe inside." },
];

export function Constellation({ onNext }: { onNext: () => void }) {
  const positions = useMemo(
    () =>
      MEMORIES.map((_, i) => ({
        left: 12 + ((i * 137) % 76),
        top: 18 + ((i * 89) % 55),
      })),
    [],
  );
  const [open, setOpen] = useState<number | null>(null);

  return (
    <SceneShell bg="radial-gradient(ellipse at 50% 30%, oklch(0.25 0.08 280) 0%, oklch(0.1 0.04 280) 70%, #000 100%)">
      <Particles variant="stars" count={140} />
      <Particles variant="fireflies" count={8} />

      {/* Constellation lines */}
      <svg className="absolute inset-0 h-full w-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
        {positions.slice(0, -1).map((p, i) => (
          <line
            key={i}
            x1={p.left}
            y1={p.top}
            x2={positions[i + 1].left}
            y2={positions[i + 1].top}
            stroke="oklch(0.9 0.05 340 / 0.35)"
            strokeWidth="0.15"
            strokeDasharray="0.5 1"
          />
        ))}
      </svg>

      <div className="pointer-events-none absolute top-10 left-0 right-0 z-10 text-center">
        <h2 className="display text-5xl md:text-6xl text-white text-glow">Memory Constellation</h2>
        <p className="hand text-xl text-white/85 mt-1">Every star is a moment. Tap to remember with me.</p>
      </div>

      {positions.map((p, i) => (
        <motion.button
          key={i}
          onClick={() => setOpen(i)}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.15 * i, duration: 0.6 }}
          whileHover={{ scale: 1.6 }}
          className="absolute h-4 w-4 rounded-full bg-white"
          style={{
            left: `${p.left}%`,
            top: `${p.top}%`,
            boxShadow: "0 0 20px white, 0 0 40px oklch(0.9 0.12 340)",
            animation: `twinkle ${2 + (i % 3)}s ease-in-out ${i * 0.3}s infinite`,
          }}
        />
      ))}

      <div className="absolute bottom-10 left-0 right-0 z-10 flex justify-center">
        <MagicButton onClick={onNext}>Catch a shooting star 🌠</MagicButton>
      </div>

      <AnimatePresence>
        {open !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(null)}
            className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 backdrop-blur-md p-6"
          >
            <motion.div
              initial={{ scale: 0.7, y: 40, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.7, opacity: 0 }}
              transition={{ type: "spring", stiffness: 120, damping: 16 }}
              onClick={(e) => e.stopPropagation()}
            >
              <GlassCard dark className="max-w-md text-white">
                <div className="text-6xl text-center">{MEMORIES[open].emoji}</div>
                <div className="hand text-2xl mt-3 text-center text-pink-200">{MEMORIES[open].date}</div>
                <div className="text-center text-white/80 mt-1">{MEMORIES[open].place}</div>
                <p className="display text-xl mt-5 leading-relaxed text-center">{MEMORIES[open].body}</p>
                <div className="mt-5 text-center text-sm text-white/70">🎵 {MEMORIES[open].song}</div>
              </GlassCard>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </SceneShell>
  );
}
