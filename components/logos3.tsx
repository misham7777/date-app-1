"use client";

import { useEffect, useState } from "react";
import AutoScroll from "embla-carousel-auto-scroll";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

interface Logo {
  id: string;
  description: string;
  image: string;
  className?: string;
}

interface Logos3Props {
  heading?: string;
  logos?: Logo[];
  className?: string;
}

const Logos3 = ({
  heading = "Featured in",
  logos = [
    {
      id: "logo-1",
      description: "Facebook",
      image: "/icons/fb-icon.png",
      className: "h-8 w-auto",
    },
    {
      id: "logo-2",
      description: "Instagram",
      image: "/icons/ig-icon.png",
      className: "h-8 w-auto",
    },
    {
      id: "logo-3",
      description: "TikTok",
      image: "/icons/tiktok-icon.png",
      className: "h-8 w-auto",
    },
    {
      id: "logo-4",
      description: "YouTube",
      image: "/icons/youtube-icon.png",
      className: "h-8 w-auto",
    },
    {
      id: "logo-5",
      description: "Arrow Right",
      image: "/icons/arrow-right.png",
      className: "h-6 w-auto",
    },
  ],
}: Logos3Props) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section className="py-40 md:py-48">
      <div className="container flex flex-col items-center text-center">
        <h1 className={`my-6 text-2xl font-bold text-pretty lg:text-4xl transition-all duration-1000 delay-300 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          {heading}
        </h1>
      </div>
      <div className="pt-8 md:pt-12">
        <div className="relative mx-auto flex items-center justify-center lg:max-w-5xl">
          <Carousel
            opts={{ loop: true }}
            plugins={[AutoScroll({ playOnInit: true })]}
          >
            <CarouselContent className="ml-0">
              {logos.map((logo) => (
                <CarouselItem
                  key={logo.id}
                  className="flex basis-1/2 justify-center pl-0 sm:basis-1/3 md:basis-1/4 lg:basis-1/6"
                >
                  <div className="mx-4 sm:mx-6 md:mx-10 flex shrink-0 items-center justify-center">
                    <div>
                      <img
                        src={logo.image}
                        alt={logo.description}
                        className={logo.className}
                      />
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
          <div className="absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-background to-transparent"></div>
          <div className="absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-background to-transparent"></div>
        </div>
      </div>
    </section>
  );
};

export { Logos3 };
