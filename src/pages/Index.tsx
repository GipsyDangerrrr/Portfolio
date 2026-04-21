import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import LogoCloud from "@/components/LogoCloud";
import VideoCarousel3D from "@/components/VideoCarousel3D";
import ImpactShowcase from "@/components/ImpactShowcase";
import AboutSection from "@/components/AboutSection";
import ContactSection from "@/components/ContactSection";
import CosmicBackgrounds from "@/components/CosmicBackgrounds";
import { motion, useScroll, useTransform, useMotionTemplate } from "framer-motion";
import { useState, useEffect } from "react";

import { BRAND } from "@/config/brand";

const Index = () => {
  const { scrollY } = useScroll();
  const [vh, setVh] = useState(800);

  useEffect(() => {
    setVh(window.innerHeight);
    const handleResize = () => setVh(window.innerHeight);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <motion.div
      style={{
        "--background": BRAND.colors.background,
        "--foreground": BRAND.colors.foreground,
        "--primary": BRAND.colors.primary,
        "--accent": BRAND.colors.accent,
        "--muted": BRAND.colors.muted,
        "--border": BRAND.colors.border,
        "--font-sans": BRAND.typography.fontSans,
        "--font-display": BRAND.typography.fontDisplay,
        "--font-geist": BRAND.typography.fontGeist,
      } as any}
      className="min-h-screen text-foreground overflow-x-hidden max-w-[100vw] bg-background relative z-0 transition-colors duration-200"
    >
      <Navbar />
      <CosmicBackgrounds />

      <HeroSection />
      
      {/* Portfolio */}
      <section id="portfolio" className="relative border-y border-white/5 overflow-hidden">
        <div className="relative z-10">
          <VideoCarousel3D />
        </div>
      </section>

      {/* Impact */}
      <section id="impact" className="relative border-b border-white/5 overflow-hidden">
        <div className="relative z-10">
          <ImpactShowcase />
        </div>
      </section>

      {/* About */}
      <section id="about" className="relative border-b border-white/5 overflow-hidden">
        <div className="relative z-10">
          <AboutSection />
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="relative overflow-hidden">
        <div className="relative z-10">
          <ContactSection />
        </div>
      </section>
    </motion.div>
  );
};

export default Index;
