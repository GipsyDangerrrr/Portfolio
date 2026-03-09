import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Volume2, VolumeX, ExternalLink, BarChart3, ChevronLeft, ChevronRight } from "lucide-react";

/* ── Data ── */
interface VideoItem {
    id: number;
    title: string;
    src: string;
    poster?: string;
}

const videoProjects: VideoItem[] = [
    { id: 1, title: "Brand Identity Reel", src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4" },
    { id: 2, title: "Product Launch Promo", src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4" },
    { id: 3, title: "Client Testimonial", src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4" },
    { id: 4, title: "Social Media Ad", src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4" },
    { id: 5, title: "Behind the Scenes", src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4" },
    { id: 6, title: "Campaign Recap", src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4" },
];

interface OtherProject {
    title: string;
    description: string;
    type: "web" | "marketing";
}

const otherProjects: Record<string, OtherProject[]> = {
    "Web Design": [
        { title: "E-Commerce Storefront", description: "Modern responsive storefront designed in Figma and built with Webflow.", type: "web" },
        { title: "SaaS Landing Page", description: "High-converting landing page with A/B tested hero sections.", type: "web" },
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
const CARD_W = 340;
const CARD_H = 210;
const RADIUS = 440;
const AUTO_SPEED = 0.3;
const RESUME_DELAY = 2000;
const TILT_X = -8;

/* ── 3D Carousel ── */
function Carousel3D() {
    const count = videoProjects.length;
    const angleStep = 360 / count;

    const [hoveredId, setHoveredId] = useState<number | null>(null);
    const [muted, setMuted] = useState(true);
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
            setDuration(vid.duration || 0);
            setProgress(0);
            setCurrentTime(0);
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
        const currentIdx = videoProjects.findIndex((v) => v.id === hoveredId);
        stopVideo(hoveredId);
        const nextIdx = (currentIdx + direction + count) % count;
        const nextId = videoProjects[nextIdx].id;
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
                maxWidth: 1100,
                height: isFlat ? 560 : 380,
                perspective: "1400px",
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
                {videoProjects.map((video, i) => {
                    const angle = i * angleStep;
                    const isActive = hoveredId === video.id;

                    const hoveredIndex = hoveredId
                        ? videoProjects.findIndex((v) => v.id === hoveredId)
                        : 0;
                    const flatOffset = i - hoveredIndex;
                    const wrappedOffset =
                        flatOffset > count / 2
                            ? flatOffset - count
                            : flatOffset < -count / 2
                                ? flatOffset + count
                                : flatOffset;

                    // Active card: almost fills the section
                    const activeW = 820;
                    const activeH = 480;

                    return (
                        <div
                            key={video.id}
                            className="absolute"
                            style={{
                                width: isFlat && isActive ? activeW : CARD_W,
                                height: isFlat && isActive ? activeH : CARD_H,
                                left: "50%",
                                top: "50%",
                                marginLeft: isFlat && isActive ? -(activeW / 2) : -(CARD_W / 2),
                                marginTop: isFlat && isActive ? -(activeH / 2) : -(CARD_H / 2),
                                transformStyle: "preserve-3d",
                                transform: isFlat
                                    ? isActive
                                        ? "translateZ(60px) scale(1)"
                                        : `translateX(${wrappedOffset * (wrappedOffset > 0 ? 420 : 420)}px) translateZ(-120px) scale(0.35)`
                                    : `rotateY(${angle}deg) translateZ(${RADIUS}px)`,
                                zIndex: isActive ? 30 : 5,
                                opacity: isFlat
                                    ? isActive ? 1 : Math.abs(wrappedOffset) > 2 ? 0 : 0.2
                                    : 1,
                                filter: isFlat && !isActive ? "blur(4px) brightness(0.35)" : "none",
                                transition: "all 0.7s cubic-bezier(0.4, 0, 0.2, 1)",
                            }}
                            onMouseEnter={() => handleCardHover(video.id)}
                        >
                            <div
                                className="relative w-full h-full rounded-2xl overflow-hidden border border-white/[0.1] shadow-2xl shadow-black/60 cursor-pointer group"
                                style={{ backfaceVisibility: "hidden" }}
                            >
                                <video
                                    ref={(el) => { if (el) videoRefs.current.set(video.id, el); }}
                                    src={video.src}
                                    muted={muted}
                                    playsInline
                                    loop
                                    preload="metadata"
                                    onTimeUpdate={(e) => isActive && handleTimeUpdate(e.currentTarget)}
                                    className="absolute inset-0 w-full h-full object-cover"
                                />

                                {/* Gradient overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />

                                {/* Info + Time slider */}
                                <div className="absolute bottom-0 left-0 right-0 p-5">
                                    {/* Time slider — only on active */}
                                    {isActive && (
                                        <div className="mb-3">
                                            <div
                                                ref={progressBarRef}
                                                onClick={handleSeek}
                                                className="relative w-full h-1.5 bg-white/15 rounded-full cursor-pointer group/bar"
                                            >
                                                <div
                                                    className="absolute top-0 left-0 h-full bg-primary rounded-full transition-[width] duration-100"
                                                    style={{ width: `${progress}%` }}
                                                />
                                                <div
                                                    className="absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 bg-white rounded-full shadow-md opacity-0 group-hover/bar:opacity-100 transition-opacity"
                                                    style={{ left: `calc(${progress}% - 7px)` }}
                                                />
                                            </div>
                                            <div className="flex justify-between mt-1.5">
                                                <span className="text-[10px] text-white/50 font-mono">{formatTime(currentTime)}</span>
                                                <span className="text-[10px] text-white/50 font-mono">{formatTime(duration)}</span>
                                            </div>
                                        </div>
                                    )}
                                    <p className="text-[10px] text-primary font-semibold tracking-[0.2em] uppercase mb-1.5">
                                        Video Editing
                                    </p>
                                    <h3 className={`font-display font-semibold text-white leading-tight ${isActive ? "text-lg" : "text-sm"}`}>
                                        {video.title}
                                    </h3>
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
                return (
                    <motion.div
                        key={project.title}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ delay: i * 0.08 }}
                        className="card-subtle overflow-hidden cursor-pointer group hover:border-white/[0.12] transition-all duration-300"
                    >
                        <div className="relative h-44 overflow-hidden bg-secondary/50 flex items-center justify-center">
                            <div className={`${accentClass} opacity-20`}>
                                {project.type === "web" ? <ExternalLink size={56} /> : <BarChart3 size={56} />}
                            </div>
                            <div className="absolute inset-0 bg-background/85 backdrop-blur-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <div className={`${accentClass} flex items-center gap-2 text-sm font-medium`}>
                                    {icon}
                                    <span>{project.type === "web" ? "View Project" : "View Metrics"}</span>
                                </div>
                            </div>
                        </div>
                        <div className="p-5">
                            <span className={`text-xs font-medium tracking-[0.15em] uppercase ${accentClass}`}>
                                {project.type === "web" ? "Web Design" : "Marketing"}
                            </span>
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
                    className="mb-14 text-center"
                >
                    <p className="text-xs font-medium tracking-[0.3em] uppercase text-muted-foreground mb-4">
                        Selected Work
                    </p>
                    <h2 className="font-display text-4xl md:text-5xl font-bold">
                        <span className="text-gradient">Portfolio</span>{" "}
                        <span className="text-foreground">Showcase</span>
                    </h2>
                </motion.div>

                {/* Category filters */}
                <div className="flex flex-wrap justify-center gap-3 mb-14">
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={`px-6 py-2.5 text-sm font-medium rounded-full transition-all duration-300 cursor-pointer ${activeCategory === cat
                                ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                                : "text-muted-foreground hover:text-foreground border border-white/[0.08] hover:border-white/[0.15]"
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

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
                            <Carousel3D />
                        ) : (
                            <ProjectGrid projects={otherProjects[activeCategory] || []} />
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>
        </section>
    );
}
