import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";

export default function CustomCursor() {
  const reduced = useReducedMotion();
  const [pos, setPos] = useState({ x: -100, y: -100 });

  useEffect(() => {
    const onMove = (event: PointerEvent) => {
      setPos({ x: event.clientX, y: event.clientY });
    };

    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  if (reduced) return null;

  return (
    <motion.div
      aria-hidden="true"
      animate={{ x: pos.x - 12, y: pos.y - 7 }}
      transition={{ type: "spring", stiffness: 180, damping: 23, mass: 0.3 }}
      className="pointer-events-none fixed left-0 top-0 z-50 hidden h-8 w-8 rounded-full border border-cyan-400/80 bg-cyan-400/10 shadow-[0_0_20px_rgba(34,211,238,0.35)] backdrop-blur-[1px] md:block"
    />
  );
}