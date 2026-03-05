import { motion } from "framer-motion";
import { Mail, Phone, MapPin } from "lucide-react";

export default function ContactSection() {
  return (
    <section id="contact" className="section-padding">
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <p className="text-sm font-mono tracking-[0.2em] uppercase text-muted-foreground mb-3">
            Get in Touch
          </p>
          <h2 className="text-4xl md:text-6xl font-bold mb-6 glitch-hover cursor-default">
            Let's <span className="neon-text">Connect</span>
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto mb-12">
            Ready to bring your next project to life? Whether it's marketing strategy,
            web design, or video production—I'm here to help.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-16"
        >
          <a
            href="mailto:atharvrc@gmail.com"
            className="glass-card px-8 py-4 flex items-center gap-3 hover:neon-glow transition-all duration-300 group"
          >
            <Mail size={18} className="neon-text" />
            <span className="text-sm font-medium text-foreground">atharvrc@gmail.com</span>
          </a>
          <a
            href="tel:+61447771117"
            className="glass-card px-8 py-4 flex items-center gap-3 hover:neon-glow transition-all duration-300 group"
          >
            <Phone size={18} className="neon-text-violet" />
            <span className="text-sm font-medium text-foreground">+61 447 771 117</span>
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="flex items-center justify-center gap-2 text-muted-foreground text-sm mb-8"
        >
          <MapPin size={14} />
          <span>Randwick, Sydney, Australia</span>
        </motion.div>

        {/* Gradient divider */}
        <div className="gradient-line mb-8" />

        <p className="text-xs text-muted-foreground font-mono">
          © 2025 Atharv Shah — Built with React, Three.js & Tailwind CSS
        </p>
      </div>
    </section>
  );
}
