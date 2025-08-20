"use client";

import { MoveRight, PhoneCall } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { HeroHighlight, Highlight } from "@/components/ui/hero-highlight";
import Image from "next/image";
import { useEffect, useState } from "react";

function Hero() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <HeroHighlight>
      <div className="w-full pt-16 pb-8 md:pt-32 md:pb-20 lg:pt-40 lg:pb-40">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 gap-6 md:gap-8 items-center lg:grid-cols-2">
            <div className="flex gap-4 flex-col order-1 lg:order-1">
              <div className={`transition-all duration-700 delay-100 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                <Badge variant="outline" className="animate-pulse">We&apos;re live!</Badge>
              </div>
              <div className={`flex gap-3 flex-col transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl tracking-tighter text-left font-bold leading-tight">
                  This is the start of something!
                </h1>
                <p className="text-base sm:text-lg md:text-xl leading-relaxed tracking-tight text-muted-foreground text-left">
                  Managing a small business today is already tough. Avoid further
                  complications by ditching outdated, tedious trade methods.{" "}
                  <Highlight className="text-black dark:text-white">
                    Our goal is to streamline SMB trade, making it easier and faster than ever.
                  </Highlight>
                </p>
              </div>
              <div className={`flex flex-col sm:flex-row gap-3 w-full transition-all duration-700 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                <Button size="lg" className="gap-3 w-full sm:w-auto text-sm sm:text-base hover:scale-105 transition-transform duration-300" variant="outline">
                  Jump on a call <PhoneCall className="w-4 h-4" />
                </Button>
                <Button size="lg" className="gap-3 w-full sm:w-auto text-sm sm:text-base hover:scale-105 transition-transform duration-300">
                  Sign up here <MoveRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <div className={`grid grid-cols-2 gap-3 sm:gap-4 md:gap-6 lg:gap-8 order-2 lg:order-2 transition-all duration-1000 delay-400 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
              {/* First Image - Profile 1 */}
              <div className="relative aspect-square rounded-2xl md:rounded-3xl overflow-hidden shadow-lg md:shadow-2xl border-2 md:border-4 border-white/20 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 hover:scale-105 transition-all duration-500 hover:shadow-2xl hover:shadow-blue-500/20 group">
                <Image
                  src="/hero-images/profile-1.png"
                  alt="Dating app interface showing user profiles and status"
                  fill
                  className="object-contain p-1 md:p-2 group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-transparent to-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              
              {/* Second Image - Profile 2 (Larger) */}
              <div className="relative row-span-2 rounded-2xl md:rounded-3xl overflow-hidden shadow-lg md:shadow-2xl border-2 md:border-4 border-white/20 bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 hover:scale-105 transition-all duration-500 hover:shadow-2xl hover:shadow-red-500/20 group">
                <Image
                  src="/hero-images/profile-2.png"
                  alt="Dating app profile card with user photo and details"
                  fill
                  className="object-contain p-1.5 md:p-3 group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-transparent to-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              
              {/* Third Image - Map Interface */}
              <div className="relative aspect-square rounded-2xl md:rounded-3xl overflow-hidden shadow-lg md:shadow-2xl border-2 md:border-4 border-white/20 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 hover:scale-105 transition-all duration-500 hover:shadow-2xl hover:shadow-green-500/20 group">
                <Image
                  src="/hero-images/map-interface.png"
                  alt="Location tracking interface with map and user locations"
                  fill
                  className="object-contain p-1 md:p-2 group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-transparent to-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </HeroHighlight>
  );
}

export { Hero };
