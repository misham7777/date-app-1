import { Button } from "@/components/ui/button";

interface Feature2Props {
  title: string;
  description?: string;
  imageSrc: string;
  imageAlt: string;
  buttonPrimary: {
    label: string;
    href: string;
  };
  buttonSecondary: {
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
  return (
    <section className="py-16 md:py-24 lg:py-32">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
          <img
            src={imageSrc}
            alt={imageAlt}
            className="w-full max-w-2xl rounded-lg object-cover shadow-lg mb-8 md:mb-12"
          />
          <div className="flex flex-col items-center text-center">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-balance mb-6 md:mb-8">
              {title}
            </h1>
            <p className="mb-8 md:mb-10 max-w-2xl text-muted-foreground text-base md:text-lg leading-relaxed">
              {description}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="px-8 py-3">
                <a href={buttonPrimary.href} target="_blank">
                  {buttonPrimary.label}
                </a>
              </Button>
              <Button variant="outline" asChild size="lg" className="px-8 py-3">
                <a href={buttonSecondary.href} target="_blank">
                  {buttonSecondary.label}
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
