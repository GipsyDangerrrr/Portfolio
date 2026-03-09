import { lazy, Suspense, useState, useEffect, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import { KeyboardMesh } from "./SkillKeyboard3D";

import ShootingKeys from "./ShootingKeys";

const SplineScene = lazy(() => import("@splinetool/react-spline"));
const SPLINE_URL = "https://prod.spline.design/7ufJlw2VhKzYz8ou/scene.splinecode";

// Increased sensitivities for a faster zoom out
const WHEEL_SENSITIVITY = 0.0015;
const TOUCH_SENSITIVITY = 0.0025;

export default function HeroSection() {
    const [capable, setCapable] = useState(true);
    const [progress, setProgress] = useState(0);
    const progressRef = useRef(0);
    const heroRef = useRef<HTMLElement>(null);
    const touchStartY = useRef(0);

    useEffect(() => {
        const canvas = document.createElement("canvas");
        const gl = canvas.getContext("webgl2") || canvas.getContext("webgl");
        if (!gl) setCapable(false);
    }, []);

    useEffect(() => {
        const onWheel = (e: WheelEvent) => {
            // If user has scrolled down the page, don't intercept!
            // We only want to control the zoom animation when at the very top.
            if (window.scrollY > 0) return;

            const p = progressRef.current;
            // Let browser scroll normally down if animation is done (progress=1)
            if (p >= 1 && e.deltaY > 0) return;
            // Let browser scroll normally up if we are at the start (progress=0)
            if (p <= 0 && e.deltaY < 0) return;

            // Otherwise capture the event and advance animation
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

        // passive: false is required to call preventDefault
        window.addEventListener("wheel", onWheel, { passive: false });
        window.addEventListener("touchstart", onTouchStart, { passive: true });
        window.addEventListener("touchmove", onTouchMove, { passive: false });

        return () => {
            window.removeEventListener("wheel", onWheel);
            window.removeEventListener("touchstart", onTouchStart);
            window.removeEventListener("touchmove", onTouchMove);
        };
    }, []);

    // Ease in-out
    const t = progress < 0.5
        ? 2 * progress * progress
        : -1 + (4 - 2 * progress) * progress;

    // Scale: 1.35 (screen perfectly fills viewport, zoomed out slightly more) → 0.70 (full monitor + stand + desk)
    const monitorScale = 1.35 - t * 0.65;

    // Y-Offset: Start perfectly centered (0) to fit full screen, then shift down as we zoom out so it rests low
    const monitorTranslateY = t * 6;

    const [isHoveringMonitor, setIsHoveringMonitor] = useState(true);

    return (
        <section
            id="hero"
            ref={heroRef}
            style={{
                // Just 100vh — no empty space. Scroll lock is handled by JS.
                height: "100vh",
                position: "relative",
                overflow: "hidden",
                background: "#05050f",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
            }}
        >

            {/* ── Dynamic Space Background ── */}
            <div
                style={{
                    position: "absolute",
                    inset: -50, // Slight overflow to allow scaling
                    backgroundImage: "url('/space-bg.jpg')",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    opacity: 0.8,
                    // Slowly zoom out the background as we scroll to give parallax 3D feel
                    transform: `scale(${1.1 - t * 0.1})`,
                    transition: "transform 0.1s ease-out",
                    zIndex: 0,
                }}
            />

            {/* ── Shooting Skill Keys Canvas ── */}
            <div style={{
                position: "absolute",
                inset: 0,
                zIndex: 1,
                pointerEvents: "none",
            }}>
                <Canvas
                    camera={{ position: [0, 0, 10], fov: 50 }}
                    gl={{ antialias: true, alpha: true }}
                >
                    <ambientLight intensity={0.4} />
                    <pointLight position={[10, 10, 10]} intensity={1} />
                    <ShootingKeys showcase={!isHoveringMonitor} t={t} />
                </Canvas>
            </div>

            {/* The entire monitor + desk + keyboard scales as one unit */}
            <div style={{
                transform: `scale(${monitorScale}) translateY(${monitorTranslateY}vh)`,
                transformOrigin: "center center",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                width: "72vw",
                flexShrink: 0,
                zIndex: 1, // Above background
                position: "relative",
            }}>
                {/* ── Monitor bezel ── */}
                <div
                    onMouseEnter={() => setIsHoveringMonitor(true)}
                    onMouseLeave={() => setIsHoveringMonitor(false)}
                    style={{
                        width: "100%",
                        background: "#0c0c18",
                        borderRadius: 16,
                        padding: "2.2% 2% 2%",
                        boxShadow: `
                        0 0 0 2px rgba(0,245,255,0.35),
                        0 0 40px rgba(0,245,255,0.12),
                        0 30px 80px rgba(0,0,0,0.8)
                    `,
                        position: "relative",
                        zIndex: 10,
                    }}>
                    {/* Camera dot */}
                    <div style={{
                        position: "absolute", top: 10, left: "50%",
                        transform: "translateX(-50%)",
                        width: 8, height: 8, borderRadius: "50%",
                        background: "#1a1a30",
                        boxShadow: "0 0 6px rgba(0,245,255,0.4)",
                    }} />

                    {/* ── Screen ── */}
                    {/* Interpolate height from exact 100vh (scaled down) to 16:9 ratio of width */}
                    <div style={{
                        width: "100%",
                        height: `calc( (1 - ${t}) * (100vh / 1.35) + ${t} * 38.88vw )`,
                        borderRadius: 8,
                        overflow: "hidden",
                        background: "#000",
                        position: "relative",
                    }}>
                        {capable ? (
                            <Suspense fallback={<div style={{ width: "100%", height: "100%", background: "#05050f" }} />}>
                                <SplineScene
                                    scene={SPLINE_URL}
                                    style={{ width: "100%", height: "100%", display: "block" }}
                                />
                            </Suspense>
                        ) : (
                            <div style={{
                                width: "100%", height: "100%",
                                display: "flex", alignItems: "center", justifyContent: "center",
                                background: "#05050f", color: "#fff",
                                fontSize: "clamp(1.5rem, 4vw, 3rem)", fontWeight: 700,
                            }}>
                                Marketing Strategist &amp; Web Developer
                            </div>
                        )}
                        {/* Vignette */}
                        <div style={{
                            position: "absolute", inset: 0, pointerEvents: "none",
                            background: "radial-gradient(ellipse at center, transparent 60%, rgba(5,5,15,0.35) 100%)",
                        }} />
                    </div>

                    {/* Brand label */}
                    <div style={{
                        textAlign: "center", marginTop: 10,
                        fontSize: "0.55rem", letterSpacing: "0.18em",
                        color: "rgba(255,255,255,0.2)", fontFamily: "monospace",
                        textTransform: "uppercase",
                    }}>
                        Atharv Shah · 4K
                    </div>
                </div>

                {/* ── Stand & Desk (Absolute to avoid breaking monitor's center scale) ── */}
                <div style={{
                    position: "absolute",
                    top: "100%",
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                }}>
                    {/* ── Neck ── */}
                    <div style={{
                        width: 22, height: 48,
                        background: "linear-gradient(to bottom, #1a1a2e, #0d0d1a)",
                        flexShrink: 0,
                        zIndex: 9,
                    }} />

                    {/* ── Base ── */}
                    <div style={{
                        width: 180, height: 12,
                        borderRadius: 8,
                        background: "linear-gradient(to right, #0d0d1a, #1e1e30, #0d0d1a)",
                        boxShadow: "0 0 20px rgba(0,245,255,0.25), 0 4px 20px rgba(0,0,0,0.6)",
                        zIndex: 8,
                    }} />

                    {/* ── Cosmic Glass Desk Surface & Legs ── */}
                    <div style={{
                        position: "relative",
                        marginTop: -6, // Shift up over base shadow to make connection seamless
                        width: "150%", // Wide desk
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        zIndex: 5,
                    }}>
                        {/* Desk Top Surface */}
                        <div style={{
                            width: "100%",
                            height: 25, // reduced from 40 for a thinner desk surface
                            background: "linear-gradient(135deg, rgba(20, 10, 40, 0.6), rgba(10, 30, 60, 0.4))",
                            backdropFilter: "blur(20px)",
                            borderRadius: "20px 20px 0 0",
                            boxShadow: `
                            inset 0 2px 10px rgba(100,200,255,0.3),
                            inset 0 -2px 15px rgba(255,0,255,0.1),
                            0 -10px 40px rgba(0,0,0,0.8),
                            0 0 30px rgba(0, 245, 255, 0.15)
                        `,
                            borderTop: "1px solid rgba(150, 200, 255, 0.5)",
                            borderLeft: "1px solid rgba(150, 200, 255, 0.2)",
                            borderRight: "1px solid rgba(150, 200, 255, 0.2)",
                            position: "relative",
                            zIndex: 2,
                        }}>
                            {/* Glowing neon front lip */}
                            <div style={{
                                position: "absolute", bottom: 0, left: 0, right: 0, height: 8,
                                background: "linear-gradient(90deg, transparent, rgba(0, 245, 255, 0.8), rgba(160, 32, 240, 0.8), transparent)",
                                boxShadow: "0 0 15px rgba(0, 245, 255, 0.5)",
                                borderTop: "1px solid rgba(255,255,255,0.3)",
                            }} />
                        </div>

                        {/* Desk Legs Layout (Shorter) */}
                        <div style={{
                            width: "80%", // Legs inset from the edges
                            height: "35vh", // Reduced height
                            display: "flex",
                            justifyContent: "space-between",
                            zIndex: 1,
                        }}>
                            {/* Left Cosmic Leg */}
                            <div style={{
                                width: 36, height: "100%",
                                background: "linear-gradient(to right, rgba(10,10,30,0.95), rgba(20,30,60,0.8), rgba(10,10,30,0.95))",
                                boxShadow: "inset 2px 0 8px rgba(0,245,255,0.4), inset -2px 0 8px rgba(160,32,240,0.3), -10px 10px 30px rgba(0,0,0,0.8)",
                                borderLeft: "1px solid rgba(0,245,255,0.3)",
                                borderRight: "1px solid rgba(160,32,240,0.2)",
                            }} />
                            {/* Right Cosmic Leg */}
                            <div style={{
                                width: 36, height: "100%",
                                background: "linear-gradient(to right, rgba(10,10,30,0.95), rgba(20,30,60,0.8), rgba(10,10,30,0.95))",
                                boxShadow: "inset -2px 0 8px rgba(0,245,255,0.4), inset 2px 0 8px rgba(160,32,240,0.3), 10px 10px 30px rgba(0,0,0,0.8)",
                                borderRight: "1px solid rgba(0,245,255,0.3)",
                                borderLeft: "1px solid rgba(160,32,240,0.2)",
                            }} />
                        </div>
                    </div>

                </div> {/* End Stand & Desk Wrapper */}

                {/* ── Skillset Keyboard (Temporarily removed) ── */}
            </div>

            {/* Scroll hint */}
            <div style={{
                position: "absolute", bottom: 28, left: "50%",
                transform: "translateX(-50%)",
                opacity: Math.max(0, 1 - t * 6),
                pointerEvents: "none", zIndex: 10,
                display: "flex", flexDirection: "column",
                alignItems: "center", gap: 6,
            }}>
                <span style={{
                    color: "#00f5ff", fontSize: "0.6rem",
                    letterSpacing: "0.2em", fontFamily: "monospace",
                    textTransform: "uppercase",
                }}>
                    scroll to zoom out
                </span>
                <div style={{
                    width: 1, height: 28,
                    background: "linear-gradient(to bottom, #00f5ff, transparent)",
                    animation: "heroPulse 1.8s ease-in-out infinite",
                }} />
            </div>

            <style>{`
                @keyframes heroPulse {
                    0%, 100% { opacity: 0.3; }
                    50% { opacity: 1; }
                }
            `}</style>
        </section>
    );
}
