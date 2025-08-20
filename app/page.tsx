import { Hero } from "@/components/ui/hero-with-group-of-images-text-and-two-buttons";
import { Logos3 } from "@/components/logos3";
import { Feature108 } from "@/components/shadcnblocks-com-feature108";
import TwitterReviews from "@/components/TwitterReviews";

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
      <TwitterReviews />
    </div>
  );
}
