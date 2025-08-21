import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

interface Feature2Props {
  title?: string;
  description?: string;
  imageSrc: string;
  imageAlt: string;
  buttonPrimary?: {
    label: string;
    href: string;
  };
  buttonSecondary?: {
    label: string;
    href: string;
  };
}

export const Feature2 = ({
  title = "Blocks built with Shadcn & Tailwind",
  description = "Hundreds of finely crafted components built with React, Tailwind and Shadcn UI. Developers can copy and paste these blocks directly into their project.",
  imageSrc = "https://shadcnblocks.com/images/block/placeholder-1.svg",
  imageAlt = "placeholder hero",
  buttonPrimary = {
    label: "Get Started",
    href: "https://shadcnblocks.com",
  },
  buttonSecondary = {
    label: "Learn More",
    href: "https://shadcnblocks.com",
  },
}: Feature2Props) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section className="pt-8 pb-4 md:pt-16 md:pb-8">
      <div className="container mx-auto px-4 md:px-6">
        <div className={`flex flex-col items-center text-center max-w-4xl mx-auto transition-all duration-700 delay-100 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          {/* Top Badge */}
          <div className={`mb-4 md:mb-6 transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
              📺 Watch us on Good Morning America
            </span>
          </div>
          
          <div className={`transition-all duration-700 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <img
              src={imageSrc}
              alt={imageAlt}
              className="w-full max-w-2xl rounded-lg object-cover shadow-lg mb-8 md:mb-12"
            />
          </div>
          <div className={`flex flex-col items-center text-center transition-all duration-700 delay-400 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl tracking-tighter font-bold mb-6 md:mb-8 leading-tight">
              It really is that legit
            </h1>
            <p className="mb-4 max-w-2xl text-muted-foreground text-base sm:text-lg md:text-xl leading-relaxed tracking-tight">
              A 2025 survey reported that approximately 65.3% of Tinder users identified as being in a relationship or married.
            </p>
            <p className="mb-2 text-sm text-muted-foreground/70 italic">
              –New York Post
            </p>
            <p className="mb-8 md:mb-10 max-w-2xl text-muted-foreground text-base sm:text-lg md:text-xl leading-relaxed tracking-tight">
              (luckily our AI-powered platform helps you discover the truth)
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
