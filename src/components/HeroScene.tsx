import { lazy, Suspense, useState, useEffect } from "react";

const Spline = lazy(() => import("@splinetool/react-spline"));

const SCENE_URL = "https://prod.spline.design/7ufJlw2VhKzYz8ou/scene.splinecode";

export default function HeroScene() {
  const [loaded, setLoaded] = useState(false);
  const [shouldLoad, setShouldLoad] = useState(true);

  useEffect(() => {
    // Skip Spline on mobile / low-end devices
    const isMobile = window.innerWidth < 768;
    const isLowEnd = navigator.hardwareConcurrency <= 2;
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl2") || canvas.getContext("webgl");
    const noWebGL = !gl;

    if (isMobile || isLowEnd || noWebGL) {
      setShouldLoad(false);
    }

    // Reduced motion preference
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) {
      setShouldLoad(false);
    }
  }, []);

  if (!shouldLoad) {
    return (
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-background via-secondary/50 to-background" />
    );
  }

  return (
    <div className="absolute inset-0 z-0" style={{ pointerEvents: "none" }}>
      {/* Fallback — visible until Spline loads */}
      <div
        className="absolute inset-0 bg-background transition-opacity duration-700"
        style={{ opacity: loaded ? 0 : 1, pointerEvents: "none" }}
      />

      <Suspense fallback={null}>
        <Spline
          scene={SCENE_URL}
          onLoad={() => setLoaded(true)}
          style={{
            width: "100%",
            height: "100%",
            pointerEvents: "none",
          }}
        />
      </Suspense>
    </div>
  );
}
