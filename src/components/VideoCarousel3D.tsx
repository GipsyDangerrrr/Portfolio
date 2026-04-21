import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, Volume2, VolumeX, ExternalLink, BarChart3, ChevronLeft, ChevronRight } from "lucide-react";
import ProductCarousel from "./ProductCarousel";

/* ── Data ── */
interface VideoItem {
    id: number;
    title: string;
    src: string;
    poster?: string;
}

const videoProjects: VideoItem[] = [
    { id: 1, title: "Mesh Dress - Chapter I", src: "/videos/mesh_dress_1.mp4" },
    { id: 2, title: "Mesh Dress - Chapter II", src: "/videos/mesh_dress_2.mp4" },
    { id: 3, title: "Mesh Dress - Chapter III", src: "/videos/mesh_dress_3.mp4" },
    { id: 4, title: "The Wedding Gown", src: "/videos/wedding_dress_1.mp4" },
    { id: 5, title: "Ethereal White", src: "/videos/white_dress_1.mp4" },
];

const marketingProjects = [
    { id: 6, title: "Expodite: Fully Automate Your Exports", src: "/images/marketing/expodite/expodite-1.jpg" },
    { id: 7, title: "Expodite: Accelerate Your Global Growth", src: "/images/marketing/expodite/expodite-2.jpg" },
    { id: 8, title: "Expodite: Trade Faster, Not Harder", src: "/images/marketing/expodite/expodite-3.jpg" },
    { id: 9, title: "Expodite: The Game Changer for Logistics", src: "/images/marketing/expodite/expodite-4.jpg" },
    { id: 10, title: "Expodite: Your Success, Our Priority", src: "/images/marketing/expodite/expodite-5.jpg" },
];

interface OtherProject {
    title: string;
    description: string;
    type: "web" | "marketing";
    link?: string;
}

const otherProjects: Record<string, OtherProject[]> = {
    "Web Design": [
        {
            title: "Expodite Logistics",
            description: "High-performance logistics platform with specialized Fact-Checking architecture for the export-import industry.",
            type: "web",
            link: "https://www.expodite.in"
        },
        { title: "SaaS Landing Page", description: "High-converting landing page with 3D elements and A/B tested hero sections.", type: "web" },
        { title: "Portfolio Redesign", description: "Personal brand site with 3D elements and interactive animations.", type: "web" },
    ],
    "Marketing": [
        { title: "WhatsApp Growth Campaign", description: "Bulk outreach strategy using Aisensy, targeting export industry leads.", type: "marketing" },
        { title: "Social Media Strategy", description: "End-to-end social campaign with content calendar and analytics.", type: "marketing" },
        { title: "Email Automation Funnel", description: "Multi-step nurture sequence with 42% open rate.", type: "marketing" },
    ],
};

const categories = ["Video Editing", "Web Design", "Marketing"];

/* ── Constants ── */
const CARD_W = 200;
const AUTO_SPEED = 0.3;
const RESUME_DELAY = 2000;
const TILT_X = -8;

/* ── Hooks ── */
function useWindowSize() {
    const [size, setSize] = useState({ width: window.innerWidth, height: window.innerHeight });
    useEffect(() => {
        const handleResize = () => setSize({ width: window.innerWidth, height: window.innerHeight });
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);
    return size;
}

/* ── Device Frame Component ── */
function IPhoneFrame({ children }: { children: React.ReactNode }) {
    return (
        <div className="relative w-full h-full p-[6px] md:p-[7px] bg-[#1a1a1a] rounded-[38px] md:rounded-[42px] border-[1.5px] border-[#333] shadow-[0_0_40px_rgba(0,0,0,0.8),inset_0_0_10px_rgba(255,255,255,0.05)] ring-1 ring-white/10">
            {/* Bezel / Screen Housing */}
            <div className="relative w-full h-full bg-black rounded-[32px] md:rounded-[36px] overflow-hidden border border-white/5">
                {/* Dynamic Island */}
                <div className="absolute top-2 md:top-2.5 left-1/2 -translate-x-1/2 w-[50px] md:w-[70px] h-4 md:h-6 bg-black rounded-full z-50 flex items-center justify-between px-2 md:px-3">
                    <div className="w-1 h-1 md:w-1.5 md:h-1.5 rounded-full bg-[#111] border border-white/5" />
                    <div className="w-3 h-1 md:w-4 md:h-1.5 rounded-full bg-[#111] border border-white/5" />
                </div>

                {/* Video Content */}
                {children}

                {/* Glass Polish */}
                <div className="absolute inset-0 pointer-events-none bg-gradient-to-tr from-white/[0.03] via-transparent to-transparent z-40" />
            </div>

            {/* Side Buttons */}
            <div className="absolute top-16 md:top-20 -left-[2px] w-[3px] h-6 md:h-8 bg-[#2a2a2a] rounded-r-sm border-r border-white/5" />
            <div className="absolute top-30 md:top-36 -left-[2px] w-[3px] h-9 md:h-12 bg-[#2a2a2a] rounded-r-sm border-r border-white/5" />
            <div className="absolute top-44 md:top-52 -left-[2px] w-[3px] h-9 md:h-12 bg-[#2a2a2a] rounded-r-sm border-r border-white/5" />
            <div className="absolute top-34 md:top-40 -right-[2px] w-[3px] h-16 md:h-20 bg-[#2a2a2a] rounded-l-sm border-l border-white/5" />
        </div>
    );
}

/* ── 3D Carousel ── */
function Carousel3D({ items, type = "video" }: { items: VideoItem[], type?: "video" | "image" }) {
    const { width } = useWindowSize();
    const isMobile = width < 768;

    // Responsive Constants
    const CARD_W_ACTIVE = isMobile ? 120 : 200;
    const CARD_H_ACTIVE = isMobile ? 220 : 340;
    const RADIUS_ACTIVE = isMobile ? 280 : 380;
    const SHOWCASE_W = isMobile ? 260 : 320;
    const SHOWCASE_H = isMobile ? 520 : 640;

    const count = items.length;
    const angleStep = 360 / count;

    const [hoveredId, setHoveredId] = useState<number | null>(null);
    const [muted, setMuted] = useState(true);
    const [isPlaying, setIsPlaying] = useState(true);
    const [progress, setProgress] = useState(0);
    const [duration, setDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const videoRefs = useRef<Map<number, HTMLVideoElement>>(new Map());
    const containerRef = useRef<HTMLDivElement>(null);
    const progressBarRef = useRef<HTMLDivElement>(null);

    // Smooth rotation
    const rotationRef = useRef(0);
    const targetRotRef = useRef(0);
    const isPausedRef = useRef(false);
    const resumeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const [, setTick] = useState(0);

    const animate = useCallback(() => {
        if (!isPausedRef.current) {
            targetRotRef.current += AUTO_SPEED;
        }
        rotationRef.current += (targetRotRef.current - rotationRef.current) * 0.06;
        setTick((t) => t + 1);
        requestAnimationFrame(animate);
    }, []);

    useEffect(() => {
        const id = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(id);
    }, [animate]);

    // Autoplay all videos muted in 3D mode
    useEffect(() => {
        videoRefs.current.forEach((vid) => {
            vid.muted = true;
            vid.loop = true;
            vid.play().catch(() => { });
        });
    }, []);

    const playVideo = (id: number) => {
        const vid = videoRefs.current.get(id);
        if (vid) {
            vid.currentTime = 0;
            vid.play().catch(() => { });
            setIsPlaying(true);
            setDuration(vid.duration || 0);
            setProgress(0);
            setCurrentTime(0);
        }
    };

    const togglePlay = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (hoveredId === null) return;
        const vid = videoRefs.current.get(hoveredId);
        if (vid) {
            if (vid.paused) {
                vid.play();
                setIsPlaying(true);
            } else {
                vid.pause();
                setIsPlaying(false);
            }
        }
    };

    const handleTimeUpdate = (vid: HTMLVideoElement) => {
        if (vid.duration) {
            setProgress((vid.currentTime / vid.duration) * 100);
            setCurrentTime(vid.currentTime);
            setDuration(vid.duration);
        }
    };

    const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!progressBarRef.current || hoveredId === null) return;
        const rect = progressBarRef.current.getBoundingClientRect();
        const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
        const vid = videoRefs.current.get(hoveredId);
        if (vid && vid.duration) {
            vid.currentTime = ratio * vid.duration;
        }
    };

    const formatTime = (s: number) => {
        const m = Math.floor(s / 60);
        const sec = Math.floor(s % 60);
        return `${m}:${sec.toString().padStart(2, "0")}`;
    };

    const stopVideo = (id: number) => {
        const vid = videoRefs.current.get(id);
        if (vid) {
            vid.pause();
            vid.currentTime = 0;
        }
    };

    /* ── Hover: tracked at CONTAINER level, not per-card ── */
    const handleCardHover = (id: number) => {
        if (resumeTimerRef.current) {
            clearTimeout(resumeTimerRef.current);
            resumeTimerRef.current = null;
        }
        // Stop all videos, then play only the hovered one
        if (hoveredId !== null && hoveredId !== id) {
            stopVideo(hoveredId);
        }
        isPausedRef.current = true;
        setHoveredId(id);
        setIsPlaying(true);
        playVideo(id);
    };

    const handleContainerLeave = () => {
        if (hoveredId !== null) {
            stopVideo(hoveredId);
        }
        setHoveredId(null);
        // Restart all videos for 3D mode after delay
        resumeTimerRef.current = setTimeout(() => {
            isPausedRef.current = false;
            resumeTimerRef.current = null;
            videoRefs.current.forEach((vid) => {
                vid.muted = true;
                vid.loop = true;
                vid.play().catch(() => { });
            });
        }, RESUME_DELAY);
    };

    const switchTo = (direction: -1 | 1) => {
        if (hoveredId === null) return;
        const currentIdx = items.findIndex((v) => v.id === hoveredId);
        stopVideo(hoveredId);
        const nextIdx = (currentIdx + direction + count) % count;
        const nextId = items[nextIdx].id;
        setHoveredId(nextId);
        playVideo(nextId);
    };

    useEffect(() => {
        return () => {
            if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
        };
    }, []);

    const isFlat = hoveredId !== null;
    const rotation = rotationRef.current;

    return (
        <div
            ref={containerRef}
            className="relative mx-auto"
            style={{
                width: "100%",
                maxWidth: isMobile ? "100%" : 1100,
                height: isFlat ? (isMobile ? 600 : 800) : (isMobile ? 360 : 420),
                perspective: isMobile ? "1000px" : "1400px",
                transition: "height 0.7s cubic-bezier(0.4, 0, 0.2, 1)",
            }}
            onMouseLeave={handleContainerLeave}
        >
            <div
                className="absolute inset-0 flex items-center justify-center"
                style={{
                    transformStyle: "preserve-3d",
                    transform: isFlat
                        ? "rotateX(0deg) rotateY(0deg)"
                        : `rotateX(${TILT_X}deg) rotateY(${rotation}deg)`,
                    transition: isFlat ? "transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)" : "none",
                }}
            >
                {items.map((item, i) => {
                    const angle = i * angleStep;
                    const isActive = hoveredId === item.id;

                    const hoveredIndex = hoveredId
                        ? items.findIndex((v) => v.id === hoveredId)
                        : 0;
                    const flatOffset = i - hoveredIndex;
                    const wrappedOffset =
                        flatOffset > count / 2
                            ? flatOffset - count
                            : flatOffset < -count / 2
                                ? flatOffset + count
                                : flatOffset;

                    const isMarketing = type === "image";
                    const activeW = isMarketing
                        ? (isMobile ? 260 : 380)
                        : SHOWCASE_W;
                    const activeH = isMarketing
                        ? (isMobile ? 220 : 320)
                        : SHOWCASE_H;

                    const cardW = isMarketing
                        ? (isMobile ? 140 : 240)
                        : (isMobile ? 110 : 200);
                    const cardH = isMarketing
                        ? (isMobile ? 120 : 200)
                        : (isMobile ? 180 : 340);

                    return (
                        <div
                            key={item.id}
                            className="absolute"
                            style={{
                                width: isFlat && isActive ? activeW : cardW,
                                height: isFlat && isActive ? activeH : cardH,
                                left: "50%",
                                top: "50%",
                                marginLeft: isFlat && isActive ? -(activeW / 2) : -(cardW / 2),
                                marginTop: isFlat && isActive ? -(activeH / 2) : -(cardH / 2),
                                transformStyle: "preserve-3d",
                                transform: isFlat
                                    ? isActive
                                        ? `translateZ(${isMobile ? 60 : 100}px) scale(${isMobile ? 1.05 : 1.1})`
                                        : `translateX(${wrappedOffset * (isMobile ? 180 : 280)}px) translateZ(-150px) scale(0.35)`
                                    : `rotateY(${angle}deg) translateZ(${RADIUS_ACTIVE}px)`,
                                zIndex: isActive ? 30 : 5,
                                opacity: isFlat
                                    ? isActive ? 1 : Math.min(0.2, 1 / (Math.abs(wrappedOffset) || 1))
                                    : 1,
                                filter: isFlat && !isActive ? "blur(8px) brightness(0.35)" : "none",
                                transition: "all 0.8s cubic-bezier(0.4, 0, 0.2, 1)",
                            }}
                            onMouseEnter={() => handleCardHover(item.id)}
                        >
                            <div
                                className={`relative w-full h-full cursor-pointer group ${isActive ? "" : "rounded-2xl overflow-hidden border border-white/[0.1] shadow-2xl shadow-black/60"}`}
                                style={{ backfaceVisibility: "hidden" }}
                            >
                                {isActive ? (
                                    <IPhoneFrame>
                                        <video
                                            ref={(el) => { if (el) videoRefs.current.set(item.id, el); }}
                                            src={item.src}
                                            muted={muted}
                                            playsInline
                                            loop
                                            preload="metadata"
                                            onTimeUpdate={(e) => isActive && handleTimeUpdate(e.currentTarget)}
                                            className="absolute inset-0 w-full h-full object-cover"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent z-10" />
                                    </IPhoneFrame>
                                ) : (
                                    <>
                                        {type === "video" ? (
                                            <video
                                                ref={(el) => { if (el) videoRefs.current.set(item.id, el); }}
                                                src={item.src}
                                                muted={true}
                                                playsInline
                                                loop
                                                preload="metadata"
                                                className="absolute inset-0 w-full h-full object-cover"
                                            />
                                        ) : (
                                            <img src={item.src} alt={item.title} className="absolute inset-0 w-full h-full object-cover" />
                                        )}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
                                    </>
                                )}

                                {/* Info + Time slider */}
                                <div className="absolute bottom-0 left-0 right-0 p-5 z-20">
                                    {/* Playback Controls & Timeline — only on active */}
                                    {isActive && (
                                        <div className="mb-4">
                                            <div className="flex items-center gap-3 mb-2">
                                                <button
                                                    onClick={togglePlay}
                                                    className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 hover:bg-white/20 transition-all text-white"
                                                >
                                                    {isPlaying ? <Pause size={14} fill="currentColor" /> : <Play size={14} fill="currentColor" className="ml-0.5" />}
                                                </button>

                                                <div
                                                    ref={progressBarRef}
                                                    onClick={handleSeek}
                                                    className="relative flex-1 h-1.5 bg-white/15 rounded-full cursor-pointer group/bar"
                                                >
                                                    <div
                                                        className="absolute top-0 left-0 h-full bg-primary rounded-full transition-[width] duration-100"
                                                        style={{ width: `${progress}%` }}
                                                    />
                                                    <div
                                                        className="absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 bg-white rounded-full shadow-lg opacity-0 group-hover/bar:opacity-100 transition-opacity ring-2 ring-primary/50"
                                                        style={{ left: `calc(${progress}% - 7px)` }}
                                                    />
                                                </div>
                                            </div>

                                            <div className="flex justify-between px-1">
                                                <span className="text-[9px] text-white/40 font-mono tracking-wider">{formatTime(currentTime)} / {formatTime(duration)}</span>
                                                <span className="text-[9px] text-primary/80 font-mono font-bold tracking-widest uppercase">{type === "video" ? "HD PORTRAIT" : "CAMPAIGN CAPTURE"}</span>
                                            </div>
                                        </div>
                                    )}

                                    <div className="space-y-1">
                                        <p className="text-[10px] text-primary font-bold tracking-[0.25em] uppercase drop-shadow-md">
                                            Video Editing
                                        </p>
                                        <h3
                                            className={`font-display font-bold text-white leading-tight drop-shadow-2xl ${isActive ? "text-xl md:text-2xl" : "text-sm"}`}
                                            style={{
                                                textShadow: isActive ? '0 2px 10px rgba(0,0,0,0.8), 0 0 40px rgba(0,0,0,0.5)' : '0 1px 4px rgba(0,0,0,0.8)'
                                            }}
                                        >
                                            {item.title}
                                        </h3>
                                    </div>
                                </div>

                                {/* Mute toggle */}
                                {isActive && (
                                    <button
                                        onClick={(e) => { e.stopPropagation(); setMuted(!muted); }}
                                        className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center border border-white/15 hover:bg-black/70 transition-all z-30"
                                    >
                                        {muted ? <VolumeX size={15} className="text-white" /> : <Volume2 size={15} className="text-white" />}
                                    </button>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Navigation arrows — visible when flat, positioned OUTSIDE the 3D container */}
            {isFlat && (
                <>
                    <button
                        onClick={() => switchTo(-1)}
                        className="absolute left-2 md:left-6 top-1/2 -translate-y-1/2 z-50 w-12 h-12 rounded-full bg-white/[0.06] backdrop-blur-lg border border-white/[0.12] flex items-center justify-center hover:bg-white/[0.15] hover:border-white/[0.25] hover:scale-110 transition-all duration-300 cursor-pointer group"
                    >
                        <ChevronLeft size={22} className="text-white/70 group-hover:text-white transition-colors" />
                    </button>
                    <button
                        onClick={() => switchTo(1)}
                        className="absolute right-2 md:right-6 top-1/2 -translate-y-1/2 z-50 w-12 h-12 rounded-full bg-white/[0.06] backdrop-blur-lg border border-white/[0.12] flex items-center justify-center hover:bg-white/[0.15] hover:border-white/[0.25] hover:scale-110 transition-all duration-300 cursor-pointer group"
                    >
                        <ChevronRight size={22} className="text-white/70 group-hover:text-white transition-colors" />
                    </button>
                </>
            )}

            {/* Reflection */}
            <div
                className="absolute bottom-0 left-1/2 -translate-x-1/2 w-64 h-px"
                style={{ background: "linear-gradient(90deg, transparent, hsl(220 90% 56% / 0.3), transparent)" }}
            />
        </div>
    );
}

/* ── Grid for non-video categories ── */
function ProjectGrid({ projects }: { projects: OtherProject[] }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-5xl mx-auto">
            {projects.map((project, i) => {
                const icon = project.type === "web" ? <ExternalLink size={18} /> : <BarChart3 size={18} />;
                const accentClass = project.type === "web" ? "text-accent" : "text-primary";

                const handleClick = () => {
                    if (project.link) {
                        window.open(project.link, "_blank", "noopener,noreferrer");
                    }
                };

                return (
                    <motion.div
                        key={project.title}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ delay: i * 0.08 }}
                        onClick={handleClick}
                        className={`card-subtle overflow-hidden transition-all duration-300 ${project.link ? "cursor-pointer group hover:border-white/20 active:scale-[0.98]" : "cursor-default"}`}
                    >
                        <div className="relative h-44 overflow-hidden bg-secondary/50 flex items-center justify-center">
                            <div className={`${accentClass} opacity-20`}>
                                {project.type === "web" ? <ExternalLink size={56} /> : <BarChart3 size={56} />}
                            </div>
                            {project.link && (
                                <div className="absolute inset-0 bg-background/85 backdrop-blur-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <div className={`${accentClass} flex items-center gap-2 text-sm font-medium`}>
                                        {icon}
                                        <span>{project.type === "web" ? "Visit Live Site" : "View Metrics"}</span>
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="p-5">
                            <div className="flex justify-between items-start">
                                <span className={`text-xs font-medium tracking-[0.15em] uppercase ${accentClass}`}>
                                    {project.type === "web" ? "Web Design" : "Marketing"}
                                </span>
                                {project.link && <ExternalLink size={12} className="text-muted-foreground/50 group-hover:text-primary transition-colors" />}
                            </div>
                            <h3 className="font-display text-lg font-semibold mt-2 text-foreground">{project.title}</h3>
                            <p className="text-sm text-muted-foreground mt-2 leading-relaxed line-clamp-2">{project.description}</p>
                        </div>
                    </motion.div>
                );
            })}
        </div>
    );
}

/* ── Main Section ── */
export default function VideoCarousel3D() {
    const [activeCategory, setActiveCategory] = useState("Video Editing");

    return (
        <section id="portfolio" className="section-padding overflow-hidden">
            <div className="max-w-6xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mb-14 text-center liquid-glass p-8 md:p-12 rounded-[4rem] relative overflow-hidden max-w-3xl mx-auto"
                >
                    <div className="relative z-10">
                        <p className="text-xs font-medium tracking-[0.3em] uppercase text-muted-foreground mb-4">
                            Selected Work
                        </p>
                        <h2 className="font-display text-4xl md:text-5xl font-bold mb-10">
                            <span className="text-gradient">Portfolio</span>{" "}
                            <span className="text-foreground">Showcase</span>
                        </h2>

                        {/* Category filters */}
                        <div className="flex flex-wrap justify-center gap-3">
                            {categories.map((cat) => (
                                <button
                                    key={cat}
                                    onClick={() => setActiveCategory(cat)}
                                    className={`px-6 py-2.5 text-sm font-medium rounded-full transition-all duration-300 cursor-pointer ${activeCategory === cat
                                        ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                                        : "bg-white/5 border border-white/10 text-foreground hover:bg-white/10"
                                        }`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>
                </motion.div>

                {/* Content */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeCategory}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -15 }}
                        transition={{ duration: 0.4 }}
                    >
                        {activeCategory === "Video Editing" ? (
                            <Carousel3D items={videoProjects} type="video" />
                        ) : activeCategory === "Marketing" ? (
                            <ProductCarousel items={marketingProjects} />
                        ) : (
                            <ProjectGrid projects={otherProjects[activeCategory] || []} />
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>
        </section>
    );
}
