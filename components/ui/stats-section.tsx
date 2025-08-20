"use client";

import { MoveDownLeft, MoveUpRight } from "lucide-react";
import { useEffect, useState, useRef } from "react";

function Stats() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const stats = [
    { value: 2500000, label: "Successful matches made", suffix: "+", percentage: "+15.2%" },
    { value: 850000, label: "Active users worldwide", suffix: "+", percentage: "+8.7%" },
    { value: 95.8, label: "User satisfaction rate", suffix: "%", percentage: "+2.1%" },
    { value: 12500, label: "Couples married this year", suffix: "+", percentage: "+12.3%" },
  ];

  const CountUp = ({ target, duration = 4000, suffix = "" }: { target: number; duration?: number; suffix?: string }) => {
    const [count, setCount] = useState(0);
    const [hasAnimated, setHasAnimated] = useState(false);

    useEffect(() => {
      if (isVisible && !hasAnimated) {
        setHasAnimated(true);
        const startTime = Date.now();
        
        const animate = () => {
          const elapsed = Date.now() - startTime;
          const progress = Math.min(elapsed / duration, 1);
          
          // Easing function for smooth animation
          const easeOutQuart = 1 - Math.pow(1 - progress, 4);
          const currentCount = Math.floor(target * easeOutQuart);
          
          setCount(currentCount);
          
          if (progress < 1) {
            requestAnimationFrame(animate);
          }
        };
        
        requestAnimationFrame(animate);
      }
    }, [isVisible, target, duration, hasAnimated]);

    const formatNumber = (num: number) => {
      if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + "M";
      } else if (num >= 1000) {
        return (num / 1000).toFixed(1) + "K";
      }
      return num.toString();
    };

    return (
      <span className="text-3xl md:text-4xl tracking-tighter max-w-xl text-left font-bold flex flex-row gap-4 items-end text-green-700 dark:text-green-300">
        {formatNumber(count)}{suffix}
      </span>
    );
  };
  return (
    <div ref={sectionRef} className="w-full py-16 md:py-20 lg:py-32 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20">
      <div className="container mx-auto px-4 md:px-6">
        {/* Header */}
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-3 md:mb-4 text-neutral-800 dark:text-neutral-100">
            Our Success in Numbers
          </h2>
          <p className="text-sm md:text-base lg:text-lg text-neutral-600 dark:text-neutral-300 max-w-2xl mx-auto leading-relaxed">
            Join thousands of happy couples who found love through our platform
          </p>
        </div>
        
        <div className="grid text-left grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 w-full gap-4 lg:gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="flex gap-0 flex-col justify-between p-6 border rounded-lg bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
              <MoveUpRight className="w-4 h-4 mb-6 md:mb-10 text-green-600 dark:text-green-400" />
              <div className="flex flex-row gap-4 items-end">
                <CountUp target={stat.value} suffix={stat.suffix} />
                <span className="text-muted-foreground text-sm tracking-normal font-normal">
                  {stat.percentage}
                </span>
              </div>
              <p className="text-sm md:text-base leading-relaxed tracking-tight text-muted-foreground max-w-xl text-left">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export { Stats };
