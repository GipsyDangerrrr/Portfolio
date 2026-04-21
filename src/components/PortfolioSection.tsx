import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PortfolioCard from "./PortfolioCard";
import { BRAND } from "@/config/brand";

const categories = ["All", "Video Editing", "Web Design", "Marketing"];

const projects = [
  {
    title: "Brand Identity Reel",
    category: "Video Editing",
    type: "video" as const,
    description: "Cinematic brand story video crafted with Filmora & CapCut, featuring dynamic transitions and color grading.",
    span: "col-span-1 md:col-span-2 md:row-span-1",
  },
  {
    title: "Product Launch Promo",
    category: "Video Editing",
    type: "video" as const,
    description: "Short-form promotional content optimized for social media engagement and conversion.",
    span: "col-span-1",
  },
  {
    title: "E-Commerce Storefront",
    category: "Web Design",
    type: "web" as const,
    description: "Modern responsive storefront designed in Figma and built with Webflow, featuring seamless UX flows.",
    span: "col-span-1",
  },
  {
    title: "SaaS Landing Page",
    category: "Web Design",
    type: "web" as const,
    description: "High-converting landing page with A/B tested hero sections and micro-interactions built in Wix.",
    span: "col-span-1 md:col-span-2 md:row-span-1",
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
    span: "col-span-1",
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
    span: "col-span-1",
  },
];

export default function PortfolioSection() {
  const [active, setActive] = useState("All");

  const filtered = active === "All" ? projects : projects.filter((p) => p.category === active);

  return (
    <section id="portfolio" className="section-padding">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-14"
        >
          <p 
            className="text-xs font-medium tracking-[0.3em] uppercase mb-4"
            style={{ color: BRAND.portfolio.descriptionColor }}
          >
            {BRAND.portfolio.description}
          </p>
          <h2 
            className="text-4xl md:text-5xl font-bold leading-tight"
            style={{ fontFamily: BRAND.portfolio.fontDisplay }}
          >
            <span style={{ color: BRAND.portfolio.titleColor }}>{BRAND.portfolio.title}</span>{" "}
            <span 
              style={{ 
                background: BRAND.portfolio.subtitleGradient,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                display: "inline-block"
              }}
            >
              {BRAND.portfolio.subtitle}
            </span>
          </h2>
        </motion.div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActive(cat)}
              className={`px-5 py-2 text-sm font-medium rounded-full transition-all duration-300 cursor-pointer ${active === cat
                  ? "bg-primary text-primary-foreground shadow-md shadow-primary/15"
                  : "text-muted-foreground hover:text-foreground border border-white/[0.06] hover:border-white/[0.12]"
                }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Bento Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-5 auto-rows-auto"
          >
            {filtered.map((project, i) => (
              <div key={project.title} className={project.span}>
                <PortfolioCard {...project} index={i} />
              </div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
