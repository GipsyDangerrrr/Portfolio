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
    setRotateX(-y * 8);
    setRotateY(x * 8);
  };

  const handleMouseLeave = () => {
    setHovered(false);
    setRotateX(0);
    setRotateY(0);
  };

  const icon = type === "video" ? <Play size={18} /> : type === "web" ? <ExternalLink size={18} /> : <BarChart3 size={18} />;
  const accentClass = type === "video" ? "text-primary" : type === "web" ? "text-accent" : "text-primary";

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ delay: index * 0.08, duration: 0.5 }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
        transformStyle: "preserve-3d",
      }}
      className="card-subtle overflow-hidden cursor-pointer group h-full"
    >
      {/* Image / Preview */}
      <div className="relative h-48 md:h-56 overflow-hidden bg-secondary/50">
        {image ? (
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className={`${accentClass} opacity-20`}>
              {type === "video" ? <Play size={56} /> : type === "web" ? <ExternalLink size={56} /> : <BarChart3 size={56} />}
            </div>
          </div>
        )}
        {/* Overlay */}
        <div
          className={`absolute inset-0 bg-background/85 backdrop-blur-md flex items-center justify-center transition-opacity duration-300 ${hovered ? "opacity-100" : "opacity-0"
            }`}
        >
          <div className={`${accentClass} flex items-center gap-2.5 text-sm font-medium`}>
            {icon}
            <span>{type === "video" ? "Play Reel" : type === "web" ? "View Project" : "View Metrics"}</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <span className={`text-xs font-medium tracking-[0.15em] uppercase ${accentClass}`}>
          {category}
        </span>
        <h3 className="font-display text-lg font-semibold mt-2 text-foreground">{title}</h3>
        <p className="text-sm text-muted-foreground mt-2 leading-relaxed line-clamp-2">{description}</p>

        {metrics && (
          <div className="mt-4 grid grid-cols-2 gap-3">
            {metrics.map((m) => (
              <div key={m.label} className="text-center bg-secondary/40 rounded-lg p-3">
                <p className={`text-lg font-bold font-display ${accentClass}`}>{m.value}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{m.label}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
