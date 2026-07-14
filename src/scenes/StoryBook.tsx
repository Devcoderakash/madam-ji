import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { Particles } from "@/components/magic/Particles";
import { MagicButton, SceneShell } from "@/components/magic/ui";

const PAGES = [
  {
    date: "Chapter I",
    emoji: "🌸",
    title: "The first intro...",
    body: "Some intro are forgotten . ur's quietly become unforgettable.",
    sticker: "💌",
  },
  {
    date: "Chapter II",
    emoji: "☕",
    title: "Getting to know u",
    body: "Little by little , I wanted to k everything abt u... ur fav songs, what make u smile, what make u quiet.....without realizing it, learning abt u become my fav part of every day....🌙✨",
    sticker: "🌦️",
  },
  {
    date: "Chapter III",
    emoji: "🌙",
    title: "finally, we talked",
    body: "then came the moment I'd secretly been hoping for... a simple conversation turned into something I looked forward to every day. every msg made me smile a little longer than I'd like to admit....🥹✨",
    sticker: "⭐",
  },
  {
    date: "Chapter IV",
    emoji: "🍥",
    title: "Little Everydays",
    body: "Somewhere between 'good morning' and 'goodnight', you became my favorite habit.",
    sticker: "🍡",
  },
  {
    date: "Chapter V",
    emoji: "🎠",
    title: "Us — Continued",
    body: "Our chapter has no ending .... That's the best part.",
    sticker: "💖",
  },
];

export function StoryBook({ onNext }: { onNext: () => void }) {
  const [i, setI] = useState(0);
  const [dir, setDir] = useState(1);

  const go = (d: number) => {
    setDir(d);
    setI((v) => Math.max(0, Math.min(PAGES.length - 1, v + d)));
  };

  const p = PAGES[i];

  return (
    <SceneShell bg="linear-gradient(180deg, oklch(0.4 0.06 290) 0%, oklch(0.55 0.1 320) 100%)">
      <Particles variant="fireflies" count={18} />
      <Particles variant="stars" count={50} />

      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center gap-6 px-6">
        <h2 className="display text-5xl md:text-6xl text-white text-glow">Our Storybook</h2>

        <div className="relative w-full max-w-4xl [perspective:1600px]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0 rounded-3xl shadow-[0_40px_100px_-20px_rgba(0,0,0,0.5)] overflow-hidden">
            {/* Left page */}
            <div className="bg-[oklch(0.96_0.03_60)] p-10 min-h-[420px] flex flex-col justify-center items-center text-center">
              <div className="text-8xl mb-4">{p.emoji}</div>
              <div className="hand text-2xl text-pink-600">{p.date}</div>
              <div className="display text-3xl mt-1 text-foreground">{p.title}</div>
              <div className="mt-6 text-4xl">{p.sticker}</div>
            </div>
            {/* Right page */}
            <AnimatePresence mode="wait" custom={dir}>
              <motion.div
                key={i}
                custom={dir}
                initial={{ rotateY: dir > 0 ? 90 : -90, opacity: 0 }}
                animate={{ rotateY: 0, opacity: 1 }}
                exit={{ rotateY: dir > 0 ? -90 : 90, opacity: 0 }}
                transition={{ duration: 0.7 }}
                className="bg-[oklch(0.98_0.02_60)] p-10 min-h-[420px] flex flex-col justify-center [transform-origin:left_center]"
              >
                <p className="display text-2xl md:text-3xl text-foreground/85 leading-relaxed">{p.body}</p>
                <p className="hand text-lg text-pink-600 mt-6">— for you, always</p>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => go(-1)}
            disabled={i === 0}
            className="glass rounded-full px-5 py-2 text-white disabled:opacity-30"
          >
            ← Prev
          </button>
          <div className="glass rounded-full px-4 py-1 text-white/80">
            {i + 1} / {PAGES.length}
          </div>
          <button
            onClick={() => go(1)}
            disabled={i === PAGES.length - 1}
            className="glass rounded-full px-5 py-2 text-white disabled:opacity-30"
          >
            Next →
          </button>
        </div>

        <MagicButton onClick={onNext}>Look up at the stars ✨</MagicButton>
      </div>
    </SceneShell>
  );
}
