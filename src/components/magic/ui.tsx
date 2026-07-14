import { motion } from "framer-motion";
import { forwardRef, type ReactNode } from "react";

export function SceneShell({ children, bg, className = "" }: { children: ReactNode; bg?: string; className?: string }) {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
      className={`relative min-h-screen w-full overflow-hidden ${className}`}
      style={bg ? { background: bg } : undefined}
    >
      {children}
    </motion.section>
  );
}

export const MagicButton = forwardRef<
  HTMLButtonElement,
  { children: ReactNode; onClick?: () => void; className?: string; glow?: boolean }
>(function MagicButton({ children, onClick, className = "", glow = false }, ref) {
  return (
    <motion.button
      ref={ref}
      whileHover={{ scale: 1.05, y: -2 }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      animate={
        glow
          ? {
              boxShadow: [
                "0 0 20px rgba(255,120,170,0.5)",
                "0 0 44px rgba(255,120,170,0.9)",
                "0 0 20px rgba(255,120,170,0.5)",
              ],
            }
          : undefined
      }
      transition={glow ? { duration: 2.4, repeat: Infinity, ease: "easeInOut" } : undefined}
      className={`btn-magic ${className}`}
    >
      {children}
    </motion.button>
  );
});

export function GlassCard({ children, className = "", dark = false }: { children: ReactNode; className?: string; dark?: boolean }) {
  return <div className={`${dark ? "glass-dark" : "glass"} rounded-3xl p-6 ${className}`}>{children}</div>;
}

export function SceneCaption({ children }: { children: ReactNode }) {
  return (
    <motion.p
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.2, delay: 0.4 }}
      className="hand text-3xl md:text-4xl text-white/90 text-glow"
    >
      {children}
    </motion.p>
  );
}
