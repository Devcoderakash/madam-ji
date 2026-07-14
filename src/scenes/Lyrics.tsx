import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import { Particles } from "@/components/magic/Particles";
import songAsset from "@/assets/lyrics-song.mp3.asset.json";
import mjChild from "@/assets/mj-child.jpg.asset.json";
import mjFloral from "@/assets/mj-floral.png.asset.json";
import mjSareeGrey from "@/assets/mj-saree-grey.png.asset.json";
import mjSareeBlack from "@/assets/mj-saree-black.png.asset.json";
import mjBlue from "@/assets/mj-blue.jpg.asset.json";
import { MagicButton, SceneShell } from "@/components/magic/ui";

/**
 * AUDIO-DRIVEN CUE TIMELINE
 * ─────────────────────────
 * The mp3 is the master clock. On every animation frame we read
 * `audio.currentTime` and choose the visual state whose cue window contains
 * that timestamp. Nothing here uses page timers, setTimeout, animation-delay,
 * or elapsed wall-clock time — so pausing, seeking, or replaying the song
 * keeps every visual perfectly in sync.
 *
 * Cue times were derived from onset analysis of the uploaded audio
 * (duration ≈ 30.15s). Each cue is an absolute second offset.
 */

type CueId =
  | "heartIntro"
  | "fourDays"
  | "spring"
  | "summer"
  | "autumn"
  | "winter"
  | "ohNoMaybe"
  | "threeDays"
  | "yesterday"
  | "today"
  | "tomorrow"
  | "howAbout"
  | "twoDays"
  | "day"
  | "night"
  | "oneDay"
  | "everyday"
  | "proposal";

interface Cue {
  time: number; // absolute seconds into the song
  id: CueId;
  lyric: string;
}

const CUES: Cue[] = [
  { time: 0.03, id: "heartIntro", lyric: "I can love you for 4 days" },
  { time: 5.7,  id: "spring",     lyric: "Spring 🌸" },
  { time: 7.0,  id: "summer",     lyric: "Summer ☀️" },
  { time: 8.0,  id: "autumn",     lyric: "Autumn 🍂" },
  { time: 9.0,  id: "winter",     lyric: "Winter ❄️" },
  { time: 10.0, id: "ohNoMaybe",  lyric: "Oh no, maybe…" },
  { time: 12.0, id: "threeDays",  lyric: "3 days" },
  { time: 15.0, id: "yesterday",  lyric: "Yesterday 🌅" },
  { time: 15.5, id: "today",      lyric: "Today ☀️" },
  { time: 16.2, id: "tomorrow",   lyric: "Tomorrow 🌙" },
  { time: 17.5, id: "howAbout",   lyric: "How about…" },
  { time: 22.0, id: "twoDays",    lyric: "2 days" },
  { time: 22.6, id: "day",        lyric: "Day ☀️" },
  { time: 23.4, id: "night",      lyric: "…and Night 🌙" },
  { time: 25.0, id: "oneDay",     lyric: "Maybe one day is enough" },
  { time: 27.0, id: "everyday",   lyric: "Everyday" },
  { time: 29.5, id: "proposal",   lyric: "Wow. 💍" },
];

const PHOTOS = [mjChild.url, mjFloral.url, mjSareeGrey.url, mjSareeBlack.url, mjBlue.url];

const BG: Record<CueId, string> = {
  heartIntro: "radial-gradient(120% 80% at 50% 60%, oklch(0.45 0.12 340) 0%, oklch(0.18 0.06 280) 60%, #000 100%)",
  fourDays:   "linear-gradient(180deg, oklch(0.5 0.1 320), oklch(0.28 0.08 280))",
  spring:     "linear-gradient(180deg, oklch(0.9 0.08 340), oklch(0.85 0.12 140))",
  summer:     "linear-gradient(180deg, oklch(0.9 0.14 90), oklch(0.8 0.15 60))",
  autumn:     "linear-gradient(180deg, oklch(0.8 0.16 50), oklch(0.65 0.14 30))",
  winter:     "linear-gradient(180deg, oklch(0.92 0.03 240), oklch(0.8 0.05 260))",
  ohNoMaybe:  "radial-gradient(100% 100% at 50% 50%, oklch(0.5 0.14 320), oklch(0.16 0.06 280))",
  threeDays:  "linear-gradient(180deg, oklch(0.6 0.1 60), oklch(0.3 0.1 280))",
  yesterday:  "linear-gradient(180deg, oklch(0.75 0.14 40), oklch(0.35 0.1 300))",
  today:      "linear-gradient(180deg, oklch(0.85 0.14 80), oklch(0.4 0.1 260))",
  tomorrow:   "linear-gradient(180deg, oklch(0.3 0.08 260), oklch(0.12 0.05 280))",
  howAbout:   "linear-gradient(180deg, oklch(0.25 0.08 260), oklch(0.1 0.05 280))",
  twoDays:    "linear-gradient(90deg, oklch(0.7 0.14 80) 0%, oklch(0.18 0.06 260) 100%)",
  day:        "linear-gradient(90deg, oklch(0.85 0.14 80) 0%, oklch(0.5 0.1 260) 100%)",
  night:      "linear-gradient(90deg, oklch(0.5 0.1 260) 0%, oklch(0.12 0.06 280) 100%)",
  oneDay:     "radial-gradient(60% 60% at 50% 55%, oklch(0.5 0.18 20) 0%, oklch(0.18 0.06 300) 100%)",
  everyday:   "radial-gradient(120% 100% at 50% 100%, oklch(0.35 0.12 320) 0%, oklch(0.12 0.05 280) 100%)",
  proposal:   "radial-gradient(80% 80% at 50% 60%, oklch(0.7 0.14 60) 0%, oklch(0.22 0.08 320) 100%)",
};

function cueIndexAt(t: number): number {
  // Largest cue whose time <= t. Binary search would be fine; linear is trivial here.
  let idx = 0;
  for (let i = 0; i < CUES.length; i++) if (t >= CUES[i].time) idx = i;
  return idx;
}

export function Lyrics({ onNext }: { onNext: () => void }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [started, setStarted] = useState(false);
  const [cueIdx, setCueIdx] = useState(0);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(30.15);
  const [ended, setEnded] = useState(false);
  const [paused, setPaused] = useState(true);

  // Create audio element once. Everything derives from audio.currentTime.
  useEffect(() => {
    const audio = new Audio(songAsset.url);
    audio.preload = "auto";
    audio.volume = 0.95;
    audioRef.current = audio;

    const onLoaded = () => setDuration(audio.duration || 30.15);
    const onEnded = () => { setEnded(true); setPaused(true); };
    const onPause = () => setPaused(true);
    const onPlay = () => { setPaused(false); setEnded(false); };
    audio.addEventListener("loadedmetadata", onLoaded);
    audio.addEventListener("ended", onEnded);
    audio.addEventListener("pause", onPause);
    audio.addEventListener("play", onPlay);
    return () => {
      audio.removeEventListener("loadedmetadata", onLoaded);
      audio.removeEventListener("ended", onEnded);
      audio.removeEventListener("pause", onPause);
      audio.removeEventListener("play", onPlay);
      audio.pause();
      audio.src = "";
      audioRef.current = null;
    };
  }, []);

  // Master-clock loop: on every frame, read audio.currentTime and pick the
  // matching cue. Because state is a pure function of currentTime, seeking
  // backward or replaying resyncs automatically — no fired-once flags needed.
  useEffect(() => {
    if (!started) return;
    let raf = 0;
    const tick = () => {
      const a = audioRef.current;
      if (a) {
        const t = a.currentTime;
        setTime(t);
        const idx = cueIndexAt(t);
        setCueIdx((prev) => (prev === idx ? prev : idx));
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [started]);

  const handleStart = async () => {
    const a = audioRef.current;
    if (!a) return;
    try {
      a.currentTime = 0;
      await a.play();
    } catch {
      /* visuals will still tick */
    }
    setStarted(true);
  };

  const togglePlay = async () => {
    const a = audioRef.current;
    if (!a) return;
    if (a.paused) {
      if (ended) a.currentTime = 0;
      await a.play().catch(() => {});
    } else {
      a.pause();
    }
  };

  const replay = async () => {
    const a = audioRef.current;
    if (!a) return;
    a.currentTime = 0;
    setEnded(false);
    await a.play().catch(() => {});
  };

  const seek = (frac: number) => {
    const a = audioRef.current;
    if (!a || !a.duration) return;
    a.currentTime = Math.max(0, Math.min(a.duration - 0.05, frac * a.duration));
  };

  const cue = CUES[cueIdx];
  const photos = useMemo(() => PHOTOS, []);

  const showFinaleBtn = cue.id === "proposal" || ended;

  return (
    <SceneShell bg={BG[cue.id]}>
      <Particles variant="fireflies" count={16} />
      <Particles variant="petals" count={14} />
      <Particles variant="butterflies" count={6} />

      <AnimatePresence>
        {!started && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0 z-30 flex flex-col items-center justify-center gap-6 backdrop-blur-md"
            style={{ background: "radial-gradient(60% 60% at 50% 50%, oklch(0.3 0.1 320 / 0.6), oklch(0.08 0.04 280 / 0.9))" }}
          >
            <motion.div
              animate={{ scale: [1, 1.08, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-8xl"
              style={{ filter: "drop-shadow(0 0 60px oklch(0.9 0.22 20))" }}
            >
              💖
            </motion.div>
            <p className="hand text-3xl text-pink-200 text-glow">the music is ready…</p>
            <MagicButton onClick={handleStart}>💖 Start Journey</MagicButton>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cinematic wrapper — subtle camera per cue */}
      <motion.div
        className="absolute inset-0"
        animate={{
          scale:
            cue.id === "heartIntro" ? 1.05 :
            cue.id === "ohNoMaybe"  ? 1.08 :
            cue.id === "oneDay"     ? 1.04 :
            cue.id === "proposal"   ? 1.2  :
            1,
          rotate: cue.id === "ohNoMaybe" ? 4 : 0,
        }}
        transition={{ duration: 0.9, ease: "easeOut" }}
      >
        {/* All cue layers are mounted; opacity crossfade keeps it continuous. */}

        <CueLayer active={cue.id === "heartIntro" || cue.id === "fourDays"}>
          <Center>
            <div className="relative">
              {/* radiant halo rings */}
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="absolute inset-0 m-auto rounded-full"
                  style={{
                    width: 280, height: 280,
                    border: "2px solid oklch(0.9 0.22 20 / 0.35)",
                    filter: "blur(1px)",
                  }}
                  animate={{ scale: [1, 2.2], opacity: [0.7, 0] }}
                  transition={{ duration: 2.4, repeat: Infinity, delay: i * 0.8, ease: "easeOut" }}
                />
              ))}
              <motion.div
                animate={{ scale: [0.95, 1.14, 0.95] }}
                transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
                className="text-[13rem] relative"
                style={{ filter: "drop-shadow(0 0 140px oklch(0.9 0.26 20))" }}
              >
                ❤️
              </motion.div>
              {/* orbiting tiny hearts */}
              {Array.from({ length: 8 }).map((_, i) => {
                const a = (i / 8) * Math.PI * 2;
                return (
                  <motion.div
                    key={i}
                    className="absolute top-1/2 left-1/2 text-2xl"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 10 + i, repeat: Infinity, ease: "linear" }}
                    style={{ transformOrigin: `${140 + (i % 2) * 20}px 0` }}
                  >
                    <span style={{ transform: `rotate(${(a * 180) / Math.PI}deg)`, display: "inline-block" }}>💗</span>
                  </motion.div>
                );
              })}
            </div>
          </Center>
        </CueLayer>

        {/* Four seasons — all islands present, only active one glows */}
        <CueLayer active={["spring", "summer", "autumn", "winter"].includes(cue.id)}>
          <SeasonIslands active={cue.id as any} />
        </CueLayer>

        <CueLayer active={cue.id === "ohNoMaybe" || cue.id === "threeDays"}>
          <Center>
            <div className="relative">
              <motion.div
                animate={{ rotate: 360, scale: [1, 1.1, 1] }}
                transition={{ rotate: { duration: 3, ease: "linear", repeat: Infinity }, scale: { duration: 1.6, repeat: Infinity } }}
                className="text-[10rem]"
                style={{ filter: "drop-shadow(0 0 100px oklch(0.9 0.18 320))" }}
              >
                ✨
              </motion.div>
              {Array.from({ length: 24 }).map((_, i) => {
                const a = (i / 24) * Math.PI * 2;
                const r = 160 + (i % 3) * 30;
                return (
                  <motion.div
                    key={i}
                    className="absolute w-1.5 h-1.5 rounded-full bg-white"
                    style={{
                      left: `calc(50% + ${Math.cos(a) * r}px)`,
                      top: `calc(50% + ${Math.sin(a) * r}px)`,
                      boxShadow: "0 0 12px white",
                    }}
                    animate={{ opacity: [0.2, 1, 0.2], scale: [0.6, 1.4, 0.6] }}
                    transition={{ duration: 1.6 + (i % 4) * 0.2, repeat: Infinity, delay: (i % 6) * 0.1 }}
                  />
                );
              })}
            </div>
          </Center>
        </CueLayer>

        {/* Three doors — always visible, active one glows */}
        <CueLayer active={["yesterday", "today", "tomorrow"].includes(cue.id)}>
          <ThreeDoors active={cue.id as any} />
        </CueLayer>

        <CueLayer active={cue.id === "howAbout"}>
          <div className="absolute inset-0">
            {Array.from({ length: 80 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full bg-white"
                style={{
                  width: 2 + Math.random() * 3,
                  height: 2 + Math.random() * 3,
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  boxShadow: "0 0 12px white",
                }}
                animate={{ opacity: [0.1, 1, 0.1] }}
                transition={{ duration: 2 + Math.random() * 2, repeat: Infinity, delay: Math.random() * 2 }}
              />
            ))}
          </div>
        </CueLayer>

        {/* Two days: sun & moon orbit each other; active side glows */}
        <CueLayer active={["twoDays", "day", "night"].includes(cue.id)}>
          <DayNightOrbit active={cue.id as any} />
        </CueLayer>

        <CueLayer active={cue.id === "oneDay"}>
          <Center>
            <div className="relative">
              {[0, 1].map((i) => (
                <motion.div
                  key={i}
                  className="absolute inset-0 m-auto rounded-full"
                  style={{ width: 320, height: 320, border: "2px solid oklch(0.9 0.24 20 / 0.5)" }}
                  animate={{ scale: [1, 2.4], opacity: [0.6, 0] }}
                  transition={{ duration: 1.6, repeat: Infinity, delay: i * 0.55, ease: "easeOut" }}
                />
              ))}
              <motion.div
                animate={{ scale: [1, 1.22, 1, 1.15, 1] }}
                transition={{ duration: 1.05, repeat: Infinity, ease: "easeInOut" }}
                className="text-[15rem] relative"
                style={{ filter: "drop-shadow(0 0 160px oklch(0.85 0.26 20))" }}
              >
                ❤️
              </motion.div>
            </div>
          </Center>
        </CueLayer>

        <CueLayer active={cue.id === "everyday"}>
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              animate={{ scale: [1, 1.14, 1], rotate: [0, 4, -4, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="text-[9rem] absolute z-10"
              style={{ filter: "drop-shadow(0 0 120px oklch(0.85 0.24 20))" }}
            >
              💗
            </motion.div>
            <motion.div
              className="absolute inset-0"
              animate={{ rotate: 360 }}
              transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
            >
              {photos.concat(photos).map((src, i, arr) => {
                const angle = (i / arr.length) * Math.PI * 2;
                const radius = 220 + (i % 2) * 60;
                return (
                  <motion.div
                    key={i}
                    className="absolute rounded-2xl overflow-hidden glass"
                    style={{
                      width: 96,
                      height: 128,
                      left: `calc(50% + ${Math.cos(angle) * radius}px - 48px)`,
                      top:  `calc(50% + ${Math.sin(angle) * radius}px - 64px)`,
                      boxShadow: "0 20px 60px oklch(0.15 0.05 300 / 0.6), 0 0 30px oklch(0.9 0.14 340 / 0.55)",
                    }}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.6, delay: i * 0.05, ease: "backOut" }}
                  >
                    <img src={src} alt="" loading="lazy" decoding="async" className="w-full h-full object-cover" />
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </CueLayer>

        <CueLayer active={cue.id === "proposal"}>
          <Center>
            <div className="relative">
              {/* sparkle ring */}
              <motion.div
                className="absolute inset-0 m-auto"
                style={{ width: 400, height: 400 }}
                animate={{ rotate: 360 }}
                transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
              >
                {Array.from({ length: 16 }).map((_, i) => {
                  const a = (i / 16) * Math.PI * 2;
                  return (
                    <div
                      key={i}
                      className="absolute w-2 h-2 rounded-full bg-amber-200"
                      style={{
                        left: `calc(50% + ${Math.cos(a) * 200}px - 4px)`,
                        top:  `calc(50% + ${Math.sin(a) * 200}px - 4px)`,
                        boxShadow: "0 0 18px oklch(0.9 0.22 80)",
                      }}
                    />
                  );
                })}
              </motion.div>
              <motion.div
                animate={{ scale: [1, 1.2, 1.05], rotate: [-4, 4, -4] }}
                transition={{ duration: 2.2, ease: "easeInOut", repeat: Infinity }}
                className="text-[17rem] relative"
                style={{ filter: "drop-shadow(0 0 180px oklch(0.9 0.24 60))" }}
              >
                💍
              </motion.div>
            </div>
          </Center>
        </CueLayer>
      </motion.div>

      {/* Lyric line — key on cue.id so it crossfades exactly at cue crossings */}
      <div className="pointer-events-none absolute inset-x-0 bottom-28 z-10 text-center px-6">
        <AnimatePresence mode="wait">
          <motion.p
            key={cue.id}
            initial={{ opacity: 0, y: 24, letterSpacing: "0.2em" }}
            animate={{ opacity: 1, y: 0, letterSpacing: "0.02em" }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="display text-3xl md:text-6xl text-white text-glow"
          >
            {cue.lyric}
          </motion.p>
        </AnimatePresence>
      </div>

      {/* Transport — pause / replay / seek. All resync automatically. */}
      {started && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3 w-[80vw] max-w-lg">
          <button
            onClick={togglePlay}
            className="glass rounded-full w-10 h-10 flex items-center justify-center text-white text-lg"
            aria-label={paused ? "Play" : "Pause"}
          >
            {paused ? "▶" : "❚❚"}
          </button>
          <button
            onClick={replay}
            className="glass rounded-full w-10 h-10 flex items-center justify-center text-white text-sm"
            aria-label="Replay"
          >
            ↺
          </button>
          <div
            className="relative flex-1 h-2 rounded-full bg-white/15 cursor-pointer overflow-hidden"
            onClick={(e) => {
              const r = e.currentTarget.getBoundingClientRect();
              seek((e.clientX - r.left) / r.width);
            }}
          >
            <div
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-pink-300 via-fuchsia-300 to-amber-200"
              style={{ width: `${Math.min(100, (time / duration) * 100)}%` }}
            />
          </div>
          <div className="font-mono text-xs text-white/85 tabular-nums whitespace-nowrap min-w-[86px] text-right text-glow">
            {fmt(time)} / {fmt(duration)}
          </div>
        </div>
      )}


      {showFinaleBtn && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="absolute bottom-20 left-0 right-0 z-20 flex justify-center"
        >
          <MagicButton onClick={onNext}>The moon has something to say →</MagicButton>
        </motion.div>
      )}
    </SceneShell>
  );
}

function CueLayer({ active, children }: { active: boolean; children: React.ReactNode }) {
  return (
    <motion.div
      className="absolute inset-0"
      animate={{ opacity: active ? 1 : 0 }}
      transition={{ duration: 0.45, ease: "easeInOut" }}
      style={{ pointerEvents: active ? "auto" : "none" }}
    >
      {children}
    </motion.div>
  );
}

function fmt(s: number) {
  if (!isFinite(s) || s < 0) s = 0;
  const m = Math.floor(s / 60);
  const r = Math.floor(s % 60);
  const ms = Math.floor((s - Math.floor(s)) * 10);
  return `${m}:${r.toString().padStart(2, "0")}.${ms}`;
}

function Center({ children }: { children: React.ReactNode }) {
  return <div className="flex items-center justify-center h-full">{children}</div>;
}

function Big({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ scale: 0.4, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.6, ease: "backOut" }}
      className="display text-[16rem] md:text-[22rem] text-white text-glow leading-none"
      style={{ filter: "drop-shadow(0 0 80px oklch(0.9 0.2 340))" }}
    >
      {children}
    </motion.div>
  );
}

function Season({ emoji, name }: { emoji: string; name: string }) {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-6">
      <motion.div
        initial={{ scale: 0.3, rotate: -20, opacity: 0 }}
        animate={{ scale: 1, rotate: 0, opacity: 1 }}
        transition={{ duration: 0.55, ease: "backOut" }}
        className="text-[12rem]"
        style={{ filter: "drop-shadow(0 0 80px oklch(0.9 0.2 340))" }}
      >
        {emoji}
      </motion.div>
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="display text-4xl md:text-6xl text-white text-glow"
      >
        {name}
      </motion.div>
    </div>
  );
}

const SEASONS = [
  { id: "spring", emoji: "🌸", name: "Spring", glow: "oklch(0.9 0.18 340)" },
  { id: "summer", emoji: "☀️", name: "Summer", glow: "oklch(0.9 0.22 80)" },
  { id: "autumn", emoji: "🍂", name: "Autumn", glow: "oklch(0.85 0.2 50)" },
  { id: "winter", emoji: "❄️", name: "Winter", glow: "oklch(0.92 0.1 240)" },
] as const;

function SeasonIslands({ active }: { active: string }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      {SEASONS.map((s, i) => {
        const a = (i / SEASONS.length) * Math.PI * 2 - Math.PI / 2;
        const r = 240;
        const isActive = active === s.id;
        return (
          <motion.div
            key={s.id}
            className="absolute flex flex-col items-center gap-2"
            style={{
              left: `calc(50% + ${Math.cos(a) * r}px)`,
              top:  `calc(50% + ${Math.sin(a) * r}px)`,
              transform: "translate(-50%, -50%)",
            }}
            animate={{
              y: [0, -10, 0],
              scale: isActive ? 1.35 : 0.85,
              opacity: isActive ? 1 : 0.35,
              filter: isActive
                ? `drop-shadow(0 0 60px ${s.glow}) drop-shadow(0 0 120px ${s.glow})`
                : "drop-shadow(0 0 8px rgba(0,0,0,0.4))",
            }}
            transition={{
              y: { duration: 3 + i * 0.4, repeat: Infinity, ease: "easeInOut" },
              scale: { duration: 0.6, ease: "backOut" },
              opacity: { duration: 0.6 },
              filter: { duration: 0.6 },
            }}
          >
            <div className="text-[7rem] leading-none">{s.emoji}</div>
            <div className="display text-2xl md:text-3xl text-white text-glow">{s.name}</div>
          </motion.div>
        );
      })}
    </div>
  );
}

const DOORS = [
  { id: "yesterday", emoji: "🌅", name: "Yesterday", glow: "oklch(0.8 0.18 40)" },
  { id: "today",     emoji: "☀️", name: "Today",     glow: "oklch(0.9 0.22 80)" },
  { id: "tomorrow",  emoji: "🌙", name: "Tomorrow",  glow: "oklch(0.75 0.14 260)" },
] as const;

function ThreeDoors({ active }: { active: string }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center gap-8 md:gap-16 px-6">
      {DOORS.map((d) => {
        const isActive = active === d.id;
        return (
          <motion.div
            key={d.id}
            className="glass rounded-t-[6rem] rounded-b-3xl flex flex-col items-center justify-end pb-6 pt-10 relative overflow-hidden"
            style={{
              width: 160, height: 260,
              background: isActive
                ? `radial-gradient(80% 100% at 50% 40%, ${d.glow} 0%, oklch(0.2 0.05 300 / 0.6) 80%)`
                : "oklch(0.18 0.04 280 / 0.4)",
            }}
            animate={{
              scale: isActive ? 1.08 : 0.92,
              opacity: isActive ? 1 : 0.45,
              y: [0, -6, 0],
              boxShadow: isActive
                ? `0 0 80px ${d.glow}, 0 20px 60px oklch(0 0 0 / 0.5)`
                : "0 10px 30px oklch(0 0 0 / 0.4)",
            }}
            transition={{
              scale: { duration: 0.5, ease: "backOut" },
              opacity: { duration: 0.5 },
              y: { duration: 4, repeat: Infinity, ease: "easeInOut" },
            }}
          >
            <div className="text-7xl">{d.emoji}</div>
            <div className="display text-xl text-white text-glow mt-3">{d.name}</div>
          </motion.div>
        );
      })}
    </div>
  );
}

function DayNightOrbit({ active }: { active: string }) {
  const dayActive = active === "day" || active === "twoDays";
  const nightActive = active === "night" || active === "twoDays";
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <motion.div
        className="relative"
        style={{ width: 480, height: 480 }}
        animate={{ rotate: 360 }}
        transition={{ duration: 14, repeat: Infinity, ease: "linear" }}
      >
        <motion.div
          className="absolute left-1/2 top-0 -translate-x-1/2 text-[8rem]"
          animate={{
            scale: dayActive ? 1.15 : 0.85,
            filter: dayActive
              ? "drop-shadow(0 0 80px oklch(0.9 0.24 80)) drop-shadow(0 0 160px oklch(0.9 0.24 80))"
              : "drop-shadow(0 0 12px rgba(0,0,0,0.4))",
            opacity: dayActive ? 1 : 0.4,
          }}
          transition={{ duration: 0.5 }}
        >
          <motion.span
            style={{ display: "inline-block" }}
            animate={{ rotate: -360 }}
            transition={{ duration: 14, repeat: Infinity, ease: "linear" }}
          >☀️</motion.span>
        </motion.div>
        <motion.div
          className="absolute left-1/2 bottom-0 -translate-x-1/2 text-[8rem]"
          animate={{
            scale: nightActive ? 1.15 : 0.85,
            filter: nightActive
              ? "drop-shadow(0 0 80px oklch(0.75 0.16 260)) drop-shadow(0 0 160px oklch(0.75 0.16 260))"
              : "drop-shadow(0 0 12px rgba(0,0,0,0.4))",
            opacity: nightActive ? 1 : 0.4,
          }}
          transition={{ duration: 0.5 }}
        >
          <motion.span
            style={{ display: "inline-block" }}
            animate={{ rotate: -360 }}
            transition={{ duration: 14, repeat: Infinity, ease: "linear" }}
          >🌙</motion.span>
        </motion.div>
      </motion.div>
    </div>
  );
}
