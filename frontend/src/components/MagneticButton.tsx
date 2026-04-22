"use client";

import { useRef, useState } from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

interface MagneticButtonProps extends HTMLMotionProps<"button"> {
  children: React.ReactNode;
}

export default function MagneticButton({ children, className, ...props }: MagneticButtonProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!buttonRef.current) return;

    const { clientX, clientY } = e;
    const { height, width, left, top } = buttonRef.current.getBoundingClientRect();
    const x = clientX - (left + width / 2);
    const y = clientY - (top + height / 2);

    setPosition({ x: x * 0.3, y: y * 0.3 });
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  return (
    <motion.button
      ref={buttonRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
      className={twMerge(
        clsx(
          "relative px-6 py-3 rounded-full font-semibold overflow-hidden group transition-colors",
          "bg-white/5 border border-white/10 text-white hover:border-[var(--primary-accent)] hover:text-[var(--primary-accent)]",
          className
        )
      )}
      {...props}
    >
      <span className="relative z-10 block">{children}</span>
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[var(--primary-accent)] to-transparent opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
    </motion.button>
  );
}
