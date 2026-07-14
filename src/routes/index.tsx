import { createFileRoute } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { HeartCursor } from "@/components/magic/HeartCursor";
import { Intro } from "@/scenes/Intro";
import { Welcome } from "@/scenes/Welcome";
import { ChildhoodTree } from "@/scenes/ChildhoodTree";
import { MemoryPath } from "@/scenes/MemoryPath";
import { BalloonGarden } from "@/scenes/BalloonGarden";
import { StoryBook } from "@/scenes/StoryBook";
import { Constellation } from "@/scenes/Constellation";
import { Wish } from "@/scenes/Wish";
import { Lyrics } from "@/scenes/Lyrics";
import { Finale } from "@/scenes/Finale";
import { BackgroundMusic } from "@/components/magic/BackgroundMusic";

export const Route = createFileRoute("/")({
  component: LittleWorld,
});

const SCENES = [
  "intro",
  "welcome",
  "tree",
  "path",
  "balloons",
  "book",
  "stars",
  "wish",
  "lyrics",
  "finale",
] as const;
type SceneKey = (typeof SCENES)[number];

function CloudFly() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] pointer-events-none"
      style={{ background: "linear-gradient(180deg, oklch(0.9 0.05 220), oklch(0.95 0.04 340))" }}
    >
      {Array.from({ length: 12 }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ x: "-40vw", y: `${Math.random() * 90}vh`, opacity: 0.9 }}
          animate={{ x: "110vw" }}
          transition={{ duration: 1.4, delay: i * 0.06, ease: "easeIn" }}
          className="absolute h-32 w-72 rounded-full bg-white/85 blur-2xl"
        />
      ))}
    </motion.div>
  );
}

function LittleWorld() {
  const [scene, setScene] = useState<SceneKey>("intro");
  const [flying, setFlying] = useState(false);

  useEffect(() => {
    document.body.style.cursor = "none";
    return () => { document.body.style.cursor = ""; };
  }, []);

  const advance = (to?: SceneKey) => {
    setFlying(true);
    setTimeout(() => {
      if (to) setScene(to);
      else {
        const idx = SCENES.indexOf(scene);
        setScene(SCENES[Math.min(idx + 1, SCENES.length - 1)]);
      }
      setTimeout(() => setFlying(false), 700);
    }, 900);
  };

  return (
    <div className="relative min-h-screen w-full">
      <HeartCursor />
      <BackgroundMusic mute={scene === "lyrics"} />



      {/* Scene chip nav */}
      <div className="fixed bottom-4 left-1/2 z-[80] -translate-x-1/2 glass rounded-full px-3 py-1.5 flex gap-1 max-w-[92vw] overflow-x-auto">
        {SCENES.map((s, i) => (
          <button
            key={s}
            onClick={() => advance(s)}
            className={`h-2.5 w-2.5 rounded-full transition ${
              s === scene ? "bg-pink-500 w-8" : "bg-white/60 hover:bg-white"
            }`}
            aria-label={`Scene ${i + 1}: ${s}`}
          />
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={scene}>
          {scene === "intro" && <Intro onEnter={() => advance("welcome")} />}
          {scene === "welcome" && <Welcome onNext={() => advance("tree")} />}
          {scene === "tree" && <ChildhoodTree onNext={() => advance("path")} />}
          {scene === "path" && <MemoryPath onNext={() => advance("balloons")} />}
          {scene === "balloons" && <BalloonGarden onNext={() => advance("book")} />}
          {scene === "book" && <StoryBook onNext={() => advance("stars")} />}
          {scene === "stars" && <Constellation onNext={() => advance("wish")} />}
          {scene === "wish" && <Wish onNext={() => advance("lyrics")} />}
          {scene === "lyrics" && <Lyrics onNext={() => advance("finale")} />}
          {scene === "finale" && <Finale onNext={() => advance("intro")} />}
        </motion.div>
      </AnimatePresence>

      <AnimatePresence>{flying && <CloudFly />}</AnimatePresence>
    </div>
  );
}
