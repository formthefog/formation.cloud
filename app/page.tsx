import HeroSection from "@/components/HeroSection";
import Navigation from "@/components/Navigation";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navigation />
      <HeroSection />
    </div>
  );
}
