import { lazy, Suspense, useState, useEffect, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import ShootingKeys from "./ShootingKeys";
import ScreenContent from "./ScreenContent";

const WHEEL_SENSITIVITY = 0.0015;
const TOUCH_SENSITIVITY = 0.0025;

export default function HeroSection() {
    const [progress, setProgress] = useState(0);
    const [showSkillset, setShowSkillset] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const progressRef = useRef(0);
    const heroRef = useRef<HTMLElement>(null);
    const touchStartY = useRef(0);

    useEffect(() => {
        setIsMobile(window.innerWidth < 768);
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    useEffect(() => {
        const onWheel = (e: WheelEvent) => {
            if (window.scrollY > 0) return;
            const p = progressRef.current;
            if (p >= 1 && e.deltaY > 0) return;
            if (p <= 0 && e.deltaY < 0) return;
            e.preventDefault();
            const next = Math.max(0, Math.min(1, p + e.deltaY * WHEEL_SENSITIVITY));
            progressRef.current = next;
            setProgress(next);
        };

        const onTouchStart = (e: TouchEvent) => {
            touchStartY.current = e.touches[0].clientY;
        };

        const onTouchMove = (e: TouchEvent) => {
            if (window.scrollY > 0) return;
            const p = progressRef.current;
            const dy = touchStartY.current - e.touches[0].clientY;
            if (p >= 1 && dy > 0) return;
            if (p <= 0 && dy < 0) return;
            e.preventDefault();
            const next = Math.max(0, Math.min(1, p + dy * TOUCH_SENSITIVITY));
            progressRef.current = next;
            setProgress(next);
            touchStartY.current = e.touches[0].clientY;
        };

        window.addEventListener("wheel", onWheel, { passive: false });
        window.addEventListener("touchstart", onTouchStart, { passive: true });
        window.addEventListener("touchmove", onTouchMove, { passive: false });

        return () => {
            window.removeEventListener("wheel", onWheel);
            window.removeEventListener("touchstart", onTouchStart);
            window.removeEventListener("touchmove", onTouchMove);
        };
    }, []);

    const t = progress < 0.5
        ? 2 * progress * progress
        : -1 + (4 - 2 * progress) * progress;

    const scaleFactor = isMobile ? 1.45 : 1.39;
    const zoomFactor = isMobile ? 0.45 : 0.69;
    const monitorScale = scaleFactor - t * zoomFactor;
    const monitorTranslateY = t * (isMobile ? 2 : 6); // Move less on Y for mobile as we are already zoomed

    return (
        <section
            id="hero"
            ref={heroRef}
            style={{
                height: "100vh",
                position: "relative",
                overflow: "hidden",
                background: "#010101",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            <div
                style={{
                    position: "absolute",
                    inset: -50,
                    backgroundImage: `url('/Portfolio/space-bg.jpg')`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    opacity: 0.3,
                    filter: "blur(4px)",
                    transform: `scale(${1.1 - t * 0.1})`,
                    transition: "transform 0.1s ease-out",
                    zIndex: 0,
                }}
            />

            {/* ── Global Cinematic Shooting Keys Overlay ── */}
            <div style={{
                position: "absolute",
                inset: 0,
                zIndex: 100,
                pointerEvents: "none",
            }}>
                <Canvas
                    camera={{ position: [0, 0, 15], fov: 50 }}
                    gl={{ antialias: true, alpha: true }}
                    style={{ pointerEvents: "none" }}
                >
                    <ambientLight intensity={0.5} />
                    <pointLight position={[10, 10, 10]} intensity={1.2} />
                    <ShootingKeys
                        showSkillset={showSkillset}
                        progress={t}
                        monitorScale={monitorScale}
                        monitorTranslateY={monitorTranslateY}
                    />
                </Canvas>
            </div>

            <div style={{
                transform: `scale(${monitorScale}) translateY(${monitorTranslateY}vh)`,
                transformOrigin: "center center",
                zIndex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                width: isMobile ? "92vw" : "75vw",
                flexShrink: 0,
                position: "relative",
            }}>
                {/* ── Monitor ── */}
                <div style={{
                    width: "100%",
                    aspectRatio: "1.79 / 1",
                    position: "relative",
                    background: "#000",
                    borderRadius: "1.8vw",
                    padding: "1.2vw",
                    boxShadow: `
                        0 0 0 2px rgba(100,100,255,0.2),
                        0 30px 80px rgba(0,0,0,0.8)
                    `,
                }}>
                    <div style={{
                        width: "100%", height: "100%",
                        borderRadius: "0.8vw",
                        overflow: "hidden",
                        background: "#000",
                        position: "relative",
                    }}>
                        {/* New Landing Page Overhaul */}
                        <ScreenContent progress={t} />

                        {/* Liquid Glass Showcase Overlay (Inside monitor) */}
                        <div style={{
                            position: "absolute",
                            inset: 0,
                            background: "rgba(10, 10, 30, 0.4)",
                            backdropFilter: "blur(20px)",
                            opacity: showSkillset ? 1 : 0,
                            pointerEvents: "none",
                            transition: "opacity(0.8s) ease-in-out",
                            zIndex: 30,
                        }} />

                        {/* Liquid Glass Overlay (Physical frame touch) */}
                        <div style={{
                            position: "absolute",
                            inset: 0,
                            pointerEvents: "none",
                            boxShadow: "inset 0 0 40px rgba(0,0,0,0.6)",
                            zIndex: 100,
                        }} />
                    </div>
                </div>

                {/* Skillset Toggle Button */}
                {t > 0.95 && (
                    <div style={{
                        position: "absolute",
                        top: "115%",
                        zIndex: 200,
                        cursor: "pointer",
                    }}>
                        <button
                            onClick={() => setShowSkillset(!showSkillset)}
                            className="group px-6 py-2.5 bg-white/10 hover:bg-white/20 border border-white/40 hover:border-white backdrop-blur-xl rounded-full text-[10px] md:text-xs font-medium text-white/90 hover:text-white tracking-widest uppercase transition-all active:scale-95 flex items-center gap-2"
                        >
                            <span className={`w-2 h-2 rounded-full transition-colors ${showSkillset ? 'bg-primary animate-pulse' : 'bg-white/60 group-hover:bg-white'}`} />
                            {showSkillset ? "Back to Experience" : "Click for Skillset"}
                        </button>
                    </div>
                )}



                {/* Stand & Desk */}
                <div style={{
                    position: "absolute",
                    top: "100%",
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                }}>
                    <div style={{ width: isMobile ? 12 : 22, height: isMobile ? 20 : 48, background: "linear-gradient(to bottom, #1a1a2e, #0d0d1a)", zIndex: 9 }} />
                    <div style={{ width: isMobile ? 100 : 180, height: isMobile ? 6 : 12, borderRadius: 8, background: "linear-gradient(to right, #0d0d1a, #1e1e30, #0d0d1a)", zIndex: 8 }} />

                    {!isMobile && (
                        <div style={{ position: "relative", marginTop: -6, width: "150%", display: "flex", flexDirection: "column", alignItems: "center", zIndex: 5 }}>
                            <div style={{ width: "100%", height: 25, background: "linear-gradient(135deg, rgba(20, 10, 40, 0.6), rgba(10, 30, 60, 0.4))", backdropFilter: "blur(20px)", borderRadius: "20px 20px 0 0", borderTop: "1px solid rgba(150, 200, 255, 0.3)" }} />
                            <div style={{ width: "80%", height: "20vh", display: "flex", justifyContent: "space-between" }}>
                                <div style={{ width: 36, height: "100%", background: "rgba(10,10,30,0.95)" }} />
                                <div style={{ width: 36, height: "100%", background: "rgba(10,10,30,0.15)" }} />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}
