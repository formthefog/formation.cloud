import FAQSection from "@/components/FAQSection";
import Footer from "@/components/Footer";
import GlobalNetworkSection from "@/components/GlobalNetworkSection";
import HeroSection from "@/components/HeroSection";
import KeyFeaturesSection from "@/components/KeyFeaturesSection";
import Navigation from "@/components/Navigation";
import UseCasesSection from "@/components/UseCasesSection";
import WhyFormationSection from "@/components/WhyFormationSection";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navigation />
      <HeroSection />
      <KeyFeaturesSection />
      <WhyFormationSection />
      <UseCasesSection />
      <GlobalNetworkSection />
      <FAQSection />
      <Footer />
    </div>
  );
}
