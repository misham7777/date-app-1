"use client";

import { useState, useEffect } from "react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface FeatureItem {
  id: number;
  title: string;
  image: string;
  description: string;
}

interface Feature197Props {
  features: FeatureItem[];
}

const defaultFeatures: FeatureItem[] = [
  {
    id: 1,
    title: "Location & Time Tracking",
    image: "/tHzBF9VtTHyDQVb6yHGsTjVms.avif",
    description:
      "Just like the map shows activity from 2 days ago, our platform captures real-time location data when your partner uses dating apps. Our AI analyzes their movement patterns, timestamps, and geographic activity to provide concrete evidence of their online dating behavior.",
  },
  {
    id: 2,
    title: "Active Profile Detection",
    image: "/zS8PvTIANwCEPMbE5AiFHxFqbI8.avif",
    description:
      "Our AI facial recognition technology instantly identifies active dating profiles, just like finding Mandy's profile that was active 8 hours ago. Get real-time alerts when we discover their hidden accounts with exact timestamps, locations, and profile details.",
  },
  {
    id: 3,
    title: "Subscription Level Detection",
    image: "/3ab3Z01bd2hmmiDPvu2ESnFp1YA.avif",
    description:
      "Discover exactly how invested they are in dating apps. Our system detects whether they're using free accounts or paying for premium features like Tinder Platinum, Gold, or Plus subscriptions. Premium subscriptions indicate serious dating intentions and higher activity levels.",
  },
];

const Feature197 = ({ features = defaultFeatures }: Feature197Props) => {
  const [activeTabId, setActiveTabId] = useState<number | null>(1);
  const [activeImage, setActiveImage] = useState(features[0].image);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section className="pt-8 pb-4 md:pt-16 md:pb-8 overflow-hidden bg-white">
      <div className="container mx-auto px-4 md:px-6">
        {/* Title Section */}
        <div className={`text-center mb-4 transition-all duration-700 delay-100 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl tracking-tighter font-bold mb-4 leading-tight">
            Real-Time Activity Monitoring, Every Location Tracked
          </h2>
          <p className="text-base sm:text-lg md:text-xl leading-relaxed tracking-tight text-muted-foreground max-w-2xl mx-auto">
            See exactly where and when your partner uses dating apps. Our AI tracks their location history and activity patterns to give you complete transparency.
          </p>
        </div>
        
        <div className={`flex w-full flex-col items-start justify-between gap-4 md:gap-6 lg:flex-row lg:gap-8 transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="w-full lg:w-1/2">
            <Accordion type="single" className="w-full" defaultValue="item-1">
              {features.map((tab, index) => (
                <AccordionItem 
                  key={tab.id} 
                  value={`item-${tab.id}`} 
                  className={`border-b border-gray-200/60 transition-all duration-300 hover:bg-gray-50/50 rounded-lg mb-1 md:mb-2 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                  style={{ transitionDelay: `${300 + index * 100}ms` }}
                >
                  <AccordionTrigger
                    onClick={() => {
                      setActiveImage(tab.image);
                      setActiveTabId(tab.id);
                    }}
                    className="cursor-pointer py-3 md:py-4 !no-underline transition-all duration-300 hover:no-underline hover:bg-gray-50/30 rounded-lg px-3 md:px-4 group"
                  >
                    <h6
                      className={`text-left text-base md:text-lg font-semibold leading-tight transition-all duration-300 ${tab.id === activeTabId ? "text-foreground" : "text-muted-foreground"}`}
                    >
                      {tab.title}
                    </h6>
                  </AccordionTrigger>
                  <AccordionContent className="pb-3 md:pb-4 px-3 md:px-4">
                    <p className="mt-2 md:mt-3 text-sm md:text-base text-muted-foreground leading-relaxed animate-in slide-in-from-top-2 duration-300">
                      {tab.description}
                    </p>
                    <div className="mt-3 md:mt-4 lg:hidden">
                      <div className="relative overflow-hidden rounded-xl shadow-lg">
                        <img
                          src={tab.image}
                          alt={tab.title}
                          className="w-full h-48 md:h-64 object-cover transition-all duration-500 hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
          <div className={`relative w-full lg:w-1/2 lg:sticky lg:top-8 transition-all duration-700 delay-400 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <div className="hidden lg:block">
              <div className="relative overflow-hidden rounded-2xl shadow-lg bg-white p-4">
                <div className="relative overflow-hidden rounded-xl">
                  <img
                    src={activeImage}
                    alt="Feature preview"
                    className="w-full h-[400px] object-cover transition-all duration-700 ease-out hover:scale-105"
                    style={{
                      transform: `scale(${activeTabId === 1 ? 1 : activeTabId === 2 ? 1.05 : 1.1})`,
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export { Feature197 };
