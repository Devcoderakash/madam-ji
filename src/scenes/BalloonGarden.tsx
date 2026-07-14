import { AnimatePresence, motion } from "framer-motion";
import { useMemo, useState } from "react";
import { Particles } from "@/components/magic/Particles";
import { MagicButton, SceneShell } from "@/components/magic/ui";

const COMPLIMENTS = [
  "💖 I like ur smile.",
  "🌸 I like ur existence.",
  "🤍 I like ur soft heart.",
  "✨ I like ur innocence.",
  "🌷 I like ur elegance.",
  "🎶 I like when u sing.",
  "🌙 I like ur good night texts.",
  "☀️ I like ur good morning messages.",
  "🍃 I like ur natural beauty.",
  "🌿 I like ur nature.",
  "🥹 I like ur beautiful soul.",
  "🌈 I like ur uniqueness.",
  "💫 I like that ur different.",
  "🫶 I like the way u care.",
  "😊 I like u as a person.",
  "💌 I like that u made me like u from the first meet.",
  "🌸 I like the way u smile without realizing it.",
  "🐣 I like ur cute little reactions.",
  "✨ I like how u make ordinary moments special.",
  "💖 I like the happiness u bring.",
  "🌷 I like ur kindness.",
  "🌙 I like the calm u give me.",
  "🌼 I like ur simplicity.",
  "🦋 I like ur positive vibes.",
  "🎀 I like ur cute expressions.",
  "💗 I like the way u laugh.",
  "🌺 I like ur little habits.",
  "☁️ I like how genuine u are.",
  "🌹 I like the way u talk.",
  "💭 I like listening to u.",
  "💞 I like ur caring nature.",
  "🌟 I like ur confidence.",
  "🎈 I like how excited u get.",
  "📖 I like every conversation with u.",
  "🐰 I like ur adorable personality.",
  "💐 I like ur honesty.",
  "🌼 I like the peace I feel around u.",
  "🫧 I like how comfortable u make people feel.",
  "🌸 I like ur soft voice.",
  "✨ I like how effortlessly beautiful u are.",
  "🎵 I like ur music taste.",
  "🌻 I like how passionate u are.",
  "💫 I like the sparkle in ur eyes.",
  "🌙 I like how u brighten my day.",
  "🩷 I like how respectful u are.",
  "🌈 I like the little things about u.",
  "🍀 I like the way u see the world.",
  "🦢 I like ur graceful nature.",
  "💌 I like every memory that includes u.",
  "🌷 I like how u stay true to yourself.",
  "🐻 I like how cute u look when u're happy.",
  "🌼 I like ur innocence more than u know.",
  "💖 I like how u became my favorite person.",
  "✨ I like the way u unknowingly make me smile.",
  "🌙 I like that thinking about u makes my day better.",
  "🫶 I like that u're simply... u.",
  "💗 I like that meeting u changed something in me.",
  "🌸 I like the version of myself when I'm with u.",
  "🥹 I like that u exist in my life.",
];

interface Balloon {
  id: number;
  left: number;
  bottom: number;
  hue: number;
  shape: "heart" | "star" | "cloud" | "round";
  size: number;
  dur: number;
  delay: number;
}

export function BalloonGarden({ onNext }: { onNext: () => void }) {
  const initial = useMemo<Balloon[]>(
    () =>
      Array.from({ length: 30 }, (_, i) => ({
        id: i,
        left: Math.random() * 92 + 2,
        bottom: Math.random() * 60 + 5,
        hue: [340, 300, 200, 60, 20][i % 5],
        shape: (["heart", "star", "cloud", "round"] as const)[i % 4],
        size: 40 + Math.random() * 40,
        dur: 4 + Math.random() * 4,
        delay: Math.random() * 3,
      })),
    [],
  );
  const [balloons, setBalloons] = useState(initial);
  const [pop, setPop] = useState<{ text: string; x: number; y: number; id: number } | null>(null);

  const onPop = (b: Balloon, e: React.MouseEvent) => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    setBalloons((bs) => bs.filter((x) => x.id !== b.id));
    const text = COMPLIMENTS[Math.floor(Math.random() * COMPLIMENTS.length)];
    setPop({ text, x: rect.left + rect.width / 2, y: rect.top, id: Date.now() });
    setTimeout(() => setPop((p) => (p && p.id ? null : p)), 2600);
  };

  const emoji = (s: Balloon["shape"]) => (s === "heart" ? "❤" : s === "star" ? "★" : s === "cloud" ? "☁" : "●");

  return (
    <SceneShell bg="linear-gradient(180deg, oklch(0.92 0.06 220) 0%, oklch(0.9 0.09 340) 100%)">
      <Particles variant="dust" count={40} />
      <Particles variant="petals" count={16} />

      <div className="pointer-events-none absolute top-8 left-0 right-0 z-10 text-center">
        <h2 className="display text-5xl md:text-6xl text-white text-glow">The Balloon Garden</h2>
        <p className="hand text-xl text-white/85 mt-1">Pop one. I left something for you inside. 💌</p>
        <p className="hand text-base text-white/70 mt-1">{balloons.length} balloons floating</p>
      </div>

      <div className="absolute inset-0">
        <AnimatePresence>
          {balloons.map((b) => (
            <motion.button
              key={b.id}
              onClick={(e) => onPop(b, e)}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ scale: [1, 1.5, 0], opacity: [1, 1, 0], transition: { duration: 0.4 } }}
              whileHover={{ scale: 1.15 }}
              className="absolute grid place-items-center font-bold text-white"
              style={{
                left: `${b.left}%`,
                bottom: `${b.bottom}%`,
                width: b.size,
                height: b.size * 1.15,
                borderRadius: "50%",
                background: `radial-gradient(circle at 30% 30%, oklch(0.95 0.05 ${b.hue}), oklch(0.75 0.16 ${b.hue}) 70%, oklch(0.6 0.18 ${b.hue}))`,
                boxShadow: `0 10px 30px oklch(0.6 0.18 ${b.hue} / 0.5), inset -6px -10px 20px oklch(0.4 0.15 ${b.hue} / 0.5)`,
                animation: `float-slow ${b.dur}s ease-in-out ${b.delay}s infinite`,
              }}
            >
              <span className="text-xl drop-shadow">{emoji(b.shape)}</span>
              <span
                className="absolute -bottom-6 h-6 w-px"
                style={{ background: `oklch(0.6 0.1 ${b.hue})` }}
              />
            </motion.button>
          ))}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {pop && (
          <motion.div
            key={pop.id}
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ opacity: 1, y: -30, scale: 1 }}
            exit={{ opacity: 0, y: -80 }}
            className="pointer-events-none fixed z-30 -translate-x-1/2 rounded-full glass px-5 py-3"
            style={{ left: pop.x, top: pop.y }}
          >
            <p className="hand text-xl text-pink-700">{pop.text}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="absolute bottom-8 left-0 right-0 z-10 flex justify-center gap-3">
        {balloons.length === 0 && (
          <MagicButton onClick={() => setBalloons(initial)}>Release more 🎈</MagicButton>
        )}
        <MagicButton onClick={onNext}>Open the storybook →</MagicButton>
      </div>
    </SceneShell>
  );
}
