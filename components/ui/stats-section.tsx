"use client";

import { MoveUpRight } from "lucide-react";
import { useEffect, useState, useRef } from "react";

function Stats() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const stats = [
    { value: 94, label: "Profiles Found", suffix: "%", percentage: "+15.2%", description: "Users discovered who they were looking for." },
    { value: 250000, label: "Searches Completed", suffix: "+", percentage: "+8.7%", description: "Intelligence reports delivered across 50+ platforms." },
    { value: 95, label: "Customer Satisfaction", suffix: "%", percentage: "+2.1%", description: "Users found the clarity they needed." },
    { value: 50, label: "Platforms Monitored", suffix: "+", percentage: "+12.3%", description: "Dating apps and social platforms tracked." },
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
    }, [target, duration, hasAnimated]);

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
    <section className="pt-8 pb-4 md:pt-16 md:pb-8 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20">
      <div className="container mx-auto px-4 md:px-6">
        {/* Header */}
        <div className={`text-center mb-8 md:mb-12 transition-all duration-700 delay-100 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl tracking-tighter font-bold mb-4 leading-tight">
            Intelligence Results in Numbers
          </h2>
          <p className="text-base sm:text-lg md:text-xl leading-relaxed tracking-tight text-muted-foreground max-w-2xl mx-auto">
            Join thousands of people who discovered the truth and found clarity about their relationships
          </p>
        </div>
        
        <div className={`grid text-left grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 w-full gap-4 lg:gap-8 transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          {stats.map((stat, index) => (
            <div 
              key={index} 
              className={`flex gap-0 flex-col justify-between p-6 border rounded-lg bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
              style={{ transitionDelay: `${300 + index * 100}ms` }}
            >
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
              <p className="text-xs md:text-sm leading-relaxed tracking-tight text-muted-foreground/70 max-w-xl text-left mt-1">
                {stat.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export { Stats };
