import { MoveRight, PhoneCall } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { HeroHighlight, Highlight } from "@/components/ui/hero-highlight";
import Image from "next/image";

function Hero() {
  return (
    <HeroHighlight>
      <div className="w-full pt-16 pb-8 md:pt-32 md:pb-20 lg:pt-40 lg:pb-40">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 gap-6 md:gap-8 items-center lg:grid-cols-2">
            <div className="flex gap-4 flex-col order-1 lg:order-1">
              <div>
                <Badge variant="outline">We&apos;re live!</Badge>
              </div>
              <div className="flex gap-3 flex-col">
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
              <div className="flex flex-col sm:flex-row gap-3 w-full">
                <Button size="lg" className="gap-3 w-full sm:w-auto text-sm sm:text-base" variant="outline">
                  Jump on a call <PhoneCall className="w-4 h-4" />
                </Button>
                <Button size="lg" className="gap-3 w-full sm:w-auto text-sm sm:text-base">
                  Sign up here <MoveRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:gap-4 md:gap-6 lg:gap-8 order-2 lg:order-2">
              <div className="relative aspect-square rounded-2xl md:rounded-3xl overflow-hidden shadow-lg md:shadow-2xl border-2 md:border-4 border-white/20 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900">
                <Image
                  src="/hero-images/profile-1.png"
                  alt="Dating app interface showing user profiles and status"
                  fill
                  className="object-contain p-1 md:p-2"
                />
              </div>
              <div className="relative row-span-2 rounded-2xl md:rounded-3xl overflow-hidden shadow-lg md:shadow-2xl border-2 md:border-4 border-white/20 bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20">
                <Image
                  src="/hero-images/profile-2.png"
                  alt="Dating app profile card with user photo and details"
                  fill
                  className="object-contain p-1.5 md:p-3"
                />
              </div>
              <div className="relative aspect-square rounded-2xl md:rounded-3xl overflow-hidden shadow-lg md:shadow-2xl border-2 md:border-4 border-white/20 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20">
                <Image
                  src="/hero-images/map-interface.png"
                  alt="Location tracking interface with map and user locations"
                  fill
                  className="object-contain p-1 md:p-2"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </HeroHighlight>
  );
}

export { Hero };
