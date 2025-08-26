"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowRight, Check } from "lucide-react";
import { useRouter } from "next/navigation";

interface StickyEmailInputProps {
  className?: string;
}

export const StickyEmailInput = ({ className }: StickyEmailInputProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [name, setName] = useState("");
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      const heroSection = document.querySelector('[data-hero-section]');
      if (heroSection) {
        const heroBottom = heroSection.getBoundingClientRect().bottom;
        const shouldShow = heroBottom < 0;
        setIsVisible(shouldShow);
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Check initial position

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      // Navigate to quiz with the name pre-filled
      router.push(`/quiz?name=${encodeURIComponent(name.trim())}`);
    }
  };

  return (
    <div
      className={cn(
        "fixed bottom-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out",
        isVisible 
          ? "opacity-100 translate-y-0" 
          : "opacity-0 translate-y-full pointer-events-none",
        className
      )}
    >
      <div className="bg-blue-900/60 backdrop-blur-sm p-4 shadow-lg w-full border-t border-blue-700/30">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col items-center text-center">
            <div className="flex items-center gap-3 mb-4">
              <h3 
                className={cn(
                  "text-white font-semibold text-lg transition-all duration-1000",
                  isVisible 
                    ? "opacity-100 translate-y-0 scale-100" 
                    : "opacity-0 translate-y-4 scale-95"
                )}
                style={{
                  animationDelay: isVisible ? "0.2s" : "0s",
                  textShadow: isVisible ? "0 0 20px rgba(59, 130, 246, 0.5)" : "none",
                }}
              >
                Who are you searching for?
              </h3>
              <span 
                className={cn(
                  "text-2xl transition-all duration-1000",
                  isVisible 
                    ? "opacity-100 translate-y-0 scale-100 rotate-0" 
                    : "opacity-0 translate-y-4 scale-75 rotate-12"
                )}
                style={{
                  animationDelay: isVisible ? "0.4s" : "0s",
                  filter: isVisible ? "drop-shadow(0 0 10px rgba(59, 130, 246, 0.6))" : "none",
                }}
              >
                🤔
              </span>
            </div>
            
            <form 
              onSubmit={handleSubmit} 
              className={cn(
                "flex gap-2 max-w-md w-full transition-all duration-1000",
                isVisible 
                  ? "opacity-100 translate-y-0 scale-100" 
                  : "opacity-0 translate-y-6 scale-95"
              )}
              style={{
                animationDelay: isVisible ? "0.6s" : "0s",
              }}
            >
              <Input
                type="text"
                placeholder="Enter first name only"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="flex-1 bg-white/90 border-blue-300 text-gray-900 placeholder-gray-600 focus:border-blue-500 focus:ring-blue-500"
                required
              />
              <Button
                type="submit"
                className="bg-white hover:bg-gray-100 text-blue-800 border border-blue-300 px-4 py-2 rounded-md transition-colors duration-200"
              >
                <ArrowRight className="w-4 h-4" />
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
