import { motion } from "framer-motion";

const skills = [
  "Wondershare Filmora",
  "Adobe Lightroom",
  "Canva",
  "Wix",
  "Webflow",
  "Figma",
  "CapCut",
  "Aisensy",
  "WhatsApp Marketing",
  "Data Visualization",
];

const experience = [
  {
    role: "Sales Consultant",
    company: "Telstra",
    period: "Mar 2025 – Jul 2025",
    desc: "Delivered tailored product recommendations, driving sales and customer satisfaction.",
  },
  {
    role: "WhatsApp Marketing Intern",
    company: "Expodite",
    period: "2024 – Present",
    desc: "Developed and executed bulk outreach campaigns using Aisensy, generating 2,400+ leads.",
  },
  {
    role: "UI Designer Intern",
    company: "HRHNext Services",
    period: "2023 – Present",
    desc: "Designed login interfaces, data entry views, and geo-heatmap visualizations in Figma.",
  },
];

export default function AboutSection() {
  return (
    <section id="about" className="section-padding">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <p className="text-sm font-mono tracking-[0.2em] uppercase text-muted-foreground mb-3">
            About Me
          </p>
          <h2 className="text-4xl md:text-5xl font-bold">
            Atharv <span className="neon-text">Shah</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Bio */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <p className="text-muted-foreground leading-relaxed mb-6">
              I'm a Marketing & Information Systems student based in Sydney, Australia.
              I love the intersection of business strategy and technology—connecting
              with people and building digital solutions that drive real results.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-8">
              From designing UI in Figma to running data-driven WhatsApp campaigns,
              I bring a unique blend of creative and analytical thinking. This portfolio
              was built using a modern tech stack including React, Three.js, Tailwind CSS,
              and Framer Motion.
            </p>

            {/* Skills */}
            <div className="flex flex-wrap gap-2">
              {skills.map((skill, i) => (
                <motion.span
                  key={skill}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="glass-card px-4 py-2 text-xs font-mono text-muted-foreground"
                >
                  {skill}
                </motion.span>
              ))}
            </div>
          </motion.div>

          {/* Experience */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h3 className="text-lg font-semibold mb-6 neon-text-violet">Experience</h3>
            <div className="space-y-6">
              {experience.map((exp, i) => (
                <motion.div
                  key={exp.company}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="glass-card p-5 relative overflow-hidden"
                >
                  <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-primary to-accent" />
                  <div className="pl-4">
                    <p className="text-xs font-mono text-muted-foreground">{exp.period}</p>
                    <h4 className="text-foreground font-semibold mt-1">{exp.role}</h4>
                    <p className="text-sm text-primary">{exp.company}</p>
                    <p className="text-sm text-muted-foreground mt-2">{exp.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
