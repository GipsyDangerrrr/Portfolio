import { useState } from "react";
import { motion } from "framer-motion";
import PortfolioCard from "./PortfolioCard";

const categories = ["All", "Video Editing", "Web Design", "Marketing"];

const projects = [
  {
    title: "Brand Identity Reel",
    category: "Video Editing",
    type: "video" as const,
    description: "Cinematic brand story video crafted with Filmora & CapCut, featuring dynamic transitions and color grading.",
  },
  {
    title: "Product Launch Promo",
    category: "Video Editing",
    type: "video" as const,
    description: "Short-form promotional content optimized for social media engagement and conversion.",
  },
  {
    title: "E-Commerce Storefront",
    category: "Web Design",
    type: "web" as const,
    description: "Modern responsive storefront designed in Figma and built with Webflow, featuring seamless UX flows.",
  },
  {
    title: "SaaS Landing Page",
    category: "Web Design",
    type: "web" as const,
    description: "High-converting landing page with A/B tested hero sections and micro-interactions built in Wix.",
  },
  {
    title: "WhatsApp Growth Campaign",
    category: "Marketing",
    type: "marketing" as const,
    description: "Bulk WhatsApp outreach strategy using Aisensy, targeting export industry leads with automated funnels.",
    metrics: [
      { label: "Leads Generated", value: "2.4K+" },
      { label: "Response Rate", value: "34%" },
    ],
  },
  {
    title: "Social Media Strategy",
    category: "Marketing",
    type: "marketing" as const,
    description: "End-to-end social campaign with content calendar, audience segmentation, and performance analytics.",
    metrics: [
      { label: "Engagement", value: "+180%" },
      { label: "Reach", value: "50K+" },
    ],
  },
];

export default function PortfolioSection() {
  const [active, setActive] = useState("All");

  const filtered = active === "All" ? projects : projects.filter((p) => p.category === active);

  return (
    <section id="portfolio" className="section-padding">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <p className="text-sm font-mono tracking-[0.2em] uppercase text-muted-foreground mb-3">
            Selected Work
          </p>
          <h2 className="text-4xl md:text-5xl font-bold">
            <span className="neon-text">Portfolio</span> Showcase
          </h2>
        </motion.div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActive(cat)}
              className={`px-5 py-2 text-sm font-medium rounded-full transition-all duration-300 ${
                active === cat
                  ? "glass-card neon-text neon-glow"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((project, i) => (
            <PortfolioCard key={project.title} {...project} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
