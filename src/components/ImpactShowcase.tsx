import { useRef, useMemo } from "react";
import { BRAND } from "@/config/brand";
import { motion, useScroll, useTransform } from "framer-motion";
import {
    TrendingUp,
    Users,
    Globe,
    Play,
    Heart,
    MessageCircle,
    Send,
    Bookmark,
    Share2
} from "lucide-react";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    AreaChart,
    Area
} from "recharts";

/* ── Data from Screenshots ── */
const growthData = [
    { day: "09 Feb", followers: 2885 },
    { day: "14 Feb", followers: 2950 },
    { day: "16 Feb", followers: 5800 }, // Viral spike (Part 3 Reel)
    { day: "20 Feb", followers: 7200 },
    { day: "25 Feb", followers: 8100 },
    { day: "02 Mar", followers: 8900 },
    { day: "10 Mar", followers: 9352 },
];

const impactMetrics = [
    {
        label: "Video Views",
        value: "1.3M",
        sub: "Last 30 days",
        icon: <Play size={20} />,
        color: "text-blue-400",
        bg: "/Portfolio/bg-blue-400/10"
    },
    {
        label: "Interactions",
        value: "129.5K",
        sub: "+100% Engagement",
        icon: <Heart size={20} />,
        color: "text-pink-400",
        bg: "/Portfolio/bg-pink-400/10"
    },
    {
        label: "New Followers",
        value: "6.6K",
        sub: "+225.3% Surge",
        icon: <Users size={20} />,
        color: "text-purple-400",
        bg: "/Portfolio/bg-purple-400/10"
    },
    {
        label: "Global Reach",
        value: "150+",
        sub: "Countries & Cities",
        icon: <Globe size={20} />,
        color: "text-emerald-400",
        bg: "/Portfolio/bg-emerald-400/10"
    },
];

const topLocations = [
    { name: "Mumbai", percentage: 3.8 },
    { name: "Bangalore", percentage: 3.4 },
    { name: "Hyderabad", percentage: 2.2 },
    { name: "Delhi", percentage: 2.0 },
    { name: "New York", percentage: 1.3 },
];

const featuredReel = {
    title: "Part 3!! Forgot to lace the collar...",
    date: "16 February",
    duration: "0:22",
    views: "1,168,215",
    likes: "72K",
    comments: "339",
    shares: "9.7K",
    saves: "21K",
    watchTime: "147d 23h"
};

const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="/Portfolio/bg-slate-900/90 backdrop-blur-md border border-white/10 p-3 rounded-xl shadow-2xl">
                <p className="text-[10px] text-white/40 uppercase tracking-widest mb-1">{payload[0].payload.day}</p>
                <p className="text-sm font-bold text-white flex items-center gap-2">
                    <Users size={12} className="text-purple-400" />
                    {payload[0].value.toLocaleString()} Followers
                </p>
            </div>
        );
    }
    return null;
};

export default function ImpactShowcase() {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    });

    const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
    const y = useTransform(scrollYProgress, [0, 0.2], [40, 0]);

    return (
        <section id="impact" ref={containerRef} className="py-24 relative overflow-hidden">
            {/* Background Glows (Subtler for better contrast) */}
            <div className="absolute top-1/4 -right-24 w-96 h-96 /Portfolio/bg-primary/[0.04] rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-1/4 -left-24 w-96 h-96 /Portfolio/bg-purple-500/[0.04] rounded-full blur-[100px] pointer-events-none" />

            <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
                    <motion.div
                        style={{ opacity, y }}
                        className="liquid-glass p-8 md:p-12 rounded-[4rem] relative overflow-hidden mb-8 lg:mb-0 max-w-2xl"
                    >
                        <div className="relative z-10">
                            <div className="flex items-center gap-3 mb-4">
                                <span className="h-px w-8 /Portfolio/bg-primary/50" />
                                <p 
                                    className="text-xs font-bold tracking-[0.4em] uppercase"
                                    style={{ color: BRAND.impact.labelColor }}
                                >
                                    {BRAND.impact.description}
                                </p>
                            </div>
                            <h2 className="font-display text-4xl md:text-6xl font-bold leading-tight mb-6">
                                <span style={{ color: BRAND.impact.titleColor }}>{BRAND.impact.title}</span> <br />
                                <span 
                                    style={{ 
                                        background: BRAND.impact.subtitleGradient,
                                        WebkitBackgroundClip: "text",
                                        WebkitTextFillColor: "transparent"
                                    }}
                                >
                                    {BRAND.impact.subtitle}
                                </span>
                            </h2>
                            <p className="text-white/80 max-w-xl text-lg leading-relaxed antialiased">
                                Transitioning from fashion design to social dominance. Within 30 days,
                                a single creative concept sparked a viral loop, reaching millions
                                and scaling the community by 225%.
                            </p>
                        </div>
                    </motion.div>

                    {/* Proof of Success Card */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="relative group max-w-[280px] sm:max-w-[320px] mx-auto lg:ml-auto lg:mr-12"
                    >
                        <div className="absolute -inset-2 /Portfolio/bg-gradient-to-r from-primary/20 to-purple-500/20 rounded-[2.5rem] blur-xl opacity-0 group-hover:opacity-100 transition duration-1000" />
                        <div className="relative rounded-[2rem] overflow-hidden border border-white/10 /Portfolio/bg-slate-900/40 backdrop-blur-sm shadow-2xl">
                            <img
                                src={`/Portfolio/client-proof.jpg`}
                                alt="Instagram Growth Proof"
                                className="w-full h-auto scale-[1.01] group-hover:scale-110 transition-transform duration-700"
                            />
                            <div className="absolute inset-0 /Portfolio/bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 flex items-end p-8">
                                <div className="flex items-center gap-3 text-white">
                                    <div className="w-2 h-2 rounded-full /Portfolio/bg-emerald-500 animate-pulse" />
                                    <span className="text-[10px] font-bold tracking-[0.3em] uppercase">Verified Client Analytics</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* ── Metric Grid ── */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
                    {impactMetrics.map((metric, i) => (
                        <motion.div
                            key={metric.label}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            viewport={{ once: true }}
                            className="group relative p-8 rounded-3xl glass transition-all duration-500 hover:scale-105"
                        >
                            <div className={`w-12 h-12 ${metric.bg} ${metric.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                                {metric.icon}
                            </div>
                            <h4 className="text-3xl font-bold text-white mb-2">{metric.value}</h4>
                            <p className="text-sm text-white/70 font-medium mb-1">{metric.label}</p>
                            <p className={`text-[10px] font-bold uppercase tracking-wider ${metric.color}`}>{metric.sub}</p>
                        </motion.div>
                    ))}
                </div>

                {/* ── Main Dashboard Visualization ── */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Growth Chart */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="lg:col-span-2 p-8 rounded-[2.5rem] glass relative overflow-hidden group"
                    >
                        <div className="flex items-center justify-between mb-10">
                            <div>
                                <h3 className="text-xl font-bold text-white mb-1">Community Expansion</h3>
                                <p className="text-xs text-white/60">Follower growth tracking (Feb 09 - Mar 10)</p>
                            </div>
                            <div className="px-4 py-1.5 rounded-full /Portfolio/bg-emerald-500/10 border border-emerald-500/20">
                                <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                                    <TrendingUp size={12} /> +225.3%
                                </span>
                            </div>
                        </div>

                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={growthData}>
                                    <defs>
                                        <linearGradient id="colorFollow" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="hsl(220 90% 56%)" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="hsl(220 90% 56%)" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                                    <XAxis
                                        dataKey="day"
                                        stroke="rgba(255,255,255,0.3)"
                                        fontSize={10}
                                        tickLine={false}
                                        axisLine={false}
                                        interval={1}
                                    />
                                    <YAxis
                                        stroke="rgba(255,255,255,0.3)"
                                        fontSize={10}
                                        tickLine={false}
                                        axisLine={false}
                                        domain={['dataMin - 500', 'dataMax + 500']}
                                    />
                                    <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 1 }} />
                                    <Area
                                        type="monotone"
                                        dataKey="followers"
                                        stroke="hsl(220 90% 56%)"
                                        strokeWidth={3}
                                        fillOpacity={1}
                                        fill="url(#colorFollow)"
                                        animationDuration={2000}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </motion.div>

                    {/* Featured Reel Stats */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="p-8 rounded-[2.5rem] glass flex flex-col"
                    >
                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-12 h-16 rounded-xl overflow-hidden grayscale group-hover:grayscale-0 transition-all">
                                <img src={`/Portfolio/videos/reel-thumb-1.jpg`} alt="Reel Thumbnail" className="w-full h-full object-cover" onError={(e) => (e.currentTarget.src = 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=200&h=300&fit=crop')} />
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-white line-clamp-1">{featuredReel.title}</h4>
                                <p className="text-[10px] text-white/50 mt-0.5">{featuredReel.date} • {featuredReel.duration}</p>
                            </div>
                        </div>

                        <div className="space-y-6 flex-1">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3 text-muted-foreground">
                                    <Play size={16} className="text-primary" />
                                    <span className="text-xs font-semibold">Total Views</span>
                                </div>
                                <span className="text-sm font-bold text-foreground">{featuredReel.views}</span>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 rounded-2xl /Portfolio/bg-white/[0.04] border border-white/[0.06]">
                                    <Heart size={14} className="text-pink-500 mb-2" />
                                    <p className="text-lg font-bold text-foreground">{featuredReel.likes}</p>
                                    <p className="text-[9px] text-muted-foreground uppercase tracking-tighter">Likes</p>
                                </div>
                                <div className="p-4 rounded-2xl /Portfolio/bg-white/[0.04] border border-white/[0.06]">
                                    <Bookmark size={14} className="text-amber-500 mb-2" />
                                    <p className="text-lg font-bold text-foreground">{featuredReel.saves}</p>
                                    <p className="text-[9px] text-muted-foreground uppercase tracking-tighter">Saves</p>
                                </div>
                                <div className="p-4 rounded-2xl /Portfolio/bg-white/[0.04] border border-white/[0.06]">
                                    <Send size={14} className="text-blue-500 mb-2" />
                                    <p className="text-lg font-bold text-foreground">{featuredReel.shares}</p>
                                    <p className="text-[9px] text-muted-foreground uppercase tracking-tighter">Shares</p>
                                </div>
                                <div className="p-4 rounded-2xl /Portfolio/bg-white/[0.04] border border-white/[0.06]">
                                    <MessageCircle size={14} className="text-emerald-500 mb-2" />
                                    <p className="text-lg font-bold text-foreground">{featuredReel.comments}</p>
                                    <p className="text-[9px] text-muted-foreground uppercase tracking-tighter">Comments</p>
                                </div>
                            </div>

                            <div className="pt-4 border-t border-white/5">
                                <div className="flex items-center justify-between">
                                    <p className="text-xs text-gray-400 font-medium tracking-tight">Total Watch Time</p>
                                    <p className="text-xs font-bold text-primary">{featuredReel.watchTime}</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                </div>

                {/* ── Audience Geography ── */}
                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="p-8 rounded-[2rem] glass"
                    >
                        <div className="flex items-center gap-3 mb-8">
                            <Globe size={20} className="text-emerald-400" />
                            <h3 className="text-xl font-bold text-foreground">Top Audience Locations</h3>
                        </div>
                        <div className="space-y-6">
                            {topLocations.map((loc, i) => (
                                <div key={loc.name} className="space-y-2">
                                    <div className="flex justify-between text-xs">
                                        <span className="text-muted-foreground font-medium">{loc.name}</span>
                                        <span className="text-emerald-400 font-bold">{loc.percentage}%</span>
                                    </div>
                                    <div className="h-1.5 w-full /Portfolio/bg-white/5 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            whileInView={{ width: `${(loc.percentage / 3.8) * 100}%` }}
                                            transition={{ duration: 1.5, delay: i * 0.1, ease: "easeOut" }}
                                            className="h-full /Portfolio/bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="relative hidden md:block"
                    >
                        <div className="aspect-square rounded-full border border-primary/20 flex items-center justify-center p-12">
                            <div className="aspect-square w-full rounded-full border border-primary/10 flex items-center justify-center p-12">
                                <div className="w-full h-full /Portfolio/bg-primary/5 rounded-full blur-[60px] animate-pulse" />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="text-center">
                                        <p className="text-5xl font-black text-foreground mb-2">1,3M</p>
                                        <p className="text-xs font-bold uppercase tracking-[0.3em] text-primary/60">Impressions</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
