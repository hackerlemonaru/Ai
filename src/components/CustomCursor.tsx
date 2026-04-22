"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function CustomCursor() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", updateMousePosition);

    return () => {
      window.removeEventListener("mousemove", updateMousePosition);
    };
  }, []);

  return (
    <>
      <motion.div
        className="fixed top-0 left-0 w-4 h-4 bg-primary-accent rounded-full pointer-events-none z-50 mix-blend-difference"
        animate={{
          x: mousePosition.x - 8,
          y: mousePosition.y - 8,
        }}
        transition={{ type: "tween", ease: "backOut", duration: 0.15 }}
      />
      <motion.div
        className="fixed top-0 left-0 w-10 h-10 border border-primary-accent rounded-full pointer-events-none z-50 mix-blend-difference opacity-50"
        animate={{
          x: mousePosition.x - 20,
          y: mousePosition.y - 20,
        }}
        transition={{ type: "tween", ease: "circOut", duration: 0.4 }}
      />
    </>
  );
}
