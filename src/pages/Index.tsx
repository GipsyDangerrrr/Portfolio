import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import PortfolioSection from "@/components/PortfolioSection";
import CaseStudySection from "@/components/CaseStudySection";
import AboutSection from "@/components/AboutSection";
import ContactSection from "@/components/ContactSection";

const Index = () => {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <Navbar />
      <HeroSection />
      <div className="gradient-line" />
      <PortfolioSection />
      <div className="gradient-line" />
      <CaseStudySection />
      <div className="gradient-line" />
      <AboutSection />
      <div className="gradient-line" />
      <ContactSection />
    </div>
  );
};

export default Index;
