import { motion } from "framer-motion";
import { useState } from "react";
import { Particles } from "@/components/magic/Particles";
import { MagicButton, SceneShell } from "@/components/magic/ui";

export function Wish({ onNext }: { onNext: () => void }) {
  const [caught, setCaught] = useState(false);

  return (
    <SceneShell bg="radial-gradient(ellipse at 50% 20%, oklch(0.3 0.1 300) 0%, oklch(0.12 0.05 280) 70%, #000 100%)">
      <Particles variant="stars" count={120} />

      {!caught && (
        <motion.button
          type="button"
          onClick={() => setCaught(true)}
          aria-label="Catch the shooting star"
          initial={{ x: "-20vw", y: "15vh", opacity: 0 }}
          animate={{
            x: ["-20vw", "20vw", "55vw", "85vw"],
            y: ["15vh", "35vh", "55vh", "75vh"],
            opacity: [0, 1, 1, 0],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "linear",
            times: [0, 0.2, 0.7, 1],
          }}
          whileHover={{ scale: 1.35 }}
          whileTap={{ scale: 0.9 }}
          className="absolute z-20 cursor-pointer bg-transparent border-0 p-0"
          style={{ transform: "rotate(-25deg)" }}
        >
          {/* Enlarged invisible hit area for easy tapping */}
          <div className="relative flex items-center justify-center" style={{ width: 240, height: 100 }}>
            <div
              className="relative h-4 w-52 rounded-full"
              style={{
                background:
                  "linear-gradient(90deg, transparent 0%, oklch(0.95 0.1 80) 60%, white 100%)",
                boxShadow:
                  "0 0 40px white, 0 0 80px oklch(0.9 0.14 80), 0 0 120px oklch(0.85 0.16 60)",
              }}
            >
              <motion.span
                className="absolute right-0 top-1/2 -translate-y-1/2 text-5xl"
                animate={{ scale: [1, 1.25, 1] }}
                transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
              >
                ✨
              </motion.span>
            </div>
          </div>
        </motion.button>
      )}

      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 text-center pointer-events-none">
        {!caught ? (
          <>
            <h2 className="display text-5xl md:text-6xl text-white text-glow">A star just fell for you...</h2>
            <p className="hand text-xl text-white/85 mt-3">
              Catch it before it disappears, and make one little wish ✨
            </p>
          </>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.6 }}
            className="max-w-2xl pointer-events-auto"
          >
            <motion.div
              className="text-7xl mb-6"
              animate={{ scale: [1, 1.2, 1], rotate: [0, 8, -8, 0] }}
              transition={{ duration: 2.4, repeat: Infinity }}
            >
              🌠
            </motion.div>
            <p className="display text-3xl md:text-4xl text-white text-glow leading-relaxed">
              "I wished for someone like you before I even knew your name."
            </p>
            <div className="mt-10">
              <MagicButton onClick={onNext}>And then the music started →</MagicButton>
            </div>
          </motion.div>
        )}
      </div>
    </SceneShell>
  );
}
