import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Play, ExternalLink, BarChart3 } from "lucide-react";

interface PortfolioCardProps {
  title: string;
  category: string;
  description: string;
  type: "video" | "web" | "marketing";
  image?: string;
  metrics?: { label: string; value: string }[];
  videoUrl?: string;
  index: number;
}

export default function PortfolioCard({
  title,
  category,
  description,
  type,
  image,
  metrics,
  index,
}: PortfolioCardProps) {
  const [hovered, setHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setRotateX(-y * 15);
    setRotateY(x * 15);
  };

  const handleMouseLeave = () => {
    setHovered(false);
    setRotateX(0);
    setRotateY(0);
  };

  const icon = type === "video" ? <Play size={20} /> : type === "web" ? <ExternalLink size={20} /> : <BarChart3 size={20} />;
  const accentClass = type === "video" ? "neon-text" : type === "web" ? "neon-text-violet" : "neon-text";

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ delay: index * 0.1, duration: 0.6 }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
        transformStyle: "preserve-3d",
      }}
      className="glass-card overflow-hidden cursor-pointer group"
    >
      {/* Image / Preview */}
      <div className="relative h-48 md:h-56 overflow-hidden bg-secondary">
        {image ? (
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className={`${accentClass} opacity-30`}>
              {type === "video" ? <Play size={64} /> : type === "web" ? <ExternalLink size={64} /> : <BarChart3 size={64} />}
            </div>
          </div>
        )}
        {/* Overlay */}
        <div
          className={`absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center transition-opacity duration-300 ${
            hovered ? "opacity-100" : "opacity-0"
          }`}
        >
          <div className={`${accentClass} flex items-center gap-2 text-sm font-medium`}>
            {icon}
            <span>{type === "video" ? "Play Reel" : type === "web" ? "View Project" : "View Metrics"}</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <span className={`text-xs font-mono tracking-wider uppercase ${accentClass}`}>
          {category}
        </span>
        <h3 className="text-lg font-semibold mt-2 text-foreground">{title}</h3>
        <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{description}</p>

        {metrics && (
          <div className="mt-4 grid grid-cols-2 gap-3">
            {metrics.map((m) => (
              <div key={m.label} className="text-center glass-card p-2">
                <p className={`text-lg font-bold ${accentClass}`}>{m.value}</p>
                <p className="text-xs text-muted-foreground">{m.label}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
