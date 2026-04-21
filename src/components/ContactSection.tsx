import { motion } from "framer-motion";
import { Mail, Linkedin, MapPin } from "lucide-react";

export default function ContactSection() {
  return (
    <section id="contact" className="section-padding">
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="liquid-glass p-10 md:p-16 rounded-[4rem] relative overflow-hidden mb-16 max-w-3xl mx-auto"
        >
          <div className="relative z-10">
            <p className="text-xs font-medium tracking-[0.3em] uppercase text-muted-foreground mb-4">
              Get in Touch
            </p>
            <h2 className="font-display text-4xl md:text-6xl font-bold mb-6">
              Let's{" "}
              <span className="text-gradient">Connect</span>
            </h2>
            <p className="text-muted-foreground max-w-lg mx-auto leading-relaxed">
              Ready to bring your next project to life? Whether it's marketing strategy,
              web design, or video production—I'm here to help.
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
        >
          <a
            href="mailto:atharvrc@gmail.com"
            className="card-subtle px-8 py-4 flex items-center gap-3 hover:border-primary/30 transition-all duration-300 group cursor-pointer"
          >
            <Mail size={16} className="text-primary" />
            <span className="text-sm font-medium text-foreground">atharvrc@gmail.com</span>
          </a>
          <a
            href="https://www.linkedin.com/in/atharv-shah-bb925a2a6?utm_source=share_via&utm_content=profile&utm_medium=member_ios"
            target="_blank"
            rel="noopener noreferrer"
            className="card-subtle px-8 py-4 flex items-center gap-3 hover:border-accent/30 transition-all duration-300 group cursor-pointer"
          >
            <Linkedin size={16} className="text-accent" />
            <span className="text-sm font-medium text-foreground">LinkedIn</span>
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="flex items-center justify-center gap-2 text-muted-foreground text-sm mb-10"
        >
          <MapPin size={14} />
          <span>Randwick, Sydney, Australia</span>
        </motion.div>

        {/* Divider */}
        <div className="section-divider mb-8" />

        <p className="text-xs text-muted-foreground/60 font-medium tracking-wider">
          © 2026 Atharv Shah — Built with React, Three.js & Tailwind CSS
        </p>
      </div>
    </section>
  );
}
