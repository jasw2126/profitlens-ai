import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import BentoSection from "@/components/BentoSection";
import PricingSection from "@/components/PricingSection";
import Footer from "@/components/Footer";

export default function HomePage() {
  return (
    <main className="relative overflow-hidden bg-[#05070A] text-white selection:bg-amber-500/25 selection:text-amber-300">
      <Navbar />
      <HeroSection />
      <BentoSection />
      <PricingSection />
      <Footer />
    </main>
  );
}
