"use client";
import { cn } from "@/lib/utils";
import { useMotionValue, motion, useMotionTemplate } from "framer-motion";
import React from "react";

export const GlobalBackground = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({
    currentTarget,
    clientX,
    clientY,
  }: React.MouseEvent<HTMLDivElement>) {
    if (!currentTarget) return;
    const { left, top } = currentTarget.getBoundingClientRect();

    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  const dotPattern = (color: string) => ({
    backgroundImage: `radial-gradient(circle, ${color} 1px, transparent 1px)`,
    backgroundSize: '16px 16px',
  });

  return (
    <div
      className={cn(
        "relative min-h-screen bg-white dark:bg-black w-full group",
        className
      )}
      onMouseMove={handleMouseMove}
    >
      <div 
        className="absolute inset-0 pointer-events-none opacity-30" 
        style={dotPattern('rgb(212 212 212)')} // neutral-300 for light mode
      />
      <div 
        className="absolute inset-0 dark:opacity-30 opacity-0 pointer-events-none" 
        style={dotPattern('rgb(38 38 38)')} // neutral-800 for dark mode
      />
      <motion.div
        className="pointer-events-none absolute inset-0 opacity-0 transition duration-300 group-hover:opacity-100"
        style={{
          ...dotPattern('rgb(99 102 241)'), // indigo-500
          WebkitMaskImage: useMotionTemplate`
            radial-gradient(
              200px circle at ${mouseX}px ${mouseY}px,
              black 0%,
              transparent 100%
            )
          `,
          maskImage: useMotionTemplate`
            radial-gradient(
              200px circle at ${mouseX}px ${mouseY}px,
              black 0%,
              transparent 100%
            )
          `,
        }}
      />

      <div className="relative z-20">{children}</div>
    </div>
  );
};
