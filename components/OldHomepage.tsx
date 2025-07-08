import FAQSection from "@/components/FAQSection";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import KeyFeaturesSection from "@/components/KeyFeaturesSection";
import Navigation from "@/components/Navigation";
import UseCasesSection from "@/components/UseCasesSection";
import WhyFormationSection from "@/components/WhyFormationSection";
import { content } from "@/lib/contentArray";
import OldHeroSection from "./old/Hero";
import OldKeyFeaturesSection from "./old/OldKeyFeatures";
import BackedBy from "./BackedByComponent";

export default function Home() {
  const currentContent = content[0];

  return (
    <div className="flex flex-col min-h-screen">
      <Navigation />
      <OldHeroSection
        title={currentContent.hero.title}
        subtitle={currentContent.hero.subtitle}
        buttonText={currentContent.hero.buttonText}
      />
      <OldKeyFeaturesSection
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
