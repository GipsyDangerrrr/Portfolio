/**
 * BRAND CONFIGURATION
 * 
 * This is the central file for all visual identity elements. 
 * You can edit global colors or override styles for specific elements below.
 */

export const BRAND = {
  // ─── GLOBAL PALETTE (HSL Format) ───
  colors: {
    primary: "262 83% 58%",      // Main brand color (Purple)
    accent: "220 90% 56%",       // Secondary/Action color (Neon Blue)
    background: "260 87% 3%",    // Global background
    foreground: "40 6% 95%",     // Default text color
    muted: "240 4% 16%",         // Muted/Subtle elements
    border: "240 4% 20%",        // Border and divider lines
  },

  // ─── GLOBAL TYPOGRAPHY ───
  typography: {
    fontSans: "'Montserrat', sans-serif",
    fontDisplay: "'Montserrat', sans-serif",
    fontGeist: "'Geist Sans', sans-serif",
    siteTitle: "Atharv Shah",
  },

  // ─── ELEMENT-WISE CONTROLS ───

  // HERO SECTION (Monitor Screen)
  hero: {
    headline: "Marketer, Content Creator \n& Web Dev",
    subtext: "I help grow brand presence.",

    // Headline Styles
    headlineGradient: "linear-gradient(223deg, #E8E8E9 0%, #3A7BBF 104.15%)",
    headlineFont: "'General Sans', sans-serif",
    headlineSize: "min(8vw, 60px)",

    // Subtext Styles
    subtextColor: "rgba(255, 255, 255, 0.9)",
    subtextFont: "'Geist Sans', sans-serif",
    subtextSize: "min(2.5vw, 16px)",
  },

  // PORTFOLIO SECTION
  portfolio: {
    title: "Portfolio",
    subtitle: "Showcase",
    description: "Selected Work",

    // Style Overrides
    titleColor: "white",
    subtitleGradient: "linear-gradient(to right, #6366f1, #a855f7)",
    descriptionColor: "rgba(255, 255, 255, 0.5)",
    fontDisplay: "'Montserrat', sans-serif",
  },

  // IMPACT SHOWCASE (Viral Growth)
  impact: {
    title: "Viral Growth",
    subtitle: "By Design",
    description: "Global Impact",

    // Style Overrides
    titleColor: "white",
    subtitleGradient: "linear-gradient(to right, #6366f1, #a855f7)",
    labelColor: "rgba(255, 255, 255, 0.6)",
    metricColor: "white",
  }
};
