import { cn } from "@/lib/utils";
import {
  IconShieldCheck,
  IconBolt,
  IconUserCircle,
  IconBrain,
} from "@tabler/icons-react";

export function FeaturesSectionWithHoverEffects() {
  const features = [
    {
      title: "Secure & Private",
      description:
        "We will never share any information you provide, and the person you're searching for will never know you looked them up.",
      icon: <IconShieldCheck className="w-6 h-6" />,
    },
    {
      title: "Quick & Easy",
      description:
        "No login required. Simply upload their photo, and our AI will quickly reveal if they have active dating profiles across 50+ platforms.",
      icon: <IconBolt className="w-6 h-6" />,
    },
    {
      title: "Complete Intelligence Report",
      description:
        "Get a detailed report with their profiles, photos, last activity, subscription levels, and location data across all platforms.",
      icon: <IconUserCircle className="w-6 h-6" />,
    },
    {
      title: "AI Facial Recognition",
      description:
        "Even if they've used a different name, age, or fake information, our advanced AI will still find their hidden profiles.",
      icon: <IconBrain className="w-6 h-6" />,
    },
  ];
  return (
    <section className="pt-8 pb-4 md:pt-16 md:pb-8">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        {/* Headline and Subheading */}
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl tracking-tighter font-bold mb-4 leading-tight">
            Why People Choose Our Platform?
          </h2>
          <p className="text-base sm:text-lg md:text-xl leading-relaxed tracking-tight text-muted-foreground max-w-2xl mx-auto">
            Thousands of people trust our AI-powered system to uncover the truth about their relationships and find peace of mind.
          </p>
        </div>
        
        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 relative z-10">
          {features.map((feature, index) => (
            <Feature key={feature.title} {...feature} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

const Feature = ({
  title,
  description,
  icon,
  index,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  index: number;
}) => {
  return (
    <div
      className={cn(
        "flex flex-col lg:border-r py-6 md:py-8 lg:py-10 relative group/feature dark:border-neutral-800 transition-all duration-300 hover:scale-105 md:hover:scale-100",
        (index === 0 || index === 2) && "lg:border-l dark:border-neutral-800",
        index < 2 && "lg:border-b dark:border-neutral-800"
      )}
    >
      {/* Hover gradient overlay */}
      <div className="opacity-0 group-hover/feature:opacity-100 transition duration-300 absolute inset-0 h-full w-full bg-gradient-to-t from-green-50/50 to-transparent dark:from-green-950/20 pointer-events-none rounded-lg" />
      
      {/* Icon container with mobile animations */}
      <div className="mb-4 relative z-10 px-4 md:px-6 lg:px-10 text-neutral-600 dark:text-neutral-400">
        <div className="w-12 h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 rounded-xl flex items-center justify-center group-hover/feature:scale-110 transition-all duration-300 group-hover/feature:shadow-lg">
          <div className="text-green-600 dark:text-green-400 group-hover/feature:text-green-700 dark:group-hover/feature:text-green-300 transition-colors duration-300">
            {icon}
          </div>
        </div>
      </div>
      
      {/* Title with animated sidebar */}
      <div className="text-base md:text-lg font-bold mb-2 relative z-10 px-4 md:px-6 lg:px-10">
        <div className="absolute left-0 inset-y-0 h-4 md:h-6 group-hover/feature:h-6 md:group-hover/feature:h-8 w-1 rounded-tr-full rounded-br-full bg-neutral-300 dark:bg-neutral-700 group-hover/feature:bg-green-500 transition-all duration-300 origin-center" />
        <span className="group-hover/feature:translate-x-2 transition duration-300 inline-block text-neutral-800 dark:text-neutral-100">
          {title}
        </span>
      </div>
      
      {/* Description */}
      <p className="text-sm md:text-base text-neutral-600 dark:text-neutral-300 max-w-xs relative z-10 px-4 md:px-6 lg:px-10 leading-relaxed">
        {description}
      </p>
      
      {/* Mobile touch feedback */}
      <div className="absolute inset-0 rounded-lg opacity-0 group-active/feature:opacity-100 transition-opacity duration-150 bg-green-100/20 dark:bg-green-900/10 pointer-events-none" />
    </div>
  );
};
