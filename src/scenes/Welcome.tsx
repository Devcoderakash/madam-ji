import { motion } from "framer-motion";
import { Particles } from "@/components/magic/Particles";
import { MagicButton, SceneShell } from "@/components/magic/ui";

export function Welcome({ onNext }: { onNext: () => void }) {
  return (
    <SceneShell bg="linear-gradient(180deg, oklch(0.88 0.06 220) 0%, oklch(0.92 0.07 340) 60%, oklch(0.94 0.08 60) 100%)">
      {/* Clouds */}
      {[0, 1, 2, 3, 4].map((i) => (
        <motion.div
          key={i}
          initial={{ x: -300 }}
          animate={{ x: "110vw" }}
          transition={{ duration: 40 + i * 8, repeat: Infinity, delay: i * 4, ease: "linear" }}
          className="absolute h-24 w-64 rounded-full bg-white/70 blur-xl"
          style={{ top: `${8 + i * 12}%` }}
        />
      ))}
      <Particles variant="petals" count={24} />
      <Particles variant="butterflies" count={6} />

      {/* Floating island */}
      <div className="absolute inset-x-0 bottom-0 flex justify-center">
        <motion.div
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 2 }}
          className="relative animate-float"
          style={{ animationDuration: "8s" }}
        >
          {/* Island body */}
          <div
            className="mx-auto h-40 w-[28rem] rounded-t-[100%] rounded-b-[40%]"
            style={{
              background: "linear-gradient(180deg, oklch(0.75 0.14 145) 0%, oklch(0.55 0.14 40) 60%, oklch(0.4 0.1 30) 100%)",
              boxShadow: "0 40px 80px oklch(0.5 0.1 320 / 0.35)",
            }}
          />
          {/* Trees & characters */}
          <div className="absolute inset-x-0 -top-16 flex items-end justify-around">
            <span className="text-5xl">🌸</span>
            <span className="text-6xl animate-float" style={{ animationDuration: "3s" }}>🐰</span>
            <span className="text-5xl animate-float" style={{ animationDuration: "4s", animationDelay: "0.5s" }}>🐱</span>
            <span className="text-5xl">🌳</span>
          </div>
          {/* Lanterns */}
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="absolute text-3xl"
              style={{ left: `${20 + i * 30}%`, top: `-140px` }}
              animate={{ y: [0, -12, 0] }}
              transition={{ duration: 3 + i, repeat: Infinity }}
            >
              🏮
            </motion.div>
          ))}
        </motion.div>
      </div>

      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.4, delay: 0.4 }}
          className="display text-6xl md:text-8xl text-white text-glow"
        >
          Welcome.
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.4, delay: 1.2 }}
          className="hand mt-4 text-2xl md:text-3xl text-white/90 text-glow max-w-xl"
        >
          This little world was created only for you.
        </motion.p>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.4, duration: 1 }}
          className="mt-10"
        >
          <MagicButton onClick={onNext}>Continue the story →</MagicButton>
        </motion.div>
      </div>
    </SceneShell>
  );
}
