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
