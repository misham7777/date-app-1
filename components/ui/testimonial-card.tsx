"use client";

import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface TestimonialCardProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export const TestimonialCard = ({ 
  children, 
  className,
  delay = 0 
}: TestimonialCardProps) => {
  return (
    <div
      className={cn(
        "bg-white rounded-2xl shadow-sm hover:scale-105 transition-all duration-300 hover:shadow-lg transform-gpu",
        className
      )}
      style={{
        animationDelay: `${delay}ms`,
      }}
    >
      {children}
    </div>
  );
};
