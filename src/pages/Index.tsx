import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import VideoCarousel3D from "@/components/VideoCarousel3D";
import CaseStudySection from "@/components/CaseStudySection";
import AboutSection from "@/components/AboutSection";
import ContactSection from "@/components/ContactSection";

const Index = () => {
  return (
    <div className="min-h-screen text-foreground overflow-x-hidden">
      <Navbar />
      {/* Hero — darkest */}
      <div className="bg-dark-1">
        <HeroSection />
      </div>
      {/* Portfolio — slightly lighter */}
      <div className="bg-dark-2">
        <VideoCarousel3D />
      </div>
      {/* Case Study — darkest */}
      <div className="bg-dark-1">
        <CaseStudySection />
      </div>
      {/* About — medium */}
      <div className="bg-dark-3">
        <AboutSection />
      </div>
      {/* Contact — slightly lighter */}
      <div className="bg-dark-2">
        <ContactSection />
      </div>
    </div>
  );
};

export default Index;
