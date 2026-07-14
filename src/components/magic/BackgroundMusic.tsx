import { useEffect, useRef } from "react";
import songAsset from "@/assets/osanam-bg.mp3.asset.json";

const TARGET = 0.35;

/**
 * Ambient background music. Uses a real <audio> element in the DOM so the
 * browser reliably loads and plays it. Autoplay is attempted; if the browser
 * blocks it, the very next user interaction starts playback. `mute` fades
 * volume and pauses the track (used during the Lyrics scene).
 */
export function BackgroundMusic({ mute = false }: { mute?: boolean }) {
  const ref = useRef<HTMLAudioElement | null>(null);
  const muteRef = useRef(mute);
  muteRef.current = mute;

  // One-time setup: try to play + register interaction fallback
  useEffect(() => {
    const a = ref.current;
    if (!a) return;
    a.loop = true;
    a.volume = muteRef.current ? 0 : TARGET;

    const tryPlay = () => {
      if (muteRef.current) return Promise.resolve();
      const p = a.play();
      return p && typeof p.then === "function" ? p : Promise.resolve();
    };

    let removed = false;
    const kick = () => {
      if (removed) return;
      tryPlay().then(() => {
        removed = true;
        window.removeEventListener("pointerdown", kick);
        window.removeEventListener("keydown", kick);
        window.removeEventListener("touchstart", kick);
        window.removeEventListener("scroll", kick);
      }).catch(() => {});
    };

    tryPlay().catch(() => {
      window.addEventListener("pointerdown", kick, { passive: true });
      window.addEventListener("keydown", kick);
      window.addEventListener("touchstart", kick, { passive: true });
      window.addEventListener("scroll", kick, { passive: true });
    });

    return () => {
      removed = true;
      window.removeEventListener("pointerdown", kick);
      window.removeEventListener("keydown", kick);
      window.removeEventListener("touchstart", kick);
      window.removeEventListener("scroll", kick);
    };
  }, []);

  // React to mute changes: instant volume + pause/resume
  useEffect(() => {
    const a = ref.current;
    if (!a) return;
    if (mute) {
      a.volume = 0;
      if (!a.paused) a.pause();
    } else {
      a.volume = TARGET;
      if (a.paused) a.play().catch(() => {});
    }
  }, [mute]);

  return (
    <audio
      ref={ref}
      src={songAsset.url}
      preload="auto"
      loop
      playsInline
      style={{ display: "none" }}
    />
  );
}
