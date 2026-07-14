import { motion } from "framer-motion";
import { Particles } from "@/components/magic/Particles";
import { MagicButton, SceneShell } from "@/components/magic/ui";

const AGES = [
  { label: "first glimpse", emoji: "🎀", note: "that day fall for you" },
  { label: "daily bus mission", emoji: "🚲", note: "where is sheee???" },
  { label: "cllg day's", emoji: "📖", note: "I came to see u" },
  { label: "the Instagram", emoji: "🌻", note: "check ur activities." },
  { label: "little things abt u", emoji: "🌷", note: "I start remembering ur litte things..." },
  { label: "ur fav. music", emoji: "🎧", note: "And now — the person I adore." },
  { label: "Things You Love", emoji: "🌙", note: "Your likes became my favorite conversations." },
  { label: "Random Moments", emoji: "🦋", note: "Sometimes nothing special happened... but those became my favorite memories." },
  { label: "The Stage Moment", emoji: "🎤", note: "Watching you on stage... I forgot everyone else was there." },
  { label: "Your Cute Expressions", emoji: "📸", note: "Your little reactions deserve their own photo album." },
  { label: "Getting to Know You", emoji: "💬", note: "Every conversation made me realize... you're even more beautiful than I first thought." },
  { label: "Every Small Memory", emoji: "💕", note: "None of these moments were huge... but together, they became everything." },
  { label: "The Sky of Memories", emoji: "✨", note: "Every memory became a little star... and together they created my favorite constellation—you." },
  { label: "One Last Question...", emoji: "🌌", note: "If every memory brought me here... maybe it's because my heart already knew where it wanted to be." },
];

export function MemoryPath({ onNext }: { onNext: () => void }) {
  return (
    <SceneShell bg="linear-gradient(180deg, oklch(0.92 0.05 240) 0%, oklch(0.9 0.08 340) 100%)">
      <Particles variant="butterflies" count={10} />
      <Particles variant="petals" count={20} />
      {/* Path */}
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        <defs>
          <linearGradient id="pth" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="oklch(0.95 0.05 340)" />
            <stop offset="1" stopColor="oklch(0.85 0.1 40)" />
          </linearGradient>
        </defs>
        <path d="M 20 0 Q 80 20, 30 40 T 70 80 T 40 100" stroke="url(#pth)" strokeWidth="3" fill="none" strokeDasharray="1 2" opacity="0.7" />
      </svg>

      <div className="relative z-10 mx-auto max-w-5xl px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="display text-5xl md:text-6xl text-white text-glow">The Memory Path</h2>
          <p className="hand text-xl text-white/85 mt-2">Every step, another year I love you through.</p>
        </div>

        <div className="space-y-16">
          {AGES.map((a, i) => (
            <motion.div
              key={a.label}
              initial={{ opacity: 0, x: i % 2 === 0 ? -60 : 60 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1 }}
              className={`flex items-center gap-6 ${i % 2 === 0 ? "" : "flex-row-reverse text-right"}`}
            >
              <div className="glass flex h-40 w-40 shrink-0 items-center justify-center rounded-3xl text-7xl">
                {a.emoji}
              </div>
              <div className="glass rounded-3xl px-6 py-5 max-w-md">
                <div className="hand text-3xl text-pink-600">{a.label}</div>
                <p className="mt-1 text-lg text-foreground/80">{a.note}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-16 flex justify-center">
          <MagicButton onClick={onNext}>To the balloon garden →</MagicButton>
        </div>
      </div>
    </SceneShell>
  );
}
