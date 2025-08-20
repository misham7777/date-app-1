"use client";

import { useState } from "react";

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
    title: "Ready-to-Use UI Blocks",
    image: "/images/block/placeholder-1.svg",
    description:
      "Browse through our extensive collection of pre-built UI blocks designed with shadcn/ui. Each block is carefully crafted to be responsive, accessible, and easily customizable. Simply copy and paste the code into your project.",
  },
  {
    id: 2,
    title: "Tailwind CSS & TypeScript",
    image: "/images/block/placeholder-2.svg",
    description:
      "Built with Tailwind CSS for rapid styling and TypeScript for type safety. Our blocks leverage the full power of Tailwind's utility classes while maintaining clean, type-safe code that integrates seamlessly with your Next.js projects.",
  },
  {
    id: 3,
    title: "Dark Mode & Customization",
    image: "/images/block/placeholder-3.svg",
    description:
      "Every block supports dark mode out of the box and can be customized to match your brand. Modify colors, spacing, and typography using Tailwind's configuration. The shadcn/ui theming system makes it easy to maintain consistency across your site.",
  },
  {
    id: 4,
    title: "Accessibility First",
    image: "/images/block/placeholder-4.svg",
    description:
      "All blocks are built with accessibility in mind, following WCAG guidelines. They include proper ARIA labels, keyboard navigation support, and semantic HTML structure. Ensure your website is usable by everyone without extra effort.",
  },
  {
    id: 5,
    title: "Modern Development Stack",
    image: "/images/block/placeholder-5.svg",
    description:
      "Built for modern web development with React 18, Next.js 14, and the latest shadcn/ui components. Take advantage of React Server Components, TypeScript strict mode, and other cutting-edge features while maintaining excellent performance.",
  },
];

const Feature197 = ({ features = defaultFeatures }: Feature197Props) => {
  const [activeTabId, setActiveTabId] = useState<number | null>(1);
  const [activeImage, setActiveImage] = useState(features[0].image);

  return (
    <section className="py-8 md:py-16 lg:py-32 overflow-hidden bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20">
      <div className="container mx-auto px-4 md:px-6">
        {/* Title Section */}
        <div className="text-center mb-8 md:mb-12 lg:mb-16">
          <h2 className="text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold mb-2 md:mb-3 lg:mb-4 px-2 md:px-4">
            Growing Love, One Connection at a Time
          </h2>
          <p className="text-sm md:text-base lg:text-lg text-muted-foreground max-w-2xl mx-auto px-2 md:px-4 leading-relaxed">
            Discover how our platform nurtures relationships like nature nurtures life. 
            Every connection has the potential to grow into something beautiful.
          </p>
        </div>
        
        <div className="flex w-full flex-col items-start justify-between gap-6 md:gap-8 lg:flex-row lg:gap-16">
          <div className="w-full lg:w-1/2">
            <Accordion type="single" className="w-full" defaultValue="item-1">
              {features.map((tab) => (
                <AccordionItem 
                  key={tab.id} 
                  value={`item-${tab.id}`} 
                  className="border-b border-gray-200/60 dark:border-gray-700/60 transition-all duration-300 hover:bg-gray-50/50 dark:hover:bg-gray-800/30 rounded-lg mb-1 md:mb-2"
                >
                  <AccordionTrigger
                    onClick={() => {
                      setActiveImage(tab.image);
                      setActiveTabId(tab.id);
                    }}
                    className="cursor-pointer py-4 md:py-6 lg:py-8 !no-underline transition-all duration-300 hover:no-underline hover:bg-gray-50/30 dark:hover:bg-gray-800/20 rounded-lg px-3 md:px-4"
                  >
                    <h6
                      className={`text-left text-base md:text-lg lg:text-xl font-semibold leading-tight transition-all duration-300 ${tab.id === activeTabId ? "text-foreground" : "text-muted-foreground"}`}
                    >
                      {tab.title}
                    </h6>
                  </AccordionTrigger>
                  <AccordionContent className="pb-4 md:pb-6 lg:pb-8 px-3 md:px-4">
                    <p className="mt-3 md:mt-4 text-sm md:text-base text-muted-foreground leading-relaxed animate-in slide-in-from-top-2 duration-300">
                      {tab.description}
                    </p>
                    <div className="mt-4 md:mt-6 lg:hidden">
                      <div className="relative overflow-hidden rounded-xl shadow-2xl">
                        <img
                          src={tab.image}
                          alt={tab.title}
                          className="w-full h-48 md:h-64 lg:h-80 object-cover transition-all duration-500 hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
          <div className="relative w-full lg:w-1/2 lg:sticky lg:top-8">
            <div className="hidden lg:block">
              <div className="relative overflow-hidden rounded-2xl shadow-2xl bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 p-4">
                <div className="relative overflow-hidden rounded-xl">
                  <img
                    src={activeImage}
                    alt="Feature preview"
                    className="w-full h-[500px] object-cover transition-all duration-700 ease-out hover:scale-105"
                    style={{
                      transform: `scale(${activeTabId === 1 ? 1 : activeTabId === 2 ? 1.05 : 1.1})`,
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent"></div>
                </div>
                <div className="absolute top-6 right-6 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Feature {activeTabId}
                  </span>
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
