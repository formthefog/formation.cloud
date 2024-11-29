import HeroSection from "@/components/HeroSection";
import KeyFeaturesSection from "@/components/KeyFeaturesSection";
import Navigation from "@/components/Navigation";
import WhyFormationSection from "@/components/WhyFormationSection";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navigation />
      <HeroSection />
      <KeyFeaturesSection />
      <WhyFormationSection />
    </div>
  );
}
