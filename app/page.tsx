import { Hero } from "@/components/ui/hero-with-group-of-images-text-and-two-buttons";
import { Logos3 } from "@/components/logos3";
import { Feature108 } from "@/components/shadcnblocks-com-feature108";
import { Marquee } from "@/components/ui/marquee";
import { Feature197 } from "@/components/accordion-feature-section";
import { FeaturesSectionWithHoverEffects } from "@/components/feature-section-with-hover-effects";
import { Stats } from "@/components/ui/stats-section";
import { Feature2 } from "@/components/feature-2";
import FAQs from "@/components/text-reveal-faqs";

export default function Home() {
  return (
    <div className="min-h-screen">
      <Hero />
      <Logos3 
        heading="Trusted by industry leaders"
        logos={[
          {
            id: "logo-1",
            description: "Tinder",
            image: "https://upload.wikimedia.org/wikipedia/commons/7/74/Tinder_Logo.png",
            className: "h-8 w-auto",
          },
          {
            id: "logo-2", 
            description: "Bumble",
            image: "https://upload.wikimedia.org/wikipedia/commons/9/9c/Bumble_logo.svg",
            className: "h-8 w-auto",
          },
          {
            id: "logo-3",
            description: "Hinge",
            image: "https://logos-world.net/wp-content/uploads/2021/03/Hinge-Logo.png",
            className: "h-8 w-auto",
          },
          {
            id: "logo-4",
            description: "Match",
            image: "https://upload.wikimedia.org/wikipedia/commons/0/0c/Match.com_logo.svg",
            className: "h-8 w-auto",
          },
          {
            id: "logo-5",
            description: "OkCupid",
            image: "https://logos-world.net/wp-content/uploads/2021/03/OkCupid-Logo.png",
            className: "h-8 w-auto",
          },
          {
            id: "logo-6",
            description: "Badoo",
            image: "https://upload.wikimedia.org/wikipedia/commons/8/85/Badoo_logo.svg",
            className: "h-8 w-auto",
          },
        ]}
      />
      <Feature108 
        badge="Dating App Analytics"
        heading="Advanced Features for Modern Dating Apps"
        description="Transform your dating platform with cutting-edge analytics and user insights."
        tabs={[
          {
            value: "analytics",
            icon: <span>📊</span>,
            label: "Smart Analytics",
            content: {
              badge: "Data Insights",
              title: "Understand your users like never before.",
              description: "Get deep insights into user behavior, match success rates, and engagement patterns. Make data-driven decisions to improve your platform.",
              buttonText: "View Analytics",
              imageSrc: "/hero-images/profile-1.png",
              imageAlt: "Analytics dashboard",
            },
          },
          {
            value: "matching",
            icon: <span>💝</span>,
            label: "AI Matching",
            content: {
              badge: "Smart Connections",
              title: "Next-gen matching algorithms.",
              description: "Our AI-powered matching system learns from user preferences and behaviors to create more meaningful connections and higher success rates.",
              buttonText: "Learn More",
              imageSrc: "/hero-images/profile-2.png",
              imageAlt: "AI matching interface",
            },
          },
          {
            value: "location",
            icon: <span>📍</span>,
            label: "Location Intelligence",
            content: {
              badge: "Geo Features",
              title: "Location-based smart features.",
              description: "Advanced location tracking and geo-fencing capabilities help users find matches nearby and discover dating hotspots in their area.",
              buttonText: "Explore Features",
              imageSrc: "/hero-images/map-interface.png",
              imageAlt: "Location tracking interface",
            },
          },
        ]}
      />
      
      {/* Marquee Section - Vertical on Mobile, Horizontal on Desktop */}
      <section className="py-16 md:py-24 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              What Our Users Say
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Real testimonials from people who found love through our platform
            </p>
          </div>
          
          {/* Mobile: Vertical Marquee */}
          <div className="block md:hidden">
            <Marquee
              vertical={true}
              pauseOnHover={true}
              className="h-96 [--duration:30s]"
            >
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg mx-4 mb-4 max-w-sm">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg mr-3">
                    S
                  </div>
                  <div>
                    <h4 className="font-semibold">Sarah M.</h4>
                    <p className="text-sm text-muted-foreground">Found love in 2 weeks</p>
                  </div>
                </div>
                <p className="text-gray-700 dark:text-gray-300">"This app changed my life! I met my soulmate and we're getting married next month!"</p>
              </div>
              
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg mx-4 mb-4 max-w-sm">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold text-lg mr-3">
                    M
                  </div>
                  <div>
                    <h4 className="font-semibold">Mike R.</h4>
                    <p className="text-sm text-muted-foreground">Verified user</p>
                  </div>
                </div>
                <p className="text-gray-700 dark:text-gray-300">"The AI matching is incredible. I've never felt so compatible with someone before!"</p>
              </div>
              
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg mx-4 mb-4 max-w-sm">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center text-white font-bold text-lg mr-3">
                    L
                  </div>
                  <div>
                    <h4 className="font-semibold">Lisa K.</h4>
                    <p className="text-sm text-muted-foreground">Premium member</p>
                  </div>
                </div>
                <p className="text-gray-700 dark:text-gray-300">"Finally found someone who shares my values and interests. Thank you!"</p>
              </div>
              
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg mx-4 mb-4 max-w-sm">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center text-white font-bold text-lg mr-3">
                    D
                  </div>
                  <div>
                    <h4 className="font-semibold">David P.</h4>
                    <p className="text-sm text-muted-foreground">Active user</p>
                  </div>
                </div>
                <p className="text-gray-700 dark:text-gray-300">"The location features helped me find someone nearby. We're moving in together!"</p>
              </div>
            </Marquee>
          </div>
          
          {/* Desktop: Horizontal Marquee */}
          <div className="hidden md:block">
            <Marquee
              pauseOnHover={true}
              className="py-8 [--duration:40s]"
            >
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg mx-4 min-w-[300px]">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg mr-3">
                    S
                  </div>
                  <div>
                    <h4 className="font-semibold">Sarah M.</h4>
                    <p className="text-sm text-muted-foreground">Found love in 2 weeks</p>
                  </div>
                </div>
                <p className="text-gray-700 dark:text-gray-300">"This app changed my life! I met my soulmate and we're getting married next month!"</p>
              </div>
              
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg mx-4 min-w-[300px]">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold text-lg mr-3">
                    M
                  </div>
                  <div>
                    <h4 className="font-semibold">Mike R.</h4>
                    <p className="text-sm text-muted-foreground">Verified user</p>
                  </div>
                </div>
                <p className="text-gray-700 dark:text-gray-300">"The AI matching is incredible. I've never felt so compatible with someone before!"</p>
              </div>
              
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg mx-4 min-w-[300px]">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center text-white font-bold text-lg mr-3">
                    L
                  </div>
                  <div>
                    <h4 className="font-semibold">Lisa K.</h4>
                    <p className="text-sm text-muted-foreground">Premium member</p>
                  </div>
                </div>
                <p className="text-gray-700 dark:text-gray-300">"Finally found someone who shares my values and interests. Thank you!"</p>
              </div>
              
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg mx-4 min-w-[300px]">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center text-white font-bold text-lg mr-3">
                    D
                  </div>
                  <div>
                    <h4 className="font-semibold">David P.</h4>
                    <p className="text-sm text-muted-foreground">Active user</p>
                  </div>
                </div>
                <p className="text-gray-700 dark:text-gray-300">"The location features helped me find someone nearby. We're moving in together!"</p>
              </div>
              
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg mx-4 min-w-[300px]">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg mr-3">
                    A
                  </div>
                  <div>
                    <h4 className="font-semibold">Alex T.</h4>
                    <p className="text-sm text-muted-foreground">New user</p>
                  </div>
                </div>
                <p className="text-gray-700 dark:text-gray-300">"Amazing experience! The interface is so intuitive and the matches are spot on."</p>
              </div>
              
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg mx-4 min-w-[300px]">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-teal-400 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-lg mr-3">
                    E
                  </div>
                  <div>
                    <h4 className="font-semibold">Emma W.</h4>
                    <p className="text-sm text-muted-foreground">Long-term user</p>
                  </div>
                </div>
                <p className="text-gray-700 dark:text-gray-300">"Been using this for 6 months and finally found my perfect match. Highly recommend!"</p>
              </div>
            </Marquee>
          </div>
        </div>
      </section>
      
      <Feature197 
        features={[
          {
            id: 1,
            title: "Natural Connection Discovery",
            image: "/tHzBF9VtTHyDQVb6yHGsTjVms.avif",
            description: "Just like trees that grow together in harmony, our platform helps you discover natural connections with people who share your values and interests. Our AI analyzes compatibility patterns to find relationships that flourish naturally over time.",
          },
          {
            id: 2,
            title: "Rooted in Trust & Safety",
            image: "/zS8PvTIANwCEPMbE5AiFHxFqbI8.avif",
            description: "Strong relationships, like healthy trees, need solid foundations. Our comprehensive verification system and safety features provide the secure environment you need to build lasting connections with confidence and peace of mind.",
          },
          {
            id: 3,
            title: "Growing Together",
            image: "/tHzBF9VtTHyDQVb6yHGsTjVms.avif",
            description: "Every great relationship grows and evolves, just like a flourishing forest. Our platform provides the tools and insights you need to nurture your connections, overcome challenges, and build relationships that stand the test of time.",
          },
        ]}
      />
      
      <FeaturesSectionWithHoverEffects />
      
      <Stats />
      
      <Feature2 
        title="Ready to Find Your Perfect Match?"
        description="Join millions of people who have discovered meaningful relationships through our platform. Our advanced AI technology and comprehensive safety features make finding love easier and safer than ever before."
        imageSrc="/hp-gma-video.webp"
        imageAlt="Good Morning America feature about dating platform"
        buttonPrimary={{
          label: "Start Your Journey",
          href: "#"
        }}
        buttonSecondary={{
          label: "Learn How It Works",
          href: "#"
        }}
      />
      
      <FAQs />
    </div>
  );
}
