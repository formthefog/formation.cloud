'use client'
import Footer from "@/components/Footer";
import GlobalNetworkSection from "@/components/GlobalNetworkSection";
import HeroSection from "@/components/HeroSection";
import KeyFeaturesSection from "@/components/KeyFeaturesSection";
import Navigation from "@/components/Navigation";
import UseCasesSection from "@/components/UseCasesSection";
import WhyFormationSection from "@/components/WhyFormationSection";
import { content } from "@/lib/contentArray";
import { useState } from "react";

const useCasesData = {
  title: "Powerful solutions for every need with Formation",
  subtitle:
    "Explore how Formation solves real-world challenges for cutting-edge industries utilizing the power of advanced computing.",
  useCases: [
    {
      icon: "/smart-city.jpg",
      title: "Smart Cities",
      description:
        "Empower urban innovation with real-time data processing for smarter infrastructure management. Optimize traffic flow, enhance public safety, and improve energy efficiency with ultra-low latency and reliable connectivity.",
    },
    {
      icon: "/autonomous-vehicle.jpg",
      title: "Autonomous Vehicles",
      description:
        "Drive the future of transportation with ultra-low latency edge processing. Enable split-second decisions for autonomous vehicles, enhancing safety and efficiency in transportation systems.",
    },
    {
      icon: "/ar-game.jpg",
      title: "AR/Gaming",
      description:
        "Create immersive experiences with powerful edge computing. Build applications that respond instantly to user interactions, ideal for gaming, education, and training simulations.",
    },
    {
      icon: "/financial.jpg",
      title: "Financial Services",
      description:
        "Secure transactions with speed through edge processing. Maximize latency and enhance security for real-time trading and fraud detection, improving customer satisfaction and trust in digital financial services.",
    },
  ],

}

export default function Home() {
  const [selectedIndex, setSelectedIndex] = useState(0); // Start with the first content block
  const currentContent = content[selectedIndex];

  const handleLogoClick = () => {
    setSelectedIndex((prevIndex) => (prevIndex + 1) % content.length);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navigation onLogoClick={handleLogoClick} />
      <HeroSection
        title={currentContent.hero.title}
        subtitle={currentContent.hero.subtitle}
        buttonText={currentContent.hero.buttonText}
      />
      <KeyFeaturesSection
        tagline={currentContent.keyFeatures.tagline}
        features={currentContent.keyFeatures.features}
      />
      <WhyFormationSection
        title={currentContent.whyFormation.title}
        subtitle={currentContent.whyFormation.subtitle}
        description={currentContent.whyFormation.description}
      />
      <UseCasesSection
        title={currentContent.useCases.title}
        subtitle={currentContent.useCases.subtitle}
        useCases={currentContent.useCases.useCases}
      />
      <GlobalNetworkSection />
      <Footer
        headline={currentContent.footer.headline}
        buttonText={currentContent.footer.buttonText}
        buttonLink={currentContent.footer.buttonLink}
      />
    </div>
  );
}
