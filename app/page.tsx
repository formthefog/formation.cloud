import FAQSection from "@/components/FAQSection";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import KeyFeaturesSection from "@/components/KeyFeaturesSection";
import Navigation from "@/components/Navigation";
import UseCasesSection from "@/components/UseCasesSection";
import WhyFormationSection from "@/components/WhyFormationSection";
import FeaturedAgentsSection from "@/components/FeaturedAgentsSection";
import { content } from "@/lib/contentArray";
import TopSection from "@/components/TopSection";

export default function Home() {
  const currentContent = content[0]

  return (
    <div className="flex flex-col min-h-screen">
      <Navigation />
      <HeroSection
        title={currentContent.hero.title}
        subtitle={currentContent.hero.subtitle}
        buttonText={currentContent.hero.buttonText}
      />
      <TopSection 
        tagline={currentContent.keyFeatures.tagline}
        features={currentContent.keyFeatures.features}
      />
      <FeaturedAgentsSection />
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
      <Footer
        headline={currentContent.footer.headline}
        buttonText={currentContent.footer.buttonText}
      />
    </div>
  );
}
