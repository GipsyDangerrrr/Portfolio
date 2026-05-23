import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ProductItem {
    id: number;
    title: string;
    src: string;
}

interface ProductCarouselProps {
    items: ProductItem[];
    autoplayInterval?: number;
}

export default function ProductCarousel({ items, autoplayInterval = 5000 }: ProductCarouselProps) {
    const [index, setIndex] = useState(0);
    const [isHovered, setIsHovered] = useState(false);
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const next = useCallback(() => setIndex((i) => (i + 1) % items.length), [items.length]);
    const prev = useCallback(() => setIndex((i) => (i - 1 + items.length) % items.length), [items.length]);

    // Autoplay logic with pause on hover
    useEffect(() => {
        if (!autoplayInterval || isHovered) {
            if (timerRef.current) clearInterval(timerRef.current);
            return;
        }

        timerRef.current = setInterval(next, autoplayInterval);
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [next, autoplayInterval, isHovered]);

    return (
        <div
            className="relative max-w-6xl mx-auto px-4 py-8"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Main Showcase Container — Dynamic Height */}
            <div className="relative rounded-3xl overflow-hidden glass shadow-[0_20px_50px_rgba(0,0,0,0.5)] ring-1 ring-white/10 group bg-black/10 transition-all duration-700">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={items[index].id}
                        initial={{ opacity: 0, scale: 0.98, filter: "blur(10px)" }}
                        animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                        exit={{ opacity: 0, scale: 1.02, filter: "blur(10px)" }}
                        transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
                        className="relative w-full flex items-center justify-center p-2 md:p-6"
                    >
                        <img
                            src={items[index].src}
                            alt={items[index].title}
                            className="max-h-[50vh] md:max-h-[80vh] w-auto h-auto object-contain select-none rounded-xl shadow-2xl"
                        />

                        {/* High-fidelity Info Overlay */}
                        <div className="absolute inset-x-0 bottom-0 py-10 px-8 md:px-16 bg-gradient-to-t from-black/95 via-black/40 to-transparent">
                            <motion.div
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3, duration: 0.6 }}
                                className="max-w-4xl mx-auto space-y-1"
                            >
                                <div className="flex items-center gap-3 mb-2">
                                    <span className="w-8 h-[1px] bg-primary/60" />
                                    <p className="text-[10px] font-bold tracking-[0.4em] uppercase text-primary/90">
                                        Campaign Portfolio
                                    </p>
                                </div>
                                <h3 className="text-xl md:text-3xl font-display font-bold text-white tracking-tight drop-shadow-lg">
                                    {items[index].title}
                                </h3>
                            </motion.div>
                        </div>
                    </motion.div>
                </AnimatePresence>

                {/* Navigation Arrows — Minimal & Refined */}
                <div className="absolute inset-y-0 left-4 flex items-center z-30 opacity-100 md:opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <button
                        onClick={(e) => { e.stopPropagation(); prev(); }}
                        className="w-12 h-12 rounded-full glass border border-white/10 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 hover:scale-110 active:scale-95 transition-all duration-300 backdrop-blur-2xl"
                    >
                        <ChevronLeft size={24} />
                    </button>
                </div>
                <div className="absolute inset-y-0 right-4 flex items-center z-30 opacity-100 md:opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <button
                        onClick={(e) => { e.stopPropagation(); next(); }}
                        className="w-12 h-12 rounded-full glass border border-white/10 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 hover:scale-110 active:scale-95 transition-all duration-300 backdrop-blur-2xl"
                    >
                        <ChevronRight size={24} />
                    </button>
                </div>

                {/* Autoplay Progress Bar */}
                <div className="absolute bottom-0 left-0 w-full h-[2px] bg-white/5 z-40">
                    <motion.div
                        key={`${index}-${isHovered}`}
                        initial={{ width: "0%" }}
                        animate={{ width: isHovered ? "0%" : "100%" }}
                        transition={{ duration: autoplayInterval / 1000, ease: "linear" }}
                        className="h-full bg-primary/60 shadow-[0_0_10px_rgba(var(--primary-rgb),0.5)]"
                    />
                </div>
            </div>

            {/* Thumbnail Navigation — Centered and Clean */}
            <div className="mt-8 flex justify-start md:justify-center gap-4 overflow-x-auto pb-4 no-scrollbar px-4 pt-2">
                {items.map((item, i) => (
                    <button
                        key={item.id}
                        onClick={() => setIndex(i)}
                        className={`relative flex-shrink-0 w-16 md:w-28 aspect-[4/3] rounded-lg md:rounded-xl overflow-hidden border-2 transition-all duration-500 ${i === index
                            ? "border-primary shadow-lg shadow-primary/20 scale-105"
                            : "border-white/5 opacity-30 hover:opacity-70 grayscale hover:grayscale-0"
                            }`}
                    >
                        <img src={item.src} className="w-full h-full object-cover" alt="" />
                    </button>
                ))}
            </div>
        </div>
    );
}
