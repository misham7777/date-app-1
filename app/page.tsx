"use client";

import { Hero } from "@/components/ui/hero-with-group-of-images-text-and-two-buttons";
import { Feature108 } from "@/components/shadcnblocks-com-feature108";
import { Marquee } from "@/components/ui/marquee";
import { Feature197 } from "@/components/accordion-feature-section";
import { FeaturesSectionWithHoverEffects } from "@/components/feature-section-with-hover-effects";
import { Stats } from "@/components/ui/stats-section";
import { Feature2 } from "@/components/feature-2";
import FAQs from "@/components/text-reveal-faqs";
import FooterSection from "@/components/footer";
import { AnimatedSection } from "@/components/ui/animated-section";
import { StickyEmailInput } from "@/components/ui/sticky-email-input";

export default function Home() {

  return (
    <div className="min-h-screen w-full overflow-x-hidden pb-32">
      <StickyEmailInput />
      <Hero />
      <AnimatedSection animationType="fade-up" delay={200}>
        <Feature108 
          badge="Relationship Intelligence"
          heading="Advanced Features for Complete Relationship Transparency"
          description="Uncover the truth about your partner's online activity with AI-powered multi-platform monitoring and facial recognition technology."
          tabs={[
            {
              value: "analytics",
              icon: <span>📊</span>,
              label: "Multi-Platform Scan",
              content: {
                badge: "Complete Coverage",
                title: "Discover their digital footprint like never before.",
                description: "Find out if their account is still active, including the last time and location they used dating platforms. Get real proof of their online dating activity with timestamps and location data.",
                buttonText: "Start Investigation",
                imageSrc: "hero-images/profile-1.png",
                imageAlt: "Multi-platform scanning interface",
              },
            },
            {
              value: "matching",
              icon: <span>❤️</span>,
              label: "Activity Tracking",
              content: {
                badge: "Activity Intelligence",
                title: "See when and where they're active on dating apps.",
                description: "Find out if their account is still active, including the last time and location they used dating platforms. Get real proof of their online dating activity with timestamps and location data.",
                buttonText: "Start Investigation",
                imageSrc: "hero-images/profile-2.png",
                imageAlt: "AI facial recognition interface",
              },
            },
            {
              value: "location",
              icon: <span>📍</span>,
              label: "AI Facial Recognition",
              content: {
                badge: "Activity Intelligence",
                title: "Upload any photo to find their hidden profiles.",
                description: "Our AI scans their face across 50+ dating platforms to find matching profiles, even when they use fake names or different photos. Get complete results in minutes.",
                buttonText: "Start Investigation",
                imageSrc: "hero-images/map-interface.png",
                imageAlt: "Activity tracking interface",
              },
            },
          ]}
        />
      </AnimatedSection>
      
      {/* Marquee Section - Vertical on Mobile, Horizontal on Desktop */}
      <AnimatedSection animationType="fade-up" delay={100}>
        <section className="pt-8 pb-4 md:pt-16 md:pb-8">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center mb-4">
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl tracking-tighter font-bold mb-4 leading-tight">
                Trust, But Verify
              </h2>
              <p className="text-base sm:text-lg md:text-xl leading-relaxed tracking-tight text-muted-foreground max-w-2xl mx-auto">
                Smart people who chose to verify rather than wonder
              </p>
            </div>
          
          {/* Mobile: Vertical Marquee */}
          <div className="block md:hidden">
            <Marquee
              vertical={true}
              pauseOnHover={true}
              className="h-64 [--duration:30s]"
            >
              <div className="bg-white rounded-2xl p-3 md:p-6 shadow-sm mx-auto max-w-sm hover:scale-105 transition-transform duration-300">
                <div className="flex items-center mb-2 md:mb-4">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-pink-500 rounded-full flex items-center justify-center text-white font-bold text-base md:text-lg mr-2 md:mr-3">
                    S
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-sm md:text-base">Sarah M.</h3>
                    <p className="text-gray-600 text-xs md:text-sm">Verified User</p>
                  </div>
                </div>
                <p className="text-gray-700 text-sm md:text-base leading-relaxed">
                  "I was suspicious about my partner's behavior. This tool helped me find the truth. Now I can make informed decisions about my relationship."
                </p>
              </div>
              
              <div className="bg-white rounded-2xl p-3 md:p-6 shadow-sm mx-auto max-w-sm hover:scale-105 transition-transform duration-300">
                <div className="flex items-center mb-2 md:mb-4">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-base md:text-lg mr-2 md:mr-3">
                    M
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-sm md:text-base">Mike R.</h3>
                    <p className="text-gray-600 text-xs md:text-sm">Verified User</p>
                  </div>
                </div>
                <p className="text-gray-700 text-sm md:text-base leading-relaxed">
                  "The AI facial recognition is incredible. Found profiles I never knew existed. Peace of mind is priceless."
                </p>
              </div>
              
              <div className="bg-white rounded-2xl p-3 md:p-6 shadow-sm mx-auto max-w-sm hover:scale-105 transition-transform duration-300">
                <div className="flex items-center mb-2 md:mb-4">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-base md:text-lg mr-2 md:mr-3">
                    L
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-sm md:text-base">Lisa K.</h3>
                    <p className="text-gray-600 text-xs md:text-sm">Verified User</p>
                  </div>
                </div>
                <p className="text-gray-700 text-sm md:text-base leading-relaxed">
                  "Finally, a tool that actually works! Found multiple hidden profiles across different platforms. Highly recommend."
                </p>
              </div>
            </Marquee>
          </div>
          
          {/* Desktop: Horizontal Marquee */}
          <div className="hidden md:block">
            <Marquee
              pauseOnHover={true}
              className="py-8 [--duration:40s]"
            >
              <div className="bg-white rounded-2xl p-6 shadow-sm mx-4 hover:scale-105 transition-transform duration-300 min-w-[400px]">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-pink-500 rounded-full flex items-center justify-center text-white font-bold text-lg mr-3">
                    S
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Sarah M.</h3>
                    <p className="text-gray-600 text-sm">Verified User</p>
                  </div>
                </div>
                <p className="text-gray-700 leading-relaxed">
                  "I was suspicious about my partner's behavior. This tool helped me find the truth. Now I can make informed decisions about my relationship."
                </p>
              </div>
              
              <div className="bg-white rounded-2xl p-6 shadow-sm mx-4 hover:scale-105 transition-transform duration-300 min-w-[400px]">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-lg mr-3">
                    M
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Mike R.</h3>
                    <p className="text-gray-600 text-sm">Verified User</p>
                  </div>
                </div>
                <p className="text-gray-700 leading-relaxed">
                  "The AI facial recognition is incredible. Found profiles I never knew existed. Peace of mind is priceless."
                </p>
              </div>
              
              <div className="bg-white rounded-2xl p-6 shadow-sm mx-4 hover:scale-105 transition-transform duration-300 min-w-[400px]">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-lg mr-3">
                    L
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Lisa K.</h3>
                    <p className="text-gray-600 text-sm">Verified User</p>
                  </div>
                </div>
                <p className="text-gray-700 leading-relaxed">
                  "Finally, a tool that actually works! Found multiple hidden profiles across different platforms. Highly recommend."
                </p>
              </div>
              
              <div className="bg-white rounded-2xl p-6 shadow-sm mx-4 hover:scale-105 transition-transform duration-300 min-w-[400px]">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg mr-3">
                    D
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">David L.</h3>
                    <p className="text-gray-600 text-sm">Verified User</p>
                  </div>
                </div>
                <p className="text-gray-700 leading-relaxed">
                  "The multi-platform scanning feature is a game-changer. Found profiles on platforms I didn't even know existed."
                </p>
              </div>
            </Marquee>
          </div>
          </div>
        </section>
      </AnimatedSection>

      <AnimatedSection animationType="fade-up" delay={300}>
        <Feature197 
          features={[
            {
              id: 1,
              title: "Location & Time Tracking",
              image: "tHzBF9VtTHyDQVb6yHGsTjVms.avif",
              description: "Just like the map shows activity from 2 days ago, our platform captures real-time location data when your partner uses dating apps. Our AI analyzes their movement patterns, timestamps, and geographic activity to provide concrete evidence of their online dating behavior.",
            },
            {
              id: 2,
              title: "Active Profile Detection",
              image: "zS8PvTIANwCEPMbE5AiFHxFqbI8.avif",
              description: "Our AI facial recognition technology instantly identifies active dating profiles, just like finding Mandy's profile that was active 8 hours ago. Get real-time alerts when we discover their hidden accounts with exact timestamps, locations, and profile details.",
            },
            {
              id: 3,
              title: "Subscription Level Detection",
              image: "3ab3Z01bd2hmmiDPvu2ESnFp1YA.avif",
              description: "Discover exactly how invested they are in dating apps. Our system detects whether they're using free accounts or paying for premium features like Tinder Platinum, Gold, or Plus subscriptions. Premium subscriptions indicate serious dating intentions and higher activity levels.",
            },
          ]}
        />
      </AnimatedSection>

      <AnimatedSection animationType="fade-up" delay={400}>
        <FeaturesSectionWithHoverEffects />
      </AnimatedSection>

      <AnimatedSection animationType="fade-up" delay={500}>
        <Stats />
      </AnimatedSection>

      <AnimatedSection animationType="fade-up" delay={600}>
        <Feature2 
          imageSrc="hp-gma-video.webp"
          imageAlt="Good Morning America feature about dating platform"
        />
      </AnimatedSection>

      <AnimatedSection animationType="fade-up" delay={700}>
        <FAQs />
      </AnimatedSection>

      <AnimatedSection animationType="fade-up" delay={800}>
        <FooterSection />
      </AnimatedSection>
    </div>
  );
}
