import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Particles } from "@/components/magic/Particles";
import { MagicButton, SceneShell } from "@/components/magic/ui";
import { ShyMaybeButton } from "@/components/magic/ShyMaybeButton";

const LETTER = [
  "Dear Madam Ji...",
  "From the very first moment, the world felt a little softer.",
  "Every glance became a poem...",
  "Every smile, a sunrise.",
  "Every laugh, my favorite song.",
  "Every little moment with you turned into something eternal.",
  "I didn't plan to fall for you...",
  "I just did. Quietly. Completely. Irrevocably.",
  "You became my favorite person without even trying.",
  "And now, I can't imagine a tomorrow that doesn't have you in it.",
  "",
  "Will you be mine forever?",
];

function useTypewriter(lines: string[], speed = 40, linePause = 500) {
  const [idx, setIdx] = useState(0);
  const [text, setText] = useState("");
  const [done, setDone] = useState(false);
  useEffect(() => {
    if (idx >= lines.length) { setDone(true); return; }
    const line = lines[idx];
    if (line === "") { const t = setTimeout(() => setIdx((v) => v + 1), 600); return () => clearTimeout(t); }
    if (text.length < line.length) {
      const t = setTimeout(() => setText(line.slice(0, text.length + 1)), speed);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => { setIdx((v) => v + 1); setText(""); }, linePause);
    return () => clearTimeout(t);
  }, [idx, text, lines, speed, linePause]);
  return { text, idx, done };
}

export function Finale({ onNext: _onNext }: { onNext: () => void }) {
  const { text, idx, done } = useTypewriter(LETTER, 45, 700);
  const [answer, setAnswer] = useState<"yes" | "hug" | null>(null);
  const buttonsRef = useRef<HTMLDivElement | null>(null);
  const yesRef = useRef<HTMLButtonElement | null>(null);

  return (
    <SceneShell bg="radial-gradient(ellipse at 50% 100%, oklch(0.4 0.1 320) 0%, oklch(0.18 0.06 280) 60%, #000 100%)">
      <Particles variant="stars" count={130} />
      <Particles variant="fireflies" count={12} />

      {/* Aurora */}
      <div
        className="absolute inset-x-0 top-0 h-96 opacity-40"
        style={{
          background:
            "linear-gradient(180deg, transparent, oklch(0.8 0.18 160 / 0.4), oklch(0.7 0.2 300 / 0.4), transparent)",
          filter: "blur(40px)",
          animation: "aurora-shift 8s ease-in-out infinite",
        }}
      />

      {/* Huge moon */}
      <motion.div
        initial={{ scale: 0.5, y: 100, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        transition={{ duration: 3 }}
        className="absolute left-1/2 top-16 -translate-x-1/2"
      >
        <div
          className="h-[26rem] w-[26rem] rounded-full"
          style={{
            background: "radial-gradient(circle at 35% 35%, oklch(0.98 0.04 90), oklch(0.85 0.08 70) 65%, oklch(0.6 0.1 50))",
            boxShadow: "0 0 160px oklch(0.95 0.1 80 / 0.6), 0 0 320px oklch(0.85 0.12 70 / 0.4)",
          }}
        />
      </motion.div>

      {/* Big heart formed by stars */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-40">
        <div className="text-[20rem] leading-none animate-heartbeat">💗</div>
      </div>

      <div className="relative z-10 flex min-h-screen flex-col items-center justify-end pb-16 px-6">
        <div className="glass-dark max-w-2xl rounded-3xl p-8 md:p-10 text-white min-h-[380px]">
          <div className="space-y-3">
            {LETTER.slice(0, idx).map((l, i) => (
              <p key={i} className={i === 0 ? "hand text-3xl text-pink-200" : "display text-xl leading-relaxed text-white/95"}>
                {l || "\u00A0"}
              </p>
            ))}
            {idx < LETTER.length && (
              <p className={idx === 0 ? "hand text-3xl text-pink-200" : "display text-xl leading-relaxed text-white/95"}>
                {text}<span className="opacity-70">▍</span>
              </p>
            )}
          </div>

          {done && !answer && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              ref={buttonsRef}
              className="relative mt-8 h-28 w-full"
            >
              <div className="absolute left-4 top-1/2 -translate-y-1/2">
                <MagicButton
                  ref={yesRef}
                  onClick={() => setAnswer("yes")}
                  glow
                >
                  💖 Yes, Forever
                </MagicButton>
              </div>
              <ShyMaybeButton boundsRef={buttonsRef} yesRef={yesRef} />
            </motion.div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {answer && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 backdrop-blur-md p-6"
          >
            {/* Fireworks / confetti */}
            <Particles variant="stars" count={80} />
            <Particles variant="butterflies" count={16} />
            <Particles variant="petals" count={60} />
            {Array.from({ length: 40 }).map((_, i) => (
              <motion.div
                key={i}
                initial={{ y: "100vh", x: `${Math.random() * 100}vw`, opacity: 0 }}
                animate={{ y: "-10vh", opacity: [0, 1, 1, 0], rotate: 360 }}
                transition={{ duration: 4 + Math.random() * 3, delay: Math.random() * 2, repeat: Infinity }}
                className="absolute text-3xl"
              >
                {["🎆","🎇","🏮","💖","✨"][i % 5]}
              </motion.div>
            ))}
            <motion.div
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.5, type: "spring", damping: 14 }}
              className="glass-dark relative z-10 max-w-lg rounded-3xl p-10 text-center text-white"
            >
              <div className="text-8xl mb-4">{answer === "yes" ? "💖" : "🌸"}</div>
              <p className="display text-4xl text-glow">
                {answer === "yes" ? "Our forever begins here." : "Come here — take your time. I'll wait."}
              </p>
              <p className="hand mt-4 text-2xl text-pink-200">
                {answer === "yes" ? "Forever and always, yours." : "(the button will be here when you're ready)"}
              </p>
              {answer === "hug" && (
                <div className="mt-6">
                  <MagicButton onClick={() => setAnswer("yes")}>💖 Okay — yes</MagicButton>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </SceneShell>
  );
}
