"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@radix-ui/react-tabs";
import { Layout, Pointer, Zap } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface TabContent {
  badge: string;
  title: string;
  description: string;
  buttonText: string;
  imageSrc: string;
  imageAlt: string;
}

interface Tab {
  value: string;
  icon: React.ReactNode;
  label: string;
  content: TabContent;
}

interface Feature108Props {
  badge?: string;
  heading?: string;
  description?: string;
  tabs?: Tab[];
}

const Feature108 = ({
  badge = "Features",
  heading = "Advanced Features",
  description = "Discover what makes us different",
  tabs = [
    {
      value: "tab-1",
      icon: <span>📊</span>,
      label: "Multi-Platform Scan",
      content: {
        badge: "Complete Coverage",
        title: "Discover their digital footprint like never before.",
        description:
          "Find out if their account is still active, including the last time and location they used dating platforms. Get real proof of their online dating activity with timestamps and location data.",
        buttonText: "Start Investigation",
        imageSrc:
          "/hero-images/profile-1.png",
        imageAlt: "Multi-platform scanning interface",
      },
    },
    {
      value: "tab-2",
      icon: <span>❤️</span>,
      label: "Activity Tracking",
      content: {
        badge: "Activity Intelligence",
        title: "See when and where they're active on dating apps.",
        description:
          "Find out if their account is still active, including the last time and location they used dating platforms. Get real proof of their online dating activity with timestamps and location data.",
        buttonText: "Start Investigation",
        imageSrc:
          "/hero-images/profile-2.png",
        imageAlt: "AI facial recognition interface",
      },
    },
    {
      value: "tab-3",
      icon: <span>📍</span>,
      label: "AI Facial Recognition",
      content: {
        badge: "Activity Intelligence",
        title: "Upload any photo to find their hidden profiles.",
        description:
          "Our AI scans their face across 50+ dating platforms to find matching profiles, even when they use fake names or different photos. Get complete results in minutes.",
        buttonText: "Start Investigation",
        imageSrc:
          "/hero-images/map-interface.png",
        imageAlt: "Activity tracking interface",
      },
    },
  ],
}: Feature108Props) => {
  const [isVisible, setIsVisible] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleStartInvestigation = () => {
    router.push('/quiz');
  };

  return (
    <section className="pt-8 pb-4 md:pt-16 md:pb-8">
      <div className="container mx-auto">
        <div className={`flex flex-col items-center gap-6 md:gap-8 lg:gap-4 text-center transition-all duration-700 delay-100 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <Badge variant="outline" className="animate-pulse">{badge}</Badge>
          <h1 className="max-w-2xl text-3xl sm:text-4xl md:text-5xl lg:text-6xl tracking-tighter font-bold leading-tight">
            {heading}
          </h1>
          <p className="text-base sm:text-lg md:text-xl leading-relaxed tracking-tight text-muted-foreground">{description}</p>
        </div>
        <Tabs defaultValue={tabs[0].value} className="mt-8 md:mt-16 lg:mt-8">
          <TabsList className="container flex flex-col items-center justify-center gap-6 md:gap-4 sm:flex-row md:gap-10">
            {tabs.map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold text-muted-foreground data-[state=active]:bg-muted data-[state=active]:text-primary"
              >
                {tab.icon} {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
          <div className="mx-auto mt-16 md:mt-8 max-w-screen-xl rounded-2xl bg-muted/70 p-8 md:p-6 lg:p-16">
            {tabs.map((tab) => (
              <TabsContent
                key={tab.value}
                value={tab.value}
                className="grid place-items-center gap-32 md:gap-20 lg:grid-cols-2 lg:gap-10"
              >
                <div className="flex flex-col gap-4 md:gap-8 lg:gap-5">
                  <Badge variant="outline" className="w-fit bg-background">
                    {tab.content.badge}
                  </Badge>
                  <h3 className="text-3xl font-semibold lg:text-5xl">
                    {tab.content.title}
                  </h3>
                  <p className="text-muted-foreground lg:text-lg">
                    {tab.content.description}
                  </p>
                  <Button 
                    className="mt-4 md:mt-6 lg:mt-2.5 w-fit gap-2" 
                    size="lg"
                    onClick={handleStartInvestigation}
                  >
                    {tab.content.buttonText}
                  </Button>
                </div>
                <img
                  src={tab.content.imageSrc}
                  alt={tab.content.imageAlt}
                  className="rounded-xl"
                />
              </TabsContent>
            ))}
          </div>
        </Tabs>
      </div>
    </section>
  );
};

export { Feature108 };
