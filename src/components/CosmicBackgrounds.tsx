import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function CosmicBackgrounds() {
    const [activeSection, setActiveSection] = useState("hero");

    useEffect(() => {
        const handleScroll = () => {
            const sections = ["hero", "portfolio", "impact", "about", "contact"];
            let current = "hero";

            for (const section of sections) {
                const element = document.getElementById(section);
                if (element) {
                    const rect = element.getBoundingClientRect();
                    if (rect.top <= window.innerHeight * 0.5 && rect.bottom >= window.innerHeight * 0.2) {
                        current = section;
                        break;
                    }
                }
            }
            setActiveSection(current);
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        handleScroll();

        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const bgMap = {
        hero: null,
        portfolio: `/Portfolio/bg-portfolio-new.png`,
        impact: `/Portfolio/bg-impact-new.png`,
        about: `/Portfolio/bg-about-new.jpg`,
        contact: `/Portfolio/bg-portfolio-new.png`,
    };

    const currentBg = bgMap[activeSection as keyof typeof bgMap];

    return (
        <div className="fixed inset-0 w-full h-full z-[-1] pointer-events-none /Portfolio/bg-black">
            {/* Dark Overlay (Always present to ensure high contrast) */}
            <div className="absolute inset-0 /Portfolio/bg-black/60 z-10" />

            {/* Preload images */}
            <div className="hidden">
                <img src={`/Portfolio/bg-portfolio-new.png`} alt="preload" />
                <img src={`/Portfolio/bg-impact-new.png`} alt="preload" />
                <img src={`/Portfolio/bg-about-new.jpg`} alt="preload" />
            </div>

            <AnimatePresence mode="popLayout">
                {currentBg && (
                    <motion.img
                        key={currentBg}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 1.2, ease: "easeInOut" }}
                        src={currentBg}
                        alt="Cosmic background"
                        className="absolute inset-0 w-full h-full object-cover transform-gpu brightness-[0.7] contrast-[1.1]"
                        style={{ willChange: "opacity" }}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}
