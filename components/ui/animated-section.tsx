"use client";

import { cn } from "@/lib/utils";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { ReactNode } from "react";

interface AnimatedSectionProps {
  children: ReactNode;
  className?: string;
  animationType?: "fade-up" | "fade-in" | "slide-up" | "scale-in" | "slide-left" | "slide-right";
  delay?: number;
  duration?: number;
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
}

export const AnimatedSection = ({
  children,
  className,
  animationType = "fade-up",
  delay = 0,
  duration = 700,
  threshold = 0.1,
  rootMargin = "0px 0px -50px 0px",
  triggerOnce = true,
}: AnimatedSectionProps) => {
  const { ref, isVisible } = useScrollAnimation({
    threshold,
    rootMargin,
    triggerOnce,
  });

  const getAnimationClasses = () => {
    const baseClasses = "transition-all duration-700";
    
    switch (animationType) {
      case "fade-up":
        return cn(
          baseClasses,
          isVisible 
            ? "opacity-100 translate-y-0" 
            : "opacity-0 translate-y-8"
        );
      case "fade-in":
        return cn(
          baseClasses,
          isVisible 
            ? "opacity-100" 
            : "opacity-0"
        );
      case "slide-up":
        return cn(
          baseClasses,
          isVisible 
            ? "opacity-100 translate-y-0" 
            : "opacity-0 translate-y-12"
        );
      case "scale-in":
        return cn(
          baseClasses,
          isVisible 
            ? "opacity-100 scale-100" 
            : "opacity-0 scale-95"
        );
      case "slide-left":
        return cn(
          baseClasses,
          isVisible 
            ? "opacity-100 translate-x-0" 
            : "opacity-0 -translate-x-8"
        );
      case "slide-right":
        return cn(
          baseClasses,
          isVisible 
            ? "opacity-100 translate-x-0" 
            : "opacity-0 translate-x-8"
        );
      default:
        return cn(
          baseClasses,
          isVisible 
            ? "opacity-100 translate-y-0" 
            : "opacity-0 translate-y-8"
        );
    }
  };

  return (
    <div
      ref={ref}
      className={cn(
        getAnimationClasses(),
        className
      )}
      style={{
        transitionDelay: `${delay}ms`,
        transitionDuration: `${duration}ms`,
      }}
    >
      {children}
    </div>
  );
};
