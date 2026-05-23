import { lazy, Suspense } from "react";
import { motion } from "framer-motion";
import { BRAND } from "@/config/brand";

const FloatingGeometry = lazy(() => import("./FloatingGeometry"));

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
  "Orange",
  "R Studio",
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
  // Extract first and last name from siteTitle for the gradient effect
  const [firstName, ...lastNameParts] = BRAND.typography.siteTitle.split(" ");
  const lastName = lastNameParts.join(" ");

  return (
    <section id="about" className="section-padding relative overflow-hidden">
      {/* 3D Background */}
      <Suspense fallback={null}>
        <FloatingGeometry className="opacity-40" />
      </Suspense>

      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-14 text-center liquid-glass p-8 md:p-12 rounded-[4rem] relative overflow-hidden max-w-2xl mx-auto"
        >
          <div className="relative z-10">
            <p className="text-xs font-semibold tracking-[0.3em] uppercase text-white/50 mb-4">
              About Me
            </p>
            <h2 className="font-display text-4xl md:text-5xl font-bold">
              {firstName}{" "}
              <span className="text-gradient">{lastName}</span>
            </h2>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14">
          {/* Bio */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="liquid-glass p-8 md:p-10 rounded-[3rem] relative overflow-hidden"
          >
            <div className="relative z-10">
              <p className="text-white/80 leading-[1.8] mb-5 antialiased">
                I'm a Marketing & Information Systems student based in Sydney, Australia.
                I love the intersection of business strategy and technology—connecting
                with people and building digital solutions that drive real results.
              </p>
              <p className="text-white/80 leading-[1.8] mb-10 antialiased">
                From designing UI in Figma to running data-driven WhatsApp campaigns,
                I bring a unique blend of creative and analytical thinking.
              </p>

              {/* Skills */}
              <div className="flex flex-wrap gap-2">
                {skills.map((skill, i) => (
                  <motion.span
                    key={skill}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.04 }}
                    className="px-4 py-2 text-xs font-medium rounded-full bg-white/5 border border-white/10 text-foreground transition-transform hover:scale-105"
                  >
                    {skill}
                  </motion.span>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Experience */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h3 className="font-display text-lg font-semibold mb-8 text-gradient">Experience</h3>
            <div className="space-y-5">
              {experience.map((exp, i) => (
                <motion.div
                  key={exp.company}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="card-subtle p-6 relative overflow-hidden"
                >
                  <div className="absolute top-0 left-0 w-0.5 h-full bg-gradient-to-b from-primary to-accent" />
                  <div className="pl-5">
                    <p className="text-xs font-bold tracking-wider text-white/50">{exp.period}</p>
                    <h4 className="font-display text-white font-semibold mt-1.5">{exp.role}</h4>
                    <p className="text-sm text-primary/90 font-medium mt-0.5">{exp.company}</p>
                    <p className="text-sm text-white/70 mt-2.5 leading-relaxed antialiased">{exp.desc}</p>
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
